import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, MessageSquare, ArrowUpRight } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  onOpenBooking?: () => void;
}

const faqItems: FAQItem[] = [
  {
    id: 1,
    question: "What is Google's AI Search (SGE) and how does it affect small businesses?",
    answer: "SGE stands for Search Generative Experience. It is Google's new AI system that answers customer questions directly at the very top of the screen, instead of just showing a list of links. For a small business, this means if Google's AI doesn't cite your website in its summary, customers may never scroll down to find you. We make sure your business is optimized so Google's AI and other assistants (like ChatGPT and Claude) actively recommend your services."
  },
  {
    id: 2,
    question: "How do we trace accurate marketing attribution in a cookieless environment?",
    answer: "Relying on old client-side tracking pixels will render you completely blind in 2026. We solve this by implementing Server-to-Server Conversions APIs (CAPI), setting up secure first-party data warehouses, and using marketing mix modeling (MMM). This shifts reporting from inaccurate browser cookies to server-authenticated conversions, ensuring complete funnel transparency."
  },
  {
    id: 3,
    question: "Is short-form video still the highest ROI content format?",
    answer: "Yes, but with a massive shift toward interactive, personalized, and AI-assisted content. In 2026, raw visibility is no longer enough. High-performance short-form videos now utilize instant interactive elements, direct checkout overlays, and tailored retargeting. This turns standard social impressions into instant product conversions."
  },
  {
    id: 4,
    question: "How can businesses utilize AI agents in their customer acquisition funnels?",
    answer: "AI agents are no longer just basic site chatbots; they are fully autonomous booking, qualification, and sales specialists. By integrating advanced natural language models with CRM databases, agents handle custom customer onboarding, real-time lead qualification, and automatic appointment scheduling 24/7, slasing customer acquisition friction."
  },
  {
    id: 5,
    question: "What is zero-party data and why is it vital for 2026 marketing campaigns?",
    answer: "Zero-party data is data that customers intentionally and proactively share with you (such as preferences, purchase intents, and product challenges). We capture this by designing highly engaging interactive quizzes, assessment tools, and diagnostic models, enabling highly targeted marketing without compromising privacy or violating policies."
  },
  {
    id: 6,
    question: "How do we combat ad fatigue on primary channels like Meta and TikTok?",
    answer: "The solution is structured Creative Testing Loops. The algorithm's distribution relies heavily on content quality and user engagement. We constantly deploy mini-concept variations (testing different hooks, visual pacing, and key benefits) and instantly scale winning formats before ad-fatigue sets in."
  },
  {
    id: 7,
    question: "How do we write website content that Google's AI and ChatGPT will actually recommend?",
    answer: "Instead of writing standard blog posts or filling pages with repetitive keywords, we write focused, question-and-answer-style content that answers actual customer inquiries with absolute clarity. We package this inside invisible code tags (called Schema markup) so that when search engine bots crawl your site, they instantly understand your services and cite your business as the ultimate local authority."
  },
  {
    id: 8,
    question: "How does local search optimize for voice and visual search engines?",
    answer: "Voice and visual queries are highly conversational and context-driven. To optimize, we focus on descriptive structured text, optimize raw visual images with schema metadata, and ensure business directories contain precise local parameters. This guarantees visibility in natural dialogue and camera-based search engines."
  },
  {
    id: 9,
    question: "Can email marketing still compete with social channels for ROI?",
    answer: "In 2026, email remains the highest-ROI channel because you completely own the audience. By shifting away from generic newsletters and deploying event-driven flows, we convert inactive subscribers based on real-time site behaviors, creating consistent, automated revenue."
  },
  {
    id: 10,
    question: "What separates ET Digital's Growth Operating System from traditional marketing?",
    answer: "Traditional agencies deliver vague vanity reports like 'clicks' and 'impressions' and charge heavy flat retainers. ET Digital designs custom growth machines. We align our strategies directly with revenue growth, scale customer pipelines, and implement advanced technologies so your business scales with true efficiency."
  }
];

export default function FAQSection({ onOpenBooking }: FAQSectionProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleItem = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="relative py-24 sm:py-32 bg-slate-950 overflow-hidden border-b border-white/[0.02]">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-cyan/[0.015] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-left">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-brand-cyan bg-cyan-950/40 border border-brand-cyan/20 px-3.5 py-1.5 rounded-full inline-block mb-4">
            Answers & Intelligence
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="font-sans text-sm text-slate-400">
            The top 10 questions regarding digital marketing in 2026 answered with clarity, precision, and strategic foresight.
          </p>
        </div>

        {/* Accordion Questions List */}
        <div className="flex flex-col gap-4">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div 
                key={item.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'bg-slate-900 border-brand-cyan/25' 
                    : 'bg-slate-900/30 border-white/[0.04] hover:border-white/10'
                }`}
              >
                {/* Accordion Trigger Header Button */}
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full flex items-center justify-between p-6 sm:p-7 text-left font-display font-bold text-sm sm:text-base text-white hover:text-brand-cyan transition-colors cursor-pointer select-none gap-4"
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-xs text-brand-cyan/50 font-normal">0{item.id}.</span>
                    {item.question}
                  </span>
                  
                  <span className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-brand-cyan/10 text-brand-cyan' : 'text-slate-400'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                {/* Animated Collapsible Answer Content panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-6 sm:px-7 sm:pb-7 font-sans text-xs sm:text-sm text-slate-300 leading-relaxed font-light border-t border-white/[0.03] pt-4">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Still have questions banner with Let's Connect */}
        {onOpenBooking && (
          <div className="mt-12 p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-brand-cyan/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-left shadow-xl">
            <div className="space-y-1.5 max-w-xl">
              <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-brand-cyan">
                Direct Strategy Access
              </span>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
                Have a question not answered here?
              </h3>
              <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
                Every business has unique growth roadblocks. Reach out directly through our quick inquiry form and we'll reply with clear, practical guidance.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenBooking}
              className="group shrink-0 inline-flex items-center justify-center bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-xs font-black uppercase tracking-widest px-7 py-4 rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer shadow-cyan-950/40"
              id="faq-connect-cta-btn"
            >
              <span className="flex items-center gap-2">
                Let's Connect
                <ArrowUpRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
