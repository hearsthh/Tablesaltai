import { type NextRequest, NextResponse } from "next/server"
import { SentimentAnalysisService } from "@/lib/ai/sentiment-analysis-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, context, type = "review" } = body

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Analyze sentiment
    const sentiment = await SentimentAnalysisService.analyzeSentiment(text, context)

    return NextResponse.json({
      success: true,
      sentiment,
    })
  } catch (error) {
    console.error("Error in sentiment analysis API:", error)
    return NextResponse.json(
      { error: "Failed to analyze sentiment", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

// Batch sentiment analysis endpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { texts, restaurantId } = body

    if (!texts || !Array.isArray(texts)) {
      return NextResponse.json({ error: "Texts array is required" }, { status: 400 })
    }

    let result

    if (restaurantId) {
      // Update stored sentiments for restaurant
      result = await SentimentAnalysisService.updateReviewSentiments(restaurantId)
    } else {
      // Batch analyze provided texts
      result = await SentimentAnalysisService.batchAnalyzeSentiment(texts)
    }

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error) {
    console.error("Error in batch sentiment analysis API:", error)
    return NextResponse.json(
      { error: "Failed to analyze sentiments", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

// Get sentiment trends endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId")
    const days = Number.parseInt(searchParams.get("days") || "30")

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID is required" }, { status: 400 })
    }

    const trends = await SentimentAnalysisService.getSentimentTrends(restaurantId, days)

    return NextResponse.json({
      success: true,
      trends,
    })
  } catch (error) {
    console.error("Error getting sentiment trends:", error)
    return NextResponse.json(
      { error: "Failed to get sentiment trends", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
