-- Create subscription and payment related tables for Indian market

-- User subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id VARCHAR(50) NOT NULL, -- starter, professional, enterprise
    billing_cycle VARCHAR(20) NOT NULL, -- monthly, yearly
    amount INTEGER NOT NULL, -- Amount in paise (INR)
    currency VARCHAR(3) DEFAULT 'INR',
    status VARCHAR(20) DEFAULT 'created', -- created, active, cancelled, expired
    razorpay_plan_id VARCHAR(100),
    razorpay_subscription_id VARCHAR(100),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    activated_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment logs table
CREATE TABLE IF NOT EXISTS payment_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE CASCADE,
    payment_id VARCHAR(100) NOT NULL, -- Razorpay payment ID
    razorpay_order_id VARCHAR(100),
    amount INTEGER NOT NULL, -- Amount in paise
    currency VARCHAR(3) DEFAULT 'INR',
    status VARCHAR(20) NOT NULL, -- success, failed, pending
    payment_method VARCHAR(50), -- upi, card, netbanking, wallet
    failure_reason TEXT,
    gateway_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage tracking table for analytics
CREATE TABLE IF NOT EXISTS feature_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    feature_type VARCHAR(50) NOT NULL, -- social_profile, menu_management, review_management
    action VARCHAR(50) NOT NULL, -- create, update, delete, view
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Revenue analytics table
CREATE TABLE IF NOT EXISTS revenue_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    plan_id VARCHAR(50) NOT NULL,
    new_subscriptions INTEGER DEFAULT 0,
    cancelled_subscriptions INTEGER DEFAULT 0,
    total_revenue INTEGER DEFAULT 0, -- in paise
    mrr INTEGER DEFAULT 0, -- Monthly Recurring Revenue in paise
    churn_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, plan_id)
);

-- Indian market specific data
CREATE TABLE IF NOT EXISTS restaurant_profiles_india (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    business_type VARCHAR(100), -- Fine Dining, QSR, Cloud Kitchen, etc.
    cuisine_types TEXT[], -- Array of cuisine types
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    gst_number VARCHAR(20),
    fssai_license VARCHAR(20),
    primary_language VARCHAR(10) DEFAULT 'en',
    secondary_languages TEXT[],
    festival_menus JSONB, -- Special menus for Indian festivals
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payment_logs_user_id ON payment_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_status ON payment_logs(status);
CREATE INDEX IF NOT EXISTS idx_feature_usage_user_id ON feature_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_feature_type ON feature_usage(feature_type);
CREATE INDEX IF NOT EXISTS idx_revenue_analytics_date ON revenue_analytics(date);
CREATE INDEX IF NOT EXISTS idx_restaurant_profiles_india_city ON restaurant_profiles_india(city);

-- Row Level Security (RLS) policies
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_profiles_india ENABLE ROW LEVEL SECURITY;

-- Policies for user_subscriptions
CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON user_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies for payment_logs
CREATE POLICY "Users can view their own payment logs" ON payment_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Policies for feature_usage
CREATE POLICY "Users can view their own usage" ON feature_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" ON feature_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for restaurant_profiles_india
CREATE POLICY "Users can manage their own restaurant profile" ON restaurant_profiles_india
    FOR ALL USING (auth.uid() = user_id);
