import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database-service"

const DEMO_USER_ID = "demo-user-123"

export async function GET(request: NextRequest) {
  try {
    // Get restaurant first
    const restaurant = await DatabaseService.getRestaurantByUserId(DEMO_USER_ID)

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    const days = Number.parseInt(request.nextUrl.searchParams.get("days") || "30")
    const analytics = await DatabaseService.getAnalyticsByRestaurantId(restaurant.id, days)
    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch analytics" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const analytics = await DatabaseService.createOrUpdateAnalytics(body)
    return NextResponse.json(analytics, { status: 201 })
  } catch (error) {
    console.error("Error creating analytics:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create analytics" },
      { status: 500 },
    )
  }
}
