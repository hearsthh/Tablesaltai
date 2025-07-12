-- Advanced Automation Schema
-- Addresses: Comprehensive automation workflow tracking and AI decision making

-- 1. Automation Workflows (Complex Multi-Step Automations)
CREATE TABLE automation_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Workflow Definition
    workflow_steps JSONB NOT NULL, -- Array of step definitions
    trigger_config JSONB NOT NULL,
    
    -- Execution Settings
    is_active BOOLEAN DEFAULT true,
    execution_mode VARCHAR(20) DEFAULT 'automatic' CHECK (execution_mode IN ('automatic', 'manual_approval', 'hybrid')),
    max_executions_per_day INTEGER DEFAULT 100,
    
    -- Performance Tracking
    total_executions INTEGER DEFAULT 0,
    successful_executions INTEGER DEFAULT 0,
    failed_executions INTEGER DEFAULT 0,
    avg_execution_time_ms INTEGER DEFAULT 0,
    
    -- Business Impact
    estimated_time_saved_hours DECIMAL(8,2) DEFAULT 0,
    estimated_cost_saved DECIMAL(10,2) DEFAULT 0,
    roi_score DECIMAL(5,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Workflow Executions (Individual Runs)
CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES automation_workflows(id) ON DELETE CASCADE,
    
    -- Execution Context
    trigger_data JSONB,
    execution_context JSONB DEFAULT '{}',
    
    -- Execution Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled', 'requires_approval')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Step Tracking
    current_step INTEGER DEFAULT 0,
    completed_steps INTEGER DEFAULT 0,
    total_steps INTEGER NOT NULL,
    step_results JSONB DEFAULT '[]',
    
    -- Error Handling
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    
    -- Performance
    execution_time_ms INTEGER,
    resources_used JSONB DEFAULT '{}'
);

-- 3. AI Decision Tracking
CREATE TABLE ai_decision_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    
    -- Decision Context
    decision_type VARCHAR(50) NOT NULL, -- 'content_generation', 'campaign_optimization', 'customer_segmentation', etc.
    entity_type VARCHAR(20), -- What was being decided about
    entity_id UUID,
    
    -- AI Model Info
    model_used VARCHAR(100) NOT NULL,
    model_version VARCHAR(50),
    confidence_score DECIMAL(5,4),
    
    -- Decision Data
    input_data JSONB NOT NULL,
    decision_made JSONB NOT NULL,
    alternative_options JSONB DEFAULT '[]',
    reasoning TEXT,
    
    -- Human Feedback
    human_approved BOOLEAN,
    human_feedback TEXT,
    human_override JSONB,
    
    -- Outcome Tracking
    outcome_measured BOOLEAN DEFAULT false,
    outcome_data JSONB,
    success_score DECIMAL(5,2), -- 0-100
    
    -- Learning Data
    used_for_training BOOLEAN DEFAULT false,
    feedback_incorporated BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Smart Triggers (Context-Aware Triggers)
CREATE TABLE smart_triggers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    
    -- Trigger Logic
    trigger_type VARCHAR(50) NOT NULL,
    conditions JSONB NOT NULL, -- Complex condition logic
    context_requirements JSONB DEFAULT '{}', -- Required context for trigger
    
    -- Smart Features
    learning_enabled BOOLEAN DEFAULT true,
    adaptive_threshold BOOLEAN DEFAULT false,
    seasonal_adjustment BOOLEAN DEFAULT false,
    
    -- Performance Optimization
    trigger_frequency_limit JSONB DEFAULT '{}', -- Rate limiting
    cooldown_period_minutes INTEGER DEFAULT 0,
    priority_score INTEGER DEFAULT 50, -- 0-100
    
    -- Analytics
    trigger_count INTEGER DEFAULT 0,
    success_rate DECIMAL(5,4) DEFAULT 0,
    avg_outcome_score DECIMAL(5,2) DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    last_triggered TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Automation Performance Analytics
