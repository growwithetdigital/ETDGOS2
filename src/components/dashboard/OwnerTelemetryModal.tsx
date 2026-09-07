import React, { useState, useEffect } from 'react';
import { 
  X, Users, Activity, Layers, BarChart3, Clock, 
  ShieldCheck, RefreshCw, CheckCircle2, ArrowUpRight, Sparkles, Mail
} from 'lucide-react';
import { getPlatformUsageStats } from '../../lib/firebase';
import { PlatformTelemetryEvent } from '../../types';

interface OwnerTelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail?: string;
}

export default function OwnerTelemetryModal({
  isOpen,
  onClose,
  currentEmail
}: OwnerTelemetryModalProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
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

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getPlatformUsageStats();
      setStats(data);
    } catch (err) {
      console.warn('Telemetry fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-8 text-left animate-in fade-in zoom-in-95 duration-200"
        id="owner-telemetry-panel"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-[9px] font-black uppercase tracking-widest text-brand-cyan bg-cyan-950/70 px-2 py-0.5 rounded border border-brand-cyan/20">
                Agency Executive Telemetry
              </span>
              <span className="font-mono text-[9px] font-bold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Tracking Active
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>Platform Usage & User Insights</span>
            </h2>
            <p className="font-sans text-xs sm:text-sm text-slate-400 mt-1">
              Real-time audit telemetry tracking who is accessing ET Digital Growth OS™ and their total engagement volume.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchStats}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-cyan' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top KPI Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Active Users</span>
              <Users className="w-4 h-4 text-brand-cyan" />
            </div>
            <div className="font-display text-2xl font-black text-white">{stats.totalUsers}</div>
            <div className="font-mono text-[9px] text-slate-500 mt-1">Authorized accounts</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Total Sessions</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-display text-2xl font-black text-white">{stats.totalSessions}</div>
            <div className="font-mono text-[9px] text-slate-500 mt-1">Platform logins tracked</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Content Assets</span>
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-display text-2xl font-black text-white">{stats.totalGenerations}</div>
            <div className="font-mono text-[9px] text-slate-500 mt-1">Generated growth packs</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Diagnostics</span>
              <BarChart3 className="w-4 h-4 text-purple-400" />
            </div>
            <div className="font-display text-2xl font-black text-white">{stats.totalAudits}</div>
            <div className="font-mono text-[9px] text-slate-500 mt-1">Website audits run</div>
          </div>
        </div>

        {/* User Activity & Usage Table */}
        <div className="space-y-4 mb-6">
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
                  {stats.users.map((user, idx) => {
                    const isOwner = user.email === 'ericlamarthomas@gmail.com' || user.uid?.includes('owner');
                    return (
                      <tr key={user.uid || idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <span>{user.displayName || 'Growth User'}</span>
                            {isOwner && (
                              <span className="font-mono text-[8px] font-black uppercase tracking-wider bg-brand-cyan/20 text-cyan-300 px-1.5 py-0.5 rounded border border-brand-cyan/30">
                                Owner
                              </span>
                            )}
                          </div>
                          <div className="text-slate-400 font-mono text-[10px] mt-0.5 flex items-center gap-1">
                            <Mail className="w-2.5 h-2.5" />
                            <span>{user.email || 'No email provided'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${
                            user.tier === 'consultation' 
                              ? 'bg-amber-950/50 text-amber-300 border-amber-500/30'
                              : user.tier === 'monthly'
                              ? 'bg-cyan-950/50 text-cyan-300 border-cyan-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {user.tier === 'consultation' ? 'VIP Consultation' : user.tier === 'monthly' ? 'Monthly OS' : 'Free Tier'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-white">
                          {user.logins || 1}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-cyan-400">
                          {user.generations || 0}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-[10px] text-slate-400">
                          {user.lastActive ? new Date(user.lastActive).toLocaleDateString(undefined, {
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
              Last {stats.events.length} system actions
            </span>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 rounded-xl bg-slate-950/40 p-3 border border-slate-800/80">
            {stats.events.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 font-mono">
                No recent activity events recorded. Logins and generations will appear here automatically.
              </div>
            ) : (
              stats.events.map((evt) => (
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

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Telemetry automatically updates upon user login, content generation, and audit completion.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            Close Telemetry
          </button>
        </div>
      </div>
    </div>
  );
}
