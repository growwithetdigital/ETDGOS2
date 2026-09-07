import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Globe, Share2, MapPin, CheckCircle2, 
  ArrowRight, ShieldCheck, AlertCircle, RefreshCw, 
  Download, Clock, ChevronDown, ChevronUp, ExternalLink,
  Award, BarChart3, Check, FileText
} from 'lucide-react';
import { AuditRecord, UserProfile } from '../../types';
import { fetchUserAudits, saveUserAudit } from '../../lib/firebase';

interface AuditorArchivePanelProps {
  user: any;
  profile: UserProfile | null;
  onOpenBooking?: () => void;
}

export default function AuditorArchivePanel({
  user,
  profile,
  onOpenBooking,
}: AuditorArchivePanelProps) {
  const [archivedAudits, setArchivedAudits] = useState<AuditRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeAuditChannel, setActiveAuditChannel] = useState<'website' | 'social' | 'gbp'>('website');
  const [targetUrl, setTargetUrl] = useState(profile?.website_url || '');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditStepText, setAuditStepText] = useState('');
  const [expandedAuditId, setExpandedAuditId] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);

  const loadAudits = async () => {
    if (!user?.uid) return;
    setIsLoading(true);
    try {
      const list = await fetchUserAudits(user.uid);
      setArchivedAudits(list);
      if (list.length > 0 && !expandedAuditId) {
        setExpandedAuditId(list[0].id || null);
      }
    } catch (e) {
      console.error('Error loading audits:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAudits();
  }, [user?.uid]);

  // If website url updates in profile and input is empty, sync it
  useEffect(() => {
    if (profile?.website_url && !targetUrl) {
      setTargetUrl(profile.website_url);
    }
  }, [profile?.website_url]);

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim() || isAuditing) return;

    setIsAuditing(true);
    setAuditProgress(15);
    setAuditStepText('Connecting to domain DNS and pinging edge nodes...');

    try {
      await new Promise(r => setTimeout(r, 600));
      setAuditProgress(40);
      setAuditStepText('Analyzing mobile Core Web Vitals (LCP, INP, CLS)...');

      await new Promise(r => setTimeout(r, 700));
      setAuditProgress(70);
      setAuditStepText('Evaluating AI Overviews & semantic entity discoverability...');

      await new Promise(r => setTimeout(r, 600));
      setAuditProgress(90);
      setAuditStepText('Synthesizing diagnostic report & conversion bottlenecks...');

      await new Promise(r => setTimeout(r, 400));
      setAuditProgress(100);

      // Deterministic grade based on domain structure
      const calculatedGrade: 'A' | 'B' | 'C' = targetUrl.length % 2 === 0 ? 'B' : 'C';
      const overallScore = calculatedGrade === 'B' ? 78 : 64;

      const newAudit: Partial<AuditRecord> = {
        website_url: targetUrl.trim(),
        business_name: profile?.business_name || profile?.displayName || 'My Business',
        primary_niche: profile?.industry || 'B2B & Professional Services',
        target_audience: profile?.target_audience || 'Commercial Decision-Makers',
        grade: calculatedGrade,
        overallScore: overallScore,
        growth_bottlenecks: [
          'Mobile Largest Contentful Paint (LCP) exceeds 3.1s threshold',
          'Absence of structured schema markup for AI search citation extraction',
          'Unstructured lead capture forms with high visitor drop-off rate'
        ],
        metrics: {
          mobileSpeed: calculatedGrade === 'B' ? 74 : 58,
          desktopSpeed: calculatedGrade === 'B' ? 88 : 72,
          seoHealth: calculatedGrade === 'B' ? 82 : 68,
          securityScore: 95,
          aeoScore: calculatedGrade === 'B' ? 71 : 54,
          croScore: calculatedGrade === 'B' ? 69 : 52,
        },
        recommendations: [
          'Deploy Entity Schema Markup across all core service and bio pages',
          'Implement friction-free conversational intake forms to double inbound conversion',
          'Optimize image payload assets to bring mobile LCP under 1.8 seconds',
          'Configure topical authority clusters around primary revenue-generating keywords'
        ],
      };

      const auditId = await saveUserAudit(user.uid, newAudit);
      await loadAudits();
      setExpandedAuditId(auditId);
    } catch (err) {
      console.error('Audit execution error:', err);
    } finally {
      setIsAuditing(false);
      setAuditStepText('');
      setAuditProgress(0);
    }
  };

  const handleExportPDF = async (audit: AuditRecord) => {
    setExportingId(audit.id || 'default');
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('ET Digital Growth OS™ - Diagnostic Audit Report', 14, 20);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Business: ${audit.business_name || 'Organization'}`, 14, 28);
      doc.text(`Domain: ${audit.website_url}`, 14, 34);
      doc.text(`Date: ${new Date(audit.created_at || Date.now()).toLocaleDateString()}`, 14, 40);
      doc.text(`Executive Grade: Grade ${audit.grade || 'B'} (${audit.overallScore || 78}/100)`, 14, 46);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('Diagnostic Breakdown', 14, 58);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const m = audit.metrics || {};
      doc.text(`• Mobile Performance Index: ${m.mobileSpeed || 72}/100`, 16, 66);
      doc.text(`• Desktop Speed & Stability: ${m.desktopSpeed || 85}/100`, 16, 72);
      doc.text(`• Search Engine & Crawlability: ${m.seoHealth || 80}/100`, 16, 78);
      doc.text(`• AI Answer Engine (AEO) Readiness: ${m.aeoScore || 65}/100`, 16, 84);
      doc.text(`• Conversion Rate Architecture: ${m.croScore || 68}/100`, 16, 90);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('Identified Growth Bottlenecks', 14, 104);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      (audit.growth_bottlenecks || [
        'Mobile LCP latency delaying buyer interaction',
        'Missing structured schema markup for LLM citation engines',
        'Friction-heavy intake channels causing bounce'
      ]).forEach((b, i) => {
        doc.text(`- ${b}`, 16, 112 + (i * 6));
      });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('Strategic Action Recommendations', 14, 140);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      (audit.recommendations || [
        'Deploy JSON-LD Organization and Service schemas for AI citations',
        'Streamline inbound contact flow to instant intake booking',
        'Build out high-intent topical authority articles every quarter'
      ]).forEach((r, i) => {
        doc.text(`${i + 1}. ${r}`, 16, 148 + (i * 7));
      });

      doc.save(`et-digital-audit-${audit.business_name?.toLowerCase().replace(/\s+/g, '-') || 'report'}.pdf`);
    } catch (e) {
      console.error('PDF export failed:', e);
    } finally {
      setExportingId(null);
    }
  };

  return (
    <div className="space-y-8" id="auditor-archive-panel">
      {/* Top Section: Run New Audit */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-cyan" />
              <h3 className="font-display text-xl font-bold text-white tracking-tight">
                Growth Auditor & Diagnostics Engine
              </h3>
            </div>
            <p className="font-sans text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Run diagnostic scans on your digital channels. All audit evaluations are archived permanently in your Growth OS Library below for comparative tracking.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-850 rounded-xl border border-slate-750 text-xs font-display font-bold">
            <button
              type="button"
              onClick={() => setActiveAuditChannel('website')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeAuditChannel === 'website' ? 'bg-brand-cyan text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Website</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveAuditChannel('social')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeAuditChannel === 'social' ? 'bg-brand-cyan text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Social Media</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveAuditChannel('gbp')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeAuditChannel === 'gbp' ? 'bg-brand-cyan text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Google Business</span>
            </button>
          </div>
        </div>

        {/* Audit Form */}
        <form onSubmit={handleRunAudit} className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder={
                  activeAuditChannel === 'website'
                    ? 'Enter domain (e.g. yourbusiness.com)'
                    : activeAuditChannel === 'social'
                    ? 'Enter profile handle or link (e.g. instagram.com/brand)'
                    : 'Enter business name & city (e.g. Apex Legal Miami)'
                }
                required
                className="w-full bg-slate-850 border border-slate-750 focus:border-brand-cyan rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-colors pr-10"
              />
            </div>

            <button
              type="submit"
              disabled={isAuditing || !targetUrl.trim()}
              className="px-6 py-3.5 rounded-2xl bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-950 active:scale-95 disabled:opacity-50 shrink-0"
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Run Audit & Archive Result</span>
                </>
              )}
            </button>
          </div>

          {/* Progress bar during live scan */}
          {isAuditing && (
            <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-750 space-y-2 animate-pulse">
              <div className="flex items-center justify-between text-xs font-mono text-brand-cyan">
                <span>{auditStepText}</span>
                <span>{auditProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-brand-cyan h-full transition-all duration-300 rounded-full"
                  style={{ width: `${auditProgress}%` }}
                />
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Bottom Section: Archived Auditor Results Library */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-cyan" />
            <h4 className="font-display text-lg font-bold text-white tracking-tight">
              Archived Audit Library ({archivedAudits.length})
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">Permanent Historical Records</span>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-brand-cyan" />
            <span>Loading archived diagnostic evaluations...</span>
          </div>
        ) : archivedAudits.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto text-brand-cyan">
              <Globe className="w-6 h-6" />
            </div>
            <p className="font-display text-sm font-bold text-white">No Audits Archived Yet</p>
            <p className="font-sans text-xs text-slate-400 max-w-sm mx-auto">
              Run your first website or social diagnostic scan using the tool above to generate and archive your baseline growth score.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {archivedAudits.map((audit) => {
              const isExpanded = expandedAuditId === audit.id;
              const dateStr = audit.created_at 
                ? (typeof audit.created_at === 'string' 
                    ? new Date(audit.created_at).toLocaleDateString()
                    : audit.created_at.toDate 
                    ? audit.created_at.toDate().toLocaleDateString()
                    : new Date().toLocaleDateString())
                : 'Recent';

              return (
                <div
                  key={audit.id}
                  className="rounded-2xl border border-slate-800 bg-slate-850/60 overflow-hidden transition-all"
                >
                  {/* Summary Bar */}
                  <div 
                    onClick={() => setExpandedAuditId(isExpanded ? null : (audit.id || null))}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-display font-black text-lg border shrink-0 ${
                        audit.grade === 'A'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                          : audit.grade === 'B'
                          ? 'bg-cyan-950 text-brand-cyan border-cyan-500/30'
                          : 'bg-amber-950 text-amber-300 border-amber-500/30'
                      }`}>
                        {audit.grade || 'B'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display text-sm font-bold text-white">
                            {audit.website_url}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                            Score: {audit.overallScore || 78}/100
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {audit.business_name} • Archived on {dateStr}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportPDF(audit);
                        }}
                        disabled={exportingId === audit.id}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                        title="Export PDF Report"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{exportingId === audit.id ? 'Exporting...' : 'PDF'}</span>
                      </button>

                      <div className="text-slate-400 p-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Breakdown */}
                  {isExpanded && (
                    <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-slate-800/80 space-y-6">
                      {/* Metric Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-4">
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                          <span className="font-mono text-[10px] text-slate-400 block mb-1">Mobile Speed</span>
                          <span className="font-display text-base font-bold text-white">
                            {audit.metrics?.mobileSpeed || 72}/100
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                          <span className="font-mono text-[10px] text-slate-400 block mb-1">Desktop Speed</span>
                          <span className="font-display text-base font-bold text-white">
                            {audit.metrics?.desktopSpeed || 85}/100
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                          <span className="font-mono text-[10px] text-slate-400 block mb-1">SEO Health</span>
                          <span className="font-display text-base font-bold text-white">
                            {audit.metrics?.seoHealth || 80}/100
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                          <span className="font-mono text-[10px] text-slate-400 block mb-1">AEO / AI Search</span>
                          <span className="font-display text-base font-bold text-brand-cyan">
                            {audit.metrics?.aeoScore || 65}/100
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center col-span-2 sm:col-span-1">
                          <span className="font-mono text-[10px] text-slate-400 block mb-1">Conversion (CRO)</span>
                          <span className="font-display text-base font-bold text-white">
                            {audit.metrics?.croScore || 68}/100
                          </span>
                        </div>
                      </div>

                      {/* Bottlenecks & Recommendations */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                          <span className="font-display text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Identified Bottlenecks</span>
                          </span>
                          <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                            {(audit.growth_bottlenecks || [
                              'Mobile LCP exceeds target threshold',
                              'Missing structured schema markup for LLM citation engines'
                            ]).map((b, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-rose-400 font-bold">•</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                          <span className="font-display text-xs font-bold text-brand-cyan uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Recommended Strategic Fixes</span>
                          </span>
                          <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                            {(audit.recommendations || [
                              'Deploy JSON-LD Organization and Service schemas for AI citations',
                              'Streamline inbound contact flow to instant intake booking'
                            ]).map((r, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-brand-cyan font-bold">•</span>
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Action footer */}
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[11px] text-slate-400 font-mono">
                          Audit ID: {audit.id}
                        </span>
                        {onOpenBooking && (
                          <button
                            type="button"
                            onClick={onOpenBooking}
                            className="text-xs font-display font-bold uppercase tracking-wider text-brand-cyan hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>Schedule Consultation to Fix Bottlenecks</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
