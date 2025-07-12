-- Corrected Menu Data Schema (Food-focused, not marketing content)
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id),
  category_id UUID REFERENCES menu_categories(id),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  
  -- Dietary and Preparation Details (NOT marketing content types)
  dietary_tags TEXT[] DEFAULT '{}', -- ['vegan', 'gluten_free', 'jain', 'keto', 'dairy_free']
  allergen_info TEXT[] DEFAULT '{}', -- ['nuts', 'dairy', 'eggs', 'soy', 'shellfish']
  spice_level VARCHAR(20), -- 'mild', 'medium', 'hot', 'extra_hot'
  preparation_time INTEGER, -- minutes
  cooking_method VARCHAR(50), -- 'grilled', 'fried', 'steamed', 'baked'
  
  -- Item Classification
  item_type VARCHAR(30) DEFAULT 'regular', -- 'signature', 'seasonal', 'limited_time'
  availability_status VARCHAR(20) DEFAULT 'available', -- 'available', 'out_of_stock', 'discontinued'
  
  -- Nutritional Info (optional)
  calories INTEGER,
  protein_grams DECIMAL(5,2),
  carbs_grams DECIMAL(5,2),
  fat_grams DECIMAL(5,2),
  
  -- AI Enhancement
  ai_generated_description TEXT,
  ai_suggested_tags TEXT[] DEFAULT '{}',
  
  -- Metadata
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_item_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID REFERENCES menu_items(id),
  variant_name VARCHAR(255) NOT NULL, -- 'Small', 'Medium', 'Large' or 'Half', 'Full'
  price_modifier DECIMAL(10,2) DEFAULT 0, -- Additional cost for this variant
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_item_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_item_id UUID REFERENCES menu_items(id),
    ingredient_name VARCHAR(100) NOT NULL,
    is_main_ingredient BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_dietary_tags ON menu_items USING GIN(dietary_tags);
CREATE INDEX IF NOT EXISTS idx_menu_categories_restaurant_id ON menu_categories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_allergens ON menu_items USING GIN(allergen_info);
