import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Lightbulb, Database, Activity, FileText, Globe, 
  Share2, MapPin, Mail, BarChart3, TrendingUp, Play 
} from 'lucide-react';

export default function SystemFlowDiagram() {
  const [activeStage, setActiveStage] = useState<number>(-1);
  const [isLooping, setIsLooping] = useState(false);

  const steps = [
    { id: 0, label: 'Ideas', desc: 'Raw founder wisdom', icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
    { id: 1, label: 'Knowledge Base', desc: 'Structured truth library', icon: Database, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
    { id: 2, label: 'Growth OS™', desc: 'Central process engine', icon: Activity, color: 'text-brand-cyan', bg: 'bg-cyan-50', border: 'border-cyan-200' },
    // Channels grouped at index 3
    { id: 3, label: 'Omni-Channels', desc: 'Symmetric propagation', isGroup: true },
    { id: 4, label: 'Reporting', desc: 'Closed feedback logs', icon: BarChart3, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    { id: 5, label: 'Business Growth', desc: 'Continuous market value', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' }
  ];

  const subChannels = [
    { label: 'Blog Articles', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'SEO Authority', icon: Globe, color: 'text-sky-600', bg: 'bg-sky-50' },
    { label: 'Social Media', icon: Share2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Google Business', icon: MapPin, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Email Newsletter', icon: Mail, color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  const triggerFlowSimulation = () => {
    if (isLooping) return;
    setIsLooping(true);
    setActiveStage(0);
  };

  useEffect(() => {
    if (activeStage === -1) return;

    if (activeStage < 5) {
      const timer = setTimeout(() => {
        setActiveStage(prev => prev + 1);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setActiveStage(-1);
        setIsLooping(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [activeStage]);

  return (
    <section id="system-flow" className="py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-cyan bg-cyan-50 px-3.5 py-1.5 rounded-full inline-block mb-4">
            Signature Asset
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
            The Connected Growth Flow™
          </h2>
          <p className="font-sans text-lg text-slate-600">
            A single insight propagates outward, feeds every vital channel simultaneously, logs analytics performance, and directly triggers compound business value.
          </p>
        </div>

        {/* Dynamic Connected Flow Area */}
        <div className="bg-slate-50/60 rounded-3xl border border-slate-200 p-8 md:p-12 max-w-5xl mx-auto relative overflow-hidden">
          {/* Subtle background lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-60 pointer-events-none" />

          {/* Interactive Trigger Button */}
          <div className="flex justify-center mb-12">
            <button
              onClick={triggerFlowSimulation}
              disabled={isLooping}
              className={`group flex items-center gap-2.5 font-display text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-xl border shadow-sm transition-all cursor-pointer ${
                isLooping
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white hover:bg-slate-950 hover:text-white hover:border-slate-950 border-slate-200 text-slate-800'
              }`}
            >
              <Play className={`w-3.5 h-3.5 ${isLooping ? 'animate-pulse text-slate-400' : 'text-brand-cyan group-hover:text-cyan-400'}`} />
              {isLooping ? 'Simulation Running...' : 'Simulate Life-cycle Pulse'}
            </button>
          </div>

          {/* Connected Flow Diagram Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            
            {/* Stage 1: Ideas */}
            <div className="md:col-span-2 flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full border flex items-center justify-center transition-all duration-500 bg-white relative ${
                activeStage === 0 
                  ? 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-2 ring-amber-400/20 text-amber-500 scale-105' 
                  : 'border-slate-200 text-slate-400'
              }`}>
                <Lightbulb className="w-6 h-6" />
                {activeStage === 0 && <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />}
              </div>
              <h4 className="font-display text-xs font-bold text-slate-800 mt-3 text-center">Ideas</h4>
              <p className="font-sans text-[10px] text-slate-400 mt-1 text-center leading-tight">Raw executive insight</p>
            </div>

            {/* Link 1 */}
            <div className="md:col-span-1 flex justify-center items-center h-8 md:h-auto">
              <div className="w-12 h-0.5 bg-slate-200 relative overflow-hidden">
                {activeStage === 0 && (
                  <motion.div
                    initial={{ left: '-100%' }}
                    animate={{ left: '100%' }}
                    transition={{ duration: 1.2, ease: 'linear' }}
                    className="absolute top-0 bottom-0 w-1/2 bg-amber-400"
                  />
                )}
              </div>
            </div>

            {/* Stage 2: Knowledge Base */}
            <div className="md:col-span-2 flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full border flex items-center justify-center transition-all duration-500 bg-white relative ${
                activeStage === 1 
                  ? 'border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] ring-2 ring-blue-400/20 text-blue-500 scale-105' 
                  : 'border-slate-200 text-slate-400'
              }`}>
                <Database className="w-6 h-6" />
                {activeStage === 1 && <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-blue-500 animate-ping" />}
              </div>
              <h4 className="font-display text-xs font-bold text-slate-800 mt-3 text-center">Knowledge Base</h4>
              <p className="font-sans text-[10px] text-slate-400 mt-1 text-center leading-tight">Your source of truth</p>
            </div>

            {/* Link 2 */}
            <div className="md:col-span-1 flex justify-center items-center h-8 md:h-auto">
              <div className="w-12 h-0.5 bg-slate-200 relative overflow-hidden">
                {activeStage === 1 && (
                  <motion.div
                    initial={{ left: '-100%' }}
                    animate={{ left: '100%' }}
                    transition={{ duration: 1.2, ease: 'linear' }}
                    className="absolute top-0 bottom-0 w-1/2 bg-blue-400"
                  />
                )}
              </div>
            </div>

            {/* Stage 3: Growth OS */}
            <div className="md:col-span-2 flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full border flex items-center justify-center transition-all duration-500 bg-white relative ${
                activeStage === 2 
                  ? 'border-brand-cyan shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-2 ring-brand-cyan/20 text-brand-cyan scale-105' 
                  : 'border-slate-200 text-slate-400'
              }`}>
                <Activity className="w-6 h-6 animate-pulse" />
                {activeStage === 2 && <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-brand-cyan animate-ping" />}
              </div>
              <h4 className="font-display text-xs font-bold text-slate-800 mt-3 text-center">Growth OS™</h4>
              <p className="font-sans text-[10px] text-slate-400 mt-1 text-center leading-tight">Symmetric processing</p>
            </div>

            {/* Link 3 (Splits to channels on activeStage === 2) */}
            <div className="md:col-span-1 flex justify-center items-center h-8 md:h-auto">
              <div className="w-12 h-0.5 bg-slate-200 relative overflow-hidden">
                {activeStage === 2 && (
                  <motion.div
                    initial={{ left: '-100%' }}
                    animate={{ left: '100%' }}
                    transition={{ duration: 1.2, ease: 'linear' }}
                    className="absolute top-0 bottom-0 w-1/2 bg-brand-cyan"
                  />
                )}
              </div>
            </div>

            {/* Stage 4: Multi-Channels Group Box (3 Cols) */}
            <div className="md:col-span-3 flex flex-col gap-2 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm relative">
              <div className="font-mono text-[8px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-1.5 mb-2 text-center">
                Distribution Channels
              </div>
              <div className="flex flex-col gap-1.5">
                {subChannels.map((chan, idx) => {
                  const ChanIcon = chan.icon;
                  const isChannelActive = activeStage === 3;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-all duration-300 ${
                        isChannelActive
                          ? 'border-brand-cyan/25 bg-cyan-50/40 text-slate-900 shadow-[0_1px_5px_rgba(6,182,212,0.05)] translate-x-1'
                          : 'border-slate-50 bg-slate-50/20 text-slate-500'
                      }`}
                    >
                      <div className={`p-1 rounded ${chan.bg} ${chan.color}`}>
                        <ChanIcon className="w-3 h-3" />
                      </div>
                      <span className="font-sans text-[10px] font-bold">{chan.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Row 2 - Flow Loop back to beginning or through evaluating to Business Growth */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mt-8 pt-8 border-t border-slate-200/50">
            
            {/* Empty offset to match the right aligned channels column start */}
            <div className="hidden md:block md:col-span-4" />

            {/* Stage 5: Reporting */}
            <div className="md:col-span-2 flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full border flex items-center justify-center transition-all duration-500 bg-white relative ${
                activeStage === 4 
                  ? 'border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)] ring-2 ring-indigo-400/20 text-indigo-500 scale-105' 
                  : 'border-slate-200 text-slate-400'
              }`}>
                <BarChart3 className="w-6 h-6" />
                {activeStage === 4 && <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-indigo-500 animate-ping" />}
              </div>
              <h4 className="font-display text-xs font-bold text-slate-800 mt-3 text-center">Reporting</h4>
              <p className="font-sans text-[10px] text-slate-400 mt-1 text-center leading-tight">Attribution log analysis</p>
            </div>

            {/* Link 5 */}
            <div className="md:col-span-1 flex justify-center items-center h-8 md:h-auto">
              <div className="w-12 h-0.5 bg-slate-200 relative overflow-hidden">
                {activeStage === 4 && (
                  <motion.div
                    initial={{ left: '-100%' }}
                    animate={{ left: '100%' }}
                    transition={{ duration: 1.2, ease: 'linear' }}
                    className="absolute top-0 bottom-0 w-1/2 bg-indigo-400"
                  />
                )}
              </div>
            </div>

            {/* Stage 6: Business Growth (Final Conversion!) */}
            <div className="md:col-span-2 flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full border flex items-center justify-center transition-all duration-500 bg-white relative ${
                activeStage === 5 
                  ? 'border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-2 ring-emerald-400/20 text-emerald-500 scale-105' 
                  : 'border-slate-200 text-slate-400'
              }`}>
                <TrendingUp className="w-6 h-6" />
                {activeStage === 5 && <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />}
              </div>
              <h4 className="font-display text-xs font-bold text-slate-800 mt-3 text-center">Business Growth</h4>
              <p className="font-sans text-[10px] text-slate-400 mt-1 text-center leading-tight">Expanded authority pipelines</p>
            </div>

            {/* Link back loop to beginning */}
            <div className="md:col-span-3 flex flex-col justify-center items-center">
              <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider text-center mb-1">
                Completed feedback loop
              </div>
              <div className="w-32 h-6 border-b border-r border-dashed border-slate-300 rounded-br-xl relative">
                {activeStage === 5 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 shadow-sm"
                  />
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
