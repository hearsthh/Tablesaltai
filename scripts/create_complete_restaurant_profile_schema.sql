-- Complete Restaurant Profile Schema with All Required Fields
-- Includes chef info, media assets, awards, sales data, and comprehensive review management

-- Drop existing tables if they exist
DROP TABLE IF EXISTS mock_daily_sales CASCADE;
DROP TABLE IF EXISTS mock_media_assets CASCADE;
DROP TABLE IF EXISTS mock_awards_certifications CASCADE;
DROP TABLE IF EXISTS mock_press_coverage CASCADE;
DROP TABLE IF EXISTS mock_generated_content CASCADE;
DROP TABLE IF EXISTS mock_platform_integrations CASCADE;
DROP TABLE IF EXISTS mock_marketing_campaigns CASCADE;
DROP TABLE IF EXISTS mock_reviews CASCADE;
DROP TABLE IF EXISTS mock_customers CASCADE;
DROP TABLE IF EXISTS mock_menu_items CASCADE;
DROP TABLE IF EXISTS mock_menu_categories CASCADE;
DROP TABLE IF EXISTS mock_restaurants CASCADE;

-- Main restaurants table with complete profile fields
CREATE TABLE mock_restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Information
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    cuisine_type VARCHAR(100) NOT NULL,
    restaurant_type VARCHAR(100) NOT NULL,
    price_range VARCHAR(10) NOT NULL,
    
    -- Location Details
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Contact Information
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    
    -- Business Details
    description TEXT,
    tagline VARCHAR(255),
    concept TEXT,
    story TEXT,
    history TEXT,
    established_year INTEGER,
    seating_capacity INTEGER,
    
    -- Chef Information
    chef_name VARCHAR(255),
    chef_title VARCHAR(100), -- Head Chef, Executive Chef, etc.
    chef_bio TEXT,
    chef_photo_url TEXT,
    chef_experience_years INTEGER,
    chef_specialties TEXT[],
    chef_awards TEXT[],
    chef_social_media JSONB,
    
    -- Brand Assets
    logo_url TEXT,
    logo_dark_url TEXT, -- for dark themes
    favicon_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#1f2937',
    secondary_color VARCHAR(7) DEFAULT '#6b7280',
    accent_color VARCHAR(7),
    brand_voice TEXT,
    brand_positioning VARCHAR(100),
    brand_guidelines TEXT,
    
    -- Visual Identity
    hero_image_url TEXT,
    cover_image_url TEXT,
    interior_images TEXT[], -- array of image URLs
    exterior_images TEXT[], -- array of image URLs
    food_images TEXT[], -- array of food photo URLs
    ambiance_images TEXT[], -- array of ambiance photos
    
    -- Operating Information
    operating_hours JSONB DEFAULT '{
        "monday": {"open": "11:00", "close": "22:00", "closed": false},
        "tuesday": {"open": "11:00", "close": "22:00", "closed": false},
        "wednesday": {"open": "11:00", "close": "22:00", "closed": false},
        "thursday": {"open": "11:00", "close": "22:00", "closed": false},
        "friday": {"open": "11:00", "close": "23:00", "closed": false},
        "saturday": {"open": "11:00", "close": "23:00", "closed": false},
        "sunday": {"open": "12:00", "close": "22:00", "closed": false}
    }',
    special_hours JSONB, -- holiday hours, special events
    
    -- Amenities and Features
    amenities TEXT[],
    payment_methods TEXT[],
    dining_options TEXT[], -- dine-in, takeout, delivery, catering
    special_features TEXT[], -- live music, outdoor seating, private dining
    accessibility_features TEXT[],
    
    -- Social Media Presence
    social_media JSONB DEFAULT '{}',
    social_media_followers JSONB, -- follower counts per platform
    
    -- Business Metrics
    avg_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    monthly_revenue DECIMAL(12,2),
    monthly_orders INTEGER,
    avg_order_value DECIMAL(10,2),
    customer_satisfaction_score DECIMAL(3,2),
    
    -- Recognition and Awards
    awards_count INTEGER DEFAULT 0,
    certifications_count INTEGER DEFAULT 0,
    press_mentions_count INTEGER DEFAULT 0,
    
    -- Operational Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    verification_date TIMESTAMP WITH TIME ZONE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- AI and Automation Settings
    ai_profile_generated BOOLEAN DEFAULT false,
    auto_response_enabled BOOLEAN DEFAULT false,
    content_sync_enabled BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Awards and Certifications
