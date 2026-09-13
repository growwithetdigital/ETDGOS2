import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Play, CheckCircle2, RotateCcw, Sparkles, ExternalLink, 
  Tv, Award, Check, ArrowUpRight, Clock, Video, BookOpen, Layers
} from 'lucide-react';
import { UserProfile } from '../../types';

interface LearningFeedPanelProps {
  profile: UserProfile | null;
  onOpenBooking: () => void;
  onOpenCalendar?: () => void;
}

export interface CuratedVideoItem {
  id: string;
  channelName: string;
  channelHandle: string;
  channelUrl: string;
  title: string;
  youtubeId: string;
  duration: string;
  focus: string;
  start?: number;
}

// Exactly one verified video from each of the 7 user-provided channels:
// 1. Neil Patel (https://www.youtube.com/@neilpatel)
// 2. Myron Golden (https://www.youtube.com/@MyronGolden)
// 3. GaryVee (https://www.youtube.com/@garyvee)
// 4. HubSpot CRM (https://www.youtube.com/@HubSpot-CRM)
// 5. TED (https://www.youtube.com/@TED)
// 6. HubSpot Marketing (https://www.youtube.com/@HubSpotMarketing)
// 7. CNBC Make It (https://www.youtube.com/@CNBCMakeIt)

export const CURATED_LEARNING_VIDEOS: CuratedVideoItem[] = [
  {
    id: 'np-video',
    channelName: 'Neil Patel',
    channelHandle: '@neilpatel',
    channelUrl: 'https://www.youtube.com/@neilpatel',
    title: 'The 8 Trends I’m Betting My Entire Marketing Strategy On in 2026',
    youtubeId: 'hXPALnu3Y6I',
    duration: '14:28',
    focus: 'Organic search shifts, AI-assisted research, and omnichannel authority'
  },
  {
    id: 'mg-video',
    channelName: 'Myron Golden',
    channelHandle: '@MyronGolden',
    channelUrl: 'https://www.youtube.com/@MyronGolden',
    title: 'How To Keep AI From Stealing Your Job Or Destroying Your Business',
    youtubeId: '65TerNSqi6A',
    duration: '18:22',
    focus: 'Structuring high-ticket offer architecture and positioning for category wealth'
  },
  {
    id: 'gv-video',
    channelName: 'GaryVee',
    channelHandle: '@garyvee',
    channelUrl: 'https://www.youtube.com/@garyvee',
    title: 'Everything You Know About Social Media Is Changing',
    youtubeId: '83r8orCLOyg',
    duration: '22:15',
    focus: 'Capturing modern organic attention and building compounding brand resonance'
  },
  {
    id: 'hscrm-video',
    channelName: 'HubSpot CRM',
    channelHandle: '@HubSpot-CRM',
    channelUrl: 'https://www.youtube.com/@HubSpot-CRM',
    title: 'Introducing Revenue Hub | Connected CPQ, Billing and Payments',
    youtubeId: '87kZ4IA-1bs',
    duration: '06:40',
    focus: 'Automated sales pipelines, billing velocity, and deal closing infrastructure'
  },
  {
    id: 'ted-video',
    channelName: 'TED',
    channelHandle: '@TED',
    channelUrl: 'https://www.youtube.com/@TED',
    title: 'How Great Leaders Inspire Action | Simon Sinek',
    youtubeId: 'qp0HIF3SfI4',
    duration: '18:04',
    focus: 'The Golden Circle framework: Why starting with purpose converts loyal clients'
  },
  {
    id: 'hsmkt-video',
    channelName: 'HubSpot Marketing',
    channelHandle: '@HubSpotMarketing',
    channelUrl: 'https://www.youtube.com/@HubSpotMarketing',
    title: 'I Built a Buyer Persona From Real Data in Under 5 Minutes',
    youtubeId: '0wXN8O4oSLE',
    duration: '07:35',
    focus: 'Data-driven buyer persona modeling, pain-point mapping, and inbound hooks'
  },
  {
    id: 'cnbc-video',
    channelName: 'CNBC Make It',
    channelHandle: '@CNBCMakeIt',
    channelUrl: 'https://www.youtube.com/@CNBCMakeIt',
    title: "NYC's 'Baklava Guy' Brings In $20K A Month Selling Turkish Pastries",
    youtubeId: 'FO54xDlImCU',
    duration: '09:48',
    focus: 'Bootstrapping, high-margin unit economics, and client-obsessed growth'
  }
];

