-- Comprehensive database schema for restaurant AI marketing platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Users and Authentication
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  role VARCHAR(50) DEFAULT 'restaurant_owner',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription Management
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  plan VARCHAR(50) NOT NULL, -- starter, professional, enterprise
  status VARCHAR(50) NOT NULL, -- active, cancelled, past_due
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  features JSONB DEFAULT '[]',
  usage_metrics JSONB DEFAULT '{}',
  payment_method_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurant Profiles
CREATE TABLE IF NOT EXISTS restaurant_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Basic Information
  name VARCHAR(255) NOT NULL,
  tagline TEXT,
  description TEXT,
  cuisine_types TEXT[] DEFAULT '{}',
  restaurant_type VARCHAR(100),
  price_range VARCHAR(10),
  established_year INTEGER,
  capacity INTEGER,
  
  -- Contact Information
  email VARCHAR(255),
  phone VARCHAR(20),
  website VARCHAR(255),
  
  -- Address
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Operating Hours
  operating_hours JSONB DEFAULT '{}',
  
  -- Social Media
  social_media JSONB DEFAULT '{}',
  
  -- Branding
  brand_colors JSONB DEFAULT '{}',
  brand_voice TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  
  -- Details
  story TEXT,
  mission TEXT,
  values TEXT[],
  specialties TEXT[],
  dietary_options TEXT[],
  ambiance TEXT[],
  parking_info TEXT,
  accessibility TEXT[],
  
  -- Features
  amenities TEXT[],
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  setup_completed BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media Assets
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
  
  url TEXT NOT NULL,
  type VARCHAR(20) NOT NULL, -- image, video
  category VARCHAR(50) NOT NULL, -- food, interior, exterior, staff, events, logo, menu
  subcategory VARCHAR(100),
  title VARCHAR(255),
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Dimensions and metadata
  width INTEGER,
  height INTEGER,
  aspect_ratio VARCHAR(20),
  file_size BIGINT,
  format VARCHAR(20),
  
  -- Organization
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  
  -- Tracking
  uploaded_by UUID REFERENCES user_profiles(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu Categories
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
  
  name VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
  
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2), -- for profit margin calculation
  
  -- Media
  images TEXT[] DEFAULT '{}',
  
  -- Details
  ingredients TEXT[] DEFAULT '{}',
  allergens TEXT[] DEFAULT '{}',
  nutritional_info JSONB DEFAULT '{}',
  dietary_tags TEXT[] DEFAULT '{}',
  preparation_time INTEGER, -- in minutes
  spice_level INTEGER DEFAULT 0, -- 0-5 scale
  
  -- AI Generated Content
  ai_generated_description TEXT,
  ai_generated_tags TEXT[] DEFAULT '{}',
  
  -- Status and Organization
  is_available BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu Combos
CREATE TABLE IF NOT EXISTS menu_combos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
  
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  items JSONB NOT NULL, -- array of {item_id, quantity}
  
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
  
  -- Customer Info
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  
  -- Review Content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(500),
  content TEXT,
  
  -- Platform Info
  platform VARCHAR(100) NOT NULL, -- google, yelp, zomato, direct, etc.
  platform_review_id VARCHAR(255),
  platform_url TEXT,
  
  -- Metadata
  review_date TIMESTAMP WITH TIME ZONE,
  visit_date TIMESTAMP WITH TIME ZONE,
  is_verified BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  
  -- AI Analysis
  sentiment VARCHAR(20), -- positive, negative, neutral
  sentiment_score DECIMAL(3, 2),
  topics TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  
  -- Response Management
  response TEXT,
  response_date TIMESTAMP WITH TIME ZONE,
  response_author UUID REFERENCES user_profiles(id),
  auto_response BOOLEAN DEFAULT false,
  
  -- Status
  is_published BOOLEAN DEFAULT true,
  requires_attention BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(platform, platform_review_id)
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
  
  -- Basic Info
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  
  -- Demographics
  age_group VARCHAR(20),
  gender VARCHAR(20),
  location VARCHAR(255),
  
  -- Preferences
  cuisine_preferences TEXT[] DEFAULT '{}',
  dietary_restrictions TEXT[] DEFAULT '{}',
  preferred_dining_time VARCHAR(50),
  party_size_preference INTEGER,
  
  -- Behavior Data
  total_visits INTEGER DEFAULT 0,
  total_spent DECIMAL(10, 2) DEFAULT 0,
  average_order_value DECIMAL(10, 2) DEFAULT 0,
  last_visit_date TIMESTAMP WITH TIME ZONE,
  acquisition_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  acquisition_source VARCHAR(100),
  
  -- Engagement
  email_subscribed BOOLEAN DEFAULT false,
  sms_subscribed BOOLEAN DEFAULT false,
  loyalty_member BOOLEAN DEFAULT false,
  loyalty_points INTEGER DEFAULT 0,
  
  -- AI Insights
  customer_segment VARCHAR(100),
  lifetime_value DECIMAL(10, 2),
  churn_risk_score DECIMAL(3, 2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(restaurant_id, email)
);

