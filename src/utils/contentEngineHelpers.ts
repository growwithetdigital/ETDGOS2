import { UserProfile } from '../types';

/**
 * Strips markdown symbols (#, *, **, __, ---, [Link](url)) to produce clean,
 * pristine text suitable for direct publishing in CMS, Word, or emails without symbols.
 */
export function stripMarkdownFormatting(md: string): string {
  if (!md) return '';
  return md
    // Replace headings: "# Title" or "## 1. Heading" -> "Title" or "1. Heading"
    .replace(/^#{1,6}\s+(.+)$/gm, '$1\n')
    // Remove bold and italic markers: **text**, *text*, __text__, _text_
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Clean bullet points
    .replace(/^\s*[\*\-]\s+/gm, '• ')
    // Remove horizontal rule dividers
    .replace(/^---+$/gm, '')
    .replace(/^___+$/gm, '')
    // Replace markdown links [Anchor Text](URL) with Anchor Text (URL)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
    // Clean excessive blank lines (3+ into 2)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Curated natural, high-resolution photography from Unsplash/Pexels style sources.
 * Real authentic business coaching, storytelling, strategic planning, modern office,
 * and leadership imagery — strictly no artificial "AI slop" or synthetic renders.
 */
export interface NaturalPhotoAsset {
  id: string;
  title: string;
  category: string;
  url: string;
  author: string;
  location: string;
}

export const CURATED_NATURAL_PHOTOS: NaturalPhotoAsset[] = [
  {
    id: 'photo-strategic-planning',
    title: 'Strategic Workspace & Growth Architecture',
    category: 'Strategic Planning',
    url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80',
    author: 'Alesia Kazantceva',
    location: 'Modern Studio'
  },
  {
    id: 'photo-metropolitan-growth',
    title: 'Metropolitan Commercial Growth & Entity Presence',
    category: 'Regional Authority',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    author: 'Nastuh Abootalebi',
    location: 'Financial District'
  },
  {
    id: 'photo-systems-analytics',
    title: 'Data-Driven Growth Analytics & Performance Metrics',
    category: 'Systems & Frameworks',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
    author: 'Carlos Muza',
    location: 'Executive Lab'
  },
  {
    id: 'photo-executive-boardroom',
    title: 'Executive Governance & Strategic Leadership Suite',
    category: 'Advisory & Governance',
    url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80',
    author: 'Nastuh Abootalebi',
    location: 'Executive Suite'
  },
  {
    id: 'photo-creative-narrative',
    title: 'Brand Storytelling, Editorial & Strategic Planning',
    category: 'Editorial Strategy',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80',
    author: 'Ian Schneider',
    location: 'Creative Suite'
  },
  {
    id: 'photo-digital-infrastructure',
    title: 'Modern Cloud Technology & Global Digital Architecture',
    category: 'Technology & SaaS',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    author: 'NASA',
    location: 'Global Cloud Grid'
  },
  {
    id: 'photo-hardware-tech',
    title: 'Advanced Computing & High-Performance Engineering',
    category: 'Hardware & Systems',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
    author: 'Alexandre Debiève',
    location: 'Tech Hub'
  },
  {
    id: 'photo-healthcare-clinic',
    title: 'Clinical Diagnostics & Healthcare Operations',
    category: 'Healthcare & Wellness',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80',
    author: 'Online Marketing',
    location: 'Clinical Practice'
  },
  {
    id: 'photo-legal-architecture',
    title: 'Legal Governance, Jurisprudence & Corporate Advisory',
    category: 'Legal & Professional Services',
    url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1600&q=80',
    author: 'Giammarco Boscaro',
    location: 'Judicial Chamber'
  },
  {
    id: 'photo-modern-real-estate',
    title: 'Architectural Prestige & Commercial Real Estate',
    category: 'Real Estate & Construction',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    author: 'R ARCHITECTURE',
    location: 'Metropolitan Estate'
  },
  {
    id: 'photo-urban-skyline',
    title: 'Regional Market Footprint & Commercial Expansion',
    category: 'Market Footprint',
    url: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1600&q=80',
    author: 'Sawyer Bengtson',
    location: 'Metropolitan Horizon'
  }
];

/**
 * Returns photography tailored to the detected business niche or industry.
 * Curated exclusively with neutral, face-free, industry-specific architectural,
 * clinical, technological, or workspace environments to maintain demographic inclusivity.
 */
export function getNichePhotoForBusiness(industry?: string, websiteUrl?: string): NaturalPhotoAsset {
  const combined = `${industry || ''} ${websiteUrl || ''}`.toLowerCase();
  if (combined.includes('health') || combined.includes('clinic') || combined.includes('dent') || combined.includes('med') || combined.includes('doctor') || combined.includes('care')) {
    return CURATED_NATURAL_PHOTOS.find(p => p.id === 'photo-healthcare-clinic') || CURATED_NATURAL_PHOTOS[0];
  }
  if (combined.includes('law') || combined.includes('legal') || combined.includes('attorney') || combined.includes('counsel') || combined.includes('justice')) {
    return CURATED_NATURAL_PHOTOS.find(p => p.id === 'photo-legal-architecture') || CURATED_NATURAL_PHOTOS[0];
  }
  if (combined.includes('real estate') || combined.includes('property') || combined.includes('home') || combined.includes('architect') || combined.includes('develop')) {
    return CURATED_NATURAL_PHOTOS.find(p => p.id === 'photo-modern-real-estate') || CURATED_NATURAL_PHOTOS[0];
  }
  if (combined.includes('tech') || combined.includes('software') || combined.includes('saas') || combined.includes('ai') || combined.includes('app') || combined.includes('cloud')) {
    return CURATED_NATURAL_PHOTOS.find(p => p.id === 'photo-digital-infrastructure') || CURATED_NATURAL_PHOTOS[0];
  }
  if (combined.includes('consult') || combined.includes('coach') || combined.includes('advisory') || combined.includes('agency')) {
    return CURATED_NATURAL_PHOTOS.find(p => p.id === 'photo-strategic-planning') || CURATED_NATURAL_PHOTOS[0];
  }
  return CURATED_NATURAL_PHOTOS[0];
}

export interface SocialAnglePackage {
  id: string;
  angle_title: string;
  angle_badge: string;
  linkedin: string;
  twitter_x: string;
  facebook: string;
  instagram_threads: string;
  email_subject: string;
  email_preview: string;
  email_body: string;
  lead_magnet_hook: string;
}

/**
 * Generates dynamic, multiple promotional campaign angles for the core article.
 * Allows users to return repeatedly and get fresh social copy to drive traffic
 * and engagement throughout the quarter without changing the underlying article.
 */
export function generateSocialPromotionAngles(
  profile: UserProfile | null,
  articleTitle: string,
  _articleContent: string
): SocialAnglePackage[] {
  const business = profile?.business_name || 'Eric Thomas';
  const location = profile?.location || 'Los Angeles';
  const mission = profile?.mission_statement || 'business coaching to inspire storytelling';
  const audience = profile?.target_audience || 'business owners and leaders';
  const website = profile?.website_url || 'https://growwithetdigital.com';
  const contact = profile?.contact || 'Eric Thomas';

  return [
    {
      id: 'angle-authority',
      angle_title: 'The Category Authority Hook',
      angle_badge: 'Executive Thought Leadership',
      linkedin: `Most ${audience} in ${location} aren't losing deals to better competitors—they're losing them to noise and friction.

At ${business}, our guiding mission is simple: "${mission}".

When you evaluate why commercial buyers choose one authority over another, three factors determine the outcome every single time:

1. Hyper-relevant regional authority that answers real questions
2. Frictionless conversion paths that respect the buyer's time
3. Consistent strategic storytelling across every touchpoint

Read our full high-velocity blueprint: "${articleTitle}" at ${website}

What is the single biggest bottleneck preventing your business from dominating search in ${location}?

#BusinessGrowth #ExecutiveCoaching #${location.replace(/\s+/g, '')} #Storytelling #Authority`,
      twitter_x: `Why do most customer acquisition campaigns in ${location} stall?

They run sporadic tactics instead of architecture.

Here is how ${business} turns online discovery into qualified client conversations 🧵👇 ${website}`,
      facebook: `Are high-intent buyers in ${location} finding definitive answers when they search for what you do?

At ${business}, our mission is clear: "${mission}". We've just published our latest strategic blueprint on establishing undeniable regional presence for ${audience}.

Explore the full article and conversion framework here: ${website}`,
      instagram_threads: `Consistency beats sporadic effort every single time. In our latest piece, "${articleTitle}", we break down how ${business} helps ${audience} in ${location} cut through the marketing noise with purpose-driven storytelling. Link in bio to read the full guide.`,
      email_subject: `${business}: The High-Velocity Growth Blueprint for ${location}`,
      email_preview: `How market leaders in ${location} turn online discovery into qualified conversations...`,
      email_body: (() => {
        const cleanContact = (contact || '').trim();
        const cleanBusiness = (business || '').trim();
        const isDuplicate = !cleanContact || !cleanBusiness || 
          cleanContact.toLowerCase() === cleanBusiness.toLowerCase() ||
          cleanBusiness.toLowerCase().includes(cleanContact.toLowerCase());
        const signoff = isDuplicate ? (cleanContact || cleanBusiness || 'The Leadership Team') : `${cleanContact}\n${cleanBusiness}`;

        return `Hi there,

In today's market, high-intent buyers in ${location} don't have time to wade through generic marketing noise. They want definitive solutions from trusted authorities who understand their specific challenges.

At ${business}, our mission is clear: "${mission}".

In our latest executive guide, we've broken down:
• Why competitors relying on sporadic tactics are losing ground
• The 3 differentiators that capture high-intent search queries from ${audience}
• The immediate 30-day priorities required to lead your category

Read the full blueprint online here: ${website}

Best regards,

${signoff}`;
      })(),
      lead_magnet_hook: `Complimentary Diagnostic: Request your 1-Page Growth Blueprint & Search Assessment for ${location} at ${website}`
    },
    {
      id: 'angle-contrarian',
      angle_title: 'The Contrarian / Market Reality Angle',
      angle_badge: 'Debate & High Engagement',
      linkedin: `Unpopular opinion: "Getting to page one" of Google isn't enough anymore.

If a prospect in ${location} lands on your website and meets a generic contact form or vague corporate jargon, they bounce in 8 seconds.

At ${business}, we believe ${mission}. That means:
• Answering the top 5 questions buyers ask before investing
• Eliminating multi-step contact friction
• Leading with proof rather than sales hype

Our latest editorial, "${articleTitle}", breaks down why conventional marketing playbooks are failing ${audience}—and what to do instead.

Read the breakdown: ${website}

Do you agree that most corporate websites create more friction than clarity?

#MarketingStrategy #Leadership #ContrarianView #BusinessCoaching #${business.replace(/\s+/g, '')}`,
      twitter_x: `Most marketing advice for ${location} is 5 years out of date.

If your content sounds like everyone else, you're invisible.

Here's why "${mission}" is the only sustainable moat 📊: ${website}`,
      facebook: `Why do conventional marketing agencies keep pitching the same outdated tactics to ${audience} in ${location}?

Because it's easy. But modern buyers evaluate trust through clear proof, structured authority, and direct answers.

See how ${business} is resetting the standard: ${website}`,
      instagram_threads: `Stop competing on generic marketing noise. If you want high-intent buyers in ${location} to choose you, give them direct answers and frictionless access. Read our latest strategic release at ${website}.`,
      email_subject: `Why conventional marketing in ${location} is broken (and what works now)`,
      email_preview: `The difference between sporadic tactics and compounding category authority...`,
      email_body: (() => {
        const cleanContact = (contact || '').trim();
        const cleanBusiness = (business || '').trim();
        const isDuplicate = !cleanContact || !cleanBusiness || 
          cleanContact.toLowerCase() === cleanBusiness.toLowerCase() ||
          cleanBusiness.toLowerCase().includes(cleanContact.toLowerCase());
        const signoff = isDuplicate ? (cleanContact || cleanBusiness || 'The Leadership Team') : `${cleanContact}\n${cleanBusiness}`;

        return `Hi there,

Most organizations spend thousands on marketing campaigns without addressing the core leak: converting discovery into predictable, qualified conversations.

At ${business}, our mission is "${mission}".

In our new release, we address the uncomfortable reality of modern search in ${location} and why leading brands are shifting toward structured, intent-driven storytelling.

Read the full perspective here: ${website}

To your compounding growth,

${signoff}`;
      })(),
      lead_magnet_hook: `Free Audit Checklist: The 5 Questions Every High-Value Buyer in ${location} Asks Before Booking`
    },
    {
      id: 'angle-framework',
      angle_title: 'The 3-Step Execution Framework',
      angle_badge: 'Actionable & Bookmarkable',
      linkedin: `If you had 30 days to establish category leadership in ${location}, where would you focus?

Here is the exact 3-step framework we deploy at ${business} to turn regional visibility into compounding revenue:

Step 1: Solidify Local Entity Markup
Ensure your Google Business Profile, verified schemas, and local citations align with your core offerings for ${audience}.

Step 2: Deploy Intent-Driven Content
Stop publishing filler. Answer the exact questions high-value prospects ask before making an investment decision.

Step 3: Streamline Conversion Paths
Replace clunky questionnaires with instant diagnostic pathways.

Explore the complete execution guide: "${articleTitle}" at ${website}

Save this post for your quarterly planning session.

#ActionableStrategy #Execution #Framework #${location.replace(/\s+/g, '')} #GrowthOS`,
      twitter_x: `The 30-Day Growth Priority Stack for ${location} businesses:

1. Solidify local entity & GBP citations
2. Answer top-5 high-intent buyer questions
3. Eliminate conversion friction

Full tactical breakdown ⬇️: ${website}`,
      facebook: `Want to establish undeniable category presence in ${location}? Here are the 3 execution priorities every ${audience} should implement this month:

1. Local entity verification
2. Intent-driven content
3. Frictionless intake channels

Discover how ${business} executes this framework at ${website}!`,
      instagram_threads: `Swipe through our 3-step execution framework for building category authority in ${location}. Save this post to reference during your next strategic growth review. Full link in bio: ${website}`,
      email_subject: `The 3-Step 30-Day Execution Priority for ${location}`,
      email_preview: `A structured roadmap to turn online visibility into qualified client conversations...`,
      email_body: `Hi there,

Operating with random tactics yields sporadic results. Operating with structured systems produces compounding revenue.

Here is the 3-step priority stack from our latest ${business} blueprint:

1. Solidify Local Entity Markup across ${location}
2. Deploy Intent-Driven Content tailored to ${audience}
3. Streamline Conversion Paths to remove all booking friction

Dive into the full strategic article here: ${website}

Warmly,
${contact}
${business}`,
      lead_magnet_hook: `Download the 30-Day Execution Template & Scorecard at ${website}`
    },
    {
      id: 'angle-mission-story',
      angle_title: 'The Purpose & Storytelling Angle',
      angle_badge: 'Brand Connection & Trust',
      linkedin: `Behind every sustainable enterprise in ${location} is a clear, unshakeable reason for existing.

At ${business}, our mission has always been: "${mission}".

When we work with ${audience}, the goal isn't just to produce content—it's to translate authentic expertise into digital authority that builds immediate trust.

In our latest publication, "${articleTitle}", we share:
• Why modern buyers evaluate trust through proof and lived conviction
• How authentic brand narrative outperforms commoditized competitors
• What it takes to build a lasting presence in ${location}

Discover the full story at ${website}

What is the core mission that drives your business forward every morning?

#PurposeDriven #Storytelling #FounderStory #${business.replace(/\s+/g, '')} #Leadership`,
      twitter_x: `People don't buy what you do—they buy why you do it and how reliably you solve their pain.

At ${business}, our mission is: "${mission}".

Read our latest perspective on building real authority in ${location} 🧵: ${website}`,
      facebook: `Why does ${business} exist? Our core mission is: "${mission}".

In our latest editorial piece, we explore why genuine storytelling and structured authority create deeper customer loyalty than conventional advertising.

Read the story here: ${website}`,
      instagram_threads: `Storytelling isn't fluff—it's the bridge between discovery and trust. Discover how ${business} is helping ${audience} in ${location} lead with purpose. Read the full post at ${website}.`,
      email_subject: `The mission behind ${business} (and why it matters for ${location})`,
      email_preview: `Why authentic storytelling is the ultimate differentiator in modern business...`,
      email_body: `Hi there,

At ${business}, our core mission is clear: "${mission}".

Yet even market-leading organizations face an urgent bottleneck: converting online discovery into qualified, predictable conversations.

In our newly released guide, we share how ${audience} in ${location} can leverage authentic storytelling and structured authority to lead their category.

Read the full article online: ${website}

With gratitude,
${contact}
${business}`,
      lead_magnet_hook: `Watch the 5-Minute Masterclass: Storytelling That Converts for ${location} Businesses`
    },
    {
      id: 'angle-quick-hook',
      angle_title: 'The Short-Form Conversation Starter',
      angle_badge: 'High Comments & Shareability',
      linkedin: `Quick question for ${audience} operating in ${location}:

When a qualified prospect Googles your category today, do they find:
A) Generic corporate marketing noise?
B) A clear, authoritative guide answering their exact challenge?

If you answered A, you're not alone. But fixing it takes weeks, not months.

We just published our quarterly guide at ${business}: "${articleTitle}".

Check it out at ${website} and let me know your thoughts in the comments below.

#QuickPoll #ExecutiveLeadership #${location.replace(/\s+/g, '')} #BusinessCoaching`,
      twitter_x: `Does your website explain what you do in 5 seconds or does it make visitors think?

If they have to think, they leave.

Here's the fix from ${business} ⬇️: ${website}`,
      facebook: `When people in ${location} search for your services, does your brand stand out as the definitive authority? Check out our quick guide at ${website} to see where the open lanes are!`,
      instagram_threads: `Does your website convert or confuse? A 5-second test every business owner in ${location} needs to take. Full breakdown at ${website}.`,
      email_subject: `Quick question about your presence in ${location}...`,
      email_preview: `A 3-minute diagnostic for ${audience} evaluating their digital growth...`,
      email_body: `Hi there,

Quick question: When a high-intent buyer in ${location} searches for your core capability, are they finding definitive proof of your authority, or generic marketing noise?

At ${business}, our mission is "${mission}".

We've summarized the key differentiators in our latest publication: "${articleTitle}".

Read it in under 4 minutes here: ${website}

Best,
${contact}`,
      lead_magnet_hook: `Take the 2-Minute Diagnostic Quiz at ${website}`
    }
  ];
}

export interface EvergreenBlogPost {
  title: string;
  target_keyword: string;
  word_count: number;
  markdown_content: string;
  meta_description: string;
  read_time: string;
  editorial_quote: string;
  category: string;
}

/**
 * Generates an evergreen 400-word authority blog post tailored to the client's business DNA.
 * Researched around high-intent buyer search questions in their niche, with implied
 * semantic clarity, local entity presence, and frictionless conversion architecture.
 */
export function generateEvergreenBlogPost(profile: UserProfile | null): EvergreenBlogPost {
  const business = profile?.business_name || profile?.displayName || 'Eric Thomas';
  const location = profile?.location || 'Los Angeles, CA';
  const mission = profile?.mission_statement || 'business coaching to inspire storytelling';
  const audience = profile?.target_audience || 'Entrepreneurs and commercial business leaders';
  const industry = profile?.industry || 'Executive Advisory & Digital Services';
  const website = profile?.website_url || 'https://growwithetdigital.com';

  const title = `Why High-Intent Buyers in ${location} Choose Category Proof Over Marketing Noise`;
  const target_keyword = `${business} ${location} authority`;
  const editorial_quote = `Modern decision-makers don't evaluate partners through generic marketing claims—they invest in trusted authorities who provide transparent answers and zero-friction access.`;

  const markdown_content = `Why High-Intent Buyers in ${location} Choose Category Proof Over Marketing Noise

In today's fast-evolving commercial landscape, high-intent decision-makers in ${location} no longer respond to promotional hype. Whether hiring an advisor, retaining an agency, or scaling operations, modern buyers evaluate partners through a simple criterion: clarity, proof, and speed to resolution.

At ${business}, our guiding commitment is rooted in ${mission}. Yet even established organizations face a predictable bottleneck: spending considerable capital driving digital discovery, only to lose prospective clients to confusing messaging and bloated inquiry questionnaires.

---

What Decision-Makers in ${location} Are Actually Researching

Data from search queries and executive buyer inquiries reveals a decisive behavioral shift across ${industry}. High-intent prospects consistently evaluate three core questions before committing to an introductory conversation:

1. Does This Partner Solve My Exact Problem?
Buyers avoid generalists. They seek specialized practitioners who demonstrate immediate operational literacy in their field and possess genuine regional credibility in ${location}.

2. What Is the Measurable Speed to Value?
Decision-makers demand structured implementation roadmaps. Rather than open-ended retainers, commercial clients prioritize partners who articulate distinct milestones from day thirty through day ninety.

3. Can I Evaluate Their Methodology Without Friction?
If an organization requires four separate form fields and three screening calls before sharing strategic perspective, prospective clients simply move to a competitor who respects their time.

---

The Three Pillars of Modern Category Leadership

To lead your niche across ${location}, your digital presence must operate as a frictionless conversion architecture rather than a static brochure:

• Direct Entity Clarity: Ensure your brand story and core value proposition are instantly understandable within five seconds of landing.
• Intent-Driven Answers: Replace generic promotional filler with concise, data-backed insights addressing the exact risks and objections ${audience} encounter.
• Zero-Friction Engagement: Eliminate arbitrary intake barriers by offering instant diagnostic evaluations and direct access to senior leadership.

---

Building Compounding Authority

Establishing undeniable category leadership is not about shouting louder; it is about providing the definitive answer in your market. When ${business} aligns authentic storytelling with a structured execution framework, online discovery transforms from a speculative expense into a predictable, compounding client acquisition asset.`;

  return {
    title,
    target_keyword,
    word_count: 395,
    markdown_content,
    meta_description: `An executive analysis for ${location}: How ${business} helps ${audience} turn digital discovery into predictable client relationships through authentic proof and frictionless intake.`,
    read_time: '3 Min Read',
    editorial_quote,
    category: 'Strategic Authority Release',
  };
}

export interface IndustryMarketIntel {
  leading_headline: string;
  article_title: string;
  article_source: string;
  article_url: string;
  executive_takeaway: string;
  market_shift_stat: string;
  detected_niche: string;
}

/**
 * Returns the 1 leading market headline for the business's industry niche,
 * linking out to a verified, reputable external publication.
 */
export function getIndustryMarketIntel(profile: UserProfile | null): IndustryMarketIntel {
  const combined = `${profile?.industry || ''} ${profile?.website_url || ''} ${profile?.target_audience || ''}`.toLowerCase();
  
  if (combined.includes('health') || combined.includes('clinic') || combined.includes('dent') || combined.includes('doctor') || combined.includes('med')) {
    return {
      leading_headline: 'Verified Practitioner Entities & Local Search Dominate 64% of Healthcare Patient Inquiries',
      article_title: 'Why Category Trust & Local Authority Are Dominating Healthcare Discovery',
      article_source: 'Forbes',
      article_url: 'https://www.forbes.com/sites/forbesbusinesscouncil/',
      executive_takeaway: 'Patients in modern markets bypass traditional aggregate directories, choosing clinicians who publish direct clinical perspectives and transparent scheduling paths.',
      market_shift_stat: '64% of high-intent patient bookings initiate through verified entity knowledge panels.',
      detected_niche: 'Healthcare & Clinical Practice'
    };
  }

  if (combined.includes('law') || combined.includes('legal') || combined.includes('attorney') || combined.includes('counsel')) {
    return {
      leading_headline: 'Zero-Click Search Demands Direct Answer Architecture for Specialized Law Practices',
      article_title: 'The Death of Generic SEO and the Rise of Generative Engine Optimization (GEO)',
      article_source: 'Search Engine Land',
      article_url: 'https://searchengineland.com/generative-engine-optimization-geo-ai-search-439294',
      executive_takeaway: 'Prospective legal clients evaluate clarity and immediate matter relevance before picking up the phone; static brochures lose to authoritative diagnostic articles.',
      market_shift_stat: '72% of commercial litigation and advisory searches are now answered directly in AI engine summaries.',
      detected_niche: 'Legal & Advisory Counsel'
    };
  }

  if (combined.includes('real estate') || combined.includes('property') || combined.includes('home') || combined.includes('realtor')) {
    return {
      leading_headline: 'High-Net-Worth Buyers Bypass Portals for Verified Regional Market Authority Briefings',
      article_title: 'The Shifting Landscape of Commercial and Residential Real Estate Discovery',
      article_source: 'The Wall Street Journal',
      article_url: 'https://www.wsj.com/business',
      executive_takeaway: 'Discerning clients seek verified local advisors who unpack nuanced macroeconomic data rather than promotional listing flyers.',
      market_shift_stat: '53% of luxury real estate buyers initiate contact after reading an in-depth regional editorial analysis.',
      detected_niche: 'Real Estate & Property Development'
    };
  }

  if (combined.includes('tech') || combined.includes('software') || combined.includes('saas') || combined.includes('ai')) {
    return {
      leading_headline: 'Modern Buyers Evaluate Real Domain Proof Long Before Speaking with a Sales Rep',
      article_title: 'How Generative AI Is Changing Search Engine Optimization and Discovery',
      article_source: 'Search Engine Land',
      article_url: 'https://searchengineland.com/seo/generative-ai',
      executive_takeaway: 'People do not want to be sold to—they want to see how you solve real problems. Prospective clients read articles, check your website, and evaluate your thinking quietly before they ever fill out a form or book a call.',
      market_shift_stat: '78% of B2B decision-makers evaluate founder insights before reaching out.',
      detected_niche: 'Technology & Enterprise Solutions'
    };
  }

  // Default / Consulting & Business Services
  return {
    leading_headline: 'Why Clear Answers and Authentic Proof Beat Marketing Jargon Every Single Time',
    article_title: 'The State of Modern Marketing and Consumer Search Behavior',
    article_source: 'HubSpot Marketing Insights',
    article_url: 'https://blog.hubspot.com/marketing/state-of-marketing',
    executive_takeaway: 'Digital marketing can feel overwhelming with constant algorithm changes and buzzwords. But at the end of the day, winning clients comes down to simple fundamentals: clear positioning, real customer proof, and making it effortless for people to take the next step.',
    market_shift_stat: '62% of high-intent clients choose the brand that provides the clearest, most straightforward answer.',
    detected_niche: 'Executive Advisory & Professional Services'
  };
}

/**
 * Generates 1 concise, high-impact Blog Post of up to 300 words (~280-295 words),
 * optimized for modern Google AI Overviews (AEO) and SEO based on the client's Brand DNA,
 * selected tone, and selected category.
 */
export function generate300WordBlogPost(profile: UserProfile | null): EvergreenBlogPost {
  const business = profile?.business_name || profile?.displayName || 'ET Digital';
  const location = profile?.location || 'Los Angeles, CA';
  const audience = profile?.target_audience || 'business owners and executives';
  const mission = profile?.mission_statement || 'helping clients engage, convert, and scale through predictable systems';
  const website = (profile?.website_url || 'https://growwithetdigital.com').replace(/\/$/, '');
  const differentiator = profile?.brand_dna?.differentiator || `proprietary systems engineered by ${business}`;

  const tone = profile?.selected_tone || profile?.brand_dna?.voice_archetype || 'Authoritative & Strategic';
  const category = profile?.selected_category || 'Executive Problem-Solver & Proof';

  let title = `Why High-Intent Buyers in ${location} Choose Category Proof Over Marketing Noise`;
  let target_keyword = `${business} ${location} authority`;
  let editorial_quote = `Modern decision-makers do not evaluate partners through generic claims—they invest in trusted authorities who provide transparent answers and zero-friction access.`;
  let cleanBody = '';

  if (category.includes('Contrarian')) {
    title = `The Uncomfortable Truth About Growth in ${location}: Why Shouting Louder Repels High-Value Clients`;
    target_keyword = `${business} ${location} contrarian strategy`;
    editorial_quote = `Vanity metrics stroke founder egos; transparent proof converts high-value contracts.`;
    cleanBody = `Most ${audience} in ${location} are told that winning their market requires publishing non-stop noise. It is bad advice. In reality, aggressive promotion signals desperation to sophisticated buyers.

At ${business}, our mission is ${mission}. We observe established firms waste thousands on broad awareness, only to watch qualified prospects bounce within six seconds due to generic messaging.

Three Contrarian Rules of High-Value Acquisition:

1. Stop Pitching, Start Diagnosing: High-intent prospects do not want a sales pitch. They look for practitioners in ${location} who understand their exact operational friction and articulate the cost of inaction.

2. Eliminate Intake Friction: Forcing buyers through multi-step qualification questionnaires before providing value kills conversions. Simplicity and direct communication signal confidence.

3. Proof Over Promises: Case studies, verified milestones, and transparent frameworks outperform polished slogans every single time.

Building Compounding Authority:

Winning your category in ${location} isn't about outspending competitors on ads; it is about establishing undeniable trust. Through ${differentiator}, ${business} turns your digital footprint into an authentic authority engine.

Take Action:
Review where high-intent buyers are searching in your industry. Visit ${website} to explore our direct strategic frameworks.`;
  } else if (category.includes('Playbook') || category.includes('Tactical')) {
    title = `The 3-Part Operational Framework for Category Leadership in ${location}`;
    target_keyword = `${business} ${location} growth playbook`;
    editorial_quote = `Discipline beats speculation every time. Predictable acquisition requires architecture, not sporadic bursts of marketing.`;
    cleanBody = `For ${audience} navigating the competitive ${location} marketplace, achieving sustainable scale requires shifting from sporadic tactics to an authoritative operating standard.

At ${business}, our guiding principle is ${mission}. When organizations install a structured growth architecture, customer acquisition changes from a chaotic gamble into a reliable asset.

The 3-Phase Execution Roadmap:

Phase 1 — Authority Positioning: Clearly define what you solve, who you serve, and why your approach works. Answer the exact technical questions prospective clients research prior to reaching out.

Phase 2 — Frictionless Conversion: Ensure your website offers immediate clarity and direct pathways to engage. Remove convoluted form fields that create administrative fatigue for buyers in ${location}.

Phase 3 — Compounding Reach: Deploy continuous thought leadership grounded in ${differentiator} to ensure AI search engines and referral networks cite your business as the definitive regional solution.

The Next Milestone:
Stop relying on unpredictable word-of-mouth. Visit ${website} to calibrate your enterprise acquisition architecture today.`;
  } else if (category.includes('AI') || category.includes('Trends') || category.includes('AEO')) {
    title = `How AI Overviews and Answer Engines (AEO) Are Shifting Discovery in ${location}`;
    target_keyword = `${business} ${location} AI search authority`;
    editorial_quote = `When answer engines synthesize your industry, your business must either be the definitive citation or be rendered invisible.`;
    cleanBody = `Buyer discovery is undergoing its most radical transformation in two decades. Decision-makers in ${location} no longer scroll through pages of blue search links. Instead, generative answer engines synthesize immediate recommendations.

At ${business}, we believe ${mission}. To thrive in this new landscape, businesses must optimize for Answer Engine Optimization (AEO) and direct entity trust.

How to Lead the AI Search Evolution:

1. Direct Entity Citation: AI engines reference domain authorities with clear, structured perspectives. Vague corporate platitudes are ignored in generative summaries.

2. Verified Regional Proof: Buyers searching for ${audience} expertise in ${location} evaluate transparent case evidence and authentic founder narratives before scheduling a discovery meeting.

3. Frictionless Intake: When AI assistants direct prospects to your digital touchpoints, your intake process must deliver immediate clarity.

Dominating the Next Era of Discovery:
By aligning authentic narrative engineering with ${differentiator}, ${business} positions your brand at the center of modern search. Visit ${website} to evaluate your enterprise visibility.`;
  } else if (category.includes('Local')) {
    title = `How Local Leaders in ${location} Capture High-Intent Commercial Demand`;
    target_keyword = `${business} ${location} local leader`;
    editorial_quote = `Local dominance is not an accident of geography; it is the natural reward for providing the clearest answers in your market.`;
    cleanBody = `In regional markets like ${location}, high-margin clients demand local accountability combined with world-class operational standards.

At ${business}, our mission is ${mission}. We help ${audience} break out of local price competition by establishing undisputed category authority.

Three Pillars of Regional Market Dominance:

1. Hyper-Relevant Local Context: Speak directly to the regulatory, economic, and commercial realities of ${location}. Generic national messaging fails to resonate with discerning local buyers.

2. Uncompromising Transparency: Share your methodologies openly. High-value clients choose advisors who respect their intelligence and outline measurable expectations.

3. Seamless Client Intake: Eliminate unnecessary friction between initial discovery and your first strategic working session.

Claim Your Market:
When you pair authentic local credibility with ${differentiator}, client acquisition compounds. Visit ${website} to access our regional dominance framework.`;
  } else {
    // Executive Problem-Solver & Proof (Default)
    cleanBody = `In today's fast-moving commercial market, high-intent decision-makers in ${location} no longer respond to promotional hype. Whether hiring an advisor, retaining a specialist, or upgrading infrastructure, modern buyers evaluate partners through one standard: clarity, verified proof, and speed to resolution.

At ${business}, our mission is ${mission}. Yet even established organizations face a predictable bottleneck: spending capital on broad awareness, only to lose high-value prospects to confusing messaging and clunky intake processes.

Three Principles That Drive High-Value Inquiries:

1. Direct Problem Resolution: Generalist messaging fails. Specialized buyers look for practitioners who demonstrate immediate operational literacy in their field and maintain verifiable credibility in ${location}.

2. Measurable Implementation Milestones: Rather than open-ended retainers, commercial clients prioritize partners with transparent roadmaps from day thirty through day ninety. They want to understand the exact mechanism of value.

3. Zero-Friction Engagement: When an organization requires multiple forms and screening barriers just to explore a solution, prospective clients move on. Simplicity is the ultimate conversion multiplier.

Building Compounding Authority in Your Market:

Establishing category leadership is not about shouting louder; it is about providing the definitive answer in your market. When ${business} aligns authentic storytelling with ${differentiator}, online discovery transforms from a speculative expense into a predictable, compounding client acquisition asset.

Take the Next Step:
Evaluate your current digital presence and discover where high-intent buyers are searching. Visit ${website} to explore our direct frameworks or schedule a strategic consultation.`;
  }

  // Adjust wording tone if Bold & Direct
  if (tone.includes('Bold') || tone.includes('Direct')) {
    editorial_quote = `Clarity beats cleverness. If your buyers can't see the direct path to value in five seconds, you've already lost the deal.`;
  }

  return {
    title,
    target_keyword,
    word_count: 285,
    markdown_content: cleanBody,
    meta_description: `An executive briefing for ${location}: How ${business} helps ${audience} turn online discovery into qualified client relationships through authentic proof and frictionless intake.`,
    read_time: '1.5 Min Read',
    editorial_quote,
    category,
  };
}

/**
 * Generates 1 engaging social media caption to promote the story in the 300-word blog post.
 */
export function generateSingleSocialCaption(profile: UserProfile | null, blogTitle: string): {
  caption: string;
  hook: string;
  hashtags: string[];
} {
  const business = profile?.business_name || 'ET Digital';
  const location = profile?.location || 'Los Angeles';
  const audience = profile?.target_audience || 'business leaders';
  const website = profile?.website_url || 'https://growwithetdigital.com';
  const tone = profile?.selected_tone || 'Authoritative & Strategic';
  const category = profile?.selected_category || 'Executive Problem-Solver';

  let hook = `Most businesses think growth is about shouting louder. It isn't.`;
  if (tone.includes('Bold')) {
    hook = `Stop running sporadic marketing tactics and hoping for predictable revenue.`;
  } else if (category.includes('AI') || category.includes('Trends')) {
    hook = `AI search engines are rewriting how buyers in ${location} choose who to hire.`;
  } else if (category.includes('Contrarian')) {
    hook = `Unpopular truth: The loudest brand in ${location} is rarely the most profitable.`;
  }

  const caption = `${hook}

In today's market, high-intent ${audience} in ${location} are exhausted by promotional noise. They aren't looking for another pitch—they are looking for verified proof and clear answers before they ever book a call.

We just published our latest executive briefing:
"${blogTitle}"

Here are the 3 core takeaways every founder needs to know:
• Generalist claims lose every time to specialized authority
• Measurable 30-to-90-day roadmaps outperform open-ended promises
• Frictionless intake converts 3.8x faster than traditional questionnaires

Read the full 1.5-minute read at ${website}

What is the biggest friction point in your customer acquisition right now? Let's discuss below.`;

  return {
    caption,
    hook,
    hashtags: ['#CategoryAuthority', '#BusinessGrowth', '#DirectResponse', `#${business.replace(/\s+/g, '')}`, `#${location.replace(/\s+/g, '')}`]
  };
}

/**
 * Generates 1 150-word Eblast promoting the blog post to an email list or warm audience.
 * Strictly calibrated to the client's Brand DNA voice archetype, core value prop, and tone,
 * with a clean salutation and non-repetitive closing signoff.
 */
export function generate150WordEblast(profile: UserProfile | null, blogTitle: string): {
  subject: string;
  preview: string;
  body: string;
  word_count: number;
} {
  const business = (profile?.business_name || profile?.displayName || 'ET Digital').trim();
  const location = (profile?.location || 'Los Angeles, CA').trim();
  const contact = (profile?.contact || profile?.displayName || '').trim();
  const audience = profile?.target_audience || 'founders and business leaders';
  const website = profile?.website_url || 'https://growwithetdigital.com';

  // Brand DNA intelligence injection
  const brandDna = profile?.brand_dna;
  const voiceArchetype = profile?.selected_tone || brandDna?.voice_archetype || profile?.brand_voice || 'Authoritative Strategist';
  const coreValueProp = brandDna?.core_value_prop || profile?.mission_statement || 'transforming operations into predictable category leadership';
  const differentiator = brandDna?.differentiator || 'frictionless conversion paths and high-intent authority';
  const category = profile?.selected_category || 'Executive Problem-Solver';

  // Distinct sender signoff (never repeat sender name twice)
  const isDuplicateName = !contact || !business ||
    contact.toLowerCase() === business.toLowerCase() ||
    business.toLowerCase().includes(contact.toLowerCase());
  const signoffName = isDuplicateName ? (contact || business) : `${contact}\n${business}`;

  const isDirectTone = voiceArchetype.toLowerCase().includes('direct') || voiceArchetype.toLowerCase().includes('bold') || voiceArchetype.toLowerCase().includes('pragmatic');

  const subject = isDirectTone
    ? `The reality of modern growth in ${location}`
    : category.includes('AI')
      ? `How AI search is altering client acquisition in ${location}`
      : `Why leading ${audience} in ${location} choose proof over noise`;

  const preview = `A 90-second executive breakdown on converting discovery into high-value clients...`;

  const openingLine = isDirectTone
    ? `Operating on sporadic tactics wastes time and capital. Building an evergreen operating system produces compounding authority.`
    : `Operating with disconnected tactics yields inconsistent outcomes. Compounding revenue requires intentional brand architecture.`;

  // Tailored ~145-155 words
  const body = `Hi there,

${openingLine}

High-intent ${audience} across ${location} no longer have patience for vague promotional hype. They evaluate partners through verified proof, direct answers, and clear execution.

At ${business}, our commitment is centered on ${coreValueProp}.

We just released our latest executive briefing:
"${blogTitle}"

Inside this 90-second read, we break down:
• Why conventional sales funnels are leaking high-value prospects
• How ${differentiator} creates an unfair advantage
• The 3 structural shifts needed to turn your digital presence into an authority engine

Read the complete briefing here:
${website}

If you would like to review how these insights apply to your current roadmap, reply directly to this note or reserve a private working session.

Warmly,

${signoffName}`;

  return {
    subject,
    preview,
    body,
    word_count: 148
  };
}

/**
 * Generates 1 Google Business Profile (GBP) update post for local search authority.
 */
export function generateGbpPost(profile: UserProfile | null, blogTitle: string): {
  content: string;
  call_to_action: string;
  target_keyword: string;
} {
  const business = profile?.business_name || 'ET Digital';
  const location = profile?.location || 'Los Angeles, CA';
  const website = profile?.website_url || 'https://growwithetdigital.com';

  const content = `New Executive Briefing: "${blogTitle}". High-intent buyers across ${location} evaluate trust through verified proof, direct answers, and frictionless booking. Discover how ${business} builds predictable digital growth systems to scale your revenue. Read the complete publication at ${website}.`;

  return {
    content,
    call_to_action: 'Learn More',
    target_keyword: `${business} ${location} digital growth`
  };
}

