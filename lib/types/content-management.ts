export interface ContentAsset {
  id: string
  restaurant_id: string
  category: ContentCategory
  subcategory: string
  title: string
  description?: string
  file_url: string
  file_type: "image" | "video" | "audio" | "document" | "template"
  file_size: number
  dimensions?: {
    width: number
    height: number
  }
  duration?: number // for videos/audio in seconds
  tags: string[]
  metadata: Record<string, any>
  ai_generated: boolean
  ai_prompt?: string
  usage_rights: "owned" | "licensed" | "user_generated" | "stock"
  status: "draft" | "approved" | "published" | "archived"
  created_at: string
  updated_at: string
  created_by: string
  approved_by?: string
}

export type ContentCategory =
  | "brand_profile_media"
  | "menu_dish_media"
  | "short_videos"
  | "restaurant_space_experience"
  | "campaign_ready_content"
  | "optional_advanced_media"

// Brand & Profile Media
export interface BrandProfileMedia {
  logo: {
    primary: ContentAsset
    variations: ContentAsset[] // dark, light, monochrome versions
    favicon: ContentAsset
  }
  cover_images: {
    social_media: ContentAsset[]
    website_hero: ContentAsset[]
    email_headers: ContentAsset[]
  }
  tagline_images: {
    with_logo: ContentAsset[]
    standalone: ContentAsset[]
    animated: ContentAsset[]
  }
  qr_codes: {
    menu: ContentAsset
    reviews: ContentAsset
    social_media: ContentAsset
    wifi: ContentAsset
    custom: ContentAsset[]
  }
}

// Menu & Dish Media
export interface MenuDishMedia {
  dish_photos: {
    asset_id: string
    menu_item_id: string
    photo_type: "hero" | "detail" | "ingredient" | "process"
    styling: "professional" | "casual" | "lifestyle"
    lighting: "natural" | "studio" | "ambient"
    angle: "top_down" | "side" | "45_degree" | "close_up"
    background: string
    props: string[]
  }[]
  menu_enhancers: {
    category_headers: ContentAsset[]
    section_dividers: ContentAsset[]
    price_callouts: ContentAsset[]
    special_badges: ContentAsset[]
  }
  express_tags: {
    dietary: ContentAsset[] // vegan, gluten-free, etc.
    preparation: ContentAsset[] // spicy, mild, etc.
    popularity: ContentAsset[] // bestseller, chef's special
    seasonal: ContentAsset[] // summer special, winter warmer
  }
}

// Short Videos
export interface ShortVideos {
  plating_videos: {
    asset_id: string
    dish_id: string
    duration: number
    style: "time_lapse" | "real_time" | "slow_motion"
    angle: "overhead" | "side" | "chef_pov"
    music: boolean
    captions: boolean
  }[]
  chef_intro: {
    chef_name: string
    specialties: string[]
    experience_years: number
    signature_dishes: string[]
    personality_type: "formal" | "casual" | "energetic" | "calm"
  }[]
  restaurant_tour: {
    areas_covered: ("entrance" | "dining" | "kitchen" | "bar" | "outdoor")[]
    tour_style: "guided" | "cinematic" | "customer_pov"
    highlights: string[]
    background_music: boolean
  }[]
  event_promo: {
    event_type: string
    event_date: string
    call_to_action: string
    urgency_level: "low" | "medium" | "high"
  }[]
  review_montage: {
    review_sources: ("google" | "yelp" | "zomato" | "social_media")[]
    sentiment_focus: "positive" | "mixed" | "testimonial"
    visual_style: "text_overlay" | "customer_photos" | "animated"
  }[]
}

// Restaurant Space & Experience
export interface RestaurantSpaceExperience {
  ambience_photos: {
    time_of_day: "morning" | "afternoon" | "evening" | "night"
    lighting_mood: "bright" | "dim" | "romantic" | "energetic"
    occupancy: "empty" | "partial" | "full"
    season: "spring" | "summer" | "fall" | "winter"
    special_occasions: string[]
  }[]
  kitchen_bts: {
    area: "prep" | "cooking" | "plating" | "cleaning"
    activity: string
    staff_visible: boolean
    equipment_focus: string[]
    hygiene_highlight: boolean
  }[]
  team_portraits: {
    person_name: string
    role: string
    years_experience: number
    specialties: string[]
    personality_traits: string[]
    photo_style: "professional" | "candid" | "action"
  }[]
  event_decor: {
    event_type: string
    theme: string
    color_scheme: string[]
    decorative_elements: string[]
    setup_complexity: "simple" | "moderate" | "elaborate"
  }[]
  customer_photos: {
    photo_type: "dining" | "celebration" | "group" | "food_enjoyment"
    customer_consent: boolean
    usage_permission: "social_media" | "website" | "marketing" | "all"
    demographic: string
    occasion: string
  }[]
}

