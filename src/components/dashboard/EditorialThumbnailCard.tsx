import React, { useState } from 'react';
import { 
  Download, Image as ImageIcon, Check, 
  RefreshCw, Copy, Share2, Linkedin,
  Facebook, Instagram, Layers, Mail, ExternalLink, FileText,
  Info, X
} from 'lucide-react';
import XIcon from '../icons/XIcon';
import GoogleIcon from '../icons/GoogleIcon';
import { 
  CURATED_NATURAL_PHOTOS, 
  NaturalPhotoAsset,
  getNichePhotoForBusiness
} from '../../utils/contentEngineHelpers';
import { UserProfile } from '../../types';
import { addDownloadedAsset } from '../../utils/downloadStorage';
import { recordUserDownload } from '../../utils/userTelemetry';

export type FormatGroup = 'social' | 'gbp' | 'email';

export interface ImageFormatOption {
  id: string;
  name: string;
  platform: string;
  group: FormatGroup;
  ratioLabel: string;
  dimensions: string;
  width: number;
  height: number;
  renderIcons: () => React.ReactNode;
  aspectClass: string;
  fileSuffix: string;
  description: string;
}

export const IMAGE_FORMAT_OPTIONS: ImageFormatOption[] = [
  // 1. Social Media Group
  {
    id: 'linkedin_fb_landscape',
    name: 'LinkedIn / Facebook',
    platform: 'LinkedIn & Facebook',
    group: 'social',
    ratioLabel: '1.91:1 Landscape',
    dimensions: '1200 x 628',
    width: 1200,
    height: 628,
    renderIcons: () => (
      <div className="flex items-center gap-1">
        <Linkedin className="w-4 h-4 text-[#0A66C2]" />
        <span className="text-xs text-[var(--muted)] font-mono font-bold">/</span>
        <Facebook className="w-4 h-4 text-[#1877F2]" />
      </div>
    ),
    aspectClass: 'aspect-[1200/628]',
    fileSuffix: 'linkedin-facebook',
    description: 'Paired standard landscape format for LinkedIn and Facebook feeds'
  },
  {
    id: 'instagram_square',
    name: 'Instagram',
    platform: 'Instagram Feed',
    group: 'social',
    ratioLabel: '1:1 Square',
    dimensions: '1080 x 1080',
    width: 1080,
    height: 1080,
    renderIcons: () => <Instagram className="w-4 h-4 text-[#E4405F]" />,
    aspectClass: 'aspect-square',
    fileSuffix: 'instagram-square',
    description: 'Standard 1:1 square post for Instagram feed grid'
  },
  {
    id: 'x_post',
    name: 'X (Twitter)',
    platform: 'X Timeline',
    group: 'social',
    ratioLabel: '16:9 Landscape',
    dimensions: '1200 x 675',
    width: 1200,
    height: 675,
    renderIcons: () => <XIcon className="w-3.5 h-3.5 text-[var(--text)]" />,
    aspectClass: 'aspect-[16/9]',
    fileSuffix: 'x-post',
    description: 'High-engagement 16:9 widescreen post for X feed'
  },
  {
    id: 'story_vertical',
    name: 'IG / FB Story',
    platform: 'Instagram & Facebook Stories',
    group: 'social',
    ratioLabel: '9:16 Vertical Story',
    dimensions: '1080 x 1920',
    width: 1080,
    height: 1920,
    renderIcons: () => (
      <div className="flex items-center gap-1">
        <Instagram className="w-4 h-4 text-[#E4405F]" />
        <span className="text-xs text-[var(--muted)] font-mono font-bold">/</span>
        <Facebook className="w-4 h-4 text-[#1877F2]" />
      </div>
    ),
    aspectClass: 'aspect-[9/16] max-h-[520px] mx-auto',
    fileSuffix: 'ig-fb-story-9x16',
    description: 'Full-screen 9:16 vertical format (1080 × 1920) sized specifically for Instagram & Facebook Stories'
  },
  // 2. Google Business Profile Group (GBP) with Google Icon
  {
    id: 'gbp_update',
    name: 'Google Business Profile',
    platform: 'Google Business Profile (GBP)',
    group: 'gbp',
    ratioLabel: '4:3 Standard',
    dimensions: '1200 x 900',
    width: 1200,
    height: 900,
    renderIcons: () => <GoogleIcon className="w-4 h-4" />,
    aspectClass: 'aspect-[4/3]',
    fileSuffix: 'gbp-update',
    description: 'Optimal 4:3 scale for Google Business Profile local search posts'
  },
  // 3. Email Group
  {
    id: 'email_header',
    name: 'Email Header',
    platform: 'Email Newsletters & Eblasts',
    group: 'email',
    ratioLabel: '3:1 Banner',
    dimensions: '1200 x 400',
    width: 1200,
    height: 400,
    renderIcons: () => <Mail className="w-4 h-4 text-purple-500" />,
    aspectClass: 'aspect-[3/1]',
    fileSuffix: 'email-header',
    description: 'Horizontal banner sized for email campaigns and client newsletters'
  }
];

