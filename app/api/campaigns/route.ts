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

    const campaigns = await DatabaseService.getCampaignsByRestaurantId(restaurant.id)
    return NextResponse.json(campaigns)
  } catch (error) {
    console.error("Error fetching campaigns:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch campaigns" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const campaign = await DatabaseService.createCampaign(body)
    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    console.error("Error creating campaign:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create campaign" },
      { status: 500 },
    )
  }
}
