import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Lock, FileText, Check } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'security';
}

export default function LegalModals({ isOpen, onClose, type }: LegalModalProps) {
  if (!isOpen) return null;

  const isPrivacy = type === 'privacy';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
        >
          {/* Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-cyan to-cyan-500" />

          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-brand-cyan/20 flex items-center justify-center">
                {isPrivacy ? (
                  <Shield className="w-5 h-5 text-brand-cyan" />
                ) : (
                  <Lock className="w-5 h-5 text-brand-cyan" />
                )}
              </div>
              <div className="text-left">
                <h3 className="font-display text-lg font-bold text-white tracking-tight">
                  {isPrivacy ? 'Privacy Policy' : 'Security Terms & Disclosures'}
                </h3>
                <p className="font-mono text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">
                  ET Digital Growth Systems &mdash; Industry Standard
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 sm:p-8 overflow-y-auto text-left font-sans text-xs sm:text-sm text-slate-300 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
            {isPrivacy ? (
              <>
                <div className="space-y-2">
                  <p className="font-medium text-white text-sm sm:text-base">1. Information We Collect</p>
                  <p className="font-light leading-relaxed text-slate-400">
                    We collect personal identifiers and interaction data when you visit our digital assets, schedule consultations, or subscribe to our insights newsletter. This includes your name, email address, corporate identity, phone number, and direct responses to onboarding diagnostics.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-medium text-white text-sm sm:text-base">2. Advanced Tracking and Conversions APIs (CAPI)</p>
                  <p className="font-light leading-relaxed text-slate-400">
                    To maintain radical attribution clarity without relying on third-party cookies, we deploy server-to-server Conversions APIs (including Meta CAPI, Google Ads CAPI, and custom server routing). This securely measures site interactions and form conversions directly through our private cloud servers.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-medium text-white text-sm sm:text-base">3. How We Use Your Data</p>
                  <p className="font-light leading-relaxed text-slate-400">
                    Your data is solely used to personalize your onboarding diagnostics, coordinate scheduled sessions, deliver the weekly intelligence briefs, and optimize our outbound messaging metrics. We do not engage in automated client-profiling or share records with third-party brokers.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-medium text-white text-sm sm:text-base">4. Data Control & Unsubscribe Rights</p>
                  <p className="font-light leading-relaxed text-slate-400">
                    You maintain complete authority over your digital footprint. Every newsletter contains an instantaneous unsubscribe link. You may request absolute removal of your booking data at any time by emailing <a href="mailto:hello@growwithetdigital.com" className="text-brand-cyan hover:underline">hello@growwithetdigital.com</a>.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-medium text-white text-sm sm:text-base">5. Updates to This Policy</p>
                  <p className="font-light leading-relaxed text-slate-400 font-mono text-[11px]">
                    Last modified: July 2026. This policy complies with CCPA, GDPR, and emerging server-side data compliance principles.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <p className="font-medium text-white text-sm sm:text-base">1. Infrastructure & Storage Security</p>
                  <p className="font-light leading-relaxed text-slate-400">
                    All client onboarding diagnostic details and corporate metadata are transmitted securely via TLS 1.3 encryption. Data storage is hosted within isolated GCP Firestore containers backed by strict firestore.rules permission controls to ensure zero unauthorized access.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-medium text-white text-sm sm:text-base">2. Third-Party Integration Security</p>
                  <p className="font-light leading-relaxed text-slate-400">
                    We exclusively partner with verified SOC 2 Type II compliant booking, newsletter, and calendar platforms. All customer billing, direct integrations, and credential processes remain fully isolated within designated enterprise APIs.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-medium text-white text-sm sm:text-base">3. Intellectual Property Protections</p>
                  <p className="font-light leading-relaxed text-slate-400">
                    The strategic matrices, code structures, and copywriting assets developed by ET Digital under active agreements are protected by corporate covenants. Standard Non-Disclosure Agreements (NDAs) are signed with every corporate client prior to systems integration.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-medium text-white text-sm sm:text-base">4. Algorithmic Changes & System Liability</p>
                  <p className="font-light leading-relaxed text-slate-400">
                    ET Digital designs high-performance configurations built to adapt to modern platform shifts (Google SGE, Meta, TikTok updates). However, we are not legally liable for sudden, unannounced global API changes, third-party server outages, or systemic web ecosystem resets.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-medium text-white text-sm sm:text-base">5. Contact Information</p>
                  <p className="font-light leading-relaxed text-slate-400">
                    For inquiries regarding security certifications, data storage configurations, or system-level NDAs, please contact: <a href="mailto:hello@growwithetdigital.com" className="text-brand-cyan hover:underline">hello@growwithetdigital.com</a>.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-800 bg-slate-950 flex justify-end">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 bg-brand-cyan hover:bg-cyan-500 text-slate-950 font-display text-[10px] font-extrabold uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              I Understand
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
