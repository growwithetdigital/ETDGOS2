import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, TrendingUp, Check, 
  Sparkles, Layers, Users, MousePointerClick, 
  PhoneCall, ShieldCheck, ArrowUpRight,
  RefreshCw, HelpCircle, Save, RotateCcw,
  Compass, Target, Award, CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { UserProfile, PostAnalyticsData } from '../../types';
import { updateUserProfile } from '../../lib/firebase';

interface PostAnalyticsAnalyzerProps {
  user?: any;
  profile: UserProfile | null;
  onRefreshProfile?: (updatedProfile?: UserProfile) => void;
  onOpenBooking: () => void;
}

// Preset options for origin of engagement
export const ENGAGEMENT_SOURCE_OPTIONS = [
  'Inbound DMs / Private Messages',
  'Feed Comments & Discussions',
  'Profile Search & Organic Discovery',
  'Direct Peer Referral & Recommendations',
  'Email Newsletter Link-Through',
  'Google Business Profile / Maps Pack',
  'Executive Re-share & Group Mention'
];

// Preset options for type of engagement
export const ENGAGEMENT_TYPE_OPTIONS = [
  'Direct Pricing & Retainer Inquiry',
  'Problem Clarification & Advice Request',
  'Peer Reshare & Authority Endorsement',
  'Specific Case Study / Methodology Question',
  'Save / Bookmark for Executive Review',
  'Urgent Service Timeline Question'
];

// Preset options for business outcome
export const OUTCOME_OPTIONS = [
  'Discovery Call / Strategy Session Booked',
  'Direct Proposal / Scope Sent',
  'High-Ticket Client Retained',
  'Pipeline Prospect Qualified & Nurtured',
  'Strategic Referral Partnership Established',
  'Multi-Department Inquiry Initiated'
];

export const PLATFORM_OPTIONS = [
  'LinkedIn',
  'Instagram',
  'Facebook',
  'X',
  'Eblast',
  'Google Business'
];

