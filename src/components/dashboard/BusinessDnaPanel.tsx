import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, Globe, Sparkles, RefreshCw, CheckCircle2, 
  ArrowRight, ShieldCheck, PenTool, ExternalLink, Cpu,
  Copy, Check, TrendingUp, Newspaper, BookOpen, AlertCircle
} from 'lucide-react';
import { UserProfile } from '../../types';
import { updateUserProfile } from '../../lib/firebase';
import { getIndustryMarketIntel } from '../../utils/contentEngineHelpers';

interface BusinessDnaPanelProps {
  profile: UserProfile | null;
  onRefreshProfile: () => void;
  onNavigateToContentStudio: () => void;
}

export default function BusinessDnaPanel({
  profile,
  onRefreshProfile,
  onNavigateToContentStudio
}: BusinessDnaPanelProps) {
  const [websiteUrl, setWebsiteUrl] = useState(profile?.website_url || 'https://growwithetdigital.com');
  const [businessName, setBusinessName] = useState(profile?.business_name || 'ET Digital');
  const [targetAudience, setTargetAudience] = useState(profile?.target_audience || 'Entrepreneurs and service business owners');
  const [location, setLocation] = useState(profile?.location || 'Los Angeles, CA');
  const [industry, setIndustry] = useState(profile?.industry || 'Executive Advisory & Digital Growth');
  const [writingSample, setWritingSample] = useState(
    profile?.writing_sample || 
    'Most business owners think marketing is about shouting the loudest. It is not. It is about telling a story so undeniable that your ideal customer feels understood before you ever pitch them. We build systems, not noise.'
  );

  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Extracted DNA state (either from profile or defaulted)
  const currentDna = profile?.brand_dna || {
    voice_archetype: profile?.brand_voice || 'Authoritative Strategist & Inspiring Storyteller',
    tone_descriptors: ['Visionary', 'Pragmatic', 'High-Trust', 'Direct-Response', 'Story-Driven'],
    core_value_prop: 'Transforming complex service businesses into high-converting market authorities through storytelling and predictable revenue systems.',
    target_persona: targetAudience || 'Growth-minded founders and executives seeking category leadership without vanity metrics.',
    differentiator: 'Proprietary narrative engineering paired with multi-touch revenue attribution and answer engine optimization (AEO).',
    extracted_keywords: ['Brand Authority', 'Narrative Systems', 'Executive Coaching', 'Predictable Pipeline', 'AEO Optimization'],
    summary: 'High-contrast, conviction-led tone that prioritizes clarity over corporate jargon. Relies on short punchy hooks followed by structural frameworks.'
  };

  // 1 Leading Industry Market Report Headline & Outbound Article Link
  const marketIntel = useMemo(() => {
    return getIndustryMarketIntel({
      ...profile,
      website_url: websiteUrl,
      industry: industry,
      target_audience: targetAudience,
    } as UserProfile);
  }, [profile, websiteUrl, industry, targetAudience]);

  const handleScanDna = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setScanStep(1);

    // Sequential Pomelli-style scanning animation
    setTimeout(() => setScanStep(2), 700);
    setTimeout(() => setScanStep(3), 1400);

    setTimeout(async () => {
      const urlClean = websiteUrl.replace(/^https?:\/\//, '').split('/')[0];
      const detectedVoice = writingSample.length > 80 && (writingSample.includes('!') || writingSample.includes('conviction'))
        ? 'High-Energy Visionary & Strategic Catalyst'
        : 'Authoritative Strategist & Precision Advisor';

      const keywords = [
        businessName,
        'Executive Authority',
        location ? `${location} Market` : 'Regional Authority',
        'High-Value Client Intake',
        'Direct Conversion Architecture'
      ];

      const newDna = {
        voice_archetype: detectedVoice,
        tone_descriptors: ['Authentic', 'Results-Obsessed', 'Clarity-Driven', 'Strategic', 'Empathetic'],
        core_value_prop: profile?.mission_statement || `Helping ${targetAudience || 'clients'} accelerate growth through proven storytelling and conversion systems.`,
        target_persona: targetAudience || 'High-intent clients seeking trusted, premium expertise.',
        differentiator: `Unique domain synthesis by ${businessName} combining executive narrative with real-world conversion proof.`,
        extracted_keywords: keywords,
        summary: `Calibrated from ${urlClean || 'website'} and authentic writing sample. Reflects conversational authority with concise, rhythmically balanced sentences.`,
        extracted_from_url: websiteUrl,
        extracted_at: new Date().toISOString()
      };

      if (profile?.uid) {
        try {
          await updateUserProfile(profile.uid, {
            website_url: websiteUrl,
            business_name: businessName,
            target_audience: targetAudience,
            location: location,
            industry: industry,
            brand_voice: detectedVoice,
            writing_sample: writingSample,
            brand_dna: newDna
          });
          onRefreshProfile();
        } catch (err) {
          console.warn('Profile DNA save notice:', err);
        }
      }

      setIsScanning(false);
      setScanStep(0);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 2100);
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6 text-left" id="business-dna-panel">
      
      {/* Top Banner: Pomelli-Style Brand Voice & DNA Scanner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-cyan-400 animate-pulse" />
                Pomelli-Style Website Scanner
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                1-Click Calibration
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
              Brand DNA & Industry Market Intel
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Upload your website URL below. Our intelligence tool extracts your brand DNA and generates the 1 leading market report headline for your industry with a direct link to reputable research.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToContentStudio}
            className="shrink-0 px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer active:scale-95"
          >
            <span>View 1-Asset Growth Kit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Input Form (Left) & Extracted DNA + Market Report (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Website Scanner Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[var(--border)]">
              <Globe className="w-4 h-4 text-cyan-500" />
              <h3 className="font-display text-sm font-bold text-[var(--text)] uppercase tracking-wider">
                1. Upload Website URL
              </h3>
            </div>

            <form onSubmit={handleScanDna} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5 font-semibold">
                  Website URL or Landing Page
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    required
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourbrand.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 min-h-[42px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5 font-semibold">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="ET Digital"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-cyan-500 min-h-[42px]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5 font-semibold">
                    Location / Market
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Los Angeles, CA"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-cyan-500 min-h-[42px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5 font-semibold">
                  Industry / Niche
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Healthcare, Legal, B2B SaaS, Real Estate, Consulting"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-cyan-500 min-h-[42px]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5 font-semibold">
                  Target Audience / Customer
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Founders, dental practice owners, high-ticket clients"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-cyan-500 min-h-[42px]"
                />
              </div>

              {/* Short Writing Sample Calibrator */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-bold flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5" />
                    Short Writing Sample (Your Voice)
                  </label>
                  <span className="text-[10px] font-mono text-[var(--muted)]">2-4 Sentences</span>
                </div>
                <textarea
                  rows={3}
                  value={writingSample}
                  onChange={(e) => setWritingSample(e.target.value)}
                  placeholder="Paste a short sample of how you speak or write (from an email, post, speech)..."
                  className="w-full p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-cyan-500 leading-relaxed resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isScanning}
                className="w-full py-3.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 min-h-[44px]"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>
                      {scanStep === 1 && 'Scanning Website Architecture...'}
                      {scanStep === 2 && 'Calibrating Authentic Voice...'}
                      {scanStep === 3 && 'Synthesizing Market Intelligence...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Scan Website & Generate DNA</span>
                  </>
                )}
              </button>

              {savedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Brand DNA & Market Intel successfully calibrated!</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right Column: Extracted Brand DNA & 1 Market Report Headline (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SECTION 1: The 1 Leading Market Report Headline Citing Reputable Source (No Links) */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-cyan-500" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-500 font-bold">
                  Industry Market Report
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-semibold">
                  1 Relevant Headline
                </span>
              </div>

              <span className="text-[11px] font-mono text-[var(--muted)]">
                Niche: {marketIntel.detected_niche}
              </span>
            </div>

            {/* The 1 Leading Market Headline */}
            <div className="space-y-3">
              <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--text)] leading-snug">
                "{marketIntel.leading_headline}"
              </h3>

              <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-500" />
                    <span className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-wider font-semibold">
                      Verified Source:
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--surface)] border border-[var(--border)] text-cyan-600 dark:text-cyan-400">
                      {marketIntel.article_source}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-[var(--muted)]">
                    Direct Intelligence Citation
                  </span>
                </div>

                <div className="text-xs text-[var(--text)] font-sans leading-relaxed">
                  <strong className="font-semibold text-cyan-600 dark:text-cyan-400">Executive Takeaway: </strong>
                  {marketIntel.executive_takeaway}
                </div>

                <div className="pt-2 border-t border-[var(--border)] flex items-center gap-2 text-[11px] font-mono text-[var(--muted)]">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span><strong>Market Impact:</strong> {marketIntel.market_shift_stat}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Extracted Brand DNA Matrix */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-500 font-bold block">
                    Brand DNA Matrix
                  </span>
                  <h3 className="font-display text-base font-bold text-[var(--text)]">
                    {businessName} Voice Blueprint
                  </h3>
                </div>
              </div>

              <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-3 h-3" />
                Active DNA
              </span>
            </div>

            {/* Voice Archetype & Descriptors */}
            <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold">
                  Primary Voice Archetype
                </span>
                <button
                  type="button"
                  onClick={() => copyText(currentDna.voice_archetype, 'voice')}
                  className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedSection === 'voice' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSection === 'voice' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="text-sm font-display font-bold text-cyan-600 dark:text-cyan-400">
                {currentDna.voice_archetype}
              </div>
              
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentDna.tone_descriptors?.map((tone, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-[11px] font-mono font-medium"
                  >
                    #{tone}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Value Proposition Hook */}
            <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold">
                  Core Value Hook
                </span>
                <button
                  type="button"
                  onClick={() => copyText(currentDna.core_value_prop, 'cvp')}
                  className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedSection === 'cvp' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSection === 'cvp' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs text-[var(--text)] leading-relaxed font-sans font-medium">
                "{currentDna.core_value_prop}"
              </p>
            </div>

            {/* Key AEO Keywords */}
            <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold block">
                Extracted Entity Keywords (AEO & AI Search)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentDna.extracted_keywords?.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-[11px] font-mono"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
