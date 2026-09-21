import React, { useState, useEffect } from 'react';
import { 
  X, Users, Activity, Layers, BarChart3, Clock, 
  ShieldCheck, RefreshCw, CheckCircle2, ArrowUpRight, Sparkles, Mail, Lock,
  Download, Dna, TrendingUp, BookOpen, Award, Globe, LogIn, ExternalLink
} from 'lucide-react';
import { getPlatformUsageStats } from '../../lib/firebase';
import { PlatformTelemetryEvent, UserProfile } from '../../types';
import { isAuthorizedForTelemetry } from '../../utils/telemetryAuth';
import { 
  getUserTelemetry, 
  formatDuration, 
  PersonalTelemetryData,
  UserSectionMetric,
  SECTION_METADATA 
} from '../../utils/userTelemetry';

interface OwnerTelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail?: string;
  user?: any;
  profile?: UserProfile | null;
  onSelectTab?: (tabId: string) => void;
}

export default function OwnerTelemetryModal({
  isOpen,
  onClose,
  currentEmail,
  user,
  profile,
  onSelectTab
}: OwnerTelemetryModalProps) {
  const isOwner = isAuthorizedForTelemetry(currentEmail, profile?.email);
  // Default view is ALWAYS personal metrics as requested
  const [activeView, setActiveView] = useState<'personal' | 'agency'>('personal');
  const [loading, setLoading] = useState(false);

  const [personalData, setPersonalData] = useState<PersonalTelemetryData>(() => 
    getUserTelemetry(user?.uid, currentEmail, profile?.business_name, profile)
  );

  const [agencyStats, setAgencyStats] = useState<{
    users: any[];
    events: PlatformTelemetryEvent[];
    totalSessions: number;
    totalGenerations: number;
    totalAudits: number;
    totalUsers: number;
  }>({
    users: [],
    events: [],
    totalSessions: 0,
    totalGenerations: 0,
    totalAudits: 0,
    totalUsers: 0
  });

  const refreshTelemetry = async () => {
    setLoading(true);
    try {
      const refreshedPersonal = getUserTelemetry(user?.uid, currentEmail, profile?.business_name, profile);
      setPersonalData(refreshedPersonal);

      if (isOwner) {
        const stats = await getPlatformUsageStats(currentEmail);
        setAgencyStats(stats);
      }
    } catch (err) {
      console.warn('Telemetry refresh notice:', err);
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshTelemetry();
    }
  }, [isOpen, user?.uid, currentEmail]);

  if (!isOpen) return null;

  const totalTime = Math.max(60, personalData.totalTimeSeconds);
  const sectionsList: UserSectionMetric[] = Object.values(personalData.sections);
  const activeSectionsCount = sectionsList.filter(s => s.visits > 0).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl text-white my-6 text-left animate-in fade-in zoom-in-95 duration-200"
        id="user-telemetry-dashboard-panel"
      >
        {/* Modal Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="font-mono text-[9px] font-black uppercase tracking-widest text-brand-cyan bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-brand-cyan/30">
                {isOwner ? 'Executive Telemetry' : 'Your Growth OS Telemetry'}
              </span>
              <span className="font-mono text-[9px] font-bold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Tracking Active
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>{activeView === 'personal' ? 'Your Activity & Usage Metrics' : 'Platform All-Users Directory'}</span>
            </h2>
            <p className="font-sans text-xs sm:text-sm text-slate-400 mt-1">
              {activeView === 'personal' 
                ? 'Private telemetry recording your session logins, time spent across Growth OS sections, and downloaded assets.'
                : 'Agency-wide administrative telemetry showing active clients and total platform throughput.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Owner Tab Switcher (Strictly for Administrator) */}
            {isOwner && (
              <div className="flex items-center p-1 bg-slate-950/80 border border-slate-800 rounded-xl mr-2 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setActiveView('personal')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
                    activeView === 'personal' 
                      ? 'bg-brand-cyan text-slate-950 shadow-xs' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  My Metrics
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('agency')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
                    activeView === 'agency' 
                      ? 'bg-brand-cyan text-slate-950 shadow-xs' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Agency Overview
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={refreshTelemetry}
              disabled={loading}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Refresh Telemetry"
              id="refresh-telemetry-btn"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-cyan' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              id="close-telemetry-modal-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* VIEW 1: USER'S PERSONAL TELEMETRY (Default for all users & owner)   */}
        {/* =================================================================== */}
        {activeView === 'personal' && (
          <div className="space-y-6">
            {/* User Profile Summary Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950/90 via-slate-900 to-cyan-950/30 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-display font-bold text-white">
                    {profile?.business_name || personalData.displayName}
                  </h3>
                  <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-bold">
                    {personalData.tier}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-xs font-mono mt-1.5 flex-wrap">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    {personalData.email}
                  </span>
                  {profile?.website_url && (
                    <span className="flex items-center gap-1 text-cyan-400">
                      <Globe className="w-3.5 h-3.5" />
                      {profile.website_url.replace(/^https?:\/\//i, '').replace(/\/$/, '')}
                    </span>
                  )}
                  {profile?.location && (
                    <span className="text-slate-400">
                      • {profile.location}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-right">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Client Session</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold flex items-center justify-end gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Authenticated
                  </span>
                </div>
              </div>
            </div>

            {/* 4 Core User Metric KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* 1. Logins */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Total Logins</span>
                  <LogIn className="w-4 h-4 text-brand-cyan" />
                </div>
                <div className="font-display text-2xl font-black text-white">{personalData.logins}</div>
                <div className="font-mono text-[10px] text-slate-400 truncate">
                  Platform sign-ins tracked
                </div>
              </div>

              {/* 2. Total Time */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Time in OS</span>
                  <Clock className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="font-display text-2xl font-black text-white">
                  {formatDuration(personalData.totalTimeSeconds)}
                </div>
                <div className="font-mono text-[10px] text-slate-400 truncate">
                  Active focus duration
                </div>
              </div>

              {/* 3. Sections Engaged */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Sections Visited</span>
                  <Layers className="w-4 h-4 text-purple-400" />
                </div>
                <div className="font-display text-2xl font-black text-white">
                  {activeSectionsCount} / 6
                </div>
                <div className="font-mono text-[10px] text-slate-400 truncate">
                  Workspace modules
                </div>
              </div>

              {/* 4. Downloads */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Downloads</span>
                  <Download className="w-4 h-4 text-amber-400" />
                </div>
                <div className="font-display text-2xl font-black text-white">
                  {personalData.downloads.length}
                </div>
                <div className="font-mono text-[10px] text-slate-400 truncate">
                  Graphics & playbooks
                </div>
              </div>
            </div>

            {/* Section 1: SECTIONS SPENT TIME ON (Requested by User) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-cyan" />
                    <span>Sections You Spent Time On</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Breakdown of active duration and session visits across your Growth OS modules.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 font-bold hidden sm:inline">
                  Total: {formatDuration(personalData.totalTimeSeconds)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sectionsList.map((sec) => {
                  const meta = SECTION_METADATA[sec.id] || {
                    name: sec.name,
                    description: 'Growth OS Module',
                    icon: 'Layers'
                  };
                  const percent = Math.min(100, Math.round((sec.seconds / totalTime) * 100)) || 0;

                  return (
                    <div 
                      key={sec.id}
                      className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-display font-bold text-white flex items-center gap-1.5">
                            <span>{meta.name}</span>
                          </h4>
                          <p className="text-[11px] text-slate-400 leading-snug line-clamp-1">
                            {meta.description}
                          </p>
                        </div>

                        {onSelectTab && (
                          <button
                            type="button"
                            onClick={() => onSelectTab(sec.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 font-mono text-[10px] font-bold border border-slate-700 transition-all cursor-pointer shrink-0"
                            title={`Jump to ${meta.name}`}
                          >
                            <span>Open</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Duration, visits, and percent */}
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-white font-bold text-sm">
                          {formatDuration(sec.seconds)}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          {sec.visits} {sec.visits === 1 ? 'visit' : 'visits'} • {percent}% of time
                        </span>
                      </div>

                      {/* Visual progress indicator */}
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(5, percent)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 2: YOUR DOWNLOADS (Requested by User) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Your Downloaded Assets</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Every marketing graphic and strategy playbook downloaded in your workspace.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-amber-300 font-bold">
                  {personalData.downloads.length} {personalData.downloads.length === 1 ? 'Asset' : 'Assets'}
                </span>
              </div>

              {personalData.downloads.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center mx-auto text-slate-400">
                    <Download className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-display font-semibold text-slate-300">
                    No Downloads Recorded Yet
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    When you download your 1:1 editorial graphics, stories, or strategic playbooks from the Content Studio, they will be cataloged here with download timestamps.
                  </p>
                  {onSelectTab && (
                    <button
                      type="button"
                      onClick={() => onSelectTab('content_studio')}
                      className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Create & Download in Content Studio</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/60">
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60">
                    {personalData.downloads.map((item) => (
                      <div 
                        key={item.id} 
                        className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/60 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-cyan-950/70 border border-cyan-800/40 flex items-center justify-center shrink-0 text-cyan-400 mt-0.5">
                            <Download className="w-4 h-4" />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-xs sm:text-sm font-semibold text-white line-clamp-1">
                              {item.title}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                              <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                                {item.format || item.type}
                              </span>
                              <span>•</span>
                              <span>{new Date(item.timestamp).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            </div>
                          </div>
                        </div>

                        {onSelectTab && (
                          <button
                            type="button"
                            onClick={() => onSelectTab('downloads')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-[11px] font-semibold transition-all self-end sm:self-auto cursor-pointer"
                          >
                            <span>Downloads Vault</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: RECENT SESSION ACTIONS */}
            <div className="space-y-3 pt-2">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Recent Workspace Activity</span>
              </h3>
              
              <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-3 space-y-2">
                {personalData.recentActions.map((act) => (
                  <div 
                    key={act.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 border border-slate-800/60 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
                      <span className="font-mono text-[10px] text-cyan-400 uppercase font-bold">
                        {act.action}
                      </span>
                      <span className="text-slate-300 hidden sm:inline">—</span>
                      <span className="text-slate-300 line-clamp-1">{act.description}</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 shrink-0 ml-2">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 2: AGENCY ALL-USERS DIRECTORY (Strictly for Platform Owner)   */}
        {/* =================================================================== */}
        {activeView === 'agency' && isOwner && (
          <div className="space-y-6">
            {/* Top KPI Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Active Users</span>
                  <Users className="w-4 h-4 text-brand-cyan" />
                </div>
                <div className="font-display text-2xl font-black text-white">{agencyStats.totalUsers}</div>
                <div className="font-mono text-[9px] text-slate-500 mt-1">Authorized accounts</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Total Sessions</span>
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="font-display text-2xl font-black text-white">{agencyStats.totalSessions}</div>
                <div className="font-mono text-[9px] text-slate-500 mt-1">Platform logins tracked</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Content Assets</span>
                  <Layers className="w-4 h-4 text-amber-400" />
                </div>
                <div className="font-display text-2xl font-black text-white">{agencyStats.totalGenerations}</div>
                <div className="font-mono text-[9px] text-slate-500 mt-1">Generated growth packs</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Diagnostics</span>
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                </div>
                <div className="font-display text-2xl font-black text-white">{agencyStats.totalAudits}</div>
                <div className="font-mono text-[9px] text-slate-500 mt-1">Website audits run</div>
              </div>
            </div>

            {/* User Activity & Usage Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-200">
                  User Directory & Engagement Breakdown
                </h3>
                <span className="font-mono text-[10px] text-slate-400">
                  Synced with Firestore & Auth Sessions
                </span>
              </div>

              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/50">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/60 font-mono text-[10px] uppercase text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">User & Email</th>
                        <th className="py-3 px-3">Plan Tier</th>
                        <th className="py-3 px-3 text-center">Logins</th>
                        <th className="py-3 px-3 text-center">Generations</th>
                        <th className="py-3 px-4 text-right">Last Active</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {agencyStats.users.map((u, idx) => {
                        const isPrimaryOwner = u.email === 'ericlamarthomas@gmail.com' || u.uid?.includes('owner');
                        return (
                          <tr key={u.uid || idx} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-semibold text-white flex items-center gap-1.5">
                                <span>{u.displayName || 'Growth User'}</span>
                                {isPrimaryOwner && (
                                  <span className="font-mono text-[8px] font-black uppercase tracking-wider bg-brand-cyan/20 text-cyan-300 px-1.5 py-0.5 rounded border border-brand-cyan/30">
                                    Owner
                                  </span>
                                )}
                              </div>
                              <div className="text-slate-400 font-mono text-[10px] mt-0.5 flex items-center gap-1">
                                <Mail className="w-2.5 h-2.5" />
                                <span>{u.email || 'No email provided'}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${
                                u.tier === 'consultation' 
                                  ? 'bg-amber-950/50 text-amber-300 border-amber-500/30'
                                  : u.tier === 'monthly'
                                  ? 'bg-cyan-950/50 text-cyan-300 border-cyan-500/30'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}>
                                {u.tier === 'consultation' ? 'VIP Consultation' : u.tier === 'monthly' ? 'Monthly OS' : 'Standard OS'}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center font-mono font-bold text-white">
                              {u.logins || 1}
                            </td>
                            <td className="py-3 px-3 text-center font-mono font-bold text-cyan-400">
                              {u.generations || 0}
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-[10px] text-slate-400">
                              {u.lastActive ? new Date(u.lastActive).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 'Just now'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Live Activity Stream */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-200">
                  Live Session Activity Stream
                </h3>
                <span className="font-mono text-[10px] text-slate-400">
                  Last {agencyStats.events.length} system actions
                </span>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-2 pr-1 rounded-xl bg-slate-950/40 p-3 border border-slate-800/80">
                {agencyStats.events.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-500 font-mono">
                    No recent activity events recorded. Logins and generations will appear here automatically.
                  </div>
                ) : (
                  agencyStats.events.map((evt) => (
                    <div key={evt.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/50 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan shrink-0" />
                        <span className="font-semibold text-slate-200">{evt.userName}</span>
                        <span className="text-slate-400">({evt.userEmail})</span>
                        <span className="font-mono text-[10px] text-cyan-400 uppercase bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                          {evt.action.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500 shrink-0">
                        {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {activeView === 'personal'
                ? 'Your telemetry is private to your authenticated Growth OS session.'
                : 'Administrative telemetry synced with Firestore and client access logs.'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
          >
            Close Telemetry
          </button>
        </div>
      </div>
    </div>
  );
}
