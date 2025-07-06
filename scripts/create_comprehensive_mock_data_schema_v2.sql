-- Comprehensive Mock Data Schema for Restaurant Profile Testing
-- This schema supports all profile module features with realistic test data

-- Drop existing tables if they exist
DROP TABLE IF EXISTS mock_generated_content CASCADE;
DROP TABLE IF EXISTS mock_platform_integrations CASCADE;
DROP TABLE IF EXISTS mock_marketing_campaigns CASCADE;
DROP TABLE IF EXISTS mock_reviews CASCADE;
DROP TABLE IF EXISTS mock_customers CASCADE;
DROP TABLE IF EXISTS mock_menu_items CASCADE;
DROP TABLE IF EXISTS mock_menu_categories CASCADE;
DROP TABLE IF EXISTS mock_restaurants CASCADE;

-- Main restaurants table
CREATE TABLE mock_restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    cuisine_type VARCHAR(100) NOT NULL,
    restaurant_type VARCHAR(100) NOT NULL,
    price_range VARCHAR(10) NOT NULL,
    
    -- Location
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Contact
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    
    -- Business Details
    description TEXT,
    tagline VARCHAR(255),
    concept TEXT,
    established_year INTEGER,
    seating_capacity INTEGER,
    
    -- Brand Assets
    primary_color VARCHAR(7),
    secondary_color VARCHAR(7),
    brand_voice TEXT,
    brand_positioning VARCHAR(100),
    
    -- Operating Hours (JSON)
    operating_hours JSONB,
    
    -- Social Media (JSON)
    social_media JSONB,
    
    -- Amenities (Array)
    amenities TEXT[],
    
    -- Business Metrics
    avg_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    monthly_revenue DECIMAL(12,2),
    monthly_orders INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu categories
CREATE TABLE mock_menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES mock_restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu items
CREATE TABLE mock_menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES mock_restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES mock_menu_categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2),
    image_url TEXT,
    
    -- Tags and Classifications
    taste_tags TEXT[],
    dietary_tags TEXT[],
    promo_tags TEXT[],
    spice_level VARCHAR(20),
    
    -- Nutritional Information
    calories INTEGER,
    protein_g DECIMAL(5,2),
    carbs_g DECIMAL(5,2),
    fat_g DECIMAL(5,2),
    
    -- Availability
    is_available BOOLEAN DEFAULT true,
    is_in_stock BOOLEAN DEFAULT true,
    
    -- Performance Metrics
    popularity_score DECIMAL(3,2) DEFAULT 0,
    monthly_sales INTEGER DEFAULT 0,
    avg_rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    
    -- AI Insights
    pricing_status VARCHAR(20) DEFAULT 'optimal',
    trend VARCHAR(20) DEFAULT 'stable',
    
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer data
CREATE TABLE mock_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES mock_restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    
    -- Demographics
    age INTEGER,
    gender VARCHAR(20),
    location VARCHAR(255),
    income_range VARCHAR(50),
    
    -- Behavior
    visit_frequency INTEGER DEFAULT 1,
    avg_spend DECIMAL(10,2),
    total_spent DECIMAL(12,2) DEFAULT 0,
    last_visit TIMESTAMP WITH TIME ZONE,
    first_visit TIMESTAMP WITH TIME ZONE,
    
    -- Preferences
    preferred_cuisine TEXT[],
    dietary_restrictions TEXT[],
    preferred_time VARCHAR(20),
    preferred_day VARCHAR(20),
    
    -- Engagement
    loyalty_tier VARCHAR(20) DEFAULT 'new',
    churn_risk VARCHAR(20) DEFAULT 'low',
    lifetime_value DECIMAL(12,2) DEFAULT 0,
    acquisition_cost DECIMAL(10,2) DEFAULT 0,
    
    -- Communication Preferences
    email_subscribed BOOLEAN DEFAULT false,
    sms_subscribed BOOLEAN DEFAULT false,
    push_notifications BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews data
CREATE TABLE mock_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES mock_restaurants(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(500),
    content TEXT NOT NULL,
    platform VARCHAR(50) NOT NULL,
    platform_review_id VARCHAR(255),
    review_date TIMESTAMP WITH TIME ZONE NOT NULL,
    verified BOOLEAN DEFAULT false,
    helpful_votes INTEGER DEFAULT 0,
    
    -- AI Analysis
    sentiment VARCHAR(20),
    sentiment_score DECIMAL(3,2),
    topics TEXT[],
    keywords TEXT[],
    
    -- Response Handling
    has_response BOOLEAN DEFAULT false,
    response_text TEXT,
    response_date TIMESTAMP WITH TIME ZONE,
    response_author VARCHAR(255),
    
    -- Quality Flags
    is_fake BOOLEAN DEFAULT false,
    requires_attention BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing campaigns
CREATE TABLE mock_marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES mock_restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    campaign_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'draft',
    
    -- Budget and Performance
    budget DECIMAL(12,2),
    spent DECIMAL(12,2) DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    
    -- Targeting
    target_audience JSONB,
    channels TEXT[],
    
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
    
    -- Configuration
    settings JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
    generation_time INTEGER, -- milliseconds
    
    -- Usage
    applied_at TIMESTAMP WITH TIME ZONE,
    applied_by VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_restaurants_city ON mock_restaurants(city);
CREATE INDEX idx_restaurants_cuisine ON mock_restaurants(cuisine_type);
CREATE INDEX idx_menu_items_restaurant ON mock_menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON mock_menu_items(category_id);
CREATE INDEX idx_customers_restaurant ON mock_customers(restaurant_id);
CREATE INDEX idx_reviews_restaurant ON mock_reviews(restaurant_id);
CREATE INDEX idx_reviews_platform ON mock_reviews(platform);
CREATE INDEX idx_reviews_sentiment ON mock_reviews(sentiment);
CREATE INDEX idx_campaigns_restaurant ON mock_marketing_campaigns(restaurant_id);
CREATE INDEX idx_integrations_restaurant ON mock_platform_integrations(restaurant_id);
CREATE INDEX idx_content_restaurant ON mock_generated_content(restaurant_id);
CREATE INDEX idx_content_type ON mock_generated_content(content_type);

-- Add some constraints
ALTER TABLE mock_menu_items ADD CONSTRAINT positive_price CHECK (price > 0);
ALTER TABLE mock_customers ADD CONSTRAINT positive_spend CHECK (avg_spend >= 0);
ALTER TABLE mock_reviews ADD CONSTRAINT valid_sentiment CHECK (sentiment IN ('positive', 'negative', 'neutral'));
