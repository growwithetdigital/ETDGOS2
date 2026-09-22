import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Compass, Activity, Layers, FileBarChart,
  MessageSquareText, Gauge, Users, Map, NotebookPen,
  FolderOpen, Sun, Moon, ArrowUpRight, Circle, CheckCircle2,
  Sparkles, ChevronRight, ChevronDown, FileText, Linkedin,
  Instagram, Facebook, Mail, Gift, Search, ArrowLeft, LogOut,
  Crown, Lock, RefreshCw, Clock, Target, BarChart3, BookOpen,
  ShieldCheck, AlertCircle, Copy, Check, Heart, Cpu, Globe,
  TrendingUp, Zap, HelpCircle, Archive, Tv, Download
} from 'lucide-react';
import { 
  UserProfile, 
  GeneratedContentItem 
} from '../../types';
import { 
  checkUserGenerationEligibility, 
  fetchUserContentLibrary, 
  saveContentToLibrary,
  googleSignOut 
} from '../../lib/firebase';
import { 
  stripMarkdownFormatting, 
  CURATED_NATURAL_PHOTOS, 
  generateSocialPromotionAngles,
  generateEvergreenBlogPost,
  SocialAnglePackage 
} from '../../utils/contentEngineHelpers';
import ContentStudio from './ContentStudio';
import ProfileBusinessDnaPanel from './ProfileBusinessDnaPanel';
import LearningFeedPanel from './LearningFeedPanel';
import OwnerTelemetryModal from './OwnerTelemetryModal';
import MarketReportPanel from './MarketReportPanel';
import FounderNotePanel from './FounderNotePanel';
import DownloadsPanel from './DownloadsPanel';
import { getDownloadedAssets } from '../../utils/downloadStorage';
import { isAuthorizedForTelemetry } from '../../utils/telemetryAuth';
import { recordSectionTime, recordSectionVisit } from '../../utils/userTelemetry';
import Logo from '../Logo';

interface WhiteboardShellProps {
  user: any;
  profile: UserProfile | null;
  onRefreshProfile: (updatedProfile?: UserProfile) => void;
  onCloseDashboard: () => void;
  onOpenBooking: () => void;
  onSignOut?: () => void;
}

// Animated Growth OS Core Matrix Emblem (Homepage animated logo counterpart)
function AnimatedGrowthOSBadge() {
  return (
    <div className="hidden sm:flex items-center gap-2.5 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-cyan-400 select-none shadow-xs">
      <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
        {/* Animated concentric orbital rings from homepage */}
        <svg className="absolute inset-0 w-full h-full animate-[spin_8s_linear_infinite] text-brand-cyan opacity-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="7" strokeDasharray="14 18" fill="none" />
          <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="7" strokeDasharray="24 36" fill="none" />
        </svg>
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
      </div>
      <div className="flex flex-col text-left leading-none">
        <span className="font-display font-black text-[8px] tracking-wider text-white uppercase">
          Growth OS™
        </span>
        <span className="font-mono text-[7px] text-cyan-400 tracking-widest uppercase mt-0.5">
          Matrix Online
        </span>
      </div>
    </div>
  );
}

// Brand Palette (ET Digital Design System)
const palette = {
  cyan: "#0EA5B7",
  cyanBright: "#14C4D6",
  amber: "#C9974D",
};

