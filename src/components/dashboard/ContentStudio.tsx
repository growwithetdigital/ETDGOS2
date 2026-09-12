import React, { useState, useMemo } from 'react';
import { 
  Sparkles, Copy, Check, Share2, Download, ExternalLink, 
  RefreshCw, FileText, Linkedin, Facebook, Instagram, 
  Mail, MapPin, CheckCircle2, Lock, ArrowRight,
  Send, Compass, Layers, ShieldCheck, Zap, TrendingUp,
  Target, Crown
} from 'lucide-react';
import XIcon from '../icons/XIcon';
import { GeneratedContentItem, UserProfile } from '../../types';
import { 
  stripMarkdownFormatting, 
  CURATED_NATURAL_PHOTOS, 
  generate300WordBlogPost,
  generateSingleSocialCaption,
  generate150WordEblast,
  generateGbpPost,
  getNichePhotoForBusiness
} from '../../utils/contentEngineHelpers';
import EditorialThumbnailCard from './EditorialThumbnailCard';

interface ContentStudioProps {
  item: GeneratedContentItem;
  profile: UserProfile | null;
  onUpdatePhoto?: (photoUrl: string) => void;
  onOpenBooking?: () => void;
  onNavigateToBrandDna?: () => void;
}

export default function ContentStudio({
  item,
  profile,
  onUpdatePhoto,
  onOpenBooking,
  onNavigateToBrandDna,
}: ContentStudioProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Profile completion check
  const isProfileComplete = Boolean(
    profile?.website_url && 
    (profile?.brand_dna?.voice_archetype || profile?.business_name || profile?.industry)
  );

  const businessName = profile?.business_name || profile?.displayName || 'My Brand';
  const location = profile?.location || 'Local & National';
  const clientWebsite = profile?.website_url && !profile.website_url.includes('growwithetdigital.com')
    ? profile.website_url.trim()
    : '';

  // 1. The 1 Blog Post (Up to 300 words, SEO/AEO optimized in Brand DNA)
  const blogPost = useMemo(() => {
    // If the item has a fresh 300-word post use it, otherwise generate based on profile
    if (item.blog_post && item.blog_post.word_count && item.blog_post.word_count <= 320) {
      return item.blog_post;
    }
    return generate300WordBlogPost(profile);
  }, [item, profile]);

  const cleanBlogBody = useMemo(() => {
    return stripMarkdownFormatting(blogPost.markdown_content);
  }, [blogPost.markdown_content]);

  // 2. The 1 Social Caption (Generated only once profile is complete)
  const socialCaptionData = useMemo(() => {
    if (!isProfileComplete) return null;
    return generateSingleSocialCaption(profile, blogPost.title);
  }, [isProfileComplete, profile, blogPost.title]);

  // 3. The 1 150-Word Eblast
  const eblastData = useMemo(() => {
    return generate150WordEblast(profile, blogPost.title);
  }, [profile, blogPost.title]);

  // 4. The 1 Google Business Profile (GBP) Post
  const gbpData = useMemo(() => {
    return generateGbpPost(profile, blogPost.title);
  }, [profile, blogPost.title]);

  // Unified Text Bundle for "Copy All Text"
  const allTextBundle = useMemo(() => {
    return `=== BLOG POST (UP TO 300 WORDS) ===
TITLE: ${blogPost.title}
KEYWORD: ${blogPost.target_keyword}
WORD COUNT: ${blogPost.word_count || 285} words

${cleanBlogBody}

=== 1 SOCIAL MEDIA CAPTION ===
${socialCaptionData ? socialCaptionData.caption : 'Complete Brand DNA to calibrate social caption.'}

=== 1 150-WORD EBLAST ===
SUBJECT: ${eblastData.subject}
PREVIEW: ${eblastData.preview}

${eblastData.body}

=== 1 GOOGLE BUSINESS PROFILE (GBP) POST ===
${gbpData.content}
CTA: ${gbpData.call_to_action}
TARGET: ${gbpData.target_keyword}
`;
  }, [blogPost, cleanBlogBody, socialCaptionData, eblastData, gbpData]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  // Direct Social Share URLs (Copies caption and opens platform without scraping Eric's site/headshot)
  const handleSharePlatform = (platform: 'x' | 'instagram' | 'facebook' | 'linkedin') => {
    const caption = socialCaptionData?.caption || `${blogPost.title} — ${businessName}`;
    copyToClipboard(caption, `share-${platform}`);

    if (platform === 'x') {
      const text = socialCaptionData?.caption
        ? `${socialCaptionData.hook}\n\n"${blogPost.title}"\n`
        : `${blogPost.title} — ${businessName}\n`;
      const xUrl = clientWebsite
        ? `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(clientWebsite)}`
        : `https://x.com/intent/post?text=${encodeURIComponent(text)}`;
      window.open(xUrl, '_blank', 'noopener,noreferrer');
    } else if (platform === 'instagram') {
      window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
    } else if (platform === 'facebook') {
      if (clientWebsite) {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(clientWebsite)}`, '_blank', 'noopener,noreferrer');
      } else {
        window.open('https://www.facebook.com/', '_blank', 'noopener,noreferrer');
      }
    } else if (platform === 'linkedin') {
      if (clientWebsite) {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(clientWebsite)}`, '_blank', 'noopener,noreferrer');
      } else {
        window.open('https://www.linkedin.com/feed/', '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <div className="space-y-6 text-left" id="content-studio-os">
      
      {/* Apple OS Style Header Bar */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-500 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
              Content Studio
            </span>
            <span className="font-mono text-[10px] text-[var(--muted)] px-2 py-0.5 rounded-full bg-[var(--surface2)] border border-[var(--border)]">
              1-Asset Operating Standard
            </span>
            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3 h-3" />
              SEO & AEO Calibrated
            </span>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-[var(--text)]">
            Your 1-Asset Growth Kit
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[var(--muted)] max-w-2xl leading-relaxed">
            Exactly 1 authority blog post, 1 branded editorial graphic, 1 social caption, 1 150-word eblast, and 1 GBP update tailored to {businessName}.
          </p>
        </div>

        {/* Global Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => copyToClipboard(allTextBundle, 'all-kit')}
            className="px-4 py-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface2)] hover:bg-[var(--border)] text-[var(--text)] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            {copiedKey === 'all-kit' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">All Text Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-500" />
                <span>Copy Entire Kit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main OS Grid: Left = 1:1 Graphic & 300-Word Blog Post (7 cols); Right = Social, Eblast, GBP & Pillars (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 1:1 Image Generator & 300-Word Blog Post */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Asset 1: 1:1 Branded Editorial Graphic & Image Generator */}
          <EditorialThumbnailCard
            title={blogPost.title}
            previewQuote={
              profile?.mission_statement
                ? `Modern decision-makers in ${location} choose verified authority: "${profile.mission_statement}".`
                : `Modern decision-makers in ${location} choose verified proof and transparent solutions over marketing noise.`
            }
            category="AUTHORITY BRIEFING"
            profile={profile}
            allTextToCopy={allTextBundle}
            socialCaptionToShare={socialCaptionData?.caption}
          />

          {/* Asset 2: 1 Blog Post (Up to 300 Words, SEO/AEO Optimized) */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 space-y-5 shadow-sm">
            
            {/* Header with Word Count & AEO Badge */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-500">
                    1 Evergreen Blog Post
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 font-semibold border border-cyan-500/30">
                    {blogPost.word_count || 285} Words (Up to 300)
                  </span>
                  <span className="text-[10px] font-mono text-[var(--muted)]">
                    · {blogPost.read_time || '1.5 Min Read'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-[var(--text)] tracking-tight">
                  {blogPost.title}
                </h3>
              </div>

              {/* 1-Click Copy Blog Post */}
              <button
                type="button"
                onClick={() => copyToClipboard(`${blogPost.title}\n\n${cleanBlogBody}`, 'blog-post')}
                className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-cyan-500/30 shrink-0"
              >
                {copiedKey === 'blog-post' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Blog Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Blog Post</span>
                  </>
                )}
              </button>
            </div>

            {/* Keyword Entity Target */}
            <div className="p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-cyan-500" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold">
                  AEO & SEO Target:
                </span>
                <span className="font-mono text-xs text-[var(--text)] font-bold">
                  "{blogPost.target_keyword}"
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                Direct Answer Entity
              </span>
            </div>

            {/* Blog Post Content (Clean, formatted paragraphs without markdown noise) */}
            <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm text-[var(--text)] leading-relaxed space-y-4">
              {cleanBlogBody.split('\n\n').map((paragraph, index) => (
                <p key={index} className="leading-relaxed font-sans">
                  {paragraph}
                </p>
              ))}
            </div>

          </div>

        </div>

        {/* Right Column: Syndication Suite (Social Caption, 150-Word Eblast, GBP Post) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Asset 3: 1 Engaging Social Media Caption */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-500">
                  1 Social Media Caption
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 font-semibold border border-cyan-500/20">
                  Feed Angle
                </span>
              </div>

              {isProfileComplete && socialCaptionData && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(socialCaptionData.caption, 'social-caption')}
                  className="text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'social-caption' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'social-caption' ? 'Copied' : 'Copy Caption'}</span>
                </button>
              )}
            </div>

            {/* Gated: Not generated until user completes profile */}
            {!isProfileComplete ? (
              <div className="p-6 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] text-center space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mx-auto">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-sm font-bold text-[var(--text)]">
                    Calibrated Caption Locked
                  </h4>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    Enter your website URL in Brand DNA to calibrate this social caption to your authentic tone of voice.
                  </p>
                </div>
                {onNavigateToBrandDna && (
                  <button
                    type="button"
                    onClick={onNavigateToBrandDna}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer hover:bg-cyan-400"
                  >
                    <span>Complete Website DNA</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              socialCaptionData && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] leading-relaxed whitespace-pre-line font-sans">
                    {socialCaptionData.caption}
                  </div>

                  {/* 1-Click Platform Share Icons */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-wider font-semibold">
                      Publish Directly:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSharePlatform('linkedin')}
                        title="Share on LinkedIn"
                        className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface2)] hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/40 text-[#0A66C2] transition-all cursor-pointer"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSharePlatform('x')}
                        title="Share on X"
                        className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface2)] hover:bg-cyan-500/10 hover:border-cyan-500/40 text-[var(--text)] transition-all cursor-pointer"
                      >
                        <XIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSharePlatform('facebook')}
                        title="Share on Facebook"
                        className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface2)] hover:bg-[#1877F2]/10 hover:border-[#1877F2]/40 text-[#1877F2] transition-all cursor-pointer"
                      >
                        <Facebook className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSharePlatform('instagram')}
                        title="Share on Instagram"
                        className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface2)] hover:bg-pink-500/10 hover:border-pink-500/40 text-[#E4405F] transition-all cursor-pointer"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Asset 4: 1 150-Word Eblast */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  1 150-Word Eblast
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold border border-purple-500/20">
                  ~{eblastData.word_count} Words
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:?subject=${encodeURIComponent(eblastData.subject)}&body=${encodeURIComponent(eblastData.body)}`}
                  className="text-xs font-mono text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                  title="Open draft in default mail app"
                >
                  <Send className="w-3 h-3" />
                  <span className="hidden sm:inline">Open Mail</span>
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard(`Subject: ${eblastData.subject}\n\n${eblastData.body}`, 'eblast')}
                  className="text-xs font-mono text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'eblast' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'eblast' ? 'Copied' : 'Copy Eblast'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold block mb-0.5">
                  Subject Line
                </span>
                <span className="font-display font-bold text-[var(--text)]">
                  {eblastData.subject}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] leading-relaxed whitespace-pre-line font-sans">
                {eblastData.body}
              </div>
            </div>
          </div>

          {/* Asset 5: 1 Google Business Profile (GBP) Post */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  1 Google Business Profile Post
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold border border-amber-500/20">
                  Local SEO
                </span>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(gbpData.content, 'gbp')}
                className="text-xs font-mono text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'gbp' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'gbp' ? 'Copied' : 'Copy GBP'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] leading-relaxed font-sans space-y-2">
              <p>{gbpData.content}</p>
              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono text-[var(--muted)]">
                <span>CTA Button: <strong className="text-[var(--text)]">{gbpData.call_to_action}</strong></span>
                <span>Links to your website</span>
              </div>
            </div>
          </div>

          {/* Executive Value Tier & VIP Retainer Bridge */}
          <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[var(--surface)] via-[var(--surface2)] to-cyan-950/20 p-6 space-y-3 text-left shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text)] font-bold">
                  Executive Starter Dispatch Active · $2,500/Mo Architecture
                </span>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-500/30">
                1 Calibrated 5-Asset Suite Complete
              </span>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed font-sans">
              Your free tier provides a complete, broadcast-ready asset kit calibrated from your authentic Brand DNA. To expand from 1 monthly piece into an omni-channel compounding authority machine with <strong>4 weekly tailored dispatches, custom syndication, and private 1-on-1 CMO strategy sessions with our team</strong>, explore the VIP Monthly Retainer.
            </p>
            {onOpenBooking && (
              <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-display text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span>Explore VIP Retainer ($2,500/mo)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-[var(--muted)] hidden sm:inline">
                  Done-For-You Execution · Direct with Founder
                </span>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
