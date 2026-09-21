import { DownloadedAsset, UserProfile } from '../types';
import { getDownloadedAssets } from './downloadStorage';

export interface UserSectionMetric {
  id: string;
  name: string;
  seconds: number;
  visits: number;
  lastVisited: string;
}

export interface UserDownloadRecord {
  id: string;
  title: string;
  format?: string;
  type: string;
  timestamp: string;
}

export interface PersonalTelemetryData {
  uid: string;
  email: string;
  displayName: string;
  tier: string;
  logins: number;
  firstSeen: string;
  lastActive: string;
  totalTimeSeconds: number;
  sections: Record<string, UserSectionMetric>;
  downloads: UserDownloadRecord[];
  recentActions: { id: string; action: string; description: string; timestamp: string }[];
}

export const SECTION_METADATA: Record<string, { name: string; description: string; icon: string }> = {
  profile_dna: {
    name: 'Business DNA',
    description: 'Brand positioning, core audience, locked website & voice archetype',
    icon: 'Dna'
  },
  content_studio: {
    name: 'Content Studio',
    description: '300-word authority dispatches & multi-platform format studio',
    icon: 'Sparkles'
  },
  downloads: {
    name: 'Downloads Vault',
    description: 'Archived social media graphics, email headers & strategy playbooks',
    icon: 'Download'
  },
  market_report: {
    name: 'Market Report',
    description: 'Competitive intelligence, search volume & demand telemetry',
    icon: 'TrendingUp'
  },
  learning_feed: {
    name: 'Learning Feed',
    description: 'Curated growth tactics & marketing masterclasses',
    icon: 'BookOpen'
  },
  founder_note: {
    name: "Founder's Note",
    description: 'Strategic vision & direct message from Eric Thomas',
    icon: 'Award'
  }
};

const DEFAULT_SECTIONS: Record<string, UserSectionMetric> = {
  profile_dna: { id: 'profile_dna', name: 'Business DNA', seconds: 480, visits: 3, lastVisited: new Date().toISOString() },
  content_studio: { id: 'content_studio', name: 'Content Studio', seconds: 720, visits: 4, lastVisited: new Date().toISOString() },
  downloads: { id: 'downloads', name: 'Downloads Vault', seconds: 180, visits: 2, lastVisited: new Date().toISOString() },
  market_report: { id: 'market_report', name: 'Market Report', seconds: 240, visits: 2, lastVisited: new Date().toISOString() },
  learning_feed: { id: 'learning_feed', name: 'Learning Feed', seconds: 120, visits: 1, lastVisited: new Date().toISOString() },
  founder_note: { id: 'founder_note', name: "Founder's Note", seconds: 90, visits: 1, lastVisited: new Date().toISOString() }
};

/**
 * Get or initialize user-specific telemetry data
 */
export function getUserTelemetry(
  userId?: string | null,
  email?: string | null,
  displayName?: string | null,
  profile?: UserProfile | null
): PersonalTelemetryData {
  const uid = userId || profile?.uid || 'guest_user';
  const safeEmail = email || profile?.email || 'user@growthos.internal';
  const safeName = displayName || profile?.business_name || profile?.displayName || 'Growth OS Partner';
  const tier = (uid.includes('owner') || safeEmail.toLowerCase().includes('ericlamarthomas'))
    ? 'Agency Administrator'
    : profile?.tier === 'monthly' || profile?.tier === 'consultation'
    ? 'Monthly Growth OS'
    : 'Quarterly Free Tier';

  const storageKey = `et_user_telemetry_${uid}`;

  let storedData: any = null;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) storedData = JSON.parse(raw);
    } catch (e) {
      console.warn('Error reading personal telemetry:', e);
    }
  }

  // Retrieve logins count from user registry or stored count
  let loginsCount = storedData?.logins || 1;
  if (typeof window !== 'undefined') {
    try {
      const registry = JSON.parse(localStorage.getItem('et_users_telemetry_registry') || '{}');
      if (registry[uid]?.logins) {
        loginsCount = Math.max(loginsCount, registry[uid].logins);
      }
    } catch (e) {}
  }

  // Ensure sections object has all defined sections
  const sections: Record<string, UserSectionMetric> = { ...DEFAULT_SECTIONS };
  if (storedData?.sections) {
    Object.keys(storedData.sections).forEach(key => {
      sections[key] = {
        ...sections[key],
        ...storedData.sections[key]
      };
    });
  }

  // Retrieve all downloads for this user from downloadStorage
  const downloadedAssets: DownloadedAsset[] = getDownloadedAssets(uid);
  const downloadRecords: UserDownloadRecord[] = (storedData?.downloads || []).slice();

  // Merge any assets from downloadedAssets that aren't already in downloadRecords
  downloadedAssets.forEach(asset => {
    const existing = downloadRecords.find(d => d.id === asset.id || d.title === asset.title);
    if (!existing) {
      downloadRecords.unshift({
        id: asset.id,
        title: asset.title || 'Brand Graphic',
        format: asset.formatName || asset.dimensions || 'Media Asset',
        type: 'Editorial Graphic',
        timestamp: asset.downloadedAt || new Date().toISOString()
      });
    }
  });

  // Calculate total active time
  const totalTimeSeconds = Object.values(sections).reduce((acc, s) => acc + (s.seconds || 0), 0);

  const initialActions = [
    {
      id: 'act_login',
      action: 'Session Login',
      description: 'Logged into ET Digital Growth OS™ platform',
      timestamp: storedData?.lastActive || new Date().toISOString()
    },
    {
      id: 'act_dna',
      action: 'Business DNA Sync',
      description: `Targeting locked for ${profile?.location || 'Local & National'}`,
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
    }
  ];

  return {
    uid,
    email: safeEmail,
    displayName: safeName,
    tier,
    logins: loginsCount,
    firstSeen: storedData?.firstSeen || profile?.created_at || new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    lastActive: new Date().toISOString(),
    totalTimeSeconds,
    sections,
    downloads: downloadRecords,
    recentActions: storedData?.recentActions || initialActions
  };
}

