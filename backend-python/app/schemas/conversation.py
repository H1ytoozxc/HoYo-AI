"""
Pydantic schemas for conversations
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ConversationCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    model: str = Field(default="HoYo-GPT-4")

class ConversationUpdate(BaseModel):
    title: Optional[str] = None
    is_archived: Optional[bool] = None
    is_pinned: Optional[bool] = None

class ConversationResponse(BaseModel):
    id: str
    title: str
    model: str
    is_archived: Optional[bool] = False
    is_pinned: Optional[bool] = False
    created_at: datetime
    updated_at: datetime
    message_count: int = 0
    
    class Config:
        from_attributes = True

class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    role: str
    content: str
    model: Optional[str] = None
    tokens_used: int = 0
    cost: float = 0.0
    created_at: datetime
    
    class Config:
        from_attributes = True
