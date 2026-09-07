export interface UserFormData {
  name: string;
  email: string;
  company?: string;
}

const COVER_IMAGE_URL = 'https://res.cloudinary.com/dnpvgq7gt/image/upload/v1783367304/ChatGPT_Image_final_Jul_6_2026_12_45_53_PM_eclb47.png';
export const GOOGLE_CALENDAR_AUDIT_URL = 'https://calendar.app.google/Eg21vAqWrJN1j358A';

async function getBase64ImageFromUrl(url: string): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }
}

export async function generatePlaybookPDF(userData: UserFormData): Promise<any> {
  const { jsPDF } = await import('jspdf');
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4', // 210mm x 297mm
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  const recipientName = userData.name.trim() || 'Valued Business Owner';
  const recipientCompany = userData.company?.trim() || 'Your Business';
  const currentDateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Pre-fetch cover image
  const coverBase64 = await getBase64ImageFromUrl(COVER_IMAGE_URL);

  // Helper function for adding standard header and footer
  const addHeaderFooter = (pageNum: number, totalPages: number) => {
    doc.saveGraphicsState();
    
    // Top header
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(0, 0, pageWidth, 14, 'F');
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.3);
    doc.line(0, 14, pageWidth, 14);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text('ET DIGITAL', margin, 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text('|   THE DIGITAL GROWTH PLAYBOOK', margin + 22, 9);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(8, 145, 178); // cyan-600
    doc.text('FREE EXECUTIVE GUIDE', pageWidth - margin - 32, 9);

    // Bottom footer
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('ET Digital • Executive Growth Guide & Playbook', margin, pageHeight - 8);

    doc.setFont('helvetica', 'bold');
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin - 18, pageHeight - 8);

    doc.restoreGraphicsState();
  };

  // Helper for Section Titles
  const addStrategyHeader = (num: string, title: string, category: string) => {
    // Strategy Tag
    doc.setFillColor(236, 254, 255); // cyan-50
    doc.setDrawColor(207, 250, 254); // cyan-100
    doc.roundedRect(margin, 22, 52, 7, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(8, 145, 178); // cyan-600
    doc.text(`STRATEGY ${num} OF 10`, margin + 4, 26.5);

    // Category
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(category.toUpperCase(), margin + 60, 26.5);

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42); // slate-900
    const splitTitle = doc.splitTextToSize(title, contentWidth);
    doc.text(splitTitle, margin, 38);

    const titleHeight = splitTitle.length * 7;
    
    // Thin accent line under title
    doc.setDrawColor(8, 145, 178);
    doc.setLineWidth(0.8);
    doc.line(margin, 38 + titleHeight - 2, margin + 25, 38 + titleHeight - 2);

    return 38 + titleHeight + 4;
  };

  // Helper for Pro Tip Box
  const addProTipBox = (startY: number, title: string, text: string) => {
    doc.saveGraphicsState();
    const boxHeight = 32;
    doc.setFillColor(241, 245, 249); // slate-100
    doc.setDrawColor(8, 145, 178); // cyan border accent on left
    doc.roundedRect(margin, startY, contentWidth, boxHeight, 2, 2, 'F');
    
    // Left border highlight
    doc.setFillColor(8, 145, 178);
    doc.rect(margin, startY, 2.5, boxHeight, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`PRO TIP / REAL-WORLD INSIGHT: ${title.toUpperCase()}`, margin + 8, startY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const splitText = doc.splitTextToSize(text, contentWidth - 14);
    doc.text(splitText, margin + 8, startY + 15);

    doc.restoreGraphicsState();
    return startY + boxHeight + 8;
  };

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  // Dark luxury theme cover
  doc.setFillColor(15, 23, 42); // slate-900 background
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative cyan glow line
  doc.setFillColor(8, 145, 178);
  doc.rect(0, 0, pageWidth, 4, 'F');

  // Top Brand Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('ET DIGITAL', margin, 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('GROWTH & AI SEARCH ENGINEERING', margin + 35, 24);

  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.4);
  doc.line(margin, 30, pageWidth - margin, 30);

  // Main Cover Subhead Badge
  doc.setFillColor(22, 78, 99); // cyan-900/50
  doc.setDrawColor(8, 145, 178);
  doc.roundedRect(margin, 40, 68, 8, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(6, 182, 212); // brand cyan
  doc.text('FREE EXECUTIVE GUIDE & PLAYBOOK', margin + 4, 45);

  // Main Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text('The Digital Growth', margin, 60);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(6, 182, 212); // brand cyan highlight
  doc.text('Playbook', margin + 88, 60);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(226, 232, 240);
  const coverSub = doc.splitTextToSize('10 Practical Strategies to Help Your Business Grow with Confidence', contentWidth);
  doc.text(coverSub, margin, 70);

  // Ebook Cover Image Display on Cover Page
  const coverImgY = 78;
  const coverImgWidth = 112;
  const coverImgHeight = 152;
  const coverImgX = (pageWidth - coverImgWidth) / 2;

  if (coverBase64) {
    try {
      // Glow card backdrop container behind image
      doc.setFillColor(30, 41, 59); // slate-800
      doc.setDrawColor(8, 145, 178); // cyan border frame
      doc.setLineWidth(0.6);
      doc.roundedRect(coverImgX - 4, coverImgY - 2, coverImgWidth + 8, coverImgHeight + 4, 4, 4, 'FD');

      // Draw exact Ebook Cover graphic
      doc.addImage(coverBase64, 'PNG', coverImgX, coverImgY, coverImgWidth, coverImgHeight);
    } catch (e) {
      console.warn('Cover image render note:', e);
      doc.setFillColor(30, 41, 59);
      doc.roundedRect(coverImgX, coverImgY, coverImgWidth, coverImgHeight, 4, 4, 'F');
    }
  } else {
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(coverImgX, coverImgY, coverImgWidth, coverImgHeight, 4, 4, 'F');
  }

  // Bottom Cover Agency Footer
  const coverFooterY = 246;
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.4);
  doc.line(margin, coverFooterY, pageWidth - margin, coverFooterY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('ET DIGITAL', margin, coverFooterY + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Growth Architecture, Local SEO & AI Search Engineering  |  growwithetdigital.com', margin, coverFooterY + 16);
  doc.text(`Official Executive Strategy Guide  |  2026 Edition`, margin, coverFooterY + 22);

  // Hyperlink growwithetdigital.com on cover
  doc.link(margin + 90, coverFooterY + 12, 45, 6, { url: 'https://growwithetdigital.com' });


  // ==========================================
  // PAGE 2: TABLE OF CONTENTS & EXECUTIVE INTRO
  // ==========================================
  doc.addPage();
  addHeaderFooter(2, 13);

  let currentY = 24;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text('Welcome to Your Digital Growth Playbook', margin, currentY);

  currentY += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const welcomeText = "In today's fast-changing digital landscape, business owners don't need more complex jargon or unproven tactics—they need clear, practical strategies that deliver predictable growth. This playbook outlines 10 fundamental growth frameworks honed through real-world client engagements. Implement these strategies sequentially or focus on the highest-leverage areas for your business today.";
  const splitWelcome = doc.splitTextToSize(welcomeText, contentWidth);
  doc.text(splitWelcome, margin, currentY);

  currentY += splitWelcome.length * 4.5 + 8;

  // TOC Header Box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, currentY, contentWidth, 10, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('TABLE OF CONTENTS', margin + 6, currentY + 7);

  currentY += 16;

  const tocItems = [
    { num: '01', title: 'Entity-Based Local & AI Search Optimization (GEO)', page: '3' },
    { num: '02', title: 'High-Intent Keyword Mapping & Topic Clusters', page: '4' },
    { num: '03', title: 'Post-Purchase Review & Reputation Automation', page: '5' },
    { num: '04', title: 'Frictionless 1-Click Conversion Funnels', page: '6' },
    { num: '05', title: 'Editorial PR & Brand Narrative Storytelling', page: '7' },
    { num: '06', title: 'Conversion Rate Optimization (CRO) & Micro-Interactions', page: '8' },
    { num: '07', title: 'Automated Nurture & Retention Email Loops', page: '9' },
    { num: '08', title: 'Paid Search & High-ROI Intent Targeting', page: '10' },
    { num: '09', title: 'First-Party Data & Private Customer Communities', page: '11' },
    { num: '10', title: 'Continuous AI Analytics & Growth Dashboards', page: '12' },
    { num: '11', title: 'Executive Action Plan & Free Growth Audit', page: '13' },
  ];

  tocItems.forEach((item, idx) => {
    // Row background zebra striping
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, currentY - 3.5, contentWidth, 8.5, 'F');
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(8, 145, 178);
    doc.text(`Strategy ${item.num}`, margin + 4, currentY + 2);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(item.title, margin + 28, currentY + 2);

    // Dotted line
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225);
    doc.text('. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .', margin + 115, currentY + 2);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`Page ${item.page}`, pageWidth - margin - 15, currentY + 2);

    currentY += 9;
  });

  // Callout Box at bottom of TOC
  currentY += 6;
  doc.setFillColor(236, 254, 255);
  doc.setDrawColor(165, 243, 252);
  doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(8, 145, 178);
  doc.text('HOW TO USE THIS PLAYBOOK', margin + 6, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('Each strategy is self-contained with actionable steps and key performance metrics. We recommend starting with Strategy 01 (Local & AI Search) to lay a dominant discoverability foundation before scaling paid traffic.', margin + 6, currentY + 14);


  // ==========================================
  // STRATEGY PAGES 3 TO 12
  // ==========================================

  const strategiesData = [
    {
      num: '01',
      title: 'Entity-Based Local & AI Search Optimization (GEO)',
      category: 'Organic Visibility & Generative AI',
      page: 3,
      objective: 'Capture high-intent prospective clients searching on AI engines like Perplexity, ChatGPT, and Gemini as well as Google Maps.',
      whyItMatters: 'Over 40% of high-value consumers now use AI chat assistants to evaluate local professionals and service providers before making contact. Standard keyword SEO is no longer sufficient without structured entity schema.',
      actionSteps: [
        'Implement JSON-LD Schema markup defining your business entity, services, geographic coordinates, and credentials.',
        'Optimize Google Business Profile with categorized service listings, frequent geotagged posts, and structured Q&A.',
        'Build empathy-driven specialty sub-pages structured to answer specific voice queries and conversational AI prompts.',
        'Establish consistent NAP (Name, Address, Phone) citations across premier authoritative local directories.'
      ],
      kpis: ['AI Engine Search Mentions', 'Google Maps Direct Inquiries', 'Organic Consultation Requests'],
      tipTitle: 'Private Practice Client Case',
      tipText: 'A licensed therapist optimized specialty pages for "imposter syndrome specialist". This entity-first optimization converted a new high-intent private-pay client directly via a Perplexity AI search within 30 days.'
    },
    {
      num: '02',
      title: 'High-Intent Keyword Mapping & Topic Clusters',
      category: 'Content Strategy & Conversion',
      page: 4,
      objective: 'Structure website content around bottom-of-funnel commercial keywords that map directly to purchasing decisions.',
      whyItMatters: 'Informational blog traffic rarely converts into revenue unless mapped to high-intent commercial offerings. Topic clusters establish topical authority in search algorithms.',
      actionSteps: [
        'Identify high-conversion commercial keywords (e.g., "best commercial real estate advisor in [City]").',
        'Create a core Pillar Page for each main offering surrounded by supporting sub-topic articles.',
        'Interlink sub-topic pages back to the primary conversion page using exact-match descriptive anchor text.',
        'Eliminate thin content and consolidate redundant pages to maximize crawl efficiency and topical depth.'
      ],
      kpis: ['Commercial Keyword Rank Position', 'Topic Cluster Organic Impressions', 'Page-Level Conversion Rate'],
      tipTitle: 'Topic Cluster Synergy',
      tipText: 'Focus on depth over volume. Five deeply researched articles interlinked to a core service page will outperform fifty superficial 500-word blog posts every time.'
    },
    {
      num: '03',
      title: 'Post-Purchase Review & Reputation Automation',
      category: 'Reputation & Local CRM',
      page: 5,
      objective: 'Automatically convert satisfied customers into authentic 5-star public reviews that serve as a 24/7 lead magnet.',
      whyItMatters: '88% of buyers trust online reviews as much as personal recommendations. Automated review collection ensures your business continuously builds public social proof on autopilot.',
      actionSteps: [
        'Trigger automated SMS and email review invitations within 2 hours of a completed purchase or consultation.',
        'Provide a direct, frictionless link to your Google Business Profile review dialog to minimize drop-off.',
        'Respond to all reviews—both positive and negative—within 24 hours with keyword-rich brand responses.',
        'Embed verified customer review widgets onto primary high-traffic landing pages.'
      ],
      kpis: ['Monthly New 5-Star Reviews', 'Review Conversion Rate (%)', 'Local Map Pack Ranking Position'],
      tipTitle: 'Furniture Gallery Success',
      tipText: 'An Ethan Allen style furniture showroom automated post-purchase SMS review prompts after design consultations, driving 50% YoY revenue growth and earning top local reputation honors.'
    },
    {
      num: '04',
      title: 'Frictionless 1-Click Conversion Funnels',
      category: 'User Experience & Intake Automation',
      page: 6,
      objective: 'Remove all unnecessary steps between initial site visit and scheduled consultation or purchase.',
      whyItMatters: 'Every additional form field reduces conversion rates by up to 11%. Simplifying intake workflows dramatically lowers cost-per-acquisition (CPA).',
      actionSteps: [
        'Embed an instant 1-click consultation scheduler directly on the main homepage above the fold.',
        'Limit initial inquiry forms to 3 essential fields: Name, Contact Info, and Primary Goal.',
        'Implement instant auto-responder emails and SMS confirmations to confirm bookings immediately.',
        'Ensure mobile responsiveness so booking on a smartphone takes under 20 seconds.'
      ],
      kpis: ['Form Completion Rate (%)', 'Time-to-First-Contact', 'Cost Per Acquired Lead (CPL)'],
      tipTitle: 'Speed-to-Lead Factor',
      tipText: 'Leads contacted within 5 minutes of form submission are 21 times more likely to convert into paying clients than those contacted after 30 minutes.'
    },
    {
      num: '05',
      title: 'Editorial PR & Brand Narrative Storytelling',
      category: 'Public Relations & Authority',
      page: 7,
      objective: 'Secure press features in authoritative media outlets to elevate brand trust and acquire top-tier backlinks.',
      whyItMatters: 'Press coverage in recognized publications builds unmatched category authority and provides powerful referral traffic that bypasses standard ad fatigue.',
      actionSteps: [
        'Develop a compelling, news-worthy story angle highlighting unique craftsmanship, heritage, or industry innovation.',
        'Target senior editors and journalists with personalized press releases and exclusive pitch hooks.',
        'Create dedicated press press-kit landing pages featuring virtual tours, high-resolution media, and founder quotes.',
        'Amplify earned media mentions across social channels, email newsletters, and website trust banners.'
      ],
      kpis: ['Earned Media Features', 'Domain Authority (DA) Increase', 'Referral Press Traffic Volume'],
      tipTitle: 'Significant Real Estate Case',
      tipText: 'Secured an exclusive feature in The Hollywood Reporter for the historic 1930s Decker Canyon cottage of "Malibu Millie" Decker, driving a +500% surge in web traffic and qualified buyer inquiries.'
    },
    {
      num: '06',
      title: 'Conversion Rate Optimization (CRO) & Micro-Interactions',
      category: 'UX Engineering & Design',
      page: 8,
      objective: 'Maximize the percentage of existing website visitors who take a high-value conversion action.',
      whyItMatters: 'Doubling your conversion rate cuts your customer acquisition cost in half without spending an additional dollar on ad traffic.',
      actionSteps: [
        'Eliminate visual clutter, distracting sidebars, and competing call-to-action buttons.',
        'Use high-contrast callout buttons with clear value-driven copy (e.g., "Claim Free Audit" vs "Submit").',
        'Incorporate subtle motion micro-interactions to guide user attention toward primary conversion elements.',
        'Conduct monthly A/B testing on hero headlines, form placements, and social proof badges.'
      ],
      kpis: ['Overall Conversion Rate', 'Bounce Rate (%)', 'Average Session Duration'],
      tipTitle: 'Micro-Copy Optimization',
      tipText: 'Changing button text from "Submit Inquiry" to "Get My Custom Growth Plan" increased client conversion rates by 34% across B2B service websites.'
    },
    {
      num: '07',
      title: 'Automated Nurture & Retention Email Loops',
      category: 'Lifecycle Marketing & Email CRM',
      page: 9,
      objective: 'Maintain warm engagement with prospective clients who are not yet ready to buy immediately.',
      whyItMatters: '50% of qualified leads are not ready to purchase on their first visit. Automated email series nurture leads over 30 to 90 days until decision readiness.',
      actionSteps: [
        'Build a 5-part automated welcome email sequence delivering immediate value and client success stories.',
        'Segment email subscriber lists by interest category, company size, or service inquiry.',
        'Send weekly or bi-weekly educational newsletters containing actionable frameworks rather than hard sales pitches.',
        'Set up automated re-engagement triggers for subscribers who haven\'t opened emails in 60 days.'
      ],
      kpis: ['Email Open Rate (%)', 'Click-Through Rate (CTR)', 'Nurtured Pipeline Revenue'],
      tipTitle: 'Value-First Rule',
      tipText: 'Provide 80% education and case study insights, and 20% direct promotion. Educational newsletters achieve 2.5x higher open rates than purely promotional blasts.'
    },
    {
      num: '08',
      title: 'Paid Search & High-ROI Intent Targeting',
      category: 'Performance Advertising',
      page: 10,
      objective: 'Capture immediate commercial demand by appearing at the top of search results for high-intent keywords.',
      whyItMatters: 'Paid search allows precise control over client acquisition volume and provides instant traffic while organic SEO authority builds.',
      actionSteps: [
        'Bid exclusively on exact-match and phrase-match keywords with proven commercial intent.',
        'Maintain a robust negative keyword list to eliminate wasted ad spend on irrelevant search terms.',
        'Build dedicated landing pages tailored specifically to match the ad copy and headline.',
        'Implement conversion tracking for both online form fills and phone calls.'
      ],
      kpis: ['Return on Ad Spend (ROAS)', 'Cost Per Lead (CPL)', 'Ad Quality Score'],
      tipTitle: 'Negative Keyword Hygiene',
      tipText: 'Regularly auditing search query reports to add negative keywords (e.g., "free", "jobs", "templates") typically reduces ad spend waste by 15-25% in the first month.'
    },
    {
      num: '09',
      title: 'First-Party Data & Private Customer Communities',
      category: 'Audience Ownership & Retention',
      page: 11,
      objective: 'Build an owned database of prospective clients to insulate your business against ad platform changes.',
      whyItMatters: 'Algorithm updates and rising ad costs make relying solely on social media followers risky. Owned email and phone lists represent permanent business enterprise value.',
      actionSteps: [
        'Offer high-value lead magnets (whitepapers, templates, calculators) to capture contact details.',
        'Maintain strict data privacy and consent standards to build long-term subscriber trust.',
        'Create exclusive VIP email lists or private community groups for top clients and prospects.',
        'Regularly clean and enrich customer profiles with preference data and interaction history.'
      ],
      kpis: ['Owned List Growth Rate', 'Subscriber Lifetime Value (LTV)', 'Direct Channel Revenue Share'],
      tipTitle: 'Asset Multiplication',
      tipText: 'A direct email list of 5,000 engaged industry contacts often yields more high-ticket sales than a passive social media following of 50,000.'
    },
    {
      num: '10',
      title: 'Continuous AI Analytics & Growth Dashboards',
      category: 'Data Engineering & Performance attribution',
      page: 12,
      objective: 'Establish real-time data visibility across all marketing channels to allocate capital with certainty.',
      whyItMatters: 'Without accurate multi-touch attribution, businesses risk overspending on ineffective marketing channels while underfunding high-converting sources.',
      actionSteps: [
        'Unify Google Analytics 4, CRM data, and call tracking into a centralized performance dashboard.',
        'Track lead source attribution from first touch to closed contract or sale.',
        'Set up automated weekly alert reports highlighting sudden metric changes or conversion drops.',
        'Conduct monthly strategy reviews to reallocate budget toward top-performing channels.'
      ],
      kpis: ['Customer Acquisition Cost (CAC)', 'Customer Lifetime Value (LTV)', 'Channel Attribution Accuracy'],
      tipTitle: 'Data-Driven Focus',
      tipText: 'Focus on 3-5 core metrics that directly influence revenue rather than tracking dozens of vanity metrics like page views or social likes.'
    }
  ];

  strategiesData.forEach((strat) => {
    doc.addPage();
    addHeaderFooter(strat.page, 13);

    let startY = addStrategyHeader(strat.num, strat.title, strat.category);

    // Objective Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, startY, contentWidth, 16, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(8, 145, 178);
    doc.text('CORE OBJECTIVE:', margin + 6, startY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    const splitObj = doc.splitTextToSize(strat.objective, contentWidth - 38);
    doc.text(splitObj, margin + 35, startY + 6);

    startY += 22;

    // Strategic Context
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('Why This Strategy Matters Today', margin, startY);

    startY += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const splitContext = doc.splitTextToSize(strat.whyItMatters, contentWidth);
    doc.text(splitContext, margin, startY);

    startY += splitContext.length * 4.5 + 8;

    // Action Plan Box
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('Step-by-Step Action Plan', margin, startY);

    startY += 6;

    strat.actionSteps.forEach((step, idx) => {
      doc.setFillColor(8, 145, 178);
      doc.circle(margin + 3, startY - 1.5, 1.2, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`Step ${idx + 1}:`, margin + 7, startY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      const splitStep = doc.splitTextToSize(step, contentWidth - 22);
      doc.text(splitStep, margin + 20, startY);

      startY += splitStep.length * 4.5 + 3;
    });

    startY += 4;

    // KPIs Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('Key Performance Metrics (KPIs) to Track:', margin, startY);

    startY += 6;

    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, startY, contentWidth, 11, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(8, 145, 178);
    doc.text('MEASURE SUCCESS:', margin + 6, startY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(strat.kpis.join('   •   '), margin + 38, startY + 7);

    startY += 17;

    // Add Pro Tip Box
    addProTipBox(startY, strat.tipTitle, strat.tipText);
  });


  // ==========================================
  // PAGE 13: CONCLUSION & FREE AUDIT CALLOUT
  // ==========================================
  doc.addPage();
  addHeaderFooter(13, 13);

  let page13Y = 24;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text('Executing Your Digital Growth Roadmap', margin, page13Y);

  page13Y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const concText = `Congratulations on reviewing **The Digital Growth Playbook**! Growth is not the result of a single silver bullet—it comes from the disciplined, consistent execution of integrated marketing systems. By aligning local AI search visibility, frictionless conversion funnels, automated reviews, and strategic PR, your business can build an unbeatable digital footprint.`;
  const splitConc = doc.splitTextToSize(concText, contentWidth);
  doc.text(splitConc, margin, page13Y);

  page13Y += splitConc.length * 4.5 + 10;

  // Executive Callout Card (Hero Offer for Free Audit)
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, page13Y, contentWidth, 92, 4, 4, 'F');

  // Accent Top Bar
  doc.setFillColor(8, 145, 178);
  doc.rect(margin, page13Y, contentWidth, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(6, 182, 212);
  doc.text('EXCLUSIVE NEXT STEP FOR PLAYBOOK READERS', margin + 12, page13Y + 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('Claim Your Free 1-on-1 AI Growth Audit', margin + 12, page13Y + 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  const auditDesc = `Ready to evaluate how your business currently ranks in AI search engines, local Google map packs, and conversion performance? Our engineering team will prepare a custom 15-point diagnostic report analyzing your digital footprint.`;
  const splitAudit = doc.splitTextToSize(auditDesc, contentWidth - 24);
  doc.text(splitAudit, margin + 12, page13Y + 33);

  // Bullet highlights
  const auditBullets = [
    'Complete AI Search Discoverability Analysis (Perplexity, ChatGPT, Gemini)',
    'Local Google Map Pack & Schema Technical Audit',
    'Friction & Conversion Rate Optimization Opportunities',
    '3 Custom Growth Action Items for Your Specific Business'
  ];

  let bulletY = page13Y + 52;
  auditBullets.forEach((bullet) => {
    doc.setFillColor(6, 182, 212);
    doc.circle(margin + 15, bulletY - 1, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(bullet, margin + 19, bulletY);
    bulletY += 5.5;
  });

  // Call to action button box with clean width and perfectly centered text
  const ctaBtnWidth = 85;
  const ctaBtnHeight = 11;
  const ctaBtnX = margin + (contentWidth - ctaBtnWidth) / 2;
  const ctaBtnY = page13Y + 75;

  doc.setFillColor(8, 145, 178); // brand cyan button
  doc.roundedRect(ctaBtnX, ctaBtnY, ctaBtnWidth, ctaBtnHeight, 2.5, 2.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('WORK WITH US', pageWidth / 2, ctaBtnY + 7.2, { align: 'center' });

  // Hyperlink directly to Google Calendar Appointment Schedule
  doc.link(ctaBtnX, ctaBtnY, ctaBtnWidth, ctaBtnHeight, { url: GOOGLE_CALENDAR_AUDIT_URL });

  page13Y += 104;

  // Contact & Author Footer Block
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, page13Y, pageWidth - margin, page13Y);

  page13Y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('ET Digital', margin, page13Y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Growth Architecture, Local SEO & AI Search Engineering', margin, page13Y + 5);
  doc.text('Web: https://growwithetdigital.com   |   Email: hello@growwithetdigital.com', margin, page13Y + 10);

  // Hyperlink growwithetdigital.com on page 13 footer
  doc.link(margin, page13Y + 7, 45, 5, { url: 'https://growwithetdigital.com' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.text('© 2026 ET Digital. All rights reserved.', pageWidth - margin - 45, page13Y + 10);

  return doc;
}
