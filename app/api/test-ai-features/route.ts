import { type NextRequest, NextResponse } from "next/server"
import { aiTester } from "@/lib/ai/comprehensive-ai-tester"

export async function POST(request: NextRequest) {
  try {
    console.log("🧪 Starting comprehensive AI feature testing...")

    const body = await request.json().catch(() => ({}))
    const { restaurantId, testSuite = "all" } = body

    let results

    switch (testSuite) {
      case "menu":
        results = { menuAnalysis: await aiTester.testMenuAnalysis(restaurantId) }
        break
      case "reviews":
        results = { reviewAnalysis: await aiTester.testReviewAnalysis(restaurantId) }
        break
      case "customers":
        results = { customerInsights: await aiTester.testCustomerInsights(restaurantId) }
        break
      case "content":
        results = { contentGeneration: await aiTester.testContentGeneration(restaurantId) }
        break
      case "social":
        results = { socialProfileGeneration: await aiTester.testSocialProfileGeneration(restaurantId) }
        break
      case "pricing":
        results = { pricingOptimization: await aiTester.testPricingOptimization(restaurantId) }
        break
      case "marketing":
        results = { marketingInsights: await aiTester.testMarketingInsights(restaurantId) }
        break
      default:
        results = await aiTester.testAllAIFeatures(restaurantId)
    }

    return NextResponse.json({
      success: true,
      message: "AI feature testing completed successfully",
      testSuite,
      restaurantId: restaurantId || "random",
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ AI feature testing failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: "AI feature testing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "AI Feature Testing API",
    endpoints: {
      POST: "Run comprehensive AI feature tests",
      parameters: {
        restaurantId: "Specific restaurant ID to test (optional)",
        testSuite:
          "Specific test suite to run: 'all', 'menu', 'reviews', 'customers', 'content', 'social', 'pricing', 'marketing'",
      },
    },
    availableTestSuites: [
      "all - Run all AI feature tests",
      "menu - Test menu analysis and insights",
      "reviews - Test review analysis and responses",
      "customers - Test customer insights and segmentation",
      "content - Test content generation features",
      "social - Test social profile generation",
      "pricing - Test pricing optimization",
      "marketing - Test marketing insights",
    ],
  })
}
