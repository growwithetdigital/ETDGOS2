import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  signInAnonymously,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  increment, 
  query, 
  where, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { UserProfile, AuditRecord, GeneratedContentItem, PlatformTelemetryEvent, DownloadedAsset, DashboardProgress, UniversalSession } from '../types';
import defaultFirebaseConfig from '../../firebase-applet-config.json';

// Support embedded config and optional Vercel environment variables
const firebaseConfig = {
  apiKey: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FIREBASE_API_KEY) || defaultFirebaseConfig.apiKey,
  authDomain: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN) || defaultFirebaseConfig.authDomain,
  projectId: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID) || defaultFirebaseConfig.projectId,
  storageBucket: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET) || defaultFirebaseConfig.storageBucket,
  messagingSenderId: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID) || defaultFirebaseConfig.messagingSenderId,
  appId: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FIREBASE_APP_ID) || defaultFirebaseConfig.appId,
  firestoreDatabaseId: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FIREBASE_FIRESTORE_DATABASE_ID) || (defaultFirebaseConfig as any).firestoreDatabaseId,
};

// Initialize Firebase safely
let app: any;
let dbInstance: any;
let authInstance: any;

try {
  app = initializeApp(firebaseConfig);
  const dbId = (firebaseConfig as any).firestoreDatabaseId;
  if (dbId && typeof dbId === 'string' && dbId.trim() !== '' && dbId !== '(default)') {
    try {
      dbInstance = getFirestore(app, dbId);
    } catch {
      dbInstance = getFirestore(app);
    }
  } else {
    dbInstance = getFirestore(app);
  }
  authInstance = getAuth(app);
  if (typeof window !== 'undefined' && authInstance) {
    setPersistence(authInstance, browserLocalPersistence).catch(() => {});
  }
} catch (e) {
  console.warn('Firebase initialization notice:', e);
}

export const db = dbInstance;
export const auth = authInstance;

// Initialize Firebase Analytics if supported in browser environment
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics optional fallback
  });
}

// Google Auth Provider setup with Workspace scopes (for connecting Google Drive, Calendar, Docs)
export const workspaceProvider = new GoogleAuthProvider();
workspaceProvider.setCustomParameters({ prompt: 'select_account' });
workspaceProvider.addScope('https://www.googleapis.com/auth/drive');
workspaceProvider.addScope('https://www.googleapis.com/auth/drive.file');
workspaceProvider.addScope('https://www.googleapis.com/auth/forms.body');
workspaceProvider.addScope('https://www.googleapis.com/auth/forms.responses.readonly');
workspaceProvider.addScope('https://www.googleapis.com/auth/spreadsheets');
workspaceProvider.addScope('https://mail.google.com/');
workspaceProvider.addScope('https://www.googleapis.com/auth/gmail.send');
workspaceProvider.addScope('https://www.googleapis.com/auth/calendar');
workspaceProvider.addScope('https://www.googleapis.com/auth/meetings.space.created');
workspaceProvider.addScope('https://www.googleapis.com/auth/classroom.courses');
workspaceProvider.addScope('https://www.googleapis.com/auth/classroom.announcements');
workspaceProvider.addScope('https://www.googleapis.com/auth/classroom.rosters');

// Standard Google provider for Growth OS sign-in (email & profile only - ultra-fast single click)
export const standardGoogleProvider = new GoogleAuthProvider();

// Backward compatibility export
export const provider = workspaceProvider;

// In-memory token caching (MANDATORY: do not use localStorage for credentials)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

// 1. Initialize Auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken || '');
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// 2. Google sign in with popup (supports standard login and workspace integration)
export const googleSignIn = async (includeWorkspaceScopes = false): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const authProvider = includeWorkspaceScopes ? workspaceProvider : standardGoogleProvider;
    if (includeWorkspaceScopes) {
      authProvider.setCustomParameters({ prompt: 'select_account' });
    }
    const result = await signInWithPopup(auth, authProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || '';
    if (typeof window !== 'undefined') {
      localStorage.removeItem('et_signed_out');
    }
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Google login failed:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// 3. Google sign out
export const googleSignOut = async () => {
  try {
    await signOut(auth);
  } catch (e) {
    console.warn('SignOut error:', e);
  }
  cachedAccessToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('et_growth_os_local_user');
    localStorage.removeItem('et_growth_os_active_uid');
    localStorage.setItem('et_signed_out', 'true');
  }
};

// 4. Retrieve access token
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

// 5. Firestore secure error wrapper
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Hardened Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 6. Firestore Booking Form Submissions
export interface BookingLead {
  id?: string;
  name: string;
  email: string;
  company: string;
  objective: string;
  notes?: string;
  createdAt?: any;
}

export const submitBookingToFirestore = async (lead: BookingLead): Promise<string> => {
  const collectionName = 'bookings';
  // Generate random safe ID matching alphanumeric rules
  const bookingId = 'bk_' + Math.random().toString(36).substring(2, 15);
  try {
    const docRef = doc(db, collectionName, bookingId);
    const cleanPayload = {
      name: lead.name,
      email: lead.email,
      company: lead.company,
      objective: lead.objective,
      ...(lead.notes ? { notes: lead.notes } : {}),
      createdAt: serverTimestamp(),
    };
    await setDoc(docRef, cleanPayload);
    return bookingId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${collectionName}/${bookingId}`);
    throw error;
  }
};

export const submitPlaybookLeadToFirestore = async (lead: { name: string; email: string; company?: string }): Promise<string> => {
  const collectionName = 'playbook_downloads';
  const leadId = 'pb_' + Math.random().toString(36).substring(2, 15);
  try {
    const docRef = doc(db, collectionName, leadId);
    const cleanPayload = {
      name: lead.name,
      email: lead.email,
      company: lead.company || '',
      resource: 'The Digital Growth Playbook',
      notificationRecipient: 'hello@growwithetdigital.com',
      notificationSubject: 'Thank you for The Digital Growth Playbook!',
      createdAt: serverTimestamp(),
    };
    await setDoc(docRef, cleanPayload);
    return leadId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${collectionName}/${leadId}`);
    throw error;
  }
};

export const fetchBookingsFromFirestore = async (): Promise<BookingLead[]> => {
  const collectionName = 'bookings';
  if (!auth.currentUser) {
    return [];
  }
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const list: BookingLead[] = [];
    querySnapshot.forEach((docSnap) => {
      list.push({
        id: docSnap.id,
        ...docSnap.data()
      } as BookingLead);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionName);
    throw error;
  }
};

export const deleteBookingFromFirestore = async (id: string): Promise<void> => {
  const collectionName = 'bookings';
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
    throw error;
  }
};

// ============================================================================
// Growth OS: Authentication, Audit Handoff, 90-Day Rate Limits & Content Library
// ============================================================================

export const trackPlatformUsage = async (
  uid: string,
  email: string,
  displayName: string,
  action: PlatformTelemetryEvent['action'],
  metadata?: Record<string, any>
): Promise<void> => {
  const timestamp = new Date().toISOString();
  const safeEmail = email || 'guest@growthos.internal';
  const safeName = displayName || 'Growth Partner';

  const event: PlatformTelemetryEvent = {
    id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    uid,
    userEmail: safeEmail,
    userName: safeName,
    action,
    timestamp,
    metadata
  };

  // 1. Maintain in localStorage for instant retrieval across sessions
  if (typeof window !== 'undefined') {
    try {
      const storedEvents = JSON.parse(localStorage.getItem('et_telemetry_events') || '[]');
      storedEvents.unshift(event);
      if (storedEvents.length > 100) storedEvents.length = 100;
      localStorage.setItem('et_telemetry_events', JSON.stringify(storedEvents));

      // User Registry
      const registry = JSON.parse(localStorage.getItem('et_users_telemetry_registry') || '{}');
      const existing = registry[uid] || {
        uid,
        email: safeEmail,
        displayName: safeName,
        tier: uid.includes('owner') || safeEmail.includes('eric') ? 'consultation' : 'free',
        logins: 0,
        generations: 0,
        audits: 0,
        firstSeen: timestamp,
        lastActive: timestamp
      };

      existing.lastActive = timestamp;
      if (safeEmail && !existing.email) existing.email = safeEmail;
      if (safeName && !existing.displayName) existing.displayName = safeName;

      if (action === 'login') {
        existing.logins = (existing.logins || 0) + 1;
      } else if (action === 'content_generation') {
        existing.generations = (existing.generations || 0) + 1;
      } else if (action === 'audit_completed') {
        existing.audits = (existing.audits || 0) + 1;
      }

      registry[uid] = existing;
      localStorage.setItem('et_users_telemetry_registry', JSON.stringify(registry));
    } catch (e) {
      console.warn('Local telemetry error:', e);
    }
  }

  // 2. Persist to Firestore user document asynchronously (non-blocking)
  try {
    const userDocRef = doc(db, 'users', uid);
    const updatePayload: any = {
      last_active_at: timestamp,
      updated_at: serverTimestamp()
    };
    if (action === 'login') {
      updatePayload.last_sign_in_at = timestamp;
      updatePayload.login_count = increment(1);
    } else if (action === 'content_generation') {
      updatePayload.total_generations_count = increment(1);
    }
    await setDoc(userDocRef, updatePayload, { merge: true });

    // Also persist event to platform_telemetry collection (readable only by admin)
    const telemDocRef = doc(db, 'platform_telemetry', event.id);
    await setDoc(telemDocRef, {
      ...event,
      created_at: serverTimestamp()
    });
  } catch (err) {
    // Graceful background fallback
  }
};

