import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Quote, Star, TrendingUp, CheckCircle } from 'lucide-react';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
  metric: string;
  metricLabel: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "ET Digital didn't just run ads—they redesigned our entire digital growth ecosystem. We replaced an expensive retainer with an agency that delivers actual, compounding revenue pipelines.",
    author: "Sarah Jenkins",
    role: "VP of Global Marketing",
    company: "Aether Technologies",
    metric: "+342%",
    metricLabel: "Inbound Pipeline Growth",
    rating: 5
  },
  {
    id: 2,
    quote: "Working with them felt like adding an elite growth team to our roster overnight. Their integration of AI-driven conversion engines transformed our customer acquisition costs.",
    author: "David Vance",
    role: "Chief Growth Officer",
    company: "Novis Logistics",
    metric: "-47%",
    metricLabel: "Customer Acquisition Cost",
    rating: 5
  },
  {
    id: 3,
    quote: "Their tactical strategy outperforms any of the global holding agencies we used before. If you want hyper-scaled client acquisition with radical attribution clarity, ET Digital is the gold standard.",
    author: "Elena Rostova",
    role: "Head of Digital Strategy",
    company: "Veloce Financial Partners",
    metric: "14.2x",
    metricLabel: "Average Blended ROAS",
    rating: 5
  }
];

export default function ClientTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0
    })
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section id="testimonials" className="relative py-24 sm:py-32 bg-slate-950 overflow-hidden border-b border-white/[0.02]">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-cyan/[0.02] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-brand-cyan bg-cyan-950/40 border border-brand-cyan/20 px-3.5 py-1.5 rounded-full inline-block mb-4">
            Validation & Proof
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Engineered For Performance
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-400">
            Real enterprise feedback from business leaders who chose measurable metrics over agency vanity slide-decks.
          </p>
        </div>

        {/* Testimonials Slider Area */}
        <div className="relative max-w-5xl mx-auto bg-slate-900/40 border border-white/[0.05] rounded-3xl p-8 sm:p-12 md:p-16 backdrop-blur-md shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)]">
          
          {/* Big Quote Watermark */}
          <Quote className="absolute top-6 left-6 sm:top-10 sm:left-10 w-24 h-24 text-white/[0.02] pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center min-h-[300px]">
            
            {/* Left side: Performance Metric Indicator */}
            <div className="md:col-span-4 flex flex-col justify-center items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-white/5 pb-8 md:pb-0 md:pr-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/40 border border-brand-cyan/20 rounded-full mb-3">
                <TrendingUp className="w-3 h-3 text-brand-cyan" />
                <span className="font-mono text-[9px] font-bold text-brand-cyan uppercase tracking-wider">ET Verified Growth</span>
              </div>
              <div className="font-display text-5xl sm:text-6xl font-black text-brand-cyan tracking-tight mb-2">
                {current.metric}
              </div>
              <div className="font-sans text-xs sm:text-sm text-slate-300 font-medium">
                {current.metricLabel}
              </div>
            </div>

            {/* Right side: Author feedback slider */}
            <div className="md:col-span-8 flex flex-col justify-between h-full relative overflow-hidden">
              <div className="min-h-[160px] flex items-center">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full text-left"
                  >
                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-5">
                      {[...Array(current.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-brand-cyan text-brand-cyan" />
                      ))}
                    </div>

                    {/* Actual Quote */}
                    <p className="font-sans text-base sm:text-lg md:text-xl text-slate-100 font-light leading-relaxed mb-6 italic">
                      "{current.quote}"
                    </p>

                    {/* Author Meta */}
                    <div>
                      <h4 className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
                        {current.author}
                      </h4>
                      <p className="font-sans text-xs text-slate-400">
                        {current.role} &mdash; <span className="text-brand-cyan/90 font-medium">{current.company}</span>
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slider Navigation & Indicators */}
              <div className="flex items-center justify-between mt-8 border-t border-white/5 pt-6">
                
                {/* Dots */}
                <div className="flex items-center gap-2">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setDirection(idx > currentIndex ? 1 : -1);
                        setCurrentIndex(idx);
                      }}
                      className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                        idx === currentIndex ? 'w-6 bg-brand-cyan' : 'w-1.5 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Arrow Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrev}
                    className="w-10 h-10 rounded-full border border-white/10 hover:border-brand-cyan/30 hover:bg-white/[0.03] text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                    aria-label="Previous testimonial"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full border border-white/10 hover:border-brand-cyan/30 hover:bg-white/[0.03] text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                    aria-label="Next testimonial"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
