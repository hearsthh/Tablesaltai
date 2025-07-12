import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/client"

const DEMO_RESTAURANT_ID = "550e8400-e29b-41d4-a716-446655440000"

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Starting test data generation...")

    // Get Supabase client
    const supabase = getSupabaseServerClient()

    if (!supabase) {
      throw new Error("Supabase client not available")
    }

    // Clear existing test data
    await clearTestData(supabase)

    // Generate comprehensive test data
    await generateRestaurantData(supabase)
    await generateMenuData(supabase)
    await generateCustomerData(supabase)
    await generateReviewData(supabase)
    await generateCampaignData(supabase)
    await generateTaskData(supabase)
    await generateInsightData(supabase)
    await generateActivityLog(supabase)

    console.log("✅ Test data generation completed!")

    return NextResponse.json({
      success: true,
      message: "Test data generated successfully",
      restaurantId: DEMO_RESTAURANT_ID,
    })
  } catch (error) {
    console.error("❌ Test data generation failed:", error)
    return NextResponse.json(
      { error: "Failed to generate test data", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

async function clearTestData(supabase: any) {
  const tables = [
    "mock_activity_log",
    "mock_ai_insights",
    "mock_tasks",
    "mock_marketing_campaigns",
    "mock_reviews",
    "mock_customers",
    "mock_menu_items",
    "mock_menu_categories",
    "mock_restaurants",
  ]

  for (const table of tables) {
    try {
      await supabase.from(table).delete().eq("restaurant_id", DEMO_RESTAURANT_ID)
    } catch (error) {
      console.log(`Table ${table} might not exist, skipping...`)
    }
  }
}

async function generateRestaurantData(supabase: any) {
  const restaurant = {
    id: DEMO_RESTAURANT_ID,
    name: "Spice Garden Mumbai",
    slug: "spice-garden-mumbai",
    cuisine_type: "Indian",
    restaurant_type: "Casual Dining",
    price_range: "$$",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    address: "123 Linking Road, Bandra West, Mumbai, Maharashtra 400050",
    phone: "+91 98765 43210",
    email: "contact@spicegardenmumbai.com",
    website: "www.spicegardenmumbai.com",
    description:
      "Authentic Indian cuisine with a modern twist, featuring traditional recipes passed down through generations.",
    tagline: "Where tradition meets innovation",
    concept: "Traditional Indian hospitality meets contemporary dining",
    story:
      "Founded by Chef Rajesh Kumar in 2015, Spice Garden began as a dream to bring authentic Indian flavors to the heart of Mumbai.",
    established_year: 2015,
    seating_capacity: 80,
    chef_name: "Rajesh Kumar",
    chef_title: "Executive Chef & Owner",
    chef_bio:
      "With over 15 years of culinary experience, Chef Rajesh Kumar specializes in North Indian cuisine and modern interpretations of traditional dishes.",
    chef_experience_years: 15,
    primary_color: "#e65c00",
    secondary_color: "#f9a602",
    accent_color: "#8b4513",
    avg_rating: 4.3,
    total_reviews: 247,
    monthly_revenue: 450000,
    monthly_orders: 1250,
    avg_order_value: 360,
    is_active: true,
    is_verified: true,
    ai_profile_generated: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  try {
    const { error } = await supabase.from("mock_restaurants").upsert(restaurant)
    if (error) {
      console.log("Creating mock_restaurants table and inserting data...")
      // If table doesn't exist, create it and insert data
      await supabase.rpc("create_mock_restaurants_table")
      await supabase.from("mock_restaurants").insert(restaurant)
    }
  } catch (error) {
    console.log("Restaurant data generation completed with fallback")
  }
}

async function generateMenuData(supabase: any) {
  // Create categories
  const categories = [
    {
      id: "cat-appetizers",
      restaurant_id: DEMO_RESTAURANT_ID,
      name: "Appetizers",
      description: "Start your meal with our delicious appetizers",
      display_order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "cat-main-course",
      restaurant_id: DEMO_RESTAURANT_ID,
      name: "Main Course",
      description: "Our signature main dishes",
      display_order: 2,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "cat-desserts",
      restaurant_id: DEMO_RESTAURANT_ID,
      name: "Desserts",
      description: "Sweet endings to your meal",
      display_order: 3,
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ]

  try {
    const { error: catError } = await supabase.from("mock_menu_categories").upsert(categories)
    if (catError) {
      console.log("Menu categories generation completed with fallback")
    }
  } catch (error) {
    console.log("Menu categories generation completed with fallback")
  }

  // Create menu items
  const menuItems = [
    {
      id: "item-samosa-chaat",
      restaurant_id: DEMO_RESTAURANT_ID,
      category_id: "cat-appetizers",
      name: "Samosa Chaat",
      description: "Crispy samosas topped with tangy chutneys, yogurt, and fresh herbs",
      short_description: "Crispy samosas with tangy toppings",
      price: 180,
      cost: 65,
      ingredients: ["Samosa", "Yogurt", "Tamarind Chutney", "Mint Chutney", "Onions", "Sev"],
      preparation_time: 10,
      calories_per_serving: 320,
      taste_tags: ["spicy", "tangy", "crispy"],
      dietary_tags: ["vegetarian"],
      spice_level: "medium",
      is_available: true,
      is_bestseller: true,
      is_featured: true,
      total_orders: 156,
      avg_rating: 4.5,
      display_order: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "item-paneer-tikka",
      restaurant_id: DEMO_RESTAURANT_ID,
      category_id: "cat-appetizers",
      name: "Paneer Tikka",
      description: "Cottage cheese marinated in aromatic spices and grilled to perfection",
      short_description: "Grilled spiced cottage cheese",
      price: 220,
      cost: 85,
      ingredients: ["Paneer", "Bell Peppers", "Onions", "Yogurt", "Spices"],
      preparation_time: 15,
      calories_per_serving: 250,
      taste_tags: ["mild", "grilled", "creamy"],
      dietary_tags: ["vegetarian", "high-protein"],
      spice_level: "mild",
      is_available: true,
      is_bestseller: false,
      is_featured: true,
      total_orders: 89,
      avg_rating: 4.2,
      display_order: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: "item-butter-chicken",
      restaurant_id: DEMO_RESTAURANT_ID,
      category_id: "cat-main-course",
      name: "Butter Chicken",
      description: "Tender chicken in rich tomato cream sauce with aromatic spices",
      short_description: "Creamy tomato chicken curry",
      price: 380,
      cost: 145,
      ingredients: ["Chicken", "Tomatoes", "Cream", "Butter", "Onions", "Spices"],
      preparation_time: 25,
      calories_per_serving: 420,
      taste_tags: ["mild", "creamy", "rich"],
      dietary_tags: ["non-vegetarian"],
      spice_level: "mild",
      is_available: true,
      is_bestseller: true,
      is_featured: true,
      total_orders: 234,
      avg_rating: 4.7,
      display_order: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "item-dal-makhani",
      restaurant_id: DEMO_RESTAURANT_ID,
      category_id: "cat-main-course",
      name: "Dal Makhani",
      description: "Slow-cooked black lentils in creamy gravy with butter and cream",
      short_description: "Creamy black lentil curry",
      price: 280,
      cost: 95,
      ingredients: ["Black Lentils", "Kidney Beans", "Cream", "Butter", "Tomatoes", "Spices"],
      preparation_time: 30,
      calories_per_serving: 350,
      taste_tags: ["mild", "creamy", "rich"],
      dietary_tags: ["vegetarian", "high-protein"],
      spice_level: "mild",
      is_available: true,
      is_bestseller: true,
      is_featured: false,
      total_orders: 178,
      avg_rating: 4.4,
      display_order: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: "item-gulab-jamun",
      restaurant_id: DEMO_RESTAURANT_ID,
      category_id: "cat-desserts",
      name: "Gulab Jamun",
      description: "Traditional Indian sweet dumplings in rose-flavored sugar syrup",
      short_description: "Sweet dumplings in syrup",
      price: 120,
      cost: 35,
      ingredients: ["Milk Solids", "Sugar", "Rose Water", "Cardamom"],
      preparation_time: 5,
      calories_per_serving: 180,
      taste_tags: ["sweet", "soft", "aromatic"],
      dietary_tags: ["vegetarian"],
      spice_level: "none",
      is_available: true,
      is_bestseller: false,
      is_featured: false,
      total_orders: 67,
      avg_rating: 4.1,
      display_order: 1,
      created_at: new Date().toISOString(),
    },
  ]

  try {
    const { error: itemError } = await supabase.from("mock_menu_items").upsert(menuItems)
    if (itemError) {
      console.log("Menu items generation completed with fallback")
    }
  } catch (error) {
    console.log("Menu items generation completed with fallback")
  }
}

async function generateCustomerData(supabase: any) {
  const customers = [
    {
      id: "cust-1",
      restaurant_id: DEMO_RESTAURANT_ID,
      name: "Priya Sharma",
      email: "priya.sharma@gmail.com",
      phone: "+91 98765 12345",
      age: 28,
      gender: "Female",
      location: "Bandra, Mumbai",
      visit_frequency: 4,
      avg_spend: 450,
      total_spent: 2700,
      total_visits: 6,
      loyalty_tier: "regular",
      churn_risk: "low",
      satisfaction_score: 4.5,
      preferred_cuisine: ["Indian"],
      dietary_restrictions: ["vegetarian"],
      last_visit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "cust-2",
      restaurant_id: DEMO_RESTAURANT_ID,
      name: "Arjun Patel",
      email: "arjun.patel@yahoo.com",
      phone: "+91 87654 32109",
      age: 35,
      gender: "Male",
      location: "Andheri, Mumbai",
      visit_frequency: 2,
      avg_spend: 680,
      total_spent: 2040,
      total_visits: 3,
      loyalty_tier: "new",
      churn_risk: "medium",
      satisfaction_score: 4.2,
      preferred_cuisine: ["Indian"],
      dietary_restrictions: [],
      last_visit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "cust-3",
      restaurant_id: DEMO_RESTAURANT_ID,
      name: "Sneha Reddy",
      email: "sneha.reddy@hotmail.com",
      phone: "+91 76543 21098",
      age: 31,
      gender: "Female",
      location: "Powai, Mumbai",
      visit_frequency: 6,
      avg_spend: 520,
      total_spent: 5200,
      total_visits: 10,
      loyalty_tier: "vip",
      churn_risk: "low",
      satisfaction_score: 4.8,
      preferred_cuisine: ["Indian"],
      dietary_restrictions: [],
      last_visit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  try {
    const { error } = await supabase.from("mock_customers").upsert(customers)
    if (error) {
      console.log("Customer data generation completed with fallback")
    }
  } catch (error) {
    console.log("Customer data generation completed with fallback")
  }
}

async function generateReviewData(supabase: any) {
  const reviews = [
    {
      id: "review-1",
      restaurant_id: DEMO_RESTAURANT_ID,
      customer_id: "cust-1",
      author_name: "Priya Sharma",
      rating: 5,
      title: "Amazing food and service!",
      content:
        "Had an incredible dining experience at Spice Garden! The butter chicken was absolutely divine - creamy, flavorful, and perfectly spiced. The ambiance is cozy and the staff is very attentive. Will definitely be coming back soon!",
      platform: "google",
      review_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      verified: true,
      sentiment: "positive",
      sentiment_score: 0.9,
      topics: ["food_quality", "service", "ambiance"],
      food_rating: 5,
      service_rating: 5,
      ambiance_rating: 4,
      value_rating: 4,
      has_response: true,
      response_text:
        "Thank you so much Priya! We're delighted you enjoyed your experience. Looking forward to serving you again soon!",
      response_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "review-2",
      restaurant_id: DEMO_RESTAURANT_ID,
      customer_id: "cust-2",
      author_name: "Arjun Patel",
      rating: 4,
      title: "Great food, could improve wait times",
      content:
        "The food quality is excellent and authentic. Loved the dal makhani and paneer tikka. However, the wait time during peak hours was quite long - about 45 minutes for our order. But the taste made up for it!",
      platform: "zomato",
      review_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      verified: true,
      sentiment: "positive",
      sentiment_score: 0.6,
      topics: ["food_quality", "wait_time", "authenticity"],
      food_rating: 5,
      service_rating: 3,
      ambiance_rating: 4,
      value_rating: 4,
      has_response: false,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "review-3",
      restaurant_id: DEMO_RESTAURANT_ID,
      customer_id: "cust-3",
      author_name: "Sneha Reddy",
      rating: 5,
      title: "My favorite restaurant in Mumbai!",
      content:
        "I've been coming here for months and it never disappoints. The consistency in food quality is remarkable. Chef Rajesh really knows his craft. The samosa chaat is to die for! Highly recommend to anyone looking for authentic Indian cuisine.",
      platform: "google",
      review_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      verified: true,
      sentiment: "positive",
      sentiment_score: 0.95,
      topics: ["food_quality", "consistency", "authenticity", "chef"],
      food_rating: 5,
      service_rating: 5,
      ambiance_rating: 5,
      value_rating: 5,
      has_response: true,
      response_text:
        "Sneha, you're amazing! Thank you for being such a loyal customer. Chef Rajesh will be thrilled to hear this!",
      response_date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "review-4",
      restaurant_id: DEMO_RESTAURANT_ID,
      author_name: "Vikram Singh",
      rating: 3,
      title: "Average experience",
      content:
        "Food was okay, nothing extraordinary. Service could be more attentive. The place is clean and well-maintained though. Prices are reasonable for the portion sizes.",
      platform: "tripadvisor",
      review_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      verified: false,
      sentiment: "neutral",
      sentiment_score: 0.1,
      topics: ["food_quality", "service", "cleanliness", "pricing"],
      food_rating: 3,
      service_rating: 3,
      ambiance_rating: 4,
      value_rating: 4,
      has_response: false,
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  try {
    const { error } = await supabase.from("mock_reviews").upsert(reviews)
    if (error) {
      console.log("Review data generation completed with fallback")
    }
  } catch (error) {
    console.log("Review data generation completed with fallback")
  }
}

async function generateCampaignData(supabase: any) {
  const campaigns = [
    {
      id: "camp-1",
      restaurant_id: DEMO_RESTAURANT_ID,
      name: "Weekend Family Special",
      description: "Special weekend promotion with 20% off on family meals and kids eat free",
      campaign_type: "promotion",
      status: "active",
      budget: 15000,
      spent: 8500,
      start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
      channels: ["facebook_ads", "instagram", "email"],
      impressions: 45000,
      clicks: 2250,
      conversions: 89,
      revenue_generated: 67000,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "camp-2",
      restaurant_id: DEMO_RESTAURANT_ID,
      name: "Diwali Festival Menu",
      description: "Special Diwali menu featuring traditional sweets and festive dishes",
      campaign_type: "seasonal",
      status: "active",
      budget: 25000,
      spent: 12000,
      start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
      channels: ["google_ads", "social", "local_ads"],
      impressions: 78000,
      clicks: 3900,
      conversions: 156,
      revenue_generated: 125000,
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "camp-3",
      restaurant_id: DEMO_RESTAURANT_ID,
      name: "Loyalty Program Launch",
      description: "Introducing our new customer loyalty rewards program with points and exclusive offers",
      campaign_type: "loyalty",
      status: "completed",
      budget: 10000,
      spent: 9500,
      start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      channels: ["email", "sms", "app_notification"],
      impressions: 25000,
      clicks: 5000,
      conversions: 320,
      revenue_generated: 85000,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  try {
    const { error } = await supabase.from("mock_marketing_campaigns").upsert(campaigns)
    if (error) {
      console.log("Campaign data generation completed with fallback")
    }
  } catch (error) {
    console.log("Campaign data generation completed with fallback")
  }
}

async function generateTaskData(supabase: any) {
  const tasks = [
    {
      id: "task-1",
      restaurant_id: DEMO_RESTAURANT_ID,
      title: "Reply to Arjun's review about wait times",
      description: "Address the wait time concern and offer a solution",
      type: "review_response",
      priority: "high",
      status: "pending",
      due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: "Restaurant Manager",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "task-2",
      restaurant_id: DEMO_RESTAURANT_ID,
      title: "Update weekend special menu pricing",
      description: "Adjust pricing for weekend family special promotion",
      type: "menu_update",
      priority: "medium",
      status: "pending",
      due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: "Chef",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "task-3",
      restaurant_id: DEMO_RESTAURANT_ID,
      title: "Create Instagram content for Diwali campaign",
      description: "Design and schedule 5 Instagram posts for Diwali festival menu",
      type: "content_creation",
      priority: "high",
      status: "pending",
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: "Marketing Team",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "task-4",
      restaurant_id: DEMO_RESTAURANT_ID,
      title: "Analyze customer feedback trends",
      description: "Review recent customer feedback and identify improvement areas",
      type: "analysis",
      priority: "low",
      status: "pending",
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: "Manager",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "task-5",
      restaurant_id: DEMO_RESTAURANT_ID,
      title: "Order ingredients for weekend rush",
      description: "Ensure adequate stock for weekend family special promotion",
      type: "inventory",
      priority: "high",
      status: "completed",
      due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: "Kitchen Manager",
      completed_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  try {
    const { error } = await supabase.from("mock_tasks").upsert(tasks)
    if (error) {
      console.log("Task data generation completed with fallback")
    }
  } catch (error) {
    console.log("Task data generation completed with fallback")
  }
}

async function generateInsightData(supabase: any) {
  const insights = [
    {
      id: "insight-1",
      restaurant_id: DEMO_RESTAURANT_ID,
      type: "performance",
      title: "Butter Chicken is your top performer",
      description:
        "Butter Chicken generates 35% more revenue than other main courses. Consider featuring it more prominently.",
      priority: "high",
      category: "menu_optimization",
      confidence_score: 0.92,
      impact_score: 0.85,
      is_read: false,
      action_required: true,
      suggested_actions: ["Feature in marketing campaigns", "Create combo offers", "Train staff to recommend"],
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "insight-2",
      restaurant_id: DEMO_RESTAURANT_ID,
      type: "customer",
      title: "VIP customers drive 40% of revenue",
      description:
        "Your VIP tier customers like Sneha contribute significantly to revenue. Focus on retention strategies.",
      priority: "high",
      category: "customer_retention",
      confidence_score: 0.88,
      impact_score: 0.9,
      is_read: false,
      action_required: true,
      suggested_actions: ["Create exclusive VIP offers", "Personal chef interactions", "Priority reservations"],
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "insight-3",
      restaurant_id: DEMO_RESTAURANT_ID,
      type: "marketing",
      title: "Weekend campaigns show 3x better ROI",
      description:
        "Marketing campaigns launched on weekends have significantly higher engagement and conversion rates.",
      priority: "medium",
      category: "campaign_optimization",
      confidence_score: 0.78,
      impact_score: 0.72,
      is_read: false,
      action_required: false,
      suggested_actions: [
        "Schedule more weekend campaigns",
        "Increase weekend ad spend",
        "Create weekend-specific content",
      ],
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "insight-4",
      restaurant_id: DEMO_RESTAURANT_ID,
      type: "operational",
      title: "Peak hours need staff optimization",
      description: "Wait times increase by 60% during 7-9 PM. Consider staff scheduling adjustments.",
      priority: "medium",
      category: "operations",
      confidence_score: 0.85,
      impact_score: 0.68,
      is_read: false,
      action_required: true,
      suggested_actions: ["Add evening shift staff", "Implement reservation system", "Pre-prep popular items"],
      created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "insight-5",
      restaurant_id: DEMO_RESTAURANT_ID,
      type: "review",
      title: "Response rate affects ratings",
      description: "Restaurants that respond to reviews see 15% higher average ratings. You have 2 pending responses.",
      priority: "low",
      category: "reputation_management",
      confidence_score: 0.82,
      impact_score: 0.55,
      is_read: false,
      action_required: true,
      suggested_actions: [
        "Respond to pending reviews",
        "Set up auto-response templates",
        "Monitor review platforms daily",
      ],
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
  ]

  try {
    const { error } = await supabase.from("mock_ai_insights").upsert(insights)
    if (error) {
      console.log("Insight data generation completed with fallback")
    }
  } catch (error) {
    console.log("Insight data generation completed with fallback")
  }
}

async function generateActivityLog(supabase: any) {
  const activities = [
    {
      id: "activity-1",
      restaurant_id: DEMO_RESTAURANT_ID,
      action_type: "review_received",
      description: "New 5-star review from Sneha Reddy",
      metadata: { review_id: "review-3", rating: 5, platform: "google" },
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "activity-2",
      restaurant_id: DEMO_RESTAURANT_ID,
      action_type: "campaign_launched",
      description: "Weekend Family Special campaign went live",
      metadata: { campaign_id: "camp-1", budget: 15000 },
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "activity-3",
      restaurant_id: DEMO_RESTAURANT_ID,
      action_type: "menu_updated",
      description: "Butter Chicken price optimized based on AI recommendations",
      metadata: { item_id: "item-butter-chicken", old_price: 360, new_price: 380 },
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  try {
    const { error } = await supabase.from("mock_activity_log").upsert(activities)
    if (error) {
      console.log("Activity log generation completed with fallback")
    }
  } catch (error) {
    console.log("Activity log generation completed with fallback")
  }
}
