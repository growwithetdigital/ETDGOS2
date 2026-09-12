import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Sparkles, TrendingUp, Cpu, Users, 
  ArrowUpRight, Bookmark, Check, Share2, Layers,
  Tv, Compass, ExternalLink, Lightbulb, Flame, Award
} from 'lucide-react';
import { UserProfile } from '../../types';

interface MarketingShortsPanelProps {
  profile: UserProfile | null;
  onOpenBooking: () => void;
  onNavigateToContentStudio: () => void;
}

export interface MarketingShortItem {
  id: string;
  title: string;
  creator: string;
  creatorRole: string;
  creatorAvatar: string;
  category: '2026 Strategy' | 'AEO & AI Search' | 'Google & Local SEO' | 'Conversion & Lead Gen';
  youtubeId: string; // YouTube video or shorts ID
  start?: number; // Starting offset in seconds
  duration: string;
  keyTakeaway: string;
  actionStep: string;
  views: string;
  featured?: boolean;
}

export const MARKETING_SHORTS: MarketingShortItem[] = [
  {
    id: 'neil-2026-trends',
    title: 'The 8 Trends I’m Betting My Entire Marketing Strategy On in 2026',
    creator: 'Neil Patel',
    creatorRole: 'Co-Founder NP Digital · Global SEO & Growth Authority',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    category: '2026 Strategy',
    youtubeId: 'hXPALnu3Y6I',
    start: 39,
    duration: '14:28',
    keyTakeaway: 'Generative AI and AI answer engines are radically transforming search. Winning brands build structured first-party authority, entity citations, and omni-channel distribution instead of relying on legacy SEO tricks.',
    actionStep: 'Deploy structured 1-Asset dispatches with entity signals and direct answers to capture citations across ChatGPT, Google AI Overviews, and Perplexity.',
    views: 'NP Digital Featured',
    featured: true
  },
  {
    id: 'neil-strategy-working',
    title: 'The Only Marketing Strategy That Is Working In 2026',
    creator: 'Neil Patel',
    creatorRole: 'Co-Founder NP Digital',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    category: '2026 Strategy',
    youtubeId: 'UlfniLzuwa0',
    duration: '11:15',
    keyTakeaway: 'Audience attention is fragmented across search, short-form video, and AI answer engines. The only sustainable strategy is turning one core piece of high-value expertise into multi-channel assets.',
    actionStep: 'Repurpose your single weekly authority dispatch into 4 tailored social hooks, an email dispatch, and a Google business update.',
    views: '185K Views',
    featured: true
  },
  {
    id: 'neil-google-double-leads',
    title: 'The NEW Google Strategy to Double Your Leads (FAST)',
    creator: 'Neil Patel',
    creatorRole: 'Co-Founder NP Digital',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    category: 'Google & Local SEO',
    youtubeId: 'CIGrrt_mVxM',
    duration: '10:42',
    keyTakeaway: 'Google algorithms now prioritize verified first-party experience (E-E-A-T) and high-intent localized solutions over generic keyword-stuffed articles.',
    actionStep: 'Update your core services with structured schema and localized client proof to dominate high-intent category queries.',
    views: '210K Views',
    featured: true
  },
  {
    id: 'neil-new-rules-google',
    title: 'The New Rules of Google (Most Businesses Won\'t Survive)',
    creator: 'Neil Patel',
    creatorRole: 'Co-Founder NP Digital',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    category: 'AEO & AI Search',
    youtubeId: 'KeT5oSgo-Ko',
    duration: '12:18',
    keyTakeaway: 'Websites publishing unedited generic AI content without original perspectives are suffering steep ranking drops. Genuine founder voice and proprietary data are critical.',
    actionStep: 'Use the Brand DNA Scanner to ensure every piece of published content reflects your verified business voice.',
    views: '165K Views',
    featured: false
  },
  {
    id: 'neil-20-years-marketing',
    title: '20 Years of Marketing Knowledge in 10 Minutes',
    creator: 'Neil Patel',
    creatorRole: 'Co-Founder NP Digital',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    category: 'Conversion & Lead Gen',
    youtubeId: 'mFiPAVYZE8s',
    duration: '10:04',
    keyTakeaway: 'Timeless conversion principles outlive algorithm shifts: clear positioning, friction elimination, addressing executive objections up front, and establishing credibility.',
    actionStep: 'Replace passive "Contact Us" forms with high-value diagnostic audits and clear discovery call scheduling.',
    views: '340K Views',
    featured: false
  },
  {
    id: 'neil-local-business-flywheel',
    title: 'Build This Once, Sell It to Every Local Business ($1,000/Mo Clients)',
    creator: 'Neil Patel',
    creatorRole: 'Co-Founder NP Digital',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    category: 'Google & Local SEO',
    youtubeId: 'YIGs1aRruQU',
    duration: '13:30',
    keyTakeaway: 'Business owners need compounding organic visibility systems rather than piecemeal one-off social posts that disappear in 24 hours.',
    actionStep: 'Package your expertise into compounding digital assets that rank on Google and provide long-term evergreen value.',
    views: '198K Views',
    featured: false
  },
  {
    id: 'neil-ai-watermarks-fix',
    title: 'Google Watermarks Your AI Content. Here\'s the 20-Minute Fix',
    creator: 'Neil Patel',
    creatorRole: 'Co-Founder NP Digital',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    category: 'AEO & AI Search',
    youtubeId: 'y3vnFozXouE',
    duration: '11:50',
    keyTakeaway: 'Search engines detect formulaic AI phrasing. Infusing authentic case studies, local context, and human-verified data guarantees indexation and high search rank.',
    actionStep: 'Refine every generated dispatch with real customer scenarios before distributing across web and social channels.',
    views: '142K Views',
    featured: false
  },
  {
    id: 'neil-is-seo-worth-it',
    title: 'Is SEO Worth It Anymore? The Truth About Organic Traffic',
    creator: 'Neil Patel',
    creatorRole: 'Co-Founder NP Digital',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    category: 'AEO & AI Search',
    youtubeId: 't7k8EOZtWYk',
    duration: '9:45',
    keyTakeaway: 'Traditional keyword volume metrics are misleading. What matters in 2026 is capturing searchers with immediate buying intent and readiness.',
    actionStep: 'Target high-intent conversational queries in your content that AI answer engines pull into their direct recommendations.',
    views: '175K Views',
    featured: false
  }
];

