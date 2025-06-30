-- Generated Content Storage Tables

-- Main generated content table
CREATE TABLE IF NOT EXISTS generated_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    restaurant_id UUID, -- For multi-restaurant support
    content_type VARCHAR(50) NOT NULL, -- 'combos', 'item-descriptions', 'menu-design', etc.
    title VARCHAR(255) NOT NULL,
    content_data JSONB NOT NULL, -- The actual generated content
    metadata JSONB, -- Generation parameters, AI model used, etc.
    status VARCHAR(20) DEFAULT 'generated', -- 'generated', 'applied', 'archived'
    ai_mode VARCHAR(20), -- 'openai', 'fallback', etc.
    generation_cost DECIMAL(10,4), -- Cost in dollars
    tokens_used INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content application history
CREATE TABLE IF NOT EXISTS content_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    generated_content_id UUID REFERENCES generated_content(id) ON DELETE CASCADE,
    applied_to_type VARCHAR(50) NOT NULL, -- 'menu_item', 'menu_category', 'full_menu'
    applied_to_id VARCHAR(255), -- ID of the item/category it was applied to
    previous_data JSONB, -- Backup of previous data
    applied_data JSONB, -- What was actually applied
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    applied_by UUID REFERENCES auth.users(id)
);

-- Content feedback and ratings
CREATE TABLE IF NOT EXISTS content_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    generated_content_id UUID REFERENCES generated_content(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_generated_content_user_id ON generated_content(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_type ON generated_content(content_type);
CREATE INDEX IF NOT EXISTS idx_generated_content_status ON generated_content(status);
CREATE INDEX IF NOT EXISTS idx_generated_content_created_at ON generated_content(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_applications_content_id ON content_applications(generated_content_id);
