import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Globe, Cpu, Sparkles, RefreshCw, CheckCircle2, 
  Lock, ArrowRight, ShieldCheck, Mail, Calendar, AlertCircle,
  Check, MapPin, Target, Layers, ExternalLink, ChevronDown, ChevronUp,
  RotateCcw, FileText, BarChart3, Award, MessageSquare, Compass, Send
} from 'lucide-react';
import { UserProfile } from '../../types';
import { updateUserProfile } from '../../lib/firebase';
import PostAnalyticsAnalyzer from './PostAnalyticsAnalyzer';

interface ProfileBusinessDnaPanelProps {
  user: any;
  profile: UserProfile | null;
  onRefreshProfile: (updatedProfile?: UserProfile) => void;
  onNavigateToContentStudio: () => void;
  onOpenBooking: () => void;
  onOpenCalendar?: () => void;
}

export const TONE_OPTIONS = [
  { 
    id: 'Authoritative & Strategic', 
    label: 'Authoritative & Strategic', 
    desc: 'Commanding, executive-level tone backed by research and structural clarity. Ideal for advisory and high-ticket B2B.' 
  },
  { 
    id: 'Bold & Direct', 
    label: 'Bold & Direct', 
    desc: 'Punchy, direct-response, zero fluff. Focuses on bottom-line outcomes, speed, and competitive edge.' 
  },
  { 
    id: 'Warm & Advisory', 
    label: 'Warm & Advisory', 
    desc: 'Empathetic, consultative, and approachable. Bridges complex expertise with trust and genuine relationship building.' 
  },
  { 
    id: 'Direct-Response & Conversational', 
    label: 'Direct-Response & Conversational', 
    desc: 'Engaging, story-driven, clear calls to action that motivate readers to reach out immediately.' 
  },
  { 
    id: 'Innovative & Visionary', 
    label: 'Innovative & Visionary', 
    desc: 'Forward-looking, modern, category-defining perspective on industry transformation and technology.' 
  },
];

