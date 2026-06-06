export interface Client {
  id: string
  name: string
  industry: string
  website?: string
  description?: string
  logo_url?: string
  type: 'personal_brand' | 'business' | 'service' | 'product' | 'agency'
  created_at: string
  updated_at: string
}

export interface StoryBrand {
  id: string
  client_id: string
  // 1. Character
  hero_name: string
  hero_wants: string
  // 2. Problem
  villain: string
  external_problem: string
  internal_problem: string
  philosophical_problem: string
  // 3. Guide
  empathy_statement: string
  authority_proof: string
  // 4. Plan
  plan_step_1: string
  plan_step_2: string
  plan_step_3: string
  // 5. Call to Action
  direct_cta: string
  transitional_cta: string
  // 6. Failure
  failure_stakes: string
  // 7. Success
  success_vision: string
  // Generated outputs
  one_liner?: string
  brandscript?: string
  website_copy?: string
  email_sequence?: string
  created_at: string
  updated_at: string
}

export interface BrandVoice {
  id: string
  client_id: string
  archetype: BrandArchetype
  tone_formal: number       // 1-10 (1=muy casual, 10=muy formal)
  tone_humor: number        // 1-10 (1=serio, 10=divertido)
  tone_bold: number         // 1-10 (1=suave, 10=muy directo)
  tone_inspirational: number // 1-10 (1=neutro, 10=muy inspirador)
  yes_words: string[]
  no_words: string[]
  brand_personality: string
  communication_style: string
  voice_guide?: string      // Generated PDF content
  created_at: string
  updated_at: string
}

export type BrandArchetype =
  | 'hero' | 'sage' | 'caregiver' | 'creator' | 'ruler'
  | 'jester' | 'lover' | 'rebel' | 'magician' | 'explorer'
  | 'innocent' | 'everyman'

export interface Script {
  id: string
  client_id: string
  type: 'reel' | 'tiktok' | 'youtube' | 'podcast' | 'story' | 'ad'
  format: 'hook_story_cta' | 'problem_agitation_solution' | 'before_after' | 'storytelling' | 'educational' | 'testimonial'
  topic: string
  duration_seconds?: number
  platform: string
  content: string
  hook: string
  body: string
  cta: string
  created_at: string
}

export interface CompetitorAnalysis {
  id: string
  client_id: string
  competitor_name: string
  competitor_url?: string
  messaging_summary: string
  pricing_info?: string
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]   // gaps we can exploit
  created_at: string
}

export interface Offer {
  id: string
  client_id: string
  offer_name: string
  target_avatar: string
  core_problem: string
  core_result: string
  // Value stack
  deliverables: OfferDeliverable[]
  price: number
  currency: string
  // Irresistibility factors
  guarantee: string
  scarcity?: string
  urgency?: string
  bonus_stack: string[]
  // Generated copy
  landing_copy?: string
  sales_email?: string
  created_at: string
}

export interface OfferDeliverable {
  name: string
  description: string
  value: number
}

export interface AudienceResearch {
  id: string
  client_id: string
  avatar_name: string
  age_range: string
  gender: string
  location: string
  income_level: string
  education: string
  // Psychographic
  values: string[]
  fears: string[]
  frustrations: string[]
  desires: string[]
  aspirations: string[]
  // Behavioral
  platforms_used: string[]
  content_consumed: string[]
  // Copy intelligence
  exact_phrases: string[]   // voice of customer
  objections: ObjectionResponse[]
  created_at: string
}

export interface ObjectionResponse {
  objection: string
  response: string
}

export interface AnalyticsReport {
  id: string
  client_id: string
  period_start: string
  period_end: string
  platforms: PlatformMetrics[]
  overall_score: number     // 0-100
  top_post?: string
  insights: string[]
  recommendations: string[]
  created_at: string
}

export interface PlatformMetrics {
  platform: 'instagram' | 'tiktok' | 'facebook' | 'linkedin' | 'youtube'
  followers: number
  followers_growth: number
  reach: number
  impressions: number
  engagement_rate: number
  posts_count: number
  avg_likes: number
  avg_comments: number
  avg_shares: number
  top_post_url?: string
}

export interface StrategyReport {
  id: string
  client_id: string
  month: string             // YYYY-MM
  storybrand_alignment: number   // 0-100
  voice_consistency: number      // 0-100
  content_quality: number        // 0-100
  growth_score: number           // 0-100
  overall_health: number         // 0-100
  strengths: string[]
  gaps: string[]
  action_plan: StrategyAction[]
  generated_report?: string
  created_at: string
}

export interface StrategyAction {
  priority: 'high' | 'medium' | 'low'
  area: string
  action: string
  timeline: string
}

export interface Campaign {
  id: string
  client_id: string
  campaign_name: string
  objective: 'awareness' | 'engagement' | 'leads' | 'sales' | 'retargeting'
  platform: string[]
  target_audience: string
  budget_range?: string
  duration_days?: number
  // Ad sets
  ads: Ad[]
  created_at: string
}

export interface Ad {
  id: string
  format: 'image' | 'video' | 'carousel' | 'story'
  headline: string
  primary_text: string
  description?: string
  cta_button: string
  visual_direction: string   // Art direction for designer
  tone_notes: string
  ab_variant?: 'A' | 'B' | 'C'
}
