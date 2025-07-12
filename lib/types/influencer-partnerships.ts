export interface Influencer {
  id: string
  restaurant_id: string

  profile_data: {
    name: string
    username: string
    platform: "instagram" | "youtube" | "tiktok" | "facebook" | "twitter"
    profile_url: string
    bio: string
    profile_image_url: string
    verified: boolean
  }

  audience_metrics: {
    follower_count: number
    following_count: number
    average_likes: number
    average_comments: number
    engagement_rate: number
    reach_estimate: number
    audience_growth_rate: number
  }

  audience_demographics: {
    age_groups: { [range: string]: number }
    gender_split: { [gender: string]: number }
    location_breakdown: { [city: string]: number }
    interests: string[]
    active_hours: string[]
  }

  content_analysis: {
    content_categories: string[]
    posting_frequency: number // posts per week
    content_quality_score: number
    brand_alignment_score: number
    previous_restaurant_collaborations: number
  }

  collaboration_history: {
    total_collaborations: number
    successful_campaigns: number
    average_performance: {
      reach: number
      engagement: number
      conversions: number
    }
    last_collaboration_date?: string
  }

  rates_and_terms: {
    rate_per_post: number
    rate_per_story: number
    rate_per_reel: number
    package_deals: {
      name: string
      description: string
      price: number
      deliverables: string[]
    }[]
    preferred_collaboration_type: "paid" | "barter" | "hybrid"
    exclusivity_requirements: string[]
  }

  contact_info: {
    email: string
    phone?: string
    manager_contact?: string
    preferred_contact_method: string
  }

  status: "prospective" | "contacted" | "negotiating" | "active" | "completed" | "blacklisted"

  created_at: string
  updated_at: string
}

export interface InfluencerCampaign {
  id: string
  restaurant_id: string
  influencer_id: string

  campaign_details: {
    name: string
    objective: "awareness" | "engagement" | "foot_traffic" | "sales" | "brand_building"
    brief: string
    deliverables: {
      type: "post" | "story" | "reel" | "video" | "live" | "review"
      quantity: number
      specifications: string[]
      due_date: string
    }[]
    hashtags_required: string[]
    mentions_required: string[]
    content_guidelines: string[]
  }

  commercial_terms: {
    total_budget: number
    payment_structure: "upfront" | "milestone" | "completion" | "performance"
    additional_perks: string[] // free meals, merchandise, etc.
    exclusivity_period_days: number
    usage_rights: string[]
  }

  timeline: {
    campaign_start: string
    content_creation_deadline: string
    posting_schedule: {
      content_type: string
      scheduled_date: string
      posted_date?: string
    }[]
    campaign_end: string
  }

  performance_tracking: {
    content_delivered: {
      type: string
      url: string
      posted_date: string
      metrics: {
        likes: number
        comments: number
        shares: number
        views?: number
        saves?: number
        reach: number
      }
    }[]

    campaign_metrics: {
      total_reach: number
      total_engagement: number
      website_clicks: number
      foot_traffic_increase: number
      sales_attributed: number
      roi: number
    }

    audience_response: {
      sentiment: "positive" | "neutral" | "negative"
      comments_analysis: string[]
      user_generated_content: string[]
      follow_up_inquiries: number
    }
  }

  status: "planned" | "active" | "content_review" | "published" | "completed" | "cancelled"

  created_at: string
  updated_at: string
}

export interface AffiliatePartner {
  id: string
  restaurant_id: string

  partner_info: {
    name: string
    type: "food_blogger" | "lifestyle_influencer" | "local_celebrity" | "corporate_partner" | "community_group"
    contact_person: string
    email: string
    phone: string
    website?: string
    social_handles: { [platform: string]: string }
  }

  partnership_terms: {
    commission_rate: number
    commission_type: "percentage" | "fixed_amount"
    minimum_sales_threshold: number
    payment_frequency: "monthly" | "quarterly" | "per_transaction"
    tracking_method: "referral_code" | "affiliate_link" | "qr_code"
    exclusive_territory?: string
  }

  tracking_data: {
    referral_code: string
    affiliate_link: string
    qr_code_url?: string
    tracking_pixels: string[]
  }

  performance_metrics: {
    total_referrals: number
    successful_conversions: number
    conversion_rate: number
    total_sales_generated: number
    commission_earned: number
    average_order_value: number
    customer_lifetime_value: number
  }

  relationship_management: {
    onboarding_date: string
    last_contact_date: string
    relationship_status: "active" | "inactive" | "pending" | "terminated"
    performance_rating: number // 1-5
    notes: string[]
    renewal_date?: string
  }

  created_at: string
  updated_at: string
}

export interface PRCampaign {
  id: string
  restaurant_id: string

  campaign_info: {
    name: string
    type: "product_launch" | "event_promotion" | "crisis_management" | "brand_building" | "award_announcement"
    description: string
    target_audience: string[]
    key_messages: string[]
    media_kit_url?: string
  }

  media_outreach: {
    press_release: {
      title: string
      content: string
      distribution_date: string
      media_contacts: string[]
    }
    media_list: {
      outlet_name: string
      contact_person: string
      email: string
      phone: string
      outlet_type: "newspaper" | "magazine" | "blog" | "tv" | "radio" | "podcast"
      reach_estimate: number
    }[]
  }

  coverage_tracking: {
    media_mention: {
      outlet_name: string
      publication_date: string
      article_title: string
      article_url: string
      mention_type: "feature" | "mention" | "quote" | "review"
      sentiment: "positive" | "neutral" | "negative"
      reach_estimate: number
      key_quotes: string[]
    }[]

    social_amplification: {
      shares_count: number
      social_mentions: number
      hashtag_usage: { [hashtag: string]: number }
      influencer_pickup: string[]
    }
  }

  campaign_results: {
    total_media_impressions: number
    earned_media_value: number
    website_traffic_increase: number
    social_media_growth: number
    brand_awareness_lift: number
    sales_impact: number
  }

  status: "planning" | "outreach" | "active" | "monitoring" | "completed"

  created_at: string
  updated_at: string
}

export interface PartnershipAnalytics {
  restaurant_id: string
  period: "monthly" | "quarterly" | "yearly"
  start_date: string
  end_date: string

  influencer_performance: {
    total_campaigns: number
    active_influencers: number
    total_reach: number
    total_engagement: number
    average_engagement_rate: number
    total_investment: number
    total_revenue_attributed: number
    roi: number

    top_performers: {
      influencer_name: string
      campaigns_completed: number
      total_reach: number
      engagement_rate: number
      sales_generated: number
      roi: number
    }[]
  }

  affiliate_performance: {
    active_affiliates: number
    total_referrals: number
    conversion_rate: number
    total_sales: number
    commission_paid: number
    average_order_value: number

    top_affiliates: {
      partner_name: string
      referrals: number
      conversions: number
      sales_generated: number
      commission_earned: number
    }[]
  }

  pr_impact: {
    campaigns_executed: number
    media_mentions: number
    total_reach: number
    earned_media_value: number
    sentiment_score: number
    brand_awareness_impact: number
  }

  recommendations: {
    budget_allocation: { [channel: string]: number }
    partnership_opportunities: string[]
    performance_improvements: string[]
    risk_mitigation: string[]
  }

  generated_at: string
}