export function Card({ 
  children, 
  className = "", 
  padding = "p-5" 
}: { 
  children: React.ReactNode; 
  className?: string; 
  padding?: string; 
  key?: React.Key;
}) {
  return (
    <div className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] ${padding} ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeader({ eyebrow, title, desc }: { eyebrow?: string; title: string; desc?: string }) {
  return (
    <div className="mb-6 text-left">
      {eyebrow && (
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent)] font-bold">
          {eyebrow}
        </div>
      )}
      <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-[var(--text)]">{title}</h1>
      {desc && <p className="mt-1.5 max-w-3xl text-xs sm:text-sm text-[var(--muted)] leading-relaxed">{desc}</p>}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Excellent: "text-[var(--accent)] border-[var(--accent)]/40 bg-[var(--accent)]/10",
    Strong: "text-[var(--accent)] border-[var(--accent)]/30 bg-[var(--accent)]/5",
    Developing: "text-[var(--muted)] border-[var(--border)] bg-[var(--surface2)]",
    "Needs Attention": "text-[#C9974D] border-[#C9974D]/30 bg-[#C9974D]/10",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide ${map[status] || map.Developing}`}
    >
      {status}
    </span>
  );
}

export type NavTabId = 
  | 'profile_dna'
  | 'content_studio' 
  | 'downloads'
  | 'market_report' 
  | 'learning_feed'
  | 'founder_note';

export default function WhiteboardShell({
  user,
  profile,
  onRefreshProfile,
  onCloseDashboard,
  onOpenBooking,
  onSignOut,
}: WhiteboardShellProps) {
  // Default to Profile & Business DNA (Tab 1)
  const [activeTab, setActiveTab] = useState<NavTabId>('profile_dna');
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('et_gos_theme');
      if (saved) return saved === 'dark';
    }
    return false; // Default to balanced contrast matching the website
  });
  const [contentList, setContentList] = useState<GeneratedContentItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<GeneratedContentItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStepText, setGenStepText] = useState('');
  const [genError, setGenError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const [showAllModules, setShowAllModules] = useState(false);
  const [dailyTipIndex, setDailyTipIndex] = useState(0);
  const [copiedDailyTip, setCopiedDailyTip] = useState(false);
  const [lockedTabNotice, setLockedTabNotice] = useState<string | null>(null);

  // Track downloads count in Downloads Vault
  const [downloadCount, setDownloadCount] = useState(() => getDownloadedAssets(user?.uid).length);

  useEffect(() => {
    const updateCount = () => {
      setDownloadCount(getDownloadedAssets(user?.uid).length);
    };
    window.addEventListener('et_asset_downloaded', updateCount);
    return () => window.removeEventListener('et_asset_downloaded', updateCount);
  }, [user?.uid]);

  // Track user active time and visits per section for personal telemetry
  useEffect(() => {
    const userId = user?.uid || profile?.uid || 'guest_user';
    const tabNameMap: Record<string, string> = {
      profile_dna: 'Business DNA',
      content_studio: 'Content Studio',
      downloads: 'Downloads Vault',
      market_report: 'Market Report',
      learning_feed: 'Learning Feed',
      founder_note: "Founder's Note"
    };
    const tabName = tabNameMap[activeTab] || activeTab;

    recordSectionVisit(userId, activeTab, tabName);

    const interval = setInterval(() => {
      // Record time if user is active/window has focus
      if (typeof document !== 'undefined' && document.hasFocus()) {
        recordSectionTime(userId, activeTab, tabName, 3);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [user?.uid, profile?.uid, activeTab]);

  // Check if current user is owner / admin strictly matching the 3 authorized emails
  const isOwner = isAuthorizedForTelemetry(user?.email, profile?.email);

  const isFreeTier = profile?.tier === 'free' || !profile?.tier;
  const userEmail = (user?.email || profile?.email || '').trim().toLowerCase();
  const emailKey = userEmail ? userEmail.replace(/[^a-zA-Z0-9]/g, '_') : '';
  const isProfileLocked = Boolean(
    profile?.is_profile_locked || 
    (typeof window !== 'undefined' && (
      localStorage.getItem(`et_dna_locked_${user?.uid || 'guest'}`) === 'true' ||
      (emailKey && localStorage.getItem(`et_dna_locked_${emailKey}`) === 'true') ||
      (userEmail && localStorage.getItem(`et_dna_locked_${userEmail}`) === 'true')
    ))
  );

  // Theme Variables - Balanced Contrast: crisp, WCAG-compliant readability on both light and dark surfaces
  const themeStyles = useMemo(() => {
    return dark
      ? {
          "--bg": "#0B1120",
          "--surface": "#131C31",
          "--surface2": "#1E293B",
          "--border": "#2E3D5B",
          "--text": "#FFFFFF",
          "--muted": "#94A3B8",
          "--accent": palette.cyanBright,
          "--track": "#1E293B",
        }
      : {
          "--bg": "#F8FAFC",
          "--surface": "#FFFFFF",
          "--surface2": "#F1F5F9",
          "--border": "#CBD5E1",
          "--text": "#0F172A",
          "--muted": "#334155",
          "--accent": "#0891B2",
          "--track": "#E2E8F0",
        };
  }, [dark]);

  // Client Details
  const clientName = profile?.business_name || profile?.displayName || 'Eric Thomas';
  const clientLocation = profile?.location || 'Los Angeles, CA';
  const clientMission = profile?.mission_statement || 'business coaching to inspire storytelling';
  const clientAudience = profile?.target_audience || 'Entrepreneurs and service business owners';
  const clientCompetitor = profile?.competitor_website || 'https://ericthomas.com/';
  const clientWebsite = profile?.website_url || 'https://growwithetdigital.com';

  // Fallback initial sample package based on evergreen blog generator so Content Studio is instantly active
  const defaultSampleItem: GeneratedContentItem = useMemo(() => {
    const evergreen = generateEvergreenBlogPost(profile);
    const angles = generateSocialPromotionAngles(profile, evergreen.title, evergreen.markdown_content);

    return {
      id: 'cp_initial_package',
      uid: user?.uid || 'user_1',
      type: 'quarterly_growth_pack',
      created_at: new Date().toISOString(),
      blog_post: {
        title: evergreen.title,
        target_keyword: evergreen.target_keyword,
        word_count: evergreen.word_count,
        markdown_content: evergreen.markdown_content,
        meta_description: evergreen.meta_description,
        natural_photo_url: CURATED_NATURAL_PHOTOS[0].url,
        photo_caption: CURATED_NATURAL_PHOTOS[0].title,
        read_time: evergreen.read_time
      },
      social_captions: {
        linkedin: angles[0].linkedin,
        twitter_x: angles[0].twitter_x,
        facebook: angles[0].facebook,
        instagram_threads: angles[0].instagram_threads
      },
      graphic: {
        public_download_url: CURATED_NATURAL_PHOTOS[0].url,
        prompt_used: `Natural editorial coaching photography in ${clientLocation}`,
        dimensions: { width: 1600, height: 900 }
      },
      social_angles: angles
    };
  }, [profile, clientLocation, user]);

  // Load user content library
  useEffect(() => {
    if (!user?.uid) return;
    const loadContent = async () => {
      try {
        const list = await fetchUserContentLibrary(user.uid);
        if (list && list.length > 0) {
          setContentList(list);
          setSelectedItem(list[0]);
        } else {
          setContentList([defaultSampleItem]);
          setSelectedItem(defaultSampleItem);
        }
      } catch (err) {
        console.warn('Content library load notice:', err);
        setContentList([defaultSampleItem]);
        setSelectedItem(defaultSampleItem);
      }
    };
    loadContent();
  }, [user?.uid, defaultSampleItem]);

  // Exactly 5 Consolidated Dashboard Tabs
  // Gated until profile is completed and locked
  const dashboardTabs = [
    { 
      id: 'profile_dna' as NavTabId, 
      label: 'Business DNA', 
      fullLabel: 'Profile & Business DNA',
      icon: Cpu, 
      badge: isProfileLocked ? 'Active' : 'Setup',
      isGated: false
    },
    { 
      id: 'content_studio' as NavTabId, 
      label: 'Content Studio', 
      fullLabel: 'Content Studio',
      icon: isProfileLocked ? Layers : Lock, 
      badge: isProfileLocked ? 'Suite' : 'Locked',
      isGated: !isProfileLocked
    },
    { 
      id: 'downloads' as NavTabId, 
      label: 'Downloads', 
      fullLabel: 'Downloads Vault',
      icon: isProfileLocked ? Download : Lock, 
      badge: isProfileLocked ? (downloadCount > 0 ? `${downloadCount}` : 'Vault') : 'Locked',
      isGated: !isProfileLocked
    },
    { 
      id: 'market_report' as NavTabId, 
      label: 'Market Report', 
      fullLabel: 'Industry Market Report',
      icon: isProfileLocked ? FileBarChart : Lock, 
      badge: isProfileLocked ? 'Report' : 'Locked',
      isGated: !isProfileLocked
    },
    { 
      id: 'learning_feed' as NavTabId, 
      label: 'Learning Feed', 
      fullLabel: 'Learning Feed',
      icon: isProfileLocked ? Tv : Lock, 
      badge: isProfileLocked ? 'Feeds' : 'Locked',
      isGated: !isProfileLocked
    },
    { 
      id: 'founder_note' as NavTabId, 
      label: "Founder's Note", 
      fullLabel: "Founder's Note",
      icon: isProfileLocked ? Heart : Lock, 
      badge: isProfileLocked ? 'Note' : 'Locked',
      isGated: !isProfileLocked
    },
  ];

  const activeNavItems = dashboardTabs;

  const handleTabClick = (tabId: NavTabId, isGated: boolean) => {
    if (isGated && !isProfileLocked) {
      setLockedTabNotice('🔒 Profile & Business DNA Lock Required. Please calibrate your website and click "Save & Lock Profile" in Tab 1 to unlock your Content Studio, Industry Market Report, and Learning Feed.');
      setActiveTab('profile_dna');
      setTimeout(() => setLockedTabNotice(null), 6000);
      return;
    }
    setActiveTab(tabId);
    setLockedTabNotice(null);
  };

  const handleSignOutClick = async () => {
    if (onSignOut) {
      onSignOut();
    } else {
      if (typeof window !== 'undefined') {
        localStorage.setItem('et_signed_out', 'true');
        localStorage.removeItem('et_growth_os_local_user');
      }
      try {
        await googleSignOut();
      } catch (e) {}
      onCloseDashboard();
    }
  };

  return (
    <div 
      style={themeStyles as any}
      className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col font-sans transition-colors duration-200" 
      id="growth-os-dashboard-shell"
    >
      
      {/* ==================================================================== */}
      {/* 1. GAMING CONSOLE / APPLE OS BOOT HUD BAR (Top Deck) */}
      {/* ==================================================================== */}
      <div className="bg-slate-950/90 border-b border-cyan-500/20 px-4 sm:px-8 py-2 text-left backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="font-mono text-[10px] tracking-widest text-cyan-400 uppercase font-black">
              ET DIGITAL GROWTH OS
            </span>
            <span className="hidden lg:inline-block font-mono text-[9px] text-slate-500">
              | LATENCY: 14ms | ENGINE: GEMINI 2.5 FLASH | ENCRYPTION: 256-BIT SECURE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              {profile?.brand_dna ? '● DNA Calibrated' : '○ DNA Pending Link'}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-500/30 flex items-center gap-1.5 font-bold">
              <Crown className="w-3 h-3 text-amber-400" />
              {profile?.tier === 'monthly' ? 'VIP Implementation Active' : 'Growth OS Active'}
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. EXECUTIVE APP BAR (Apple / Microsoft Style Header) */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-40 bg-[var(--surface)]/95 backdrop-blur-xl border-b border-[var(--border)] px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Brand Identity & Return to Site with ET Digital Branding */}
          <div className="flex items-center gap-3 sm:gap-4 text-left">
            <button
              onClick={onCloseDashboard}
              className="p-2.5 rounded-xl bg-[var(--surface2)] hover:bg-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer min-h-[40px] flex items-center justify-center shrink-0"
              title="Return to Public Overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            
            {/* ET Digital Official Brand Logo */}
            <div 
              onClick={onCloseDashboard}
              className="cursor-pointer flex items-center gap-2 border-r border-[var(--border)] pr-3 sm:pr-4 shrink-0 group"
              title="ET Digital - Return to Homepage"
            >
              <Logo className="h-9 sm:h-10 transition-transform duration-200 group-hover:scale-[1.03]" />
            </div>

            {/* Animated OS Matrix Badge */}
            <AnimatedGrowthOSBadge />

            {/* Client Context & Growth OS Marker */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-[var(--text)] tracking-tight font-display truncate">
                  {clientName}
                </span>
                <span className="hidden md:inline-block font-mono text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border bg-cyan-500/10 text-cyan-600 border-cyan-500/30 shrink-0">
                  Growth OS
                </span>
              </div>
              <p className="text-[11px] text-[var(--muted)] font-mono truncate max-w-[140px] sm:max-w-xs">
                {clientLocation} · {clientMission}
              </p>
            </div>
          </div>

          {/* Right: Controls, Theme, Telemetry & Clean Sign Out */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Theme Balance Toggle (Balanced Light/Dark vs Midnight) */}
            <button
              type="button"
              onClick={() => {
                const next = !dark;
                setDark(next);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('et_gos_theme', next ? 'dark' : 'balanced');
                }
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface2)] text-[var(--text)] hover:bg-[var(--surface)] font-mono text-xs transition-all cursor-pointer shadow-xs min-h-[40px]"
              title={dark ? "Switch to Balanced Contrast (Website Match)" : "Switch to Midnight Dark"}
            >
              {dark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-cyan-600" />}
              <span className="hidden sm:inline font-mono text-[10px] font-bold">
                {dark ? 'Balanced' : 'Midnight'}
              </span>
            </button>

            {/* Toggle All Modules (for users who want to explore full suite) */}
            {isFreeTier && (
              <button
                type="button"
                onClick={() => setShowAllModules(!showAllModules)}
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface2)] text-[var(--muted)] hover:text-[var(--text)] font-mono text-[10px] transition-all cursor-pointer min-h-[40px]"
                title="Toggle between Core Modules and Full Executive Suite"
              >
                <span>{showAllModules ? 'Show Core Modules Only' : 'Explore All Modules'}</span>
              </button>
            )}

            {/* Telemetry Modal Toggle - Available to all users to see their private metrics */}
            <button
              type="button"
              onClick={() => setIsTelemetryOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/50 text-cyan-300 font-mono text-[11px] font-bold hover:bg-cyan-900/60 transition-all cursor-pointer shadow-sm min-h-[40px]"
              title={isOwner ? "View Platform & Executive Telemetry" : "View Your Activity & Usage Telemetry"}
              id="telemetry-modal-toggle-btn"
            >
              <BarChart3 className="w-3.5 h-3.5 text-brand-cyan" />
              <span className="hidden md:inline">Telemetry</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            {/* Book Consultation Button */}
            <button
              type="button"
              onClick={onOpenBooking}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-display text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm min-h-[40px]"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Speak with Us</span>
              <span className="sm:hidden">Consult</span>
            </button>

            {/* Sign Out Button (Unmistakable & Guaranteed to keep user signed out) */}
            <button
              type="button"
              onClick={handleSignOutClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-[var(--muted)] hover:text-white rounded-xl bg-[var(--surface2)] hover:bg-rose-950/60 hover:text-rose-300 hover:border-rose-500/40 border border-[var(--border)] transition-all cursor-pointer shadow-xs min-h-[40px]"
              title="Sign Out of Growth OS"
              id="whiteboard-signout-btn"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* ==================================================================== */}
      {/* 3. DYNAMIC NAVIGATION DOCK (100% VISIBLE, NO HORIZONTAL SCROLL) */}
      {/* ==================================================================== */}
      <div className="bg-[var(--surface2)]/90 border-b border-[var(--border)] px-2 sm:px-4 md:px-8 sticky top-[57px] z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto grid grid-cols-5 gap-1 sm:gap-2 py-2 w-full">
          {activeNavItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTabClick(tab.id as NavTabId, tab.isGated)}
                id={`dashboard-tab-${tab.id}`}
                title={tab.fullLabel || tab.label}
                className={`relative px-1 sm:px-3 py-2 rounded-xl font-display text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer w-full text-center truncate ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/25 font-black'
                    : tab.isGated
                    ? 'text-[var(--muted)]/60 hover:text-[var(--muted)] hover:bg-[var(--surface)] border border-dashed border-[var(--border)]'
                    : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] border border-transparent hover:border-[var(--border)]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-slate-950' : tab.isGated ? 'text-amber-400/80' : 'text-[var(--accent)]'}`} />
                <span className="truncate">{tab.label}</span>
                {'badge' in tab && (
                  <span className={`hidden lg:inline-flex text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold shrink-0 ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : tab.isGated ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30' : 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Locked Notice Alert Banner */}
      {lockedTabNotice && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{lockedTabNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setLockedTabNotice(null)}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[10px] font-mono font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. MAIN WORKSPACE BODY (With Operating System motion transitions) */}
      {/* ==================================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, filter: 'blur(2px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {/* ==================================================================== */}
            {/* TAB 1: PROFILE & BUSINESS DNA (Merged Profile + Brand DNA + Growth Auditor) */}
            {/* ==================================================================== */}
            {activeTab === 'profile_dna' && (
              <ProfileBusinessDnaPanel
                user={user}
                profile={profile}
                onRefreshProfile={onRefreshProfile}
                onNavigateToContentStudio={() => setActiveTab('content_studio')}
                onOpenBooking={onOpenBooking}
              />
            )}

            {/* ==================================================================== */}
            {/* TAB 2: CONTENT STUDIO (1 Post + 4 Social Media Promotion Angles) */}
            {/* ==================================================================== */}
            {activeTab === 'content_studio' && (
              <div className="space-y-6">
                {!profile?.writing_sample && (
                  <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-5 h-5 text-cyan-400 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-white font-display">
                          Calibrate Your Authentic Writing Voice
                        </h4>
                        <p className="text-xs text-slate-300">
                          Add a 2-4 sentence writing sample in Profile & Business DNA so your editorial post and social copy sound unmistakably like you.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('profile_dna')}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-display text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer"
                    >
                      Calibrate Voice DNA →
                    </button>
                  </div>
                )}

                <ContentStudio
                  item={selectedItem || defaultSampleItem}
                  profile={profile}
                  user={user}
                  onRefreshProfile={onRefreshProfile}
                  onOpenBooking={onOpenBooking}
                  onNavigateToBrandDna={() => setActiveTab('profile_dna')}
                />
              </div>
            )}

            {/* ==================================================================== */}
            {/* TAB: SAVED DOWNLOADS VAULT */}
            {/* ==================================================================== */}
            {activeTab === 'downloads' && (
              <DownloadsPanel
                user={user}
                profile={profile}
                onNavigateToContentStudio={() => setActiveTab('content_studio')}
                onOpenBooking={onOpenBooking}
              />
            )}

            {/* ==================================================================== */}
            {/* TAB 3: INDUSTRY MARKET REPORT (Trailing 30D-YTD) */}
            {/* ==================================================================== */}
            {activeTab === 'market_report' && (
              <MarketReportPanel
                user={user}
                profile={profile}
                onRefreshProfile={onRefreshProfile}
                onOpenBooking={onOpenBooking}
                onNavigateToContentStudio={() => setActiveTab('content_studio')}
              />
            )}

            {/* ==================================================================== */}
            {/* TAB 4: LEARNING FEED (7 Curated Channels, 1 Video/Channel) */}
            {/* ==================================================================== */}
            {activeTab === 'learning_feed' && (
              <LearningFeedPanel
                profile={profile}
                onOpenBooking={onOpenBooking}
              />
            )}

            {/* ==================================================================== */}
            {/* TAB 5: FOUNDER'S NOTE (Closing Note, Research Rigor/Sourcing, Consultation CTA) */}
            {/* ==================================================================== */}
            {activeTab === 'founder_note' && (
              <FounderNotePanel
                profile={profile}
                onOpenBooking={onOpenBooking}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Platform Usage & Personal Activity Telemetry Modal */}
      <OwnerTelemetryModal
        isOpen={isTelemetryOpen}
        onClose={() => setIsTelemetryOpen(false)}
        currentEmail={user?.email || profile?.email}
        user={user}
        profile={profile}
        onSelectTab={(tabId) => {
          setActiveTab(tabId as NavTabId);
          setIsTelemetryOpen(false);
        }}
      />

    </div>
  );
}
