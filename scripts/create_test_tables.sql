-- Additional tables for comprehensive testing

-- Profile views tracking
CREATE TABLE IF NOT EXISTS profile_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurant_profiles(user_id) ON DELETE CASCADE,
  viewer_ip INET,
  user_agent TEXT,
  referrer TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu interactions tracking
CREATE TABLE IF NOT EXISTS menu_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurant_profiles(user_id) ON DELETE CASCADE,
  item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  interaction_type VARCHAR(50) NOT NULL, -- 'view', 'click', 'favorite'
  session_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social media engagement tracking
CREATE TABLE IF NOT EXISTS social_engagement (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurant_profiles(user_id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- 'facebook', 'instagram', 'twitter'
  engagement_type VARCHAR(50) NOT NULL, -- 'like', 'share', 'comment'
  count INTEGER DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform integrations
CREATE TABLE IF NOT EXISTS platform_integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurant_profiles(user_id) ON DELETE CASCADE,
  platform_name VARCHAR(100) NOT NULL,
  platform_type VARCHAR(50) NOT NULL, -- 'review', 'reservation', 'social', 'pos'
  is_connected BOOLEAN DEFAULT FALSE,
  api_key TEXT,
  webhook_url TEXT,
  last_sync TIMESTAMP WITH TIME ZONE,
  sync_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'success', 'error'
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurant_profiles(user_id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  party_size INTEGER NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Review settings table
CREATE TABLE IF NOT EXISTS review_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurant_profiles(user_id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT TRUE,
  require_email BOOLEAN DEFAULT TRUE,
  allow_anonymous BOOLEAN DEFAULT FALSE,
  moderation_required BOOLEAN DEFAULT TRUE,
  auto_publish BOOLEAN DEFAULT FALSE,
  email_notifications BOOLEAN DEFAULT TRUE,
  thank_you_message TEXT DEFAULT 'Thank you for your feedback!',
  form_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurant analytics summary
CREATE TABLE IF NOT EXISTS restaurant_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurant_profiles(user_id) ON DELETE CASCADE,
  profile_views INTEGER DEFAULT 0,
  menu_views INTEGER DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  reservation_count INTEGER DEFAULT 0,
  social_engagement_score INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_profile_views_restaurant_id ON profile_views(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_at ON profile_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_menu_interactions_restaurant_id ON menu_interactions(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_interactions_item_id ON menu_interactions(item_id);
CREATE INDEX IF NOT EXISTS idx_social_engagement_restaurant_id ON social_engagement(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_social_engagement_date ON social_engagement(date);
CREATE INDEX IF NOT EXISTS idx_platform_integrations_restaurant_id ON platform_integrations(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reservations_restaurant_id ON reservations(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_review_settings_restaurant_id ON review_settings(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_analytics_restaurant_id ON restaurant_analytics(restaurant_id);

-- Add some sample data for testing
INSERT INTO platform_integrations (restaurant_id, platform_name, platform_type, is_connected, settings) 
SELECT 
  user_id,
  'Google My Business',
  'review',
  true,
  '{"auto_sync": true, "response_templates": true}'
FROM restaurant_profiles 
WHERE restaurant_name = 'Spice Garden'
ON CONFLICT DO NOTHING;

-- Update restaurant_profiles table to include additional fields
ALTER TABLE restaurant_profiles 
ADD COLUMN IF NOT EXISTS google_place_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS yelp_business_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS platform_ratings JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS seo_keywords TEXT[],
ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Update menu_items table for better tracking
ALTER TABLE menu_items 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS popularity_score DECIMAL(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_ordered TIMESTAMP WITH TIME ZONE;

-- Update reviews table for better analytics
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS external_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS helpful_votes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS response_text TEXT,
ADD COLUMN IF NOT EXISTS responded_at TIMESTAMP WITH TIME ZONE;

COMMENT ON TABLE profile_views IS 'Tracks profile page views for analytics';
COMMENT ON TABLE menu_interactions IS 'Tracks user interactions with menu items';
COMMENT ON TABLE social_engagement IS 'Tracks social media engagement metrics';
COMMENT ON TABLE platform_integrations IS 'Manages third-party platform connections';
COMMENT ON TABLE reservations IS 'Stores restaurant reservations';
COMMENT ON TABLE review_settings IS 'Configuration for review collection system';
COMMENT ON TABLE restaurant_analytics IS 'Aggregated analytics data for restaurants';
