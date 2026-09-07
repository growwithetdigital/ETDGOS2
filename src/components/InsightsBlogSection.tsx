import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Calendar, Clock, BookOpen, Sparkles } from 'lucide-react';
import ArticleModal, { ArticleData } from './ArticleModal';

interface InsightsBlogSectionProps {
  onOpenBooking?: () => void;
  onOpenCalendar?: () => void;
}

export default function InsightsBlogSection({
  onOpenBooking,
  onOpenCalendar
}: InsightsBlogSectionProps) {
  const beehiivUrl = "https://growwithetdigital.beehiiv.com";
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  const articles: ArticleData[] = [
    {
      id: 'ai-search-shift',
      category: 'AI SEARCH SHIFT',
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
            "Read that again. Position one. The best real estate in SEO. Still losing well over half its traffic. Because the customer isn't clicking anymore — they're reading the answer where they already are.",
            "And this isn't a Google-only story. AI Overviews now show up on roughly 48% of all searches, up 58% from a year ago. Meanwhile 94% of B2B buyers now say they use tools like ChatGPT, Gemini, or Perplexity to research vendors before they ever contact a sales team. Your prospects are forming an opinion about your business inside a chat window before your website ever gets a look."
          ]
        },
        {
          heading: "The invisibility problem nobody's talking about",
          paragraphs: [
            "Here's where it gets uncomfortable. When an AI engine answers a question, it doesn't cite everyone who's ever written about the topic. Research from BrightEdge and Amsive found that AI platforms cite only 3 to 4 brands per response on average, and the top 20 domains capture 66% of all AI citations. It's not a level playing field — it's a short list. And once a company gets left off that list a few times, the model reinforces the same short list again and again.",
            "The kicker: a study of 400 senior marketing executives found only about 11% of B2B brands have the majority of their content structured to be AI-discovery ready. That means roughly 9 out of 10 businesses reading this are functionally invisible to the exact tool their customers are now using to make buying decisions. Not because their content is bad. Because it was never built to be read by a machine that's summarizing, not scrolling.",
            "That's the shift most agencies still aren't talking to their clients about. They're optimizing for a search bar that matters less every month, while the actual decision-making is happening somewhere else entirely."
          ]
        },
        {
          heading: "Why \"just write good content\" isn't the fix",
          paragraphs: [
            "We hear this a lot: \"We already publish blog posts, we should be fine.\" Respectfully — that's the old playbook, and it's not built for how these systems actually work.",
            "AI engines don't reward good writing. They reward structure they can parse with confidence. That means clean schema markup, clear entity relationships, direct answers positioned where a model can extract them, and consistency across every place your business shows up online — your site, your Google Business Profile, your reviews, your directory listings. When any of that is fragmented or contradictory, the model has less confidence in what it's citing, and it defaults to the competitor whose information is cleaner.",
            "This is the one structural fix most websites are missing: they're publishing content for humans to scroll past, when they should be publishing content for machines to cite with confidence. Those are not the same discipline, and treating them as interchangeable is why so many otherwise good businesses are getting skipped."
          ]
        },
        {
          heading: "The upside nobody expects",
          paragraphs: [
            "Here's the part that should actually get you excited instead of anxious: the businesses getting this right are seeing outsized returns, precisely because so few competitors have bothered to fix it yet. Brands cited directly inside AI Overviews earn roughly 35% more organic clicks than brands that rank organically but aren't cited — same position, same content topic, dramatically different outcome, all because one is structured to be trusted by the model and the other isn't.",
            "This is a narrow window. Once the top domains fully consolidate their position as the go-to citations in a given category, that consolidation is hard to break. Right now, most of your competitors are still optimizing for a search engine that's already changing its own game underneath them. That's your window."
          ]
        },
        {
          heading: "What this actually means for your business",
          paragraphs: [
            "This isn't a call to abandon SEO. It's a call to stop treating \"ranking\" as the finish line. The finish line moved to \"getting cited as the trusted answer\" — inside Google's AI Overview, inside a ChatGPT response, inside whatever your customer opens next.",
            "At ET Digital, this is exactly why we built AI visibility and AEO structuring into every GOS engagement instead of treating it as an add-on. You can't retrofit trust into a website after the fact — it has to be architected in from the content structure up.",
            "If you want to know exactly where your business stands right now — whether you're invisible, partially visible, or actually being cited — that's precisely what we look at first with every new client.",
            "Want the framework we use to fix this? That's what we cover step-by-step in this week's issue of the ET Digital Weekly — subscribe below and it lands in your inbox every week, no fluff, just the system."
          ]
        }
      ]
    },
    {
      id: 'growth-measurement',
      category: 'GROWTH MEASUREMENT',
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
            "Here's the number that should stop every business owner mid-scroll: only 30% of CMOs say they're confident in their ability to measure marketing ROI — yet 64% are basing next year's budget on last year's ROI numbers. Read that twice. Most marketing leaders are making six and seven-figure budget decisions off numbers they don't fully trust.",
            "That gap doesn't stay contained to one bad quarter. Weak measurement feeds bad budget allocation, bad allocation produces worse ROI, and worse ROI feeds more measurement confusion the next cycle. It compounds. Every quarter you run on vanity metrics is a quarter you're reinforcing whatever's already broken."
          ]
        },
        {
          heading: "Why impressions were never the right number",
          paragraphs: [
            "A vanity metric isn't useless because it's fake — impressions are real, reach is real. The problem is that these numbers fail the \"so what?\" test: they can't guide a decision, and they don't connect to a repeatable action that drives pipeline. You can 10x your impressions and still not know if a single one of those eyeballs was ever going to buy from you.",
            "Compare that to what actually earns budget in the boardroom: businesses using data-driven attribution grow revenue 1.7 times faster than those that don't. Not \"get more likes.\" Faster revenue growth. That's the difference between decorating a dashboard and running a business."
          ]
        },
        {
          heading: "The blind spot most reports don't show you",
          paragraphs: [
            "There's a second problem hiding under the first one. Even businesses that think they're measuring well are usually missing a huge piece of the picture. Industry data puts the average \"dark funnel\" gap — the buying research that happens before anything shows up in your CRM — at 38% of B2B pipeline. That's over a third of your buyer's actual journey happening in places your reporting can't see: private conversations, AI tool research, word of mouth, review sites.",
            "And most teams aren't equipped to close that gap. Only 14% of companies currently have fully automated lead-to-revenue tracking — meaning for 86% of businesses, someone is still stitching the real story together by hand, if they're doing it at all."
          ]
        },
        {
          heading: "The one number every GOS client dashboard is built around",
          paragraphs: [
            "Here's where we differ from the \"just track more metrics\" advice you'll find everywhere else. More dashboards isn't the answer — a clearer hierarchy is. Every metric should answer one question honestly: does this predict revenue, or does it just feel productive?",
            "That's the filter behind every GOS client dashboard. Not \"how many people saw the post\" but \"how many of the right people moved one step closer to becoming a customer, and what did that step cost us.\" Impressions might tell you a campaign got noticed. Pipeline-influenced revenue tells you whether it worked."
          ]
        },
        {
          heading: "What to do with this on Monday morning",
          paragraphs: [
            "You don't need a data science team to start fixing this. Start here:"
          ],
          bulletPoints: [
            "Pick the one metric tied directly to revenue for each channel — not \"engagement,\" but something like cost per qualified lead, pipeline sourced, or closed revenue by channel. If a metric can't answer \"so what,\" it moves to a secondary report, not the headline slide.",
            "Ask where your dark funnel is. If a chunk of your customers say \"I found you through a referral\" or \"I saw you somewhere and looked you up,\" that's real influence your dashboard isn't capturing. Start asking new customers directly how they found you — it's the cheapest attribution tool that exists.",
            "Stop reporting what looks good and start reporting what predicts what's coming. A leadership team that trusts its numbers makes faster, better-funded decisions. One that doesn't ends up relitigating the marketing budget every quarter."
          ]
        },
        {
          paragraphs: [
            "The businesses pulling ahead right now aren't the ones with the flashiest reports. They're the ones who can say, with a straight face, exactly which dollar produced which result — and cut the rest without flinching.",
            "Want to see exactly how we structure this inside a GOS client dashboard? That's the walkthrough in this week's ET Digital Weekly — subscribe below."
          ]
        }
      ]
    },
    {
      id: 'growth-systems',
      category: 'GROWTH SYSTEMS',
      title: 'Stop Building Content. Start Building a System.',
      summary: "83% of marketers agree quality beats quantity. Learn how re-engineering existing assets lifts organic traffic by 35% and why content systems beat content calendars.",
      date: 'Jul 2026',
      readTime: '5 Min Read',
      imageUrl: 'https://res.cloudinary.com/dnpvgq7gt/image/upload/v1786843247/IMG_9308_tzxld6.jpg',
      imageFit: 'cover',
      imagePosition: 'object-bottom',
      sourcesCited: "Content Marketing Institute (via genesysgrowth.com and toolfountain.com content marketing statistics roundups, 2026), Digital Applied Content Marketing Statistics 2026, HubSpot/Ahrefs (via ToolFountain aggregated benchmarks).",
      sections: [
        {
          paragraphs: [
            "Most businesses don't have a content problem. They have a content habit — post when you remember, chase whatever's trending, hope something sticks. That's not a strategy. It's a treadmill, and treadmills don't get you anywhere. They just keep you tired in place."
          ]
        },
        {
          heading: "The volume trap",
          paragraphs: [
            "The instinct to \"just post more\" isn't irrational — it's backed by some real data. Companies publishing 16 or more posts a month see 3.5 times more traffic than those publishing 0 to 4. So more content does correlate with more traffic. But that's exactly the trap: it's a correlation, not a strategy, and it ignores what it actually costs to sustain.",
            "Over half of B2B marketers — 54% — cite resource constraints as their single biggest content challenge, and 45% say they're struggling specifically with building a scalable content production system. Businesses aren't failing at content because they don't work hard enough. They're failing because \"post more\" isn't a system — it's a pace, and paces without structure eventually break the person or the budget behind them."
          ]
        },
        {
          heading: "Quality over quantity isn't a platitude — it's what the data says works",
          highlightBox: "83% of marketers now believe quality beats quantity. Companies prioritizing high-value blogging are 13x more likely to see positive ROI.",
          paragraphs: [
            "Here's the part that should be reassuring: 83% of marketers now believe quality beats quantity, even if it means posting less often. The businesses winning aren't the ones grinding out the most content. They're the ones building fewer, stronger assets that keep working long after they're published.",
            "Companies that prioritize blogging are 13 times more likely to see positive content marketing ROI, and B2B blog posts generate 67% more leads per post with more than double the conversion rate of lower-effort formats. That's not a volume story. That's a systems story — fewer pieces, built to actually convert, sustained on purpose."
          ]
        },
        {
          heading: "The compounding asset most businesses ignore",
          paragraphs: [
            "The most underused move in content right now isn't creating something new — it's re-engineering what already exists. Systematically repurposing top-performing content can lift organic traffic by 35%, and simply updating and refreshing existing pages has driven up to 70% more organic traffic and 32% more engagement time.",
            "That's the difference between a content calendar and a content system. A calendar tells you what to post Tuesday. A system tells you what's already working, how to extend its life, and when to retire what isn't pulling weight — so nothing you make gets used once and forgotten."
          ]
        },
        {
          heading: "Why measurement is the missing half of every \"content strategy\"",
          paragraphs: [
            "Here's the piece most teams skip entirely: knowing if any of it worked. Sixty percent of the most successful B2B marketers measure content ROI, compared to just 28% of the least successful — and marketers who measure ROI are 12 times more likely to report stronger year-over-year returns.",
            "That's not a coincidence. A system without measurement is still just a habit with better branding. The businesses actually compounding their content investment are treating every piece as a hypothesis to test, not a box to check off a calendar."
          ]
        },
        {
          heading: "What a real system looks like instead",
          paragraphs: [
            "This is the core of how we structure the Content & Build module inside GOS: every asset exists inside a repeatable engine, not a one-off sprint. That means:"
          ],
          bulletPoints: [
            "A small number of core assets built to rank, convert, and get repurposed six different ways — not six one-off posts that each die after a week.",
            "A refresh cycle for what's already published, since updating existing pages is often cheaper and faster than creating from scratch.",
            "A measurement layer from day one, so you know within 30 days whether an asset is working — not six months later when the budget conversation comes up."
          ]
        },
        {
          paragraphs: [
            "The goal was never \"more content.\" It was always leverage — building fewer things that do more work, for longer, with less of your time spent restarting from zero every week.",
            "Want the actual framework we use to structure this for clients? That's exactly what's in this week's ET Digital Weekly — subscribe below and get the system, not just the pep talk."
          ]
        }
      ]
    }
  ];

  const handleOpenArticle = (article: ArticleData) => {
    setSelectedArticle(article);
    setIsArticleModalOpen(true);
  };

  return (
    <section id="insights-blog" className="py-24 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 max-w-6xl mx-auto">
          <div className="max-w-xl text-left">
            <span className="font-mono text-xs font-black uppercase tracking-[0.25em] text-cyan-700 bg-cyan-100/80 border border-cyan-300 px-3.5 py-1.5 rounded-full inline-block mb-4 shadow-sm">
              Operational Intelligence
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
              Featured Insights
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-700 mt-3 leading-relaxed font-normal">
              We don’t write fluff. We document growth operating systems, algorithmic shifts, and real-world execution metrics from active client campaigns.
            </p>
          </div>

          <a
            href={beehiivUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-display text-xs font-black uppercase tracking-widest text-slate-950 hover:text-cyan-700 transition-colors bg-white border border-slate-300 shadow-sm px-5 py-3 rounded-xl hover:border-cyan-500"
          >
            <span>Beehiiv Publication</span>
            <ArrowUpRight className="w-4 h-4 text-cyan-600" />
          </a>
        </div>

        {/* Article Grid - Opens Article Reader Modal on click */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16 items-stretch">
          {articles.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              onClick={() => handleOpenArticle(article)}
              className="group flex flex-col justify-between bg-white rounded-3xl border-2 border-slate-200/90 p-5 transition-all duration-300 hover:shadow-2xl hover:border-brand-cyan hover:-translate-y-1 h-full shadow-md cursor-pointer"
            >
              <div className="flex flex-col flex-1">
                
                {/* Clean, uncluttered photographic/graphic featured image */}
                <div className="relative h-52 w-full rounded-2xl overflow-hidden mb-5 shadow-sm border border-slate-200 select-none group-hover:shadow-md transition-all bg-slate-950 flex items-center justify-center">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${
                      article.imageFit === 'contain' 
                        ? 'object-contain p-2' 
                        : 'object-cover'
                    } ${article.imagePosition || 'object-center'}`}
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Category Badge & Metadata Row */}
                <div className="flex items-center justify-between gap-2 font-mono text-[10px] text-slate-500 font-bold mb-3">
                  <span className="font-mono text-[9px] font-black tracking-wider text-cyan-800 bg-cyan-50 border border-cyan-200/80 px-2.5 py-1 rounded-md uppercase">
                    {article.category}
                  </span>
                  
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {article.readTime}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-display text-lg font-black text-slate-950 tracking-tight leading-snug group-hover:text-cyan-700 transition-colors mb-2.5">
                  {article.title}
                </h3>

                {/* Summary */}
                <p className="font-sans text-xs text-slate-600 leading-relaxed mb-6 font-normal">
                  {article.summary}
                </p>
              </div>

              {/* See Post Button - Opens Modal on-site */}
              <div className="pt-4 border-t border-slate-100 mt-auto">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenArticle(article);
                  }}
                  className="inline-flex items-center justify-between w-full text-xs font-display font-black uppercase tracking-widest text-slate-950 group-hover:text-cyan-700 transition-colors group-hover:translate-x-0.5 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-600" />
                    <span>See Post</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-cyan-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Weekly Newsletter Banner Module */}
        <div className="mt-20 max-w-5xl mx-auto bg-slate-950 rounded-3xl p-8 md:p-12 border-2 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-cyan/10 via-transparent to-slate-950 pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-cyan via-cyan-300 to-brand-cyan" />
          
          <div className="text-left max-w-2xl relative z-10">
            <div>
              <span className="font-mono text-[9px] font-extrabold text-brand-cyan bg-cyan-950/90 border border-brand-cyan/30 px-3.5 py-1.5 rounded-full inline-block mb-3 uppercase tracking-[0.25em]">
                The ET Digital Weekly
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                Get Practical Marketing Systems Delivered Straight To Your Inbox
              </h3>
              <p className="font-sans text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed font-normal">
                Join business owners, marketers, and leaders who want practical digital marketing insights—without the jargon. Every week you’ll receive actionable strategies, emerging AI tools, marketing trends, real-world case studies, and free resources to help your business grow with confidence.
              </p>
            </div>
          </div>

          <div className="relative z-10 w-full lg:w-auto shrink-0">
            <a
              href={beehiivUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-xs font-black uppercase tracking-widest px-8 py-5 rounded-xl transition-all shadow-xl shadow-cyan-950/60 active:scale-95 cursor-pointer w-full lg:w-auto text-center"
            >
              <span className="flex items-center justify-center gap-2">
                Join the ET Digital Weekly
                <ArrowUpRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </a>
            <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider text-center lg:text-right mt-3 font-semibold">
              Get the Next Issue Free
            </span>
          </div>
        </div>

      </div>

      {/* On-Site Article Reader Modal */}
      <ArticleModal
        article={selectedArticle}
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        onOpenBooking={onOpenBooking || (() => {})}
        onOpenCalendar={onOpenCalendar}
      />
    </section>
  );
}
