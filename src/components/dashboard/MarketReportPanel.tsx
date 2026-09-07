import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileBarChart, TrendingUp, Cpu, Users, Target, 
  ArrowUpRight, AlertTriangle, ShieldCheck, Sparkles, 
  Download, RefreshCw, Layers, Compass, CheckCircle2,
  ExternalLink, BarChart3, Zap
} from 'lucide-react';
import { UserProfile } from '../../types';

interface MarketReportPanelProps {
  profile: UserProfile | null;
  onOpenBooking: () => void;
}

export default function MarketReportPanel({
  profile,
  onOpenBooking
}: MarketReportPanelProps) {
  const industry = profile?.industry || 'Executive Coaching & Digital Business';
  const location = profile?.location || 'Los Angeles & National';

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'aeo_shift' | 'gaps' | 'playbook'>('overview');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 900);
  };

  return (
    <div className="space-y-6 text-left" id="market-report-panel">
      
      {/* Top Console Header */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5">
                <FileBarChart className="w-3 h-3 text-cyan-400" />
                Industry Intelligence Report
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                Q1 2026 Executive Benchmark
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
              {industry} Market Dynamics
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time competitive shifts, AI answer engine penetration (Perplexity, ChatGPT, Gemini), and high-intent customer acquisition voids across {location}.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleRefresh}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>Update Telemetry</span>
            </button>
            <button
              type="button"
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all"
            >
              <span>Consult with Eric</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic HUD Metric Tiles (Gaming Console Boot / Apple Dashboard Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-2 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase tracking-wider">
            <span>Market Demand Velocity</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-white tracking-tight">92.4</span>
            <span className="text-xs font-mono text-emerald-400">+18.6% YoY</span>
          </div>
          <p className="text-[11px] text-slate-400">
            High search intent for specialized narrative solutions over generic agencies.
          </p>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mt-3">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-[92%]" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-2 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase tracking-wider">
            <span>AEO Shift Index</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-white tracking-tight">74%</span>
            <span className="text-xs font-mono text-purple-400">AI Synthesized</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Queries now resolved in generative overviews before organic links are clicked.
          </p>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mt-3">
            <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 w-[74%]" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-2 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase tracking-wider">
            <span>Traditional CAC Inflation</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-white tracking-tight">+42%</span>
            <span className="text-xs font-mono text-amber-400">Paid Ad Cost</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Ad blindness forces brands to build organic authority and founder narratives.
          </p>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mt-3">
            <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 w-[65%]" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-2 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase tracking-wider">
            <span>Storytelling Multiplier</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-white tracking-tight">3.8x</span>
            <span className="text-xs font-mono text-emerald-400">Higher Conversion</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Prospects close 3.8x faster when educated by authentic, story-driven assets.
          </p>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mt-3">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 w-[88%]" />
          </div>
        </div>

      </div>

      {/* Main Grid: Deep Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Strategic Gaps & Competitor Blindspots (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 font-bold">
                  Opportunity Analysis
                </span>
                <h3 className="font-display text-lg font-bold text-white">
                  Top 4 Category Blindspots in {industry}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">ET Digital proprietary matrix</span>
            </div>

            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5 hover:border-cyan-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-display text-xs font-bold text-cyan-300">
                    1. Jargon Overload & Lack of Human Narrative
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-rose-950/60 text-rose-300 border border-rose-800/40">
                    High Vulnerability
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  90% of competitors use indistinguishable corporate buzzwords ("full-service solutions", "tailored results"). The market has a massive hunger for plain-spoken, conviction-led founder stories.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5 hover:border-cyan-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-display text-xs font-bold text-cyan-300">
                    2. The Zero-Click Search Trap
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-purple-950/60 text-purple-300 border border-purple-800/40">
                    AI Shift
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Websites without clear semantic entity schema and authoritative opinion articles are being bypassed by Gemini and ChatGPT citations. Your Content Studio post solves this directly.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5 hover:border-cyan-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-display text-xs font-bold text-cyan-300">
                    3. Weak Post-Visit Nurture Sequences
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-amber-950/60 text-amber-300 border border-amber-800/40">
                    Revenue Leak
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Most competitors push for an immediate hard sale. The winners provide multi-angle social content (LinkedIn, X, newsletters) that re-engages prospects across multiple touchpoints.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5 hover:border-cyan-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-display text-xs font-bold text-cyan-300">
                    4. Invisible Founder Authority
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                    Unfair Advantage
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Clients buy into founders, not faceless logos. Elevating your executive perspective turns your brand into a destination rather than an interchangeable vendor.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 90-Day Category Playbook & Consultation CTA (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <Compass className="w-4 h-4 text-cyan-400" />
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                Category Takeaway
              </h3>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-white text-[11px] uppercase tracking-wider font-mono text-cyan-400">
                  Phase 1: Foundation (Weeks 1-4)
                </div>
                <p>Deploy your extracted Brand DNA and publish your core authority blog post with verified AEO schema.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-white text-[11px] uppercase tracking-wider font-mono text-cyan-400">
                  Phase 2: Amplification (Weeks 5-8)
                </div>
                <p>Execute your 4 social promotion angles across LinkedIn, X threads, and newsletter subscribers to drive warm referral loops.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-white text-[11px] uppercase tracking-wider font-mono text-cyan-400">
                  Phase 3: Category Dominance (Weeks 9-12)
                </div>
                <p>Implement the full Growth OS quarterly roadmap with multi-touch attribution and dedicated consultation.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-slate-950 border border-cyan-500/30 text-center space-y-3">
              <Sparkles className="w-6 h-6 text-cyan-400 mx-auto" />
              <h4 className="font-display text-sm font-bold text-white">
                Turn This Report Into Revenue
              </h4>
              <p className="text-xs text-slate-300">
                Book a private 1-on-1 strategy session with Eric Thomas to apply these exact market insights to your business.
              </p>
              <button
                type="button"
                onClick={onOpenBooking}
                className="w-full py-3 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <span>Book 1-on-1 Strategy Session</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
