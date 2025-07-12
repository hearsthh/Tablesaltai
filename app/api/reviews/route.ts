import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId") || "550e8400-e29b-41d4-a716-446655440000"

    const reviews = await DatabaseService.getReviews(restaurantId)

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { restaurantId, customerName, rating, title, content } = body

    if (!restaurantId || !customerName || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const reviewData = {
      restaurantId,
      customerName,
      customerEmail: body.customerEmail || null,
      rating: Number(rating),
      title: title || "",
      content: content || "",
      isVerified: false,
      isPublished: true,
      source: "website",
      sourceId: null,
      helpfulCount: 0,
      response: null,
      respondedAt: null,
    }

    const review = await DatabaseService.createReview(reviewData)

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
