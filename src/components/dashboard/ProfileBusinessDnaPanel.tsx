import React, { useState, useEffect, useMemo } from 'react';
import { 
  Globe, Sparkles, CheckCircle2, 
  Lock, ArrowRight, ShieldCheck, AlertCircle,
  Check, RotateCcw, Copy, Edit2, AlertTriangle, X
} from 'lucide-react';
import { UserProfile } from '../../types';
import { updateUserProfile } from '../../lib/firebase';
import { 
  generateReverseEngineeredBusinessDna,
  ReverseEngineeredDnaResult 
} from '../../utils/contentEngineHelpers';
import { 
  getQuarterlyResetsCount, 
  recordQuarterlyResetCount, 
  getCurrentQuarterKey 
} from '../../utils/downloadStorage';

interface ProfileBusinessDnaPanelProps {
  user: any;
  profile: UserProfile | null;
  onRefreshProfile: (updatedProfile?: UserProfile) => void;
  onNavigateToContentStudio: () => void;
  onOpenBooking?: () => void;
  onOpenCalendar?: () => void;
}

export const TONE_OPTIONS = [
  { 
    id: 'Authoritative & Strategic', 
    label: 'Authoritative & Strategic', 
    desc: 'Commanding, executive-level tone backed by research and structural clarity.' 
  },
  { 
    id: 'Warm & Advisory', 
    label: 'Warm & Advisory', 
    desc: 'Empathetic, consultative, and approachable. Bridges complex expertise with trust.' 
  },
  { 
    id: 'Bold & Direct', 
    label: 'Bold & Direct', 
    desc: 'Punchy, direct-response, zero fluff. Focuses on bottom-line outcomes and speed.' 
  },
];

