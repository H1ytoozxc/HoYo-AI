"""
Database configuration and session management
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from typing import AsyncGenerator
import os
from pathlib import Path

from app.core.config import settings

# Create database directory if not exists
db_path = Path("./database")
db_path.mkdir(exist_ok=True)

# Create async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DATABASE_ECHO,
    future=True
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

# Base class for models
Base = declarative_base()

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency to get database session
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def init_db():
    """
    Initialize database and create all tables
    """
    async with engine.begin() as conn:
        # Import all models to register them with Base
        from app.models import database
        
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)
    
    # Create initial data
    await create_initial_data()

async def create_initial_data():
    """
    Create initial test users and data
    """
    from app.models.database import User, Conversation, Message
    from app.core.security import get_password_hash
    import uuid
    from datetime import datetime
    
    async with AsyncSessionLocal() as db:
        # Check if users already exist
        from sqlalchemy import select
        result = await db.execute(select(User).limit(1))
        if result.scalar():
            return
        
        # Create test users
        users = [
            User(
                id=str(uuid.uuid4()),
                username="hvano",
                email="hvano@hoyo.tech",
                hashed_password=get_password_hash("hoyo123"),
                plan="pro",
                credits=500,
                is_active=True,
                created_at=datetime.utcnow()
            ),
            User(
                id=str(uuid.uuid4()),
                username="demo",
                email="demo@hoyo.tech",
                hashed_password=get_password_hash("hoyo123"),
                plan="free",
                credits=100,
                is_active=True,
                created_at=datetime.utcnow()
            ),
            User(
                id=str(uuid.uuid4()),
                username="admin",
                email="admin@hoyo.tech",
                hashed_password=get_password_hash("hoyo123"),
                plan="enterprise",
                credits=9999,
                is_active=True,
                is_admin=True,
                created_at=datetime.utcnow()
            )
        ]
        
        db.add_all(users)
        
        # Create sample conversations for hvano
        hvano = users[0]
        conversations = [
            Conversation(
                id=str(uuid.uuid4()),
                user_id=hvano.id,
                title="Разработка AI Assistant",
                model="HoYo-GPT-4",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ),
            Conversation(
                id=str(uuid.uuid4()),
                user_id=hvano.id,
                title="Анализ кода FastAPI",
                model="HoYo-Code",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
        ]
        
        db.add_all(conversations)
        
        # Add welcome messages
        for conv in conversations:
            messages = [
                Message(
                    id=str(uuid.uuid4()),
                    conversation_id=conv.id,
                    role="user",
                    content=f"Привет! Помоги мне с проектом {conv.title}",
                    created_at=datetime.utcnow()
                ),
                Message(
                    id=str(uuid.uuid4()),
                    conversation_id=conv.id,
                    role="assistant",
                    content=f"Здравствуйте! Я {conv.model} от HoYo Technologies. С радостью помогу вам с проектом '{conv.title}'. Давайте начнем с анализа требований.",
                    model=conv.model,
                    tokens_used=50,
                    created_at=datetime.utcnow()
                )
            ]
            db.add_all(messages)
        
        await db.commit()
        
        print("✅ Initial data created successfully")
        print("📊 Test accounts:")
        for user in users:
            print(f"  • {user.email} / hoyo123 ({user.plan} plan)")
