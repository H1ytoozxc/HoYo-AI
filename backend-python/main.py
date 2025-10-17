"""
HoYo AI Backend - FastAPI
Advanced AI Assistant with Multiple Models
"""
from fastapi import FastAPI, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from contextlib import asynccontextmanager
from typing import Optional, List, Dict, Any
import asyncio
import json
from datetime import datetime
import uuid

# Local imports
from app.core.config import settings
from app.core.database import init_db, get_db
from app.core.security import get_current_user
from app.api import auth, conversations, chat, models
from app.models.database import User
from app.services.ai_service import AIService
from app.services.websocket_manager import ConnectionManager

# Initialize services
manager = ConnectionManager()
ai_service = AIService()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle management for the application"""
    print("🚀 Starting HoYo AI Backend...")
    
    # Initialize database
    await init_db()
    print("✅ Database initialized")
    
    # Initialize AI models
    await ai_service.initialize()
    print("✅ AI models loaded")
    
    # Startup complete
    print(f"""
╔══════════════════════════════════════════════════╗
║                 HoYo AI Backend                   ║
║                FastAPI + SQLAlchemy               ║
╠══════════════════════════════════════════════════╣
║ 🚀 Server: http://{settings.HOST}:{settings.PORT}           ║
║ 📊 Database: SQLite (Async)                      ║
║ 🤖 AI Models: {len(ai_service.models)} loaded                    ║
║ 🔐 Auth: JWT Bearer                              ║
║ 🌐 CORS: Enabled                                 ║
║ 📡 WebSocket: Active                             ║
╚══════════════════════════════════════════════════╝
    """)
    
    yield
    
    # Cleanup
    print("👋 Shutting down HoYo AI Backend...")
    await manager.disconnect_all()
    await ai_service.cleanup()

# Create FastAPI app
app = FastAPI(
    title="HoYo AI Backend",
    description="Advanced AI Assistant API with Multiple Models",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== ROOT ENDPOINTS ====================

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "service": "HoYo AI Backend",
        "version": "2.0.0",
        "status": "operational",
        "framework": "FastAPI",
        "docs": "/api/docs",
        "health": "/health",
        "models_available": len(ai_service.models),
        "features": [
            "Multiple AI Models",
            "Real-time WebSocket",
            "Voice Transcription",
            "Image Analysis",
            "Code Generation",
            "Screen Capture Analysis",
            "Async Database",
            "JWT Authentication",
            "Rate Limiting",
            "Prometheus Metrics"
        ]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "database": "connected",
        "ai_models": "loaded",
        "websocket": "active",
        "memory_usage": ai_service.get_memory_usage(),
        "active_connections": manager.get_connection_count()
    }

# ==================== API ROUTES ====================

# Authentication routes
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])

# Model routes
app.include_router(models.router, prefix="/api/models", tags=["AI Models"])

# Conversation routes
app.include_router(conversations.router, prefix="/api/conversations", tags=["Conversations"])

# Chat routes
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])

# Inject AI service into chat module
from app.api.chat import set_ai_service
set_ai_service(ai_service)

# ==================== WEBSOCKET ====================

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(
    websocket: WebSocket, 
    client_id: str,
    token: Optional[str] = None
):
    """WebSocket endpoint for real-time communication"""
    try:
        # Authenticate if token provided
        user = None
        if token:
            try:
                from app.core.security import decode_token
                payload = decode_token(token)
                user_id = payload.get("sub")
                if user_id:
                    from app.crud import user as user_crud
                    db = get_db()
                    user = await user_crud.get_user(db, user_id=user_id)
            except:
                pass
        
        # Accept connection
        await manager.connect(websocket, client_id, user)
        await websocket.send_json({
            "type": "connection",
            "status": "connected",
            "client_id": client_id,
            "user": user.username if user else "anonymous"
        })
        
        # Handle messages
        while True:
            data = await websocket.receive_json()
            
            # Process different message types
            if data["type"] == "chat":
                response = await ai_service.process_chat(
                    message=data["message"],
                    model=data.get("model", "HoYo-GPT-4"),
                    conversation_id=data.get("conversation_id"),
                    user=user
                )
                await websocket.send_json({
                    "type": "chat_response",
                    "data": response
                })
                
            elif data["type"] == "typing":
                await manager.broadcast_to_conversation(
                    data["conversation_id"],
                    {
                        "type": "user_typing",
                        "user": user.username if user else "anonymous",
                        "conversation_id": data["conversation_id"]
                    },
                    exclude=client_id
                )
                
            elif data["type"] == "join_conversation":
                await manager.join_conversation(
                    client_id,
                    data["conversation_id"]
                )
                
            elif data["type"] == "leave_conversation":
                await manager.leave_conversation(
                    client_id,
                    data["conversation_id"]
                )
                
            elif data["type"] == "stream_chat":
                # Stream AI response
                async for chunk in ai_service.stream_chat(
                    message=data["message"],
                    model=data.get("model", "HoYo-GPT-4"),
                    conversation_id=data.get("conversation_id"),
                    user=user
                ):
                    await websocket.send_json({
                        "type": "stream_chunk",
                        "data": chunk
                    })
                    
    except WebSocketDisconnect:
        manager.disconnect(client_id)
        if user:
            await manager.broadcast({
                "type": "user_disconnected",
                "user": user.username
            })
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.close()
        manager.disconnect(client_id)

# ==================== METRICS ====================

@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    from app.core.metrics import generate_metrics
    metrics_data = generate_metrics()
    return StreamingResponse(
        iter([metrics_data]),
        media_type="text/plain"
    )

# ==================== ERROR HANDLERS ====================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler"""
    return {
        "error": exc.detail,
        "status_code": exc.status_code,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    """Internal server error handler"""
    return {
        "error": "Internal server error",
        "message": "An unexpected error occurred. Please try again later.",
        "status_code": 500,
        "timestamp": datetime.utcnow().isoformat()
    }

# ==================== STARTUP ====================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
