import React, { useState } from 'react';
import { 
  BookOpen, Sparkles, Clock, Calendar, ArrowUpRight, 
  Check, Copy, ExternalLink, ChevronRight, Share2, Eye,
  TrendingUp, Zap, Target, Lightbulb
} from 'lucide-react';
import ArticleModal, { ArticleData } from '../ArticleModal';
import MarketingIntelFeed from './MarketingIntelFeed';

interface FeaturedInsightsPanelProps {
  onOpenBooking?: () => void;
  onOpenCalendar?: () => void;
  onTacticCopied?: (title: string) => void;
}

export const FEATURED_ARTICLES: ArticleData[] = [
  {
    id: 'ai-search-shift',
    category: 'AI SEARCH SHIFT & AEO',
    title: "Google Isn't Where Your Customers Are Searching Anymore",
    summary: "Multiple studies show organic click-through rates dropping between 34% and 61% when AI Overviews appear. Learn why buyers are forming opinions in AI chat windows before reaching your website.",
    date: 'Jul 2026',
    readTime: '5 Min Read',
    imageUrl: 'https://res.cloudinary.com/dnpvgq7gt/image/upload/v1787432592/ReactNativeBlobUtilTmp_cr6nszm9d7faak1zyxcpd_jmhsv9.jpg',
    imageFit: 'cover',
    sourcesCited: "Seer Interactive (2.43B impression study), Ahrefs (300,000 keyword analysis), 6sense 2025 Buyer Experience Report, BrightEdge/Amsive AI citation research, 10Fold/Sapio Research (400 marketing executives).",
    sections: [
      {
        paragraphs: [
          "For twenty years, \"get to page one\" was the whole game. Rank higher, get more clicks, get more customers. That math is broken now, and most business owners haven't noticed yet because their rankings haven't moved. Their traffic has."
        ]
      },
      {
        heading: "Here's what's actually happening",
        highlightBox: "Position #1 organically lost 58% of its clicks once an AI Overview appeared above it. The customer isn't clicking anymore — they're reading the answer where they already are.",
        paragraphs: [
          "Multiple studies consistently show organic click-through rates dropping between 34% and 61% for search queries where an AI Overview appears. The most rigorous of these, an analysis of 2.43 billion impressions across 53 brands by Seer Interactive, found that organic CTR collapsed from 1.76% to 0.61% once Google started answering the question directly on the results page instead of sending the user to a website to find the answer.",
          "A separate Ahrefs analysis of 300,000 keywords found the #1 ranked result — the position everyone has spent two decades fighting to reach — lost 58% of its clicks once an AI Overview appeared above it.",
          "And this isn't a Google-only story. AI Overviews now show up on roughly 48% of all searches, up 58% from a year ago. Meanwhile 94% of B2B buyers now say they use tools like ChatGPT, Gemini, or Perplexity to research vendors before they ever contact a sales team. Your prospects are forming an opinion about your business inside a chat window before your website ever gets a look."
        ]
      },
      {
        heading: "The invisibility problem nobody's talking about",
        paragraphs: [
          "Here's where it gets uncomfortable. When an AI engine answers a question, it doesn't cite everyone who's ever written about the topic. Research from BrightEdge and Amsive found that AI platforms cite only 3 to 4 brands per response on average, and the top 20 domains capture 66% of all AI citations. It's not a level playing field — it's a short list. And once a company gets left off that list a few times, the model reinforces the same short list again and again.",
          "The kicker: a study of 400 senior marketing executives found only about 11% of B2B brands have the majority of their content structured to be AI-discovery ready. That means roughly 9 out of 10 businesses reading this are functionally invisible to the exact tool their customers are now using to make buying decisions."
        ]
      },
      {
        heading: "Strategic Execution for Growth OS Partners",
        paragraphs: [
          "At ET Digital, this is exactly why we built AI visibility and AEO structuring into every Growth OS deployment. You can't retrofit trust into a website after the fact — it has to be architected in from the content structure up.",
          "Ensure your quarterly AI content assets are structured with clear semantic schemas, direct question-and-answer anchors, and verified entity relationships."
        ]
      }
    ]
  },
  {
    id: 'growth-measurement',
    category: 'GROWTH MEASUREMENT & ATTRIBUTION',
    title: 'Stop Measuring Impressions. Measure What Pays Your Bills.',
    summary: "Only 30% of CMOs are confident measuring ROI, yet 64% base next year's budget on last year's ROI numbers. Discover how data-driven attribution drives 1.7x faster revenue growth.",
    date: 'Jul 2026',
    readTime: '5 Min Read',
    imageUrl: 'https://res.cloudinary.com/dnpvgq7gt/image/upload/v1787428329/ReactNativeBlobUtilTmp_tehhmoxg1gas9q5v7rzh_ymeomj.jpg',
    imageFit: 'cover',
    sourcesCited: "Nielsen 2025 Annual Marketing Report / Deloitte (via PPCChief 2026), Marketing LTB Attribution Analysis 2025, Digital Applied Marketing Attribution Statistics 2026, ZoomInfo/Pipeline vanity metrics research.",
    sections: [
      {
        paragraphs: [
          "Every marketing report has a slide that makes everyone in the room feel good. Impressions up. Reach up. Followers up. Then the CFO asks the only question that actually matters — \"so what did that do for revenue?\" — and the room goes quiet.",
          "This isn't a rare moment. It's the default state of marketing measurement right now, and the data backs it up."
        ]
      },
      {
        heading: "The confidence gap that's costing you budget",
        highlightBox: "Only 30% of CMOs say they're confident in their ability to measure marketing ROI — yet 64% are basing next year's budget on last year's ROI numbers.",
        paragraphs: [
          "Nielsen's Annual Marketing Report found that less than a third of chief marketing officers believe they can accurately demonstrate the return on their marketing spend. Yet Deloitte research shows 64% of companies set their upcoming marketing budgets based on perceived ROI from the prior year. If you can't measure it, you can't defend it.",
          "Companies that transition from vanity impressions to multi-touch attribution models grow 1.7x faster and reduce wasted ad spend by an average of 28%."
        ]
      },
      {
        heading: "The Growth OS Measurement Rule",
        paragraphs: [
          "In the ET Digital Growth Operating System, every piece of synthesized content, social thread, and graphic is connected directly to inbound customer conversion actions. Measure pipeline velocity and intake volume, not raw views."
        ]
      }
    ]
  }
];

