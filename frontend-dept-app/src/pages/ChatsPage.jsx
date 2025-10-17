import React, { useState } from 'react';
import { MessageSquare, Search, Filter, Plus } from 'lucide-react';

const ChatsPage = () => {
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: `New Chat ${chats.length + 1}`,
      time: 'Just now',
      preview: 'Start a new conversation...',
      messages: 0
    };
    setChats([newChat, ...chats]);
  };

  const handleChatClick = (chatId) => {
    console.log('Opening chat:', chatId);
    // Здесь можно добавить навигацию к конкретному чату
  };

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-background-main p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">Chats</h1>
            <p className="text-text-secondary">Your conversation history</p>
          </div>
          <button onClick={handleNewChat} className="btn-primary">
            <Plus className="w-5 h-5" />
            New Chat
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background-input text-text-primary placeholder-text-muted rounded-md focus:outline-none focus:ring-2 focus:ring-accent-blue"
            />
          </div>
          <button 
            onClick={() => setShowFilter(!showFilter)}
            className={`px-4 py-3 rounded-md flex items-center gap-2 transition-all duration-200 ${
              showFilter 
                ? 'bg-accent-coral text-white' 
                : 'bg-primary-medium-gray hover:bg-primary-light-gray text-text-secondary'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>

        {/* Chats List */}
        <div className="space-y-3">
          {filteredChats.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {chats.length === 0 ? 'No chats yet' : 'No chats found'}
              </h3>
              <p className="text-text-secondary mb-6">
                {chats.length === 0 
                  ? 'Start a new conversation to get started' 
                  : 'Try adjusting your search query'
                }
              </p>
              {chats.length === 0 && (
                <button onClick={handleNewChat} className="btn-primary">
                  <Plus className="w-5 h-5" />
                  Create First Chat
                </button>
              )}
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatClick(chat.id)}
                className="bg-primary-dark-gray hover:bg-primary-medium-gray p-6 rounded-lg cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <MessageSquare className="w-5 h-5 text-accent-coral" />
                      <h3 className="text-lg font-medium text-white group-hover:text-accent-coral transition-colors">
                        {chat.title}
                      </h3>
                    </div>
                    <p className="text-text-secondary mb-2 line-clamp-2">
                      {chat.preview}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-text-muted">
                      <span>{chat.time}</span>
                      <span>•</span>
                      <span>{chat.messages} messages</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;