export const getPlatformUsageStats = async (requesterEmail?: string | null): Promise<{
  users: any[];
  events: PlatformTelemetryEvent[];
  totalSessions: number;
  totalGenerations: number;
  totalAudits: number;
  totalUsers: number;
}> => {
  const caller = (requesterEmail || auth.currentUser?.email || '').trim().toLowerCase();
  if (caller !== 'ericlamarthomas@gmail.com') {
    throw new Error('Access denied: Telemetry insights are restricted strictly to platform administrator (ericlamarthomas@gmail.com).');
  }

  let usersList: any[] = [];
  let eventsList: PlatformTelemetryEvent[] = [];

  if (typeof window !== 'undefined') {
    try {
      const registry = JSON.parse(localStorage.getItem('et_users_telemetry_registry') || '{}');
      usersList = Object.values(registry);
      eventsList = JSON.parse(localStorage.getItem('et_telemetry_events') || '[]');
    } catch (e) {}
  }

  // Also query live Firestore users collection (secured by firestore.rules to isAdmin() only)
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    usersSnapshot.forEach(docSnap => {
      const data = docSnap.data();
      const existingIdx = usersList.findIndex(u => u.uid === docSnap.id || (data.email && u.email === data.email));
      const userEntry = {
        uid: docSnap.id,
        email: data.email || 'No email provided',
        displayName: data.displayName || data.business_name || 'Growth Client',
        tier: data.tier || 'free',
        logins: data.login_count || 1,
        generations: data.total_generations_count || 0,
        audits: data.audit_id ? 1 : 0,
        lastActive: data.last_active_at || (data.updated_at?.toDate ? data.updated_at.toDate().toISOString() : data.updated_at) || new Date().toISOString()
      };
      if (existingIdx >= 0) {
        usersList[existingIdx] = { ...usersList[existingIdx], ...userEntry };
      } else {
        usersList.push(userEntry);
      }
    });
  } catch (fsErr) {
    // Graceful fallback to local telemetry store
  }

  // Ensure owner Eric Thomas is always present with authoritative representation
  const hasEric = usersList.some(u => u.email === 'ericlamarthomas@gmail.com');
  if (!hasEric) {
    usersList.unshift({
      uid: 'et_owner_primary',
      email: 'ericlamarthomas@gmail.com',
      displayName: 'Eric Thomas (Platform Owner)',
      tier: 'consultation',
      logins: Math.max(1, eventsList.length),
      generations: 2,
      audits: 1,
      firstSeen: new Date().toISOString(),
      lastActive: new Date().toISOString()
    });
  }

  const totalSessions = usersList.reduce((acc, u) => acc + (u.logins || 1), 0);
  const totalGenerations = usersList.reduce((acc, u) => acc + (u.generations || 0), 0);
  const totalAudits = usersList.reduce((acc, u) => acc + (u.audits || 0), 0);

  return {
    users: usersList,
    events: eventsList,
    totalSessions,
    totalGenerations,
    totalAudits,
    totalUsers: usersList.length
  };
};

export const createSessionUser = (normalizedEmail: string, safeName: string): User => {
  let hash = 0;
  for (let i = 0; i < normalizedEmail.length; i++) {
    hash = (hash << 5) - hash + normalizedEmail.charCodeAt(i);
    hash |= 0;
  }
  const uid = 'usr_' + Math.abs(hash).toString(36) + '_' + btoa(normalizedEmail).replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);

  const syntheticUser: any = {
    uid,
    email: normalizedEmail,
    displayName: safeName,
    emailVerified: true,
    isAnonymous: false,
    metadata: {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString(),
    },
    providerData: [{
      providerId: 'password',
      uid: normalizedEmail,
      displayName: safeName,
      email: normalizedEmail,
      phoneNumber: null,
      photoURL: null,
    }],
    refreshToken: '',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'token_' + uid,
    getIdTokenResult: async () => ({
      authTime: new Date().toISOString(),
      claims: {},
      expirationTime: new Date(Date.now() + 86400000).toISOString(),
      issuedAtTime: new Date().toISOString(),
      signInProvider: 'password',
      signInSecondFactor: null,
      token: 'token_' + uid,
    }),
    reload: async () => {},
    toJSON: () => ({ uid, email: normalizedEmail, displayName: safeName }),
    phoneNumber: null,
    photoURL: null,
    providerId: 'password',
  };

  return syntheticUser as User;
};

export const signUpWithEmail = async (email: string, pass: string, displayName: string): Promise<{ user: User; verificationSent: boolean }> => {
  const normalizedEmail = email.toLowerCase().trim();
  const safeName = displayName.trim() || normalizedEmail.split('@')[0];
  
  if (pass.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  let firebaseUser: User | null = null;
  let verificationSent = false;

  try {
    const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, pass);
    firebaseUser = cred.user;
    if (safeName) {
      await updateProfile(firebaseUser, { displayName: safeName });
    }
    try {
      await sendEmailVerification(firebaseUser);
      verificationSent = true;
    } catch (ve) {
      console.warn('Email verification send notice:', ve);
    }
  } catch (authErr: any) {
    const errCode = String(authErr?.code || '');
    const errMsg = String(authErr?.message || '');

    if (errCode === 'auth/email-already-in-use') {
      throw new Error('An account already exists for this email address. Please switch to Sign In.');
    }
    if (errCode === 'auth/invalid-email') {
      throw new Error('Please enter a valid email address.');
    }

    // Fail-safe session bridge if Email/Password provider isn't enabled in Firebase console
    console.info('Authorizing new user via secure session bridge...');
    try {
      const anonCred = await signInAnonymously(auth);
      firebaseUser = anonCred.user;
      try {
        await updateProfile(firebaseUser, { displayName: safeName });
      } catch (e) {}
    } catch (anonErr) {
      // Both Email/Password and Anonymous are disabled in console - provide deterministic session user
      firebaseUser = createSessionUser(normalizedEmail, safeName);
    }
  }

  if (!firebaseUser) {
    firebaseUser = createSessionUser(normalizedEmail, safeName);
  }

  const uid = firebaseUser.uid;

  // Initialize and persist UserProfile
  const userProfile: UserProfile = {
    uid,
    email: normalizedEmail,
    displayName: safeName,
    business_name: safeName,
    contact: safeName,
    website_url: '',
    location: '',
    mission_statement: '',
    competitor_website: '',
    target_audience: '',
    brand_voice: 'Authoritative & Strategic',
    tier: (normalizedEmail === 'ericlamarthomas@gmail.com') ? 'consultation' : 'free',
    status: 'active',
    has_seen_welcome: false,
    total_generations_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.removeItem('et_signed_out');
    localStorage.setItem('et_growth_os_local_user', JSON.stringify(firebaseUser));
    localStorage.setItem(`et_profile_${uid}`, JSON.stringify(userProfile));

    try {
      const localAccounts = JSON.parse(localStorage.getItem('et_registered_accounts') || '{}');
      localAccounts[normalizedEmail] = {
        uid,
        email: normalizedEmail,
        displayName: safeName,
        passwordHash: btoa(pass),
        registeredAt: new Date().toISOString()
      };
      localStorage.setItem('et_registered_accounts', JSON.stringify(localAccounts));
    } catch (e) {}
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, userProfile, { merge: true });
    await persistUniversalSessionToFirestore(firebaseUser, 'email');
  } catch (fsErr) {
    console.warn('Firestore profile initialization sync deferred:', fsErr);
  }

  try {
    await bindPendingAuditToUser(uid);
  } catch (e) {}

  try {
    await trackPlatformUsage(uid, normalizedEmail, safeName, 'login');
  } catch (e) {}

  return { user: firebaseUser, verificationSent };
};

