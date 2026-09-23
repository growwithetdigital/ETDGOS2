import { DownloadedAsset, UserProfile } from '../types';
import { 
  saveDownloadedAssetToFirestore, 
  fetchDownloadedAssetsFromFirestore, 
  deleteDownloadedAssetFromFirestore 
} from '../lib/firebase';

export function getCurrentQuarterKey(): string {
  const now = new Date();
  const q = Math.floor(now.getMonth() / 3) + 1;
  return `Q${q}_${now.getFullYear()}`;
}

export function getCurrentQuarterLabel(): string {
  const now = new Date();
  const q = Math.floor(now.getMonth() / 3) + 1;
  return `Q${q} ${now.getFullYear()}`;
}

// Downloaded assets management with Firestore cross-device synchronization
export function getDownloadedAssets(userId?: string, userEmail?: string): DownloadedAsset[] {
  if (typeof window === 'undefined') return [];
  try {
    const key = `et_downloaded_assets_${userId || 'guest'}`;
    let stored = localStorage.getItem(key);
    
    // Also check email-keyed storage if userEmail provided
    if (!stored && userEmail) {
      const emailKey = `et_downloaded_assets_${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
      stored = localStorage.getItem(emailKey);
    }

    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Error reading downloaded assets:', e);
    return [];
  }
}

export function addDownloadedAsset(
  userId: string | undefined, 
  asset: DownloadedAsset, 
  userEmail?: string
): DownloadedAsset[] {
  if (typeof window === 'undefined') return [asset];
  try {
    const current = getDownloadedAssets(userId, userEmail);
    // Keep most recent first, prevent duplicates
    const filtered = current.filter(a => a.id !== asset.id);
    const updated = [asset, ...filtered];
    
    const key = `et_downloaded_assets_${userId || 'guest'}`;
    try {
      localStorage.setItem(key, JSON.stringify(updated.slice(0, 50))); // Cap at 50
    } catch (quotaErr) {
      // If local storage is full, strip dataUrl for older items in local cache
      const optimized = updated.map((item, idx) => {
        if (idx > 5) {
          return { ...item, dataUrl: undefined };
        }
        return item;
      });
      try {
        localStorage.setItem(key, JSON.stringify(optimized.slice(0, 30)));
      } catch (e) {}
    }

    if (userEmail) {
      const emailKey = `et_downloaded_assets_${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
      try {
        localStorage.setItem(emailKey, JSON.stringify(updated.slice(0, 50)));
      } catch (e) {}
    }
    
    // Asynchronously sync to Firestore (universal across mobile, desktop & incognito)
    saveDownloadedAssetToFirestore(userId, asset, userEmail).catch((fsErr) => {
      console.warn('Firestore asset save deferred:', fsErr);
    });

    // Dispatch custom event for reactive UI updates
    window.dispatchEvent(new CustomEvent('et_asset_downloaded', { detail: asset }));
    return updated;
  } catch (e) {
    console.warn('Error saving downloaded asset:', e);
    return [];
  }
}

export function removeDownloadedAsset(
  userId: string | undefined, 
  assetId: string, 
  userEmail?: string
): DownloadedAsset[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getDownloadedAssets(userId, userEmail);
    const updated = current.filter(a => a.id !== assetId);
    const key = `et_downloaded_assets_${userId || 'guest'}`;
    localStorage.setItem(key, JSON.stringify(updated));

    if (userEmail) {
      const emailKey = `et_downloaded_assets_${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
      try {
        localStorage.setItem(emailKey, JSON.stringify(updated));
      } catch (e) {}
    }

    // Delete from Firestore
    deleteDownloadedAssetFromFirestore(userId, assetId, userEmail).catch(() => {});

    window.dispatchEvent(new CustomEvent('et_asset_downloaded', { detail: { id: assetId, deleted: true } }));
    return updated;
  } catch (e) {
    return [];
  }
}

/**
 * Synchronizes downloaded assets with Firestore across desktop and mobile devices.
 * Returns the combined, deduplicated assets sorted by downloadedAt.
 */
export async function syncDownloadedAssetsAcrossDevices(
  userId?: string, 
  userEmail?: string
): Promise<DownloadedAsset[]> {
  const localList = getDownloadedAssets(userId, userEmail);
  try {
    const remoteList = await fetchDownloadedAssetsFromFirestore(userId, userEmail);
    if (!remoteList || remoteList.length === 0) {
      // If we have local items that aren't in Firestore yet, backfill to Firestore
      if (localList.length > 0) {
        Promise.all(localList.map(item => saveDownloadedAssetToFirestore(userId, item, userEmail))).catch(() => {});
      }
      return localList;
    }

    // Merge remote and local by id
    const map = new Map<string, DownloadedAsset>();
    // First insert remote
    remoteList.forEach(item => {
      if (item && item.id) map.set(item.id, item);
    });
    // Then merge local (preserving dataUrl if local has richer data)
    localList.forEach(item => {
      if (item && item.id) {
        const existing = map.get(item.id);
        if (existing) {
          map.set(item.id, {
            ...existing,
            dataUrl: item.dataUrl || existing.dataUrl
          });
        } else {
          map.set(item.id, item);
          // Backfill this local item to Firestore
          saveDownloadedAssetToFirestore(userId, item, userEmail).catch(() => {});
        }
      }
    });

    const merged = Array.from(map.values()).sort((a, b) => {
      return new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime();
    });

    // Update local storage
    if (typeof window !== 'undefined') {
      const key = `et_downloaded_assets_${userId || 'guest'}`;
      try {
        localStorage.setItem(key, JSON.stringify(merged.slice(0, 50)));
      } catch (e) {}
      if (userEmail) {
        const emailKey = `et_downloaded_assets_${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
        try {
          localStorage.setItem(emailKey, JSON.stringify(merged.slice(0, 50)));
        } catch (e) {}
      }
      window.dispatchEvent(new CustomEvent('et_asset_downloaded', { detail: { synced: true } }));
    }

    return merged;
  } catch (err) {
    console.warn('syncDownloadedAssetsAcrossDevices error:', err);
    return localList;
  }
}