CREATE TABLE mock_awards_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES mock_restaurants(id) ON DELETE CASCADE,
    
    type VARCHAR(50) NOT NULL, -- 'award', 'certification', 'recognition'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    issuing_organization VARCHAR(255),
    date_received DATE,
    expiry_date DATE,
    certificate_url TEXT,
    badge_url TEXT,
    
    -- Award Details
    category VARCHAR(100), -- 'food_quality', 'service', 'ambiance', 'sustainability'
    level VARCHAR(50), -- 'local', 'regional', 'national', 'international'
    year INTEGER,
    
    -- Display Settings
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Press Coverage and Media Mentions
CREATE TABLE mock_press_coverage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES mock_restaurants(id) ON DELETE CASCADE,
    
    title VARCHAR(500) NOT NULL,
    publication VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    publication_date DATE,
    article_url TEXT,
    
    -- Content
    excerpt TEXT,
    full_content TEXT,
    featured_image_url TEXT,
    
    -- Classification
    coverage_type VARCHAR(50), -- 'review', 'feature', 'news', 'interview'
    sentiment VARCHAR(20), -- 'positive', 'neutral', 'negative'
    reach_estimate INTEGER, -- estimated readership
    
    -- Social Media Metrics
    social_shares INTEGER DEFAULT 0,
    social_engagement INTEGER DEFAULT 0,
    
    -- Display Settings
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media Assets (Photos, Videos, Documents)
CREATE TABLE mock_media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES mock_restaurants(id) ON DELETE CASCADE,
    
    -- File Information
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(20) NOT NULL, -- 'image', 'video', 'document'
    file_size INTEGER, -- in bytes
    mime_type VARCHAR(100),
    
    -- Image/Video Properties
    width INTEGER,
    height INTEGER,
    duration INTEGER, -- for videos, in seconds
    
    -- Categorization
    category VARCHAR(50) NOT NULL, -- 'food', 'interior', 'exterior', 'staff', 'events', 'menu', 'logo'
    subcategory VARCHAR(50), -- 'appetizers', 'main_course', 'desserts', 'dining_area', 'kitchen'
    tags TEXT[],
    
    -- Content Details
    title VARCHAR(255),
    description TEXT,
    alt_text TEXT,
    caption TEXT,
    photographer_credit VARCHAR(255),
    
    -- Usage and Display
    is_hero BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    -- Performance Metrics
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    last_used TIMESTAMP WITH TIME ZONE,
    
    -- AI Generated Content
    ai_generated BOOLEAN DEFAULT false,
    ai_prompt TEXT,
    ai_model VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu categories
CREATE TABLE mock_menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES mock_restaurants(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    
    -- Category Properties
    category_type VARCHAR(50) DEFAULT 'regular', -- 'regular', 'seasonal', 'special', 'combo'
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    
    -- Availability
    available_days TEXT[], -- days of week when available
    available_times JSONB, -- time ranges when available
    
    -- Display Settings
    display_order INTEGER DEFAULT 0,
    color_theme VARCHAR(7),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu items with comprehensive details
CREATE TABLE mock_menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES mock_restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES mock_menu_categories(id) ON DELETE CASCADE,
    
    -- Basic Item Information
    name VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    ingredients TEXT[],
    preparation_method TEXT,
    
    -- Pricing
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2), -- cost to make
    original_price DECIMAL(10,2), -- for discount calculations
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    
    -- Media
    image_url TEXT,
    gallery_images TEXT[],
    video_url TEXT,
    
    -- Classifications and Tags
    taste_tags TEXT[], -- spicy, mild, sweet, sour, etc.
    dietary_tags TEXT[], -- vegetarian, vegan, gluten-free, etc.
    allergen_tags TEXT[], -- nuts, dairy, eggs, etc.
    promo_tags TEXT[], -- popular, signature, chef-special, etc.
    cuisine_tags TEXT[], -- north-indian, italian, chinese, etc.
    
    -- Properties
    spice_level VARCHAR(20) DEFAULT 'medium', -- mild, medium, hot, extra-hot
    portion_size VARCHAR(50), -- small, medium, large, family
    preparation_time INTEGER, -- in minutes
    calories_per_serving INTEGER,
    
    -- Nutritional Information
    protein_g DECIMAL(5,2),
    carbs_g DECIMAL(5,2),
    fat_g DECIMAL(5,2),
    fiber_g DECIMAL(5,2),
    sugar_g DECIMAL(5,2),
    sodium_mg DECIMAL(7,2),
    
    -- Availability and Stock
    is_available BOOLEAN DEFAULT true,
    is_in_stock BOOLEAN DEFAULT true,
    stock_quantity INTEGER,
    low_stock_threshold INTEGER DEFAULT 10,
    
    -- Seasonal and Time-based Availability
    is_seasonal BOOLEAN DEFAULT false,
    seasonal_months INTEGER[], -- months when available (1-12)
    available_days TEXT[], -- days of week
    available_times JSONB, -- time ranges
    
    -- Performance Metrics (Last 30 Days)
    total_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    avg_rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    return_customer_rate DECIMAL(5,2) DEFAULT 0,
    
    -- AI Insights and Recommendations
    popularity_score DECIMAL(3,2) DEFAULT 0,
    profitability_score DECIMAL(3,2) DEFAULT 0,
    pricing_status VARCHAR(20) DEFAULT 'optimal', -- 'optimal', 'underpriced', 'overpriced'
    demand_trend VARCHAR(20) DEFAULT 'stable', -- 'increasing', 'stable', 'declining'
    recommended_price DECIMAL(10,2),
    
    -- Combo and Pairing Suggestions
    suggested_pairings TEXT[], -- item IDs that go well together
    combo_items TEXT[], -- items that are part of this combo
    
    -- Display and Ordering
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_ordered TIMESTAMP WITH TIME ZONE
);

