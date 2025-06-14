import { type NextRequest, NextResponse } from "next/server"
import { generateMarketingContent } from "@/lib/ai/openai"

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "OpenAI API key not configured. Please add OPENAI_API_KEY environment variable.",
          content: null,
        },
        { status: 503 },
      )
    }

    const { type, topic, tone, keywords, length, audience } = await request.json()

    if (!type || !topic) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const { text, error } = await generateMarketingContent({
      type,
      topic,
      tone: tone || "professional",
      keywords: keywords || [],
      length: length || "medium",
      audience: audience || "general",
    })

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ content: text })
  } catch (error) {
    console.error("Content generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
