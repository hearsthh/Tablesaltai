-- Add missing fields for comprehensive Customer module

-- Enhanced customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS customer_lifecycle_stage VARCHAR(20) DEFAULT 'new'; -- 'new', 'active', 'at_risk', 'churned', 'reactivated'
ALTER TABLE customers ADD COLUMN IF NOT EXISTS churn_probability DECIMAL(3,2) DEFAULT 0;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS churn_risk_factors TEXT[];
ALTER TABLE customers ADD COLUMN IF NOT EXISTS next_predicted_visit DATE;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS predicted_ltv DECIMAL(12,2) DEFAULT 0;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS communication_preferences JSONB DEFAULT '{}';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS personalization_data JSONB DEFAULT '{}';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS referred_by_customer_id UUID REFERENCES customers(id);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS successful_referrals INTEGER DEFAULT 0;

-- Create customer satisfaction surveys table
CREATE TABLE IF NOT EXISTS customer_satisfaction_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    
    -- Survey details
    survey_type VARCHAR(20), -- 'post_visit', 'periodic', 'exit', 'nps'
    survey_name VARCHAR(255),
    
    -- Response data
    overall_satisfaction INTEGER, -- 1-10 scale
    nps_score INTEGER, -- 0-10 scale
    food_rating INTEGER, -- 1-5 scale
    service_rating INTEGER, -- 1-5 scale
    ambiance_rating INTEGER, -- 1-5 scale
    value_rating INTEGER, -- 1-5 scale
    
    -- Feedback
    positive_feedback TEXT,
    negative_feedback TEXT,
    suggestions TEXT,
    
    -- Visit context
    visit_date DATE,
    party_size INTEGER,
    occasion VARCHAR(50),
    order_items TEXT[],
    
    -- Survey metadata
    survey_sent_date TIMESTAMP WITH TIME ZONE,
    survey_completed_date TIMESTAMP WITH TIME ZONE,
    response_time_minutes INTEGER,
    
    -- Follow-up
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_completed BOOLEAN DEFAULT false,
    follow_up_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer feedback collection table
CREATE TABLE IF NOT EXISTS customer_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    
    -- Feedback details
    feedback_type VARCHAR(20), -- 'complaint', 'compliment', 'suggestion', 'question'
    feedback_category VARCHAR(50), -- 'food', 'service', 'ambiance', 'pricing', 'cleanliness'
    subject VARCHAR(255),
    message TEXT NOT NULL,
    
    -- Context
    visit_date DATE,
    order_reference VARCHAR(100),
    staff_member_mentioned VARCHAR(255),
    
    -- Priority and urgency
    priority VARCHAR(10) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    urgency_score INTEGER DEFAULT 5, -- 1-10 scale
    
    -- Resolution
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
    assigned_to VARCHAR(255),
    resolution_notes TEXT,
    resolution_date TIMESTAMP WITH TIME ZONE,
    customer_satisfaction_with_resolution INTEGER, -- 1-5 scale
    
    -- Communication
    preferred_response_method VARCHAR(20), -- 'email', 'phone', 'sms', 'in_person'
    response_sent BOOLEAN DEFAULT false,
    response_date TIMESTAMP WITH TIME ZONE,
    
    -- Impact assessment
    potential_revenue_impact DECIMAL(10,2),
    reputation_risk_level VARCHAR(10), -- 'low', 'medium', 'high'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer support tickets table
