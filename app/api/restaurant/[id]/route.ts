import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database-service"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const restaurant = await DatabaseService.updateRestaurant(params.id, body)
    return NextResponse.json(restaurant)
  } catch (error) {
    console.error("Error updating restaurant:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update restaurant" },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const restaurant = await DatabaseService.getRestaurantById(params.id)

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    return NextResponse.json(restaurant)
  } catch (error) {
    console.error("Error fetching restaurant:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch restaurant" },
      { status: 500 },
    )
  }
}
