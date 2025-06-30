import { type NextRequest, NextResponse } from "next/server"
import { ReviewAIEngine } from "@/lib/ai/review-ai-engine"

export async function POST(request: NextRequest) {
  try {
    const { reviewText, rating, restaurantName, responseGuidelines, customerName, platform, reviewId } =
      await request.json()

    if (!reviewText || !rating || !restaurantName) {
      return NextResponse.json({ error: "Review text, rating, and restaurant name are required" }, { status: 400 })
    }

    // Generate AI response
    const aiResponse = await ReviewAIEngine.generateResponse(
      reviewText,
      rating,
      restaurantName,
      responseGuidelines || "Respond professionally and warmly to customer reviews.",
      customerName,
      platform,
    )

    // Analyze the review for additional context
    const analysis = await ReviewAIEngine.analyzeReview(reviewText, rating, platform)

    // In a real application, you would save the response to the database
    // await saveResponseToDatabase(reviewId, aiResponse, analysis)

    return NextResponse.json({
      success: true,
      data: {
        response: aiResponse,
        analysis,
        generatedAt: new Date().toISOString(),
        reviewId,
      },
    })
  } catch (error) {
    console.error("Error generating review response:", error)
    return NextResponse.json({ error: "Failed to generate review response" }, { status: 500 })
  }
}

// Endpoint to get suggested responses for multiple reviews
export async function PUT(request: NextRequest) {
  try {
    const { reviews, restaurantName, responseGuidelines } = await request.json()

    if (!reviews || !Array.isArray(reviews) || !restaurantName) {
      return NextResponse.json({ error: "Reviews array and restaurant name are required" }, { status: 400 })
    }

    // Generate responses for all reviews
    const responses = await Promise.all(
      reviews.map(async (review) => {
        try {
          const aiResponse = await ReviewAIEngine.generateResponse(
            review.text,
            review.rating,
            restaurantName,
            responseGuidelines || "Respond professionally and warmly to customer reviews.",
            review.author,
            review.platform,
          )

          const analysis = await ReviewAIEngine.analyzeReview(review.text, review.rating, review.platform)

          return {
            reviewId: review.id,
            response: aiResponse,
            analysis,
            success: true,
          }
        } catch (error) {
          console.error(`Error generating response for review ${review.id}:`, error)
          return {
            reviewId: review.id,
            response: null,
            analysis: null,
            success: false,
            error: "Failed to generate response",
          }
        }
      }),
    )

    return NextResponse.json({
      success: true,
      data: {
        responses,
        generatedAt: new Date().toISOString(),
        totalProcessed: reviews.length,
        successCount: responses.filter((r) => r.success).length,
      },
    })
  } catch (error) {
    console.error("Error generating bulk review responses:", error)
    return NextResponse.json({ error: "Failed to generate review responses" }, { status: 500 })
  }
}
