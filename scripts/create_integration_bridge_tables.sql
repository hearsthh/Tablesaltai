-- Integration Bridge Tables
-- Addresses: Integration gaps between different systems

-- 1. Menu-Marketing Integration
CREATE TABLE menu_marketing_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_item_id UUID NOT NULL,
    campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
    promotion_type VARCHAR(50), -- 'featured', 'discount', 'new_item', 'seasonal'
    promotion_data JSONB DEFAULT '{}',
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    performance JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Customer-Campaign Targeting
CREATE TABLE customer_campaign_targeting (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
    customer_segment JSONB NOT NULL, -- Segment criteria
    targeting_rules JSONB DEFAULT '{}',
    estimated_reach INTEGER DEFAULT 0,
    actual_reach INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,4) DEFAULT 0,
    conversion_rate DECIMAL(5,4) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Review-Marketing Integration
CREATE TABLE review_marketing_integration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL,
    campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE SET NULL,
    integration_type VARCHAR(50), -- 'response_campaign', 'testimonial_use', 'improvement_action'
    action_taken JSONB DEFAULT '{}',
    results JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Cross-Channel Attribution
CREATE TABLE cross_channel_attribution (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers_unified(id),
    campaign_id UUID REFERENCES marketing_campaigns(id),
    
    -- Customer Journey
    touchpoints JSONB NOT NULL, -- Array of channel interactions
    conversion_path TEXT[], -- Ordered list of channels
    first_touch_channel VARCHAR(50),
    last_touch_channel VARCHAR(50),
    
    -- Attribution Models
    linear_attribution JSONB DEFAULT '{}',
    time_decay_attribution JSONB DEFAULT '{}',
    position_based_attribution JSONB DEFAULT '{}',
    
    -- Conversion Data
    converted BOOLEAN DEFAULT false,
    conversion_value DECIMAL(10,2) DEFAULT 0,
    conversion_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. AI-Human Collaboration Tracking
CREATE TABLE ai_human_collaboration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(20) NOT NULL, -- 'strategy', 'campaign', 'content', 'task'
    entity_id UUID NOT NULL,
    
    -- AI Contribution
    ai_generated_percentage INTEGER DEFAULT 0,
    ai_suggestions_used INTEGER DEFAULT 0,
    ai_suggestions_rejected INTEGER DEFAULT 0,
    ai_time_saved_minutes INTEGER DEFAULT 0,
    
    -- Human Contribution
    human_edits_count INTEGER DEFAULT 0,
    human_approval_time_minutes INTEGER DEFAULT 0,
    human_satisfaction_score INTEGER, -- 1-5 rating
    
    -- Collaboration Quality
    final_performance_score DECIMAL(5,2),
    improvement_over_ai_only DECIMAL(5,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. System Integration Status
CREATE TABLE system_integration_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    
    -- Integration Completeness
    menu_integration_complete BOOLEAN DEFAULT false,
    customer_integration_complete BOOLEAN DEFAULT false,
    marketing_integration_complete BOOLEAN DEFAULT false,
    review_integration_complete BOOLEAN DEFAULT false,
    
    -- Data Quality Scores
    data_completeness_score INTEGER DEFAULT 0, -- 0-100
    data_consistency_score INTEGER DEFAULT 0, -- 0-100
    integration_health_score INTEGER DEFAULT 0, -- 0-100
    
    -- Last Sync Times
    last_menu_sync TIMESTAMP WITH TIME ZONE,
    last_customer_sync TIMESTAMP WITH TIME ZONE,
    last_marketing_sync TIMESTAMP WITH TIME ZONE,
    last_review_sync TIMESTAMP WITH TIME ZONE,
    
    -- Issues & Recommendations
    integration_issues JSONB DEFAULT '[]',
    recommendations JSONB DEFAULT '[]',
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Unified Search Index
CREATE TABLE unified_search_index (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    
    -- Searchable Entity
    entity_type VARCHAR(20) NOT NULL,
    entity_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Search Data
    search_vector tsvector,
    tags TEXT[] DEFAULT '{}',
    categories TEXT[] DEFAULT '{}',
    
    -- Metadata
    entity_data JSONB DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(entity_type, entity_id)
);

-- Create search index
CREATE INDEX idx_unified_search_vector ON unified_search_index USING GIN(search_vector);
CREATE INDEX idx_unified_search_tags ON unified_search_index USING GIN(tags);

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', 
        COALESCE(NEW.title, '') || ' ' || 
        COALESCE(NEW.description, '') || ' ' || 
        COALESCE(array_to_string(NEW.tags, ' '), '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_search_vector_trigger 
    BEFORE INSERT OR UPDATE ON unified_search_index 
    FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- Indexes for bridge tables
CREATE INDEX idx_menu_marketing_links_menu ON menu_marketing_links(menu_item_id);
CREATE INDEX idx_menu_marketing_links_campaign ON menu_marketing_links(campaign_id);
CREATE INDEX idx_customer_campaign_targeting_campaign ON customer_campaign_targeting(campaign_id);
CREATE INDEX idx_review_marketing_integration_review ON review_marketing_integration(review_id);
CREATE INDEX idx_cross_channel_attribution_customer ON cross_channel_attribution(customer_id);
CREATE INDEX idx_cross_channel_attribution_campaign ON cross_channel_attribution(campaign_id);
CREATE INDEX idx_ai_human_collaboration_entity ON ai_human_collaboration(entity_type, entity_id);
CREATE INDEX idx_system_integration_restaurant ON system_integration_status(restaurant_id);
