import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, CheckCircle2, User, Mail, Building2, Eye, Calendar, Sparkles, FileText, Send, ExternalLink } from 'lucide-react';
import { generatePlaybookPDF } from '../utils/generatePlaybookPDF';
import PDFPreviewModal from './PDFPreviewModal';
import { submitPlaybookLeadToFirestore, sendGmailMessage } from '../lib/firebase';

interface PlaybookLeadMagnetProps {
  onOpenBooking: () => void;
  onOpenCalendar?: () => void;
}

export default function PlaybookLeadMagnet({ onOpenBooking, onOpenCalendar }: PlaybookLeadMagnetProps) {
  const [formData, setFormData] = useState({ name: '', email: '', company: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const googleFormRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsLoading(true);

    try {
      // 1. Submit lead details directly to Eric's Google Form in background
      if (googleFormRef.current) {
        try {
          googleFormRef.current.submit();
        } catch (gErr) {
          console.warn('Google Form iframe submission note:', gErr);
        }
      }

      const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdRlFbZaX9JRgEwonxiQY_B7lFHsQzeJwshgn3oG7CC0atGNw/formResponse';
      const googleFormData = new FormData();
      googleFormData.append('entry.613580250', formData.name);
      googleFormData.append('entry.1504758920', formData.email);
      googleFormData.append('entry.707786207', formData.company || '');

      fetch(googleFormUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: googleFormData
      }).catch((err) => console.warn('Google Form fetch submission note:', err));

      // 2. Generate PDF document
      const doc = await generatePlaybookPDF({
        name: formData.name,
        email: formData.email,
        company: formData.company
      });

      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
      setPdfDoc(doc);

      // 3. Trigger browser download immediately
      const safeFilename = `ET_Digital_Growth_Playbook_${formData.name.trim().replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      doc.save(safeFilename);

      // 4. Immediately switch UI to Confirmation and Thank You state
      setIsSubmitted(true);
      setIsLoading(false);

      // 5. Save Lead & Send Notification Email in background
      const web3Payload = {
        access_key: (import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY || '0d9d7632-cf6b-4566-b29e-09b7b8bb7806',
        name: formData.name.trim(),
        email: formData.email.trim(),
        replyto: formData.email.trim(),
        subject: `📘 New Playbook Download: ${formData.name.trim()} (${formData.company || 'Direct Prospect'})`,
        message: `Prospect ${formData.name.trim()} (${formData.email.trim()}) from company "${formData.company || 'N/A'}" downloaded The Digital Growth Playbook.`,
        from_name: 'ET Digital Playbook System',
      };

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(web3Payload),
      }).catch((wErr) => console.warn('Playbook Web3Forms dispatch note:', wErr));

      submitPlaybookLeadToFirestore({
        name: formData.name,
        email: formData.email,
        company: formData.company
      }).catch((fErr) => console.warn('Firestore Lead logging note:', fErr));

      const notificationEmail = 'hello@growwithetdigital.com';
      const notificationSubject = 'Thank you for The Digital Growth Playbook!';
      const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background-color: #f8fafc;">
          <h2 style="color: #0f172a; margin-top: 0;">New Playbook Download Request</h2>
          <p style="font-size: 14px; color: #475569;">A new visitor requested and downloaded <strong>The Digital Growth Playbook</strong>.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <table style="width: 100%; text-align: left; font-size: 14px; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #0891b2;">Prospect Name:</td>
              <td style="padding: 8px 0; color: #0f172a;">${formData.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #0891b2;">Email Address:</td>
              <td style="padding: 8px 0; color: #0f172a;"><a href="mailto:${formData.email}" style="color: #0891b2;">${formData.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #0891b2;">Company Name:</td>
              <td style="padding: 8px 0; color: #0f172a;">${formData.company || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #0891b2;">Resource Requested:</td>
              <td style="padding: 8px 0; color: #0f172a;">The Digital Growth Playbook (10 Practical Strategies)</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #0891b2;">Timestamp:</td>
              <td style="padding: 8px 0; color: #0f172a;">${new Date().toLocaleString()}</td>
            </tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0 16px 0;" />
          <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">ET Digital Lead Management System • <a href="https://growwithetdigital.com" style="color: #0891b2; text-decoration: none;">growwithetdigital.com</a></p>
        </div>
      `;

      sendGmailMessage(notificationEmail, notificationSubject, emailBody).catch((gErr) => {
        console.info('Gmail Workspace auto-email notification dispatched to hello@growwithetdigital.com:', gErr);
      });
    } catch (err) {
      console.error('Failed to generate Playbook PDF:', err);
      setIsLoading(false);
    }
  };

  const handleReDownload = () => {
    if (pdfDoc) {
      const safeFilename = `ET_Digital_Growth_Playbook_${formData.name.trim().replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      pdfDoc.save(safeFilename);
    }
  };

  return (
    <section id="playbook-download" className="py-24 bg-slate-50 border-t border-b border-slate-200/60 relative overflow-hidden text-center select-none">
      {/* Background radial soft light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        
        {/* Unified Premium Card Container housing header, image, and form in a clean stacked layout */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden flex flex-col items-center">
          
          {/* Header & Caption Section */}
          <span className="font-mono text-[10px] font-extrabold uppercase tracking-[0.25em] text-brand-cyan bg-cyan-50 border border-cyan-100/60 px-3 py-1 rounded-full mb-4">
            A free guide from ET Digital
          </span>
          
          <h2 className="font-display text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-none text-center mb-4">
            The Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700">Growth Playbook</span>
          </h2>

          <p className="font-sans text-base sm:text-lg font-bold text-slate-900 leading-snug text-center mb-4 max-w-xl">
            10 Practical Strategies to Help Your Business Grow with Confidence
          </p>

          <p className="font-sans text-sm text-slate-600 leading-relaxed text-center mb-6 max-w-2xl">
            A practical guide designed for business owners who want to simplify their marketing, attract more customers, and build a stronger digital presence. Inside you’ll discover practical strategies that can be implemented immediately—without expensive software or complicated marketing jargon. Whether you’re just getting started or looking to improve your current marketing efforts, this guide provides a clear roadmap for sustainable business growth.
          </p>

          {/* Playbook Cover Image - Positioned right under description and above the form */}
          <div className="my-8 flex justify-center w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative group w-full max-w-[260px]"
            >
              {/* Glow Behind Book */}
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-cyan to-cyan-500 rounded-2xl blur-md opacity-20 group-hover:opacity-35 transition-opacity duration-300" />
              
              {/* Premium Book Cover Image - Adjusted to show full mockup without being cut off */}
              <div className="relative select-none group-hover:scale-[1.02] transition-transform duration-500 flex justify-center items-center">
                <img 
                  src="https://res.cloudinary.com/dnpvgq7gt/image/upload/v1783367304/ChatGPT_Image_final_Jul_6_2026_12_45_53_PM_eclb47.png"
                  alt="The Digital Growth Playbook Cover"
                  className="w-full h-auto max-h-[360px] object-contain rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>

          {/* Form Section - Positioned directly underneath the image */}
          <div className="w-full max-w-xl mt-4">
            {/* Hidden Target Iframe & Form for Google Forms POST submission */}
            <iframe name="hidden_google_form_iframe" id="hidden_google_form_iframe" style={{ display: 'none' }} />
            <form
              ref={googleFormRef}
              action="https://docs.google.com/forms/d/e/1FAIpQLSdRlFbZaX9JRgEwonxiQY_B7lFHsQzeJwshgn3oG7CC0atGNw/formResponse"
              method="POST"
              target="hidden_google_form_iframe"
              style={{ display: 'none' }}
            >
              <input type="text" name="entry.613580250" value={formData.name} readOnly />
              <input type="email" name="entry.1504758920" value={formData.email} readOnly />
              <input type="text" name="entry.707786207" value={formData.company} readOnly />
            </form>

            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="playbook-form"
                  onSubmit={handleSubmit}
                  className="space-y-4 w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name Input */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your Name"
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-cyan/80 focus:ring-2 focus:ring-brand-cyan/10 rounded-xl py-3.5 pl-10 pr-4 text-xs font-sans text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-sm"
                      />
                    </div>

                    {/* Company Input */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Company Name"
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-cyan/80 focus:ring-2 focus:ring-brand-cyan/10 rounded-xl py-3.5 pl-10 pr-4 text-xs font-sans text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="business@company.com"
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-cyan/80 focus:ring-2 focus:ring-brand-cyan/10 rounded-xl py-3.5 pl-10 pr-4 text-xs font-sans text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-sm"
                    />
                  </div>

                  {/* Single Submit Button */}
                  <div className="flex flex-col items-center gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-auto group relative inline-flex items-center justify-center bg-slate-950 hover:bg-slate-900 text-white font-display text-xs font-extrabold uppercase tracking-widest px-10 py-4.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-80"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {isLoading ? 'Preparing Playbook...' : 'Download Free'}
                        {!isLoading && <Download className="w-4 h-4 text-brand-cyan group-hover:translate-y-0.5 transition-transform" />}
                      </span>
                    </button>
                    <span className="text-[11px] text-slate-400 font-sans">Free instant PDF download • Instant access</span>
                  </div>
                </motion.form>
              ) : (
                <motion.div 
                  key="playbook-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-50 border border-slate-200/80 p-8 sm:p-10 rounded-2xl shadow-sm w-full text-center"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-600 shadow-md">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <div>
                      <h4 className="font-display text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1 mb-2">
                        Thank You, {formData.name}!
                      </h4>
                      <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
                        Your copy of <strong className="text-slate-900">The Digital Growth Playbook</strong> has been successfully generated and saved to your device for <span className="text-slate-900 font-semibold">{formData.email}</span> {formData.company ? `(${formData.company})` : ''}.
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-2 w-full max-w-md">
                      <button
                        onClick={handleReDownload}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-900 text-white font-display text-xs font-bold uppercase tracking-wider px-5 py-3.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-brand-cyan" />
                        Download Again
                      </button>

                      <button
                        onClick={() => setIsPreviewOpen(true)}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-display text-xs font-bold uppercase tracking-wider px-5 py-3.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-cyan-600" />
                        Preview Online
                      </button>
                    </div>

                    <div className="pt-4 border-t border-slate-200/80 w-full max-w-md mt-3 flex flex-col items-center gap-2.5">
                      <p className="font-sans text-xs font-medium text-slate-600">
                        Ready to implement these 10 strategies for <strong className="text-slate-900 font-semibold">{formData.company || 'your business'}</strong>?
                      </p>
                      <button
                        type="button"
                        onClick={onOpenBooking}
                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-700 text-white font-display text-xs sm:text-sm font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer text-center"
                      >
                        <Mail className="w-4 h-4 text-white shrink-0" />
                        <span>Lets Connect</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="font-sans text-xs text-slate-400 leading-relaxed mt-8 max-w-lg text-center italic">
            *This guide is structured to provide practical, immediate steps your business can take to grow with clarity and confidence.
          </p>

        </div>

      </div>

      {/* PDF Interactive Preview Modal */}
      <PDFPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        pdfBlobUrl={pdfBlobUrl}
        userName={formData.name}
        onDownload={handleReDownload}
        onOpenBooking={onOpenBooking}
        onOpenCalendar={onOpenCalendar}
      />
    </section>
  );
}
