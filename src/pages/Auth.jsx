import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, User, Lock, Shield, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Данные формы
  const [formData, setFormData] = useState({ username: '', password: '', role: 'tourist' });
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(async () => {
      let res;
      if (isLogin) {
        res = await login(formData.username, formData.password);
      } else {
        res = await register(formData.username, formData.password, formData.role);
      }

      setLoading(false);
      
      if (res.success) {
        // Если это админ, кидаем его сразу в админку, туриста - на главную
        if (formData.username === 'admin') navigate('/admin');
        else navigate('/');
      } else {
        setError(res.message);
      }
    }, 1000); // Имитация задержки сети
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4">
      {/* Контейнер карточки */}
      <div className="max-w-5xl w-full bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white">
        
        {/* Левая часть - Картинка */}
        <div className="w-full md:w-1/2 relative hidden md:block">
          <img 
            src="https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80" 
            alt="Кыргызстан" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent flex flex-col justify-end p-12">
            <h2 className="text-4xl font-black text-white mb-2">DiscoverKG</h2>
            <p className="text-emerald-100 text-lg">Авторизуйтесь, чтобы получить доступ к интеллектуальным маршрутам и геймификации.</p>
          </div>
        </div>

        {/* Правая часть - Форма */}
        <div className="w-full md:w-1/2 p-10 sm:p-16 flex flex-col justify-center bg-slate-50 relative">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Compass className="w-8 h-8" />
            </div>
          </div>

          <h3 className="text-3xl font-black text-slate-900 text-center mb-2">
            {isLogin ? 'С возвращением!' : 'Создать аккаунт'}
          </h3>
          <p className="text-center text-slate-500 font-medium mb-8">
            {isLogin ? 'Введите логин админа или туриста' : 'Присоединяйтесь к нашему комьюнити'}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-rose-100 text-rose-600 rounded-2xl font-bold text-center text-sm border border-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-4 w-6 h-6 text-slate-400" />
              <input required type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="Логин (например: admin)" className="w-full pl-14 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium transition-all shadow-sm" />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-4 w-6 h-6 text-slate-400" />
              <input required type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Пароль" className="w-full pl-14 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium transition-all shadow-sm" />
            </div>

            <AnimatePresence>
              {!isLogin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="relative overflow-hidden">
                  <Shield className="absolute left-4 top-4 w-6 h-6 text-slate-400" />
                  <select name="role" value={formData.role} onChange={handleInputChange} className="w-full pl-14 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium transition-all shadow-sm cursor-pointer">
                    <option value="tourist">Я Турист</option>
                    <option value="guide">Я Местный Гид</option>
                    {/* Админа создать нельзя, он создается только через БД */}
                  </select>
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-900/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mt-4">
              {loading ? <Loader2 className="animate-spin w-6 h-6" /> : isLogin ? 'Войти в систему' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="mt-8 text-center text-slate-500 font-medium">
            {isLogin ? "Нет аккаунта? " : "Уже есть аккаунт? "}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-emerald-600 font-bold hover:underline outline-none">
              {isLogin ? "Регистрация" : "Войти"}
            </button>
          </div>
          
          <div className="mt-6 text-xs text-slate-400 text-center">
            Для проверки Админки введите логин: <b>admin</b>, пароль: <b>admin</b>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;
