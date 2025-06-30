import { type NextRequest, NextResponse } from "next/server"
import { generateComboSuggestions } from "@/lib/ai/openai"

export async function POST(request: NextRequest) {
  try {
    const { menuData } = await request.json()

    if (!menuData || !menuData.categories) {
      return NextResponse.json({ error: "Menu data is required" }, { status: 400 })
    }

    console.log("🍽️ Generating combo suggestions...")
    const result = await generateComboSuggestions(menuData)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      content: result.text,
      mode: result.mode,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Combo generation error:", error)
    return NextResponse.json({ error: "Failed to generate combos" }, { status: 500 })
  }
}
