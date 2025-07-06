-- Add missing fields for comprehensive Marketing module

-- Enhanced marketing campaigns table
ALTER TABLE marketing_campaigns ADD COLUMN IF NOT EXISTS campaign_objective VARCHAR(50); -- 'awareness', 'acquisition', 'retention', 'revenue'
ALTER TABLE marketing_campaigns ADD COLUMN IF NOT EXISTS target_demographics JSONB;
ALTER TABLE marketing_campaigns ADD COLUMN IF NOT EXISTS creative_assets JSONB; -- images, videos, copy variations
ALTER TABLE marketing_campaigns ADD COLUMN IF NOT EXISTS a_b_test_enabled BOOLEAN DEFAULT false;
ALTER TABLE marketing_campaigns ADD COLUMN IF NOT EXISTS a_b_test_variants JSONB;
ALTER TABLE marketing_campaigns ADD COLUMN IF NOT EXISTS attribution_model VARCHAR(20) DEFAULT 'last_click';
ALTER TABLE marketing_campaigns ADD COLUMN IF NOT EXISTS customer_journey_stage VARCHAR(20); -- 'awareness', 'consideration', 'conversion', 'retention'

-- Create campaign templates table
CREATE TABLE IF NOT EXISTS campaign_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    template_name VARCHAR(255) NOT NULL,
    template_description TEXT,
    template_category VARCHAR(50), -- 'seasonal', 'promotional', 'retention', 'acquisition'
    
    -- Template content
    subject_line_templates TEXT[],
    email_templates JSONB,
    sms_templates TEXT[],
    social_media_templates JSONB,
    
    -- Configuration
    recommended_channels TEXT[],
    recommended_timing JSONB,
    recommended_audience JSONB,
    
    -- Performance data
    usage_count INTEGER DEFAULT 0,
    avg_open_rate DECIMAL(5,2),
    avg_click_rate DECIMAL(5,2),
    avg_conversion_rate DECIMAL(5,2),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create social media scheduler table
CREATE TABLE IF NOT EXISTS social_media_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE SET NULL,
    
    -- Post content
    platform VARCHAR(20) NOT NULL, -- 'facebook', 'instagram', 'twitter', 'linkedin'
    post_type VARCHAR(20), -- 'text', 'image', 'video', 'carousel', 'story'
    content TEXT NOT NULL,
    hashtags TEXT[],
    mentions TEXT[],
    
    -- Media
    media_urls TEXT[],
    media_alt_text TEXT[],
    
    -- Scheduling
    scheduled_time TIMESTAMP WITH TIME ZONE,
    published_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'scheduled', 'published', 'failed'
    
    -- Performance
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    
    -- AI generation
    ai_generated BOOLEAN DEFAULT false,
    ai_prompt TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email marketing table
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE SET NULL,
    
    -- Email details
    subject_line VARCHAR(255) NOT NULL,
    preview_text VARCHAR(150),
    sender_name VARCHAR(100),
    sender_email VARCHAR(255),
    
    -- Content
    email_template VARCHAR(50), -- 'newsletter', 'promotion', 'welcome', 'birthday'
    html_content TEXT,
    text_content TEXT,
    
    -- Targeting
    recipient_segments TEXT[], -- customer segment IDs
    recipient_count INTEGER DEFAULT 0,
    
    -- Scheduling
    send_time TIMESTAMP WITH TIME ZONE,
    time_zone VARCHAR(50),
    
    -- Performance
    delivered_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    unsubscribed_count INTEGER DEFAULT 0,
    bounced_count INTEGER DEFAULT 0,
    
    -- Calculated metrics
    open_rate DECIMAL(5,2) DEFAULT 0,
    click_rate DECIMAL(5,2) DEFAULT 0,
    unsubscribe_rate DECIMAL(5,2) DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'scheduled', 'sending', 'sent', 'failed'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create SMS marketing table
CREATE TABLE IF NOT EXISTS sms_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE SET NULL,
    
    -- SMS details
    message_content TEXT NOT NULL,
    sender_id VARCHAR(20),
    
    -- Targeting
    recipient_segments TEXT[],
    recipient_count INTEGER DEFAULT 0,
    
    -- Scheduling
    send_time TIMESTAMP WITH TIME ZONE,
    
    -- Performance
    delivered_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    replied_count INTEGER DEFAULT 0,
    
    -- Calculated metrics
    delivery_rate DECIMAL(5,2) DEFAULT 0,
    click_rate DECIMAL(5,2) DEFAULT 0,
    response_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create influencer collaborations table
