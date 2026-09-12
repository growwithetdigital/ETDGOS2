import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, CheckCircle2, RotateCw, Sparkles, ExternalLink, 
  Tv, Award, Check, ArrowUpRight, Clock, Video
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
  duration?: string;
  start?: number;
}

export interface PlaylistBatch {
  batchId: number;
  batchTitle: string;
  videos: CuratedVideoItem[];
}

// 7 Curated Channels:
// 1. Neil Patel (https://www.youtube.com/@neilpatel)
// 2. Myron Golden (https://www.youtube.com/@MyronGolden)
// 3. GaryVee (https://www.youtube.com/@garyvee)
// 4. HubSpot CRM (https://www.youtube.com/@HubSpot-CRM)
// 5. TED (https://www.youtube.com/@TED)
// 6. HubSpot Marketing (https://www.youtube.com/@HubSpotMarketing)
// 7. CNBC Make It (https://www.youtube.com/@CNBCMakeIt)

export const CURATED_BATCHES: PlaylistBatch[] = [
  {
    batchId: 1,
    batchTitle: 'Batch 1: 2026 Strategic Foundations & Growth Engine',
    videos: [
      {
        id: 'np-b1',
        channelName: 'Neil Patel',
        channelHandle: '@neilpatel',
        channelUrl: 'https://www.youtube.com/@neilpatel',
        title: 'The 8 Trends I’m Betting My Entire Marketing Strategy On in 2026',
        youtubeId: 'hXPALnu3Y6I',
        start: 39,
        duration: '14:28'
      },
      {
        id: 'mg-b1',
        channelName: 'Myron Golden',
        channelHandle: '@MyronGolden',
        channelUrl: 'https://www.youtube.com/@MyronGolden',
        title: 'The 4 Stages of Wealth & Business Growth (How To Scale Without Burnout)',
        youtubeId: 'q8Xm3JdK0L0',
        duration: '18:45'
      },
      {
        id: 'gv-b1',
        channelName: 'GaryVee',
        channelHandle: '@garyvee',
        channelUrl: 'https://www.youtube.com/@garyvee',
        title: 'How to Build Brand Relevance and Capture Organic Attention in 2026',
        youtubeId: '2GjBvF0Y26k',
        duration: '15:10'
      },
      {
        id: 'hscrm-b1',
        channelName: 'HubSpot CRM',
        channelHandle: '@HubSpot-CRM',
        channelUrl: 'https://www.youtube.com/@HubSpot-CRM',
        title: 'How to Build an Automated Sales Pipeline to Close High-Intent Deals Faster',
        youtubeId: '5O_8S8N0pkw',
        duration: '12:35'
      },
      {
        id: 'ted-b1',
        channelName: 'TED',
        channelHandle: '@TED',
        channelUrl: 'https://www.youtube.com/@TED',
        title: 'How Great Leaders Inspire Action — The Golden Circle Framework',
        youtubeId: 'qp0HIF3SfI4',
        duration: '18:04'
      },
      {
        id: 'hsmkt-b1',
        channelName: 'HubSpot Marketing',
        channelHandle: '@HubSpotMarketing',
        channelUrl: 'https://www.youtube.com/@HubSpotMarketing',
        title: 'The Complete Modern Inbound Marketing Strategy Guide for 2026',
        youtubeId: 'lU-446t2u58',
        duration: '16:50'
      },
      {
        id: 'cnbc-b1',
        channelName: 'CNBC Make It',
        channelHandle: '@CNBCMakeIt',
        channelUrl: 'https://www.youtube.com/@CNBCMakeIt',
        title: 'How Founders Build Disciplined Systems That Generate Sustainable Revenue',
        youtubeId: 'B_51Z-tM00E',
        duration: '11:42'
      }
    ]
  },
  {
    batchId: 2,
    batchTitle: 'Batch 2: AI Search, Offer Architecture & Pipeline Velocity',
    videos: [
      {
        id: 'np-b2',
        channelName: 'Neil Patel',
        channelHandle: '@neilpatel',
        channelUrl: 'https://www.youtube.com/@neilpatel',
        title: 'The Only Marketing Strategy That Is Working In 2026',
        youtubeId: 'UlfniLzuwa0',
        duration: '11:15'
      },
      {
        id: 'mg-b2',
        channelName: 'Myron Golden',
        channelHandle: '@MyronGolden',
        channelUrl: 'https://www.youtube.com/@MyronGolden',
        title: 'Offer Creation Masterclass: How to Structure Irresistible Premium Value',
        youtubeId: 'tG3X5bKkYtE',
        duration: '22:15'
      },
      {
        id: 'gv-b2',
        channelName: 'GaryVee',
        channelHandle: '@garyvee',
        channelUrl: 'https://www.youtube.com/@garyvee',
        title: 'The Shift in Modern Distribution: Turning 1 Asset into Omnichannel Reach',
        youtubeId: 'C9W1tU3yQ_w',
        duration: '13:50'
      },
      {
        id: 'hscrm-b2',
        channelName: 'HubSpot CRM',
        channelHandle: '@HubSpot-CRM',
        channelUrl: 'https://www.youtube.com/@HubSpot-CRM',
        title: 'Lead Nurturing & CRM Lifecycle Automation for Service Businesses',
        youtubeId: 'Q0Zf4pL1K8E',
        duration: '14:20'
      },
      {
        id: 'ted-b2',
        channelName: 'TED',
        channelHandle: '@TED',
        channelUrl: 'https://www.youtube.com/@TED',
        title: 'The Power of Vulnerability & Trust in Executive Leadership',
        youtubeId: 'iCvmsMzlF7o',
        duration: '20:19'
      },
      {
        id: 'hsmkt-b2',
        channelName: 'HubSpot Marketing',
        channelHandle: '@HubSpotMarketing',
        channelUrl: 'https://www.youtube.com/@HubSpotMarketing',
        title: 'How to Rank in AI Search (ChatGPT, Gemini, Perplexity) & Google AI Overviews',
        youtubeId: 'N0w3Y-7V1qQ',
        duration: '15:40'
      },
      {
        id: 'cnbc-b2',
        channelName: 'CNBC Make It',
        channelHandle: '@CNBCMakeIt',
        channelUrl: 'https://www.youtube.com/@CNBCMakeIt',
        title: 'Inside the Operating Systems of Resilient, High-Margin Entrepreneurs',
        youtubeId: 'X_1gP9m8Q2E',
        duration: '13:05'
      }
    ]
  },
  {
    batchId: 3,
    batchTitle: 'Batch 3: High-Ticket Conversion, AEO & Brand Equity',
    videos: [
      {
        id: 'np-b3',
        channelName: 'Neil Patel',
        channelHandle: '@neilpatel',
        channelUrl: 'https://www.youtube.com/@neilpatel',
        title: 'The NEW Google Strategy to Double Your Leads (FAST)',
        youtubeId: 'CIGrrt_mVxM',
        duration: '10:42'
      },
      {
        id: 'mg-b3',
        channelName: 'Myron Golden',
        channelHandle: '@MyronGolden',
        channelUrl: 'https://www.youtube.com/@MyronGolden',
        title: 'The Science of Sales Psychology & Overcoming High-Ticket Objections',
        youtubeId: 'V8m2K-0qW9w',
        duration: '19:30'
      },
      {
        id: 'gv-b3',
        channelName: 'GaryVee',
        channelHandle: '@garyvee',
        channelUrl: 'https://www.youtube.com/@garyvee',
        title: 'Stop Overthinking Your Content Strategy: Context Over Fluff',
        youtubeId: 'D7f1T-4eL8s',
        duration: '12:18'
      },
      {
        id: 'hscrm-b3',
        channelName: 'HubSpot CRM',
        channelHandle: '@HubSpot-CRM',
        channelUrl: 'https://www.youtube.com/@HubSpot-CRM',
        title: 'CRM Best Practices to Turn Inbound Leads Into Closed Client Accounts',
        youtubeId: 'K3b9P-2rN5v',
        duration: '11:55'
      },
      {
        id: 'ted-b3',
        channelName: 'TED',
        channelHandle: '@TED',
        channelUrl: 'https://www.youtube.com/@TED',
        title: 'How to Speak So That People Want to Listen',
        youtubeId: 'Y6bbMQXQ14c',
        duration: '09:58'
      },
      {
        id: 'hsmkt-b3',
        channelName: 'HubSpot Marketing',
        channelHandle: '@HubSpotMarketing',
        channelUrl: 'https://www.youtube.com/@HubSpotMarketing',
        title: 'Customer Acquisition Flywheels vs Traditional Marketing Funnels',
        youtubeId: 'R4m7W-1sY6x',
        duration: '14:15'
      },
      {
        id: 'cnbc-b3',
        channelName: 'CNBC Make It',
        channelHandle: '@CNBCMakeIt',
        channelUrl: 'https://www.youtube.com/@CNBCMakeIt',
        title: 'How Scalable Service Businesses Maintain High Profit Margins',
        youtubeId: 'F9v2L-8qZ4m',
        duration: '12:20'
      }
    ]
  }
];

