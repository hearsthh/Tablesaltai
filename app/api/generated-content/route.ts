import { type NextRequest, NextResponse } from "next/server"

// Simple in-memory storage for now (in production, this would be a database)
let contentStorage: any[] = []

// GET - Fetch all generated content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contentType = searchParams.get("type")
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    let filteredContent = [...contentStorage]

    if (contentType) {
      filteredContent = filteredContent.filter((item) => item.content_type === contentType)
    }

    if (status) {
      filteredContent = filteredContent.filter((item) => item.status === status)
    }

    // Sort by created_at descending and limit
    filteredContent = filteredContent
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)

    console.log(`📋 Fetched ${filteredContent.length} content items`)
    return NextResponse.json({ content: filteredContent })
  } catch (error) {
    console.error("Generated content fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

// POST - Save new generated content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("📥 Received save request:", body)

    const { contentType, title, contentData, metadata, aiMode, generationCost, tokensUsed, restaurantId } = body

    // Validate required fields
    if (!contentType || !title || !contentData) {
      console.error("❌ Missing required fields:", { contentType, title, contentData })
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["contentType", "title", "contentData"],
        },
        { status: 400 },
      )
    }

    // Generate a simple ID
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)

    // Create content item
    const contentItem = {
      id,
      content_type: String(contentType),
      title: String(title),
      content_data: String(contentData),
      metadata: metadata || {},
      ai_mode: String(aiMode || "openai"),
      generation_cost: Number(generationCost || 0),
      tokens_used: Number(tokensUsed || 0),
      restaurant_id: String(restaurantId || "default"),
      status: "generated",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Store in memory
    contentStorage.push(contentItem)

    console.log("✅ Content saved successfully:", contentItem.id)
    console.log(`📊 Total stored items: ${contentStorage.length}`)

    return NextResponse.json({ success: true, content: contentItem })
  } catch (error) {
    console.error("❌ Generated content save error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// DELETE - Clear all content (for testing)
export async function DELETE() {
  try {
    const count = contentStorage.length
    contentStorage = []
    console.log(`🗑️ Cleared ${count} content items`)
    return NextResponse.json({ success: true, cleared: count })
  } catch (error) {
    console.error("❌ Clear content error:", error)
    return NextResponse.json({ error: "Failed to clear content" }, { status: 500 })
  }
}
