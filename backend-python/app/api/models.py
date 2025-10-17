"""
AI Models API endpoints
"""
from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from app.core.config import settings
from app.core.security import get_current_user
from app.models.database import User

router = APIRouter()

@router.get("/")
async def get_available_models(
    current_user: User = Depends(get_current_user)
):
    """Get all available AI models"""
    models = []
    
    for model_name, config in settings.HOYO_MODELS.items():
        # Check if user has access to this model
        has_access = check_model_access(current_user, model_name)
        
        model_info = {
            "name": config["name"],
            "description": config["description"],
            "max_tokens": config["max_tokens"],
            "capabilities": config["capabilities"],
            "provider": config["provider"],
            "has_access": has_access,
            "required_plan": get_required_plan(model_name) if not has_access else None
        }
        models.append(model_info)
    
    return models

def check_model_access(user: User, model_name: str) -> bool:
    """Check if user has access to model"""
    plan_access = {
        "free": ["HoYo-Fast"],
        "pro": ["HoYo-Fast", "HoYo-GPT-4", "HoYo-Claude", "HoYo-Code", "HoYo-Gemini"],
        "enterprise": list(settings.HOYO_MODELS.keys())
    }
    
    user_plan = user.plan.value if user.plan else "free"
    return model_name in plan_access.get(user_plan, [])

def get_required_plan(model_name: str) -> str:
    """Get required plan for model"""
    if model_name in ["HoYo-Fast"]:
        return "free"
    elif model_name in ["HoYo-GPT-4", "HoYo-Claude", "HoYo-Code", "HoYo-Gemini"]:
        return "pro"
    else:
        return "enterprise"
