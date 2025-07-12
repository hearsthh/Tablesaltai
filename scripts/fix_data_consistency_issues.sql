-- Fix Data Consistency Issues
-- Addresses: Multiple conflicting table structures and data duplication

-- 1. Standardize Customer Data Structure
-- Drop conflicting customer tables and create unified structure
DROP TABLE IF EXISTS customers_unified CASCADE;

CREATE TABLE customers_unified (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    
    -- Basic Info
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    
    -- Demographics
    age INTEGER,
    gender VARCHAR(20),
    location JSONB,
    
    -- Behavioral Data
    total_visits INTEGER DEFAULT 0,
    total_spend DECIMAL(10,2) DEFAULT 0,
    average_order_value DECIMAL(10,2) DEFAULT 0,
    first_visit_date DATE,
    last_visit_date DATE,
    average_visit_gap INTEGER DEFAULT 0,
    
    -- Segmentation Tags
    spend_tag VARCHAR(20) DEFAULT 'low_spender' CHECK (spend_tag IN ('low_spender', 'mid_spender', 'high_spender', 'vip')),
    activity_tag VARCHAR(20) DEFAULT 'new' CHECK (activity_tag IN ('new', 'active', 'loyal', 'churn_risk', 'inactive')),
    behavior_tags TEXT[] DEFAULT '{}',
    
    -- Preferences & Patterns
    preferred_items JSONB DEFAULT '[]',
    dietary_preferences TEXT[] DEFAULT '{}',
    order_patterns JSONB DEFAULT '{}',
    communication_preferences JSONB DEFAULT '{}',
    
    -- AI Insights
    ai_insights JSONB DEFAULT '{}',
    churn_probability DECIMAL(3,2) DEFAULT 0,
    lifetime_value_prediction DECIMAL(10,2) DEFAULT 0,
    next_visit_prediction DATE,
    
    -- Tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_interaction_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Standardize Marketing Channel Data
-- Create unified marketing channels table
DROP TABLE IF EXISTS marketing_channels_unified CASCADE;

CREATE TABLE marketing_channels_unified (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    
    -- Channel Info
    channel_name VARCHAR(50) NOT NULL,
    channel_type VARCHAR(50) NOT NULL,
    platform_id VARCHAR(100), -- External platform ID
    
    -- Connection Status
    is_connected BOOLEAN DEFAULT false,
    connection_status VARCHAR(20) DEFAULT 'disconnected',
    last_sync TIMESTAMP WITH TIME ZONE,
    sync_frequency VARCHAR(20) DEFAULT 'daily',
    
    -- Performance Metrics (Standardized)
    reach INTEGER DEFAULT 0,
    engagement INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    spend DECIMAL(10,2) DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    
    -- Content Metrics
    content_published_count INTEGER DEFAULT 0,
    content_types JSONB DEFAULT '{}',
    
    -- Channel-Specific Data
    channel_specific_metrics JSONB DEFAULT '{}',
    
    -- Configuration
    config JSONB DEFAULT '{}',
    
    -- Tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Standardize Content Units Structure
-- Create unified content structure that links to campaigns
DROP TABLE IF EXISTS content_units_unified CASCADE;

CREATE TABLE content_units_unified (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    
    -- Content Info
    title VARCHAR(255) NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    category VARCHAR(50),
    
    -- Content Data
    content_data JSONB NOT NULL, -- Flexible content based on type
    media_urls TEXT[] DEFAULT '{}',
    
    -- AI Generation
    is_ai_generated BOOLEAN DEFAULT false,
    ai_prompt TEXT,
    ai_model_used VARCHAR(100),
    generation_cost DECIMAL(8,4) DEFAULT 0,
    
    -- Campaign Links
    linked_campaigns UUID[] DEFAULT '{}',
    linked_channels UUID[] DEFAULT '{}',
    
    -- Performance
    performance_metrics JSONB DEFAULT '{}',
    
    -- Status & Workflow
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'published', 'archived')),
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Data Migration Views
-- Views to help migrate data from old structures to new ones

CREATE OR REPLACE VIEW customer_data_migration AS
SELECT 
    id,
    restaurant_id,
    name,
    email,
    phone,
    -- Map old fields to new structure
    COALESCE(visit_count, total_visits, 0) as total_visits,
    COALESCE(total_spent, total_spend, 0) as total_spend,
    COALESCE(avg_spend, average_order_value, 0) as average_order_value,
    COALESCE(first_order_date, first_visit_date) as first_visit_date,
    COALESCE(last_order_date, last_visit_date) as last_visit_date,
    created_at,
    updated_at
FROM customers 
WHERE EXISTS (SELECT 1 FROM customers WHERE id IS NOT NULL)
UNION ALL
SELECT 
    id,
    restaurant_id,
    customer_name as name,
    customer_email as email,
    customer_phone as phone,
    total_orders as total_visits,
    total_spend,
    avg_order_value as average_order_value,
    first_order_date as first_visit_date,
    last_order_date as last_visit_date,
    created_at,
    updated_at
FROM customer_data
WHERE EXISTS (SELECT 1 FROM customer_data WHERE id IS NOT NULL);

-- 5. Create Unified Performance Metrics Table
CREATE TABLE unified_performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    
    -- Entity Reference
    entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('strategy', 'campaign', 'channel', 'content')),
    entity_id UUID NOT NULL,
    
    -- Time Period
    date_recorded DATE NOT NULL,
    period_type VARCHAR(20) DEFAULT 'daily' CHECK (period_type IN ('daily', 'weekly', 'monthly')),
    
    -- Standard Metrics
    reach INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    engagement INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    spend DECIMAL(10,2) DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    
    -- Calculated Metrics
    ctr DECIMAL(5,4) DEFAULT 0, -- Click-through rate
    cpc DECIMAL(8,4) DEFAULT 0, -- Cost per click
    roas DECIMAL(8,4) DEFAULT 0, -- Return on ad spend
    engagement_rate DECIMAL(5,4) DEFAULT 0,
    
    -- Additional Data
    additional_metrics JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(entity_type, entity_id, date_recorded, period_type)
);

-- Indexes for unified tables
CREATE INDEX idx_customers_unified_restaurant ON customers_unified(restaurant_id);
CREATE INDEX idx_customers_unified_tags ON customers_unified USING GIN(behavior_tags);
CREATE INDEX idx_marketing_channels_unified_restaurant ON marketing_channels_unified(restaurant_id);
CREATE INDEX idx_content_units_unified_restaurant ON content_units_unified(restaurant_id);
CREATE INDEX idx_content_units_unified_campaigns ON content_units_unified USING GIN(linked_campaigns);
CREATE INDEX idx_performance_metrics_entity ON unified_performance_metrics(entity_type, entity_id);
CREATE INDEX idx_performance_metrics_date ON unified_performance_metrics(date_recorded);

-- Add updated_at triggers for new tables
CREATE TRIGGER update_customers_unified_updated_at BEFORE UPDATE ON customers_unified FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketing_channels_unified_updated_at BEFORE UPDATE ON marketing_channels_unified FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_units_unified_updated_at BEFORE UPDATE ON content_units_unified FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