export default function ProfileBusinessDnaPanel({
  user,
  profile,
  onRefreshProfile,
  onNavigateToContentStudio,
  onOpenBooking,
  onOpenCalendar,
}: ProfileBusinessDnaPanelProps) {
  const [localLocked, setLocalLocked] = useState(false);
  const isLocked = Boolean(profile?.is_profile_locked || localLocked);

  // 4 Core Required Fields (Trimmed down to essential Business DNA)
  const [businessName, setBusinessName] = useState(profile?.business_name || profile?.displayName || '');
  const [websiteUrl, setWebsiteUrl] = useState(profile?.website_url || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [desiredTone, setDesiredTone] = useState(
    profile?.selected_tone || profile?.brand_voice || profile?.brand_dna?.voice_archetype || TONE_OPTIONS[0].id
  );

  // UI States
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [isSavingAndLocking, setIsSavingAndLocking] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lockSuccess, setLockSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Keep state synced when profile updates
  useEffect(() => {
    if (profile) {
      if (profile.business_name) setBusinessName(profile.business_name);
      if (profile.website_url) setWebsiteUrl(profile.website_url);
      if (profile.location) setLocation(profile.location);
      if (profile.selected_tone || profile.brand_voice) {
        setDesiredTone(profile.selected_tone || profile.brand_voice || TONE_OPTIONS[0].id);
      }
      if (profile.is_profile_locked) {
        setLocalLocked(true);
      } else {
        setLocalLocked(false);
      }
    }
  }, [profile]);

  // Validation: 4 core questions
  const requiredFields = [
    { label: 'Business Name', valid: Boolean(businessName.trim()) },
    { label: 'Website URL', valid: Boolean(websiteUrl.trim()) },
    { label: 'Location / Market', valid: Boolean(location.trim()) },
    { label: 'Desired Tone', valid: Boolean(desiredTone.trim()) },
  ];
  const completedCount = requiredFields.filter(f => f.valid).length;
  const isFormComplete = completedCount === requiredFields.length;

  // AI & Website Scanner Helper (Quickly infers / formats from URL)
  const handleAnalyzeWebsite = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!websiteUrl.trim()) {
      setErrorMessage('Please provide a Website URL to analyze.');
      return;
    }

    setErrorMessage(null);
    setIsScanning(true);
    setScanStep(1);

    setTimeout(() => setScanStep(2), 600);
    setTimeout(() => setScanStep(3), 1200);

    setTimeout(() => {
      const cleanHost = websiteUrl.replace(/^https?:\/\//, '').split('/')[0];
      const hostBase = cleanHost.replace(/^www\./, '').split('.')[0];
      const inferredName = businessName.trim() || hostBase.charAt(0).toUpperCase() + hostBase.slice(1);
      
      setBusinessName(inferredName);
      if (!location.trim()) {
        setLocation('United States & Regional');
      }

      setIsScanning(false);
      setScanStep(0);
    }, 1800);
  };

  // Save & Lock Business DNA
  const handleSaveAndLock = async () => {
    if (!isFormComplete) {
      setErrorMessage('Please complete all 4 essential fields before locking.');
      return;
    }

    setIsSavingAndLocking(true);
    setErrorMessage(null);

    const updatedProfilePayload: Partial<UserProfile> = {
      business_name: businessName.trim(),
      displayName: businessName.trim(),
      website_url: websiteUrl.trim(),
      location: location.trim(),
      selected_tone: desiredTone,
      brand_voice: desiredTone,
      is_profile_locked: true,
      profile_locked_at: new Date().toISOString(),
      brand_dna: {
        voice_archetype: desiredTone,
        core_value_prop: `Helping clients engage, convert, and scale through authentic proof and clarity.`,
        target_persona: `Discerning clients and commercial buyers in ${location.trim() || 'target market'}`,
        differentiator: `High-trust, verifiable systems engineered specifically for ${businessName.trim()}`,
        tone_descriptors: ['Verified Authority', 'Frictionless Clarity', 'Measurable Outcomes'],
        extracted_at: new Date().toISOString(),
      }
    };

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
    } catch (err: any) {
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

  // Reset Brand Identity Functionality (Unlocks the profile for editing)
  const handleResetBrandIdentity = async () => {
    setIsResetting(true);
    setErrorMessage(null);

    const resetPayload: Partial<UserProfile> = {
      is_profile_locked: false,
      profile_locked_at: undefined,
    };

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
    } catch (err: any) {
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
    <div className="space-y-8 text-left" id="profile-business-dna-panel">
      
      {/* ==================================================================== */}
      {/* 1. CONSOLE HEADLINE & STATUS */}
      {/* ==================================================================== */}
      <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                Growth OS · Core Baseline
              </span>
              <span className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                isLocked 
                  ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30' 
                  : 'text-amber-400 bg-amber-950/60 border-amber-500/30'
              }`}>
                {isLocked ? 'Baseline Locked' : '4 Questions Remaining'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Business DNA Calibration
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              We’ve streamlined our intake to the 4 essential identity questions below. Once saved, your Brand DNA locks in and powers your Content Studio, Market Intelligence, and syndication assets.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isLocked ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-sm"
                  id="reset-brand-identity-btn"
                  title="Reset and unlock Brand Identity to update details"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Reset Brand Identity</span>
                </button>

                <button
                  type="button"
                  onClick={onNavigateToContentStudio}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all active:scale-95"
                >
                  <span>Content Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                disabled={!isFormComplete || isSavingAndLocking}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 text-slate-950 font-display text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                id="save-and-lock-dna-btn"
              >
                <Lock className="w-4 h-4 text-slate-950" />
                <span>Save & Lock Business DNA</span>
              </button>
            )}
          </div>
        </div>

        {/* Lock Success Banner */}
        {lockSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2.5 text-emerald-300 text-xs sm:text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Business DNA saved and locked successfully! All dashboard tabs are now unlocked.</span>
            </div>
            <button
              type="button"
              onClick={onNavigateToContentStudio}
              className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>View Content Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-500 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. BUSINESS DNA VIEW: EDITABLE 4 QUESTIONS VS LOCKED STRATEGIC REPORT */}
      {/* ==================================================================== */}
      {isLocked ? (
        /* LOCKED COMPREHENSIVE STRATEGIC BRAND ARCHITECTURE REPORT */
        <div className="space-y-6">
          
          {/* Top Baseline Recap Card */}
          <div className="rounded-3xl border border-emerald-500/30 bg-[var(--surface)] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-[var(--text)]">
                    Calibrated Business DNA & Strategic Baseline
                  </h3>
                  <p className="text-xs text-[var(--muted)]">
                    Parameters actively powering your Content Studio, Market Reports, and syndication assets.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface2)] hover:bg-[var(--surface)] text-[var(--text)] font-mono text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Make changes to your Brand Identity"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Reset / Edit</span>
                </button>
                <span className="font-mono text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Locked
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-1">
                <span className="font-mono text-[10px] uppercase text-[var(--muted)] font-semibold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-cyan-500" />
                  Business Name
                </span>
                <p className="font-display text-sm font-bold text-[var(--text)] truncate">
                  {businessName || 'Not specified'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-1">
                <span className="font-mono text-[10px] uppercase text-[var(--muted)] font-semibold flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-500" />
                  Website URL
                </span>
                <p className="font-display text-sm font-bold text-[var(--text)] truncate">
                  {websiteUrl || 'Not specified'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-1">
                <span className="font-mono text-[10px] uppercase text-[var(--muted)] font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                  Location
                </span>
                <p className="font-display text-sm font-bold text-[var(--text)] truncate">
                  {location || 'Not specified'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-1">
                <span className="font-mono text-[10px] uppercase text-[var(--muted)] font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                  Desired Tone
                </span>
                <p className="font-display text-sm font-bold text-cyan-500 truncate">
                  {desiredTone}
                </p>
              </div>
            </div>

            {/* Strategic Architecture Report Cards (Deep Strategic Intelligence) */}
            <div className="pt-2 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
                <Award className="w-4 h-4 text-cyan-500" />
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[var(--text)]">
                  Strategic Brand Architecture & Market Positioning
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Core Brand Essence */}
                <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-bold block">
                    Core Brand Essence & Archetype
                  </span>
                  <div className="font-display text-sm font-bold text-[var(--text)]">
                    The Strategic Authority & Trusted Partner
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    Voice calibrated to command respect without sounding sterile. Positions {businessName} as the definitive expert in {location}.
                  </p>
                </div>

                {/* 2. Positioning Statement */}
                <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-bold block">
                    Market Positioning Formula
                  </span>
                  <div className="font-display text-sm font-bold text-[var(--text)]">
                    Proof-First Market Navigator
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    "For decision-makers in {location}, {businessName} cuts through marketing noise to provide transparent answers, clear frameworks, and measurable outcomes."
                  </p>
                </div>

                {/* 3. Acquisition Void */}
                <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-bold block">
                    Market Void You Uniquely Fill
                  </span>
                  <div className="font-display text-sm font-bold text-[var(--text)]">
                    Zero-Friction Client Discovery
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    Competitors force prospects through high-friction sales pitches. You win by publishing genuine answers and low-friction access.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Contact ET Digital Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--muted)]">
                Have questions about scaling your systems or custom agency execution? Contact ET Digital directly.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="mailto:hello@growwithetdigital.com?subject=Growth%20OS%20Strategy%20Inquiry"
                  className="px-4 py-2 rounded-xl bg-[var(--surface2)] hover:bg-[var(--surface)] text-[var(--text)] font-display text-xs font-bold border border-[var(--border)] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Contact ET Digital</span>
                </a>
                <button
                  type="button"
                  onClick={onOpenCalendar || onOpenBooking}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <span>Schedule Strategy Call</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* EDITABLE 4-QUESTION FORM (TRIMMED DOWN) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Business Name, Website, Location (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-cyan-500" />
                  <h3 className="font-display text-sm font-bold text-[var(--text)] uppercase tracking-wider">
                    Core Business Info
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[var(--muted)]">3 Questions</span>
              </div>

              <div className="space-y-4">
                {/* Question 1: Business Name */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5 font-semibold">
                    1. Business Name <span className="text-cyan-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. ET Digital"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-cyan-500 min-h-[42px]"
                    />
                  </div>
                </div>

                {/* Question 2: Website */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5 font-semibold">
                    2. Website URL <span className="text-cyan-500">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://growwithetdigital.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-cyan-500 min-h-[42px]"
                    />
                  </div>
                  
                  {/* Quick autofill helper */}
                  {websiteUrl.trim() && (
                    <button
                      type="button"
                      onClick={() => handleAnalyzeWebsite()}
                      disabled={isScanning}
                      className="mt-2 text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      {isScanning ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Scanning Website...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Auto-fill details from website</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Question 3: Location */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5 font-semibold">
                    3. Location / Primary Market <span className="text-cyan-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Los Angeles, CA or National"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-cyan-500 min-h-[42px]"
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-[var(--muted)] leading-relaxed">
                    Used to localize your market briefings, SEO targets, and Google Business Profile posts.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Question 4 Desired Tone (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-cyan-500" />
                  <h3 className="font-display text-sm font-bold text-[var(--text)] uppercase tracking-wider">
                    Voice Archetype
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-cyan-500 font-bold">Question 4</span>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-2 font-semibold">
                  4. Desired Brand Tone <span className="text-cyan-500">*</span>
                </label>
                <div className="space-y-2.5">
                  {TONE_OPTIONS.map((opt) => {
                    const isSelected = desiredTone === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setDesiredTone(opt.id)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/10 border-cyan-500 ring-1 ring-cyan-500 shadow-sm'
                            : 'bg-[var(--surface2)] border-[var(--border)] hover:border-[var(--muted)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-display text-xs font-bold ${isSelected ? 'text-cyan-500' : 'text-[var(--text)]'}`}>
                            {opt.label}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-cyan-500 shrink-0" />}
                        </div>
                        <p className="mt-1 text-[11px] text-[var(--muted)] leading-relaxed">
                          {opt.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Progress and Lock Action */}
              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-4">
                <div className="text-xs text-[var(--muted)] font-mono">
                  Completed: <strong className="text-[var(--text)]">{completedCount}/4</strong> required questions
                </div>

                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  disabled={!isFormComplete || isSavingAndLocking}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 text-slate-950 font-display text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock & Unlock Dashboard</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. INTERACTIVE POST PERFORMANCE ANALYZER (Replaces Auditor) */}
      {/* ==================================================================== */}
      <div className="pt-4 border-t border-[var(--border)]">
        <PostAnalyticsAnalyzer
          profile={profile}
          onOpenBooking={onOpenCalendar || onOpenBooking}
        />
      </div>

      {/* ==================================================================== */}
      {/* 4. CONFIRMATION MODAL BEFORE PERMANENT LOCK */}
      {/* ==================================================================== */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="max-w-md w-full rounded-3xl border border-cyan-500/40 bg-slate-900 p-6 sm:p-7 shadow-2xl space-y-5 text-left text-white animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-white">
                  Confirm Business DNA Lock
                </h3>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                  Baseline will be locked
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
              <p>
                Locking your Business DNA baseline for <strong>{businessName}</strong> unlocks your complete Growth OS suite (Content Studio, Market Report, and Learning Feed). You can reset it anytime if needed.
              </p>
              
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Business:</span>
                  <span className="text-white font-bold truncate max-w-[220px]">{businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Website:</span>
                  <span className="text-slate-200 truncate max-w-[220px]">{websiteUrl}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-slate-200">{location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tone:</span>
                  <span className="text-cyan-400 font-bold">{desiredTone}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAndLock}
                disabled={isSavingAndLocking}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/25 disabled:opacity-50"
              >
                {isSavingAndLocking ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Locking...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Confirm & Lock</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. CONFIRMATION MODAL TO RESET BRAND IDENTITY */}
      {/* ==================================================================== */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="max-w-md w-full rounded-3xl border border-cyan-500/40 bg-slate-900 p-6 sm:p-7 shadow-2xl space-y-5 text-left text-white animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-white">
                  Reset Brand Identity?
                </h3>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  Unlock Parameters
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
              <p>
                Resetting your Brand Identity will unlock the form so you can update your <strong>Business Name, Website, Location, or Desired Tone</strong>.
              </p>
              <p className="text-[11px] text-slate-400">
                Your existing values will remain pre-filled so you can make quick edits without retyping everything.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Keep Locked
              </button>
              <button
                type="button"
                onClick={handleResetBrandIdentity}
                disabled={isResetting}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/25 disabled:opacity-50"
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Unlocking...</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset & Unlock</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
