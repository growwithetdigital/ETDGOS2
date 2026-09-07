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
    id: 'photo-coaching-dialogue',
    title: 'Executive Business Coaching & Storytelling',
    category: 'Leadership & Advisory',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1600&q=80',
    author: 'Christina @ wocintechchat',
    location: 'Los Angeles, CA'
  },
  {
    id: 'photo-strategic-planning',
    title: 'High-Velocity Growth Architecture Workshop',
    category: 'Strategic Planning',
    url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=80',
    author: 'Campaign Creators',
    location: 'Modern Studio'
  },
  {
    id: 'photo-inspirational-keynote',
    title: 'Inspiring Storytelling & Keynote Presentation',
    category: 'Keynote & Media',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80',
    author: 'Headway',
    location: 'Executive Summit'
  },
  {
    id: 'photo-collaborative-table',
    title: 'Collaborative Strategy & Client Conversion',
    category: 'Client Advisory',
    url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80',
    author: 'Austin Distel',
    location: 'Corporate Suite'
  },
  {
    id: 'photo-executive-portrait',
    title: 'Executive Leadership & Brand Authority',
    category: 'Founder Presence',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80',
    author: 'Hunters Race',
    location: 'Executive Office'
  },
  {
    id: 'photo-digital-whiteboard',
    title: 'High-Impact Brand Narrative & Frameworks',
    category: 'Systems & Frameworks',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80',
    author: 'Leon',
    location: 'Innovation Lab'
  },
  {
    id: 'photo-la-architecture',
    title: 'Metropolitan Commercial Growth & Entity Presence',
    category: 'Regional Authority',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    author: 'Nastuh Abootalebi',
    location: 'Financial District'
  },
  {
    id: 'photo-one-on-one-session',
    title: 'Personalized Strategic Mentorship Session',
    category: 'Consultation',
    url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80',
    author: 'Amy Hirschi',
    location: 'Consulting Suite'
  }
];

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
      email_body: `Hi there,

In today's fast-evolving market, high-intent buyers in ${location} don't have time to wade through generic marketing noise. They want definitive solutions from trusted authorities who understand their specific challenges.

At ${business}, our core mission is clear: "${mission}".

In our latest executive guide, we've broken down:
• Why competitors relying on sporadic tactics are losing ground
• The 3 differentiators that capture high-intent search queries from ${audience}
• The immediate 30-day priorities required to lead your category

Read the full blueprint online here: ${website}

Best regards,
${contact}
${business}`,
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
      email_body: `Hi there,

Most organizations spend thousands on marketing campaigns without addressing the core leak: converting discovery into predictable, qualified conversations.

At ${business}, our mission is "${mission}".

In our new release, we address the uncomfortable reality of modern search in ${location} and why leading brands are shifting toward structured, intent-driven storytelling.

Read the full perspective here: ${website}

To your compounding growth,
${contact}
${business}`,
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
