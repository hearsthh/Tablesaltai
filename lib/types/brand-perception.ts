export interface SocialMention {
  id: string
  restaurant_id: string

  mention_data: {
    platform: "instagram" | "facebook" | "twitter" | "tiktok" | "youtube" | "google_reviews" | "zomato" | "swiggy"
    post_id: string
    author: {
      username: string
      follower_count?: number
      verified: boolean
      influence_score: number
    }
    content: string
    media_urls: string[]
    hashtags: string[]
    mentions: string[]
  }

  sentiment_analysis: {
    overall_sentiment: "very_positive" | "positive" | "neutral" | "negative" | "very_negative"
    sentiment_score: number // -1 to 1
    emotion_detected: "joy" | "anger" | "sadness" | "fear" | "surprise" | "disgust" | "neutral"
    confidence_level: number
  }

  content_categorization: {
    mention_type: "review" | "recommendation" | "complaint" | "question" | "compliment" | "tag" | "check_in"
    topics_mentioned: string[]
    aspects_rated: {
      food_quality?: number
      service?: number
      ambiance?: number
      value_for_money?: number
      cleanliness?: number
    }
    keywords_extracted: string[]
  }

  engagement_metrics: {
    likes: number
    comments: number
    shares: number
    views?: number
    reach_estimate: number
    engagement_rate: number
  }

  business_impact: {
    impact_level: "high" | "medium" | "low"
    requires_response: boolean
    response_urgency: "immediate" | "within_24h" | "within_week" | "no_rush"
    potential_reach: number
  }

  mentioned_at: string
  tracked_at: string
}

export interface BrandSentimentTrend {
  id: string
  restaurant_id: string
  date: string

  daily_metrics: {
    total_mentions: number
    positive_mentions: number
    negative_mentions: number
    neutral_mentions: number
    sentiment_score: number
    reach: number
    engagement: number
  }

  trending_topics: {
    topic: string
    mention_count: number
    sentiment: "positive" | "negative" | "neutral"
    trend_direction: "rising" | "falling" | "stable"
  }[]

  platform_breakdown: {
    platform: string
    mentions: number
    sentiment_score: number
    engagement: number
  }[]

  competitor_comparison: {
    competitor_name: string
    their_mentions: number
    their_sentiment: number
    share_of_voice: number
  }[]
}

export interface ShareOfVoice {
  restaurant_id: string
  period: "daily" | "weekly" | "monthly"
  start_date: string
  end_date: string

  market_metrics: {
    total_market_mentions: number
    our_mentions: number
    our_share_percentage: number
    rank_in_market: number
  }

  competitor_analysis: {
    competitor_id: string
    competitor_name: string
    mentions: number
    share_percentage: number
    sentiment_score: number
    engagement_rate: number
  }[]

  category_performance: {
    category: string // e.g., "italian_restaurants", "fine_dining"
    our_position: number
    total_competitors: number
    market_leader: string
    growth_opportunity: number
  }[]

  insights: {
    trending_up: string[]
    trending_down: string[]
    opportunities: string[]
    threats: string[]
  }

  generated_at: string
}

export interface BrandPerceptionAnalytics {
  restaurant_id: string

  overall_health: {
    brand_health_score: number // 0-100
    sentiment_trend: "improving" | "declining" | "stable"
    reputation_risk_level: "low" | "medium" | "high"
    response_rate: number
    average_response_time_hours: number
  }

  perception_drivers: {
    positive_drivers: {
      aspect: string
      mention_count: number
      impact_score: number
    }[]
    negative_drivers: {
      aspect: string
      mention_count: number
      impact_score: number
    }[]
  }

  audience_insights: {
    demographics: {
      age_groups: { [range: string]: number }
      gender_split: { [gender: string]: number }
      location_breakdown: { [city: string]: number }
    }
    influencer_mentions: {
      username: string
      follower_count: number
      engagement_rate: number
      sentiment: string
      reach_impact: number
    }[]
  }

  actionable_insights: {
    immediate_actions: string[]
    content_opportunities: string[]
    reputation_management: string[]
    competitive_responses: string[]
  }

  last_updated: string
}
