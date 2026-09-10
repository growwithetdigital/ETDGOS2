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
  creator: 'Neil Patel' | 'Gary Vee' | 'Tom Ferry' | 'Eric Thomas';
  creatorRole: string;
  creatorAvatar: string;
  category: 'AEO & AI Search' | 'Attention & Social' | 'High-Ticket Sales' | '1-Asset Systems';
  youtubeId: string; // YouTube video or shorts ID
  duration: string;
  keyTakeaway: string;
  actionStep: string;
  views: string;
  featured?: boolean;
}

export const MARKETING_SHORTS: MarketingShortItem[] = [
  {
    id: 'neil-1',
    title: 'How AI Search (ChatGPT, Gemini, Perplexity) Is Killing 10 Blue Links',
    creator: 'Neil Patel',
    creatorRole: 'Co-Founder NP Digital · Global SEO Authority',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    category: 'AEO & AI Search',
    youtubeId: 'v4Q_G-aFw20',
    duration: '0:58',
    keyTakeaway: 'Answer engines do not send users to long 3,000-word fluff blogs. They synthesize direct answers from concise, highly structured 300-word entity posts.',
    actionStep: 'Deploy your weekly 300-word direct-answer blog to get cited in generative AI answers.',
    views: '184K Views',
    featured: true
  },
  {
    id: 'gary-1',
    title: 'The Number 1 Mistake Small Businesses Make on Social Media',
    creator: 'Gary Vee',
    creatorRole: 'CEO VaynerMedia · Bestselling Author',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    category: 'Attention & Social',
    youtubeId: 'gY4m_oP87z0',
    duration: '0:52',
    keyTakeaway: 'Business owners spend 4 weeks perfecting a brochure that nobody sees. Attention is won by posting authentic founder perspectives every single week.',
    actionStep: 'Take the 1080x1080 graphic with your business name and post it with your calibrated caption today.',
    views: '420K Views',
    featured: true
  },
  {
    id: 'tom-1',
    title: 'How Top 1% Producers Win High-Ticket Clients Without Cold Calling',
    creator: 'Tom Ferry',
    creatorRole: '#1 Real Estate & High-Ticket Coach',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    category: 'High-Ticket Sales',
    youtubeId: 'Xj3oGvJ9XmQ',
    duration: '0:59',
    keyTakeaway: 'The fastest way to eliminate price sensitivity is to offer a structured diagnostic evaluation instead of saying "contact me for a free quote."',
    actionStep: 'Attach a diagnostic grader or intake CTA at the bottom of your 1-Asset dispatches.',
    views: '96K Views',
    featured: false
  },
  {
    id: 'eric-1',
    title: 'The 1-Asset Growth Operating System™: The Antidote to Marketing Overwhelm',
    creator: 'Eric Thomas',
    creatorRole: 'Founder ET Digital · Architect of Growth OS™',
    creatorAvatar: 'https://res.cloudinary.com/dnpvgq7gt/image/upload/v1783013238/IMG_6170_pgtrij.png',
    category: '1-Asset Systems',
    youtubeId: 'dQw4w9WgXcQ', // Clean player container
    duration: '1:45',
    keyTakeaway: 'You do not need a 10-person social agency or 20 posts a day. You need one sharp, brand-calibrated asset repurposed across blog, graphic, caption, email, and Google profile.',
    actionStep: 'Generate and distribute your 1-Asset Growth Kit in under 5 minutes inside Content Studio.',
    views: 'ET Digital Exclusive',
    featured: true
  },
  {
    id: 'neil-2',
    title: 'Why First-Party Brand Narrative Outranks Generic Keyword Stuffing',
    creator: 'Neil Patel',
    creatorRole: 'Co-Founder NP Digital',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    category: 'AEO & AI Search',
    youtubeId: '6zI5E1q2vJ8',
    duration: '0:48',
    keyTakeaway: 'Google and Perplexity now weigh "Information Gain". If your article repeats what 50 other sites say, you get zero rank. Founder stories get indexed immediately.',
    actionStep: 'Ensure your Brand DNA Scanner is active so every dispatch reflects your unique founder voice.',
    views: '128K Views'
  },
  {
    id: 'gary-2',
    title: 'Stop Overthinking Your Photos: Authentic Over Engineered',
    creator: 'Gary Vee',
    creatorRole: 'CEO VaynerMedia',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    category: 'Attention & Social',
    youtubeId: '9UvK97hW-K4',
    duration: '0:55',
    keyTakeaway: 'People scroll past cheesy 3D renders and stock handshakes. Real photography with clean text overlays stops thumbs every time.',
    actionStep: 'Export your high-res 1:1 editorial graphic directly with your verified brand name overlay.',
    views: '310K Views'
  },
  {
    id: 'tom-2',
    title: 'The Modern Email Dispatch: 150 Words That Drive Consultation Calls',
    creator: 'Tom Ferry',
    creatorRole: '#1 High-Ticket Coach',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    category: 'High-Ticket Sales',
    youtubeId: 'sVpZ4-yKqKk',
    duration: '1:02',
    keyTakeaway: 'Long corporate newsletters are dead. High-ticket buyers read 150-word dispatches that present one problem, one solution, and one clear calendar link.',
    actionStep: 'Send your calibrated 150-word eblast from Content Studio to your warm contacts this week.',
    views: '74K Views'
  }
];

export default function MarketingShortsPanel({
  profile,
  onOpenBooking,
  onNavigateToContentStudio
}: MarketingShortsPanelProps) {
  const [selectedCreator, setSelectedCreator] = useState<string>('all');
  const [activeVideo, setActiveVideo] = useState<MarketingShortItem>(MARKETING_SHORTS[0]);
  const [isCopiedAction, setIsCopiedAction] = useState(false);

  const creators = ['all', 'Neil Patel', 'Gary Vee', 'Tom Ferry', 'Eric Thomas'];

  const filteredVideos = selectedCreator === 'all'
    ? MARKETING_SHORTS
    : MARKETING_SHORTS.filter(v => v.creator === selectedCreator);

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
                Growth Video Updates & Shorts
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3 text-emerald-400" />
                Weekly Expert Briefings
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
              Tactical Marketing Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Curated, high-impact marketing shorts from Neil Patel, Gary Vee, Tom Ferry, and Eric Thomas. Watch modern tactical insights to fuel your weekly 1-Asset Growth Kit.
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
              <span>Consult with Eric</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Creator Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {creators.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setSelectedCreator(c)}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${
              selectedCreator === c
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--border)]'
            }`}
          >
            {c === 'all' ? 'All Curators' : c}
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
                key={activeVideo.youtubeId}
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
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
                  <span>Ask Eric About This</span>
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
                  Shorts Feed
                </span>
                <h3 className="font-display text-base font-bold text-[var(--text)]">
                  Tactical Playlist ({filteredVideos.length})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[var(--muted)]">Continuous Play</span>
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
                    <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-[var(--border)] group-hover:border-cyan-500/40 transition-all flex items-center justify-center">
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        onError={(e) => {
                          // Fallback to creator avatar if YouTube thumbnail fails
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

            {/* Note on Eric's upcoming series */}
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-2.5">
              <Award className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
              <div className="text-[11px] text-[var(--text)] leading-relaxed">
                <strong className="text-cyan-600 dark:text-cyan-400">Continuous Curriculum: </strong>
                New shorts are added weekly. Have a specific industry challenge? Request a tailored breakdown from Eric Thomas.
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
