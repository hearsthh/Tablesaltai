export interface LocalEvent {
  id: string
  restaurant_id: string
  name: string
  description: string
  event_type: "festival" | "concert" | "sports" | "conference" | "holiday" | "weather" | "construction"

  location: {
    venue: string
    address: string
    latitude: number
    longitude: number
    distance_from_restaurant_km: number
  }

  timing: {
    start_date: string
    end_date: string
    start_time?: string
    end_time?: string
    timezone: string
    duration_hours: number
  }

  impact_assessment: {
    expected_foot_traffic_change: number // percentage
    target_audience_overlap: number // percentage
    revenue_impact_estimate: number
    impact_level: "high" | "medium" | "low"
    impact_type: "positive" | "negative" | "neutral"
  }

  marketing_opportunities: {
    promotional_ideas: string[]
    menu_adjustments: string[]
    staffing_recommendations: string[]
    inventory_suggestions: string[]
  }

  data_source: "manual" | "eventbrite" | "facebook_events" | "google_events" | "weather_api"
  source_url?: string
  created_at: string
  updated_at: string
}

export interface WeatherPattern {
  id: string
  restaurant_id: string
  date: string

  weather_data: {
    temperature_celsius: number
    humidity: number
    precipitation_mm: number
    wind_speed_kmh: number
    weather_condition: "sunny" | "cloudy" | "rainy" | "stormy" | "snowy"
    visibility_km: number
  }

  business_impact: {
    foot_traffic_change: number // percentage
    delivery_orders_change: number // percentage
    dine_in_change: number // percentage
    revenue_impact: number
    popular_items: string[]
    slow_items: string[]
  }

  correlations: {
    temperature_revenue_correlation: number
    rain_delivery_correlation: number
    weather_menu_preferences: { [weather: string]: string[] }
  }

  recorded_at: string
}

export interface SeasonalTrend {
  id: string
  restaurant_id: string
  season: "spring" | "summer" | "monsoon" | "autumn" | "winter"
  year: number

  business_patterns: {
    peak_months: string[]
    slow_months: string[]
    average_daily_revenue: number
    customer_behavior_changes: string[]
    popular_menu_categories: string[]
    promotional_effectiveness: { [promo_type: string]: number }
  }

  market_trends: {
    local_preferences: string[]
    competitor_activities: string[]
    pricing_patterns: string[]
    event_calendar_impact: string[]
  }

  recommendations: {
    menu_adjustments: string[]
    marketing_strategies: string[]
    inventory_planning: string[]
    staffing_suggestions: string[]
  }

  data_period: {
    start_date: string
    end_date: string
  }

  generated_at: string
}

export interface LocalMarketInsights {
  restaurant_id: string
  location_analysis: {
    neighborhood_type: "residential" | "commercial" | "mixed" | "tourist" | "business_district"
    foot_traffic_patterns: {
      weekday_peak_hours: string[]
      weekend_peak_hours: string[]
      seasonal_variations: string[]
    }
    demographic_profile: {
      age_groups: { [range: string]: number }
      income_levels: { [level: string]: number }
      lifestyle_preferences: string[]
    }
  }

  market_opportunities: {
    underserved_segments: string[]
    trending_cuisines: string[]
    price_point_gaps: string[]
    service_gaps: string[]
  }

  external_factors: {
    upcoming_developments: string[]
    transportation_changes: string[]
    regulatory_changes: string[]
    economic_indicators: string[]
  }

  last_updated: string
}
