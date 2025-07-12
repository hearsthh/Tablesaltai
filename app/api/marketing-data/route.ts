import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type {
  MarketingChannel,
  MarketingCampaign,
  MarketingAnalytics,
  MarketingDataCompletionStatus,
} from "@/lib/types/marketing-data"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurant_id")
    const type = searchParams.get("type") // 'channels', 'campaigns', 'analytics', 'completion'

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID is required" }, { status: 400 })
    }

    switch (type) {
      case "channels":
        return await getMarketingChannels(restaurantId)
      case "campaigns":
        return await getMarketingCampaigns(restaurantId)
      case "analytics":
        return await getMarketingAnalytics(restaurantId, searchParams)
      case "completion":
        return await getCompletionStatus(restaurantId)
      default:
        return await getAllMarketingData(restaurantId)
    }
  } catch (error) {
    console.error("Error fetching marketing data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    switch (type) {
      case "channel":
        return await saveMarketingChannel(data)
      case "campaign":
        return await saveMarketingCampaign(data)
      case "sync_channels":
        return await syncChannelData(data.restaurant_id)
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error saving marketing data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function getMarketingChannels(restaurantId: string) {
  const { data, error } = await supabase
    .from("marketing_channels")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false })

  if (error) throw error

  // Calculate AI insights for each channel
  const channelsWithInsights = await Promise.all(
    (data || []).map(async (channel) => {
      const insights = await generateChannelInsights(channel)
      return { ...channel, ai_insights: insights }
    }),
  )

  return NextResponse.json({
    success: true,
    channels: channelsWithInsights,
    total: channelsWithInsights.length,
  })
}

async function getMarketingCampaigns(restaurantId: string) {
  const { data, error } = await supabase
    .from("marketing_campaigns")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return NextResponse.json({
    success: true,
    campaigns: data || [],
    total: (data || []).length,
  })
}

async function getMarketingAnalytics(restaurantId: string, searchParams: URLSearchParams) {
  const period = searchParams.get("period") || "monthly"
  const startDate = searchParams.get("start_date")
  const endDate = searchParams.get("end_date")

  // Generate comprehensive analytics
  const analytics = await generateMarketingAnalytics(restaurantId, {
    period: period as any,
    start_date: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: endDate || new Date().toISOString(),
  })

  return NextResponse.json({
    success: true,
    analytics,
  })
}

