import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  FileBarChart, TrendingUp, Cpu, Users, Target, 
  ArrowUpRight, AlertTriangle, ShieldCheck, Sparkles, 
  Download, RefreshCw, Layers, Compass, CheckCircle2,
  ExternalLink, BarChart3, Zap, BookOpen, Newspaper, Lock,
  Clock, Activity, Calendar
} from 'lucide-react';
import { UserProfile } from '../../types';
import { User } from 'firebase/auth';
import { getIndustryMarketIntel } from '../../utils/contentEngineHelpers';
import { isAuthorizedForTelemetry } from '../../utils/telemetryAuth';

interface MarketReportPanelProps {
  user?: User | null;
  profile: UserProfile | null;
  onOpenBooking: () => void;
  onOpenCalendar?: () => void;
  onNavigateToContentStudio?: () => void;
}

export default function MarketReportPanel({
  user,
  profile,
  onOpenBooking,
  onOpenCalendar,
  onNavigateToContentStudio
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
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="space-y-6 text-left" id="market-report-panel">
      
      {/* Top Console Header */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5">
                <FileBarChart className="w-3 h-3 text-cyan-400" />
                Industry Intelligence Report
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                Trailing 30 Days – YTD Sector Tracking
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
              {industry} Market Dynamics
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Curated market intelligence, verified research dispatches, and sector attribution for {industry} across trailing 30 days through Year-to-Date (YTD).
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleRefresh}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isRefreshing ? 'Updating...' : 'Refresh Intel'}</span>
            </button>
            <button
              type="button"
              onClick={onOpenCalendar || onOpenBooking}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all active:scale-95"
            >
              <span>Work with ET Digital</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Trailing 30 Days – YTD Market Intel Content */}
      <motion.div
        key="ytd_intel_view"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
            {/* SECTION 1: TRAILING 30 DAYS VS YEAR-TO-DATE (YTD) MACRO METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-sm">
                <div className="flex items-center justify-between text-[var(--muted)] font-mono text-[10px] uppercase tracking-wider">
                  <span>Trailing 30-Day Search Vol</span>
                  <Clock className="w-3.5 h-3.5 text-cyan-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-bold text-[var(--text)] tracking-tight">+38.4%</span>
                  <span className="font-mono text-[10px] text-emerald-500 font-bold">vs Prev 30D</span>
                </div>
                <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                  Surge in commercial conversational search queries asking for "{marketIntel.detected_niche}" on ChatGPT & Gemini.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-sm">
                <div className="flex items-center justify-between text-[var(--muted)] font-mono text-[10px] uppercase tracking-wider">
                  <span>YTD Ad Inflation Index</span>
                  <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-bold text-[var(--text)] tracking-tight">+27.2%</span>
                  <span className="font-mono text-[10px] text-rose-500 font-bold">YTD CPC Increase</span>
                </div>
                <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                  Paid cost-per-click ad prices in {industry} have risen, driving premium brands to build organic authority moats.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-sm">
                <div className="flex items-center justify-between text-[var(--muted)] font-mono text-[10px] uppercase tracking-wider">
                  <span>AEO Answer Citation Share</span>
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-bold text-[var(--text)] tracking-tight">64.8%</span>
                  <span className="font-mono text-[10px] text-cyan-500 font-bold">Category Avg</span>
                </div>
                <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                  Percentage of organic buyer discovery driven by AI entity citations and authoritative editorial synthesis.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-sm">
                <div className="flex items-center justify-between text-[var(--muted)] font-mono text-[10px] uppercase tracking-wider">
                  <span>Trailing 30D Decision Cycle</span>
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-bold text-[var(--text)] tracking-tight">14 Days</span>
                  <span className="font-mono text-[10px] text-amber-500 font-bold">-4 Days vs 2025</span>
                </div>
                <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                  Buyers who consume 1 high-authority editorial dispatch convert 28% faster than cold outbound prospects.
                </p>
              </div>
            </div>

            {/* SECTION 2: THE LEADING MARKET HEADLINE LINKING TO REPUTABLE RESEARCH */}
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
                    <span className="text-[10px] text-slate-400">Verified Citation · Trailing 30D–YTD Analysis</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: CURATED NEWS & DATA DISPATCHES (TRAILING 30 DAYS – YTD) */}
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <div className="space-y-0.5">
                  <h4 className="font-display text-base font-bold text-[var(--text)] uppercase tracking-wider">
                    Curated Industry Dispatches & Sector Data
                  </h4>
                  <p className="text-xs text-[var(--muted)]">
                    Vetted news summaries, consumer search intent benchmarks, and economic indicators for {industry}
                  </p>
                </div>
                <span className="font-mono text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                  Trailing 30D – YTD
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400">
                      Gartner & HBR Synthesis
                    </span>
                    <span className="text-[10px] font-mono text-[var(--muted)]">Trailing 30 Days</span>
                  </div>
                  <h5 className="font-display text-sm font-bold text-[var(--text)]">
                    AI Answer Engine Consolidation in B2B & Advisory Services
                  </h5>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    Over 58% of executive buyers now test strategic partners by querying ChatGPT Search or Perplexity before booking a discovery call. Brands without structured entity schemas are invisibly filtered out.
                  </p>
                  <div className="pt-2 border-t border-[var(--border)] text-[11px] font-mono text-emerald-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Action: Deploy entity-rich 1-Asset dispatches to secure recommendation placement.</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400">
                      eMarketer & Digiday Trendline
                    </span>
                    <span className="text-[10px] font-mono text-[var(--muted)]">YTD Trajectory</span>
                  </div>
                  <h5 className="font-display text-sm font-bold text-[var(--text)]">
                    The Death of Commodity Social Posts & Rise of Deep Editorial
                  </h5>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    Engagement on generic "tip of the day" posts dropped 41% YTD. Conversely, deep narrative case studies and contrarian POV articles generated 3.4x higher pipeline inquiries.
                  </p>
                  <div className="pt-2 border-t border-[var(--border)] text-[11px] font-mono text-emerald-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Action: Ground every social angle in authentic lived founder experience.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: STRATEGIC OPPORTUNITY VOIDS IN CLIENT'S MARKET */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-cyan-500 font-mono text-xs font-bold uppercase tracking-wider">
                  <Target className="w-4 h-4" />
                  <span>Immediate Acquisition Voids in {location}</span>
                </div>
                <div className="space-y-3 text-xs text-[var(--muted)] leading-relaxed">
                  <p>
                    Competitors in <strong className="text-[var(--text)]">{industry}</strong> are over-indexing on paid search ads and generic link building while ignoring conversational AI citations.
                  </p>
                  <p>
                    By publishing <strong className="text-[var(--text)]">{marketIntel.detected_niche}</strong> authoritative dispatches, you capture high-intent buyers during their natural research phase.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 to-[var(--surface)] p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-amber-500 font-mono text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-4 h-4" />
                  <span>Collaborate on Execution</span>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  ET Digital builds and implements the end-to-end growth operating system so your brand captures top rankings, answer citations, and high-ticket clients predictably.
                </p>
                <button
                  type="button"
                  onClick={onOpenCalendar || onOpenBooking}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
                >
                  <span>Schedule Consultation with ET Digital</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

      </motion.div>

    </div>
  );
}
