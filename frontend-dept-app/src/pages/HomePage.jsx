import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, Code, Zap } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-4xl"
      >
        {/* Logo */}
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block p-4 bg-gradient-to-r from-accent-coral to-accent-blue rounded-2xl mb-4"
          >
            <Sparkles className="w-16 h-16 text-white" />
          </motion.div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to <span className="bg-gradient-to-r from-accent-coral to-accent-blue bg-clip-text text-transparent">HoYo AI</span>
          </h1>
          <p className="text-xl text-text-secondary">
            Ваш продвинутый AI ассистент с множественными моделями
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 bg-primary-dark-gray rounded-xl hover:bg-primary-medium-gray transition-colors"
          >
            <MessageSquare className="w-12 h-12 text-accent-coral mb-4 mx-auto" />
            <h3 className="text-lg font-semibold text-white mb-2">6 AI Models</h3>
            <p className="text-text-secondary text-sm">
              HoYo-GPT-4, Claude, Vision, Gemini, Code, Fast
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 bg-primary-dark-gray rounded-xl hover:bg-primary-medium-gray transition-colors"
          >
            <Code className="w-12 h-12 text-accent-blue mb-4 mx-auto" />
            <h3 className="text-lg font-semibold text-white mb-2">Code Generation</h3>
            <p className="text-text-secondary text-sm">
              Генерация и анализ кода на любых языках
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 bg-primary-dark-gray rounded-xl hover:bg-primary-medium-gray transition-colors"
          >
            <Zap className="w-12 h-12 text-accent-coral mb-4 mx-auto" />
            <h3 className="text-lg font-semibold text-white mb-2">Real-time</h3>
            <p className="text-text-secondary text-sm">
              WebSocket поддержка для мгновенных ответов
            </p>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <button className="px-8 py-4 bg-gradient-to-r from-accent-coral to-accent-blue text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
            Начать новый чат
          </button>
        </motion.div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8">
          <div>
            <div className="text-3xl font-bold text-white">6</div>
            <div className="text-sm text-text-secondary">AI Models</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">∞</div>
            <div className="text-sm text-text-secondary">Conversations</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">24/7</div>
            <div className="text-sm text-text-secondary">Available</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
