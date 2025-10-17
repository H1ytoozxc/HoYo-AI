import React, { useState } from 'react';
import { X, LogIn, UserPlus, Loader2 } from 'lucide-react';
import HoYoAPI from '../services/api';

const LoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let response;
      if (isLogin) {
        response = await HoYoAPI.auth.login(formData.email, formData.password);
      } else {
        response = await HoYoAPI.auth.register(
          formData.username,
          formData.email,
          formData.password
        );
      }

      if (response.token) {
        onSuccess(response.user);
        onClose();
      }
    } catch (err) {
      setError(err.error || 'Произошла ошибка. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-primary-dark-gray rounded-xl p-6 w-96 max-w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            {isLogin ? 'Вход в HoYo AI' : 'Регистрация в HoYo AI'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-primary-medium-gray rounded transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Имя пользователя
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required={!isLogin}
                className="w-full px-3 py-2 bg-background-input text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-coral"
                placeholder="hvano"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-background-input text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-coral"
              placeholder="hvano@hoyo.tech"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Пароль
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-background-input text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-coral"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              isLoading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-accent-coral to-accent-blue hover:from-accent-coral/80 hover:to-accent-blue/80'
            } text-white`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Загрузка...
              </>
            ) : (
              <>
                {isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {isLogin ? 'Войти' : 'Зарегистрироваться'}
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-text-secondary">
            {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ username: '', email: '', password: '' });
              }}
              className="ml-2 text-accent-coral hover:underline"
            >
              {isLogin ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </div>

        {isLogin && (
          <div className="mt-6 pt-4 border-t border-primary-medium-gray">
            <p className="text-xs text-text-muted mb-2">Тестовые аккаунты:</p>
            <div className="space-y-1">
              <button
                onClick={() => setFormData({ ...formData, email: 'hvano@hoyo.tech', password: 'hoyo123' })}
                className="text-xs text-accent-coral hover:underline block"
              >
                hvano@hoyo.tech / hoyo123
              </button>
              <button
                onClick={() => setFormData({ ...formData, email: 'demo@hoyo.tech', password: 'hoyo123' })}
                className="text-xs text-accent-coral hover:underline block"
              >
                demo@hoyo.tech / hoyo123
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
