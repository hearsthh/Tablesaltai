// Enhanced types for review manager

export interface ReviewResponseTemplate {
  id: string
  restaurant_id: string
  template_name: string
  template_text: string
  sentiment_target: "positive" | "negative" | "neutral"
  review_category?: string
  is_active: boolean
  usage_count: number
  created_at: string
  updated_at: string
}

export interface ReviewNotificationSettings {
  id: string
  restaurant_id: string
  email_notifications: boolean
  push_notifications: boolean
  sms_notifications: boolean
  notification_frequency: "realtime" | "hourly" | "daily" | "weekly"
  notification_types: string[]
  notification_threshold: number
  auto_response_enabled: boolean
  auto_response_delay_minutes: number
  business_hours_only: boolean
  created_at: string
  updated_at: string
}

export interface ReviewCategory {
  id: string
  restaurant_id: string
  category_name: string
  category_description?: string
  color_code?: string
  icon_name?: string
  is_active: boolean
  created_at: string
}

export interface ReviewTag {
  id: string
  restaurant_id: string
  tag_name: string
  tag_description?: string
  tag_color?: string
  usage_count: number
  is_active: boolean
  created_at: string
}

export interface ReviewAnalytics {
  id: string
  restaurant_id: string
  analysis_date: string
  total_reviews: number
  positive_reviews: number
  negative_reviews: number
  neutral_reviews: number
  avg_rating: number
  response_rate: number
  avg_response_time_hours: number
  sentiment_score: number
  trending_keywords: string[]
  top_complaints: string[]
  top_compliments: string[]
  created_at: string
}

export interface EnhancedReview {
  id: string
  restaurant_id: string
  author_name: string
  author_profile_url?: string
  author_photo_url?: string
  rating: number
  title?: string
  content: string

  // Platform information
  platform: string
  platform_review_id: string
  platform_url?: string
  platform_rating_scale: string

  // Review metadata
  review_date: string
  visit_date?: string
  verified: boolean
  helpful_votes: number
  total_votes: number

  // Media attachments
  photos: string[]
  videos: string[]

  // Detailed ratings
  food_rating?: number
  service_rating?: number
  ambiance_rating?: number
  value_rating?: number
  cleanliness_rating?: number

  // AI analysis
  sentiment: "positive" | "negative" | "neutral"
  sentiment_score: number
  emotion?: string
  topics: string[]
  keywords: string[]
  mentioned_items: string[]
  mentioned_staff: string[]

  // Review classification
  review_type: string
  visit_type: string
  party_size?: number
  occasion?: string

  // Response management
  has_response: boolean
  response_text?: string
  response_date?: string
  response_author?: string
  response_helpful_votes: number
  auto_response: boolean
  response_template_id?: string

  // Quality flags
  is_fake: boolean
  is_spam: boolean
  requires_attention: boolean
  moderation_status: string
  internal_notes?: string

  // Engagement metrics
  view_count: number
  share_count: number

  // Business impact
  influenced_bookings: number
  estimated_revenue_impact: number

  // Categories and tags
  categories: string[]
  tags: string[]
}

export interface ReviewManagerData {
  reviews: EnhancedReview[]
  response_templates: ReviewResponseTemplate[]
  categories: ReviewCategory[]
  tags: ReviewTag[]
  analytics: ReviewAnalytics[]
  notification_settings: ReviewNotificationSettings
  summary: {
    total_reviews: number
    avg_rating: number
    response_rate: number
    sentiment_distribution: {
      positive: number
      negative: number
      neutral: number
    }
    platform_breakdown: Record<string, number>
    monthly_trends: Array<{
      month: string
      reviews: number
      avg_rating: number
    }>
  }
}

export interface ReviewFilters {
  platform?: string[]
  rating?: number[]
  sentiment?: string[]
  date_range?: {
    start: string
    end: string
  }
  has_response?: boolean
  requires_attention?: boolean
  categories?: string[]
  tags?: string[]
  search_query?: string
}

export interface ReviewBulkActions {
  action: "respond" | "categorize" | "tag" | "mark_attention" | "export"
  review_ids: string[]
  data?: any
}
