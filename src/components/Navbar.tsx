import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { Menu, X, ArrowUpRight, Settings, Sparkles, User as UserIcon, LogOut } from 'lucide-react';
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

  const beehiivUrl = "https://growwithetdigital.beehiiv.com";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
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
    <header
      id="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-md py-3'
          : 'bg-white/95 backdrop-blur-md border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Left aligned logo */}
        <div onClick={() => handleNavClick('home')} className="cursor-pointer flex items-center gap-3 group">
          <Logo />
          <div className="hidden lg:flex flex-col border-l border-slate-200 pl-3 py-0.5 text-left transition-colors duration-300">
            <span className="font-display text-[9px] font-black uppercase tracking-wider text-slate-900 leading-none">
              ET Digital
            </span>
            <span className="font-mono text-[7px] font-bold uppercase tracking-widest text-slate-400 leading-none mt-1">
              Growth Operating Systems™
            </span>
          </div>
        </div>

        {/* Centered navigation links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
          <button
            onClick={() => handleNavClick('home')}
            className={`font-sans text-xs font-bold uppercase tracking-wider transition-colors hover:text-cyan-650 cursor-pointer ${
              activeSection === 'hero' ? 'text-cyan-650 font-extrabold' : 'text-slate-500'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('growth-grader')}
            className={`font-sans text-xs font-bold uppercase tracking-wider transition-colors hover:text-cyan-650 cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'growth-grader' ? 'text-cyan-650 font-extrabold' : 'text-slate-500'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse shrink-0" />
            Free Auditor
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`font-sans text-xs font-bold uppercase tracking-wider transition-colors hover:text-cyan-650 cursor-pointer ${
              activeSection === 'about' ? 'text-cyan-650 font-extrabold' : 'text-slate-500'
            }`}
          >
            About
          </button>
          <button
            onClick={() => handleNavClick('services')}
            className={`font-sans text-xs font-bold uppercase tracking-wider transition-colors hover:text-cyan-650 cursor-pointer ${
              activeSection === 'services' ? 'text-cyan-650 font-extrabold' : 'text-slate-500'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => handleNavClick('instagram-feed')}
            className={`font-sans text-xs font-bold uppercase tracking-wider transition-colors hover:text-cyan-650 cursor-pointer ${
              activeSection === 'instagram-feed' ? 'text-cyan-650 font-extrabold' : 'text-slate-500'
            }`}
          >
            Case Studies
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className={`font-sans text-xs font-bold uppercase tracking-wider transition-colors hover:text-cyan-650 cursor-pointer ${
              activeSection === 'faq' ? 'text-cyan-650 font-extrabold' : 'text-slate-500'
            }`}
          >
            FAQ
          </button>
          <a
            href={beehiivUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-cyan-650 inline-flex items-center gap-1 transition-colors"
          >
            Newsletter
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </a>
          <button
            onClick={onOpenBooking}
            className="font-sans text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-cyan-650 transition-colors cursor-pointer flex items-center gap-1"
            id="nav-connect-tab-btn"
          >
            Let's Connect
          </button>
        </nav>

        {/* Right aligned call to action */}
        <div className="hidden lg:flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenDashboard}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-brand-cyan border border-brand-cyan/40 font-display text-[10px] font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                id="navbar-growth-os-btn"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-cyan animate-pulse" />
                <span>My Growth OS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </button>

              <button
                type="button"
                onClick={onSignOut}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 font-display text-[10px] font-bold uppercase tracking-wider px-3 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
                title="Sign Out of Growth OS"
                id="navbar-signout-btn"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-2 bg-slate-900/90 hover:bg-slate-850 text-brand-cyan hover:text-white border border-brand-cyan/30 font-display text-[10px] font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
              id="navbar-auth-growth-os-btn"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Sign In to Growth OS</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenCalendar || onOpenBooking}
            className="group relative inline-flex items-center justify-center bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-[10px] font-extrabold uppercase tracking-widest px-5 py-2.5 rounded-xl overflow-hidden transition-all shadow-md active:scale-95 cursor-pointer"
            id="navbar-booking-btn"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              Work with Us
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </button>
        </div>

        {/* Mobile menu triggers */}
        <div className="lg:hidden flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-800 focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-2xl py-6 px-6 flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-4">
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
              <span>Free Auditor</span>
              <span className="font-mono text-[9px] font-extrabold uppercase bg-brand-cyan/20 text-cyan-700 px-2 py-0.5 rounded-md">
                Free Audit
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
            <button
              onClick={() => handleNavClick('faq')}
              className="text-left font-sans text-sm font-semibold py-2 border-b border-slate-100 text-slate-700 hover:text-cyan-600 cursor-pointer"
            >
              FAQ
            </button>
            <a
              href={beehiivUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm font-semibold py-2 border-b border-slate-100 text-slate-700 hover:text-cyan-600 flex justify-between items-center"
            >
              Newsletter
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="text-left font-sans text-sm font-semibold py-2 border-b border-slate-100 text-slate-900 hover:text-cyan-600 cursor-pointer flex items-center justify-between"
              id="navbar-mobile-connect-tab-btn"
            >
              <span className="font-bold text-cyan-700">Let's Connect</span>
              <span className="font-mono text-[9px] font-extrabold uppercase bg-brand-cyan/20 text-cyan-800 px-2.5 py-1 rounded-md">
                Inquiry Form
              </span>
            </button>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            {user ? (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenDashboard) onOpenDashboard();
                  }}
                  className="flex items-center justify-center gap-2 w-full bg-slate-900 text-brand-cyan border border-brand-cyan/40 font-display text-xs font-extrabold uppercase tracking-widest py-3.5 rounded-xl cursor-pointer shadow-md transition-all"
                >
                  <Sparkles className="w-4 h-4 text-brand-cyan" />
                  <span>My Growth OS Whiteboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onSignOut) onSignOut();
                  }}
                  className="flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 font-display text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl cursor-pointer transition-all"
                  id="navbar-mobile-signout-btn"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenAuthModal) onOpenAuthModal();
                }}
                className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-850 text-brand-cyan border border-brand-cyan/30 font-display text-xs font-extrabold uppercase tracking-widest py-3.5 rounded-xl cursor-pointer transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-brand-cyan" />
                <span>Sign In to Growth Operating System</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenCalendar) onOpenCalendar();
                else onOpenBooking();
              }}
              className="flex items-center justify-center gap-2 w-full bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-xs font-extrabold uppercase tracking-widest py-3.5 rounded-xl cursor-pointer shadow-md transition-all"
              id="navbar-mobile-booking-btn"
            >
              Work with Us
              <ArrowUpRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
