-- Add comprehensive review manager fields to existing tables

-- Enhance reviews table with detailed sentiment and response management
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS response_template_id UUID REFERENCES response_templates(id);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS auto_response_enabled BOOLEAN DEFAULT false;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS sentiment_threshold DECIMAL(3,2) DEFAULT 0.5;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS review_categories TEXT[] DEFAULT '{}';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS review_tags TEXT[] DEFAULT '{}';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS notification_settings JSONB DEFAULT '{}';

-- Add detailed sentiment analysis fields
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS emotion VARCHAR(50);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS sentiment_confidence DECIMAL(3,2);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS sentiment_topics TEXT[] DEFAULT '{}';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS sentiment_keywords TEXT[] DEFAULT '{}';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS urgency_level VARCHAR(20) DEFAULT 'low';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS sentiment_updated_at TIMESTAMP WITH TIME ZONE;

-- Add platform-specific fields
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS platform_review_id VARCHAR(255);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS platform_url TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS platform_rating_scale VARCHAR(20) DEFAULT '1-5';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS author_profile_url TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS author_photo_url TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS helpful_votes INTEGER DEFAULT 0;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS total_votes INTEGER DEFAULT 0;

-- Add media attachments
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS videos TEXT[] DEFAULT '{}';

-- Add detailed ratings breakdown
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS food_rating DECIMAL(2,1);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS service_rating DECIMAL(2,1);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS ambiance_rating DECIMAL(2,1);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS value_rating DECIMAL(2,1);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS cleanliness_rating DECIMAL(2,1);

-- Add review classification
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS review_type VARCHAR(50) DEFAULT 'general';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS visit_type VARCHAR(50);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS party_size INTEGER;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS occasion VARCHAR(100);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS visit_date DATE;

-- Add response management
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS has_response BOOLEAN DEFAULT false;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS response_text TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS response_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS response_author VARCHAR(255);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS response_helpful_votes INTEGER DEFAULT 0;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS auto_response BOOLEAN DEFAULT false;

-- Add quality flags
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_fake BOOLEAN DEFAULT false;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_spam BOOLEAN DEFAULT false;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS requires_attention BOOLEAN DEFAULT false;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS moderation_status VARCHAR(50) DEFAULT 'approved';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS internal_notes TEXT;

-- Add engagement metrics
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS influenced_bookings INTEGER DEFAULT 0;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS estimated_revenue_impact DECIMAL(10,2) DEFAULT 0;

-- Add mentioned items and staff
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS mentioned_items TEXT[] DEFAULT '{}';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS mentioned_staff TEXT[] DEFAULT '{}';

-- Create response templates table
CREATE TABLE IF NOT EXISTS response_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
    template_name VARCHAR(255) NOT NULL,
    template_text TEXT NOT NULL,
    sentiment_target VARCHAR(20) NOT NULL CHECK (sentiment_target IN ('positive', 'negative', 'neutral')),
    review_category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create review notification settings table
CREATE TABLE IF NOT EXISTS review_notification_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    notification_frequency VARCHAR(20) DEFAULT 'realtime' CHECK (notification_frequency IN ('realtime', 'hourly', 'daily', 'weekly')),
    notification_types TEXT[] DEFAULT '{"new_review", "negative_review"}',
    notification_threshold DECIMAL(2,1) DEFAULT 3.0,
    auto_response_enabled BOOLEAN DEFAULT false,
    auto_response_delay_minutes INTEGER DEFAULT 60,
    business_hours_only BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(restaurant_id)
);

-- Create review categories table
CREATE TABLE IF NOT EXISTS review_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
    category_name VARCHAR(100) NOT NULL,
    category_description TEXT,
    color_code VARCHAR(7) DEFAULT '#3B82F6',
    icon_name VARCHAR(50) DEFAULT 'tag',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(restaurant_id, category_name)
);

-- Create review tags table
CREATE TABLE IF NOT EXISTS review_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
    tag_name VARCHAR(50) NOT NULL,
    tag_description TEXT,
    tag_color VARCHAR(7) DEFAULT '#10B981',
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(restaurant_id, tag_name)
);

-- Create review analytics table
CREATE TABLE IF NOT EXISTS review_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
    analysis_date DATE NOT NULL,
    total_reviews INTEGER DEFAULT 0,
    positive_reviews INTEGER DEFAULT 0,
    negative_reviews INTEGER DEFAULT 0,
    neutral_reviews INTEGER DEFAULT 0,
    avg_rating DECIMAL(3,2) DEFAULT 0,
    response_rate DECIMAL(5,2) DEFAULT 0,
    avg_response_time_hours DECIMAL(8,2) DEFAULT 0,
    sentiment_score DECIMAL(3,2) DEFAULT 0,
    trending_keywords TEXT[] DEFAULT '{}',
    top_complaints TEXT[] DEFAULT '{}',
    top_compliments TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(restaurant_id, analysis_date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_sentiment ON reviews(sentiment, sentiment_score);
CREATE INDEX IF NOT EXISTS idx_reviews_platform ON reviews(platform, platform_review_id);
CREATE INDEX IF NOT EXISTS idx_reviews_response ON reviews(has_response, requires_attention);
CREATE INDEX IF NOT EXISTS idx_reviews_date_rating ON reviews(review_date, rating);
CREATE INDEX IF NOT EXISTS idx_response_templates_sentiment ON response_templates(sentiment_target, is_active);
CREATE INDEX IF NOT EXISTS idx_review_analytics_date ON review_analytics(restaurant_id, analysis_date);

-- Add RLS policies
ALTER TABLE response_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (assuming user_id is available in context)
CREATE POLICY "Users can manage their restaurant response templates" ON response_templates
    FOR ALL USING (restaurant_id IN (SELECT id FROM restaurant_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their restaurant notification settings" ON review_notification_settings
    FOR ALL USING (restaurant_id IN (SELECT id FROM restaurant_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their restaurant review categories" ON review_categories
    FOR ALL USING (restaurant_id IN (SELECT id FROM restaurant_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their restaurant review tags" ON review_tags
    FOR ALL USING (restaurant_id IN (SELECT id FROM restaurant_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their restaurant review analytics" ON review_analytics
    FOR SELECT USING (restaurant_id IN (SELECT id FROM restaurant_profiles WHERE user_id = auth.uid()));

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_response_templates_updated_at BEFORE UPDATE ON response_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_review_notification_settings_updated_at BEFORE UPDATE ON review_notification_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
