-- Competitor Analysis Tables
CREATE TABLE IF NOT EXISTS competitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    business_type VARCHAR(20) CHECK (business_type IN ('direct', 'indirect', 'aspirational')),
    
    -- Location Data
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    distance_km DECIMAL(5, 2),
    
    -- Basic Info
    cuisine_types TEXT[] DEFAULT '{}',
    price_range VARCHAR(20) CHECK (price_range IN ('budget', 'mid-range', 'premium', 'luxury')),
    seating_capacity INTEGER,
    operating_hours JSONB DEFAULT '{}',
    
    -- Menu Analysis
    menu_data JSONB DEFAULT '{}',
    
    -- Social Media Presence
    social_presence JSONB DEFAULT '{}',
    
    -- Performance Metrics
    performance_indicators JSONB DEFAULT '{}',
    
    -- Competitive Intelligence
    competitive_analysis JSONB DEFAULT '{}',
    
    -- Tracking
    monitoring_status VARCHAR(20) DEFAULT 'active' CHECK (monitoring_status IN ('active', 'paused', 'inactive')),
    data_sources TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS competitor_price_comparisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    competitor_id UUID NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
    category VARCHAR(100),
    
    -- Our Item
    our_item JSONB NOT NULL,
    
    -- Competitor Item
    competitor_item JSONB NOT NULL,
    
    -- Analysis
    price_difference DECIMAL(8, 2),
    price_difference_percentage DECIMAL(5, 2),
    competitive_position VARCHAR(20) CHECK (competitive_position IN ('cheaper', 'similar', 'expensive')),
    
    analysis JSONB DEFAULT '{}',
    
    tracked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS competitor_social_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    competitor_id UUID NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
    platform VARCHAR(20) CHECK (platform IN ('instagram', 'facebook', 'twitter', 'tiktok')),
    
    -- Post Data
    post_data JSONB NOT NULL,
    
    -- Engagement
    engagement JSONB DEFAULT '{}',
    
    -- Content Analysis
    content_analysis JSONB DEFAULT '{}',
    
    posted_at TIMESTAMP WITH TIME ZONE,
    tracked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Local Market Data Tables
CREATE TABLE IF NOT EXISTS local_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) CHECK (event_type IN ('festival', 'concert', 'sports', 'conference', 'holiday', 'weather', 'construction')),
    
    -- Location
    location JSONB NOT NULL,
    
    -- Timing
    timing JSONB NOT NULL,
    
    -- Impact Assessment
    impact_assessment JSONB DEFAULT '{}',
    
    -- Marketing Opportunities
    marketing_opportunities JSONB DEFAULT '{}',
    
    -- Data Source
    data_source VARCHAR(50) CHECK (data_source IN ('manual', 'eventbrite', 'facebook_events', 'google_events', 'weather_api')),
    source_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS weather_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Weather Data
    weather_data JSONB NOT NULL,
    
    -- Business Impact
    business_impact JSONB DEFAULT '{}',
    
    -- Correlations
    correlations JSONB DEFAULT '{}',
    
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, date)
);

CREATE TABLE IF NOT EXISTS seasonal_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    season VARCHAR(20) CHECK (season IN ('spring', 'summer', 'monsoon', 'autumn', 'winter')),
    year INTEGER,
    
    -- Business Patterns
    business_patterns JSONB DEFAULT '{}',
    
    -- Market Trends
    market_trends JSONB DEFAULT '{}',
    
    -- Recommendations
    recommendations JSONB DEFAULT '{}',
    
    -- Data Period
    data_period JSONB NOT NULL,
    
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, season, year)
);

