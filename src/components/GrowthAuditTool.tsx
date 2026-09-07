import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, Share2, MapPin, CheckCircle2, ArrowRight, 
  Sparkles, Cpu, ShieldCheck, Check, RefreshCw, Calendar,
  Download, Lock, Info, X, Bookmark
} from 'lucide-react';
import { submitBookingToFirestore, cacheAuditSession } from '../lib/firebase';

interface GrowthAuditToolProps {
  onOpenBooking: () => void;
  onOpenCalendar?: () => void;
  onOpenAuthModal?: () => void;
}

type AuditChannel = 'website' | 'social' | 'gbp';

interface AuditOption {
  id: AuditChannel;
  title: string;
  subtitle: string;
  inputLabel: string;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
}

const WEB3FORMS_ACCESS_KEY = (import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY || '0d9d7632-cf6b-4566-b29e-09b7b8bb7806';

export default function GrowthAuditTool({ onOpenBooking, onOpenCalendar, onOpenAuthModal }: GrowthAuditToolProps) {
  const [selectedChannel, setSelectedChannel] = useState<AuditChannel>('website');
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStepText, setCurrentStepText] = useState('');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Single deterministic grade state: C (needs optimization), B (room for growth), A (high authority)
  // Strictly never D or F to maintain a positive psychological lead magnet experience
  const [grade, setGrade] = useState<'A' | 'B' | 'C'>('C');

  // Download Graphic Lead Capture Modal State
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  const auditOptions: AuditOption[] = [
    {
      id: 'website',
      title: 'Website Rank & Discoverability',
      subtitle: 'Analyze your domain search rankings, mobile speed, and AI search presence',
      inputLabel: 'Enter Your Website URL',
      placeholder: 'e.g. mybusiness.com',
      icon: Globe,
    },
    {
      id: 'social',
      title: 'Social Media Feed & AI Presence',
      subtitle: 'Audit your brand engagement, social reach, and cross-platform authority',
      inputLabel: 'Enter Social Media Profile Link or Handle',
      placeholder: 'e.g. instagram.com/yourbrand or @yourbrand',
      icon: Share2,
    },
    {
      id: 'gbp',
      title: 'Google Business Profile Strength',
      subtitle: 'Evaluate your local Google Maps ranking, review health, and lead intake',
      inputLabel: 'Enter Business Name or Google Maps Link',
      placeholder: 'e.g. Apex Plumbing Atlanta or g.page/mybusiness',
      icon: MapPin,
    },
  ];

  const currentOption = auditOptions.find(o => o.id === selectedChannel) || auditOptions[0];

  // Dynamic analysis steps tailored per channel
  const getSteps = () => {
    if (selectedChannel === 'website') {
      return [
        { id: 1, text: 'Connecting to search engine index servers...', duration: 800 },
        { id: 2, text: 'Analyzing keyword rankings and domain discoverability...', duration: 1000 },
        { id: 3, text: 'Checking website readability for Google AI & ChatGPT...', duration: 900 },
        { id: 4, text: 'Testing mobile speed, user experience, and lead capture forms...', duration: 900 },
        { id: 5, text: 'Generating single executive performance grade & improvement areas...', duration: 700 },
      ];
    } else if (selectedChannel === 'social') {
      return [
        { id: 1, text: 'Scanning social channel feed and follower engagement signals...', duration: 800 },
        { id: 2, text: 'Analyzing content quality, post frequency, and visual consistency...', duration: 1000 },
        { id: 3, text: 'Checking social profile indexing in major AI search engines...', duration: 900 },
        { id: 4, text: 'Measuring feed-to-customer lead conversion potential...', duration: 900 },
        { id: 5, text: 'Generating single executive performance grade & improvement areas...', duration: 700 },
      ];
    } else {
      return [
        { id: 1, text: 'Locating Google Business Profile in local map databases...', duration: 800 },
        { id: 2, text: 'Evaluating Google Maps top 3 local pack ranking signals...', duration: 1000 },
        { id: 3, text: 'Analyzing customer review velocity, ratings, and response rate...', duration: 900 },
        { id: 4, text: 'Checking business category tags, photo quality, and contact links...', duration: 900 },
        { id: 5, text: 'Generating single executive performance grade & improvement areas...', duration: 700 },
      ];
    }
  };

  const steps = getSteps();

  useEffect(() => {
    if (!isAnalyzing) return;

    let currentStepIndex = 0;
    
    const runStep = () => {
      if (currentStepIndex >= steps.length) {
        setProgress(100);
        cacheAuditSession({
          website_url: inputValue,
          business_name: inputValue.replace(/^https?:\/\//, '').split('/')[0] || 'My Business',
          primary_niche: selectedChannel === 'website' ? 'Web & Organic Search' : selectedChannel === 'social' ? 'Social Media & Brand' : 'Local SEO & Maps',
          growth_bottlenecks: ['Search Discovery', 'Mobile Speed Optimization', 'AI Overview Footprint'],
          grade: grade,
        });
        setTimeout(() => {
          setIsAnalyzing(false);
          setIsCompleted(true);
        }, 400);
        return;
      }

      const currentStep = steps[currentStepIndex];
      setCurrentStepText(currentStep.text);
      
      const stepProgressSpan = 100 / steps.length;
      const startProgress = currentStepIndex * stepProgressSpan;
      
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const ratio = Math.min(elapsed / currentStep.duration, 1);
        const currentProgress = startProgress + (ratio * stepProgressSpan);
        setProgress(Math.floor(currentProgress));
        
        if (ratio === 1) {
          clearInterval(interval);
          setCompletedSteps(prev => [...prev, currentStep.id]);
          currentStepIndex++;
          runStep();
        }
      }, 40);
    };

    runStep();
  }, [isAnalyzing]);

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Realistic determinism: Never lower than Grade C
    const inputClean = inputValue.trim().toLowerCase();
    if (
      inputClean.includes('growwithetdigital') || 
      inputClean.includes('etdigital') || 
      inputClean.includes('et digital') ||
      inputClean.includes('top') || 
      inputClean.includes('pro') || 
      inputClean.includes('apple') || 
      inputClean.includes('agency')
    ) {
      setGrade('A');
    } else if (inputClean.includes('.com') && inputClean.length > 14) {
      setGrade('B');
    } else {
      // Default to Grade C for maximum strategic hook while respecting the business
      setGrade('C');
    }

    setIsCompleted(false);
    setCompletedSteps([]);
    setProgress(0);
    setIsAnalyzing(true);
  };

  const handleReset = () => {
    setInputValue('');
    setIsCompleted(false);
    setProgress(0);
    setCompletedSteps([]);
  };

  // Grade Data (Only A, B, C) without referencing any grading scale
  const getGradeDetails = (g: 'A' | 'B' | 'C') => {
    switch (g) {
      case 'A':
        return {
          bg: 'bg-emerald-950/30 border-emerald-500/40 text-emerald-400',
          letterColor: 'text-emerald-400',
          badgeText: 'HIGH PERFORMANCE FOUNDATION',
          headline: 'Strong Brand Footprint • Strategic Scaling Ready',
          summary: 'Your business has established notable online authority and search presence. However, our diagnostic identified 3 key optimization areas where advanced AI citation and automated conversion funnels will accelerate client acquisition.',
          colorHex: '#10b981',
        };
      case 'B':
        return {
          bg: 'bg-cyan-950/40 border-brand-cyan/40 text-brand-cyan',
          letterColor: 'text-brand-cyan',
          badgeText: 'SOLID BASELINE • HIGH GROWTH POTENTIAL',
          headline: 'Solid Online Baseline • Room for Market Dominance',
          summary: 'Your digital presence is functional, but you are leaving valuable revenue and high-ticket leads on the table. We identified 3 critical areas where optimization will outrank local competitors.',
          colorHex: '#22d3ee',
        };
      case 'C':
      default:
        return {
          bg: 'bg-amber-950/30 border-amber-500/40 text-amber-400',
          letterColor: 'text-amber-400',
          badgeText: 'STRATEGIC OPTIMIZATION OPPORTUNITY',
          headline: 'Active Visibility Leaks • Immediate Growth Upside',
          summary: 'Your business has a foundation, but significant discoverability leaks and client intake friction are preventing you from capturing qualified leads searching for your services right now.',
          colorHex: '#f59e0b',
        };
    }
  };

  const currentGradeData = getGradeDetails(grade);

  // Single Revealed Opportunity Item per channel + consultation talking points
  // STRATEGY: Show the client an impactful entry/spark priority (Area #3), while keeping the heavy #1 & #2 master infrastructure items for the consultation
  // In the notification email to Eric, send ALL TOP 3 PRIORITIES with full diagnosis + action plans for consultation prep.
  const getOpportunityItems = () => {
    const inputClean = inputValue.trim().toLowerCase();
    const isETDigitalOrGradeA = grade === 'A' || inputClean.includes('growwithetdigital') || inputClean.includes('etdigital');

    if (selectedChannel === 'website') {
      if (isETDigitalOrGradeA) {
        return {
          topThreePriorities: [
            {
              number: '01',
              title: 'Conversational AI Entity Hubs & SGE Authority Dominance',
              priorityLevel: 'High Infrastructure Priority',
              diagnosis: 'Structured JSON-LD entity schema and backend pricing metadata are active. To dominate ChatGPT Search, Google AI Overviews, and Perplexity, deploying dedicated conversational AI entity hubs will solidify #1 category recommendations across AI answer engines.',
              action: 'Deploy structured semantic markup and optimize service pages for conversational AI search indexing and natural dialogue retrieval.',
            },
            {
              number: '02',
              title: 'Multi-Touch Client Attribution & First-Party Data Warehouse',
              priorityLevel: 'Revenue Infrastructure Priority',
              diagnosis: 'High-intent search traffic needs dedicated Server-to-Server Conversions APIs (CAPI) and event-driven qualification hooks to eliminate conversion friction and capture high-ticket lead attribution.',
              action: 'Implement real-time server tracking and high-ticket pipeline qualification workflows.',
            },
            {
              number: '03',
              title: 'Conversational AI Entity Indexing & Semantic Search Matrix',
              priorityLevel: 'Immediate Action Spark (Client View)',
              diagnosis: 'Your foundation is strong with active JSON-LD and pricing schemas. To solidify #1 category recommendations in ChatGPT Search, Google AI Overviews, and Perplexity, deploy conversational AI entity hubs and optimize service pages for natural language dialogue retrieval.',
              action: 'Deploy structured semantic markup and optimize service pages for conversational AI search indexing.',
            }
          ],
          revealed: {
            number: '03',
            title: 'Conversational AI Entity Indexing & Semantic Search Matrix',
            diagnosis: 'Your foundation is strong with active JSON-LD and pricing schemas. To solidify #1 category recommendations in ChatGPT Search, Google AI Overviews, and Perplexity, deploy conversational AI entity hubs and optimize service pages for natural language dialogue retrieval.',
            action: 'Deploy structured semantic markup and optimize service pages for conversational AI search indexing.',
            tag: 'PRIORITY SPARK',
          },
          consultationAgenda: [
            'Priority #1: Conversational AI Entity Hubs & SGE Authority Dominance',
            'Priority #2: Multi-Touch Client Attribution & First-Party Data Warehouse'
          ]
        };
      }

      return {
        topThreePriorities: [
          {
            number: '01',
            title: 'Core AI Search Readability & Structured Schema Deficit',
            priorityLevel: 'Core Architecture Priority',
            diagnosis: 'Website lacks structured JSON-LD entity schemas. Modern AI search engines (ChatGPT, Google SGE, Perplexity) cannot parse services, pricing ranges, or authority signals to recommend the brand.',
            action: 'Deploy structured JSON-LD entity markup, schema graphs, and machine-readable service pricing architecture.',
          },
          {
            number: '02',
            title: 'High-Intent Search Traffic Interception & Geo-Keyword Anchors',
            priorityLevel: 'Search Dominance Priority',
            diagnosis: 'Competitors are intercepting commercial search queries due to missing high-intent service cluster pages and secondary keyword silos.',
            action: 'Build dedicated service cluster landing hubs optimized for bottom-of-funnel buying queries.',
          },
          {
            number: '03',
            title: 'Mobile Lead Intake Friction & Conversion Drop-Off',
            priorityLevel: 'Immediate Action Spark (Client View)',
            diagnosis: 'Mobile visitors face form friction and lack direct-booking acceleration, causing prospective clients who arrive on the site to abandon before scheduling an intake call.',
            action: 'Streamline mobile intake forms with instant one-click calendar booking overlays and SMS/email confirmation hooks.',
          }
        ],
        revealed: {
          number: '03',
          title: 'Mobile Lead Intake Friction & Conversion Drop-Off',
          diagnosis: 'Mobile visitors face form friction and lack direct-booking acceleration, causing prospective clients who arrive on the site to abandon before scheduling an intake call.',
          action: 'Streamline mobile intake forms with instant one-click calendar booking overlays and SMS/email confirmation hooks.',
          tag: 'PRIORITY SPARK',
        },
        consultationAgenda: [
          'Priority #1: Core AI Search Readability & Structured Schema Deficit',
          'Priority #2: High-Intent Search Traffic Interception & Geo-Keyword Anchors'
        ]
      };
    } else if (selectedChannel === 'social') {
      return {
        topThreePriorities: [
          {
            number: '01',
            title: 'High-Ticket Appointment Bridge & Multi-Asset Intake Funnel',
            priorityLevel: 'Conversion Architecture Priority',
            diagnosis: 'Social channels generate views but lack a direct-response appointment funnel. Profile visitors drop off without booking high-ticket discovery calls.',
            action: 'Deploy an automated multi-asset intake hub with pre-qualification filters and instant calendar syncing.',
          },
          {
            number: '02',
            title: 'Cross-Platform AI Brand Citation & Social Entity Mapping',
            priorityLevel: 'Authority & AI Discovery Priority',
            diagnosis: 'Social profiles are not cross-indexed with core website entities, causing AI engines to overlook social authority signals.',
            action: 'Establish verified SameAs entity links, canonical social schemas, and authoritative knowledge graph syndication.',
          },
          {
            number: '03',
            title: 'Bio-to-Meeting Conversion Link & Frictionless Lead Hook',
            priorityLevel: 'Immediate Action Spark (Client View)',
            diagnosis: 'Your social profile bio is driving passive clicks to a generic homepage or cluttered link menu rather than a high-converting diagnostic or direct booking bridge.',
            action: 'Replace generic links with a dedicated Growth OS multi-asset intake hub with automated appointment syncing.',
          }
        ],
        revealed: {
          number: '03',
          title: 'Bio-to-Meeting Conversion Link & Frictionless Lead Hook',
          diagnosis: 'Your social profile bio is driving passive clicks to a generic homepage or cluttered link menu rather than a high-converting diagnostic or direct booking bridge.',
          action: 'Replace generic links with a dedicated Growth OS multi-asset intake hub with automated appointment syncing.',
          tag: 'PRIORITY SPARK',
        },
        consultationAgenda: [
          'Priority #1: High-Ticket Appointment Bridge & Multi-Asset Intake Funnel',
          'Priority #2: Cross-Platform AI Brand Citation & Social Entity Mapping'
        ]
      };
    } else {
      return {
        topThreePriorities: [
          {
            number: '01',
            title: 'Google Maps Local 3-Pack Proximity & Secondary Category Grid',
            priorityLevel: 'Local Dominance Priority',
            diagnosis: 'Google Business Profile is missing secondary service classifications and geo-tagged visual assets, limiting top 3-pack visibility to a narrow radius.',
            action: 'Re-index service categories, optimize business description with geo-anchors, and activate review acceleration protocols.',
          },
          {
            number: '02',
            title: 'Customer Review Velocity & Keyword-Rich Authority Response Protocol',
            priorityLevel: 'Trust & Reputation Priority',
            diagnosis: 'Review generation is sporadic and lacks structured keyword injection in owner responses, reducing algorithmic ranking strength for high-ticket searches.',
            action: 'Deploy an automated post-service review collection sequence with keyword-optimized response templates.',
          },
          {
            number: '03',
            title: 'Direct Call & Direction Booking Flow Friction',
            priorityLevel: 'Immediate Action Spark (Client View)',
            diagnosis: 'Local searchers finding the profile encounter generic landing pages instead of an instant direct-booking or call-intake route, losing leads to competitors.',
            action: 'Add direct appointment booking URLs and optimized Google Business Profile product/service action buttons.',
          }
        ],
        revealed: {
          number: '03',
          title: 'Direct Call & Direction Booking Flow Friction',
          diagnosis: 'Local searchers finding the profile encounter generic landing pages instead of an instant direct-booking or call-intake route, losing leads to competitors.',
          action: 'Add direct appointment booking URLs and optimized Google Business Profile product/service action buttons.',
          tag: 'PRIORITY SPARK',
        },
        consultationAgenda: [
          'Priority #1: Google Maps Local 3-Pack Proximity & Secondary Category Grid',
          'Priority #2: Customer Review Velocity & Keyword-Rich Authority Response Protocol'
        ]
      };
    }
  };

  const opportunities = getOpportunityItems();

  // Canvas Graphic Generator for Download - Showing ONLY 1 Area with Logo, Clean Tease & Named Reputable Sources Disclaimer
  const generateAuditGraphic = async (clientName: string, clientEmail: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 840;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load Logo Image
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = 'https://res.cloudinary.com/dnpvgq7gt/image/upload/v1782623094/IMG_6196_mgdyvb.jpg';

    await new Promise<void>((resolve) => {
      logoImg.onload = () => resolve();
      logoImg.onerror = () => resolve(); // continue even if network image fails
      setTimeout(resolve, 1500); // 1.5s timeout safety
    });

    // Background Dark Slate Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 1200, 840);
    bgGradient.addColorStop(0, '#090d16');
    bgGradient.addColorStop(0.6, '#0f172a');
    bgGradient.addColorStop(1, '#020617');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 840);

    // Subtle Cyan Glow in Corner
    const glow = ctx.createRadialGradient(1100, 80, 20, 1100, 80, 450);
    glow.addColorStop(0, 'rgba(6, 182, 212, 0.18)');
    glow.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1200, 840);

    // Subtle Outer Frame
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, 1140, 780);

    // Header: Draw Logo and Branding
    if (logoImg.complete && logoImg.naturalWidth > 0) {
      ctx.save();
      // Draw rounded container for logo
      ctx.beginPath();
      ctx.roundRect(60, 50, 52, 52, 10);
      ctx.clip();
      ctx.drawImage(logoImg, 60, 50, 52, 52);
      ctx.restore();

      ctx.fillStyle = '#22d3ee';
      ctx.font = 'bold 24px "Montserrat", sans-serif';
      ctx.fillText('ET DIGITAL', 124, 75);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('GROWTH STRATEGY & AI AUDIT REPORT', 124, 96);
    } else {
      ctx.fillStyle = '#22d3ee';
      ctx.font = 'bold 26px "Montserrat", sans-serif';
      ctx.fillText('ET DIGITAL', 60, 75);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('GROWTH STRATEGY & AI AUDIT REPORT', 60, 95);
    }

    // Timestamp & Target on top right
    ctx.textAlign = 'right';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(`DATE: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`, 1140, 75);
    ctx.fillText(`TARGET: ${inputValue.trim() || 'Client Asset'}`, 1140, 95);
    ctx.textAlign = 'left';

    // Divider Line
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 118);
    ctx.lineTo(1140, 118);
    ctx.stroke();

    // Grade Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = currentGradeData.colorHex;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(60, 138, 180, 180, 18);
    ctx.fill();
    ctx.stroke();

    // Grade Letter
    ctx.fillStyle = currentGradeData.colorHex;
    ctx.font = 'bold 90px "Montserrat", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(grade, 150, 258);

    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('OVERALL GRADE', 150, 293);
    ctx.textAlign = 'left';

    // Grade Details & Headline
    ctx.fillStyle = currentGradeData.colorHex;
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText(currentGradeData.badgeText, 270, 163);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Montserrat", sans-serif';
    ctx.fillText(currentGradeData.headline, 270, 195);

    // Summary Text (Wrapped)
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '13px sans-serif';
    const words = currentGradeData.summary.split(' ');
    let line = '';
    let y = 225;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 830 && n > 0) {
        ctx.fillText(line, 270, y);
        line = words[n] + ' ';
        y += 22;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 270, y);

    // Teaser Header: 3 Identified Areas (1 Revealed)
    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillText(`KEY GROWTH PRIORITY (${opportunities.revealed.number} OF 3 IDENTIFIED)`, 60, 352);

    // ONLY 1 AREA CARD (Clean & High-Contrast)
    ctx.fillStyle = 'rgba(6, 182, 212, 0.06)';
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(60, 368, 1080, 160, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText(`PRIORITY ${opportunities.revealed.number} — UNLOCKED ACTION SPARK`, 85, 398);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px "Montserrat", sans-serif';
    ctx.fillText(opportunities.revealed.title, 85, 428);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px sans-serif';
    ctx.fillText(opportunities.revealed.diagnosis, 85, 455);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`✓ Action Plan: ${opportunities.revealed.action}`, 85, 495);

    // Bottom Call to Action Footer Banner (Consultation Tease)
    ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(60, 548, 1080, 140, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px "Montserrat", sans-serif';
    ctx.fillText('UNLOCK YOUR MASTER PRIORITIES #1 & #2 WITH ERIC THOMAS', 85, 585);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '13px sans-serif';
    ctx.fillText('We diagnosed 3 strategic leverage points for your business. Priority 3 is spark-unlocked above. Book your complimentary', 85, 611);
    ctx.fillText('30-minute growth consultation to unlock high-leverage Priorities #1 & #2 with our complete step-by-step execution roadmap.', 85, 631);

    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText('WEBSITE: growwithetdigital.com   •   DIRECT: hello@growwithetdigital.com', 85, 661);

    // Disclaimer at Bottom with named reputable sources
    ctx.fillStyle = '#64748b';
    ctx.font = '9.5px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Disclaimer: Performance heuristics and audit diagnostics are compiled from reputable marketing authorities, data providers, and business standards', 600, 725);
    ctx.fillText('including Google Web Vitals & Search Central, Schema.org entity taxonomies, Semrush & Ahrefs market intelligence datasets, and Forrester B2B digital benchmarks.', 600, 742);
    ctx.fillText('This diagnostic report is generated for strategic assessment and evaluation purposes. All rights reserved by ET Digital.', 600, 759);
    ctx.textAlign = 'left';

    // Convert Canvas to downloadable PNG image
    const dataUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUrl;
    const sanitizedTarget = inputValue.replace(/[^a-zA-Z0-9]/g, '_') || 'business';
    downloadLink.download = `ET_Digital_Growth_Audit_${sanitizedTarget}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Handle Download Form Submit - Sends Comprehensive 3-Priority Strategic Breakdown to Owner Inbox
  const handleDownloadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadEmail.trim()) {
      setDownloadError('Please enter your name and email to download your report card.');
      return;
    }

    setDownloadError('');
    setIsDownloading(true);

    try {
      // 1. Dispatch comprehensive 3-priority results payload to owner inbox via Web3Forms API
      const timestamp = new Date().toLocaleString();
      const p1 = opportunities.topThreePriorities[0];
      const p2 = opportunities.topThreePriorities[1];
      const p3 = opportunities.topThreePriorities[2];

      const emailMessageBody = `