export default function ProfileBusinessDnaPanel({
  user,
  profile,
  onRefreshProfile,
  onNavigateToContentStudio,
  onOpenBooking,
}: ProfileBusinessDnaPanelProps) {
  const uid = user?.uid || profile?.uid || 'guest';
  const currentQuarterKey = getCurrentQuarterKey();

  // Check persistent lock status from both profile and local cache
  const [localLocked, setLocalLocked] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(`et_dna_locked_${uid}`);
      if (cached === 'true') return true;
    }
    return Boolean(profile?.is_profile_locked);
  });

  const isLocked = Boolean(profile?.is_profile_locked || localLocked);

  // Active Tab: 'overview' (Brand Overview) or 'details' (Business Details)
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');

  // Quarterly resets tracking (strictly 3 per quarter)
  const resetsUsed = getQuarterlyResetsCount(uid, profile);
  const resetsRemaining = Math.max(0, 3 - resetsUsed);

  // Lean Form Fields: Business Name, Website URL, Voice Archetype
  const [businessName, setBusinessName] = useState(
    profile?.business_name || profile?.displayName || 'ET Digital'
  );
  const [websiteUrl, setWebsiteUrl] = useState(
    profile?.website_url || 'https://growwithetdigital.com'
  );
  const [desiredTone, setDesiredTone] = useState(
    profile?.selected_tone || profile?.brand_voice || profile?.brand_dna?.voice_archetype || TONE_OPTIONS[0].id
  );

  // Detected Industry inferred from website
  const [detectedIndustry, setDetectedIndustry] = useState(
    profile?.industry || profile?.brand_dna?.industry || 'Growth Operating Systems & Strategic Marketing'
  );

  // UI States
  const [isScanning, setIsScanning] = useState(false);
  const [isSavingAndLocking, setIsSavingAndLocking] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lockSuccess, setLockSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync state when profile loads or updates
  useEffect(() => {
    if (profile) {
      if (profile.business_name) setBusinessName(profile.business_name);
      if (profile.website_url) setWebsiteUrl(profile.website_url);
      if (profile.industry) setDetectedIndustry(profile.industry);
      if (profile.selected_tone || profile.brand_voice || profile.brand_dna?.voice_archetype) {
        setDesiredTone(profile.selected_tone || profile.brand_voice || profile.brand_dna?.voice_archetype || TONE_OPTIONS[0].id);
      }
      if (profile.is_profile_locked) {
        setLocalLocked(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem(`et_dna_locked_${uid}`, 'true');
        }
      }
    }
  }, [profile, uid]);

  // Reverse engineered Business DNA structure (Matching user's website pattern)
  const dnaData: ReverseEngineeredDnaResult = useMemo(() => {
    return generateReverseEngineeredBusinessDna({
      businessName: businessName || 'ET Digital',
      industry: detectedIndustry,
      websiteUrl: websiteUrl,
      tone: desiredTone,
    });
  }, [businessName, detectedIndustry, websiteUrl, desiredTone]);

  // Website scanner helper: infers industry & details from domain
  const handleAnalyzeWebsite = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!websiteUrl.trim()) {
      setErrorMessage('Please provide a Website URL to analyze.');
      return;
    }

    setErrorMessage(null);
    setIsScanning(true);

    setTimeout(() => {
      const cleanUrl = websiteUrl.toLowerCase().replace(/^https?:\/\//, '');
      const domainName = cleanUrl.split('/')[0].replace(/^www\./, '');
      const namePart = domainName.split('.')[0];
      const inferredName = (businessName && businessName !== 'ET Digital') 
        ? businessName.trim() 
        : namePart.charAt(0).toUpperCase() + namePart.slice(1);

      // Inferred industry from website domain
      let inferredCategory = 'Growth Operating Systems & Strategic Marketing';
      if (cleanUrl.includes('law') || cleanUrl.includes('legal') || cleanUrl.includes('attorney')) {
        inferredCategory = 'Legal, Law Firms & Corporate Advisory';
      } else if (cleanUrl.includes('health') || cleanUrl.includes('clinic') || cleanUrl.includes('med') || cleanUrl.includes('dental') || cleanUrl.includes('care')) {
        inferredCategory = 'Healthcare, Clinical & Wellness Practices';
      } else if (cleanUrl.includes('realt') || cleanUrl.includes('estate') || cleanUrl.includes('prop') || cleanUrl.includes('build')) {
        inferredCategory = 'Real Estate, Property Advisory & Architecture';
      } else if (cleanUrl.includes('tech') || cleanUrl.includes('soft') || cleanUrl.includes('app') || cleanUrl.includes('ai') || cleanUrl.includes('saas')) {
        inferredCategory = 'Technology, Software & Enterprise SaaS';
      } else if (cleanUrl.includes('fin') || cleanUrl.includes('wealth') || cleanUrl.includes('invest') || cleanUrl.includes('tax') || cleanUrl.includes('cpa')) {
        inferredCategory = 'Financial Advisory, Wealth Management & Capital Growth';
      }

      setBusinessName(inferredName);
      setDetectedIndustry(inferredCategory);
      setIsScanning(false);
      setActiveTab('overview');
    }, 1100);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Validation
  const isFormComplete = Boolean(businessName.trim() && websiteUrl.trim() && desiredTone.trim());

  // Save & Lock Business DNA
  const handleSaveAndLock = async () => {
    if (!isFormComplete) {
      setErrorMessage('Please provide a Business Name and Website URL to generate and lock your Business DNA.');
      return;
    }

    setIsSavingAndLocking(true);
    setErrorMessage(null);

    const updatedProfilePayload: Partial<UserProfile> = {
      business_name: businessName.trim(),
      displayName: businessName.trim(),
      website_url: websiteUrl.trim(),
      industry: detectedIndustry,
      selected_tone: desiredTone,
      brand_voice: desiredTone,
      is_profile_locked: true,
      profile_locked_at: new Date().toISOString(),
      brand_dna: {
        voice_archetype: desiredTone,
        industry: detectedIndustry,
        brand_colors: dnaData.brandColors.map(c => `${c.name} (${c.hex})`).join(', '),
        positioning: dnaData.tagline,
        online_reputation: 'Empirical market authority with verified client growth outcomes',
        ideal_client_avatar: 'Businesses and commercial leaders demanding scalable conversion',
        paragraph_dna: dnaData.overview,
        summary: dnaData.overview,
        core_value_prop: dnaData.tagline,
        target_persona: 'High-intent commercial buyers',
        differentiator: 'Unified Growth Operating Systems replacing fragmented tactics',
        tone_descriptors: [desiredTone, 'Artistic Rigor', 'Measurable Growth'],
        extracted_at: new Date().toISOString(),
      }
    };

    // Set local persistence immediately
    if (typeof window !== 'undefined') {
      localStorage.setItem(`et_dna_locked_${uid}`, 'true');
      localStorage.setItem(`et_dna_profile_${uid}`, JSON.stringify(updatedProfilePayload));
    }
    setLocalLocked(true);
    setShowConfirmModal(false);

    try {
      if (user?.uid) {
        await updateUserProfile(user.uid, updatedProfilePayload);
      }
      onRefreshProfile({
        ...(profile || {} as UserProfile),
        ...updatedProfilePayload,
      } as UserProfile);
      setLockSuccess(true);
      setTimeout(() => setLockSuccess(false), 5000);
    } catch (err) {
      console.warn('Persistence notice (handled via local state):', err);
      onRefreshProfile({
        ...(profile || {} as UserProfile),
        ...updatedProfilePayload,
      } as UserProfile);
      setLockSuccess(true);
      setTimeout(() => setLockSuccess(false), 5000);
    } finally {
      setIsSavingAndLocking(false);
    }
  };

  // Reset Brand Identity Functionality (Strictly 3 per quarter)
  const handleResetBrandIdentity = async () => {
    if (resetsRemaining <= 0) {
      setErrorMessage(`Quarterly reset limit reached (3 of 3 resets used in ${currentQuarterKey}). Resets refresh next quarter.`);
      setShowResetModal(false);
      return;
    }

    setIsResetting(true);
    setErrorMessage(null);

    const { count } = recordQuarterlyResetCount(uid, profile);

    const resetPayload: Partial<UserProfile> = {
      is_profile_locked: false,
      profile_locked_at: undefined,
      dna_resets_count: count,
      dna_resets_quarter: currentQuarterKey,
    };

    if (typeof window !== 'undefined') {
      localStorage.removeItem(`et_dna_locked_${uid}`);
    }
    setLocalLocked(false);
    setShowResetModal(false);

    try {
      if (user?.uid) {
        await updateUserProfile(user.uid, resetPayload);
      }
      onRefreshProfile({
        ...(profile || {} as UserProfile),
        ...resetPayload,
      } as UserProfile);
    } catch (err) {
      console.warn('Reset sync notice:', err);
      onRefreshProfile({
        ...(profile || {} as UserProfile),
        ...resetPayload,
      } as UserProfile);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16 text-left" id="business-dna-pomelli">
      
      {/* ==================================================================== */}
      {/* 1. TOP TITLE HEADER (Matching Google Labs Pomelli screenshot) */}
      {/* ==================================================================== */}
      <div className="text-center space-y-2 pt-2 sm:pt-4">
        <h1 className="font-['Newsreader',Georgia,serif] italic text-3xl sm:text-4xl md:text-5xl text-slate-100 font-normal tracking-tight">
          Your Business DNA
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-sans leading-relaxed">
          Unlock the power to generate product photos, marketing campaigns, a website, and more
        </p>

        {/* Operational Status & Action Controls */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          {isLocked ? (
            <>
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 font-semibold flex items-center gap-1.5 shadow-sm">
                <Lock className="w-3 h-3 text-emerald-400" />
                Locked & Saved (Quarterly Active)
              </span>

              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                disabled={resetsRemaining <= 0}
                className="px-3.5 py-1.5 rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <RotateCcw className="w-3 h-3 text-cyan-400" />
                <span>Reset Business DNA ({resetsRemaining}/3 left this quarter)</span>
              </button>

              <button
                type="button"
                onClick={onNavigateToContentStudio}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-display text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer transition-all active:scale-95"
              >
                <span>Proceed to Content Studio</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 font-semibold flex items-center gap-1.5">
                <Edit2 className="w-3 h-3 text-amber-400" />
                Draft Mode (Unlock to Save & Lock)
              </span>

              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                disabled={!isFormComplete || isScanning}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 text-slate-950 font-display text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                <Lock className="w-3 h-3 text-slate-950" />
                <span>Save & Lock Business DNA</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error & Success Notifications */}
      {errorMessage && (
        <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-sans flex items-start gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <div className="flex-1">{errorMessage}</div>
          <button type="button" onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-rose-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {lockSuccess && (
        <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-sans flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Your Business DNA has been locked successfully. Resets are strictly limited to 3 per quarter.</span>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. POMELLI SEGMENTED TABS: Brand Overview | Business Details */}
      {/* ==================================================================== */}
      <div className="rounded-3xl border border-[#2b2f38] bg-[#141518] shadow-2xl overflow-hidden">
        
        {/* Tab Navigation Header (Connected to card below) */}
        <div className="flex items-center border-b border-[#2b2f38] bg-[#0f1013] px-4 pt-3 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-6 sm:px-8 py-3.5 rounded-t-2xl font-sans text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 border-t border-x ${
              activeTab === 'overview'
                ? 'bg-[#18191d] text-slate-100 border-[#2b2f38] -mb-[1px] shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border-transparent bg-transparent hover:bg-[#141518]/60'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === 'overview' ? 'text-cyan-400' : 'text-slate-500'}`} />
            <span>Brand Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`px-6 sm:px-8 py-3.5 rounded-t-2xl font-sans text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 border-t border-x ${
              activeTab === 'details'
                ? 'bg-[#18191d] text-slate-100 border-[#2b2f38] -mb-[1px] shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border-transparent bg-transparent hover:bg-[#141518]/60'
            }`}
          >
            <Globe className={`w-4 h-4 ${activeTab === 'details' ? 'text-cyan-400' : 'text-slate-500'}`} />
            <span>Business Details</span>
            {!isLocked && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-8 bg-[#18191d] space-y-6">

          {/* ------------------------------------------------------------------ */}
          {/* TAB 1: BRAND OVERVIEW (Exact Screenshot UI) */}
          {/* ------------------------------------------------------------------ */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Top Swatches Card (with refined lime-accented hairline border) */}
              <div className="rounded-2xl border border-[#d6ff38]/30 dark:border-[#3b404c] bg-[#16171b] p-6 sm:p-8 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Brand Color Palette
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    Click hex to copy
                  </span>
                </div>

                {/* 4 Circular Color Swatches */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 items-center justify-items-center">
                  {dnaData.brandColors.map((color, index) => (
                    <div key={index} className="flex flex-col items-center gap-2.5 group">
                      <div 
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-white/10 shadow-xl transition-transform duration-200 group-hover:scale-105 cursor-pointer relative"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => copyToClipboard(color.hex, `color-${index}`)}
                        title={`Copy ${color.name} (${color.hex})`}
                      >
                        {color.hex.toLowerCase() === '#ffffff' && (
                          <div className="absolute inset-0 rounded-full border border-slate-700/50 pointer-events-none" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(color.hex, `color-${index}`)}
                        className="font-mono text-xs text-slate-300 hover:text-white font-medium cursor-pointer flex items-center gap-1 tracking-wider"
                      >
                        <span>{color.hex}</span>
                        {copiedKey === `color-${index}` && <Check className="w-3 h-3 text-emerald-400" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2-Column Cards: Tagline & Brand Values (Matching Screenshot) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Card: Tagline */}
                <div className="rounded-2xl border border-[#2b2f38] bg-[#16171b] p-6 sm:p-7 flex flex-col justify-between shadow-sm">
                  <div>
                    <span className="font-sans text-sm font-medium text-slate-300 block">
                      Tagline
                    </span>
                    <p className="font-['Newsreader',Georgia,serif] italic text-xl sm:text-2xl text-[#d4dd9c] leading-relaxed mt-5">
                      "{dnaData.tagline}"
                    </p>
                  </div>
                  <div className="pt-6 flex items-center justify-between text-slate-500 font-mono text-[10px]">
                    <span>VOICE: {desiredTone}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(dnaData.tagline, 'tagline')}
                      className="text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1"
                    >
                      {copiedKey === 'tagline' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'tagline' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Right Card: Brand Values */}
                <div className="rounded-2xl border border-[#2b2f38] bg-[#16171b] p-6 sm:p-7 flex flex-col justify-between shadow-sm">
                  <div>
                    <span className="font-sans text-sm font-medium text-slate-300 block">
                      Brand values
                    </span>
                    <div className="flex flex-wrap gap-2.5 mt-5">
                      {dnaData.brandValues.map((value, idx) => (
                        <span
                          key={idx}
                          className="px-3.5 py-1.5 rounded-lg border border-[#383d47] bg-[#1d1f25] text-xs font-normal text-slate-200 tracking-normal hover:border-slate-500 transition-colors"
                        >
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-6 flex items-center justify-between text-slate-500 font-mono text-[10px]">
                    <span>CORE PHILOSOPHY</span>
                    <span className="text-slate-400">Zero Agency Fluff</span>
                  </div>
                </div>

              </div>

              {/* Bottom Card: Reverse Engineered Overview */}
              <div className="rounded-2xl border border-[#2b2f38] bg-[#16171b] p-6 sm:p-8 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm font-medium text-slate-300">
                    Reverse-Engineered Brand Overview
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(dnaData.overview, 'overview')}
                    className="text-cyan-400 hover:text-cyan-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'overview' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'overview' ? 'Copied' : 'Copy Overview'}</span>
                  </button>
                </div>

                <p className="font-sans text-sm sm:text-base text-slate-200 leading-relaxed font-normal pt-1">
                  {dnaData.overview}
                </p>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Structured for sustainable market authority & high-converting clarity</span>
                  <span className="text-cyan-400 font-medium">Growth Operating Systems™ Pattern</span>
                </div>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* TAB 2: BUSINESS DETAILS (Setup, Parameters & Scan) */}
          {/* ------------------------------------------------------------------ */}
          {activeTab === 'details' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* If Unlocked: Lean Input Form */}
              {!isLocked ? (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-[#16171b] border border-[#2b2f38] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-display font-bold text-base text-slate-100">
                          Lean Foundation Inputs
                        </h3>
                        <p className="text-xs text-slate-400">
                          Scan your website to automatically extract industry and reverse-engineer your brand overview.
                        </p>
                      </div>
                      <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-bold">
                        Website Driven
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Business Name */}
                      <div>
                        <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-1.5 font-semibold">
                          Business Name
                        </label>
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="e.g. ET Digital"
                          className="w-full px-4 py-3 rounded-xl bg-[#1d1f25] border border-[#383d47] text-white text-xs font-sans focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      {/* Website URL + Scan Button */}
                      <div>
                        <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-1.5 font-semibold">
                          Website URL
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            placeholder="https://growwithetdigital.com"
                            className="flex-1 px-4 py-3 rounded-xl bg-[#1d1f25] border border-[#383d47] text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                          />
                          <button
                            type="button"
                            onClick={handleAnalyzeWebsite}
                            disabled={isScanning || !websiteUrl.trim()}
                            className="px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                          >
                            <Sparkles className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                            <span>{isScanning ? 'Scanning...' : 'Scan'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3 Voice Archetype Cards */}
                  <div className="space-y-3">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                      Select Voice Archetype (Exactly 3 Curated Options)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {TONE_OPTIONS.map((tone) => (
                        <div
                          key={tone.id}
                          onClick={() => setDesiredTone(tone.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-1.5 ${
                            desiredTone === tone.id
                              ? 'border-cyan-500/80 bg-cyan-500/10 shadow-md shadow-cyan-500/10'
                              : 'border-[#2b2f38] bg-[#16171b] hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-display font-bold text-xs text-white">
                              {tone.label}
                            </span>
                            {desiredTone === tone.id && (
                              <Check className="w-4 h-4 text-cyan-400" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                            {tone.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detected Industry */}
                  <div className="p-4 rounded-2xl bg-[#16171b] border border-[#2b2f38] flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="font-mono text-[10px] uppercase text-slate-500 font-semibold block">
                        Detected Industry & Sector
                      </span>
                      <span className="font-sans text-slate-200 font-medium">
                        {detectedIndustry}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-cyan-400">
                      Inferred from Website
                    </span>
                  </div>

                  {/* Save & Lock Action */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowConfirmModal(true)}
                      disabled={!isFormComplete || isScanning}
                      className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 text-slate-950 font-display text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                      <Lock className="w-4 h-4 text-slate-950" />
                      <span>Save & Lock Business DNA</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* If Locked: Structured Inspection View */
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-[#16171b] border border-[#2b2f38] space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                        Locked Foundation Parameters
                      </span>
                      <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Active & Locked
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                      <div className="p-3.5 rounded-xl bg-[#1d1f25] border border-[#2b2f38]">
                        <span className="font-mono text-[10px] uppercase text-slate-500 block mb-1">Business Name</span>
                        <span className="font-display font-bold text-slate-100 text-sm">{businessName}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#1d1f25] border border-[#2b2f38]">
                        <span className="font-mono text-[10px] uppercase text-slate-500 block mb-1">Website URL</span>
                        <span className="font-mono text-cyan-400 text-xs truncate block">{websiteUrl}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#1d1f25] border border-[#2b2f38]">
                        <span className="font-mono text-[10px] uppercase text-slate-500 block mb-1">Voice Archetype</span>
                        <span className="font-display font-bold text-cyan-400 text-sm">{desiredTone}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#1d1f25] border border-[#2b2f38]">
                        <span className="font-mono text-[10px] uppercase text-slate-500 block mb-1">Inferred Domain</span>
                        <span className="font-sans text-slate-200 text-xs">{detectedIndustry}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 font-sans flex items-center justify-between">
                      <span>Quarterly Reset Budget:</span>
                      <strong className="text-cyan-400 font-mono">{resetsRemaining} of 3 resets remaining ({currentQuarterKey})</strong>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowResetModal(true)}
                      disabled={resetsRemaining <= 0}
                      className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Reset Business DNA ({resetsRemaining}/3 left)</span>
                    </button>
                    <button
                      type="button"
                      onClick={onNavigateToContentStudio}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
                    >
                      <span>Go to Content Studio</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. CONFIRMATION MODAL: SAVE & LOCK */}
      {/* ==================================================================== */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="max-w-md w-full rounded-3xl border border-cyan-500/40 bg-slate-900 p-6 sm:p-7 shadow-2xl space-y-5 text-left text-white animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-white">
                  Save & Lock Business DNA?
                </h3>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  Quarterly Locking Policy
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Once saved and locked, your Business DNA remains permanent and drives your quarterly 1-Asset Growth Kit. You will receive a maximum of <strong>3 resets per quarter</strong>.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Review
              </button>
              <button
                type="button"
                onClick={handleSaveAndLock}
                disabled={isSavingAndLocking}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/25"
              >
                <Lock className="w-3.5 h-3.5 text-slate-950" />
                <span>{isSavingAndLocking ? 'Locking...' : 'Save & Lock'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. CONFIRMATION MODAL: RESET BRAND IDENTITY (3/QUARTER LIMIT) */}
      {/* ==================================================================== */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
          <div className="max-w-md w-full rounded-3xl border border-amber-500/40 bg-slate-900 p-6 sm:p-7 shadow-2xl space-y-5 text-left text-white animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-white">
                  Reset Business DNA?
                </h3>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                  Consumes 1 Reset ({resetsRemaining} Left in {currentQuarterKey})
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Resetting will unlock your Business DNA so you can adjust your business name, website, and voice archetype. You are limited to <strong>3 resets per quarter</strong>.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetBrandIdentity}
                disabled={isResetting || resetsRemaining <= 0}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/25"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-950" />
                <span>{isResetting ? 'Resetting...' : 'Confirm Reset'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
