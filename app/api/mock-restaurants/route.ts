import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase configuration missing",
          details: "Environment variables not configured",
        },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Get all test restaurants
    const { data: restaurants, error } = await supabase
      .from("restaurant_profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      throw new Error(`Database query failed: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      data: {
        restaurants: restaurants || [],
        count: restaurants?.length || 0,
      },
    })
  } catch (error) {
    console.error("Mock restaurants fetch error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch mock restaurants",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, cuisine, type } = await request.json()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase configuration missing")
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const restaurantData = {
      id: `mock_restaurant_${Date.now()}`,
      user_id: `mock_user_${Date.now()}`,
      restaurant_name: name || "Mock Restaurant",
      cuisine_type: cuisine || "International",
      restaurant_type: type || "Casual Dining",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: restaurant, error } = await supabase
      .from("restaurant_profiles")
      .insert(restaurantData)
      .select()
      .single()

    if (error) {
      throw new Error(`Restaurant creation failed: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      data: {
        restaurant,
        message: "Mock restaurant created successfully",
      },
    })
  } catch (error) {
    console.error("Mock restaurant creation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create mock restaurant",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
