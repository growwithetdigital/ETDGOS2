import React, { useState, useEffect } from 'react';
import { 
  Download, Image as ImageIcon, Trash2, ExternalLink, 
  Layers, ArrowRight, Sparkles, Check, Clock, ShieldCheck
} from 'lucide-react';
import { UserProfile, DownloadedAsset } from '../../types';
import { getDownloadedAssets, removeDownloadedAsset } from '../../utils/downloadStorage';

interface DownloadsPanelProps {
  user: any;
  profile: UserProfile | null;
  onNavigateToContentStudio?: () => void;
  onOpenBooking?: () => void;
}

export default function DownloadsPanel({
  user,
  profile,
  onNavigateToContentStudio,
  onOpenBooking
}: DownloadsPanelProps) {
  const [assets, setAssets] = useState<DownloadedAsset[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadAssets = () => {
    const list = getDownloadedAssets(user?.uid);
    setAssets(list);
  };

  useEffect(() => {
    loadAssets();

    const handleUpdate = () => {
      loadAssets();
    };

    window.addEventListener('et_asset_downloaded', handleUpdate);
    return () => {
      window.removeEventListener('et_asset_downloaded', handleUpdate);
    };
  }, [user?.uid]);

  const handleDownloadAgain = (asset: DownloadedAsset) => {
    setDownloadingId(asset.id);
    try {
      const link = document.createElement('a');
      link.href = asset.dataUrl || '';
      link.download = asset.filename || `${asset.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.warn('Re-download error:', e);
    } finally {
      setTimeout(() => setDownloadingId(null), 1200);
    }
  };

  const handleDelete = (assetId: string) => {
    const updated = removeDownloadedAsset(user?.uid, assetId);
    setAssets(updated);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Recently';
    }
  };

  return (
    <div className="space-y-6 text-left" id="downloads-vault-panel">
      
      {/* Top Header Card */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-500 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30 flex items-center gap-1.5">
              <Download className="w-3 h-3" />
              Downloads Vault
            </span>
            <span className="font-mono text-[10px] text-[var(--muted)] px-2.5 py-0.5 rounded-full bg-[var(--surface2)] border border-[var(--border)]">
              {assets.length} {assets.length === 1 ? 'Graphic Saved' : 'Graphics Saved'}
            </span>
            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3 h-3" />
              Persistent Storage
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-[var(--text)]">
            Your Downloaded Editorial Assets
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[var(--muted)] max-w-2xl leading-relaxed">
            Every branded editorial graphic, social post, and banner downloaded from your Content Studio is automatically archived here for quick re-downloading across sessions.
          </p>
        </div>

        {onNavigateToContentStudio && (
          <button
            type="button"
            onClick={onNavigateToContentStudio}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Layers className="w-4 h-4" />
            <span>Open Content Studio</span>
          </button>
        )}
      </div>

      {/* Grid of Downloaded Assets or Empty State */}
      {assets.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 mx-auto">
            <ImageIcon className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-display text-base font-bold text-[var(--text)]">
              No Downloaded Graphics Yet
            </h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              When you download your 1:1 editorial graphics, Instagram stories, or Google Business Profile assets in the Content Studio, they will be archived here permanently for one-click retrieval.
            </p>
          </div>
          {onNavigateToContentStudio && (
            <button
              type="button"
              onClick={onNavigateToContentStudio}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-display text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md hover:from-cyan-300 transition-all"
            >
              <span>Go to Content Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm space-y-3.5 flex flex-col justify-between group hover:border-cyan-500/50 transition-all"
            >
              {/* Image Preview */}
              <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-[1/1] border border-[var(--border)] flex items-center justify-center">
                {asset.dataUrl ? (
                  <img
                    src={asset.dataUrl}
                    alt={asset.title}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-600 gap-2">
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-[10px] font-mono">Preview Archived</span>
                  </div>
                )}
                
                <span className="absolute top-2.5 left-2.5 font-mono text-[9px] uppercase px-2 py-0.5 rounded-md bg-slate-950/80 text-cyan-400 border border-cyan-500/30 backdrop-blur-sm font-bold">
                  {asset.formatName || 'Editorial Graphic'}
                </span>
                
                <span className="absolute bottom-2.5 right-2.5 font-mono text-[9px] px-2 py-0.5 rounded-md bg-slate-950/80 text-slate-300 backdrop-blur-sm">
                  {asset.dimensions}
                </span>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-1.5 flex-1">
                <h4 className="font-display text-sm font-bold text-[var(--text)] line-clamp-2 leading-snug">
                  {asset.title}
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--muted)]">
                  <Clock className="w-3 h-3" />
                  <span>Downloaded {formatDate(asset.downloadedAt)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadAgain(asset)}
                  disabled={downloadingId === asset.id}
                  className="flex-1 px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-cyan-500/30 active:scale-95"
                  title="Download image file to your device"
                >
                  {downloadingId === asset.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Downloaded!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Again</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(asset.id)}
                  className="p-2 rounded-xl border border-[var(--border)] hover:bg-rose-500/10 hover:border-rose-500/40 text-[var(--muted)] hover:text-rose-500 transition-all cursor-pointer"
                  title="Remove from Downloads vault"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Info Box */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface2)] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[var(--muted)] font-sans">
        <p className="text-[11px] leading-relaxed">
          Downloads are saved client-side for immediate access. When your next quarterly content package unlocks, your new graphics will appear here automatically when downloaded.
        </p>
        {onOpenBooking && (
          <button
            type="button"
            onClick={onOpenBooking}
            className="text-cyan-600 dark:text-cyan-400 font-mono text-[11px] font-bold hover:underline shrink-0 cursor-pointer"
          >
            Need High-Volume Creative? Work with Us →
          </button>
        )}
      </div>

    </div>
  );
}
