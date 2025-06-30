import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    console.log("=== Brand Insights API Route ===")

    // Parse request body safely
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON in request body",
          mode: "error",
        },
        { status: 400 },
      )
    }

    const { menuData } = body

    if (!menuData || !menuData.categories) {
      console.error("Invalid menu data provided")
      return NextResponse.json(
        {
          success: false,
          error: "Menu data is required and must include categories",
          mode: "error",
        },
        { status: 400 },
      )
    }

    console.log("Generating brand insights for restaurant")

    // Dynamic import to avoid initialization issues
    try {
      const { generateBrandInsights } = await import("@/lib/ai/openai")

      // Call the OpenAI function (server-side)
      const result = await generateBrandInsights(menuData)

      if (result.error) {
        console.error("OpenAI Error:", result.error)
        return NextResponse.json(
          {
            success: false,
            error: result.error,
            mode: "error",
          },
          { status: 500 },
        )
      }

      console.log("✅ Brand insights generated successfully")
      if (result.cost) {
        console.log("💰 Cost:", result.cost.totalCost)
      }

      return NextResponse.json({
        success: true,
        analysis: result.text,
        mode: result.mode || "fallback",
        usage: result.usage,
        cost: result.cost,
        responseTime: result.responseTime,
      })
    } catch (importError) {
      console.error("Failed to import OpenAI module:", importError)

      // Return fallback brand insights
      const fallbackAnalysis = `Brand Analysis (Fallback Mode):

**Target Market**: Your menu suggests a focus on quality dining with diverse options
**Price Positioning**: Mid-range pricing appeals to value-conscious customers
**Visual Identity Recommendations**: 
- Use warm, inviting colors
- Highlight food quality in imagery
- Modern, clean design aesthetic

**Marketing Strategy**:
- Emphasize fresh ingredients and quality
- Showcase signature dishes
- Target families and food enthusiasts
- Use social media for visual marketing

**Competitive Advantages**:
- Diverse menu options
- Balanced pricing strategy
- Good variety for different dietary preferences`

      return NextResponse.json({
        success: true,
        analysis: fallbackAnalysis,
        mode: "fallback",
        note: "OpenAI module unavailable, using fallback brand analysis",
      })
    }
  } catch (error) {
    console.error("❌ Brand Insights API Error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        mode: "error",
      },
      { status: 500 },
    )
  }
}