-- Daily Sales Data for Menu Items (Last 30+ Days)
CREATE TABLE mock_daily_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES mock_restaurants(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES mock_menu_items(id) ON DELETE CASCADE,
    
    sale_date DATE NOT NULL,
    
    -- Daily Metrics
    quantity_sold INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    cost DECIMAL(10,2) DEFAULT 0,
    profit DECIMAL(10,2) DEFAULT 0,
    
    -- Order Details
    total_orders INTEGER DEFAULT 0, -- number of orders containing this item
    avg_order_value DECIMAL(10,2) DEFAULT 0,
    peak_hour INTEGER, -- hour of day with most sales (0-23)
    
    -- Customer Metrics
    new_customers INTEGER DEFAULT 0,
    returning_customers INTEGER DEFAULT 0,
    customer_satisfaction DECIMAL(3,2) DEFAULT 0,
    
    -- Operational Metrics
    preparation_time_avg INTEGER, -- average prep time in minutes
    waste_quantity INTEGER DEFAULT 0, -- items wasted/returned
    stock_used INTEGER DEFAULT 0,
    
    -- External Factors
    weather VARCHAR(50), -- sunny, rainy, cloudy, etc.
    day_type VARCHAR(20), -- weekday, weekend, holiday
    special_events TEXT[], -- events that might affect sales
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one record per item per day
    UNIQUE(menu_item_id, sale_date)
);

