import { type NextRequest, NextResponse } from "next/server"
import { profileAnalyticsService } from "@/lib/services/profile-analytics-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId")
    const useMockData = searchParams.get("mock") === "true"

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID is required" }, { status: 400 })
    }

    let analytics
    let progress

    if (useMockData) {
      // Use mock data for demonstration
      analytics = await profileAnalyticsService.getMockAnalytics()
      progress = profileAnalyticsService.calculateModuleProgress(analytics)
    } else {
      try {
        // Try to get real analytics
        analytics = await profileAnalyticsService.getCompleteAnalytics(restaurantId)
        progress = profileAnalyticsService.calculateModuleProgress(analytics)
      } catch (error) {
        console.error("Failed to get real analytics, falling back to mock data:", error)
        // Fallback to mock data if real data fails
        analytics = await profileAnalyticsService.getMockAnalytics()
        progress = profileAnalyticsService.calculateModuleProgress(analytics)
      }
    }

    return NextResponse.json({
      success: true,
      analytics,
      progress,
      timestamp: new Date().toISOString(),
      dataSource: useMockData ? "mock" : "database",
    })
  } catch (error) {
    console.error("Error fetching profile analytics:", error)

    // Return mock data as ultimate fallback
    try {
      const analytics = await profileAnalyticsService.getMockAnalytics()
      const progress = profileAnalyticsService.calculateModuleProgress(analytics)

      return NextResponse.json({
        success: true,
        analytics,
        progress,
        timestamp: new Date().toISOString(),
        dataSource: "fallback",
        error: "Database unavailable, showing demo data",
      })
    } catch (fallbackError) {
      return NextResponse.json(
        {
          error: "Failed to fetch analytics",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  }
}
