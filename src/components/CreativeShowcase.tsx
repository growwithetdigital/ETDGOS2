import React from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, Check, Smartphone, Film, Fingerprint, Layers } from 'lucide-react';

export default function CreativeShowcase() {
  return (
    <section id="creative-showcase" className="py-24 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200/60 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Centered Creative copy and value system */}
        <div className="flex flex-col items-center text-center gap-6 max-w-4xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-brand-cyan bg-cyan-50 border border-cyan-100/80 px-3.5 py-1.5 rounded-full inline-block">
            High-Fidelity Branding
          </span>
          
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Creative Storytelling and Branding
          </h2>
          
          <p className="font-sans text-base text-slate-600 leading-relaxed max-w-3xl">
            We reject dry, technical data-dumping as much as we reject unstructured, flowery prose. Real authority is built at the perfect intersection of rigorous quantitative strategy and elite, narrative-driven design.
          </p>

          <p className="font-sans text-base text-slate-600 leading-relaxed max-w-3xl">
            Every video, pillar asset, landing page structure, and design module we engineer is crafted to arrest attention, establish unquestionable market dominance, and drive ready-to-buy executive conversions.
          </p>

          {/* Micro value tags centered */}
          <div className="flex flex-wrap justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-cyan-50 text-brand-cyan">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="font-sans text-xs font-bold text-slate-700">Artistic Rigor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-cyan-50 text-brand-cyan">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="font-sans text-xs font-bold text-slate-700">Strategic Alignment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-cyan-50 text-brand-cyan">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="font-sans text-xs font-bold text-slate-700">Zero Agency Fluff</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-cyan-50 text-brand-cyan">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="font-sans text-xs font-bold text-slate-700">Conversion Focused</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
