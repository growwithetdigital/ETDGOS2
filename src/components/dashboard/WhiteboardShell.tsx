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
  TrendingUp, Zap, HelpCircle, Archive, Tv
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
import BusinessProfileForm from './BusinessProfileForm';
import AuditorArchivePanel from './AuditorArchivePanel';
import FeaturedInsightsPanel from './FeaturedInsightsPanel';
import OwnerTelemetryModal from './OwnerTelemetryModal';
import BusinessDnaPanel from './BusinessDnaPanel';
import MarketReportPanel from './MarketReportPanel';
import FounderNotePanel from './FounderNotePanel';
import ContentArchivePanel from './ContentArchivePanel';
import MarketingShortsPanel from './MarketingShortsPanel';
import { isAuthorizedForTelemetry } from '../../utils/telemetryAuth';
import { WORKING_MARKETING_TIPS } from '../../data/marketingTips';

interface WhiteboardShellProps {
  user: any;
  profile: UserProfile | null;
  onRefreshProfile: () => void;
  onCloseDashboard: () => void;
  onOpenBooking: () => void;
  onSignOut?: () => void;
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
  | 'content_studio' 
  | 'archive'
  | 'marketing_shorts'
  | 'business_dna' 
  | 'market_report' 
  | 'auditor' 
  | 'founder_note'
  | 'overview' 
  | 'foundation' 
  | 'insights' 
  | 'profile' 
  | 'roadmap' 
  | 'competitors';

export default function WhiteboardShell({
  user,
  profile,
  onRefreshProfile,
  onCloseDashboard,
  onOpenBooking,
  onSignOut,
}: WhiteboardShellProps) {
  // Default to Content Studio (1-Asset Operating System)
  const [activeTab, setActiveTab] = useState<NavTabId>('content_studio');
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

  // Check if current user is owner / admin strictly matching the 3 authorized emails
  const isOwner = isAuthorizedForTelemetry(user?.email, profile?.email);

  const isFreeTier = profile?.tier === 'free' || !profile?.tier;

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

  // Core Tier Tabs with 3 Pillars & Roadmap included
  const coreNavItems = [
    { id: 'content_studio', label: 'Content Studio', icon: Layers, badge: '1-Asset Kit' },
    { id: 'archive', label: 'Dispatches Archive', icon: Archive, badge: 'History' },
    { id: 'marketing_shorts', label: 'Marketing Shorts', icon: Tv, badge: 'Updates' },
    { id: 'foundation', label: 'Engage · Convert · Grow', icon: Compass, badge: '3 Pillars' },
    { id: 'business_dna', label: 'Brand DNA & Scanner', icon: Cpu, badge: 'Pomelli DNA' },
    { id: 'market_report', label: 'Market Intel', icon: FileBarChart, badge: '1 Headline' },
    { id: 'auditor', label: 'Site Diagnostic', icon: BarChart3, badge: 'Audit' },
    { id: 'roadmap', label: 'Quarterly Trajectory', icon: Map, badge: '90-Day' },
    { id: 'founder_note', label: 'Letter from Founder', icon: Heart, badge: 'Scale' },
  ];

  // Extended Executive Modules for Consultation / Owner / Pro users
  const proNavItems = [
    { id: 'content_studio', label: 'Content Studio', icon: Layers },
    { id: 'archive', label: 'Dispatches Archive', icon: Archive },
    { id: 'marketing_shorts', label: 'Marketing Shorts', icon: Tv },
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
    { id: 'business_dna', label: 'Business DNA', icon: Cpu },
    { id: 'market_report', label: 'Market Report', icon: FileBarChart },
    { id: 'auditor', label: 'Auditor & Diagnostics', icon: BarChart3 },
    { id: 'foundation', label: '3 Foundation Pillars', icon: Compass },
    { id: 'roadmap', label: 'Quarterly Roadmap', icon: Map },
    { id: 'competitors', label: 'Competitor Insights', icon: Users },
    { id: 'insights', label: 'Tactics Vault', icon: BookOpen },
    { id: 'founder_note', label: 'Founder Letter & Scale', icon: Heart },
  ];

  const activeNavItems = (!isFreeTier || showAllModules || isOwner) ? proNavItems : coreNavItems;

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
              ET DIGITAL GROWTH OS // CORE v2.6 ACTIVE
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
              {profile?.tier === 'monthly' ? 'VIP Monthly Retainer ($2,500/mo)' : 'Executive Starter Tier ($2,500/mo Architecture)'}
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. EXECUTIVE APP BAR (Apple / Microsoft Style Header) */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-40 bg-[var(--surface)]/95 backdrop-blur-xl border-b border-[var(--border)] px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Brand Identity & Return to Site */}
          <div className="flex items-center gap-3 text-left">
            <button
              onClick={onCloseDashboard}
              className="p-2.5 rounded-xl bg-[var(--surface2)] hover:bg-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer min-h-[40px] flex items-center justify-center"
              title="Return to Public Overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-[var(--text)] tracking-tight font-display">
                  {clientName}
                </span>
                <span className="font-mono text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border bg-cyan-500/10 text-cyan-600 border-cyan-500/30">
                  Growth OS
                </span>
              </div>
              <p className="text-[11px] text-[var(--muted)] font-mono truncate max-w-[200px] sm:max-w-xs">
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