-- Customer Journey Tables
CREATE TABLE IF NOT EXISTS customer_touchpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    touchpoint_type VARCHAR(50) CHECK (touchpoint_type IN ('discovery', 'consideration', 'visit', 'order', 'experience', 'feedback', 'retention')),
    channel VARCHAR(50) CHECK (channel IN ('organic_search', 'social_media', 'word_of_mouth', 'paid_ads', 'email', 'sms', 'walk_in', 'delivery_app')),
    
    -- Interaction Data
    interaction_data JSONB DEFAULT '{}',
    
    -- Engagement Metrics
    engagement_metrics JSONB DEFAULT '{}',
    
    -- Customer Intent
    customer_intent JSONB DEFAULT '{}',
    
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_journeys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    journey_stage VARCHAR(20) CHECK (journey_stage IN ('prospect', 'first_time', 'returning', 'loyal', 'churned')),
    
    -- Discovery Path
    discovery_path JSONB DEFAULT '{}',
    
    -- Consideration Phase
    consideration_phase JSONB DEFAULT '{}',
    
    -- Conversion Events
    conversion_events JSONB DEFAULT '{}',
    
    -- Experience Feedback
    experience_feedback JSONB DEFAULT '{}',
    
    -- Retention Metrics
    retention_metrics JSONB DEFAULT '{}',
    
    -- Journey Analytics
    journey_analytics JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(customer_id, restaurant_id)
);

-- Brand Perception Tables
CREATE TABLE IF NOT EXISTS social_mentions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Mention Data
    mention_data JSONB NOT NULL,
    
    -- Sentiment Analysis
    sentiment_analysis JSONB DEFAULT '{}',
    
    -- Content Categorization
    content_categorization JSONB DEFAULT '{}',
    
    -- Engagement Metrics
    engagement_metrics JSONB DEFAULT '{}',
    
    -- Business Impact
    business_impact JSONB DEFAULT '{}',
    
    mentioned_at TIMESTAMP WITH TIME ZONE,
    tracked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS brand_sentiment_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Daily Metrics
    daily_metrics JSONB DEFAULT '{}',
    
    -- Trending Topics
    trending_topics JSONB DEFAULT '[]',
    
    -- Platform Breakdown
    platform_breakdown JSONB DEFAULT '[]',
    
    -- Competitor Comparison
    competitor_comparison JSONB DEFAULT '[]',
    
    UNIQUE(restaurant_id, date)
);

