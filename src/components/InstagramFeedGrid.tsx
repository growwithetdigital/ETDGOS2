import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, Check, Calendar,
  Building2, ExternalLink,
  X, Search, Share2, ShieldCheck, Zap, Lightbulb
} from 'lucide-react';
import SocialLinktreeModal from './SocialLinktreeModal';

export interface FeedCardItem {
  id: string;
  title: string;
  cardType: 'Case Study';
  quarter: string; // e.g. "Q3 2026"
  quarterTag: string; // e.g. "Q3 2026 • Private Practice & AI Search"
  reputableSource: string; // e.g. "ET Digital Client Success Story"
  sourceUrl?: string;
  imageUrl: string;
  metricBadge: { label: string; value: string };
  category: string; // e.g. "LOCAL SEO & AI DISCOVERY", "PR & MEDIA STORYTELLING", "REPUTATION & LOCAL CRM"
  coreProblem: string;
  solutionTakeaways: string[];
  freeAuditorTieIn: string;
  ctaText: string;
}

interface InstagramFeedGridProps {
  onOpenBooking?: () => void;
  onOpenCalendar?: () => void;
}

const QUARTER_CARDS: FeedCardItem[] = [
  {
    id: 'q3-card-1',
    title: 'Private Practice Growth: Scaling Patient Discovery & AI Search Presence',
    cardType: 'Case Study',
    quarter: 'Q3 2026',
    quarterTag: 'Q3 2026 • Private Practice & AI Search',
    reputableSource: 'ET Digital Client Success Story',
    metricBadge: { label: 'Inquiry Growth', value: '+240%' },
    category: 'LOCAL SEO & AI DISCOVERY',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85',
    coreProblem: 'A licensed mental health professional specializing in imposter syndrome and executive stress wanted to expand their private practice with high-intent private-pay clients, but relied solely on basic directory listings.',
    solutionTakeaways: [
      'Built empathy-focused specialty pages for Imposter Syndrome & Burnout, optimized with rich entity schema for AI engines (Perplexity, ChatGPT, Gemini).',
      'Integrated a seamless, HIPAA-compliant 1-click consultation scheduler and streamlined client intake workflow.',
      'Captured high-intent AI search demand, directly acquiring a new private-pay client who found the therapist via an AI search for "imposter syndrome specialist".'
    ],
    freeAuditorTieIn: 'Test your practice’s local search rank and AI search discoverability using our Free AI Website Auditor Tool.',
    ctaText: 'Read Full Practice Case Study →'
  },
  {
    id: 'q3-card-2',
    title: 'Significant Real Estate: Historic Decker Canyon Cottage PR Feature Yields +500% Traffic',
    cardType: 'Case Study',
    quarter: 'Q3 2026',
    quarterTag: 'Q3 2026 • Significant Real Estate PR',
    reputableSource: 'ET Digital Client Success Story',
    metricBadge: { label: 'Web Traffic Lift', value: '+500%' },
    category: 'PR & MEDIA STORYTELLING',
    imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=85',
    coreProblem: 'A real estate advisor secured a landmark listing in Decker Canyon — the historic rustic ranch cottage of "Malibu Millie" Decker, famous as the last of the Malibu hillbillies — but needed national editorial press reach beyond standard MLS distribution.',
    solutionTakeaways: [
      'Crafted a compelling architectural narrative celebrating the historic 1930s Decker Canyon ranch, its original knotty pine craftsmanship, redwood deck, and 7.8-acre mountain enclave.',
      'Executed targeted editorial PR pitching that secured an exclusive feature story in The Hollywood Reporter highlighting the property’s rich Malibu heritage.',
      'Captured viral national press traffic with an interactive virtual tour, driving massive inquiry volume and earning top-producing agent honors.'
    ],
    freeAuditorTieIn: 'Discover how effectively your high-ticket offerings capture and convert web traffic with our Free AI Website Auditor Tool.',
    ctaText: 'Read Full PR & Listing Case Study →'
  },
  {
    id: 'q3-card-3',
    title: 'Furniture Showroom Growth: Review Automation Drives 50% YoY Revenue',
    cardType: 'Case Study',
    quarter: 'Q3 2026',
    quarterTag: 'Q3 2026 • Furniture Gallery & Local CRM',
    reputableSource: 'ET Digital Client Success Story',
    metricBadge: { label: 'YoY Revenue Lift', value: '+50%' },
    category: 'REPUTATION & LOCAL CRM',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85',
    coreProblem: 'A manager at an Ethan Allen style high-end furniture gallery delivered top-tier white-glove customer service in-store but lacked an automated system to turn happy buyers into an active lead magnet.',
    solutionTakeaways: [
      'Designed an automated post-purchase SMS and email review collection loop triggering immediately after in-store design consultations.',
      'Optimized Google Business Profile with rich keyword-driven reviews, making customer praise the #1 local lead magnet for new furniture gallery walk-ins.',
      'Generated 50% year-over-year revenue growth and earned "Gallery of the Year" honors through local reputation dominance.'
    ],
    freeAuditorTieIn: 'Find out how your local business profile and review reputation rank against top competitors with our Free AI Website Auditor Tool.',
    ctaText: 'Read Full Showroom Case Study →'
  }
];

