import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database-service"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const campaign = await DatabaseService.updateCampaign(params.id, body)
    return NextResponse.json(campaign)
  } catch (error) {
    console.error("Error updating campaign:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update campaign" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await DatabaseService.deleteCampaign(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting campaign:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete campaign" },
      { status: 500 },
    )
  }
}
