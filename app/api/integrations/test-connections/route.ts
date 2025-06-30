import { type NextRequest, NextResponse } from "next/server"
import { PlatformManager } from "@/lib/integrations/platform-manager"

export async function POST(request: NextRequest) {
  try {
    const credentials = await request.json()

    const platformManager = new PlatformManager(credentials)
    const results = await platformManager.testConnections()

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error) {
    console.error("Failed to test platform connections:", error)
    return NextResponse.json({ success: false, error: "Failed to test connections" }, { status: 500 })
  }
}
