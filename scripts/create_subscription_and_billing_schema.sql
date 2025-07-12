-- Subscription and billing schema
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255) UNIQUE,
    plan_id VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage tracking for billing
CREATE TABLE IF NOT EXISTS usage_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
    feature_type VARCHAR(100) NOT NULL, -- 'ai_generation', 'campaigns', 'customers', etc.
    usage_count INTEGER NOT NULL DEFAULT 0,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(restaurant_id, feature_type, period_start)
);

-- Billing events log
CREATE TABLE IF NOT EXISTS billing_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- 'subscription_created', 'payment_succeeded', etc.
    stripe_event_id VARCHAR(255),
    event_data JSONB,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_restaurant_id ON subscriptions(restaurant_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_usage_tracking_restaurant_period ON usage_tracking(restaurant_id, period_start);
CREATE INDEX idx_billing_events_restaurant_id ON billing_events(restaurant_id);

-- Function to check subscription limits
CREATE OR REPLACE FUNCTION check_subscription_limit(
    p_restaurant_id UUID,
    p_feature_type VARCHAR(100),
    p_requested_count INTEGER DEFAULT 1
) RETURNS JSONB AS $$
DECLARE
    subscription_record RECORD;
    current_usage INTEGER;
    plan_limit INTEGER;
    result JSONB;
BEGIN
    -- Get current subscription
    SELECT s.*, sp.plan_id, sp.limits
    INTO subscription_record
    FROM subscriptions s
    LEFT JOIN subscription_plans sp ON s.plan_id = sp.id
    WHERE s.restaurant_id = p_restaurant_id 
    AND s.status = 'active'
    AND s.current_period_end > NOW()
    ORDER BY s.created_at DESC
    LIMIT 1;

    -- If no active subscription, use free plan limits
    IF subscription_record IS NULL THEN
        subscription_record.plan_id := 'free';
        -- Set free plan limits
        CASE p_feature_type
            WHEN 'menu_items' THEN plan_limit := 50;
            WHEN 'campaigns' THEN plan_limit := 1;
            WHEN 'ai_generations' THEN plan_limit := 10;
            WHEN 'customers' THEN plan_limit := 100;
            ELSE plan_limit := 0;
        END CASE;
    ELSE
        -- Get plan limit from subscription
        plan_limit := COALESCE((subscription_record.limits->p_feature_type)::INTEGER, -1);
    END IF;

    -- Get current usage for this period
    SELECT COALESCE(usage_count, 0)
    INTO current_usage
    FROM usage_tracking
    WHERE restaurant_id = p_restaurant_id
    AND feature_type = p_feature_type
    AND period_start = DATE_TRUNC('month', NOW())::DATE;

    -- Check if request would exceed limit (-1 means unlimited)
    IF plan_limit = -1 THEN
        result := jsonb_build_object(
            'allowed', true,
            'current_usage', current_usage,
            'limit', 'unlimited',
            'remaining', 'unlimited'
        );
    ELSIF (current_usage + p_requested_count) <= plan_limit THEN
        result := jsonb_build_object(
            'allowed', true,
            'current_usage', current_usage,
            'limit', plan_limit,
            'remaining', plan_limit - current_usage
        );
    ELSE
        result := jsonb_build_object(
            'allowed', false,
            'current_usage', current_usage,
            'limit', plan_limit,
            'remaining', plan_limit - current_usage,
            'upgrade_required', true
        );
    END IF;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to track usage
CREATE OR REPLACE FUNCTION track_usage(
    p_restaurant_id UUID,
    p_feature_type VARCHAR(100),
    p_count INTEGER DEFAULT 1
) RETURNS VOID AS $$
BEGIN
    INSERT INTO usage_tracking (restaurant_id, feature_type, usage_count, period_start, period_end)
    VALUES (
        p_restaurant_id,
        p_feature_type,
        p_count,
        DATE_TRUNC('month', NOW())::DATE,
        (DATE_TRUNC('month', NOW()) + INTERVAL '1 month - 1 day')::DATE
    )
    ON CONFLICT (restaurant_id, feature_type, period_start)
    DO UPDATE SET usage_count = usage_tracking.usage_count + p_count;
END;
$$ LANGUAGE plpgsql;