            {/* Owner Telemetry Modal Toggle */}
            {isOwner && (
              <button
                type="button"
                onClick={() => setIsTelemetryOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/50 text-cyan-300 font-mono text-[11px] font-bold hover:bg-cyan-900/60 transition-all cursor-pointer shadow-sm min-h-[40px]"
                title="View Platform Usage Telemetry"
              >
                <BarChart3 className="w-3.5 h-3.5 text-brand-cyan" />
                <span className="hidden md:inline">Telemetry</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            )}

            {/* Book Consultation Button */}
            <button
              type="button"
              onClick={onOpenBooking}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-display text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm min-h-[40px]"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Consult with Eric</span>
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
      {/* 3. DYNAMIC GAMING / VISIONOS NAVIGATION DOCK */}
      {/* ==================================================================== */}
      <div className="bg-[var(--surface2)]/80 border-b border-[var(--border)] px-4 sm:px-8 sticky top-[57px] z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar">
          {activeNavItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as NavTabId)}
                className={`relative px-4 py-2 rounded-xl font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/25 font-black scale-100'
                    : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] border border-transparent hover:border-[var(--border)]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-[var(--accent)]'}`} />
                <span>{tab.label}</span>
                {'badge' in tab && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. MAIN WORKSPACE BODY */}
      {/* ==================================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* ==================================================================== */}
        {/* CORE TAB: BUSINESS & BRAND VOICE DNA */}
        {/* ==================================================================== */}
        {activeTab === 'business_dna' && (
          <BusinessDnaPanel
            profile={profile}
            onRefreshProfile={onRefreshProfile}
            onNavigateToContentStudio={() => setActiveTab('content_studio')}
          />
        )}

        {/* ==================================================================== */}
        {/* FREE TAB 2: MARKET REPORT FOR THEIR INDUSTRY */}
        {/* ==================================================================== */}
        {activeTab === 'market_report' && (
          <MarketReportPanel
            user={user}
            profile={profile}
            onOpenBooking={onOpenBooking}
          />
        )}

        {/* ==================================================================== */}
        {/* TAB: CONTENT ARCHIVE (Saved blog posts, graphics & captions) */}
        {/* ==================================================================== */}
        {activeTab === 'archive' && (
          <ContentArchivePanel
            user={user}
            profile={profile}
            items={contentList.length > 0 ? contentList : [defaultSampleItem]}
            onSelectAndLoad={(item) => {
              setSelectedItem(item);
              setActiveTab('content_studio');
            }}
            onNavigateToContentStudio={() => setActiveTab('content_studio')}
            onOpenBooking={onOpenBooking}
          />
        )}

        {/* ==================================================================== */}
        {/* TAB: MARKETING SHORTS (Curated video shorts from Neil Patel, Gary Vee, Tom Ferry, Eric) */}
        {/* ==================================================================== */}
        {activeTab === 'marketing_shorts' && (
          <MarketingShortsPanel
            profile={profile}
            onOpenBooking={onOpenBooking}
            onNavigateToContentStudio={() => setActiveTab('content_studio')}
          />
        )}

        {/* ==================================================================== */}
        {/* FREE TAB 3: FREE AUDITOR TOOL */}
        {/* ==================================================================== */}
        {activeTab === 'auditor' && (
          <AuditorArchivePanel
            user={user}
            profile={profile}
            onOpenBooking={onOpenBooking}
          />
        )}

