import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error: "Image generation not configured. Please install Fal integration first.",
    },
    { status: 503 },
  )
}
