import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Route, Car, Loader2 } from 'lucide-react';
import { api } from '../api';

const SmartRoute = () => {
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [error, setError] = useState('');
  
  const [days, setDays] = useState(3);
  const [type, setType] = useState('nature');
  const [hasAuto, setHasAuto] = useState(false);

  const generateRoute = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Отправляем реальный запрос на бэкенд Flask
      const data = await api.buildSmartRoute({ days, type, max_difficulty: 3, has_auto: hasAuto });
      setRouteData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto min-h-screen">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/90 backdrop-blur-2xl rounded-[3rem] p-10 shadow-2xl border border-white">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-sky-400 to-indigo-500 rounded-3xl mx-auto flex items-center justify-center shadow-xl mb-6 transform rotate-3">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl font-black text-slate-900 mb-4">Нейро-Маршрут</h2>
          <p className="text-xl text-slate-500 font-medium">Алгоритм подберет идеальный тур</p>
        </div>

        {error && <div className="text-center p-4 bg-rose-100 text-rose-600 rounded-2xl mb-6 font-bold">{error}</div>}

        <form onSubmit={generateRoute} className="space-y-8 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Дней в туре</label>
              <input type="number" min="1" max="7" value={days} onChange={e => setDays(e.target.value)} className="w-full bg-transparent text-3xl font-black text-slate-900 outline-none" />
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Тип отдыха</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-transparent text-xl font-bold text-slate-900 outline-none cursor-pointer">
                <option value="nature">Природа (Озера, Горы)</option>
                <option value="culture">Культура (История)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 bg-indigo-50 rounded-3xl border border-indigo-100 cursor-pointer" onClick={() => setHasAuto(!hasAuto)}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${hasAuto ? 'bg-indigo-500 text-white' : 'bg-indigo-200 text-indigo-500'}`}>
              <Car className="w-5 h-5"/>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 text-lg">У меня есть внедорожник</h4>
              <p className="text-sm text-indigo-700">Алгоритм добавит труднодоступные локации</p>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-2xl shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
            {loading ? <><Loader2 className="animate-spin w-8 h-8"/> Вычисляем графы...</> : <><Route className="w-8 h-8"/> Сгенерировать тур</>}
          </button>
        </form>

        <AnimatePresence>
          {routeData && !loading && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-16 pt-12 border-t-2 border-slate-100 overflow-hidden">
              <h3 className="text-4xl font-black text-slate-900 mb-10 text-center">Ваш идеальный план</h3>
              <div className="max-w-3xl mx-auto space-y-6 relative before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-indigo-500 before:to-emerald-500">
                {routeData.map((item, i) => (
                  <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }} key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-white bg-slate-900 text-white font-black text-xl shadow-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      {item.day}
                    </div>
                    <div className="w-[calc(100%-5rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-3xl bg-white shadow-xl border border-slate-100">
                      <h4 className="text-2xl font-bold text-slate-900 mb-2">{item.place}</h4>
                      <p className="text-slate-600 text-lg">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SmartRoute;