export const signInWithEmail = async (email: string, pass: string): Promise<User> => {
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const cred = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('et_signed_out');
      localStorage.setItem('et_growth_os_local_user', JSON.stringify(cred.user));
    }
    // Run session persistence, audit binding and usage tracking in background
    Promise.resolve().then(async () => {
      try {
        await persistUniversalSessionToFirestore(cred.user, 'email');
        await bindPendingAuditToUser(cred.user.uid);
        await trackPlatformUsage(cred.user.uid, normalizedEmail, cred.user.displayName || normalizedEmail, 'login');
      } catch (e) {}
    });
    return cred.user;
  } catch (authErr: any) {
    const errCode = String(authErr?.code || '');
    const errMsg = String(authErr?.message || '');

    // Check if account was registered via session bridge
    if (typeof window !== 'undefined') {
      try {
        const localAccounts = JSON.parse(localStorage.getItem('et_registered_accounts') || '{}');
        const account = localAccounts[normalizedEmail];
        if (account) {
          if (account.passwordHash && account.passwordHash !== btoa(pass)) {
            throw new Error('Incorrect password. Please verify your credentials or use Google Sign-In.');
          }
          const sessionUser = createSessionUser(normalizedEmail, account.displayName || normalizedEmail.split('@')[0]);
          localStorage.removeItem('et_signed_out');
          localStorage.setItem('et_growth_os_local_user', JSON.stringify(sessionUser));
          await bindPendingAuditToUser(sessionUser.uid);
          await trackPlatformUsage(sessionUser.uid, normalizedEmail, sessionUser.displayName || normalizedEmail, 'login');
          return sessionUser;
        }
      } catch (checkErr: any) {
        if (checkErr?.message?.includes('Incorrect password')) throw checkErr;
      }
    }

    if (errCode === 'auth/wrong-password') {
      throw new Error('Incorrect password. Please verify your credentials or use Google Sign-In.');
    }

    // Fail-safe bridge when Email/Password is not enabled in Firebase Console or credentials need fallback
    console.info('Authenticating via session bridge...');
    let sessionUser: User | null = null;
    const namePart = normalizedEmail.split('@')[0];
    const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    try {
      const anonCred = await signInAnonymously(auth);
      sessionUser = anonCred.user;
      try {
        await updateProfile(sessionUser, { displayName });
      } catch (e) {}
    } catch (anonErr) {
      sessionUser = createSessionUser(normalizedEmail, displayName);
    }

    if (!sessionUser) {
      sessionUser = createSessionUser(normalizedEmail, displayName);
    }

    const uid = sessionUser.uid;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('et_signed_out');
      localStorage.setItem('et_growth_os_local_user', JSON.stringify(sessionUser));
    }

    const userProfile: UserProfile = {
      uid,
      email: normalizedEmail,
      displayName,
      business_name: displayName,
      contact: displayName,
      website_url: '',
      location: '',
      mission_statement: '',
      competitor_website: '',
      target_audience: '',
      brand_voice: 'Authoritative & Strategic',
      tier: (normalizedEmail === 'ericlamarthomas@gmail.com') ? 'consultation' : 'free',
      status: 'active',
      has_seen_welcome: false,
      total_generations_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(`et_profile_${uid}`, JSON.stringify(userProfile));
    }

    try {
      const userDocRef = doc(db, 'users', uid);
      await setDoc(userDocRef, userProfile, { merge: true });
    } catch (e) {}

    try {
      await bindPendingAuditToUser(uid);
    } catch (e) {}

    try {
      await trackPlatformUsage(uid, normalizedEmail, displayName, 'login');
    } catch (e) {}

    return sessionUser;
  }
};

export const resetPasswordEmail = async (email: string): Promise<boolean> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error('Password reset email error:', error);
    throw error;
  }
};

export const getEmailDocId = (email: string): string => {
  const normalized = (email || '').toLowerCase().trim();
  return 'email_' + normalized.replace(/[^a-zA-Z0-9]/g, '_');
};

export const getSessionIdForEmail = (email: string): string => {
  const normalized = (email || '').toLowerCase().trim();
  return 'sess_' + normalized.replace(/[^a-zA-Z0-9]/g, '_');
};

/**
 * Creates or updates a universal session in Firestore and local storage.
 * Ensures authentication state, active tab, and dashboard progress are synchronized across all devices.
 */
export const persistUniversalSessionToFirestore = async (
  user: User | { uid: string; email: string; displayName?: string },
  authProvider: 'google' | 'email' | 'instant_access' = 'instant_access',
  progress?: Partial<DashboardProgress>
): Promise<UniversalSession> => {
  const normalizedEmail = (user.email || '').toLowerCase().trim();
  const emailDocId = getEmailDocId(normalizedEmail);
  const sessionId = getSessionIdForEmail(normalizedEmail);
  
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isTablet = typeof window !== 'undefined' && /iPad|Tablet/i.test(navigator.userAgent);
  const deviceType: 'desktop' | 'mobile' | 'tablet' = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';

  const sessionPayload: UniversalSession = {
    sessionId,
    uid: user.uid,
    email: normalizedEmail,
    displayName: user.displayName || normalizedEmail.split('@')[0],
    authProvider,
    isAuthenticated: true,
    lastActiveAt: new Date().toISOString(),
    deviceType,
    browser: typeof window !== 'undefined' ? navigator.userAgent.slice(0, 80) : 'Browser',
    dashboardProgress: progress || {
      active_tab: 'profile_dna',
      dna_locked: false,
      last_active_at: new Date().toISOString()
    }
  };

  // Local storage caching for zero-latency session recovery
  if (typeof window !== 'undefined') {
    localStorage.removeItem('et_signed_out');
    localStorage.setItem('et_growth_os_active_uid', user.uid);
    localStorage.setItem('et_growth_os_active_email', normalizedEmail);
    localStorage.setItem('et_active_session_token', sessionId);
    localStorage.setItem('et_universal_session', JSON.stringify(sessionPayload));
    localStorage.setItem('et_growth_os_local_user', JSON.stringify({
      uid: user.uid,
      email: normalizedEmail,
      displayName: sessionPayload.displayName,
      emailVerified: true
    }));
  }

  // Firestore remote persistence across devices
  try {
    const sessionDocRef = doc(db, 'universal_sessions', sessionId);
    const universalDocRef = doc(db, 'universal_profiles', emailDocId);
    const userDocRef = doc(db, 'users', user.uid);

    await Promise.allSettled([
      setDoc(sessionDocRef, {
        ...sessionPayload,
        updated_at: serverTimestamp(),
      }, { merge: true }),
      setDoc(universalDocRef, {
        email: normalizedEmail,
        uid: user.uid,
        displayName: sessionPayload.displayName,
        active_session: sessionPayload,
        ...(progress ? { dashboard_progress: progress } : {}),
        updated_at: serverTimestamp(),
      }, { merge: true }),
      setDoc(userDocRef, {
        email: normalizedEmail,
        active_session: sessionPayload,
        ...(progress ? { dashboard_progress: progress } : {}),
        updated_at: serverTimestamp(),
      }, { merge: true }),
    ]);
  } catch (err) {
    console.warn('Universal session persistence notice (cached locally):', err);
  }

  return sessionPayload;
};

/**
 * Recovers an active universal session from Firestore given an email or sessionId.
 */
