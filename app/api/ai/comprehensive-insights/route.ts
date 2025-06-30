import { NextResponse } from "next/server"
import { generateMenuInsights, type MenuInsightData } from "@/lib/ai/menu-insights-engine"

export async function POST(request: Request) {
  try {
    console.log("=== Comprehensive Menu Insights API ===")

    const body = await request.json()
    const {
      menuData,
      salesData,
      customerProfile,
      locationData,
      seasonalData,
      competitorData,
      trendsData,
      restaurantId,
    } = body

    if (!menuData || !menuData.categories) {
      return NextResponse.json(
        {
          success: false,
          error: "Menu data is required",
        },
        { status: 400 },
      )
    }

    console.log("Processing comprehensive insights for restaurant:", restaurantId)
    console.log("Data sources available:", {
      menu: !!menuData,
      sales: !!salesData,
      customer: !!customerProfile,
      location: !!locationData,
      seasonal: !!seasonalData,
      competitor: !!competitorData,
      trends: !!trendsData,
    })

    const insightData: MenuInsightData = {
      restaurantId: restaurantId || "demo",
      menuData,
      salesData,
      customerProfile,
      locationData,
      seasonalData,
      competitorData,
      trendsData,
    }

    const insights = await generateMenuInsights(insightData)

    console.log(`✅ Generated ${insights.length} comprehensive insights`)

    return NextResponse.json({
      success: true,
      insights,
      summary: {
        totalInsights: insights.length,
        highImpact: insights.filter((i) => i.impact === "high").length,
        mediumImpact: insights.filter((i) => i.impact === "medium").length,
        lowImpact: insights.filter((i) => i.impact === "low").length,
        estimatedTotalRevenue: insights.reduce((sum, i) => sum + i.estimatedRevenue, 0),
        categories: {
          pricing: insights.filter((i) => i.type === "pricing").length,
          menuOptimization: insights.filter((i) => i.type === "menu-optimization").length,
          promotion: insights.filter((i) => i.type === "promotion").length,
        },
      },
    })
  } catch (error) {
    console.error("❌ Comprehensive Insights API Error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