CREATE TABLE automation_performance_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    
    -- Time Period
    date_recorded DATE NOT NULL,
    period_type VARCHAR(20) DEFAULT 'daily' CHECK (period_type IN ('daily', 'weekly', 'monthly')),
    
    -- Execution Metrics
    total_automations_run INTEGER DEFAULT 0,
    successful_automations INTEGER DEFAULT 0,
    failed_automations INTEGER DEFAULT 0,
    avg_execution_time_ms INTEGER DEFAULT 0,
    
    -- Business Impact
    time_saved_hours DECIMAL(8,2) DEFAULT 0,
    cost_saved DECIMAL(10,2) DEFAULT 0,
    revenue_generated DECIMAL(10,2) DEFAULT 0,
    tasks_automated INTEGER DEFAULT 0,
    
    -- AI Performance
    ai_decisions_made INTEGER DEFAULT 0,
    ai_accuracy_score DECIMAL(5,4) DEFAULT 0,
    human_overrides INTEGER DEFAULT 0,
    ai_learning_events INTEGER DEFAULT 0,
    
    -- Quality Metrics
    customer_satisfaction_impact DECIMAL(5,2) DEFAULT 0,
    operational_efficiency_gain DECIMAL(5,2) DEFAULT 0,
    error_rate DECIMAL(5,4) DEFAULT 0,
    
    -- Detailed Breakdown
    automation_breakdown JSONB DEFAULT '{}', -- By automation type
    channel_performance JSONB DEFAULT '{}', -- By marketing channel
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, date_recorded, period_type)
);

-- 6. Learning Dataset Management
CREATE TABLE ai_learning_datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    
    -- Dataset Info
    dataset_name VARCHAR(255) NOT NULL,
    dataset_type VARCHAR(50) NOT NULL, -- 'customer_behavior', 'content_performance', 'campaign_optimization'
    version INTEGER DEFAULT 1,
    
    -- Data Quality
    record_count INTEGER NOT NULL,
    quality_score DECIMAL(5,2) DEFAULT 0,
    completeness_percentage DECIMAL(5,2) DEFAULT 0,
    last_validation TIMESTAMP WITH TIME ZONE,
    
    -- Usage Tracking
    training_runs INTEGER DEFAULT 0,
    last_used_for_training TIMESTAMP WITH TIME ZONE,
    model_performance_improvement DECIMAL(5,4) DEFAULT 0,
    
    -- Data Governance
    data_sources TEXT[] DEFAULT '{}',
    privacy_compliance_status VARCHAR(20) DEFAULT 'pending',
    retention_period_days INTEGER DEFAULT 365,
    
    -- Storage
    storage_location TEXT,
    storage_size_mb DECIMAL(10,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Automation Recommendations
CREATE TABLE automation_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL,
    
    -- Recommendation Details
    recommendation_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    -- Impact Estimation
    estimated_time_savings_hours DECIMAL(8,2) DEFAULT 0,
    estimated_cost_savings DECIMAL(10,2) DEFAULT 0,
    estimated_revenue_impact DECIMAL(10,2) DEFAULT 0,
    implementation_effort VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
    
    -- Recommendation Data
    recommendation_data JSONB NOT NULL,
    supporting_evidence JSONB DEFAULT '{}',
    confidence_score DECIMAL(5,4) DEFAULT 0,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'implemented')),
    user_feedback TEXT,
    implementation_date TIMESTAMP WITH TIME ZONE,
    
    -- Performance (if implemented)
    actual_impact JSONB,
    success_score DECIMAL(5,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_automation_workflows_restaurant ON automation_workflows(restaurant_id);
CREATE INDEX idx_workflow_executions_workflow ON workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX idx_ai_decision_tracking_restaurant ON ai_decision_tracking(restaurant_id);
CREATE INDEX idx_ai_decision_tracking_type ON ai_decision_tracking(decision_type);
CREATE INDEX idx_smart_triggers_restaurant ON smart_triggers(restaurant_id);
CREATE INDEX idx_smart_triggers_active ON smart_triggers(is_active) WHERE is_active = true;
CREATE INDEX idx_automation_performance_restaurant_date ON automation_performance_analytics(restaurant_id, date_recorded);
CREATE INDEX idx_ai_learning_datasets_restaurant ON ai_learning_datasets(restaurant_id);
CREATE INDEX idx_automation_recommendations_restaurant ON automation_recommendations(restaurant_id);
CREATE INDEX idx_automation_recommendations_status ON automation_recommendations(status);

-- Triggers for updated_at
CREATE TRIGGER update_automation_workflows_updated_at BEFORE UPDATE ON automation_workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_smart_triggers_updated_at BEFORE UPDATE ON smart_triggers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_learning_datasets_updated_at BEFORE UPDATE ON ai_learning_datasets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_automation_recommendations_updated_at BEFORE UPDATE ON automation_recommendations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
