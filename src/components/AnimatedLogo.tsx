import React, { useRef, useState, useEffect } from 'react';

interface AnimatedLogoProps {
  className?: string;
  containerClassName?: string;
  showAura?: boolean;
  aspect?: 'square' | 'video' | 'auto';
  caption?: string;
}

export default function AnimatedLogo({
  className = '',
  containerClassName = '',
  showAura = false,
  aspect = 'square',
  caption
}: AnimatedLogoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    // Attempt playback when mounted or ref ready
    if (videoRef.current && !videoFailed) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented or stalled, fall back gracefully if needed
        });
      }
    }
  }, [videoFailed]);

  const aspectClass = aspect === 'square' ? 'aspect-square' : aspect === 'video' ? 'aspect-video' : '';

  return (
    <div className={`relative ${containerClassName}`}>
      {showAura && (
        <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-500/20 via-transparent to-blue-500/15 rounded-3xl blur-xl pointer-events-none" />
      )}

      <div
        className={`relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-800 bg-black w-full flex items-center justify-center ${aspectClass} ${className}`}
      >
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

      {caption && (
        <div className="pt-2 text-center">
          <span className="font-mono text-[10px] tracking-widest text-[var(--muted)] uppercase font-semibold">
            {caption}
          </span>
        </div>
      )}
    </div>
  );
}
