import { type NextRequest, NextResponse } from "next/server"
import { DataCenterService } from "@/lib/services/data-center-service"
import { AIContentGenerator } from "@/lib/services/ai-content-generator"

const dataCenterService = new DataCenterService()
const aiGenerator = new AIContentGenerator()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { restaurantData, autoFill = false } = body

    let processedData = restaurantData

    // AI auto-fill if requested
    if (autoFill && (restaurantData.description || restaurantData.website)) {
      const aiEnhancements = await aiGenerator.generateRestaurantInfo({
        description: restaurantData.description,
        website: restaurantData.website,
        existingData: restaurantData,
      })

      processedData = {
        ...restaurantData,
        tagline: restaurantData.tagline || aiEnhancements.tagline,
        details: {
          ...restaurantData.details,
          story: restaurantData.details?.story || aiEnhancements.story,
          mission: restaurantData.details?.mission || aiEnhancements.mission,
          values: restaurantData.details?.values || aiEnhancements.values,
          specialties: restaurantData.details?.specialties || aiEnhancements.specialties,
        },
        basicInfo: {
          ...restaurantData.basicInfo,
          cuisineType: restaurantData.basicInfo?.cuisineType || aiEnhancements.cuisineTypes,
          restaurantType: restaurantData.basicInfo?.restaurantType || aiEnhancements.restaurantType,
          priceRange: restaurantData.basicInfo?.priceRange || aiEnhancements.priceRange,
        },
      }
    }

    const restaurant = await dataCenterService.createRestaurant(processedData)

    return NextResponse.json({
      success: true,
      data: restaurant,
      aiEnhanced: autoFill,
    })
  } catch (error) {
    console.error("Error creating restaurant:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create restaurant" },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("id")

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID required" }, { status: 400 })
    }

    const restaurant = await dataCenterService.getRestaurant(restaurantId)

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: restaurant })
  } catch (error) {
    console.error("Error fetching restaurant:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch restaurant" },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { restaurantId, updates, autoFill = false } = body

    let processedUpdates = updates

    // AI enhancement for updates if requested
    if (autoFill && updates.description) {
      const aiEnhancements = await aiGenerator.generateRestaurantInfo({
        description: updates.description,
        existingData: updates,
      })

      processedUpdates = {
        ...updates,
        ...aiEnhancements,
      }
    }

    const restaurant = await dataCenterService.updateRestaurant(restaurantId, processedUpdates)

    return NextResponse.json({
      success: true,
      data: restaurant,
      aiEnhanced: autoFill,
    })
  } catch (error) {
    console.error("Error updating restaurant:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update restaurant" },
      { status: 500 },
    )
  }
}