export default function LearningFeedPanel({
  profile,
  onOpenBooking,
  onOpenCalendar
}: LearningFeedPanelProps) {
  // Track watched video IDs
  const [watchedVideoIds, setWatchedVideoIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('et_curated_learning_watched_v2');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  const [activeVideo, setActiveVideo] = useState<CuratedVideoItem>(CURATED_LEARNING_VIDEOS[0]);

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('et_curated_learning_watched_v2', JSON.stringify(watchedVideoIds));
    }
  }, [watchedVideoIds]);

  const watchedCount = useMemo(() => {
    return CURATED_LEARNING_VIDEOS.filter(v => watchedVideoIds.includes(v.id)).length;
  }, [watchedVideoIds]);

  const handleSelectVideo = (video: CuratedVideoItem) => {
    setActiveVideo(video);
    if (!watchedVideoIds.includes(video.id)) {
      setWatchedVideoIds(prev => [...prev, video.id]);
    }
  };

  const handleToggleWatched = (e: React.MouseEvent, videoId: string) => {
    e.stopPropagation();
    if (watchedVideoIds.includes(videoId)) {
      setWatchedVideoIds(prev => prev.filter(id => id !== videoId));
    } else {
      setWatchedVideoIds(prev => [...prev, videoId]);
    }
  };

  const handleResetProgress = () => {
    setWatchedVideoIds([]);
  };

  return (
    <div className="space-y-6 text-left" id="learning-feed-panel">
      
      {/* Top Intelligence Console Header */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5">
                <Tv className="w-3 h-3 text-cyan-400" />
                Curated Executive Video Feed
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                1 Video Per Source Channel · 7 Total
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
              Strategic Video Masterclasses
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              One authoritative video from each of our 7 curated sources. High-signal frameworks on offer design, modern buyer attention, and revenue pipeline velocity.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-right">
              <span className="block font-mono text-[9px] uppercase tracking-widest text-slate-400">Curriculum Progress</span>
              <span className="font-mono text-sm font-bold text-cyan-300">
                {watchedCount} of {CURATED_LEARNING_VIDEOS.length} Completed
              </span>
            </div>

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

        {/* Progress Bar */}
        <div className="relative z-10 mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="w-full sm:max-w-md">
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(watchedCount / CURATED_LEARNING_VIDEOS.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{Math.round((watchedCount / CURATED_LEARNING_VIDEOS.length) * 100)}% Mastered</span>
            </span>
            {watchedCount > 0 && (
              <button
                type="button"
                onClick={handleResetProgress}
                className="text-[10px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset watch history"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Active Video Cinema Player + 7-Channel Playlist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Active Video Player */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 shadow-sm space-y-4">
            
            {/* Responsive YouTube Player with nocookie embed */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-xl">
              <iframe
                key={activeVideo.youtubeId}
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={activeVideo.title}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Video Metadata: Channel Name & Title */}
            <div className="p-2 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
                <div>
                  <a
                    href={activeVideo.channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1"
                  >
                    {activeVideo.channelName}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-[11px] font-mono text-[var(--muted)] block">
                    {activeVideo.channelHandle}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleToggleWatched(e, activeVideo.id)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      watchedVideoIds.includes(activeVideo.id)
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-[var(--surface2)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--border)]'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${watchedVideoIds.includes(activeVideo.id) ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span>{watchedVideoIds.includes(activeVideo.id) ? 'Completed' : 'Mark Watched'}</span>
                  </button>

                  <a
                    href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[var(--surface2)] hover:bg-[var(--surface)] text-[var(--muted)] hover:text-cyan-600 border border-[var(--border)] transition-all"
                    title="Open on YouTube in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-display font-bold text-[var(--text)] leading-snug">
                {activeVideo.title}
              </h3>

              <div className="p-3.5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-1">
                <span className="font-mono text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 block">
                  Strategic Focus:
                </span>
                <p className="text-xs text-[var(--text)] leading-relaxed">
                  {activeVideo.focus}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-[var(--muted)] pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-500" />
                  {activeVideo.duration}
                </span>
                <span>One Video per Channel</span>
              </div>
            </div>

          </div>

          {/* Strategic Insight Callout */}
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-4 sm:p-5 text-[var(--text)] space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
                Application to Your Growth OS
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              Every video in this curated lineup addresses a foundational pillar of modern scale: offer architecture, organic attention, automated pipeline velocity, and clarity of purpose. Combine these paradigms with your Brand DNA dispatches.
            </p>
          </div>
        </div>

        {/* Right: The 7-Channel Playlist */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-[var(--text)]">
                  7 Curated Channels
                </h4>
                <p className="text-[11px] font-mono text-[var(--muted)]">
                  One Selected Masterclass per Creator
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                {watchedCount}/7 Watched
              </span>
            </div>

            {/* List of exactly 7 items */}
            <div className="space-y-2.5">
              {CURATED_LEARNING_VIDEOS.map((video, idx) => {
                const isCurrent = activeVideo.id === video.id;
                const isWatched = watchedVideoIds.includes(video.id);

                return (
                  <div
                    key={video.id}
                    onClick={() => handleSelectVideo(video)}
                    className={`group relative p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                      isCurrent
                        ? 'border-cyan-500 bg-cyan-500/10 shadow-sm'
                        : 'border-[var(--border)] bg-[var(--surface2)] hover:border-cyan-500/40 hover:bg-[var(--surface)]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Number badge */}
                      <span className={`w-6 h-6 rounded-lg font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        isCurrent
                          ? 'bg-cyan-500 text-slate-950 font-black'
                          : isWatched
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800/40 text-slate-400'
                      }`}>
                        {isWatched ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </span>

                      <div className="flex-1 min-w-0 space-y-1">
                        {/* Channel Name */}
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-mono text-[11px] font-bold uppercase tracking-wider ${
                            isCurrent ? 'text-cyan-650 dark:text-cyan-300' : 'text-slate-600 dark:text-slate-300'
                          }`}>
                            {video.channelName}
                          </span>
                          <span className="font-mono text-[10px] text-[var(--muted)]">
                            {video.duration}
                          </span>
                        </div>

                        {/* Video Title */}
                        <h5 className={`text-xs font-medium leading-snug line-clamp-2 ${
                          isCurrent ? 'text-[var(--text)] font-bold' : 'text-[var(--muted)] group-hover:text-[var(--text)]'
                        }`}>
                          {video.title}
                        </h5>
                      </div>

                      {/* Watched status button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleWatched(e, video.id)}
                        className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                          isWatched 
                            ? 'text-emerald-500 hover:text-emerald-400' 
                            : 'text-slate-400 hover:text-cyan-500'
                        }`}
                        title={isWatched ? 'Marked as watched' : 'Mark as watched'}
                      >
                        <CheckCircle2 className={`w-4 h-4 ${isWatched ? 'fill-emerald-500/20 text-emerald-500' : 'text-slate-400'}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Achievement / Completion status */}
            {watchedCount === CURATED_LEARNING_VIDEOS.length && (
              <div className="mt-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-500">
                  <Award className="w-4 h-4" />
                  <span>Curriculum Complete</span>
                </div>
                <p className="text-[11px] text-[var(--muted)]">
                  You've reviewed all 7 strategic masterclasses from our curated author channels.
                </p>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