export default function FeaturedInsightsPanel({
  onOpenBooking,
  onOpenCalendar,
  onTacticCopied
}: FeaturedInsightsPanelProps) {
  const [subTab, setSubTab] = useState<'tactics' | 'deepdives'>('tactics');
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  const handleReadArticle = (article: ArticleData) => {
    setSelectedArticle(article);
    setIsArticleModalOpen(true);
  };

  return (
    <div className="space-y-6" id="featured-insights-panel">
      {/* Header Banner with Experience Positioning */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] font-black uppercase tracking-widest text-brand-cyan bg-cyan-950/80 px-2.5 py-0.5 rounded border border-brand-cyan/30">
                Strategic Intelligence Desk
              </span>
              <span className="font-mono text-[9px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/20">
                Updated Weekly
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight mt-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-brand-cyan" />
              <span>Industry Insights & Tested Marketing Tactics</span>
            </h3>
            <p className="font-sans text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Proprietary research, real-world marketing experiments currently working, and tactical playbooks to keep your growth engine ahead of algorithm and platform shifts.
            </p>
          </div>

          <a
            href="https://growwithetdigital.beehiiv.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-brand-cyan text-xs font-mono font-bold border border-slate-700 transition-colors self-start sm:self-auto cursor-pointer shrink-0"
          >
            <span>Subscribe to Newsletter</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setSubTab('tactics')}
            className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'tactics'
                ? 'bg-brand-cyan text-slate-950 shadow-md'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Tested Tactics (Currently Working)</span>
            <span className="px-1.5 py-0.2 bg-slate-900/30 text-[10px] rounded-md">
              6 Active
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('deepdives')}
            className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'deepdives'
                ? 'bg-brand-cyan text-slate-950 shadow-md'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Research & Market Shift Papers</span>
            <span className="px-1.5 py-0.2 bg-slate-900/30 text-[10px] rounded-md">
              2 Papers
            </span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: TESTED MARKETING TACTICS FEED */}
      {subTab === 'tactics' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
            <span>Filter by strategic focus area:</span>
            <span>Click "Copy Tactic" to generate complete execution prompt</span>
          </div>
          <MarketingIntelFeed 
            onOpenBooking={onOpenBooking} 
            onTacticCopied={onTacticCopied} 
          />
        </div>
      )}

      {/* SUB-TAB 2: DEEP-DIVE RESEARCH PAPERS */}
      {subTab === 'deepdives' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURED_ARTICLES.map((article) => (
            <div
              key={article.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl group"
            >
              <div>
                {/* Image banner */}
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm border border-slate-750 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-brand-cyan uppercase tracking-wider">
                    {article.category}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{article.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{article.readTime}</span>
                    </span>
                  </div>

                  <h4 className="font-display text-lg font-bold text-white group-hover:text-brand-cyan transition-colors leading-snug">
                    {article.title}
                  </h4>

                  <p className="font-sans text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              {/* Read Article CTA Footer */}
              <div className="px-6 pb-6 pt-2">
                <button
                  type="button"
                  onClick={() => handleReadArticle(article)}
                  className="w-full py-3 px-4 rounded-xl bg-slate-850 hover:bg-brand-cyan text-slate-300 hover:text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-750 hover:border-brand-cyan"
                >
                  <span>Read In-Depth Study</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Modal */}
      {selectedArticle && (
        <ArticleModal
          isOpen={isArticleModalOpen}
          onClose={() => setIsArticleModalOpen(false)}
          article={selectedArticle}
          onOpenBooking={onOpenBooking}
          onOpenCalendar={onOpenCalendar}
        />
      )}
    </div>
  );
}