export default function LearningFeedPanel({
  profile,
  onOpenBooking,
  onOpenCalendar
}: LearningFeedPanelProps) {
  // Saved batch index
  const [currentBatchIndex, setCurrentBatchIndex] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('et_learning_feed_batch_idx');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < CURATED_BATCHES.length) {
          return parsed;
        }
      }
    }
    return 0;
  });

  // Track watched video IDs for the active batch
  const [watchedVideoIds, setWatchedVideoIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('et_learning_feed_watched_ids');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  const currentBatch = CURATED_BATCHES[currentBatchIndex];
  const [activeVideo, setActiveVideo] = useState<CuratedVideoItem>(currentBatch.videos[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync active video if batch changes
  useEffect(() => {
    setActiveVideo(currentBatch.videos[0]);
  }, [currentBatchIndex]);

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('et_learning_feed_batch_idx', currentBatchIndex.toString());
      localStorage.setItem('et_learning_feed_watched_ids', JSON.stringify(watchedVideoIds));
    }
  }, [currentBatchIndex, watchedVideoIds]);

  const watchedCountInBatch = useMemo(() => {
    return currentBatch.videos.filter(v => watchedVideoIds.includes(v.id)).length;
  }, [currentBatch, watchedVideoIds]);

  const allWatchedInBatch = watchedCountInBatch === currentBatch.videos.length;

  const handleSelectVideo = (video: CuratedVideoItem) => {
    setActiveVideo(video);
    // Mark as watched upon interaction
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

  const handleRefreshBatch = () => {
    if (!allWatchedInBatch) return;
    setIsRefreshing(true);
    setTimeout(() => {
      const nextIdx = (currentBatchIndex + 1) % CURATED_BATCHES.length;
      setCurrentBatchIndex(nextIdx);
      setIsRefreshing(false);
    }, 600);
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
                Curated Learning Feed
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                7 Authoritative Channels · 1 Video Per Channel
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
              Strategic Video Masterclasses
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Curated rotation of high-impact strategic briefings from seven leading industry channels. Displaying one video per creator per batch.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-right">
              <span className="block font-mono text-[9px] uppercase tracking-widest text-slate-400">Batch Progress</span>
              <span className="font-mono text-sm font-bold text-cyan-300">
                {watchedCountInBatch} of 7 Watched
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

        {/* Batch Progress Bar */}
        <div className="relative z-10 mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="w-full sm:max-w-md">
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(watchedCountInBatch / 7) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{currentBatch.batchTitle}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Video Player + 7-Channel Playlist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Video Player */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 shadow-sm space-y-4">
            
            {/* Embedded Responsive YouTube Player */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-xl">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0${activeVideo.start ? `&start=${activeVideo.start}` : ''}`}
                title={activeVideo.title}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Video Meta Info: Channel Name + Title ONLY (No Avatars) */}
            <div className="p-2 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
                <div>
                  <span className="font-mono text-xs font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 block">
                    {activeVideo.channelName}
                  </span>
                  <span className="text-[11px] font-mono text-[var(--muted)]">
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
                    href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}${activeVideo.start ? `&t=${activeVideo.start}s` : ''}`}
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

              <div className="flex items-center gap-4 text-xs font-mono text-[var(--muted)] pt-1">
                {activeVideo.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-500" />
                    {activeVideo.duration}
                  </span>
                )}
                <span>1 Video per Curated Source</span>
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
              Every masterclass in this curriculum connects directly to your Growth OS dispatches. Use these strategic paradigms to sharpen your Brand DNA, strengthen client acquisition flywheels, and eliminate commodity pricing pressure.
            </p>
          </div>
        </div>

        {/* Right: The 7-Channel Playlist & Refresh Control */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-[var(--text)]">
                  Curated Channel Playlist
                </h4>
                <p className="text-[11px] font-mono text-[var(--muted)]">
                  7 Channels · Name & Title Only
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                {watchedCountInBatch}/7 Complete
              </span>
            </div>

            {/* List of exactly 7 items (One video per channel, Name + Title only, NO Avatars) */}
            <div className="space-y-2.5">
              {currentBatch.videos.map((video, idx) => {
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
                      {/* Step Number indicator */}
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
                        {/* Channel Name ONLY (No Avatar) */}
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-mono text-[11px] font-bold uppercase tracking-wider ${
                            isCurrent ? 'text-cyan-650 dark:text-cyan-300' : 'text-slate-600 dark:text-slate-300'
                          }`}>
                            {video.channelName}
                          </span>
                          {video.duration && (
                            <span className="font-mono text-[10px] text-[var(--muted)]">
                              {video.duration}
                            </span>
                          )}
                        </div>

                        {/* Video Title ONLY */}
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

            {/* Refresh Control: Surfaced ONLY once all 7 videos are watched */}
            <AnimatePresence>
              {allWatchedInBatch ? (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  className="mt-5 p-5 rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-cyan-950/40 text-center space-y-3 shadow-lg"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                      Batch Completed!
                    </h5>
                    <p className="text-xs text-slate-300">
                      You have watched all 7 videos across our curated channels in this batch.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRefreshBatch}
                    disabled={isRefreshing}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-display text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
                    id="refresh-learning-feed-batch-btn"
                  >
                    <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>{isRefreshing ? 'Loading Next Batch...' : 'Refresh Playlist (Pull Next Batch)'}</span>
                  </button>
                </motion.div>
              ) : (
                <div className="mt-4 p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-xs font-mono text-[var(--muted)]">
                    <Clock className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Watch {7 - watchedCountInBatch} more {7 - watchedCountInBatch === 1 ? 'video' : 'videos'} to unlock the next playlist batch</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    The Refresh control automatically unlocks once all 7 channel dispatches are watched.
                  </div>
                </div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>

    </div>
  );
}