async function getCompletionStatus(restaurantId: string): Promise<NextResponse> {
  // Get all marketing data to calculate completion
  const [channelsResult, campaignsResult] = await Promise.all([
    supabase.from("marketing_channels").select("*").eq("restaurant_id", restaurantId),
    supabase.from("marketing_campaigns").select("*").eq("restaurant_id", restaurantId),
  ])

  const channels = channelsResult.data || []
  const campaigns = campaignsResult.data || []

  const availableChannels = [
    "instagram",
    "facebook",
    "website",
    "sms",
    "email",
    "whatsapp",
    "google_ads",
    "facebook_ads",
    "instagram_ads",
    "gmb",
  ]
  const connectedChannels = channels.filter((c) => c.is_connected)

  const completionStatus: MarketingDataCompletionStatus = {
    restaurant_id: restaurantId,
    channels_connected: {
      total_available: availableChannels.length,
      connected: connectedChannels.length,
      completion_percentage: Math.round((connectedChannels.length / availableChannels.length) * 100),
      missing_channels: availableChannels.filter((ch) => !channels.find((c) => c.channel_name === ch)),
    },
    data_collection: {
      reach_data: connectedChannels.some((c) => c.reach > 0),
      engagement_data: connectedChannels.some((c) => c.engagement > 0),
      conversation_data: connectedChannels.some((c) => c.conversation > 0),
      spend_data: connectedChannels.some((c) => c.spend > 0),
      content_data: connectedChannels.some((c) => c.content_published_count > 0),
      completion_percentage: 0,
    },
    campaign_setup: {
      active_campaigns: campaigns.filter((c) => c.status === "active").length,
      total_campaigns: campaigns.length,
      campaign_performance_tracking: campaigns.some((c) => c.performance && Object.keys(c.performance).length > 0),
      completion_percentage: campaigns.length > 0 ? 75 : 0,
    },
    analytics_setup: {
      tracking_configured: connectedChannels.length > 0,
      goals_defined: campaigns.some((c) => c.objective),
      attribution_setup: connectedChannels.some((c) => c.config?.utm_tracking_enabled),
      reporting_automated: connectedChannels.some((c) => c.sync_frequency !== "manual"),
      completion_percentage: 0,
    },
    overall_completion_percentage: 0,
    next_recommended_actions: [],
    estimated_completion_time: "2-3 hours",
    last_updated: new Date().toISOString(),
  }

  // Calculate completion percentages
  const dataCollectionItems = Object.values(completionStatus.data_collection).slice(0, -1) as boolean[]
  completionStatus.data_collection.completion_percentage = Math.round(
    (dataCollectionItems.filter(Boolean).length / dataCollectionItems.length) * 100,
  )

  const analyticsItems = Object.values(completionStatus.analytics_setup).slice(0, -1) as boolean[]
  completionStatus.analytics_setup.completion_percentage = Math.round(
    (analyticsItems.filter(Boolean).length / analyticsItems.length) * 100,
  )

  completionStatus.overall_completion_percentage = Math.round(
    (completionStatus.channels_connected.completion_percentage +
      completionStatus.data_collection.completion_percentage +
      completionStatus.campaign_setup.completion_percentage +
      completionStatus.analytics_setup.completion_percentage) /
      4,
  )

  // Generate recommendations
  if (completionStatus.channels_connected.completion_percentage < 50) {
    completionStatus.next_recommended_actions.push("Connect more marketing channels")
  }
  if (completionStatus.campaign_setup.active_campaigns === 0) {
    completionStatus.next_recommended_actions.push("Create your first marketing campaign")
  }
  if (!completionStatus.analytics_setup.tracking_configured) {
    completionStatus.next_recommended_actions.push("Set up analytics tracking")
  }

  return NextResponse.json({
    success: true,
    completion_status: completionStatus,
  })
}

async function getAllMarketingData(restaurantId: string) {
  const [channelsResult, campaignsResult, completionResult] = await Promise.all([
    getMarketingChannels(restaurantId),
    getMarketingCampaigns(restaurantId),
    getCompletionStatus(restaurantId),
  ])

  const channelsData = await channelsResult.json()
  const campaignsData = await campaignsResult.json()
  const completionData = await completionResult.json()

  return NextResponse.json({
    success: true,
    data: {
      channels: channelsData.channels,
      campaigns: campaignsData.campaigns,
      completion_status: completionData.completion_status,
    },
  })
}

async function saveMarketingChannel(channelData: Partial<MarketingChannel>) {
  const { data, error } = await supabase
    .from("marketing_channels")
    .upsert(channelData, { onConflict: "restaurant_id,channel_name" })
    .select()
    .single()

  if (error) throw error

  return NextResponse.json({
    success: true,
    channel: data,
    message: "Marketing channel saved successfully",
  })
}

async function saveMarketingCampaign(campaignData: Partial<MarketingCampaign>) {
  const { data, error } = await supabase.from("marketing_campaigns").upsert(campaignData).select().single()

  if (error) throw error

  return NextResponse.json({
    success: true,
    campaign: data,
    message: "Marketing campaign saved successfully",
  })
}

