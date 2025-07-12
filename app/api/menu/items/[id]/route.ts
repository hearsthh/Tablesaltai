import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database-service"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const item = await DatabaseService.updateMenuItem(params.id, body)
    return NextResponse.json(item)
  } catch (error) {
    console.error("Error updating menu item:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update menu item" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await DatabaseService.deleteMenuItem(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting menu item:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete menu item" },
      { status: 500 },
    )
  }
}