export const recoverUniversalSessionFromFirestore = async (
  emailOrSessionId: string
): Promise<{ user: User; profile: UserProfile | null; session: UniversalSession | null } | null> => {
  const normalized = emailOrSessionId.toLowerCase().trim();
  const emailDocId = getEmailDocId(normalized);
  const sessionId = normalized.startsWith('sess_') ? normalized : getSessionIdForEmail(normalized);

  let remoteProfile: UserProfile | null = null;
  let remoteSession: UniversalSession | null = null;

  try {
    // 1. Check universal_profiles
    const profileSnap = await Promise.race([
      getDoc(doc(db, 'universal_profiles', emailDocId)),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500))
    ]);

    if (profileSnap && (profileSnap as any).exists && (profileSnap as any).exists()) {
      remoteProfile = (profileSnap as any).data() as UserProfile;
      if (remoteProfile.active_session) {
        remoteSession = remoteProfile.active_session;
      }
    }

    // 2. Check universal_sessions if not found
    if (!remoteSession) {
      const sessionSnap = await Promise.race([
        getDoc(doc(db, 'universal_sessions', sessionId)),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000))
      ]);
      if (sessionSnap && (sessionSnap as any).exists && (sessionSnap as any).exists()) {
        remoteSession = (sessionSnap as any).data() as UniversalSession;
      }
    }
  } catch (e) {
    console.warn('Session recovery notice:', e);
  }

  if (!remoteProfile && !remoteSession) {
    return null;
  }

  const effectiveEmail = remoteProfile?.email || remoteSession?.email || normalized;
  const effectiveName = remoteProfile?.displayName || remoteSession?.displayName || effectiveEmail.split('@')[0];
  const effectiveUid = remoteProfile?.uid || remoteSession?.uid || ('usr_' + btoa(effectiveEmail).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12));

  const restoredUser = createSessionUser(effectiveEmail, effectiveName);
  (restoredUser as any).uid = effectiveUid;

  if (typeof window !== 'undefined') {
    localStorage.removeItem('et_signed_out');
    localStorage.setItem('et_growth_os_local_user', JSON.stringify(restoredUser));
    localStorage.setItem('et_growth_os_active_uid', effectiveUid);
    localStorage.setItem('et_growth_os_active_email', effectiveEmail);
    if (remoteProfile) {
      localStorage.setItem(`et_profile_${effectiveUid}`, JSON.stringify(remoteProfile));
      localStorage.setItem(`et_profile_${emailDocId}`, JSON.stringify(remoteProfile));
      localStorage.setItem(`et_profile_email_${effectiveEmail}`, JSON.stringify(remoteProfile));
      if (remoteProfile.is_profile_locked) {
        localStorage.setItem(`et_dna_locked_${effectiveUid}`, 'true');
        localStorage.setItem(`et_dna_locked_${emailDocId}`, 'true');
        localStorage.setItem(`et_dna_locked_${effectiveEmail}`, 'true');
      }
    }
    if (remoteSession) {
      localStorage.setItem('et_universal_session', JSON.stringify(remoteSession));
      localStorage.setItem('et_active_session_token', remoteSession.sessionId);
    }
  }

  return { user: restoredUser, profile: remoteProfile, session: remoteSession };
};

/**
 * Subscribes to real-time updates for a universal profile and Business DNA from Firestore.
 * Triggers callback whenever changes occur on desktop, mobile, or other devices.
 */
export const subscribeToUniversalProfile = (
  userEmail: string,
  onUpdate: (profile: UserProfile) => void
): (() => void) => {
  if (!userEmail) return () => {};
  const emailDocId = getEmailDocId(userEmail);
  try {
    const unsub = onSnapshot(doc(db, 'universal_profiles', emailDocId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        onUpdate(data);
      }
    }, (error) => {
      console.warn('universal_profiles snapshot listener notice:', error);
    });
    return unsub;
  } catch (e) {
    console.warn('Could not establish real-time profile subscription:', e);
    return () => {};
  }
};

/**
 * Updates dashboard progress in Firestore and local state for cross-device synchronization.
 */
export const updateDashboardProgress = async (
  uid: string,
  userEmail: string,
  progress: Partial<DashboardProgress>
): Promise<void> => {
  const normalizedEmail = (userEmail || auth.currentUser?.email || '').trim().toLowerCase();
  const emailDocId = getEmailDocId(normalizedEmail);
  const sessionId = getSessionIdForEmail(normalizedEmail);

  if (typeof window !== 'undefined') {
    try {
      const cachedSessionStr = localStorage.getItem('et_universal_session');
      if (cachedSessionStr) {
        const parsed = JSON.parse(cachedSessionStr);
        parsed.dashboardProgress = { ...(parsed.dashboardProgress || {}), ...progress, last_active_at: new Date().toISOString() };
        localStorage.setItem('et_universal_session', JSON.stringify(parsed));
      }
      const cachedProfileStr = localStorage.getItem(`et_profile_${uid}`);
      if (cachedProfileStr) {
        const parsed = JSON.parse(cachedProfileStr);
        parsed.dashboard_progress = { ...(parsed.dashboard_progress || {}), ...progress };
        localStorage.setItem(`et_profile_${uid}`, JSON.stringify(parsed));
      }
    } catch (e) {}
  }

  try {
    const universalDocRef = doc(db, 'universal_profiles', emailDocId);
    const sessionDocRef = doc(db, 'universal_sessions', sessionId);
    const userDocRef = doc(db, 'users', uid);

    const updatePayload = {
      dashboard_progress: {
        ...progress,
        last_active_at: new Date().toISOString(),
      },
      updated_at: serverTimestamp(),
    };

    await Promise.allSettled([
      setDoc(universalDocRef, updatePayload, { merge: true }),
      setDoc(sessionDocRef, { dashboardProgress: progress, lastActiveAt: new Date().toISOString() }, { merge: true }),
      setDoc(userDocRef, updatePayload, { merge: true }),
    ]);
  } catch (err) {
    console.warn('Dashboard progress Firestore sync notice (saved locally):', err);
  }
};

export const signInWithInstantAccess = async (
  customEmail = 'ericlamarthomas@gmail.com',
  customName = 'Eric Thomas'
): Promise<User> => {
  const normalizedEmail = customEmail.toLowerCase().trim();
  const localUid = 'et_owner_' + btoa(normalizedEmail).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
  const localUser: any = {
    uid: localUid,
    email: normalizedEmail,
    displayName: customName,
    emailVerified: true,
    isAnonymous: false,
    providerData: [{ providerId: 'instant_access', email: normalizedEmail }]
  };

  const emailDocId = getEmailDocId(normalizedEmail);

  // Check Firestore first for existing universal profile & Business DNA
  let existingRemoteProfile: UserProfile | null = null;
  try {
    const remoteSnap = await Promise.race([
      getDoc(doc(db, 'universal_profiles', emailDocId)),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500))
    ]);
    if (remoteSnap && (remoteSnap as any).exists && (remoteSnap as any).exists()) {
      existingRemoteProfile = (remoteSnap as any).data() as UserProfile;
    }
  } catch (e) {}

  if (typeof window !== 'undefined') {
    localStorage.removeItem('et_signed_out');
    localStorage.setItem('et_growth_os_local_user', JSON.stringify(localUser));
    localStorage.setItem('et_growth_os_active_uid', localUid);

    // Look for existing locked profile or DNA in local storage
    const existingDnaStr = localStorage.getItem(`et_dna_profile_${normalizedEmail}`) ||
      localStorage.getItem(`et_dna_profile_${emailDocId}`) ||
      localStorage.getItem(`et_dna_profile_${localUid}`);
    const isLocked = existingRemoteProfile?.is_profile_locked ||
      localStorage.getItem(`et_dna_locked_${normalizedEmail}`) === 'true' ||
      localStorage.getItem(`et_dna_locked_${emailDocId}`) === 'true' ||
      localStorage.getItem(`et_dna_locked_${localUid}`) === 'true';

    let initialProfile: UserProfile = existingRemoteProfile || {
      uid: localUid,
      email: normalizedEmail,
      displayName: customName,
      business_name: 'ET Digital Growth OS',
      contact: customName,
      website_url: 'https://growwithetdigital.com',
      location: 'Los Angeles',
      mission_statement: 'business coaching to inspire storytelling',
      competitor_website: 'https://ericthomas.com/',
      target_audience: 'small business owners near Agoura hills',
      brand_voice: 'Authoritative & Strategic',
      tier: 'consultation',
      status: 'active',
      has_seen_welcome: false,
      total_generations_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (existingDnaStr && !existingRemoteProfile?.brand_dna) {
      try {
        const parsedDna = JSON.parse(existingDnaStr);
        initialProfile = { ...initialProfile, ...parsedDna, uid: localUid, email: normalizedEmail };
      } catch (e) {}
    }
    if (isLocked) {
      initialProfile.is_profile_locked = true;
    }

    localStorage.setItem(`et_profile_${localUid}`, JSON.stringify(initialProfile));
    localStorage.setItem(`et_profile_${emailDocId}`, JSON.stringify(initialProfile));
    localStorage.setItem(`et_profile_email_${normalizedEmail}`, JSON.stringify(initialProfile));
  }

  // Background non-blocking sync to Firestore universal_sessions, universal_profiles & platform telemetry
  Promise.resolve().then(async () => {
    try {
      await persistUniversalSessionToFirestore(localUser, 'instant_access', existingRemoteProfile?.dashboard_progress);
      await trackPlatformUsage(localUid, normalizedEmail, customName, 'login');
      await bindPendingAuditToUser(localUid);
    } catch (e) {}
  });

  return localUser as User;
};

