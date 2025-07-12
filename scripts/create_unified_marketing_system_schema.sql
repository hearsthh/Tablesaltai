-- Unified Marketing System Schema
-- Addresses: Missing Marketing System Schema + Integration Gaps

-- Drop existing conflicting tables if they exist
DROP TABLE IF EXISTS marketing_strategies CASCADE;
DROP TABLE IF EXISTS marketing_campaigns CASCADE;
DROP TABLE IF EXISTS campaign_channels CASCADE;
DROP TABLE IF EXISTS campaign_tasks CASCADE;
DROP TABLE IF EXISTS marketing_calendar_events CASCADE;
DROP TABLE IF EXISTS automation_rules CASCADE;
DROP TABLE IF EXISTS automation_workflows CASCADE;

-- Marketing Strategies (Top Level)
CREATE TABLE marketing_strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    restaurant_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    goal TEXT NOT NULL,
    description TEXT,
    objective_tags TEXT[] DEFAULT '{}',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
    is_ai_generated BOOLEAN DEFAULT false,
    linked_entities JSONB DEFAULT '{}',
    performance JSONB DEFAULT '{
        "totalReach": 0,
        "totalEngagement": 0,
        "totalSpend": 0,
        "roas": 0,
        "completionRate": 0
    }',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing Campaigns (Under Strategies)
CREATE TABLE marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    strategy_id UUID NOT NULL REFERENCES marketing_strategies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    target_audience JSONB DEFAULT '{}',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget JSONB DEFAULT '{
        "allocated": 0,
        "spent": 0,
        "remaining": 0
    }',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'live', 'completed', 'paused')),
    linked_entities JSONB DEFAULT '{}',
    performance JSONB DEFAULT '{
        "reach": 0,
        "clicks": 0,
        "conversions": 0,
        "engagement": 0,
        "roas": 0
    }',
    is_ai_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign Channels (Per Campaign)
CREATE TABLE campaign_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
    channel_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'ready', 'scheduled', 'sent', 'completed')),
    settings JSONB DEFAULT '{}',
    performance JSONB DEFAULT '{
        "reach": 0,
        "engagement": 0,
        "clicks": 0,
        "conversions": 0,
        "spend": 0
    }',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign Tasks (Per Campaign/Content)
CREATE TABLE campaign_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
    content_unit_id UUID, -- Links to existing content system
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type VARCHAR(50) NOT NULL,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done', 'blocked')),
    assigned_to VARCHAR(100) DEFAULT 'user', -- 'user', 'ai', or user_id
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    dependencies UUID[] DEFAULT '{}', -- Array of task IDs
    auto_complete BOOLEAN DEFAULT false,
    estimated_minutes INTEGER DEFAULT 30,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing Calendar Events
CREATE TABLE marketing_calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('strategy', 'campaign', 'content', 'task', 'milestone')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'completed', 'overdue', 'cancelled')),
    linked_id UUID NOT NULL, -- ID of strategy, campaign, content, or task
    linked_type VARCHAR(20) NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6',
    priority VARCHAR(10) DEFAULT 'medium',
    reminders TEXT[] DEFAULT '{}',
    attendees UUID[] DEFAULT '{}',
    is_all_day BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation Rules
CREATE TABLE automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    restaurant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    trigger_config JSONB NOT NULL,
    conditions JSONB DEFAULT '[]',
    actions JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_triggered TIMESTAMP WITH TIME ZONE,
    trigger_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation Execution Logs
CREATE TABLE automation_execution_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id UUID NOT NULL REFERENCES automation_rules(id) ON DELETE CASCADE,
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    trigger_data JSONB,
    execution_status VARCHAR(20) DEFAULT 'pending' CHECK (execution_status IN ('pending', 'success', 'failed', 'partial')),
    actions_executed JSONB DEFAULT '[]',
    error_message TEXT,
    execution_time_ms INTEGER
);

-- Content-Campaign Integration (Linking Table)
CREATE TABLE content_campaign_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_unit_id UUID NOT NULL, -- Links to existing content system
    campaign_id UUID NOT NULL REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
    channel_id UUID REFERENCES campaign_channels(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'draft',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    performance JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(content_unit_id, campaign_id, channel_id)
);

-- Indexes for Performance
CREATE INDEX idx_marketing_strategies_user_restaurant ON marketing_strategies(user_id, restaurant_id);
CREATE INDEX idx_marketing_campaigns_strategy ON marketing_campaigns(strategy_id);
CREATE INDEX idx_campaign_channels_campaign ON campaign_channels(campaign_id);
CREATE INDEX idx_campaign_tasks_campaign ON campaign_tasks(campaign_id);
CREATE INDEX idx_campaign_tasks_due_date ON campaign_tasks(due_date);
CREATE INDEX idx_calendar_events_user_date ON marketing_calendar_events(user_id, event_date);
CREATE INDEX idx_automation_rules_active ON automation_rules(is_active) WHERE is_active = true;
CREATE INDEX idx_content_campaign_links_campaign ON content_campaign_links(campaign_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_marketing_strategies_updated_at BEFORE UPDATE ON marketing_strategies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketing_campaigns_updated_at BEFORE UPDATE ON marketing_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaign_channels_updated_at BEFORE UPDATE ON campaign_channels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaign_tasks_updated_at BEFORE UPDATE ON campaign_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON marketing_calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_automation_rules_updated_at BEFORE UPDATE ON automation_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