interface EditorialThumbnailCardProps {
  title: string;
  previewQuote: string;
  category?: string;
  profile: UserProfile | null;
  photoUrl?: string;
  onPhotoChange?: (url: string) => void;
  socialCaptionToShare?: string;
  caption?: string;
}

export default function EditorialThumbnailCard({
  title,
  previewQuote,
  category = 'STRATEGIC EDITORIAL',
  profile,
  photoUrl,
  onPhotoChange,
  socialCaptionToShare,
  caption,
}: EditorialThumbnailCardProps) {
  const defaultNichePhoto = getNichePhotoForBusiness(profile?.industry, profile?.website_url);
  const [selectedPhoto, setSelectedPhoto] = useState<string>(
    photoUrl || defaultNichePhoto.url
  );
  // Default to paired LinkedIn & Facebook format
  const [selectedFormatId, setSelectedFormatId] = useState<string>('linkedin_fb_landscape');
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccessFormat, setDownloadSuccessFormat] = useState<string | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [shareToast, setShareToast] = useState<{ platform: string; message: string } | null>(null);
  const [showSpecsModal, setShowSpecsModal] = useState(false);

  const activeFormat = IMAGE_FORMAT_OPTIONS.find(f => f.id === selectedFormatId) || IMAGE_FORMAT_OPTIONS[0];

  const businessName = profile?.business_name || profile?.displayName || 'My Brand';
  const location = profile?.location || 'Local & National';
  
  // Ensure whatever website the user saved and locked in Business DNA appears on their media downloads
  const clientOwnWebsite = profile?.website_url ? profile.website_url.trim() : '';
  const website = clientOwnWebsite 
    ? clientOwnWebsite.replace(/^https?:\/\//i, '').replace(/\/$/, '')
    : `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

  const captionToDisplay = caption || socialCaptionToShare || (
    previewQuote
      ? `"${previewQuote}" — ${title}. Published by ${businessName} (${location}). Read the full insight on our website.`
      : `${title} — Strategic insight from ${businessName} in ${location}. Check out our latest authority framework.`
  );

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(captionToDisplay);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  const handleSelectPhoto = (photo: NaturalPhotoAsset) => {
    setSelectedPhoto(photo.url);
    if (onPhotoChange) {
      onPhotoChange(photo.url);
    }
    setShowPhotoPicker(false);
  };


  /**
   * Universal Canvas Renderer for Format Ratios
   */
  const renderAssetCanvas = (format: ImageFormatOption, img: HTMLImageElement | null): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = format.width;
    canvas.height = format.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not obtain 2D canvas context');

    const w = format.width;
    const h = format.height;

    // 1. Background image with cover crop
    if (img && img.complete && img.naturalWidth > 0) {
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const targetAspect = w / h;
      let sx = 0, sy = 0, sWidth = img.naturalWidth, sHeight = img.naturalHeight;
      if (imgAspect > targetAspect) {
        sWidth = img.naturalHeight * targetAspect;
        sx = (img.naturalWidth - sWidth) / 2;
      } else {
        sHeight = img.naturalWidth / targetAspect;
        sy = (img.naturalHeight - sHeight) / 2;
      }
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, w, h);
    } else {
      const bgGrad = ctx.createLinearGradient(0, 0, w, h);
      bgGrad.addColorStop(0, '#0F172A');
      bgGrad.addColorStop(0.5, '#1E293B');
      bgGrad.addColorStop(1, '#0B1120');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);
    }

    // 2. High-contrast vignette overlay
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, 'rgba(11, 17, 32, 0.75)');
    gradient.addColorStop(0.35, 'rgba(15, 23, 42, 0.55)');
    gradient.addColorStop(0.70, 'rgba(15, 23, 42, 0.90)');
    gradient.addColorStop(1, 'rgba(11, 17, 32, 0.98)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // 3. Border accent
    const borderPadding = Math.round(Math.min(w, h) * 0.035);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.40)';
    ctx.lineWidth = Math.max(4, Math.round(Math.min(w, h) * 0.012));
    ctx.strokeRect(borderPadding, borderPadding, w - borderPadding * 2, h - borderPadding * 2);

    const marginX = borderPadding + Math.round(w * 0.04);

    // 4. Adapt composition based on aspect ratio
    if (format.id === 'email_header') {
      // Horizontal Email Header Banner (1200 x 400)
      ctx.fillStyle = '#06B6D4';
      ctx.font = 'bold 20px ui-monospace, monospace';
      ctx.fillText(`${category.toUpperCase()} · EMAIL INSIGHT`, marginX, 85);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = 'bold 18px ui-monospace, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(location.toUpperCase(), w - marginX, 85);
      ctx.textAlign = 'left';

      // Title (2 lines max)
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 16;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif';
      const words = title.split(' ');
      let line = '';
      let currentY = 150;
      let lineCount = 0;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > (w - marginX * 2) && n > 0) {
          ctx.fillText(line.trim(), marginX, currentY);
          line = words[n] + ' ';
          currentY += 46;
          lineCount++;
          if (lineCount >= 2) break;
        } else {
          line = testLine;
        }
      }
      if (lineCount < 2 && line.trim()) {
        ctx.fillText(line.trim(), marginX, currentY);
      }
      ctx.restore();

      // Bottom bar
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(marginX, 320);
      ctx.lineTo(w - marginX, 320);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(businessName, marginX, 355);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '16px ui-monospace, monospace';
      ctx.fillText(website, marginX + 320, 355);

      ctx.fillStyle = '#06B6D4';
      ctx.font = 'bold 16px ui-monospace, monospace';
      ctx.textAlign = 'right';
      ctx.fillText('GROWTH OS · VERIFIED CAMPAIGN', w - marginX, 355);
      ctx.textAlign = 'left';

    } else if (format.id === 'story_vertical') {
      // 9:16 Vertical Story / Reel (1080 x 1920)
      ctx.fillStyle = '#06B6D4';
      ctx.font = 'bold 26px ui-monospace, monospace';
      ctx.fillText(`${category.toUpperCase()} · BRIEFING`, marginX, 220);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = 'bold 24px ui-monospace, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(location.toUpperCase(), w - marginX, 220);
      ctx.textAlign = 'left';

      // Title
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 24;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 64px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif';
      const words = title.split(' ');
      let line = '';
      let currentY = 820;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > (w - marginX * 2) && n > 0) {
          ctx.fillText(line.trim(), marginX, currentY);
          line = words[n] + ' ';
          currentY += 80;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), marginX, currentY);
      ctx.restore();

      // Quote
      currentY += 48;
      ctx.fillStyle = '#CBD5E1';
      ctx.font = 'italic 32px Georgia, serif';
      const quoteWords = previewQuote.split(' ');
      let quoteLine = '';
      for (let n = 0; n < quoteWords.length; n++) {
        const testQuote = quoteLine + quoteWords[n] + ' ';
        if (ctx.measureText(testQuote).width > (w - marginX * 2) && n > 0) {
          ctx.fillText(quoteLine.trim(), marginX, currentY);
          quoteLine = quoteWords[n] + ' ';
          currentY += 46;
        } else {
          quoteLine = testQuote;
        }
      }
      ctx.fillText(quoteLine.trim(), marginX, currentY);

      // Bottom Bar
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(marginX, 1720);
      ctx.lineTo(w - marginX, 1720);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(businessName, marginX, 1780);

      ctx.fillStyle = '#06B6D4';
      ctx.font = 'bold 24px ui-monospace, monospace';
      ctx.fillText(website, marginX, 1825);

      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 22px ui-monospace, monospace';
      ctx.textAlign = 'right';
      ctx.fillText('GROWTH OS · VERIFIED AUTHORITY', w - marginX, 1800);
      ctx.textAlign = 'left';

    } else {
      // LinkedIn & FB Landscape, Instagram Square, X, or GBP (4:3)
      const topDeckY = Math.round(h * 0.12);
      ctx.fillStyle = '#06B6D4';
      ctx.font = `bold ${Math.round(w * 0.02)}px ui-monospace, monospace`;
      ctx.fillText(`${category.toUpperCase()} · VERIFIED AUTHORITY`, marginX, topDeckY);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = `bold ${Math.round(w * 0.018)}px ui-monospace, monospace`;
      ctx.textAlign = 'right';
      ctx.fillText(location.toUpperCase(), w - marginX, topDeckY);
      ctx.textAlign = 'left';

      // Title
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#FFFFFF';
      const titleFontSize = format.id === 'gbp_update' ? 48 : format.height < 700 ? 40 : 50;
      ctx.font = `bold ${titleFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif`;
      
      const words = title.split(' ');
      let line = '';
      const lines: string[] = [];
      const maxWidth = w - marginX * 2;

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

      let currentY = Math.round(h * 0.45) - (lines.length * (titleFontSize * 0.5));
      for (const l of lines) {
        ctx.fillText(l, marginX, currentY);
        currentY += titleFontSize * 1.25;
      }
      ctx.restore();

      // Quote preview
      if (h >= 628) {
        ctx.fillStyle = '#CBD5E1';
        const quoteFontSize = format.height < 700 ? 20 : 24;
        ctx.font = `italic ${quoteFontSize}px Georgia, serif`;
        const quoteWords = previewQuote.split(' ');
        let quoteLine = '';
        const quoteLines: string[] = [];
        for (let n = 0; n < quoteWords.length; n++) {
          const testQuote = quoteLine + quoteWords[n] + ' ';
          if (ctx.measureText(testQuote).width > maxWidth && n > 0) {
            quoteLines.push(quoteLine.trim());
            quoteLine = quoteWords[n] + ' ';
          } else {
            quoteLine = testQuote;
          }
        }
        quoteLines.push(quoteLine.trim());

        currentY += 16;
        for (let i = 0; i < Math.min(quoteLines.length, format.height < 700 ? 2 : 3); i++) {
          ctx.fillText(quoteLines[i], marginX, currentY);
          currentY += quoteFontSize * 1.4;
        }
      }

      // Bottom Metadata Bar
      const bottomBarY = h - Math.round(h * 0.12);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(marginX, bottomBarY - 25);
      ctx.lineTo(w - marginX, bottomBarY - 25);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(businessName, marginX, bottomBarY + 12);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '18px ui-monospace, monospace';
      ctx.fillText(website, marginX, bottomBarY + 38);

      ctx.fillStyle = '#06B6D4';
      ctx.font = 'bold 18px ui-monospace, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(
        format.id === 'gbp_update' ? 'GOOGLE BUSINESS PROFILE · VERIFIED' : 'GROWTH OS · VERIFIED AUTHORITY',
        w - marginX,
        bottomBarY + 18
      );
      ctx.textAlign = 'left';
    }

    return canvas;
  };

  const handleDownloadSingleFormat = async (format: ImageFormatOption) => {
    setIsDownloading(true);
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      const performExport = (loadedImg: HTMLImageElement | null) => {
        const canvas = renderAssetCanvas(format, loadedImg);
        canvas.toBlob((blob) => {
          if (!blob) throw new Error('Canvas to blob failed');
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const safeSlug = (businessName || 'editorial')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
          link.download = `${safeSlug}-${format.fileSuffix}.png`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          // Archive in user's Downloads Vault
          try {
            let previewData = '';
            try {
              previewData = canvas.toDataURL('image/jpeg', 0.85);
            } catch (e) {
              previewData = selectedPhoto;
            }
            addDownloadedAsset(profile?.uid, {
              id: `dl_${Date.now()}_${format.id}`,
              title: title || 'Editorial Graphic',
              formatId: format.id,
              formatName: format.name,
              dimensions: format.dimensions,
              dataUrl: previewData,
              downloadedAt: new Date().toISOString(),
              filename: `${safeSlug}-${format.fileSuffix}.png`
            }, profile?.email);
            recordUserDownload(profile?.uid, title || 'Editorial Graphic', `${format.name} (${format.dimensions})`, 'Social Media Graphic');
          } catch (storageErr) {
            console.warn('Downloads vault save notice:', storageErr);
          }

          setDownloadSuccessFormat(format.id);
          setTimeout(() => setDownloadSuccessFormat(null), 3000);
          setIsDownloading(false);
        }, 'image/png');
      };

      img.onload = () => performExport(img);
      img.onerror = () => performExport(null);
      img.src = selectedPhoto;
    } catch (err) {
      console.error('Failed to export image format:', err);
      setIsDownloading(false);
    }
  };

  const handleDownloadAllFormats = async () => {
    setIsDownloading(true);
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      const performAllExports = async (loadedImg: HTMLImageElement | null) => {
        for (let i = 0; i < IMAGE_FORMAT_OPTIONS.length; i++) {
          const format = IMAGE_FORMAT_OPTIONS[i];
          const canvas = renderAssetCanvas(format, loadedImg);
          
          await new Promise<void>((resolve) => {
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                const safeSlug = (businessName || 'editorial')
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/^-|-$/g, '');
                link.download = `${safeSlug}-${format.fileSuffix}.png`;
                link.href = url;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                try {
                  let previewData = '';
                  try {
                    previewData = canvas.toDataURL('image/jpeg', 0.8);
                  } catch (e) {
                    previewData = selectedPhoto;
                  }
                  addDownloadedAsset(profile?.uid, {
                    id: `dl_${Date.now()}_${format.id}`,
                    title: title || 'Editorial Graphic',
                    formatId: format.id,
                    formatName: format.name,
                    dimensions: format.dimensions,
                    dataUrl: previewData,
                    downloadedAt: new Date().toISOString(),
                    filename: `${safeSlug}-${format.fileSuffix}.png`
                  }, profile?.email);
                } catch (e) {}

                setTimeout(() => {
                  URL.revokeObjectURL(url);
                  resolve();
                }, 200);
              } else {
                resolve();
              }
            }, 'image/png');
          });
        }
        setDownloadSuccessFormat('all');
        setTimeout(() => setDownloadSuccessFormat(null), 3500);
        setIsDownloading(false);
      };

      img.onload = () => performAllExports(img);
      img.onerror = () => performAllExports(null);
      img.src = selectedPhoto;
    } catch (err) {
      console.error('Failed to export all formats:', err);
      setIsDownloading(false);
    }
  };

  const handleSharePlatform = async (platform: 'x' | 'instagram' | 'facebook' | 'linkedin' | 'gbp' | 'email') => {
    const captionToCopy = socialCaptionToShare || `${title}\n\nBy ${businessName}`;

    try {
      await navigator.clipboard.writeText(captionToCopy);
    } catch (e) {
      console.warn('Clipboard write failed:', e);
    }

    if (platform === 'gbp') {
      const gbpFormat = IMAGE_FORMAT_OPTIONS.find(f => f.id === 'gbp_update') || activeFormat;
      handleDownloadSingleFormat(gbpFormat);
      setShareToast({
        platform: 'Google Business Profile',
        message: 'GBP graphic downloaded & post text copied! Opening Google Business Profile...'
      });
      setTimeout(() => setShareToast(null), 5500);
      window.open('https://business.google.com/', '_blank', 'noopener,noreferrer');
      return;
    }

    if (platform === 'email') {
      const emailFormat = IMAGE_FORMAT_OPTIONS.find(f => f.id === 'email_header') || activeFormat;
      handleDownloadSingleFormat(emailFormat);
      setShareToast({
        platform: 'Email Campaign',
        message: 'Email header banner downloaded & campaign copy ready in clipboard!'
      });
      setTimeout(() => setShareToast(null), 5500);
      return;
    }

    handleDownloadSingleFormat(activeFormat);

    const platformLabels: Record<string, string> = {
      x: 'X',
      instagram: 'Instagram',
      facebook: 'Facebook',
      linkedin: 'LinkedIn'
    };

    setShareToast({
      platform: platformLabels[platform] || platform,
      message: `${activeFormat.platform} graphic downloaded & caption copied! Attach your image on ${platformLabels[platform] || platform}.`
    });
    setTimeout(() => setShareToast(null), 5500);

    if (platform === 'x') {
      const text = `${title}\n\n${captionToCopy.slice(0, 180)}...`;
      const xUrl = clientOwnWebsite
        ? `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(clientOwnWebsite)}`
        : `https://x.com/intent/post?text=${encodeURIComponent(text)}`;
      window.open(xUrl, '_blank', 'noopener,noreferrer');
    } else if (platform === 'instagram') {
      window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
    } else if (platform === 'facebook') {
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
                1. Content Featured Image
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted)]">
              Select your platform ratio below to preview and export branded graphics.
            </p>
          </div>
        </div>

        {/* Switch Photo Button */}
        <button
          type="button"
          onClick={() => setShowPhotoPicker(!showPhotoPicker)}
          className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface2)] hover:bg-[var(--border)] text-[var(--text)] transition-colors cursor-pointer text-xs flex items-center gap-1.5 font-mono font-bold shadow-xs active:scale-95"
          id="btn-switch-choose-photo"
          title="Switch background photo"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-500 ${showPhotoPicker ? 'rotate-180' : ''} transition-transform`} />
          <span>{showPhotoPicker ? 'Close Photos' : 'Switch Photo'}</span>
        </button>
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

      {/* ==================================================================== */}
      {/* GROUPED PLATFORM SELECTOR: Social Media, GBP (Google), then Email */}
      {/* ==================================================================== */}
      <div className="p-3 sm:p-4 bg-[var(--surface2)] border-b border-[var(--border)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-500" />
              Platform Formats:
            </span>
            <button
              type="button"
              onClick={() => setShowSpecsModal(true)}
              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:text-cyan-500 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all cursor-pointer shadow-xs active:scale-95"
              title="View optimal image dimensions & platform specs"
              aria-label="View optimal platform sizes"
              id="view-platform-specs-btn"
            >
              <Info className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 3 Grouped Sections: Social Media, GBP, Email */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
          {/* 1. Social Media Group (LinkedIn/FB, Instagram, X, Story) */}
          <div className="md:col-span-6 p-2.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--muted)]">
              <span>1. Social Media</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {IMAGE_FORMAT_OPTIONS.filter(f => f.group === 'social').map((fmt) => {
                const isSelected = selectedFormatId === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setSelectedFormatId(fmt.id)}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[52px] ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500 text-cyan-600 dark:text-cyan-300 ring-1 ring-cyan-500 shadow-xs'
                        : 'bg-[var(--surface2)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    <div className="shrink-0">{fmt.renderIcons()}</div>
                    <div className="mt-1.5 font-display text-[11px] font-bold leading-snug truncate">
                      {fmt.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Google Business Profile Group (GBP) with Google Icon */}
          <div className="md:col-span-3 p-2.5 rounded-2xl bg-[var(--surface)] border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <span className="flex items-center gap-1.5">
                <GoogleIcon className="w-3.5 h-3.5" />
                <span>2. GBP Post</span>
              </span>
            </div>
            {IMAGE_FORMAT_OPTIONS.filter(f => f.group === 'gbp').map((fmt) => {
              const isSelected = selectedFormatId === fmt.id;
              return (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setSelectedFormatId(fmt.id)}
                  className={`w-full p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[52px] ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-300 ring-1 ring-amber-500 shadow-xs'
                      : 'bg-[var(--surface2)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <div className="shrink-0">{fmt.renderIcons()}</div>
                  <div className="mt-1.5 font-display text-[11px] font-bold leading-snug truncate">
                    {fmt.name}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 3. Email Group */}
          <div className="md:col-span-3 p-2.5 rounded-2xl bg-[var(--surface)] border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-500" />
                <span>3. Email Campaign</span>
              </span>
            </div>
            {IMAGE_FORMAT_OPTIONS.filter(f => f.group === 'email').map((fmt) => {
              const isSelected = selectedFormatId === fmt.id;
              return (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setSelectedFormatId(fmt.id)}
                  className={`w-full p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[52px] ${
                    isSelected
                      ? 'bg-purple-500/15 border-purple-500 text-purple-600 dark:text-purple-300 ring-1 ring-purple-500 shadow-xs'
                      : 'bg-[var(--surface2)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <div className="shrink-0">{fmt.renderIcons()}</div>
                  <div className="mt-1.5 font-display text-[11px] font-bold leading-snug truncate">
                    {fmt.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* DYNAMIC RATIO PREVIEW STAGE */}
      {/* ==================================================================== */}
      <div className="p-4 sm:p-6 bg-slate-950/90 flex items-center justify-center overflow-hidden">
        <div 
          className={`relative w-full ${activeFormat.aspectClass} overflow-hidden bg-slate-950 flex flex-col justify-between p-5 sm:p-8 select-none rounded-2xl border border-cyan-500/30 shadow-2xl transition-all`}
        >
          {/* Background Image */}
          <img
            src={selectedPhoto}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />

          {/* Cinematic Scrim Vignette Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/98 via-slate-950/65 to-slate-900/50 pointer-events-none" />

          {/* Decorative Inner Border */}
          <div className="absolute inset-2 sm:inset-3 rounded-xl border border-cyan-500/30 pointer-events-none" />

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
          <div className="relative z-10 space-y-2 my-auto pt-2">
            <h3 className="text-lg sm:text-2xl font-display font-bold text-white leading-tight tracking-tight drop-shadow-lg line-clamp-3">
              {title}
            </h3>

            {activeFormat.height >= 500 && (
              <p className="text-xs sm:text-sm text-slate-200 font-serif italic leading-relaxed line-clamp-2 drop-shadow">
                "{previewQuote}"
              </p>
            )}
          </div>

          {/* Bottom Bar: OVERLAY OF BUSINESS NAME & WEBSITE (NO DIMENSIONS ON IMAGE) */}
          <div className="relative z-10 pt-2.5 border-t border-white/20 flex items-center justify-between text-xs text-white">
            <div>
              <span className="font-bold font-sans text-white text-xs sm:text-sm block tracking-tight truncate max-w-[200px] sm:max-w-none">
                {businessName}
              </span>
              <span className="font-mono text-[10px] text-slate-300 truncate block">
                {website}
              </span>
            </div>

            <div className="text-right">
              <span className="font-mono text-[9px] uppercase tracking-wider text-cyan-300 block font-bold">
                {activeFormat.id === 'gbp_update' ? 'GBP Citation' : 'Verified Authority'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar: Format Info & Direct Downloads */}
      <div className="p-4 sm:p-5 border-t border-[var(--border)] bg-[var(--surface2)] flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted)]">
          <Layers className="w-4 h-4 text-cyan-500" />
          <span>Active Export: <strong className="text-[var(--text)]">{activeFormat.name} ({activeFormat.ratioLabel})</strong> · {activeFormat.dimensions}</span>
        </div>

        {/* Right: Download Actions - Full-width touch friendly buttons on mobile */}
        <div className="grid grid-cols-1 sm:flex sm:items-center gap-2.5 w-full sm:w-auto justify-stretch sm:justify-end">
          {/* Download All Formats Button */}
          <button
            type="button"
            onClick={handleDownloadAllFormats}
            disabled={isDownloading}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-cyan-500/40 bg-[var(--surface)] hover:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50 min-h-[44px]"
            title="Download all formats at once"
          >
            {downloadSuccessFormat === 'all' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">All Formats Saved!</span>
              </>
            ) : (
              <>
                <Layers className="w-3.5 h-3.5 text-cyan-500" />
                <span>Download All 6 Formats</span>
              </>
            )}
          </button>

          {/* Primary Button: Download Selected Size */}
          <button
            type="button"
            onClick={() => handleDownloadSingleFormat(activeFormat)}
            disabled={isDownloading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-cyan-500/20 active:scale-95 disabled:opacity-50 min-h-[44px]"
            title={`Export ${activeFormat.name} Graphic`}
          >
            {downloadSuccessFormat === activeFormat.id ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>Graphic Downloaded!</span>
              </>
            ) : (
              <>
                <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
                <span>Download {activeFormat.name}</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* ==================================================================== */}
      {/* OPTIMAL SIZES & PLATFORM SPECIFICATIONS MODAL */}
      {/* ==================================================================== */}
      {showSpecsModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="specs-modal-title"
          onClick={() => setShowSpecsModal(false)}
        >
          <div 
            className="w-full max-w-xl rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl p-6 sm:p-7 space-y-5 text-[var(--text)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[var(--border)]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                    <Info className="w-4 h-4" />
                  </div>
                  <h3 id="specs-modal-title" className="font-display text-lg sm:text-xl font-bold text-[var(--text)]">
                    Optimal Social & Platform Image Sizes
                  </h3>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Recommended resolutions, aspect ratios, and best practices for each channel.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowSpecsModal(false)}
                className="p-1.5 rounded-xl text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Specifications Cards List */}
            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {IMAGE_FORMAT_OPTIONS.map((fmt) => (
                <div 
                  key={fmt.id}
                  className="p-3.5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="shrink-0">{fmt.renderIcons()}</div>
                      <span className="font-display text-sm font-bold text-[var(--text)]">
                        {fmt.platform}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--muted)] leading-normal">
                      {fmt.description}
                    </p>
                  </div>

                  <div className="shrink-0 sm:text-right flex sm:flex-col items-center sm:items-end justify-between gap-1 pt-1 sm:pt-0 border-t sm:border-t-0 border-[var(--border)]">
                    <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-md">
                      {fmt.dimensions} px
                    </span>
                    <span className="font-mono text-[11px] text-[var(--muted)]">
                      {fmt.ratioLabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] font-mono text-[var(--muted)]">
                All downloads are exported at full 2x retina clarity.
              </span>
              <button
                type="button"
                onClick={() => setShowSpecsModal(false)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-display text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