-- Customer Orders
CREATE TABLE IF NOT EXISTS customer_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  
  order_date TIMESTAMP WITH TIME ZONE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  items JSONB NOT NULL, -- array of {item_id, quantity, price}
  order_type VARCHAR(50), -- dine_in, takeaway, delivery
  payment_method VARCHAR(50),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing Campaigns
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
  
  name VARCHAR(255) NOT NULL,
  description TEXT,
  objective VARCHAR(100), -- awareness, traffic, conversions, engagement
  
  -- Campaign Details
  campaign_type VARCHAR(100), -- social_media, email, sms, paid_ads
  status VARCHAR(50) DEFAULT 'draft', -- draft, active, paused, completed
  
  -- Targeting
  target_audience JSONB DEFAULT '{}',
  budget DECIMAL(10, 2),
  
  -- Content
  content JSONB DEFAULT '{}',
  
  -- Schedule
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  
  -- Performance
  metrics JSONB DEFAULT '{}',
  
  -- AI Generated
  ai_generated BOOLEAN DEFAULT false,
  ai_strategy TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated Content
CREATE TABLE IF NOT EXISTS generated_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
  
  content_type VARCHAR(100) NOT NULL, -- social_post, email, sms, ad_copy, etc.
  platform VARCHAR(100), -- instagram, facebook, twitter, etc.
  
  title VARCHAR(500),
  content TEXT NOT NULL,
  hashtags TEXT[] DEFAULT '{}',
  call_to_action TEXT,
  
  -- AI Generation Info
  ai_model VARCHAR(100),
  generation_prompt TEXT,
  generation_parameters JSONB DEFAULT '{}',
  
  -- Usage
  is_used BOOLEAN DEFAULT false,
  used_in_campaign UUID REFERENCES marketing_campaigns(id),
  
  -- Performance
  engagement_metrics JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform Integrations
CREATE TABLE IF NOT EXISTS platform_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
  
  platform_name VARCHAR(100) NOT NULL,
  platform_type VARCHAR(50) NOT NULL, -- pos, delivery, social, review, reservation, payment
  
  -- Connection Status
  status VARCHAR(50) DEFAULT 'disconnected', -- connected, disconnected, error
  
  -- Credentials (encrypted)
  credentials JSONB DEFAULT '{}',
  
  -- Configuration
  sync_frequency VARCHAR(50) DEFAULT 'daily',
  data_mapping JSONB DEFAULT '{}',
  
  -- Sync Status
  last_sync TIMESTAMP WITH TIME ZONE,
  sync_status VARCHAR(50),
  sync_errors TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(restaurant_id, platform_name)
);

-- Analytics Data
CREATE TABLE IF NOT EXISTS analytics_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
  
  date DATE NOT NULL,
  metric_type VARCHAR(100) NOT NULL, -- revenue, orders, customers, etc.
  metric_value DECIMAL(15, 2) NOT NULL,
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(restaurant_id, date, metric_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_restaurant_profiles_user_id ON restaurant_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_restaurant_id ON media_assets(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_reviews_restaurant_id ON reviews(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_platform ON reviews(platform);
CREATE INDEX IF NOT EXISTS idx_customers_restaurant_id ON customers(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customer_orders_restaurant_id ON customer_orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_customer_orders_customer_id ON customer_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_restaurant_id ON marketing_campaigns(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_restaurant_id ON generated_content(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_platform_integrations_restaurant_id ON platform_integrations(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_analytics_data_restaurant_id ON analytics_data(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_analytics_data_date ON analytics_data(date);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurant_profiles_updated_at BEFORE UPDATE ON restaurant_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_assets_updated_at BEFORE UPDATE ON media_assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_categories_updated_at BEFORE UPDATE ON menu_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_combos_updated_at BEFORE UPDATE ON menu_combos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketing_campaigns_updated_at BEFORE UPDATE ON marketing_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generated_content_updated_at BEFORE UPDATE ON generated_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_platform_integrations_updated_at BEFORE UPDATE ON platform_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