CREATE TABLE IF NOT EXISTS customer_support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    
    -- Ticket details
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    -- Classification
    category VARCHAR(50), -- 'billing', 'reservation', 'food_quality', 'service', 'technical'
    subcategory VARCHAR(50),
    priority VARCHAR(10) DEFAULT 'medium',
    
    -- Assignment
    assigned_to VARCHAR(255),
    department VARCHAR(50), -- 'customer_service', 'kitchen', 'management'
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'open',
    resolution_time_hours INTEGER,
    first_response_time_minutes INTEGER,
    
    -- Communication log
    communication_log JSONB DEFAULT '[]', -- array of communication entries
    
    -- Resolution
    resolution_summary TEXT,
    resolution_date TIMESTAMP WITH TIME ZONE,
    customer_satisfaction_rating INTEGER, -- 1-5 scale
    
    -- Follow-up
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    follow_up_completed BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer communication history table
CREATE TABLE IF NOT EXISTS customer_communication_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    
    -- Communication details
    communication_type VARCHAR(20), -- 'email', 'sms', 'phone', 'in_person', 'app_notification'
    direction VARCHAR(10), -- 'inbound', 'outbound'
    subject VARCHAR(255),
    content TEXT,
    
    -- Context
    related_campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE SET NULL,
    related_ticket_id UUID REFERENCES customer_support_tickets(id) ON DELETE SET NULL,
    related_order_id VARCHAR(100),
    
    -- Metadata
    sender VARCHAR(255),
    recipient VARCHAR(255),
    channel_details JSONB, -- platform-specific metadata
    
    -- Engagement
    opened BOOLEAN DEFAULT false,
    clicked BOOLEAN DEFAULT false,
    replied BOOLEAN DEFAULT false,
    engagement_score DECIMAL(3,2) DEFAULT 0,
    
    -- Timing
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    replied_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer segmentation rules table
CREATE TABLE IF NOT EXISTS customer_segmentation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
    
    -- Segment details
    segment_name VARCHAR(255) NOT NULL,
    segment_description TEXT,
    segment_color VARCHAR(7), -- hex color for UI
    
    -- Rules (stored as JSON for flexibility)
    rules JSONB NOT NULL, -- complex rule definitions
    
    -- Metadata
    customer_count INTEGER DEFAULT 0,
    last_calculated TIMESTAMP WITH TIME ZONE,
    auto_update BOOLEAN DEFAULT true,
    update_frequency VARCHAR(20) DEFAULT 'daily', -- 'hourly', 'daily', 'weekly', 'manual'
    
    -- Performance
    avg_order_value DECIMAL(10,2),
    avg_visit_frequency DECIMAL(5,2),
    total_revenue DECIMAL(12,2),
    churn_rate DECIMAL(5,2),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer segment assignments table
CREATE TABLE IF NOT EXISTS customer_segment_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    segment_id UUID REFERENCES customer_segmentation_rules(id) ON DELETE CASCADE,
    
    -- Assignment details
    assigned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assignment_reason TEXT,
    confidence_score DECIMAL(3,2) DEFAULT 1.0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    UNIQUE(customer_id, segment_id)
);

-- Create customer journey tracking table
CREATE TABLE IF NOT EXISTS customer_journey_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    
    -- Event details
    event_type VARCHAR(50), -- 'first_visit', 'repeat_visit', 'complaint', 'compliment', 'referral', 'churn'
    event_name VARCHAR(255),
    event_description TEXT,
    
    -- Context
    touchpoint VARCHAR(50), -- 'website', 'app', 'phone', 'in_person', 'social_media'
    channel VARCHAR(50), -- specific channel within touchpoint
    
    -- Data
    event_data JSONB, -- flexible event-specific data
    event_value DECIMAL(10,2), -- monetary value if applicable
    
    -- Journey stage
    journey_stage VARCHAR(20), -- 'awareness', 'consideration', 'first_visit', 'onboarding', 'active', 'at_risk', 'churned'
    stage_progression BOOLEAN DEFAULT false, -- did this event move them to next stage?
    
    -- Timing
    event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer personalization settings table
