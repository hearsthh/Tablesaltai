// Marketing System Types - Complete structure for STRATEGY → CAMPAIGNS → CHANNELS → CONTENT UNITS → TASKS → CALENDAR

export interface MarketingStrategy {
  id: string
  userId: string
  restaurantId: string
  title: string
  goal: string
  description?: string
  objectiveTags: ObjectiveTag[]
  startDate: string
  endDate: string
  status: "draft" | "active" | "paused" | "completed"
  isAiGenerated: boolean
  linkedEntities: LinkedEntity[]
  campaigns: MarketingCampaign[]
  performance: {
    totalReach: number
    totalEngagement: number
    totalSpend: number
    roas: number
    completionRate: number
  }
  createdAt: string
  updatedAt: string
}

export interface MarketingCampaign {
  id: string
  strategyId: string
  title: string
  summary: string
  targetAudience: TargetAudience
  startDate: string
  endDate: string
  budget: {
    allocated: number
    spent: number
    remaining: number
  }
  status: "draft" | "scheduled" | "live" | "completed" | "paused"
  channels: CampaignChannel[]
  contentUnits: string[] // Content unit IDs
  tasks: CampaignTask[]
  linkedEntities: LinkedEntity[]
  performance: {
    reach: number
    clicks: number
    conversions: number
    engagement: number
    roas: number
  }
  isAiGenerated: boolean
  createdAt: string
  updatedAt: string
}

export interface CampaignChannel {
  id: string
  campaignId: string
  type: ChannelType
  status: "not_started" | "ready" | "scheduled" | "sent" | "completed"
  contentUnits: string[] // Content unit IDs for this channel
  settings: ChannelSettings
  performance: {
    reach: number
    engagement: number
    clicks: number
    conversions: number
    spend: number
  }
  scheduledAt?: string
  sentAt?: string
}

export interface CampaignTask {
  id: string
  campaignId: string
  contentUnitId?: string
  title: string
  description: string
  type: TaskType
  priority: "low" | "medium" | "high" | "urgent"
  status: "todo" | "in_progress" | "review" | "done" | "blocked"
  assignedTo: "user" | "ai" | string // userId
  dueDate: string
  dependencies: string[] // Other task IDs
  autoComplete: boolean
  estimatedMinutes: number
  completedAt?: string
  notes?: string
}

export interface MarketingCalendarEvent {
  id: string
  type: "strategy" | "campaign" | "content" | "task" | "milestone"
  title: string
  description?: string
  date: string
  endDate?: string
  status: "upcoming" | "in_progress" | "completed" | "overdue" | "cancelled"
  linkedId: string // Strategy, Campaign, Content, or Task ID
  linkedType: "strategy" | "campaign" | "content" | "task"
  color: string
  priority: "low" | "medium" | "high"
  reminders: string[] // ISO dates for reminders
  attendees?: string[] // User IDs
}

export interface TargetAudience {
  segments: CustomerSegment[]
  demographics: {
    ageRange?: [number, number]
    gender?: "all" | "male" | "female"
    location?: string[]
    interests?: string[]
  }
  behavioral: {
    visitFrequency?: "new" | "regular" | "vip" | "churned"
    avgOrderValue?: [number, number]
    preferredTime?: string[]
    preferredItems?: string[]
  }
  customTags?: string[]
  estimatedSize: number
}

export interface LinkedEntity {
  id: string
  type: "menu_item" | "menu_category" | "offer" | "review" | "customer_segment" | "event"
  name: string
  data?: any // Flexible data based on type
}

export interface ChannelSettings {
  autoPost: boolean
  postTime?: string
  hashtags?: string[]
  mentions?: string[]
  location?: string
  audienceTargeting?: {
    interests: string[]
    behaviors: string[]
    demographics: any
  }
  budget?: {
    daily: number
    total: number
  }
}

export interface AutomationRule {
  id: string
  name: string
  trigger: AutomationTrigger
  conditions: AutomationCondition[]
  actions: AutomationAction[]
  isActive: boolean
  lastTriggered?: string
  triggerCount: number
}

export interface AutomationTrigger {
  type:
    | "strategy_created"
    | "campaign_created"
    | "task_overdue"
    | "performance_threshold"
    | "time_based"
    | "content_published"
  config: any // Flexible config based on trigger type
}

export interface AutomationCondition {
  field: string
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains" | "not_contains"
  value: any
}

export interface AutomationAction {
  type: "create_task" | "send_notification" | "generate_content" | "update_status" | "assign_user" | "schedule_post"
  config: any // Flexible config based on action type
}

// Enums and Constants
export type ObjectiveTag =
  | "footfall"
  | "reviews"
  | "aov"
  | "retention"
  | "acquisition"
  | "engagement"
  | "brand_awareness"
  | "menu_promotion"
  | "seasonal"
  | "event_promotion"

export type ChannelType =
  | "whatsapp"
  | "instagram"
  | "facebook"
  | "email"
  | "sms"
  | "qr_code"
  | "google_ads"
  | "youtube"
  | "tiktok"

export type TaskType =
  | "content_creation"
  | "content_approval"
  | "translation"
  | "scheduling"
  | "photo_upload"
  | "review"
  | "publish"
  | "analysis"

export type CustomerSegment =
  | "new_customers"
  | "regular_customers"
  | "vip_customers"
  | "churned_customers"
  | "high_value"
  | "low_engagement"
  | "frequent_visitors"
  | "weekend_diners"
  | "lunch_crowd"
  | "dinner_crowd"

