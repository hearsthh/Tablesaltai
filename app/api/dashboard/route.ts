import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getDashboardData } from "@/lib/services/dashboard-service"

const DEMO_RESTAURANT_ID = "550e8400-e29b-41d4-a716-446655440000"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId") || DEMO_RESTAURANT_ID

    const data = await getDashboardData(restaurantId)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
