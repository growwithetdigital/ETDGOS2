import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, Copy, Check, Share2,
  Linkedin, Facebook, Instagram, 
  Mail, MapPin, CheckCircle2, Lock, ArrowRight,
  Send, ShieldCheck,
  AlertTriangle, Edit3, X, Eye, ExternalLink,
  Tag, Hash
} from 'lucide-react';
import XIcon from '../icons/XIcon';
import GoogleIcon from '../icons/GoogleIcon';
import { GeneratedContentItem, UserProfile } from '../../types';
import { 
  stripMarkdownFormatting, 
  generate300WordBlogPost,
  generateBlogPostTags,
  generateSingleSocialCaption,
  generateOptimizedSocialHashtags,
  generate150WordEblast,
  generateGbpPost,
  getIndustryResearchAndQuestion
} from '../../utils/contentEngineHelpers';
import EditorialThumbnailCard from './EditorialThumbnailCard';
import PostAnalyticsAnalyzer from './PostAnalyticsAnalyzer';
import { 
  getContentLockStatus, 
  markContentGenerated, 
  getRevisionsRemaining, 
  decrementRevisionsRemaining,
  getSavedContentRevisions,
  saveContentRevision,
  ContentRevisionData
} from '../../utils/downloadStorage';

interface ContentStudioProps {
  item: GeneratedContentItem;
  profile: UserProfile | null;
  user?: any;
  onRefreshProfile?: (updatedProfile?: UserProfile) => void;
  onUpdatePhoto?: (photoUrl: string) => void;
  onOpenBooking?: () => void;
  onNavigateToBrandDna?: () => void;
}

