import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Cpu, BarChart3, User, Globe, 
  Sparkles, CheckCircle2, ShieldCheck, ArrowRight,
  Sliders, Search, ArrowUpRight
} from 'lucide-react';
import { UserProfile } from '../../types';
import BusinessProfileForm from './BusinessProfileForm';
import BusinessDnaPanel from './BusinessDnaPanel';
import AuditorArchivePanel from './AuditorArchivePanel';

interface ProfileBusinessDnaPanelProps {
  user: any;
  profile: UserProfile | null;
  onRefreshProfile: () => void;
  onNavigateToContentStudio: () => void;
  onOpenBooking: () => void;
  onOpenCalendar?: () => void;
}

export type ProfileSubSection = 'profile' | 'dna' | 'auditor';

export default function ProfileBusinessDnaPanel({
  user,
  profile,
  onRefreshProfile,
  onNavigateToContentStudio,
  onOpenBooking,
  onOpenCalendar,
}: ProfileBusinessDnaPanelProps) {
  const [activeSection, setActiveSection] = useState<ProfileSubSection>('profile');

  const clientName = profile?.business_name || profile?.displayName || 'ET Digital Client';

  return (
    <div className="space-y-6 text-left" id="profile-business-dna-panel">
      
      {/* Consolidated Master Header */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-cyan-400" />
                Unified Intelligence Hub
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                Profile · Brand DNA · Growth Auditor
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
              Profile & Business DNA
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Calibrate your company operations, extract your unique brand voice archetype, and execute diagnostic website audits to eliminate customer acquisition friction.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenCalendar || onOpenBooking}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all active:scale-95"
            >
              <span>Work with ET Digital</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Sub-navigation Tabs */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveSection('profile')}
            className={`px-4 py-2 rounded-xl font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeSection === 'profile'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-black'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Business Profile & Operations</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('dna')}
            className={`px-4 py-2 rounded-xl font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeSection === 'dna'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-black'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Brand DNA & Voice Calibration</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('auditor')}
            className={`px-4 py-2 rounded-xl font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeSection === 'auditor'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-black'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Growth Auditor Diagnostic</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>
      </div>

      {/* Active Sub-module rendering */}
      <AnimatePresence mode="wait">
        {activeSection === 'profile' && (
          <motion.div
            key="sub-profile"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <BusinessProfileForm
              user={user}
              profile={profile}
              onProfileUpdated={onRefreshProfile}
              onContinueToGeneration={() => setActiveSection('dna')}
            />
          </motion.div>
        )}

        {activeSection === 'dna' && (
          <motion.div
            key="sub-dna"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <BusinessDnaPanel
              profile={profile}
              onRefreshProfile={onRefreshProfile}
              onNavigateToContentStudio={onNavigateToContentStudio}
            />
          </motion.div>
        )}

        {activeSection === 'auditor' && (
          <motion.div
            key="sub-auditor"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <AuditorArchivePanel
              user={user}
              profile={profile}
              onOpenBooking={onOpenCalendar || onOpenBooking}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
