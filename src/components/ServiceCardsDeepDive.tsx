import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowUpRight, Search, FileText 
} from 'lucide-react';

export default function ServiceCardsDeepDive({ 
  onOpenBooking, 
  onOpenCalendar 
}: { 
  onOpenBooking: () => void; 
  onOpenCalendar?: () => void; 
}) {

  const services = [
    {
      title: 'SEO & Search Authority',
      valueFocus: 'SEO & AEO → Increase discoverability and attract qualified traffic.',
      subtitle: 'Traditional & AI Search Dominance',
      description: 'We position your brand at the absolute top of search queries and next-generation AI answer engines like ChatGPT, Gemini, and Perplexity. Our systems attract ready-to-buy prospects exactly when they search for solutions.',
      icon: Search,
      badge: 'Discovery',
      bullets: [
        'Strategic search query analysis',
        'AI Answer Engine optimization',
        'High-authority keyword mapping',
        'Direct local visibility systems'
      ]
    },
    {
      title: 'Content Marketing',
      valueFocus: 'Content Marketing → Build trust that drives long-term growth.',
      subtitle: 'Organic Authority Engine',
      description: 'Turn your institutional expertise into clean, authoritative digital assets. We construct structured, story-driven content matrices that capture organic attention and pre-nurture leads without posting noise.',
      icon: FileText,
      badge: 'Nurture',
      bullets: [
        'Founder raw-intelligence extraction',
        'High-authority pillar content',
        'Social media authority formats',
        'Audience engagement frameworks'
      ]
    }
  ];

  return (
    <section id="services" className="py-24 bg-slate-950 border-b border-slate-900/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(6,182,212,0.02)_0%,transparent_65%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-brand-cyan bg-cyan-950/40 border border-brand-cyan/20 px-3.5 py-1.5 rounded-full inline-block mb-4">
            Service Architecture
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
            Elite Service Execution
          </h2>
          <p className="font-sans text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Every client footprint is built on our rigorous, conversion-first operational standards. Explore our core implementation pillars.
          </p>
        </div>

        {/* Bento Grid of Service Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {services.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="group bg-slate-900/20 hover:bg-slate-900/50 border border-slate-900 hover:border-brand-cyan/25 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3 bg-slate-950 border border-slate-900 text-brand-cyan rounded-2xl shadow-sm group-hover:bg-brand-cyan group-hover:text-slate-950 group-hover:border-brand-cyan transition-colors duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-slate-950 border border-slate-900 px-2.5 py-1 rounded-full shadow-sm">
                      {svc.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-white mb-1 group-hover:text-brand-cyan transition-colors">
                    {svc.title}
                  </h3>
                  <div className="font-mono text-[10px] font-bold text-brand-cyan uppercase tracking-wider mb-2">
                    {svc.valueFocus}
                  </div>
                  <p className="font-sans text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-4">
                    {svc.subtitle}
                  </p>
                  
                  <p className="font-sans text-xs text-slate-400 leading-relaxed mb-6">
                    {svc.description}
                  </p>

                  <div className="border-t border-slate-900 pt-4 mb-6">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Scope of Work Includes:</span>
                    <ul className="space-y-1.5">
                      {svc.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan/60 shrink-0" />
                          <span className="truncate">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Micro-focused call to action */}
                <button
                  type="button"
                  onClick={onOpenCalendar || onOpenBooking}
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-mono text-[10px] font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                  id="service-booking-btn"
                >
                  Work with Us
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-950" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Custom scope / Inquiries callout with Let's Connect */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-slate-900/30 border border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-display text-sm sm:text-base font-bold text-white">
              Need a tailored growth scope or hybrid engagement?
            </h4>
            <p className="font-sans text-xs text-slate-400 mt-1">
              Have specific goals, multichannel questions, or unique timeline requirements? Send us a quick note.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenBooking}
            className="shrink-0 inline-flex items-center justify-center bg-slate-900 hover:bg-slate-850 text-white border border-slate-700 hover:border-slate-600 font-display text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all active:scale-95 cursor-pointer"
            id="services-connect-inquiry-btn"
          >
            <span>Let's Connect</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1.5 text-brand-cyan" />
          </button>
        </div>

      </div>
    </section>
  );
}
