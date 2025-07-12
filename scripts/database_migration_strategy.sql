-- Database Migration Strategy
-- Step-by-step migration from old structure to new unified structure

-- PHASE 1: Create new unified structure (already done in previous files)
-- PHASE 2: Data Migration with validation

-- 1. Customer Data Migration
INSERT INTO customers_unified (
    id, restaurant_id, name, email, phone, total_visits, total_spend, 
    average_order_value, first_visit_date, last_visit_date, created_at, updated_at
)
SELECT DISTINCT
    COALESCE(c.id, gen_random_uuid()),
    c.restaurant_id,
    c.name,
    c.email,
    c.phone,
    COALESCE(c.visit_count, c.total_visits, 0),
    COALESCE(c.total_spent, c.total_spend, 0),
    COALESCE(c.avg_spend, c.average_order_value, 0),
    COALESCE(c.first_order_date, c.first_visit_date),
    COALESCE(c.last_order_date, c.last_visit_date),
    c.created_at,
    c.updated_at
FROM (
    -- Union all customer tables
    SELECT id, restaurant_id, name, email, phone, visit_count, NULL as total_visits, 
           total_spent, NULL as total_spend, avg_spend, NULL as average_order_value,
           first_order_date, NULL as first_visit_date, last_order_date, NULL as last_visit_date,
           created_at, updated_at
    FROM customers WHERE EXISTS (SELECT 1 FROM customers LIMIT 1)
    
    UNION ALL
    
    SELECT id, restaurant_id, customer_name as name, customer_email as email, 
           customer_phone as phone, NULL as visit_count, total_orders as total_visits,
           NULL as total_spent, total_spend, NULL as avg_spend, avg_order_value as average_order_value,
           NULL as first_order_date, first_order_date as first_visit_date,
           NULL as last_order_date, last_order_date as last_visit_date,
           created_at, updated_at
    FROM customer_data WHERE EXISTS (SELECT 1 FROM customer_data LIMIT 1)
) c
ON CONFLICT (id) DO UPDATE SET
    total_visits = GREATEST(customers_unified.total_visits, EXCLUDED.total_visits),
    total_spend = GREATEST(customers_unified.total_spend, EXCLUDED.total_spend),
    updated_at = NOW();

-- 2. Marketing Channel Data Migration
INSERT INTO marketing_channels_unified (
    id, restaurant_id, channel_name, channel_type, is_connected, 
    reach, engagement, clicks, conversions, spend, created_at, updated_at
)
SELECT DISTINCT
    COALESCE(mc.id, gen_random_uuid()),
    mc.restaurant_id,
    mc.channel_name,
    mc.channel_type,
    COALESCE(mc.is_connected, false),
    COALESCE(mc.reach, 0),
    COALESCE(mc.engagement, 0),
    COALESCE(mc.clicks, 0),
    COALESCE(mc.conversions, 0),
    COALESCE(mc.spend, 0),
    mc.created_at,
    mc.updated_at
FROM marketing_channels mc
WHERE EXISTS (SELECT 1 FROM marketing_channels LIMIT 1)
ON CONFLICT (id) DO UPDATE SET
    is_connected = EXCLUDED.is_connected,
    reach = EXCLUDED.reach,
    engagement = EXCLUDED.engagement,
    updated_at = NOW();

-- 3. Content Units Migration
INSERT INTO content_units_unified (
    id, restaurant_id, title, content_type, content_data, 
    is_ai_generated, status, created_at, updated_at
)
SELECT 
    COALESCE(gc.id, gen_random_uuid()),
    gc.restaurant_id,
    COALESCE(gc.title, gc.content_type || ' Content'),
    gc.content_type,
    jsonb_build_object(
        'content', gc.content,
        'metadata', gc.metadata,
        'settings', gc.settings
    ),
    COALESCE(gc.is_ai_generated, false),
    COALESCE(gc.status, 'draft'),
    gc.created_at,
    gc.updated_at
FROM generated_content gc
WHERE EXISTS (SELECT 1 FROM generated_content LIMIT 1)
ON CONFLICT (id) DO NOTHING;

-- 4. Performance Data Migration
INSERT INTO unified_performance_metrics (
    restaurant_id, entity_type, entity_id, date_recorded, 
    reach, engagement, clicks, conversions, spend, revenue
)
SELECT DISTINCT
    mc.restaurant_id,
    'channel' as entity_type,
    mc.id as entity_id,
    CURRENT_DATE as date_recorded,
    mc.reach,
    mc.engagement,
    mc.clicks,
    mc.conversions,
    mc.spend,
    COALESCE(mc.revenue, 0)
FROM marketing_channels_unified mc
WHERE mc.reach > 0 OR mc.engagement > 0 OR mc.clicks > 0
ON CONFLICT (entity_type, entity_id, date_recorded, period_type) DO NOTHING;

-- 5. Data Validation Queries
-- Check for data consistency after migration

CREATE OR REPLACE VIEW migration_validation AS
SELECT 
    'customers' as table_name,
    COUNT(*) as record_count,
    COUNT(DISTINCT restaurant_id) as restaurant_count,
    MIN(created_at) as earliest_record,
    MAX(updated_at) as latest_update
FROM customers_unified

UNION ALL

SELECT 
    'marketing_channels' as table_name,
    COUNT(*) as record_count,
    COUNT(DISTINCT restaurant_id) as restaurant_count,
    MIN(created_at) as earliest_record,
    MAX(updated_at) as latest_update
FROM marketing_channels_unified

UNION ALL

