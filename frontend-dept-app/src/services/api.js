// HoYo AI API Service - FastAPI Backend
const API_BASE_URL = 'http://localhost:8000/api';

// Simple fetch wrapper
const fetchAPI = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const response = await fetch(API_BASE_URL + url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw error;
  }
  
  return response.json();
};

const api = {
  get: (url, options) => fetchAPI(url, { ...options, method: 'GET' }),
  post: (url, data, options) => fetchAPI(url, { ...options, method: 'POST', body: JSON.stringify(data) }),
  delete: (url, options) => fetchAPI(url, { ...options, method: 'DELETE' }),
};

// ==================== AUTH API ====================

export const authAPI = {
  // User registration
  register: async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password,
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // User login
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// ==================== AI MODELS API ====================

export const modelsAPI = {
  // Get all available models
  getModels: async () => {
    try {
      const response = await api.get('/models');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// ==================== CONVERSATIONS API ====================

export const conversationsAPI = {
  // Create new conversation
  create: async (title, model = 'HoYo-GPT-4') => {
    try {
      const response = await api.post('/conversations', {
        title,
        model,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all conversations
  getAll: async () => {
    try {
      const response = await api.get('/conversations');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get conversation messages
  getMessages: async (conversationId) => {
    try {
      const response = await api.get(`/conversations/${conversationId}/messages`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete conversation
  delete: async (conversationId) => {
    try {
      const response = await api.delete(`/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// ==================== CHAT API ====================

export const chatAPI = {
  // Send message to AI
  sendMessage: async (conversationId, message, model = 'HoYo-GPT-4') => {
    try {
      const response = await api.post('/chat', {
        conversationId,
        message,
        model,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Stream chat response (WebSocket)
  streamChat: (conversationId, onMessage, onError) => {
    const ws = new WebSocket(`ws://localhost:5000/ws/chat/${conversationId}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };
    
    ws.onerror = (error) => {
      onError(error);
    };
    
    return ws;
  },
};

// ==================== SCREEN CAPTURE API ====================

export const screenCaptureAPI = {
  // Upload screen capture
  upload: async (conversationId, file, description) => {
    try {
      const formData = new FormData();
      formData.append('screenshot', file);
      formData.append('conversationId', conversationId);
      formData.append('description', description);
      
      const response = await api.post('/screen-capture/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Analyze screen capture
  analyze: async (captureId) => {
    try {
      const response = await api.post(`/screen-capture/${captureId}/analyze`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// ==================== VOICE API ====================

export const voiceAPI = {
  // Start voice session
  startSession: async (conversationId, language = 'ru-RU') => {
    try {
      const response = await api.post('/voice/start', {
        conversationId,
        language,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // End voice session
  endSession: async (sessionId) => {
    try {
      const response = await api.post(`/voice/${sessionId}/end`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Send voice transcript
  sendTranscript: async (sessionId, transcript) => {
    try {
      const response = await api.post(`/voice/${sessionId}/transcript`, {
        transcript,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// ==================== WEBSOCKET ====================

export class WebSocketService {
  constructor() {
    this.socket = null;
  }

  connect(conversationId) {
    const token = localStorage.getItem('token');
    this.socket = new WebSocket(`ws://localhost:5000?token=${token}`);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.joinConversation(conversationId);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return this.socket;
  }

  joinConversation(conversationId) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'join_conversation',
        conversationId,
      }));
    }
  }

  sendTyping(conversationId) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'typing',
        conversationId,
      }));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

// Export default API object
const HoYoAPI = {
  auth: authAPI,
  models: modelsAPI,
  conversations: conversationsAPI,
  chat: chatAPI,
  screenCapture: screenCaptureAPI,
  voice: voiceAPI,
  WebSocketService,
};

export default HoYoAPI;
