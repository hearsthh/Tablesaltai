import { type NextRequest, NextResponse } from "next/server"
import { generateImage } from "@/lib/ai/fal"
import { serverAuthService } from "@/lib/auth/auth-service"

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { user, error: authError } = await serverAuthService.getCurrentUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { prompt, width, height, style } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const { imageUrl, error } = await generateImage(prompt, {
      width: width || 1024,
      height: height || 1024,
      style: style || "photographic",
    })

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Image generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
