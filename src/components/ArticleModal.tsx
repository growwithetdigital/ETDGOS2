import React from 'react';
import { X, Calendar, Clock, Sparkles, ArrowRight, BookOpen, Share2, Check } from 'lucide-react';

export interface ArticleData {
  id: string;
  category: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  imageUrl: string;
  imageFit?: 'cover' | 'contain';
  imagePosition?: string;
  sections: {
    heading?: string;
    paragraphs: string[];
    bulletPoints?: string[];
    highlightBox?: string;
  }[];
  sourcesCited: string;
}

interface ArticleModalProps {
  article: ArticleData | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
  onOpenCalendar?: () => void;
}

export default function ArticleModal({
  article,
  isOpen,
  onClose,
  onOpenBooking,
  onOpenCalendar
}: ArticleModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !article) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 md:p-6 transition-all duration-200"
      aria-hidden={!isOpen}
    >
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity duration-200"
        id="article-modal-overlay"
      />

      {/* Main Modal Card */}
      <div 
        className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl text-left overflow-hidden z-10 my-auto flex flex-col max-h-[92vh] transition-all duration-200 transform scale-100 animate-in fade-in zoom-in-95"
        id="article-reader-modal"
      >
        {/* Top Header Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0 relative z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="font-mono text-[10px] sm:text-xs font-black uppercase tracking-wider text-cyan-800 bg-cyan-100/90 border border-cyan-300 px-3 py-1 rounded-full">
              {article.category}
            </span>
            <div className="hidden sm:flex items-center gap-3 text-slate-500 font-mono text-xs font-semibold">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {article.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {article.readTime}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
              title="Share Article"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline text-emerald-700 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono shadow-sm"
              id="close-article-modal-btn"
              title="Close Reader"
            >
              <span>Close</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="flex-1 overflow-y-auto py-6 pr-1 sm:pr-3 space-y-8 font-sans scrollbar-thin scrollbar-thumb-slate-300">
          
          {/* Article Header & Image */}
          <div className="space-y-4">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight leading-snug sm:leading-tight">
              {article.title}
            </h1>

            <div className="flex sm:hidden items-center gap-3 text-slate-500 font-mono text-xs font-semibold pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {article.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {article.readTime}
              </span>
            </div>

            {/* Featured Hero Header Image */}
            <div className="relative w-full h-56 sm:h-80 rounded-2xl overflow-hidden border border-slate-200/90 shadow-md bg-slate-950 flex items-center justify-center">
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className={`w-full h-full transition-all ${
                  article.imageFit === 'contain' 
                    ? 'object-contain p-2 sm:p-4' 
                    : 'object-cover'
                } ${article.imagePosition || 'object-center'}`}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Article Section Blocks */}
          <div className="space-y-8 text-slate-800 text-sm sm:text-base leading-relaxed">
            {article.sections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                {section.heading && (
                  <h2 className="font-display text-xl sm:text-2xl font-black text-slate-950 tracking-tight border-b border-slate-100 pb-2 pt-2">
                    {section.heading}
                  </h2>
                )}

                {section.highlightBox && (
                  <div className="my-5 p-5 rounded-2xl bg-cyan-50/80 border-l-4 border-cyan-600 text-slate-900 font-medium space-y-2 shadow-sm">
                    <div className="flex items-center gap-2 text-cyan-800 font-mono text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-cyan-700" />
                      <span>Key Strategic Metric</span>
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed text-slate-800 font-sans italic">
                      "{section.highlightBox}"
                    </p>
                  </div>
                )}

                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-slate-700 font-normal leading-relaxed font-sans">
                    {p}
                  </p>
                ))}

                {section.bulletPoints && section.bulletPoints.length > 0 && (
                  <ul className="space-y-3 pt-1 pl-2">
                    {section.bulletPoints.map((bp, bpIdx) => (
                      <li key={bpIdx} className="flex items-start gap-3 bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl text-xs sm:text-sm text-slate-800 font-medium">
                        <span className="w-2 h-2 rounded-full bg-cyan-600 shrink-0 mt-1.5" />
                        <span className="leading-relaxed">{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Sources Cited Section */}
          <div className="mt-10 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1 font-mono">
            <span className="font-bold text-slate-900 uppercase tracking-wider block mb-1">Sources Cited:</span>
            <p className="leading-relaxed text-slate-600 font-mono">{article.sourcesCited}</p>
          </div>

          {/* Footer Call to Action Banner */}
          <div className="mt-8 bg-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="font-mono text-[9px] font-black uppercase tracking-widest text-brand-cyan bg-cyan-950 border border-brand-cyan/30 px-3 py-1 rounded-full inline-block">
                ET Digital Growth Systems
              </span>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
                Ready to Implement These Systems in Your Business?
              </h3>
              <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                Schedule a 1-on-1 strategy call with our engineering team or send an inquiry to discuss your custom growth operating system.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
              {onOpenCalendar && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenCalendar();
                  }}
                  className="w-full sm:w-auto bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-xs font-black uppercase tracking-widest py-3 px-5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Book Call</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => {
                  onClose();
                  onOpenBooking();
                }}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-display text-xs font-bold uppercase tracking-wider py-3 px-5 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Let's Connect</span>
                <BookOpen className="w-3.5 h-3.5 text-brand-cyan" />
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="pt-4 border-t border-slate-200 shrink-0 flex items-center justify-between relative z-10">
          <span className="text-xs font-mono text-slate-500">
            ET Digital Operational Intelligence • Publication Reader
          </span>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-display text-xs font-black uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <span>Close Article</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
