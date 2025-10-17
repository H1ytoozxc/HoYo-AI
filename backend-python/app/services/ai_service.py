"""
AI Service for handling multiple AI models
"""
import asyncio
from typing import Dict, Any, List, Optional, AsyncGenerator
import json
import uuid
from datetime import datetime
from abc import ABC, abstractmethod

from app.core.config import settings
from app.models.database import User

class AIModel(ABC):
    """Abstract base class for AI models"""
    
    def __init__(self, config: dict):
        self.config = config
        self.name = config["name"]
        self.max_tokens = config["max_tokens"]
        self.temperature = config["temperature"]
    
    @abstractmethod
    async def generate(self, prompt: str, **kwargs) -> str:
        """Generate response from model"""
        pass
    
    @abstractmethod
    async def stream(self, prompt: str, **kwargs) -> AsyncGenerator[str, None]:
        """Stream response from model"""
        pass

class MockModel(AIModel):
    """Mock model for development/testing"""
    
    async def generate(self, prompt: str, **kwargs) -> str:
        await asyncio.sleep(0.5)  # Simulate processing time
        
        # Detect request type and generate appropriate response
        if any(word in prompt.lower() for word in ["код", "code", "function", "программ"]):
            return self._generate_code_response(prompt)
        elif any(word in prompt.lower() for word in ["анализ", "analyze", "исследов"]):
            return self._generate_analysis_response(prompt)
        else:
            return self._generate_chat_response(prompt)
    
    async def stream(self, prompt: str, **kwargs) -> AsyncGenerator[str, None]:
        response = await self.generate(prompt, **kwargs)
        words = response.split()
        
        for i, word in enumerate(words):
            yield word + (" " if i < len(words) - 1 else "")
            await asyncio.sleep(0.05)  # Simulate streaming delay
    
    def _generate_code_response(self, prompt: str) -> str:
        return f"""Анализируя ваш запрос о коде, вот решение от {self.name}:

```python
# HoYo AI Generated Solution
def process_request(data):
    \"\"\"Process user request with HoYo AI\"\"\"
    result = []
    
    for item in data:
        if validate(item):
            processed = transform(item)
            result.append(processed)
    
    return {{
        "success": True,
        "data": result,
        "model": "{self.name}",
        "timestamp": datetime.now().isoformat()
    }}

def validate(item):
    \"\"\"Validate input data\"\"\"
    return item is not None and len(item) > 0

def transform(item):
    \"\"\"Transform data using HoYo algorithms\"\"\"
    return {{
        "original": item,
        "processed": True,
        "enhanced_by": "HoYo Technologies"
    }}
```

Этот код оптимизирован для производительности и следует лучшим практикам Python."""
    
    def _generate_chat_response(self, prompt: str) -> str:
        return f"""Привет! Я {self.name} от HoYo Technologies. 

Я проанализировал ваш запрос: "{prompt[:100]}..."

Вот мой ответ: это действительно интересный вопрос! HoYo Technologies использует передовые технологии 
искусственного интеллекта для решения подобных задач. Наш подход сочетает в себе инновации и практичность.

Могу предложить следующие шаги:
1. Детальный анализ требований
2. Разработка оптимального решения
3. Тестирование и валидация
4. Развертывание с мониторингом

Нужна более подробная информация по какому-либо аспекту?"""
    
    def _generate_analysis_response(self, prompt: str) -> str:
        return f"""📊 **Анализ от {self.name}**

**Входные данные:** {prompt[:50]}...

**Результаты анализа:**

1. **Ключевые метрики:**
   • Эффективность: 92%
   • Точность: 97%
   • Производительность: Оптимальная

2. **Выявленные паттерны:**
   • Основной тренд: восходящий
   • Аномалии: не обнаружены
   • Корреляции: положительные

3. **Рекомендации HoYo AI:**
   • Продолжить текущую стратегию
   • Оптимизировать процессы на 15%
   • Внедрить автоматизацию

**Заключение:** Анализ показывает положительную динамику. HoYo Technologies рекомендует 
следовать предложенным рекомендациям для достижения максимальной эффективности."""

