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

  const fetchProfile = async (uid: string) => {
    try {
      const p = await getUserProfile(uid);
      setUserProfile(p);
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
    setIsWhiteboardOpen(true);
    if (currentUser?.uid) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`et_welcome_seen_${currentUser.uid}`, 'true');
      }
      updateUserWelcomeFlag(currentUser.uid, true).catch(() => {});
    }
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
        setCurrentUser(user);
        fetchProfile(user.uid);
      } else {
        const localUserJson = typeof window !== 'undefined' ? localStorage.getItem('et_growth_os_local_user') : null;
        if (localUserJson && !currentlySignedOut) {
          try {
            const localUser = JSON.parse(localUserJson);
            if (localUser && localUser.uid) {
              setCurrentUser(localUser as User);
              fetchProfile(localUser.uid);
              return;
            }
          } catch (e) {}
        }
        setCurrentUser(null);
        setUserProfile(null);
        setIsWhiteboardOpen(false);
        setShowWelcomeModal(false);
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

  if (isWhiteboardOpen && currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-white selection:bg-brand-cyan/30">
        <WhiteboardShell
          user={currentUser}
          profile={userProfile}
          onRefreshProfile={() => fetchProfile(currentUser.uid)}
          onCloseDashboard={() => setIsWhiteboardOpen(false)}
          onOpenBooking={handleOpenBooking}
          onSignOut={handleSignOut}
        />

        {showWelcomeModal && (
          <WelcomeBookmarkModal
            uid={currentUser.uid}
            isOpen={showWelcomeModal}
            onClose={handleEnterGrowthOS}
            onEnterGOS={handleEnterGrowthOS}
          />
        )}

        <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
        <CalendarModal isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} />
      </div>
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
        user={currentUser}
        profile={userProfile}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenDashboard={() => setIsWhiteboardOpen(true)}
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
        user={currentUser}
        profile={userProfile}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenDashboard={() => setIsWhiteboardOpen(true)}
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
          setCurrentUser(user);
          fetchProfile(user.uid);
          setIsWhiteboardOpen(true);
        }}
      />

      {/* First-time Welcome & Bookmark Modal */}
      {currentUser && showWelcomeModal && (
        <WelcomeBookmarkModal
          uid={currentUser.uid}
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
                Work with Us
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
