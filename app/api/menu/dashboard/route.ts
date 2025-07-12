import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId") || "550e8400-e29b-41d4-a716-446655440000"

    const menuItems = await DatabaseService.getMenuItems(restaurantId)

    return NextResponse.json(menuItems)
  } catch (error) {
    console.error("Menu items API error:", error)
    return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 })
  }
}
