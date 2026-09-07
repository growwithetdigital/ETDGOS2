import React from 'react';
import { ShieldAlert, ShieldCheck, XCircle, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface ComparisonSectionProps {
  onOpenBooking?: () => void;
}

export default function ComparisonSection({ onOpenBooking }: ComparisonSectionProps) {
  const frustrations = [
    { title: 'Random Posting', desc: 'Content is created on a whim, with no structural distribution matrix or thematic alignment.' },
    { title: 'No Consistency', desc: 'Campaigns start and stall, causing search engines and social algorithms to flag your profiles as inactive.' },
    { title: 'Weak SEO Presence', desc: 'Disconnected articles fail to form keyword authority clusters, yielding zero rank value on high-intent search queries.' },
    { title: 'Scattered Tools', desc: 'Siloed logins across email, blog platforms, social builders, and trackers leak efficiency and team coordination.' },
    { title: 'No Measurable Process', desc: 'Attribution is blind. You have no objective evidence of which content pieces generate your lead inquiries.' }
  ];

  const benefits = [
    { title: 'One Operating System', desc: 'A unified strategic engine that runs your entire growth portfolio symmetrically from a single master view.' },
    { title: 'One Source of Truth', desc: 'Your core expertise is locked in a clean, searchable Knowledge Base that drives and standardizes every output.' },
    { title: 'Automated Distribution', desc: 'A single validated idea propagates across all vital channels instantly, formatted perfectly per platform.' },
    { title: 'Continuous Optimization', desc: 'Closed feedback loops refactor your strategy, targeting emerging search phrases and high-yield buyer paths.' },
    { title: 'Clear Reporting Logs', desc: 'Every pipeline lead is traced back directly to its original strategic insight, proving definite ROI.' }
  ];

  return (
    <section id="philosophy" className="py-24 bg-slate-950 border-b border-slate-900/50 relative overflow-hidden select-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.01)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-cyan bg-cyan-950/40 border border-brand-cyan/20 px-3.5 py-1.5 rounded-full inline-block mb-4">
            Strategic Contrast
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
            The Operating System Shift
          </h2>
          <p className="font-sans text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Why growing companies are retiring the traditional "ad-hoc marketing agency" model in favor of a centralized growth engine.
          </p>
        </div>

        {/* Side-by-Side Comparison Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Frustrations: Without Growth OS */}
          <div className="bg-slate-900/10 rounded-3xl border border-red-950/30 p-8 shadow-sm relative overflow-hidden flex flex-col justify-between">
            {/* Red accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-600/60" />
            
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-xl bg-red-950/40 text-red-450 border border-red-900/20">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white tracking-tight">
                    Traditional Approach
                  </h3>
                  <p className="font-mono text-[9px] text-red-400 uppercase tracking-widest font-bold">
                    Random Acts of Marketing
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {frustrations.map((frust, idx) => (
                  <div key={idx} className="flex gap-4">
                    <XCircle className="w-4 h-4 text-red-500/80 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-display text-sm font-bold text-slate-200 leading-snug">
                        {frust.title}
                      </h4>
                      <p className="font-sans text-xs text-slate-400 mt-1 leading-relaxed">
                        {frust.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-900/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Average efficiency leak: 40-60%</span>
              <span className="text-red-400/80 font-bold uppercase tracking-wider text-[9px]">Leaking Budget</span>
            </div>
          </div>

          {/* Benefits: With ET Digital Growth OS */}
          <div className="bg-slate-900/20 rounded-3xl border border-slate-900 p-8 shadow-xl relative overflow-hidden flex flex-col justify-between text-slate-300">
            {/* Cyan accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-cyan" />
            {/* Subtle overlay glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.04)_0%,transparent_60%)] pointer-events-none" />

            <div>
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="p-2.5 rounded-xl bg-cyan-950/40 text-brand-cyan border border-brand-cyan/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white tracking-tight">
                    ET Digital Growth OS™
                  </h3>
                  <p className="font-mono text-[9px] text-brand-cyan uppercase tracking-widest font-bold">
                    The Operating System Model
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-6 relative z-10">
                {benefits.map((ben, idx) => (
                  <div key={idx} className="flex gap-4">
                    <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-display text-sm font-bold text-white leading-snug">
                        {ben.title}
                      </h4>
                      <p className="font-sans text-xs text-slate-400 mt-1 leading-relaxed">
                        {ben.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 font-mono relative z-10">
              <span>Strategic leverage index: 98%</span>
              <span className="text-brand-cyan font-bold uppercase tracking-wider text-[9px]">Predictable Scaling</span>
            </div>
          </div>

        </div>

        {/* Summary Statement */}
        <div className="mt-16 text-center max-w-3xl mx-auto border border-dashed border-slate-900 rounded-2xl p-6 bg-slate-900/5">
          <p className="font-sans text-xs sm:text-sm text-slate-400 leading-relaxed italic">
            "Running your marketing without a centralized OS is like writing application code without a runtime framework. You waste effort rebuilding low-level services instead of delivering real user value."
          </p>
        </div>

        {/* Let's Connect Quick Action */}
        {onOpenBooking && (
          <div className="mt-10 text-center flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="font-sans text-xs sm:text-sm text-slate-400">
              Want to see how this operating system applies to your business?
            </span>
            <button
              type="button"
              onClick={onOpenBooking}
              className="group inline-flex items-center justify-center bg-cyan-950/60 hover:bg-cyan-900/60 text-brand-cyan border border-brand-cyan/30 hover:border-brand-cyan font-display text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
              id="comparison-connect-btn"
            >
              <span>Let's Connect</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1 text-brand-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