export default function InstagramFeedGrid({ onOpenBooking, onOpenCalendar }: InstagramFeedGridProps) {
  const [activeModalCard, setActiveModalCard] = useState<FeedCardItem | null>(null);
  const [isSocialHubOpen, setIsSocialHubOpen] = useState(false);

  const handleLaunchAuditor = () => {
    setActiveModalCard(null);
    const element = document.getElementById('growth-grader');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="instagram-feed" className="py-24 bg-slate-950 text-white relative overflow-hidden select-none border-b border-slate-900">
      {/* Background Cybernetic Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-brand-cyan/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Top Header Block */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-cyan-950/80 border border-brand-cyan/30 px-4 py-1.5 rounded-full mb-4 shadow-lg shadow-cyan-950/50">
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
            <span className="font-mono text-[11px] font-black uppercase tracking-widest text-brand-cyan">
              REAL CLIENT STORIES • PROVEN CASE STUDIES
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">
            Proven Client Case Studies
          </h2>

          <p className="font-sans text-slate-300 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto">
            In-depth case studies detailing how custom AI search optimization, strategic local PR, and review automation delivered measurable revenue and market authority for our clients.
          </p>
        </div>

        {/* 3 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {QUARTER_CARDS.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              onClick={() => setActiveModalCard(card)}
              className="group bg-slate-900/90 border border-slate-800 hover:border-brand-cyan/60 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl transition-all duration-300 hover:shadow-cyan-950/40 cursor-pointer select-none relative"
            >
              <div>
                {/* Scroll-stopping High-Res Photo Header */}
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  {/* Top Badge Overlay */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                    <span className="font-mono text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-md border shadow-lg bg-cyan-950/90 text-brand-cyan border-brand-cyan/40">
                      {card.cardType}
                    </span>

                    <span className="font-mono text-[9px] font-black text-white bg-slate-950/80 backdrop-blur-md border border-slate-700/80 px-2.5 py-1 rounded-md shadow-md">
                      {card.metricBadge.value}
                    </span>
                  </div>

                  {/* Category Tag on Photo */}
                  <div className="absolute bottom-3 left-3.5 right-3.5">
                    <span className="font-mono text-[8px] font-extrabold text-brand-cyan uppercase tracking-widest block mb-0.5">
                      {card.quarterTag}
                    </span>
                    <p className="font-sans text-[11px] font-bold text-slate-300 truncate">
                      {card.reputableSource}
                    </p>
                  </div>
                </div>

                {/* Card Text Content */}
                <div className="p-6 space-y-4">
                  <h3 className="font-display text-lg font-black text-white tracking-tight leading-snug group-hover:text-brand-cyan transition-colors">
                    {card.title}
                  </h3>

                  {/* Core Problem Teaser */}
                  <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-1">
                    <span className="font-mono text-[9px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> The Challenge
                    </span>
                    <p className="font-sans text-xs text-slate-300 leading-relaxed line-clamp-3 font-normal">
                      {card.coreProblem}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer with CTA */}
              <div className="p-6 pt-0 border-t border-slate-800/50 mt-2 flex items-center justify-between text-xs font-mono font-extrabold text-brand-cyan group-hover:translate-x-0.5 transition-transform">
                <span>{card.ctaText}</span>
                <ArrowUpRight className="w-4 h-4 text-brand-cyan" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Banner linking to Social Hub & Strategy Call */}
        <div className="max-w-3xl mx-auto text-center p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-cyan via-cyan-400 to-brand-cyan" />
          
          <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-brand-cyan bg-cyan-950/80 border border-brand-cyan/30 px-3.5 py-1.5 rounded-full inline-block mb-3">
            EXPLORE OUR DIGITAL CHANNELS
          </span>

          <h3 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-2">
            Stay Connected Across Channels
          </h3>

          <p className="font-sans text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-6 leading-relaxed font-normal">
            Follow ET Digital across our official social profiles for marketing breakdowns, quick tips, and direct business growth insights.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsSocialHubOpen(true)}
              className="w-full sm:w-auto group relative inline-flex items-center justify-center bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-xl active:scale-95 cursor-pointer"
            >
              <Share2 className="w-4 h-4 mr-2 text-slate-950" />
              <span>Connect @growwithetdigital</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-2 text-slate-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onOpenCalendar || onOpenBooking}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 font-display text-xs font-bold uppercase tracking-widest px-6 py-4 rounded-xl transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 mr-2 text-brand-cyan" />
              <span>Book Free Consultation</span>
            </button>
          </div>
        </div>

      </div>

      {/* IN-WEBSITE INTERACTIVE CARD DETAIL MODAL OVERLAY */}
      <AnimatePresence>
        {activeModalCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalCard(null)}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl"
            />

            {/* Modal Dialog Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalCard(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-950/80 border border-slate-700/80 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* High-Res Hero Image Banner */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                <img
                  src={activeModalCard.imageUrl}
                  alt={activeModalCard.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-lg backdrop-blur-md border shadow-md bg-cyan-950/90 text-brand-cyan border-brand-cyan/40">
                    {activeModalCard.cardType}
                  </span>

                  <span className="font-mono text-[10px] font-black text-white bg-slate-950/80 backdrop-blur-md border border-slate-700 px-3 py-1 rounded-lg shadow-md">
                    {activeModalCard.quarterTag}
                  </span>
                </div>

                <div className="absolute bottom-4 left-6 right-6">
                  <span className="font-mono text-[9px] font-bold text-brand-cyan uppercase tracking-widest block mb-1">
                    {activeModalCard.category}
                  </span>
                  <h2 className="font-display text-xl sm:text-2xl font-black text-white leading-snug">
                    {activeModalCard.title}
                  </h2>
                </div>
              </div>

              {/* Modal Body Content */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                
                {/* Source & Citation Banner */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-brand-cyan/30 flex items-center justify-center shrink-0 text-brand-cyan">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        Case Study Reference
                      </span>
                      <p className="font-sans text-xs sm:text-sm font-bold text-white">
                        {activeModalCard.reputableSource}
                      </p>
                    </div>
                  </div>

                  {activeModalCard.sourceUrl && (
                    <a
                      href={activeModalCard.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[10px] text-slate-400 hover:text-brand-cyan flex items-center gap-1 transition-colors underline decoration-slate-700 underline-offset-4"
                    >
                      <span>View Full Reference</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Core Problem Section */}
                <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-black uppercase tracking-wider">
                    <Zap className="w-4 h-4" />
                    <span>The Challenge & Opportunity</span>
                  </div>
                  <p className="font-sans text-sm text-slate-200 leading-relaxed">
                    {activeModalCard.coreProblem}
                  </p>
                </div>

                {/* ET Digital Solution & Strategic Takeaways */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-brand-cyan font-mono text-xs font-black uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Practical Solutions & Action Steps</span>
                  </div>

                  <ul className="space-y-2.5">
                    {activeModalCard.solutionTakeaways.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                        <Check className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Free Website Auditor Tool Tie-In (Key Lead Magnet Callout) */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/90 via-slate-950 to-cyan-950/90 border border-brand-cyan/40 space-y-4 shadow-xl">
                  <div className="flex items-center gap-2 text-brand-cyan font-mono text-xs font-black uppercase tracking-widest">
                    <Lightbulb className="w-4 h-4" />
                    <span>Test Your Own Website Instantly</span>
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {activeModalCard.freeAuditorTieIn}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      onClick={handleLaunchAuditor}
                      className="w-full sm:w-auto inline-flex items-center justify-center bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-xs font-black uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      <span>Run Free AI Website Audit</span>
                      <ArrowUpRight className="w-4 h-4 ml-1.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveModalCard(null);
                        if (onOpenCalendar) onOpenCalendar();
                        else if (onOpenBooking) onOpenBooking();
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-display text-xs font-bold uppercase tracking-widest px-5 py-3.5 rounded-xl transition-all cursor-pointer"
                    >
                      <span>Book Free Consultation</span>
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Social Linktree Modal */}
      <SocialLinktreeModal 
        isOpen={isSocialHubOpen} 
        onClose={() => setIsSocialHubOpen(false)} 
        onOpenBooking={() => {
          setIsSocialHubOpen(false);
          if (onOpenBooking) onOpenBooking();
        }}
        onOpenCalendar={() => {
          setIsSocialHubOpen(false);
          if (onOpenCalendar) onOpenCalendar();
          else if (onOpenBooking) onOpenBooking();
        }}
      />

    </section>
  );
}
