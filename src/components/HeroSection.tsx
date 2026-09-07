import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

export default function HeroSection({ onOpenBooking }: { onOpenBooking: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force mobile WebKit / iOS Safari autoplay compliance
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.loop = true;
    video.autoplay = true;

    const playVideo = () => {
      if (video.paused) {
        video.play().catch(() => {
          // Retry playback on user interaction if mobile browser strictly restricts initial autoplay
        });
      }
    };

    // Attempt immediate playback
    playVideo();

    // Auto-resume playback on tab visibility change or window focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        playVideo();
      }
    };

    // Auto-resume on first mobile touch if initially blocked by low-power mode
    const handleFirstTouch = () => {
      playVideo();
      window.removeEventListener('touchstart', handleFirstTouch);
      window.removeEventListener('click', handleFirstTouch);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', playVideo);
    window.addEventListener('touchstart', handleFirstTouch, { passive: true });
    window.addEventListener('click', handleFirstTouch, { passive: true });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', playVideo);
      window.removeEventListener('touchstart', handleFirstTouch);
      window.removeEventListener('click', handleFirstTouch);
    };
  }, []);

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex flex-col md:flex-row bg-[#111111] overflow-hidden select-none border-b border-white/[0.02]"
      style={{
        background: 'radial-gradient(circle at 60% 50%, #222222 0%, #111111 100%)'
      }}
    >
      {/* Ambient background lightings */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-cyan/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-slate-500/[0.02] rounded-full blur-[140px] pointer-events-none" />

      {/* Split Layout Container */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between relative z-10 min-h-screen pt-28 pb-12 md:py-0">
        
        {/* Left Side: Marketing Copy (Vertically Centered) */}
        <div className="w-full md:w-[48%] flex flex-col justify-center py-6 md:py-12 text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-mono text-[10px] font-extrabold uppercase tracking-[0.25em] text-brand-cyan bg-cyan-950/40 border border-brand-cyan/20 px-3.5 py-1.5 rounded-full inline-block mb-6">
              ET Digital Growth Operating Systems™
            </span>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.08] mb-6">
              Grow With <span className="text-brand-cyan whitespace-nowrap">ET Digital</span>
            </h1>

            <p className="font-sans text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed mb-8 max-w-xl">
              Helping businesses engage audiences, convert more customers, and grow through strategic digital marketing powered by creativity, AI, and measurable results.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={onOpenBooking}
                className="group relative inline-flex items-center justify-center bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-[11px] font-black uppercase tracking-widest px-7 py-4 rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer shadow-cyan-950/40"
                id="hero-playbook-cta-btn"
              >
                <span className="relative z-10 flex items-center gap-2">
                  LET'S CONNECT
                  <ArrowUpRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </button>

              <button
                onClick={() => handleScrollTo('services')}
                className="group inline-flex items-center justify-center bg-transparent hover:bg-white/[0.03] border border-white/10 hover:border-brand-cyan/30 text-white font-display text-[11px] font-black uppercase tracking-widest px-7 py-4 rounded-xl transition-all active:scale-95 cursor-pointer"
                id="hero-services-cta-btn"
              >
                Explore Services
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Logo Animation (Vertically Centered & Lowered) */}
        <div className="w-full md:w-[52%] flex items-center justify-center pt-8 pb-10 md:pt-14 md:pb-6 relative min-h-[40vh] md:min-h-0">
          <motion.div
            className="w-full relative flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Glow Behind Animation */}
            <div className="absolute w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-brand-cyan/[0.04] rounded-full blur-[100px] pointer-events-none" />

            {/* Clean square logo container with rounded corners - no dark borders */}
            <div className="relative w-full aspect-square max-w-[340px] sm:max-w-[380px] lg:max-w-[430px] rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl shadow-cyan-950/40 bg-[#111111]">
              
              {!videoFailed ? (
                /* Native HTML5 Video rendering edge-to-edge with seamless mobile loop & autoplay */
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  onEnded={() => {
                    // Fail-safe manual loop restart for mobile browsers
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                      videoRef.current.play().catch(() => {});
                    }
                  }}
                  onError={() => setVideoFailed(true)}
                  className="w-full h-full object-cover pointer-events-none select-none rounded-3xl"
                >
                  <source 
                    src="https://res.cloudinary.com/dnpvgq7gt/video/upload/q_auto,vc_auto/Here_is_my_logo._instructions_202606260400_woxxvs.mp4" 
                    type="video/mp4" 
                  />
                  <source 
                    src="https://res.cloudinary.com/dnpvgq7gt/video/upload/Here_is_my_logo._instructions_202606260400_woxxvs.mp4" 
                    type="video/mp4" 
                  />
                  <source 
                    src="https://res.cloudinary.com/dnpvgq7gt/video/upload/Here_is_my_logo._instructions_202606260400_woxxvs.webm" 
                    type="video/webm" 
                  />
                </video>
              ) : (
                /* High-performance animated / interactive fallback */
                <img
                  src="https://res.cloudinary.com/dnpvgq7gt/image/upload/f_auto,q_auto/Here_is_my_logo._instructions_202606260400_woxxvs.gif"
                  alt="ET Digital Brand Logo Animation"
                  className="w-full h-full object-cover rounded-3xl select-none pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            {/* ENGAGE.CONVERT.GROW. Tagline */}
            <div className="mt-5 flex items-center font-mono text-[9px] tracking-[0.25em] font-black uppercase select-none whitespace-nowrap">
              <span className="text-white">ENGAGE.</span>
              <span className="text-white">CONVERT.</span>
              <span className="text-brand-cyan">GROW.</span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
