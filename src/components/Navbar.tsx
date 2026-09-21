import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { Menu, X, ArrowUpRight, Sparkles, LogOut } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeSection: string;
  onOpenBooking: () => void;
  onOpenCalendar?: () => void;
  onOpenWorkspaceHub?: () => void;
  user?: any;
  profile?: UserProfile | null;
  onOpenAuthModal?: () => void;
  onOpenDashboard?: () => void;
  onSignOut?: () => void;
}

export default function Navbar({ 
  activeSection, 
  onOpenBooking, 
  onOpenCalendar,
  onOpenWorkspaceHub,
  user,
  profile,
  onOpenAuthModal,
  onOpenDashboard,
  onSignOut,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const beehiivUrl = "https://growwithetdigital.beehiiv.com/subscribe";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
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
    <header
      id="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-sm py-2.5'
          : 'bg-white/95 backdrop-blur-md border-b border-slate-100 py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-2 lg:gap-4">
        
        {/* Left aligned logo unit: ET logo mark with 'DIGITAL' centered underneath + Engage · Convert · Grow */}
        <div 
          onClick={() => handleNavClick('home')} 
          className="cursor-pointer flex items-center gap-3 group shrink-0"
          title="ET Digital Home"
        >
          <Logo className="h-7 sm:h-8" showWordmark={true} />
          
          <div className="hidden sm:flex items-center gap-1.5 border-l border-slate-200 pl-3 py-1 text-left font-mono text-[9px] uppercase tracking-wider leading-none">
            <span className="text-black font-extrabold">Engage</span>
            <span className="text-slate-300 font-normal">·</span>
            <span className="text-black font-extrabold">Convert</span>
            <span className="text-slate-300 font-normal">·</span>
            <span className="text-cyan-600 dark:text-cyan-500 font-extrabold">Grow</span>
          </div>
        </div>

        {/* Streamlined Desktop Navigation - Smooth, balanced, uncrowded */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 shrink-0">
          <button
            onClick={() => handleNavClick('growth-grader')}
            className={`font-sans text-xs font-bold uppercase tracking-wider transition-colors hover:text-cyan-600 cursor-pointer flex items-center gap-1.5 whitespace-nowrap px-1 py-1 ${
              activeSection === 'growth-grader' ? 'text-cyan-600 font-extrabold' : 'text-slate-600'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shrink-0" />
            Auditor
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`font-sans text-xs font-bold uppercase tracking-wider transition-colors hover:text-cyan-600 cursor-pointer whitespace-nowrap px-1 py-1 ${
              activeSection === 'about' ? 'text-cyan-600 font-extrabold' : 'text-slate-600'
            }`}
          >
            About
          </button>
          <button
            onClick={() => handleNavClick('services')}
            className={`font-sans text-xs font-bold uppercase tracking-wider transition-colors hover:text-cyan-600 cursor-pointer whitespace-nowrap px-1 py-1 ${
              activeSection === 'services' ? 'text-cyan-600 font-extrabold' : 'text-slate-600'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => handleNavClick('instagram-feed')}
            className={`font-sans text-xs font-bold uppercase tracking-wider transition-colors hover:text-cyan-600 cursor-pointer whitespace-nowrap px-1 py-1 ${
              activeSection === 'instagram-feed' ? 'text-cyan-600 font-extrabold' : 'text-slate-600'
            }`}
          >
            Case Studies
          </button>
          <a
            href={beehiivUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-cyan-600 inline-flex items-center gap-1 transition-colors whitespace-nowrap px-1 py-1"
          >
            Newsletter
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </a>
          <button
            onClick={onOpenBooking}
            className="font-sans text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-cyan-600 transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap px-1 py-1"
            id="nav-connect-tab-btn"
          >
            Contact
          </button>
        </nav>

        {/* Right aligned action buttons - fit perfectly without crowding */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0 pl-3 border-l border-slate-200">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenDashboard}
                className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 font-display text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-xl transition-all shadow-xs cursor-pointer shrink-0 whitespace-nowrap"
                id="navbar-growth-os-btn"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Growth OS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </button>

              <button
                type="button"
                onClick={onSignOut}
                className="inline-flex items-center gap-1 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 font-display text-[10px] font-bold uppercase tracking-wider px-2.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs shrink-0 whitespace-nowrap"
                title="Sign Out"
                id="navbar-signout-btn"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden xl:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-white border border-cyan-500/30 font-display text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-xl transition-all shadow-xs cursor-pointer shrink-0 whitespace-nowrap"
              id="navbar-auth-growth-os-btn"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Sign In</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenCalendar || onOpenBooking}
            className="group relative inline-flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-[10px] font-black uppercase tracking-widest px-3.5 sm:px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer shrink-0 whitespace-nowrap"
            id="navbar-booking-btn"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              Schedule a Call
              <ArrowUpRight className="w-3 h-3 text-slate-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="lg:hidden flex items-center gap-2">
          {user ? (
            <button
              type="button"
              onClick={onOpenDashboard}
              className="inline-flex items-center gap-1 bg-slate-900 text-cyan-400 font-display text-[9px] font-bold uppercase px-2.5 py-1.5 rounded-lg"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Growth OS</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-1 bg-slate-900 text-cyan-400 font-display text-[9px] font-bold uppercase px-2.5 py-1.5 rounded-lg"
            >
              <span>Sign In</span>
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-800 focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-xl py-5 px-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left font-sans text-sm font-semibold py-2 border-b border-slate-100 text-slate-700 hover:text-cyan-600 cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('growth-grader')}
              className="text-left font-sans text-sm font-semibold py-2 border-b border-slate-100 text-slate-700 hover:text-cyan-600 cursor-pointer flex items-center justify-between"
            >
              <span>Auditor</span>
              <span className="font-mono text-[9px] font-extrabold uppercase bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-md">
                Free Diagnostic
              </span>
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-left font-sans text-sm font-semibold py-2 border-b border-slate-100 text-slate-700 hover:text-cyan-600 cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className="text-left font-sans text-sm font-semibold py-2 border-b border-slate-100 text-slate-700 hover:text-cyan-600 cursor-pointer"
            >
              Services
            </button>
            <button
              onClick={() => handleNavClick('instagram-feed')}
              className="text-left font-sans text-sm font-semibold py-2 border-b border-slate-100 text-slate-700 hover:text-cyan-600 cursor-pointer"
            >
              Case Studies
            </button>
            <a
              href={beehiivUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-left font-sans text-sm font-semibold py-2 border-b border-slate-100 text-slate-700 hover:text-cyan-600 flex items-center justify-between"
            >
              <span>Newsletter</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }}
              className="text-left font-sans text-sm font-semibold py-2 text-slate-700 hover:text-cyan-600 cursor-pointer"
            >
              Contact
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenCalendar ? onOpenCalendar() : onOpenBooking(); }}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>Schedule a Call</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </header>
  );
}