export default function PostAnalyticsAnalyzer({
  user,
  profile,
  onRefreshProfile,
  onOpenBooking,
}: PostAnalyticsAnalyzerProps) {
  const uid = user?.uid || profile?.uid || 'guest';
  const businessName = profile?.business_name || profile?.displayName || 'My Business';
  const location = profile?.location || 'Local & Regional Market';

  // 1. Initial State: By default all metrics start and stay at 0 until user inputs data
  const [platform, setPlatform] = useState<string>('LinkedIn');
  const [postTitle, setPostTitle] = useState<string>('');
  
  // Selection options requested by user
  const [engagementSource, setEngagementSource] = useState<string>(ENGAGEMENT_SOURCE_OPTIONS[0]);
  const [engagementType, setEngagementType] = useState<string>(ENGAGEMENT_TYPE_OPTIONS[0]);
  const [outcome, setOutcome] = useState<string>(OUTCOME_OPTIONS[0]);

  // Before and After metric states — strictly initialized at 0
  const [beforeReach, setBeforeReach] = useState<number>(0);
  const [afterReach, setAfterReach] = useState<number>(0);

  const [beforeEngagements, setBeforeEngagements] = useState<number>(0);
  const [afterEngagements, setAfterEngagements] = useState<number>(0);

  const [beforeClicks, setBeforeClicks] = useState<number>(0);
  const [afterClicks, setAfterClicks] = useState<number>(0);

  const [beforeInquiries, setBeforeInquiries] = useState<number>(0);
  const [afterInquiries, setAfterInquiries] = useState<number>(0);

  const [hasInputData, setHasInputData] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [customAiAssessment, setCustomAiAssessment] = useState<string>('');
  const [isRegeneratingAssessment, setIsRegeneratingAssessment] = useState<boolean>(false);

  // 2. Load saved data on sign-in / profile load
  useEffect(() => {
    let saved: PostAnalyticsData | null = null;

    // Check profile data first
    if (profile?.post_analytics_data) {
      saved = profile.post_analytics_data;
    } else if (typeof window !== 'undefined' && uid) {
      // Check local storage fallback
      try {
        const local = localStorage.getItem(`et_post_analytics_${uid}`);
        if (local) {
          saved = JSON.parse(local);
        }
      } catch (e) {
        console.warn('Could not read local post analytics cache', e);
      }
    }

    if (saved && saved.hasInputData) {
      setPlatform(saved.platform || 'LinkedIn');
      setPostTitle(saved.postTitle || '');
      setEngagementSource(saved.engagementSource || ENGAGEMENT_SOURCE_OPTIONS[0]);
      setEngagementType(saved.engagementType || ENGAGEMENT_TYPE_OPTIONS[0]);
      setOutcome(saved.outcome || OUTCOME_OPTIONS[0]);
      setBeforeReach(saved.beforeReach || 0);
      setAfterReach(saved.afterReach || 0);
      setBeforeEngagements(saved.beforeEngagements || 0);
      setAfterEngagements(saved.afterEngagements || 0);
      setBeforeClicks(saved.beforeClicks || 0);
      setAfterClicks(saved.afterClicks || 0);
      setBeforeInquiries(saved.beforeInquiries || 0);
      setAfterInquiries(saved.afterInquiries || 0);
      setHasInputData(true);
      if (saved.aiAssessment) {
        setCustomAiAssessment(saved.aiAssessment);
      }
    }
  }, [profile?.post_analytics_data, uid]);

  // Check if user has entered any non-zero data
  const hasUserEnteredAnyData = useMemo(() => {
    return (
      beforeReach > 0 ||
      afterReach > 0 ||
      beforeEngagements > 0 ||
      afterEngagements > 0 ||
      beforeClicks > 0 ||
      afterClicks > 0 ||
      beforeInquiries > 0 ||
      afterInquiries > 0 ||
      postTitle.trim().length > 0
    );
  }, [
    beforeReach,
    afterReach,
    beforeEngagements,
    afterEngagements,
    beforeClicks,
    afterClicks,
    beforeInquiries,
    afterInquiries,
    postTitle
  ]);

  // 3. AI Assessment Synthesis on what likely resonated with clients
  const dynamicAiAssessment = useMemo(() => {
    if (!hasUserEnteredAnyData && !hasInputData) {
      return "Input your campaign topic and Before & After metrics above to generate an AI assessment of why this content resonated with your prospective clients.";
    }

    const reachDelta = afterReach - beforeReach;
    const inquiriesDelta = afterInquiries - beforeInquiries;
    const clicksDelta = afterClicks - beforeClicks;
    const topicLabel = postTitle.trim() ? `"${postTitle.trim()}"` : 'your featured authority topic';

    let resonanceCore = '';
    if (engagementType.includes('Pricing') || engagementType.includes('Retainer')) {
      resonanceCore = `By explicitly deconstructing your methodology in ${topicLabel} rather than using vague promotional language, you addressed the primary hesitation high-intent buyers face before reaching out. Decision-makers saw immediate commercial competence, prompting them to bypass general browsing and inquire directly about your engagement scope.`;
    } else if (engagementType.includes('Problem Clarification') || engagementType.includes('Advice')) {
      resonanceCore = `Target clients recognized the exact operational friction points you diagnosed in ${topicLabel}. Because your content positioned the solution as a structured diagnostic rather than a generic pitch, prospects felt safe asking nuanced questions—validating your status as a trusted category peer.`;
    } else if (engagementType.includes('Reshare') || engagementType.includes('Endorsement')) {
      resonanceCore = `Your content provided peers and industry advocates with a credible, high-status talking point to share within their own networks. This third-party validation dramatically reduced skepticism and served as an organic endorsement multiplier across your target market.`;
    } else if (engagementType.includes('Case Study') || engagementType.includes('Methodology')) {
      resonanceCore = `Sharing verifiable proof in ${topicLabel} gave analytical decision-makers the exact evidence needed to justify their interest. By proving repeatable results instead of theoretical claims, you turned passive curiosity into concrete inquiries.`;
    } else {
      resonanceCore = `Your perspective in ${topicLabel} resonated because it challenged conventional assumptions in your space with practical clarity. When decision-makers see a practitioner who understands the nuances of their daily challenges, engagement shifts from passive agreement to active qualification.`;
    }

    let sourceContext = '';
    if (engagementSource.includes('DMs') || engagementSource.includes('Private')) {
      sourceContext = `Prospects chose direct private messaging because your content tackled a strategic priority they preferred to discuss confidentially rather than in public comments.`;
    } else if (engagementSource.includes('Comments')) {
      sourceContext = `The lively discussion sparked in your comments created social proof, encouraging other quiet observers to step forward once they saw industry peers engaging.`;
    } else if (engagementSource.includes('Referral') || engagementSource.includes('Recommendation')) {
      sourceContext = `Originating through trusted referrals meant these prospects arrived pre-disposed to trust your authority, leading straight to a qualified evaluation.`;
    } else if (engagementSource.includes('Email') || engagementSource.includes('Newsletter')) {
      sourceContext = `Subscribers who clicked through from your email list represent your warmest audience, proving that consistent authority nurturing converts over time.`;
    } else {
      sourceContext = `Capturing this interaction directly through ${engagementSource} proves that your message broke through platform noise and positioned ${businessName} directly at the decision-maker level.`;
    }

    let outcomeImpact = '';
    if (outcome.includes('Discovery Call') || outcome.includes('Session Booked')) {
      outcomeImpact = `This strategic alignment directly drove a booked discovery call, converting initial attention into a high-value pipeline opportunity.`;
    } else if (outcome.includes('Proposal') || outcome.includes('Scope')) {
      outcomeImpact = `By demonstrating clear problem mastery upfront, you rapidly advanced the conversation to a formal proposal stage without prolonged hesitation.`;
    } else if (outcome.includes('Client Retained') || outcome.includes('High-Ticket')) {
      outcomeImpact = `This outcome cements the return on authentic authority positioning, turning targeted content into a closed commercial agreement.`;
    } else {
      outcomeImpact = `This outcome validates that your positioning is actively building sustainable client pipeline and high-retention authority.`;
    }

    const metricHighlight = inquiriesDelta > 0 
      ? ` With inquiries moving from ${beforeInquiries} to ${afterInquiries} (+${inquiriesDelta}), your call to action demonstrated tangible commercial momentum.`
      : reachDelta > 0 
      ? ` Expanding your reach from ${beforeReach} to ${afterReach} (+${reachDelta}) opened fresh conversations with accounts outside your existing circle.`
      : '';

    return `${resonanceCore} ${sourceContext} ${outcomeImpact}${metricHighlight}`;
  }, [
    hasUserEnteredAnyData,
    hasInputData,
    businessName,
    postTitle,
    engagementSource,
    engagementType,
    outcome,
    beforeReach,
    afterReach,
    beforeEngagements,
    afterEngagements,
    beforeClicks,
    afterClicks,
    beforeInquiries,
    afterInquiries
  ]);

  const activeAiAssessment = customAiAssessment || dynamicAiAssessment;

  // 4. Save and persist handler
  const handleSaveData = async () => {
    setIsSaving(true);
    const dataToSave: PostAnalyticsData = {
      platform,
      postTitle,
      engagementSource,
      engagementType,
      outcome,
      beforeReach,
      afterReach,
      beforeEngagements,
      afterEngagements,
      beforeClicks,
      afterClicks,
      beforeInquiries,
      afterInquiries,
      hasInputData: true,
      lastUpdated: new Date().toISOString(),
      aiAssessment: activeAiAssessment
    };

    try {
      // Local storage persistence
      if (typeof window !== 'undefined' && uid) {
        localStorage.setItem(`et_post_analytics_${uid}`, JSON.stringify(dataToSave));
      }

      // Firestore persistence via UserProfile
      if (uid && uid !== 'guest') {
        await updateUserProfile(uid, {
          post_analytics_data: dataToSave,
        });
      }

      setHasInputData(true);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);

      if (onRefreshProfile) {
        onRefreshProfile({
          ...profile,
          post_analytics_data: dataToSave
        } as UserProfile);
      }
    } catch (err) {
      console.warn('Error saving post analytics data:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToZero = async () => {
    setBeforeReach(0);
    setAfterReach(0);
    setBeforeEngagements(0);
    setAfterEngagements(0);
    setBeforeClicks(0);
    setAfterClicks(0);
    setBeforeInquiries(0);
    setAfterInquiries(0);
    setPostTitle('');
    setCustomAiAssessment('');
    setHasInputData(false);

    if (typeof window !== 'undefined' && uid) {
      try {
        localStorage.removeItem(`et_post_analytics_${uid}`);
      } catch (e) {}
    }

    if (uid && uid !== 'guest') {
      try {
        await updateUserProfile(uid, {
          post_analytics_data: {
            platform: 'LinkedIn',
            postTitle: '',
            engagementSource: ENGAGEMENT_SOURCE_OPTIONS[0],
            engagementType: ENGAGEMENT_TYPE_OPTIONS[0],
            outcome: OUTCOME_OPTIONS[0],
            beforeReach: 0,
            afterReach: 0,
            beforeEngagements: 0,
            afterEngagements: 0,
            beforeClicks: 0,
            afterClicks: 0,
            beforeInquiries: 0,
            afterInquiries: 0,
            hasInputData: false
          }
        });
      } catch (e) {}
    }
  };

  // 5. Chart Data formatted for Before vs After comparison
  const chartData = [
    {
      metric: 'Total Reach',
      shortKey: 'Reach',
      Before: beforeReach,
      After: afterReach,
      delta: afterReach - beforeReach
    },
    {
      metric: 'Engagements',
      shortKey: 'Engage',
      Before: beforeEngagements,
      After: afterEngagements,
      delta: afterEngagements - beforeEngagements
    },
    {
      metric: 'Website Clicks',
      shortKey: 'Clicks',
      Before: beforeClicks,
      After: afterClicks,
      delta: afterClicks - beforeClicks
    },
    {
      metric: 'Inquiries / Leads',
      shortKey: 'Leads',
      Before: beforeInquiries,
      After: afterInquiries,
      delta: afterInquiries - beforeInquiries
    }
  ];

  // Calculate rate differentials if data is present
  const beforeEngagementRate = beforeReach > 0 ? ((beforeEngagements / beforeReach) * 100).toFixed(1) : '0.0';
  const afterEngagementRate = afterReach > 0 ? ((afterEngagements / afterReach) * 100).toFixed(1) : '0.0';

  const beforeConversionRate = beforeClicks > 0 ? ((beforeInquiries / beforeClicks) * 100).toFixed(1) : '0.0';
  const afterConversionRate = afterClicks > 0 ? ((afterInquiries / afterClicks) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6 text-left" id="post-analytics-analyzer">
      
      {/* Top Console Card: Official ET Digital Report Card Header */}
      <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Official ET Digital Brand Badge */}
              <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-2xl border border-cyan-500/40 shadow-inner">
                <div className="w-7 h-7 rounded-lg bg-cyan-400 flex flex-col items-center justify-center text-slate-950 font-black shrink-0">
                  <span className="text-[10px] tracking-tighter leading-none">ET</span>
                  <span className="text-[5px] tracking-widest leading-none mt-0.5 font-mono">DIGITAL</span>
                </div>
                <div className="leading-tight text-left">
                  <span className="font-display font-black text-xs tracking-wider uppercase text-white block">
                    ET DIGITAL
                  </span>
                  <span className="font-mono text-[8px] tracking-widest text-slate-300 block">
                    ENGAGE · CONVERT · <span className="text-cyan-400 font-bold">GROW</span>
                  </span>
                </div>
              </div>

              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                Performance Report Card
              </span>
              
              {hasUserEnteredAnyData ? (
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Live Data Active
                </span>
              ) : (
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50">
                  Baseline (All Metrics at 0)
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Before & After Campaign Analysis
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Track your exact before-and-after performance differential. Input where your engagement originated, the interaction type, and your business outcome to generate an AI assessment of what resonated with your target clients.
            </p>
          </div>

          {/* Action Header Controls */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleSaveData}
              disabled={isSaving}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              id="save-campaign-data-btn"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Saved to Profile!</span>
                </>
              ) : (
                <>
                  <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
                  <span>{isSaving ? 'Saving...' : 'Save & Sync Data'}</span>
                </>
              )}
            </button>

            {hasUserEnteredAnyData && (
              <button
                type="button"
                onClick={handleResetToZero}
                className="px-3.5 py-3 rounded-xl border border-slate-700 hover:border-red-500/50 bg-slate-900/80 hover:bg-red-500/10 text-slate-400 hover:text-red-400 font-mono text-xs transition-all cursor-pointer"
                title="Reset all metrics to 0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout: 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input Form & Qualitative Selectors (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="space-y-0.5">
              <h3 className="font-display text-sm font-bold text-[var(--text)] uppercase tracking-wider">
                Campaign Inputs & Context
              </h3>
              <p className="text-xs text-[var(--muted)]">
                All numbers start at 0 and persist across logins
              </p>
            </div>
            <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded">
              {hasUserEnteredAnyData ? 'Data Configured' : 'Ready for Input'}
            </span>
          </div>

          <div className="space-y-4 text-xs font-sans">
            {/* Channel / Platform Selector */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold">
                Platform / Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PLATFORM_OPTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPlatform(item)}
                    className={`py-2 px-2 rounded-xl border font-mono text-[11px] font-bold transition-all cursor-pointer truncate ${
                      platform === item
                        ? 'bg-cyan-500/15 border-cyan-500 text-cyan-600 dark:text-cyan-300 ring-1 ring-cyan-500'
                        : 'bg-[var(--surface2)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Campaign Headline / Topic */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold">
                Post / Campaign Topic
              </label>
              <input
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="e.g. Why Category Proof Beats Marketing Noise"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface2)] text-[var(--text)] font-sans text-xs focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Selection 1: Where engagement came from */}
            <div className="space-y-1.5 pt-1">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-500" />
                <span>Where Engagement Came From</span>
              </label>
              <select
                value={engagementSource}
                onChange={(e) => setEngagementSource(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface2)] text-[var(--text)] font-sans text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {ENGAGEMENT_SOURCE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Selection 2: Type of engagement */}
            <div className="space-y-1.5 pt-1">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-purple-500" />
                <span>Type of Engagement</span>
              </label>
              <select
                value={engagementType}
                onChange={(e) => setEngagementType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface2)] text-[var(--text)] font-sans text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {ENGAGEMENT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Selection 3: The outcome */}
            <div className="space-y-1.5 pt-1">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-500" />
                <span>The Outcome</span>
              </label>
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface2)] text-[var(--text)] font-sans text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {OUTCOME_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Before vs After Metric Inputs (Starts and stays at 0 by default) */}
            <div className="pt-3 border-t border-[var(--border)] space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[10px] uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-bold">
                  Metric Numbers (Before vs. After)
                </label>
                <span className="text-[10px] font-mono text-[var(--muted)]">
                  Default: 0 until entered
                </span>
              </div>

              {/* 1. Reach */}
              <div className="p-2.5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-medium text-[var(--text)]">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-cyan-500" />
                    Total Reach / Impressions
                  </span>
                  <span className="font-mono text-[10px] text-cyan-500 font-bold">
                    {afterReach >= beforeReach ? `+${afterReach - beforeReach}` : `${afterReach - beforeReach}`}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] font-mono text-[var(--muted)] uppercase block mb-1">Before (Prior)</span>
                    <input
                      type="number"
                      min="0"
                      value={beforeReach}
                      onChange={(e) => setBeforeReach(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-cyan-500 uppercase block mb-1">After (Campaign)</span>
                    <input
                      type="number"
                      min="0"
                      value={afterReach}
                      onChange={(e) => setAfterReach(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-cyan-500/40 bg-[var(--surface)] text-[var(--text)] font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Engagements */}
              <div className="p-2.5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-medium text-[var(--text)]">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    Engagements (Reactions & Comments)
                  </span>
                  <span className="font-mono text-[10px] text-purple-500 font-bold">
                    {afterEngagements >= beforeEngagements ? `+${afterEngagements - beforeEngagements}` : `${afterEngagements - beforeEngagements}`}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] font-mono text-[var(--muted)] uppercase block mb-1">Before (Prior)</span>
                    <input
                      type="number"
                      min="0"
                      value={beforeEngagements}
                      onChange={(e) => setBeforeEngagements(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-purple-500 uppercase block mb-1">After (Campaign)</span>
                    <input
                      type="number"
                      min="0"
                      value={afterEngagements}
                      onChange={(e) => setAfterEngagements(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-purple-500/40 bg-[var(--surface)] text-[var(--text)] font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Website Clicks */}
              <div className="p-2.5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-medium text-[var(--text)]">
                  <span className="flex items-center gap-1">
                    <MousePointerClick className="w-3 h-3 text-emerald-500" />
                    Website Clicks / Site Traffic
                  </span>
                  <span className="font-mono text-[10px] text-emerald-500 font-bold">
                    {afterClicks >= beforeClicks ? `+${afterClicks - beforeClicks}` : `${afterClicks - beforeClicks}`}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] font-mono text-[var(--muted)] uppercase block mb-1">Before (Prior)</span>
                    <input
                      type="number"
                      min="0"
                      value={beforeClicks}
                      onChange={(e) => setBeforeClicks(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-emerald-500 uppercase block mb-1">After (Campaign)</span>
                    <input
                      type="number"
                      min="0"
                      value={afterClicks}
                      onChange={(e) => setAfterClicks(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-emerald-500/40 bg-[var(--surface)] text-[var(--text)] font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Inquiries / Leads */}
              <div className="p-2.5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-medium text-[var(--text)]">
                  <span className="flex items-center gap-1">
                    <PhoneCall className="w-3 h-3 text-amber-500" />
                    Inquiries / Booked Leads
                  </span>
                  <span className="font-mono text-[10px] text-amber-500 font-bold">
                    {afterInquiries >= beforeInquiries ? `+${afterInquiries - beforeInquiries}` : `${afterInquiries - beforeInquiries}`}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] font-mono text-[var(--muted)] uppercase block mb-1">Before (Prior)</span>
                    <input
                      type="number"
                      min="0"
                      value={beforeInquiries}
                      onChange={(e) => setBeforeInquiries(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-amber-500 uppercase block mb-1">After (Campaign)</span>
                    <input
                      type="number"
                      min="0"
                      value={afterInquiries}
                      onChange={(e) => setAfterInquiries(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-amber-500/40 bg-[var(--surface)] text-[var(--text)] font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Save Button in Form */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveData}
                disabled={isSaving}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saveSuccess ? 'Data Synced & Saved!' : 'Save & Update Analysis'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: Branded Before & After Graph / Chart + AI Assessment (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* THE REPORT CARD: Branded Graph / Chart Showing Before and After Data */}
          <div className="rounded-3xl border border-cyan-500/30 bg-slate-950 p-6 sm:p-7 shadow-xl space-y-5 text-white relative overflow-hidden">
            
            {/* Report Card Header with Official ET Digital Logo */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                {/* Official ET Digital Logo Mark */}
                <div className="w-9 h-9 rounded-xl bg-cyan-400 flex flex-col items-center justify-center text-slate-950 font-black shrink-0 shadow-md shadow-cyan-500/30">
                  <span className="text-xs tracking-tighter leading-none">ET</span>
                  <span className="text-[6px] tracking-widest leading-none mt-0.5 font-mono">DIGITAL</span>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-sm tracking-wider uppercase text-white">
                      ET DIGITAL
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                      REPORT CARD
                    </span>
                  </div>
                  <span className="font-mono text-[9px] tracking-widest text-slate-400 block">
                    ENGAGE · CONVERT · <span className="text-cyan-400 font-bold">GROW</span>
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">
                  {businessName} · {platform}
                </span>
                <span className="font-mono text-[9px] text-cyan-400 block">
                  Differential: Before vs. After
                </span>
              </div>
            </div>

            {/* Sub-header details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 pb-1">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[9px] font-mono uppercase text-slate-400 block">Reach Lift</span>
                <div className="text-base font-mono font-bold text-white">
                  {afterReach >= beforeReach ? `+${afterReach - beforeReach}` : `${afterReach - beforeReach}`}
                </div>
                <span className="text-[9px] font-mono text-cyan-400">
                  {beforeReach > 0 ? `+${Math.round(((afterReach - beforeReach) / beforeReach) * 100)}%` : 'Active'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[9px] font-mono uppercase text-slate-400 block">Engagement Rate</span>
                <div className="text-base font-mono font-bold text-white">
                  {afterEngagementRate}%
                </div>
                <span className="text-[9px] font-mono text-purple-400">
                  from {beforeEngagementRate}%
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[9px] font-mono uppercase text-slate-400 block">Site Clicks</span>
                <div className="text-base font-mono font-bold text-white">
                  {afterClicks >= beforeClicks ? `+${afterClicks - beforeClicks}` : `${afterClicks - beforeClicks}`}
                </div>
                <span className="text-[9px] font-mono text-emerald-400">
                  {afterClicks} total clicks
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30">
                <span className="text-[9px] font-mono uppercase text-amber-400 block">Leads / Inquiries</span>
                <div className="text-base font-mono font-bold text-amber-400">
                  {afterInquiries}
                </div>
                <span className="text-[9px] font-mono text-slate-400">
                  from {beforeInquiries} prior
                </span>
              </div>
            </div>

            {/* Recharts Bar Chart: Before vs After */}
            <div className="w-full pt-2">
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
                    barGap={6}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                    <XAxis 
                      dataKey="shortKey" 
                      stroke="#94A3B8" 
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#94A3B8" 
                      fontSize={10} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#06B6D4',
                        borderRadius: '0.75rem',
                        color: '#F8FAFC',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                      }}
                      formatter={(val: any, name: string) => [
                        `${val} units`,
                        name === 'Before' ? 'Before (Baseline)' : 'After (Campaign)'
                      ]}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '8px' }}
                      formatter={(value) => (
                        <span style={{ color: value === 'Before' ? '#94A3B8' : '#22D3EE' }}>
                          {value === 'Before' ? 'Before (Baseline Data)' : 'After (Campaign Lift)'}
                        </span>
                      )}
                    />
                    <Bar 
                      dataKey="Before" 
                      fill="#475569" 
                      radius={[4, 4, 0, 0]} 
                      name="Before"
                    />
                    <Bar 
                      dataKey="After" 
                      fill="#06B6D4" 
                      radius={[4, 4, 0, 0]} 
                      name="After"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {!hasUserEnteredAnyData && (
                <div className="mt-2 text-center py-2 px-3 rounded-xl bg-slate-900/80 border border-dashed border-slate-700 text-xs text-slate-400 font-mono">
                  All metrics start at 0. Enter numbers in the input panel to plot your live growth delta.
                </div>
              )}
            </div>

            {/* Campaign Provenance Footer inside the Chart Card */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 gap-2">
              <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
                <span className="text-cyan-400 font-semibold">Origin:</span>
                <span>{engagementSource}</span>
                <span className="text-slate-600">·</span>
                <span className="text-purple-400 font-semibold">Type:</span>
                <span>{engagementType}</span>
              </div>
              <div className="text-[11px] font-mono text-emerald-400 font-semibold">
                Outcome: {outcome}
              </div>
            </div>

          </div>

          {/* AI ASSESSMENT: What about their content likely resonated with that client or groups of clients */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 shadow-sm text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-500">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-[var(--text)] uppercase tracking-wider">
                    AI Resonance & Strategic Assessment
                  </h4>
                  <p className="text-[11px] text-[var(--muted)]">
                    Why your message landed with target decision-makers
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCustomAiAssessment('');
                  setSaveSuccess(false);
                }}
                className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                title="Refresh with current parameters"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Re-assess</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] leading-relaxed space-y-3 font-sans">
              <p className="whitespace-pre-line">
                {activeAiAssessment}
              </p>
            </div>

            {/* Strategic Consultation CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[var(--muted)]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Want to replicate this resonance across upcoming content cycles?</span>
              </div>
              <button
                type="button"
                onClick={onOpenBooking}
                className="font-display font-bold text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Book 1-on-1 Strategy Calibration</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
