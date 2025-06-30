import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { userData, restaurantData } = await request.json()

    console.log("🚀 Creating PRODUCTION user for restaurant management platform...")
    console.log("📝 Restaurant:", restaurantData.name)
    console.log("📧 Email:", userData.email)

    // Get Supabase client - PRODUCTION ONLY
    const supabase = getSupabaseServerClient()
    console.log("✅ Supabase production client initialized")

    // Verify database connection and schema
    console.log("🔍 Verifying database schema...")
    const { data: schemaCheck, error: schemaError } = await supabase
      .from("restaurant_profiles")
      .select("count", { count: "exact" })
      .limit(0)

    if (schemaError) {
      console.error("❌ Database schema error:", schemaError)
      throw new Error(
        `Database schema verification failed: ${schemaError.message}. Please run the production schema script.`,
      )
    }

    console.log("✅ Database schema verified")

    // 1. Create user account with Supabase Auth
    console.log("🔐 Creating production user account...")
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          restaurant_name: restaurantData.name,
          setup_completed: false,
        },
      },
    })

    if (authError) {
      console.error("❌ Auth error:", authError)
      throw new Error(`User creation failed: ${authError.message}`)
    }

    if (!authData.user) {
      throw new Error("User creation failed - no user data returned")
    }

    console.log("✅ Production user created with ID:", authData.user.id)

    // 2. Create restaurant profile with proper type handling
    console.log("🏪 Creating restaurant profile...")

    // Map cuisine types to valid enum values
    const mapCuisineType = (cuisine: string): string => {
      const cuisineMap: { [key: string]: string } = {
        Italian: "italian",
        Chinese: "chinese",
        Indian: "indian",
        Mexican: "mexican",
        American: "american",
        French: "french",
        Japanese: "japanese",
        Thai: "thai",
        Mediterranean: "mediterranean",
        Korean: "korean",
        Vietnamese: "vietnamese",
      }
      return cuisineMap[cuisine] || "other"
    }

    // Map restaurant types to valid enum values
    const mapRestaurantType = (type: string): string => {
      const typeMap: { [key: string]: string } = {
        "Fine Dining": "fine_dining",
        "Casual Dining": "casual_dining",
        "Fast Casual": "fast_casual",
        "Fast Food": "fast_food",
        Cafe: "cafe",
        Bar: "bar",
        "Food Truck": "food_truck",
        Catering: "catering",
      }
      return typeMap[type] || "casual_dining"
    }

    // Map price range to valid enum values
    const mapPriceRange = (range: string): string => {
      const priceMap: { [key: string]: string } = {
        $: "$",
        $$: "$$",
        $$$: "$$$",
        $$$$: "$$$$",
        Budget: "$",
        Moderate: "$$",
        Expensive: "$$$",
        "Very Expensive": "$$$$",
      }
      return priceMap[range] || "$$"
    }

    const { data: profileData, error: profileError } = await supabase
      .from("restaurant_profiles")
      .insert([
        {
          user_id: authData.user.id,
          restaurant_name: restaurantData.name,
          tagline: restaurantData.tagline || null,
          email: restaurantData.email,
          phone: restaurantData.phone || null,
          address: restaurantData.address,
          cuisine_type: mapCuisineType(restaurantData.cuisine || "Other"),
          restaurant_type: mapRestaurantType(restaurantData.type || "Casual Dining"),
          price_range: mapPriceRange(restaurantData.priceRange || "$$"),
          website: restaurantData.website || null,
          description: restaurantData.description || null,
          operating_hours: restaurantData.operatingHours || {},
          social_media: restaurantData.socialMedia || {},
          brand_colors: restaurantData.brandColors || {},
          brand_voice: restaurantData.brandVoice || "professional",
          amenities: restaurantData.amenities || [],
          is_active: true,
          setup_completed: false,
        },
      ])
      .select()
      .single()

    if (profileError) {
      console.error("❌ Profile creation error:", profileError)
      console.error("❌ Profile data attempted:", {
        user_id: authData.user.id,
        restaurant_name: restaurantData.name,
        cuisine_type: mapCuisineType(restaurantData.cuisine || "Other"),
        restaurant_type: mapRestaurantType(restaurantData.type || "Casual Dining"),
        price_range: mapPriceRange(restaurantData.priceRange || "$$"),
      })
      throw new Error(`Restaurant profile creation failed: ${profileError.message}`)
    }

    console.log("✅ Restaurant profile created with ID:", profileData.id)

    // 3. Create menu categories
    console.log("📋 Creating menu categories...")
    const categories = []
    for (const category of restaurantData.menuCategories || []) {
      const { data: categoryData, error: categoryError } = await supabase
        .from("menu_categories")
        .insert([
          {
            restaurant_id: authData.user.id,
            name: category.name,
            description: category.description || null,
            display_order: category.order || 0,
            is_active: true,
          },
        ])
        .select()
        .single()

      if (categoryError) {
        console.error(`❌ Category creation error for ${category.name}:`, categoryError)
        continue
      }

      categories.push(categoryData)
      console.log(`✅ Category created: ${categoryData.name}`)
    }

    // 4. Create menu items
    console.log("🍽️ Creating menu items...")
    const items = []
    for (const item of restaurantData.menuItems || []) {
      const category = categories.find((c) => c.name === item.category)
      if (!category) {
        console.warn(`⚠️ Category not found for item: ${item.name}`)
        continue
      }

      const { data: itemData, error: itemError } = await supabase
        .from("menu_items")
        .insert([
          {
            restaurant_id: authData.user.id,
            category_id: category.id,
            name: item.name,
            description: item.description || null,
            price: Number.parseFloat(item.price.toString()),
            is_available: true,
            dietary_tags: item.dietaryTags || [],
            display_order: item.order || 0,
          },
        ])
        .select()
        .single()

      if (itemError) {
        console.error(`❌ Item creation error for ${item.name}:`, itemError)
        continue
      }

      items.push(itemData)
      console.log(`✅ Menu item created: ${itemData.name}`)
    }

    // 5. Initialize review settings
    console.log("⭐ Setting up review system...")
    const { data: reviewSettings, error: reviewError } = await supabase
      .from("review_settings")
      .insert([
        {
          restaurant_id: authData.user.id,
          enabled: true,
          require_email: true,
          moderation_required: true,
          auto_publish: false,
          email_notifications: true,
          thank_you_message: "Thank you for your feedback! We appreciate your review.",
          min_rating: 1,
          max_rating: 5,
          allow_anonymous: false,
        },
      ])
      .select()
      .single()

    if (reviewError) {
      console.error("❌ Review settings error:", reviewError)
    } else {
      console.log("✅ Review settings initialized")
    }

    // 6. Create initial analytics record
    console.log("📊 Initializing analytics...")
    const { data: analyticsData, error: analyticsError } = await supabase
      .from("restaurant_analytics")
      .insert([
        {
          restaurant_id: authData.user.id,
          profile_views: 0,
          menu_views: 0,
          review_count: 0,
          average_rating: 0.0,
          total_reservations: 0,
          conversion_rate: 0.0,
        },
      ])
      .select()
      .single()

    if (analyticsError) {
      console.error("❌ Analytics initialization error:", analyticsError)
    } else {
      console.log("✅ Analytics initialized")
    }

    // 7. Mark setup as completed
    const { error: updateError } = await supabase
      .from("restaurant_profiles")
      .update({
        setup_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profileData.id)

    if (updateError) {
      console.warn("⚠️ Setup completion update failed:", updateError)
    }

    // 8. Update user metadata
    const { error: userUpdateError } = await supabase.auth.updateUser({
      data: {
        restaurant_id: profileData.id,
        setup_completed: true,
      },
    })

    if (userUpdateError) {
      console.warn("⚠️ User metadata update failed:", userUpdateError)
    }

    console.log("🎉 PRODUCTION user creation completed successfully!")

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        created_at: authData.user.created_at,
      },
      restaurant: {
        id: profileData.id,
        name: profileData.restaurant_name,
        categories: categories.length,
        items: items.length,
        profile: profileData,
      },
      database: {
        categories: categories,
        items: items,
        reviewSettings: reviewSettings,
        analytics: analyticsData,
      },
      message: "Production user created successfully with real database",
      environment: "production",
      isMockData: false,
    })
  } catch (error) {
    console.error("💥 PRODUCTION user creation error:", error)
    return NextResponse.json(
      {
        error: "Failed to create production user",
        details: error instanceof Error ? error.message : "Unknown error",
        environment: "production",
        requiresRealDatabase: true,
      },
      { status: 500 },
    )
  }
}
