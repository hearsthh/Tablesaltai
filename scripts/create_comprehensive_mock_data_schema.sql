-- Comprehensive schema for mock restaurant data
-- This will support all AI testing scenarios

-- Restaurant profiles table
CREATE TABLE IF NOT EXISTS mock_restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    cuisine_type VARCHAR(100) NOT NULL,
    restaurant_type VARCHAR(100) NOT NULL,
    price_range VARCHAR(10) NOT NULL,
    description TEXT,
    tagline VARCHAR(255),
    story TEXT,
    concept TEXT,
    philosophy TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    established_year INTEGER,
    seating_capacity INTEGER,
    
    -- Brand assets
    logo_url TEXT,
    primary_color VARCHAR(7),
    secondary_color VARCHAR(7),
    brand_voice TEXT,
    brand_positioning VARCHAR(50),
    
    -- Operating hours (JSON)
    operating_hours JSONB,
    
    -- Social media
    social_media JSONB,
    
    -- Amenities
    amenities TEXT[],
    
    -- Location data
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Business metrics
    avg_rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    monthly_revenue DECIMAL(10, 2),
    monthly_orders INTEGER,
    
    -- AI-generated flags
    ai_generated BOOLEAN DEFAULT true,
    data_source VARCHAR(50) DEFAULT 'mock_generator',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu categories table
