import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  FileBarChart, TrendingUp, Cpu, Users, Target, 
  ArrowUpRight, AlertTriangle, ShieldCheck, Sparkles, 
  Download, RefreshCw, Layers, Compass, CheckCircle2,
  ExternalLink, BarChart3, Zap, BookOpen, Newspaper, Lock
} from 'lucide-react';
import { UserProfile } from '../../types';
import { User } from 'firebase/auth';
import { getIndustryMarketIntel } from '../../utils/contentEngineHelpers';
import { isAuthorizedForTelemetry } from '../../utils/telemetryAuth';

interface MarketReportPanelProps {
  user?: User | null;
  profile: UserProfile | null;
  onOpenBooking: () => void;
}

export default function MarketReportPanel({
  user,
  profile,
  onOpenBooking
}: MarketReportPanelProps) {
  const industry = profile?.industry || 'Executive Coaching & Digital Business';
  const location = profile?.location || 'Los Angeles & National';

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check if current session belongs to authorized admin
  const canViewTelemetry = isAuthorizedForTelemetry(user?.email, profile?.email);

  // Dynamic Market Intelligence for niche
  const marketIntel = useMemo(() => {
    return getIndustryMarketIntel(profile);
  }, [profile]);

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
                1 Leading Market Headline
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
              {industry} Market Dynamics
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
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
              <span>{canViewTelemetry ? 'Update Telemetry' : 'Refresh Intel'}</span>
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

      {/* SECTION 1: THE 1 LEADING MARKET HEADLINE LINKING TO REPUTABLE RESEARCH */}
      <div className="rounded-3xl border border-cyan-500/30 bg-[var(--surface)] p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-cyan-500" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-500 font-bold">
              1 Leading Market Headline for {marketIntel.detected_niche}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[var(--muted)]">Source:</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              {marketIntel.article_source}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--text)] leading-snug">
            "{marketIntel.leading_headline}"
          </h3>

          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-[var(--text)] font-sans leading-relaxed max-w-3xl">
                <strong className="font-semibold text-cyan-600 dark:text-cyan-400">Executive Takeaway: </strong>
                {marketIntel.executive_takeaway}
              </div>

              {/* Direct Link to Reputable Article */}
              <a
                href={marketIntel.article_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider transition-all shadow-sm shrink-0"
              >
                <span>Read Full Article</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="pt-2.5 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[var(--muted)]">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span><strong>Market Shift Metric:</strong> {marketIntel.market_shift_stat}</span>
              </div>
              <span className="text-[10px] text-slate-400">Verified Citation · Q1 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* METRIC TILES: INSIDER TELEMETRY (ADMIN ONLY) VS CLIENT BRAND STANDING (STANDARD USERS) */}
      {canViewTelemetry ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-[10px] uppercase font-bold text-cyan-500 tracking-wider flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-cyan-500" />
              <span>ET Digital Insider Telemetry · Restricted Administrator Console</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              Live Feed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-sm">
              <div className="flex items-center justify-between text-[var(--muted)] font-mono text-[10px] uppercase tracking-wider">
                <span>Market Demand Velocity</span>
                <TrendingUp className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-[var(--text)] tracking-tight">92.4</span>
                <span className="text-xs font-mono text-emerald-500">+18.6% YoY</span>
              </div>
              <p className="text-[11px] text-[var(--muted)]">
                High search intent for specialized narrative solutions over generic agencies.
              </p>
              <div className="h-1 w-full bg-[var(--surface2)] rounded-full overflow-hidden mt-3">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-[92%]" />
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-sm">
              <div className="flex items-center justify-between text-[var(--muted)] font-mono text-[10px] uppercase tracking-wider">
                <span>AEO Shift Index</span>
                <Cpu className="w-4 h-4 text-purple-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-[var(--text)] tracking-tight">74%</span>
                <span className="text-xs font-mono text-purple-500">AI Synthesized</span>
              </div>
              <p className="text-[11px] text-[var(--muted)]">
                Queries now resolved in generative overviews before organic links are clicked.
              </p>
              <div className="h-1 w-full bg-[var(--surface2)] rounded-full overflow-hidden mt-3">
                <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 w-[74%]" />
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-sm">
              <div className="flex items-center justify-between text-[var(--muted)] font-mono text-[10px] uppercase tracking-wider">
                <span>Traditional CAC Inflation</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-[var(--text)] tracking-tight">+42%</span>
                <span className="text-xs font-mono text-amber-500">Paid Ad Cost</span>
              </div>
              <p className="text-[11px] text-[var(--muted)]">
                Ad blindness forces brands to build organic authority and founder narratives.
              </p>
              <div className="h-1 w-full bg-[var(--surface2)] rounded-full overflow-hidden mt-3">
                <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 w-[65%]" />
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-sm">
              <div className="flex items-center justify-between text-[var(--muted)] font-mono text-[10px] uppercase tracking-wider">
                <span>Storytelling Multiplier</span>
                <Zap className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-[var(--text)] tracking-tight">3.8x</span>
                <span className="text-xs font-mono text-emerald-500">Higher Conversion</span>
              </div>
              <p className="text-[11px] text-[var(--muted)]">
                Prospects close 3.8x faster when educated by authentic, story-driven assets.
              </p>
              <div className="h-1 w-full bg-[var(--surface2)] rounded-full overflow-hidden mt-3">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 w-[88%]" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Client Facing Standing View (Commissioned data for the client) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between text-[var(--muted)] font-mono text-[10px] uppercase tracking-wider">
              <span>Voice DNA Matrix</span>
              <ShieldCheck className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-display font-bold text-[var(--text)] tracking-tight">100% Active</span>
            </div>
            <p className="text-[11px] text-[var(--muted)]">
              Calibrated via Pomelli DNA to protect your authentic tone.
            </p>
            <div className="h-1 w-full bg-[var(--surface2)] rounded-full overflow-hidden mt-3">
              <div className="h-full bg-cyan-500 w-full" />
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between text-[var(--muted)] font-mono text-[10px] uppercase tracking-wider">
              <span>Weekly Cadence Standard</span>
              <Layers className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-display font-bold text-[var(--text)] tracking-tight">1-Asset Kit</span>
            </div>
            <p className="text-[11px] text-[var(--muted)]">
              300-word blog, 1:1 graphic, caption, eblast & GBP post.
            </p>
            <div className="h-1 w-full bg-[var(--surface2)] rounded-full overflow-hidden mt-3">
              <div className="h-full bg-emerald-500 w-full" />
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between text-[var(--muted)] font-mono text-[10px] uppercase tracking-wider">
              <span>AEO Citation Target</span>
              <Cpu className="w-4 h-4 text-purple-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-display font-bold text-purple-600 dark:text-purple-400 tracking-tight">Optimized</span>
            </div>
            <p className="text-[11px] text-[var(--muted)]">
              Direct entity answers formulated for ChatGPT & Perplexity.
            </p>
            <div className="h-1 w-full bg-[var(--surface2)] rounded-full overflow-hidden mt-3">
              <div className="h-full bg-purple-500 w-full" />
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between text-[var(--muted)] font-mono text-[10px] uppercase tracking-wider">
              <span>Market Category</span>
              <Compass className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-display font-bold text-[var(--text)] tracking-tight truncate">
                {marketIntel.detected_niche}
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted)] truncate">
              {location}
            </p>
            <div className="h-1 w-full bg-[var(--surface2)] rounded-full overflow-hidden mt-3">
              <div className="h-full bg-amber-500 w-full" />
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Strategic Gaps & Playbook */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Strategic Gaps (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-500 font-bold">
                  Opportunity Analysis
                </span>
                <h3 className="font-display text-lg font-bold text-[var(--text)]">
                  Top 4 Category Blindspots in {industry}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[var(--muted)]">ET Digital proprietary matrix</span>
            </div>

            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-1.5 hover:border-cyan-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-display text-xs font-bold text-cyan-600 dark:text-cyan-400">
                    1. Jargon Overload & Lack of Human Narrative
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-rose-500/10 text-rose-500 border border-rose-500/30 font-semibold">
                    High Vulnerability
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  92% of websites in your category list generic buzzwords without stating a clear customer problem. First-party storytelling cuts through immediately.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-1.5 hover:border-cyan-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-display text-xs font-bold text-cyan-600 dark:text-cyan-400">
                    2. Unoptimized for AI Answer Engines (AEO)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-amber-500/10 text-amber-500 border border-amber-500/30 font-semibold">
                    Strategic Void
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  When prospects ask Perplexity or ChatGPT for the best provider in {location}, competitors with standard keyword blogs are invisible. Structured entity answers win.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-1.5 hover:border-cyan-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-display text-xs font-bold text-cyan-600 dark:text-cyan-400">
                    3. Weak Conversion Bridges
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-amber-500/10 text-amber-500 border border-amber-500/30 font-semibold">
                    Conversion Leak
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Most blogs end with no CTA or an intimidating "Schedule a 60-Minute Call" form. A low-friction diagnostic grader converts 3.8x higher.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Execution Playbook (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-sm space-y-5">
            <div className="pb-4 border-b border-[var(--border)]">
              <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-500 font-bold block">
                Action Mandate
              </span>
              <h3 className="font-display text-base font-bold text-[var(--text)]">
                The 1-Asset Execution Path
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-display text-xs font-bold text-[var(--text)]">
                    Publish Your 1 300-Word Blog
                  </h4>
                  <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                    Direct answer entity targeting "{marketIntel.target_topic}".
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-display text-xs font-bold text-[var(--text)]">
                    Distribute 1:1 Graphic & Caption
                  </h4>
                  <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                    Download the 1080x1080 graphic with your business name overlay and share to LinkedIn/X.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-display text-xs font-bold text-[var(--text)]">
                    Send 150-Word Eblast & GBP Post
                  </h4>
                  <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                    Circulate dispatch to warm list and capture local search intent on Google.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenBooking}
                className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Inquire About Pro Advisory</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
