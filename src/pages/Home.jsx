import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, MapPin, Award, Navigation } from 'lucide-react';

const Home = () => {
  return (
    <div className="pt-32 pb-20 px-4 min-h-screen flex flex-col items-center justify-center relative">
      <div className="max-w-7xl mx-auto w-full text-center z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm mb-6 border border-emerald-200 shadow-sm">
            <Sparkles className="w-4 h-4" /> ИИ-Платформа туризма
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
            Открой для себя <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500">
              Сердце Азии
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 max-w-3xl mx-auto font-medium mb-10">
            Интеллектуальные маршруты, защита от овербукинга и геймификация путешествий по Кыргызстану.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/smart-route">
              <button className="w-full sm:w-auto px-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-2xl shadow-slate-900/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                <Navigation className="w-6 h-6" /> Нейро-Маршрут
              </button>
            </Link>
            <Link to="/places">
              <button className="w-full sm:w-auto px-8 py-5 bg-white text-slate-800 border border-slate-200 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                Каталог мест <ArrowRight className="w-6 h-6" />
              </button>
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            { icon: <MapPin />, title: "Умный поиск", desc: "Нечеткий поиск исправит опечатки (иссыкул -> Иссык-Куль)." },
            { icon: <Award />, title: "Геймификация", desc: "Чекиньтесь в локациях и получайте уникальные достижения." },
            { icon: <Sparkles />, title: "Модерация", desc: "Алгоритмы отсекают токсичные отзывы и спам." }
          ].map((feature, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-lg hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">{feature.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
