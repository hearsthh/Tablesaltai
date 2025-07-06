export interface Strategy {
  id: string
  name: string
  description: string
  status: "active" | "paused" | "draft" | "completed"
  progress: number
  goal: string
  targetAudience: string
  startDate: string
  endDate: string
  totalBudget: number
  totalSpent: number
  campaigns: string[]
  analytics: {
    reach: number
    engagement: number
    conversions: number
    spend: number
    revenue: number
    roi: number
    overallROI: number
  }
  createdAt: string
  updatedAt: string
}

export interface Campaign {
  id: string
  name: string
  description: string
  objective: "reach" | "engagement" | "conversion"
  status: "active" | "paused" | "scheduled" | "completed" | "draft"
  progress: number
  startDate: string
  endDate: string
  budget: number
  spent: number
  contentUnits: string[]
  strategyId: string
  analytics: {
    reach: number
    engagement: number
    conversions: number
    spend: number
    revenue: number
    roi: number
  }
  createdAt: string
  updatedAt: string
}

export interface ContentUnit {
  id: string
  title: string
  description: string
  channel: string
  contentType: "post" | "story" | "reel" | "broadcast" | "email"
  textContent?: {
    caption: string
    hashtags: string[]
    callToAction?: string
  }
  mediaContent?: {
    images?: string[]
    videos?: string[]
  }
  status: "pending" | "ready" | "scheduled" | "published" | "failed"
  currentStep: number
  totalSteps: number
  scheduledDate?: string
  publishedDate?: string
  campaignId: string
  strategyId: string
  analytics?: {
    reach: number
    engagement: number
    clicks: number
    conversions: number
    spend: number
  }
  createdAt: string
  updatedAt: string
}

export interface Channel {
  id: string
  name: string
  icon: string
  color: string
  status: "connected" | "disconnected" | "pending"
  analytics?: {
    followers: number
    engagement: number
    reach: number
    posts: number
    avgEngagementRate: number
  }
  lastSync?: string
  config?: any
}

export interface PerformanceFunnel {
  reach: number
  engagement: number
  conversions: number
  spend: number
  revenue: number
  roi: number
}

export interface PerformanceMetrics {
  totalReach: number
  totalEngagement: number
  totalConversions: number
  totalSpend: number
  totalRevenue: number
  averageROI: number
  conversionRate: number
  growthRate: number
  costPerConversion: number
  topPerformingChannel: string
  topPerformingCampaign: string
  channelPerformance: Array<{
    channel: string
    reach: number
    engagement: number
    conversions: number
    spend: number
    revenue: number
    roi: number
  }>
  insights: Array<{
    type: "positive" | "negative" | "neutral"
    priority: "high" | "medium" | "low"
    message: string
    recommendation?: string
  }>
}
