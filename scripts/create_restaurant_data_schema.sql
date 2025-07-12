-- Restaurant Data Schema based on the provided specification
-- This creates the complete database structure for Phase 1

-- Main restaurant data table
CREATE TABLE IF NOT EXISTS restaurant_data (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    
    -- Registration Section
    registration_email_id TEXT,
    registration_mobile_no TEXT,
    
    -- Identification Section
    identification_restaurant_name TEXT,
    identification_address TEXT,
    identification_location TEXT, -- PIN code
    identification_restaurant_phone_number TEXT,
    
    -- Info Section - Map
    info_map_latitude DECIMAL(10, 8),
    info_map_longitude DECIMAL(11, 8),
    
    -- Info Section - Basic Info
    info_price_range TEXT,
    info_cuisines TEXT[], -- Array of cuisines
    info_dietary_options TEXT[], -- Array of dietary options
    info_type TEXT,
    
    -- Info Section - Timings (JSON)
    info_timings JSONB,
    
    -- Brand Assets Section
    brand_assets_logo_url TEXT,
    brand_assets_logo_filename TEXT,
    brand_assets_logo_filesize INTEGER,
    brand_assets_logo_colors TEXT[], -- Array of color codes
    brand_assets_brand_voice TEXT,
    brand_assets_positioning TEXT,
    
    -- More Info Section
    more_info_chef_intro TEXT,
    more_info_concept_description TEXT,
    more_info_legacy TEXT,
    more_info_awards_recognition TEXT[], -- Array of awards
    more_info_media_coverage TEXT[], -- Array of media mentions
    more_info_highlights TEXT[], -- Array of highlights
    more_info_amenities TEXT[], -- Array of amenities
    more_info_features TEXT[], -- Array of features
    
    -- Completion Status (JSON)
    completion_status JSONB,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for better performance
    CONSTRAINT restaurant_data_user_id_key UNIQUE(user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_restaurant_data_user_id ON restaurant_data(user_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_data_restaurant_name ON restaurant_data(identification_restaurant_name);
CREATE INDEX IF NOT EXISTS idx_restaurant_data_location ON restaurant_data(identification_location);
CREATE INDEX IF NOT EXISTS idx_restaurant_data_cuisines ON restaurant_data USING GIN(info_cuisines);
CREATE INDEX IF NOT EXISTS idx_restaurant_data_created_at ON restaurant_data(created_at);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_restaurant_data_updated_at 
    BEFORE UPDATE ON restaurant_data 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO restaurant_data (
    id,
    user_id,
    registration_email_id,
    registration_mobile_no,
    identification_restaurant_name,
    identification_address,
    identification_location,
    identification_restaurant_phone_number,
    info_map_latitude,
    info_map_longitude,
    info_price_range,
    info_cuisines,
    info_dietary_options,
    info_type,
    info_timings,
    brand_assets_brand_voice,
    brand_assets_positioning,
    more_info_concept_description,
    more_info_highlights,
    more_info_amenities,
    completion_status
) VALUES (
    'restaurant_sample_001',
    'user_123',
    'info@bellavista.com',
    '9876543210',
    'Bella Vista Restaurant',
    '123 MG Road, Bangalore, Karnataka',
    '560001',
    '+91 98765 43210',
    12.9716,
    77.5946,
    'moderate',
    ARRAY['Italian', 'Continental'],
    ARRAY['Pure Vegetarian', 'Vegan Options'],
    'Casual Dining',
    '{"monday": {"isOpen": true, "openTime": "11:00", "closeTime": "23:00"}, "tuesday": {"isOpen": true, "openTime": "11:00", "closeTime": "23:00"}}',
    'Warm & Welcoming',
    'Family Restaurant',
    'Authentic Italian cuisine with a modern twist, featuring fresh ingredients and traditional recipes.',
    ARRAY['Wood-fired Pizza', 'Handmade Pasta', 'Romantic Ambiance'],
    ARRAY['Free WiFi', 'Parking Available', 'Air Conditioning'],
    '{"registration": true, "identification": true, "info": true, "brandAssets": true, "moreInfo": true, "overall": 100}'
) ON CONFLICT (user_id) DO NOTHING;

-- Create view for easier data access
CREATE OR REPLACE VIEW restaurant_data_view AS
SELECT 
    id,
    user_id,
    
    -- Registration
    jsonb_build_object(
        'emailId', registration_email_id,
        'mobileNo', registration_mobile_no
    ) as registration,
    
    -- Identification
    jsonb_build_object(
        'restaurantName', identification_restaurant_name,
        'address', identification_address,
        'location', identification_location,
        'restaurantPhoneNumber', identification_restaurant_phone_number
    ) as identification,
    
    -- Info
    jsonb_build_object(
        'map', jsonb_build_object(
            'latitude', info_map_latitude,
            'longitude', info_map_longitude
        ),
        'priceRange', info_price_range,
        'cuisines', to_jsonb(info_cuisines),
        'dietaryOptions', to_jsonb(info_dietary_options),
        'type', info_type,
        'timings', info_timings
    ) as info,
    
    -- Brand Assets
    jsonb_build_object(
        'logo', CASE 
            WHEN brand_assets_logo_url IS NOT NULL THEN
                jsonb_build_object(
                    'url', brand_assets_logo_url,
                    'fileName', brand_assets_logo_filename,
                    'fileSize', brand_assets_logo_filesize
                )
            ELSE NULL
        END,
        'logoColors', to_jsonb(brand_assets_logo_colors),
        'brandVoice', brand_assets_brand_voice,
        'positioning', brand_assets_positioning
    ) as brand_assets,
    
    -- More Info
    jsonb_build_object(
        'chefIntro', more_info_chef_intro,
        'conceptDescription', more_info_concept_description,
        'legacy', more_info_legacy,
        'awardsRecognition', to_jsonb(more_info_awards_recognition),
        'mediaCoverage', to_jsonb(more_info_media_coverage),
        'highlights', to_jsonb(more_info_highlights),
        'amenities', to_jsonb(more_info_amenities),
        'features', to_jsonb(more_info_features)
    ) as more_info,
    
    completion_status,
    created_at,
    updated_at
    
FROM restaurant_data;
