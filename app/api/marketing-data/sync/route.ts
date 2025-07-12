import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { restaurant_id, channel_name, force_sync = false } = body

    if (!restaurant_id) {
      return NextResponse.json({ error: "Restaurant ID is required" }, { status: 400 })
    }

    // Get channel configuration
    const { data: channel, error: channelError } = await supabase
      .from("marketing_channels")
      .select("*")
      .eq("restaurant_id", restaurant_id)
      .eq("channel_name", channel_name)
      .single()

    if (channelError || !channel) {
      return NextResponse.json({ error: "Channel not found or not configured" }, { status: 404 })
    }

    if (!channel.is_connected && !force_sync) {
      return NextResponse.json({ error: "Channel is not connected" }, { status: 400 })
    }

    // Perform channel-specific sync
    const syncResult = await performChannelSync(channel)

    // Update channel with new data
    const { error: updateError } = await supabase
      .from("marketing_channels")
      .update({
        reach: syncResult.reach,
        engagement: syncResult.engagement,
        conversation: syncResult.conversation,
        spend: syncResult.spend,
        content_published_count: syncResult.content_published_count,
        content_types: syncResult.content_types,
        channel_specific_metrics: syncResult.channel_specific_metrics,
        last_sync: new Date().toISOString(),
        connection_status: "active",
      })
      .eq("id", channel.id)

    if (updateError) {
      throw new Error(`Failed to update channel data: ${updateError.message}`)
    }

    return NextResponse.json({
      success: true,
      channel_name: channel_name,
      sync_result: syncResult,
      message: "Channel sync completed successfully",
    })
  } catch (error) {
    console.error("Channel sync error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Channel sync failed",
      },
      { status: 500 },
    )
  }
}

async function performChannelSync(channel: any) {
  // Simulate API calls to different platforms
  switch (channel.channel_name) {
    case "instagram":
      return await syncInstagramData(channel)
    case "facebook":
      return await syncFacebookData(channel)
    case "google_ads":
      return await syncGoogleAdsData(channel)
    case "email":
      return await syncEmailData(channel)
    case "sms":
      return await syncSMSData(channel)
    case "whatsapp":
      return await syncWhatsAppData(channel)
    case "website":
      return await syncWebsiteData(channel)
    case "gmb":
      return await syncGMBData(channel)
    default:
      return await syncGenericChannelData(channel)
  }
}

async function syncInstagramData(channel: any) {
  // Simulate Instagram Business API calls
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    reach: Math.floor(Math.random() * 10000) + 5000,
    engagement: Math.floor(Math.random() * 1000) + 500,
    conversation: Math.floor(Math.random() * 100) + 50,
    spend: Math.floor(Math.random() * 2000) + 500,
    content_published_count: Math.floor(Math.random() * 20) + 10,
    content_types: {
      posts: Math.floor(Math.random() * 10) + 5,
      stories: Math.floor(Math.random() * 15) + 8,
      reels: Math.floor(Math.random() * 8) + 3,
      igtv: Math.floor(Math.random() * 3) + 1,
      live: Math.floor(Math.random() * 2),
    },
    channel_specific_metrics: {
      followers: Math.floor(Math.random() * 5000) + 2000,
      following: Math.floor(Math.random() * 500) + 100,
      profile_visits: Math.floor(Math.random() * 2000) + 500,
      website_clicks: Math.floor(Math.random() * 300) + 100,
      impressions: Math.floor(Math.random() * 50000) + 20000,
      story_views: Math.floor(Math.random() * 3000) + 1000,
      story_exits: Math.floor(Math.random() * 300) + 100,
      story_replies: Math.floor(Math.random() * 50) + 20,
      saves: Math.floor(Math.random() * 200) + 50,
      shares: Math.floor(Math.random() * 150) + 30,
    },
  }
}

