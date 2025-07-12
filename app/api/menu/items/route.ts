import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const item = await DatabaseService.createMenuItem(body)
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error("Error creating menu item:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create menu item" },
      { status: 500 },
    )
  }
}
