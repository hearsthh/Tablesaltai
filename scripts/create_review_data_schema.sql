-- Review data schema for multi-channel review management

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Review data main table
CREATE TABLE IF NOT EXISTS review_data (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT NOT NULL,
    
    -- Channel metrics (JSON array)
    channel_metrics JSONB DEFAULT '[]',
    
    -- All reviews content (JSON array)
    all_reviews JSONB DEFAULT '[]',
    
    -- New reviews sessions (JSON array)
    new_reviews JSONB DEFAULT '[]',
    
    -- Summary data
    total_channels INTEGER DEFAULT 0,
    overall_rating DECIMAL(3,2) DEFAULT 0,
    total_review_count INTEGER DEFAULT 0,
    
    -- Completion status
    completion_status JSONB DEFAULT '{}',
    
    -- Metadata
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Connected channels table
CREATE TABLE IF NOT EXISTS connected_channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id TEXT NOT NULL,
    
    -- Channel info
    channel_id TEXT NOT NULL,
    channel_name TEXT NOT NULL,
    channel_type TEXT NOT NULL, -- google, yelp, zomato, etc.
    
    -- Connection status
    is_connected BOOLEAN DEFAULT false,
    connection_status TEXT DEFAULT 'disconnected', -- connected, disconnected, error, pending
    
    -- Credentials (encrypted)
    credentials JSONB DEFAULT '{}',
    
    -- Sync settings
    sync_frequency TEXT DEFAULT 'daily', -- realtime, hourly, daily, weekly, manual
    auto_response BOOLEAN DEFAULT false,
    
    -- Performance metrics
    avg_rating DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    
    -- Sync status
    last_sync_time TIMESTAMP WITH TIME ZONE,
    sync_status TEXT DEFAULT 'never', -- success, error, pending, never
    sync_error_message TEXT,
    
    -- URLs and assets
    channel_url TEXT,
    channel_logo TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, channel_id)
);

-- Individual reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id TEXT NOT NULL,
    
    -- Channel info
    channel_id TEXT NOT NULL,
    channel_name TEXT NOT NULL,
    review_id TEXT NOT NULL, -- Platform-specific review ID
    
    -- Customer info
    customer_name TEXT NOT NULL,
    customer_avatar TEXT,
    
    -- Review content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT NOT NULL,
    
    -- Timestamps
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    review_date TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Verification and engagement
    is_verified BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    
    -- AI analysis
    sentiment TEXT DEFAULT 'neutral', -- positive, negative, neutral
    sentiment_score DECIMAL(3,2) DEFAULT 0,
    keywords TEXT[] DEFAULT '{}',
    topics TEXT[] DEFAULT '{}',
    language TEXT DEFAULT 'en',
    
    -- Media
    photos JSONB DEFAULT '[]',
    
    -- External links
    original_url TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Status
    requires_attention BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(channel_id, review_id)
);

-- Owner responses table
CREATE TABLE IF NOT EXISTS owner_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
    
    -- Response content
    content TEXT NOT NULL,
    
    -- Response info
    responded_by TEXT NOT NULL,
    is_ai_generated BOOLEAN DEFAULT false,
    ai_model TEXT,
    
    -- Status
    is_published BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Review sessions table (for tracking new reviews per login)
CREATE TABLE IF NOT EXISTS review_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id TEXT NOT NULL,
    
    session_id TEXT NOT NULL,
    login_time TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Session summary
    total_new_reviews INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    positive_reviews INTEGER DEFAULT 0,
    negative_reviews INTEGER DEFAULT 0,
    neutral_reviews INTEGER DEFAULT 0,
    channels_updated INTEGER DEFAULT 0,
    overall_rating_change DECIMAL(3,2) DEFAULT 0,
    
    -- Session data
    new_reviews JSONB DEFAULT '[]',
    channel_updates JSONB DEFAULT '[]',
    highlights TEXT[] DEFAULT '{}',
    requires_attention JSONB DEFAULT '[]',
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, session_id)
);

-- Response templates table
CREATE TABLE IF NOT EXISTS response_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id TEXT NOT NULL,
    
    -- Template info
    name TEXT NOT NULL,
    template TEXT NOT NULL,
    tone TEXT NOT NULL, -- professional, friendly, apologetic, grateful
    
    -- Conditions
    rating_min INTEGER DEFAULT 1,
    rating_max INTEGER DEFAULT 5,
    sentiment TEXT, -- positive, negative, neutral
    keywords TEXT[] DEFAULT '{}',
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auto response rules table
CREATE TABLE IF NOT EXISTS auto_response_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id TEXT NOT NULL,
    
    -- Rule definition
    name TEXT NOT NULL,
    condition_type TEXT NOT NULL, -- rating_above, rating_below, contains_keyword, sentiment
    condition_value JSONB NOT NULL,
    
    -- Action
    action_type TEXT NOT NULL, -- auto_respond, notify_only, flag_review
    template_id UUID REFERENCES response_templates(id),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    execution_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Review analytics table
