import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Контекст и Защита роутов
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// UI Компоненты
import Navbar from './components/Navbar';
import AnimatedBackground from './components/AnimatedBackground';

// Страницы
import Home from './pages/Home';
import Places from './pages/Places';
import PlaceDetails from './pages/PlaceDetails';
import SmartRoute from './pages/SmartRoute';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import GuideDashboard from './pages/GuideDashboard';
import Auth from './pages/Auth'; // НОВЫЙ ИМПОРТ

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AnimatedBackground />
        <Navbar />
        
        <div className="relative z-10 font-sans">
          <Routes>
            {/* Публичные маршруты */}
            <Route path="/" element={<Home />} />
            <Route path="/places" element={<Places />} />
            <Route path="/places/:id" element={<PlaceDetails />} />
            <Route path="/smart-route" element={<SmartRoute />} />
            <Route path="/auth" element={<Auth />} /> {/* СТРАНИЦА ВХОДА */}
            
            {/* ЗАЩИЩЕННЫЕ МАРШРУТЫ (Для авторизованных юзеров) */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={['tourist', 'guide', 'admin']}>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            {/* ЗАЩИЩЕННЫЙ МАРШРУТ: Только для Админа */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />

            {/* ЗАЩИЩЕННЫЙ МАРШРУТ: Только для Гида */}
            <Route 
              path="/guide" 
              element={
                <ProtectedRoute allowedRoles={['guide', 'admin']}>
                  <GuideDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
