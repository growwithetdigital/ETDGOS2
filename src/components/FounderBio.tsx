import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ShieldCheck, ArrowUpRight, Sparkles } from 'lucide-react';

interface FounderBioProps {
  onOpenBooking?: () => void;
}

export default function FounderBio({ onOpenBooking }: FounderBioProps) {
  const [imageError, setImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Cloudinary premium founder portrait link
  const headshotUrl = "https://res.cloudinary.com/dnpvgq7gt/image/upload/v1782938581/IMG_6392_bppodq.png";

  return (
    <section id="about" className="py-24 bg-white border-b border-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-80 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
          
          {/* Left Panel: Presentation Framework Housing the Headshot Image (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/5] w-full bg-slate-50 rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-3"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent pointer-events-none z-10 rounded-3xl" />
              
              {/* Inner framing details */}
              <div className="absolute top-6 left-6 z-20 bg-slate-900/95 backdrop-blur border border-slate-850 px-3.5 py-1.5 rounded-full text-[9px] font-mono font-bold text-slate-100 uppercase tracking-widest shadow-sm">
                Founder & Growth Strategist
              </div>
              
              <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end text-white">
                <div>
                  <h4 className="font-display text-lg font-bold tracking-tight text-white drop-shadow-md">Eric Thomas</h4>
                  <p className="font-mono text-[10px] text-slate-200 drop-shadow-sm uppercase tracking-wider">ET Digital Growth Operating Systems™</p>
                </div>
              </div>

              {/* Headshot Image with robust error handling to custom visual vector placeholder */}
              {!imageError ? (
                <img
                  src={headshotUrl}
                  alt="Eric Thomas Founder Headshot"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-500 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              ) : (
                /* Sophisticated fallback illustration if the direct drive link gets cookie-blocked in sandboxed iframe */
                <div className="w-full h-full bg-slate-950 flex flex-col justify-between p-8 text-white relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.15)_0%,transparent_60%)]" />
                  
                  <div className="pt-12">
                    <span className="font-mono text-[9px] text-brand-cyan uppercase tracking-[0.2em] font-bold block mb-2">
                      ET Digital
                    </span>
                    <h3 className="font-display text-2xl font-black tracking-tight leading-tight">
                      Eric Thomas
                    </h3>
                    <p className="font-mono text-xs text-slate-400 mt-1 uppercase">
                      Founder & Growth Strategist
                    </p>
                  </div>
                  
                  <div className="border-t border-slate-800 pt-6">
                    <p className="font-sans text-xs text-slate-400 leading-relaxed mb-4">
                      Portrait securely connected inside ET Digital G-Workspace.
                    </p>
                    <div className="flex items-center gap-2 text-brand-cyan font-mono text-[9px] uppercase tracking-wider font-bold">
                      <ShieldCheck className="w-4 h-4 animate-pulse" />
                      Encrypted Connection Active
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
            
            {/* Elegant decorative background accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-cyan/5 rounded-full blur-2xl pointer-events-none -z-10" />
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-slate-50 rounded-3xl border border-slate-100 -z-10" />
          </div>

          {/* Right Panel: Content Copy and Interactive Links (7 Cols) */}
          <div className="lg:col-span-7 text-left flex flex-col gap-6">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-brand-cyan bg-cyan-50 border border-brand-cyan/10 px-3.5 py-1.5 rounded-full inline-block self-start">
              Meet the Founder
            </span>
            
            <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Eric Thomas
            </h2>
            <p className="font-mono text-xs text-slate-500 font-bold uppercase tracking-wider -mt-4">
              Founder & Growth Strategist
            </p>

            {/* Dynamic Expansion with Framer Motion for Smooth Editorial Read */}
            <motion.div 
              layout="position"
              className="space-y-5 font-sans text-sm sm:text-base text-slate-600 leading-relaxed"
            >
              {!isExpanded ? (
                /* HOMEPAGE ABOUT (SHORT VERSION) */
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <p className="font-sans text-base text-slate-900 font-semibold leading-relaxed">
                    With over 20+ years of marketing experience, Eric Thomas helps brands simplify their marketing, improve customer engagement, and generate measurable business growth through custom-built systems.
                  </p>
                  <p>
                    His strategic expertise focuses on driving modern business growth by combining senior leadership, creative problem-solving, and advanced AI adoption. By replacing fragmented tactics with unified marketing systems, he guides brands to establish sustainable market authority.
                  </p>
                  <p>
                    Eric began his career in journalism, broadcast media, and digital marketing, with early experience at FOX and NBC. His campaigns have been tied to premium global publications including The Wall Street Journal, Robb Report, and Financial Times.
                  </p>
                </motion.div>
              ) : (
                /* FULL ABOUT PAGE CONTENT */
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <p className="font-sans text-base text-slate-900 font-semibold leading-relaxed">
                    With over 20+ years of marketing experience, Eric Thomas helps brands simplify their marketing, improve customer engagement, and generate measurable business growth through custom-built systems.
                  </p>
                  <p>
                    His strategic expertise focuses on driving modern business growth by combining senior leadership, creative problem-solving, and advanced AI adoption. By replacing fragmented tactics with unified marketing systems, he guides brands to establish sustainable market authority.
                  </p>
                  <p>
                    He began his career in journalism, where he developed a foundation in storytelling, editorial precision, and audience engagement. That experience shaped a long-term approach to marketing built on clarity, narrative discipline, and performance accountability.
                  </p>
                  <p>
                    Over the course of his career, Eric has led and supported digital marketing initiatives across real estate, media, and luxury-facing industries. His work spans campaigns for listings and clients ranging from first-time buyers to multimillion-dollar estates exceeding $100M in value. He has developed lifecycle email systems, digital campaign frameworks, content strategies, and audience development programs focused on both engagement and conversion.
                  </p>
                  <p>
                    His professional background also includes early experience in broadcast media, with internships at FOX and NBC, where he gained exposure to production workflows, audience development, and high-volume storytelling environments.
                  </p>
                  <p>
                    In addition, his work has intersected with marketing campaigns and placements connected to leading publications including The Wall Street Journal, Robb Report, and Financial Times.
                  </p>
                  <p>
                    Across all of his work, Eric’s focus has remained consistent: building marketing systems that combine storytelling with structure—ensuring brands are not only seen, but understood and acted upon.
                  </p>
                  <p>
                    Today, through ET Digital, he works with professionals and organizations seeking to bring clarity to their messaging, structure to their marketing operations, and consistency to their growth systems.
                  </p>
                  <p>
                    He is based in the Santa Monica Mountains, where time outdoors provides balance to a fast-moving professional life. He is a father of two teenagers and shares his home with a rescue Belgian Malinois.
                  </p>

                  <div className="pt-5 border-l-2 border-brand-cyan/80 pl-4 italic text-slate-800 text-sm md:text-base font-semibold">
                    “Clarity scales. Everything else is noise.”
                    <span className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mt-2 not-italic">— Eric Thomas</span>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3.5 pt-4 border-t border-slate-100">
              {!isExpanded ? (
                <>
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-850 text-white font-display text-xs font-extrabold uppercase tracking-widest px-7 py-4 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Learn More
                  </button>

                  {onOpenBooking && (
                    <button
                      type="button"
                      onClick={onOpenBooking}
                      className="group inline-flex items-center justify-center bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-xs font-extrabold uppercase tracking-widest px-7 py-4 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                      id="founder-connect-cta-btn"
                    >
                      <span className="flex items-center gap-1.5">
                        Let's Connect
                        <ArrowUpRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </span>
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsExpanded(false);
                      const element = document.getElementById('about');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-display text-xs font-extrabold uppercase tracking-widest px-6 py-4 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    Show Less
                  </button>

                  {onOpenBooking && (
                    <button
                      type="button"
                      onClick={onOpenBooking}
                      className="group inline-flex items-center justify-center bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-xs font-extrabold uppercase tracking-widest px-7 py-4 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                      id="founder-expanded-connect-btn"
                    >
                      <span className="flex items-center gap-1.5">
                        Let's Connect
                        <ArrowUpRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </span>
                    </button>
                  )}

                  <a
                    href="mailto:hello@growwithetdigital.com?subject=Re%3A%20Let's%20Connect"
                    className="group inline-flex items-center justify-center bg-slate-900 hover:bg-slate-850 text-white font-display text-xs font-extrabold uppercase tracking-widest px-7 py-4 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Mail className="w-4 h-4 mr-2 text-brand-cyan" />
                    Email Eric Directly
                  </a>
                </>
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
