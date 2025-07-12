import { type NextRequest, NextResponse } from "next/server"
import { DataCenterService } from "@/lib/services/data-center-service"
import { AIContentGenerator } from "@/lib/services/ai-content-generator"

const dataCenterService = new DataCenterService()
const aiGenerator = new AIContentGenerator()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { restaurantId, menuData, enhanceWithAI = false } = body

    let processedMenuData = menuData

    // AI enhancement for menu items
    if (enhanceWithAI && menuData.items) {
      const enhancedItems = await Promise.all(
        menuData.items.map(async (item: any) => {
          try {
            const aiEnhancement = await aiGenerator.enhanceMenuItem(item)
            return {
              ...item,
              aiGeneratedDescription: aiEnhancement.enhancedDescription,
              aiGeneratedTags: aiEnhancement.aiGeneratedTags,
              dietaryTags: [...(item.dietaryTags || []), ...aiEnhancement.dietaryTags],
              ingredients: item.ingredients || aiEnhancement.suggestedIngredients,
            }
          } catch (error) {
            console.warn("AI enhancement failed for item:", item.name, error)
            return item
          }
        }),
      )

      processedMenuData = {
        ...menuData,
        items: enhancedItems,
      }
    }

    await dataCenterService.syncMenuData(restaurantId, processedMenuData)

    return NextResponse.json({
      success: true,
      message: "Menu data synced successfully",
      aiEnhanced: enhanceWithAI,
    })
  } catch (error) {
    console.error("Error syncing menu data:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to sync menu data" },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId")
    const includeAnalytics = searchParams.get("analytics") === "true"

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID required" }, { status: 400 })
    }

    const restaurant = await dataCenterService.getRestaurant(restaurantId)

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    let response = {
      success: true,
      data: restaurant.menuData,
    }

    if (includeAnalytics) {
      const analytics = await dataCenterService.getMenuAnalytics(restaurantId)
      response = {
        ...response,
        analytics,
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching menu data:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch menu data" },
      { status: 500 },
    )
  }
}
