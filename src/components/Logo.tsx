import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
}

export default function Logo({ className = "h-9", showWordmark = true }: LogoProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      className="flex flex-col items-center justify-center select-none group cursor-pointer shrink-0" 
      id="et-digital-logo-stacked"
    >
      {!imageError ? (
        <div className="flex flex-col items-center">
          <img
            src="https://res.cloudinary.com/dnpvgq7gt/image/upload/v1783013238/IMG_6170_pgtrij.png"
            alt="ET Digital Logo"
            className={`${className} w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03] block`}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
          {showWordmark && (
            <span className="font-display text-[8px] font-black uppercase tracking-[0.25em] text-slate-900 dark:text-white leading-none mt-1 text-center pl-0.5">
              DIGITAL
            </span>
          )}
        </div>
      ) : (
        /* Bulletproof fallback: Sleek modern corporate logo mark and centered wordmark */
        <div className="flex flex-col items-center">
          <div className="h-7 w-8 rounded-lg bg-gradient-to-tr from-brand-cyan to-cyan-500 p-[1.5px] shadow-sm">
            <div className="w-full h-full rounded-[6px] bg-slate-950 flex items-center justify-center">
              <span className="font-display font-black text-[11px] text-brand-cyan tracking-tighter leading-none">
                ET
              </span>
            </div>
          </div>
          {showWordmark && (
            <span className="font-display text-[8px] font-black uppercase tracking-[0.25em] text-slate-900 dark:text-white leading-none mt-1 text-center pl-0.5">
              DIGITAL
            </span>
          )}
        </div>
      )}
    </div>
  );
}
