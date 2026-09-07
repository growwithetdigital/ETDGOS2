import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, Sparkles, ArrowRight, CheckCircle2, 
  ShieldCheck, Crown, MessageSquareText, Calendar, 
  TrendingUp, Award, Zap, Compass
} from 'lucide-react';
import { UserProfile } from '../../types';

interface FounderNotePanelProps {
  profile: UserProfile | null;
  onOpenBooking: () => void;
}

export default function FounderNotePanel({
  profile,
  onOpenBooking
}: FounderNotePanelProps) {
  const userName = profile?.displayName || profile?.business_name || 'Fellow Founder';

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto" id="founder-note-panel">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5">
                <Heart className="w-3 h-3 text-amber-400 fill-amber-400" />
                From The Desk Of Eric Thomas
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-500/30">
                Founder to Founder
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
              A Personal Note On Your Growth
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Why your story is the only moat that can never be commoditized in the age of artificial intelligence.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenBooking}
            className="shrink-0 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer active:scale-95"
          >
            <span>Book 1-on-1 With Eric</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Executive Letter Card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-md p-6 sm:p-10 shadow-2xl space-y-6 text-slate-200">
        
        {/* Author Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-lg shadow-amber-500/10 bg-slate-800">
              <img
                src="https://growwithetdigital.com/wp-content/uploads/2024/04/IMG_3962-scaled.jpg"
                alt="Eric Thomas"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  // Graceful fallback avatar if remote URL fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-slate-950" />
            </div>
          </div>

          <div className="space-y-0.5">
            <h3 className="text-lg font-display font-bold text-white">
              Eric Thomas
            </h3>
            <p className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              Founder & Chief Growth Architect · ET Digital
            </p>
            <p className="text-[11px] text-slate-400">
              Los Angeles, CA · Helping leaders engineer category-defining authority
            </p>
          </div>
        </div>

        {/* The Letter Body */}
        <div className="space-y-4 font-sans text-sm sm:text-base leading-relaxed text-slate-300">
          <p className="font-medium text-white text-lg">
            Dear {userName},
          </p>

          <p>
            If you are reading this inside your Growth OS dashboard, you have already taken a step that 95% of business owners avoid: you are refusing to compete as a generic commodity.
          </p>

          <p>
            Every single week, I speak with brilliant founders, coaches, and service leaders who are trapped in what I call the <em>"Noise Treadmill."</em> They are told to post five times a day on seven platforms, dance for algorithms, or hire cheap automation agencies that pump out soul-less corporate jargon.
          </p>

          <div className="my-6 p-5 sm:p-6 rounded-2xl bg-slate-950 border border-amber-500/30 text-amber-200 font-display text-base sm:text-lg italic leading-relaxed">
            "Your ideal clients aren’t looking for more noise. They are desperately looking for someone with conviction who can articulate their problem better than they can articulate it themselves. When you achieve that, selling is no longer a pitch—it’s an inevitable partnership."
          </div>

          <p>
            That is exactly why I built this Free Tier for you. The <strong>Business DNA</strong> scanner extracts what makes you distinct. The <strong>Market Report</strong> gives you the ground reality of what buyers want today. The <strong>Auditor</strong> diagnoses where your revenue is leaking. And the <strong>Content Studio</strong> hands you one scroll-stopping piece of strategic authority in your authentic voice, plus four multi-platform promotion angles to distribute it.
          </p>

          <p>
            I encourage you to use this tool vigorously. Publish that article. Post those promotional angles. Watch the caliber of conversations shift when people see you as a true category authority.
          </p>

          <p className="text-white font-medium">
            Remember: AI can copy features, but it can never manufacture your lived experience, your battle scars, or your conviction.
          </p>

          <div className="pt-4">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400">To your relentless expansion,</p>
            <p className="text-lg font-display font-bold text-amber-400 mt-1">Eric Thomas</p>
            <p className="text-xs text-slate-400">Founder, ET Digital</p>
          </div>
        </div>

      </div>

      {/* High-Converting Upgrade / Lead Gen Card */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/60 p-6 sm:p-10 shadow-2xl space-y-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 font-bold">
                Executive Scale
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Ready to Tell More of Your Story?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Upgrade from the Free Tier to the Full Growth OS Executive Suite and partner directly with Eric Thomas to engineer your multi-touch growth engine.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenBooking}
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-display text-sm font-bold uppercase tracking-wider flex items-center gap-2.5 shadow-xl shadow-cyan-500/25 transition-all cursor-pointer active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule 1-on-1 Consultation</span>
          </button>
        </div>

        {/* Feature Comparison Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Current Plan</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">Free Tier</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>1 Authority Article per Quarter</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>4 Social Promotion Angles</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Basic Pomelli Brand DNA Scanner</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Free Website Diagnostic Grader</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-slate-950 border border-cyan-500/40 space-y-3 shadow-lg shadow-cyan-950/30">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-400 font-bold">Unlocked With Consultation</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-400 text-slate-950 font-bold">Executive Suite</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-medium text-white">1-on-1 Strategic Consulting & Implementation with Eric Thomas</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Full 12-Month Dynamic Quarterly Roadmap</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Continuous Editorial Engine with Custom Visuals</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Multi-Touch Revenue Attribution & Pipeline Analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Answer Engine Optimization (AEO) for ChatGPT & Perplexity</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Final Conversion Action Banner */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strictly Confidential · Limited Executive Cohorts per Quarter</span>
          </div>

          <button
            type="button"
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Claim Your Strategy Consultation Session</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
