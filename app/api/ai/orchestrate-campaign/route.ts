import { type NextRequest, NextResponse } from "next/server"
import { AIOrchestrator } from "@/lib/ai/ai-orchestrator"
import { serverAuthService } from "@/lib/auth/auth-service"

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { user, error: authError } = await serverAuthService.getCurrentUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { campaignType, target, restaurantContext, customerSegment } = await request.json()

    if (!campaignType || !target || !restaurantContext) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const { campaign, error } = await AIOrchestrator.generateCompleteCampaign({
      campaignType,
      target,
      restaurantContext,
      customerSegment: customerSegment || [],
    })

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ campaign })
  } catch (error) {
    console.error("Campaign orchestration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
