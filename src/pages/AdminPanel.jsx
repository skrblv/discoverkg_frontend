import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Shield, Plus, MapPin, Image as ImageIcon, Loader2 } from 'lucide-react';
import { api } from '../api';

const AdminPanel = () => {
  const [formData, setFormData] = useState({
    name: '', region: 'Иссык-Кульская обл.', description: '', 
    place_type: 'nature', difficulty: 1, requires_auto: false, image_url: ''
  });
  
  const [placesList, setPlacesList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Загружаем реальный список мест
  useEffect(() => {
    api.getPlaces().then(data => setPlacesList(data.places)).catch(console.error);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleAddPlace = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.addPlace(formData);
      alert('Успешно добавлено в базу!');
      // Обновляем список
      const updatedData = await api.getPlaces();
      setPlacesList(updatedData.places);
      setFormData({ ...formData, name: '', description: '', image_url: '' });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (type) => {
    try {
      await api.downloadReport(type);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center gap-4 mb-10 border-b border-slate-200 pb-6">
        <div className="p-4 bg-rose-100 text-rose-600 rounded-3xl shadow-sm"><Shield className="w-10 h-10" /></div>
        <div>
          <h2 className="text-4xl font-black text-slate-900">Терминал Администратора</h2>
          <p className="text-slate-500 font-medium mt-1">Полный контроль над БД.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-2xl">
            <h3 className="text-2xl font-black mb-6">Экспорт Pandas/FPDF</h3>
            <div className="space-y-4">
              <button onClick={() => handleDownload('excel')} className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors">
                <Download className="w-5 h-5"/> Скачать Excel (Pandas)
              </button>
              <button onClick={() => handleDownload('pdf')} className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors">
                <Download className="w-5 h-5"/> Скачать PDF Отчет
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl border border-white">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2"><MapPin className="text-emerald-500"/> Места в БД</h3>
            <div className="space-y-3 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {placesList.map(place => (
                <div key={place.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col group">
                  <h4 className="font-bold text-slate-900 truncate">{place.name}</h4>
                  <span className="text-xs text-slate-500">{place.region}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 bg-white/90 backdrop-blur-2xl rounded-[3rem] p-10 shadow-2xl border border-white relative">
          <h3 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl"><Plus className="w-6 h-6"/></div>
            Добавить новую локацию
          </h3>

          <form onSubmit={handleAddPlace} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-2">Название места</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-2">Регион</label>
                <select name="region" value={formData.region} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium">
                  <option>Иссык-Кульская обл.</option><option>Чуйская обл.</option><option>Нарынская обл.</option>
                  <option>Джалал-Абадская обл.</option><option>Ошская обл.</option><option>Таласская обл.</option><option>Баткенская обл.</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-500 mb-2">Описание</label>
              <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-medium"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-2">Тип туризма</label>
                <select name="place_type" value={formData.place_type} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                  <option value="nature">Природа</option><option value="culture">Культура</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-2">Сложность (1-5)</label>
                <input type="number" min="1" max="5" name="difficulty" value={formData.difficulty} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
              </div>
              <div className="flex flex-col justify-center items-center bg-rose-50 rounded-2xl border border-rose-100 p-2">
                <label className="text-sm font-bold text-rose-700 mb-1">Нужен Джип 4x4?</label>
                <input type="checkbox" name="requires_auto" checked={formData.requires_auto} onChange={handleInputChange} className="w-6 h-6 rounded cursor-pointer" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-2">URL Фотографии</label>
                <div className="relative">
                  <input type="url" name="image_url" value={formData.image_url} onChange={handleInputChange} placeholder="https://..." className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" />
                  <ImageIcon className="absolute left-4 top-4 text-slate-400 w-6 h-6" />
                </div>
              </div>
              <div className="h-32 rounded-2xl border-2 border-dashed border-slate-300 overflow-hidden bg-slate-50 flex items-center justify-center">
                {formData.image_url ? <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-slate-400 font-medium text-sm">Превью</span>}
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl font-black text-xl shadow-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 mt-8">
              {loading ? <Loader2 className="animate-spin w-6 h-6"/> : "Сохранить в БД"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;
