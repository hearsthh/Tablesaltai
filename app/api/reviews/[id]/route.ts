import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database-service"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const review = await DatabaseService.updateReview(params.id, body)
    return NextResponse.json(review)
  } catch (error) {
    console.error("Error updating review:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update review" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await DatabaseService.deleteReview(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete review" },
      { status: 500 },
    )
  }
}
