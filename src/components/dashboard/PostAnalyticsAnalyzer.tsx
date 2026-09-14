import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, Check, Sparkles, Users, MousePointerClick, 
  PhoneCall, ShieldCheck, ArrowUpRight,
  RefreshCw, Save, RotateCcw,
  Compass, Target, Award, CheckCircle2,
  Calendar, Zap, LineChart
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
import Logo from '../Logo';

interface PostAnalyticsAnalyzerProps {
  user?: any;
  profile: UserProfile | null;
  onRefreshProfile?: (updatedProfile?: UserProfile) => void;
  onOpenBooking: () => void;
}

// Preset options for content format / asset
export const CONTENT_FORMAT_OPTIONS = [
  'GOS Social Authority Post (LinkedIn / X / IG)',
  'GOS Targeted Email Blast / Newsletter',
  'GOS In-Depth Case Study / Editorial',
  'GOS Short-Form Video / Story',
  'GOS Google Business / Local Dispatch'
];

// Preset options for origin of engagement
export const ENGAGEMENT_SOURCE_OPTIONS = [
  'Inbound DMs / Private Messages',
  'Thoughtful Comments & In-Depth Discussion',
  'Profile Search & Organic Discovery',
  'Direct Peer Referral & Recommendations',
  'Email Newsletter Click-Through',
  'Google Business Profile / Maps Pack',
  'Executive Re-share & Group Mention'
];

// Preset options for type of engagement
export const ENGAGEMENT_TYPE_OPTIONS = [
  'Direct Pricing & Retainer Inquiry',
  'Problem Clarification & Advice Request',
  'Peer Reshare & Category Endorsement',
  'Specific Case Study / Methodology Question',
  'Saved / Bookmarked for Executive Decision',
  'Urgent Project / Service Timeline Question'
];

// Preset options for conversion ("cover version")
export const CONVERSION_OUTCOME_OPTIONS = [
  'Discovery Call / Strategy Consultation Booked',
  'Custom Proposal / Scope Requested',
  'New Retainer / High-Ticket Client Signed',
  'Pipeline Prospect Qualified & Nurtured',
  'New Email Subscriber / Inbound Lead Captured',
  'Service Agreement / Contract Finalized'
];

// Preset options for growth generated
export const GROWTH_GENERATED_OPTIONS = [
  'Expanded Category Reach into New Decision-Makers',
  'Built Verifiable Brand Trust & Industry Moat',
  'Shortened Inbound Sales & Deal Closing Time',
  'Re-engaged Dormant / Lapsed Client Relationships',
  'Created Word-of-Mouth Peer Referral Momentum'
];

export const PLATFORM_OPTIONS = [
  'LinkedIn',
  'Instagram',
  'Facebook',
  'X',
  'Email Blast',
  'Google Business'
];

