-- Restaurant Management Platform - Production Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE cuisine_type AS ENUM (
        'italian', 'chinese', 'indian', 'mexican', 'american', 'french', 
        'japanese', 'thai', 'mediterranean', 'korean', 'vietnamese', 'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE restaurant_type AS ENUM (
        'fine_dining', 'casual_dining', 'fast_casual', 'fast_food', 
        'cafe', 'bar', 'food_truck', 'catering', 'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE price_range AS ENUM ('$', '$$', '$$$', '$$$$');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Restaurant Profiles Table
CREATE TABLE IF NOT EXISTS restaurant_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    restaurant_name VARCHAR(255) NOT NULL,
    tagline TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    cuisine_type cuisine_type DEFAULT 'other',
    restaurant_type restaurant_type DEFAULT 'casual_dining',
    price_range price_range DEFAULT '$$',
    website VARCHAR(500),
    description TEXT,
    operating_hours JSONB DEFAULT '{}',
    social_media JSONB DEFAULT '{}',
    brand_colors JSONB DEFAULT '{}',
    brand_voice VARCHAR(100) DEFAULT 'professional',
    amenities TEXT[] DEFAULT '{}',
    logo_url TEXT,
    cover_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    setup_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 2. Menu Categories Table
CREATE TABLE IF NOT EXISTS menu_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    dietary_tags TEXT[] DEFAULT '{}',
    allergen_info TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(500),
    content TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    source VARCHAR(100) DEFAULT 'direct',
    external_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Review Settings Table
CREATE TABLE IF NOT EXISTS review_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    enabled BOOLEAN DEFAULT true,
    require_email BOOLEAN DEFAULT true,
    moderation_required BOOLEAN DEFAULT true,
    auto_publish BOOLEAN DEFAULT false,
    email_notifications BOOLEAN DEFAULT true,
    thank_you_message TEXT DEFAULT 'Thank you for your feedback!',
    min_rating INTEGER DEFAULT 1,
    max_rating INTEGER DEFAULT 5,
    allow_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(restaurant_id)
);

-- 6. Restaurant Analytics Table
CREATE TABLE IF NOT EXISTS restaurant_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_views INTEGER DEFAULT 0,
    menu_views INTEGER DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reservations INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(restaurant_id)
);

-- 7. Platform Integrations Table
CREATE TABLE IF NOT EXISTS platform_integrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    platform_name VARCHAR(100) NOT NULL,
    platform_id VARCHAR(255),
    api_key_hash TEXT,
    access_token_hash TEXT,
    refresh_token_hash TEXT,
    is_active BOOLEAN DEFAULT true,
    last_sync TIMESTAMP WITH TIME ZONE,
    sync_status VARCHAR(50) DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(restaurant_id, platform_name)
);

-- 8. Generated Content Table
CREATE TABLE IF NOT EXISTS generated_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_type VARCHAR(100) NOT NULL,
    title VARCHAR(500),
    content JSONB NOT NULL,
    metadata JSONB DEFAULT '{}',
    is_applied BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    applied_at TIMESTAMP WITH TIME ZONE
);

