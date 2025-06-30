import { type NextRequest, NextResponse } from "next/server"
import { HybridService } from "@/lib/services/hybrid-service"

export async function POST(request: NextRequest) {
  try {
    const profileData = await request.json()

    console.log("🔄 Saving restaurant profile via API:", Object.keys(profileData))

    // Validate required fields
    if (!profileData.basicInfo?.restaurantName) {
      return NextResponse.json({ success: false, error: "Restaurant name is required" }, { status: 400 })
    }

    // Save using hybrid service (real APIs + mock database)
    const result = await HybridService.saveRestaurantProfile(profileData)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Profile saved successfully",
        profileId: result.profileId || "mock-profile-id",
      })
    } else {
      throw new Error(result.error || "Save failed")
    }
  } catch (error) {
    console.error("Profile save error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "mock-user-id"

    console.log("📖 Loading restaurant profile via API for user:", userId)

    const result = await HybridService.getRestaurantProfile(userId)

    if (result.success) {
      return NextResponse.json({
        success: true,
        profile: result.profile,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Profile not found",
        },
        { status: 404 },
      )
    }
  } catch (error) {
    console.error("Profile load error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
