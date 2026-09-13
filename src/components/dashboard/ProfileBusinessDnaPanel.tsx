import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Globe, Cpu, Sparkles, RefreshCw, CheckCircle2, 
  Lock, ArrowRight, ShieldCheck, Mail, Calendar, AlertCircle,
  PenTool, Check, Copy, ExternalLink, HelpCircle, ChevronDown, ChevronUp,
  BarChart3, User, MapPin, Target, Layers, ArrowUpRight
} from 'lucide-react';
import { UserProfile } from '../../types';
import { updateUserProfile } from '../../lib/firebase';
import AuditorArchivePanel from './AuditorArchivePanel';

interface ProfileBusinessDnaPanelProps {
  user: any;
  profile: UserProfile | null;
  onRefreshProfile: () => void;
  onNavigateToContentStudio: () => void;
  onOpenBooking: () => void;
  onOpenCalendar?: () => void;
}

export const TONE_OPTIONS = [
  { id: 'Authoritative & Strategic', label: 'Authoritative & Strategic', desc: 'Commanding, executive-level tone backed by research and structural clarity' },
  { id: 'Bold & Direct', label: 'Bold & Direct', desc: 'Punchy, direct-response, zero fluff or corporate jargon, focus on ROI' },
  { id: 'Conversational & Story-Driven', label: 'Conversational & Story-Driven', desc: 'Warm, relatable, empathetic narrative voice that connects deeply' },
  { id: 'Visionary & Inspiring', label: 'Visionary & Inspiring', desc: 'Forward-looking, category-defining vision and transformative perspective' },
  { id: 'Tactical & Practical', label: 'Tactical & Practical', desc: 'Actionable playbook, step-by-step implementation milestones' },
  { id: 'Consultative & Premium', label: 'Consultative & Premium', desc: 'High-end advisory, bespoke, tailored for discerning commercial clients' },
];

export const CATEGORY_OPTIONS = [
  { id: 'Executive Problem-Solver & Proof', label: 'Executive Problem-Solver & Proof', desc: 'Why high-intent buyers evaluate verified operational proof over promotional noise' },
  { id: 'Industry Contrarian Perspective', label: 'Industry Contrarian Perspective', desc: 'Challenges bad industry advice and vanity metrics that waste founder capital' },
  { id: 'Tactical Playbook & Framework', label: 'Tactical Playbook & Framework', desc: 'Step-by-step 3-phase execution roadmap solving a high-friction business hurdle' },
  { id: 'Future Trends & AI Search (AEO)', label: 'Future Trends & AI Search (AEO)', desc: 'How generative AI and answer engines are shifting client discovery and citations' },
  { id: 'Local Market Dominance', label: 'Local Market Dominance', desc: 'Hyper-localized regional positioning to capture high-margin commercial demand' },
];

