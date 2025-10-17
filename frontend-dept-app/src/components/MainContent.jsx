import React, { useState } from 'react';
import { 
  Sparkles, 
  Paperclip, 
  Code, 
  Image, 
  Mic, 
  ArrowUp,
  ChevronDown,
  Zap
} from 'lucide-react';
import { cn } from '../utils/cn';

const MainContent = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState('Sonnet 4.5');
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const models = [
    'Sonnet 4.5',
    'GPT-4o',
    'Claude 3 Opus',
    'Gemini Pro'
  ];

  const toolButtons = [
    { icon: Paperclip, label: 'Attach file' },
    { icon: Code, label: 'Code snippet' },
    { icon: Image, label: 'Add image' },
    { icon: Mic, label: 'Voice input' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      console.log('Submitted:', inputValue);
      // Здесь можно добавить логику отправки сообщения
      alert(`Message sent: ${inputValue}`);
      setInputValue('');
    }
  };

  const handleToolClick = (toolName) => {
    console.log(`${toolName} clicked`);
    alert(`${toolName} feature coming soon!`);
  };

  return (
    <div className="flex-1 flex flex-col bg-background-main">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-3xl">
          {/* Greeting Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-10 h-10 text-accent-coral" />
              <h1 className="text-3xl font-light text-white">
                Evening, hvano
              </h1>
            </div>
            <p className="text-text-secondary">
              How can I help you today?
            </p>
          </div>

          {/* Input Card */}
          <div className="bg-primary-dark-gray rounded-lg p-6 shadow-lg animate-slide-in">
            <form onSubmit={handleSubmit}>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full bg-transparent text-text-primary placeholder-text-muted border-0 outline-none resize-none text-base"
                rows="4"
                autoFocus
              />

              {/* Toolbar */}
              <div className="flex items-center justify-between mt-4">
                {/* Tool Buttons */}
                <div className="flex items-center gap-2">
                  {toolButtons.map((tool, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleToolClick(tool.label)}
                      className="w-9 h-9 flex items-center justify-center bg-primary-medium-gray hover:bg-primary-light-gray rounded-md transition-all duration-200"
                      title={tool.label}
                    >
                      <tool.icon className="w-5 h-5 text-text-secondary" />
                    </button>
                  ))}
                </div>

                {/* Model Selector and Submit */}
                <div className="flex items-center gap-3">
                  {/* Model Selector */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowModelDropdown(!showModelDropdown)}
                      className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <span>{selectedModel}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {showModelDropdown && (
                      <div className="absolute bottom-full right-0 mb-2 bg-primary-dark-gray border border-primary-medium-gray rounded-md shadow-lg py-2 min-w-[150px]">
                        {models.map((model) => (
                          <button
                            key={model}
                            type="button"
                            onClick={() => {
                              setSelectedModel(model);
                              setShowModelDropdown(false);
                            }}
                            className={cn(
                              'w-full text-left px-4 py-2 text-sm hover:bg-primary-medium-gray transition-colors',
                              selectedModel === model ? 'text-text-primary' : 'text-text-secondary'
                            )}
                          >
                            {model}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className={cn(
                      'w-10 h-10 flex items-center justify-center rounded-md transition-all duration-200',
                      inputValue.trim() 
                        ? 'bg-accent-coral hover:bg-accent-coral-dark text-white' 
                        : 'bg-primary-medium-gray text-text-muted cursor-not-allowed'
                    )}
                  >
                    <ArrowUp className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Upgrade Banner */}
          <div className="mt-6 bg-background-input rounded-md px-6 py-4 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-accent-blue" />
              <p className="text-sm text-text-secondary">
                Upgrade to connect your tools to HoYo
              </p>
            </div>
            <button 
              onClick={() => alert('Upgrade feature coming soon!')}
              className="text-sm font-medium text-accent-coral hover:text-accent-blue-light transition-colors"
            >
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