SELECT 
    'content_units' as table_name,
    COUNT(*) as record_count,
    COUNT(DISTINCT restaurant_id) as restaurant_count,
    MIN(created_at) as earliest_record,
    MAX(updated_at) as latest_update
FROM content_units_unified;

-- 6. Create System Health Check Function
CREATE OR REPLACE FUNCTION check_system_integration_health(p_restaurant_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    customer_count INTEGER;
    channel_count INTEGER;
    content_count INTEGER;
    campaign_count INTEGER;
BEGIN
    -- Count records in each system
    SELECT COUNT(*) INTO customer_count FROM customers_unified WHERE restaurant_id = p_restaurant_id;
    SELECT COUNT(*) INTO channel_count FROM marketing_channels_unified WHERE restaurant_id = p_restaurant_id;
    SELECT COUNT(*) INTO content_count FROM content_units_unified WHERE restaurant_id = p_restaurant_id;
    SELECT COUNT(*) INTO campaign_count FROM marketing_campaigns WHERE strategy_id IN (
        SELECT id FROM marketing_strategies WHERE restaurant_id = p_restaurant_id
    );
    
    -- Build health report
    result := jsonb_build_object(
        'restaurant_id', p_restaurant_id,
        'health_score', CASE 
            WHEN customer_count > 0 AND channel_count > 0 AND content_count > 0 AND campaign_count > 0 THEN 100
            WHEN customer_count > 0 AND channel_count > 0 AND content_count > 0 THEN 75
            WHEN customer_count > 0 AND channel_count > 0 THEN 50
            WHEN customer_count > 0 OR channel_count > 0 THEN 25
            ELSE 0
        END,
        'systems', jsonb_build_object(
            'customers', jsonb_build_object('count', customer_count, 'status', CASE WHEN customer_count > 0 THEN 'healthy' ELSE 'needs_data' END),
            'channels', jsonb_build_object('count', channel_count, 'status', CASE WHEN channel_count > 0 THEN 'healthy' ELSE 'needs_setup' END),
            'content', jsonb_build_object('count', content_count, 'status', CASE WHEN content_count > 0 THEN 'healthy' ELSE 'needs_content' END),
            'campaigns', jsonb_build_object('count', campaign_count, 'status', CASE WHEN campaign_count > 0 THEN 'healthy' ELSE 'needs_campaigns' END)
        ),
        'recommendations', CASE 
            WHEN customer_count = 0 THEN jsonb_build_array('Import customer data', 'Set up customer tracking')
            WHEN channel_count = 0 THEN jsonb_build_array('Connect marketing channels', 'Set up social media accounts')
            WHEN content_count = 0 THEN jsonb_build_array('Create content units', 'Generate AI content')
            WHEN campaign_count = 0 THEN jsonb_build_array('Create marketing campaigns', 'Set up automation')
            ELSE jsonb_build_array('System is healthy', 'Consider advanced features')
        END,
        'checked_at', NOW()
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 7. Update system integration status for all restaurants
INSERT INTO system_integration_status (
    restaurant_id, 
    menu_integration_complete,
    customer_integration_complete,
    marketing_integration_complete,
    review_integration_complete,
    data_completeness_score,
    integration_health_score
)
SELECT DISTINCT
    r.id as restaurant_id,
    EXISTS(SELECT 1 FROM menu_items WHERE restaurant_id = r.id) as menu_integration_complete,
    EXISTS(SELECT 1 FROM customers_unified WHERE restaurant_id = r.id) as customer_integration_complete,
    EXISTS(SELECT 1 FROM marketing_channels_unified WHERE restaurant_id = r.id) as marketing_integration_complete,
    EXISTS(SELECT 1 FROM reviews WHERE restaurant_id = r.id) as review_integration_complete,
    -- Calculate completeness score
    (
        (CASE WHEN EXISTS(SELECT 1 FROM menu_items WHERE restaurant_id = r.id) THEN 25 ELSE 0 END) +
        (CASE WHEN EXISTS(SELECT 1 FROM customers_unified WHERE restaurant_id = r.id) THEN 25 ELSE 0 END) +
        (CASE WHEN EXISTS(SELECT 1 FROM marketing_channels_unified WHERE restaurant_id = r.id) THEN 25 ELSE 0 END) +
        (CASE WHEN EXISTS(SELECT 1 FROM reviews WHERE restaurant_id = r.id) THEN 25 ELSE 0 END)
    ) as data_completeness_score,
    -- Calculate integration health score
    (
        (CASE WHEN EXISTS(SELECT 1 FROM menu_items WHERE restaurant_id = r.id) THEN 25 ELSE 0 END) +
        (CASE WHEN EXISTS(SELECT 1 FROM customers_unified WHERE restaurant_id = r.id) THEN 25 ELSE 0 END) +
        (CASE WHEN EXISTS(SELECT 1 FROM marketing_channels_unified WHERE restaurant_id = r.id) THEN 25 ELSE 0 END) +
        (CASE WHEN EXISTS(SELECT 1 FROM reviews WHERE restaurant_id = r.id) THEN 25 ELSE 0 END)
    ) as integration_health_score
FROM restaurants r
ON CONFLICT (restaurant_id) DO UPDATE SET
    menu_integration_complete = EXCLUDED.menu_integration_complete,
    customer_integration_complete = EXCLUDED.customer_integration_complete,
    marketing_integration_complete = EXCLUDED.marketing_integration_complete,
    review_integration_complete = EXCLUDED.review_integration_complete,
    data_completeness_score = EXCLUDED.data_completeness_score,
    integration_health_score = EXCLUDED.integration_health_score,
    updated_at = NOW();
