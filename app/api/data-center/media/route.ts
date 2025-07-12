import { type NextRequest, NextResponse } from "next/server"
import { DataCenterService } from "@/lib/services/data-center-service"
import { AIContentGenerator } from "@/lib/services/ai-content-generator"

const dataCenterService = new DataCenterService()
const aiGenerator = new AIContentGenerator()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const restaurantId = formData.get("restaurantId") as string
    const autoTag = formData.get("autoTag") === "true"

    if (!file || !restaurantId) {
      return NextResponse.json({ error: "File and restaurant ID required" }, { status: 400 })
    }

    // Basic metadata
    let metadata = {
      restaurantId,
      type: file.type.startsWith("image/") ? "image" : "video",
      category: "food", // default
      uploadedBy: "user", // TODO: get from auth
    }

    // AI auto-tagging if requested
    if (autoTag && file.type.startsWith("image/")) {
      try {
        // Convert file to URL for AI analysis (in production, upload first)
        const aiAnalysis = await aiGenerator.categorizeMediaAsset("temp-url", {
          restaurantId,
          fileName: file.name,
        })

        metadata = {
          ...metadata,
          category: aiAnalysis.category,
          subcategory: aiAnalysis.subcategory,
          title: aiAnalysis.title,
          description: aiAnalysis.description,
          tags: aiAnalysis.tags,
        }
      } catch (aiError) {
        console.warn("AI tagging failed, using defaults:", aiError)
      }
    }

    const mediaAsset = await dataCenterService.uploadMediaAsset(file, metadata)

    return NextResponse.json({
      success: true,
      data: mediaAsset,
      aiTagged: autoTag,
    })
  } catch (error) {
    console.error("Error uploading media:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload media" },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId")
    const category = searchParams.get("category")
    const type = searchParams.get("type") as "image" | "video"
    const isFeatured = searchParams.get("featured") === "true"

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID required" }, { status: 400 })
    }

    const filters = {
      ...(category && { category }),
      ...(type && { type }),
      ...(isFeatured !== undefined && { isFeatured }),
    }

    const mediaAssets = await dataCenterService.getMediaAssets(restaurantId, filters)

    return NextResponse.json({ success: true, data: mediaAssets })
  } catch (error) {
    console.error("Error fetching media assets:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch media assets" },
      { status: 500 },
    )
  }
}
