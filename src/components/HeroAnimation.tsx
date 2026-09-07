import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, Server, Share2, Globe, FileText, Send, BarChart2, Mail, Users, CheckCircle } from 'lucide-react';

interface Signal {
  id: number;
  label: string;
  progress: number; // 0 to 100
}

export default function HeroAnimation() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [activeStage, setActiveStage] = useState<'idle' | 'input' | 'processing' | 'distributing' | 'completed'>('idle');
  const [processedCount, setProcessedCount] = useState(0);
  const [currentIdeaText, setCurrentIdeaText] = useState('Founder’s Vision');

  const sampleIdeas = [
    'Founder’s Vision',
    'Customer Success Story',
    'New Industry Benchmark',
    'Product Launch Insight',
    'Strategic Case Study',
    'Expert Panel Takeaways'
  ];

  // Auto trigger a pulse every 5 seconds if idle
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeStage === 'idle') {
        triggerPulse();
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [activeStage]);

  const triggerPulse = (specificIdea?: string) => {
    if (activeStage !== 'idle' && activeStage !== 'completed') return;

    const idea = specificIdea || sampleIdeas[Math.floor(Math.random() * sampleIdeas.length)];
    setCurrentIdeaText(idea);
    setActiveStage('input');

    // Simulate flow steps
    setTimeout(() => {
      setActiveStage('processing');
    }, 1200);

    setTimeout(() => {
      setActiveStage('distributing');
    }, 3000);

    setTimeout(() => {
      setActiveStage('completed');
      setProcessedCount(prev => prev + 1);
    }, 4800);

    setTimeout(() => {
      setActiveStage('idle');
    }, 6500);
  };

  const outputChannels = [
    { label: 'Blog Article', icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-950/30', border: 'border-emerald-800/50' },
    { label: 'SEO Campaign', icon: Globe, color: 'text-indigo-400', bg: 'bg-indigo-950/30', border: 'border-indigo-800/50' },
    { label: 'LinkedIn Post', icon: Users, color: 'text-blue-400', bg: 'bg-blue-950/30', border: 'border-blue-800/50' },
    { label: 'Google Profile', icon: Share2, color: 'text-orange-400', bg: 'bg-orange-950/30', border: 'border-orange-800/50' },
    { label: 'Newsletter', icon: Mail, color: 'text-purple-400', bg: 'bg-purple-950/30', border: 'border-purple-800/50' },
    { label: 'Analytics Insights', icon: BarChart2, color: 'text-brand-cyan', bg: 'bg-cyan-950/30', border: 'border-cyan-800/50' }
  ];

  return (
    <div className="w-full bg-slate-900/50 rounded-2xl border border-slate-800 p-6 md:p-8 relative overflow-hidden shadow-2xl" id="hero-flow-simulator">
      {/* Decorative grid pattern in the background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(244,244,244,0.015)_1px,transparent_1px)] [background-size:16px_16px] opacity-70 pointer-events-none" />

      {/* Header Panel with statistics */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800/60 pb-4 mb-8">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${activeStage !== 'idle' ? 'bg-cyan-400' : 'bg-slate-700'}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${activeStage !== 'idle' ? 'bg-brand-cyan' : 'bg-slate-500'}`}></span>
          </span>
          <span className="font-mono text-[10px] tracking-wider uppercase text-slate-400 font-bold">
            Live System Monitor
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="font-mono text-xs text-slate-400">
            System State: <span className="text-white font-bold uppercase">{activeStage}</span>
          </div>
          <div className="font-mono text-xs text-slate-400">
            Assets Unified: <span className="text-brand-cyan font-bold">{processedCount * 6}</span>
          </div>
        </div>
      </div>

      {/* Main Flow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 lg:gap-2 items-center relative z-10">
        
        {/* Left Column: INPUTS (3 / 11) */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-3 justify-center">
          <div className="text-center lg:text-left mb-2">
            <h4 className="font-display text-sm font-bold tracking-tight text-white">
              Strategic Input
            </h4>
            <p className="font-sans text-xs text-slate-400">
              One central idea or strategy
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdeaText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-xl border bg-slate-950 flex flex-col gap-3 transition-shadow duration-300 shadow-lg ${
                activeStage === 'input' ? 'border-brand-cyan ring-2 ring-brand-cyan/20' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${activeStage === 'input' ? 'bg-cyan-950/40 text-brand-cyan' : 'bg-slate-900 text-slate-400'}`}>
                  <Lightbulb className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="font-mono text-[9px] font-semibold text-brand-cyan uppercase tracking-wider">
                    Source Document
                  </div>
                  <div className="font-sans text-xs font-bold text-white line-clamp-1">
                    {currentIdeaText}
                  </div>
                </div>
              </div>

              {/* Action indicators inside input */}
              <div className="bg-slate-900 rounded-lg p-2 flex flex-col gap-1 text-[10px] font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>Authenticity Index:</span>
                  <span className="text-slate-200 font-bold">100%</span>
                </div>
                <div className="flex justify-between">
                  <span>Author Intent:</span>
                  <span className="text-slate-200 font-bold">Captured</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Prompt Interaction seed buttons */}
          <div className="mt-2 flex flex-wrap gap-1.5 justify-center lg:justify-start">
            {sampleIdeas.slice(0, 3).map((idea, idx) => (
              <button
                key={idx}
                disabled={activeStage !== 'idle' && activeStage !== 'completed'}
                onClick={() => triggerPulse(idea)}
                className={`text-[10px] font-sans font-medium px-2 py-1 rounded border transition-all ${
                  activeStage !== 'idle' && activeStage !== 'completed'
                    ? 'border-slate-900 bg-slate-950 text-slate-600 cursor-not-allowed'
                    : 'border-slate-800 hover:border-brand-cyan hover:bg-cyan-950/20 text-slate-300 cursor-pointer'
                }`}
              >
                + {idea}
              </button>
            ))}
          </div>
        </div>

        {/* Column 4: Connector line to center (1 / 11) */}
        <div className="col-span-1 lg:col-span-1 flex lg:flex-col items-center justify-center h-8 lg:h-48">
          <div className="h-0.5 lg:h-32 w-16 lg:w-0.5 bg-slate-800 relative overflow-hidden">
            {activeStage === 'input' && (
              <motion.div
                initial={{ top: 0, height: 0, opacity: 1 }}
                animate={{ top: '100%', height: '100%', opacity: [1, 1, 0] }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                className="absolute left-0 right-0 w-full bg-brand-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              />
            )}
            {activeStage === 'input' && (
              <motion.div
                initial={{ left: 0, width: 0, opacity: 1 }}
                animate={{ left: '100%', width: '100%', opacity: [1, 1, 0] }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                className="absolute lg:hidden top-0 bottom-0 h-full bg-brand-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              />
            )}
          </div>
        </div>

        {/* Center Column: ET Digital Growth OS™ processing hub (3 / 11) */}
        <div className="col-span-1 lg:col-span-3 flex justify-center">
          <motion.div
            animate={{
              borderColor: activeStage === 'processing' ? 'rgba(6,182,212,0.5)' : 'rgba(30,41,59,0.8)',
              boxShadow: activeStage === 'processing' ? '0 10px 25px -5px rgba(6,182,212,0.2), 0 8px 10px -6px rgba(6,182,212,0.2)' : '0 1px 3px 0 rgba(0,0,0,0.05)'
            }}
            className="w-full max-w-[260px] p-6 rounded-2xl border bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden text-center"
          >
            {/* Spinning background circuit rings */}
            <div className="absolute inset-0 flex items-center justify-center opacity-15">
              <svg className="w-40 h-40 animate-spin-slow text-brand-cyan" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" strokeDasharray="5 10" fill="none" />
                <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1" strokeDasharray="20 40" fill="none" />
              </svg>
            </div>

            <div className={`p-4 rounded-full mb-3 border relative transition-all duration-300 ${
              activeStage === 'processing' 
                ? 'bg-slate-950 text-brand-cyan border-brand-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}>
              <Server className={`w-6 h-6 ${activeStage === 'processing' ? 'animate-pulse' : ''}`} />
              
              {/* Custom floating mini signals */}
              {activeStage === 'processing' && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-cyan"></span>
                </span>
              )}
            </div>

            <h3 className="font-display text-sm font-bold tracking-tight text-white leading-none">
              ET Digital Growth OS™
            </h3>
            <p className="font-mono text-[9px] text-slate-400 uppercase tracking-widest mt-1">
              Core operating matrix
            </p>

            {/* Status logs */}
            <div className="w-full mt-4 bg-slate-950 text-[10px] font-mono text-left p-3 rounded-lg text-slate-300 flex flex-col gap-1 min-h-[75px] justify-center shadow-inner">
              {activeStage === 'idle' && (
                <div className="text-slate-500 text-center py-2">System online.<br/>Awaiting idea input...</div>
              )}
              {activeStage === 'input' && (
                <div className="text-slate-400 animate-pulse">📥 Receiving core asset...</div>
              )}
              {activeStage === 'processing' && (
                <>
                  <div className="text-brand-cyan text-[9px]">⚙️ Refactoring strategy...</div>
                  <div className="text-slate-400 text-[9px]">🔍 Mapping SEO semantic core</div>
                  <div className="text-emerald-400 text-[9px] animate-pulse">⚡ Automating workflows</div>
                </>
              )}
              {activeStage === 'distributing' && (
                <>
                  <div className="text-brand-cyan text-[9px]">⚡ Amplifying assets...</div>
                  <div className="text-slate-400 text-[9px]">🚀 Initiating multi-channel distribution</div>
                </>
              )}
              {activeStage === 'completed' && (
                <div className="text-emerald-400 text-center flex items-center justify-center gap-1.5 py-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  Ecosystem Synchronized!
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Column 8: Connection lines to outputs (1 / 11) */}
        <div className="col-span-1 lg:col-span-1 flex lg:flex-col items-center justify-center h-8 lg:h-48">
          <div className="h-0.5 lg:h-32 w-16 lg:w-0.5 bg-slate-800 relative overflow-hidden">
            {activeStage === 'distributing' && (
              <motion.div
                initial={{ top: 0, height: 0, opacity: 1 }}
                animate={{ top: '100%', height: '100%', opacity: [1, 1, 0] }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                className="absolute left-0 right-0 w-full bg-brand-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              />
            )}
            {activeStage === 'distributing' && (
              <motion.div
                initial={{ left: 0, width: 0, opacity: 1 }}
                animate={{ left: '100%', width: '100%', opacity: [1, 1, 0] }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                className="absolute lg:hidden top-0 bottom-0 h-full bg-brand-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              />
            )}
          </div>
        </div>

        {/* Right Column: OUTPUTS (3 / 11) */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-2 justify-center">
          <div className="text-center lg:text-left mb-1">
            <h4 className="font-display text-sm font-bold tracking-tight text-white">
              Multi-Channel Outputs
            </h4>
            <p className="font-sans text-xs text-slate-400">
              Coordinated asset deployment
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            {outputChannels.map((chan, idx) => {
              const IconComp = chan.icon;
              const isActive = activeStage === 'distributing' || activeStage === 'completed';
              return (
                <motion.div
                  key={idx}
                  animate={{
                    borderColor: isActive ? 'rgba(6,182,212,0.3)' : 'rgba(30,41,59,0.8)',
                    scale: isActive ? 1.02 : 1,
                  }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-2.5 rounded-xl border bg-slate-950 flex items-center gap-2 shadow-sm ${
                    isActive ? 'border-brand-cyan/20 ring-1 ring-brand-cyan/5' : 'border-slate-900'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${chan.bg} ${chan.color} ${isActive ? 'animate-pulse' : ''}`}>
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <span className="font-sans text-xs font-semibold text-slate-100 block">
                      {chan.label}
                    </span>
                    <span className="font-mono text-[8px] text-slate-400 uppercase tracking-wider block">
                      {isActive ? 'Optimized & Sent' : 'Ready'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Quick Call-to-Action within hero interactive */}
      <div className="mt-8 pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="font-sans text-xs text-slate-400 font-medium">
            This visualization simulates how <strong className="text-white">ET Digital Growth OS™</strong> integrates individual marketing tasks into a unified strategic flow.
          </p>
        </div>
        <button
          onClick={() => triggerPulse()}
          disabled={activeStage !== 'idle' && activeStage !== 'completed'}
          className={`font-display text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg transition-all ${
            activeStage !== 'idle' && activeStage !== 'completed'
              ? 'bg-slate-950 text-slate-600 cursor-not-allowed border border-slate-900'
              : 'bg-brand-cyan hover:bg-cyan-500 text-slate-950 font-extrabold shadow-sm hover:shadow-md cursor-pointer'
          }`}
        >
          {activeStage === 'idle' ? 'Run Signal Test' : 'Deploying...'}
        </button>
      </div>
    </div>
  );
}