// Constants for dropdowns and selections
export const OBJECTIVE_TAGS: { value: ObjectiveTag; label: string; description: string; icon: string }[] = [
  { value: "footfall", label: "Increase Footfall", description: "Drive more customers to visit", icon: "users" },
  { value: "reviews", label: "Boost Reviews", description: "Improve online ratings and reviews", icon: "star" },
  { value: "aov", label: "Increase AOV", description: "Raise average order value", icon: "trending-up" },
  { value: "retention", label: "Customer Retention", description: "Keep customers coming back", icon: "repeat" },
  { value: "acquisition", label: "New Customers", description: "Attract new customers", icon: "user-plus" },
  { value: "engagement", label: "Social Engagement", description: "Increase social media interaction", icon: "heart" },
  { value: "brand_awareness", label: "Brand Awareness", description: "Build brand recognition", icon: "eye" },
  { value: "menu_promotion", label: "Menu Promotion", description: "Promote specific dishes", icon: "utensils" },
  { value: "seasonal", label: "Seasonal Campaign", description: "Holiday or seasonal promotions", icon: "calendar" },
  { value: "event_promotion", label: "Event Promotion", description: "Promote special events", icon: "party-popper" },
]

export const CHANNEL_TYPES: { value: ChannelType; label: string; icon: string; color: string }[] = [
  { value: "whatsapp", label: "WhatsApp", icon: "message-circle", color: "#25D366" },
  { value: "instagram", label: "Instagram", icon: "instagram", color: "#E4405F" },
  { value: "facebook", label: "Facebook", icon: "facebook", color: "#1877F2" },
  { value: "email", label: "Email", icon: "mail", color: "#EA4335" },
  { value: "sms", label: "SMS", icon: "message-square", color: "#00D4AA" },
  { value: "qr_code", label: "QR Code", icon: "qr-code", color: "#000000" },
  { value: "google_ads", label: "Google Ads", icon: "search", color: "#4285F4" },
  { value: "youtube", label: "YouTube", icon: "youtube", color: "#FF0000" },
  { value: "tiktok", label: "TikTok", icon: "music", color: "#000000" },
]

export const TASK_TYPES: { value: TaskType; label: string; icon: string; estimatedMinutes: number }[] = [
  { value: "content_creation", label: "Create Content", icon: "edit", estimatedMinutes: 30 },
  { value: "content_approval", label: "Approve Content", icon: "check-circle", estimatedMinutes: 10 },
  { value: "translation", label: "Translate Content", icon: "languages", estimatedMinutes: 15 },
  { value: "scheduling", label: "Schedule Post", icon: "clock", estimatedMinutes: 5 },
  { value: "photo_upload", label: "Upload Photos", icon: "image", estimatedMinutes: 20 },
  { value: "review", label: "Review & Edit", icon: "eye", estimatedMinutes: 15 },
  { value: "publish", label: "Publish Content", icon: "send", estimatedMinutes: 5 },
  { value: "analysis", label: "Analyze Performance", icon: "bar-chart", estimatedMinutes: 25 },
]

export const CUSTOMER_SEGMENTS: { value: CustomerSegment; label: string; description: string }[] = [
  { value: "new_customers", label: "New Customers", description: "First-time visitors" },
  { value: "regular_customers", label: "Regular Customers", description: "Frequent visitors" },
  { value: "vip_customers", label: "VIP Customers", description: "High-value customers" },
  { value: "churned_customers", label: "Churned Customers", description: "Haven't visited recently" },
  { value: "high_value", label: "High Value", description: "High average order value" },
  { value: "low_engagement", label: "Low Engagement", description: "Need re-engagement" },
  { value: "frequent_visitors", label: "Frequent Visitors", description: "Visit multiple times per week" },
  { value: "weekend_diners", label: "Weekend Diners", description: "Primarily weekend customers" },
  { value: "lunch_crowd", label: "Lunch Crowd", description: "Lunch-time customers" },
  { value: "dinner_crowd", label: "Dinner Crowd", description: "Dinner-time customers" },
]

// AI Suggestion Templates
export const STRATEGY_TEMPLATES = {
  footfall: {
    title: "Increase Weekday Footfall",
    campaigns: ["Lunch Special Promotion", "Happy Hour Campaign", "Weekday Loyalty Rewards"],
  },
  reviews: {
    title: "Boost Online Reviews",
    campaigns: ["Review Incentive Program", "Social Media Review Campaign", "Customer Feedback Follow-up"],
  },
  menu_promotion: {
    title: "Promote New Menu Items",
    campaigns: ["New Dish Launch", "Chef's Special Highlight", "Seasonal Menu Promotion"],
  },
}

export const AUTOMATION_RULES_TEMPLATES = [
  {
    name: "Auto-create Instagram content for new menu items",
    trigger: { type: "menu_item_added" },
    actions: [{ type: "generate_content", config: { channels: ["instagram"], contentType: "post" } }],
  },
  {
    name: "Remind about overdue tasks",
    trigger: { type: "task_overdue" },
    actions: [{ type: "send_notification", config: { message: "Task is overdue" } }],
  },
  {
    name: "Auto-complete AI tasks",
    trigger: { type: "task_created" },
    conditions: [{ field: "assignedTo", operator: "equals", value: "ai" }],
    actions: [{ type: "auto_complete_task" }],
  },
]