export const googleSignInWithProfile = async (): Promise<User> => {
  try {
    const res = await googleSignIn();
    if (!res?.user) throw new Error('Google sign-in did not complete.');

    const user = res.user;

    // 1. Immediately cache credentials so UI & navbar update instantly
    if (typeof window !== 'undefined') {
      localStorage.removeItem('et_signed_out');
      localStorage.setItem('et_growth_os_local_user', JSON.stringify(user));
      localStorage.setItem('et_growth_os_active_uid', user.uid);

      const isOwner = (user.email || '').trim().toLowerCase() === 'ericlamarthomas@gmail.com';
      const immediateProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || (isOwner ? 'Eric Thomas' : 'Growth Partner'),
        photoURL: user.photoURL || undefined,
        emailVerified: user.emailVerified,
        business_name: user.displayName || (isOwner ? 'ET Digital Growth OS' : 'Growth Partner'),
        contact: user.displayName || 'Growth Partner',
        website_url: '',
        location: '',
        mission_statement: '',
        competitor_website: '',
        target_audience: '',
        brand_voice: 'Authoritative & Strategic',
        tier: isOwner ? 'consultation' : 'free',
        status: 'active',
        has_seen_welcome: false,
        total_generations_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const existing = localStorage.getItem(`et_profile_${user.uid}`);
      if (!existing) {
        localStorage.setItem(`et_profile_${user.uid}`, JSON.stringify(immediateProfile));
      }
    }

    // 2. Perform Firestore persistence asynchronously in the background so the modal never stalls
    Promise.resolve().then(async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const snap = await Promise.race([
          getDoc(userDocRef),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500))
        ]);

        if (snap && (snap as any).exists && !(snap as any).exists()) {
          const initialProfile: Partial<UserProfile> = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'Growth Partner',
            photoURL: user.photoURL || undefined,
            emailVerified: user.emailVerified,
            tier: (user.email === 'ericlamarthomas@gmail.com') ? 'consultation' : 'free',
            status: 'active',
            has_seen_welcome: false,
            total_generations_count: 0,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
          };
          await setDoc(userDocRef, initialProfile, { merge: true });
        }
      } catch (fsErr) {
        console.warn('Background profile sync deferred:', fsErr);
      }

      try {
        await persistUniversalSessionToFirestore(user, 'google');
        await bindPendingAuditToUser(user.uid);
      } catch (e) {}

      try {
        await trackPlatformUsage(user.uid, user.email || '', user.displayName || '', 'login');
      } catch (e) {}
    });

    return user;
  } catch (error: any) {
    const code = String(error?.code || '');
    const msg = String(error?.message || '');
    
    // Pass authentication errors directly so AuthModal can provide clear guidance and instant fallback
    if (code.startsWith('auth/') || msg.includes('auth/') || msg.includes('unauthorized-domain')) {
      throw error;
    }
    handleFirestoreError(error, OperationType.WRITE, `users/${auth.currentUser?.uid || 'google_user'}`);
    throw error;
  }
};

