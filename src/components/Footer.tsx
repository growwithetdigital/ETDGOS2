import React from 'react';
import Logo from './Logo';
import { ArrowUpRight, Instagram, Mail, MapPin, Compass, ShieldCheck, Facebook, Linkedin, Youtube } from 'lucide-react';

// Official brand icons styled to match the precise aesthetic of Lucide
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20.8 11.5c.13.43.2 1 .2 1.5 0 5-3.4 8.5-8.5 8.5C7.2 21.5 3.5 17.8 3.5 12.5S7.2 3.5 12.5 3.5c2.6 0 4.8 1 6.5 2.6L16.2 8.9C15.2 8 14 7.4 12.5 7.4c-2.8 0-5.1 2.3-5.1 5.1s2.3 5.1 5.1 5.1c3.3 0 4.5-2.4 4.7-3.6H12.5v-2.5h8.3z" />
  </svg>
);

const PinterestIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2C6.5 2 2 6.5 2 12c0 4.25 2.68 7.915 6.463 9.344-.085-.805-.162-2.04.034-2.917l1.17-4.957s-.299-.597-.299-1.48c0-1.386.804-2.42 1.804-2.42.85 0 1.261.638 1.261 1.404 0 .855-.544 2.134-.825 3.32-.235.99.497 1.798 1.472 1.798 1.767 0 3.125-1.864 3.125-4.555 0-2.383-1.713-4.05-4.16-4.05-2.835 0-4.499 2.126-4.499 4.323 0 .856.33 1.774.741 2.274.081.1.093.187.069.284l-.279 1.139c-.045.184-.148.223-.342.133-1.277-.594-2.075-2.46-2.075-3.958 0-3.224 2.343-6.185 6.753-6.185 3.545 0 6.301 2.526 6.301 5.904 0 3.522-2.22 6.357-5.3 6.357-1.035 0-2.01-.538-2.343-1.171l-.638 2.43c-.23 1.055-.853 2.378-1.272 3.064C9.522 21.84 10.725 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
  </svg>
);

const RedditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 17c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5-2.7 5-6 5z" />
    <circle cx="9.5" cy="11.5" r="1" fill="currentColor" />
    <circle cx="14.5" cy="11.5" r="1" fill="currentColor" />
    <path d="M10 14c1 1 3 1 4 0" />
    <path d="M12 7v-3.5c1 0 2.5.5 3 1" />
    <circle cx="15.5" cy="4.5" r="1" />
    <circle cx="5" cy="12" r="1.5" />
    <circle cx="19" cy="12" r="1.5" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 4l11.73 16h4.27L8.27 4H4z" />
    <path d="M20 4L4 20" />
  </svg>
);

