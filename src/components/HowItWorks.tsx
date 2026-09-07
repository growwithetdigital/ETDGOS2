import React from 'react';
import { Search, Settings, Rocket, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

export default function HowItWorks() {
  const stages = [
    {
      step: '01',
      title: 'Discover',
      subtitle: 'Understand the landscape',
      description: 'Understand the business, audience, and growth opportunities.',
      icon: Search,
      illustration: (
        <svg viewBox="0 0 200 120" className="w-full h-24 stroke-current fill-none text-slate-500">
          {/* Circular search target scanning nodes */}
          <circle cx="100" cy="50" r="24" stroke="#1e293b" strokeWidth="1.5" />
          <circle cx="100" cy="50" r="14" stroke="#06b6d4" strokeWidth="2" className="animate-pulse" />
          <line x1="116" y1="66" x2="135" y2="85" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Floating client and market data nodes */}
          <circle cx="60" cy="40" r="3" fill="#334155" />
          <circle cx="140" cy="45" r="4.5" fill="#475569" />
          <circle cx="90" cy="80" r="3.5" fill="#334155" />
        </svg>
      )
    },
    {
      step: '02',
      title: 'Design',
      subtitle: 'Map out the core OS',
      description: 'Build a customized marketing operating system.',
      icon: Settings,
      illustration: (
        <svg viewBox="0 0 200 120" className="w-full h-24 stroke-current fill-none text-slate-500">
          {/* Architecture building blocks */}
          <rect x="50" y="70" width="100" height="25" rx="5" stroke="#1e293b" strokeWidth="1.5" />
          <rect x="70" y="40" width="60" height="22" rx="4" stroke="#06b6d4" strokeWidth="2" />
          <circle cx="100" cy="51" r="3.5" fill="#06b6d4" className="animate-ping" />
          
          {/* Connecting vertical flows */}
          <path d="M 100 62 L 100 70" stroke="#06b6d4" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      step: '03',
      title: 'Launch',
      subtitle: 'Deploy and propagate',
      description: 'Deploy campaigns, websites, automations, and content.',
      icon: Rocket,
      illustration: (
        <svg viewBox="0 0 200 120" className="w-full h-24 stroke-current fill-none text-slate-500">
          {/* Launch velocity curves */}
          <path d="M 40 90 Q 100 50, 160 30" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="4 4" />
          <path d="M 60 90 Q 110 40, 170 15" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
          
          {/* Pulse circles representing nodes propagating */}
          <circle cx="170" cy="15" r="5" fill="#06b6d4" />
          <circle cx="170" cy="15" r="10" stroke="#06b6d4" strokeWidth="1" className="opacity-30 animate-ping" />
        </svg>
      )
    },
    {
      step: '04',
      title: 'Scale',
      subtitle: 'Continuous growth feedback',
      description: 'Measure performance, optimize continuously, and improve ROI over time.',
      icon: TrendingUp,
      illustration: (
        <svg viewBox="0 0 200 120" className="w-full h-24 stroke-current fill-none text-slate-500">
          {/* Scale growth upward trending barcharts */}
          <path d="M 30 95 L 170 95" stroke="#1e293b" strokeWidth="1.5" />
          <path d="M 40 85 L 75 70 L 110 50 L 155 20" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="155" cy="20" r="5.5" fill="#06b6d4" />
          
          <text x="115" y="40" className="font-mono text-[9px] fill-[#06b6d4] font-bold">+312%</text>
        </svg>
      )
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-950 border-b border-slate-900/50 relative overflow-hidden select-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.03)_0%,transparent_60%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-cyan bg-cyan-950/40 border border-brand-cyan/20 px-3.5 py-1.5 rounded-full inline-block mb-4">
            Methodology
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
            How We Build Growth
          </h2>
          <p className="font-sans text-base text-slate-400 max-w-2xl mx-auto">
            A precise, results-first framework engineered to move your marketing operations from unstructured campaigns to a unified scaling engine.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative bg-slate-900/20 hover:bg-slate-900/50 rounded-3xl border border-slate-900 hover:border-brand-cyan/25 p-6 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
                id={`how-it-works-step-${stage.step}`}
              >
                <div>
                  {/* Step counter & Icon header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-3xl font-extrabold text-slate-850 group-hover:text-brand-cyan/25 transition-colors">
                      {stage.step}
                    </span>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-900 text-slate-400 group-hover:border-brand-cyan/40 group-hover:text-brand-cyan transition-all duration-300 shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Text Content */}
                  <h3 className="font-display text-lg font-bold text-white tracking-tight mb-1">
                    {stage.title}
                  </h3>
                  <div className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                    {stage.subtitle}
                  </div>
                  <p className="font-sans text-xs text-slate-400 leading-relaxed">
                    {stage.description}
                  </p>
                </div>

                {/* Abstract Vector Illustration */}
                <div className="mt-8 pt-4 border-t border-slate-900/60 flex items-center justify-center bg-slate-950/20 rounded-2xl group-hover:bg-slate-950/50 transition-colors p-4">
                  {stage.illustration}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Highlight Callout */}
        <div className="mt-16 text-center max-w-2xl mx-auto border border-dashed border-slate-900 rounded-2xl p-6 bg-slate-900/5">
          <p className="font-sans text-xs text-slate-400 leading-relaxed">
            <strong className="text-white">Continuous Operational Execution:</strong> Every phase operates inside a closed feedback loop, ensuring absolute clarity and strategic optimization on every growth dollar spent.
          </p>
        </div>

      </div>
    </section>
  );
}
