import React from 'react';
import { X, Calendar, ExternalLink } from 'lucide-react';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CalendarModal({ isOpen, onClose }: CalendarModalProps) {
  const calendarUrl = 'https://calendar.app.google/Eg21vAqWrJN1j358A';

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 transition-all duration-150 ${
        isOpen 
          ? 'opacity-100 pointer-events-auto visible' 
          : 'opacity-0 pointer-events-none invisible'
      }`}
      aria-hidden={!isOpen}
    >
      {/* Overlay background */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-150 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        id="calendar-modal-overlay"
      />

      {/* Modal Container */}
      <div 
        className={`relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl text-left overflow-hidden z-10 my-auto flex flex-col max-h-[92vh] transition-all duration-150 transform ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-2'
        }`}
        id="calendar-booking-modal"
      >
        {/* Background cyan glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-cyan/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800/80 shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-cyan-950/80 border border-brand-cyan/30 text-brand-cyan shadow-sm">
              <Calendar className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-xl font-black text-white uppercase tracking-wider">
                Work with Us — Google Calendar
              </h3>
              <p className="text-[10px] font-mono text-slate-400">DIRECT 1-ON-1 EXECUTIVE APPOINTMENT SCHEDULE</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-all"
              title="Open in new tab"
            >
              <span>Open Fullscreen</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
              id="close-calendar-modal-btn"
              title="Close Window"
            >
              <span>Close</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Iframe Body - Pre-mounted for instant opening */}
        <div className="flex-1 overflow-y-auto py-2 my-2 scrollbar-thin scrollbar-thumb-slate-800 rounded-xl bg-slate-950 border border-slate-800/80 min-h-[480px]">
          <iframe
            src={calendarUrl}
            width="100%"
            height="650"
            frameBorder="0"
            className="w-full h-[620px] rounded-xl border-0 bg-white"
            title="ET Digital Google Calendar Appointment Schedule"
            loading="eager"
          >
            Loading Calendar...
          </iframe>
        </div>

        {/* Footer with Close Button */}
        <div className="pt-3 border-t border-slate-800/80 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-sans">
            <Calendar className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
            <span>Select a convenient time slot above. Click close when complete.</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden flex-1 bg-slate-800 text-slate-200 text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl text-center flex items-center justify-center gap-1"
            >
              <span>Full Screen</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-xs font-black uppercase tracking-widest px-6 py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Close Window</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
