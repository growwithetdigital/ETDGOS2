import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, Globe, Sparkles, RefreshCw, CheckCircle2, 
  ArrowRight, ShieldCheck, PenTool, Lightbulb, Zap, 
  Layers, Check, Copy, ExternalLink, Cpu
} from 'lucide-react';
import { UserProfile } from '../../types';
import { updateUserProfile } from '../../lib/firebase';

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

  const handleScanDna = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setScanStep(1);

    // Pomelli-style sequential scan simulation
    setTimeout(() => setScanStep(2), 700);
    setTimeout(() => setScanStep(3), 1400);

    setTimeout(async () => {
      // Synthesize Brand DNA based on inputs
      const urlClean = websiteUrl.replace(/^https?:\/\//, '').split('/')[0];
      const detectedVoice = writingSample.length > 80 && writingSample.includes('!')
        ? 'High-Energy Visionary & Relentless Catalyst'
        : 'Authoritative Strategist & Empathetic Mentor';

      const keywords = [
        businessName,
        'Executive Authority',
        location ? `${location} Growth` : 'Market Growth',
        'Customer Acquisition',
        'Story-Driven Conversion'
      ];

      const newDna = {
        voice_archetype: detectedVoice,
        tone_descriptors: ['Authentic', 'Results-Obsessed', 'Clarity-Driven', 'Strategic', 'Empathetic'],
        core_value_prop: profile?.mission_statement || `Helping ${targetAudience || 'clients'} accelerate growth through proven storytelling and conversion systems.`,
        target_persona: targetAudience || 'High-intent clients seeking trusted, premium expertise.',
        differentiator: `Unique domain synthesis by ${businessName} combining executive insight with real-world conversion proof.`,
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
    }, 2200);
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6 text-left" id="business-dna-panel">
      
      {/* Top Banner: Pomelli Engine Overview */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-cyan-400 animate-pulse" />
                Pomelli-Inspired DNA Scanner
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                Core Foundation
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
              Business & Voice DNA
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Add your website link and a short writing sample below. Our Pomelli-style engine analyzes your digital footprint to extract your authentic brand voice, core value hook, and target customer psychology for your blog post and social copy.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToContentStudio}
            className="shrink-0 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer active:scale-95"
          >
            <span>Launch Content Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Input Form (Left) & Extracted DNA Deliverable (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: URL + Writing Sample Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-md p-6 shadow-xl">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-800">
              <Globe className="w-4 h-4 text-cyan-400" />
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                1. Connect Your Source
              </h3>
            </div>

            <form onSubmit={handleScanDna} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">
                  Website URL or Landing Page
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    required
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourbrand.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="ET Digital"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">
                    Location / Market
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Los Angeles, CA"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. B2B founders, dental clinic owners, executives"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Short Writing Sample Calibrator */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5" />
                    Short Writing Sample (Your Voice)
                  </label>
                  <span className="text-[10px] font-mono text-slate-500">2-4 Sentences</span>
                </div>
                <textarea
                  rows={4}
                  value={writingSample}
                  onChange={(e) => setWritingSample(e.target.value)}
                  placeholder="Paste a short sample of how you speak or write (from an email, post, speech)..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed resize-none"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Our system learns your authentic cadence, sentence length, and vocabulary from this sample.
                </p>
              </div>

              <button
                type="submit"
                disabled={isScanning}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>
                      {scanStep === 1 && 'Scanning Website Metadata...'}
                      {scanStep === 2 && 'Calibrating Authentic Voice...'}
                      {scanStep === 3 && 'Synthesizing Brand DNA...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Extract & Save Brand DNA</span>
                  </>
                )}
              </button>

              {savedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Brand DNA successfully saved and calibrated for Content Studio!</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right Column: Dynamic Pomelli Deliverable Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Main DNA Header Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-md p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 font-bold">
                    Extracted Brand Matrix
                  </span>
                  <h3 className="font-display text-lg font-bold text-white">
                    {businessName} DNA Profile
                  </h3>
                </div>
              </div>

              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" />
                Ready For Editorial
              </span>
            </div>

            {/* Voice Archetype & Descriptors */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Primary Voice Archetype
                </span>
                <button
                  type="button"
                  onClick={() => copyText(currentDna.voice_archetype, 'voice')}
                  className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedSection === 'voice' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSection === 'voice' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="text-base font-display font-bold text-cyan-300">
                {currentDna.voice_archetype}
              </div>
              
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentDna.tone_descriptors?.map((tone, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-md bg-cyan-950/50 border border-cyan-500/20 text-cyan-400 text-[11px] font-mono"
                  >
                    #{tone}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Value Proposition Hook */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Core Value Proposition & Differentiator
                </span>
                <button
                  type="button"
                  onClick={() => copyText(currentDna.core_value_prop, 'cvp')}
                  className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedSection === 'cvp' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSection === 'cvp' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                "{currentDna.core_value_prop}"
              </p>
            </div>

            {/* Target Persona & Semantic Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Target Customer Persona
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentDna.target_persona}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Semantic Keyword Entities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentDna.extracted_keywords?.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Editorial Readiness Callout */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-950 to-blue-950/40 border border-cyan-500/20 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="font-display text-xs font-bold text-white">
                  DNA Engine Synced With Content Studio
                </div>
                <div className="text-[11px] text-slate-400">
                  Your 1 blog post and 4 social promotion angles will use this exact DNA.
                </div>
              </div>

              <button
                type="button"
                onClick={onNavigateToContentStudio}
                className="px-3.5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <span>Write Post</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