-- Customer data with comprehensive profiles
CREATE TABLE mock_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES mock_restaurants(id) ON DELETE CASCADE,
    
    -- Basic Information
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    
    -- Demographics
    age INTEGER,
    gender VARCHAR(20),
    location VARCHAR(255),
    income_range VARCHAR(50),
    occupation VARCHAR(100),
    family_size INTEGER,
    
    -- Behavioral Patterns
    visit_frequency INTEGER DEFAULT 1, -- visits per month
    avg_spend DECIMAL(10,2),
    total_spent DECIMAL(12,2) DEFAULT 0,
    total_visits INTEGER DEFAULT 0,
    last_visit TIMESTAMP WITH TIME ZONE,
    first_visit TIMESTAMP WITH TIME ZONE,
    
    -- Preferences and Habits
    preferred_cuisine TEXT[],
    dietary_restrictions TEXT[],
    favorite_items TEXT[], -- menu item IDs
    disliked_items TEXT[], -- menu item IDs
    preferred_time VARCHAR(20), -- breakfast, lunch, dinner, late_night
    preferred_day VARCHAR(20), -- weekday, weekend
    preferred_table_size INTEGER,
    
    -- Engagement and Loyalty
    loyalty_tier VARCHAR(20) DEFAULT 'new', -- new, regular, vip, champion
    loyalty_points INTEGER DEFAULT 0,
    referrals_made INTEGER DEFAULT 0,
    churn_risk VARCHAR(20) DEFAULT 'low', -- low, medium, high
    lifetime_value DECIMAL(12,2) DEFAULT 0,
    acquisition_cost DECIMAL(10,2) DEFAULT 0,
    satisfaction_score DECIMAL(3,2) DEFAULT 0,
    
    -- Communication Preferences
    email_subscribed BOOLEAN DEFAULT false,
    sms_subscribed BOOLEAN DEFAULT false,
    push_notifications BOOLEAN DEFAULT false,
    marketing_consent BOOLEAN DEFAULT false,
    preferred_contact_method VARCHAR(20), -- email, sms, phone, app
    
    -- Order History Summary
    total_orders INTEGER DEFAULT 0,
    avg_order_value DECIMAL(10,2) DEFAULT 0,
    preferred_order_type VARCHAR(20), -- dine_in, takeaway, delivery
    payment_method VARCHAR(50),
    
    -- Special Occasions
    birthday DATE,
    anniversary DATE,
    special_occasions JSONB, -- custom occasions and dates
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comprehensive Reviews from Multiple Platforms
CREATE TABLE mock_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES mock_restaurants(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES mock_customers(id) ON DELETE SET NULL,
    
    -- Review Content
    author_name VARCHAR(255) NOT NULL,
    author_profile_url TEXT,
    author_photo_url TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(500),
    content TEXT NOT NULL,
    
    -- Platform Information
    platform VARCHAR(50) NOT NULL, -- 'google', 'zomato', 'tripadvisor', 'yelp', 'facebook'
    platform_review_id VARCHAR(255),
    platform_url TEXT,
    platform_rating_scale VARCHAR(10), -- '1-5', '1-10' for different platforms
    
    -- Review Metadata
    review_date TIMESTAMP WITH TIME ZONE NOT NULL,
    visit_date DATE, -- when they actually visited
    verified BOOLEAN DEFAULT false,
    helpful_votes INTEGER DEFAULT 0,
    total_votes INTEGER DEFAULT 0,
    
    -- Media Attachments
    photos TEXT[], -- review photo URLs
    videos TEXT[], -- review video URLs
    
    -- Detailed Ratings (if available)
    food_rating INTEGER,
    service_rating INTEGER,
    ambiance_rating INTEGER,
    value_rating INTEGER,
    cleanliness_rating INTEGER,
    
    -- AI Analysis Results
    sentiment VARCHAR(20), -- 'positive', 'negative', 'neutral'
    sentiment_score DECIMAL(3,2), -- -1 to 1
    emotion VARCHAR(20), -- 'happy', 'angry', 'disappointed', 'excited'
    topics TEXT[], -- extracted topics like 'food_quality', 'service', 'ambiance'
    keywords TEXT[], -- key phrases mentioned
    mentioned_items TEXT[], -- menu items mentioned
    mentioned_staff TEXT[], -- staff members mentioned
    
    -- Review Classification
    review_type VARCHAR(20), -- 'food', 'service', 'ambiance', 'value', 'overall'
    visit_type VARCHAR(20), -- 'first_time', 'regular', 'special_occasion'
    party_size INTEGER,
    occasion VARCHAR(50), -- 'birthday', 'anniversary', 'business', 'casual'
    
    -- Response Management
    has_response BOOLEAN DEFAULT false,
    response_text TEXT,
    response_date TIMESTAMP WITH TIME ZONE,
    response_author VARCHAR(255),
    response_helpful_votes INTEGER DEFAULT 0,
    auto_response BOOLEAN DEFAULT false,
    
    -- Quality and Moderation
    is_fake BOOLEAN DEFAULT false,
    is_spam BOOLEAN DEFAULT false,
    requires_attention BOOLEAN DEFAULT false,
    moderation_status VARCHAR(20) DEFAULT 'approved', -- 'pending', 'approved', 'rejected'
    internal_notes TEXT,
    
    -- Engagement Metrics
    view_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    
    -- Business Impact
    influenced_bookings INTEGER DEFAULT 0,
    estimated_revenue_impact DECIMAL(10,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing campaigns
CREATE TABLE mock_marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES mock_restaurants(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    campaign_type VARCHAR(50), -- 'promotion', 'seasonal', 'loyalty', 'acquisition'
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed'
    
    -- Budget and Performance
    budget DECIMAL(12,2),
    spent DECIMAL(12,2) DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    
    -- Targeting
    target_audience JSONB,
    channels TEXT[], -- 'email', 'sms', 'social', 'google_ads', 'facebook_ads'
    
    -- Metrics
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue_generated DECIMAL(12,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform integrations
CREATE TABLE mock_platform_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES mock_restaurants(id) ON DELETE CASCADE,
    
    platform_name VARCHAR(100) NOT NULL,
    platform_id VARCHAR(255),
    is_connected BOOLEAN DEFAULT false,
    
    -- Sync Settings
    auto_sync_menu BOOLEAN DEFAULT false,
    auto_sync_reviews BOOLEAN DEFAULT false,
    last_sync TIMESTAMP WITH TIME ZONE,
    
    -- Platform Metrics
    platform_rating DECIMAL(3,2),
    platform_review_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated content tracking
CREATE TABLE mock_generated_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES mock_restaurants(id) ON DELETE CASCADE,
    
    content_type VARCHAR(100) NOT NULL,
    title VARCHAR(255),
    content JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'generated',
    
    -- AI Metadata
    ai_model VARCHAR(100),
    prompt_used TEXT,
    generation_time INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comprehensive indexes for performance
CREATE INDEX idx_restaurants_city ON mock_restaurants(city);
CREATE INDEX idx_restaurants_cuisine ON mock_restaurants(cuisine_type);
CREATE INDEX idx_restaurants_rating ON mock_restaurants(avg_rating);
CREATE INDEX idx_restaurants_active ON mock_restaurants(is_active);

CREATE INDEX idx_awards_restaurant ON mock_awards_certifications(restaurant_id);
CREATE INDEX idx_awards_type ON mock_awards_certifications(type);
CREATE INDEX idx_awards_featured ON mock_awards_certifications(is_featured);

CREATE INDEX idx_press_restaurant ON mock_press_coverage(restaurant_id);
CREATE INDEX idx_press_date ON mock_press_coverage(publication_date);
CREATE INDEX idx_press_sentiment ON mock_press_coverage(sentiment);

CREATE INDEX idx_media_restaurant ON mock_media_assets(restaurant_id);
CREATE INDEX idx_media_category ON mock_media_assets(category);
CREATE INDEX idx_media_featured ON mock_media_assets(is_featured);
CREATE INDEX idx_media_public ON mock_media_assets(is_public);

CREATE INDEX idx_menu_categories_restaurant ON mock_menu_categories(restaurant_id);
CREATE INDEX idx_menu_categories_active ON mock_menu_categories(is_active);

CREATE INDEX idx_menu_items_restaurant ON mock_menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON mock_menu_items(category_id);
CREATE INDEX idx_menu_items_available ON mock_menu_items(is_available, is_in_stock);
CREATE INDEX idx_menu_items_featured ON mock_menu_items(is_featured);
CREATE INDEX idx_menu_items_bestseller ON mock_menu_items(is_bestseller);

CREATE INDEX idx_daily_sales_restaurant ON mock_daily_sales(restaurant_id);
CREATE INDEX idx_daily_sales_item ON mock_daily_sales(menu_item_id);
CREATE INDEX idx_daily_sales_date ON mock_daily_sales(sale_date);

CREATE INDEX idx_customers_restaurant ON mock_customers(restaurant_id);
CREATE INDEX idx_customers_loyalty ON mock_customers(loyalty_tier);
CREATE INDEX idx_customers_churn ON mock_customers(churn_risk);
CREATE INDEX idx_customers_last_visit ON mock_customers(last_visit);

CREATE INDEX idx_reviews_restaurant ON mock_reviews(restaurant_id);
CREATE INDEX idx_reviews_platform ON mock_reviews(platform);
CREATE INDEX idx_reviews_sentiment ON mock_reviews(sentiment);
CREATE INDEX idx_reviews_date ON mock_reviews(review_date);
CREATE INDEX idx_reviews_rating ON mock_reviews(rating);
CREATE INDEX idx_reviews_verified ON mock_reviews(verified);

CREATE INDEX idx_campaigns_restaurant ON mock_marketing_campaigns(restaurant_id);
CREATE INDEX idx_campaigns_status ON mock_marketing_campaigns(status);

CREATE INDEX idx_integrations_restaurant ON mock_platform_integrations(restaurant_id);
CREATE INDEX idx_integrations_platform ON mock_platform_integrations(platform_name);

CREATE INDEX idx_content_restaurant ON mock_generated_content(restaurant_id);
CREATE INDEX idx_content_type ON mock_generated_content(content_type);

-- Add constraints for data integrity
ALTER TABLE mock_menu_items ADD CONSTRAINT positive_price CHECK (price > 0);
ALTER TABLE mock_customers ADD CONSTRAINT positive_spend CHECK (avg_spend >= 0);
ALTER TABLE mock_reviews ADD CONSTRAINT valid_sentiment CHECK (sentiment IN ('positive', 'negative', 'neutral'));
ALTER TABLE mock_daily_sales ADD CONSTRAINT positive_quantity CHECK (quantity_sold >= 0);
ALTER TABLE mock_daily_sales ADD CONSTRAINT positive_revenue CHECK (revenue >= 0);
