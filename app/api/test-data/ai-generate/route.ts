import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { restaurantId, contentType } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "OpenAI API key not configured",
      })
    }

    let prompt = ""

    switch (contentType) {
      case "menu_description":
        prompt = "Write an appetizing description for Butter Chicken at an Indian restaurant. Keep it under 50 words."
        break
      case "social_post":
        prompt =
          "Write a social media post for an Indian restaurant promoting their weekend special. Include emojis and keep it engaging."
        break
      case "review_response":
        prompt =
          "Write a professional response to a customer review that mentioned slow service but praised the food quality."
        break
      case "marketing_copy":
        prompt =
          "Write marketing copy for a Diwali festival menu at an Indian restaurant. Make it festive and appetizing."
        break
      default:
        prompt = "Write a brief description of authentic Indian cuisine."
    }

    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt,
      maxTokens: 150,
    })

    return NextResponse.json({
      success: true,
      content: text,
      contentType,
    })
  } catch (error) {
    console.error("AI generation error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to generate AI content",
      details: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
