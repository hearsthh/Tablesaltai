-- Add missing fields to menu_items table

ALTER TABLE menu_items
ADD COLUMN options JSONB,
ADD COLUMN modifiers JSONB,
ADD COLUMN availability_schedule JSONB,
ADD COLUMN nutritional_information JSONB,
ADD COLUMN allergen_information TEXT[],
ADD COLUMN subcategory_id UUID REFERENCES menu_subcategories(id);

-- Create menu_subcategories table
CREATE TABLE IF NOT EXISTS menu_subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES menu_categories(id) NOT NULL,
    subcategory_name VARCHAR(255) NOT NULL,
    subcategory_description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
