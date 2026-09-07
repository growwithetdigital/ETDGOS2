import { MarketingTip } from '../types';

export const WORKING_MARKETING_TIPS: MarketingTip[] = [
  {
    id: 'aeo-faq-citations',
    category: 'AEO & AI Search',
    title: 'How to Get Cited by ChatGPT & Google AI Overviews',
    tag: 'High-Impact Research',
    tactic: 'Semantic Question Anchoring & Direct 45-Word Answer Blocks',
    whyItWorks: 'BrightEdge and Seer Interactive research revealed that AI engines cite an average of only 3 to 4 domains per response, and 66% of citations go to pages with direct 40-50 word answer paragraphs directly following H2/H3 question headers.',
    stepByStep: [
      'Identify the top 5 questions high-intent buyers search before hiring your service.',
      'Format each as a clean H2 question (e.g. "How much does executive growth consulting cost in Los Angeles?").',
      'Provide an objective, non-salesy 40–50 word definitive answer in the very first sentence below the heading.',
      'Inject JSON-LD FAQPage schema so LLM search spiders index the parsed entity directly.'
    ],
    impactMetric: '+48% AI Citation Probability',
  },
  {
    id: 'b2b-carousel-framework',
    category: 'B2B & Inbound',
    title: 'The "Deconstructed Playbook" LinkedIn Carousel',
    tag: 'Tested Inbound System',
    tactic: 'Replace Long Text Statuses with 6-Slide Visual Diagnostic Teardowns',
    whyItWorks: 'LinkedIn algorithm updates heavily prioritize document dwell time and saves. Visual PDF carousels deconstructing a single client bottleneck generate 3.1x more inbound DMs than traditional promotional posts.',
    stepByStep: [
      'Slide 1 (Hook): "The exact 3-step growth architecture we used to double consultation bookings without ad spend."',
      'Slide 2 (The Problem): Contrast the broken conventional tactic against the modern system.',
      'Slide 3-4 (The System): Visual diagram or step-by-step framework.',
      'Slide 5 (The Proof): Real metric change (e.g., +38% conversion velocity).',
      'Slide 6 (Frictionless CTA): "Comment \'AUDIT\' or run our free diagnostic tool in the bio link."'
    ],
    impactMetric: '3.1x Higher Inbound DMs',
  },
  {
    id: 'local-proximity-anchors',
    category: 'Local Authority',
    title: 'Google Maps Local 3-Pack Expansion Technique',
    tag: 'Local SEO Strategy',
    tactic: 'Geo-Entity Landmark Case Studies on Landing Pages',
    whyItWorks: 'Google Maps local algorithm restricts visibility strictly by user proximity unless your landing pages feature verified entity co-occurrences connecting your core service to specific regional landmarks, cross-streets, and commercial hubs.',
    stepByStep: [
      'Dedicate landing page sections to specific client outcomes across your target radius (e.g., Agoura Hills, Calabasas, Westlake Village).',
      'Reference verifiable local business hubs, regional events, or verified client success stories.',
      'Embed your Google Maps place ID link with active review schema markup.',
      'Keep Google Business Profile product catalogs updated monthly with active pricing or service summaries.'
    ],
    impactMetric: '2.4x Geographic Radius Expansion',
  },
  {
    id: 'cro-diagnostic-grader',
    category: 'CRO & Conversion',
    title: 'Replace "Contact Us" with a 60-Second Grader',
    tag: 'Conversion Rate Optimization',
    tactic: 'Self-Service Value Exchange Over Boring Contact Forms',
    whyItWorks: 'Modern buyers resist commitment before receiving value. Research across 500+ service websites shows that interactive diagnostic graders convert 350% more cold traffic than standard 8-field contact forms because the user gets instant insights.',
    stepByStep: [
      'Lead with immediate insight: ask 3-4 strategic questions about their current bottlenecks.',
      'Provide an instant preliminary score or readiness tier (A, B, or C).',
      'Capture email on the results screen in exchange for their tailored quarterly roadmap.',
      'Automatically route qualified submissions into your calendar booking link.'
    ],
    impactMetric: 'From 1.8% to 6.4% Visitor Conversion',
  },
  {
    id: 'nine-word-revival-email',
    category: 'B2B & Inbound',
    title: 'The 9-Word Cold Pipeline Revival Cadence',
    tag: 'Immediate ROI Tactic',
    tactic: 'Zero-Pressure Plain Text Re-Engagement Email',
    whyItWorks: 'Elaborate newsletters get ignored by busy founders and CEOs. Plain-text, one-line questions mimic real personal correspondence, bypassing Gmail Promotions tabs and generating immediate honest replies.',
    stepByStep: [
      'Filter CRM for prospects who inquired 30-90 days ago but went dark.',
      'Subject line: "quick question about [Company Name]" (all lowercase).',
      'Body copy: "Hi [First Name], are you still looking to scale [primary business goal] this quarter? - Eric"',
      'Send at 8:15 AM Tuesday or Thursday for peak executive inbox attention.'
    ],
    impactMetric: '44% Qualified Reply Rate',
  },
  {
    id: 'short-form-video-hook',
    category: 'Short-Form Video',
    title: 'The 3-Second Negative Consequence Hook',
    tag: 'Viral Video Science',
    tactic: 'Agitate the Hidden Cost of Inaction in First 3 Seconds',
    whyItWorks: 'Platform algorithms on Instagram Reels, YouTube Shorts, and TikTok determine video reach based on completion rate and 3-second hold rate. Framing a common misconception halts thumb scrolling instantly.',
    stepByStep: [
      'Start mid-sentence with no intro: "If your marketing agency is still reporting on impressions, they are hiding this from you..."',
      'Deliver the unexpected truth by second 5: show the data (e.g. 58% organic click drop).',
      'Provide the 1 tactical adjustment they can make today.',
      'End with a clear loop back to your Growth OS framework.'
    ],
    impactMetric: '72% 3-Second Retention Rate',
  }
];
