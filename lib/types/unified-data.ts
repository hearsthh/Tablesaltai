// Unified data structures for TableSalt AI platform

export interface Restaurant {
  id: string
  userId: string
  name: string
  tagline?: string
  description: string
  cuisineType: string[]
  address: string
  phone: string
  email: string
  website?: string
  logo?: string
  coverImage?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface MenuItem {
  id: string
  restaurantId: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  ingredients: string[]
  allergens: string[]
  isAvailable: boolean
  isPopular: boolean
  aiScore: number
  performanceTier: "high" | "medium" | "low"
  ordersLast30Days: number
  revenue: number
  lastOrdered?: string
  createdAt: string
  updatedAt: string
}

export interface Customer {
  id: string
  restaurantId: string
  name: string
  email?: string
  phone?: string
  segment: "vip" | "loyalist" | "regular" | "new" | "churn_risk"
  totalSpent: number
  orderCount: number
  avgOrderValue: number
  lastVisit?: string
  lifetimeValue: number
  churnRisk: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  restaurantId: string
  customerName: string
  rating: number
  comment: string
  platform: "google" | "zomato" | "swiggy" | "facebook" | "direct"
  sentiment: "positive" | "negative" | "neutral"
  dishMentioned?: string
  hasReply: boolean
  aiSuggestedReply?: string
  isPromoted: boolean
  createdAt: string
  repliedAt?: string
}

export interface Strategy {
  id: string
  restaurantId: string
  title: string
  goal: string
  description: string
  targetSegment: string[]
  duration: {
    startDate: string
    endDate: string
  }
  status: "draft" | "active" | "paused" | "completed"
  campaigns: string[] // Campaign IDs
  budget?: number
  expectedROI?: number
  actualROI?: number
  createdAt: string
  updatedAt: string
}

export interface Campaign {
  id: string
  restaurantId: string
  strategyId?: string
  title: string
  description: string
  type: "promotion" | "engagement" | "retention" | "acquisition"
  targetSegment: string[]
  channels: Channel[]
  linkedMenuItems?: string[]
  linkedOffers?: string[]
  status: "draft" | "scheduled" | "active" | "completed" | "paused"
  startDate: string
  endDate: string
  budget?: number
  performance: {
    reach: number
    engagement: number
    clicks: number
    conversions: number
    revenue: number
  }
  contentUnits: ContentUnit[]
  createdAt: string
  updatedAt: string
}

export interface ContentUnit {
  id: string
  campaignId: string
  channel: "whatsapp" | "instagram" | "facebook" | "sms" | "email"
  type: "post" | "story" | "message" | "flyer" | "reel"
  content: {
    text?: string
    image?: string
    video?: string
    cta?: string
  }
  status: "draft" | "approved" | "scheduled" | "published"
  scheduledDate?: string
  publishedDate?: string
  performance?: {
    views: number
    likes: number
    shares: number
    clicks: number
  }
  aiGenerated: boolean
  createdAt: string
  updatedAt: string
}

export interface GeneratedContent {
  id: string
  restaurantId: string
  type: "campaign_caption" | "whatsapp_message" | "review_reply" | "menu_description" | "offer_flyer"
  prompt: string
  content: string
  channel?: string
  tone: string
  goal: string
  isUsed: boolean
  usedInCampaign?: string
  createdAt: string
}

export interface Task {
  id: string
  restaurantId: string
  title: string
  description: string
  type: "review_reply" | "content_creation" | "campaign_launch" | "menu_update" | "customer_followup"
  priority: "high" | "medium" | "low"
  status: "pending" | "in_progress" | "completed" | "overdue"
  dueDate: string
  linkedEntity?: {
    type: "review" | "campaign" | "customer" | "menu_item"
    id: string
  }
  aiGenerated: boolean
  createdAt: string
  completedAt?: string
}

export interface AIInsight {
  id: string
  restaurantId: string
  type: "performance" | "opportunity" | "warning" | "suggestion"
  title: string
  description: string
  actionable: boolean
  suggestedAction?: string
  priority: "high" | "medium" | "low"
  category: "menu" | "marketing" | "customer" | "review" | "general"
  data?: any
  isRead: boolean
  createdAt: string
}

export interface AutomationTrigger {
  id: string
  restaurantId: string
  name: string
  condition: string
  action: string
  isActive: boolean
  lastTriggered?: string
  triggerCount: number
  createdAt: string
}

export interface Channel {
  name: "whatsapp" | "instagram" | "facebook" | "sms" | "email"
  isConnected: boolean
  config?: any
}

export interface CalendarEvent {
  id: string
  restaurantId: string
  title: string
  description?: string
  type: "campaign_start" | "campaign_end" | "content_publish" | "task_due" | "strategy_milestone"
  date: string
  linkedEntity?: {
    type: "campaign" | "content" | "task" | "strategy"
    id: string
  }
  status: "planned" | "completed" | "delayed"
  createdAt: string
}

// Dashboard Analytics
export interface DashboardMetrics {
  performance: {
    campaignReach: { value: number; change: number }
    reviewsTrend: { value: number; change: number }
    customerEngagement: { value: number; change: number }
    menuPerformance: { value: number; change: number }
  }
  insights: AIInsight[]
  tasks: Task[]
  quickActions: QuickAction[]
}

export interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  action: string
  href?: string
  priority: number
}
