-- Corrected Marketing Data Schema (Content-focused)
CREATE TABLE IF NOT EXISTS marketing_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id),
    channel_name VARCHAR(50) NOT NULL, -- 'instagram', 'facebook', 'google_ads', etc.
    channel_type VARCHAR(30) NOT NULL, -- 'social_media', 'paid_ads', 'email', 'sms'
    is_connected BOOLEAN DEFAULT false,
    connection_details JSONB, -- API keys, tokens, etc.
    monthly_budget DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketing_content_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id),
    channel_id UUID REFERENCES marketing_channels(id),
    content_type VARCHAR(30) NOT NULL, -- 'post', 'story', 'reel', 'video', 'ad', 'email', 'sms'
    
    -- Content Performance Metrics
    total_created INTEGER DEFAULT 0,
    total_published INTEGER DEFAULT 0,
    total_reach INTEGER DEFAULT 0,
    total_engagement INTEGER DEFAULT 0,
    total_conversions INTEGER DEFAULT 0,
    total_spend DECIMAL(10,2) DEFAULT 0,
    
    -- Monthly Breakdown
    monthly_metrics JSONB DEFAULT '{}', -- {"2024-01": {"reach": 1000, "engagement": 50}}
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id),
    campaign_name VARCHAR(200) NOT NULL,
    campaign_type VARCHAR(50), -- 'promotion', 'brand_awareness', 'seasonal', 'grand_opening'
    
    -- Campaign Details
    objective TEXT,
    target_audience JSONB, -- demographic and behavioral targeting
    budget DECIMAL(10,2),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed'
    
    -- Multi-channel Configuration
    channels_config JSONB, -- which channels and content types to use
    
    -- Performance Tracking
    total_reach INTEGER DEFAULT 0,
    total_engagement INTEGER DEFAULT 0,
    total_conversions INTEGER DEFAULT 0,
    total_spend DECIMAL(10,2) DEFAULT 0,
    roi_percentage DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketing_content_pieces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id),
    campaign_id UUID REFERENCES marketing_campaigns(id),
    channel_id UUID REFERENCES marketing_channels(id),
    
    -- Content Details
    content_type VARCHAR(30) NOT NULL,
    title VARCHAR(200),
    content_text TEXT,
    media_urls TEXT[] DEFAULT '{}',
    hashtags TEXT[] DEFAULT '{}',
    
    -- Scheduling
    scheduled_date TIMESTAMP,
    published_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'scheduled', 'published', 'failed'
    
    -- Performance
    reach INTEGER DEFAULT 0,
    engagement INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    spend DECIMAL(10,2) DEFAULT 0,
    
    -- AI Generation
    ai_generated BOOLEAN DEFAULT false,
    ai_prompt TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_marketing_channels_restaurant ON marketing_channels(restaurant_id);
CREATE INDEX idx_marketing_content_types_channel ON marketing_content_types(channel_id);
CREATE INDEX idx_marketing_campaigns_restaurant ON marketing_campaigns(restaurant_id);
CREATE INDEX idx_marketing_content_pieces_campaign ON marketing_content_pieces(campaign_id);
CREATE INDEX idx_marketing_content_pieces_scheduled ON marketing_content_pieces(scheduled_date);
