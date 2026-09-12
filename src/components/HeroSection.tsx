import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface HeroSectionProps {
  onOpenBooking: () => void;
}

export default function HeroSection({ onOpenBooking }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  // Mobile video autoplay fail-safe
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.loop = true;
    video.autoplay = true;

    const playVideo = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };

    playVideo();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') playVideo();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center pt-28 pb-20 overflow-hidden bg-slate-950 text-white select-none"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-cyan/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-cyan-900/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan" />
              </span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-300">
                ET DIGITAL <span className="text-slate-600">|</span> <span className="text-brand-cyan">GROWTH OPERATING SYSTEMS™</span>
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white leading-[1.08]">
                Grow with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-cyan-300 to-teal-200">
                  ET Digital
                </span>
              </h1>
            </div>

            {/* Subtitle / Positioning Copy */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-sans font-normal">
              Helping businesses engage, convert, and grow with modern digital marketing systems. We build high-converting websites, execute targeted campaigns, and implement AI-powered strategies to scale your revenue.
            </p>

            {/* Top Two CTA Buttons: Schedule Discovery Call & Explore Services */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onOpenBooking}
                className="group relative inline-flex items-center justify-center px-8 py-4 rounded-xl bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-xl shadow-cyan-950/40 active:scale-95 cursor-pointer overflow-hidden"
                id="hero-primary-cta"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>Schedule Discovery Call</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleScrollTo('services')}
                className="group inline-flex items-center justify-center px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-white font-display text-xs font-bold uppercase tracking-widest transition-all duration-300 active:scale-95 cursor-pointer"
                id="hero-explore-services-btn"
              >
                <span className="flex items-center gap-2">
                  <span>Explore Services</span>
                </span>
              </button>
            </div>

          </div>

          {/* Right Hero Video & Brand Animated Logo (5 Cols) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-[420px]">
              
              {/* Subtle Aura glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-brand-cyan/20 via-transparent to-teal-500/15 rounded-3xl blur-2xl pointer-events-none" />

              {/* Animated Logo Container with Poster & Cellular Optimization */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/80 border border-slate-800 bg-black aspect-square w-full flex items-center justify-center">
                {!videoFailed ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="https://res.cloudinary.com/dnpvgq7gt/video/upload/so_0,f_auto,q_auto:eco,w_600/Here_is_my_logo._instructions_202606260400_woxxvs.jpg"
                    disablePictureInPicture
                    onEnded={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = 0;
                        videoRef.current.play().catch(() => {});
                      }
                    }}
                    onError={() => setVideoFailed(true)}
                    className="w-full h-full object-cover select-none pointer-events-none"
                  >
                    <source
                      src="https://res.cloudinary.com/dnpvgq7gt/video/upload/q_auto:good,vc_auto,w_600/Here_is_my_logo._instructions_202606260400_woxxvs.mp4"
                      type="video/mp4"
                    />
                    <source
                      src="https://res.cloudinary.com/dnpvgq7gt/video/upload/q_auto,vc_auto/Here_is_my_logo._instructions_202606260400_woxxvs.mp4"
                      type="video/mp4"
                    />
                    <source
                      src="https://res.cloudinary.com/dnpvgq7gt/video/upload/Here_is_my_logo._instructions_202606260400_woxxvs.mp4"
                      type="video/mp4"
                    />
                  </video>
                ) : (
                  <img
                    src="https://res.cloudinary.com/dnpvgq7gt/image/upload/f_auto,q_auto,w_600/Here_is_my_logo._instructions_202606260400_woxxvs.gif"
                    alt="ET Digital Brand Logo Animation"
                    className="w-full h-full object-cover select-none pointer-events-none"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
