-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    platform VARCHAR(50) NOT NULL,
    platform_review_id VARCHAR(255) NOT NULL,
    author_name VARCHAR(255),
    author_avatar_url TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    review_date TIMESTAMP WITH TIME ZONE NOT NULL,
    response_text TEXT,
    response_date TIMESTAMP WITH TIME ZONE,
    responded_by UUID,
    is_featured BOOLEAN DEFAULT FALSE,
    sentiment VARCHAR(20) DEFAULT 'neutral',
    categories TEXT[] DEFAULT '{}',
    key_points TEXT[] DEFAULT '{}',
    urgency VARCHAR(10) DEFAULT 'low',
    confidence_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(platform, platform_review_id)
);

-- Create review insights table
CREATE TABLE IF NOT EXISTS review_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_reviews INTEGER NOT NULL,
    average_rating DECIMAL(3,2) NOT NULL,
    overall_sentiment DECIMAL(3,2) NOT NULL,
    response_rate INTEGER NOT NULL,
    highlights JSONB NOT NULL DEFAULT '[]',
    red_flags JSONB NOT NULL DEFAULT '[]',
    use_cases JSONB NOT NULL DEFAULT '[]',
    sentiment_trends JSONB NOT NULL DEFAULT '[]',
    response_metrics JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create improvement tasks table
CREATE TABLE IF NOT EXISTS improvement_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    task_type VARCHAR(20) NOT NULL CHECK (task_type IN ('internal', 'external')),
    priority VARCHAR(10) NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    category VARCHAR(50) NOT NULL,
    estimated_days INTEGER NOT NULL,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
    auto_detectable BOOLEAN DEFAULT FALSE,
    assigned_to UUID,
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create review notifications table
CREATE TABLE IF NOT EXISTS review_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    urgency VARCHAR(10) DEFAULT 'low' CHECK (urgency IN ('low', 'medium', 'high')),
    is_read BOOLEAN DEFAULT FALSE,
    is_dismissed BOOLEAN DEFAULT FALSE,
    action_required BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create auto response settings table
CREATE TABLE IF NOT EXISTS auto_response_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT FALSE,
    response_guidelines TEXT NOT NULL,
    positive_review_delay INTEGER DEFAULT 0, -- minutes
    neutral_review_delay INTEGER DEFAULT 120, -- minutes
    negative_review_delay INTEGER DEFAULT -1, -- -1 means manual approval required
    business_hours_only BOOLEAN DEFAULT FALSE,
    exclude_keywords TEXT[] DEFAULT '{}',
    include_restaurant_name BOOLEAN DEFAULT TRUE,
    tone VARCHAR(20) DEFAULT 'professional' CHECK (tone IN ('professional', 'casual', 'friendly', 'formal')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create review response templates table
CREATE TABLE IF NOT EXISTS review_response_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    template_type VARCHAR(20) NOT NULL CHECK (template_type IN ('positive', 'negative', 'neutral', 'specific')),
    template_text TEXT NOT NULL,
    use_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create platform connections table
CREATE TABLE IF NOT EXISTS platform_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    platform_name VARCHAR(50) NOT NULL,
    platform_id VARCHAR(255),
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    connection_status VARCHAR(20) DEFAULT 'active' CHECK (connection_status IN ('active', 'inactive', 'error', 'expired')),
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_frequency INTEGER DEFAULT 60, -- minutes
    auto_sync_enabled BOOLEAN DEFAULT TRUE,
    webhook_url TEXT,
    webhook_secret TEXT,
    platform_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(restaurant_id, platform_name)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_restaurant_id ON reviews(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_platform ON reviews(platform);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_sentiment ON reviews(sentiment);
CREATE INDEX IF NOT EXISTS idx_reviews_date ON reviews(review_date);
CREATE INDEX IF NOT EXISTS idx_reviews_responded ON reviews(response_text) WHERE response_text IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_review_insights_restaurant_id ON review_insights(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_review_insights_date ON review_insights(analysis_date);

CREATE INDEX IF NOT EXISTS idx_improvement_tasks_restaurant_id ON improvement_tasks(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_improvement_tasks_status ON improvement_tasks(status);
CREATE INDEX IF NOT EXISTS idx_improvement_tasks_priority ON improvement_tasks(priority);

CREATE INDEX IF NOT EXISTS idx_review_notifications_restaurant_id ON review_notifications(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_review_notifications_unread ON review_notifications(is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_review_notifications_urgency ON review_notifications(urgency);

CREATE INDEX IF NOT EXISTS idx_platform_connections_restaurant_id ON platform_connections(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_platform_connections_status ON platform_connections(connection_status);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_insights_updated_at BEFORE UPDATE ON review_insights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_improvement_tasks_updated_at BEFORE UPDATE ON improvement_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_notifications_updated_at BEFORE UPDATE ON review_notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_auto_response_settings_updated_at BEFORE UPDATE ON auto_response_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platform_connections_updated_at BEFORE UPDATE ON platform_connections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample auto response settings
INSERT INTO auto_response_settings (
    restaurant_id,
    is_enabled,
    response_guidelines,
    positive_review_delay,
    neutral_review_delay,
    negative_review_delay,
    tone
) VALUES (
    gen_random_uuid(),
    FALSE,
    'Respond professionally and warmly to customer reviews. Address specific points mentioned. Thank positive reviewers and acknowledge concerns in negative reviews with solutions. Always maintain our restaurant''s friendly and welcoming tone.',
    0,
    120,
    -1,
    'professional'
) ON CONFLICT DO NOTHING;

-- Insert sample response templates
INSERT INTO review_response_templates (
    restaurant_id,
    template_name,
    template_type,
    template_text
) VALUES 
(
    (SELECT restaurant_id FROM auto_response_settings LIMIT 1),
    'Positive Review - General',
    'positive',
    'Thank you so much for your wonderful review! We''re thrilled to hear that you had a great experience with us. Your kind words mean the world to our team, and we can''t wait to welcome you back soon!'
),
(
    (SELECT restaurant_id FROM auto_response_settings LIMIT 1),
    'Negative Review - Service Issue',
    'negative',
    'Thank you for taking the time to share your feedback. We sincerely apologize that your experience didn''t meet your expectations, particularly regarding our service. We take all feedback seriously and would love the opportunity to make this right. Please contact us directly so we can address your concerns and ensure a better experience next time.'
),
(
    (SELECT restaurant_id FROM auto_response_settings LIMIT 1),
    'Neutral Review - Mixed Experience',
    'neutral',
    'Thank you for your honest feedback about your experience with us. We''re glad you enjoyed some aspects of your visit, and we appreciate you bringing the areas for improvement to our attention. We hope to provide you with an even better experience on your next visit!'
) ON CONFLICT DO NOTHING;