export default function Footer({ 
  onOpenBooking, 
  onOpenCalendar,
  onOpenPrivacy, 
  onOpenSecurity 
}: { 
  onOpenBooking: () => void;
  onOpenCalendar?: () => void;
  onOpenPrivacy: () => void;
  onOpenSecurity: () => void;
}) {
  const instagramUrl = "https://www.instagram.com/growwithetdigital";
  const beehiivUrl = "https://growwithetdigital.beehiiv.com";

  const handleScrollTo = (id: string) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* SECTION 11.1: Light Logo Banner (Layer above footer) */}
      <div className="bg-white border-t border-b border-slate-200/80 py-6 select-none relative z-10 text-left">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo className="h-12" />
          </div>
          <div className="flex items-center gap-3 font-mono text-[9px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
            <span>ET Digital Growth Operating Systems™</span>
            <span className="text-slate-200">|</span>
            <span className="text-cyan-600 font-black">ET Digital™</span>
          </div>
        </div>
      </div>

      {/* SECTION 11.2: Dark Enterprise Hub Footer */}
      <footer className="bg-slate-950 text-slate-400 pt-20 pb-10 border-t border-slate-900 relative overflow-hidden text-left select-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.02)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Top Full-Width Bottom Call Anchor Banner */}
          <div className="border-b border-slate-900 pb-16 mb-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="font-mono text-[9px] font-bold text-brand-cyan uppercase tracking-[0.25em] block mb-2">
                The Growth Command
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
                Ready to unlock growth? <br />
                <span className="text-brand-cyan">Let's talk!</span>
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white border border-slate-750 font-display text-xs font-extrabold uppercase tracking-widest px-7 py-4.5 rounded-xl transition-all active:scale-95 cursor-pointer"
                id="footer-connect-btn"
              >
                Let's Connect
              </button>

              <button
                type="button"
                onClick={onOpenCalendar || onOpenBooking}
                className="group relative inline-flex items-center justify-center bg-brand-cyan hover:bg-cyan-500 text-slate-950 font-display text-xs font-extrabold uppercase tracking-widest px-8 py-4.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                id="footer-booking-btn"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Work with Us
                  <ArrowUpRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </button>
            </div>
          </div>

          {/* Multi-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
            
            {/* Column 1: Core Corporate Identification (5 Cols) */}
            <div className="md:col-span-5 flex flex-col items-start gap-4">
              <p className="font-sans text-xs text-slate-500 max-w-sm leading-relaxed">
                We design and configure practical digital marketing systems for modern brands. Decreasing wasted outbound sprawl, aligning web presence, and scaling high-quality inbound pipelines.
              </p>

              <div className="space-y-2 text-xs pt-2">
                <a 
                  href="mailto:hello@growwithetdigital.com?subject=Re%3A%20Let's%20Connect" 
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-brand-cyan/70" />
                  hello@growwithetdigital.com
                </a>
                <div className="flex items-center gap-2 text-slate-400 font-sans">
                  <MapPin className="w-4 h-4 text-brand-cyan/70" />
                  <span>Los Angeles, CA</span>
                </div>
              </div>
            </div>

          {/* Column 2: Structural Page Index links (4 Cols) */}
          <div className="md:col-span-4 flex flex-col items-start gap-4">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-white">
              System Navigation
            </h4>
            
            <div className="flex flex-col gap-2.5 text-xs">
              <button 
                onClick={() => handleScrollTo('home')}
                className="text-slate-400 hover:text-white transition-colors text-left cursor-pointer"
              >
                Home
              </button>
              <button 
                onClick={() => handleScrollTo('about')}
                className="text-slate-400 hover:text-white transition-colors text-left cursor-pointer"
              >
                About
              </button>
              <button 
                onClick={() => handleScrollTo('services')}
                className="text-slate-400 hover:text-white transition-colors text-left cursor-pointer"
              >
                Services
              </button>
              <button 
                onClick={() => handleScrollTo('instagram-feed')}
                className="text-slate-400 hover:text-white transition-colors text-left cursor-pointer"
              >
                Client Case Studies
              </button>
              <a 
                href={beehiivUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors text-left inline-flex items-center gap-1"
              >
                Newsletter
                <ArrowUpRight className="w-3 h-3 text-slate-600" />
              </a>
              <button 
                type="button"
                onClick={onOpenBooking}
                className="text-brand-cyan hover:text-cyan-300 font-bold transition-colors text-left cursor-pointer inline-flex items-center gap-1.5 pt-1"
                id="footer-system-nav-connect-btn"
              >
                <span>Let's Connect</span>
                <span className="font-mono text-[8px] uppercase bg-cyan-950/80 text-brand-cyan border border-brand-cyan/30 px-1.5 py-0.5 rounded">
                  Form
                </span>
              </button>
            </div>
          </div>

          {/* Column 3: Functional Social (3 Cols) */}
          <div className="md:col-span-3 flex flex-col items-start gap-4">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-white">
              Social
            </h4>
            
            <div className="flex flex-wrap gap-3">
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/growwithetdigital" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-brand-cyan hover:border-brand-cyan transition-all"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              {/* Facebook */}
              <a 
                href="https://www.facebook.com/profile.php?id=61591454055463" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-brand-cyan hover:border-brand-cyan transition-all"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/in/ericlamarthomas/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-brand-cyan hover:border-brand-cyan transition-all"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              {/* Google */}
              <a 
                href="https://share.google/0jYYGdh1VnwiDk7t5" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-brand-cyan hover:border-brand-cyan transition-all"
                title="Google Business Profile"
              >
                <GoogleIcon className="w-4 h-4" />
              </a>
              {/* Pinterest */}
              <a 
                href="https://www.pinterest.com/contactetdigital/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-brand-cyan hover:border-brand-cyan transition-all"
                title="Pinterest"
              >
                <PinterestIcon className="w-4 h-4" />
              </a>
              {/* YouTube */}
              <a 
                href="https://www.youtube.com/channel/UCX1zWznbP9tr8OhXxmVM_dQ" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-brand-cyan hover:border-brand-cyan transition-all"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              {/* X */}
              <a 
                href="https://x.com/etdigitalonx" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-brand-cyan hover:border-brand-cyan transition-all"
                title="X"
              >
                <XIcon className="w-4 h-4" />
              </a>
              {/* Reddit */}
              <a 
                href="https://www.reddit.com/user/growwithetdigital/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-brand-cyan hover:border-brand-cyan transition-all"
                title="Reddit"
              >
                <RedditIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: License and Legals */}
        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-slate-600">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {new Date().getFullYear()} ET DIGITAL INC.</span>
          </div>
          
          <div className="flex gap-4">
            <button onClick={onOpenPrivacy} className="hover:text-slate-400 transition-colors cursor-pointer">PRIVACY CODE</button>
            <span>/</span>
            <button onClick={onOpenSecurity} className="hover:text-slate-400 transition-colors cursor-pointer">SECURITY TERMS</button>
          </div>
        </div>

      </div>
    </footer>
    </>
  );
}
