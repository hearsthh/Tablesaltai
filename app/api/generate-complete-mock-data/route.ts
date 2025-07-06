import { type NextRequest, NextResponse } from "next/server"
import { completeRestaurantGenerator } from "@/lib/mock-data/complete-restaurant-generator"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { restaurantCount = 10, includeMedia = true } = body

    console.log(`🚀 Starting complete mock data generation for ${restaurantCount} restaurants...`)

    const result = await completeRestaurantGenerator.generateCompleteRestaurantData(restaurantCount)

    return NextResponse.json({
      success: true,
      message: "Complete mock data generated successfully",
      data: {
        restaurants: result.restaurants.length,
        totalStats: result.totalStats,
        generationTime: `${result.generationTime}ms`,
        breakdown: {
          restaurantsGenerated: result.restaurants.length,
          menuItemsCreated: result.totalStats.menuItems,
          customersGenerated: result.totalStats.customers,
          reviewsCreated: result.totalStats.reviews,
          awardsCreated: result.totalStats.awards,
          mediaAssetsCreated: result.totalStats.mediaAssets,
          salesRecordsCreated: result.totalStats.salesRecords,
        },
      },
    })
  } catch (error) {
    console.error("❌ Error generating complete mock data:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate complete mock data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Complete Mock Data Generator API",
    endpoints: {
      POST: "Generate complete restaurant data with all profile fields",
      parameters: {
        restaurantCount: "Number of restaurants to generate (default: 10)",
        includeMedia: "Include media assets generation (default: true)",
      },
    },
  })
}
