import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  PlusCircle, 
  MessageSquare, 
  FolderOpen, 
  Grid3x3,
  Sparkles,
  ChevronDown,
  User,
  Monitor,
  Mic,
  MicOff,
  Send,
  X,
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX
} from 'lucide-react';
import { cn } from '../utils/cn';
import HoYoAPI from '../services/api';
import LoginModal from './LoginModal';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentChats, setRecentChats] = useState([]);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(HoYoAPI.auth.getCurrentUser());

  const handleAIAssistantClick = () => {
    // Проверка авторизации
    if (!HoYoAPI.auth.isAuthenticated()) {
      setIsLoginModalOpen(true);
    } else {
      setIsAIAssistantOpen(true);
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsAIAssistantOpen(true);
  };

  const navigationItems = [
    {
      id: 'new-chat',
      path: '/',
      icon: PlusCircle,
      label: 'New chat',
      color: 'text-accent-coral',
      action: () => navigate('/'),
    },
    {
      id: 'chats',
      path: '/chats',
      icon: MessageSquare,
      label: 'Chats',
      color: 'text-white',
    },
    {
      id: 'projects',
      path: '/projects',
      icon: FolderOpen,
      label: 'Projects',
      color: 'text-white',
    },
    {
      id: 'artifacts',
      path: '/artifacts',
      icon: Grid3x3,
      label: 'Artifacts',
      color: 'text-white',
    },
  ];

  const recentItems = [];

  return (
    <div className="w-[280px] h-screen bg-background-sidebar flex flex-col">
      {/* Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-primary-medium-gray">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-accent-coral drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          <span className="text-xl font-semibold text-white">HoYo</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            if (item.id === 'new-chat') {
              const isActive = location.pathname === '/';
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 relative',
                    'hover:bg-primary-medium-gray hover:text-text-primary',
                    isActive
                      ? 'bg-primary-medium-gray text-accent-coral before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-accent-coral before:rounded-r before:shadow-[0_0_10px_rgba(59,130,246,0.8)]'
                      : 'text-text-secondary'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            }
            
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 relative',
                    'hover:bg-primary-medium-gray hover:text-text-primary',
                    isActive
                      ? 'bg-primary-medium-gray text-accent-coral before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-accent-coral before:rounded-r before:shadow-[0_0_10px_rgba(59,130,246,0.8)]'
                      : 'text-text-secondary'
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Recents Section */}
        {recentItems.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xs font-semibold uppercase text-text-muted px-4 mb-3">
              Recents
            </h3>
            <div className="space-y-1">
              {recentItems.map((item, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-primary-medium-gray hover:text-text-primary rounded-md transition-all duration-200"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Assistant Button */}
      <div className="p-4 border-t border-primary-medium-gray">
        <button 
          onClick={handleAIAssistantClick}
          className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-accent-coral to-accent-blue hover:from-accent-coral/80 hover:to-accent-blue/80 rounded-lg transition-all duration-200 mb-3 group cursor-pointer"
        >
          <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
            <Monitor className="w-5 h-5 text-white" />
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-medium text-white">AI Assistant</p>
            <p className="text-xs text-white/70">Screen capture & voice</p>
          </div>
        </button>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-primary-medium-gray">
        <button 
          onClick={() => navigate('/profile')}
          className="w-full flex items-center justify-between p-3 bg-background-input rounded-md hover:bg-primary-medium-gray transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-medium-gray rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-text-secondary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-text-primary">
                {currentUser ? currentUser.username : 'Guest'}
              </p>
              <p className="text-xs text-text-muted">
                {currentUser ? `${currentUser.plan || 'Free'} plan` : 'Not logged in'}
              </p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-text-muted" />
        </button>
      </div>
      
      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* AI Assistant Modal */}
      {isAIAssistantOpen && (
        <AIAssistantModal 
          isOpen={isAIAssistantOpen}
          isMinimized={isMinimized}
          onClose={() => setIsAIAssistantOpen(false)}
          onMinimize={() => setIsMinimized(!isMinimized)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

// AI Assistant Component
const AIAssistantModal = ({ isOpen, isMinimized, onClose, onMinimize }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [availableSources, setAvailableSources] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [selectedModel, setSelectedModel] = useState('HoYo-GPT-4');
  const [availableModels, setAvailableModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const wsRef = useRef(null);

  // Инициализация при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      initializeConversation();
      loadModels();
      connectWebSocket();
    }
    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect();
      }
    };
  }, [isOpen]);

  // Инициализация речевых API
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'ru-RU';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        if (event.results[event.results.length - 1].isFinal) {
          handleVoiceMessage(transcript);
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        setIsListening(false);
      };
    }
    
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    
    getAvailableSources();
  }, []);

  // Инициализация диалога
  const initializeConversation = async () => {
    try {
      const response = await HoYoAPI.conversations.create('AI Assistant Session', selectedModel);
      setCurrentConversationId(response.id);
      
      // Загрузить историю сообщений если есть
      const messagesData = await HoYoAPI.conversations.getMessages(response.id);
      if (messagesData.messages && messagesData.messages.length > 0) {
        setMessages(messagesData.messages.map(msg => ({
          id: msg.id,
          type: msg.role === 'assistant' ? 'ai' : msg.role,
          content: msg.content,
          timestamp: msg.created_at
        })));
      } else {
        // Добавить приветственное сообщение
        const welcomeMsg = { 
          id: Date.now(), 
          type: 'ai', 
          content: 'Привет! Я HoYo AI Assistant. Могу помочь с кодом, анализом экрана и ответить на любые вопросы. Чем могу помочь?' 
        };
        setMessages([welcomeMsg]);
      }
    } catch (error) {
      console.error('Failed to initialize conversation:', error);
    }
  };

  // Загрузка доступных моделей
  const loadModels = async () => {
    try {
      const models = await HoYoAPI.models.getModels();
      setAvailableModels(models);
    } catch (error) {
      console.error('Failed to load models:', error);
    }
  };

  // Подключение WebSocket
  const connectWebSocket = () => {
    if (currentConversationId) {
      const wsService = new HoYoAPI.WebSocketService();
      wsRef.current = wsService;
      const socket = wsService.connect(currentConversationId);
      
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
          addMessage('ai', data.content);
        }
      };
    }
  };

  // Получение источников захвата
  const getAvailableSources = async () => {
    const mockSources = [
      { id: 'screen-1', name: 'Весь экран', type: 'screen' },
      { id: 'window-1', name: 'Браузер', type: 'window' },
      { id: 'window-2', name: 'VS Code', type: 'window' },
      { id: 'window-3', name: 'Discord', type: 'window' },
    ];
    setAvailableSources(mockSources);
  };

  // Начать захват экрана
  const startCapture = async (source) => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30 } },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCapturing(true);
        setSelectedSource(source);
        
        addMessage('ai', `Начал захват: ${source.name}. Теперь я вижу ваш экран!`);
        speak(`Начал захват экрана ${source.name}`);
      }

      stream.getVideoTracks()[0].addEventListener('ended', () => {
        stopCapture();
      });
    } catch (err) {
      addMessage('ai', 'Не удалось начать захват экрана. Проверьте разрешения.');
    }
  };

  // Остановить захват
  const stopCapture = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
    setSelectedSource(null);
    addMessage('ai', 'Захват экрана остановлен.');
  };

  // Голосовое управление
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // Обработка голосового сообщения
  const handleVoiceMessage = async (transcript) => {
    if (currentConversationId && !isLoading) {
      addMessage('user', transcript);
      setIsListening(false);
      
      setIsLoading(true);
      try {
        const response = await HoYoAPI.chat.sendMessage(
          currentConversationId, 
          transcript, 
          selectedModel
        );
        
        if (response.aiMessage) {
          addMessage('ai', response.aiMessage.content);
          speak(response.aiMessage.content);
        }
      } catch (error) {
        console.error('Failed to send voice message:', error);
        addMessage('ai', 'Извините, не удалось обработать голосовое сообщение.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Обработка текстового сообщения
  const handleTextMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() && currentConversationId && !isLoading) {
      const userMsg = inputMessage;
      setInputMessage('');
      addMessage('user', userMsg);
      
      setIsLoading(true);
      try {
        const response = await HoYoAPI.chat.sendMessage(
          currentConversationId, 
          userMsg, 
          selectedModel
        );
        
        if (response.aiMessage) {
          addMessage('ai', response.aiMessage.content);
          // Озвучить ответ
          speak(response.aiMessage.content);
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        addMessage('ai', 'Извините, произошла ошибка при обработке запроса. Попробуйте еще раз.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Добавить сообщение
  const addMessage = (type, content) => {
    const newMessage = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, newMessage]);
  };


  // Озвучивание текста
  const speak = (text) => {
    if (synthRef.current && !isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    }
  };

  // Остановить озвучивание
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bg-primary-dark-gray rounded-xl shadow-2xl border border-primary-medium-gray z-50 transition-all duration-300 ${
      isFullscreen 
        ? 'inset-4' 
        : isMinimized 
          ? 'right-4 top-4 w-80 h-16' 
          : 'right-4 top-4 w-96 h-[600px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary-medium-gray">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-coral/10 rounded-lg">
            <Monitor className="w-4 h-4 text-accent-coral" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
            {isCapturing && <p className="text-xs text-green-400">Recording: {selectedSource?.name}</p>}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)} 
            className="p-1 hover:bg-primary-medium-gray rounded"
            title={isFullscreen ? "Выйти из полноэкранного режима" : "Полноэкранный режим"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-text-secondary" /> : <Maximize2 className="w-4 h-4 text-text-secondary" />}
          </button>
          <button onClick={onMinimize} className="p-1 hover:bg-primary-medium-gray rounded" title="Свернуть">
            <ChevronDown className="w-4 h-4 text-text-secondary" />
          </button>
          <button onClick={onClose} className="p-1 hover:bg-primary-medium-gray rounded" title="Закрыть">
            <X className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Model Selection */}
          <div className="p-4 border-b border-primary-medium-gray">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-medium text-text-secondary">AI Модель:</h4>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="px-2 py-1 bg-background-input text-text-primary rounded text-xs focus:outline-none focus:ring-1 focus:ring-accent-coral"
              >
                {availableModels.length > 0 ? (
                  availableModels.map(model => (
                    <option key={model.name} value={model.name}>
                      {model.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="HoYo-GPT-4">HoYo-GPT-4</option>
                    <option value="HoYo-Claude">HoYo-Claude</option>
                    <option value="HoYo-Vision">HoYo-Vision</option>
                    <option value="HoYo-Sonnet">HoYo-Sonnet</option>
                  </>
                )}
              </select>
            </div>
            {availableModels.find(m => m.name === selectedModel)?.description && (
              <p className="text-xs text-text-muted">
                {availableModels.find(m => m.name === selectedModel).description}
              </p>
            )}
          </div>

          {/* Screen Sources */}
          {!isCapturing && (
            <div className="p-4 border-b border-primary-medium-gray">
              <h4 className="text-xs font-medium text-text-secondary mb-2">Выберите источник:</h4>
              <div className="grid grid-cols-2 gap-2">
                {availableSources.map((source) => (
                  <button
                    key={source.id}
                    onClick={() => startCapture(source)}
                    className="flex items-center gap-2 p-2 bg-background-input hover:bg-primary-medium-gray rounded-lg transition-colors text-xs"
                  >
                    <Monitor className="w-3 h-3 text-accent-coral" />
                    <span className="text-text-primary truncate">{source.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Video Preview */}
          {isCapturing && (
            <div className="p-4 border-b border-primary-medium-gray">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video ref={videoRef} autoPlay muted className={`w-full object-cover ${isFullscreen ? 'h-96' : 'h-32'}`} />
                <button
                  onClick={stopCapture}
                  className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 rounded text-white text-xs"
                >
                  Stop
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className={`flex-1 p-4 overflow-y-auto ${isFullscreen ? 'max-h-[calc(100vh-400px)]' : 'max-h-64'}`}>
            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-2 rounded-lg text-xs ${
                    message.type === 'user' 
                      ? 'bg-accent-coral text-white' 
                      : 'bg-background-input text-text-primary'
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 border-t border-primary-medium-gray">
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={toggleListening}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isListening 
                    ? 'bg-red-500 text-white' 
                    : 'bg-accent-coral hover:bg-accent-coral/80 text-white'
                }`}
              >
                {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                {isListening ? 'Слушаю...' : 'Голос'}
              </button>
              
              <button
                onClick={isSpeaking ? stopSpeaking : () => speak('Тест озвучивания')}
                className={`p-2 rounded-lg transition-colors ${
                  isSpeaking 
                    ? 'bg-red-500 text-white' 
                    : 'bg-primary-medium-gray hover:bg-primary-light-gray text-text-secondary'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              </button>
            </div>
            
            <form onSubmit={handleTextMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Напишите сообщение..."
                className="flex-1 px-3 py-2 bg-background-input text-text-primary rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-accent-coral"
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`p-2 rounded-lg transition-colors ${
                  isLoading 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-accent-coral hover:bg-accent-coral/80 text-white'
                }`}
              >
                {isLoading ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-3 h-3" />
                )}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
