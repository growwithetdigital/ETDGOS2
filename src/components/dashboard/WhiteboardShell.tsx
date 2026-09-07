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
  TrendingUp, Zap, HelpCircle
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
  | 'business_dna' 
  | 'market_report' 
  | 'auditor' 
  | 'content_studio' 
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
  // Default to Business DNA as requested for Free Tier
  const [activeTab, setActiveTab] = useState<NavTabId>('business_dna');
  const [dark, setDark] = useState(true);
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

  // Check if current user is owner / admin
  const isOwner = Boolean(
    user?.email === 'ericlamarthomas@gmail.com' ||
    user?.uid?.includes('owner') ||
    profile?.role === 'owner' ||
    profile?.role === 'admin'
  );

  const isFreeTier = profile?.tier === 'free' || !profile?.tier;

  // Theme Variables
  const themeStyles = useMemo(() => {
    return dark
      ? {
          "--bg": "#05080E",
          "--surface": "#0C111C",
          "--surface2": "#131926",
          "--border": "#1E2738",
          "--text": "#F1F5F9",
          "--muted": "#94A3B8",
          "--accent": palette.cyanBright,
          "--track": "#1E2738",
        }
      : {
          "--bg": "#F8FAFC",
          "--surface": "#FFFFFF",
          "--surface2": "#F1F5F9",
          "--border": "#E2E8F0",
          "--text": "#0F172A",
          "--muted": "#64748B",
          "--accent": palette.cyan,
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

  // Fallback initial sample package so Content Studio is instantly active
  const defaultSampleItem: GeneratedContentItem = useMemo(() => {
    const title = `${clientName}: The Strategic Growth Blueprint for ${clientLocation}`;
    const targetKeyword = `${clientName} ${clientLocation} category authority`;
    const markdown = `# ${title}

In today's fast-evolving market, high-intent buyers in **${clientLocation}** don't have time to wade through generic marketing noise. They want definitive solutions from trusted authorities who understand their specific challenges.

At **${clientName}**, our core mission is clear: *"${clientMission}"*. Yet even market-leading organizations face an urgent bottleneck: converting online discovery into qualified, predictable customer conversations.

---

## 1. The Differentiation Advantage

While competitors continue relying on outdated, sporadic marketing tactics, modern buyers evaluate trust through clear proof, structured authority, and direct answers. 

To lead the market, **${clientName}** must leverage three strategic differentiators:
* **Hyper-Relevant Geographic Visibility:** Capturing high-intent local and regional search queries from **${clientAudience}**.
* **Zero-Friction Conversion:** Replacing convoluted contact forms with instant diagnostic tools and frictionless intake channels.
* **Consistent Brand Narrative:** Maintaining an **Authoritative & Strategic** tone across every digital touchpoint—from first impression through direct contact with ${clientName}.

---

## 2. Eliminating Conversion Friction

A high-performing digital footprint is not a billboard—it is a conversion machine. High-intent visitors must immediately understand:
1. What exact problem you solve.
2. Who you have successfully solved it for.
3. The frictionless next step to work with you.

By prioritizing clear storytelling over corporate jargon, **${clientName}** transforms passive web visitors into high-trust client relationships.`;

    const angles = generateSocialPromotionAngles(profile, title, markdown);

    return {
      id: 'cp_initial_package',
      uid: user?.uid || 'user_1',
      type: 'quarterly_growth_pack',
      created_at: new Date().toISOString(),
      blog_post: {
        title,
        target_keyword: targetKeyword,
        word_count: 420,
        markdown_content: markdown,
        meta_description: `An executive growth roadmap for ${clientName} in ${clientLocation}: How authentic storytelling and predictable intake outperform conventional agencies.`,
        natural_photo_url: CURATED_NATURAL_PHOTOS[0].url,
        photo_caption: CURATED_NATURAL_PHOTOS[0].title,
        read_time: '3 Min Read'
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
  }, [clientName, clientLocation, clientMission, clientAudience, clientCompetitor, profile, user]);

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

  // Explicit Free Tier Tabs as requested:
  // 1. business_dna (Business DNA - Google Pomelli style)
  // 2. market_report (Market Report for their Industry)
  // 3. auditor (Free Auditor Tool)
  // 4. content_studio (Content Studio: 1 blog post in their voice + 4 social media versions giving 3 options to promote)
  // 5. founder_note (Note from Founder Eric Thomas & Upgrade Lead Gen)
  const freeTierNavItems = [
    { id: 'business_dna', label: 'Business DNA', icon: Cpu, badge: 'Pomelli' },
    { id: 'market_report', label: 'Market Report', icon: FileBarChart, badge: 'Q1 Intel' },
    { id: 'auditor', label: 'Auditor Tool', icon: BarChart3, badge: 'Free' },
    { id: 'content_studio', label: 'Content Studio', icon: Layers, badge: '1 Post + 4 Angles' },
    { id: 'founder_note', label: 'Note From Founder', icon: Heart, badge: 'Upgrade' },
  ];

  // Extended Executive Modules for Consultation / Owner / Pro users
  const proNavItems = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
    { id: 'business_dna', label: 'Business DNA', icon: Cpu },
    { id: 'market_report', label: 'Market Report', icon: FileBarChart },
    { id: 'auditor', label: 'Auditor & Diagnostics', icon: BarChart3 },
    { id: 'content_studio', label: 'Content Studio', icon: Layers },
    { id: 'foundation', label: '10 Foundation Pillars', icon: Compass },
    { id: 'roadmap', label: 'Quarterly Roadmap', icon: Map },
    { id: 'competitors', label: 'Competitor Insights', icon: Users },
    { id: 'insights', label: 'Tactics Vault', icon: BookOpen },
    { id: 'founder_note', label: 'Founder Letter & Scale', icon: Heart },
  ];

  const activeNavItems = (!isFreeTier || showAllModules || isOwner) ? proNavItems : freeTierNavItems;

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
            <span className="font-mono text-[9px] uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              {profile?.tier === 'monthly' ? 'VIP Monthly Suite' : 'Free Growth Tier'}
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. EXECUTIVE APP BAR (Apple / Microsoft Style Header) */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-40 bg-[var(--surface)]/90 backdrop-blur-xl border-b border-[var(--border)] px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Brand Identity & Return to Site */}
          <div className="flex items-center gap-3 text-left">
            <button
              onClick={onCloseDashboard}
              className="p-2 rounded-xl bg-[var(--surface2)] hover:bg-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
              title="Return to Public Overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-[var(--text)] tracking-tight font-display">
                  {clientName}
                </span>
                <span className="font-mono text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                  Growth OS
                </span>
              </div>
              <p className="text-[11px] text-[var(--muted)] font-mono truncate max-w-[200px] sm:max-w-xs">
                {clientLocation} · {clientMission}
              </p>
            </div>
          </div>

          {/* Right: Controls, Telemetry & Clean Sign Out */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Toggle All Modules (for users who want to explore full suite) */}
            {isFreeTier && (
              <button
                type="button"
                onClick={() => setShowAllModules(!showAllModules)}
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface2)] text-[var(--muted)] hover:text-[var(--text)] font-mono text-[10px] transition-all cursor-pointer"
                title="Toggle between Free Tier and Full Executive Suite"
              >
                <span>{showAllModules ? 'Show Free Tabs Only' : 'Explore All Modules'}</span>
              </button>
            )}

            {/* Owner Telemetry Modal Toggle */}
            {isOwner && (
              <button
                type="button"
                onClick={() => setIsTelemetryOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/50 text-cyan-300 font-mono text-[11px] font-bold hover:bg-cyan-900/60 transition-all cursor-pointer shadow-sm"
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
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-display text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              <Crown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Consult with Eric</span>
              <span className="sm:hidden">Consult</span>
            </button>

            {/* Sign Out Button (Unmistakable & Guaranteed to keep user signed out) */}
            <button
              type="button"
              onClick={handleSignOutClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-[var(--muted)] hover:text-white rounded-xl bg-[var(--surface2)] hover:bg-rose-950/60 hover:text-rose-300 hover:border-rose-500/40 border border-[var(--border)] transition-all cursor-pointer shadow-xs"
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
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/25 font-black scale-100'
                    : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                <span>{tab.label}</span>
                {'badge' in tab && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/20'
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
        {/* FREE TAB 1: BUSINESS DNA (Google Pomelli Style) */}
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
            profile={profile}
            onOpenBooking={onOpenBooking}
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
                <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-[var(--surface)] to-[var(--surface2)] p-6 sm:p-7 shadow-lg relative overflow-hidden text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4 mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        Daily Growth Dispatch
                      </span>
                      <span className="font-mono text-[9px] font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
                        {currentTip.category}
                      </span>
                      <span className="font-mono text-[9px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                        {currentTip.impactMetric}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDailyTipIndex(prev => (prev + 1) % WORKING_MARKETING_TIPS.length)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[var(--surface2)] hover:bg-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] font-mono text-[10px] font-bold transition-all cursor-pointer border border-[var(--border)]"
                      >
                        <RefreshCw className="w-3 h-3 text-cyan-400" />
                        <span>Next Tactic ({((dailyTipIndex % WORKING_MARKETING_TIPS.length) + 1)}/{WORKING_MARKETING_TIPS.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('insights')}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 font-mono text-[10px] font-bold transition-all cursor-pointer border border-cyan-500/30"
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
                        <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-bold block mb-1">
                          Research Proof & Mechanism
                        </span>
                        <p className="text-xs text-[var(--muted)] leading-relaxed">
                          {currentTip.whyItWorks}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)]">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-400 font-bold block mb-1">
                          Action Blueprint Steps
                        </span>
                        <ul className="space-y-1 text-xs text-[var(--text)]">
                          {currentTip.stepByStep.slice(0, 2).map((s, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="font-mono text-[10px] text-cyan-400 shrink-0 mt-0.5">0{idx + 1}.</span>
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
        {/* PRO TAB: MARKETING FOUNDATION */}
        {/* ==================================================================== */}
        {activeTab === 'foundation' && (
          <div className="space-y-6 text-left">
            <SectionHeader
              eyebrow="Marketing Foundation"
              title="Marketing Foundation Audit"
              desc="A professional assessment of your core marketing pillars with concrete, high-velocity next actions."
            />
            <div className="space-y-3">
              {[
                { area: "Website Conversion", status: "Developing", note: "Current website establishes executive presence but features competing calls to action on primary service sections.", next: "Define a single high-conversion primary intake action (Diagnostic Intake) across all key landing areas." },
                { area: "Local Search (SEO)", status: "Needs Attention", note: `Untapped search demand from ${clientAudience} searching for executive business coaching and storytelling in ${clientLocation}.`, next: "Optimize title tags, meta descriptions, and localized entity headers for commercial search intent." },
                { area: "AI Search Readiness (AEO)", status: "Needs Attention", note: "Answer engines (ChatGPT, Gemini, Perplexity) lack structured FAQPage and Person schema to cite as the primary authority.", next: "Deploy structured semantic entity markup and answer the top 5 questions buyers ask before booking." },
                { area: "Brand Messaging", status: "Strong", note: `Core mission ("${clientMission}") provides an authentic, defensible moat against commoditized competitors.`, next: "Keep messaging focused on measurable transformation and authentic lived proof." },
              ].map((item) => (
                <Card key={item.area}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="sm:w-1/4">
                      <div className="text-sm font-medium text-[var(--text)]">{item.area}</div>
                      <div className="mt-2">
                        <StatusPill status={item.status} />
                      </div>
                    </div>
                    <div className="sm:w-3/4 sm:border-l sm:border-[var(--border)] sm:pl-5">
                      <p className="text-sm leading-relaxed text-[var(--text)]">{item.note}</p>
                      <div className="mt-2 flex items-start gap-1.5 text-sm text-[var(--accent)]">
                        <ArrowUpRight className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span>{item.next}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
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
        {/* PRO TAB: QUARTERLY ROADMAP */}
        {/* ==================================================================== */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6 text-left">
            <SectionHeader
              eyebrow="Quarterly Roadmap"
              title="Execution Priorities (Now / Next / Later)"
              desc="Every milestone directly serves customer acquisition velocity and brand authority."
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-wide text-[var(--muted)]">Now (30 Days)</span>
                  <div className="h-px flex-1 bg-[var(--border)]" />
                </div>
                <div className="space-y-2.5">
                  <Card padding="p-3.5">
                    <p className="text-sm text-[var(--text)]">Publish quarterly strategic blueprint in your authentic voice</p>
                  </Card>
                  <Card padding="p-3.5">
                    <p className="text-sm text-[var(--text)]">Extract and lock in Business DNA for all marketing assets</p>
                  </Card>
                  <Card padding="p-3.5">
                    <p className="text-sm text-[var(--text)]">Deploy first 4-angle social promotion series on LinkedIn & X</p>
                  </Card>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-wide text-[var(--muted)]">Next (60 Days)</span>
                  <div className="h-px flex-1 bg-[var(--border)]" />
                </div>
                <div className="space-y-2.5">
                  <Card padding="p-3.5">
                    <p className="text-sm text-[var(--text)]">Deploy structured FAQPage and Person schema for AI search citation</p>
                  </Card>
                  <Card padding="p-3.5">
                    <p className="text-sm text-[var(--text)]">Streamline consultation intake to reduce booking friction</p>
                  </Card>
                  <Card padding="p-3.5">
                    <p className="text-sm text-[var(--text)]">Launch monthly executive email newsletter for {clientAudience}</p>
                  </Card>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-wide text-[var(--muted)]">Later (90 Days+)</span>
                  <div className="h-px flex-1 bg-[var(--border)]" />
                </div>
                <div className="space-y-2.5">
                  <Card padding="p-3.5">
                    <p className="text-sm text-[var(--text)]">Expand into comprehensive authority pillars on monthly cadence</p>
                  </Card>
                  <Card padding="p-3.5">
                    <p className="text-sm text-[var(--text)]">Implement automated multi-touch conversion attribution</p>
                  </Card>
                  <Card padding="p-3.5">
                    <p className="text-sm text-[var(--text)]">Schedule 1-on-1 Growth Consultation with Eric Thomas</p>
                  </Card>
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
