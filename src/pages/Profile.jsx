import React from 'react';
import { motion } from 'framer-motion';
import { User, Award, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth(); // Берем реального юзера из контекста (localStorage)

  // База возможных ачивок и их дизайна
  const allBadges = {
    'Покоритель озер': { desc: 'Посетил Иссык-Куль, Сон-Куль и Сары-Челек', color: 'from-sky-100 to-blue-100', text: 'text-blue-700' },
    'Горный трекер': { desc: 'Покорил 3 маршрута сложности 4+', color: 'from-amber-100 to-orange-100', text: 'text-orange-700' }
  };

  // Если у юзера нет ачивок, даем пустой массив
  const userAchievements = user?.achievements || [];

  return (
    <div className="pt-32 pb-20 px-4 max-w-6xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 bg-slate-900 text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-screen filter blur-[80px] opacity-50"></div>
          <div className="w-32 h-32 bg-white rounded-[2rem] flex items-center justify-center text-slate-900 mb-8 z-10 relative shadow-xl transform -rotate-6">
            <User className="w-16 h-16" />
          </div>
          <h2 className="text-4xl font-black mb-2 relative z-10 truncate">{user?.username}</h2>
          <p className="text-emerald-400 font-bold mb-8 relative z-10 uppercase tracking-widest text-sm">
            Роль: {user?.role}
          </p>
          
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 relative z-10">
            <p className="text-sm font-bold text-slate-300 uppercase mb-1">Заработано ачивок</p>
            <p className="text-5xl font-black">{userAchievements.length}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-[3rem] p-10 shadow-xl border border-white">
          <div className="flex items-center gap-4 mb-10 border-b border-slate-200 pb-6">
            <div className="p-4 bg-amber-100 text-amber-500 rounded-2xl"><Award className="w-10 h-10" /></div>
            <div>
              <h3 className="text-3xl font-black text-slate-900">Стена Достижений</h3>
              <p className="text-slate-500 font-medium">Геймификация: чекиньтесь, чтобы открывать новые бейджи</p>
            </div>
          </div>
          
          {userAchievements.length === 0 ? (
             <div className="text-center p-10 bg-slate-50 rounded-3xl border border-slate-100">
               <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
               <h4 className="text-xl font-bold text-slate-700">У вас пока нет достижений</h4>
               <p className="text-slate-500 mt-2">Путешествуйте и отмечайтесь в локациях!</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {userAchievements.map((badgeName, i) => {
                const badgeInfo = allBadges[badgeName] || { desc: 'Секретное достижение', color: 'from-slate-100 to-slate-200', text: 'text-slate-700' };
                return (
                  <motion.div whileHover={{ scale: 1.03 }} key={i} className={`p-6 rounded-3xl bg-gradient-to-br ${badgeInfo.color} border border-white shadow-sm flex items-start gap-4`}>
                    <CheckCircle className={`w-10 h-10 shrink-0 ${badgeInfo.text}`} />
                    <div>
                      <h4 className={`text-xl font-black mb-1 ${badgeInfo.text}`}>{badgeName}</h4>
                      <p className={`${badgeInfo.text} opacity-80 font-medium leading-tight`}>{badgeInfo.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
