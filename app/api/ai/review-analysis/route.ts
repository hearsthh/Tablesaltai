import { type NextRequest, NextResponse } from "next/server"
import { ReviewAIEngine } from "@/lib/ai/review-ai-engine"

export async function POST(request: NextRequest) {
  try {
    const { reviews, restaurantId } = await request.json()

    if (!reviews || !Array.isArray(reviews)) {
      return NextResponse.json({ error: "Reviews array is required" }, { status: 400 })
    }

    // Generate comprehensive insights
    const insights = await ReviewAIEngine.generateInsights(reviews)

    // Generate improvement tasks based on insights
    const improvementTasks = await ReviewAIEngine.generateImprovementTasks(insights)

    // Create notifications for unresponded reviews
    const notifications = ReviewAIEngine.createNotifications(reviews)

    // Analyze sentiment trends
    const sentimentTrends = ReviewAIEngine.analyzeSentimentTrends(reviews)

    // Calculate response metrics
    const responseMetrics = ReviewAIEngine.calculateResponseMetrics(reviews)

    // In a real application, you would save this analysis to the database
    // await saveAnalysisToDatabase(restaurantId, { insights, improvementTasks, notifications })

    return NextResponse.json({
      success: true,
      data: {
        insights,
        improvementTasks,
        notifications,
        sentimentTrends,
        responseMetrics,
        analysisTimestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error in review analysis:", error)
    return NextResponse.json({ error: "Failed to analyze reviews" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId")

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID is required" }, { status: 400 })
    }

    // In a real application, you would fetch the latest analysis from the database
    // const analysis = await getLatestAnalysis(restaurantId)

    // For now, return mock data indicating no analysis available
    return NextResponse.json({
      success: true,
      data: null,
      message: "No analysis available. Run AI analysis to generate insights.",
    })
  } catch (error) {
    console.error("Error fetching review analysis:", error)
    return NextResponse.json({ error: "Failed to fetch review analysis" }, { status: 500 })
  }
}
