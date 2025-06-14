import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json(
      {
        error: "Image generation temporarily disabled for deployment",
      },
      { status: 503 },
    )
  } catch (error) {
    console.error("Image generation error:", error)
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 })
  }
}