-- Influencer Partnership Tables
CREATE TABLE IF NOT EXISTS influencers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Profile Data
    profile_data JSONB NOT NULL,
    
    -- Audience Metrics
    audience_metrics JSONB DEFAULT '{}',
    
    -- Audience Demographics
    audience_demographics JSONB DEFAULT '{}',
    
    -- Content Analysis
    content_analysis JSONB DEFAULT '{}',
    
    -- Collaboration History
    collaboration_history JSONB DEFAULT '{}',
    
    -- Rates and Terms
    rates_and_terms JSONB DEFAULT '{}',
    
    -- Contact Info
    contact_info JSONB DEFAULT '{}',
    
    status VARCHAR(20) DEFAULT 'prospective' CHECK (status IN ('prospective', 'contacted', 'negotiating', 'active', 'completed', 'blacklisted')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS influencer_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    influencer_id UUID NOT NULL REFERENCES influencers(id) ON DELETE CASCADE,
    
    -- Campaign Details
    campaign_details JSONB NOT NULL,
    
    -- Commercial Terms
    commercial_terms JSONB DEFAULT '{}',
    
    -- Timeline
    timeline JSONB DEFAULT '{}',
    
    -- Performance Tracking
    performance_tracking JSONB DEFAULT '{}',
    
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'content_review', 'published', 'completed', 'cancelled')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS affiliate_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Partner Info
    partner_info JSONB NOT NULL,
    
    -- Partnership Terms
    partnership_terms JSONB DEFAULT '{}',
    
    -- Tracking Data
    tracking_data JSONB DEFAULT '{}',
    
    -- Performance Metrics
    performance_metrics JSONB DEFAULT '{}',
    
    -- Relationship Management
    relationship_management JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pr_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Campaign Info
    campaign_info JSONB NOT NULL,
    
    -- Media Outreach
    media_outreach JSONB DEFAULT '{}',
    
    -- Coverage Tracking
    coverage_tracking JSONB DEFAULT '{}',
    
    -- Campaign Results
    campaign_results JSONB DEFAULT '{}',
    
    status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'outreach', 'active', 'monitoring', 'completed')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_competitors_restaurant_id ON competitors(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_competitors_business_type ON competitors(business_type);
CREATE INDEX IF NOT EXISTS idx_competitors_monitoring_status ON competitors(monitoring_status);

CREATE INDEX IF NOT EXISTS idx_competitor_price_comparisons_restaurant_id ON competitor_price_comparisons(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_competitor_price_comparisons_competitor_id ON competitor_price_comparisons(competitor_id);

CREATE INDEX IF NOT EXISTS idx_competitor_social_activity_restaurant_id ON competitor_social_activity(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_competitor_social_activity_platform ON competitor_social_activity(platform);
CREATE INDEX IF NOT EXISTS idx_competitor_social_activity_posted_at ON competitor_social_activity(posted_at);

CREATE INDEX IF NOT EXISTS idx_local_events_restaurant_id ON local_events(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_local_events_event_type ON local_events(event_type);
CREATE INDEX IF NOT EXISTS idx_local_events_timing ON local_events USING GIN ((timing));

CREATE INDEX IF NOT EXISTS idx_weather_patterns_restaurant_id ON weather_patterns(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_weather_patterns_date ON weather_patterns(date);

CREATE INDEX IF NOT EXISTS idx_seasonal_trends_restaurant_id ON seasonal_trends(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_seasonal_trends_season_year ON seasonal_trends(season, year);

CREATE INDEX IF NOT EXISTS idx_customer_touchpoints_customer_id ON customer_touchpoints(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_touchpoints_restaurant_id ON customer_touchpoints(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_customer_touchpoints_touchpoint_type ON customer_touchpoints(touchpoint_type);
CREATE INDEX IF NOT EXISTS idx_customer_touchpoints_timestamp ON customer_touchpoints(timestamp);

CREATE INDEX IF NOT EXISTS idx_customer_journeys_customer_id ON customer_journeys(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_journeys_restaurant_id ON customer_journeys(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_customer_journeys_stage ON customer_journeys(journey_stage);

CREATE INDEX IF NOT EXISTS idx_social_mentions_restaurant_id ON social_mentions(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_social_mentions_mentioned_at ON social_mentions(mentioned_at);
CREATE INDEX IF NOT EXISTS idx_social_mentions_sentiment ON social_mentions USING GIN ((sentiment_analysis));

CREATE INDEX IF NOT EXISTS idx_brand_sentiment_trends_restaurant_id ON brand_sentiment_trends(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_brand_sentiment_trends_date ON brand_sentiment_trends(date);

CREATE INDEX IF NOT EXISTS idx_influencers_restaurant_id ON influencers(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_influencers_status ON influencers(status);

CREATE INDEX IF NOT EXISTS idx_influencer_campaigns_restaurant_id ON influencer_campaigns(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_influencer_campaigns_influencer_id ON influencer_campaigns(influencer_id);
CREATE INDEX IF NOT EXISTS idx_influencer_campaigns_status ON influencer_campaigns(status);

CREATE INDEX IF NOT EXISTS idx_affiliate_partners_restaurant_id ON affiliate_partners(restaurant_id);

CREATE INDEX IF NOT EXISTS idx_pr_campaigns_restaurant_id ON pr_campaigns(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_pr_campaigns_status ON pr_campaigns(status);

-- Update triggers
CREATE TRIGGER update_competitors_updated_at BEFORE UPDATE ON competitors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_local_events_updated_at BEFORE UPDATE ON local_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_journeys_updated_at BEFORE UPDATE ON customer_journeys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_influencers_updated_at BEFORE UPDATE ON influencers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_influencer_campaigns_updated_at BEFORE UPDATE ON influencer_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_affiliate_partners_updated_at BEFORE UPDATE ON affiliate_partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pr_campaigns_updated_at BEFORE UPDATE ON pr_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
