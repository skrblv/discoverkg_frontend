import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingContext, setLoadingContext] = useState(true);

  // При первой загрузке проверяем, есть ли юзер в памяти браузера
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoadingContext(false);
  }, []);

  const login = async (username, password) => {
    try {
      const userData = await api.login(username, password);
      setUser(userData); // Устанавливаем роль, имя и id из базы
      localStorage.setItem('user', JSON.stringify(userData)); // Сохраняем сессию
      return { success: true };
    } catch (error) {
      // Если Flask вернул 401 ("Неверный логин или пароль")
      return { success: false, message: error.message };
    }
  };

  const register = async (username, password, role) => {
    try {
      const userData = await api.register(username, password, role);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      // Если Flask вернул 409 ("Пользователь существует")
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loadingContext) return null; // Предотвращает мерцание при загрузке

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
