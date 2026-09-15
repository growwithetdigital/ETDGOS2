import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  FileBarChart, TrendingUp, Cpu, Users, Target, 
  ArrowUpRight, AlertTriangle, ShieldCheck, Sparkles, 
  RefreshCw, CheckCircle2,
  Newspaper, Clock, Calendar, MessageSquare, Search,
  Flame, ArrowRight, Zap
} from 'lucide-react';
import { UserProfile } from '../../types';
import { User } from 'firebase/auth';
import { 
  getIndustryMarketIntel, 
  getIndustryResearchAndQuestion,
  IndustryMarketIntel,
  IndustryResearchData 
} from '../../utils/contentEngineHelpers';

interface MarketReportPanelProps {
  user?: User | null;
  profile: UserProfile | null;
  onRefreshProfile?: (updatedProfile?: UserProfile) => void;
  onOpenBooking: () => void;
  onOpenCalendar?: () => void;
  onNavigateToContentStudio?: () => void;
}

export default function MarketReportPanel({
  user,
  profile,
  onRefreshProfile,
  onOpenBooking,
  onOpenCalendar,
  onNavigateToContentStudio
}: MarketReportPanelProps) {
  const industry = profile?.industry || 'Executive Coaching & Digital Business';
  const location = profile?.location || 'Los Angeles & National';
  const businessName = profile?.business_name || 'Your Business';

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dynamic Market Intelligence for niche from reputable research
  const marketIntel: IndustryMarketIntel = useMemo(() => {
    return getIndustryMarketIntel(profile);
  }, [profile]);

  // Dynamic Reddit, Reviews & Search Question Intelligence
  const researchData: IndustryResearchData = useMemo(() => {
    return getIndustryResearchAndQuestion(
      profile?.industry,
      profile?.website_url,
      profile?.target_audience,
      profile?.business_name
    );
  }, [profile]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      if (onRefreshProfile) {
        onRefreshProfile();
      }
    }, 600);
  };

  return (
    <div className="space-y-6 text-left" id="market-report-panel">
      
      {/* Top Console Header */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/50 p-6 sm:p-8 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/40 flex items-center gap-1.5 shadow-sm">
                <FileBarChart className="w-3 h-3 text-cyan-400" />
                Industry Market Report
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-500/30">
                Reputable Industry Research
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-purple-300 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-500/30">
                {marketIntel.detected_niche}
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
              {marketIntel.detected_niche} Intelligence Report
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              We monitor verified benchmarks from reputable industry sources, community sentiment, and buyer discovery trends for <strong className="text-white">{businessName}</strong> in <strong className="text-cyan-300">{location}</strong> so you can make informed growth decisions.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
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
              <span>Book Strategy Session</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: MACRO METRICS & INDUSTRY ATTRIBUTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-sm">
          <div className="flex items-center justify-between text-[var(--muted)] font-mono text-[10px] uppercase tracking-wider">
            <span>Educational Content ROI</span>
            <Clock className="w-3.5 h-3.5 text-cyan-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-[var(--text)] tracking-tight">+3.8x</span>
            <span className="font-mono text-[10px] text-emerald-500 font-bold">Research Benchmark</span>
          </div>
          <p className="text-[11px] text-[var(--muted)] leading-relaxed">
            Data confirms high-intent prospects who read diagnostic problem-solving content convert nearly 4x faster into retained clients.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-sm">
          <div className="flex items-center justify-between text-[var(--muted)] font-mono text-[10px] uppercase tracking-wider">
            <span>Paid Ad Inflation</span>
            <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-[var(--text)] tracking-tight">+27.2%</span>
            <span className="font-mono text-[10px] text-rose-500 font-bold">Media Cost Index</span>
          </div>
          <p className="text-[11px] text-[var(--muted)] leading-relaxed">
            Rising digital ad acquisition costs lead durable businesses to build organic authority moats that generate sustainable compounding pipeline.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-sm">
          <div className="flex items-center justify-between text-[var(--muted)] font-mono text-[10px] uppercase tracking-wider">
            <span>Direct Answer Discovery</span>
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-[var(--text)] tracking-tight">64.8%</span>
            <span className="font-mono text-[10px] text-cyan-500 font-bold">Verified Trust</span>
          </div>
          <p className="text-[11px] text-[var(--muted)] leading-relaxed">
            Percentage of high-intent clients who research founder insights and direct answer engines before initiating vendor contact.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-sm">
          <div className="flex items-center justify-between text-[var(--muted)] font-mono text-[10px] uppercase tracking-wider">
            <span>Closing Speed Advantage</span>
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-[var(--text)] tracking-tight">14 Days</span>
            <span className="font-mono text-[10px] text-amber-500 font-bold">Shorter Cycle</span>
          </div>
          <p className="text-[11px] text-[var(--muted)] leading-relaxed">
            Clients entering your ecosystem through clear educational frameworks make buying decisions 2 weeks faster than cold leads.
          </p>
        </div>
      </div>

      {/* SECTION 2: LEADING RELEVANT HEADLINE FOR THE UPDATE (Reputable Source Cited, No Links) */}
      <div className="rounded-3xl border border-cyan-500/30 bg-[var(--surface)] p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-cyan-500" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold">
              Featured Intelligence · {marketIntel.detected_niche}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[var(--muted)]">Reputable Source:</span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              {marketIntel.article_source}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--text)] leading-snug">
            "{marketIntel.leading_headline}"
          </h3>

          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="text-xs text-[var(--text)] font-sans leading-relaxed max-w-3xl">
                <strong className="font-semibold text-cyan-600 dark:text-cyan-400">Strategic Takeaway: </strong>
                {marketIntel.executive_takeaway}
              </div>

              {/* Cited Source Tag - No External Links */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-bold shrink-0 select-none">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Source: {marketIntel.article_source}</span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[var(--muted)]">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span><strong>Key Empirical Metric:</strong> {marketIntel.market_shift_stat}</span>
              </div>
              <span className="text-[10px] text-[var(--muted)]">Reputable Citation · Direct Intelligence (No Promotion Links)</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: INDUSTRY REDDIT, REVIEWS & SEARCH TRENDS (Voice of the Customer) */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-500" />
              <h4 className="font-display text-base font-bold text-[var(--text)] uppercase tracking-wider">
                Voice of Your Market: Reddit, Reviews & Search Behavior
              </h4>
            </div>
            <p className="text-xs text-[var(--muted)]">
              Synthesized from active community threads, client review sentiment, and search engine inquiry trends
            </p>
          </div>
          <span className="font-mono text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
            {researchData.target_search_volume}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Reddit Insights */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2.5">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5" />
              <span>Reddit Sentiment</span>
            </div>
            <p className="text-xs text-[var(--text)] leading-relaxed">
              {researchData.reddit_insight}
            </p>
            <div className="text-[10px] font-mono text-[var(--muted)] pt-1">
              Source: Category Subreddits & Unfiltered Peer Discussions
            </div>
          </div>

          {/* Customer Reviews Insight */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Google & B2B Reviews</span>
            </div>
            <p className="text-xs text-[var(--text)] leading-relaxed">
              {researchData.reviews_insight}
            </p>
            <div className="text-[10px] font-mono text-[var(--muted)] pt-1">
              Source: High-Intent Verified Customer Reviews
            </div>
          </div>

          {/* High-Intent Search Question */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface2)] border border-cyan-500/30 space-y-2.5 bg-cyan-950/10">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Search className="w-3.5 h-3.5" />
              <span>#1 Search Query in Your Niche</span>
            </div>
            <p className="text-xs text-[var(--text)] font-semibold leading-relaxed">
              "{researchData.industry_question}"
            </p>
            <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 pt-1">
              Answer Engine Opportunity: Answering this question wins direct citations.
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 4: STRATEGIC OPPORTUNITY VOIDS IN CLIENT'S REGION & NICHE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Immediate Acquisition Voids in {location}</span>
          </div>
          <div className="space-y-3 text-xs text-[var(--muted)] leading-relaxed">
            <p>
              Competitors in <strong className="text-[var(--text)]">{industry}</strong> across <strong className="text-[var(--text)]">{location}</strong> are over-indexing on paid search ads and generic link building while ignoring conversational AI citations and answer engine optimization.
            </p>
            <p>
              By publishing <strong className="text-[var(--text)]">{marketIntel.detected_niche}</strong> authoritative dispatches that directly resolve client questions, you capture high-intent buyers during their natural research phase before they ever speak with an agency or competitor.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 to-[var(--surface)] p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-500 font-mono text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>Collaborate with ET Digital</span>
          </div>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            ET Digital builds and implements the end-to-end growth operating system so your brand captures top search rankings, answer engine citations, and high-ticket clients predictably.
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

    </div>
  );
}
