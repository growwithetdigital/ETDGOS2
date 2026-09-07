import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Mail, Lock, User as UserIcon, ArrowRight, 
  Sparkles, CheckCircle2, AlertCircle, RefreshCw, 
  ShieldCheck, Globe, KeyRound, LogIn
} from 'lucide-react';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  resetPasswordEmail, 
  googleSignInWithProfile 
} from '../../lib/firebase';
import { User } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: 'signin' | 'signup' | 'forgot';
}

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  initialMode = 'signin' 
}: AuthModalProps) {
  const [emailMode, setEmailMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const sanitizeErrorMessage = (err: any): string => {
    if (!err) return 'Authentication encountered a brief issue. Please try again.';
    const raw = typeof err === 'string' ? err : (err.message || String(err));
    if (raw.includes('{') && raw.includes('error')) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.error) return String(parsed.error);
      } catch (e) {}
    }
    if (raw.includes('auth/unauthorized-domain') || raw.includes('unauthorized-domain')) {
      return 'Google Sign-In domain authorization pending in Firebase. Please use Email Sign-In below—it is active and works immediately!';
    }
    if (raw.includes('auth/popup-closed-by-user')) {
      return 'Google sign-in popup was closed before completion.';
    }
    if (raw.includes('auth/email-already-in-use')) {
      return 'An account already exists for this email. Please switch to Sign In.';
    }
    if (raw.includes('auth/invalid-credential') || raw.includes('auth/wrong-password')) {
      return 'Incorrect email or password. Please verify your credentials.';
    }
    return raw.replace(/Firebase:\s*/i, '').replace(/Error\s*\([a-z0-9/-]+\)\.?/i, '').trim();
  };

  // 1. Google Sign-In (Allows account choice & grants requested permissions)
  const handleGoogleAuth = async () => {
    setError(null);
    setSuccessMsg(null);
    setIsGoogleLoading(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('et_signed_out');
      }
      const user = await googleSignInWithProfile();
      onSuccess(user);
      onClose();
    } catch (err: any) {
      console.warn('Google auth notice:', err);
      const errMsg = sanitizeErrorMessage(err);
      setError(errMsg);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // 2. Email & Password submit (Sign In or Create Account)
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('et_signed_out');
      }

      if (emailMode === 'signup') {
        if (!displayName.trim()) {
          throw new Error('Please enter your full name or company name.');
        }
        if (!email.trim() || !email.includes('@')) {
          throw new Error('Please enter a valid email address.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }

        const { user, verificationSent } = await signUpWithEmail(email.trim(), password, displayName.trim());
        if (verificationSent) {
          setSuccessMsg(`Account created! A verification notice was sent to ${email.trim()}.`);
        }
        onSuccess(user);
        setTimeout(() => onClose(), 600);
      } else if (emailMode === 'signin') {
        if (!email.trim()) throw new Error('Please enter your email address.');
        if (!password) throw new Error('Please enter your password.');
        const user = await signInWithEmail(email.trim(), password);
        onSuccess(user);
        onClose();
      } else if (emailMode === 'forgot') {
        if (!email.trim()) throw new Error('Please enter your email to receive reset instructions.');
        await resetPasswordEmail(email.trim());
        setSuccessMsg(`Password reset instructions sent to ${email.trim()}.`);
      }
    } catch (err: any) {
      console.error('Email authentication error:', err);
      setError(sanitizeErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-8 text-left shadow-cyan-950/20"
        id="auth-portal-modal"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          id="auth-modal-close-btn"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="space-y-1.5 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] font-black uppercase tracking-widest text-brand-cyan bg-cyan-950/60 px-2 py-0.5 rounded border border-brand-cyan/20">
              ET Digital Growth OS™
            </span>
            <span className="font-mono text-[9px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
              Executive Suite
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Access Your Growth OS
          </h2>
          <p className="font-sans text-xs sm:text-sm text-slate-400">
            Choose your preferred sign-in method to enter your executive dashboard.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-xs text-emerald-300 flex items-start gap-2.5 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* OPTION 1: GOOGLE AUTH */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isGoogleLoading || isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 active:scale-[0.99] text-slate-900 font-display text-sm font-bold flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-cyan-500/10 cursor-pointer disabled:opacity-60"
            id="auth-google-signin-btn"
          >
            {isGoogleLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-slate-700" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>
          <p className="text-[11px] text-center text-slate-400">
            Allows you to choose your Google account and grant permissions securely.
          </p>
        </div>

        {/* DIVIDER */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[10px] font-mono uppercase tracking-widest text-slate-500 whitespace-nowrap">
            or continue with email
          </span>
          <div className="border-t border-slate-800 w-full" />
        </div>

        {/* OPTION 2: EMAIL AUTH */}
        {/* Toggle Mode: Sign In vs Create Account */}
        <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800/80 mb-4">
          <button
            type="button"
            onClick={() => { setEmailMode('signin'); setError(null); }}
            className={`flex-1 py-1.5 px-3 rounded-lg font-display text-xs font-bold transition-all cursor-pointer ${
              emailMode === 'signin'
                ? 'bg-brand-cyan text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setEmailMode('signup'); setError(null); }}
            className={`flex-1 py-1.5 px-3 rounded-lg font-display text-xs font-bold transition-all cursor-pointer ${
              emailMode === 'signup'
                ? 'bg-brand-cyan text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-3.5 text-left">
          {emailMode === 'signup' && (
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name / Business Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Eric Thomas"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
              />
            </div>
          </div>

          {emailMode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Password
                </label>
                {emailMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => { setEmailMode('forgot'); setError(null); }}
                    className="text-[10px] text-brand-cyan hover:underline cursor-pointer"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-display text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
            id="auth-email-submit-btn"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>
                  {emailMode === 'signup' ? 'Create Free Account' : emailMode === 'signin' ? 'Sign In with Email' : 'Send Reset Link'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Security Badge */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit Encrypted Portal</span>
          </div>
          <span className="font-mono text-[10px] text-slate-600">v2.6 SECURE</span>
        </div>
      </motion.div>
    </div>
  );
}
