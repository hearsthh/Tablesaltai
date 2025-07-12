import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { AIContentGenerator } from "@/lib/services/ai-content-generator"
import type { RestaurantData } from "@/lib/types/restaurant-data"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const aiGenerator = new AIContentGenerator()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { restaurantData, section, autoFill = false } = body

    // Calculate completion status
    const completionStatus = calculateCompletionStatus(restaurantData)

    // AI auto-fill if requested
    let processedData = restaurantData
    if (autoFill) {
      processedData = await enhanceWithAI(restaurantData, section)
    }

    // Add metadata
    const finalData = {
      ...processedData,
      completionStatus,
      updatedAt: new Date().toISOString(),
      createdAt: restaurantData.createdAt || new Date().toISOString(),
    }

    // Save to database
    const { data, error } = await supabase
      .from("restaurant_data")
      .upsert(finalData, { onConflict: "id" })
      .select()
      .single()

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      data,
      completionStatus,
      aiEnhanced: autoFill,
    })
  } catch (error) {
    console.error("Error saving restaurant data:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save restaurant data" },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("id")
    const userId = searchParams.get("userId")

    let query = supabase.from("restaurant_data").select("*")

    if (restaurantId) {
      query = query.eq("id", restaurantId)
    } else if (userId) {
      query = query.eq("userId", userId)
    } else {
      return NextResponse.json({ error: "Restaurant ID or User ID required" }, { status: 400 })
    }

    const { data, error } = await query.single()

    if (error && error.code !== "PGRST116") {
      throw new Error(`Database error: ${error.message}`)
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error fetching restaurant data:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch restaurant data" },
      { status: 500 },
    )
  }
}

function calculateCompletionStatus(data: Partial<RestaurantData>) {
  const sections = {
    registration: !!(data.registration?.emailId && data.registration?.mobileNo),
    identification: !!(
      data.identification?.restaurantName &&
      data.identification?.address &&
      data.identification?.location
    ),
    info: !!(data.info?.priceRange && data.info?.cuisines?.length && data.info?.type && data.info?.timings),
    brandAssets: !!(data.brandAssets?.brandVoice && data.brandAssets?.positioning),
    moreInfo: !!data.moreInfo?.conceptDescription,
  }

  const completedSections = Object.values(sections).filter(Boolean).length
  const totalSections = Object.keys(sections).length
  const overall = Math.round((completedSections / totalSections) * 100)

  return {
    ...sections,
    overall,
  }
}

async function enhanceWithAI(data: Partial<RestaurantData>, section: string) {
  try {
    switch (section) {
      case "identification":
        if (data.identification?.restaurantName && !data.moreInfo?.conceptDescription) {
          const aiEnhancement = await aiGenerator.generateRestaurantInfo({
            restaurantName: data.identification.restaurantName,
            existingData: data,
          })

          return {
            ...data,
            moreInfo: {
              ...data.moreInfo,
              conceptDescription: aiEnhancement.conceptDescription,
              highlights: aiEnhancement.highlights,
            },
            brandAssets: {
              ...data.brandAssets,
              brandVoice: data.brandAssets?.brandVoice || aiEnhancement.brandVoice,
              positioning: data.brandAssets?.positioning || aiEnhancement.positioning,
            },
          }
        }
        break

      case "info":
        if (data.info?.cuisines?.length && !data.moreInfo?.highlights?.length) {
          const highlights = await aiGenerator.generateHighlights({
            cuisines: data.info.cuisines,
            restaurantName: data.identification?.restaurantName,
          })

          return {
            ...data,
            moreInfo: {
              ...data.moreInfo,
              highlights: highlights,
            },
          }
        }
        break

      default:
        return data
    }

    return data
  } catch (error) {
    console.error("AI enhancement error:", error)
    return data
  }
}
