import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitBookingToFirestore, sendGmailMessage } from '../lib/firebase';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WEB3FORMS_ACCESS_KEY = (import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY || '0d9d7632-cf6b-4566-b29e-09b7b8bb7806';

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Touched state for active error display
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const primaryRecipient = 'hello@growwithetdigital.com';

  // Validation logic matching ET Form rules
  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const isNameValid = fullName.trim().length > 0;
  const isEmailValid = isValidEmail(email);
  const isMessageValid = message.trim().length >= 10;

  const handleResetAndClose = () => {
    onClose();
    setTimeout(() => {
      setFullName('');
      setEmail('');
      setMessage('');
      setTouched({ name: false, email: false, message: false });
      setSubmitted(false);
      setIsLoading(false);
      setErrorMessage('');
    }, 200);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ name: true, email: true, message: true });

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      setErrorMessage('Please correct the highlighted fields before sending.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      // 1. Direct Email Delivery via Web3Forms API to your inbox
      const web3Payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        name: fullName.trim(),
        email: email.trim(),
        replyto: email.trim(),
        subject: `🚀 New ET Digital Inquiry: ${fullName.trim()}`,
        message: message.trim(),
        from_name: 'ET Digital Growth Website',
      };

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(web3Payload),
        });
        const result = await response.json();
        if (!result.success) {
          console.warn('Web3Forms response status:', result);
        }
      } catch (wErr) {
        console.warn('Web3Forms dispatch attempt:', wErr);
      }

      // 2. Submit lead details to Firestore database
      submitBookingToFirestore({
        name: fullName.trim(),
        email: email.trim(),
        company: 'N/A',
        objective: 'Direct Strategy Inquiry',
        notes: message.trim(),
      }).catch((fErr) => {
        console.warn('Firestore booking note:', fErr);
      });

      // 3. Submit lead details to Google Form
      const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfwtjXUwkk1oNy7P3HweXWfpylVhR8ZDpOOANUyJwZ-Z9dg5Q/formResponse';
      const googleFormData = new FormData();
      googleFormData.append('entry.2005620554', fullName.trim());
      googleFormData.append('entry.1045781291', email.trim());
      googleFormData.append('entry.839337160', message.trim());

      fetch(googleFormUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: googleFormData,
      }).catch((err) => console.warn('Google Form fetch submission note:', err));

      // 4. Secondary Gmail API notification
      const notificationSubject = `New Strategy Inquiry: ${fullName.trim()}`;
      const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background-color: #f8fafc;">
          <h2 style="color: #0f172a; margin-top: 0;">New "Let's Connect" Message</h2>
          <p style="font-size: 14px; color: #475569;">A prospective client submitted an inquiry through the <strong>ET Digital</strong> contact form.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <table style="width: 100%; text-align: left; font-size: 14px; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #0891b2;">Name:</td>
              <td style="padding: 8px 0; color: #0f172a;">${fullName.trim()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #0891b2;">Email Address:</td>
              <td style="padding: 8px 0; color: #0f172a;"><a href="mailto:${email.trim()}" style="color: #0891b2;">${email.trim()}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #0891b2; vertical-align: top;">Message:</td>
              <td style="padding: 8px 0; color: #0f172a; white-space: pre-wrap;">${message.trim()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #0891b2;">Timestamp:</td>
              <td style="padding: 8px 0; color: #0f172a;">${new Date().toLocaleString()}</td>
            </tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0 16px 0;" />
          <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">ET Digital Client Inquiry System • <a href="https://growwithetdigital.com" style="color: #0891b2; text-decoration: none;">growwithetdigital.com</a></p>
        </div>
      `;

      sendGmailMessage(primaryRecipient, notificationSubject, emailBody).catch(() => {
        // Silently ignore if unauthenticated on client
      });

      setIsLoading(false);
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting message:', err);
      setIsLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 transition-all duration-150 ${
        isOpen 
          ? 'opacity-100 pointer-events-auto visible' 
          : 'opacity-0 pointer-events-none invisible'
      }`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop overlay */}
      <div 
        onClick={handleResetAndClose}
        className={`fixed inset-0 bg-slate-950/85 backdrop-blur-sm transition-opacity duration-150 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        id="booking-modal-overlay"
      />

      {/* Modal Container */}
      <div 
        className={`relative w-full max-w-[560px] bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl text-left overflow-hidden z-10 my-auto flex flex-col max-h-[92vh] transition-all duration-150 transform ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-2'
        }`}
        id="lets-connect-modal"
      >
        {/* Subtle Ambient Cyan Glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-brand-cyan/15 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/90 border border-brand-cyan/30 text-brand-cyan shadow-sm">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl font-black text-white uppercase tracking-wider">
                Let's Connect
              </h3>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                DIRECT STRATEGY INQUIRY & CONTACT FORM
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleResetAndClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
            id="close-connect-modal-btn"
            title="Close Window"
          >
            <span>Close</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-800 relative z-10">
          {submitted ? (
            /* Confirmation Screen */
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-950/90 border border-brand-cyan/40 text-center space-y-5 shadow-xl animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-cyan-950/90 border-2 border-brand-cyan text-brand-cyan mx-auto flex items-center justify-center shadow-lg shadow-cyan-950/50">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-xl font-black text-white uppercase tracking-wider">
                  Message Sent Successfully!
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{fullName}</strong>. Your message has been routed directly to our inbox. We will review your inquiry and get back to you shortly.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-xs font-black uppercase tracking-widest py-3.5 px-10 rounded-xl transition-all shadow-lg shadow-cyan-950/40 cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Close Window</span>
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* ET Custom Form (Adapted to ET Digital Dark/Cyan Theme) */
            <form onSubmit={handleFormSubmit} className="space-y-4 font-sans" noValidate>
              
              {/* Name Group */}
              <div className="space-y-1.5">
                <label htmlFor="et-name" className="block text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                  Name <span className="text-brand-cyan">*</span>
                </label>
                <input
                  type="text"
                  id="et-name"
                  name="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                  placeholder="Your full name"
                  className={`w-full bg-slate-950 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 border transition-all focus:outline-none ${
                    touched.name && !isNameValid
                      ? 'border-red-500 bg-red-950/20 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : touched.name && isNameValid
                      ? 'border-emerald-500/80 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-800 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20'
                  }`}
                />
                {touched.name && !isNameValid && (
                  <p className="text-xs text-red-400 font-sans flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>Please enter your name.</span>
                  </p>
                )}
              </div>

              {/* Email Group */}
              <div className="space-y-1.5">
                <label htmlFor="et-email" className="block text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                  Email Address <span className="text-brand-cyan">*</span>
                </label>
                <input
                  type="email"
                  id="et-email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                  placeholder="you@example.com"
                  className={`w-full bg-slate-950 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 border transition-all focus:outline-none ${
                    touched.email && !isEmailValid
                      ? 'border-red-500 bg-red-950/20 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : touched.email && isEmailValid
                      ? 'border-emerald-500/80 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-800 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20'
                  }`}
                />
                {touched.email && !isEmailValid && (
                  <p className="text-xs text-red-400 font-sans flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>Please enter a valid email address.</span>
                  </p>
                )}
              </div>

              {/* Message Group */}
              <div className="space-y-1.5">
                <label htmlFor="et-message" className="block text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                  Message <span className="text-brand-cyan">*</span>
                </label>
                <textarea
                  id="et-message"
                  name="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, message: true }))}
                  placeholder="How can we help you?"
                  className={`w-full bg-slate-950 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 border transition-all focus:outline-none resize-none ${
                    touched.message && !isMessageValid
                      ? 'border-red-500 bg-red-950/20 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : touched.message && isMessageValid
                      ? 'border-emerald-500/80 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-800 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20'
                  }`}
                />
                {touched.message && !isMessageValid && (
                  <p className="text-xs text-red-400 font-sans flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>Please enter a message (minimum 10 characters).</span>
                  </p>
                )}
              </div>

              {/* Global Error Banner if any */}
              {errorMessage && (
                <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-cyan hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-display text-sm font-black uppercase tracking-widest py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="pt-3 border-t border-slate-800/80 shrink-0 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
              <span>ET Digital Client Onboarding • Guaranteed Confidential</span>
            </div>
            <button
              onClick={handleResetAndClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-lg transition-all border border-slate-700 cursor-pointer flex items-center gap-1.5"
            >
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
