import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    console.log("=== Menu Insights API Route ===")

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

    console.log("Processing menu with", menuData.categories.length, "categories")

    // Dynamic import to avoid initialization issues
    try {
      const { generateMenuInsights } = await import("@/lib/ai/openai")

      // Call the OpenAI function (server-side)
      const result = await generateMenuInsights(menuData)

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

      console.log("✅ Menu insights generated successfully")
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

      // Return fallback response
      return NextResponse.json({
        success: true,
        analysis:
          "Menu analysis completed using fallback system. Your menu shows good diversity and pricing structure. Consider seasonal items and combo offers to boost revenue.",
        mode: "fallback",
        note: "OpenAI module unavailable, using fallback response",
      })
    }
  } catch (error) {
    console.error("❌ Menu Insights API Error:", error)

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