async function syncFacebookData(channel: any) {
  await new Promise((resolve) => setTimeout(resolve, 1200))

  return {
    reach: Math.floor(Math.random() * 8000) + 3000,
    engagement: Math.floor(Math.random() * 800) + 300,
    conversation: Math.floor(Math.random() * 80) + 30,
    spend: Math.floor(Math.random() * 1500) + 300,
    content_published_count: Math.floor(Math.random() * 15) + 8,
    content_types: {
      posts: Math.floor(Math.random() * 8) + 4,
      videos: Math.floor(Math.random() * 5) + 2,
      photos: Math.floor(Math.random() * 6) + 3,
      events: Math.floor(Math.random() * 2),
      polls: Math.floor(Math.random() * 3) + 1,
    },
    channel_specific_metrics: {
      likes: Math.floor(Math.random() * 3000) + 1000,
      followers: Math.floor(Math.random() * 4000) + 1500,
      comments: Math.floor(Math.random() * 400) + 150,
      shares: Math.floor(Math.random() * 200) + 80,
      page_views: Math.floor(Math.random() * 1500) + 500,
      video_views: Math.floor(Math.random() * 5000) + 2000,
      ctr: (Math.random() * 3 + 1).toFixed(2),
      cpm: (Math.random() * 10 + 5).toFixed(2),
    },
  }
}

async function syncGoogleAdsData(channel: any) {
  await new Promise((resolve) => setTimeout(resolve, 800))

  return {
    reach: Math.floor(Math.random() * 15000) + 8000,
    engagement: Math.floor(Math.random() * 1200) + 600,
    conversation: Math.floor(Math.random() * 150) + 80,
    spend: Math.floor(Math.random() * 5000) + 2000,
    content_published_count: Math.floor(Math.random() * 10) + 5,
    content_types: {
      search_ads: Math.floor(Math.random() * 5) + 3,
      display_ads: Math.floor(Math.random() * 4) + 2,
      video_ads: Math.floor(Math.random() * 3) + 1,
      shopping_ads: Math.floor(Math.random() * 2),
    },
    channel_specific_metrics: {
      impressions: Math.floor(Math.random() * 100000) + 50000,
      clicks: Math.floor(Math.random() * 2000) + 1000,
      ctr: (Math.random() * 5 + 2).toFixed(2),
      cpc: (Math.random() * 3 + 0.5).toFixed(2),
      conversion_rate: (Math.random() * 8 + 2).toFixed(2),
      roas: (Math.random() * 6 + 2).toFixed(2),
      quality_score: Math.floor(Math.random() * 4) + 7,
    },
  }
}

async function syncEmailData(channel: any) {
  await new Promise((resolve) => setTimeout(resolve, 600))

  return {
    reach: Math.floor(Math.random() * 5000) + 2000,
    engagement: Math.floor(Math.random() * 1000) + 400,
    conversation: Math.floor(Math.random() * 200) + 100,
    spend: Math.floor(Math.random() * 500) + 100,
    content_published_count: Math.floor(Math.random() * 8) + 4,
    content_types: {
      newsletters: Math.floor(Math.random() * 4) + 2,
      promotions: Math.floor(Math.random() * 3) + 1,
      announcements: Math.floor(Math.random() * 2) + 1,
      automated: Math.floor(Math.random() * 5) + 2,
    },
    channel_specific_metrics: {
      email_opens: Math.floor(Math.random() * 1500) + 600,
      email_clicks: Math.floor(Math.random() * 300) + 120,
      email_bounces: Math.floor(Math.random() * 50) + 10,
      unsubscribes: Math.floor(Math.random() * 20) + 5,
      open_rate: (Math.random() * 20 + 15).toFixed(1),
      click_rate: (Math.random() * 8 + 3).toFixed(1),
      bounce_rate: (Math.random() * 3 + 1).toFixed(1),
    },
  }
}

async function syncSMSData(channel: any) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    reach: Math.floor(Math.random() * 3000) + 1000,
    engagement: Math.floor(Math.random() * 600) + 200,
    conversation: Math.floor(Math.random() * 150) + 50,
    spend: Math.floor(Math.random() * 800) + 200,
    content_published_count: Math.floor(Math.random() * 12) + 6,
    content_types: {
      promotional: Math.floor(Math.random() * 5) + 3,
      transactional: Math.floor(Math.random() * 4) + 2,
      reminders: Math.floor(Math.random() * 3) + 1,
      alerts: Math.floor(Math.random() * 2) + 1,
    },
    channel_specific_metrics: {
      sms_delivered: Math.floor(Math.random() * 2800) + 950,
      sms_opens: Math.floor(Math.random() * 2000) + 700,
      sms_clicks: Math.floor(Math.random() * 400) + 150,
      delivery_rate: (Math.random() * 5 + 95).toFixed(1),
      open_rate: (Math.random() * 15 + 80).toFixed(1),
      click_rate: (Math.random() * 10 + 15).toFixed(1),
    },
  }
}

