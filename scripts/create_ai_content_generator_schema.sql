-- AI Content Generator Schema for Restaurant Marketing System

-- Generated Content Table (Core content storage)
CREATE TABLE IF NOT EXISTS generated_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    
    -- Content Classification
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'campaign', 'crm', 'menu', 'review', 'profile', 'in_store', 'strategy'
    )),
    content_type VARCHAR(100) NOT NULL, -- caption, post, email, response, description, etc.
    channel VARCHAR(50), -- whatsapp, instagram, sms, poster, email, etc.
    
    -- Content Details
    prompt_input TEXT NOT NULL,
    tone VARCHAR(50) DEFAULT 'professional' CHECK (tone IN (
        'casual', 'quirky', 'gourmet', 'emotional', 'professional', 'friendly', 'elegant'
    )),
    ai_model VARCHAR(100) DEFAULT 'openai:gpt-4',
    output_text TEXT,
    output_media_urls TEXT[] DEFAULT '{}',
    
    -- Workflow Status
    is_approved BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN (
        'draft', 'approved', 'used', 'archived', 'rejected'
    )),
    generated_by VARCHAR(20) DEFAULT 'ai' CHECK (generated_by IN ('ai', 'user', 'hybrid')),
    version INTEGER DEFAULT 1,
    
    -- Linking & Usage
    linked_entity_id UUID, -- offerId, menuItemId, customerId, reviewId
    linked_entity_type VARCHAR(50), -- offer, menu_item, customer, review, campaign
    used_in_campaign_id UUID,
    used_in_content_unit_id UUID,
    
    -- Performance & Analytics
    usage_count INTEGER DEFAULT 0,
    performance_score DECIMAL(3,2) DEFAULT 0,
    engagement_metrics JSONB DEFAULT '{}',
    
    -- Metadata
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE,
    is_template BOOLEAN DEFAULT FALSE,
    template_category VARCHAR(100),
    
    -- Automation
    trigger_source VARCHAR(100), -- manual, auto_campaign, auto_menu, auto_review, etc.
    trigger_metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    used_at TIMESTAMP WITH TIME ZONE
);

-- Content Templates Table (Reusable templates)
CREATE TABLE IF NOT EXISTS content_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    
    -- Template Structure
    prompt_template TEXT NOT NULL, -- Template with placeholders like {dish_name}, {offer_amount}
    default_tone VARCHAR(50) DEFAULT 'professional',
    suggested_channels TEXT[] DEFAULT '{}',
    
    -- Usage & Performance
    usage_count INTEGER DEFAULT 0,
    success_rate DECIMAL(3,2) DEFAULT 0,
    
    -- Metadata
    tags TEXT[] DEFAULT '{}',
    is_system_template BOOLEAN DEFAULT FALSE,
    is_seasonal BOOLEAN DEFAULT FALSE,
    seasonal_period VARCHAR(100), -- christmas, diwali, summer, etc.
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Generation Triggers Table
CREATE TABLE IF NOT EXISTS content_generation_triggers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Trigger Configuration
    trigger_type VARCHAR(50) NOT NULL CHECK (trigger_type IN (
        'new_strategy', 'menu_item_added', 'campaign_launched', 'churn_detected',
        'review_received', 'empty_calendar', 'performance_milestone', 'seasonal_event'
    )),
    trigger_conditions JSONB DEFAULT '{}',
    
    -- Content Generation Config
    content_categories TEXT[] DEFAULT '{}', -- Which categories to generate
    auto_approve BOOLEAN DEFAULT FALSE,
    require_review BOOLEAN DEFAULT TRUE,
    
    -- Execution Stats
    total_executions INTEGER DEFAULT 0,
    successful_executions INTEGER DEFAULT 0,
    last_executed TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Performance Tracking
CREATE TABLE IF NOT EXISTS content_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES generated_content(id) ON DELETE CASCADE,
    
    -- Platform Metrics
    platform VARCHAR(50) NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    engagement INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    
    -- Calculated Metrics
    ctr DECIMAL(5,4) DEFAULT 0, -- Click-through rate
    engagement_rate DECIMAL(5,4) DEFAULT 0,
    conversion_rate DECIMAL(5,4) DEFAULT 0,
    
    -- Time Period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Approval Workflow
CREATE TABLE IF NOT EXISTS content_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES generated_content(id) ON DELETE CASCADE,
    
    reviewer_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('approved', 'rejected', 'requested_changes')),
    comments TEXT,
    changes_requested TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_generated_content_restaurant_id ON generated_content(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_category ON generated_content(category);
CREATE INDEX IF NOT EXISTS idx_generated_content_status ON generated_content(status);
CREATE INDEX IF NOT EXISTS idx_generated_content_created_at ON generated_content(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generated_content_tags ON generated_content USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_generated_content_performance ON generated_content(performance_score DESC);

CREATE INDEX IF NOT EXISTS idx_content_templates_restaurant_id ON content_templates(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_content_templates_category ON content_templates(category);
CREATE INDEX IF NOT EXISTS idx_content_templates_seasonal ON content_templates(is_seasonal, seasonal_period);

CREATE INDEX IF NOT EXISTS idx_content_triggers_restaurant_id ON content_generation_triggers(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_content_triggers_active ON content_generation_triggers(is_active);
CREATE INDEX IF NOT EXISTS idx_content_triggers_type ON content_generation_triggers(trigger_type);

-- Update triggers for updated_at timestamps
CREATE TRIGGER update_generated_content_updated_at 
    BEFORE UPDATE ON generated_content 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_templates_updated_at 
    BEFORE UPDATE ON content_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_triggers_updated_at 
    BEFORE UPDATE ON content_generation_triggers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