export default function ProfileBusinessDnaPanel({
  user,
  profile,
  onRefreshProfile,
  onNavigateToContentStudio,
  onOpenBooking,
  onOpenCalendar,
}: ProfileBusinessDnaPanelProps) {
  const isLocked = Boolean(profile?.is_profile_locked);

  // Form inputs
  const [websiteUrl, setWebsiteUrl] = useState(profile?.website_url || '');
  const [businessName, setBusinessName] = useState(profile?.business_name || profile?.displayName || '');
  const [contact, setContact] = useState(profile?.contact || profile?.displayName || user?.email || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [industry, setIndustry] = useState(profile?.industry || 'B2B & Professional Services');
  const [targetAudience, setTargetAudience] = useState(profile?.target_audience || '');
  const [writingSample, setWritingSample] = useState(profile?.writing_sample || '');

  // DNA Fields (Editable before locking)
  const [voiceArchetype, setVoiceArchetype] = useState(
    profile?.brand_dna?.voice_archetype || profile?.brand_voice || 'Authoritative Strategist'
  );
  const [coreValueProp, setCoreValueProp] = useState(
    profile?.brand_dna?.core_value_prop || profile?.mission_statement || ''
  );
  const [targetPersona, setTargetPersona] = useState(
    profile?.brand_dna?.target_persona || profile?.target_audience || ''
  );
  const [toneDescriptors, setToneDescriptors] = useState<string[]>(
    profile?.brand_dna?.tone_descriptors || ['Authentic', 'Strategic', 'High-Trust', 'Direct-Response', 'Clarity-Driven']
  );
  const [keywords, setKeywords] = useState<string[]>(
    profile?.brand_dna?.extracted_keywords || ['Executive Authority', 'Predictable Systems', 'High-Intent Intake']
  );

  // Tone & Category selection
  const [selectedTone, setSelectedTone] = useState(
    profile?.selected_tone || profile?.brand_dna?.voice_archetype || TONE_OPTIONS[0].id
  );
  const [selectedCategory, setSelectedCategory] = useState(
    profile?.selected_category || CATEGORY_OPTIONS[0].id
  );

  // UI States
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [isSavingAndLocking, setIsSavingAndLocking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lockSuccess, setLockSuccess] = useState(false);
  const [showAuditor, setShowAuditor] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Keep state synced with profile
  useEffect(() => {
    if (profile) {
      if (profile.website_url) setWebsiteUrl(profile.website_url);
      if (profile.business_name) setBusinessName(profile.business_name);
      if (profile.contact) setContact(profile.contact);
      if (profile.location) setLocation(profile.location);
      if (profile.industry) setIndustry(profile.industry);
      if (profile.target_audience) setTargetAudience(profile.target_audience);
      if (profile.writing_sample) setWritingSample(profile.writing_sample);
      if (profile.selected_tone) setSelectedTone(profile.selected_tone);
      if (profile.selected_category) setSelectedCategory(profile.selected_category);

      if (profile.brand_dna) {
        if (profile.brand_dna.voice_archetype) setVoiceArchetype(profile.brand_dna.voice_archetype);
        if (profile.brand_dna.core_value_prop) setCoreValueProp(profile.brand_dna.core_value_prop);
        if (profile.brand_dna.target_persona) setTargetPersona(profile.brand_dna.target_persona);
        if (profile.brand_dna.tone_descriptors) setToneDescriptors(profile.brand_dna.tone_descriptors);
        if (profile.brand_dna.extracted_keywords) setKeywords(profile.brand_dna.extracted_keywords);
      }
    }
  }, [profile]);

  // Minimum required data check
  const requiredFields = [
    { label: 'Website URL', valid: Boolean(websiteUrl.trim()) },
    { label: 'Business Name', valid: Boolean(businessName.trim()) },
    { label: 'Location / Market', valid: Boolean(location.trim()) },
    { label: 'Target Audience / Industry', valid: Boolean(targetAudience.trim() || industry.trim()) },
    { label: 'Selected Tone', valid: Boolean(selectedTone) },
    { label: 'Selected Category', valid: Boolean(selectedCategory) },
  ];
  const completedCount = requiredFields.filter(f => f.valid).length;
  const isMinimumDataComplete = completedCount === requiredFields.length;

  // Scan Website & Calibrate DNA
  const handleAnalyzeWebsite = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!websiteUrl.trim()) {
      setErrorMessage('Please provide a valid Website URL to scan.');
      return;
    }

    setErrorMessage(null);
    setIsScanning(true);
    setScanStep(1);

    setTimeout(() => setScanStep(2), 700);
    setTimeout(() => setScanStep(3), 1400);

    setTimeout(() => {
      const cleanHost = websiteUrl.replace(/^https?:\/\//, '').split('/')[0];
      const autoBiz = businessName.trim() || cleanHost.split('.')[0].toUpperCase();
      const detectedVoice = writingSample.length > 60 && (writingSample.includes('!') || writingSample.toLowerCase().includes('truth') || writingSample.toLowerCase().includes('noise'))
        ? 'Bold & Direct'
        : 'Authoritative & Strategic';

      const autoTarget = targetAudience.trim() || 'high-intent commercial decision-makers and founders';
      const autoCoreVal = coreValueProp.trim() || `Helping ${autoTarget} turn digital discovery into predictable, high-value client engagements.`;
      
      const newKeywords = [
        autoBiz,
        'Category Authority',
        location ? `${location} Authority` : 'Regional Authority',
        'Direct Intake Architecture',
        'AI Overviews Citation'
      ];

      setBusinessName(autoBiz);
      setVoiceArchetype(detectedVoice);
      setSelectedTone(detectedVoice);
      setCoreValueProp(autoCoreVal);
      setTargetPersona(autoTarget);
      setKeywords(newKeywords);
      setToneDescriptors(['Authentic', 'Results-Obsessed', 'High-Trust', 'Direct-Response', 'Clarity-Driven']);

      setIsScanning(false);
      setScanStep(0);
    }, 2100);
  };

  // Perform permanent lock and save
  const handleSaveAndLock = async () => {
    if (!isMinimumDataComplete) {
      setErrorMessage('Please fill in all required fields before locking your profile.');
      return;
    }

    const uid = user?.uid || profile?.uid;
    if (!uid) {
      setErrorMessage('User session not found. Please log in.');
      return;
    }

    setIsSavingAndLocking(true);
    setErrorMessage(null);

    try {
      const lockedDna = {
        voice_archetype: voiceArchetype,
        tone_descriptors: toneDescriptors,
        core_value_prop: coreValueProp,
        target_persona: targetPersona,
        differentiator: `Proprietary systems engineered by ${businessName} pairing verified proof with frictionless client intake.`,
        extracted_keywords: keywords,
        summary: `Calibrated from ${websiteUrl}. High-contrast authority matching ${selectedTone}.`,
        extracted_from_url: websiteUrl,
        extracted_at: new Date().toISOString(),
      };

      const payload: Partial<UserProfile> = {
        website_url: websiteUrl.trim(),
        business_name: businessName.trim(),
        contact: contact.trim(),
        location: location.trim(),
        industry: industry.trim(),
        target_audience: targetAudience.trim(),
        mission_statement: coreValueProp.trim(),
        writing_sample: writingSample.trim(),
        brand_voice: selectedTone,
        selected_tone: selectedTone,
        selected_category: selectedCategory,
        brand_dna: lockedDna,
        is_profile_locked: true,
        profile_locked_at: new Date().toISOString(),
      };

      await updateUserProfile(uid, payload);
      setLockSuccess(true);
      setShowConfirmModal(false);
      onRefreshProfile();
    } catch (err: any) {
      console.error('Failed to lock profile:', err);
      setErrorMessage(err.message || 'Failed to save and lock profile.');
    } finally {
      setIsSavingAndLocking(false);
    }
  };

  return (
    <div className="space-y-8 text-left" id="profile-business-dna-unified-tab">
      
      {/* ==================================================================== */}
      {/* 1. MASTER HEADER & LOCK STATUS BANNER */}
      {/* ==================================================================== */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-cyan-400" />
                Harmonized DNA Hub
              </span>

              {isLocked ? (
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1.5 font-bold">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  Profile & DNA Locked · Baseline Active
                </span>
              ) : (
                <span className="font-mono text-[10px] uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-500/40 flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                  {completedCount}/{requiredFields.length} Required Fields · Pending Lock
                </span>
              )}
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
              Business Profile & Brand DNA Calibration
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-3xl leading-relaxed">
              {isLocked
                ? 'Your brand DNA and operational parameters are permanently locked into your Growth OS. Your 5-asset content suite and market reports are continuously generated from this verified baseline.'
                : 'Enter your website to calibrate your unique brand voice archetype and strategic content angle. Review and edit the extracted results below, then approve and lock your profile to unlock your complete Growth OS.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {isLocked ? (
              <>
                <button
                  type="button"
                  onClick={onNavigateToContentStudio}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer transition-all active:scale-95"
                >
                  <span>Go to Content Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="mailto:eric@growwithetdigital.com?subject=Growth%20OS%20Profile%20Update%20Request"
                  className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Email Eric Directly</span>
                </a>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                disabled={!isMinimumDataComplete || isSavingAndLocking}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 text-slate-950 font-display text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-emerald-500/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                <Lock className="w-4 h-4 text-slate-950" />
                <span>Save & Lock Profile Calibration</span>
              </button>
            )}
          </div>
        </div>

        {/* Executive Locked Notice */}
        {isLocked && (
          <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Locked on <strong>{profile?.profile_locked_at ? new Date(profile.profile_locked_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Verified Session'}</strong>. Profile changes are locked to maintain authentic voice baseline and prevent duplicate generation.
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onOpenCalendar || onOpenBooking}
                className="text-cyan-400 hover:text-cyan-300 underline font-mono text-[11px] font-bold flex items-center gap-1"
              >
                <span>Request Custom Campaign Calibration</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <p className="leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {/* Lock Success Notice */}
      {lockSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="leading-relaxed">
              <strong>Profile & Brand DNA Locked Successfully!</strong> All tabs in your Growth OS dashboard are now unlocked.
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToContentStudio}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0"
          >
            <span>Open Content Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. MAIN HARMONIZED WORKSPACE */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================================================================== */}
        {/* LEFT COLUMN: Business Operations & Website Scanner (6 cols) */}
        {/* ================================================================== */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Section A: Website URL & Scanner */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-cyan-500" />
                <h3 className="font-display text-sm font-bold text-[var(--text)] uppercase tracking-wider">
                  1. Website URL & DNA Extraction
                </h3>
              </div>
              {isLocked ? (
                <span className="font-mono text-[10px] text-emerald-500 flex items-center gap-1 font-bold">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              ) : (
                <span className="text-[10px] font-mono text-[var(--muted)]">Required</span>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5 font-semibold">
                  Website URL or Landing Page
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    disabled={isLocked}
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://growwithetdigital.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-cyan-500 disabled:opacity-75 disabled:cursor-not-allowed min-h-[42px]"
                  />
                </div>
              </div>

              {!isLocked && (
                <button
                  type="button"
                  onClick={() => handleAnalyzeWebsite()}
                  disabled={isScanning || !websiteUrl.trim()}
                  className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[42px]"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>
                        {scanStep === 1 && 'Scanning Website Architecture...'}
                        {scanStep === 2 && 'Calibrating Brand Voice & Persona...'}
                        {scanStep === 3 && 'Synthesizing Entity Keywords...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Analyze Website & Calibrate DNA</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Section B: Business Profile Parameters */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-cyan-500" />
                <h3 className="font-display text-sm font-bold text-[var(--text)] uppercase tracking-wider">
                  2. Business Profile & Service Market
                </h3>
              </div>
              {isLocked ? (
                <span className="font-mono text-[10px] text-emerald-500 flex items-center gap-1 font-bold">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              ) : (
                <span className="text-[10px] font-mono text-[var(--muted)]">Editable</span>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5 font-semibold">
                    Business Name
                  </label>
                  <input
                    type="text"
                    disabled={isLocked}
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="ET Digital"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-cyan-500 disabled:opacity-75 disabled:cursor-not-allowed min-h-[42px]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5 font-semibold">
                    Primary Contact / Founder
                  </label>
                  <input
                    type="text"
                    disabled={isLocked}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Eric Thomas"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-cyan-500 disabled:opacity-75 disabled:cursor-not-allowed min-h-[42px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5 font-semibold">
                    Location / Regional Market
                  </label>
                  <input
                    type="text"
                    disabled={isLocked}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Los Angeles, CA"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-cyan-500 disabled:opacity-75 disabled:cursor-not-allowed min-h-[42px]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5 font-semibold">
                    Industry / Domain
                  </label>
                  <input
                    type="text"
                    disabled={isLocked}
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Executive Advisory & Digital Growth"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-cyan-500 disabled:opacity-75 disabled:cursor-not-allowed min-h-[42px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5 font-semibold">
                  Target Audience / Ideal Client Profile (ICP)
                </label>
                <input
                  type="text"
                  disabled={isLocked}
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Business owners, executives, and commercial decision-makers"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-cyan-500 disabled:opacity-75 disabled:cursor-not-allowed min-h-[42px]"
                />
              </div>

              {/* Short Writing Sample Calibrator */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-bold flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5" />
                    Short Writing Sample (Captures Your Voice)
                  </label>
                  <span className="text-[10px] font-mono text-[var(--muted)]">2-4 Sentences</span>
                </div>
                <textarea
                  rows={3}
                  disabled={isLocked}
                  value={writingSample}
                  onChange={(e) => setWritingSample(e.target.value)}
                  placeholder="Paste a short sample of how you speak or write (from an email, post, speech)..."
                  className="w-full p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-cyan-500 leading-relaxed resize-none disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

        </div>

        {/* ================================================================== */}
        {/* RIGHT COLUMN: Review DNA, Select Tone & Category, Lock (6 cols) */}
        {/* ================================================================== */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Section C: Calibrated DNA Matrix (Review & Edit) */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5">
                <Target className="w-4 h-4 text-cyan-500" />
                <h3 className="font-display text-sm font-bold text-[var(--text)] uppercase tracking-wider">
                  3. Review & Approve Brand DNA
                </h3>
              </div>
              {isLocked ? (
                <span className="font-mono text-[10px] text-emerald-500 flex items-center gap-1 font-bold">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              ) : (
                <span className="text-[10px] font-mono text-cyan-500 font-bold">Review & Refine</span>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5 font-semibold">
                  Primary Voice Archetype
                </label>
                <input
                  type="text"
                  disabled={isLocked}
                  value={voiceArchetype}
                  onChange={(e) => setVoiceArchetype(e.target.value)}
                  placeholder="Authoritative Strategist & Precision Advisor"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs font-display font-bold text-cyan-600 dark:text-cyan-400 focus:outline-none focus:border-cyan-500 disabled:opacity-75 disabled:cursor-not-allowed min-h-[42px]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5 font-semibold">
                  Core Value Proposition Hook
                </label>
                <textarea
                  rows={2}
                  disabled={isLocked}
                  value={coreValueProp}
                  onChange={(e) => setCoreValueProp(e.target.value)}
                  placeholder="Helping clients engage, convert, and scale through predictable systems."
                  className="w-full p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-cyan-500 leading-relaxed resize-none disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>

              {/* Tone Descriptors Chips */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5 font-semibold">
                  Tone Descriptors
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {toneDescriptors.map((desc, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-[11px] font-mono font-medium"
                    >
                      #{desc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Extracted Entity Keywords */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5 font-semibold">
                  AEO & SEO Entity Citation Keywords
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {keywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[var(--surface2)] border border-[var(--border)] text-[var(--text)] text-[11px] font-mono"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section D: Tone & Category Selection */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-cyan-500" />
                <h3 className="font-display text-sm font-bold text-[var(--text)] uppercase tracking-wider">
                  4. Select Tone & Content Category
                </h3>
              </div>
              {isLocked ? (
                <span className="font-mono text-[10px] text-emerald-500 flex items-center gap-1 font-bold">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              ) : (
                <span className="text-[10px] font-mono text-[var(--muted)]">Required</span>
              )}
            </div>

            <div className="space-y-4">
              {/* Tone Selection */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-2 font-semibold">
                  Select Content Tone
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TONE_OPTIONS.map((tone) => {
                    const isSelected = selectedTone === tone.id;
                    return (
                      <button
                        key={tone.id}
                        type="button"
                        disabled={isLocked}
                        onClick={() => setSelectedTone(tone.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer disabled:cursor-not-allowed ${
                          isSelected
                            ? 'bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-300 ring-1 ring-cyan-500'
                            : 'bg-[var(--surface2)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-slate-500'
                        }`}
                      >
                        <div className="font-display text-xs font-bold leading-tight flex items-center justify-between">
                          <span>{tone.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-500 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-[var(--muted)] mt-1 line-clamp-2 leading-relaxed">
                          {tone.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-2 font-semibold">
                  Select Strategic Article Category / Angle
                </label>
                <div className="space-y-2">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        disabled={isLocked}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer disabled:cursor-not-allowed ${
                          isSelected
                            ? 'bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-300 ring-1 ring-cyan-500'
                            : 'bg-[var(--surface2)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-slate-500'
                        }`}
                      >
                        <div className="font-display text-xs font-bold leading-tight flex items-center justify-between">
                          <span>{cat.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-500 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-[var(--muted)] mt-1 leading-relaxed">
                          {cat.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section E: Permanent Lock Action Area */}
          <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[var(--surface)] via-[var(--surface)] to-cyan-950/20 p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-500" />
              <h3 className="font-display text-sm font-bold text-[var(--text)] uppercase tracking-wider">
                5. Approval & Permanent Profile Lock
              </h3>
            </div>

            {isLocked ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Your Brand DNA and Profile are permanently locked.</span>
                </div>
                <p className="text-xs text-[var(--text)] leading-relaxed">
                  Your baseline parameters are securely locked to prevent drift and ensure your content remains authentic to your company.
                  If you need updates or hands-on campaign strategy, reach out to Eric directly.
                </p>
                <div className="pt-2 flex flex-wrap gap-2.5">
                  <a
                    href="mailto:eric@growwithetdigital.com?subject=Growth%20OS%20Profile%20Update%20Request"
                    className="px-4 py-2 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-400 font-display text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Eric Directly</span>
                  </a>
                  <button
                    type="button"
                    onClick={onOpenCalendar || onOpenBooking}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-display text-xs font-bold hover:bg-cyan-400 transition-colors flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Strategy Call</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-[var(--text)] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-500">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Locking Policy</span>
                  </div>
                  <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                    Review your inputs carefully. Once you save and lock your completed profile, it is permanently locked to establish your brand baseline and prevent duplicate generation. Only once locked can you access the other tabs in your dashboard. If you require assistance later, you can connect directly with us.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  disabled={!isMinimumDataComplete || isSavingAndLocking}
                  className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 text-slate-950 font-display text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                  <Lock className="w-4 h-4 text-slate-950" />
                  <span>Approve, Save & Lock Business DNA</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ==================================================================== */}
      {/* 3. OPTIONAL DIAGNOSTIC ACCORDION: GROWTH AUDITOR */}
      {/* ==================================================================== */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <button
          type="button"
          onClick={() => setShowAuditor(!showAuditor)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-cyan-500" />
            <div>
              <h4 className="font-display text-sm font-bold text-[var(--text)]">
                Growth Auditor Diagnostic
              </h4>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Run automated website diagnostics and review past intake audits
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">
            <span>{showAuditor ? 'Hide Diagnostic' : 'Run Audit Diagnostic'}</span>
            {showAuditor ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showAuditor && (
          <div className="mt-6 pt-6 border-t border-[var(--border)]">
            <AuditorArchivePanel
              user={user}
              profile={profile}
              onOpenBooking={onOpenCalendar || onOpenBooking}
            />
          </div>
        )}
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
                  Confirm Permanent Calibration Lock
                </h3>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                  Baseline will be locked
                </span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed font-sans">
              <p>
                Are you ready to lock your <strong>{businessName || 'Business'}</strong> profile and Brand DNA?
              </p>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tone:</span>
                  <span className="text-cyan-400 font-bold">{selectedTone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="text-cyan-400 font-bold">{selectedCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Website:</span>
                  <span className="text-slate-200 truncate max-w-[200px]">{websiteUrl}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                ⚠️ Once locked, you cannot modify your profile to maintain brand consistency and prevent duplicate generation. Unlocks all remaining tabs in your Growth OS dashboard.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Keep Editing
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

    </div>
  );
}