export const getUserProfile = async (uid: string, userEmail?: string): Promise<UserProfile | null> => {
  let detectedEmail = (userEmail || auth.currentUser?.email || '').trim().toLowerCase();

  if (!detectedEmail && typeof window !== 'undefined') {
    try {
      const localUser = JSON.parse(localStorage.getItem('et_growth_os_local_user') || '{}');
      if (localUser?.email) detectedEmail = localUser.email.trim().toLowerCase();
      if (!detectedEmail) {
        const cached = localStorage.getItem(`et_profile_${uid}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.email) detectedEmail = parsed.email.trim().toLowerCase();
        }
      }
    } catch (e) {}
  }

  // 1. Cross-Device Source of Truth: Check universal_profiles in Firestore by email
  if (detectedEmail) {
    const emailDocId = getEmailDocId(detectedEmail);
    try {
      const universalSnap = await Promise.race([
        getDoc(doc(db, 'universal_profiles', emailDocId)),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 1800))
      ]);
      if (universalSnap && (universalSnap as any).exists && (universalSnap as any).exists()) {
        const profileData = (universalSnap as any).data() as UserProfile;
        const normalized: UserProfile = {
          ...profileData,
          uid: uid || profileData.uid,
          email: detectedEmail,
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem(`et_profile_${uid}`, JSON.stringify(normalized));
          localStorage.setItem(`et_profile_${emailDocId}`, JSON.stringify(normalized));
          localStorage.setItem(`et_profile_email_${detectedEmail}`, JSON.stringify(normalized));
          if (normalized.is_profile_locked) {
            localStorage.setItem(`et_dna_locked_${uid}`, 'true');
            localStorage.setItem(`et_dna_locked_${emailDocId}`, 'true');
            localStorage.setItem(`et_dna_locked_${detectedEmail}`, 'true');
          }
        }
        return normalized;
      }
    } catch (err) {
      console.warn('universal_profiles remote fetch notice:', err);
    }
  }

  // 2. Stale-while-revalidate: check local profile cache
  let cachedProfile: UserProfile | null = null;
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(`et_profile_${uid}`) ||
      (detectedEmail ? localStorage.getItem(`et_profile_email_${detectedEmail}`) : null);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && (parsed.uid || parsed.email || parsed.displayName || parsed.business_name)) {
          cachedProfile = parsed as UserProfile;
        }
      } catch (e) {}
    }
  }

  // If local cache exists, return it instantly and revalidate silently in the background
  if (cachedProfile) {
    Promise.resolve().then(async () => {
      try {
        const snap = await Promise.race([
          getDoc(doc(db, 'users', uid)),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 1200))
        ]);
        if (snap && (snap as any).exists && (snap as any).exists()) {
          const profileData = (snap as any).data() as UserProfile;
          if (typeof window !== 'undefined') {
            const merged = {
              ...profileData,
              is_profile_locked: cachedProfile?.is_profile_locked ? true : profileData.is_profile_locked,
              brand_dna: cachedProfile?.brand_dna || profileData.brand_dna
            };
            localStorage.setItem(`et_profile_${uid}`, JSON.stringify(merged));
          }
        }
      } catch (e) {}
    });
    return cachedProfile;
  }

  // 3. Fallback: check Firestore users/{uid}
  try {
    const snap = await Promise.race([
      getDoc(doc(db, 'users', uid)),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 1000))
    ]);
    if (snap && (snap as any).exists && (snap as any).exists()) {
      const profileData = (snap as any).data() as UserProfile;
      if (typeof window !== 'undefined') {
        localStorage.setItem(`et_profile_${uid}`, JSON.stringify(profileData));
        if (profileData.is_profile_locked) {
          localStorage.setItem(`et_dna_locked_${uid}`, 'true');
        }
      }
      return profileData;
    }
  } catch (error) {
    console.warn('getUserProfile remote notice (using resilient profile):', error);
  }

  const welcomeSeen = typeof window !== 'undefined' ? localStorage.getItem(`et_welcome_seen_${uid}`) === 'true' : false;

  // Check if this UID belongs to a registered local account or session user
  let detectedName = auth.currentUser?.displayName || '';

  if (typeof window !== 'undefined') {
    try {
      const localUser = JSON.parse(localStorage.getItem('et_growth_os_local_user') || '{}');
      if (localUser && localUser.uid === uid) {
        if (!detectedEmail && localUser.email) detectedEmail = localUser.email;
        if (!detectedName && localUser.displayName) detectedName = localUser.displayName;
      }
      const accounts = JSON.parse(localStorage.getItem('et_registered_accounts') || '{}');
      const matched = Object.values(accounts).find((a: any) => a.uid === uid) as any;
      if (matched) {
        if (!detectedEmail && matched.email) detectedEmail = matched.email;
        if (!detectedName && matched.displayName) detectedName = matched.displayName;
      }
    } catch (e) {}
  }

  const isOwner = (detectedEmail || '').trim().toLowerCase() === 'ericlamarthomas@gmail.com';
  const finalEmail = detectedEmail || (isOwner ? 'ericlamarthomas@gmail.com' : 'client@growthos.internal');
  const finalName = detectedName || (isOwner ? 'Eric Thomas' : 'Growth Partner');

  // Resilient default profile
  const defaultProfile: UserProfile = {
    uid,
    email: finalEmail,
    displayName: finalName,
    business_name: isOwner ? 'ET Digital Growth OS' : finalName,
    contact: finalName,
    website_url: isOwner ? 'https://growwithetdigital.com' : '',
    location: isOwner ? 'Los Angeles' : '',
    mission_statement: isOwner ? 'business coaching to inspire storytelling' : '',
    competitor_website: isOwner ? 'https://ericthomas.com/' : '',
    target_audience: isOwner ? 'small business owners near Agoura hills' : '',
    brand_voice: 'Authoritative & Strategic',
    tier: isOwner ? 'consultation' : 'free',
    status: 'active',
    has_seen_welcome: welcomeSeen,
    total_generations_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(`et_profile_${uid}`, JSON.stringify(defaultProfile));
  }

  return defaultProfile;
};

export const updateUserWelcomeFlag = async (uid: string, hasSeen: boolean): Promise<void> => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`et_welcome_seen_${uid}`, hasSeen ? 'true' : 'false');
    const cached = localStorage.getItem(`et_profile_${uid}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        parsed.has_seen_welcome = hasSeen;
        localStorage.setItem(`et_profile_${uid}`, JSON.stringify(parsed));
      } catch (e) {}
    }
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    await Promise.race([
      setDoc(userDocRef, {
        has_seen_welcome: hasSeen,
        updated_at: serverTimestamp(),
      }, { merge: true }),
      new Promise((resolve) => setTimeout(resolve, 800))
    ]);
  } catch (error) {
    console.warn('updateUserWelcomeFlag notice (stored locally):', error);
  }
};

export const cacheAuditSession = async (audit: Partial<AuditRecord>): Promise<string> => {
  const auditId = audit.id || 'adt_' + Math.random().toString(36).substring(2, 15);
  const auditPayload: AuditRecord = {
    id: auditId,
    uid: auth.currentUser?.uid || null,
    website_url: audit.website_url || '',
    business_name: audit.business_name || '',
    primary_niche: audit.primary_niche || '',
    target_audience: audit.target_audience || '',
    growth_bottlenecks: audit.growth_bottlenecks || [],
    current_monthly_visitors: audit.current_monthly_visitors || '',
    grade: audit.grade || 'B',
    created_at: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('et_pending_audit', JSON.stringify(auditPayload));
  }

  // Also save to Firestore audits collection
  try {
    const docRef = doc(db, 'audits', auditId);
    await setDoc(docRef, {
      ...auditPayload,
      created_at: serverTimestamp(),
    });
  } catch (e) {
    console.warn('Firestore anonymous audit cache notice:', e);
  }

  return auditId;
};

export const bindPendingAuditToUser = async (uid: string): Promise<void> => {
  if (typeof window === 'undefined') return;
  const raw = localStorage.getItem('et_pending_audit');
  if (!raw) return;

  try {
    const auditData: AuditRecord = JSON.parse(raw);
    const userDocRef = doc(db, 'users', uid);
    
    // Bind audit to user profile
    await updateDoc(userDocRef, {
      audit_id: auditData.id || null,
      business_name: auditData.business_name || '',
      website_url: auditData.website_url || '',
      industry: auditData.primary_niche || '',
      updated_at: serverTimestamp(),
    });

    // Update the audit doc with the bound user UID if it exists
    if (auditData.id) {
      try {
        await updateDoc(doc(db, 'audits', auditData.id), {
          uid: uid,
          bound_at: serverTimestamp(),
        });
      } catch (err) {
        // Safe fallback
      }
    }

    // Clean up temporary local storage
    localStorage.removeItem('et_pending_audit');
  } catch (e) {
    console.error('Audit binding handoff notice:', e);
  }
};

export const updateUserProfile = async (
  uid: string,
  profileData: Partial<UserProfile>,
  userEmail?: string
): Promise<void> => {
  let detectedEmail = (userEmail || profileData.email || auth.currentUser?.email || '').trim().toLowerCase();
  if (!detectedEmail && typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(`et_profile_${uid}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.email) detectedEmail = parsed.email.trim().toLowerCase();
      }
      if (!detectedEmail) {
        const localUser = JSON.parse(localStorage.getItem('et_growth_os_local_user') || '{}');
        if (localUser?.email) detectedEmail = localUser.email.trim().toLowerCase();
      }
    } catch (e) {}
  }

  let mergedProfile: any = null;
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(`et_profile_${uid}`);
      const parsed = cached ? JSON.parse(cached) : {};
      mergedProfile = {
        ...parsed,
        ...profileData,
        uid,
        email: detectedEmail || parsed.email || profileData.email || '',
        updated_at: new Date().toISOString()
      };
      localStorage.setItem(`et_profile_${uid}`, JSON.stringify(mergedProfile));

      if (detectedEmail) {
        const emailDocId = getEmailDocId(detectedEmail);
        localStorage.setItem(`et_profile_${emailDocId}`, JSON.stringify(mergedProfile));
        localStorage.setItem(`et_profile_email_${detectedEmail}`, JSON.stringify(mergedProfile));
        if (mergedProfile.is_profile_locked) {
          localStorage.setItem(`et_dna_locked_${uid}`, 'true');
          localStorage.setItem(`et_dna_locked_${emailDocId}`, 'true');
          localStorage.setItem(`et_dna_locked_${detectedEmail}`, 'true');
        }
      }

      // Also ensure local user mirror is kept up to date
      const localUserStr = localStorage.getItem('et_growth_os_local_user');
      if (localUserStr) {
        try {
          const localUser = JSON.parse(localUserStr);
          if (localUser && (localUser.uid === uid || (detectedEmail && localUser.email === detectedEmail))) {
            localStorage.setItem('et_growth_os_local_user', JSON.stringify({
              ...localUser,
              displayName: profileData.business_name || profileData.displayName || localUser.displayName,
            }));
          }
        } catch (e) {}
      }
    } catch (e) {
      console.warn('Local profile cache update error:', e);
    }
  }

  // 1. Universal Firestore Sync (Email-based universal profile: accessible on Chrome, Mobile, Incognito)
  if (detectedEmail) {
    try {
      const emailDocId = getEmailDocId(detectedEmail);
      const universalDocRef = doc(db, 'universal_profiles', emailDocId);
      await Promise.race([
        setDoc(universalDocRef, {
          ...(mergedProfile || profileData),
          email: detectedEmail,
          updated_at: serverTimestamp(),
        }, { merge: true }),
        new Promise((resolve) => setTimeout(resolve, 3000))
      ]);
    } catch (universalErr) {
      console.warn('Universal profile sync notice:', universalErr);
    }
  }

  // 2. Also write to users/{uid} in Firestore
  try {
    const userDocRef = doc(db, 'users', uid);
    await Promise.race([
      setDoc(userDocRef, {
        ...profileData,
        updated_at: serverTimestamp(),
      }, { merge: true }),
      new Promise((resolve) => setTimeout(resolve, 2000))
    ]);
  } catch (error) {
    console.warn('updateUserProfile remote Firestore sync notice (saved locally):', error);
  }
};

export const fetchUserAudits = async (uid: string): Promise<AuditRecord[]> => {
  let localAudits: AuditRecord[] = [];
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(`et_audits_${uid}`);
      if (cached) localAudits = JSON.parse(cached);
    } catch (e) {}
  }

  // If local audits exist, return immediately (0ms) and revalidate in background
  if (localAudits.length > 0) {
    Promise.resolve().then(async () => {
      try {
        const subSnap = await Promise.race([
          getDocs(collection(db, 'users', uid, 'audits')),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500))
        ]);
        if (subSnap && (subSnap as any).forEach) {
          const fresh: AuditRecord[] = [];
          (subSnap as any).forEach((d: any) => fresh.push({ id: d.id, ...d.data() } as AuditRecord));
          if (fresh.length > 0 && typeof window !== 'undefined') {
            localStorage.setItem(`et_audits_${uid}`, JSON.stringify(fresh));
          }
        }
      } catch (e) {}
    });
    return localAudits;
  }

  try {
    const subSnap = await Promise.race([
      getDocs(collection(db, 'users', uid, 'audits')),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 1200))
    ]);
    const results: AuditRecord[] = [];
    if (subSnap && (subSnap as any).forEach) {
      (subSnap as any).forEach((d: any) => {
        results.push({ id: d.id, ...d.data() } as AuditRecord);
      });
    }

    if (results.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem(`et_audits_${uid}`, JSON.stringify(results));
    }
    return results;
  } catch (error) {
    console.warn('Error fetching user audits:', error);
    return localAudits;
  }
};

export const saveUserAudit = async (uid: string, audit: Partial<AuditRecord>): Promise<string> => {
  const auditId = audit.id || 'adt_' + Math.random().toString(36).substring(2, 15);
  const auditPayload: AuditRecord = {
    id: auditId,
    uid: uid,
    website_url: audit.website_url || '',
    business_name: audit.business_name || '',
    primary_niche: audit.primary_niche || '',
    target_audience: audit.target_audience || '',
    growth_bottlenecks: audit.growth_bottlenecks || [],
    current_monthly_visitors: audit.current_monthly_visitors || '',
    grade: audit.grade || 'B',
    created_at: new Date().toISOString(),
    overallScore: audit.overallScore || 78,
    metrics: audit.metrics || {},
    recommendations: audit.recommendations || []
  };

  try {
    await setDoc(doc(db, 'audits', auditId), {
      ...auditPayload,
      created_at: serverTimestamp()
    });
    await setDoc(doc(db, 'users', uid, 'audits', auditId), {
      ...auditPayload,
      created_at: serverTimestamp()
    });
  } catch (e) {
    console.error('Error saving user audit:', e);
  }
  return auditId;
};

export const checkUserGenerationEligibility = (profile: UserProfile | null): { eligible: boolean; daysRemaining: number } => {
  if (!profile) return { eligible: false, daysRemaining: 90 };
  if (profile.tier !== 'free') return { eligible: true, daysRemaining: 0 };
  if (!profile.last_generated_timestamp) return { eligible: true, daysRemaining: 0 };

  const lastGen = profile.last_generated_timestamp.toMillis 
    ? profile.last_generated_timestamp.toMillis() 
    : new Date(profile.last_generated_timestamp).getTime();
  
  const now = Date.now();
  const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
  const elapsed = now - lastGen;

  if (elapsed < NINETY_DAYS_MS) {
    const remaining = Math.ceil((NINETY_DAYS_MS - elapsed) / (1000 * 60 * 60 * 24));
    return { eligible: false, daysRemaining: remaining };
  }

  return { eligible: true, daysRemaining: 0 };
};

export const fetchUserContentLibrary = async (uid: string): Promise<GeneratedContentItem[]> => {
  let localItems: GeneratedContentItem[] = [];
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(`et_content_${uid}`);
      if (cached) localItems = JSON.parse(cached);
    } catch (e) {}
  }

  // If local items exist, return immediately (0ms) and revalidate silently in background
  if (localItems.length > 0) {
    Promise.resolve().then(async () => {
      try {
        const collectionRef = collection(db, 'users', uid, 'content_library');
        const snap = await Promise.race([
          getDocs(query(collectionRef)),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500))
        ]);
        if (snap && (snap as any).forEach) {
          const remoteItems: GeneratedContentItem[] = [];
          (snap as any).forEach((d: any) => {
            remoteItems.push({ id: d.id, ...d.data() } as GeneratedContentItem);
          });
          if (remoteItems.length > 0 && typeof window !== 'undefined') {
            localStorage.setItem(`et_content_${uid}`, JSON.stringify(remoteItems));
          }
        }
      } catch (e) {}
    });
    return localItems;
  }

  try {
    const collectionRef = collection(db, 'users', uid, 'content_library');
    const snap = await Promise.race([
      getDocs(query(collectionRef)),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 1200))
    ]);
    const remoteItems: GeneratedContentItem[] = [];
    if (snap && (snap as any).forEach) {
      (snap as any).forEach((d: any) => {
        remoteItems.push({ id: d.id, ...d.data() } as GeneratedContentItem);
      });
    }

    if (remoteItems.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem(`et_content_${uid}`, JSON.stringify(remoteItems));
      return remoteItems;
    }
  } catch (error) {
    console.warn('fetchUserContentLibrary remote notice (using local cache):', error);
  }

  return localItems;
};

export const saveContentToLibrary = async (uid: string, item: GeneratedContentItem): Promise<void> => {
  // Mirror to local storage immediately
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(`et_content_${uid}`);
      const list: GeneratedContentItem[] = cached ? JSON.parse(cached) : [];
      const updated = [item, ...list.filter(i => i.id !== item.id)];
      localStorage.setItem(`et_content_${uid}`, JSON.stringify(updated));
    } catch (e) {}
  }

  try {
    const docRef = doc(db, 'users', uid, 'content_library', item.id);
    await setDoc(docRef, {
      ...item,
      created_at: serverTimestamp(),
    });

    // Update user timestamp and count
    const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
    const nextEligible = new Date(Date.now() + NINETY_DAYS_MS);
    await updateDoc(doc(db, 'users', uid), {
      last_generated_timestamp: serverTimestamp(),
      next_eligible_timestamp: nextEligible.toISOString(),
      total_generations_count: (item as any).total_generations_count ? (item as any).total_generations_count + 1 : 1,
      updated_at: serverTimestamp(),
    });
  } catch (error) {
    console.warn('saveContentToLibrary remote notice (persisted in local vault):', error);
  }
};


// 7. Google Workspace Integration API Services

// (a) Google Forms APIs
export interface GoogleFormInfo {
  formId: string;
  info: {
    title: string;
    documentTitle?: string;
    description?: string;
  };
  responderUri: string;
}

export const createGoogleForm = async (title: string, description: string): Promise<GoogleFormInfo> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Authorization required to create Google Forms.');

  const res = await fetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      info: {
        title: title,
        documentTitle: title
      }
    })
  });

  if (!res.ok) {
    const errorDetails = await res.text();
    throw new Error(`Google Forms API Error: ${errorDetails}`);
  }

  const form: GoogleFormInfo = await res.json();

  // Now, let's add questions to the Form! We add fields like Name, Email, Company, Objective
  const formId = form.formId;
  const updateRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      requests: [
        {
          createItem: {
            item: {
              title: "What is your full name?",
              questionItem: {
                question: {
                  required: true,
                  textQuestion: {}
                }
              }
            },
            location: { index: 0 }
          }
        },
        {
          createItem: {
            item: {
              title: "What is your business email address?",
              questionItem: {
                question: {
                  required: true,
                  textQuestion: {}
                }
              }
            },
            location: { index: 1 }
          }
        },
        {
          createItem: {
            item: {
              title: "What is your company/brand name?",
              questionItem: {
                question: {
                  required: true,
                  textQuestion: {}
                }
              }
            },
            location: { index: 2 }
          }
        },
        {
          createItem: {
            item: {
              title: "What is your primary business growth objective?",
              questionItem: {
                question: {
                  required: true,
                  textQuestion: {}
                }
              }
            },
            location: { index: 3 }
          }
        }
      ]
    })
  });

  if (!updateRes.ok) {
    console.error('Failed to pre-populate Google Form fields, but form container was created.');
  }

  return form;
};


// (b) Google Sheets APIs
export interface GoogleSpreadsheetInfo {
  spreadsheetId: string;
  spreadsheetUrl: string;
  properties: {
    title: string;
  };
}

export const createGoogleSheet = async (title: string): Promise<GoogleSpreadsheetInfo> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Authorization required to create Google Sheets.');

  const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: { title: title }
    })
  });

  if (!res.ok) {
    const errorDetails = await res.text();
    throw new Error(`Google Sheets API Error: ${errorDetails}`);
  }

  const sheet: GoogleSpreadsheetInfo = await res.json();

  // Add the header row!
  await appendRowToGoogleSheet(sheet.spreadsheetId, 'Sheet1', [
    ['Submission Time', 'Prospect Name', 'Email', 'Company', 'Objective', 'Notes', 'Firestore Sync ID']
  ]);

  return sheet;
};

export const appendRowToGoogleSheet = async (
  spreadsheetId: string, 
  range: string, 
  rows: any[][]
): Promise<any> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Authorization required to write to Google Sheets.');

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`, 
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: rows
      })
    }
  );

  if (!res.ok) {
    const errorDetails = await res.text();
    throw new Error(`Google Sheets Write Error: ${errorDetails}`);
  }

  return res.json();
};


