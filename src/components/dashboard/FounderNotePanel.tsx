import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, Sparkles, ArrowRight, CheckCircle2, 
  ShieldCheck, Crown, Calendar, 
  TrendingUp, Award, Zap, Compass, FileCheck, Search, BookOpen, ExternalLink, ArrowUpRight
} from 'lucide-react';
import { UserProfile } from '../../types';

interface FounderNotePanelProps {
  profile: UserProfile | null;
  onOpenBooking: () => void;
  onOpenCalendar?: () => void;
}

export default function FounderNotePanel({
  profile,
  onOpenBooking,
  onOpenCalendar,
}: FounderNotePanelProps) {
  const userName = profile?.displayName || profile?.business_name || 'Growth Partner';
  const calendarUrl = 'https://calendar.app.google/Eg21vAqWrJN1j358A';

  const handleCalendarClick = () => {
    if (onOpenCalendar) {
      onOpenCalendar();
    } else {
      window.open(calendarUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto" id="founder-note-panel">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5">
                <Heart className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                Executive Dispatch
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                Founder's Note · ET Digital
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
              A Personal Note On Your Category Growth
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              A closing message on building authentic category authority, research rigor, and engineering sustainable market moats.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCalendarClick}
            className="shrink-0 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer active:scale-95"
            id="founder-note-header-consult-btn"
          >
            <span>Schedule Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Letter Card */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10 shadow-xl space-y-6 text-[var(--text)]">
        
        {/* Author Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-[var(--border)]">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-cyan-500/60 shadow-lg shadow-cyan-500/10 bg-slate-900">
              <img
                src="https://res.cloudinary.com/dnpvgq7gt/image/upload/v1789270422/pomelli_photoshoot-3_t8k6b3.png"
                alt="Eric Thomas"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[var(--surface)] flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-slate-950" />
            </div>
          </div>

          <div className="space-y-0.5">
            <h3 className="text-lg font-display font-bold text-[var(--text)]">
              Eric Thomas
            </h3>
            <p className="text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-wider font-bold">
              Founder & Chief Growth Architect · ET Digital
            </p>
            <p className="text-[11px] text-[var(--muted)]">
              Building category-defining growth systems and authentic brand authority
            </p>
          </div>
        </div>

        {/* The Thank You & Letter Body */}
        <div className="space-y-4 font-sans text-sm sm:text-base leading-relaxed text-[var(--muted)]">
          <p className="font-semibold text-[var(--text)] text-lg">
            Dear {userName},
          </p>

          <p>
            First and foremost, thank you for investing your time and trust into the Growth OS platform. Building a standout business in today's landscape requires discipline, intentionality, and a refusal to settle for generic, commoditized marketing.
          </p>

          <p>
            Every day, business leaders find themselves inundated with superficial marketing tactics: advice to post five times a day on every social channel, dance for fleeting algorithms, or outsource their voice to generic AI wrappers that churn out hollow corporate jargon.
          </p>

          <div className="my-6 p-5 sm:p-6 rounded-2xl bg-[var(--surface2)] border border-cyan-500/30 text-[var(--text)] font-display text-base sm:text-lg italic leading-relaxed">
            "Your ideal clients aren't looking for more noise. They are looking for someone with absolute conviction who articulates their exact challenges with greater precision and depth than they can express themselves. When you accomplish that, selling stops being an uphill pitch—it becomes an inevitable partnership."
          </div>

          <p>
            At ET Digital, we designed the Growth OS to solve that exact challenge. By synthesizing your authentic Brand DNA, analyzing trailing 30-day and year-to-date market shifts, diagnosing structural website friction, and generating one comprehensive quarterly editorial piece with four multi-channel promotion angles, we help you replace fragmented tactics with an enduring authority engine.
          </p>

          <p>
            We encourage you to put these insights into immediate practice. Publish your custom dispatches. Distribute your promotional angles. Experience firsthand how the caliber of your client conversations elevates when you show up as a category authority.
          </p>
        </div>

      </div>

      {/* Research Rigor & Vetted Sourcing Architecture */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10 shadow-xl space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
          <FileCheck className="w-5 h-5 text-cyan-500" />
          <h3 className="font-display text-lg font-bold text-[var(--text)] uppercase tracking-wider">
            Research Rigor & Vetted Sourcing Behind Your Growth OS
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
          What makes the intelligence, strategic dispatches, and diagnostics inside your Growth OS dependable? We do not rely on speculative trends or superficial AI hallucinations. Every output is built upon a verified multi-layer research architecture:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
            <h4 className="font-display text-sm font-bold text-[var(--text)]">
              Primary Research Verification
            </h4>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Every market report synthesizes peer-reviewed research and institutional reporting from Harvard Business Review, McKinsey & Company, Gartner, Digiday, and Think with Google.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <h4 className="font-display text-sm font-bold text-[var(--text)]">
              AI Answer Engine Telemetry
            </h4>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Our models track live entity citation patterns and structured schema recognition across ChatGPT Search, Google AI Overviews, and Perplexity, ensuring your brand is primed for algorithmic recommendation.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-display text-sm font-bold text-[var(--text)]">
              First-Party Brand DNA Calibration
            </h4>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Outputs are never generated from generic templates. They are strictly aligned with your specific business parameters, verified local market dynamics, and distinct voice archetype.
            </p>
          </div>

        </div>
      </div>

      {/* Closing Call to Action: Schedule Consultation with ET Digital */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/60 p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 font-bold">
              Next Step in Your Trajectory
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            We’d love to work with you on your growth needs
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Ready to expand beyond quarterly dispatches into an omnichannel growth operating system with tailored weekly dispatches, custom distribution, and direct strategy sessions with our team?
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
          <button
            type="button"
            onClick={handleCalendarClick}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-display text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-500/25 transition-all cursor-pointer active:scale-95"
            id="founder-note-closing-calendar-btn"
          >
            <Calendar className="w-4 h-4" />
            <span>We’d love to work with you on your growth needs — click here to schedule a consultation</span>
            <ArrowUpRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>

        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Confidential Executive Consultation · ET Digital Growth Systems</span>
          </div>
          <span className="font-mono text-[11px] text-cyan-400 font-bold">
            Tailored Implementation
          </span>
        </div>

      </div>

    </div>
  );
}
