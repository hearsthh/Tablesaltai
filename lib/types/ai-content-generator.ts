export interface GeneratedContent {
  id: string
  restaurantId: string
  userId: string

  // Content Classification
  title: string
  category: ContentCategory
  contentType: string
  channel?: string

  // Content Details
  promptInput: string
  tone: ContentTone
  aiModel: string
  outputText?: string
  outputMediaUrls: string[]

  // Workflow Status
  isApproved: boolean
  status: ContentStatus
  generatedBy: "ai" | "user" | "hybrid"
  version: number

  // Linking & Usage
  linkedEntityId?: string
  linkedEntityType?: string
  usedInCampaignId?: string
  usedInContentUnitId?: string

  // Performance & Analytics
  usageCount: number
  performanceScore: number
  engagementMetrics: Record<string, any>

  // Metadata
  tags: string[]
  isFavorite: boolean
  isTemplate: boolean
  templateCategory?: string

  // Automation
  triggerSource?: string
  triggerMetadata: Record<string, any>

  // Timestamps
  createdAt: string
  updatedAt: string
  approvedAt?: string
  usedAt?: string
}

export type ContentCategory = "campaign" | "crm" | "menu" | "review" | "profile" | "in_store" | "strategy"

export type ContentTone = "casual" | "quirky" | "gourmet" | "emotional" | "professional" | "friendly" | "elegant"

export type ContentStatus = "draft" | "approved" | "used" | "archived" | "rejected"

export interface ContentTemplate {
  id: string
  restaurantId: string
  userId: string
  name: string
  description?: string
  category: ContentCategory
  contentType: string
  promptTemplate: string
  defaultTone: ContentTone
  suggestedChannels: string[]
  usageCount: number
  successRate: number
  tags: string[]
  isSystemTemplate: boolean
  isSeasonal: boolean
  seasonalPeriod?: string
  createdAt: string
  updatedAt: string
}

export interface ContentGenerationTrigger {
  id: string
  restaurantId: string
  name: string
  description?: string
  isActive: boolean
  triggerType: TriggerType
  triggerConditions: Record<string, any>
  contentCategories: ContentCategory[]
  autoApprove: boolean
  requireReview: boolean
  totalExecutions: number
  successfulExecutions: number
  lastExecuted?: string
  createdAt: string
  updatedAt: string
}

export type TriggerType =
  | "new_strategy"
  | "menu_item_added"
  | "campaign_launched"
  | "churn_detected"
  | "review_received"
  | "empty_calendar"
  | "performance_milestone"
  | "seasonal_event"

export interface ContentGenerationRequest {
  category: ContentCategory
  contentType: string
  promptInput: string
  tone: ContentTone
  channel?: string
  aiModel?: string
  linkedEntityId?: string
  linkedEntityType?: string
  templateId?: string
  customInstructions?: string
}

export interface ContentBlock {
  id: string
  label: string
  category: ContentCategory
  contentType: string
  promptInputs: PromptInput[]
  goalOptions: string[]
  toneOptions: ContentTone[]
  channelOptions: string[]
  aiModelOptions: string[]
  isEditable: boolean
  requiresApproval: boolean
}

export interface PromptInput {
  key: string
  label: string
  type: "text" | "select" | "multiselect" | "number" | "date"
  required: boolean
  placeholder?: string
  options?: string[]
  defaultValue?: any
}

// Content Categories Configuration
export const CONTENT_CATEGORIES: Record<
  ContentCategory,
  {
    label: string
    icon: string
    description: string
    contentTypes: string[]
  }
> = {
  campaign: {
    label: "Campaign & Channel Content",
    icon: "megaphone",
    description: "Social media posts, ads, and campaign materials",
    contentTypes: [
      "campaign_title",
      "instagram_caption",
      "whatsapp_card",
      "email_subject",
      "email_body",
      "poster_prompt",
      "sms_text",
      "reel_script",
    ],
  },
  crm: {
    label: "CRM / Engagement",
    icon: "users",
    description: "Customer retention and engagement messages",
    contentTypes: ["churn_winback", "loyalty_reward", "birthday_greeting", "post_visit_message", "referral_invite"],
  },
  menu: {
    label: "Menu & Item Content",
    icon: "utensils",
    description: "Menu descriptions, combos, and food content",
    contentTypes: [
      "item_description",
      "combo_name",
      "new_item_idea",
      "food_image_prompt",
      "dietary_tags",
      "pairing_suggestion",
    ],
  },
  review: {
    label: "Review & Feedback Content",
    icon: "star",
    description: "Review responses and feedback management",
    contentTypes: ["review_reply", "review_to_social", "feedback_request", "testimonial_highlight"],
  },
  profile: {
    label: "Public Profile / Brand Story",
    icon: "building",
    description: "Brand story, about us, and profile content",
    contentTypes: ["about_us", "chef_intro", "brand_story", "tagline", "event_banner", "mission_statement"],
  },
  in_store: {
    label: "In-store & Utility Content",
    icon: "store",
    description: "Physical store materials and utility content",
    contentTypes: ["qr_flyer", "table_tent", "bill_footer", "chalkboard_special", "menu_header", "wifi_password_card"],
  },
  strategy: {
    label: "Strategy Copy & Automation",
    icon: "target",
    description: "Strategic content and automation copy",
    contentTypes: ["goal_explanation", "kpi_summary", "action_insight", "automation_message", "performance_report"],
  },
}

export const CONTENT_TONES: Record<
  ContentTone,
  {
    label: string
    description: string
    example: string
  }
> = {
  casual: {
    label: "Casual",
    description: "Relaxed and friendly tone",
    example: "Hey there! Come grab a bite with us!",
  },
  quirky: {
    label: "Quirky",
    description: "Fun and playful tone",
    example: "Warning: Our burgers may cause extreme happiness!",
  },
  gourmet: {
    label: "Gourmet",
    description: "Sophisticated and refined tone",
    example: "Experience culinary artistry in every bite",
  },
  emotional: {
    label: "Emotional",
    description: "Heartfelt and connecting tone",
    example: "Made with love, served with care",
  },
  professional: {
    label: "Professional",
    description: "Business-like and polished tone",
    example: "Quality dining experience since 1995",
  },
  friendly: {
    label: "Friendly",
    description: "Warm and welcoming tone",
    example: "Welcome to our family restaurant!",
  },
  elegant: {
    label: "Elegant",
    description: "Classy and upscale tone",
    example: "An exquisite dining destination",
  },
}
