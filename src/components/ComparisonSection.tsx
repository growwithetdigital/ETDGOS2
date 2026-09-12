import React from 'react';
import { 
  AlertTriangle, XCircle, CheckCircle2, ArrowUpRight, 
  Sparkles, Layers, Activity, Database, Cpu, Unlink, TrendingUp
} from 'lucide-react';

interface ComparisonSectionProps {
  onOpenBooking?: () => void;
}

export default function ComparisonSection({ onOpenBooking }: ComparisonSectionProps) {
  const comparisons = [
    {
      dimension: 'Strategic Foundations',
      legacy: {
        title: 'Random Acts of Content',
        desc: 'Unstructured blog posts and generic social media blurbs written without topical cluster authority or alignment to your revenue goals.'
      },
      gos: {
        title: 'Centralized Knowledge DNA',
        desc: 'One centralized strategic Knowledge Base codifying your pricing philosophy, niche expertise, and closing arguments into every touchpoint.'
      }
    },
    {
      dimension: 'Search & Discoverability',
      legacy: {
        title: 'Outdated Keyword Stuffing',
        desc: 'Traditional SEO practices completely blind to Google AI Overviews, Perplexity answers, and modern conversational intent.'
      },
      gos: {
        title: 'AI Search & SGE Authority',
        desc: 'Structured schema and topical entity mapping engineered to be actively recommended by Google AI, ChatGPT, and generative engines.'
      }
    },
    {
      dimension: 'Tool & Data Architecture',
      legacy: {
        title: '7+ Disconnected SaaS Logins',
        desc: 'Fragmented platforms and siloed spreadsheets resulting in operational leakage, slow responses, and manual friction.'
      },
      gos: {
        title: 'Centralized Growth OS Canvas',
        desc: 'Unified operational whiteboard synchronizing milestone roadmaps, live lead pipelines, content matrices, and analytics.'
      }
    },
    {
      dimension: 'Reporting & Attribution',
      legacy: {
        title: 'Black-Box Vanity Metrics',
        desc: 'Monthly decks boasting clicks and raw impressions with zero accountability for pipeline velocity or closed revenue.'
      },
      gos: {
        title: 'Closed-Loop Pipeline Attribution',
        desc: 'Server-authenticated tracking demonstrating exactly which search queries and pillar assets produce qualified inquiries and retainers.'
      }
    }
  ];

  return (
    <section 
      id="philosophy" 
      className="py-24 bg-slate-950 text-white relative overflow-hidden border-t border-b border-slate-850"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-red-950/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-brand-cyan/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">
        
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] font-extrabold uppercase tracking-[0.25em] text-brand-cyan bg-cyan-950/40 border border-brand-cyan/20 px-3.5 py-1.5 rounded-full">
            <span>The Agency Break // Structural Contrast</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white leading-tight">
            Traditional Marketing Agencies Are Broken. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-cyan-300 to-teal-200">
              Enter The Growth Operating System™.
            </span>
          </h2>
          
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed font-sans">
            High-ticket firms are abandoning fragmented billable hours and chaotic tool stacks for an engineered, centralized inbound growth engine.
          </p>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* LEFT: Legacy Agencies */}
          <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/50 border border-red-500/20 shadow-xl flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-red-500/20">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-red-400">
                  The Old Way: Traditional Agencies
                </h3>
              </div>
              <span className="text-[10px] font-mono text-red-400 bg-red-950/40 border border-red-500/30 px-2 py-0.5 rounded">
                High Churn · Low Attribution
              </span>
            </div>

            <div className="space-y-6">
              {comparisons.map((c, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center gap-2 text-red-400 text-xs font-mono font-bold uppercase">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{c.legacy.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-6">
                    {c.legacy.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center text-[11px] font-mono text-red-400/80">
              Result: Disconnected tactics, high retainer fees, zero system ownership.
            </div>
          </div>

          {/* RIGHT: ET Digital Growth OS */}
          <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/80 border border-brand-cyan/40 shadow-2xl shadow-cyan-950/40 flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-cyan/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-brand-cyan/30 relative z-10">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan animate-pulse" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-brand-cyan">
                  The ET Digital Growth OS Model
                </h3>
              </div>
              <span className="text-[10px] font-mono text-brand-cyan bg-cyan-950/60 border border-brand-cyan/40 px-2.5 py-0.5 rounded-full font-bold">
                Predictable Growth · Proven ROI
              </span>
            </div>

            <div className="space-y-6 relative z-10">
              {comparisons.map((c, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-950/90 border border-brand-cyan/20 space-y-1.5 hover:border-brand-cyan/40 transition-colors">
                  <div className="flex items-center gap-2 text-brand-cyan text-xs font-mono font-bold uppercase">
                    <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                    <span>{c.gos.title}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-6">
                    {c.gos.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center text-[11px] font-mono text-brand-cyan relative z-10 font-bold">
              Result: Permanent digital asset ownership, qualified inbound intake, repeatable revenue.
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="pt-4 text-center">
          <button
            type="button"
            onClick={onOpenBooking}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-cyan-950/40 active:scale-95 cursor-pointer"
          >
            <span>Retire The Agency Model // Connect With Us</span>
            <ArrowUpRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>

      </div>
    </section>
  );
}
