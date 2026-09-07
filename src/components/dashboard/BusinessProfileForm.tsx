import React, { useState, useEffect } from 'react';
import { 
  Building2, User, Globe, MapPin, Target, Swords, 
  Sparkles, Save, CheckCircle2, AlertCircle, Volume2, 
  Layers, ShieldCheck, Check, ArrowRight
} from 'lucide-react';
import { UserProfile } from '../../types';
import { updateUserProfile } from '../../lib/firebase';

interface BusinessProfileFormProps {
  user: any;
  profile: UserProfile | null;
  onProfileUpdated: () => void;
  onContinueToGeneration?: () => void;
}

export const VOICE_OPTIONS = [
  { id: 'Authoritative & Strategic', label: 'Authoritative & Strategic', desc: 'Commanding, executive-level tone backed by research and structural models' },
  { id: 'Direct & Pragmatic', label: 'Direct & Pragmatic', desc: 'No fluff, transparent, focused on ROI, implementation, and clear outcomes' },
  { id: 'Modern & Engaging', label: 'Modern & High-Velocity', desc: 'Energetic, culturally attuned, conversational yet sharply commercial' },
  { id: 'Technical & Analytical', label: 'Technical & Analytical', desc: 'Deep dive, data-driven, engineering-grade explanations and statistics' },
  { id: 'Consultative & Premium', label: 'Consultative & Premium', desc: 'High-end advisory, bespoke, tailored for premium client acquisition' },
];

