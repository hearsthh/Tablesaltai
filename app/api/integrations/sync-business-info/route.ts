import { type NextRequest, NextResponse } from "next/server"
import { PlatformManager } from "@/lib/integrations/platform-manager"

export async function POST(request: NextRequest) {
  try {
    const { credentials, businessInfo } = await request.json()

    const platformManager = new PlatformManager(credentials)
    const results = await platformManager.syncBusinessInfo(businessInfo)

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error) {
    console.error("Failed to sync business info:", error)
    return NextResponse.json({ success: false, error: "Failed to sync business information" }, { status: 500 })
  }
}