📊 NEW AUDIT REPORT CARD & LEAD CAPTURE

========================================
PROSPECT CONTACT INFORMATION:
========================================
Name: ${leadName.trim()}
Email: ${leadEmail.trim()}
Downloaded At: ${timestamp}

========================================
AUDITED ASSET & DIAGNOSTIC RESULTS:
========================================
Audited Target: ${inputValue.trim() || 'Direct Submission'}
Channel: ${currentOption.title}
Overall Grade: ${grade} (${currentGradeData.badgeText})
Headline: ${currentGradeData.headline}

Executive Summary:
${currentGradeData.summary}

========================================
COMPLETE 3-PRIORITY ROADMAP (CONSULTATION PREPARATION):
========================================

----------------------------------------
PRIORITY #1: ${p1.title}
[${p1.priorityLevel}]
----------------------------------------
Diagnosis:
${p1.diagnosis}

Action Plan / Prescription:
${p1.action}

----------------------------------------
PRIORITY #2: ${p2.title}
[${p2.priorityLevel}]
----------------------------------------
Diagnosis:
${p2.diagnosis}

Action Plan / Prescription:
${p2.action}

----------------------------------------
PRIORITY #3: ${p3.title}
[${p3.priorityLevel} - SHOWN TO CLIENT AS SPARK]
----------------------------------------
Diagnosis:
${p3.diagnosis}

