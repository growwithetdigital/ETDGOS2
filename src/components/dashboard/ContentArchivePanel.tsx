import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Archive, FileText, Download, Copy, Check, 
  ExternalLink, Layers, Search, Sparkles, Calendar,
  ArrowUpRight, Clock, ShieldCheck, Share2, Eye,
  Trash2, RefreshCw, Filter, BookOpen
} from 'lucide-react';
import { GeneratedContentItem, UserProfile } from '../../types';
import { User } from 'firebase/auth';

interface ContentArchivePanelProps {
  user: User;
  profile: UserProfile | null;
  items: GeneratedContentItem[];
  onSelectAndLoad: (item: GeneratedContentItem) => void;
  onNavigateToContentStudio: () => void;
  onOpenBooking: () => void;
}

export default function ContentArchivePanel({
  user,
  profile,
  items,
  onSelectAndLoad,
  onNavigateToContentStudio,
  onOpenBooking
}: ContentArchivePanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<GeneratedContentItem | null>(null);

  const businessName = profile?.business_name || profile?.displayName || 'Your Brand';

  // Filtered archived dispatches
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const blogBody = item.blog_post.markdown_content || item.blog_post.body || '';
      const blogCat = item.blog_post.category || item.blog_post.target_keyword || '';
      const matchesSearch = 
        item.blog_post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blogBody.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blogCat.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'all' 
        ? true 
        : blogCat.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [items, searchQuery, selectedCategory]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach(i => {
      const cat = i.blog_post.category || i.blog_post.target_keyword;
      if (cat) set.add(cat);
    });
    return ['all', ...Array.from(set)];
  }, [items]);

  const handleCopyBlog = (item: GeneratedContentItem) => {
    const blogBody = item.blog_post.markdown_content || item.blog_post.body || '';
    const text = `# ${item.blog_post.title}\n\n${blogBody}\n\n— Published by ${businessName}`;
    navigator.clipboard.writeText(text);
    setCopiedItemId(`blog-${item.id}`);
    setTimeout(() => setCopiedItemId(null), 2000);
  };

  const handleCopyCaption = (item: GeneratedContentItem) => {
    const caption = item.social_captions.linkedin || item.social_captions.facebook || item.blog_post.title;
    navigator.clipboard.writeText(caption);
    setCopiedItemId(`cap-${item.id}`);
    setTimeout(() => setCopiedItemId(null), 2000);
  };

  return (
    <div className="space-y-6 text-left" id="content-archive-panel">
      
      {/* Console Header */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5">
                <Archive className="w-3 h-3 text-cyan-400" />
                Permanent Growth Archive
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                {items.length} {items.length === 1 ? 'Dispatch' : 'Dispatches'} Preserved
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
              {businessName} Asset Archive
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Every 1-Asset Growth Kit you generate is permanently preserved here. Access previous 300-word blogs, editorial thumbnails, captions, eblasts, and GBP dispatches anytime.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onNavigateToContentStudio}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Create New Kit</span>
            </button>
            <button
              type="button"
              onClick={onOpenBooking}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>Speak with Us</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
          <span className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-wider block">
            Archived Kits
          </span>
          <div className="text-2xl font-display font-bold text-[var(--text)]">
            {items.length}
          </div>
          <span className="text-[10px] font-mono text-emerald-500">100% Retained</span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
          <span className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-wider block">
            Repurposed Assets
          </span>
          <div className="text-2xl font-display font-bold text-[var(--text)]">
            {items.length * 5}
          </div>
          <span className="text-[10px] font-mono text-cyan-500">Blogs, Visuals, Emails</span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
          <span className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-wider block">
            Total Content Words
          </span>
          <div className="text-2xl font-display font-bold text-[var(--text)]">
            {items.reduce((acc, curr) => acc + (curr.blog_post.word_count || 300), 0)}
          </div>
          <span className="text-[10px] font-mono text-purple-500">Structured Entity Copy</span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
          <span className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-wider block">
            AEO Citation Value
          </span>
          <div className="text-2xl font-display font-bold text-emerald-600 dark:text-emerald-400">
            Active
          </div>
          <span className="text-[10px] font-mono text-[var(--muted)]">Answer Engine Ready</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past dispatches, keywords..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-cyan-500 transition-all font-sans"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-[var(--muted)] shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-[var(--surface2)] text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dispatches Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] space-y-4">
          <Archive className="w-10 h-10 text-[var(--muted)] mx-auto opacity-50" />
          <div className="space-y-1">
            <h3 className="font-display font-bold text-base text-[var(--text)]">
              No Dispatches Found
            </h3>
            <p className="text-xs text-[var(--muted)] max-w-md mx-auto leading-relaxed">
              {searchQuery 
                ? 'Try a different keyword or clear your search query.'
                : 'Generate your 1-Asset Growth Kit in Content Studio to begin building your permanent marketing archive.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToContentStudio}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Open Content Studio</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isBlogCopied = copiedItemId === `blog-${item.id}`;
            const isCapCopied = copiedItemId === `cap-${item.id}`;

            return (
              <div
                key={item.id}
                className="group rounded-3xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm hover:border-cyan-500/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Visual Thumbnail Bar */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 border-b border-[var(--border)]">
                  <img
                    src={item.graphic.public_download_url}
                    alt={item.blog_post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 backdrop-blur-sm">
                      {item.blog_post.category || 'Strategic Insight'}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-slate-300">
                    <span className="truncate">{businessName}</span>
                    <span>{item.blog_post.word_count || 300} Words</span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-sm sm:text-base text-[var(--text)] line-clamp-2 leading-snug group-hover:text-cyan-500 transition-colors">
                      {item.blog_post.title}
                    </h3>
                    <p className="text-xs text-[var(--muted)] line-clamp-3 leading-relaxed font-sans">
                      {(item.blog_post.markdown_content || item.blog_post.body || '').replace(/^[#*>\s]+/, '').slice(0, 160)}...
                    </p>
                  </div>

                  {/* Actions Footer */}
                  <div className="space-y-2.5 pt-3 border-t border-[var(--border)]">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyBlog(item)}
                        className="flex-1 py-1.5 px-2 rounded-lg border border-[var(--border)] bg-[var(--surface2)] hover:border-cyan-500/40 text-[var(--text)] font-mono text-[10px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                        title="Copy 300-word blog post"
                      >
                        {isBlogCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500">Copied!</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-3 h-3 text-[var(--muted)]" />
                            <span>Copy Blog</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyCaption(item)}
                        className="flex-1 py-1.5 px-2 rounded-lg border border-[var(--border)] bg-[var(--surface2)] hover:border-cyan-500/40 text-[var(--text)] font-mono text-[10px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                        title="Copy social caption"
                      >
                        {isCapCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3 h-3 text-[var(--muted)]" />
                            <span>Copy Caption</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setPreviewItem(item)}
                        className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface2)] hover:border-cyan-500/40 text-[var(--muted)] hover:text-[var(--text)] transition-all cursor-pointer"
                        title="Quick View Full Dispatch"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectAndLoad(item)}
                      className="w-full py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      <Layers className="w-3 h-3" />
                      <span>Load into Studio</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Quick View Full Dispatch Modal */}
      <AnimatePresence>
        {previewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl max-h-[85vh] bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-7 overflow-y-auto shadow-2xl space-y-5 text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-500 font-bold">
                    Archived Dispatch
                  </span>
                  <h3 className="font-display text-lg font-bold text-[var(--text)]">
                    {previewItem.blog_post.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="p-1.5 rounded-xl bg-[var(--surface2)] text-[var(--muted)] hover:text-[var(--text)] text-xs font-mono cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              {/* 300-word body */}
              <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-2">
                <span className="font-mono text-[10px] uppercase font-bold text-cyan-500 block">
                  300-Word Blog Post
                </span>
                <div className="text-xs text-[var(--text)] font-sans leading-relaxed whitespace-pre-line">
                  {previewItem.blog_post.markdown_content || previewItem.blog_post.body}
                </div>
              </div>

              {/* Social Caption */}
              <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] space-y-1">
                <span className="font-mono text-[10px] uppercase font-bold text-cyan-500 block">
                  Social Caption
                </span>
                <p className="text-xs text-[var(--text)] font-sans leading-relaxed">
                  {previewItem.social_captions.linkedin || previewItem.social_captions.facebook}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onSelectAndLoad(previewItem);
                    setPreviewItem(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-display text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Edit in Content Studio
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