async function syncChannelData(restaurantId: string) {
  // Simulate syncing data from various marketing channels
  const { data: channels } = await supabase
    .from("marketing_channels")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("is_connected", true)

  const syncResults = await Promise.all(
    (channels || []).map(async (channel) => {
      try {
        // Simulate API calls to each platform
        const updatedMetrics = await simulateChannelSync(channel)

        await supabase
          .from("marketing_channels")
          .update({
            ...updatedMetrics,
            last_sync: new Date().toISOString(),
          })
          .eq("id", channel.id)

        return { channel: channel.channel_name, status: "success" }
      } catch (error) {
        return { channel: channel.channel_name, status: "error", error: error.message }
      }
    }),
  )

  return NextResponse.json({
    success: true,
    sync_results: syncResults,
    message: "Channel data sync completed",
  })
}

// Helper functions for AI insights and data generation
async function generateChannelInsights(channel: MarketingChannel) {
  // Simulate AI-powered insights generation
  const performanceScore = Math.round(
    (channel.engagement / Math.max(channel.reach, 1)) * 100 +
      (channel.conversation / Math.max(channel.engagement, 1)) * 50,
  )

  return {
    performance_score: Math.min(performanceScore, 100),
    growth_trend: channel.reach > 1000 ? "increasing" : ("stable" as const),
    best_performing_content_type:
      Object.entries(channel.content_types || {}).sort(([, a], [, b]) => (b || 0) - (a || 0))[0]?.[0] || "posts",
    optimal_posting_times: ["09:00", "13:00", "18:00", "21:00"],
    audience_engagement_pattern: "Higher engagement on weekends and evenings",
    content_recommendations: [
      "Increase video content for better engagement",
      "Post more user-generated content",
      "Use trending hashtags relevant to your cuisine",
    ],
    budget_optimization_suggestions: [
      "Allocate more budget to high-performing content types",
      "Reduce spend on low-engagement time slots",
    ],
    competitor_comparison: {
      position: Math.floor(Math.random() * 10) + 1,
      gap_analysis: ["Increase posting frequency", "Improve visual content quality"],
    },
  }
}

