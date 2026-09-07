import React, { useState } from 'react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "h-14" }: LogoProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`flex items-center gap-2.5 select-none group cursor-pointer ${className}`} id="et-digital-logo">
      {!imageError ? (
        <img
          src="https://res.cloudinary.com/dnpvgq7gt/image/upload/v1783013238/IMG_6170_pgtrij.png"
          alt="ET Digital Logo"
          className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
        />
      ) : (
        /* Bulletproof fallback: Sleek modern corporate logo mark and typography */
        <div className="flex items-center gap-2 h-8">
          <div className="h-full aspect-square rounded-xl bg-gradient-to-tr from-brand-cyan to-cyan-500 p-[1.5px] shadow-sm">
            <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
              <span className="font-display font-black text-[10px] text-brand-cyan tracking-tighter leading-none">
                ET
              </span>
            </div>
          </div>
          <span className="font-display text-xs font-black tracking-wider text-slate-900 dark:text-white uppercase">
            ET <span className="text-brand-cyan">Digital</span>
          </span>
        </div>
      )}
    </div>
  );
}