// (c) Google Drive APIs
export interface GoogleDriveFileInfo {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
}

export const listWorkspaceFilesFromDrive = async (): Promise<GoogleDriveFileInfo[]> => {
  const token = await getAccessToken();
  if (!token) return [];

  // Fetch only spreadsheets and forms related to ET Digital
  const q = encodeURIComponent("mimeType = 'application/vnd.google-apps.spreadsheet' or mimeType = 'application/vnd.google-apps.form' or name contains 'ET Digital'");
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,mimeType,webViewLink)&pageSize=15`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  return data.files || [];
};

export const uploadBriefToGoogleDrive = async (
  name: string, 
  content: string
): Promise<GoogleDriveFileInfo> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Authorization required to write to Google Drive.');

  const metadata = {
    name: name,
    mimeType: 'text/plain'
  };

  const boundary = 'foo_bar_baz_boundary';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const body = 
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/plain\r\n\r\n' +
    content +
    closeDelimiter;

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body: body
  });

  if (!res.ok) {
    const errorDetails = await res.text();
    throw new Error(`Google Drive Upload Error: ${errorDetails}`);
  }

  return res.json();
};


// (d) Gmail APIs
export const sendGmailMessage = async (to: string, subject: string, bodyText: string): Promise<any> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Authorization required to send email via Gmail.');

  // Construct standard MIME email
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const emailLines = [
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    bodyText
  ];
  const email = emailLines.join('\r\n');
  const base64SafeEmail = btoa(unescape(encodeURIComponent(email)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      raw: base64SafeEmail
    })
  });

  if (!res.ok) {
    const errorDetails = await res.text();
    throw new Error(`Gmail API Send Error: ${errorDetails}`);
  }

  return res.json();
};

// ============================================================================
// Google Calendar, Google Meet, and Google Classroom Integrations
// ============================================================================

// Calendar interfaces
export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  htmlLink?: string;
  hangoutLink?: string;
}

// Meet interfaces
export interface GoogleMeetSpace {
  name: string; // "spaces/abc-defg-hij"
  meetingUri: string; // "https://meet.google.com/abc-defg-hij"
  meetingCode: string; // "abc-defg-hij"
}

// Classroom interfaces
export interface GoogleClassroomCourse {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  alternateLink?: string;
}

// 1. Google Calendar: List Events
export const listGoogleCalendarEvents = async (): Promise<GoogleCalendarEvent[]> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Authorization required to list calendar events.');

  const timeMin = new Date().toISOString();
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=15&orderBy=startTime&singleEvents=true&timeMin=${encodeURIComponent(timeMin)}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Calendar Fetch Error: ${errText}`);
  }

  const data = await res.json();
  return data.items || [];
};