CREATE TABLE IF NOT EXISTS mock_menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES mock_restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu items table
CREATE TABLE IF NOT EXISTS mock_menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES mock_restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES mock_menu_categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(8, 2) NOT NULL,
    cost DECIMAL(8, 2), -- For profit margin calculations
    image_url TEXT,
    
    -- Availability
    is_available BOOLEAN DEFAULT true,
    is_in_stock BOOLEAN DEFAULT true,
    
    -- Tags and classifications
    taste_tags TEXT[],
    dietary_tags TEXT[],
    promo_tags TEXT[],
    spice_level VARCHAR(20),
    
    -- Nutritional info
    calories INTEGER,
    protein_g DECIMAL(5, 2),
    carbs_g DECIMAL(5, 2),
    fat_g DECIMAL(5, 2),
    
    -- Performance metrics
    popularity_score DECIMAL(3, 2) DEFAULT 0,
    monthly_sales INTEGER DEFAULT 0,
    avg_rating DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    
    -- AI insights
    pricing_status VARCHAR(20), -- 'optimal', 'underpriced', 'overpriced'
    trend VARCHAR(20), -- 'increasing', 'stable', 'declining'
    
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer profiles table
CREATE TABLE IF NOT EXISTS mock_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES mock_restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    
    -- Demographics
    age INTEGER,
    gender VARCHAR(20),
    location VARCHAR(255),
    income_range VARCHAR(50),
    
    -- Behavior patterns
    visit_frequency INTEGER DEFAULT 0, -- visits per month
    avg_spend DECIMAL(8, 2) DEFAULT 0,
    total_spent DECIMAL(10, 2) DEFAULT 0,
    last_visit TIMESTAMP WITH TIME ZONE,
    first_visit TIMESTAMP WITH TIME ZONE,
    
    -- Preferences
    preferred_cuisine TEXT[],
    dietary_restrictions TEXT[],
    preferred_time VARCHAR(50), -- 'breakfast', 'lunch', 'dinner', 'late_night'
    preferred_day VARCHAR(20), -- 'weekday', 'weekend'
    
    -- Engagement metrics
    loyalty_tier VARCHAR(20) DEFAULT 'new', -- 'new', 'regular', 'vip', 'champion'
    churn_risk VARCHAR(20) DEFAULT 'low', -- 'low', 'medium', 'high'
    lifetime_value DECIMAL(10, 2) DEFAULT 0,
    acquisition_cost DECIMAL(8, 2) DEFAULT 0,
    
    -- Communication preferences
    email_subscribed BOOLEAN DEFAULT false,
    sms_subscribed BOOLEAN DEFAULT false,
    push_notifications BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS mock_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES mock_restaurants(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES mock_customers(id) ON DELETE SET NULL,
    
    -- Review content
    author_name VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(500),
    content TEXT NOT NULL,
    
    -- Platform and source
    platform VARCHAR(50) NOT NULL, -- 'google', 'yelp', 'tripadvisor', 'zomato', 'facebook'
    platform_review_id VARCHAR(255),
    review_url TEXT,
    
    -- Metadata
    review_date TIMESTAMP WITH TIME ZONE NOT NULL,
    verified BOOLEAN DEFAULT false,
    helpful_votes INTEGER DEFAULT 0,
    
    -- AI analysis
    sentiment VARCHAR(20), -- 'positive', 'negative', 'neutral'
    sentiment_score DECIMAL(3, 2), -- -1 to 1
    topics TEXT[], -- extracted topics like 'food_quality', 'service', 'ambiance'
    keywords TEXT[], -- key phrases mentioned
    
    -- Response handling
    has_response BOOLEAN DEFAULT false,
    response_text TEXT,
    response_date TIMESTAMP WITH TIME ZONE,
    response_author VARCHAR(255),
    
    -- Flags
    is_fake BOOLEAN DEFAULT false,
    requires_attention BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing campaigns table
CREATE TABLE IF NOT EXISTS mock_marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES mock_restaurants(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    campaign_type VARCHAR(50), -- 'promotion', 'seasonal', 'loyalty', 'acquisition'
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed'
    
    -- Budget and performance
    budget DECIMAL(10, 2),
    spent DECIMAL(10, 2) DEFAULT 0,
    
    -- Timing
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    
    -- Targeting
    target_audience JSONB,
    channels TEXT[], -- 'email', 'sms', 'social', 'google_ads', 'facebook_ads'
    
    -- Metrics
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue_generated DECIMAL(10, 2) DEFAULT 0,
    
    -- Content
    creative_assets JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated content table (for AI-generated content tracking)
CREATE TABLE IF NOT EXISTS mock_generated_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES mock_restaurants(id) ON DELETE CASCADE,
    
    content_type VARCHAR(50) NOT NULL, -- 'combo', 'seasonal_menu', 'description', 'social_post'
    title VARCHAR(255) NOT NULL,
    content_data JSONB NOT NULL,
    
    -- Generation metadata
    ai_model VARCHAR(100),
    generation_prompt TEXT,
    generation_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Status
    status VARCHAR(20) DEFAULT 'generated', -- 'generated', 'reviewed', 'applied', 'rejected'
    applied_at TIMESTAMP WITH TIME ZONE,
    
    -- Performance (if applied)
    performance_metrics JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform integrations table
CREATE TABLE IF NOT EXISTS mock_platform_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES mock_restaurants(id) ON DELETE CASCADE,
    
    platform_name VARCHAR(50) NOT NULL,
    platform_id VARCHAR(255), -- restaurant ID on the platform
    is_connected BOOLEAN DEFAULT true,
    
    -- Sync settings
    auto_sync_menu BOOLEAN DEFAULT false,
    auto_sync_reviews BOOLEAN DEFAULT false,
    last_sync TIMESTAMP WITH TIME ZONE,
    
    -- Platform-specific data
    platform_data JSONB,
    
    -- Metrics from platform
    platform_rating DECIMAL(3, 2),
    platform_review_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_mock_restaurants_cuisine ON mock_restaurants(cuisine_type);
CREATE INDEX IF NOT EXISTS idx_mock_restaurants_city ON mock_restaurants(city);
CREATE INDEX IF NOT EXISTS idx_mock_menu_items_restaurant ON mock_menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_mock_menu_items_category ON mock_menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_mock_customers_restaurant ON mock_customers(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_mock_reviews_restaurant ON mock_reviews(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_mock_reviews_platform ON mock_reviews(platform);
CREATE INDEX IF NOT EXISTS idx_mock_reviews_sentiment ON mock_reviews(sentiment);
CREATE INDEX IF NOT EXISTS idx_mock_reviews_date ON mock_reviews(review_date);