        {/* ==================================================================== */}
        {/* FREE TAB 4: CONTENT STUDIO (1 Post + 4 Social Media Angles) */}
        {/* ==================================================================== */}
        {activeTab === 'content_studio' && (
          <div className="space-y-6">
            {/* Writing sample calibration callout if needed */}
            {!profile?.writing_sample && (
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">
                      Calibrate Your Authentic Writing Voice
                    </h4>
                    <p className="text-xs text-slate-300">
                      Add a 2-4 sentence writing sample in Business DNA so your blog post and social copy sound unmistakably like you.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('business_dna')}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-display text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer"
                >
                  Calibrate Voice DNA →
                </button>
              </div>
            )}

            <ContentStudio
              item={selectedItem || defaultSampleItem}
              profile={profile}
              onOpenBooking={onOpenBooking}
              onNavigateToBrandDna={() => setActiveTab('business_dna')}
            />
          </div>
        )}

        {/* ==================================================================== */}
        {/* FREE TAB 5: NOTE FROM FOUNDER & UPGRADE LEAD GEN */}
        {/* ==================================================================== */}
        {activeTab === 'founder_note' && (
          <FounderNotePanel
            profile={profile}
            onOpenBooking={onOpenBooking}
          />
        )}

        {/* ==================================================================== */}
        {/* PRO / ALL MODULES TAB: EXECUTIVE OVERVIEW */}
        {/* ==================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <SectionHeader
              eyebrow="Executive Command Center"
              title={`${clientName} — Growth OS Command`}
              desc="A real-time executive view of your category authority, foundation health, and quarterly execution priorities."
            />

            {/* Daily Growth Dispatch: Tested Marketing Tactic */}
            {(() => {
              const currentTip = WORKING_MARKETING_TIPS[dailyTipIndex % WORKING_MARKETING_TIPS.length];
              return (
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-sm relative overflow-hidden text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4 mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30">
                        Daily Growth Dispatch
                      </span>
                      <span className="font-mono text-[9px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {currentTip.category}
                      </span>
                      <span className="font-mono text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {currentTip.impactMetric}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDailyTipIndex(prev => (prev + 1) % WORKING_MARKETING_TIPS.length)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[var(--surface2)] hover:bg-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] font-mono text-[10px] font-bold transition-all cursor-pointer border border-[var(--border)]"
                      >
                        <RefreshCw className="w-3 h-3 text-[var(--accent)]" />
                        <span>Next Tactic ({((dailyTipIndex % WORKING_MARKETING_TIPS.length) + 1)}/{WORKING_MARKETING_TIPS.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('insights')}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 text-[var(--accent)] font-mono text-[10px] font-bold transition-all cursor-pointer border border-[var(--accent)]/30"
                      >
                        <span>Tactics Vault</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[var(--text)] tracking-tight mb-2">
                      {currentTip.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed mb-4">
                      <strong className="text-[var(--text)]">Tested Tactic: </strong>
                      {currentTip.tactic}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-4">
                      <div className="p-3.5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)]">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold block mb-1">
                          Research Proof & Mechanism
                        </span>
                        <p className="text-xs text-[var(--muted)] leading-relaxed">
                          {currentTip.whyItWorks}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)]">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] font-bold block mb-1">
                          Action Blueprint Steps
                        </span>
                        <ul className="space-y-1 text-xs text-[var(--text)]">
                          {currentTip.stepByStep.slice(0, 2).map((s, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="font-mono text-[10px] text-[var(--accent)] shrink-0 mt-0.5">0{idx + 1}.</span>
                              <span className="line-clamp-2">{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB: 3 FOUNDATION PILLARS (Engage, Convert, Grow) */}
        {/* ==================================================================== */}
        {activeTab === 'foundation' && (
          <div className="space-y-6 text-left" id="three-foundation-pillars">
            <SectionHeader
              eyebrow="Core Operating Architecture"
              title="3 Foundation Pillars: Engage · Convert · Grow"
              desc={`Custom tailored for ${clientName} based on your strategic footprint and latest evergreen blog release: "${selectedItem?.blog_post.title || defaultSampleItem.blog_post.title}".`}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pillar 1: ENGAGE */}
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-sm space-y-4 relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[var(--accent)] font-mono font-black text-sm">
                        01
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent)] font-bold block">
                          Pillar 01
                        </span>
                        <h3 className="font-display text-xl font-bold text-[var(--text)]">
                          Engage
                        </h3>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-[var(--accent)] border border-cyan-500/30">
                      Discovery Hook
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2">
                    <div className="flex items-center gap-1.5 text-[var(--accent)] font-mono text-[10px] font-bold uppercase tracking-wider">
                      <Target className="w-3.5 h-3.5" />
                      <span>The 1 Strategic Tip for {clientName}</span>
                    </div>
                    <p className="text-xs text-[var(--text)] leading-relaxed font-sans font-medium">
                      Publish the conversational premise of <em>"{selectedItem?.blog_post.title || defaultSampleItem.blog_post.title}"</em> directly onto LinkedIn and regional industry networks. Open with the exact high-friction challenge facing {clientAudience} in {clientLocation}, immediately framing your brand voice as the definitive authority before commoditized competitors can react.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border)] flex items-start gap-2 text-xs text-[var(--muted)]">
                  <ArrowUpRight className="w-3.5 h-3.5 mt-0.5 text-[var(--accent)] shrink-0" />
                  <span><strong>Execution:</strong> Deploy your 1 engaging social caption and 1:1 editorial thumbnail from Content Studio to fuel discovery.</span>
                </div>
              </div>

              {/* Pillar 2: CONVERT */}
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-sm space-y-4 relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-mono font-black text-sm">
                        02
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold block">
                          Pillar 02
                        </span>
                        <h3 className="font-display text-xl font-bold text-[var(--text)]">
                          Convert
                        </h3>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                      Zero-Friction Intake
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>The 1 Strategic Tip for {clientName}</span>
                    </div>
                    <p className="text-xs text-[var(--text)] leading-relaxed font-sans font-medium">
                      Place a direct diagnostic or consultation CTA at the bottom of your 300-word post. When {clientAudience} finish reading <em>"{selectedItem?.blog_post.title || defaultSampleItem.blog_post.title}"</em>, invite them into a direct intake evaluation that reinforces your mission: <em>"{clientMission}"</em>. Prospects convert 3.8x faster when moving from editorial authority directly to an intake evaluation.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border)] flex items-start gap-2 text-xs text-[var(--muted)]">
                  <ArrowUpRight className="w-3.5 h-3.5 mt-0.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span><strong>Execution:</strong> Send your 1 150-word eblast and publish the Google Business Profile post to convert active searchers.</span>
                </div>
              </div>

              {/* Pillar 3: GROW */}
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-sm space-y-4 relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm">
                        03
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold block">
                          Pillar 03
                        </span>
                        <h3 className="font-display text-xl font-bold text-[var(--text)]">
                          Grow
                        </h3>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                      Compounding Authority
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2">
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>The 1 Strategic Tip for {clientName}</span>
                    </div>
                    <p className="text-xs text-[var(--text)] leading-relaxed font-sans font-medium">
                      Syndicate key takeaway quotes from <em>"{selectedItem?.blog_post.title || defaultSampleItem.blog_post.title}"</em> into recurring client email briefings and regional partnerships. Pair the downloadable 1:1 editorial thumbnail with strategic partner shoutouts across {clientLocation} to spark compounding referral loops that drive continuous inbound revenue.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border)] flex items-start gap-2 text-xs text-[var(--muted)]">
                  <ArrowUpRight className="w-3.5 h-3.5 mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span><strong>Execution:</strong> Download your 1:1 editorial graphic (PNG) with your business name overlay from Content Studio and syndicate with key partners.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* PRO TAB: TACTICS VAULT & INSIGHTS */}
        {/* ==================================================================== */}
        {activeTab === 'insights' && (
          <FeaturedInsightsPanel onOpenBooking={onOpenBooking} />
        )}

        {/* ==================================================================== */}
        {/* PRO TAB: PROFILE & VOICE FORM */}
        {/* ==================================================================== */}
        {activeTab === 'profile' && (
          <BusinessProfileForm
            user={user}
            profile={profile}
            onProfileUpdated={onRefreshProfile}
            onContinueToGeneration={() => setActiveTab('content_studio')}
          />
        )}

        {/* ==================================================================== */}
        {/* TAB: QUARTERLY ROADMAP (Engage, Convert, Grow) */}
        {/* ==================================================================== */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6 text-left" id="quarterly-roadmap-pillars">
            <SectionHeader
              eyebrow="Quarterly Execution Architecture"
              title="Quarterly Roadmap: Engage · Convert · Grow"
              desc={`A 90-day sequential trajectory structured around your 3 foundation pillars and anchored by: "${selectedItem?.blog_post.title || defaultSampleItem.blog_post.title}".`}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Month 1: Engage */}
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--accent)] font-bold">
                      Month 1 (30 Days) · Engage
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 font-bold">
                      Pillar 01
                    </span>
                  </div>
                  <h4 className="font-display text-base font-bold text-[var(--text)]">
                    Activate Voice & Publish Editorial
                  </h4>
                  <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold block">
                      The 1 Strategic Priority
                    </span>
                    <p className="text-xs text-[var(--text)] leading-relaxed font-sans font-medium">
                      Publish <em>"{selectedItem?.blog_post.title || defaultSampleItem.blog_post.title}"</em> on {clientWebsite || 'your website'} and distribute the 4 social angles to {clientAudience}. Lock in your authentic Brand DNA so every public touchpoint sounds unmistakably like {clientName}.
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-[var(--border)] flex items-center gap-1.5 text-xs text-[var(--accent)] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Milestone: Published post + 4 organic distribution waves</span>
                </div>
              </div>

              {/* Month 2: Convert */}
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
                      Month 2 (60 Days) · Convert
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold">
                      Pillar 02
                    </span>
                  </div>
                  <h4 className="font-display text-base font-bold text-[var(--text)]">
                    Zero-Friction Intake Diagnostic
                  </h4>
                  <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold block">
                      The 1 Strategic Priority
                    </span>
                    <p className="text-xs text-[var(--text)] leading-relaxed font-sans font-medium">
                      Integrate an interactive diagnostic intake on the landing page of <em>"{selectedItem?.blog_post.title || defaultSampleItem.blog_post.title}"</em>. Transition readers from passive consumers into qualified consultations, eliminating cold intake friction in {clientLocation}.
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-[var(--border)] flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Milestone: Frictionless diagnostic intake live</span>
                </div>
              </div>

              {/* Month 3: Grow */}
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold">
                      Month 3 (90 Days) · Grow
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold">
                      Pillar 03
                    </span>
                  </div>
                  <h4 className="font-display text-base font-bold text-[var(--text)]">
                    Compounding Authority & Scaling
                  </h4>
                  <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold block">
                      The 1 Strategic Priority
                    </span>
                    <p className="text-xs text-[var(--text)] leading-relaxed font-sans font-medium">
                      Syndicate the core insights of <em>"{selectedItem?.blog_post.title || defaultSampleItem.blog_post.title}"</em> to key strategic partners in {clientLocation} and schedule your private 1-on-1 Growth Consultation with Eric Thomas to expand into a multi-channel acquisition flywheel.
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-[var(--border)] flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Milestone: Compounding referral flywheel & 1-on-1 Scale Session</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* PRO TAB: COMPETITOR INSIGHTS */}
        {/* ==================================================================== */}
        {activeTab === 'competitors' && (
          <div className="space-y-6 text-left">
            <SectionHeader
              eyebrow="Competitor Insights"
              title="Where the Category Lane Is Open"
              desc="Strategic observations on market positioning and differentiation."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <div className="mb-2 font-mono text-[11px] uppercase tracking-wide text-[var(--accent)] font-semibold">
                  Content Opportunities
                </div>
                <p className="text-sm leading-relaxed text-[var(--text)]">
                  Competitors produce generic, sporadic category posts without structured frameworks. By leading with your core mission and concrete local search intent, your brand captures the high-trust lane.
                </p>
              </Card>

              <Card>
                <div className="mb-2 font-mono text-[11px] uppercase tracking-wide text-[var(--accent)] font-semibold">
                  Entity & Search Readiness (AEO)
                </div>
                <p className="text-sm leading-relaxed text-[var(--text)]">
                  Most competitor sites lack verified schema markup, making them invisible in AI chat engines. Deploying intent-driven answers and verified entity data gives your brand an immediate early-mover advantage.
                </p>
              </Card>
            </div>
          </div>
        )}

      </main>

      {/* Owner Platform Usage Telemetry Modal */}
      <OwnerTelemetryModal
        isOpen={isTelemetryOpen}
        onClose={() => setIsTelemetryOpen(false)}
        currentEmail={user?.email}
      />

    </div>
  );
}
