import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ExternalLink, Calendar, Check, Copy, Share2, Sparkles, ShieldCheck, Mail
} from 'lucide-react';

interface SocialLinktreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
  onOpenCalendar?: () => void;
}

// Custom high-fidelity brand icons
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.8] text-rose-400" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-sky-400" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-red-500" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current text-slate-100" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-cyan-300" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.29-2.26.51-4.59 2.12-6.23 1.52-1.57 3.73-2.42 5.92-2.26v4.18c-1.18-.11-2.39.25-3.25.99-.92.77-1.42 1.98-1.31 3.18.06 1.05.62 2.05 1.51 2.61.94.61 2.13.71 3.14.31.96-.36 1.72-1.18 2.02-2.16.23-.71.28-1.47.27-2.21V.02z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-blue-500" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-red-500" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.289 2C6.617 2 2 6.614 2 12.284c0 4.34 2.695 8.047 6.54 9.613-.092-.81-.174-2.056.036-2.942.19-.8 1.226-5.195 1.226-5.195s-.313-.626-.313-1.55c0-1.45.84-2.537 1.89-2.537.892 0 1.32.67 1.32 1.47 0 .897-.572 2.24-.866 3.485-.246 1.04.52 1.886 1.547 1.886 1.855 0 3.284-1.957 3.284-4.78 0-2.5-1.8-4.248-4.364-4.248-2.972 0-4.718 2.23-4.718 4.533 0 .898.347 1.86.778 2.38.085.103.097.194.072.3-.08.33-.256 1.04-.29 1.18-.046.19-.15.23-.347.14-1.294-.6-2.015-2.5-2.015-4.02 0-3.273 2.378-6.278 6.856-6.278 3.6 0 6.4 2.565 6.4 5.998 0 3.578-2.256 6.454-5.385 6.454-1.05 0-2.04-.546-2.38-1.186l-.646 2.457c-.233.897-.864 2.02-1.284 2.7l1.096.34C18.254 22.01 22 17.58 22 12.284 22 6.614 17.362 2 12.289 2z"/>
  </svg>
);

const RedditIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-orange-500" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 17c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5-2.7 5-6 5z"/>
    <circle cx="9.5" cy="11.5" r="1" fill="currentColor"/>
    <circle cx="14.5" cy="11.5" r="1" fill="currentColor"/>
    <path d="M10 14c1 1 3 1 4 0"/>
    <path d="M12 7v-3.5c1 0 2.5.5 3 1"/>
    <circle cx="15.5" cy="4.5" r="1"/>
    <circle cx="5" cy="12" r="1.5"/>
    <circle cx="19" cy="12" r="1.5"/>
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-emerald-400" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
);

