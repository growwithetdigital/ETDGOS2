import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  Calendar, 
  Layers, 
  Search, 
  Cpu, 
  BarChart3, 
  ShieldCheck, 
  ArrowUpRight 
} from 'lucide-react';
import { UserProfile } from '../types';

interface GrowthOSAccessBannerProps {
  user?: any;
  profile?: UserProfile | null;
  onOpenAuthModal: () => void;
  onOpenDashboard: () => void;
  onOpenBooking: () => void;
  onOpenCalendar?: () => void;
}

export default function GrowthOSAccessBanner({
  user,
  profile,
  onOpenAuthModal,
  onOpenDashboard,
  onOpenBooking,
  onOpenCalendar
}: GrowthOSAccessBannerProps) {
  const capabilities = [
    {
      icon: Layers,
      title: 'Centralized Growth Whiteboard',
      description: 'An interactive operational canvas mapping your strategic milestones, content matrix, and high-converting search queries in real time.'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Diagnostic Vault',
      description: 'Persistent tracking of your channel audits, Core Web Vitals, schema entity taxonomies, and technical visibility benchmarks.'
    },
    {
      icon: Cpu,
      title: 'AI Search & Content Engine',
      description: 'High-authority search blueprints, cross-platform social copy structures, and branded visual asset synthesis tailored to your niche.'
    }
  ];

  return (
    <section id="growth-operating-system" className="py-24 bg-[#070b14] border-b border-slate-900 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-cyan/[0.03] blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-10 right-0 w-96 h-96 bg-brand-cyan/[0.02] blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.25em] text-brand-cyan bg-cyan-950/50 border border-brand-cyan/25 px-4 py-1.5 rounded-full mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan animate-pulse" />
            <span>Proprietary Client Architecture</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-6">
            The ET Digital Growth Operating System™
          </h2>

          <p className="font-sans text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The collaborative digital engine behind every client partnership. Connect diagnostic intelligence, high-intent search authority, and execution roadmaps inside a single centralized workspace.
          </p>
        </div>

        {/* 3 Pillar Capabilities Grid (No tiers, no pricing) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-14">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-xl"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center text-brand-cyan mb-6 shadow-inner">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-3">
                    {cap.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Central Sign In & Strategy Banner */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900 to-slate-950 border-2 border-brand-cyan/30 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left shadow-2xl shadow-cyan-950/30">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-brand-cyan uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Dedicated Client Access</span>
            </div>
            <h3 className="font-display text-2xl font-black text-white tracking-tight">
              Access Your Growth Operating System
            </h3>
            <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
              Sign in to manage your strategic whiteboard, view audit records, and collaborate on your digital marketing roadmap.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            {user ? (
              <button
                type="button"
                onClick={onOpenDashboard}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-xs font-black uppercase tracking-widest px-6 py-4 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                id="services-growth-os-launch-btn"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Launch My Growth OS</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-xs font-black uppercase tracking-widest px-6 py-4 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                id="services-growth-os-signin-btn"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Sign In to Growth OS</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenCalendar || onOpenBooking}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 font-display text-xs font-bold uppercase tracking-widest px-6 py-4 rounded-xl transition-all active:scale-95 cursor-pointer"
              id="services-growth-os-strategy-btn"
            >
              <Calendar className="w-4 h-4 text-brand-cyan" />
              <span>Schedule Strategy Call</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