class AIService:
    """Main AI service managing multiple models"""
    
    def __init__(self):
        self.models: Dict[str, AIModel] = {}
        self.default_model = "HoYo-GPT-4"
    
    async def initialize(self):
        """Initialize all AI models"""
        for model_name, config in settings.HOYO_MODELS.items():
            try:
                # For now, use mock models (can be extended with real API integrations)
                self.models[model_name] = MockModel(config)
                print(f"✅ Loaded model: {model_name}")
            except Exception as e:
                print(f"❌ Failed to load model {model_name}: {e}")
    
    async def process_chat(
        self, 
        message: str, 
        model: str = None,
        conversation_id: Optional[str] = None,
        user: Optional[User] = None
    ) -> Dict[str, Any]:
        """Process a chat message"""
        model_name = model or self.default_model
        
        if model_name not in self.models:
            return {
                "error": f"Model {model_name} not found",
                "available_models": list(self.models.keys())
            }
        
        # Check user plan restrictions
        if user and not self._check_model_access(user, model_name):
            return {
                "error": f"Your plan doesn't have access to {model_name}",
                "required_plan": self._get_required_plan(model_name)
            }
        
        # Generate response
        ai_model = self.models[model_name]
        response = await ai_model.generate(message)
        
        # Calculate tokens and cost
        tokens_used = self._estimate_tokens(message + response)
        cost = self._calculate_cost(tokens_used, model_name)
        
        return {
            "response": response,
            "model": model_name,
            "tokens_used": tokens_used,
            "cost": cost,
            "conversation_id": conversation_id,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    async def stream_chat(
        self,
        message: str,
        model: str = None,
        conversation_id: Optional[str] = None,
        user: Optional[User] = None
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """Stream a chat response"""
        model_name = model or self.default_model
        
        if model_name not in self.models:
            yield {
                "error": f"Model {model_name} not found",
                "available_models": list(self.models.keys())
            }
            return
        
        # Check user plan restrictions
        if user and not self._check_model_access(user, model_name):
            yield {
                "error": f"Your plan doesn't have access to {model_name}",
                "required_plan": self._get_required_plan(model_name)
            }
            return
        
        # Stream response
        ai_model = self.models[model_name]
        full_response = ""
        
        async for chunk in ai_model.stream(message):
            full_response += chunk
            yield {
                "chunk": chunk,
                "model": model_name,
                "conversation_id": conversation_id,
                "timestamp": datetime.utcnow().isoformat()
            }
        
        # Final message with stats
        tokens_used = self._estimate_tokens(message + full_response)
        cost = self._calculate_cost(tokens_used, model_name)
        
        yield {
            "done": True,
            "tokens_used": tokens_used,
            "cost": cost,
            "conversation_id": conversation_id
        }
    
    def _check_model_access(self, user: User, model_name: str) -> bool:
        """Check if user has access to model"""
        plan_access = {
            "free": ["HoYo-Fast"],
            "pro": ["HoYo-Fast", "HoYo-GPT-4", "HoYo-Claude", "HoYo-Code", "HoYo-Gemini"],
            "enterprise": list(self.models.keys())
        }
        
        user_plan = user.plan.value if user.plan else "free"
        return model_name in plan_access.get(user_plan, [])
    
    def _get_required_plan(self, model_name: str) -> str:
        """Get required plan for model"""
        if model_name in ["HoYo-Fast"]:
            return "free"
        elif model_name in ["HoYo-GPT-4", "HoYo-Claude", "HoYo-Code", "HoYo-Gemini"]:
            return "pro"
        else:
            return "enterprise"
    
    def _estimate_tokens(self, text: str) -> int:
        """Estimate token count (rough approximation)"""
        return len(text) // 4
    
    def _calculate_cost(self, tokens: int, model_name: str) -> float:
        """Calculate cost based on tokens and model"""
        config = settings.HOYO_MODELS.get(model_name, {})
        cost_per_token = config.get("cost_per_token", 0.00001)
        return round(tokens * cost_per_token, 6)
    
    def get_memory_usage(self) -> Dict[str, Any]:
        """Get memory usage statistics"""
        return {
            "models_loaded": len(self.models),
            "active_models": list(self.models.keys()),
            "default_model": self.default_model
        }
    
    async def cleanup(self):
        """Cleanup resources"""
        self.models.clear()
        print("✅ AI Service cleaned up")
