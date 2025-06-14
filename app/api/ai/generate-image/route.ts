import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error: "Image generation temporarily disabled",
    },
    { status: 503 },
  )
}