-- 9. Marketing Campaigns Table
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    campaign_type VARCHAR(100) NOT NULL,
    target_audience JSONB DEFAULT '{}',
    content JSONB NOT NULL,
    channels TEXT[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'draft',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    metrics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Customer Segments Table
CREATE TABLE IF NOT EXISTS customer_segments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    criteria JSONB NOT NULL,
    customer_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_name VARCHAR(100) NOT NULL,
    plan_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT false,
    payment_provider VARCHAR(50),
    external_subscription_id VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(restaurant_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_restaurant_profiles_user_id ON restaurant_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_menu_categories_restaurant_id ON menu_categories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_reviews_restaurant_id ON reviews(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_published ON reviews(restaurant_id, is_published);
CREATE INDEX IF NOT EXISTS idx_platform_integrations_restaurant_id ON platform_integrations(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_restaurant_id ON generated_content(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_restaurant_id ON marketing_campaigns(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_restaurant_id ON activity_logs(restaurant_id);

-- Enable Row Level Security
ALTER TABLE restaurant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Restaurant Profiles
CREATE POLICY "Users can view own restaurant profile" ON restaurant_profiles
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own restaurant profile" ON restaurant_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own restaurant profile" ON restaurant_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Menu Categories
CREATE POLICY "Users can manage own menu categories" ON menu_categories
    FOR ALL USING (auth.uid() = restaurant_id);

-- Menu Items
CREATE POLICY "Users can manage own menu items" ON menu_items
    FOR ALL USING (auth.uid() = restaurant_id);

-- Reviews
CREATE POLICY "Users can view own reviews" ON reviews
    FOR SELECT USING (auth.uid() = restaurant_id);
CREATE POLICY "Anyone can insert reviews" ON reviews
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own reviews" ON reviews
    FOR UPDATE USING (auth.uid() = restaurant_id);

-- Review Settings
CREATE POLICY "Users can manage own review settings" ON review_settings
    FOR ALL USING (auth.uid() = restaurant_id);

-- Restaurant Analytics
CREATE POLICY "Users can view own analytics" ON restaurant_analytics
    FOR ALL USING (auth.uid() = restaurant_id);

-- Platform Integrations
CREATE POLICY "Users can manage own integrations" ON platform_integrations
    FOR ALL USING (auth.uid() = restaurant_id);

-- Generated Content
CREATE POLICY "Users can manage own generated content" ON generated_content
    FOR ALL USING (auth.uid() = restaurant_id);

-- Marketing Campaigns
CREATE POLICY "Users can manage own campaigns" ON marketing_campaigns
    FOR ALL USING (auth.uid() = restaurant_id);

-- Customer Segments
CREATE POLICY "Users can manage own segments" ON customer_segments
    FOR ALL USING (auth.uid() = restaurant_id);

-- Activity Logs
CREATE POLICY "Users can view own activity logs" ON activity_logs
    FOR SELECT USING (auth.uid() = restaurant_id);
CREATE POLICY "System can insert activity logs" ON activity_logs
    FOR INSERT WITH CHECK (true);

-- Subscriptions
CREATE POLICY "Users can view own subscription" ON subscriptions
    FOR ALL USING (auth.uid() = restaurant_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_restaurant_profiles_updated_at BEFORE UPDATE ON restaurant_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_categories_updated_at BEFORE UPDATE ON menu_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_review_settings_updated_at BEFORE UPDATE ON review_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_platform_integrations_updated_at BEFORE UPDATE ON platform_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketing_campaigns_updated_at BEFORE UPDATE ON marketing_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update analytics
CREATE OR REPLACE FUNCTION update_restaurant_analytics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update review count and average rating
    IF TG_TABLE_NAME = 'reviews' THEN
        UPDATE restaurant_analytics 
        SET 
            review_count = (
                SELECT COUNT(*) 
                FROM reviews 
                WHERE restaurant_id = COALESCE(NEW.restaurant_id, OLD.restaurant_id) 
                AND is_published = true
            ),
            average_rating = (
                SELECT COALESCE(AVG(rating), 0) 
                FROM reviews 
                WHERE restaurant_id = COALESCE(NEW.restaurant_id, OLD.restaurant_id) 
                AND is_published = true
            ),
            last_updated = NOW()
        WHERE restaurant_id = COALESCE(NEW.restaurant_id, OLD.restaurant_id);
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create triggers for analytics updates
CREATE TRIGGER update_analytics_on_review_change 
    AFTER INSERT OR UPDATE OR DELETE ON reviews 
    FOR EACH ROW EXECUTE FUNCTION update_restaurant_analytics();

-- Insert default analytics for existing users
INSERT INTO restaurant_analytics (restaurant_id, profile_views, menu_views, review_count, average_rating)
SELECT 
    id as restaurant_id,
    0 as profile_views,
    0 as menu_views,
    0 as review_count,
    0.00 as average_rating
FROM auth.users
WHERE id NOT IN (SELECT restaurant_id FROM restaurant_analytics)
ON CONFLICT (restaurant_id) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '🎉 Production database schema created successfully!';
    RAISE NOTICE '✅ 12 tables created with proper relationships';
    RAISE NOTICE '✅ Row Level Security enabled on all tables';
    RAISE NOTICE '✅ Performance indexes created';
    RAISE NOTICE '✅ Automatic triggers configured';
    RAISE NOTICE '🚀 Ready for production development!';
END $$;