export default function ContentStudio({
  item,
  profile,
  user,
  onRefreshProfile,
  onOpenBooking,
  onNavigateToBrandDna,
}: ContentStudioProps) {
  const uid = user?.uid || profile?.uid || 'guest';
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 90-Day Lock & 3-Revision Operational States
  const [lockInfo, setLockInfo] = useState(() => getContentLockStatus(uid, profile));
  const [revisionsCount, setRevisionsCount] = useState(() => getRevisionsRemaining(uid, profile));
  const [savedRevisions, setSavedRevisions] = useState<ContentRevisionData | null>(() => getSavedContentRevisions(uid));
  
  // UI Dialog States
  const [showPreGenerateWarningModal, setShowPreGenerateWarningModal] = useState(false);
  const [showRevisionEditor, setShowRevisionEditor] = useState(false);
  const [showRevisionConfirmModal, setShowRevisionConfirmModal] = useState(false);
  const [gbpToast, setGbpToast] = useState(false);

  // Editable fields for Revision Modal
  const [draftBlogTitle, setDraftBlogTitle] = useState('');
  const [draftBlogBody, setDraftBlogBody] = useState('');
  const [draftSocialCaption, setDraftSocialCaption] = useState('');
  const [draftEblastSubject, setDraftEblastSubject] = useState('');
  const [draftEblastBody, setDraftEblastBody] = useState('');

  // Sync lock and revision states when profile/uid changes
  useEffect(() => {
    setLockInfo(getContentLockStatus(uid, profile));
    setRevisionsCount(getRevisionsRemaining(uid, profile));
    setSavedRevisions(getSavedContentRevisions(uid));
  }, [uid, profile]);

  const businessName = profile?.business_name || profile?.displayName || 'My Brand';
  const location = profile?.location || 'Local & National';
  const clientWebsite = profile?.website_url ? profile.website_url.trim() : '';

  // 1. The 1 Blog Post (Up to 300 words, SEO/AEO optimized in Brand DNA)
  const defaultBlogPost = useMemo(() => {
    if (item.blog_post && item.blog_post.word_count && item.blog_post.word_count <= 320) {
      return item.blog_post;
    }
    return generate300WordBlogPost(profile);
  }, [item, profile]);

  // Apply custom revision overrides if user saved any of their 3 revisions
  const blogTitle = savedRevisions?.blogTitle || defaultBlogPost.title;
  const cleanBlogBody = savedRevisions?.blogBody || stripMarkdownFormatting(defaultBlogPost.markdown_content);

  // Suggested Tags for the Blog Post (Contextual for WordPress / CMS backend tags)
  const blogTags = useMemo(() => {
    if (defaultBlogPost.suggested_tags && defaultBlogPost.suggested_tags.length > 0) {
      return defaultBlogPost.suggested_tags;
    }
    return generateBlogPostTags(blogTitle, defaultBlogPost.category || '', defaultBlogPost.target_keyword, profile);
  }, [defaultBlogPost, blogTitle, profile]);

  // 2. The 1 Social Caption
  const defaultSocialCaption = useMemo(() => {
    return generateSingleSocialCaption(profile, blogTitle);
  }, [profile, blogTitle]);
  const baseSocialCaption = savedRevisions?.socialCaption || defaultSocialCaption?.caption || `${blogTitle} — ${businessName}`;

  // Optimized Hashtags: strictly no more than 5 tags based on the text and copy provided for maximum reach & engagement
  const socialHashtags = useMemo(() => {
    return generateOptimizedSocialHashtags(baseSocialCaption, blogTitle, profile);
  }, [baseSocialCaption, blogTitle, profile]);

  // Ensure social media post text includes the suggested hashtags
  const socialCaptionText = useMemo(() => {
    if (!baseSocialCaption.includes('#') && socialHashtags.length > 0) {
      return `${baseSocialCaption}\n\n${socialHashtags.join(' ')}`;
    }
    return baseSocialCaption;
  }, [baseSocialCaption, socialHashtags]);

  // 3. The 1 150-Word Eblast
  const defaultEblast = useMemo(() => {
    return generate150WordEblast(profile, blogTitle);
  }, [profile, blogTitle]);
  const eblastSubject = savedRevisions?.eblastSubject || defaultEblast.subject;
  const eblastBody = savedRevisions?.eblastBody || defaultEblast.body;

  // 4. The 1 Google Business Profile (GBP) Post
  const gbpData = useMemo(() => {
    return generateGbpPost(profile, blogTitle);
  }, [profile, blogTitle]);

  // Unified Text Bundle for "Copy All Text"
  const allTextBundle = useMemo(() => {
    return `=== BLOG POST (UP TO 300 WORDS) ===
TITLE: ${blogTitle}
KEYWORD: ${defaultBlogPost.target_keyword}
SUGGESTED TAGS: ${blogTags.join(', ')}
WORD COUNT: ${defaultBlogPost.word_count || 285} words

${cleanBlogBody}

=== 1 SOCIAL MEDIA CAPTION ===
${socialCaptionText}
SUGGESTED HASHTAGS: ${socialHashtags.join(' ')}

=== 1 150-WORD EBLAST ===
SUBJECT: ${eblastSubject}
PREVIEW: ${defaultEblast.preview}

${eblastBody}

=== 1 GOOGLE BUSINESS PROFILE (GBP) POST ===
${gbpData.content}
CTA: ${gbpData.call_to_action}
TARGET: ${gbpData.target_keyword}
`;
  }, [blogTitle, defaultBlogPost, blogTags, cleanBlogBody, socialCaptionText, socialHashtags, eblastSubject, defaultEblast.preview, eblastBody, gbpData]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  // Direct Social Share URLs
  const handleSharePlatform = (platform: 'x' | 'instagram' | 'facebook' | 'linkedin') => {
    copyToClipboard(socialCaptionText, `share-${platform}`);

    if (platform === 'x') {
      const hashtagsStr = socialHashtags.join(' ');
      const text = `${defaultSocialCaption?.hook || ''}\n\n"${blogTitle}"\n\n${hashtagsStr}\n`;
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

  // Google Business Profile Direct Open & Copy
  const handleOpenGoogleBusiness = () => {
    copyToClipboard(gbpData.content, 'gbp');
    setGbpToast(true);
    setTimeout(() => setGbpToast(false), 5500);
    window.open('https://business.google.com/', '_blank', 'noopener,noreferrer');
  };

  // Action: First-time generation
  const handleConfirmGenerate = () => {
    markContentGenerated(uid);
    setLockInfo(getContentLockStatus(uid, profile));
    setRevisionsCount(3);
    setShowPreGenerateWarningModal(false);
  };

  // Action: Open Revision Editor
  const handleOpenRevisionEditor = () => {
    setDraftBlogTitle(blogTitle);
    setDraftBlogBody(cleanBlogBody);
    setDraftSocialCaption(socialCaptionText);
    setDraftEblastSubject(eblastSubject);
    setDraftEblastBody(eblastBody);
    setShowRevisionEditor(true);
  };

  // Action: Save Revision (consumes 1 revision)
  const handleApplyRevision = () => {
    if (revisionsCount <= 0) return;

    const remaining = decrementRevisionsRemaining(uid);
    const updatedData: ContentRevisionData = {
      blogTitle: draftBlogTitle.trim(),
      blogBody: draftBlogBody.trim(),
      socialCaption: draftSocialCaption.trim(),
      eblastSubject: draftEblastSubject.trim(),
      eblastBody: draftEblastBody.trim(),
    };

    saveContentRevision(uid, updatedData);
    setSavedRevisions(updatedData);
    setRevisionsCount(remaining);
    setShowRevisionConfirmModal(false);
    setShowRevisionEditor(false);
  };

  const isContentGenerated = Boolean(lockInfo.generatedAt);

  return (
    <div className="space-y-8 text-left" id="content-studio-os">
      
      {/* ==================================================================== */}
      {/* 1. PRE-GENERATION VERIFICATION SCREEN (Before initial generation) */}
      {/* ==================================================================== */}
      {!isContentGenerated ? (
        <div className="rounded-3xl border border-amber-500/30 bg-[var(--surface)] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                Pre-Generation Verification Required
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-[var(--text)] tracking-tight">
                Verify Your Business DNA Settings & Filters
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                Before generating your quarterly 1-Asset Growth Kit, ensure your business parameters and voice archetype are 100% accurate.
              </p>
            </div>
          </div>

          {/* Operational Rules Alert Box */}
          <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/25 space-y-3 font-sans text-xs text-[var(--text)]">
            <div className="font-mono text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Content Studio Operational Constraints
            </div>
            <ul className="space-y-2 text-xs text-[var(--muted)] list-disc pl-5 leading-relaxed">
              <li>
                <strong>No Re-generation:</strong> Once generated, your 1-Asset Growth Kit is generated for your quarterly publishing cadence.
              </li>
              <li>
                <strong>90-Day Generation Lock:</strong> Your account is locked for 90 days before the next quarterly asset kit can be produced.
              </li>
              <li>
                <strong>Strictly 3 Revisions:</strong> You will receive exactly 3 text revisions to edit and polish your blog, eblast, and social post before they are permanently locked.
              </li>
              <li>
                <strong>Automatic Downloads Vault:</strong> All high-resolution graphics downloaded from your studio are automatically preserved in your <strong>Downloads</strong> tab.
              </li>
            </ul>
          </div>

          {/* Current Business DNA Summary */}
          <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold block">
              Current Foundation DNA Parameters
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-[10px] font-mono text-[var(--muted)] uppercase block">Business Name</span>
                <span className="font-display font-bold text-[var(--text)]">{businessName}</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-[10px] font-mono text-[var(--muted)] uppercase block">Website</span>
                <span className="font-mono text-cyan-500 font-semibold truncate block">{profile?.website_url || 'Not set'}</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-[10px] font-mono text-[var(--muted)] uppercase block">Voice Archetype</span>
                <span className="font-display font-bold text-cyan-500">{profile?.brand_voice || profile?.selected_tone || 'Authoritative & Strategic'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[var(--border)]">
            {onNavigateToBrandDna && (
              <button
                type="button"
                onClick={onNavigateToBrandDna}
                className="text-xs font-mono text-[var(--muted)] hover:text-[var(--text)] underline cursor-pointer"
              >
                ← Adjust Business DNA Settings
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowPreGenerateWarningModal(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 text-slate-950 font-display text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Verify & Generate 1-Asset Growth Kit</span>
            </button>
          </div>
        </div>
      ) : (
        /* ==================================================================== */
        /* 2. GENERATED ACTIVE STATE WITH 90-DAY LOCK & REVISION COUNTER */
        /* ==================================================================== */
        <div className="space-y-6">
          
          {/* Header Bar with 90-Day Lock Badge & Revision Count */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-500 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                  Content Studio
                </span>
                <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1 font-semibold">
                  <Lock className="w-3 h-3" />
                  Locked for {lockInfo.daysRemaining} Days
                </span>
                <span className={`font-mono text-[10px] px-2.5 py-0.5 rounded-full border font-semibold flex items-center gap-1 ${
                  revisionsCount > 0 
                    ? 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30' 
                    : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
                }`}>
                  {revisionsCount > 0 ? (
                    <>
                      <Edit3 className="w-3 h-3" />
                      {revisionsCount} of 3 Revisions Remaining
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      Content Finalized (3/3 Used)
                    </>
                  )}
                </span>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-[var(--text)]">
                Your 1-Asset Growth Kit
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[var(--muted)] max-w-2xl leading-relaxed">
                Calibrated for {businessName}. Downloaded photos are saved in your Downloads tab.
              </p>
            </div>

            {/* Quick Actions Header: Edit Revisions & Copy Entire Kit */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {revisionsCount > 0 ? (
                <button
                  type="button"
                  onClick={handleOpenRevisionEditor}
                  className="px-4 py-2.5 rounded-2xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Content ({revisionsCount} left)</span>
                </button>
              ) : (
                <span className="px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-400 font-mono text-xs flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  <span>Locked (3/3 Revisions Used)</span>
                </span>
              )}

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

          {/* Main OS Grid: Left = 1:1 Graphic & Blog Post; Right = Social, Eblast, GBP */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: 1:1 Image Generator & 300-Word Blog Post */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Asset 1: 1:1 Branded Editorial Graphic (Saves to Downloads on download) */}
              <EditorialThumbnailCard
                title={blogTitle}
                previewQuote={
                  profile?.mission_statement
                    ? `Modern decision-makers in ${location} choose verified authority: "${profile.mission_statement}".`
                    : `Modern decision-makers in ${location} choose verified proof and transparent solutions over marketing noise.`
                }
                category="AUTHORITY BRIEFING"
                profile={profile}
                socialCaptionToShare={socialCaptionText}
              />

              {/* Asset 2: SEO/AEO Optimized Blog (Up to 300 Words) */}
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 space-y-5 shadow-sm">
                
                {/* Header with Word Count & AEO Badge */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-500">
                        2. SEO / AEO Optimized Blog
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 font-semibold border border-cyan-500/30">
                        {defaultBlogPost.word_count || 285} Words (Up to 300)
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-[var(--text)] tracking-tight">
                      {blogTitle}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {revisionsCount > 0 && (
                      <button
                        type="button"
                        onClick={handleOpenRevisionEditor}
                        className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface2)] hover:bg-[var(--border)] text-xs font-mono text-[var(--text)] flex items-center gap-1.5 cursor-pointer"
                        title="Edit blog text"
                      >
                        <Edit3 className="w-3 h-3 text-cyan-500" />
                        <span>Edit ({revisionsCount} left)</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => copyToClipboard(`${blogTitle}\n\n${cleanBlogBody}`, 'blog-post')}
                      className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-cyan-500/30 shrink-0"
                    >
                      {copiedKey === 'blog-post' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Post</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Body Text */}
                <div className="p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] leading-relaxed font-sans whitespace-pre-line space-y-4">
                  {cleanBlogBody}
                </div>

                {/* Suggested Blog Tags */}
                <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2.5" id="blog-suggested-tags-container">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-cyan-500" />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                        Suggested Tags
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold border border-cyan-500/20">
                        {blogTags.length} Tags
                      </span>
                    </div>

                    <button
                      type="button"
                      id="copy-blog-tags-btn"
                      onClick={() => copyToClipboard(blogTags.join(', '), 'blog-tags')}
                      className="text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                      title="Copy comma-separated tags"
                    >
                      {copiedKey === 'blog-tags' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied Tags!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Tags</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Tags Pill List */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {blogTags.map((tag, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => copyToClipboard(tag, `tag-${idx}`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-sans text-[var(--text)] hover:border-cyan-500/50 hover:text-cyan-500 transition-all cursor-pointer shadow-xs active:scale-95"
                        title={`Click to copy "${tag}"`}
                      >
                        <span>{tag}</span>
                        {copiedKey === `tag-${idx}` && <Check className="w-2.5 h-2.5 text-emerald-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Social, GBP Post, Eblast */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Asset 3: 1 Social Media Caption (Encouraging Engagement) */}
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-500">
                      3. Social Media Caption
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold border border-cyan-500/20">
                      Encouraging Engagement
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(socialCaptionText, 'social-caption')}
                    className="text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'social-caption' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'social-caption' ? 'Copied' : 'Copy Caption'}</span>
                  </button>
                </div>

                {/* Social Caption Preview Box */}
                <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] leading-relaxed font-sans whitespace-pre-line">
                  {socialCaptionText}
                </div>

                {/* Suggested Hashtags (Max 5 for maximum reach and engagement) */}
                <div className="p-3.5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2" id="social-suggested-hashtags-container">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-cyan-500" />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                        Suggested Hashtags
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold border border-cyan-500/20">
                        {socialHashtags.length} of 5 max
                      </span>
                    </div>

                    <button
                      type="button"
                      id="copy-social-hashtags-btn"
                      onClick={() => copyToClipboard(socialHashtags.join(' '), 'social-hashtags')}
                      className="text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                      title="Copy all hashtags"
                    >
                      {copiedKey === 'social-hashtags' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Hashtags</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Hashtag pills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {socialHashtags.map((tag, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => copyToClipboard(tag, `ht-${idx}`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[11px] font-mono font-semibold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all cursor-pointer shadow-xs active:scale-95"
                        title={`Click to copy "${tag}"`}
                      >
                        <span>{tag}</span>
                        {copiedKey === `ht-${idx}` && <Check className="w-2.5 h-2.5 text-emerald-500" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Platform Share Row */}
                <div className="pt-2 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-[var(--muted)] uppercase font-semibold">
                    1-Click Direct Share:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSharePlatform('linkedin')}
                      className="p-2 rounded-xl bg-[var(--surface2)] hover:bg-[#0077B5]/20 hover:text-[#0077B5] transition-colors border border-[var(--border)] cursor-pointer"
                      title="Share to LinkedIn"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSharePlatform('x')}
                      className="p-2 rounded-xl bg-[var(--surface2)] hover:bg-slate-700 hover:text-white transition-colors border border-[var(--border)] cursor-pointer"
                      title="Share to X"
                    >
                      <XIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSharePlatform('facebook')}
                      className="p-2 rounded-xl bg-[var(--surface2)] hover:bg-[#1877F2]/20 hover:text-[#1877F2] transition-colors border border-[var(--border)] cursor-pointer"
                      title="Share to Facebook"
                    >
                      <Facebook className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSharePlatform('instagram')}
                      className="p-2 rounded-xl bg-[var(--surface2)] hover:bg-[#E4405F]/20 hover:text-[#E4405F] transition-colors border border-[var(--border)] cursor-pointer"
                      title="Open Instagram"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Asset 4: 1 Google Business Profile (GBP) Post */}
              <div className="rounded-3xl border border-amber-500/30 bg-[var(--surface)] p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <GoogleIcon className="w-4 h-4 shrink-0" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      4. GBP Post
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold border border-amber-500/20">
                      Local Authority & Maps
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(gbpData.content, 'gbp')}
                      className="text-xs font-mono text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'gbp' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'gbp' ? 'Copied' : 'Copy Text'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenGoogleBusiness}
                      className="px-2.5 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 font-mono text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-amber-500/30 active:scale-95"
                      title="Copies post update and opens Google Business Profile in a new tab"
                    >
                      <GoogleIcon className="w-3.5 h-3.5" />
                      <span>Post to GBP</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] leading-relaxed font-sans space-y-2">
                  <p>{gbpData.content}</p>
                  <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono text-[var(--muted)]">
                    <span>CTA: <strong className="text-[var(--text)]">{gbpData.call_to_action}</strong></span>
                    <span>Links to website</span>
                  </div>
                </div>
              </div>

              {/* Asset 5: 1 150-Word Eblast */}
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      5. Eblast
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold border border-purple-500/20">
                      150 Words
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(`Subject: ${eblastSubject}\n\n${eblastBody}`, 'eblast')}
                      className="text-xs font-mono text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'eblast' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'eblast' ? 'Copied' : 'Copy Eblast'}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs flex items-center justify-between gap-3">
                    <div className="space-y-0.5 overflow-hidden">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold block">
                        Subject Line
                      </span>
                      <span className="font-display font-bold text-[var(--text)] truncate block">
                        {eblastSubject}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] leading-relaxed whitespace-pre-line font-sans">
                    {eblastBody}
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ==================================================================== */}
          {/* 3. VERIFIED DETAILS & PREDICT WITH ET DIGITAL (Moved to Content Studio) */}
          {/* ==================================================================== */}
          <div className="pt-6 border-t border-[var(--border)]">
            <PostAnalyticsAnalyzer
              user={user}
              profile={profile}
              onRefreshProfile={onRefreshProfile}
              onOpenBooking={onOpenBooking}
            />
          </div>

          {/* Floating Toast Notification for GBP Action */}
          {gbpToast && (
            <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl bg-slate-900 border border-amber-500/40 p-4 shadow-2xl text-white animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
                  <GoogleIcon className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <p className="font-display text-xs font-bold text-amber-300">
                    Google Business Profile
                  </p>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    GBP update copied to your clipboard! Opening Google Business Profile in a new tab...
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. MODAL: CONFIRM INITIAL GENERATION & WARN 90-DAY LOCK */}
      {/* ==================================================================== */}
      {showPreGenerateWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="max-w-md w-full rounded-3xl border border-amber-500/40 bg-slate-900 p-6 sm:p-7 shadow-2xl space-y-5 text-left text-white animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-white">
                  Confirm Settings & Generate?
                </h3>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                  90-Day Lock Initiates Upon Generation
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
              <p>
                Please confirm that your Business DNA settings and filters are accurate.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1 text-[11px] font-mono text-slate-300">
                <div>• <strong>Business:</strong> {businessName}</div>
                <div>• <strong>Website:</strong> {profile?.website_url || 'Not set'}</div>
                <div>• <strong>Tone:</strong> {profile?.brand_voice || profile?.selected_tone || 'Authoritative'}</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
                <strong>Important Notice:</strong> Once generated, there is <strong>no regeneration</strong> and you will receive <strong>3 text revisions</strong>. Content generation locks for 90 days.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPreGenerateWarningModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Review Settings
              </button>
              <button
                type="button"
                onClick={handleConfirmGenerate}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/25"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>Confirm & Generate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. MODAL: REVISION EDITOR (Strictly 3 Revisions) */}
      {/* ==================================================================== */}
      {showRevisionEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="max-w-2xl w-full rounded-3xl border border-cyan-500/40 bg-slate-900 p-6 sm:p-7 shadow-2xl space-y-5 text-left text-white my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white">
                    Edit Content ({revisionsCount} of 3 Revisions Remaining)
                  </h3>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                    Refine Blog, Social Caption & Eblast
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRevisionEditor(false)}
                className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-xs">
              {/* Blog Title */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                  Blog Post Title
                </label>
                <input
                  type="text"
                  value={draftBlogTitle}
                  onChange={(e) => setDraftBlogTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Blog Body */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                  Blog Post Body (Up to 300 Words)
                </label>
                <textarea
                  rows={6}
                  value={draftBlogBody}
                  onChange={(e) => setDraftBlogBody(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Social Caption */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                  Social Media Caption
                </label>
                <textarea
                  rows={4}
                  value={draftSocialCaption}
                  onChange={(e) => setDraftSocialCaption(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Eblast Subject */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                  Eblast Subject Line
                </label>
                <input
                  type="text"
                  value={draftEblastSubject}
                  onChange={(e) => setDraftEblastSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Eblast Body */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                  Eblast Body (150 Words)
                </label>
                <textarea
                  rows={4}
                  value={draftEblastBody}
                  onChange={(e) => setDraftEblastBody(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[11px] font-mono text-amber-400">
                Saving will use 1 revision ({revisionsCount - 1} will remain).
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowRevisionEditor(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowRevisionConfirmModal(true)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 text-xs font-black uppercase tracking-wider cursor-pointer shadow-lg shadow-cyan-500/25"
                >
                  Save Revision
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 6. MODAL: CONFIRM USING 1 REVISION */}
      {/* ==================================================================== */}
      {showRevisionConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
          <div className="max-w-md w-full rounded-3xl border border-cyan-500/40 bg-slate-900 p-6 sm:p-7 shadow-2xl space-y-5 text-left text-white animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-white">
                  Confirm Revision Save?
                </h3>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  Consume 1 of {revisionsCount} Revisions
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Saving these updates will consume 1 of your 3 revisions. Once all 3 are used, content editing will be locked for the remainder of your 90-day cycle.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRevisionConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Back to Editing
              </button>
              <button
                type="button"
                onClick={handleApplyRevision}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black uppercase tracking-wider cursor-pointer shadow-lg shadow-cyan-500/25"
              >
                Confirm & Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
