import React, { useState, useEffect, useCallback } from 'react';
import { 
  Download, Image as ImageIcon, Trash2, ExternalLink, 
  Layers, ArrowRight, Sparkles, Check, Clock, ShieldCheck,
  RefreshCw, Smartphone, Monitor
} from 'lucide-react';
import { UserProfile, DownloadedAsset } from '../../types';
import { 
  getDownloadedAssets, 
  removeDownloadedAsset, 
  syncDownloadedAssetsAcrossDevices 
} from '../../utils/downloadStorage';

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
  const userEmail = (user?.email || profile?.email || '').trim().toLowerCase();
  const [assets, setAssets] = useState<DownloadedAsset[]>(() => getDownloadedAssets(user?.uid, userEmail));
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');

  const loadLocalAssets = useCallback(() => {
    const list = getDownloadedAssets(user?.uid, userEmail);
    setAssets(list);
  }, [user?.uid, userEmail]);

  const triggerCloudSync = useCallback(async () => {
    setIsSyncing(true);
    setSyncStatus('syncing');
    try {
      const merged = await syncDownloadedAssetsAcrossDevices(user?.uid, userEmail);
      if (merged && merged.length > 0) {
        setAssets(merged);
      }
      setSyncStatus('synced');
    } catch (e) {
      console.warn('Cross-device sync notice:', e);
      setSyncStatus('idle');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus('idle'), 3500);
    }
  }, [user?.uid, userEmail]);

  useEffect(() => {
    // 1. Instantly display whatever is cached locally (0ms)
    loadLocalAssets();

    // 2. Perform background cloud sync to bring down any assets downloaded from desktop or other devices
    triggerCloudSync();

    const handleUpdate = () => {
      loadLocalAssets();
    };

    window.addEventListener('et_asset_downloaded', handleUpdate);
    return () => {
      window.removeEventListener('et_asset_downloaded', handleUpdate);
    };
  }, [user?.uid, userEmail, loadLocalAssets, triggerCloudSync]);

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
    const updated = removeDownloadedAsset(user?.uid, assetId, userEmail);
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
    <div className="space-y-4 sm:space-y-6 text-left" id="downloads-vault-panel">
      
      {/* Top Header Card */}
      <div className="rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-7 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-500 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30 flex items-center gap-1.5">
              <Download className="w-3 h-3" />
              Downloads Vault
            </span>
            <span className="font-mono text-[10px] text-[var(--muted)] px-2.5 py-0.5 rounded-full bg-[var(--surface2)] border border-[var(--border)]">
              {assets.length} {assets.length === 1 ? 'Graphic Saved' : 'Graphics Saved'}
            </span>
            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3 h-3" />
              Universal Cloud Sync
            </span>
          </div>

          <h2 className="text-lg sm:text-2xl font-display font-bold tracking-tight text-[var(--text)]">
            Your Downloaded Editorial Assets
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted)] max-w-2xl leading-relaxed">
            Every branded editorial graphic, social post, and banner downloaded from your Content Studio is automatically synced across your phone, tablet, and desktop.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={triggerCloudSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-500 font-mono text-[11px] font-bold hover:bg-cyan-500/20 transition-all cursor-pointer disabled:opacity-50 min-h-[36px]"
              title="Synchronize downloads across mobile and desktop devices"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing Devices...' : syncStatus === 'synced' ? 'Synced with Cloud' : 'Sync Devices'}</span>
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-[var(--muted)]">
              <Monitor className="w-3.5 h-3.5 text-cyan-500" />
              <span>Desktop</span>
              <span>↔</span>
              <Smartphone className="w-3.5 h-3.5 text-cyan-500" />
              <span>Mobile Synchronized</span>
            </div>
          </div>
        </div>

        {onNavigateToContentStudio && (
          <button
            type="button"
            onClick={onNavigateToContentStudio}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0 min-h-[44px]"
          >
            <Layers className="w-4 h-4" />
            <span>Open Content Studio</span>
          </button>
        )}
      </div>

      {/* Grid of Downloaded Assets or Empty State */}
      {assets.length === 0 ? (
        <div className="rounded-2xl sm:rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 sm:p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 mx-auto">
            <ImageIcon className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-display text-base font-bold text-[var(--text)]">
              No Downloaded Graphics Yet
            </h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              When you download your 1:1 editorial graphics, Instagram stories, or Google Business Profile assets in the Content Studio, they are instantly archived and available across both your mobile device and computer.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {onNavigateToContentStudio && (
              <button
                type="button"
                onClick={onNavigateToContentStudio}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-display text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md hover:from-cyan-300 transition-all min-h-[44px]"
              >
                <span>Go to Content Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={triggerCloudSync}
              disabled={isSyncing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface2)] text-[var(--text)] font-mono text-xs font-bold transition-all cursor-pointer min-h-[44px]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Check for Desktop Downloads</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5 sm:p-4 shadow-sm space-y-3.5 flex flex-col justify-between group hover:border-cyan-500/50 transition-all"
            >
              {/* Image Preview with Mobile-Optimized Aspect Ratio & Lazy Loading */}
              <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-[1/1] border border-[var(--border)] flex items-center justify-center">
                {asset.dataUrl ? (
                  <img
                    src={asset.dataUrl}
                    alt={asset.title}
                    loading="lazy"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 gap-2 p-4 text-center">
                    <ImageIcon className="w-8 h-8 text-cyan-500/60" />
                    <span className="text-[11px] font-mono text-slate-400 font-medium">Asset Archived</span>
                    <span className="text-[9px] font-mono text-slate-500">Tap Download to retrieve full resolution</span>
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

              {/* Actions - Touch-Friendly on Mobile */}
              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadAgain(asset)}
                  disabled={downloadingId === asset.id}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-cyan-500/30 active:scale-95 min-h-[44px]"
                  title="Download image file to your device"
                >
                  {downloadingId === asset.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Saved!</span>
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
                  className="p-2.5 rounded-xl border border-[var(--border)] hover:bg-rose-500/10 hover:border-rose-500/40 text-[var(--muted)] hover:text-rose-500 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
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
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <p className="text-[11px] leading-relaxed">
            Universal Sync Active: Assets saved on your desktop automatically appear on your mobile phone via your email profile.
          </p>
        </div>
        {onOpenBooking && (
          <button
            type="button"
            onClick={onOpenBooking}
            className="text-cyan-600 dark:text-cyan-400 font-mono text-[11px] font-bold hover:underline shrink-0 cursor-pointer min-h-[36px] flex items-center"
          >
            Need Custom Creative? Consult with Us →
          </button>
        )}
      </div>

    </div>
  );
}