CREATE TABLE IF NOT EXISTS customer_personalization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    
    -- Preferences
    preferred_cuisine_types TEXT[],
    dietary_restrictions TEXT[],
    spice_preference VARCHAR(20), -- 'mild', 'medium', 'hot'
    portion_preference VARCHAR(20), -- 'small', 'regular', 'large'
    
    -- Behavioral patterns
    preferred_visit_times JSONB, -- day/time preferences
    preferred_table_types TEXT[], -- 'window', 'corner', 'booth', 'bar'
    preferred_ambiance VARCHAR(20), -- 'quiet', 'lively', 'romantic'
    
    -- Communication preferences
    email_frequency VARCHAR(20) DEFAULT 'weekly', -- 'daily', 'weekly', 'monthly', 'never'
    sms_frequency VARCHAR(20) DEFAULT 'monthly',
    notification_types TEXT[], -- types of notifications they want
    
    -- Offer preferences
    preferred_offer_types TEXT[], -- 'discount', 'bogo', 'free_item', 'loyalty_points'
    price_sensitivity VARCHAR(10), -- 'low', 'medium', 'high'
    
    -- AI insights
    predicted_preferences JSONB, -- AI-generated preference predictions
    recommendation_weights JSONB, -- weights for recommendation algorithm
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer referral tracking table
CREATE TABLE IF NOT EXISTS customer_referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
    referrer_customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    referred_customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    
    -- Referral details
    referral_code VARCHAR(20),
    referral_method VARCHAR(20), -- 'word_of_mouth', 'social_media', 'email', 'app'
    
    -- Status tracking
    referral_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    signup_date TIMESTAMP WITH TIME ZONE,
    first_visit_date TIMESTAMP WITH TIME ZONE,
    conversion_date TIMESTAMP WITH TIME ZONE, -- when referred customer made first purchase
    
    -- Rewards
    referrer_reward_type VARCHAR(20), -- 'discount', 'free_item', 'points', 'cash'
    referrer_reward_value DECIMAL(10,2),
    referrer_reward_claimed BOOLEAN DEFAULT false,
    
    referred_reward_type VARCHAR(20),
    referred_reward_value DECIMAL(10,2),
    referred_reward_claimed BOOLEAN DEFAULT false,
    
    -- Performance
    referred_customer_ltv DECIMAL(12,2), -- lifetime value of referred customer
    referral_success BOOLEAN DEFAULT false, -- did referral result in active customer?
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for customer tables
CREATE INDEX IF NOT EXISTS idx_satisfaction_surveys_restaurant ON customer_satisfaction_surveys(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_satisfaction_surveys_customer ON customer_satisfaction_surveys(customer_id);
CREATE INDEX IF NOT EXISTS idx_satisfaction_surveys_type ON customer_satisfaction_surveys(survey_type);

CREATE INDEX IF NOT EXISTS idx_feedback_restaurant ON customer_feedback(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_feedback_customer ON customer_feedback(customer_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON customer_feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_priority ON customer_feedback(priority);

CREATE INDEX IF NOT EXISTS idx_support_tickets_restaurant ON customer_support_tickets(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer ON customer_support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON customer_support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_number ON customer_support_tickets(ticket_number);

CREATE INDEX IF NOT EXISTS idx_communication_history_restaurant ON customer_communication_history(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_communication_history_customer ON customer_communication_history(customer_id);
CREATE INDEX IF NOT EXISTS idx_communication_history_type ON customer_communication_history(communication_type);

CREATE INDEX IF NOT EXISTS idx_segmentation_rules_restaurant ON customer_segmentation_rules(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_segmentation_rules_active ON customer_segmentation_rules(is_active);

CREATE INDEX IF NOT EXISTS idx_segment_assignments_customer ON customer_segment_assignments(customer_id);
CREATE INDEX IF NOT EXISTS idx_segment_assignments_segment ON customer_segment_assignments(segment_id);
CREATE INDEX IF NOT EXISTS idx_segment_assignments_active ON customer_segment_assignments(is_active);

CREATE INDEX IF NOT EXISTS idx_journey_events_restaurant ON customer_journey_events(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_journey_events_customer ON customer_journey_events(customer_id);
CREATE INDEX IF NOT EXISTS idx_journey_events_type ON customer_journey_events(event_type);
CREATE INDEX IF NOT EXISTS idx_journey_events_timestamp ON customer_journey_events(event_timestamp);

CREATE INDEX IF NOT EXISTS idx_personalization_customer ON customer_personalization(customer_id);

CREATE INDEX IF NOT EXISTS idx_referrals_restaurant ON customer_referrals(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON customer_referrals(referrer_customer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON customer_referrals(referred_customer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON customer_referrals(referral_code);