async function syncWhatsAppData(channel: any) {
  await new Promise((resolve) => setTimeout(resolve, 700))

  return {
    reach: Math.floor(Math.random() * 2000) + 800,
    engagement: Math.floor(Math.random() * 800) + 300,
    conversation: Math.floor(Math.random() * 200) + 80,
    spend: Math.floor(Math.random() * 300) + 50,
    content_published_count: Math.floor(Math.random() * 15) + 8,
    content_types: {
      broadcasts: Math.floor(Math.random() * 6) + 3,
      stories: Math.floor(Math.random() * 5) + 2,
      direct_messages: Math.floor(Math.random() * 8) + 4,
    },
    channel_specific_metrics: {
      messages_sent: Math.floor(Math.random() * 1500) + 600,
      messages_delivered: Math.floor(Math.random() * 1400) + 580,
      messages_read: Math.floor(Math.random() * 1200) + 500,
      replies_received: Math.floor(Math.random() * 300) + 120,
      delivery_rate: (Math.random() * 5 + 95).toFixed(1),
      read_rate: (Math.random() * 10 + 85).toFixed(1),
      response_rate: (Math.random() * 15 + 20).toFixed(1),
    },
  }
}

async function syncWebsiteData(channel: any) {
  await new Promise((resolve) => setTimeout(resolve, 900))

  return {
    reach: Math.floor(Math.random() * 12000) + 5000,
    engagement: Math.floor(Math.random() * 2000) + 800,
    conversation: Math.floor(Math.random() * 300) + 120,
    spend: Math.floor(Math.random() * 1000) + 200,
    content_published_count: Math.floor(Math.random() * 25) + 15,
    content_types: {
      blog_posts: Math.floor(Math.random() * 8) + 4,
      menu_updates: Math.floor(Math.random() * 6) + 3,
      promotions: Math.floor(Math.random() * 5) + 2,
      events: Math.floor(Math.random() * 4) + 2,
      galleries: Math.floor(Math.random() * 3) + 1,
    },
    channel_specific_metrics: {
      page_views: Math.floor(Math.random() * 15000) + 8000,
      unique_visitors: Math.floor(Math.random() * 8000) + 4000,
      session_duration: Math.floor(Math.random() * 180) + 120,
      bounce_rate: (Math.random() * 20 + 30).toFixed(1),
      conversion_rate: (Math.random() * 5 + 2).toFixed(2),
      organic_traffic: Math.floor(Math.random() * 5000) + 2000,
      direct_traffic: Math.floor(Math.random() * 3000) + 1500,
    },
  }
}

async function syncGMBData(channel: any) {
  await new Promise((resolve) => setTimeout(resolve, 1100))

  return {
    reach: Math.floor(Math.random() * 6000) + 3000,
    engagement: Math.floor(Math.random() * 800) + 400,
    conversation: Math.floor(Math.random() * 100) + 50,
    spend: 0, // GMB is typically free
    content_published_count: Math.floor(Math.random() * 12) + 6,
    content_types: {
      posts: Math.floor(Math.random() * 6) + 3,
      photos: Math.floor(Math.random() * 8) + 4,
      events: Math.floor(Math.random() * 3) + 1,
      offers: Math.floor(Math.random() * 2) + 1,
    },
    channel_specific_metrics: {
      profile_views: Math.floor(Math.random() * 4000) + 2000,
      search_views: Math.floor(Math.random() * 3000) + 1500,
      map_views: Math.floor(Math.random() * 2000) + 1000,
      website_clicks: Math.floor(Math.random() * 500) + 200,
      direction_requests: Math.floor(Math.random() * 300) + 150,
      call_clicks: Math.floor(Math.random() * 200) + 100,
      photo_views: Math.floor(Math.random() * 5000) + 2500,
      menu_views: Math.floor(Math.random() * 800) + 400,
    },
  }
}

async function syncGenericChannelData(channel: any) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    reach: Math.floor(Math.random() * 5000) + 1000,
    engagement: Math.floor(Math.random() * 500) + 100,
    conversation: Math.floor(Math.random() * 50) + 20,
    spend: Math.floor(Math.random() * 1000) + 100,
    content_published_count: Math.floor(Math.random() * 10) + 5,
    content_types: {
      general: Math.floor(Math.random() * 10) + 5,
    },
    channel_specific_metrics: {
      views: Math.floor(Math.random() * 3000) + 1000,
      interactions: Math.floor(Math.random() * 300) + 100,
    },
  }
}
