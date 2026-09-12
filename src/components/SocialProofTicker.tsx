import React from 'react';
import { BookOpen } from 'lucide-react';

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
      
      <div className="max-w-7xl mx-auto px-6 mb-5 flex flex-col items-center text-center gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-300 shadow-xs">
          <BookOpen className="w-3.5 h-3.5 text-cyan-600" />
          <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-slate-700">
            Curated Reading List • Not Press Features
          </span>
        </div>
        <h2 className="font-display text-sm sm:text-base font-black uppercase tracking-[0.2em] text-slate-950">
          Publications I Follow Weekly
        </h2>
        <p className="font-sans text-xs text-slate-600 font-semibold tracking-wide max-w-xl leading-relaxed">
          Industry journals and research sources I read each week to stay ahead of proven shifts in advertising, search, and buyer psychology.
        </p>
      </div>

      <div className="flex overflow-hidden">
        <div className="flex gap-8 sm:gap-10 items-center whitespace-nowrap animate-[marquee_24s_linear_infinite] hover:[animation-play-state:paused] py-2 cursor-default">
          {scrollLogos.map((logo, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-3 shrink-0 group px-4 py-2 rounded-xl bg-white border border-slate-200/90 shadow-sm hover:border-cyan-500/50 transition-all duration-300"
            >
              <div className="flex flex-col text-left">
                <span className="font-mono text-[8px] uppercase tracking-wider text-cyan-700 font-extrabold flex items-center gap-1">
                  Followed Weekly
                </span>
                <span className="font-display text-sm sm:text-base font-black tracking-wider text-slate-900 group-hover:text-cyan-700 transition-colors duration-300">
                  {logo.name}
                </span>
              </div>
              <span className="font-mono text-[9px] font-bold text-slate-600 border border-slate-200 rounded px-2 py-0.5 bg-slate-50 group-hover:border-cyan-600 group-hover:bg-slate-950 group-hover:text-brand-cyan transition-colors duration-300">
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
          animation: marquee 24s linear infinite;
        }
      `}</style>
    </section>
  );
}
