import { type NextRequest, NextResponse } from "next/server"
import { MarketingAIEngine } from "@/lib/ai/marketing-ai-engine"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { restaurantType, targetAudience, budget, goals, seasonality, location } = body

    if (!restaurantType || !targetAudience || !budget || !goals || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await MarketingAIEngine.generateCampaignStrategy({
      restaurantType,
      targetAudience,
      budget: Number(budget),
      goals: Array.isArray(goals) ? goals : [goals],
      seasonality,
      location,
    })

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      strategy: result.strategy,
      campaignIdeas: result.campaignIdeas,
      contentCalendar: result.contentCalendar,
      success: true,
    })
  } catch (error) {
    console.error("Error generating marketing strategy:", error)
    return NextResponse.json({ error: "Failed to generate marketing strategy" }, { status: 500 })
  }
}
