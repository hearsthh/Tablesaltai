import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    console.log("🎲 Starting AI data generation...")

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase configuration missing")
    }

    const { userId, restaurantId } = await request.json()

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Get restaurant profile
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurant_profiles")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (restaurantError) {
      throw new Error(`Restaurant not found: ${restaurantError.message}`)
    }

    console.log("✅ Restaurant profile retrieved:", restaurant.restaurant_name)

    // Generate menu items with AI
    const menuItems = []
    const menuCategories = ["Appetizers", "Main Courses", "Desserts", "Beverages"]

    for (const category of menuCategories) {
      try {
        const { text } = await generateText({
          model: openai("gpt-4o"),
          prompt: `Generate 3-4 realistic menu items for a ${restaurant.cuisine_type} restaurant in the ${category} category. 
          
Restaurant: ${restaurant.restaurant_name}
Type: ${restaurant.restaurant_type}
Price Range: ${restaurant.price_range}

For each item, provide:
- Name
- Description (2-3 sentences)
- Price (appropriate for ${restaurant.price_range} range)
- Ingredients list
- Dietary info (vegetarian, vegan, gluten-free, etc.)

Format as JSON array with objects containing: name, description, price, ingredients, dietary_info, category`,
        })

        const categoryItems = JSON.parse(text)
        menuItems.push(...categoryItems)
      } catch (error) {
        console.warn(`Failed to generate ${category} items:`, error)
        // Add fallback items
        menuItems.push({
          name: `${category} Special`,
          description: `Delicious ${category.toLowerCase()} item from our kitchen`,
          price: category === "Beverages" ? 8.99 : category === "Appetizers" ? 12.99 : 24.99,
          ingredients: ["Fresh ingredients", "Chef's special blend"],
          dietary_info: ["Contains gluten"],
          category,
        })
      }
    }

    // Insert menu items
    const menuInserts = menuItems.map((item) => ({
      restaurant_id: restaurant.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      ingredients: item.ingredients,
      dietary_info: item.dietary_info,
      is_available: true,
      created_at: new Date().toISOString(),
    }))

    const { data: insertedMenuItems, error: menuError } = await supabase.from("menu_items").insert(menuInserts).select()

    if (menuError) {
      console.warn("Menu items insertion failed:", menuError)
    } else {
      console.log(`✅ Generated ${insertedMenuItems.length} menu items`)
    }

    // Generate customer reviews with AI
    const reviews = []
    const reviewCount = 15

    for (let i = 0; i < reviewCount; i++) {
      try {
        const rating = Math.floor(Math.random() * 3) + 3 // 3-5 stars
        const { text } = await generateText({
          model: openai("gpt-4o"),
          prompt: `Generate a realistic customer review for ${restaurant.restaurant_name}, a ${restaurant.cuisine_type} restaurant.

Rating: ${rating}/5 stars
Restaurant Type: ${restaurant.restaurant_type}
Price Range: ${restaurant.price_range}

Make it sound authentic and mention specific aspects like:
- Food quality and taste
- Service experience
- Ambiance
- Value for money
- Specific menu items

Keep it 2-4 sentences, natural tone.`,
        })

        reviews.push({
          restaurant_id: restaurant.id,
          customer_name: `Customer ${i + 1}`,
          rating,
          review_text: text,
          platform: ["Google", "Yelp", "TripAdvisor"][Math.floor(Math.random() * 3)],
          review_date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
        })
      } catch (error) {
        console.warn(`Failed to generate review ${i + 1}:`, error)
        reviews.push({
          restaurant_id: restaurant.id,
          customer_name: `Customer ${i + 1}`,
          rating: 4,
          review_text: "Great experience! The food was delicious and the service was excellent.",
          platform: "Google",
          review_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
        })
      }
    }

    // Insert reviews
    const { data: insertedReviews, error: reviewError } = await supabase.from("reviews").insert(reviews).select()

    if (reviewError) {
      console.warn("Reviews insertion failed:", reviewError)
    } else {
      console.log(`✅ Generated ${insertedReviews.length} reviews`)
    }

    // Calculate metrics
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    const totalMenuItems = menuItems.length
    const totalReviews = reviews.length

    // Generate AI analysis of the generated data
    let aiAnalysis = "Data generation completed successfully."

    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Analyze the generated data for ${restaurant.restaurant_name}:

Menu Items: ${totalMenuItems} items across ${menuCategories.length} categories
Reviews: ${totalReviews} reviews with average rating of ${averageRating.toFixed(1)}/5
Restaurant Type: ${restaurant.restaurant_type}
Cuisine: ${restaurant.cuisine_type}

Provide insights on:
1. Menu diversity and pricing strategy
2. Customer satisfaction trends
3. Areas for improvement
4. Competitive positioning
5. Growth opportunities

Keep it concise and actionable.`,
      })
      aiAnalysis = text
    } catch (error) {
      console.warn("AI analysis generation failed:", error)
    }

    return NextResponse.json({
      success: true,
      message: "AI data generation completed",
      data: {
        generated: {
          menuItems: totalMenuItems,
          reviews: totalReviews,
          averageRating: Math.round(averageRating * 10) / 10,
        },
        aiAnalysis,
        metrics: {
          menuCategories: menuCategories.length,
          averagePrice: menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length,
          reviewDistribution: {
            5: reviews.filter((r) => r.rating === 5).length,
            4: reviews.filter((r) => r.rating === 4).length,
            3: reviews.filter((r) => r.rating === 3).length,
          },
        },
      },
    })
  } catch (error) {
    console.error("❌ Data generation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Data generation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "AI Data Generation Test API",
    description: "Generate realistic menu items and reviews using AI",
    usage: {
      method: "POST",
      body: {
        userId: "User ID",
        restaurantId: "Restaurant ID",
      },
    },
  })
}
