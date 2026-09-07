import React from 'react';

export default function SocialProofTicker() {
  const logos = [
    { name: 'AD AGE', industry: 'Advertising' },
    { name: 'ADWEEK', industry: 'Media' },
    { name: 'MARKETING WEEK', industry: 'Strategy' },
    { name: 'DIGIDAY', industry: 'Digital' },
    { name: 'HARVARD BUSINESS REVIEW', industry: 'Leadership' },
    { name: 'THINK WITH GOOGLE', industry: 'Insights' },
  ];

  // Duplicate for seamless infinite loop scroll
  const scrollLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <section id="social-ticker" className="py-10 bg-slate-100 border-y-2 border-slate-300/80 overflow-hidden relative select-none shadow-inner">
      {/* Side gradient fade masks matching light section background */}
      <div className="absolute inset-y-0 left-0 w-20 sm:w-32 bg-gradient-to-r from-slate-100 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 sm:w-32 bg-gradient-to-l from-slate-100 to-transparent z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 mb-5 flex flex-col items-center text-center gap-1">
        <div className="flex items-center gap-2 justify-center">
          <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse" />
          <h2 className="font-display text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-slate-950">
            Staying Current
          </h2>
        </div>
        <p className="font-sans text-xs text-slate-600 font-semibold tracking-wide max-w-xl leading-relaxed">
          The publications I read every week to stay ahead of what's actually working in marketing.
        </p>
      </div>

      <div className="flex overflow-hidden">
        <div className="flex gap-12 sm:gap-16 items-center whitespace-nowrap animate-[marquee_20s_linear_infinite] hover:[animation-play-state:paused] py-2 cursor-pointer">
          {scrollLogos.map((logo, idx) => (
            <div key={idx} className="flex items-center gap-2.5 shrink-0 group">
              <span className="font-display text-sm sm:text-base font-black tracking-[0.2em] text-slate-900 group-hover:text-cyan-700 transition-colors duration-300">
                {logo.name}
              </span>
              <span className="font-mono text-[9px] font-extrabold text-slate-700 border border-slate-300 rounded-md px-2 py-0.5 bg-white shadow-sm group-hover:border-cyan-600 group-hover:bg-slate-950 group-hover:text-brand-cyan transition-colors duration-300">
                {logo.industry}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add custom keyframe styles in line or class as needed, let's inject it into tailwind @keyframes in code */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
