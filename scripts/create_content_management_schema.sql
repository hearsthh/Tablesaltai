-- Content Management System Schema
-- Comprehensive content storage and management for restaurant marketing

-- Main Content Assets Table
CREATE TABLE IF NOT EXISTS content_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'brand_profile_media', 'menu_dish_media', 'short_videos',
        'restaurant_space_experience', 'campaign_ready_content', 'optional_advanced_media'
    )),
    subcategory VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type VARCHAR(20) NOT NULL CHECK (file_type IN ('image', 'video', 'audio', 'document', 'template')),
    file_size BIGINT NOT NULL,
    
    -- Media Specifications
    dimensions JSONB, -- {width: number, height: number}
    duration INTEGER, -- seconds for video/audio
    
    -- Content Metadata
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    
    -- AI Generation Info
    ai_generated BOOLEAN DEFAULT FALSE,
    ai_prompt TEXT,
    ai_model VARCHAR(50),
    
    -- Rights and Usage
    usage_rights VARCHAR(20) DEFAULT 'owned' CHECK (usage_rights IN ('owned', 'licensed', 'user_generated', 'stock')),
    usage_permissions TEXT[] DEFAULT '{}',
    
    -- Status and Approval
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'published', 'archived')),
    created_by UUID,
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    
    -- Performance Tracking
    usage_count INTEGER DEFAULT 0,
    performance_score DECIMAL(3,2) DEFAULT 0,
    engagement_generated INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes
    CONSTRAINT fk_content_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Brand Profile Media Table
CREATE TABLE IF NOT EXISTS brand_profile_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    
    -- Logo Assets
    primary_logo_id UUID REFERENCES content_assets(id),
    logo_variations JSONB DEFAULT '{}', -- {dark: asset_id, light: asset_id, etc.}
    favicon_id UUID REFERENCES content_assets(id),
    
    -- Cover Images
    cover_images JSONB DEFAULT '{}', -- {social_media: [asset_ids], website_hero: [asset_ids]}
    
    -- Tagline Images
    tagline_images JSONB DEFAULT '{}', -- {with_logo: [asset_ids], standalone: [asset_ids]}
    
    -- QR Codes
    qr_codes JSONB DEFAULT '{}', -- {menu: asset_id, reviews: asset_id, etc.}
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_brand_media_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Menu Dish Media Table
CREATE TABLE IF NOT EXISTS menu_dish_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    menu_item_id UUID, -- Reference to menu items
    
    -- Dish Photos Details
    photo_type VARCHAR(20) CHECK (photo_type IN ('hero', 'detail', 'ingredient', 'process')),
    styling VARCHAR(20) CHECK (styling IN ('professional', 'casual', 'lifestyle')),
    lighting VARCHAR(20) CHECK (lighting IN ('natural', 'studio', 'ambient')),
    angle VARCHAR(20) CHECK (angle IN ('top_down', 'side', '45_degree', 'close_up')),
    background VARCHAR(100),
    props TEXT[] DEFAULT '{}',
    
    -- Associated Content Asset
    content_asset_id UUID NOT NULL REFERENCES content_assets(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_dish_media_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Short Videos Table
CREATE TABLE IF NOT EXISTS short_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    video_type VARCHAR(30) NOT NULL CHECK (video_type IN (
        'plating_video', 'chef_intro', 'restaurant_tour', 'event_promo', 'review_montage'
    )),
    
    -- Video Specifications
    duration INTEGER NOT NULL, -- seconds
    style VARCHAR(30),
    angle VARCHAR(30),
    has_music BOOLEAN DEFAULT FALSE,
    has_captions BOOLEAN DEFAULT FALSE,
    
    -- Content Details (JSONB for flexibility)
    video_details JSONB DEFAULT '{}',
    
    -- Associated Content Asset
    content_asset_id UUID NOT NULL REFERENCES content_assets(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_videos_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Restaurant Space Experience Table
CREATE TABLE IF NOT EXISTS restaurant_space_experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    experience_type VARCHAR(30) NOT NULL CHECK (experience_type IN (
        'ambience_photos', 'kitchen_bts', 'team_portraits', 'event_decor', 'customer_photos'
    )),
    
    -- Experience Details (JSONB for different types)
    experience_details JSONB DEFAULT '{}',
    
    -- Associated Content Asset
    content_asset_id UUID NOT NULL REFERENCES content_assets(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_experience_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Campaign Ready Content Table
CREATE TABLE IF NOT EXISTS campaign_ready_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    content_type VARCHAR(30) NOT NULL CHECK (content_type IN (
        'offers_coupons', 'item_highlights', 'social_posts', 'reels_prompts',
        'whatsapp_cards', 'email_sms_texts', 'review_responses', 'qr_code_generator'
    )),
    
    -- Campaign Details
    campaign_details JSONB NOT NULL DEFAULT '{}',
    
    -- Targeting and Performance
    target_audience TEXT[] DEFAULT '{}',
    performance_prediction DECIMAL(3,2) DEFAULT 0,
    actual_performance DECIMAL(3,2),
    
    -- Usage Tracking
    times_used INTEGER DEFAULT 0,
    last_used TIMESTAMP WITH TIME ZONE,
    
    -- Associated Content Asset (optional for text-based content)
    content_asset_id UUID REFERENCES content_assets(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_campaign_content_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Content Requests Table
CREATE TABLE IF NOT EXISTS content_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    request_type VARCHAR(30) NOT NULL CHECK (request_type IN ('ai_generation', 'professional_shoot', 'user_upload')),
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(100) NOT NULL,
    
    -- Request Specifications
    specifications JSONB DEFAULT '{}',
    ai_prompt TEXT,
    reference_images TEXT[] DEFAULT '{}',
    
    -- Timeline and Budget
    deadline TIMESTAMP WITH TIME ZONE,
    budget DECIMAL(10,2),
    rush_order BOOLEAN DEFAULT FALSE,
    
    -- Status Tracking
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'review', 'approved', 'delivered', 'rejected')),
    assigned_to UUID,
    
    -- Completion Details
    completed_at TIMESTAMP WITH TIME ZONE,
    delivered_asset_id UUID REFERENCES content_assets(id),
    feedback TEXT,
    revision_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_requests_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Content Calendar Table
CREATE TABLE IF NOT EXISTS content_calendar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    content_asset_id UUID NOT NULL REFERENCES content_assets(id) ON DELETE CASCADE,
    
    -- Scheduling Details
    platform VARCHAR(30) NOT NULL,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'published', 'failed', 'cancelled')),
    
    -- Performance Prediction and Actual
    performance_prediction DECIMAL(3,2) DEFAULT 0,
    actual_reach INTEGER,
    actual_engagement INTEGER,
    actual_conversions INTEGER,
    
    -- Publishing Details
    published_at TIMESTAMP WITH TIME ZONE,
    platform_post_id VARCHAR(255),
    error_message TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_calendar_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Content Analytics Table