export default function MarketingShortsPanel({
  profile,
  onOpenBooking,
  onNavigateToContentStudio
}: MarketingShortsPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Topics');
  const [activeVideo, setActiveVideo] = useState<MarketingShortItem>(MARKETING_SHORTS[0]);
  const [isCopiedAction, setIsCopiedAction] = useState(false);

  const categories = ['All Topics', '2026 Strategy', 'AEO & AI Search', 'Google & Local SEO', 'Conversion & Lead Gen'];

  const filteredVideos = selectedCategory === 'All Topics'
    ? MARKETING_SHORTS
    : MARKETING_SHORTS.filter(v => v.category === selectedCategory);

  const handleCopyAction = () => {
    navigator.clipboard.writeText(activeVideo.actionStep);
    setIsCopiedAction(true);
    setTimeout(() => setIsCopiedAction(false), 2200);
  };

  return (
    <div className="space-y-6 text-left" id="marketing-shorts-panel">
      
      {/* Console Header */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5">
                <Tv className="w-3 h-3 text-cyan-400" />
                Growth Video Updates & Masterclasses
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3 text-emerald-400" />
                2026 Strategy Intelligence
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
              Tactical Marketing Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Curated, high-impact marketing strategy masterclasses from Neil Patel and leading growth authorities. Watch modern tactical insights to fuel your weekly 1-Asset Growth Kit.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onNavigateToContentStudio}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Back to Studio</span>
            </button>
            <button
              type="button"
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all"
            >
              <span>Speak with Us</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--border)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: YouTube Video Player & Playlist Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Active Video Player & Insight Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm space-y-0">
            
            {/* Embedded YouTube Player Container */}
            <div className="relative aspect-video w-full bg-slate-950">
              <iframe
                key={`${activeVideo.youtubeId}-${activeVideo.start || 0}`}
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?${activeVideo.start ? `start=${activeVideo.start}&` : ''}autoplay=1&rel=0&modestbranding=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>

            {/* Video Meta & Curated Takeaways */}
            <div className="p-6 sm:p-7 space-y-5">
              
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <img
                    src={activeVideo.creatorAvatar}
                    alt={activeVideo.creator}
                    className="w-10 h-10 rounded-full object-cover border border-cyan-500/40"
                  />
                  <div>
                    <h4 className="font-display font-bold text-sm text-[var(--text)] flex items-center gap-1.5">
                      {activeVideo.creator}
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    </h4>
                    <span className="font-mono text-[10px] text-[var(--muted)]">
                      {activeVideo.creatorRole}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-500 border border-cyan-500/30">
                    {activeVideo.category}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--muted)]">
                    {activeVideo.duration} · {activeVideo.views}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--text)] leading-snug">
                  {activeVideo.title}
                </h3>
              </div>

              {/* Strategic Takeaway Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-3">
                <div className="flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase font-bold text-amber-500 tracking-wider block">
                      Executive Takeaway
                    </span>
                    <p className="text-xs text-[var(--text)] leading-relaxed">
                      {activeVideo.keyTakeaway}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 max-w-md">
                    <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                    <span><strong>Action Mandate:</strong> {activeVideo.actionStep}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}${activeVideo.start ? `&t=${activeVideo.start}s` : ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:text-red-500 font-mono text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer hover:border-red-500/40 transition-all shrink-0"
                      title="Open on YouTube"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>YouTube</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyAction}
                      className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-mono text-[11px] font-semibold flex items-center gap-1 cursor-pointer hover:border-cyan-500/40 transition-all shrink-0"
                    >
                      {isCopiedAction ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3 h-3 text-[var(--muted)]" />
                          <span>Copy Action</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Launch into Studio */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onNavigateToContentStudio}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>Execute in Content Studio</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl border border-[var(--border)] bg-[var(--surface2)] hover:bg-[var(--border)] text-[var(--text)] font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Speak with Us</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-500" />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Video Playlist & Up Next Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-500 font-bold block">
                  Masterclass Feed
                </span>
                <h3 className="font-display text-base font-bold text-[var(--text)]">
                  Tactical Playlist ({filteredVideos.length})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[var(--muted)]">Curated Curriculum</span>
            </div>

            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {filteredVideos.map((video) => {
                const isActive = video.id === activeVideo.id;
                return (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => setActiveVideo(video)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 group ${
                      isActive
                        ? 'border-cyan-500 bg-cyan-500/10 shadow-sm'
                        : 'border-[var(--border)] bg-[var(--surface2)] hover:border-cyan-500/40 hover:bg-[var(--surface)]'
                    }`}
                  >
                    {/* Thumbnail Play Indicator */}
                    <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-[var(--border)] group-hover:border-cyan-500/40 transition-all flex items-center justify-center">
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isActive ? 'bg-cyan-500 text-slate-950' : 'bg-white/80 text-slate-900 group-hover:bg-cyan-500 group-hover:text-slate-950'} transition-all`}>
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 font-mono text-[8px] text-white">
                        {video.duration}
                      </span>
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-[10px] font-bold text-cyan-600 dark:text-cyan-400 truncate">
                          {video.creator}
                        </span>
                        {video.featured && (
                          <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30 uppercase shrink-0">
                            Must Watch
                          </span>
                        )}
                      </div>

                      <h4 className={`font-display text-xs font-bold leading-tight line-clamp-2 ${isActive ? 'text-cyan-500' : 'text-[var(--text)]'}`}>
                        {video.title}
                      </h4>

                      <div className="flex items-center justify-between text-[10px] font-mono text-[var(--muted)] pt-0.5">
                        <span className="truncate">{video.category}</span>
                        <span>{video.views}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Note on upcoming series */}
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-2.5">
              <Award className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
              <div className="text-[11px] text-[var(--text)] leading-relaxed">
                <strong className="text-cyan-600 dark:text-cyan-400">Continuous Curriculum: </strong>
                New masterclasses are added weekly. Have a specific industry challenge? Request a tailored breakdown from our team.
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
