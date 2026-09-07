import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Zap, BarChart3, TrendingUp, ChevronRight, FileText, Globe, ArrowUpRight } from 'lucide-react';

interface CaseStudy {
  id: number;
  category: string;
  title: string;
  client: string;
  highlightMetric: string;
  metricLabel: string;
  challenge: string;
  strategy: string;
  results: string[];
  tags: string[];
}

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    category: "Organic Search & Google AI Domination",
    client: "Apex SaaS Platform",
    title: "How We Captured 40%+ Share of Search in a Competitive B2B Sector",
    highlightMetric: "+280%",
    metricLabel: "Organic Demo Signups",
    challenge: "Apex was losing organic volume to bloated competitor directory sites and legacy publishers. They needed an editorial SEO framework capable of surviving search generative AI changes.",
    strategy: "Implemented an 'Information Gain' content matrix, targeting intent clusters instead of single keywords. Developed premium first-party research assets and integrated Google AI search optimization protocols.",
    results: [
      "Captured top-3 Google AI search response positions for 82 core commercial intent keywords",
      "Grew organic product sign-ups by 280% in 5 months",
      "Reduced dependency on paid Google Ads from 74% down to 32%"
    ],
    tags: ["SaaS Growth", "Google AI Search", "Inbound Funnels"]
  },
  {
    id: 2,
    category: "Performance Acquisition Engine",
    client: "Centris Health & Wellness",
    title: "Scaling Paid Lead Acquisition while Slashing Blended CAC by 44%",
    highlightMetric: "5.8x",
    metricLabel: "ROI on Ad Spend",
    challenge: "Centris's paid campaigns on Meta and Google were hitting a scale-cap. Increased spending directly resulted in soaring lead costs and dropping quality.",
    strategy: "Replaced cookie-reliant tracking with direct API conversions integrations. Structured customized high-impact video creative funnels that matched the consumer lifecycle.",
    results: [
      "Scaled monthly paid budget by 190% while maintaining lead quality benchmarks",
      "Slashed customer acquisition costs by 44% in 90 days",
      "Recovered over 1,800 leaking leads via behavioral personalization"
    ],
    tags: ["Paid Acquisition", "Conversion API", "Omnichannel Ad Systems"]
  },
  {
    id: 3,
    category: "Conversion Rate Ecosystem (CRO)",
    client: "Opal Luxury Ecommerce",
    title: "Re-Engineering the Conversion Funnel to Scale Average Order Values",
    highlightMetric: "+64%",
    metricLabel: "Average Order Value (AOV)",
    challenge: "Opal had high site traffic but terrible conversion rates. High-intent dropoffs occurred during key product selection and final multi-step checkout.",
    strategy: "Conducted cognitive load audits and removed layout friction points. Deployed dynamic personalization that highlighted custom checkout upsells and social proof.",
    results: [
      "Lifted checkout conversion rate by 34% through checkout flow simplifications",
      "Boosted average order value by 64% with real-time AI cross-sell triggers",
      "Generated an extra $1.2M in annualized revenue in 120 days post-launch"
    ],
    tags: ["UX Optimization", "Friction Audit", "Personalization Triggers"]
  }
];

export default function CaseStudies({ onOpenBooking }: { onOpenBooking: () => void }) {
  const [activeStudy, setActiveStudy] = useState(0);

  return (
    <section id="case-studies" className="relative py-24 sm:py-32 bg-[#111111] overflow-hidden border-b border-white/[0.02]">
      {/* Background glow lines */}
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-white/[0.03] via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-white/[0.03] via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 gap-6">
          <div className="max-w-2xl">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-brand-cyan bg-cyan-950/40 border border-brand-cyan/20 px-3.5 py-1.5 rounded-full inline-block mb-4">
              Real Case Studies
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              Our Growth Blueprints In Action
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-400">
              Explore true case studies showing how we take scaling challenges and construct elite, measurable execution engines.
            </p>
          </div>
          
          <div>
            <button
              onClick={onOpenBooking}
              className="group inline-flex items-center gap-2 bg-transparent hover:bg-white/[0.03] border border-white/10 hover:border-brand-cyan/30 text-white font-display text-[10px] font-black uppercase tracking-widest px-6 py-4.5 rounded-xl transition-all cursor-pointer active:scale-95"
            >
              Partner With Us
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </button>
          </div>
        </div>

        {/* Dynamic Case Study Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left: Study List Tabs */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {caseStudies.map((study, idx) => {
              const isActive = idx === activeStudy;
              return (
                <button
                  key={study.id}
                  onClick={() => setActiveStudy(idx)}
                  className={`w-full text-left p-6 rounded-2xl transition-all duration-300 border cursor-pointer flex items-center justify-between group ${
                    isActive 
                      ? 'bg-slate-900 border-brand-cyan/30 shadow-lg shadow-cyan-950/20' 
                      : 'bg-transparent border-white/[0.03] hover:border-white/10'
                  }`}
                >
                  <div className="flex flex-col gap-1 pr-4">
                    <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-brand-cyan transition-colors">
                      {study.client}
                    </span>
                    <h3 className={`font-display text-sm sm:text-base font-bold transition-colors leading-tight ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}>
                      {study.category}
                    </h3>
                  </div>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isActive ? 'bg-brand-cyan text-slate-950' : 'bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-slate-300'
                  }`}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Selected Study Deep Dive Detail */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/40 border border-white/[0.05] rounded-3xl p-8 sm:p-10 md:p-12 backdrop-blur-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStudy}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="flex flex-col gap-8 text-left"
                >
                  {/* Top Meta Area */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-brand-cyan uppercase tracking-wider block mb-1">
                        {caseStudies[activeStudy].client}
                      </span>
                      <h4 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
                        {caseStudies[activeStudy].category}
                      </h4>
                    </div>

                    {/* Bold Result Badge */}
                    <div className="flex items-center gap-3 bg-cyan-950/30 border border-brand-cyan/20 px-4 py-2.5 rounded-2xl">
                      <TrendingUp className="w-4 h-4 text-brand-cyan" />
                      <div>
                        <span className="font-display text-2xl font-black text-brand-cyan block leading-none">
                          {caseStudies[activeStudy].highlightMetric}
                        </span>
                        <span className="font-mono text-[8px] text-slate-400 uppercase tracking-widest block mt-0.5">
                          {caseStudies[activeStudy].metricLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Core Content Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Challenge */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-rose-400 font-mono text-[9px] font-bold uppercase tracking-widest">
                        <Target className="w-3.5 h-3.5" />
                        The Scaling Obstacle
                      </div>
                      <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                        {caseStudies[activeStudy].challenge}
                      </p>
                    </div>

                    {/* Solution/Strategy */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-brand-cyan font-mono text-[9px] font-bold uppercase tracking-widest">
                        <Zap className="w-3.5 h-3.5" />
                        The ET Solution
                      </div>
                      <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                        {caseStudies[activeStudy].strategy}
                      </p>
                    </div>
                  </div>

                  {/* Verifiable Results */}
                  <div className="bg-slate-950/50 rounded-2xl p-6 sm:p-8 border border-white/5 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-[9px] font-bold uppercase tracking-widest">
                      <BarChart3 className="w-3.5 h-3.5" />
                      Verifiable Key Outcomes
                    </div>
                    
                    <ul className="flex flex-col gap-3">
                      {caseStudies[activeStudy].results.map((result, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan mt-2 shrink-0" />
                          <span>{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {caseStudies[activeStudy].tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="font-mono text-[8px] text-slate-400 bg-white/[0.02] border border-white/10 px-2.5 py-1 rounded-full uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