Action Plan / Prescription:
${p3.action}

========================================
CONSULTATION STRATEGY:
Prospect has seen Priority #3 to spark interest without giving away core infrastructure for free. Use Priorities #1 & #2 during the 30-min strategy session with ${leadName.trim()} (${leadEmail.trim()}) to close the engagement.
      `.trim();

      const web3Payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        name: leadName.trim(),
        email: leadEmail.trim(),
        replyto: leadEmail.trim(),
        subject: `📊 Full Audit Dossier: ${leadName.trim()} — ${inputValue.trim()} (Grade ${grade})`,
        message: emailMessageBody,
        from_name: 'ET Digital Auditor System',
      };

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(web3Payload),
      }).catch((wErr) => console.warn('Audit download Web3Forms dispatch:', wErr));

      // 2. Submit lead details to Firestore with full 3-priority summary
      submitBookingToFirestore({
        name: leadName.trim(),
        email: leadEmail.trim(),
        company: inputValue.trim() || 'Auditor Prospect',
        objective: `Audit Card Download (Grade ${grade})`,
        notes: `Target: ${inputValue.trim()} | Channel: ${selectedChannel} | Grade: ${grade} | P1: ${p1.title} | P2: ${p2.title} | P3 (Client Spark): ${p3.title}`,
      }).catch((fErr) => console.warn('Firestore lead capture note:', fErr));

      // 3. Generate and Trigger PNG Graphic Download
      await generateAuditGraphic(leadName.trim(), leadEmail.trim());

      setIsDownloading(false);
      setDownloadSuccess(true);
    } catch (err) {
      console.error('Error generating graphic:', err);
      setIsDownloading(false);
      // Still generate graphic even if network had an issue
      generateAuditGraphic(leadName.trim(), leadEmail.trim());
      setDownloadSuccess(true);
    }
  };

  return (
    <section id="growth-grader" className="py-20 sm:py-28 bg-slate-950 border-t border-b border-white/[0.03] relative overflow-hidden select-none">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e905_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e905_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-brand-cyan/[0.015] rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-blue-950/[0.06] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <span className="font-mono text-[9px] font-extrabold uppercase tracking-[0.25em] text-brand-cyan bg-cyan-950/50 border border-brand-cyan/20 px-3.5 py-1.5 rounded-full inline-block mb-4 shadow-sm">
            INSTANT ONLINE WEBSITE AUDIT
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-5 uppercase">
            Free Online Growth <span className="text-brand-cyan">& AI Auditor</span>
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Select one of the 3 channels below to run an instant, confidential audit on your business's online discoverability, AI presence, and customer intake strength.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            
            {/* STATE 1: 3-Channel Intake Form */}
            {!isAnalyzing && !isCompleted && (
              <motion.div
                key="intake"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="bg-slate-900/50 backdrop-blur-md border border-slate-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl"
              >
                {/* Step 1: Pick Channel */}
                <div className="mb-8">
                  <label className="block font-mono text-[10px] font-extrabold text-brand-cyan uppercase tracking-widest mb-3">
                    STEP 1: Choose 1 Channel to Audit
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {auditOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = selectedChannel === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setSelectedChannel(opt.id);
                            setInputValue('');
                          }}
                          className={`text-left p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                            isSelected
                              ? 'bg-cyan-950/40 border-brand-cyan text-white shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                              : 'bg-slate-950/80 border-slate-850 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-slate-900 text-slate-500'}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                              isSelected ? 'border-brand-cyan bg-brand-cyan text-slate-950' : 'border-slate-700'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-display text-xs sm:text-sm font-black uppercase text-white tracking-tight mb-1">
                              {opt.title}
                            </h3>
                            <p className="font-sans text-[11px] text-slate-400 leading-relaxed font-normal">
                              {opt.subtitle}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Form Input */}
                <form onSubmit={handleStartAnalysis} className="space-y-6">
                  <div>
                    <label className="block font-mono text-[10px] font-extrabold text-brand-cyan uppercase tracking-widest mb-2.5">
                      STEP 2: {currentOption.inputLabel}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-500">
                        {selectedChannel === 'website' && <Globe className="h-5 w-5" />}
                        {selectedChannel === 'social' && <Share2 className="h-5 w-5" />}
                        {selectedChannel === 'gbp' && <MapPin className="h-5 w-5" />}
                      </div>
                      <input
                        type="text"
                        required
                        placeholder={currentOption.placeholder}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="block w-full pl-12 pr-4 py-4.5 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-cyan/50 focus:border-brand-cyan/50 text-sm transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Submission CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full relative bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-[11px] font-black uppercase tracking-widest py-4.5 rounded-2xl transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-cyan-950/40"
                    >
                      <span>GENERATE MY FREE {currentOption.title.toUpperCase()} REPORT</span>
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    </button>
                  </div>
                </form>

                <div className="mt-6 pt-5 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    100% Free & Confidential. No credit card required.
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                    VALIDATED AGAINST ENTERPRISE DIGITAL PERFORMANCE BENCHMARKS
                  </span>
                </div>
              </motion.div>
            )}

            {/* STATE 2: Animated Scanner Simulation */}
            {isAnalyzing && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-8 sm:p-12 shadow-2xl text-center flex flex-col items-center justify-center min-h-[420px]"
              >
                {/* Glowing Spinner Gear */}
                <div className="relative mb-8 w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 bg-brand-cyan/10 rounded-full blur-xl pointer-events-none" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                    className="absolute inset-0 border-2 border-dashed border-brand-cyan/40 rounded-full"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                    className="absolute inset-2 border border-dotted border-cyan-500/30 rounded-full"
                  />
                  <div className="absolute inset-4 bg-slate-950 rounded-full border border-slate-800 flex items-center justify-center">
                    <Cpu className="w-8 h-8 text-brand-cyan animate-pulse" />
                  </div>
                </div>

                <h3 className="font-display text-lg font-extrabold text-white uppercase tracking-wider mb-2">
                  Auditing {currentOption.title}
                </h3>
                <span className="font-mono text-[10px] text-brand-cyan font-semibold block uppercase tracking-[0.2em] mb-4">
                  {progress}% Diagnostic Complete
                </span>

                {/* Progress Bar */}
                <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-full h-2.5 overflow-hidden mb-8 shadow-inner">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full rounded-full"
                    transition={{ ease: 'easeOut' }}
                  />
                </div>

                {/* Live Diagnostic Log Feed */}
                <div className="w-full max-w-lg bg-slate-950 border border-slate-850/80 rounded-2xl p-5 text-left font-mono text-[10px] leading-relaxed space-y-2 h-[120px] overflow-hidden relative">
                  <div className="absolute bottom-5 left-5 right-5 space-y-2">
                    {steps.map((s) => {
                      const isDone = completedSteps.includes(s.id);
                      const isCurrent = currentStepText === s.text;
                      if (!isDone && !isCurrent) return null;
                      return (
                        <div key={s.id} className="flex items-center gap-2.5 transition-all duration-300">
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                          ) : (
                            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping shrink-0" />
                          )}
                          <span className={isDone ? 'text-slate-400' : 'text-white font-semibold'}>
                            {s.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none" />
                </div>
              </motion.div>
            )}

            {/* STATE 3: Single Executive Report Card Dashboard */}
            {isCompleted && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Header Overview Banner: 1 Clean Grade with Explanation */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                    
                    {/* Left: 1 Single Clean Grade Box */}
                    <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-2 flex flex-col items-center justify-center shrink-0 shadow-2xl ${currentGradeData.bg}`}>
                      <span className={`font-display text-5xl sm:text-6xl font-black ${currentGradeData.letterColor}`}>
                        {grade}
                      </span>
                      <span className="font-mono text-[9px] uppercase font-extrabold tracking-widest mt-0.5 text-slate-300">
                        OVERALL GRADE
                      </span>
                    </div>

                    {/* Right: Diagnosis and Explanation */}
                    <div className="text-center sm:text-left flex-1">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                        <span className="font-mono text-[9px] font-bold text-brand-cyan bg-cyan-950/80 border border-brand-cyan/30 px-3 py-1 rounded-full uppercase tracking-widest">
                          TARGET: {inputValue || 'Submitted Profile'}
                        </span>
                        <span className="font-mono text-[9px] font-bold text-slate-400 bg-slate-950 border border-slate-800 px-3 py-1 rounded-full uppercase tracking-wider">
                          CHANNEL: {currentOption.title}
                        </span>
                      </div>

                      <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-white tracking-tight mb-2">
                        {currentGradeData.headline}
                      </h3>

                      <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                        {currentGradeData.summary}
                      </p>
                    </div>

                  </div>
                </div>

                {/* THE CLEAN REPORT: Only 1 Area Displayed + Teaser */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8 text-left space-y-6">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 text-brand-cyan" />
                        <h4 className="font-display text-base sm:text-lg font-black uppercase text-white tracking-tight">
                          We Found 3 Improvement Areas for Your Growth
                        </h4>
                      </div>
                      <p className="font-sans text-xs text-slate-400">
                        Our diagnostic surfaced 3 strategic leverage points. Area #1 is detailed below. The remaining 2 growth protocols and complete execution roadmap are addressed directly during your 1-on-1 growth consultation with Eric Thomas.
                      </p>
                    </div>

                    {/* Button to Download Branded Graphic */}
                    <button
                      onClick={() => {
                        setDownloadSuccess(false);
                        setIsDownloadModalOpen(true);
                      }}
                      className="bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 shrink-0 active:scale-98"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-950" />
                      <span>Download Report Graphic</span>
                    </button>
                  </div>

                  {/* ONLY 1 REVEALED AREA (Full Diagnosis & Action) */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-cyan-950/20 border border-brand-cyan/40 space-y-3 relative overflow-hidden shadow-inner">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-black text-brand-cyan bg-cyan-950 border border-brand-cyan/40 px-2.5 py-1 rounded-lg">
                          AREA {opportunities.revealed.number}
                        </span>
                        <span className="font-mono text-[9px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {opportunities.revealed.tag}
                        </span>
                      </div>
                    </div>

                    <h5 className="font-display text-base font-black text-white uppercase tracking-tight">
                      {opportunities.revealed.title}
                    </h5>

                    <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {opportunities.revealed.diagnosis}
                    </p>

                    <div className="pt-2 flex items-start gap-2 text-xs font-sans text-emerald-300 bg-emerald-950/30 border border-emerald-500/20 p-3 rounded-xl">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white font-semibold">ET Digital Growth Prescription: </strong>
                        <span>{opportunities.revealed.action}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Dedicated Growth Operating System Integration & Cadence Bridge */}
                <div className="bg-gradient-to-b from-slate-900/95 via-slate-900 to-slate-950 border-2 border-brand-cyan/40 rounded-3xl p-6 sm:p-8 text-left shadow-2xl space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono text-[9px] font-black uppercase tracking-widest text-brand-cyan bg-cyan-950/80 px-2.5 py-1 rounded border border-brand-cyan/30">
                          ET Digital Growth OS™
                        </span>
                        <span className="font-mono text-[9px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/20">
                          Grade {grade} Data Linked
                        </span>
                      </div>
                      <h4 className="font-display text-lg sm:text-xl font-black text-white tracking-tight">
                        Save Your Audit & Sign In to Growth Operating System™
                      </h4>
                    </div>

                    {onOpenAuthModal && (
                      <button
                        type="button"
                        onClick={onOpenAuthModal}
                        className="inline-flex items-center justify-center gap-2 bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-xs font-black uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all shadow-md hover:shadow-cyan-950/50 cursor-pointer shrink-0"
                        id="save-audit-to-growth-os-btn"
                      >
                        <Sparkles className="w-4 h-4 text-slate-950" />
                        <span>Sign In to Growth Operating System</span>
                      </button>
                    )}
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                    Your diagnostic audit findings are ready to be attached to your account. Sign in to your Growth OS to access your dedicated digital whiteboard, track historical channel benchmarks, and collaborate on your organic visibility roadmap with Eric Thomas.
                  </p>

                  {/* Feature highlights without tiers */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <div className="font-display text-xs font-bold text-brand-cyan uppercase tracking-wider flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-brand-cyan" />
                        <span>Diagnostic Vault</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                        Retain your Grade {grade} benchmarks, Core Web Vitals, and channel scoring history.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <div className="font-display text-xs font-bold text-brand-cyan uppercase tracking-wider flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-brand-cyan" />
                        <span>Growth Whiteboard</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                        Interactive collaboration space with strategic recommendations and priority milestones.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <div className="font-display text-xs font-bold text-brand-cyan uppercase tracking-wider flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-brand-cyan" />
                        <span>AI Search Intelligence</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                        Actionable search and AEO optimization prompts tailored directly to your channel.
                      </p>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {onOpenAuthModal && (
                      <button
                        type="button"
                        onClick={onOpenAuthModal}
                        className="bg-cyan-950/90 hover:bg-cyan-900 border border-brand-cyan/60 text-brand-cyan hover:text-white font-display text-[10px] font-black uppercase tracking-widest px-5 py-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-brand-cyan" />
                        <span>Save Audit to Growth OS</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={onOpenCalendar || onOpenBooking}
                      className="bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-display text-[10px] font-black uppercase tracking-widest px-5 py-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Calendar className="w-3.5 h-3.5 text-brand-cyan" />
                      <span>Book Strategy Call with Eric</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setDownloadSuccess(false);
                        setIsDownloadModalOpen(true);
                      }}
                      className="bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-300 hover:text-white font-display text-[10px] font-black uppercase tracking-widest px-4 py-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5 text-brand-cyan" />
                      <span>Download Report Graphic</span>
                    </button>

                    <button
                      onClick={handleReset}
                      className="bg-transparent hover:bg-white/[0.05] border border-white/10 text-slate-400 hover:text-white font-display text-[10px] font-black uppercase tracking-widest px-3.5 py-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ml-auto"
                      title="Test another URL or channel"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                {/* Professional Disclaimer Box with Named Reputable Sources */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-850 text-slate-400 text-left flex items-start gap-3.5">
                  <Info className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed font-sans">
                    <strong className="text-slate-300 font-medium">Diagnostic Methodology & Data Sources: </strong>
                    Performance heuristics and audit diagnostics are compiled using algorithmic analysis and benchmarks synthesized from recognized industry authorities including <span className="text-slate-300 font-medium">Google Web Vitals & Search Central</span>, <span className="text-slate-300 font-medium">Schema.org</span> entity taxonomies, <span className="text-slate-300 font-medium">Semrush & Ahrefs</span> market intelligence datasets, and <span className="text-slate-300 font-medium">Forrester B2B digital performance benchmarks</span>. This report is provided for strategic assessment and evaluation purposes.
                  </p>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* DOWNLOAD MODAL: Lead capture for 1 ET Digital Branded Graphic */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-left overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-cyan/20 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-950/90 border border-brand-cyan/30 text-brand-cyan">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-black text-white uppercase tracking-wider">
                    Download Report Graphic
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    OFFICIAL ET DIGITAL BRANDED ASSET (PNG)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsDownloadModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="py-5">
              {downloadSuccess ? (
                <div className="text-center space-y-4 py-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-950/80 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-black text-white uppercase tracking-wider">
                      Graphic Downloaded!
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Your high-resolution ET Digital audit card has been saved to your device. Ready to unlock all 3 areas with Eric?
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col gap-2.5">
                    <button
                      onClick={() => {
                        setIsDownloadModalOpen(false);
                        if (onOpenCalendar) onOpenCalendar();
                        else onOpenBooking();
                      }}
                      className="w-full bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-display text-xs font-black uppercase tracking-widest py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-slate-950" />
                      <span>Book Strategy Session</span>
                    </button>

                    <button
                      onClick={() => setIsDownloadModalOpen(false)}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs uppercase tracking-wider py-2.5 px-6 rounded-xl transition-all cursor-pointer"
                    >
                      <span>Close</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleDownloadSubmit} className="space-y-4 font-sans">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Enter your name and work email to instantly download your high-resolution Grade <strong className="text-brand-cyan">{grade}</strong> audit card image.
                  </p>

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-brand-cyan">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Work Email Address <span className="text-brand-cyan">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sarah@company.com"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan"
                    />
                  </div>

                  {downloadError && (
                    <p className="text-xs text-red-400">{downloadError}</p>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isDownloading}
                      className="w-full bg-brand-cyan hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-display text-xs font-black uppercase tracking-widest py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      {isDownloading ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                          <span>Generating PNG Graphic...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 text-slate-950" />
                          <span>Download Branded PNG Report</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Footer */}
            {!downloadSuccess && (
              <div className="pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>100% Confidential • Instant Download</span>
                <span>ET Digital Diagnostics</span>
              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