export default function SocialLinktreeModal({ 
  isOpen, 
  onClose, 
  onOpenBooking,
  onOpenCalendar
}: SocialLinktreeModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const socialChannels = [
    {
      name: 'Instagram',
      handle: '@growwithetdigital',
      url: 'https://www.instagram.com/growwithetdigital',
      icon: InstagramIcon,
      accent: 'border-rose-500/30 hover:border-rose-500 hover:shadow-rose-950/40',
      badge: 'Daily Insights'
    },
    {
      name: 'LinkedIn',
      handle: 'Eric Lamar Thomas',
      url: 'https://www.linkedin.com/in/ericlamarthomas/',
      icon: LinkedInIcon,
      accent: 'border-sky-500/30 hover:border-sky-500 hover:shadow-sky-950/40',
      badge: 'B2B & Strategy'
    },
    {
      name: 'YouTube',
      handle: 'ET Digital Channel',
      url: 'https://www.youtube.com/channel/UCX1zWznbP9tr8OhXxmVM_dQ',
      icon: YouTubeIcon,
      accent: 'border-red-500/30 hover:border-red-500 hover:shadow-red-950/40',
      badge: 'Video Masterclasses'
    },
    {
      name: 'TikTok',
      handle: '@growwithetdigital',
      url: 'https://tiktok.com/@growwithetdigital',
      icon: TikTokIcon,
      accent: 'border-cyan-400/30 hover:border-cyan-400 hover:shadow-cyan-950/40',
      badge: 'Short Form'
    },
    {
      name: 'X (Twitter)',
      handle: '@etdigitalonx',
      url: 'https://x.com/etdigitalonx',
      icon: XIcon,
      accent: 'border-slate-500/30 hover:border-slate-300 hover:shadow-slate-900/40',
      badge: 'Live Threads'
    },
    {
      name: 'Facebook',
      handle: 'ET Digital',
      url: 'https://www.facebook.com/profile.php?id=61591454055463',
      icon: FacebookIcon,
      accent: 'border-blue-500/30 hover:border-blue-500 hover:shadow-blue-950/40',
      badge: 'Community'
    },
    {
      name: 'Pinterest',
      handle: '@contactetdigital',
      url: 'https://www.pinterest.com/contactetdigital/',
      icon: PinterestIcon,
      accent: 'border-red-600/30 hover:border-red-600 hover:shadow-red-950/40',
      badge: 'Visual Playbooks'
    },
    {
      name: 'Reddit',
      handle: 'u/growwithetdigital',
      url: 'https://www.reddit.com/user/growwithetdigital/',
      icon: RedditIcon,
      accent: 'border-orange-500/30 hover:border-orange-500 hover:shadow-orange-950/40',
      badge: 'Q&A Discussions'
    },
    {
      name: 'Google Business Profile',
      handle: 'ET Digital',
      url: 'https://share.google/0jYYGdh1VnwiDk7t5',
      icon: GoogleIcon,
      accent: 'border-emerald-500/30 hover:border-emerald-500 hover:shadow-emerald-950/40',
      badge: 'Google Verified'
    },
    {
      name: 'Growth Newsletter',
      handle: 'growwithetdigital.beehiiv.com',
      url: 'https://growwithetdigital.beehiiv.com',
      icon: Mail,
      accent: 'border-brand-cyan/40 hover:border-brand-cyan hover:shadow-cyan-950/50',
      badge: 'Weekly Edition'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Linktree-Style Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 25 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-slate-800 rounded-[2.5rem] shadow-[0_0_60px_rgba(6,182,212,0.15)] overflow-hidden z-10 flex flex-col max-h-[90vh] text-left select-none"
        >
          {/* Top Cyan Glowing Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-cyan via-cyan-300 to-brand-cyan" />

          {/* Header Controls */}
          <div className="p-5 flex items-center justify-end border-b border-slate-900">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Hero Header */}
          <div className="p-6 text-center border-b border-slate-900 bg-slate-950/60 relative overflow-hidden">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-brand-cyan/15 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative inline-block mb-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-cyan via-cyan-400 to-sky-400 p-1 shadow-xl shadow-cyan-950/60 mx-auto">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-2.5">
                  <img
                    src="https://res.cloudinary.com/dnpvgq7gt/image/upload/v1783013238/IMG_6170_pgtrij.png"
                    alt="ET Digital"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-brand-cyan text-slate-950 p-1 rounded-full shadow-md border-2 border-slate-950">
                <ShieldCheck className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>

            <h3 className="font-display text-xl font-black text-white tracking-tight uppercase">
              ET Digital
            </h3>
            
            <div className="inline-flex items-center gap-1.5 bg-cyan-950/80 border border-brand-cyan/30 px-3 py-1 rounded-full mt-1">
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
              <span className="font-mono text-[11px] font-black text-brand-cyan tracking-wider">
                @growwithetdigital
              </span>
            </div>

            <p className="font-sans text-xs text-slate-300 mt-2.5 max-w-xs mx-auto leading-relaxed">
              Straightforward, practical marketing & client growth systems for modern business owners.
            </p>
          </div>

          {/* Scrollable Links List */}
          <div className="p-5 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800">
            
            {/* Primary Calendar Booking Link */}
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenCalendar) onOpenCalendar();
                else onOpenBooking();
              }}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-brand-cyan via-cyan-400 to-brand-cyan text-slate-950 font-display font-black text-xs uppercase tracking-wider flex items-center justify-between shadow-xl shadow-cyan-950/50 hover:scale-[1.02] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-950 text-brand-cyan flex items-center justify-center shadow-md">
                  <Calendar className="w-4.5 h-4.5" />
                </div>
                <div className="text-left">
                  <span className="block font-extrabold text-slate-950 text-xs">Work with Us (Book Audit)</span>
                  <span className="block font-mono text-[9px] text-slate-900 font-bold">Direct Calendar Access</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Let's Connect Contact Form Button */}
            <button
              onClick={() => {
                onClose();
                onOpenBooking();
              }}
              className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-700/80 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-between shadow-md hover:bg-slate-800 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-950 text-brand-cyan flex items-center justify-center shadow-md border border-brand-cyan/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-white text-xs">Let's Connect</span>
                  <span className="block font-mono text-[9px] text-slate-400">Direct Contact Form</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
            </button>

            {/* Social Channels List */}
            {socialChannels.map((channel, idx) => {
              const IconComponent = channel.icon;
              return (
                <a
                  key={idx}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full p-3.5 rounded-2xl bg-slate-900/80 border ${channel.accent} flex items-center justify-between transition-all duration-300 hover:scale-[1.01] hover:bg-slate-900 shadow-md group`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                      <IconComponent className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-xs font-extrabold text-white uppercase">{channel.name}</span>
                        <span className="font-mono text-[8px] font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                          {channel.badge}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-brand-cyan/90 block font-medium">
                        {channel.handle}
                      </span>
                    </div>
                  </div>

                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-cyan group-hover:translate-x-0.5 transition-all" />
                </a>
              );
            })}
          </div>

          {/* Footer Branding */}
          <div className="p-4 bg-slate-950 border-t border-slate-900 text-center font-mono text-[9px] text-slate-500 uppercase tracking-widest">
            <span>© ET DIGITAL GROWTH OPERATING SYSTEMS™</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
