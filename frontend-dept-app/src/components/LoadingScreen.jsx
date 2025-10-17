import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-background-primary flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center"
      >
        {/* HoYo Logo Animation */}
        <div className="relative mb-8">
          <motion.div
            className="w-20 h-20 rounded-full bg-gradient-to-r from-accent-coral to-accent-blue"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full bg-background-primary"
            animate={{ scale: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">H</span>
          </div>
        </div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h2 className="text-xl font-semibold text-white mb-2">HoYo AI Loading</h2>
          <div className="flex items-center gap-1">
            <span className="text-text-secondary text-sm">Загрузка</span>
            <motion.div className="flex gap-1">
              {[0, 1, 2].map((index) => (
                <motion.span
                  key={index}
                  className="w-1 h-1 bg-accent-coral rounded-full"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: index * 0.1 }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="mt-8 h-1 bg-gradient-to-r from-accent-coral to-accent-blue rounded-full"
          style={{ maxWidth: "200px" }}
        />
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
