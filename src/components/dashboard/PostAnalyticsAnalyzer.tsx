import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, Download, Check, 
  Sparkles, Layers, Users, MousePointerClick, 
  PhoneCall, ShieldCheck, ArrowUpRight, Share2,
  Calendar, Award, RefreshCw, HelpCircle
} from 'lucide-react';
import { UserProfile } from '../../types';

interface PostAnalyticsRecord {
  id: string;
  platform: string;
  postTitle: string;
  date: string;
  reach: number;
  engagements: number;
  clicks: number;
  leads: number;
  engagementRate: number;
  ctr: number;
  conversionRate: number;
  authorityScore: number;
  analysisTakeaway: string;
}

interface PostAnalyticsAnalyzerProps {
  profile: UserProfile | null;
  onOpenBooking: () => void;
}

export default function PostAnalyticsAnalyzer({
  profile,
  onOpenBooking,
}: PostAnalyticsAnalyzerProps) {
  const businessName = profile?.business_name || profile?.displayName || 'My Business';
  const location = profile?.location || 'Local & National';

  // Form input states
  const [platform, setPlatform] = useState('LinkedIn');
  const [postTitle, setPostTitle] = useState('Why Category Proof Beats Marketing Noise');
  const [reach, setReach] = useState<number>(3250);
  const [engagements, setEngagements] = useState<number>(182);
  const [clicks, setClicks] = useState<number>(64);
  const [leads, setLeads] = useState<number>(8);

  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Computed metrics
  const calculatedReach = Math.max(1, reach);
  const calculatedClicks = Math.max(1, clicks);

  const engagementRate = Number(((engagements / calculatedReach) * 100).toFixed(2));
  const ctr = Number(((clicks / calculatedReach) * 100).toFixed(2));
  const conversionRate = Number(((leads / calculatedClicks) * 100).toFixed(2));

  // Balanced Authority Performance Score (0-100)
  const authorityScore = Math.min(
    99,
    Math.round(
      Math.min(45, (engagementRate / 3.5) * 35) +
      Math.min(30, (ctr / 2.0) * 25) +
      Math.min(25, (leads / 5) * 20) +
      15
    )
  );

  // Humanized, conversational analysis in plain English
  const getPlainEnglishAnalysis = () => {
    let summary = '';
    if (engagementRate >= 4.0) {
      summary += `Your content struck a real chord on ${platform}. With an engagement rate of ${engagementRate}%, people didn't just scroll past—they stopped, read, and interacted. That shows strong resonance with the problem you highlighted. `;
    } else if (engagementRate >= 2.0) {
      summary += `Good, steady engagement at ${engagementRate}% on ${platform}. Your core message is landing, though testing a stronger contrarian hook in your opening line could bump your reach even higher. `;
    } else {
      summary += `Engagement came in at ${engagementRate}%. To get more traction on ${platform}, try leading directly with a specific client story or addressing an urgent frustration in your first sentence. `;
    }

    if (conversionRate >= 10.0) {
      summary += `The standout win here is your ${conversionRate}% inquiry conversion: when people clicked through to your site, they trusted you enough to take action. `;
    } else {
      summary += `You drove ${clicks} qualified visits to your site. Ensuring your landing page has a clear, zero-friction scheduling link will turn even more of that curiosity into booked conversations. `;
    }

    summary += `Next step: double down on this topic in your upcoming newsletter and link directly to your schedule.`;
    return summary;
  };

  const takeawayText = getPlainEnglishAnalysis();

  // Export branded ET Digital Graphic (PNG via Canvas)
  const handleDownloadBrandedGraphic = () => {
    setIsExporting(true);
    try {
      const width = 1200;
      const height = 675; // 16:9 widescreen presentation card
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get 2d context');

      // 1. Dark executive backdrop
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#090D16');
      grad.addColorStop(0.5, '#0F172A');
      grad.addColorStop(1, '#060A12');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle cyan glow in top right
      const glow = ctx.createRadialGradient(width - 150, 150, 20, width - 150, 150, 400);
      glow.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
      glow.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // Border outline
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(36, 36, width - 72, height - 72);

      // 2. Header Brand Mark: ET DIGITAL
      // Render ET mark
      ctx.fillStyle = '#06B6D4';
      ctx.fillRect(72, 70, 36, 36);
      ctx.fillStyle = '#090D16';
      ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('ET', 79, 96);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px ui-monospace, monospace';
      ctx.fillText('DIGITAL', 72, 120);

      // Header labels
      ctx.fillStyle = '#06B6D4';
      ctx.font = 'bold 14px ui-monospace, monospace';
      ctx.fillText('CAMPAIGN PERFORMANCE & STRATEGIC ROI REPORT', 130, 88);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(`Client: ${businessName} · ${location} · Platform: ${platform}`, 130, 108);

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 12px ui-monospace, monospace';
      ctx.textAlign = 'right';
      ctx.fillText('ENGAGE · CONVERT · GROW', width - 72, 88);
      ctx.textAlign = 'left';

      // Divider line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(72, 140);
      ctx.lineTo(width - 72, 140);
      ctx.stroke();

      // 3. Post Title Header
      ctx.fillStyle = '#E2E8F0';
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`"${postTitle}"`, 72, 180);

      // 4. Four Metric Scorecards
      const cardWidth = 240;
      const cardHeight = 110;
      const startX = 72;
      const startY = 215;
      const gap = 28;

      const metricsList = [
        { label: 'TOTAL REACH / IMPRESSIONS', val: reach.toLocaleString(), sub: 'Verified audience exposure' },
        { label: 'ENGAGEMENT RATE', val: `${engagementRate}%`, sub: 'vs 1.8% industry avg' },
        { label: 'WEBSITE CLICKS', val: clicks.toString(), sub: `${ctr}% click-through rate` },
        { label: 'DIRECT INQUIRIES', val: leads.toString(), sub: `${conversionRate}% conversion rate` },
      ];

      metricsList.forEach((m, idx) => {
        const x = startX + idx * (cardWidth + gap);
        // Card background
        ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
        ctx.fillRect(x, startY, cardWidth, cardHeight);
        ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, startY, cardWidth, cardHeight);

        // Label
        ctx.fillStyle = '#94A3B8';
        ctx.font = 'bold 10px ui-monospace, monospace';
        ctx.fillText(m.label, x + 16, startY + 28);

        // Value
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText(m.val, x + 16, startY + 68);

        // Subtext
        ctx.fillStyle = '#38BDF8';
        ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText(m.sub, x + 16, startY + 92);
      });

      // 5. Strategic Takeaways Box
      const boxY = 355;
      const boxHeight = 155;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(72, boxY, width - 144, boxHeight);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(72, boxY, width - 144, boxHeight);

      // Score badge inside box
      ctx.fillStyle = '#06B6D4';
      ctx.font = 'bold 11px ui-monospace, monospace';
      ctx.fillText('ET DIGITAL STRATEGIC SYNTHESIS & NEXT MOVES', 96, boxY + 34);

      // Authority score pill
      ctx.fillStyle = 'rgba(6, 182, 212, 0.18)';
      ctx.fillRect(width - 290, boxY + 16, 194, 28);
      ctx.strokeStyle = '#06B6D4';
      ctx.strokeRect(width - 290, boxY + 16, 194, 28);
      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 11px ui-monospace, monospace';
      ctx.fillText(`AUTHORITY SCORE: ${authorityScore}/100`, width - 276, boxY + 35);

      // Takeaway body
      ctx.fillStyle = '#CBD5E1';
      ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      
      const words = takeawayText.split(' ');
      let currentLine = '';
      let textY = boxY + 68;
      const maxTextWidth = width - 192;

      for (let n = 0; n < words.length; n++) {
        const testLine = currentLine + words[n] + ' ';
        const m = ctx.measureText(testLine);
        if (m.width > maxTextWidth && n > 0) {
          ctx.fillText(currentLine.trim(), 96, textY);
          currentLine = words[n] + ' ';
          textY += 24;
        } else {
          currentLine = testLine;
        }
      }
      ctx.fillText(currentLine.trim(), 96, textY);

      // 6. Footer Call-to-Action
      const footerY = 545;
      ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.fillRect(72, footerY, width - 144, 60);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.strokeRect(72, footerY, width - 144, 60);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Want to turn content engagement into predictable, high-ticket clients?', 96, footerY + 36);

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 13px ui-monospace, monospace';
      ctx.textAlign = 'right';
      ctx.fillText('BOOK STRATEGY CONSULTATION: growwithetdigital.com', width - 96, footerY + 36);
      ctx.textAlign = 'left';

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) throw new Error('Canvas conversion failed');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const safeSlug = (businessName || 'client').toLowerCase().replace(/[^a-z0-9]/g, '-');
        a.download = `ET-Digital-Analytics-Report-${safeSlug}.png`;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3500);
        setIsExporting(false);
      }, 'image/png');

    } catch (e) {
      console.error('Error generating graphic:', e);
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 text-left" id="post-analytics-analyzer">
      
      {/* Top Console Card */}
      <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                Campaign Performance & ROI Tracker
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                Interactive Analyzer
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Post Performance & Conversion Analyzer
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Input the real metrics from your latest published post to uncover engagement rates, click-through efficacy, and download a custom ET Digital branded performance graphic.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleDownloadBrandedGraphic}
              disabled={isExporting}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              id="download-branded-analytics-btn"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Report Graphic Saved!</span>
                </>
              ) : (
                <>
                  <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
                  <span>Download Branded Graphic</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid: Input Form + Live Interactive Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="space-y-0.5">
              <h3 className="font-display text-sm font-bold text-[var(--text)] uppercase tracking-wider">
                Input Campaign Numbers
              </h3>
              <p className="text-xs text-[var(--muted)]">
                Enter your live reach, reactions, and clicks
              </p>
            </div>
            <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded">
              Step 1 of 2
            </span>
          </div>

          <div className="space-y-4 text-xs font-sans">
            {/* Platform Selector */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold">
                Platform / Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['LinkedIn', 'Instagram', 'Facebook', 'X', 'Eblast', 'GBP'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPlatform(item)}
                    className={`py-2 px-2.5 rounded-xl border font-mono text-[11px] font-bold transition-all cursor-pointer ${
                      platform === item
                        ? 'bg-cyan-500/15 border-cyan-500 text-cyan-600 dark:text-cyan-300 ring-1 ring-cyan-500'
                        : 'bg-[var(--surface2)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Campaign Headline */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold">
                Post / Campaign Topic
              </label>
              <input
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="e.g. 3 Lessons from Scaling High-Ticket Clients"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface2)] text-[var(--text)] font-sans text-xs focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Metric Inputs */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold flex items-center gap-1">
                  <Users className="w-3 h-3 text-cyan-500" />
                  <span>Total Reach</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={reach}
                  onChange={(e) => setReach(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface2)] text-[var(--text)] font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-500" />
                  <span>Engagements</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={engagements}
                  onChange={(e) => setEngagements(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface2)] text-[var(--text)] font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold flex items-center gap-1">
                  <MousePointerClick className="w-3 h-3 text-emerald-500" />
                  <span>Website Clicks</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={clicks}
                  onChange={(e) => setClicks(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface2)] text-[var(--text)] font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold flex items-center gap-1">
                  <PhoneCall className="w-3 h-3 text-amber-500" />
                  <span>Inquiries / Leads</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={leads}
                  onChange={(e) => setLeads(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface2)] text-[var(--text)] font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Computed Scorecards & Strategic Takeaways (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Bento Scorecards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[var(--muted)] block">Engagement Rate</span>
              <div className="text-xl font-mono font-bold text-[var(--text)]">{engagementRate}%</div>
              <span className="text-[10px] font-mono text-emerald-500 block font-semibold">
                {engagementRate >= 2.0 ? '✓ Above Benchmark' : '• Developing'}
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[var(--muted)] block">Click-Through</span>
              <div className="text-xl font-mono font-bold text-[var(--text)]">{ctr}%</div>
              <span className="text-[10px] font-mono text-cyan-500 block font-semibold">
                {clicks} site visits
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[var(--muted)] block">Lead Conversion</span>
              <div className="text-xl font-mono font-bold text-[var(--text)]">{conversionRate}%</div>
              <span className="text-[10px] font-mono text-purple-500 block font-semibold">
                {leads} direct inquiries
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-cyan-500/40 bg-cyan-500/10 space-y-1">
              <span className="text-[10px] font-mono uppercase text-cyan-600 dark:text-cyan-400 block font-bold">Authority Score</span>
              <div className="text-xl font-mono font-bold text-cyan-600 dark:text-cyan-300">{authorityScore}/100</div>
              <span className="text-[10px] font-mono text-cyan-500 block font-semibold">
                High Velocity
              </span>
            </div>
          </div>

          {/* Strategic Analysis & Plain-English Interpretation */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-500" />
                <h4 className="font-display text-sm font-bold text-[var(--text)] uppercase tracking-wider">
                  Strategic Analysis & Takeaway
                </h4>
              </div>
              <span className="text-[10px] font-mono text-[var(--muted)]">
                Humanized Feedback
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] leading-relaxed space-y-3">
              <p>{takeawayText}</p>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-[var(--muted)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                <span>Ready to download your graphic with ET Digital branding?</span>
              </div>

              <button
                type="button"
                onClick={handleDownloadBrandedGraphic}
                disabled={isExporting}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report Card (PNG)</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
