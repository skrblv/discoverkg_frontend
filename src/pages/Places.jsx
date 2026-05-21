import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Mountain, Loader2 } from 'lucide-react';
import { api } from '../api'; 

const Places = () => {
  const [places, setPlaces] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // РЕАЛЬНЫЙ ЗАПРОС К FLASK
  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const data = await api.getPlaces(search);
        setPlaces(data.places); 
      } catch (error) {
        console.error("Ошибка при получении данных из БД:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const delayDebounce = setTimeout(() => {
      fetchPlaces();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
      {/* Заголовок и поиск */}
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-black text-slate-900 mb-6"
        >
          Каталог локаций
        </motion.h2>
        <div className="max-w-2xl mx-auto relative group">
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по базе (иссыкул, ала-арча)..." 
            className="w-full pl-14 pr-6 py-5 rounded-3xl bg-white shadow-xl border border-slate-100 focus:ring-4 focus:ring-emerald-500/20 outline-none text-lg transition-all"
          />
          <Search className="absolute left-5 top-5 text-emerald-500 w-7 h-7" />
        </div>
      </div>

      {/* Сетка карточек */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <Loader2 className="animate-spin h-12 w-12 text-emerald-500 mb-4" />
          <p className="text-slate-500 font-bold tracking-widest">ЗАГРУЗКА...</p>
        </div>
      ) : places.length === 0 ? (
        <div className="text-center py-20 bg-white/50 backdrop-blur rounded-[3rem] border border-dashed border-slate-300">
          <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-500">Ничего не найдено</h3>
          <p className="text-slate-400">Попробуйте изменить запрос</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {places.map((place, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.05 }} 
              key={place.id}
            >
              <Link to={`/places/${place.id}`}>
                <div className="bg-white h-full rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-slate-100 flex flex-col">
                  {/* ИЗОБРАЖЕНИЕ ИЗ БАЗЫ ДАННЫХ */}
                  <div className="relative h-56 overflow-hidden bg-slate-200">
                    <img 
                      src={place.image_url || 'https://via.placeholder.com/600x400?text=Нет+фотографии'} 
                      alt={place.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-sm font-black text-emerald-700 shadow-lg flex items-center gap-2">
                      <Mountain className="w-4 h-4"/> Уровень: {place.difficulty}/5
                    </div>
                  </div>

                  {/* ТЕКСТ ИЗ БАЗЫ ДАННЫХ */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors leading-tight">
                        {place.name}
                      </h3>
                      <p className="text-slate-500 font-medium flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-sky-500 shrink-0" /> 
                        {place.region}
                      </p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                        <span>{place.type === 'nature' ? 'Природа' : 'Культура'}</span>
                        {place.requires_auto && <span className="text-rose-500">Нужен Джип</span>}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Places;
