import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import SocialProofTicker from './components/SocialProofTicker';
import GrowthAuditTool from './components/GrowthAuditTool';
import CreativeShowcase from './components/CreativeShowcase';
import ComparisonSection from './components/ComparisonSection';
import InstagramFeedGrid from './components/InstagramFeedGrid';
import FounderBio from './components/FounderBio';
import HowWeBuildGrowth from './components/HowWeBuildGrowth';
import ServiceCardsDeepDive from './components/ServiceCardsDeepDive';
import GrowthOSAccessBanner from './components/GrowthOSAccessBanner';
import PlaybookLeadMagnet from './components/PlaybookLeadMagnet';
import FAQSection from './components/FAQSection';
import InsightsBlogSection from './components/InsightsBlogSection';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import CalendarModal from './components/CalendarModal';
import WorkspaceHub from './components/WorkspaceHub';
import LegalModals from './components/LegalModals';
import AuthModal from './components/dashboard/AuthModal';
import WelcomeBookmarkModal from './components/dashboard/WelcomeBookmarkModal';
import WhiteboardShell from './components/dashboard/WhiteboardShell';
import { auth, getUserProfile, updateUserWelcomeFlag, googleSignOut } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { UserProfile } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalType, setLegalType] = useState<'privacy' | 'security'>('privacy');
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  // Growth OS Auth & Whiteboard States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Compute effective user from memory, auth client, or local storage session
  const effectiveUser = currentUser || auth.currentUser || (() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('et_growth_os_local_user');
        if (stored) {
          const parsed = JSON.parse(stored) as User;
          if (parsed && parsed.email) return parsed;
        }
        const activeUid = localStorage.getItem('et_growth_os_active_uid');
        if (activeUid && localStorage.getItem('et_signed_out') !== 'true') {
          const accounts = JSON.parse(localStorage.getItem('et_registered_accounts') || '{}');
          const matched = Object.values(accounts).find((a: any) => a.uid === activeUid) as any;
          if (matched && matched.email) {
            return {
              uid: matched.uid,
              email: matched.email,
              displayName: matched.displayName || 'Growth Partner',
              emailVerified: true,
            } as User;
          }
          if (activeUid === 'et_owner_primary') {
            return {
              uid: activeUid,
              email: 'ericlamarthomas@gmail.com',
              displayName: 'Eric Thomas',
              emailVerified: true,
            } as User;
          }
        }
      } catch (e) {}
    }
    return null;
  })();

  const fetchProfile = async (uid: string) => {
    // 1. Immediately hydrate from cache to eliminate UI delay (0ms)
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(`et_profile_${uid}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed) setUserProfile(parsed);
        } catch (e) {}
      }
    }
    try {
      const p = await getUserProfile(uid);
      if (p) setUserProfile(p);
      const welcomeSeen = typeof window !== 'undefined' ? localStorage.getItem(`et_welcome_seen_${uid}`) === 'true' : false;
      if (p && p.has_seen_welcome === false && !welcomeSeen) {
        setShowWelcomeModal(true);
      } else {
        setShowWelcomeModal(false);
      }
    } catch (e) {
      console.error('Failed to fetch profile:', e);
    }
  };

  const handleEnterGrowthOS = () => {
    setShowWelcomeModal(false);

    let activeUser = currentUser || auth.currentUser;
    if (!activeUser && typeof window !== 'undefined') {
      try {
        const localUserJson = localStorage.getItem('et_growth_os_local_user');
        if (localUserJson) {
          const parsed = JSON.parse(localUserJson);
          if (parsed && parsed.uid) activeUser = parsed as User;
        }
      } catch (e) {}
    }

    if (!activeUser) {
      const storedUid = (typeof window !== 'undefined' && localStorage.getItem('et_growth_os_active_uid')) || 'client_' + Math.random().toString(36).substring(2, 9);
      activeUser = {
        uid: storedUid,
        email: 'client@growthos.internal',
        displayName: 'Growth Partner',
        emailVerified: false,
      } as User;
      if (typeof window !== 'undefined') {
        localStorage.setItem('et_growth_os_local_user', JSON.stringify(activeUser));
      }
    }

    setCurrentUser(activeUser);
    const isOwner = (activeUser.email || '').trim().toLowerCase() === 'ericlamarthomas@gmail.com';
    setUserProfile((prev) => prev ? { ...prev, has_seen_welcome: true } : {
      uid: activeUser.uid,
      email: activeUser.email || '',
      displayName: activeUser.displayName || (isOwner ? 'Eric Thomas' : 'Growth Partner'),
      tier: isOwner ? 'consultation' : 'free',
      status: 'active',
      has_seen_welcome: true,
      business_name: isOwner ? 'ET Digital Growth OS' : 'Growth Partner',
      contact: 'Eric Thomas',
      website_url: 'https://growwithetdigital.com',
      location: 'Los Angeles, CA',
      mission_statement: 'business coaching to inspire storytelling',
      target_audience: 'Entrepreneurs and service business owners',
      brand_voice: 'Authoritative & Strategic',
      total_generations_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(`et_welcome_seen_${activeUser.uid}`, 'true');
      localStorage.setItem('et_growth_os_active_uid', activeUser.uid);
      localStorage.removeItem('et_signed_out');
    }
    setTimeout(() => {
      updateUserWelcomeFlag(activeUser.uid, true).catch(() => {});
    }, 0);

    setIsWhiteboardOpen(true);
  };

  const handleOpenDashboard = () => {
    // 1. Check if currentUser is active in state
    if (currentUser) {
      setShowWelcomeModal(false);
      setIsWhiteboardOpen(true);
      return;
    }

    // 2. Check if Firebase auth has an active user
    if (auth.currentUser) {
      setCurrentUser(auth.currentUser);
      fetchProfile(auth.currentUser.uid);
      setShowWelcomeModal(false);
      setIsWhiteboardOpen(true);
      return;
    }

    // 3. Check if we have a local session user
    if (typeof window !== 'undefined') {
      try {
        const localUserJson = localStorage.getItem('et_growth_os_local_user');
        if (localUserJson) {
          const localUser = JSON.parse(localUserJson);
          if (localUser && localUser.uid) {
            setCurrentUser(localUser as User);
            fetchProfile(localUser.uid);
            setShowWelcomeModal(false);
            setIsWhiteboardOpen(true);
            return;
          }
        }
      } catch (e) {}
    }

    // 4. Otherwise open Auth modal to let user sign in
    setIsAuthModalOpen(true);
  };

  useEffect(() => {
    // Check if the user has explicitly signed out
    const isSignedOut = typeof window !== 'undefined' ? localStorage.getItem('et_signed_out') === 'true' : false;

    if (isSignedOut) {
      // Force clean signed-out state
      setCurrentUser(null);
      setUserProfile(null);
      setIsWhiteboardOpen(false);
      setShowWelcomeModal(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Re-verify signed out flag before restoring session
      const currentlySignedOut = typeof window !== 'undefined' ? localStorage.getItem('et_signed_out') === 'true' : false;
      if (currentlySignedOut) {
        setCurrentUser(null);
        setUserProfile(null);
        return;
      }

      if (user) {
        if (typeof window !== 'undefined') {
          const existing = localStorage.getItem(`et_profile_${user.uid}`);
          if (!existing) {
            const isOwner = user.email === 'ericlamarthomas@gmail.com' || user.uid.includes('owner');
            const immediateProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || (isOwner ? 'Eric Thomas' : 'Growth Partner'),
              photoURL: user.photoURL || undefined,
              emailVerified: user.emailVerified,
              business_name: user.displayName || (isOwner ? 'ET Digital Growth OS' : 'Growth Partner'),
              contact: user.displayName || 'Growth Partner',
              website_url: '',
              location: '',
              mission_statement: '',
              competitor_website: '',
              target_audience: '',
              brand_voice: 'Authoritative & Strategic',
              tier: isOwner ? 'consultation' : 'free',
              status: 'active',
              has_seen_welcome: false,
              total_generations_count: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            localStorage.setItem(`et_profile_${user.uid}`, JSON.stringify(immediateProfile));
            setUserProfile(immediateProfile);
          }
        }
        setCurrentUser(user);
        setIsAuthModalOpen(false);
        fetchProfile(user.uid);
      } else {
        const localUserJson = typeof window !== 'undefined' ? localStorage.getItem('et_growth_os_local_user') : null;
        if (localUserJson && !currentlySignedOut) {
          try {
            const localUser = JSON.parse(localUserJson);
            if (localUser && localUser.uid) {
              setCurrentUser(localUser as User);
              setIsAuthModalOpen(false);
              fetchProfile(localUser.uid);
              return;
            }
          } catch (e) {}
        }
        const activeUid = typeof window !== 'undefined' ? localStorage.getItem('et_growth_os_active_uid') : null;
        if (currentlySignedOut || !activeUid) {
          setCurrentUser(null);
          setUserProfile(null);
          setIsWhiteboardOpen(false);
          setShowWelcomeModal(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleOpenBooking = () => {
    setIsBookingOpen(true);
  };

  const handleOpenCalendar = () => {
    setIsCalendarOpen(true);
  };

  const handleOpenLegal = (type: 'privacy' | 'security') => {
    setLegalType(type);
    setIsLegalOpen(true);
  };

  const handleSignOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('et_signed_out', 'true');
      localStorage.removeItem('et_growth_os_local_user');
      localStorage.removeItem('et_growth_os_active_uid');
      sessionStorage.clear();
    }
    try {
      await googleSignOut();
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    setCurrentUser(null);
    setUserProfile(null);
    setIsWhiteboardOpen(false);
    setShowWelcomeModal(false);
    setIsAuthModalOpen(false);
    triggerToast('Signed Out', 'You have been safely signed out of Growth OS.');
  };

  const triggerToast = (title: string, message: string) => {
    setToast({ title, message });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Track active section for navbar highlights
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'growth-grader', 'about', 'services', 'instagram-feed', 'faq', 'insights-blog'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isWhiteboardOpen) {
    const activeSessionUser = effectiveUser || {
      uid: (typeof window !== 'undefined' && localStorage.getItem('et_growth_os_active_uid')) || 'client_session',
      email: 'client@growthos.internal',
      displayName: 'Growth Partner',
      emailVerified: false,
    } as User;

    return (
      <motion.div 
        key="dashboard-view"
        initial={{ opacity: 0, scale: 0.995, filter: 'blur(3px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 0.995, filter: 'blur(3px)' }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-screen selection:bg-brand-cyan/30"
      >
        <WhiteboardShell
          user={activeSessionUser}
          profile={userProfile}
          onRefreshProfile={() => fetchProfile(activeSessionUser.uid)}
          onCloseDashboard={() => setIsWhiteboardOpen(false)}
          onOpenBooking={handleOpenBooking}
          onSignOut={handleSignOut}
        />

        {showWelcomeModal && (
          <WelcomeBookmarkModal
            uid={activeSessionUser.uid}
            isOpen={showWelcomeModal}
            onClose={handleEnterGrowthOS}
            onEnterGOS={handleEnterGrowthOS}
          />
        )}

        <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
        <CalendarModal isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} />
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-brand-cyan/25 selection:text-slate-950 font-sans relative antialiased">
      
      {/* SECTION 1: Sticky Editorial Navigation */}
      <Navbar 
        activeSection={activeSection} 
        onOpenBooking={handleOpenBooking}
        onOpenCalendar={handleOpenCalendar}
        onOpenWorkspaceHub={() => setIsWorkspaceOpen(true)}
        user={effectiveUser}
        profile={userProfile}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenDashboard={handleOpenDashboard}
        onSignOut={handleSignOut}
      />

      {/* SECTION 2: Hero Engine */}
      <HeroSection onOpenBooking={handleOpenBooking} />

      {/* SECTION 4: Horizontal Social Proof Ticker */}
      <SocialProofTicker />

      {/* SECTION 5: High-Converting Growth & AI Search Auditor Grader */}
      <GrowthAuditTool 
        onOpenBooking={handleOpenBooking} 
        onOpenCalendar={handleOpenCalendar}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenDashboard={handleOpenDashboard}
        user={effectiveUser}
      />

      {/* SECTION 6: High-Fidelity Creative Showcase (Dynamic Media Module) */}
      <CreativeShowcase />

      {/* SECTION 6.5: Instagram Content Feed Grid */}
      <InstagramFeedGrid onOpenBooking={handleOpenBooking} onOpenCalendar={handleOpenCalendar} />

      {/* SECTION 7: Editorial Founder Bio (About Section) */}
      <FounderBio onOpenBooking={handleOpenBooking} />

      {/* SECTION 7.5: How We Build Growth (Four-step process) */}
      <HowWeBuildGrowth onOpenBooking={handleOpenBooking} />

      {/* SECTION 7.8: Strategic Comparison (Traditional Agency vs. Growth OS Model) */}
      <ComparisonSection onOpenBooking={handleOpenBooking} />

      {/* SECTION 8: Service Card Deep-Dive Architecture */}
      <ServiceCardsDeepDive onOpenBooking={handleOpenBooking} onOpenCalendar={handleOpenCalendar} />

      {/* SECTION 8.5: Growth Operating System Access & Conversion Cadence */}
      <GrowthOSAccessBanner
        user={effectiveUser}
        profile={userProfile}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenDashboard={handleOpenDashboard}
        onOpenBooking={handleOpenBooking}
        onOpenCalendar={handleOpenCalendar}
      />

      {/* SECTION 9: Custom Growth Playbook Lead Magnet */}
      <PlaybookLeadMagnet onOpenBooking={handleOpenBooking} onOpenCalendar={handleOpenCalendar} />

      {/* SECTION 9.5: Interactive 2026 Marketing FAQs Accordion */}
      <FAQSection onOpenBooking={handleOpenBooking} />

      {/* SECTION 10: Strategic Insights & Newsletter Capture */}
      <InsightsBlogSection onOpenBooking={handleOpenBooking} onOpenCalendar={handleOpenCalendar} />

      {/* SECTION 11: The Enterprise Hub (Footer) */}
      <Footer 
        onOpenBooking={handleOpenBooking} 
        onOpenCalendar={handleOpenCalendar}
        onOpenPrivacy={() => handleOpenLegal('privacy')}
        onOpenSecurity={() => handleOpenLegal('security')}
      />

      {/* INTEGRATIONS & PORTAL POPUPS */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <CalendarModal isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} />
      <WorkspaceHub isOpen={isWorkspaceOpen} onClose={() => setIsWorkspaceOpen(false)} />
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('et_signed_out');
            localStorage.setItem('et_growth_os_active_uid', user.uid);
            localStorage.setItem('et_growth_os_local_user', JSON.stringify(user));
          }
          setCurrentUser(user);
          fetchProfile(user.uid);
          setShowWelcomeModal(false);
          setIsWhiteboardOpen(true);
        }}
      />

      {/* First-time Welcome & Bookmark Modal */}
      {showWelcomeModal && (
        <WelcomeBookmarkModal
          uid={effectiveUser?.uid || 'guest_user'}
          isOpen={showWelcomeModal}
          onClose={handleEnterGrowthOS}
          onEnterGOS={handleEnterGrowthOS}
        />
      )}

      {/* Dynamic Legal Modals */}
      <LegalModals 
        isOpen={isLegalOpen} 
        onClose={() => setIsLegalOpen(false)} 
        type={legalType} 
      />

      {/* Interactive Toast Notification Panel */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-2xl flex flex-col gap-3 text-left"
          >
            <div>
              <h4 className="font-display text-xs font-extrabold uppercase tracking-widest text-brand-cyan">
                {toast.title}
              </h4>
              <p className="font-sans text-xs text-slate-300 mt-1.5 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setToast(null);
                  handleOpenCalendar();
                }}
                className="bg-brand-cyan hover:bg-cyan-500 text-slate-950 font-display text-[9px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1"
              >
                Schedule Consultation
              </button>
              <button
                onClick={() => setToast(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-display text-[9px] font-extrabold uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