async function generateMarketingAnalytics(restaurantId: string, params: any): Promise<MarketingAnalytics> {
  // Simulate comprehensive analytics generation
  return {
    restaurant_id: restaurantId,
    period: params.period,
    start_date: params.start_date,
    end_date: params.end_date,
    total_reach: Math.floor(Math.random() * 50000) + 10000,
    total_engagement: Math.floor(Math.random() * 5000) + 1000,
    total_conversions: Math.floor(Math.random() * 500) + 50,
    total_spend: Math.floor(Math.random() * 10000) + 1000,
    total_revenue: Math.floor(Math.random() * 50000) + 5000,
    overall_roas: 4.2,
    channel_performance: [
      {
        channel_name: "instagram",
        reach: 15000,
        engagement: 1200,
        conversions: 45,
        spend: 2000,
        revenue: 8500,
        roas: 4.25,
        content_published: 24,
        top_content_types: [
          { type: "reels", count: 8, performance: 85 },
          { type: "posts", count: 12, performance: 72 },
          { type: "stories", count: 15, performance: 68 },
        ],
      },
    ],
    content_performance: {
      total_content_published: 45,
      avg_engagement_per_content: 67,
      top_performing_content: [],
      content_type_breakdown: [],
    },
    audience_insights: {
      demographics: {
        age_groups: [
          { range: "18-24", percentage: 25 },
          { range: "25-34", percentage: 35 },
          { range: "35-44", percentage: 30 },
          { range: "45+", percentage: 10 },
        ],
        gender_split: [
          { gender: "female", percentage: 55 },
          { gender: "male", percentage: 45 },
        ],
        location_breakdown: [
          { city: "Delhi", percentage: 40 },
          { city: "Mumbai", percentage: 30 },
          { city: "Bangalore", percentage: 20 },
          { city: "Others", percentage: 10 },
        ],
      },
      behavior_patterns: {
        peak_engagement_hours: [12, 13, 18, 19, 20, 21],
        peak_engagement_days: ["Friday", "Saturday", "Sunday"],
        device_usage: [
          { device: "mobile", percentage: 85 },
          { device: "desktop", percentage: 15 },
        ],
        content_preferences: [
          { type: "video", engagement_rate: 8.5 },
          { type: "image", engagement_rate: 6.2 },
          { type: "carousel", engagement_rate: 7.1 },
        ],
      },
      growth_metrics: {
        follower_growth_rate: 12.5,
        engagement_growth_rate: 18.3,
        reach_growth_rate: 15.7,
        conversion_growth_rate: 22.1,
      },
    },
    competitive_analysis: {
      market_position: 3,
      share_of_voice: 15.2,
      engagement_benchmark: 4.8,
      content_gap_analysis: ["More video content needed", "Increase user-generated content"],
      opportunity_areas: ["TikTok marketing", "Influencer partnerships", "Local SEO"],
    },
    ai_insights: {
      performance_summary: "Strong performance across social channels with room for growth in paid advertising",
      key_trends: [
        "Video content performing 40% better than static posts",
        "Weekend engagement 25% higher than weekdays",
        "Local hashtags driving 30% more reach",
      ],
      optimization_opportunities: [
        "Increase video content production",
        "Optimize posting schedule for peak hours",
        "Expand to TikTok and YouTube Shorts",
      ],
      budget_recommendations: {
        suggested_budget: 15000,
        reallocation_suggestions: [{ from_channel: "facebook_ads", to_channel: "instagram_ads", amount: 2000 }],
      },
      content_recommendations: {
        content_types_to_increase: ["reels", "stories", "user_generated"],
        content_types_to_decrease: ["static_posts"],
        optimal_posting_schedule: [
          { day: "Monday", times: ["12:00", "18:00"] },
          { day: "Tuesday", times: ["13:00", "19:00"] },
          { day: "Wednesday", times: ["12:00", "18:00"] },
          { day: "Thursday", times: ["13:00", "19:00"] },
          { day: "Friday", times: ["12:00", "17:00", "20:00"] },
          { day: "Saturday", times: ["11:00", "14:00", "19:00"] },
          { day: "Sunday", times: ["12:00", "15:00", "18:00"] },
        ],
      },
      audience_expansion_opportunities: {
        new_demographics: ["18-24 age group", "Food enthusiasts in tier-2 cities"],
        new_interests: ["Healthy eating", "Local cuisine", "Food photography"],
        lookalike_potential: 85,
      },
    },
    generated_at: new Date().toISOString(),
  }
}

async function simulateChannelSync(channel: MarketingChannel) {
  // Simulate fetching real data from marketing platforms
  const baseMetrics = {
    reach: channel.reach + Math.floor(Math.random() * 1000),
    engagement: channel.engagement + Math.floor(Math.random() * 100),
    conversation: channel.conversation + Math.floor(Math.random() * 50),
    spend: channel.spend + Math.floor(Math.random() * 500),
    content_published_count: channel.content_published_count + Math.floor(Math.random() * 5),
  }

  // Channel-specific metrics simulation
  const channelSpecificMetrics = { ...channel.channel_specific_metrics }

  switch (channel.channel_name) {
    case "instagram":
      channelSpecificMetrics.followers = (channelSpecificMetrics.followers || 0) + Math.floor(Math.random() * 50)
      channelSpecificMetrics.profile_visits =
        (channelSpecificMetrics.profile_visits || 0) + Math.floor(Math.random() * 200)
      break
    case "facebook":
      channelSpecificMetrics.likes = (channelSpecificMetrics.likes || 0) + Math.floor(Math.random() * 30)
      channelSpecificMetrics.shares = (channelSpecificMetrics.shares || 0) + Math.floor(Math.random() * 20)
      break
    case "google_ads":
      channelSpecificMetrics.cpc = Math.random() * 2 + 0.5
      channelSpecificMetrics.ctr = Math.random() * 5 + 1
      break
  }

  return {
    ...baseMetrics,
    channel_specific_metrics: channelSpecificMetrics,
  }
}
