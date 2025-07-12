// Marketing Data Types - Now includes content types that were incorrectly in menu data

export interface MarketingChannel {
  id: string
  name: string
  platform:
    | "instagram"
    | "facebook"
    | "google_ads"
    | "sms"
    | "email"
    | "whatsapp"
    | "youtube"
    | "tiktok"
    | "twitter"
    | "linkedin"
  isActive: boolean
  credentials?: {
    accessToken?: string
    refreshToken?: string
    apiKey?: string
    accountId?: string
  }
  metrics: {
    reach: number
    engagement: number
    conversions: number
    spend: number
    roas: number // Return on Ad Spend
  }
  lastSyncAt?: string
}

export interface ContentType {
  id: string
  channelId: string
  type: "post" | "story" | "reel" | "video" | "carousel" | "ad" | "email" | "sms"
  count: number
  engagement: {
    likes: number
    comments: number
    shares: number
    saves: number
    clicks: number
  }
  performance: {
    reach: number
    impressions: number
    ctr: number // Click-through rate
    cpm: number // Cost per mille
    cpc: number // Cost per click
  }
}

export interface Campaign {
  id: string
  name: string
  objective: "awareness" | "engagement" | "conversions" | "traffic" | "leads"
  channels: string[] // Channel IDs
  budget: {
    total: number
    daily: number
    spent: number
  }
  schedule: {
    startDate: string
    endDate: string
    timezone: string
  }
  targeting: {
    demographics: {
      ageRange: [number, number]
      gender: "all" | "male" | "female"
      location: string[]
    }
    interests: string[]
    behaviors: string[]
  }
  content: {
    contentTypes: ContentType[]
    creatives: string[] // Asset URLs
    copy: string[]
  }
  status: "draft" | "active" | "paused" | "completed"
  performance: {
    reach: number
    impressions: number
    clicks: number
    conversions: number
    spend: number
    roas: number
  }
}

export interface MarketingData {
  id: string
  userId: string
  restaurantId: string
  channels: MarketingChannel[]
  campaigns: Campaign[]
  contentLibrary: {
    images: string[]
    videos: string[]
    templates: string[]
  }
  analytics: {
    totalReach: number
    totalEngagement: number
    totalSpend: number
    averageROAS: number
    topPerformingChannel: string
    topPerformingContent: string
  }
  completionStatus: {
    channels: boolean
    campaigns: boolean
    content: boolean
    overall: number
  }
  createdAt: string
  updatedAt: string
}

// Marketing-specific constants
export const MARKETING_CHANNELS = [
  { value: "instagram", label: "Instagram", icon: "instagram" },
  { value: "facebook", label: "Facebook", icon: "facebook" },
  { value: "google_ads", label: "Google Ads", icon: "google" },
  { value: "sms", label: "SMS", icon: "message-square" },
  { value: "email", label: "Email", icon: "mail" },
  { value: "whatsapp", label: "WhatsApp", icon: "message-circle" },
  { value: "youtube", label: "YouTube", icon: "youtube" },
  { value: "tiktok", label: "TikTok", icon: "music" },
  { value: "twitter", label: "Twitter", icon: "twitter" },
  { value: "linkedin", label: "LinkedIn", icon: "linkedin" },
]

export const CONTENT_TYPES = [
  { value: "post", label: "Post", platforms: ["instagram", "facebook", "linkedin", "twitter"] },
  { value: "story", label: "Story", platforms: ["instagram", "facebook"] },
  { value: "reel", label: "Reel", platforms: ["instagram", "facebook"] },
  { value: "video", label: "Video", platforms: ["youtube", "tiktok", "instagram", "facebook"] },
  { value: "carousel", label: "Carousel", platforms: ["instagram", "facebook", "linkedin"] },
  { value: "ad", label: "Advertisement", platforms: ["google_ads", "facebook", "instagram"] },
  { value: "email", label: "Email", platforms: ["email"] },
  { value: "sms", label: "SMS", platforms: ["sms"] },
]

export const CAMPAIGN_OBJECTIVES = [
  { value: "awareness", label: "Brand Awareness" },
  { value: "engagement", label: "Engagement" },
  { value: "conversions", label: "Conversions" },
  { value: "traffic", label: "Website Traffic" },
  { value: "leads", label: "Lead Generation" },
]