// Quarterly Business DNA reset limit (Strict 3 per quarter)
export const MAX_RESETS_PER_QUARTER = 3;

export function getQuarterlyResetsCount(userId?: string, profile?: UserProfile | null): number {
  if (typeof window === 'undefined') return 0;
  const qKey = getCurrentQuarterKey();
  
  // First check profile if synced
  if (profile?.dna_resets_quarter === qKey && typeof profile?.dna_resets_count === 'number') {
    return profile.dna_resets_count;
  }
  
  const key = `et_dna_resets_${qKey}_${userId || 'guest'}`;
  const stored = localStorage.getItem(key);
  return stored ? Math.max(0, parseInt(stored, 10)) : 0;
}

export function recordQuarterlyResetCount(userId?: string, profile?: UserProfile | null): { count: number; remaining: number } {
  const qKey = getCurrentQuarterKey();
  const current = getQuarterlyResetsCount(userId, profile);
  const next = current + 1;
  if (typeof window !== 'undefined') {
    localStorage.setItem(`et_dna_resets_${qKey}_${userId || 'guest'}`, next.toString());
  }
  const remaining = Math.max(0, MAX_RESETS_PER_QUARTER - next);
  return { count: next, remaining };
}

// Content Studio 90-Day Lock
export const CONTENT_LOCK_DAYS = 90;

export function getContentLockStatus(userId?: string, profile?: UserProfile | null): {
  isLocked: boolean;
  generatedAt: string | null;
  daysRemaining: number;
} {
  if (typeof window === 'undefined') {
    return { isLocked: false, generatedAt: null, daysRemaining: 0 };
  }

  const generatedAt = profile?.content_generated_at || localStorage.getItem(`et_content_generated_${userId || 'guest'}`);
  if (!generatedAt) {
    return { isLocked: false, generatedAt: null, daysRemaining: 0 };
  }

  const generatedTime = new Date(generatedAt).getTime();
  if (isNaN(generatedTime)) {
    return { isLocked: false, generatedAt: null, daysRemaining: 0 };
  }

  const msInDay = 1000 * 60 * 60 * 24;
  const elapsedDays = Math.floor((Date.now() - generatedTime) / msInDay);
  const daysRemaining = Math.max(0, CONTENT_LOCK_DAYS - elapsedDays);

  return {
    isLocked: daysRemaining > 0,
    generatedAt,
    daysRemaining,
  };
}

export function markContentGenerated(userId?: string): string {
  const timestamp = new Date().toISOString();
  if (typeof window !== 'undefined') {
    localStorage.setItem(`et_content_generated_${userId || 'guest'}`, timestamp);
    // Initialize 3 revisions
    localStorage.setItem(`et_revisions_remaining_${userId || 'guest'}`, '3');
  }
  return timestamp;
}

// Revisions Limit: Strictly 3 revisions after generation
export const MAX_REVISIONS = 3;

export function getRevisionsRemaining(userId?: string, profile?: UserProfile | null): number {
  if (typeof window === 'undefined') return MAX_REVISIONS;
  if (typeof profile?.revisions_remaining === 'number') {
    return profile.revisions_remaining;
  }
  const stored = localStorage.getItem(`et_revisions_remaining_${userId || 'guest'}`);
  return stored !== null ? Math.max(0, parseInt(stored, 10)) : MAX_REVISIONS;
}

export function decrementRevisionsRemaining(userId?: string): number {
  const current = getRevisionsRemaining(userId);
  const next = Math.max(0, current - 1);
  if (typeof window !== 'undefined') {
    localStorage.setItem(`et_revisions_remaining_${userId || 'guest'}`, next.toString());
  }
  return next;
}

export interface ContentRevisionData {
  blogTitle?: string;
  blogBody?: string;
  socialCaption?: string;
  eblastSubject?: string;
  eblastBody?: string;
  gbpBody?: string;
  savedAt?: string;
}

export function getSavedContentRevisions(userId?: string): ContentRevisionData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`et_content_revisions_${userId || 'guest'}`);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveContentRevision(userId: string | undefined, data: ContentRevisionData): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getSavedContentRevisions(userId) || {};
    const updated = {
      ...existing,
      ...data,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(`et_content_revisions_${userId || 'guest'}`, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error saving revision data:', e);
  }
}
