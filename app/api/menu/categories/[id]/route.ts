import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database-service"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const category = await DatabaseService.updateMenuCategory(params.id, body)
    return NextResponse.json(category)
  } catch (error) {
    console.error("Error updating menu category:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update menu category" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await DatabaseService.deleteMenuCategory(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting menu category:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete menu category" },
      { status: 500 },
    )
  }
}
