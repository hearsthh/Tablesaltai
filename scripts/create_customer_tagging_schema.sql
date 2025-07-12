-- Customer Tagging and Automation System Schema

-- Main customers table with tagging fields
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    
    -- Visit tracking
    first_visit_date TIMESTAMP WITH TIME ZONE NOT NULL,
    last_visit_date TIMESTAMP WITH TIME ZONE NOT NULL,
    total_visits INTEGER NOT NULL DEFAULT 0,
    
    -- Financial metrics
    total_spend DECIMAL(10,2) NOT NULL DEFAULT 0,
    average_order_value DECIMAL(10,2) NOT NULL DEFAULT 0,
    average_visit_gap INTEGER NOT NULL DEFAULT 0, -- days
    guest_estimate_avg DECIMAL(4,2) NOT NULL DEFAULT 1,
    
    -- Tags
    spend_tag VARCHAR(20) NOT NULL DEFAULT 'mid_spender' 
        CHECK (spend_tag IN ('low_spender', 'mid_spender', 'high_spender', 'vip')),
    activity_tag VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (activity_tag IN ('new', 'active', 'loyal', 'churn_risk', 'inactive')),
    behavior_tags TEXT[] DEFAULT '{}',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, phone)
);

-- Customer orders table
CREATE TABLE IF NOT EXISTS customer_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Order details
    order_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    guest_count_estimate INTEGER NOT NULL DEFAULT 1,
    order_source VARCHAR(20) NOT NULL DEFAULT 'dine_in'
        CHECK (order_source IN ('dine_in', 'takeaway', 'delivery', 'online')),
    
    -- Items and categories (JSON for flexibility)
    items JSONB NOT NULL DEFAULT '[]',
    categories TEXT[] NOT NULL DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurant customer summary table
CREATE TABLE IF NOT EXISTS restaurant_customer_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Summary metrics
    total_customers INTEGER NOT NULL DEFAULT 0,
    churn_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    active_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    average_visit_gap DECIMAL(8,2) NOT NULL DEFAULT 0,
    new_customers_count INTEGER NOT NULL DEFAULT 0,
    
    -- Tag distributions (JSON for flexibility)
    spend_tag_distribution JSONB NOT NULL DEFAULT '[]',
    activity_tag_distribution JSONB NOT NULL DEFAULT '[]',
    behavior_tag_distribution JSONB NOT NULL DEFAULT '[]',
    
    -- Top customers (JSON array of customer IDs)
    top_10_percent_ltv_ids TEXT[] DEFAULT '{}',
    
    last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation triggers table
CREATE TABLE IF NOT EXISTS automation_triggers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Trigger details
    trigger_type VARCHAR(50) NOT NULL
        CHECK (trigger_type IN ('tag_changed', 'new_customer', 'churn_risk', 'vip_upgrade', 'inactive_customer', 'high_value_order', 'milestone_reached')),
    trigger_data JSONB NOT NULL DEFAULT '{}',
    
    -- Processing status
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    processed_at TIMESTAMP WITH TIME ZONE,
    campaign_sent VARCHAR(255),
    
    -- Campaign details (JSON for flexibility)
    campaign_data JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer personalization data table
CREATE TABLE IF NOT EXISTS customer_personalization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Personalization fields
    recommended_items TEXT[] DEFAULT '{}',
    preferred_categories TEXT[] DEFAULT '{}',
    optimal_contact_time TIME NOT NULL DEFAULT '18:00:00',
    discount_sensitivity VARCHAR(10) NOT NULL DEFAULT 'medium'
        CHECK (discount_sensitivity IN ('low', 'medium', 'high')),
    message_tone VARCHAR(20) NOT NULL DEFAULT 'casual'
        CHECK (message_tone IN ('casual', 'formal', 'enthusiastic')),
    
    -- Generated content cache
    last_whatsapp_message TEXT,
    last_email_subject TEXT,
    last_email_body TEXT,
    last_sms_message TEXT,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(customer_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_restaurant_id ON customers(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_customers_activity_tag ON customers(activity_tag);
CREATE INDEX IF NOT EXISTS idx_customers_spend_tag ON customers(spend_tag);
CREATE INDEX IF NOT EXISTS idx_customers_last_visit ON customers(last_visit_date);
CREATE INDEX IF NOT EXISTS idx_customers_behavior_tags ON customers USING GIN(behavior_tags);

CREATE INDEX IF NOT EXISTS idx_customer_orders_customer_id ON customer_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_orders_restaurant_id ON customer_orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_customer_orders_timestamp ON customer_orders(order_timestamp);

CREATE INDEX IF NOT EXISTS idx_automation_triggers_customer_id ON automation_triggers(customer_id);
CREATE INDEX IF NOT EXISTS idx_automation_triggers_restaurant_id ON automation_triggers(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_automation_triggers_processed ON automation_triggers(processed);
CREATE INDEX IF NOT EXISTS idx_automation_triggers_type ON automation_triggers(trigger_type);

-- Functions for automatic tag calculation
CREATE OR REPLACE FUNCTION calculate_customer_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update customer metrics when orders change
    UPDATE customers SET
        total_visits = (
            SELECT COUNT(*) 
            FROM customer_orders 
            WHERE customer_id = NEW.customer_id
        ),
        total_spend = (
            SELECT COALESCE(SUM(total_amount), 0) 
            FROM customer_orders 
            WHERE customer_id = NEW.customer_id
        ),
        average_order_value = (
            SELECT COALESCE(AVG(total_amount), 0) 
            FROM customer_orders 
            WHERE customer_id = NEW.customer_id
        ),
        guest_estimate_avg = (
            SELECT COALESCE(AVG(guest_count_estimate), 1) 
            FROM customer_orders 
            WHERE customer_id = NEW.customer_id
        ),
        last_visit_date = (
            SELECT MAX(order_timestamp) 
            FROM customer_orders 
            WHERE customer_id = NEW.customer_id
        ),
        updated_at = NOW()
    WHERE id = NEW.customer_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update customer metrics
CREATE TRIGGER trigger_calculate_customer_metrics
    AFTER INSERT OR UPDATE ON customer_orders
    FOR EACH ROW
    EXECUTE FUNCTION calculate_customer_metrics();

-- Function to update visit gap
CREATE OR REPLACE FUNCTION calculate_visit_gap()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate average visit gap for customer
    UPDATE customers SET
        average_visit_gap = (
            SELECT COALESCE(
                EXTRACT(EPOCH FROM (MAX(order_timestamp) - MIN(order_timestamp))) / 
                (86400 * GREATEST(COUNT(*) - 1, 1)), 
                30
            )
            FROM customer_orders 
            WHERE customer_id = NEW.customer_id
        )
    WHERE id = NEW.customer_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to calculate visit gap
CREATE TRIGGER trigger_calculate_visit_gap
    AFTER INSERT OR UPDATE ON customer_orders
    FOR EACH ROW
    EXECUTE FUNCTION calculate_visit_gap();
