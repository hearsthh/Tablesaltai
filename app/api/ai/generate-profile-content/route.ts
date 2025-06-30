import { type NextRequest, NextResponse } from "next/server"
import { HybridService } from "@/lib/services/hybrid-service"

export async function POST(request: NextRequest) {
  try {
    const { restaurantName, cuisine, restaurantType, contentType } = await request.json()

    console.log("🤖 Generating AI profile content:", { restaurantName, cuisine, contentType })

    if (!restaurantName || !cuisine) {
      return NextResponse.json({ success: false, error: "Restaurant name and cuisine are required" }, { status: 400 })
    }

    const restaurantContext = `${restaurantName} is a ${cuisine} ${restaurantType || "restaurant"}`
    let prompt = ""
    let type: "description" | "marketing" = "description"

    switch (contentType) {
      case "about":
        prompt = `Write a compelling "About Us" section for ${restaurantContext}. Focus on what makes this restaurant special and appealing to customers. Keep it engaging and authentic.`
        break
      case "concept":
        prompt = `Describe the restaurant concept for ${restaurantContext}. Explain the dining philosophy, atmosphere, and what guests can expect.`
        break
      case "story":
        prompt = `Create a brand story for ${restaurantContext}. Include the inspiration behind the restaurant and what drives the team.`
        break
      case "value-proposition":
        prompt = `Create a compelling value proposition for ${restaurantContext}. What unique value do they offer to customers?`
        type = "marketing"
        break
      case "positioning":
        prompt = `Write a brand positioning statement for ${restaurantContext}. How should they position themselves in the market?`
        type = "marketing"
        break
      default:
        prompt = `Write compelling content about ${restaurantContext} that would attract customers.`
    }

    const result = await HybridService.generateAIContent(prompt, type)

    return NextResponse.json({
      success: result.success,
      content: result.content,
      provider: result.provider,
      error: result.error || null,
    })
  } catch (error) {
    console.error("AI content generation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        content: null,
        provider: "Error",
      },
      { status: 500 },
    )
  }
}
