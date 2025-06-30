import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, this would fetch from your reviews database
    // For now, return mock data that matches the expected structure
    const reviewSummary = {
      aggregatedRating: 4.7,
      totalReviews: 892,
      reviewSummary:
        "Customers consistently praise Spice Garden for its authentic Indian flavors, excellent service, and cozy atmosphere. Recent reviews highlight the improved menu variety and faster service.",
      topPositives: [
        "Authentic and flavorful Indian cuisine",
        "Excellent customer service and friendly staff",
        "Cozy and welcoming atmosphere",
        "Fresh ingredients and quality preparation",
        "Great value for money",
      ],
      useCaseHighlights: [
        { useCase: "Family Dinners", percentage: 38, description: "Perfect for family gatherings with kids menu" },
        { useCase: "Date Nights", percentage: 31, description: "Romantic atmosphere with candlelit tables" },
        { useCase: "Business Lunches", percentage: 22, description: "Professional setting with quick service" },
      ],
      platformRatings: {
        google: { rating: 4.8, reviews: 356 },
        yelp: { rating: 4.6, reviews: 234 },
        tripadvisor: { rating: 4.7, reviews: 178 },
        zomato: { rating: 4.5, reviews: 124 },
      },
      recentReviews: [
        {
          id: 1,
          author: "Sarah M.",
          rating: 5,
          text: "Amazing butter chicken and excellent service!",
          date: "2024-01-10",
          platform: "google",
        },
        {
          id: 2,
          author: "Mike R.",
          rating: 4,
          text: "Great atmosphere for date night. Food was delicious.",
          date: "2024-01-08",
          platform: "yelp",
        },
      ],
      sentimentAnalysis: {
        positive: 78,
        neutral: 18,
        negative: 4,
      },
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(reviewSummary)
  } catch (error) {
    console.error("Error fetching review summary:", error)
    return NextResponse.json({ error: "Failed to fetch review summary" }, { status: 500 })
  }
}
