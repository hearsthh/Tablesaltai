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

    const categories = await DatabaseService.getMenuCategoriesByRestaurantId(restaurant.id)
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching menu categories:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch menu categories" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const category = await DatabaseService.createMenuCategory(body)
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating menu category:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create menu category" },
      { status: 500 },
    )
  }
}