CREATE TABLE IF NOT EXISTS influencer_collaborations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE SET NULL,
    
    -- Influencer details
    influencer_name VARCHAR(255) NOT NULL,
    influencer_handle VARCHAR(100),
    platform VARCHAR(20), -- 'instagram', 'youtube', 'tiktok', 'twitter'
    follower_count INTEGER,
    engagement_rate DECIMAL(5,2),
    
    -- Collaboration details
    collaboration_type VARCHAR(20), -- 'sponsored_post', 'story', 'reel', 'visit', 'review'
    content_requirements TEXT,
    deliverables TEXT[],
    
    -- Compensation
    compensation_type VARCHAR(20), -- 'monetary', 'free_meal', 'product', 'hybrid'
    compensation_amount DECIMAL(10,2),
    compensation_details TEXT,
    
    -- Timeline
    start_date DATE,
    end_date DATE,
    content_deadline DATE,
    
    -- Performance
    posts_created INTEGER DEFAULT 0,
    total_reach INTEGER DEFAULT 0,
    total_engagement INTEGER DEFAULT 0,
    website_clicks INTEGER DEFAULT 0,
    bookings_generated INTEGER DEFAULT 0,
    
    -- Status
    status VARCHAR(20) DEFAULT 'proposed', -- 'proposed', 'negotiating', 'confirmed', 'in_progress', 'completed', 'cancelled'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create marketing attribution table
CREATE TABLE IF NOT EXISTS marketing_attribution (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    
    -- Attribution details
    conversion_event VARCHAR(50), -- 'booking', 'order', 'signup', 'visit'
    conversion_value DECIMAL(10,2),
    conversion_date TIMESTAMP WITH TIME ZONE,
    
    -- Touch points (customer journey)
    touchpoints JSONB, -- array of touchpoint objects
    first_touch_channel VARCHAR(50),
    last_touch_channel VARCHAR(50),
    
    -- Attribution models
    first_touch_attribution DECIMAL(10,2),
    last_touch_attribution DECIMAL(10,2),
    linear_attribution JSONB, -- distributed across touchpoints
    time_decay_attribution JSONB,
    
    -- Campaign attribution
    attributed_campaigns TEXT[], -- campaign IDs
    attributed_channels TEXT[], -- channel names
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create marketing ROI tracking table
CREATE TABLE IF NOT EXISTS marketing_roi_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
    
    -- Time period
    tracking_date DATE NOT NULL,
    
    -- Costs
    ad_spend DECIMAL(10,2) DEFAULT 0,
    content_creation_cost DECIMAL(10,2) DEFAULT 0,
    influencer_cost DECIMAL(10,2) DEFAULT 0,
    tool_costs DECIMAL(10,2) DEFAULT 0,
    staff_time_cost DECIMAL(10,2) DEFAULT 0,
    total_cost DECIMAL(10,2) DEFAULT 0,
    
    -- Revenue
    direct_revenue DECIMAL(10,2) DEFAULT 0,
    attributed_revenue DECIMAL(10,2) DEFAULT 0,
    lifetime_value_impact DECIMAL(10,2) DEFAULT 0,
    
    -- Metrics
    new_customers_acquired INTEGER DEFAULT 0,
    customer_acquisition_cost DECIMAL(10,2) DEFAULT 0,
    return_on_ad_spend DECIMAL(5,2) DEFAULT 0,
    return_on_investment DECIMAL(5,2) DEFAULT 0,
    
    -- Performance indicators
    brand_awareness_lift DECIMAL(5,2) DEFAULT 0,
    engagement_quality_score DECIMAL(3,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(campaign_id, tracking_date)
);

-- Create indexes for marketing tables
CREATE INDEX IF NOT EXISTS idx_campaign_templates_category ON campaign_templates(template_category);
CREATE INDEX IF NOT EXISTS idx_campaign_templates_active ON campaign_templates(is_active);

CREATE INDEX IF NOT EXISTS idx_social_posts_restaurant ON social_media_posts(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON social_media_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_posts_scheduled ON social_media_posts(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_media_posts(status);

CREATE INDEX IF NOT EXISTS idx_email_campaigns_restaurant ON email_campaigns(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_send_time ON email_campaigns(send_time);

CREATE INDEX IF NOT EXISTS idx_sms_campaigns_restaurant ON sms_campaigns(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_sms_campaigns_status ON sms_campaigns(status);

CREATE INDEX IF NOT EXISTS idx_influencer_restaurant ON influencer_collaborations(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_influencer_platform ON influencer_collaborations(platform);
CREATE INDEX IF NOT EXISTS idx_influencer_status ON influencer_collaborations(status);

CREATE INDEX IF NOT EXISTS idx_attribution_restaurant ON marketing_attribution(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_attribution_date ON marketing_attribution(conversion_date);
CREATE INDEX IF NOT EXISTS idx_attribution_event ON marketing_attribution(conversion_event);

CREATE INDEX IF NOT EXISTS idx_roi_tracking_restaurant ON marketing_roi_tracking(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_roi_tracking_campaign ON marketing_roi_tracking(campaign_id);
CREATE INDEX IF NOT EXISTS idx_roi_tracking_date ON marketing_roi_tracking(tracking_date);
