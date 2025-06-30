import { type NextRequest, NextResponse } from "next/server"
import { PlatformManager } from "@/lib/integrations/platform-manager"

export async function POST(request: NextRequest) {
  try {
    const credentials = await request.json()

    const platformManager = new PlatformManager(credentials)
    const reviews = await platformManager.aggregateReviews()

    return NextResponse.json({
      success: true,
      reviews,
    })
  } catch (error) {
    console.error("Failed to fetch reviews:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 })
  }
}
