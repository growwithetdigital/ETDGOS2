import React from 'react';
import { motion } from 'motion/react';
import { X, Download, FileText, ExternalLink, Calendar } from 'lucide-react';

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfBlobUrl: string | null;
  userName: string;
  onDownload: () => void;
  onOpenBooking?: () => void;
  onOpenCalendar?: () => void;
}

export default function PDFPreviewModal({
  isOpen,
  onClose,
  pdfBlobUrl,
  userName,
  onDownload,
  onOpenBooking,
  onOpenCalendar
}: PDFPreviewModalProps) {
  if (!isOpen || !pdfBlobUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden relative"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-cyan/15 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-sm sm:text-base font-bold text-white leading-tight">
                The Digital Growth Playbook
              </h3>
              <p className="font-sans text-xs text-slate-400">
                10 Practical Strategies for Business Growth • ET Digital Edition
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (onOpenCalendar) onOpenCalendar();
                else if (onOpenBooking) onOpenBooking();
              }}
              className="hidden sm:inline-flex items-center gap-2 bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm whitespace-nowrap cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              Book Free Audit on Google Calendar
            </button>

            <button
              onClick={onDownload}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-sans text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-brand-cyan" />
              Download PDF
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer ml-1"
              aria-label="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Body */}
        <div className="flex-1 bg-slate-950/60 relative overflow-hidden flex flex-col items-center justify-center">
          <iframe 
            src={`${pdfBlobUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            className="w-full h-full border-0"
            title="Digital Growth Playbook PDF Preview"
          />
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>ET Digital • 10 Practical Growth Strategies</span>
          
          <div className="flex items-center gap-4">
            <a 
              href={pdfBlobUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-brand-cyan hover:underline font-medium"
            >
              Open PDF in New Tab <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
