import React, { useState } from 'react';
import { 
  Sparkles, Check, Copy, TrendingUp, Lightbulb, 
  ArrowUpRight, BookOpen, Layers, Target, ShieldCheck, Zap
} from 'lucide-react';
import { WORKING_MARKETING_TIPS } from '../../data/marketingTips';
import { MarketingTip } from '../../types';

interface MarketingIntelFeedProps {
  onOpenBooking?: () => void;
  onTacticCopied?: (tacticTitle: string) => void;
  compact?: boolean;
}

export default function MarketingIntelFeed({
  onOpenBooking,
  onTacticCopied,
  compact = false
}: MarketingIntelFeedProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'AEO & AI Search', 'Short-Form Video', 'Local Authority', 'B2B & Inbound', 'CRO & Conversion'];

  const filteredTips = activeCategory === 'All' 
    ? WORKING_MARKETING_TIPS 
    : WORKING_MARKETING_TIPS.filter(tip => tip.category === activeCategory);

  const handleCopyTactic = (tip: MarketingTip) => {
    const text = `🔥 [ET DIGITAL GROWTH OS - TESTED MARKETING TACTIC]
📌 ${tip.title} (${tip.category})
💡 Core Tactic: ${tip.tactic}
📈 Expected Impact: ${tip.impactMetric}

📊 WHY IT WORKS (RESEARCH-BACKED):
${tip.whyItWorks}

⚡ STEP-BY-STEP ACTION PLAN:
${tip.stepByStep.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

👉 Source: ET Digital Growth Operating System (https://growwithetdigital.com)`;

    navigator.clipboard.writeText(text);
    setCopiedId(tip.id);
    if (onTacticCopied) {
      onTacticCopied(tip.title);
    }
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  return (
    <div className="space-y-6" id="marketing-intel-feed">
      {/* Category Pills Filter */}
      {!compact && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-brand-cyan text-slate-950 font-bold shadow-sm'
                  : 'bg-[var(--surface2)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--border)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid of Tested Tactics */}
      <div className={`grid gap-4.5 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {filteredTips.map((tip) => {
          const isCopied = copiedId === tip.id;
          return (
            <div 
              key={tip.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all group shadow-sm"
            >
              <div>
                {/* Header Tag & Category */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-brand-cyan/10 text-cyan-400 border border-cyan-500/20">
                    {tip.category}
                  </span>
                  <span className="font-mono text-[9px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                    {tip.impactMetric}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[var(--text)] group-hover:text-cyan-400 transition-colors tracking-tight leading-snug">
                  {tip.title}
                </h3>

                <div className="mt-2.5 p-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs font-semibold text-[var(--text)]">
                  <span className="text-[var(--muted)] font-mono text-[10px] block uppercase tracking-wider">
                    Execution Tactic:
                  </span>
                  {tip.tactic}
                </div>

                {/* Why It Works Research */}
                <div className="mt-3.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold mb-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Research Proof & Mechanism</span>
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    {tip.whyItWorks}
                  </p>
                </div>

                {/* Step by Step Action Plan */}
                <div className="mt-4 border-t border-[var(--border)] pt-3.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted)] font-bold mb-2">
                    Action Plan (In-Field Execution):
                  </div>
                  <ul className="space-y-1.5">
                    {tip.stepByStep.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[var(--text)] leading-normal">
                        <span className="font-mono text-[10px] font-bold text-cyan-400 shrink-0 mt-0.5">
                          0{idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer: Copy Tactic Action */}
              <div className="mt-5 pt-3.5 border-t border-[var(--border)] flex items-center justify-between gap-2">
                <span className="font-mono text-[9px] text-[var(--muted)] uppercase">
                  {tip.tag}
                </span>

                <button
                  type="button"
                  onClick={() => handleCopyTactic(tip)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    isCopied 
                      ? 'bg-emerald-500 text-slate-950 shadow-md scale-95' 
                      : 'bg-[var(--surface2)] hover:bg-cyan-950/40 text-[var(--text)] hover:text-cyan-300 border border-[var(--border)] hover:border-cyan-500/40'
                  }`}
                  title="Copy ready-to-use prompt & playbook"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied Playbook</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Tactic</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
