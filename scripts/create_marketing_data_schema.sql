-- Marketing Data Schema for Restaurant Management System

-- Marketing Channels Table
CREATE TABLE IF NOT EXISTS marketing_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    channel_name VARCHAR(50) NOT NULL CHECK (channel_name IN (
        'instagram', 'facebook', 'website', 'sms', 'email', 'whatsapp',
        'google_ads', 'facebook_ads', 'instagram_ads', 'gmb'
    )),
    is_connected BOOLEAN DEFAULT FALSE,
    connection_status VARCHAR(20) DEFAULT 'inactive' CHECK (connection_status IN ('active', 'inactive', 'error', 'pending')),
    
    -- Core Metrics
    reach INTEGER DEFAULT 0,
    engagement INTEGER DEFAULT 0,
    conversation INTEGER DEFAULT 0,
    spend DECIMAL(10,2) DEFAULT 0,
    content_published_count INTEGER DEFAULT 0,
    
    -- Content Types (JSONB for flexibility)
    content_types JSONB DEFAULT '{}',
    
    -- Channel Specific Metrics (JSONB for flexibility)
    channel_specific_metrics JSONB DEFAULT '{}',
    
    -- Sync Configuration
    last_sync TIMESTAMP WITH TIME ZONE,
    sync_frequency VARCHAR(20) DEFAULT 'daily' CHECK (sync_frequency IN ('real_time', 'hourly', 'daily', 'weekly', 'manual')),
    data_retention_days INTEGER DEFAULT 365,
    
    -- AI Insights (JSONB)
    ai_insights JSONB DEFAULT '{}',
    
    -- Configuration (JSONB)
    config JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(restaurant_id, channel_name)
);

-- Marketing Campaigns Table
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    objective VARCHAR(50) CHECK (objective IN ('awareness', 'engagement', 'traffic', 'leads', 'conversions', 'sales')),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
    
    -- Campaign Timeline
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    
    -- Budget
    budget DECIMAL(10,2) DEFAULT 0,
    spent DECIMAL(10,2) DEFAULT 0,
    
    -- Channels (Array of channel IDs)
    channels TEXT[] DEFAULT '{}',
    
    -- Target Audience (JSONB)
    target_audience JSONB DEFAULT '{}',
    
    -- Content Units (JSONB Array)
    content_units JSONB DEFAULT '[]',
    
    -- Performance Metrics (JSONB)
    performance JSONB DEFAULT '{}',
    
    -- AI Optimization (JSONB)
    ai_optimization JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing Analytics Table (for historical data)
CREATE TABLE IF NOT EXISTS marketing_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    period VARCHAR(20) NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Overall Performance
    total_reach INTEGER DEFAULT 0,
    total_engagement INTEGER DEFAULT 0,
    total_conversions INTEGER DEFAULT 0,
    total_spend DECIMAL(10,2) DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    overall_roas DECIMAL(8,2) DEFAULT 0,
    
    -- Channel Performance (JSONB Array)
    channel_performance JSONB DEFAULT '[]',
    
    -- Content Performance (JSONB)
    content_performance JSONB DEFAULT '{}',
    
    -- Audience Insights (JSONB)
    audience_insights JSONB DEFAULT '{}',
    
    -- Competitive Analysis (JSONB)
    competitive_analysis JSONB DEFAULT '{}',
    
    -- AI Insights (JSONB)
    ai_insights JSONB DEFAULT '{}',
    
    -- Timestamps
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(restaurant_id, period, start_date, end_date)
);

-- Marketing Content Table
CREATE TABLE IF NOT EXISTS marketing_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
    channel_id UUID REFERENCES marketing_channels(id) ON DELETE CASCADE,
    
    -- Content Details
    title VARCHAR(255),
    description TEXT,
    content_type VARCHAR(50),
    media_urls TEXT[] DEFAULT '{}',
    
    -- Call to Action
    cta_text VARCHAR(100),
    cta_url TEXT,
    
    -- Scheduling
    scheduled_time TIMESTAMP WITH TIME ZONE,
    published_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
    
    -- Performance
    reach INTEGER DEFAULT 0,
    engagement INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing Automation Rules Table
