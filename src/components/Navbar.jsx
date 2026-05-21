import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Compass, Sparkles, User, Shield, Briefcase, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          <Link to="/" className="text-2xl font-black flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Compass className="w-6 h-6" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
              DiscoverKG
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/" className={`font-medium flex items-center gap-2 ${location.pathname === '/' ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-500'}`}><Compass className="w-5 h-5" /> Главная</Link>
            <Link to="/places" className={`font-medium flex items-center gap-2 ${location.pathname === '/places' ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-500'}`}><MapPin className="w-5 h-5" /> Места</Link>
            <Link to="/smart-route" className={`font-medium flex items-center gap-2 ${location.pathname === '/smart-route' ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-500'}`}><Sparkles className="w-5 h-5" /> Нейро-Маршрут</Link>
            
            {/* Ссылки на основе роли (только если авторизован) */}
            {user?.role === 'admin' && (
              <Link to="/admin" className="font-bold text-rose-500 flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-lg"><Shield className="w-4 h-4" /> Админка</Link>
            )}
            {user?.role === 'guide' && (
              <Link to="/guide" className="font-bold text-sky-500 flex items-center gap-2 bg-sky-50 px-3 py-1.5 rounded-lg"><Briefcase className="w-4 h-4" /> Кабинет Гида</Link>
            )}

            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            {/* Авторизация / Профиль */}
            {!user ? (
              <Link to="/auth">
                <button className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:-translate-y-0.5">
                  Войти
                </button>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 font-bold text-slate-700 hover:text-emerald-600 transition-colors">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"><User className="w-4 h-4"/></div>
                  {user.name}
                </Link>
                <button onClick={handleLogout} className="text-slate-400 hover:text-rose-500 transition-colors bg-slate-50 p-2 rounded-xl">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