// Campaign-Ready Content Units (AI-generated)
export interface CampaignReadyContent {
  offers_coupons: {
    offer_type: "discount" | "bogo" | "free_item" | "combo_deal"
    discount_percentage?: number
    discount_amount?: number
    minimum_order?: number
    valid_until: string
    terms_conditions: string[]
    target_audience: string[]
    urgency_indicators: string[]
  }[]
  item_highlights: {
    menu_item_id: string
    highlight_reason: "new" | "popular" | "seasonal" | "chef_special"
    key_features: string[]
    price_point: "budget" | "mid_range" | "premium"
    target_time: "breakfast" | "lunch" | "dinner" | "snack"
  }[]
  social_posts: {
    platform: "instagram" | "facebook" | "twitter" | "linkedin"
    post_type: "feed" | "story" | "reel" | "carousel"
    content_theme: string
    hashtags: string[]
    call_to_action: string
    optimal_posting_time: string
    engagement_prediction: number
  }[]
  reels_prompts: {
    concept: string
    script_outline: string[]
    visual_elements: string[]
    music_suggestion: string
    trending_elements: string[]
    estimated_engagement: number
  }[]
  whatsapp_cards: {
    card_type: "menu" | "offer" | "event" | "contact" | "location"
    content_blocks: {
      type: "text" | "image" | "button" | "list"
      content: string
      action?: string
    }[]
    personalization_fields: string[]
  }[]
  email_sms_texts: {
    message_type: "promotional" | "transactional" | "reminder" | "welcome"
    channel: "email" | "sms" | "both"
    subject_line?: string
    content_blocks: {
      type: "header" | "body" | "cta" | "footer"
      content: string
      personalization: boolean
    }[]
    send_triggers: string[]
    target_segments: string[]
  }[]
  review_responses: {
    review_rating: 1 | 2 | 3 | 4 | 5
    review_sentiment: "positive" | "negative" | "neutral"
    response_tone: "professional" | "friendly" | "apologetic" | "grateful"
    key_points_addressed: string[]
    personalization_level: "generic" | "semi_personal" | "highly_personal"
    follow_up_action: string[]
  }[]
  qr_code_generator: {
    qr_type: "menu" | "review" | "social" | "wifi" | "payment" | "custom"
    destination_url: string
    design_style: "minimal" | "branded" | "colorful" | "artistic"
    logo_embedded: boolean
    call_to_action_text: string
    tracking_enabled: boolean
  }[]
}

// Optional & Advanced Media
export interface OptionalAdvancedMedia {
  user_generated: {
    source: "instagram" | "facebook" | "tiktok" | "google_reviews"
    content_type: "photo" | "video" | "review" | "story"
    user_handle: string
    engagement_metrics: {
      likes: number
      comments: number
      shares: number
      views?: number
    }
    usage_permission: boolean
    brand_mention: boolean
    hashtags_used: string[]
  }[]
  raw_footage: {
    footage_type: "cooking_process" | "customer_reactions" | "events" | "daily_operations"
    duration: number
    quality: "720p" | "1080p" | "4k"
    format: "mp4" | "mov" | "avi"
    editing_notes: string[]
    potential_uses: string[]
  }[]
  seasonal_templates: {
    season: "spring" | "summer" | "fall" | "winter"
    occasion: "holiday" | "festival" | "celebration" | "general"
    template_type: "social_post" | "email" | "menu_design" | "promotional"
    color_palette: string[]
    design_elements: string[]
    customizable_fields: string[]
  }[]
  metadata: {
    asset_id: string
    keywords: string[]
    color_analysis: {
      dominant_colors: string[]
      color_mood: string
      brand_alignment: number
    }
    technical_specs: {
      resolution: string
      file_format: string
      compression: string
      color_space: string
    }
    usage_analytics: {
      times_used: number
      performance_score: number
      engagement_generated: number
      conversion_rate: number
    }
    ai_analysis: {
      content_description: string
      quality_score: number
      brand_consistency: number
      improvement_suggestions: string[]
    }
  }[]
}

// Main Content Management Interface
export interface ContentManagementSystem {
  restaurant_id: string
  brand_profile_media: BrandProfileMedia
  menu_dish_media: MenuDishMedia
  short_videos: ShortVideos
  restaurant_space_experience: RestaurantSpaceExperience
  campaign_ready_content: CampaignReadyContent
  optional_advanced_media: OptionalAdvancedMedia
  content_calendar: {
    scheduled_content: {
      asset_id: string
      platform: string
      scheduled_time: string
      status: "scheduled" | "published" | "failed"
      performance_prediction: number
    }[]
  }
  content_analytics: {
    total_assets: number
    ai_generated_percentage: number
    most_used_categories: string[]
    performance_by_category: Record<string, number>
    storage_usage: {
      total_mb: number
      by_category: Record<string, number>
    }
  }
  workflow_status: {
    content_creation_pipeline: {
      pending_requests: number
      in_progress: number
      completed_today: number
      approval_queue: number
    }
    ai_generation_status: {
      credits_remaining: number
      generation_queue: number
      failed_generations: number
    }
  }
  created_at: string
  updated_at: string
}

// Content Request/Generation Interface
export interface ContentRequest {
  id: string
  restaurant_id: string
  request_type: "ai_generation" | "professional_shoot" | "user_upload"
  category: ContentCategory
  subcategory: string
  specifications: {
    dimensions?: string
    duration?: number
    style_preferences: string[]
    brand_guidelines: boolean
    rush_order: boolean
  }
  ai_prompt?: string
  reference_images?: string[]
  deadline: string
  budget?: number
  status: "pending" | "in_progress" | "review" | "approved" | "delivered" | "rejected"
  assigned_to?: string
  created_at: string
  completed_at?: string
  feedback?: string
  revision_count: number
}
