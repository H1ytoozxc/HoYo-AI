"""
Configuration settings for HoYo AI Backend
"""
from pydantic_settings import BaseSettings
from typing import List
import os
from pathlib import Path

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "HoYo AI Backend"
    VERSION: str = "2.0.0"
    DEBUG: bool = True
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 4
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./database/hoyo_ai.db"
    DATABASE_ECHO: bool = False
    
    # Security
    SECRET_KEY: str = "hoyo-ai-secret-key-2024-fastapi-secure"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]
    
    # AI Models Configuration
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    
    # HoYo Models Configuration
    HOYO_MODELS: dict = {
        "HoYo-GPT-4": {
            "name": "HoYo-GPT-4",
            "description": "Самая мощная модель HoYo для сложных задач",
            "max_tokens": 8000,
            "temperature": 0.7,
            "top_p": 0.9,
            "provider": "openai",
            "base_model": "gpt-4-turbo-preview",
            "capabilities": ["code", "analysis", "creative", "math", "reasoning", "vision"],
            "cost_per_token": 0.00003,
            "rate_limit": 100,
            "context_window": 128000
        },
        "HoYo-Claude": {
            "name": "HoYo-Claude",
            "description": "Продвинутая модель для аналитики и креатива",
            "max_tokens": 6000,
            "temperature": 0.8,
            "top_p": 0.95,
            "provider": "anthropic",
            "base_model": "claude-3-opus-20240229",
            "capabilities": ["analysis", "writing", "creative", "research", "code"],
            "cost_per_token": 0.00002,
            "rate_limit": 80,
            "context_window": 200000
        },
        "HoYo-Vision": {
            "name": "HoYo-Vision",
            "description": "Модель для анализа изображений и экранов",
            "max_tokens": 4000,
            "temperature": 0.5,
            "top_p": 0.8,
            "provider": "openai",
            "base_model": "gpt-4-vision-preview",
            "capabilities": ["vision", "ocr", "ui-analysis", "image-description"],
            "cost_per_token": 0.00004,
            "rate_limit": 50,
            "context_window": 128000
        },
        "HoYo-Gemini": {
            "name": "HoYo-Gemini",
            "description": "Универсальная модель Google",
            "max_tokens": 8000,
            "temperature": 0.7,
            "top_p": 0.85,
            "provider": "google",
            "base_model": "gemini-pro",
            "capabilities": ["code", "analysis", "creative", "chat"],
            "cost_per_token": 0.00001,
            "rate_limit": 120,
            "context_window": 32000
        },
        "HoYo-Code": {
            "name": "HoYo-Code",
            "description": "Специализированная модель для программирования",
            "max_tokens": 8000,
            "temperature": 0.3,
            "top_p": 0.7,
            "provider": "openai",
            "base_model": "gpt-4-turbo-preview",
            "capabilities": ["code", "debugging", "refactoring", "documentation", "testing"],
            "cost_per_token": 0.00002,
            "rate_limit": 100,
            "context_window": 128000
        },
        "HoYo-Fast": {
            "name": "HoYo-Fast",
            "description": "Быстрая модель для простых задач",
            "max_tokens": 2000,
            "temperature": 0.6,
            "top_p": 0.85,
            "provider": "openai",
            "base_model": "gpt-3.5-turbo-1106",
            "capabilities": ["chat", "simple-tasks", "quick-answers"],
            "cost_per_token": 0.000001,
            "rate_limit": 200,
            "context_window": 16000
        }
    }
    
    # Redis Configuration
    REDIS_URL: str = "redis://localhost:6379/0"
    CACHE_TTL: int = 3600  # 1 hour
    
    # File Upload
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    UPLOAD_PATH: Path = Path("./uploads")
    ALLOWED_EXTENSIONS: List[str] = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf", ".txt", ".md", ".py", ".js", ".ts", ".jsx", ".tsx"]
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 60  # seconds
    
    # WebSocket
    WS_MESSAGE_QUEUE_SIZE: int = 100
    WS_HEARTBEAT_INTERVAL: int = 30
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/hoyo_ai.log"
    
    # Metrics
    ENABLE_METRICS: bool = True
    METRICS_PORT: int = 9090
    
    # Sentry (Error Tracking)
    SENTRY_DSN: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields from .env

settings = Settings()