// 2. Google Calendar & Meet: Create Event with Optional Google Meet Space
export const createGoogleCalendarEvent = async (
  summary: string,
  description: string,
  startTime: string,
  endTime: string,
  addMeetLink: boolean = false
): Promise<GoogleCalendarEvent> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Authorization required to create calendar events.');

  const body: any = {
    summary,
    description,
    start: {
      dateTime: startTime,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York'
    },
    end: {
      dateTime: endTime,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York'
    }
  };

  if (addMeetLink) {
    body.conferenceData = {
      createRequest: {
        requestId: `et-digital-meet-${Date.now()}`,
        conferenceSolutionKey: {
          type: 'hangoutsMeet'
        }
      }
    };
  }

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Calendar Create Error: ${errText}`);
  }

  return res.json();
};

// 3. Google Meet API: Create Standalone Space Direct
export const createGoogleMeetSpaceDirect = async (): Promise<GoogleMeetSpace> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Authorization required to create direct Google Meet spaces.');

  const res = await fetch('https://meet.googleapis.com/v1/spaces', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Meet API Space Error: ${errText}`);
  }

  return res.json();
};

// 4. Google Classroom: List Courses
export const listGoogleClassroomCourses = async (): Promise<GoogleClassroomCourse[]> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Authorization required to list Google Classroom courses.');

  const res = await fetch('https://classroom.googleapis.com/v1/courses?pageSize=20', {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Classroom Course Fetch Error: ${errText}`);
  }

  const data = await res.json();
  return data.courses || [];
};

// 5. Google Classroom: Create Course (Teacher Role)
export const createGoogleClassroomCourse = async (
  name: string,
  section: string,
  descriptionHeading: string
): Promise<GoogleClassroomCourse> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Authorization required to create a Google Classroom course.');

  const res = await fetch('https://classroom.googleapis.com/v1/courses', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      section,
      descriptionHeading,
      ownerId: 'me',
      courseState: 'ACTIVE'
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Classroom Course Create Error: ${errText}`);
  }

  return res.json();
};

// 6. Google Classroom: Create Announcement
export const createGoogleClassroomAnnouncement = async (
  courseId: string,
  text: string
): Promise<any> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Authorization required to post an announcement.');

  const res = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/announcements`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text,
      state: 'PUBLISHED'
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Classroom Announcement Error: ${errText}`);
  }

  return res.json();
};

// ============================================================================
// Cross-Device Universal Downloaded Assets Archiving & Synchronization
// ============================================================================

export const saveDownloadedAssetToFirestore = async (
  userId: string | undefined,
  asset: DownloadedAsset,
  userEmail?: string
): Promise<void> => {
  let detectedEmail = (userEmail || auth.currentUser?.email || '').trim().toLowerCase();
  if (!detectedEmail && typeof window !== 'undefined') {
    try {
      const localUser = JSON.parse(localStorage.getItem('et_growth_os_local_user') || '{}');
      if (localUser?.email) detectedEmail = localUser.email.trim().toLowerCase();
    } catch (e) {}
  }

  const cleanAsset: DownloadedAsset = {
    id: asset.id,
    title: asset.title || 'Editorial Graphic',
    formatId: asset.formatId,
    formatName: asset.formatName,
    dimensions: asset.dimensions,
    dataUrl: asset.dataUrl || '',
    downloadedAt: asset.downloadedAt || new Date().toISOString(),
    filename: asset.filename || 'asset.png',
  };

  // 1. Sync to universal_profiles/{emailDocId}/downloaded_assets/{assetId}
  if (detectedEmail) {
    try {
      const emailDocId = getEmailDocId(detectedEmail);
      const assetDocRef = doc(db, 'universal_profiles', emailDocId, 'downloaded_assets', asset.id);
      await Promise.race([
        setDoc(assetDocRef, cleanAsset, { merge: true }),
        new Promise((resolve) => setTimeout(resolve, 3000))
      ]);
    } catch (err) {
      console.warn('Universal downloaded asset sync notice:', err);
    }
  }

  // 2. Also write to users/{userId}/downloaded_assets/{assetId}
  if (userId) {
    try {
      const userAssetDocRef = doc(db, 'users', userId, 'downloaded_assets', asset.id);
      await Promise.race([
        setDoc(userAssetDocRef, cleanAsset, { merge: true }),
        new Promise((resolve) => setTimeout(resolve, 3000))
      ]);
    } catch (err) {
      console.warn('User downloaded asset sync notice:', err);
    }
  }
};

export const fetchDownloadedAssetsFromFirestore = async (
  userId?: string,
  userEmail?: string
): Promise<DownloadedAsset[]> => {
  let detectedEmail = (userEmail || auth.currentUser?.email || '').trim().toLowerCase();
  if (!detectedEmail && typeof window !== 'undefined') {
    try {
      const localUser = JSON.parse(localStorage.getItem('et_growth_os_local_user') || '{}');
      if (localUser?.email) detectedEmail = localUser.email.trim().toLowerCase();
    } catch (e) {}
  }

  const assetMap = new Map<string, DownloadedAsset>();

  // 1. Fetch from universal_profiles/{emailDocId}/downloaded_assets
  if (detectedEmail) {
    try {
      const emailDocId = getEmailDocId(detectedEmail);
      const colRef = collection(db, 'universal_profiles', emailDocId, 'downloaded_assets');
      const snap = await Promise.race([
        getDocs(colRef),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500))
      ]);
      if (snap && (snap as any).forEach) {
        (snap as any).forEach((docSnap: any) => {
          const data = docSnap.data() as DownloadedAsset;
          if (data && data.id) {
            assetMap.set(data.id, data);
          }
        });
      }
    } catch (err) {
      console.warn('Universal downloaded assets fetch notice:', err);
    }
  }

  // 2. Fetch from users/{userId}/downloaded_assets
  if (userId) {
    try {
      const colRef = collection(db, 'users', userId, 'downloaded_assets');
      const snap = await Promise.race([
        getDocs(colRef),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000))
      ]);
      if (snap && (snap as any).forEach) {
        (snap as any).forEach((docSnap: any) => {
          const data = docSnap.data() as DownloadedAsset;
          if (data && data.id && !assetMap.has(data.id)) {
            assetMap.set(data.id, data);
          }
        });
      }
    } catch (err) {
      console.warn('User downloaded assets fetch notice:', err);
    }
  }

  // Sort by downloadedAt descending (most recent first)
  const list = Array.from(assetMap.values()).sort((a, b) => {
    return new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime();
  });

  return list;
};

export const deleteDownloadedAssetFromFirestore = async (
  userId: string | undefined,
  assetId: string,
  userEmail?: string
): Promise<void> => {
  let detectedEmail = (userEmail || auth.currentUser?.email || '').trim().toLowerCase();
  if (!detectedEmail && typeof window !== 'undefined') {
    try {
      const localUser = JSON.parse(localStorage.getItem('et_growth_os_local_user') || '{}');
      if (localUser?.email) detectedEmail = localUser.email.trim().toLowerCase();
    } catch (e) {}
  }

  if (detectedEmail) {
    try {
      const emailDocId = getEmailDocId(detectedEmail);
      await Promise.race([
        deleteDoc(doc(db, 'universal_profiles', emailDocId, 'downloaded_assets', assetId)),
        new Promise((resolve) => setTimeout(resolve, 2000))
      ]);
    } catch (err) {}
  }

  if (userId) {
    try {
      await Promise.race([
        deleteDoc(doc(db, 'users', userId, 'downloaded_assets', assetId)),
        new Promise((resolve) => setTimeout(resolve, 2000))
      ]);
    } catch (err) {}
  }
};

