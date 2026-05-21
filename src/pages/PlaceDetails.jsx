import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, CheckCircle, ShieldAlert, Send, Mountain, Loader2 } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

const PlaceDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [review, setReview] = useState('');
  const [bookDate, setBookDate] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' }); // type: 'success' | 'error'

  useEffect(() => {
    api.getPlaceById(id)
      .then(data => { setPlace(data); setLoading(false); })
      .catch(err => { setMsg({ text: err.message, type: 'error' }); setLoading(false); });
  }, [id]);

  const showMsg = (text, type) => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 5000);
  };

  const handleCheckIn = async () => {
    if (!user) return showMsg('Войдите в систему для чекина!', 'error');
    try {
      const res = await api.checkIn(id);
      showMsg(res.message, 'success');
    } catch (err) {
      showMsg(err.message, 'error');
    }
  };

  const handleReview = async () => {
    if (!user) return showMsg('Войдите в систему!', 'error');
    if (!review.trim()) return;
    try {
      const res = await api.addReview(id, review);
      showMsg(res.message, 'success');
      setReview('');
    } catch (err) {
      showMsg(err.message, 'error');
    }
  };

  const handleBooking = async () => {
    if (!user) return showMsg('Войдите в систему!', 'error');
    if (!bookDate) return showMsg('Выберите дату!', 'error');
    try {
      // 1 - это ID тестовой услуги (юрта). В идеале тут нужен выбор услуги из списка.
      const res = await api.bookService(1, bookDate); 
      showMsg(res.message, 'success');
    } catch (err) {
      showMsg(err.message, 'error'); // Здесь выстрелит ОВЕРБУКИНГ если мест нет
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-16 h-16 animate-spin text-emerald-500"/></div>;
  if (!place) return <div className="text-center pt-32 text-2xl font-bold">Место не найдено.</div>;

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {msg.text && (
        <motion.div initial={{ opacity:0, y:-20 }} animate={{opacity:1, y:0}} className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-2xl font-bold text-white shadow-xl ${msg.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`}>
          {msg.text}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-[3rem] overflow-hidden shadow-2xl border border-white">
        <div className="h-[400px] relative bg-slate-200">
          <img src={place.image_url || `https://source.unsplash.com/1200x400/?nature,kyrgyzstan,${place.id}`} className="w-full h-full object-cover" alt={place.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex items-end p-10">
            <div className="text-white">
              <span className="bg-emerald-500 px-4 py-2 rounded-xl font-bold text-sm mb-4 inline-block shadow-lg">{place.region}</span>
              <h1 className="text-5xl md:text-6xl font-black">{place.name}</h1>
              <p className="mt-2 text-lg text-slate-300 max-w-2xl">{place.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 p-10">
          <div className="col-span-1 space-y-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <h3 className="text-2xl font-black mb-4 flex items-center gap-2"><MapPin/> Геймификация</h3>
              <button onClick={handleCheckIn} className="w-full py-4 rounded-2xl font-black text-lg text-white shadow-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:scale-105 transition-all">
                Сделать Check-in
              </button>
            </div>

            <div className="bg-sky-50 p-6 rounded-3xl border border-sky-100">
              <h3 className="text-2xl font-black mb-4 flex items-center gap-2"><Calendar/> Бронь Услуг</h3>
              <input type="date" className="w-full p-4 rounded-xl mb-4 outline-none" value={bookDate} onChange={e => setBookDate(e.target.value)} />
              <button onClick={handleBooking} className="w-full py-4 bg-sky-600 text-white rounded-2xl font-black hover:bg-sky-700 transition-colors shadow-lg">Забронировать</button>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-black mb-6 flex items-center gap-3">
              Отзывы <span className="text-sm px-3 py-1 bg-amber-100 text-amber-700 rounded-lg flex items-center gap-1"><ShieldAlert className="w-4 h-4"/> ИИ-Модерация</span>
            </h3>
            
            <div className="bg-slate-50 p-6 rounded-3xl mb-8 border border-slate-100 flex flex-col gap-4">
              <textarea 
                rows="3" placeholder="Напишите отзыв... (попробуйте использовать слово 'дурак' или 'спам')" 
                className="w-full bg-white p-4 rounded-2xl outline-none resize-none border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                value={review} onChange={(e) => setReview(e.target.value)}
              ></textarea>
              <button onClick={handleReview} className="self-end px-8 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg">
                Отправить <Send className="w-4 h-4"/>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PlaceDetails;
