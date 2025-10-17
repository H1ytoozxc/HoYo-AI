"""
Chat API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Dict, Any
import uuid
from datetime import datetime
import json

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.database import User, Conversation, Message, MessageRole
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai_service import AIService

router = APIRouter()

# Initialize AI service (will be injected in main.py)
ai_service = None

def set_ai_service(service: AIService):
    global ai_service
    ai_service = service

@router.post("/", response_model=ChatResponse)
async def send_message(
    chat_request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Send a message and get AI response"""
    if not ai_service:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI service not available"
        )
    
    # Verify conversation belongs to user
    result = await db.execute(
        select(Conversation).where(
            Conversation.id == chat_request.conversation_id,
            Conversation.user_id == current_user.id
        )
    )
    conversation = result.scalar_one_or_none()
    
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    # Save user message
    user_message = Message(
        id=str(uuid.uuid4()),
        conversation_id=chat_request.conversation_id,
        role=MessageRole.USER,
        content=chat_request.message,
        created_at=datetime.utcnow()
    )
    db.add(user_message)
    
    # Generate AI response
    try:
        ai_response = await ai_service.process_chat(
            message=chat_request.message,
            model=chat_request.model,
            conversation_id=chat_request.conversation_id,
            user=current_user
        )
        
        if "error" in ai_response:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ai_response["error"]
            )
        
        # Save AI message
        ai_message = Message(
            id=str(uuid.uuid4()),
            conversation_id=chat_request.conversation_id,
            role=MessageRole.ASSISTANT,
            content=ai_response["response"],
            model=chat_request.model,
            tokens_used=ai_response.get("tokens_used", 0),
            cost=ai_response.get("cost", 0.0),
            created_at=datetime.utcnow()
        )
        db.add(ai_message)
        
        # Update conversation
        conversation.updated_at = datetime.utcnow()
        
        await db.commit()
        await db.refresh(user_message)
        await db.refresh(ai_message)
        
        return ChatResponse(
            user_message=user_message.to_dict(),
            ai_message=ai_message.to_dict(),
            conversation_id=chat_request.conversation_id,
            model=chat_request.model,
            tokens_used=ai_response.get("tokens_used", 0),
            cost=ai_response.get("cost", 0.0)
        )
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process message: {str(e)}"
        )

@router.post("/stream")
async def stream_message(
    chat_request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Stream AI response"""
    if not ai_service:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI service not available"
        )
    
    # Verify conversation
    result = await db.execute(
        select(Conversation).where(
            Conversation.id == chat_request.conversation_id,
            Conversation.user_id == current_user.id
        )
    )
    conversation = result.scalar_one_or_none()
    
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    async def generate_stream():
        # Save user message first
        user_message = Message(
            id=str(uuid.uuid4()),
            conversation_id=chat_request.conversation_id,
            role=MessageRole.USER,
            content=chat_request.message,
            created_at=datetime.utcnow()
        )
        db.add(user_message)
        await db.commit()
        
        # Send user message confirmation
        yield f"data: {json.dumps({'type': 'user_message', 'data': user_message.to_dict()})}\n\n"
        
        # Stream AI response
        full_response = ""
        async for chunk in ai_service.stream_chat(
            message=chat_request.message,
            model=chat_request.model,
            conversation_id=chat_request.conversation_id,
            user=current_user
        ):
            if "error" in chunk:
                yield f"data: {json.dumps({'type': 'error', 'data': chunk})}\n\n"
                return
            
            if "chunk" in chunk:
                full_response += chunk["chunk"]
                yield f"data: {json.dumps({'type': 'chunk', 'data': chunk})}\n\n"
            
            if chunk.get("done"):
                # Save complete AI message
                ai_message = Message(
                    id=str(uuid.uuid4()),
                    conversation_id=chat_request.conversation_id,
                    role=MessageRole.ASSISTANT,
                    content=full_response,
                    model=chat_request.model,
                    tokens_used=chunk.get("tokens_used", 0),
                    cost=chunk.get("cost", 0.0),
                    created_at=datetime.utcnow()
                )
                db.add(ai_message)
                
                # Update conversation
                conversation.updated_at = datetime.utcnow()
                await db.commit()
                
                yield f"data: {json.dumps({'type': 'complete', 'data': ai_message.to_dict()})}\n\n"
        
        yield "data: [DONE]\n\n"
    
    return StreamingResponse(
        generate_stream(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "text/event-stream"
        }
    )
