"""
Pydantic schemas for chat
"""
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

class ChatRequest(BaseModel):
    conversation_id: str
    message: str = Field(..., min_length=1, max_length=10000)
    model: str = Field(default="HoYo-GPT-4")
    stream: bool = Field(default=False)

class ChatResponse(BaseModel):
    user_message: Dict[str, Any]
    ai_message: Dict[str, Any]
    conversation_id: str
    model: str
    tokens_used: int = 0
    cost: float = 0.0
    timestamp: Optional[str] = None