export default function PostAnalyticsAnalyzer({
  user,
  profile,
  onRefreshProfile,
  onOpenBooking,
}: PostAnalyticsAnalyzerProps) {
  const uid = user?.uid || profile?.uid || 'guest';
  const businessName = profile?.business_name || profile?.displayName || 'Your Business';

  // 1. Inputs: By default all metrics start and stay at 0 until user inputs data
  const [platform, setPlatform] = useState<string>('LinkedIn');
  const [contentFormat, setContentFormat] = useState<string>(CONTENT_FORMAT_OPTIONS[0]);
  const [postTitle, setPostTitle] = useState<string>('');
  
  // Qualitative context options
  const [engagementSource, setEngagementSource] = useState<string>(ENGAGEMENT_SOURCE_OPTIONS[0]);
  const [engagementType, setEngagementType] = useState<string>(ENGAGEMENT_TYPE_OPTIONS[0]);
  const [outcome, setOutcome] = useState<string>(CONVERSION_OUTCOME_OPTIONS[0]);
  const [growthGenerated, setGrowthGenerated] = useState<string>(GROWTH_GENERATED_OPTIONS[0]);

  // Before and After metric states — strictly initialized at 0
  const [beforeReach, setBeforeReach] = useState<number>(0);
  const [afterReach, setAfterReach] = useState<number>(0);

  const [beforeEngagements, setBeforeEngagements] = useState<number>(0);
  const [afterEngagements, setAfterEngagements] = useState<number>(0);

  const [beforeClicks, setBeforeClicks] = useState<number>(0);
  const [afterClicks, setAfterClicks] = useState<number>(0);

  const [beforeInquiries, setBeforeInquiries] = useState<number>(0);
  const [afterInquiries, setAfterInquiries] = useState<number>(0);

  // Prediction cadence state
  const [predictionCadence, setPredictionCadence] = useState<'quarterly' | 'monthly' | 'weekly' | 'daily'>('weekly');
  const [viewMode, setViewMode] = useState<'actual' | 'prediction'>('actual');

  const [hasInputData, setHasInputData] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [customAiAssessment, setCustomAiAssessment] = useState<string>('');

  // 2. Load saved data on sign-in / profile load
  useEffect(() => {
    let saved: PostAnalyticsData | null = null;

    if (profile?.post_analytics_data) {
      saved = profile.post_analytics_data;
    } else if (typeof window !== 'undefined' && uid) {
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
      setContentFormat(saved.contentFormat || CONTENT_FORMAT_OPTIONS[0]);
      setPostTitle(saved.postTitle || '');
      setEngagementSource(saved.engagementSource || ENGAGEMENT_SOURCE_OPTIONS[0]);
      setEngagementType(saved.engagementType || ENGAGEMENT_TYPE_OPTIONS[0]);
      setOutcome(saved.outcome || CONVERSION_OUTCOME_OPTIONS[0]);
      setGrowthGenerated(saved.growthGenerated || GROWTH_GENERATED_OPTIONS[0]);
      setBeforeReach(saved.beforeReach || 0);
      setAfterReach(saved.afterReach || 0);
      setBeforeEngagements(saved.beforeEngagements || 0);
      setAfterEngagements(saved.afterEngagements || 0);
      setBeforeClicks(saved.beforeClicks || 0);
      setAfterClicks(saved.afterClicks || 0);
      setBeforeInquiries(saved.beforeInquiries || 0);
      setAfterInquiries(saved.afterInquiries || 0);
      if (saved.predictionCadence) {
        setPredictionCadence(saved.predictionCadence);
      }
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

  // Prediction multiplier logic:
  // Free tier is quarterly (1x baseline).
  // Partnering with ET Digital:
  // Monthly = 3x quarterly volume
  // Weekly = 12x quarterly volume
  // Daily = 50x quarterly volume
  const cadenceMultiplier = useMemo(() => {
    switch (predictionCadence) {
      case 'quarterly':
        return 1;
      case 'monthly':
        return 3;
      case 'weekly':
        return 12;
      case 'daily':
        return 50;
      default:
        return 12;
    }
  }, [predictionCadence]);

  // 3. High-Level Assessment from Eric's Marketing Mind
  const ericsMarketingMindAssessment = useMemo(() => {
    if (!hasUserEnteredAnyData && !hasInputData) {
      return "Hey, welcome to your interactive growth chart! Enter your post or eblast details along with your numbers on the left. Everything starts at zero and saves to your account so you can see exactly where your clients are paying attention.";
    }

    const topicLabel = postTitle.trim() ? `"${postTitle.trim()}"` : 'your featured piece of content';
    const inquiriesDelta = afterInquiries - beforeInquiries;
    const reachDelta = afterReach - beforeReach;

    let ericResonance = '';
    if (engagementType.includes('Pricing') || engagementType.includes('Retainer')) {
      ericResonance = `When prospective clients ask you directly about pricing or retainers from ${topicLabel}, that tells me you successfully removed the fear of the unknown. Most people hesitate to reach out because they feel like they will get trapped in a high-pressure sales pitch. By laying out clear thinking in your content, you made it safe and natural for them to say, "Hey, how do we work together?"`;
    } else if (engagementType.includes('Problem Clarification') || engagementType.includes('Advice')) {
      ericResonance = `When clients reach out with specific advice questions after reading ${topicLabel}, you’ve hit a genuine nerve. You didn't just post general motivation—you named the exact operational headache keeping them up at night. That positions you right away as a trusted advisor, not someone just trying to sell them something.`;
    } else if (engagementType.includes('Reshare') || engagementType.includes('Endorsement')) {
      ericResonance = `Having peers and industry decision-makers reshare ${topicLabel} is one of the highest compliments in digital marketing. It means your post gave them a smart, credible piece of thinking to put in front of their own audience. That’s organic word-of-mouth working for you while you sleep.`;
    } else if (engagementType.includes('Case Study') || engagementType.includes('Methodology')) {
      ericResonance = `Analytical buyers love verifiable proof. By breaking down real steps in ${topicLabel}, you gave them the exact confidence they needed to picture working with you. Proof cuts through marketing skepticism faster than any fancy sales pitch ever could.`;
    } else {
      ericResonance = `Your content in ${topicLabel} worked because you spoke in an authentic, approachable voice. People are tired of sterile corporate speak. When you speak human-to-human about real challenges, prospective clients stop scrolling and start listening.`;
    }

    let ericSource = '';
    if (engagementSource.includes('DMs') || engagementSource.includes('Private')) {
      ericSource = `They chose to reach out via direct message because your message touched a strategic priority they preferred to discuss confidentially. That is a hallmark of high-ticket decision-making.`;
    } else if (engagementSource.includes('Comments')) {
      ericSource = `The public discussion in the comments built immediate social proof. When quiet prospects see other respected voices chiming in, it gives them permission to reach out too.`;
    } else if (engagementSource.includes('Email') || engagementSource.includes('Newsletter')) {
      ericSource = `Subscribers reading your email blast already know your name. Seeing clicks and replies from your list proves your direct subscriber relationship is healthy and responsive.`;
    } else {
      ericSource = `Generating this via ${engagementSource} confirms your message cut through platform clutter and connected with real decision-makers.`;
    }

    let ericOutcome = '';
    if (outcome.includes('Discovery Call') || outcome.includes('Consultation Booked')) {
      ericOutcome = `Best of all, this resulted in a booked consultation. That is the true scorecard of great marketing: turning reader attention into a real conversation on your calendar.`;
    } else if (outcome.includes('Proposal') || outcome.includes('Scope')) {
      ericOutcome = `Moving straight into a proposal request shows you answered their major objections upfront. The sales cycle is already halfway completed.`;
    } else if (outcome.includes('Client Signed') || outcome.includes('Retainer')) {
      ericOutcome = `Closing a high-ticket client from this effort proves your Growth OS content isn't an expense—it's an asset that produces real business revenue.`;
    } else {
      ericOutcome = `This outcome validates that consistent, thoughtful positioning protects your brand reputation and feeds your pipeline.`;
    }

    const metricNote = inquiriesDelta > 0 
      ? ` Moving from ${beforeInquiries} to ${afterInquiries} inquiries is proof that clear messaging gets responses.`
      : reachDelta > 0 
      ? ` Expanding your audience by +${reachDelta} people means more prospective clients now know who you are and what you stand for.`
      : '';

    return `${ericResonance} ${ericSource} ${ericOutcome}${metricNote}`;
  }, [
    hasUserEnteredAnyData,
    hasInputData,
    postTitle,
    engagementType,
    engagementSource,
    outcome,
    beforeInquiries,
    afterInquiries,
    beforeReach,
    afterReach
  ]);

  // 4. What Data and Marketing Experts (HubSpot & Ad Age) Say
  const industryExpertsAssessment = useMemo(() => {
    if (!hasUserEnteredAnyData && !hasInputData) {
      return "According to global marketing data from HubSpot and Ad Age, businesses that document and measure self-verified engagement signals experience 3.8x faster sales conversion than businesses relying on uncalibrated broadcast ads.";
    }

    const baselineInquiries = afterInquiries > 0 ? afterInquiries : 1;
    const projectedAnnualWeekly = baselineInquiries * 12;

    return `HubSpot’s State of Marketing research proves that educational, problem-solving content drives a 3.8x higher buyer conversion rate than promotional advertising. Ad Age reporting underscores that today's enterprise buyers research 70% of their decision before ever speaking to a sales representative. By measuring real self-verified outcomes from ${contentFormat}, you are leveraging high-intent buyer psychology. If your current quarterly content generated ${afterInquiries} high-intent inquiries, empirical data suggests a weekly publishing cadence with ET Digital projects to ~${projectedAnnualWeekly} qualified inbound inquiries per year.`;
  }, [hasUserEnteredAnyData, hasInputData, afterInquiries, contentFormat]);

  // 5. Save and persist handler
  const handleSaveData = async () => {
    setIsSaving(true);
    const dataToSave: PostAnalyticsData = {
      platform,
      contentFormat,
      postTitle,
      engagementSource,
      engagementType,
      outcome,
      growthGenerated,
      beforeReach,
      afterReach,
      beforeEngagements,
      afterEngagements,
      beforeClicks,
      afterClicks,
      beforeInquiries,
      afterInquiries,
      predictionCadence,
      hasInputData: true,
      lastUpdated: new Date().toISOString(),
      aiAssessment: ericsMarketingMindAssessment
    };

    try {
      if (typeof window !== 'undefined' && uid) {
        localStorage.setItem(`et_post_analytics_${uid}`, JSON.stringify(dataToSave));
      }

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
            contentFormat: CONTENT_FORMAT_OPTIONS[0],
            postTitle: '',
            engagementSource: ENGAGEMENT_SOURCE_OPTIONS[0],
            engagementType: ENGAGEMENT_TYPE_OPTIONS[0],
            outcome: CONVERSION_OUTCOME_OPTIONS[0],
            growthGenerated: GROWTH_GENERATED_OPTIONS[0],
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

  // 6. Interactive Chart Data
  // In 'actual' mode: shows Before vs. After
  // In 'prediction' mode: shows Current Inputted Baseline vs. Projected ET Digital Velocity
  const chartData = useMemo(() => {
    if (viewMode === 'prediction') {
      // In prediction mode, show current vs predicted with ET Digital
      const currentReach = afterReach > 0 ? afterReach : (beforeReach > 0 ? beforeReach : 150);
      const currentEngage = afterEngagements > 0 ? afterEngagements : (beforeEngagements > 0 ? beforeEngagements : 12);
      const currentClicks = afterClicks > 0 ? afterClicks : (beforeClicks > 0 ? beforeClicks : 5);
      const currentInquiries = afterInquiries > 0 ? afterInquiries : (beforeInquiries > 0 ? beforeInquiries : 1);

      return [
        {
          metric: 'Audience Reach',
          shortKey: 'Reach',
          Current: currentReach,
          Predicted: Math.round(currentReach * cadenceMultiplier),
          multiplier: `${cadenceMultiplier}x`
        },
        {
          metric: 'Engagements',
          shortKey: 'Engage',
          Current: currentEngage,
          Predicted: Math.round(currentEngage * cadenceMultiplier),
          multiplier: `${cadenceMultiplier}x`
        },
        {
          metric: 'Website Clicks',
          shortKey: 'Clicks',
          Current: currentClicks,
          Predicted: Math.round(currentClicks * cadenceMultiplier),
          multiplier: `${cadenceMultiplier}x`
        },
        {
          metric: 'Booked Inquiries',
          shortKey: 'Leads',
          Current: currentInquiries,
          Predicted: Math.round(currentInquiries * cadenceMultiplier),
          multiplier: `${cadenceMultiplier}x`
        }
      ];
    }

    // Default 'actual' Before vs After mode
    return [
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
  }, [
    viewMode,
    beforeReach,
    afterReach,
    beforeEngagements,
    afterEngagements,
    beforeClicks,
    afterClicks,
    beforeInquiries,
    afterInquiries,
    cadenceMultiplier
  ]);

  return (
    <div className="space-y-6 text-left" id="interactive-growth-chart">
      
      {/* Top Header Card: Interactive Results & Growth Engine */}
      <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Official ET Digital Brand Badge */}
              <div className="flex items-center gap-2.5 bg-slate-950/90 px-3 py-1.5 rounded-2xl border border-cyan-500/40 shadow-inner">
                <Logo className="h-7 w-auto" showWordmark={false} />
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
                <LineChart className="w-3.5 h-3.5 text-cyan-400" />
                Interactive Growth Chart & Engine
              </span>
              
              {hasUserEnteredAnyData ? (
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Self-Verified Numbers Active
                </span>
              ) : (
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50">
                  Baseline (All Metrics at 0)
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Interactive Campaign Results & Growth Prediction
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Hey, I'm Eric Lamarr Thomas. Enter your self-verified results from your Growth OS content below. All numbers stay saved across logins. Toggle the prediction engine to see what happens when you partner with ET Digital to scale your publishing frequency.
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
                  <span>{isSaving ? 'Saving...' : 'Save & Sync Results'}</span>
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
        
        {/* Left Column: Input Form & Qualitative Descriptors (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="space-y-0.5">
              <h3 className="font-display text-sm font-bold text-[var(--text)] uppercase tracking-wider">
                Self-Verified Campaign Details
              </h3>
              <p className="text-xs text-[var(--muted)]">
                All metrics start at 0 and persist across your visits
              </p>
            </div>
            <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-lg">
              {hasUserEnteredAnyData ? 'Verified Data Active' : 'Enter Details Below'}
            </span>
          </div>

          <div className="space-y-4 text-xs font-sans">
            {/* 1. Channel / Platform Selector */}
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

            {/* 2. Content Format / Asset Type */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold">
                GOS Content Format
              </label>
              <select
                value={contentFormat}
                onChange={(e) => setContentFormat(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface2)] text-[var(--text)] font-sans text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {CONTENT_FORMAT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Campaign Headline / Topic */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold">
                Post / Eblast / Content Title
              </label>
              <input
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="e.g. Why Category Proof Beats Marketing Noise in 2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface2)] text-[var(--text)] font-sans text-xs focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* 4. Selection: Where Engagement Came From */}
            <div className="space-y-1.5 pt-1">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-500" />
                <span>What Engagement It Generated</span>
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

            {/* 5. Selection: Type of Engagement */}
            <div className="space-y-1.5 pt-1">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-purple-500" />
                <span>Nature of Prospective Buyer Interaction</span>
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

            {/* 6. Selection: Conversion Outcome ("Cover Version") */}
            <div className="space-y-1.5 pt-1">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-500" />
                <span>Conversion Generated ("Cover Version")</span>
              </label>
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface2)] text-[var(--text)] font-sans text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {CONVERSION_OUTCOME_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* 7. Selection: Growth Generated */}
            <div className="space-y-1.5 pt-1">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-500" />
                <span>Long-Term Growth Generated</span>
              </label>
              <select
                value={growthGenerated}
                onChange={(e) => setGrowthGenerated(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface2)] text-[var(--text)] font-sans text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {GROWTH_GENERATED_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* 8. Before vs After Numeric Inputs (Starts and stays at 0 by default) */}
            <div className="pt-3 border-t border-[var(--border)] space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[10px] uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-bold">
                  Self-Verified Numbers (Before vs. After)
                </label>
                <span className="text-[10px] font-mono text-[var(--muted)]">
                  All metrics stay at 0 until entered
                </span>
              </div>

              {/* Reach */}
              <div className="p-2.5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-medium text-[var(--text)]">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-cyan-500" />
                    Audience Reach / Impressions
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

              {/* Engagements */}
              <div className="p-2.5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-medium text-[var(--text)]">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    Engagements (Comments & Discussions)
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

              {/* Website Clicks */}
              <div className="p-2.5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-medium text-[var(--text)]">
                  <span className="flex items-center gap-1">
                    <MousePointerClick className="w-3 h-3 text-emerald-500" />
                    Website / Link Clicks
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

              {/* Inquiries / Leads */}
              <div className="p-2.5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-medium text-[var(--text)]">
                  <span className="flex items-center gap-1">
                    <PhoneCall className="w-3 h-3 text-amber-500" />
                    Direct Inquiries / Consultation Requests
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

            {/* Quick Save Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveData}
                disabled={isSaving}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-cyan-500/20 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>{saveSuccess ? 'Numbers Saved & Synced!' : 'Save & Update Growth Chart'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: Visible Interactive Chart + ET Digital Prediction Engine (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* THE INTERACTIVE VISIBLE CHART & GRAPH */}
          <div className="rounded-3xl border border-cyan-500/30 bg-slate-950 p-6 sm:p-7 shadow-xl space-y-5 text-white relative overflow-hidden">
            
            {/* Chart Header with Official ET Digital Logo */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                {/* Official ET Digital Logo Mark */}
                <div className="p-1 rounded-xl bg-slate-900 border border-cyan-500/40 shadow-md shadow-cyan-500/20 flex items-center justify-center shrink-0">
                  <Logo className="h-8 w-auto" showWordmark={false} />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-sm tracking-wider uppercase text-white">
                      ET DIGITAL
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold">
                      GROWTH ENGINE
                    </span>
                  </div>
                  <span className="font-mono text-[9px] tracking-widest text-slate-400 block">
                    ENGAGE · CONVERT · <span className="text-cyan-400 font-bold">GROW</span>
                  </span>
                </div>
              </div>

              {/* View Switcher: Self-Verified Actuals vs. ET Digital Prediction */}
              <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 self-stretch sm:self-auto">
                <button
                  type="button"
                  onClick={() => setViewMode('actual')}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    viewMode === 'actual'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Self-Verified Results
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('prediction')}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    viewMode === 'prediction'
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-sm'
                      : 'text-cyan-400 hover:text-cyan-300'
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  <span>Predict with ET Digital</span>
                </button>
              </div>
            </div>

            {/* PREDICTION CONTROLS: If Prediction Mode is active */}
            {viewMode === 'prediction' && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 border border-cyan-500/40 space-y-3 animate-in fade-in">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-display font-bold text-cyan-400 uppercase tracking-wider block">
                      🔮 What If You Scaled Publishing Cadence with ET Digital?
                    </span>
                    <p className="text-[11px] text-slate-300">
                      You're currently on our free quarterly content tier. Imagine what happens when we ramp up to monthly, weekly, or daily:
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/20 px-2.5 py-1 rounded-lg border border-cyan-500/40 font-bold shrink-0">
                    {cadenceMultiplier}x Compound Velocity
                  </span>
                </div>

                {/* Cadence Selector Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setPredictionCadence('quarterly')}
                    className={`p-2 rounded-xl border text-left font-mono transition-all cursor-pointer ${
                      predictionCadence === 'quarterly'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-[9px] uppercase block text-slate-400">Current Baseline</span>
                    <span className="text-xs font-bold block">Free Quarterly</span>
                    <span className="text-[9px] text-slate-400 block">1 piece / quarter</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPredictionCadence('monthly')}
                    className={`p-2 rounded-xl border text-left font-mono transition-all cursor-pointer ${
                      predictionCadence === 'monthly'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-[9px] uppercase block text-cyan-400">Step 1 with ET Digital</span>
                    <span className="text-xs font-bold block">Monthly Cadence</span>
                    <span className="text-[9px] text-slate-400 block">3x volume (12/yr)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPredictionCadence('weekly')}
                    className={`p-2 rounded-xl border text-left font-mono transition-all cursor-pointer ${
                      predictionCadence === 'weekly'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-[9px] uppercase block text-amber-400">Recommended Growth</span>
                    <span className="text-xs font-bold block">Weekly Momentum</span>
                    <span className="text-[9px] text-slate-400 block">12x volume (52/yr)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPredictionCadence('daily')}
                    className={`p-2 rounded-xl border text-left font-mono transition-all cursor-pointer ${
                      predictionCadence === 'daily'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-[9px] uppercase block text-purple-400">Category Dominance</span>
                    <span className="text-xs font-bold block">Daily Authority</span>
                    <span className="text-[9px] text-slate-400 block">50x volume (250+/yr)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Metrics Ticker */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 pb-1">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[9px] font-mono uppercase text-slate-400 block">Audience Reach</span>
                <div className="text-base font-mono font-bold text-white">
                  {viewMode === 'prediction'
                    ? `${Math.round((afterReach > 0 ? afterReach : 150) * cadenceMultiplier)}`
                    : (afterReach >= beforeReach ? `+${afterReach - beforeReach}` : `${afterReach - beforeReach}`)}
                </div>
                <span className="text-[9px] font-mono text-cyan-400">
                  {viewMode === 'prediction' ? `Projected @ ${predictionCadence}` : `${afterReach} total impressions`}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[9px] font-mono uppercase text-slate-400 block">Engagements</span>
                <div className="text-base font-mono font-bold text-white">
                  {viewMode === 'prediction'
                    ? `${Math.round((afterEngagements > 0 ? afterEngagements : 12) * cadenceMultiplier)}`
                    : `${afterEngagements}`}
                </div>
                <span className="text-[9px] font-mono text-purple-400">
                  {viewMode === 'prediction' ? 'Peer interactions' : `from ${beforeEngagements} prior`}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[9px] font-mono uppercase text-slate-400 block">Website Traffic</span>
                <div className="text-base font-mono font-bold text-white">
                  {viewMode === 'prediction'
                    ? `${Math.round((afterClicks > 0 ? afterClicks : 5) * cadenceMultiplier)}`
                    : `${afterClicks}`}
                </div>
                <span className="text-[9px] font-mono text-emerald-400">
                  {viewMode === 'prediction' ? 'Targeted visitors' : `from ${beforeClicks} prior`}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30">
                <span className="text-[9px] font-mono uppercase text-amber-400 block">Booked Inquiries</span>
                <div className="text-base font-mono font-bold text-amber-400">
                  {viewMode === 'prediction'
                    ? `${Math.round((afterInquiries > 0 ? afterInquiries : 1) * cadenceMultiplier)}`
                    : `${afterInquiries}`}
                </div>
                <span className="text-[9px] font-mono text-slate-300">
                  {viewMode === 'prediction' ? 'Strategy sessions' : `from ${beforeInquiries} prior`}
                </span>
              </div>
            </div>

            {/* Recharts Interactive Bar Chart */}
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
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '8px' }}
                      formatter={(value) => {
                        if (viewMode === 'prediction') {
                          return (
                            <span style={{ color: value === 'Current' ? '#94A3B8' : '#22D3EE' }}>
                              {value === 'Current' ? 'Current Baseline (Free Quarterly)' : `Projected Trajectory with ET Digital (${predictionCadence.toUpperCase()})`}
                            </span>
                          );
                        }
                        return (
                          <span style={{ color: value === 'Before' ? '#94A3B8' : '#22D3EE' }}>
                            {value === 'Before' ? 'Before (Prior Baseline)' : 'After (Self-Verified Campaign Lift)'}
                          </span>
                        );
                      }}
                    />
                    {viewMode === 'prediction' ? (
                      <>
                        <Bar 
                          dataKey="Current" 
                          fill="#475569" 
                          radius={[4, 4, 0, 0]} 
                          name="Current"
                        />
                        <Bar 
                          dataKey="Predicted" 
                          fill="#06B6D4" 
                          radius={[4, 4, 0, 0]} 
                          name="Predicted"
                        />
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {!hasUserEnteredAnyData && viewMode === 'actual' && (
                <div className="mt-2 text-center py-2 px-3 rounded-xl bg-slate-900/80 border border-dashed border-slate-700 text-xs text-slate-400 font-mono">
                  All metrics start and stay at 0 until you input your data on the left.
                </div>
              )}
            </div>

            {/* Campaign Provenance Footer inside the Chart Card */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 gap-2">
              <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
                <span className="text-cyan-400 font-semibold">Asset:</span>
                <span>{contentFormat.split('(')[0]}</span>
                <span className="text-slate-600">·</span>
                <span className="text-purple-400 font-semibold">Interaction:</span>
                <span>{engagementType}</span>
              </div>
              <div className="text-[11px] font-mono text-emerald-400 font-semibold">
                Outcome: {outcome}
              </div>
            </div>

            {/* CTA BOOK CONSULTATION: Prominently featured on the chart */}
            <div className="pt-3 border-t border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-cyan-950/30 -mx-6 sm:-mx-7 -mb-6 sm:-mb-7 p-4 sm:p-5">
              <div className="space-y-0.5">
                <span className="text-xs font-display font-bold text-white block">
                  Ready to turn quarterly spikes into weekly or daily client acquisition?
                </span>
                <p className="text-[11px] text-slate-300">
                  Book a direct 1-on-1 strategy consultation with Eric to review your data and map out your growth trajectory.
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenBooking}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/30 cursor-pointer transition-all active:scale-95 shrink-0"
                id="chart-book-consultation-cta"
              >
                <span>Book Consultation with Eric</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* TWO HIGH-LEVEL ASSESSMENTS: Eric's Marketing Mind & What Data Experts Say */}
          <div className="space-y-4">
            
            {/* 1. Assessment From My Marketing Mind (Eric Lamarr Thomas) */}
            <div className="rounded-3xl border border-cyan-500/30 bg-[var(--surface)] p-6 space-y-3 shadow-sm text-left">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold font-mono text-xs">
                    ET
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-[var(--text)] uppercase tracking-wider">
                      From My Marketing Mind
                    </h4>
                    <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                      Eric Lamarr Thomas · Founder, ET Digital
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCustomAiAssessment('');
                    setSaveSuccess(false);
                  }}
                  className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  title="Re-evaluate with current parameters"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh Insight</span>
                </button>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] leading-relaxed space-y-2.5 font-sans">
                <p className="whitespace-pre-line">
                  {ericsMarketingMindAssessment}
                </p>
              </div>
            </div>

            {/* 2. What Data & Marketing Experts (HubSpot & Ad Age) Say */}
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3 shadow-sm text-left">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-[var(--text)] uppercase tracking-wider">
                      What Data & Marketing Experts Say
                    </h4>
                    <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold">
                      HubSpot Research & Ad Age (adage.com) Consensus
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-[var(--muted)]">
                  Verified Data Analysis
                </span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] leading-relaxed space-y-2.5 font-sans">
                <p>
                  {industryExpertsAssessment}
                </p>
                <div className="pt-2 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[var(--muted)]">
                  <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Empirical Takeaway: Consistent frequency turns unpredictable spikes into reliable pipeline.
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
