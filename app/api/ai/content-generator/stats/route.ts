import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId") || DEMO_USER_ID
    const timeRange = searchParams.get("timeRange") || "30d" // 7d, 30d, 90d, all

    const supabase = createClient()

    // Calculate date range
    let dateFilter = ""
    if (timeRange !== "all") {
      const days = Number.parseInt(timeRange.replace("d", ""))
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      dateFilter = startDate.toISOString()
    }

    // Get content statistics
    let query = supabase.from("generated_content").select("*").eq("restaurant_id", restaurantId)

    if (dateFilter) {
      query = query.gte("created_at", dateFilter)
    }

    const { data: content, error } = await query

    if (error) {
      console.error("Error fetching content stats:", error)
      return NextResponse.json(getDemoStats(), { status: 200 })
    }

    if (!content || content.length === 0) {
      return NextResponse.json(getDemoStats(), { status: 200 })
    }

    // Calculate statistics
    const stats = {
      totalGenerated: content.length,
      approved: content.filter((c) => c.status === "approved").length,
      used: content.filter((c) => c.status === "used").length,
      archived: content.filter((c) => c.status === "archived").length,
      draft: content.filter((c) => c.status === "draft").length,

      // Performance metrics
      avgPerformanceScore: content.reduce((sum, c) => sum + (c.performance_score || 0), 0) / content.length,
      totalUsageCount: content.reduce((sum, c) => sum + (c.usage_count || 0), 0),

      // Category breakdown
      categoryBreakdown: getCategoryBreakdown(content),

      // Content type breakdown
      contentTypeBreakdown: getContentTypeBreakdown(content),

      // Tone analysis
      toneBreakdown: getToneBreakdown(content),

      // Channel distribution
      channelBreakdown: getChannelBreakdown(content),

      // Time series data
      dailyGeneration: getDailyGenerationStats(content, timeRange),

      // Top performing content
      topPerforming: content
        .filter((c) => c.performance_score > 0)
        .sort((a, b) => (b.performance_score || 0) - (a.performance_score || 0))
        .slice(0, 5)
        .map((c) => ({
          id: c.id,
          title: c.title,
          category: c.category,
          contentType: c.content_type,
          performanceScore: c.performance_score,
          usageCount: c.usage_count,
        })),

      // AI model usage
      aiModelBreakdown: getAIModelBreakdown(content),

      // Approval rates
      approvalRate:
        content.length > 0
          ? (content.filter((c) => c.status === "approved" || c.status === "used").length / content.length) * 100
          : 0,

      // Template usage
      templateUsage: content.filter((c) => c.template_id).length,

      // Automation stats
      automationGenerated: content.filter((c) => c.generated_by === "ai").length,
      manualGenerated: content.filter((c) => c.generated_by === "user").length,
      hybridGenerated: content.filter((c) => c.generated_by === "hybrid").length,
    }

    return NextResponse.json({
      success: true,
      stats,
      timeRange,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Content stats API error:", error)
    return NextResponse.json(getDemoStats(), { status: 200 })
  }
}

function getCategoryBreakdown(content: any[]) {
  const breakdown: Record<string, number> = {}
  content.forEach((c) => {
    breakdown[c.category] = (breakdown[c.category] || 0) + 1
  })
  return breakdown
}

function getContentTypeBreakdown(content: any[]) {
  const breakdown: Record<string, number> = {}
  content.forEach((c) => {
    breakdown[c.content_type] = (breakdown[c.content_type] || 0) + 1
  })
  return breakdown
}

function getToneBreakdown(content: any[]) {
  const breakdown: Record<string, number> = {}
  content.forEach((c) => {
    breakdown[c.tone] = (breakdown[c.tone] || 0) + 1
  })
  return breakdown
}

function getChannelBreakdown(content: any[]) {
  const breakdown: Record<string, number> = {}
  content.forEach((c) => {
    if (c.channel) {
      breakdown[c.channel] = (breakdown[c.channel] || 0) + 1
    }
  })
  return breakdown
}

function getDailyGenerationStats(content: any[], timeRange: string) {
  const days = timeRange === "all" ? 30 : Number.parseInt(timeRange.replace("d", ""))
  const dailyStats: Record<string, number> = {}

  // Initialize all days with 0
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateKey = date.toISOString().split("T")[0]
    dailyStats[dateKey] = 0
  }

  // Count content by day
  content.forEach((c) => {
    const dateKey = c.created_at.split("T")[0]
    if (dailyStats.hasOwnProperty(dateKey)) {
      dailyStats[dateKey]++
    }
  })

  return Object.entries(dailyStats)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }))
}

function getAIModelBreakdown(content: any[]) {
  const breakdown: Record<string, number> = {}
  content.forEach((c) => {
    breakdown[c.ai_model] = (breakdown[c.ai_model] || 0) + 1
  })
  return breakdown
}

function getDemoStats() {
  return {
    success: true,
    stats: {
      totalGenerated: 247,
      approved: 189,
      used: 156,
      archived: 23,
      draft: 35,
      avgPerformanceScore: 78.5,
      totalUsageCount: 423,
      categoryBreakdown: {
        campaign: 89,
        menu: 67,
        crm: 45,
        review: 23,
        profile: 15,
        in_store: 8,
      },
      contentTypeBreakdown: {
        instagram_caption: 45,
        item_description: 38,
        whatsapp_card: 32,
        email_subject: 28,
        review_reply: 23,
        poster_prompt: 18,
        about_us: 12,
        table_tent: 8,
      },
      toneBreakdown: {
        friendly: 78,
        casual: 65,
        gourmet: 43,
        professional: 32,
        quirky: 18,
        emotional: 11,
      },
      channelBreakdown: {
        instagram: 89,
        whatsapp: 67,
        email: 45,
        facebook: 23,
        sms: 15,
        print: 8,
      },
      dailyGeneration: Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (29 - i))
        return {
          date: date.toISOString().split("T")[0],
          count: Math.floor(Math.random() * 15) + 1,
        }
      }),
      topPerforming: [
        {
          id: "1",
          title: "Weekend Special Instagram Post",
          category: "campaign",
          contentType: "instagram_caption",
          performanceScore: 95,
          usageCount: 12,
        },
        {
          id: "2",
          title: "Butter Chicken Description",
          category: "menu",
          contentType: "item_description",
          performanceScore: 92,
          usageCount: 8,
        },
        {
          id: "3",
          title: "Customer Thank You Message",
          category: "crm",
          contentType: "post_visit_message",
          performanceScore: 88,
          usageCount: 15,
        },
      ],
      aiModelBreakdown: {
        "gpt-4": 156,
        "gpt-3.5-turbo": 78,
        "dall-e-3": 13,
      },
      approvalRate: 76.5,
      templateUsage: 89,
      automationGenerated: 134,
      manualGenerated: 98,
      hybridGenerated: 15,
    },
    timeRange: "30d",
    lastUpdated: new Date().toISOString(),
  }
}
