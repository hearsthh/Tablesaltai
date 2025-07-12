// Review data types for multi-channel review management
export interface ReviewData {
  id: string
  restaurantId: string
  channelMetrics: ChannelMetrics[]
  allReviews: ReviewContent[]
  newReviews: NewReviewSession[]
  lastUpdated: string
  totalChannels: number
  overallRating: number
  totalReviewCount: number
}

export interface ChannelMetrics {
  channelId: string
  channelName: string
  channelType: "google" | "yelp" | "zomato" | "tripadvisor" | "facebook" | "direct" | "other"
  isConnected: boolean
  avgRating: number
  ratingCount: number
  lastSyncTime: string
  syncStatus: "success" | "error" | "pending" | "never"
  errorMessage?: string
  channelUrl?: string
  channelLogo?: string
}

export interface ReviewContent {
  id: string
  channelId: string
  channelName: string
  reviewId: string // Platform-specific review ID
  customerName: string
  customerAvatar?: string
  rating: number // 1-5 scale
  title?: string
  content: string
  timestamp: string
  reviewDate: string
  isVerified: boolean
  helpfulCount?: number
  responseFromOwner?: OwnerResponse
  sentiment: "positive" | "negative" | "neutral"
  sentimentScore: number // 0-1 scale
  keywords: string[]
  topics: string[]
  language: string
  originalUrl?: string
  photos?: ReviewPhoto[]
  metadata: ReviewMetadata
}

export interface OwnerResponse {
  id: string
  content: string
  timestamp: string
  respondedBy: string
  isAiGenerated: boolean
  aiModel?: string
}

export interface ReviewPhoto {
  id: string
  url: string
  caption?: string
  uploadedAt: string
}

export interface ReviewMetadata {
  platform: string
  deviceType?: string
  location?: string
  orderType?: string // dine-in, takeaway, delivery
  visitType?: string // first-time, repeat
  partySize?: number
  source: "api" | "manual" | "scraping"
  confidence: number // Data quality confidence 0-1
}

export interface NewReviewSession {
  sessionId: string
  loginTime: string
  newReviews: ReviewContent[]
  channelUpdates: ChannelUpdate[]
  summary: SessionSummary
}

export interface ChannelUpdate {
  channelId: string
  channelName: string
  previousRating: number
  currentRating: number
  previousCount: number
  currentCount: number
  newReviewsCount: number
  ratingChange: number
  countChange: number
}

export interface SessionSummary {
  totalNewReviews: number
  averageRating: number
  positiveReviews: number
  negativeReviews: number
  neutralReviews: number
  channelsUpdated: number
  overallRatingChange: number
  requiresAttention: ReviewContent[]
  highlights: string[]
}

// Review analytics and insights
export interface ReviewAnalytics {
  timeRange: {
    start: string
    end: string
  }
  metrics: {
    totalReviews: number
    averageRating: number
    ratingDistribution: { [key: number]: number }
    sentimentBreakdown: {
      positive: number
      negative: number
      neutral: number
    }
    responseRate: number
    averageResponseTime: number // in hours
  }
  trends: {
    ratingTrend: TrendData[]
    volumeTrend: TrendData[]
    sentimentTrend: TrendData[]
  }
  channelComparison: ChannelComparison[]
  topKeywords: KeywordAnalysis[]
  topTopics: TopicAnalysis[]
  competitorBenchmark?: CompetitorBenchmark
}

export interface TrendData {
  date: string
  value: number
  change: number
}

export interface ChannelComparison {
  channelName: string
  rating: number
  count: number
  sentiment: number
  responseRate: number
  marketShare: number
}

export interface KeywordAnalysis {
  keyword: string
  frequency: number
  sentiment: number
  trend: "up" | "down" | "stable"
}

export interface TopicAnalysis {
  topic: string
  frequency: number
  sentiment: number
  examples: string[]
}

export interface CompetitorBenchmark {
  averageRating: number
  averageReviewCount: number
  responseRate: number
  topPerformers: string[]
}

// Review management actions
export interface ReviewAction {
  type: "respond" | "flag" | "hide" | "feature" | "archive"
  reviewId: string
  data?: any
  performedBy: string
  timestamp: string
}

// AI-powered review insights
export interface ReviewInsights {
  overallSentiment: string
  keyStrengths: string[]
  keyWeaknesses: string[]
  improvementSuggestions: string[]
  responseRecommendations: ResponseRecommendation[]
  trendingTopics: string[]
  competitiveAdvantages: string[]
  riskFactors: string[]
}

export interface ResponseRecommendation {
  reviewId: string
  suggestedResponse: string
  tone: "professional" | "friendly" | "apologetic" | "grateful"
  priority: "high" | "medium" | "low"
  reasoning: string
}

// Connected channel configuration
export interface ConnectedChannel {
  id: string
  name: string
  type: ChannelMetrics["channelType"]
  isActive: boolean
  connectionStatus: "connected" | "disconnected" | "error" | "pending"
  credentials: ChannelCredentials
  syncSettings: SyncSettings
  lastSync: string
  nextSync: string
  totalReviews: number
  averageRating: number
}

export interface ChannelCredentials {
  apiKey?: string
  accessToken?: string
  refreshToken?: string
  businessId?: string
  placeId?: string
  username?: string
  encryptedData?: string
}

export interface SyncSettings {
  frequency: "realtime" | "hourly" | "daily" | "weekly" | "manual"
  autoResponse: boolean
  responseTemplate?: string
  notificationSettings: {
    newReviews: boolean
    negativeReviews: boolean
    ratingChanges: boolean
    email: boolean
    sms: boolean
    push: boolean
  }
}

// Form data types
export interface ReviewDataFormData {
  channelConnections: Partial<ConnectedChannel>[]
  syncPreferences: {
    defaultFrequency: SyncSettings["frequency"]
    autoResponseEnabled: boolean
    notificationsEnabled: boolean
  }
  responseSettings: {
    templates: ResponseTemplate[]
    autoResponseRules: AutoResponseRule[]
  }
}

export interface ResponseTemplate {
  id: string
  name: string
  ratingRange: { min: number; max: number }
  template: string
  tone: ResponseRecommendation["tone"]
  isActive: boolean
}

export interface AutoResponseRule {
  id: string
  condition: "rating_above" | "rating_below" | "contains_keyword" | "sentiment"
  value: any
  action: "auto_respond" | "notify_only" | "flag_review"
  template?: string
  isActive: boolean
}

// Completion status for review data setup
export interface ReviewDataCompletionStatus {
  channelConnections: number // 0-100%
  syncSettings: number // 0-100%
  responseTemplates: number // 0-100%
  testSync: number // 0-100%
  overall: number // 0-100%
}
