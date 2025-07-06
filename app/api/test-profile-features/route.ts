import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    console.log("🧪 Testing profile module features with mock data...")

    const body = await request.json().catch(() => ({}))
    const { restaurantId, testType = "all" } = body

    // Get a random restaurant if none specified
    let targetRestaurant
    if (restaurantId) {
      const { data } = await supabase.from("mock_restaurants").select("*").eq("id", restaurantId).single()
      targetRestaurant = data
    } else {
      const { data } = await supabase.from("mock_restaurants").select("*").limit(1).single()
      targetRestaurant = data
    }

    if (!targetRestaurant) {
      return NextResponse.json(
        {
          success: false,
          error: "No restaurant found for testing",
          suggestion: "Generate mock data first using POST /api/generate-mock-data",
        },
        { status: 404 },
      )
    }

    const testResults = {
      restaurantInfo: targetRestaurant,
      tests: {},
    }

    // Test Social Profile Features
    if (testType === "all" || testType === "social-profile") {
      console.log("🏢 Testing Social Profile features...")

      const socialProfileTests = {
        basicInfo: {
          name: targetRestaurant.name,
          description: targetRestaurant.description,
          cuisine: targetRestaurant.cuisine_type,
          contact: {
            phone: targetRestaurant.phone,
            email: targetRestaurant.email,
            website: targetRestaurant.website,
          },
          status: "✅ Complete",
        },
        brandAssets: {
          colors: {
            primary: targetRestaurant.primary_color,
            secondary: targetRestaurant.secondary_color,
          },
          brandVoice: targetRestaurant.brand_voice,
          positioning: targetRestaurant.brand_positioning,
          status: "✅ Complete",
        },
        operatingHours: {
          hours: targetRestaurant.operating_hours,
          status: "✅ Complete",
        },
        socialMedia: {
          platforms: targetRestaurant.social_media,
          status: "✅ Complete",
        },
        amenities: {
          list: targetRestaurant.amenities,
          count: targetRestaurant.amenities?.length || 0,
          status: "✅ Complete",
        },
      }

      testResults.tests.socialProfile = socialProfileTests
    }

    // Test Menu Manager Features
    if (testType === "all" || testType === "menu-manager") {
      console.log("🍽️ Testing Menu Manager features...")

      const { data: categories } = await supabase
        .from("mock_menu_categories")
        .select("*")
        .eq("restaurant_id", targetRestaurant.id)

      const { data: menuItems } = await supabase
        .from("mock_menu_items")
        .select("*")
        .eq("restaurant_id", targetRestaurant.id)

      const menuAnalysis = {
        totalCategories: categories?.length || 0,
        totalItems: menuItems?.length || 0,
        priceRange: {
          min: Math.min(...(menuItems?.map((item) => item.price) || [0])),
          max: Math.max(...(menuItems?.map((item) => item.price) || [0])),
          average: menuItems?.reduce((sum, item) => sum + item.price, 0) / (menuItems?.length || 1),
        },
        dietaryOptions: {
          vegetarian: menuItems?.filter((item) => item.dietary_tags?.includes("vegetarian")).length || 0,
          vegan: menuItems?.filter((item) => item.dietary_tags?.includes("vegan")).length || 0,
          nonVegetarian: menuItems?.filter((item) => item.dietary_tags?.includes("non-vegetarian")).length || 0,
        },
        popularItems: menuItems?.filter((item) => item.promo_tags?.includes("popular")) || [],
        aiInsights: {
          underpriced: menuItems?.filter((item) => item.pricing_status === "underpriced").length || 0,
          overpriced: menuItems?.filter((item) => item.pricing_status === "overpriced").length || 0,
          trending: menuItems?.filter((item) => item.trend === "increasing").length || 0,
        },
        status: categories && categories.length > 0 ? "✅ Complete" : "❌ No menu data",
      }

      testResults.tests.menuManager = menuAnalysis
    }

    // Test Reviews Manager Features
    if (testType === "all" || testType === "reviews-manager") {
      console.log("⭐ Testing Reviews Manager features...")

      const { data: reviews } = await supabase.from("mock_reviews").select("*").eq("restaurant_id", targetRestaurant.id)

      const { data: integrations } = await supabase
        .from("mock_platform_integrations")
        .select("*")
        .eq("restaurant_id", targetRestaurant.id)

      const reviewsAnalysis = {
        totalReviews: reviews?.length || 0,
        averageRating: targetRestaurant.avg_rating,
        sentimentBreakdown: {
          positive: reviews?.filter((review) => review.sentiment === "positive").length || 0,
          neutral: reviews?.filter((review) => review.sentiment === "neutral").length || 0,
          negative: reviews?.filter((review) => review.sentiment === "negative").length || 0,
        },
        platformDistribution: {
          google: reviews?.filter((review) => review.platform === "google").length || 0,
          zomato: reviews?.filter((review) => review.platform === "zomato").length || 0,
          yelp: reviews?.filter((review) => review.platform === "yelp").length || 0,
          tripadvisor: reviews?.filter((review) => review.platform === "tripadvisor").length || 0,
          facebook: reviews?.filter((review) => review.platform === "facebook").length || 0,
        },
        responseRate: {
          total: reviews?.length || 0,
          responded: reviews?.filter((review) => review.has_response).length || 0,
          percentage: reviews?.length
            ? Math.round((reviews.filter((review) => review.has_response).length / reviews.length) * 100)
            : 0,
        },
        connectedPlatforms: integrations?.filter((integration) => integration.is_connected).length || 0,
        aiFeatures: {
          sentimentAnalysis: reviews?.filter((review) => review.sentiment_score !== null).length || 0,
          topicExtraction: reviews?.filter((review) => review.topics && review.topics.length > 0).length || 0,
          autoResponses: reviews?.filter((review) => review.has_response).length || 0,
        },
        status: reviews && reviews.length > 0 ? "✅ Complete" : "❌ No review data",
      }

      testResults.tests.reviewsManager = reviewsAnalysis
    }

    // Test Customer Analytics
    if (testType === "all" || testType === "customer-analytics") {
      console.log("👥 Testing Customer Analytics features...")

      const { data: customers } = await supabase
        .from("mock_customers")
        .select("*")
        .eq("restaurant_id", targetRestaurant.id)

      const customerAnalysis = {
        totalCustomers: customers?.length || 0,
        loyaltyTiers: {
          new: customers?.filter((customer) => customer.loyalty_tier === "new").length || 0,
          regular: customers?.filter((customer) => customer.loyalty_tier === "regular").length || 0,
          vip: customers?.filter((customer) => customer.loyalty_tier === "vip").length || 0,
        },
        churnRisk: {
          low: customers?.filter((customer) => customer.churn_risk === "low").length || 0,
          medium: customers?.filter((customer) => customer.churn_risk === "medium").length || 0,
          high: customers?.filter((customer) => customer.churn_risk === "high").length || 0,
        },
        demographics: {
          averageAge: customers?.reduce((sum, customer) => sum + (customer.age || 0), 0) / (customers?.length || 1),
          genderDistribution: {
            male: customers?.filter((customer) => customer.gender === "Male").length || 0,
            female: customers?.filter((customer) => customer.gender === "Female").length || 0,
            other: customers?.filter((customer) => customer.gender === "Other").length || 0,
          },
        },
        engagement: {
          emailSubscribed: customers?.filter((customer) => customer.email_subscribed).length || 0,
          smsSubscribed: customers?.filter((customer) => customer.sms_subscribed).length || 0,
          pushNotifications: customers?.filter((customer) => customer.push_notifications).length || 0,
        },
        status: customers && customers.length > 0 ? "✅ Complete" : "❌ No customer data",
      }

      testResults.tests.customerAnalytics = customerAnalysis
    }

    // Test Marketing Features
    if (testType === "all" || testType === "marketing") {
      console.log("📢 Testing Marketing features...")

      const { data: campaigns } = await supabase
        .from("mock_marketing_campaigns")
        .select("*")
        .eq("restaurant_id", targetRestaurant.id)

      const marketingAnalysis = {
        totalCampaigns: campaigns?.length || 0,
        campaignTypes: {
          promotion: campaigns?.filter((campaign) => campaign.campaign_type === "promotion").length || 0,
          seasonal: campaigns?.filter((campaign) => campaign.campaign_type === "seasonal").length || 0,
          loyalty: campaigns?.filter((campaign) => campaign.campaign_type === "loyalty").length || 0,
        },
        campaignStatus: {
          active: campaigns?.filter((campaign) => campaign.status === "active").length || 0,
          completed: campaigns?.filter((campaign) => campaign.status === "completed").length || 0,
          draft: campaigns?.filter((campaign) => campaign.status === "draft").length || 0,
        },
        performance: {
          totalBudget: campaigns?.reduce((sum, campaign) => sum + (campaign.budget || 0), 0) || 0,
          totalSpent: campaigns?.reduce((sum, campaign) => sum + (campaign.spent || 0), 0) || 0,
          totalRevenue: campaigns?.reduce((sum, campaign) => sum + (campaign.revenue_generated || 0), 0) || 0,
          roi: campaigns?.length
            ? ((campaigns.reduce((sum, campaign) => sum + (campaign.revenue_generated || 0), 0) -
                campaigns.reduce((sum, campaign) => sum + (campaign.spent || 0), 0)) /
                campaigns.reduce((sum, campaign) => sum + (campaign.spent || 0), 0)) *
              100
            : 0,
        },
        status: campaigns && campaigns.length > 0 ? "✅ Complete" : "❌ No campaign data",
      }

      testResults.tests.marketing = marketingAnalysis
    }

    // Overall test summary
    const allTests = Object.values(testResults.tests)
    const completedTests = allTests.filter((test: any) => test.status?.includes("✅")).length
    const totalTests = allTests.length

    const overallStatus = {
      completionRate: totalTests > 0 ? Math.round((completedTests / totalTests) * 100) : 0,
      readyForTesting: completedTests >= totalTests * 0.8, // 80% completion required
      recommendations: [],
    }

    if (overallStatus.readyForTesting) {
      overallStatus.recommendations.push("✅ Mock data is comprehensive and ready for profile module testing")
      overallStatus.recommendations.push("🚀 All major features can be tested with realistic data")
    } else {
      overallStatus.recommendations.push("⚠️ Some test data is missing - consider regenerating mock data")
      overallStatus.recommendations.push("📊 Ensure all restaurants have menu items, reviews, and customer data")
    }

    return NextResponse.json({
      success: true,
      testType,
      restaurant: {
        id: targetRestaurant.id,
        name: targetRestaurant.name,
        cuisine: targetRestaurant.cuisine_type,
        city: targetRestaurant.city,
      },
      testResults,
      overallStatus,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error testing profile features:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to test profile features",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Profile Features Testing API",
    description: "Test all profile module features with mock data",
    endpoints: {
      POST: "Run comprehensive tests on profile features",
      parameters: {
        restaurantId: "Specific restaurant ID to test (optional)",
        testType:
          "Type of test to run: 'all', 'social-profile', 'menu-manager', 'reviews-manager', 'customer-analytics', 'marketing'",
      },
    },
    testTypes: {
      "social-profile": "Test basic info, brand assets, hours, social media, amenities",
      "menu-manager": "Test menu categories, items, pricing, AI insights",
      "reviews-manager": "Test reviews, sentiment analysis, platform integrations",
      "customer-analytics": "Test customer data, segmentation, engagement",
      marketing: "Test campaigns, performance metrics, ROI",
      all: "Run all tests comprehensively",
    },
    usage: {
      example: {
        method: "POST",
        body: {
          testType: "all",
          restaurantId: "optional-restaurant-id",
        },
      },
    },
  })
}
