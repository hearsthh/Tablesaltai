-- Marketing Channels Table
CREATE TABLE IF NOT EXISTS marketing_channels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'social', 'web', 'platform', 'email'
  status VARCHAR(20) DEFAULT 'disconnected', -- 'connected', 'disconnected', 'pending'
  strength INTEGER DEFAULT 0, -- percentage strength
  followers INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  monthly_visitors INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  profile_views INTEGER DEFAULT 0,
  booking_rate DECIMAL(5,2) DEFAULT 0,
  last_sync TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing Affiliations Table
CREATE TABLE IF NOT EXISTS marketing_affiliations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'influencer_group', 'business_group', 'social_community', 'event_organizer'
  category VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  pincode VARCHAR(10),
  relevance_score INTEGER DEFAULT 0,
  contact_info JSONB DEFAULT '{}',
  engagement_potential VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
  collaboration_type TEXT[] DEFAULT '{}',
  estimated_reach INTEGER DEFAULT 0,
  avg_engagement_rate DECIMAL(5,2) DEFAULT 0,
  description TEXT,
  status VARCHAR(20) DEFAULT 'discovered', -- 'discovered', 'contacted', 'partnered', 'declined'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing Campaigns Table
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'organic', 'paid', 'hybrid'
  channels TEXT[] DEFAULT '{}',
  budget DECIMAL(10,2) DEFAULT 0,
  spent DECIMAL(10,2) DEFAULT 0,
  target VARCHAR(50) NOT NULL, -- 'promotion', 'activation', 'revenue'
  description TEXT,
  duration VARCHAR(50),
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'approved', 'active', 'paused', 'completed'
  ai_analysis JSONB DEFAULT '{}',
  content_list JSONB DEFAULT '{}',
  activities JSONB DEFAULT '{}',
  expected_output JSONB DEFAULT '{}',
  actual_results JSONB DEFAULT '{}',
  approved_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  auto_scheduled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing Calendar Table
CREATE TABLE IF NOT EXISTS marketing_calendar (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- 'activity', 'task'
  title VARCHAR(200) NOT NULL,
  description TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  assigned_to VARCHAR(20) NOT NULL, -- 'ai', 'user'
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
  priority VARCHAR(10) DEFAULT 'medium', -- 'low', 'medium', 'high'
  estimated_duration INTEGER DEFAULT 0, -- in minutes
  dependencies TEXT[] DEFAULT '{}',
  channel TEXT[] DEFAULT '{}',
  auto_executable BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  rescheduled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing Content Table
CREATE TABLE IF NOT EXISTS marketing_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'post', 'story', 'reel', 'ad_copy', 'offer_card', etc.
  title VARCHAR(200) NOT NULL,
  content_data JSONB DEFAULT '{}',
  ai_generated BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'generated', 'approved', 'published'
  channel TEXT[] DEFAULT '{}',
  scheduled_publish_date TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  performance_metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_marketing_channels_status ON marketing_channels(status);
CREATE INDEX IF NOT EXISTS idx_marketing_affiliations_location ON marketing_affiliations(location);
CREATE INDEX IF NOT EXISTS idx_marketing_affiliations_relevance ON marketing_affiliations(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_status ON marketing_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_type ON marketing_campaigns(type);
CREATE INDEX IF NOT EXISTS idx_marketing_calendar_date ON marketing_calendar(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_marketing_calendar_status ON marketing_calendar(status);
CREATE INDEX IF NOT EXISTS idx_marketing_calendar_assigned ON marketing_calendar(assigned_to);
CREATE INDEX IF NOT EXISTS idx_marketing_content_campaign ON marketing_content(campaign_id);
CREATE INDEX IF NOT EXISTS idx_marketing_content_type ON marketing_content(type);
CREATE INDEX IF NOT EXISTS idx_marketing_content_status ON marketing_content(status);

-- Add RLS policies (Row Level Security)
ALTER TABLE marketing_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_affiliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_content ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth setup)
CREATE POLICY "Users can view their own marketing data" ON marketing_channels FOR ALL USING (true);
CREATE POLICY "Users can view their own affiliations" ON marketing_affiliations FOR ALL USING (true);
CREATE POLICY "Users can manage their own campaigns" ON marketing_campaigns FOR ALL USING (true);
CREATE POLICY "Users can manage their own calendar" ON marketing_calendar FOR ALL USING (true);
CREATE POLICY "Users can manage their own content" ON marketing_content FOR ALL USING (true);
