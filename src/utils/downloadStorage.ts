import { DownloadedAsset, UserProfile } from '../types';

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

// Downloaded assets management
export function getDownloadedAssets(userId?: string): DownloadedAsset[] {
  if (typeof window === 'undefined') return [];
  try {
    const key = `et_downloaded_assets_${userId || 'guest'}`;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Error reading downloaded assets:', e);
    return [];
  }
}

export function addDownloadedAsset(userId: string | undefined, asset: DownloadedAsset): DownloadedAsset[] {
  if (typeof window === 'undefined') return [asset];
  try {
    const current = getDownloadedAssets(userId);
    // Keep most recent first, prevent duplicates
    const filtered = current.filter(a => a.id !== asset.id);
    const updated = [asset, ...filtered];
    const key = `et_downloaded_assets_${userId || 'guest'}`;
    localStorage.setItem(key, JSON.stringify(updated.slice(0, 50))); // Cap at 50 to conserve storage
    
    // Dispatch custom event for reactive UI updates
    window.dispatchEvent(new CustomEvent('et_asset_downloaded', { detail: asset }));
    return updated;
  } catch (e) {
    console.warn('Error saving downloaded asset:', e);
    return [];
  }
}

export function removeDownloadedAsset(userId: string | undefined, assetId: string): DownloadedAsset[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getDownloadedAssets(userId);
    const updated = current.filter(a => a.id !== assetId);
    const key = `et_downloaded_assets_${userId || 'guest'}`;
    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('et_asset_downloaded', { detail: { id: assetId, deleted: true } }));
    return updated;
  } catch (e) {
    return [];
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
