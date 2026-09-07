import React from 'react';
import { motion } from 'motion/react';
import { Eye, Compass, Rocket, TrendingUp, ArrowUpRight } from 'lucide-react';

interface HowWeBuildGrowthProps {
  onOpenBooking?: () => void;
}

export default function HowWeBuildGrowth({ onOpenBooking }: HowWeBuildGrowthProps) {
  const steps = [
    {
      step: '01',
      title: 'Discover',
      description: 'We audit your present client footprint, reverse-engineer competitor pipelines, and map your high-value audience segments.',
      icon: Eye,
    },
    {
      step: '02',
      title: 'Design',
      description: 'We architect a high-converting digital engine—engineering premium landing pages, copy frameworks, and inbound client systems.',
      icon: Compass,
    },
    {
      step: '03',
      title: 'Launch',
      description: 'We deploy target-focused campaigns, content playbooks, and custom automations built to capture and warm decision-maker attention.',
      icon: Rocket,
    },
    {
      step: '04',
      title: 'Scale',
      description: 'We measure, optimize, and compound performance metrics—continuously improving direct ROI and expanding market dominance.',
      icon: TrendingUp,
    }
  ];

  return (
    <section id="methodology" className="py-24 bg-black border-y border-slate-900 relative overflow-hidden select-none">
      {/* Dynamic Backgrounds */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0891b20a_1px,transparent_1px),linear-gradient(to_bottom,#0891b20a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-brand-cyan/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-[500px] h-[300px] bg-cyan-950/15 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="font-mono text-[10px] font-extrabold uppercase tracking-[0.25em] text-brand-cyan bg-cyan-950/40 border border-brand-cyan/20 px-3.5 py-1.5 rounded-full inline-block mb-4">
            Our Growth Methodology
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight text-white mb-6 uppercase">
            How We Build Growth
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A precise, logical execution framework engineered to convert attention into repeatable, high-ticket revenue pipelines.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative max-w-6xl mx-auto">
          {/* Connecting line for desktop layout */}
          <div className="hidden lg:block absolute top-[140px] left-[12%] right-[12%] h-[1px] border-t border-dashed border-slate-800 pointer-events-none z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-slate-700/90 rounded-3xl p-8 transition-all duration-500 group overflow-hidden hover:border-brand-cyan hover:shadow-[0_0_35px_rgba(6,182,212,0.25)] shadow-xl"
                >
                  {/* Top Cyan Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-cyan via-cyan-300 to-brand-cyan opacity-80 group-hover:opacity-100 transition-opacity" />

                  {/* Step indicator in back */}
                  <div className="absolute -top-3 -right-1 font-display text-8xl font-black text-slate-700/40 select-none pointer-events-none transition-all duration-500 group-hover:text-brand-cyan/20 group-hover:scale-105">
                    {item.step}
                  </div>

                  <div className="relative z-10">
                    {/* Header Row: Icon Badge + Step Pill */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="p-3.5 bg-slate-950 rounded-2xl border-2 border-brand-cyan/50 text-brand-cyan shadow-lg shadow-cyan-950/50 transition-transform duration-500 group-hover:scale-110 group-hover:border-brand-cyan">
                        <Icon className="w-6 h-6 stroke-[2]" />
                      </div>

                      <span className="font-mono text-[10px] font-black uppercase tracking-wider text-slate-950 bg-brand-cyan px-3 py-1 rounded-full shadow-md shadow-cyan-950/40">
                        PHASE {item.step}
                      </span>
                    </div>

                    {/* Step Name */}
                    <h3 className="font-display text-2xl font-black text-white mb-3 uppercase tracking-tight transition-colors duration-500 group-hover:text-brand-cyan">
                      {item.title}
                    </h3>

                    {/* Step Description */}
                    <p className="font-sans text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Let's Connect CTA callout */}
        {onOpenBooking && (
          <div className="mt-16 text-center flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <span className="font-sans text-xs sm:text-sm text-slate-300">
              Ready to deploy this 4-step framework for your business?
            </span>
            <button
              type="button"
              onClick={onOpenBooking}
              className="group inline-flex items-center justify-center bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              id="methodology-connect-btn"
            >
              <span>Let's Connect</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1.5 text-slate-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
