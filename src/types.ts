export interface GrowthModule {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  capabilities: string[];
  metrics: { label: string; value: string; trend?: string }[];
  visualType: 'editor' | 'flow' | 'chart' | 'analytics' | 'terminal';
  mockData: any;
}

export interface SystemFlowStep {
  id: string;
  label: string;
  description: string;
  category: 'input' | 'core' | 'output' | 'outcome';
  status: 'idle' | 'processing' | 'completed';
}

export interface StrategyProfile {
  companyName: string;
  industry: string;
  targetAudience: string;
  primaryChannels: string[];
  currentVolume: string; // "occasional" | "regular" | "frequent"
  additionalNotes?: string;
}

export interface CaseStudy {
  clientName: string;
  industry: string;
  duration: string;
  objectives: string[];
  systemImplementation: string[];
  growthOutcomes: { label: string; value: string; desc: string }[];
  performanceHistory: { month: string; before: number; after: number }[];
}

export type UserTier = 'free' | 'monthly' | 'consultation';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  emailVerified?: boolean;
  tier: UserTier;
  status: 'active' | 'suspended' | 'canceled';
  has_seen_welcome: boolean;
  last_generated_timestamp?: any;
  next_eligible_timestamp?: any;
  total_generations_count: number;
  audit_id?: string | null;
  business_name?: string;
  contact?: string;
  website_url?: string;
  location?: string;
  mission_statement?: string;
  competitor_website?: string;
  brand_voice?: string;
  target_audience?: string;
  industry?: string;
  brand_logo_url?: string;
  brand_dna?: {
    voice_archetype?: string;
    tone_descriptors?: string[];
    core_value_prop?: string;
    target_persona?: string;
    differentiator?: string;
    extracted_keywords?: string[];
    summary?: string;
    extracted_from_url?: string;
    extracted_at?: string;
  };
  writing_sample?: string;
  login_count?: number;
  last_sign_in_at?: string;
  last_active_at?: string;
  role?: 'owner' | 'admin' | 'client';
  created_at?: any;
  updated_at?: any;
}

export interface PlatformTelemetryEvent {
  id: string;
  uid: string;
  userEmail: string;
  userName: string;
  action: 'login' | 'content_generation' | 'audit_completed' | 'profile_updated' | 'roadmap_reviewed' | 'tactic_copied';
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface MarketingTip {
  id: string;
  category: 'AEO & AI Search' | 'Short-Form Video' | 'Local Authority' | 'B2B & Inbound' | 'CRO & Conversion';
  title: string;
  tactic: string;
  whyItWorks: string;
  stepByStep: string[];
  impactMetric: string;
  tag: string;
}

export interface AuditRecord {
  id?: string;
  uid?: string | null;
  website_url: string;
  business_name: string;
  primary_niche?: string;
  target_audience?: string;
  growth_bottlenecks?: string[];
  current_monthly_visitors?: string;
  grade?: string;
  created_at?: any;
  overallScore?: number;
  metrics?: {
    mobileSpeed?: number;
    desktopSpeed?: number;
    seoHealth?: number;
    securityScore?: number;
    aeoScore?: number;
    croScore?: number;
  };
  recommendations?: string[];
}

export interface GeneratedContentItem {
  id: string;
  uid: string;
  type: string;
  created_at: any;
  blog_post: {
    title: string;
    target_keyword: string;
    word_count?: number;
    markdown_content: string;
    meta_description: string;
    natural_photo_url?: string;
    photo_caption?: string;
    read_time?: string;
  };
  social_captions: {
    linkedin: string;
    twitter_x: string;
    facebook: string;
    instagram_threads: string;
  };
  graphic: {
    storage_path?: string;
    public_download_url: string;
    prompt_used?: string;
    dimensions?: { width: number; height: number };
  };
  social_angles?: Array<{
    id: string;
    angle_title: string;
    angle_badge: string;
    linkedin: string;
    twitter_x: string;
    facebook: string;
    instagram_threads: string;
    email_subject?: string;
    email_preview?: string;
    email_body?: string;
    lead_magnet_hook?: string;
  }>;
}
