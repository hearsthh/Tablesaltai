-- Production-ready database schema for real-world deployment

-- Enable Row Level Security
ALTER TABLE restaurant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_analytics ENABLE ROW LEVEL SECURITY;

-- Create additional production tables

-- Profile Views Tracking
CREATE TABLE IF NOT EXISTS profile_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    device_type VARCHAR(20) DEFAULT 'desktop',
    location VARCHAR(100),
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu Interactions Tracking
CREATE TABLE IF NOT EXISTS menu_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    interaction_type VARCHAR(20) NOT NULL, -- 'view', 'click', 'favorite'
    session_id VARCHAR(100),
    device_type VARCHAR(20) DEFAULT 'desktop',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Media Engagement
CREATE TABLE IF NOT EXISTS social_engagement (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- 'instagram', 'facebook', 'twitter'
    engagement_type VARCHAR(20) NOT NULL, -- 'like', 'share', 'comment', 'follow'
    count INTEGER DEFAULT 0,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservations
CREATE TABLE IF NOT EXISTS reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    party_size INTEGER NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform Integrations
CREATE TABLE IF NOT EXISTS platform_integrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    platform_name VARCHAR(50) NOT NULL, -- 'google', 'yelp', 'opentable'
    platform_type VARCHAR(20) NOT NULL, -- 'review', 'reservation', 'social'
    is_connected BOOLEAN DEFAULT FALSE,
    api_key_hash VARCHAR(255), -- Hashed API key for security
    webhook_url TEXT,
    last_sync TIMESTAMP WITH TIME ZONE,
    sync_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'success', 'error'
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform Data Storage
CREATE TABLE IF NOT EXISTS platform_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    data_type VARCHAR(50) NOT NULL, -- 'business_info', 'reviews', 'reservations'
    data JSONB NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profile_views_restaurant_id ON profile_views(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_at ON profile_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_menu_interactions_restaurant_id ON menu_interactions(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_interactions_item_id ON menu_interactions(item_id);
CREATE INDEX IF NOT EXISTS idx_social_engagement_restaurant_id ON social_engagement(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_social_engagement_date ON social_engagement(date);
CREATE INDEX IF NOT EXISTS idx_reservations_restaurant_id ON reservations(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_platform_integrations_restaurant_id ON platform_integrations(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_platform_data_restaurant_id ON platform_data(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_platform_data_platform ON platform_data(platform);

-- Row Level Security Policies

-- Profile Views
CREATE POLICY "Users can view their own profile views" ON profile_views
    FOR SELECT USING (restaurant_id = auth.uid());

CREATE POLICY "Users can insert their own profile views" ON profile_views
    FOR INSERT WITH CHECK (restaurant_id = auth.uid());

-- Menu Interactions
CREATE POLICY "Users can view their own menu interactions" ON menu_interactions
    FOR SELECT USING (restaurant_id = auth.uid());

CREATE POLICY "Users can insert their own menu interactions" ON menu_interactions
    FOR INSERT WITH CHECK (restaurant_id = auth.uid());

-- Social Engagement
CREATE POLICY "Users can manage their own social engagement" ON social_engagement
    FOR ALL USING (restaurant_id = auth.uid());

-- Reservations
CREATE POLICY "Users can manage their own reservations" ON reservations
    FOR ALL USING (restaurant_id = auth.uid());

-- Platform Integrations
CREATE POLICY "Users can manage their own platform integrations" ON platform_integrations
    FOR ALL USING (restaurant_id = auth.uid());

-- Platform Data
CREATE POLICY "Users can manage their own platform data" ON platform_data
    FOR ALL USING (restaurant_id = auth.uid());

-- Enable RLS on new tables
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_data ENABLE ROW LEVEL SECURITY;

-- Add helpful functions

-- Function to get restaurant analytics summary
CREATE OR REPLACE FUNCTION get_restaurant_analytics(restaurant_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'profile_views', (SELECT COUNT(*) FROM profile_views WHERE restaurant_id = restaurant_uuid),
        'menu_interactions', (SELECT COUNT(*) FROM menu_interactions WHERE restaurant_id = restaurant_uuid),
        'reviews', (SELECT COUNT(*) FROM reviews WHERE restaurant_id = restaurant_uuid),
        'reservations', (SELECT COUNT(*) FROM reservations WHERE restaurant_id = restaurant_uuid),
        'average_rating', (SELECT AVG(rating) FROM reviews WHERE restaurant_id = restaurant_uuid),
        'last_updated', NOW()
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update analytics automatically
CREATE OR REPLACE FUNCTION update_restaurant_analytics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the analytics table when relevant data changes
    INSERT INTO restaurant_analytics (
        restaurant_id,
        profile_views,
        menu_views,
        review_count,
        average_rating,
        total_reservations,
        last_updated
    )
    SELECT 
        NEW.restaurant_id,
        (SELECT COUNT(*) FROM profile_views WHERE restaurant_id = NEW.restaurant_id),
        (SELECT COUNT(*) FROM menu_interactions WHERE restaurant_id = NEW.restaurant_id),
        (SELECT COUNT(*) FROM reviews WHERE restaurant_id = NEW.restaurant_id),
        (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE restaurant_id = NEW.restaurant_id),
        (SELECT COUNT(*) FROM reservations WHERE restaurant_id = NEW.restaurant_id),
        NOW()
    ON CONFLICT (restaurant_id) 
    DO UPDATE SET
        profile_views = EXCLUDED.profile_views,
        menu_views = EXCLUDED.menu_views,
        review_count = EXCLUDED.review_count,
        average_rating = EXCLUDED.average_rating,
        total_reservations = EXCLUDED.total_reservations,
        last_updated = EXCLUDED.last_updated;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update analytics
CREATE TRIGGER update_analytics_on_profile_view
    AFTER INSERT ON profile_views
    FOR EACH ROW EXECUTE FUNCTION update_restaurant_analytics();

CREATE TRIGGER update_analytics_on_menu_interaction
    AFTER INSERT ON menu_interactions
    FOR EACH ROW EXECUTE FUNCTION update_restaurant_analytics();

CREATE TRIGGER update_analytics_on_review
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_restaurant_analytics();

CREATE TRIGGER update_analytics_on_reservation
    AFTER INSERT OR UPDATE OR DELETE ON reservations
    FOR EACH ROW EXECUTE FUNCTION update_restaurant_analytics();
