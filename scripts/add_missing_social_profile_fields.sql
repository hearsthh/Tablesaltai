-- Add missing fields to restaurant_profiles table

ALTER TABLE restaurant_profiles
ADD COLUMN logo_dark_url VARCHAR(255),
ADD COLUMN favicon_url VARCHAR(255),
ADD COLUMN brand_guidelines TEXT,
ADD COLUMN chef_title VARCHAR(255),
ADD COLUMN chef_bio TEXT,
ADD COLUMN chef_experience_years INTEGER,
ADD COLUMN chef_specialties TEXT[],
ADD COLUMN chef_awards TEXT[],
ADD COLUMN loyalty_program_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN loyalty_program_name VARCHAR(255),
ADD COLUMN loyalty_program_description TEXT,
ADD COLUMN loyalty_points_per_rupee INTEGER DEFAULT 1,
ADD COLUMN loyalty_reward_threshold INTEGER DEFAULT 100,
ADD COLUMN loyalty_reward_value INTEGER DEFAULT 0,
ADD COLUMN reservation_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN reservation_system_type VARCHAR(50) DEFAULT 'builtin',
ADD COLUMN reservation_external_url VARCHAR(255),
ADD COLUMN reservation_advance_days INTEGER DEFAULT 30,
ADD COLUMN reservation_min_party_size INTEGER DEFAULT 1,
ADD COLUMN reservation_max_party_size INTEGER DEFAULT 12,
ADD COLUMN ai_profile_generated BOOLEAN DEFAULT FALSE,
ADD COLUMN ai_generation_date TIMESTAMP,
ADD COLUMN ai_generation_source VARCHAR(255),
ADD COLUMN profile_completion_percentage INTEGER DEFAULT 0,
ADD COLUMN social_media_followers JSONB;

-- Create special_offers table
CREATE TABLE IF NOT EXISTS special_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurant_profiles(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    offer_type VARCHAR(50),
    discount_value NUMERIC,
    discount_percentage INTEGER,
    minimum_order_value NUMERIC,
    maximum_discount NUMERIC,
    valid_from DATE,
    valid_until DATE,
    valid_days TEXT[],
    valid_times JSONB,
    terms_conditions TEXT,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create restaurant_awards table
CREATE TABLE IF NOT EXISTS restaurant_awards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurant_profiles(id) NOT NULL,
    award_name VARCHAR(255) NOT NULL,
    award_description TEXT,
    issuing_organization VARCHAR(255),
    award_year INTEGER,
    award_date DATE,
    award_category VARCHAR(50),
    award_level VARCHAR(50),
    certificate_url VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create press_coverage table
CREATE TABLE IF NOT EXISTS press_coverage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurant_profiles(id) NOT NULL,
    publication_name VARCHAR(255) NOT NULL,
    article_title VARCHAR(255) NOT NULL,
    article_url VARCHAR(255),
    author_name VARCHAR(255),
    publication_date DATE,
    article_excerpt TEXT,
    coverage_type VARCHAR(50),
    sentiment VARCHAR(50),
    reach_estimate INTEGER,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create media_assets table
CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurant_profiles(id) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    mime_type VARCHAR(50),
    width INTEGER,
    height INTEGER,
    category VARCHAR(50),
    subcategory VARCHAR(50),
    title VARCHAR(255),
    description TEXT,
    alt_text VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