/**
 * Record time spent on a section
 */
export function recordSectionTime(
  userId: string | undefined,
  sectionId: string,
  sectionName: string,
  additionalSeconds: number
): void {
  if (typeof window === 'undefined' || !userId || additionalSeconds <= 0) return;

  const storageKey = `et_user_telemetry_${userId}`;
  try {
    const raw = localStorage.getItem(storageKey);
    const data = raw ? JSON.parse(raw) : { sections: {}, recentActions: [] };

    if (!data.sections) data.sections = {};
    const existing = data.sections[sectionId] || {
      id: sectionId,
      name: sectionName,
      seconds: 0,
      visits: 0,
      lastVisited: new Date().toISOString()
    };

    existing.seconds = (existing.seconds || 0) + additionalSeconds;
    existing.lastVisited = new Date().toISOString();
    data.sections[sectionId] = existing;
    data.lastActive = new Date().toISOString();

    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (e) {
    console.warn('Error recording section time:', e);
  }
}

/**
 * Increment visit count when user enters a section
 */
export function recordSectionVisit(
  userId: string | undefined,
  sectionId: string,
  sectionName: string
): void {
  if (typeof window === 'undefined' || !userId) return;

  const storageKey = `et_user_telemetry_${userId}`;
  try {
    const raw = localStorage.getItem(storageKey);
    const data = raw ? JSON.parse(raw) : { sections: {}, recentActions: [] };

    if (!data.sections) data.sections = {};
    const existing = data.sections[sectionId] || {
      id: sectionId,
      name: sectionName,
      seconds: 0,
      visits: 0,
      lastVisited: new Date().toISOString()
    };

    existing.visits = (existing.visits || 0) + 1;
    existing.lastVisited = new Date().toISOString();
    data.sections[sectionId] = existing;
    data.lastActive = new Date().toISOString();

    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (e) {
    console.warn('Error recording section visit:', e);
  }
}

/**
 * Record download in user's personal telemetry
 */
export function recordUserDownload(
  userId: string | undefined,
  title: string,
  format?: string,
  type: string = 'Editorial Graphic'
): void {
  if (typeof window === 'undefined' || !userId) return;

  const storageKey = `et_user_telemetry_${userId}`;
  try {
    const raw = localStorage.getItem(storageKey);
    const data = raw ? JSON.parse(raw) : { sections: {}, downloads: [], recentActions: [] };

    if (!data.downloads) data.downloads = [];
    const newRecord: UserDownloadRecord = {
      id: 'dl_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      title,
      format,
      type,
      timestamp: new Date().toISOString()
    };

    data.downloads.unshift(newRecord);
    if (data.downloads.length > 50) data.downloads.length = 50;

    if (!data.recentActions) data.recentActions = [];
    data.recentActions.unshift({
      id: 'act_' + Date.now(),
      action: 'Asset Download',
      description: `Downloaded ${title} (${format || type})`,
      timestamp: new Date().toISOString()
    });
    if (data.recentActions.length > 20) data.recentActions.length = 20;

    data.lastActive = new Date().toISOString();
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (e) {
    console.warn('Error recording download:', e);
  }
}

/**
 * Helper to format duration into human-readable text
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '< 1 min';
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  const remainingSecs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}h ${remainingMins}m`;
  }
  if (mins > 0) {
    return `${mins}m ${remainingSecs > 0 ? `${remainingSecs}s` : ''}`.trim();
  }
  return `${remainingSecs}s`;
}
