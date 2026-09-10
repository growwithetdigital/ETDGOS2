import React, { useState } from 'react';
import { 
  Download, Image as ImageIcon, Check, 
  RefreshCw, ArrowUpRight, Copy, Share2, Linkedin,
  Facebook, Instagram
} from 'lucide-react';
import XIcon from '../icons/XIcon';
import { 
  CURATED_NATURAL_PHOTOS, 
  NaturalPhotoAsset,
  getNichePhotoForBusiness
} from '../../utils/contentEngineHelpers';
import { UserProfile } from '../../types';

interface EditorialThumbnailCardProps {
  title: string;
  previewQuote: string;
  category?: string;
  profile: UserProfile | null;
  photoUrl?: string;
  onPhotoChange?: (url: string) => void;
  allTextToCopy?: string;
  socialCaptionToShare?: string;
}

export default function EditorialThumbnailCard({
  title,
  previewQuote,
  category = 'STRATEGIC EDITORIAL',
  profile,
  photoUrl,
  onPhotoChange,
  allTextToCopy,
  socialCaptionToShare,
}: EditorialThumbnailCardProps) {
  // Automatically select photo tailored to business niche
  const defaultNichePhoto = getNichePhotoForBusiness(profile?.industry, profile?.website_url);
  const [selectedPhoto, setSelectedPhoto] = useState<string>(
    photoUrl || defaultNichePhoto.url
  );
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [shareToast, setShareToast] = useState<{ platform: string; message: string } | null>(null);

  const businessName = profile?.business_name || profile?.displayName || 'My Brand';
  const location = profile?.location || 'Local & National';
  
  // Clean client-specific website (prevent defaulting to Eric's domain to stop Facebook from pulling Eric's headshot)
  const clientOwnWebsite = profile?.website_url && !profile.website_url.includes('growwithetdigital.com')
    ? profile.website_url.trim()
    : '';
  const website = clientOwnWebsite 
    ? clientOwnWebsite.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

  const handleSelectPhoto = (photo: NaturalPhotoAsset) => {
    setSelectedPhoto(photo.url);
    if (onPhotoChange) {
      onPhotoChange(photo.url);
    }
    setShowPhotoPicker(false);
  };

  const handleCyclePhoto = () => {
    const currentIndex = CURATED_NATURAL_PHOTOS.findIndex(p => p.url === selectedPhoto);
    const nextIndex = (currentIndex + 1) % CURATED_NATURAL_PHOTOS.length;
    const nextPhoto = CURATED_NATURAL_PHOTOS[nextIndex];
    setSelectedPhoto(nextPhoto.url);
    if (onPhotoChange) {
      onPhotoChange(nextPhoto.url);
    }
  };

  const handleCopyAllText = () => {
    if (!allTextToCopy) return;
    navigator.clipboard.writeText(allTextToCopy);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  /**
   * Unified Social Share:
   * 1. Copies the generated post caption to clipboard.
   * 2. Automatically triggers high-res 1080x1080 branded graphic download.
   * 3. Opens the requested social platform (X, Instagram, Facebook, LinkedIn)
   *    WITHOUT scraping Eric's headshot or ET Digital URL.
   */
  const handleSharePlatform = async (platform: 'x' | 'instagram' | 'facebook' | 'linkedin') => {
    const captionToCopy = socialCaptionToShare || `${title}\n\nBy ${businessName}`;

    // 1. Copy caption
    try {
      await navigator.clipboard.writeText(captionToCopy);
    } catch (e) {
      console.warn('Clipboard write failed:', e);
    }

    // 2. Download the high-res 1080x1080 custom image so the user has the photo
    handleDownloadGraphic();

    const platformLabels = {
      x: 'X',
      instagram: 'Instagram',
      facebook: 'Facebook',
      linkedin: 'LinkedIn'
    };

    setShareToast({
      platform: platformLabels[platform],
      message: `Graphic downloaded & caption copied! Paste your caption and attach the photo on ${platformLabels[platform]}.`
    });
    setTimeout(() => setShareToast(null), 5500);

    // 3. Open platform destination
    if (platform === 'x') {
      const text = `${title}\n\n${captionToCopy.slice(0, 180)}...`;
      const xUrl = clientOwnWebsite
        ? `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(clientOwnWebsite)}`
        : `https://x.com/intent/post?text=${encodeURIComponent(text)}`;
      window.open(xUrl, '_blank', 'noopener,noreferrer');
    } else if (platform === 'instagram') {
      // Instagram web feed / upload
      window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
    } else if (platform === 'facebook') {
      // If user has their own verified website, share that URL.
      // NEVER pass Eric's URL to prevent Facebook from displaying Eric's headshot!
      if (clientOwnWebsite) {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(clientOwnWebsite)}`, '_blank', 'noopener,noreferrer');
      } else {
        window.open('https://www.facebook.com/', '_blank', 'noopener,noreferrer');
      }
    } else if (platform === 'linkedin') {
      if (clientOwnWebsite) {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(clientOwnWebsite)}`, '_blank', 'noopener,noreferrer');
      } else {
        window.open('https://www.linkedin.com/feed/', '_blank', 'noopener,noreferrer');
      }
    }
  };

  /**
   * Renders high-resolution 1080x1080 1:1 editorial asset onto an HTML5 Canvas
   * and triggers a direct PNG download with overlay of blog title and business name.
   */
  const handleDownloadGraphic = async () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not obtain 2D canvas context');

      const renderEditorialComposition = () => {
        // 1. Rich dark cinematic vignette overlay for 100% text contrast
        const gradient = ctx.createLinearGradient(0, 0, 0, 1080);
        gradient.addColorStop(0, 'rgba(11, 17, 32, 0.65)');
        gradient.addColorStop(0.35, 'rgba(15, 23, 42, 0.50)');
        gradient.addColorStop(0.65, 'rgba(15, 23, 42, 0.88)');
        gradient.addColorStop(1, 'rgba(11, 17, 32, 0.98)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1080, 1080);

        // Accent border framing
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.40)';
        ctx.lineWidth = 14;
        ctx.strokeRect(30, 30, 1020, 1020);

        // 2. Top Header / Brand Badge
        ctx.fillStyle = '#06B6D4';
        ctx.font = 'bold 22px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
        ctx.letterSpacing = '3px';
        ctx.fillText(`${category.toUpperCase()} · 1.5 MIN READ`, 70, 95);

        // Category separator line
        ctx.strokeStyle = '#06B6D4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(70, 115);
        ctx.lineTo(260, 115);
        ctx.stroke();

        // Location entity badge
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.font = 'bold 20px ui-monospace, monospace';
        ctx.textAlign = 'right';
        ctx.fillText(location.toUpperCase(), 1010, 95);
        ctx.textAlign = 'left';

        // 3. Main Editorial Title (Wrapped lines, crisp white with drop shadow)
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 52px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Playfair Display", Georgia, serif';

        const words = title.split(' ');
        let line = '';
        const lines: string[] = [];
        const maxWidth = 940;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            lines.push(line.trim());
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
        lines.push(line.trim());

        let currentY = 540 - (lines.length * 30);
        for (const l of lines) {
          ctx.fillText(l, 70, currentY);
          currentY += 66;
        }
        ctx.restore();

        // 4. Preview / Quote Snippet
        ctx.fillStyle = '#CBD5E1';
        ctx.font = 'italic 26px Georgia, serif';
        const quoteWords = previewQuote.split(' ');
        let quoteLine = '';
        const quoteLines: string[] = [];
        const quoteMaxWidth = 920;

        for (let n = 0; n < quoteWords.length; n++) {
          const testQuoteLine = quoteLine + quoteWords[n] + ' ';
          const metrics = ctx.measureText(testQuoteLine);
          if (metrics.width > quoteMaxWidth && n > 0) {
            quoteLines.push(quoteLine.trim());
            quoteLine = quoteWords[n] + ' ';
          } else {
            quoteLine = testQuoteLine;
          }
        }
        quoteLines.push(quoteLine.trim());

        currentY += 24;
        for (let i = 0; i < Math.min(quoteLines.length, 3); i++) {
          ctx.fillText(quoteLines[i], 70, currentY);
          currentY += 36;
        }

        // 5. Divider
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(70, 950);
        ctx.lineTo(1010, 950);
        ctx.stroke();

        // 6. Bottom Metadata Bar: PROMINENT OVERLAY OF BUSINESS NAME & WEBSITE
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(`${businessName}`, 70, 995);

        ctx.fillStyle = '#94A3B8';
        ctx.font = '20px ui-monospace, monospace';
        ctx.fillText(website, 70, 1025);

        ctx.fillStyle = '#06B6D4';
        ctx.font = 'bold 20px ui-monospace, monospace';
        ctx.textAlign = 'right';
        ctx.fillText('GROWTH OS · VERIFIED AUTHORITY', 1010, 1005);
        ctx.textAlign = 'left';

        // Trigger download
        canvas.toBlob((blob) => {
          if (!blob) throw new Error('Canvas conversion to blob failed');
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const safeSlug = (businessName || 'editorial')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
          link.download = `${safeSlug}-blog-thumbnail-1080p.png`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 3000);
          setIsDownloading(false);
        }, 'image/png');
      };

      // Load background photo with crossOrigin enabled
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const imgAspect = img.width / img.height;
        let sWidth, sHeight, sx, sy;
        if (imgAspect > 1) {
          sHeight = img.height;
          sWidth = img.height;
          sx = (img.width - img.height) / 2;
          sy = 0;
        } else {
          sWidth = img.width;
          sHeight = img.width;
          sx = 0;
          sy = (img.height - img.width) / 2;
        }
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, 1080, 1080);
        renderEditorialComposition();
      };

      img.onerror = () => {
        const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1080);
        bgGrad.addColorStop(0, '#0F172A');
        bgGrad.addColorStop(0.5, '#1E293B');
        bgGrad.addColorStop(1, '#0B1120');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 1080, 1080);
        renderEditorialComposition();
      };

      img.src = selectedPhoto;
    } catch (err) {
      console.error('Failed to export image:', err);
      setIsDownloading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm text-left transition-all">
      
      {/* Card Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text)] font-bold">
                1:1 Branded Editorial Graphic
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500 font-semibold border border-cyan-500/30">
                1080x1080
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted)]">
              Overlay of blog title & business name for your niche.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCyclePhoto}
            className="px-2.5 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface2)] hover:bg-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer text-xs flex items-center gap-1.5 font-mono"
            title="Cycle background photo"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-500" />
            <span className="text-[10px] font-medium">Switch Photo</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPhotoPicker(!showPhotoPicker)}
            className="text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>{showPhotoPicker ? 'Close' : 'Choose Photo'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Photo Picker Drawer */}
      {showPhotoPicker && (
        <div className="p-4 border-b border-[var(--border)] bg-[var(--surface2)] space-y-3">
          <div className="flex items-center justify-between text-[11px] text-[var(--muted)] font-mono font-medium">
            <span>Select marketing photo for your niche:</span>
            <span>{CURATED_NATURAL_PHOTOS.length} curated assets</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 max-h-40 overflow-y-auto pr-1">
            {CURATED_NATURAL_PHOTOS.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => handleSelectPhoto(photo)}
                className={`group relative aspect-square rounded-xl overflow-hidden border transition-all cursor-pointer ${
                  selectedPhoto === photo.url
                    ? 'border-cyan-500 ring-2 ring-cyan-500/50'
                    : 'border-[var(--border)] hover:border-[var(--muted)]'
                }`}
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  referrerPolicy="no-referrer"
                />
                {selectedPhoto === photo.url && (
                  <div className="absolute inset-0 bg-cyan-900/60 flex items-center justify-center text-white">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 1:1 Square Stage with Editorial Text Overlay */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-950 flex flex-col justify-between p-6 sm:p-8 select-none">
        {/* Background Image */}
        <img
          src={selectedPhoto}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Cinematic Scrim Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/98 via-slate-950/65 to-slate-900/45 pointer-events-none" />

        {/* Decorative Inner Border */}
        <div className="absolute inset-3 sm:inset-4 rounded-2xl border border-cyan-500/30 pointer-events-none" />

        {/* Top Deck: Niche Category & Location */}
        <div className="relative z-10 flex items-center justify-between gap-3">
          <span className="inline-block px-2.5 py-0.5 rounded font-mono text-[10px] uppercase font-black tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 backdrop-blur-sm">
            {category}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-300 font-bold drop-shadow">
            {location}
          </span>
        </div>

        {/* Center: Headline & Quote Preview */}
        <div className="relative z-10 space-y-2.5 my-auto pt-4">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white leading-tight tracking-tight drop-shadow-lg">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-200 font-serif italic leading-relaxed line-clamp-3 drop-shadow">
            "{previewQuote}"
          </p>
        </div>

        {/* Bottom Bar: OVERLAY OF BUSINESS NAME & WEBSITE */}
        <div className="relative z-10 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-white">
          <div>
            <span className="font-bold font-sans text-white text-sm block tracking-tight">
              {businessName}
            </span>
            <span className="font-mono text-[10px] text-slate-300">
              {website}
            </span>
          </div>

          <div className="text-right">
            <span className="font-mono text-[9px] uppercase tracking-wider text-cyan-300 block font-bold">
              Verified Authority
            </span>
            <span className="text-[9px] text-slate-400 font-mono">
              1.5 Min Read
            </span>
          </div>
        </div>
      </div>

      {/* Actions Bar: Download Image + Copy All Text + Social Share Icons */}
      <div className="p-4 sm:p-5 border-t border-[var(--border)] bg-[var(--surface2)] flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Quick Social Platform Share Icons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-start">
          <span className="text-[11px] font-mono text-[var(--muted)] font-medium mr-1 flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5 text-cyan-500" />
            <span>Share:</span>
          </span>

          <button
            type="button"
            onClick={() => handleSharePlatform('linkedin')}
            title="Share to LinkedIn (Copies caption + Downloads graphic)"
            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-cyan-500/50 hover:bg-cyan-500/10 text-[var(--text)] transition-all cursor-pointer"
          >
            <Linkedin className="w-4 h-4 text-[#0A66C2]" />
          </button>

          <button
            type="button"
            onClick={() => handleSharePlatform('x')}
            title="Share to X (Copies caption + Downloads graphic)"
            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-cyan-500/50 hover:bg-cyan-500/10 text-[var(--text)] transition-all cursor-pointer"
          >
            <XIcon className="w-3.5 h-3.5 text-[var(--text)]" />
          </button>

          <button
            type="button"
            onClick={() => handleSharePlatform('facebook')}
            title="Share to Facebook (Copies caption + Downloads graphic)"
            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-cyan-500/50 hover:bg-cyan-500/10 text-[var(--text)] transition-all cursor-pointer"
          >
            <Facebook className="w-4 h-4 text-[#1877F2]" />
          </button>

          <button
            type="button"
            onClick={() => handleSharePlatform('instagram')}
            title="Share to Instagram (Copies caption + Downloads graphic)"
            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-pink-500/50 hover:bg-pink-500/10 text-[var(--text)] transition-all cursor-pointer"
          >
            <Instagram className="w-4 h-4 text-[#E4405F]" />
          </button>
        </div>

        {/* Right: Copy All Text & Download Image */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-center md:justify-end">
          {allTextToCopy && (
            <button
              type="button"
              onClick={handleCopyAllText}
              className="px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--border)] text-[var(--text)] font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              title="Copy the entire kit: Blog Post, Caption, Eblast, and GBP"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Kit Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[var(--muted)]" />
                  <span>Copy All Text</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleDownloadGraphic}
            disabled={isDownloading}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
            title="Export high-resolution 1080x1080 PNG thumbnail"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>Downloaded 1080p PNG!</span>
              </>
            ) : (
              <>
                <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
                <span>{isDownloading ? 'Rendering Asset...' : 'Download Image (PNG)'}</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Share Toast Confirmation */}
      {shareToast && (
        <div className="p-3 bg-cyan-500/10 border-t border-cyan-500/30 flex items-center justify-between text-xs font-mono text-cyan-600 dark:text-cyan-300">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{shareToast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setShareToast(null)}
            className="text-[var(--muted)] hover:text-[var(--text)] ml-2"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}