export default function BusinessProfileForm({
  user,
  profile,
  onProfileUpdated,
  onContinueToGeneration,
}: BusinessProfileFormProps) {
  const [businessName, setBusinessName] = useState(profile?.business_name || profile?.displayName || '');
  const [contact, setContact] = useState(profile?.contact || profile?.displayName || user?.email || '');
  const [websiteUrl, setWebsiteUrl] = useState(profile?.website_url || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [missionStatement, setMissionStatement] = useState(profile?.mission_statement || '');
  const [competitorWebsite, setCompetitorWebsite] = useState(profile?.competitor_website || '');
  const [brandVoice, setBrandVoice] = useState(profile?.brand_voice || VOICE_OPTIONS[0].id);
  const [targetAudience, setTargetAudience] = useState(profile?.target_audience || '');
  const [industry, setIndustry] = useState(profile?.industry || 'B2B & Digital Services');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      if (profile.business_name) setBusinessName(profile.business_name);
      if (profile.contact) setContact(profile.contact);
      if (profile.website_url) setWebsiteUrl(profile.website_url);
      if (profile.location) setLocation(profile.location);
      if (profile.mission_statement) setMissionStatement(profile.mission_statement);
      if (profile.competitor_website) setCompetitorWebsite(profile.competitor_website);
      if (profile.brand_voice) setBrandVoice(profile.brand_voice);
      if (profile.target_audience) setTargetAudience(profile.target_audience);
      if (profile.industry) setIndustry(profile.industry);
    }
  }, [profile]);

  // Calculate completion percentage
  const requiredFields = [
    { name: 'Business Name', filled: !!businessName.trim() },
    { name: 'Primary Contact', filled: !!contact.trim() },
    { name: 'Website URL', filled: !!websiteUrl.trim() },
    { name: 'Location / Market', filled: !!location.trim() },
    { name: 'Mission Statement', filled: !!missionStatement.trim() },
    { name: 'Competitor Website', filled: !!competitorWebsite.trim() },
  ];

  const completedCount = requiredFields.filter(f => f.filled).length;
  const isComplete = completedCount === requiredFields.length;
  const completionPercentage = Math.round((completedCount / requiredFields.length) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    if (!businessName.trim()) {
      setErrorMsg('Please enter your Business Name.');
      return;
    }
    if (!websiteUrl.trim()) {
      setErrorMsg('Please enter your Website URL.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    try {
      await updateUserProfile(user.uid, {
        business_name: businessName.trim(),
        contact: contact.trim(),
        website_url: websiteUrl.trim(),
        location: location.trim(),
        mission_statement: missionStatement.trim(),
        competitor_website: competitorWebsite.trim(),
        brand_voice: brandVoice,
        target_audience: targetAudience.trim(),
        industry: industry.trim(),
      });

      setSaveSuccess(true);
      onProfileUpdated();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setErrorMsg(err.message || 'Failed to update business profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl" id="business-voice-profile-panel">
      {/* Header & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-cyan" />
            <h3 className="font-display text-xl font-bold text-white tracking-tight">
              Business Voice & AI Profile
            </h3>
            <span className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
              isComplete
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-950/80 text-amber-300 border-amber-500/30'
            }`}>
              {isComplete ? 'Voice Calibrated (100%)' : `${completedCount}/6 Required Fields`}
            </span>
          </div>
          <p className="font-sans text-xs sm:text-sm text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
            Our AI leverages these exact parameters to properly craft and deliver authoritative marketing content in your business's unique voice, positioning your enterprise against competitors and speaking directly to your market.
          </p>
        </div>

        {/* Progress meter */}
        <div className="flex items-center gap-3 bg-slate-850 p-3 rounded-2xl border border-slate-750 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-700">
            <span className="font-mono text-sm font-bold text-brand-cyan">{completionPercentage}%</span>
          </div>
          <div className="text-left">
            <p className="font-display text-xs font-bold text-white">AI Alignment</p>
            <p className="font-mono text-[10px] text-slate-400">
              {isComplete ? 'Ready for generation' : 'Complete required fields'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Profile successfully saved! Gemini AI is now calibrated to your business voice.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Name */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Business Name *</span>
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Vanguard Logistics Group"
              required
              className="w-full bg-slate-850 border border-slate-750 focus:border-brand-cyan rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
            />
            <p className="text-[11px] text-slate-400 font-sans">The legal or trading name of your business.</p>
          </div>

          {/* Primary Contact */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-slate-300">
              <User className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Primary Contact *</span>
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="e.g. Marcus Sterling (Managing Director)"
              required
              className="w-full bg-slate-850 border border-slate-750 focus:border-brand-cyan rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
            />
            <p className="text-[11px] text-slate-400 font-sans">Key executive or contact person representing the organization.</p>
          </div>

          {/* Website URL */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-slate-300">
              <Globe className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Business Website *</span>
            </label>
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="e.g. https://vanguardlogistics.com"
              required
              className="w-full bg-slate-850 border border-slate-750 focus:border-brand-cyan rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
            />
            <p className="text-[11px] text-slate-400 font-sans">Your primary website for digital entity verification.</p>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Location / Territory *</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Atlanta, GA (Metro & Southeast)"
              required
              className="w-full bg-slate-850 border border-slate-750 focus:border-brand-cyan rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
            />
            <p className="text-[11px] text-slate-400 font-sans">Primary service city, region, or global operating footprint.</p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-slate-300">
            <Target className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Mission Statement & Value Proposition *</span>
          </label>
          <textarea
            rows={3}
            value={missionStatement}
            onChange={(e) => setMissionStatement(e.target.value)}
            placeholder="e.g. Empowering regional freight operators with zero-latency dispatch technology to slash transit delays and maximize fleet profitability."
            required
            className="w-full bg-slate-850 border border-slate-750 focus:border-brand-cyan rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
          />
          <p className="text-[11px] text-slate-400 font-sans">Why your business exists and what distinct advantage you provide to clients.</p>
        </div>

        {/* Competitor Website & Target Audience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-slate-300">
              <Swords className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Primary Competitor Website *</span>
            </label>
            <input
              type="text"
              value={competitorWebsite}
              onChange={(e) => setCompetitorWebsite(e.target.value)}
              placeholder="e.g. https://apexlogisticsnetwork.com"
              required
              className="w-full bg-slate-850 border border-slate-750 focus:border-brand-cyan rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
            />
            <p className="text-[11px] text-slate-400 font-sans">The AI studies this domain to establish your unique positioning edge.</p>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-slate-300">
              <Layers className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Target Audience / Ideal Client</span>
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Commercial fleet owners, logistics directors, 3PL managers"
              className="w-full bg-slate-850 border border-slate-750 focus:border-brand-cyan rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
            />
            <p className="text-[11px] text-slate-400 font-sans">The specific buyers or decision-makers you are targeting.</p>
          </div>
        </div>

        {/* Brand Voice / Tone Selection */}
        <div className="space-y-3 pt-2">
          <label className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-slate-300">
            <Volume2 className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Select Brand Voice & Tone for Gemini AI Leverage</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {VOICE_OPTIONS.map((opt) => {
              const isSelected = brandVoice === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setBrandVoice(opt.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/60 border-brand-cyan text-white shadow-md'
                      : 'bg-slate-850/70 border-slate-750 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display text-xs font-bold text-white">{opt.label}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-cyan" />}
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-brand-cyan" />
            <span>Saved securely in your private Growth OS profile</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-950 active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Profile...' : 'Save Voice Profile'}</span>
            </button>

            {onContinueToGeneration && isComplete && (
              <button
                type="button"
                onClick={onContinueToGeneration}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-700"
              >
                <span>Go to Generator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
