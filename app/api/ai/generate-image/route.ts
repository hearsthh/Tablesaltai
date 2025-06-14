import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, options } = await request.json()

    // Temporarily disabled - return placeholder response
    return NextResponse.json({
      success: false,
      error: "Image generation temporarily disabled. Please configure Fal AI properly.",
      imageUrl: null,
    })
  } catch (error) {
    console.error("Image generation error:", error)
    return NextResponse.json({ success: false, error: "Image generation failed" }, { status: 500 })
  }
}
