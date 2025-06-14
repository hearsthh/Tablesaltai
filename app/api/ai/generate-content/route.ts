import { type NextRequest, NextResponse } from "next/server"
import { generateMarketingContent } from "@/lib/ai/openai"
import { serverAuthService } from "@/lib/auth/auth-service"

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { user, error: authError } = await serverAuthService.getCurrentUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, topic, tone, keywords, length, audience } = await request.json()

    if (!type || !topic) {
      return NextResponse.json({ error: "Type and topic are required" }, { status: 400 })
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
