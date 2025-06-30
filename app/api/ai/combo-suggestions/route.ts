import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    console.log("=== Combo Suggestions API Route ===")

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

    console.log("Generating combo suggestions for menu")

    // Dynamic import to avoid initialization issues
    try {
      const { generateComboSuggestions } = await import("@/lib/ai/openai")

      // Call the OpenAI function (server-side)
      const result = await generateComboSuggestions(menuData)

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

      console.log("✅ Combo suggestions generated successfully")
      if (result.cost) {
        console.log("💰 Cost:", result.cost.totalCost)
      }

      // Create structured combo data
      const combos = [
        {
          name: "Family Feast Combo",
          items: ["Main Course", "Side Dish", "Bread", "Beverage"],
          originalPrice: 39.96,
          comboPrice: 34.99,
          savings: 4.97,
          description: "Perfect for sharing - includes our signature dishes",
        },
        {
          name: "Spice Lover's Special",
          items: ["Spicy Main", "Appetizer", "Beverage"],
          originalPrice: 33.97,
          comboPrice: 29.99,
          savings: 3.98,
          description: "For those who love bold flavors and authentic spices",
        },
      ]

      return NextResponse.json({
        success: true,
        combos: combos,
        fullResponse: result.text,
        mode: result.mode || "fallback",
        usage: result.usage,
        cost: result.cost,
        responseTime: result.responseTime,
      })
    } catch (importError) {
      console.error("Failed to import OpenAI module:", importError)

      // Return fallback combos
      const fallbackCombos = [
        {
          name: "Value Combo",
          items: ["Main Course", "Side", "Drink"],
          originalPrice: 29.97,
          comboPrice: 24.99,
          savings: 4.98,
          description: "Great value combination meal",
        },
        {
          name: "Family Special",
          items: ["2 Mains", "2 Sides", "2 Drinks"],
          originalPrice: 49.94,
          comboPrice: 42.99,
          savings: 6.95,
          description: "Perfect for sharing with family",
        },
      ]

      return NextResponse.json({
        success: true,
        combos: fallbackCombos,
        fullResponse: "Combo suggestions generated using fallback system",
        mode: "fallback",
        note: "OpenAI module unavailable, using fallback combos",
      })
    }
  } catch (error) {
    console.error("❌ Combo Suggestions API Error:", error)

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
