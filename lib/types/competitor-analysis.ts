export interface Competitor {
  id: string
  restaurant_id: string
  name: string
  location: {
    address: string
    latitude: number
    longitude: number
    distance_km: number
  }
  business_type: "direct" | "indirect" | "aspirational"

  // Basic Info
  cuisine_types: string[]
  price_range: "budget" | "mid-range" | "premium" | "luxury"
  seating_capacity: number
  operating_hours: {
    [key: string]: { open: string; close: string; closed?: boolean }
  }

  // Menu Analysis
  menu_data: {
    total_items: number
    categories: string[]
    average_price: number
    price_range: { min: number; max: number }
    signature_dishes: string[]
    seasonal_items: string[]
    last_menu_update: string
  }

  // Social Media Presence
  social_presence: {
    instagram: {
      handle: string
      followers: number
      following: number
      posts_count: number
      engagement_rate: number
      posting_frequency: number // posts per week
      content_types: { [key: string]: number }
    }
    facebook: {
      page_name: string
      likes: number
      followers: number
      check_ins: number
      rating: number
      review_count: number
    }
    google_my_business: {
      rating: number
      review_count: number
      photos_count: number
      response_rate: number
      response_time: string
    }
  }

  // Performance Metrics
  performance_indicators: {
    estimated_monthly_revenue: number
    foot_traffic_estimate: number
    online_order_volume: number
    delivery_platforms: string[]
    peak_hours: string[]
    busy_days: string[]
  }

  // Competitive Intelligence
  competitive_analysis: {
    strengths: string[]
    weaknesses: string[]
    unique_selling_points: string[]
    marketing_strategies: string[]
    promotional_patterns: string[]
    seasonal_campaigns: string[]
  }

  // Tracking Data
  monitoring_status: "active" | "paused" | "inactive"
  data_sources: string[]
  last_updated: string
  created_at: string
  updated_at: string
}

export interface CompetitorPriceComparison {
  id: string
  restaurant_id: string
  competitor_id: string
  category: string

  our_item: {
    name: string
    price: number
    description: string
  }

  competitor_item: {
    name: string
    price: number
    description: string
    source: string
  }

  price_difference: number
  price_difference_percentage: number
  competitive_position: "cheaper" | "similar" | "expensive"

  analysis: {
    value_proposition: string
    recommendation: string
    action_required: boolean
  }

  tracked_at: string
}

export interface CompetitorSocialActivity {
  id: string
  restaurant_id: string
  competitor_id: string
  platform: "instagram" | "facebook" | "twitter" | "tiktok"

  post_data: {
    post_id: string
    content_type: "image" | "video" | "carousel" | "story" | "reel"
    caption: string
    hashtags: string[]
    mentions: string[]
    media_urls: string[]
  }

  engagement: {
    likes: number
    comments: number
    shares: number
    saves: number
    views?: number
  }

  content_analysis: {
    themes: string[]
    promotional_type: "menu_item" | "event" | "offer" | "brand" | "lifestyle"
    sentiment: "positive" | "neutral" | "negative"
    call_to_action: string
  }

  posted_at: string
  tracked_at: string
}

export interface CompetitorAnalytics {
  restaurant_id: string
  period: "weekly" | "monthly" | "quarterly"
  start_date: string
  end_date: string

  market_position: {
    rank_by_rating: number
    rank_by_reviews: number
    rank_by_social_engagement: number
    market_share_estimate: number
  }

  competitive_gaps: {
    menu_gaps: string[]
    pricing_opportunities: string[]
    service_gaps: string[]
    marketing_opportunities: string[]
  }

  threat_analysis: {
    new_competitors: Competitor[]
    growing_competitors: string[]
    declining_competitors: string[]
    market_trends: string[]
  }

  recommendations: {
    immediate_actions: string[]
    strategic_moves: string[]
    monitoring_priorities: string[]
  }

  generated_at: string
}
