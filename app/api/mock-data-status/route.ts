import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    console.log("📊 Checking mock data status...")

    // Get counts from all mock tables
    const [
      restaurantsResult,
      categoriesResult,
      menuItemsResult,
      customersResult,
      reviewsResult,
      campaignsResult,
      integrationsResult,
      contentResult,
    ] = await Promise.all([
      supabase.from("mock_restaurants").select("id", { count: "exact", head: true }),
      supabase.from("mock_menu_categories").select("id", { count: "exact", head: true }),
      supabase.from("mock_menu_items").select("id", { count: "exact", head: true }),
      supabase.from("mock_customers").select("id", { count: "exact", head: true }),
      supabase.from("mock_reviews").select("id", { count: "exact", head: true }),
      supabase.from("mock_marketing_campaigns").select("id", { count: "exact", head: true }),
      supabase.from("mock_platform_integrations").select("id", { count: "exact", head: true }),
      supabase.from("mock_generated_content").select("id", { count: "exact", head: true }),
    ])

    // Get sample restaurant data
    const { data: sampleRestaurants } = await supabase
      .from("mock_restaurants")
      .select("id, name, cuisine_type, city, avg_rating, total_reviews")
      .limit(5)

    // Calculate data health metrics
    const totalRestaurants = restaurantsResult.count || 0
    const totalMenuItems = menuItemsResult.count || 0
    const totalCustomers = customersResult.count || 0
    const totalReviews = reviewsResult.count || 0

    const avgMenuItemsPerRestaurant = totalRestaurants > 0 ? Math.round(totalMenuItems / totalRestaurants) : 0
    const avgCustomersPerRestaurant = totalRestaurants > 0 ? Math.round(totalCustomers / totalRestaurants) : 0
    const avgReviewsPerRestaurant = totalRestaurants > 0 ? Math.round(totalReviews / totalRestaurants) : 0

    const dataHealth = {
      restaurants: totalRestaurants,
      menuCategories: categoriesResult.count || 0,
      menuItems: totalMenuItems,
      customers: totalCustomers,
      reviews: totalReviews,
      campaigns: campaignsResult.count || 0,
      integrations: integrationsResult.count || 0,
      generatedContent: contentResult.count || 0,
    }

    const averages = {
      menuItemsPerRestaurant: avgMenuItemsPerRestaurant,
      customersPerRestaurant: avgCustomersPerRestaurant,
      reviewsPerRestaurant: avgReviewsPerRestaurant,
    }

    const isDataComplete = totalRestaurants >= 10 && avgMenuItemsPerRestaurant >= 5 && avgReviewsPerRestaurant >= 20

    return NextResponse.json({
      success: true,
      status: isDataComplete ? "complete" : "incomplete",
      dataHealth,
      averages,
      sampleRestaurants: sampleRestaurants || [],
      recommendations: isDataComplete
        ? ["Mock data is ready for testing", "All profile features can be tested"]
        : [
            "Generate more mock data for comprehensive testing",
            "Ensure each restaurant has sufficient menu items and reviews",
          ],
      lastChecked: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error checking mock data status:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to check mock data status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
