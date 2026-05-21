import React from 'react';

const AnimatedBackground = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden bg-slate-50 pointer-events-none">
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-300/40 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse"></div>
    <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-sky-300/40 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
    <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-teal-300/40 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse" style={{ animationDelay: '4s' }}></div>
  </div>
);

export default AnimatedBackground;
