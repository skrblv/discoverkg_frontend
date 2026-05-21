import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Tent, Loader2 } from 'lucide-react';
import { api } from '../api';

const GuideDashboard = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', price: '', capacity: 1, place_id: ''
  });

  // Получаем список мест для <select>
  useEffect(() => {
    api.getPlaces().then(data => {
      setPlaces(data.places);
      if (data.places.length > 0) {
        setFormData(prev => ({ ...prev, place_id: data.places[0].id }));
      }
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.addService(formData);
      alert('Услуга успешно опубликована в базу данных!');
      setFormData({ ...formData, name: '', price: '' });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto min-h-screen">
      <div className="text-center mb-12">
        <Briefcase className="w-16 h-16 text-sky-500 mx-auto mb-4" />
        <h2 className="text-5xl font-black text-slate-900">Кабинет Гида (RBAC)</h2>
        <p className="text-xl text-slate-500 mt-2">Добавление услуг с защитой от овербукинга</p>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100 max-w-3xl mx-auto">
        <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2"><Tent className="text-sky-500"/> Опубликовать услугу</h3>
        
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div className="md:col-span-2">
             <label className="block text-sm font-bold text-slate-500 mb-2">Локация</label>
             <select name="place_id" value={formData.place_id} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500">
               {places.map(p => <option key={p.id} value={p.id}>{p.name} ({p.region})</option>)}
             </select>
          </div>

          <div>
             <label className="block text-sm font-bold text-slate-500 mb-2">Название услуги</label>
             <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Напр: Аренда Юрты" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          
          <div>
             <label className="block text-sm font-bold text-slate-500 mb-2">Цена (Сом)</label>
             <input required type="number" name="price" value={formData.price} onChange={handleChange} placeholder="1500" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500" />
          </div>

          <div className="md:col-span-2">
             <label className="block text-sm font-bold text-slate-500 mb-2">Вместимость (Мест/Человек на 1 день)</label>
             <input required type="number" name="capacity" min="1" value={formData.capacity} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500 font-bold" />
             <p className="text-xs text-sky-600 mt-2">Бэкенд не даст забронировать мест больше, чем указано здесь.</p>
          </div>

          <button type="submit" disabled={loading} className="w-full py-5 bg-sky-500 text-white rounded-2xl font-black text-xl shadow-lg shadow-sky-500/30 md:col-span-2 hover:bg-sky-600 transition-colors flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin w-6 h-6"/> : "Опубликовать в БД"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default GuideDashboard;
