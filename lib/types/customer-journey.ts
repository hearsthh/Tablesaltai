export interface CustomerTouchpoint {
  id: string
  customer_id: string
  restaurant_id: string

  touchpoint_type: "discovery" | "consideration" | "visit" | "order" | "experience" | "feedback" | "retention"
  channel:
    | "organic_search"
    | "social_media"
    | "word_of_mouth"
    | "paid_ads"
    | "email"
    | "sms"
    | "walk_in"
    | "delivery_app"

  interaction_data: {
    source: string
    medium: string
    campaign?: string
    content?: string
    term?: string
    referrer?: string
    device_type: "mobile" | "desktop" | "tablet"
    location: {
      latitude?: number
      longitude?: number
      city: string
    }
  }

  engagement_metrics: {
    time_spent_seconds?: number
    pages_viewed?: number
    actions_taken: string[]
    conversion_achieved: boolean
    conversion_value?: number
  }

  customer_intent: {
    intent_level: "awareness" | "interest" | "consideration" | "purchase" | "loyalty"
    search_keywords?: string[]
    content_consumed: string[]
    questions_asked: string[]
  }

  timestamp: string
}

export interface CustomerJourney {
  id: string
  customer_id: string
  restaurant_id: string

  journey_stage: "prospect" | "first_time" | "returning" | "loyal" | "churned"

  discovery_path: {
    first_touchpoint: CustomerTouchpoint
    discovery_channel: string
    discovery_content: string
    time_to_first_visit_days: number
  }

  consideration_phase: {
    touchpoints: CustomerTouchpoint[]
    research_duration_days: number
    comparison_competitors: string[]
    decision_factors: string[]
  }

  conversion_events: {
    first_order: {
      order_id: string
      order_value: number
      items_ordered: string[]
      order_channel: "dine_in" | "takeaway" | "delivery"
      conversion_time_days: number
    }
    subsequent_orders: {
      order_id: string
      order_value: number
      days_since_last_order: number
    }[]
  }

  experience_feedback: {
    satisfaction_scores: number[]
    review_ratings: number[]
    complaints: string[]
    compliments: string[]
    service_feedback: string[]
  }

  retention_metrics: {
    total_orders: number
    total_spent: number
    average_order_value: number
    order_frequency_days: number
    last_order_date: string
    churn_risk_score: number
  }

  journey_analytics: {
    total_journey_duration_days: number
    touchpoints_to_conversion: number
    most_influential_channel: string
    drop_off_points: string[]
    acceleration_factors: string[]
  }

  created_at: string
  updated_at: string
}

export interface JourneyAnalytics {
  restaurant_id: string
  period: "weekly" | "monthly" | "quarterly"
  start_date: string
  end_date: string

  funnel_metrics: {
    awareness_to_consideration: number // conversion rate
    consideration_to_visit: number
    visit_to_order: number
    first_order_to_repeat: number
    overall_conversion_rate: number
  }

  channel_performance: {
    channel: string
    traffic: number
    conversions: number
    conversion_rate: number
    customer_acquisition_cost: number
    lifetime_value: number
    roi: number
  }[]

  journey_insights: {
    average_journey_length_days: number
    most_effective_touchpoints: string[]
    common_drop_off_points: string[]
    high_value_customer_patterns: string[]
    churn_indicators: string[]
  }

  optimization_opportunities: {
    channel_improvements: string[]
    content_gaps: string[]
    experience_enhancements: string[]
    retention_strategies: string[]
  }

  generated_at: string
}
