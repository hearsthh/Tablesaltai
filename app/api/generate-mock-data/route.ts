import { type NextRequest, NextResponse } from "next/server"
import { mockGenerator } from "@/lib/mock-data/comprehensive-mock-generator"

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Starting mock data generation...")

    const body = await request.json().catch(() => ({}))
    const { restaurantCount = 10, includeMedia = true } = body

    // Generate comprehensive mock data
    const result = await mockGenerator.generateAllRestaurants(restaurantCount, includeMedia)

    return NextResponse.json({
      success: true,
      message: "Mock data generated successfully",
      data: {
        restaurantsGenerated: result.restaurants.length,
        totalMenuItems: result.totalMenuItems,
        totalCustomers: result.totalCustomers,
        totalReviews: result.totalReviews,
        totalMediaAssets: result.totalMediaAssets,
        generationTime: `${result.generationTime}ms`,
        restaurants: result.restaurants.map((r) => ({
          id: r.id,
          name: r.name,
          cuisine: r.cuisine_type,
          city: r.city,
          slug: r.slug,
        })),
      },
    })
  } catch (error) {
    console.error("❌ Mock data generation failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate mock data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Mock Data Generator API",
    description: "Generate comprehensive mock data for testing restaurant profile features",
    endpoints: {
      POST: "Generate comprehensive mock data for testing",
      parameters: {
        restaurantCount: "Number of restaurants to generate (default: 10, max: 10)",
        includeMedia: "Whether to generate media assets (default: true)",
      },
    },
    usage: {
      example: {
        method: "POST",
        body: {
          restaurantCount: 10,
          includeMedia: true,
        },
      },
    },
  })
}
