import React, { useState } from 'react';
import { 
  Sparkles, Copy, Check, Share2, Download, ExternalLink, 
  RefreshCw, FileText, Linkedin, Instagram, Facebook, 
  Mail, Gift, Eye, Image as ImageIcon, CheckCircle2, 
  ArrowUpRight, Bookmark, Filter, Layers, MessageSquareText
} from 'lucide-react';
import { GeneratedContentItem, UserProfile } from '../../types';
import { 
  stripMarkdownFormatting, 
  CURATED_NATURAL_PHOTOS, 
  generateSocialPromotionAngles,
  SocialAnglePackage,
  NaturalPhotoAsset 
} from '../../utils/contentEngineHelpers';

interface ContentStudioProps {
  item: GeneratedContentItem;
  profile: UserProfile | null;
  onUpdatePhoto?: (photoUrl: string) => void;
  onSaveRegeneratedAngles?: (angles: SocialAnglePackage[]) => void;
  onOpenBooking?: () => void;
}

export default function ContentStudio({
  item,
  profile,
  onUpdatePhoto,
  onSaveRegeneratedAngles: _onSaveRegeneratedAngles,
  onOpenBooking
}: ContentStudioProps) {
  const [viewMode, setViewMode] = useState<'clean' | 'markdown'>('clean');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState<'linkedin' | 'twitter_x' | 'facebook' | 'instagram_threads' | 'email'>('linkedin');
  const [selectedPhoto, setSelectedPhoto] = useState<string>(
    item.blog_post.natural_photo_url || CURATED_NATURAL_PHOTOS[0].url
  );
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Initialize or compute promotion angles
  const availableAngles = React.useMemo(() => {
    if (item.social_angles && item.social_angles.length > 0) {
      return item.social_angles;
    }
    return generateSocialPromotionAngles(profile, item.blog_post.title, item.blog_post.markdown_content);
  }, [item, profile]);

  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const currentAngle = availableAngles[activeAngleIndex] || availableAngles[0];

  // Clean, symbol-free text (no #, no *)
  const cleanArticleText = React.useMemo(() => {
    return stripMarkdownFormatting(item.blog_post.markdown_content);
  }, [item.blog_post.markdown_content]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2400);
  };

  const handleRegenerateAngles = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      // Rotate to next angle or cycle variations
      setActiveAngleIndex((prev) => (prev + 1) % availableAngles.length);
      setIsRegenerating(false);
    }, 450);
  };

  const handleSelectPhoto = (photo: NaturalPhotoAsset) => {
    setSelectedPhoto(photo.url);
    if (onUpdatePhoto) {
      onUpdatePhoto(photo.url);
    }
    setShowPhotoPicker(false);
  };

  return (
    <div className="space-y-6" id="growth-os-content-studio">
      
      {/* Studio Banner with Value Proposition */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--accent)] font-semibold">
              Content Studio · Quarterly Strategic Authority
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wide bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30">
              Free Tier Active
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text)]">
            Quarterly High-Velocity Editorial Engine
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[var(--muted)] max-w-2xl leading-relaxed">
            Your foundational authority article is published once per quarter, but you can regenerate fresh cross-channel social promotion angles anytime to continuously drive engagement and traffic to this core asset.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleRegenerateAngles}
            disabled={isRegenerating}
            className="px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface2)] hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/40 text-[var(--text)] font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
            title="Generate a fresh promotional angle for this article"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[var(--accent)] ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate Social Angles</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left = Article & Natural Visual Preview (7 Cols), Right = Social Machine (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Article Reader & Natural Photo Preview */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Natural Photography Card (Pexels / Unsplash Style) */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[var(--accent)]" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text)] font-semibold">
                  Editorial Photography Preview
                </span>
                <span className="text-[10px] font-mono text-[var(--muted)]">
                  (Natural · Pexels / Unsplash Style)
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowPhotoPicker(!showPhotoPicker)}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent)] hover:underline cursor-pointer"
              >
                <span>{showPhotoPicker ? 'Close Gallery' : 'Change Photo'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Photo Preview Stage */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--surface2)]">
              <img
                src={selectedPhoto}
                alt={item.blog_post.title}
                className="w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/90 via-transparent to-transparent flex items-end p-4">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded font-mono text-[10px] uppercase tracking-wide bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/40 mb-1.5 backdrop-blur-sm">
                    {item.blog_post.target_keyword}
                  </span>
                  <p className="font-medium text-sm sm:text-base text-white line-clamp-2">
                    {item.blog_post.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Photo Selector Drawer */}
            {showPhotoPicker && (
              <div className="p-4 border-t border-[var(--border)] bg-[var(--surface2)] space-y-3">
                <div className="flex items-center justify-between text-xs text-[var(--muted)] font-mono">
                  <span>Select an authentic editorial photo to compliment your article:</span>
                  <span>{CURATED_NATURAL_PHOTOS.length} curated assets</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {CURATED_NATURAL_PHOTOS.map((photo) => (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => handleSelectPhoto(photo)}
                      className={`group relative aspect-video rounded-lg overflow-hidden border text-left transition-all cursor-pointer ${
                        selectedPhoto === photo.url
                          ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/50'
                          : 'border-[var(--border)] hover:border-[var(--muted)]'
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[9px] text-white truncate font-sans">{photo.title}</span>
                      </div>
                      {selectedPhoto === photo.url && (
                        <div className="absolute top-1 right-1 p-0.5 rounded-full bg-[var(--accent)] text-slate-950">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Article Text Card */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7 space-y-5 shadow-sm">
            
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">
                    Strategic Feature Article
                  </span>
                  <span className="text-[11px] font-mono text-[var(--muted)]">
                    · {item.blog_post.read_time || '3 Min Read'}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[var(--text)] tracking-tight">
                  {item.blog_post.title}
                </h3>
              </div>

              {/* View Switcher & Copy Controls */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {/* View Mode Toggle */}
                <div className="flex rounded-lg border border-[var(--border)] bg-[var(--surface2)] p-0.5 text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setViewMode('clean')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      viewMode === 'clean'
                        ? 'bg-[var(--accent)] text-slate-950 font-bold'
                        : 'text-[var(--muted)] hover:text-[var(--text)]'
                    }`}
                    title="Clean text without markdown symbols (#, *)"
                  >
                    Clean Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('markdown')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      viewMode === 'markdown'
                        ? 'bg-[var(--accent)] text-slate-950 font-bold'
                        : 'text-[var(--muted)] hover:text-[var(--text)]'
                    }`}
                    title="Formatted markdown with headers"
                  >
                    Markdown
                  </button>
                </div>

                {/* Primary Clean Copy Button */}
                <button
                  type="button"
                  onClick={() => copyToClipboard(cleanArticleText, 'clean_article')}
                  className="px-3 py-1.5 rounded-lg bg-[var(--accent)] hover:opacity-90 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                  title="Copy clean text without any # or * symbols"
                >
                  {copiedKey === 'clean_article' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied Clean!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Clean Text</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* SERP Search Preview Box */}
            <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface2)] text-xs text-[var(--text)] space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted)]">
                <span className="uppercase tracking-wider">Search Snippet & Metadata</span>
                <span>Keyword: {item.blog_post.target_keyword}</span>
              </div>
              <p className="text-xs text-[var(--muted)] italic leading-relaxed">
                {item.blog_post.meta_description}
              </p>
            </div>

            {/* Article Content Display */}
            <div className="max-h-[560px] overflow-y-auto pr-2 space-y-4 text-sm text-[var(--text)] leading-relaxed">
              {viewMode === 'clean' ? (
                <div className="whitespace-pre-line font-sans leading-relaxed text-[var(--text)]">
                  {cleanArticleText}
                </div>
              ) : (
                <div className="whitespace-pre-line font-mono text-xs text-[var(--muted)] leading-relaxed bg-[var(--surface2)] p-4 rounded-xl border border-[var(--border)]">
                  {item.blog_post.markdown_content}
                </div>
              )}
            </div>

            {/* Footer helper */}
            <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono text-[var(--muted)]">
              <span>Clean text format: 100% free of # and * symbols</span>
              <button
                type="button"
                onClick={() => copyToClipboard(item.blog_post.markdown_content, 'raw_markdown')}
                className="text-[var(--accent)] hover:underline cursor-pointer"
              >
                {copiedKey === 'raw_markdown' ? 'Copied Markdown' : 'Copy Raw Markdown'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Social Media Engine & Angles (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Promotional Angle Selector */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--accent)]" />
                <h4 className="text-sm font-semibold text-[var(--text)] uppercase tracking-wider font-mono">
                  Promotional Angle
                </h4>
              </div>

              <span className="font-mono text-[10px] text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded border border-[var(--accent)]/30">
                Angle {activeAngleIndex + 1} of {availableAngles.length}
              </span>
            </div>

            {/* Angle Selector Chips */}
            <div className="space-y-2">
              {availableAngles.map((angle, idx) => (
                <button
                  key={angle.id}
                  type="button"
                  onClick={() => setActiveAngleIndex(idx)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 text-xs ${
                    activeAngleIndex === idx
                      ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text)] font-medium'
                      : 'border-[var(--border)] bg-[var(--surface2)] text-[var(--muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <span className="truncate">{angle.angle_title}</span>
                  <span className="font-mono text-[9px] uppercase tracking-wider shrink-0 text-[var(--muted)]">
                    {angle.angle_badge}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-[var(--muted)]">
              <span>Use different angles across weeks to maximize reach</span>
              <button
                type="button"
                onClick={handleRegenerateAngles}
                className="font-mono text-[11px] text-[var(--accent)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Next Angle</span>
              </button>
            </div>
          </div>

          {/* Social Media Platform Captions */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4 shadow-sm text-left">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-[var(--text)] uppercase tracking-wider font-mono flex items-center gap-2">
                  <span>4 Versions of Engaging Social Media Copy</span>
                </h4>
                <p className="text-[11px] text-[var(--muted)] mt-0.5">
                  Tailored promotional options to syndicate your blog post across your core distribution channels.
                </p>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                4 Options Ready
              </span>
            </div>
            
            {/* Channel Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 rounded-xl border border-[var(--border)] bg-[var(--surface2)] text-[10px] font-mono uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setActivePlatform('linkedin')}
                className={`py-2 px-1 text-center rounded-lg transition-all cursor-pointer ${
                  activePlatform === 'linkedin'
                    ? 'bg-[var(--accent)] text-slate-950 font-bold'
                    : 'text-[var(--muted)] hover:text-[var(--text)]'
                }`}
              >
                1. LinkedIn
              </button>
              <button
                type="button"
                onClick={() => setActivePlatform('twitter_x')}
                className={`py-2 px-1 text-center rounded-lg transition-all cursor-pointer ${
                  activePlatform === 'twitter_x'
                    ? 'bg-[var(--accent)] text-slate-950 font-bold'
                    : 'text-[var(--muted)] hover:text-[var(--text)]'
                }`}
              >
                2. X / Twitter
              </button>
              <button
                type="button"
                onClick={() => setActivePlatform('instagram_threads')}
                className={`py-2 px-1 text-center rounded-lg transition-all cursor-pointer ${
                  activePlatform === 'instagram_threads'
                    ? 'bg-[var(--accent)] text-slate-950 font-bold'
                    : 'text-[var(--muted)] hover:text-[var(--text)]'
                }`}
              >
                3. Instagram
              </button>
              <button
                type="button"
                onClick={() => setActivePlatform('email')}
                className={`py-2 px-1 text-center rounded-lg transition-all cursor-pointer ${
                  activePlatform === 'email'
                    ? 'bg-[var(--accent)] text-slate-950 font-bold'
                    : 'text-[var(--muted)] hover:text-[var(--text)]'
                }`}
              >
                4. Email
              </button>
            </div>

            {/* Caption Text Box */}
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface2)] space-y-3">
              
              {activePlatform === 'email' ? (
                <div className="space-y-3">
                  <div className="pb-2 border-b border-[var(--border)]">
                    <span className="font-mono text-[10px] uppercase text-[var(--muted)] block">Subject Line:</span>
                    <p className="text-xs font-semibold text-[var(--text)]">{currentAngle.email_subject}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase text-[var(--muted)] block mb-1">Email Body Snippet:</span>
                    <p className="text-xs text-[var(--text)] whitespace-pre-line leading-relaxed">
                      {currentAngle.email_body}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[var(--text)] whitespace-pre-line leading-relaxed font-sans">
                  {currentAngle[activePlatform]}
                </p>
              )}

              {/* Action Bar */}
              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const textToCopy = activePlatform === 'email' 
                      ? `${currentAngle.email_subject}\n\n${currentAngle.email_body}`
                      : currentAngle[activePlatform];
                    copyToClipboard(textToCopy, `social_${activePlatform}`);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent)] hover:underline cursor-pointer"
                >
                  {copiedKey === `social_${activePlatform}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied Caption!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>Copy Caption</span>
                    </>
                  )}
                </button>

                {/* Direct Share Intents */}
                <div className="flex items-center gap-1.5">
                  {activePlatform === 'twitter_x' && (
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(currentAngle.twitter_x)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-[10px] font-mono flex items-center gap-1 hover:border-[var(--accent)]"
                    >
                      <ExternalLink className="w-3 h-3 text-[var(--accent)]" />
                      <span>Tweet</span>
                    </a>
                  )}
                  {activePlatform === 'linkedin' && (
                    <a
                      href="https://www.linkedin.com/feed/"
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-[10px] font-mono flex items-center gap-1 hover:border-[var(--accent)]"
                    >
                      <Linkedin className="w-3 h-3 text-[var(--accent)]" />
                      <span>Open Feed</span>
                    </a>
                  )}
                  {activePlatform === 'facebook' && (
                    <a
                      href="https://www.facebook.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-[10px] font-mono flex items-center gap-1 hover:border-[var(--accent)]"
                    >
                      <Facebook className="w-3 h-3 text-[var(--accent)]" />
                      <span>Open FB</span>
                    </a>
                  )}
                  {activePlatform === 'instagram_threads' && (
                    <a
                      href="https://www.threads.net/"
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-[10px] font-mono flex items-center gap-1 hover:border-[var(--accent)]"
                    >
                      <Instagram className="w-3 h-3 text-[var(--accent)]" />
                      <span>Open Threads</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Lead Magnet Tie-In Callout */}
            <div className="p-3.5 rounded-xl border border-[var(--accent)]/25 bg-[var(--accent)]/8 flex items-start gap-2.5 text-xs text-[var(--text)]">
              <Gift className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] font-semibold block">
                  Lead Magnet CTA Tie-In
                </span>
                <p className="text-xs text-[var(--text)] mt-0.5">
                  {currentAngle.lead_magnet_hook}
                </p>
              </div>
            </div>
          </div>

          {/* Upsell to Paid 1,000+ Word Pillars Teaser */}
          <div className="rounded-2xl border border-[#C9974D]/30 bg-[#C9974D]/8 p-4 sm:p-5 space-y-3 text-xs text-[var(--text)]">
            <div className="flex items-center gap-2 text-[#C9974D] font-mono uppercase tracking-wider text-[11px] font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Looking for 1,000+ Word Authority Pillars?</span>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Industry research demonstrates that comprehensive 1,000+ word guides capture 3.2x more backlinks and top-tier AI search citations. Free accounts receive 1 strategic blueprint per quarter.
            </p>
            <button
              type="button"
              onClick={onOpenBooking}
              className="w-full py-2.5 px-3 rounded-xl bg-[#C9974D] hover:bg-[#b0833f] text-slate-950 font-mono text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
            >
              Explore Monthly & Bi-Weekly Growth Schedules
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