CREATE TABLE IF NOT EXISTS marketing_automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Trigger Configuration
    trigger_type VARCHAR(50) NOT NULL CHECK (trigger_type IN (
        'new_customer', 'order_placed', 'review_received', 'birthday', 
        'anniversary', 'inactive_customer', 'high_value_customer', 'time_based'
    )),
    trigger_conditions JSONB DEFAULT '{}',
    
    -- Action Configuration
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN (
        'send_email', 'send_sms', 'send_whatsapp', 'create_campaign', 
        'add_to_segment', 'send_notification', 'update_customer'
    )),
    action_config JSONB DEFAULT '{}',
    
    -- Execution Stats
    total_executions INTEGER DEFAULT 0,
    successful_executions INTEGER DEFAULT 0,
    last_executed TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing Segments Table
CREATE TABLE IF NOT EXISTS marketing_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Segment Criteria (JSONB)
    criteria JSONB NOT NULL DEFAULT '{}',
    
    -- Segment Stats
    customer_count INTEGER DEFAULT 0,
    total_value DECIMAL(12,2) DEFAULT 0,
    avg_order_value DECIMAL(10,2) DEFAULT 0,
    
    -- Auto-update Configuration
    auto_update BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing ROI Tracking Table
CREATE TABLE IF NOT EXISTS marketing_roi_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
    channel_id UUID REFERENCES marketing_channels(id) ON DELETE CASCADE,
    
    -- Attribution Data
    customer_id UUID,
    order_id UUID,
    attribution_model VARCHAR(50) DEFAULT 'last_click' CHECK (attribution_model IN (
        'first_click', 'last_click', 'linear', 'time_decay', 'position_based'
    )),
    
    -- Financial Data
    marketing_spend DECIMAL(10,2) DEFAULT 0,
    revenue_generated DECIMAL(10,2) DEFAULT 0,
    profit_margin DECIMAL(5,2) DEFAULT 0,
    
    -- Conversion Data
    conversion_type VARCHAR(50),
    conversion_value DECIMAL(10,2) DEFAULT 0,
    conversion_timestamp TIMESTAMP WITH TIME ZONE,
    
    -- Attribution Weight (for multi-touch attribution)
    attribution_weight DECIMAL(3,2) DEFAULT 1.00,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_marketing_channels_restaurant_id ON marketing_channels(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_marketing_channels_channel_name ON marketing_channels(channel_name);
CREATE INDEX IF NOT EXISTS idx_marketing_channels_connection_status ON marketing_channels(connection_status);

CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_restaurant_id ON marketing_campaigns(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_status ON marketing_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_dates ON marketing_campaigns(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_marketing_analytics_restaurant_id ON marketing_analytics(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_marketing_analytics_period ON marketing_analytics(period, start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_marketing_content_restaurant_id ON marketing_content(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_marketing_content_campaign_id ON marketing_content(campaign_id);
CREATE INDEX IF NOT EXISTS idx_marketing_content_status ON marketing_content(status);

CREATE INDEX IF NOT EXISTS idx_marketing_automation_restaurant_id ON marketing_automation_rules(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_marketing_automation_active ON marketing_automation_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_marketing_automation_trigger ON marketing_automation_rules(trigger_type);

CREATE INDEX IF NOT EXISTS idx_marketing_segments_restaurant_id ON marketing_segments(restaurant_id);

CREATE INDEX IF NOT EXISTS idx_marketing_roi_restaurant_id ON marketing_roi_tracking(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_marketing_roi_campaign_id ON marketing_roi_tracking(campaign_id);
CREATE INDEX IF NOT EXISTS idx_marketing_roi_conversion ON marketing_roi_tracking(conversion_timestamp);

-- Update triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_marketing_channels_updated_at BEFORE UPDATE ON marketing_channels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketing_campaigns_updated_at BEFORE UPDATE ON marketing_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketing_content_updated_at BEFORE UPDATE ON marketing_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketing_automation_updated_at BEFORE UPDATE ON marketing_automation_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketing_segments_updated_at BEFORE UPDATE ON marketing_segments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