CREATE TABLE IF NOT EXISTS content_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    content_asset_id UUID NOT NULL REFERENCES content_assets(id) ON DELETE CASCADE,
    
    -- Usage Analytics
    total_uses INTEGER DEFAULT 0,
    platforms_used TEXT[] DEFAULT '{}',
    campaigns_used_in TEXT[] DEFAULT '{}',
    
    -- Performance Metrics
    total_reach INTEGER DEFAULT 0,
    total_engagement INTEGER DEFAULT 0,
    total_conversions INTEGER DEFAULT 0,
    average_ctr DECIMAL(5,4) DEFAULT 0,
    
    -- Quality Metrics
    quality_score DECIMAL(3,2) DEFAULT 0,
    brand_consistency_score DECIMAL(3,2) DEFAULT 0,
    
    -- AI Analysis
    ai_content_description TEXT,
    ai_improvement_suggestions TEXT[],
    ai_performance_prediction DECIMAL(3,2),
    
    -- Time-based Analytics
    analytics_period VARCHAR(20) DEFAULT 'all_time',
    period_start DATE,
    period_end DATE,
    
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_analytics_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_content_assets_restaurant_id ON content_assets(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_content_assets_category ON content_assets(category);
CREATE INDEX IF NOT EXISTS idx_content_assets_status ON content_assets(status);
CREATE INDEX IF NOT EXISTS idx_content_assets_ai_generated ON content_assets(ai_generated);
CREATE INDEX IF NOT EXISTS idx_content_assets_created_at ON content_assets(created_at);

CREATE INDEX IF NOT EXISTS idx_brand_profile_restaurant_id ON brand_profile_media(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_dish_restaurant_id ON menu_dish_media(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_dish_item_id ON menu_dish_media(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_short_videos_restaurant_id ON short_videos(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_short_videos_type ON short_videos(video_type);

CREATE INDEX IF NOT EXISTS idx_restaurant_experience_restaurant_id ON restaurant_space_experience(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_experience_type ON restaurant_space_experience(experience_type);

CREATE INDEX IF NOT EXISTS idx_campaign_content_restaurant_id ON campaign_ready_content(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_campaign_content_type ON campaign_ready_content(content_type);
CREATE INDEX IF NOT EXISTS idx_campaign_content_performance ON campaign_ready_content(performance_prediction);

CREATE INDEX IF NOT EXISTS idx_content_requests_restaurant_id ON content_requests(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_content_requests_status ON content_requests(status);
CREATE INDEX IF NOT EXISTS idx_content_requests_deadline ON content_requests(deadline);

CREATE INDEX IF NOT EXISTS idx_content_calendar_restaurant_id ON content_calendar(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_content_calendar_scheduled_time ON content_calendar(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_content_calendar_status ON content_calendar(status);

CREATE INDEX IF NOT EXISTS idx_content_analytics_restaurant_id ON content_analytics(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_content_analytics_asset_id ON content_analytics(content_asset_id);

-- Update Triggers
CREATE TRIGGER update_content_assets_updated_at BEFORE UPDATE ON content_assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brand_profile_updated_at BEFORE UPDATE ON brand_profile_media FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_dish_updated_at BEFORE UPDATE ON menu_dish_media FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_short_videos_updated_at BEFORE UPDATE ON short_videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurant_experience_updated_at BEFORE UPDATE ON restaurant_space_experience FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaign_content_updated_at BEFORE UPDATE ON campaign_ready_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_requests_updated_at BEFORE UPDATE ON content_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_calendar_updated_at BEFORE UPDATE ON content_calendar FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample Data Function
CREATE OR REPLACE FUNCTION insert_sample_content_data(p_restaurant_id UUID)
RETURNS VOID AS $$
DECLARE
    logo_asset_id UUID;
    dish_photo_id UUID;
    chef_video_id UUID;
BEGIN
    -- Insert sample brand logo
    INSERT INTO content_assets (restaurant_id, category, subcategory, title, file_url, file_type, file_size, ai_generated, status)
    VALUES (p_restaurant_id, 'brand_profile_media', 'logo', 'Primary Restaurant Logo', '/assets/logo-primary.png', 'image', 245760, false, 'approved')
    RETURNING id INTO logo_asset_id;
    
    -- Insert sample dish photo
    INSERT INTO content_assets (restaurant_id, category, subcategory, title, file_url, file_type, file_size, ai_generated, status)
    VALUES (p_restaurant_id, 'menu_dish_media', 'dish_photos', 'Signature Pasta Hero Shot', '/assets/pasta-hero.jpg', 'image', 1048576, false, 'approved')
    RETURNING id INTO dish_photo_id;
    
    -- Insert sample chef intro video
    INSERT INTO content_assets (restaurant_id, category, subcategory, title, file_url, file_type, file_size, duration, ai_generated, status)
    VALUES (p_restaurant_id, 'short_videos', 'chef_intro', 'Chef Introduction Video', '/assets/chef-intro.mp4', 'video', 15728640, 45, false, 'approved')
    RETURNING id INTO chef_video_id;
    
    -- Insert brand profile media record
    INSERT INTO brand_profile_media (restaurant_id, primary_logo_id)
    VALUES (p_restaurant_id, logo_asset_id);
    
    -- Insert menu dish media record
    INSERT INTO menu_dish_media (restaurant_id, photo_type, styling, lighting, angle, content_asset_id)
    VALUES (p_restaurant_id, 'hero', 'professional', 'studio', 'top_down', dish_photo_id);
    
    -- Insert short video record
    INSERT INTO short_videos (restaurant_id, video_type, duration, style, has_music, has_captions, content_asset_id)
    VALUES (p_restaurant_id, 'chef_intro', 45, 'professional', true, true, chef_video_id);
    
END;
$$ LANGUAGE plpgsql;