CREATE TABLE IF NOT EXISTS review_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id TEXT NOT NULL,
    
    -- Time period
    date DATE NOT NULL,
    period_type TEXT NOT NULL, -- daily, weekly, monthly
    
    -- Metrics
    total_reviews INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    rating_distribution JSONB DEFAULT '{}',
    sentiment_breakdown JSONB DEFAULT '{}',
    
    -- Channel breakdown
    channel_metrics JSONB DEFAULT '{}',
    
    --  Keywords and topics
    top_keywords JSONB DEFAULT '[]',
    top_topics JSONB DEFAULT '[]',
    
    -- Response metrics
    response_rate DECIMAL(5,2) DEFAULT 0,
    average_response_time INTEGER DEFAULT 0, -- in hours
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, date, period_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_review_data_restaurant_id ON review_data(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_connected_channels_restaurant_id ON connected_channels(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_connected_channels_channel_id ON connected_channels(channel_id);
CREATE INDEX IF NOT EXISTS idx_reviews_restaurant_id ON reviews(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_channel_id ON reviews(channel_id);
CREATE INDEX IF NOT EXISTS idx_reviews_timestamp ON reviews(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_sentiment ON reviews(sentiment);
CREATE INDEX IF NOT EXISTS idx_review_sessions_restaurant_id ON review_sessions(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_review_sessions_login_time ON review_sessions(login_time DESC);
CREATE INDEX IF NOT EXISTS idx_response_templates_restaurant_id ON response_templates(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_auto_response_rules_restaurant_id ON auto_response_rules(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_review_analytics_restaurant_id ON review_analytics(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_review_analytics_date ON review_analytics(date DESC);

-- Insert demo data
INSERT INTO review_data (id, restaurant_id, channel_metrics, total_channels, overall_rating, total_review_count, completion_status, last_updated)
VALUES (
    'review_data_550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440000',
    '[
        {
            "channelId": "google",
            "channelName": "Google My Business",
            "channelType": "google",
            "isConnected": true,
            "avgRating": 4.3,
            "ratingCount": 127,
            "lastSyncTime": "2024-01-15T10:30:00Z",
            "syncStatus": "success",
            "channelUrl": "https://business.google.com",
            "channelLogo": "/logos/google.png"
        },
        {
            "channelId": "yelp",
            "channelName": "Yelp",
            "channelType": "yelp",
            "isConnected": true,
            "avgRating": 4.1,
            "ratingCount": 89,
            "lastSyncTime": "2024-01-15T10:15:00Z",
            "syncStatus": "success",
            "channelUrl": "https://business.yelp.com",
            "channelLogo": "/logos/yelp.png"
        },
        {
            "channelId": "zomato",
            "channelName": "Zomato",
            "channelType": "zomato",
            "isConnected": true,
            "avgRating": 4.2,
            "ratingCount": 156,
            "lastSyncTime": "2024-01-15T09:30:00Z",
            "syncStatus": "success",
            "channelUrl": "https://business.zomato.com",
            "channelLogo": "/logos/zomato.png"
        }
    ]',
    3,
    4.2,
    372,
    '{"channelConnections": 75, "syncSettings": 100, "responseTemplates": 0, "testSync": 100, "overall": 69}',
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    channel_metrics = EXCLUDED.channel_metrics,
    total_channels = EXCLUDED.total_channels,
    overall_rating = EXCLUDED.overall_rating,
    total_review_count = EXCLUDED.total_review_count,
    completion_status = EXCLUDED.completion_status,
    updated_at = NOW();

-- Insert demo connected channels
INSERT INTO connected_channels (restaurant_id, channel_id, channel_name, channel_type, is_connected, connection_status, avg_rating, rating_count, last_sync_time, sync_status, channel_url, channel_logo)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'google', 'Google My Business', 'google', true, 'connected', 4.3, 127, NOW() - INTERVAL '30 minutes', 'success', 'https://business.google.com', '/logos/google.png'),
    ('550e8400-e29b-41d4-a716-446655440000', 'yelp', 'Yelp', 'yelp', true, 'connected', 4.1, 89, NOW() - INTERVAL '45 minutes', 'success', 'https://business.yelp.com', '/logos/yelp.png'),
    ('550e8400-e29b-41d4-a716-446655440000', 'zomato', 'Zomato', 'zomato', true, 'connected', 4.2, 156, NOW() - INTERVAL '1 hour', 'success', 'https://business.zomato.com', '/logos/zomato.png'),
    ('550e8400-e29b-41d4-a716-446655440000', 'tripadvisor', 'TripAdvisor', 'tripadvisor', false, 'disconnected', 0, 0, NULL, 'never', 'https://business.tripadvisor.com', '/logos/tripadvisor.png'),
    ('550e8400-e29b-41d4-a716-446655440000', 'facebook', 'Facebook', 'facebook', true, 'connected', 4.4, 73, NOW() - INTERVAL '2 hours', 'success', 'https://business.facebook.com', '/logos/facebook.png')
ON CONFLICT (restaurant_id, channel_id) DO UPDATE SET
    is_connected = EXCLUDED.is_connected,
    connection_status = EXCLUDED.connection_status,
    avg_rating = EXCLUDED.avg_rating,
    rating_count = EXCLUDED.rating_count,
    last_sync_time = EXCLUDED.last_sync_time,
    sync_status = EXCLUDED.sync_status,
    updated_at = NOW();

-- Insert demo response templates
INSERT INTO response_templates (restaurant_id, name, template, tone, rating_min, rating_max, is_active)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'Positive Review Response', 'Thank you so much for your wonderful review! We''re thrilled that you had such a great experience with us. We look forward to welcoming you back soon!', 'grateful', 4, 5, true),
    ('550e8400-e29b-41d4-a716-446655440000', 'Negative Review Response', 'We sincerely apologize for your experience. This is not the standard we strive for. Please contact us directly so we can make this right and improve for the future.', 'apologetic', 1, 2, true),
    ('550e8400-e29b-41d4-a716-446655440000', 'Neutral Review Response', 'Thank you for taking the time to share your feedback. We truly appreciate all reviews as they help us continue to improve our service and offerings.', 'professional', 3, 3, true)
ON CONFLICT DO NOTHING;

COMMIT;
