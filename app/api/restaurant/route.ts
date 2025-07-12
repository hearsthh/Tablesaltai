import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database-service"

const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000"

export async function GET(request: NextRequest) {
  try {
    // For demo purposes, always return the demo restaurant data
    const restaurant = await DatabaseService.getRestaurant(DEMO_USER_ID)
    return NextResponse.json(restaurant)
  } catch (error) {
    console.error("Error fetching restaurant:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch restaurant" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, restaurantName, email, phone, address, cuisineType } = body

    if (!userId || !restaurantName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const restaurantData = {
      userId,
      restaurantName,
      tagline: body.tagline || "",
      email: email || "",
      phone: phone || "",
      address: address || "",
      cuisineType: cuisineType || "",
      restaurantType: body.restaurantType || "restaurant",
      priceRange: body.priceRange || "$$",
      website: body.website || "",
      description: body.description || "",
      operatingHours: body.operatingHours || {},
      socialMedia: body.socialMedia || {},
      brandColors: body.brandColors || { primary: "#000000", secondary: "#666666" },
      brandVoice: body.brandVoice || "",
      amenities: body.amenities || [],
      logoUrl: body.logoUrl || null,
      coverImageUrl: body.coverImageUrl || null,
      galleryImages: body.galleryImages || [],
      isActive: body.isActive !== undefined ? body.isActive : true,
      setupCompleted: body.setupCompleted !== undefined ? body.setupCompleted : false,
    }

    const restaurant = await DatabaseService.createRestaurant(restaurantData)

    // Create demo menu data for the new restaurant
    await createDemoMenuData(restaurant.id)

    // Create demo reviews for the new restaurant
    await createDemoReviews(restaurant.id)

    // Create demo analytics for the new restaurant
    await createDemoAnalytics(restaurant.id)

    return NextResponse.json(restaurant, { status: 201 })
  } catch (error) {
    console.error("Error creating restaurant:", error)
    return NextResponse.json({ error: "Failed to create restaurant" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // For demo purposes, just return the updated data
    const updatedRestaurant = {
      id: DEMO_USER_ID,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(updatedRestaurant)
  } catch (error) {
    console.error("Error updating restaurant:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update restaurant" },
      { status: 500 },
    )
  }
}

// Helper function to create demo menu data
async function createDemoMenuData(restaurantId: string) {
  try {
    // Create appetizers category
    const appetizersCategory = await DatabaseService.createMenuCategory({
      restaurantId,
      name: "Appetizers",
      description: "Start your meal with our delicious appetizers",
      displayOrder: 1,
      isActive: true,
    })

    // Create main courses category
    const mainCategory = await DatabaseService.createMenuCategory({
      restaurantId,
      name: "Main Courses",
      description: "Our signature pasta dishes and entrees",
      displayOrder: 2,
      isActive: true,
    })

    // Create desserts category
    const dessertsCategory = await DatabaseService.createMenuCategory({
      restaurantId,
      name: "Desserts",
      description: "Sweet endings to your perfect meal",
      displayOrder: 3,
      isActive: true,
    })

    // Add menu items
    await DatabaseService.createMenuItem({
      restaurantId,
      categoryId: appetizersCategory.id,
      name: "Bruschetta Classica",
      description: "Grilled bread topped with fresh tomatoes, basil, and garlic",
      price: 8.99,
      imageUrl: "/placeholder.jpg",
      dietaryTags: ["Vegetarian"],
      allergenInfo: ["Gluten"],
      tasteTags: ["Fresh", "Herby"],
      promoTags: [],
      isAvailable: true,
      isFeatured: true,
      displayOrder: 1,
      preparationTime: 10,
      calories: 180,
    })

    await DatabaseService.createMenuItem({
      restaurantId,
      categoryId: mainCategory.id,
      name: "Spaghetti Carbonara",
      description: "Classic Roman pasta with eggs, cheese, pancetta, and black pepper",
      price: 16.99,
      imageUrl: "/placeholder.jpg",
      dietaryTags: [],
      allergenInfo: ["Eggs", "Dairy", "Gluten"],
      tasteTags: ["Creamy", "Savory"],
      promoTags: ["Chef's Special"],
      isAvailable: true,
      isFeatured: true,
      displayOrder: 1,
      preparationTime: 15,
      calories: 580,
    })

    await DatabaseService.createMenuItem({
      restaurantId,
      categoryId: dessertsCategory.id,
      name: "Tiramisu",
      description: "Traditional Italian dessert with coffee-soaked ladyfingers and mascarpone",
      price: 7.99,
      imageUrl: "/placeholder.jpg",
      dietaryTags: ["Vegetarian"],
      allergenInfo: ["Eggs", "Dairy", "Gluten"],
      tasteTags: ["Sweet", "Coffee"],
      promoTags: [],
      isAvailable: true,
      isFeatured: false,
      displayOrder: 1,
      preparationTime: 5,
      calories: 320,
    })
  } catch (error) {
    console.error("Error creating demo menu data:", error)
  }
}

// Helper function to create demo reviews
async function createDemoReviews(restaurantId: string) {
  try {
    const reviews = [
      {
        restaurantId,
        customerName: "Sarah Johnson",
        customerEmail: "sarah.j@email.com",
        rating: 5,
        title: "Amazing Italian Food!",
        content: "The carbonara was absolutely perfect. Authentic flavors and great service. Will definitely be back!",
        isVerified: true,
        isPublished: true,
        source: "Google",
        sourceId: "google_123",
        helpfulCount: 12,
        response: "Thank you so much for your kind words, Sarah! We're thrilled you enjoyed the carbonara.",
        respondedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        restaurantId,
        customerName: "Mike Chen",
        customerEmail: "mike.chen@email.com",
        rating: 4,
        title: "Great atmosphere",
        content: "Lovely restaurant with authentic Italian vibes. The tiramisu was exceptional!",
        isVerified: true,
        isPublished: true,
        source: "Yelp",
        sourceId: "yelp_456",
        helpfulCount: 8,
        response: "Thanks Mike! We're so glad you enjoyed the atmosphere and our tiramisu.",
        respondedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        restaurantId,
        customerName: "Emma Davis",
        customerEmail: "emma.davis@email.com",
        rating: 5,
        title: "Perfect date night spot",
        content: "Romantic setting, delicious food, and excellent service. The bruschetta was fresh and flavorful.",
        isVerified: true,
        isPublished: true,
        source: "TripAdvisor",
        sourceId: "trip_789",
        helpfulCount: 15,
        response: undefined,
        respondedAt: undefined,
      },
    ]

    for (const review of reviews) {
      await DatabaseService.createReview(review)
    }
  } catch (error) {
    console.error("Error creating demo reviews:", error)
  }
}

// Helper function to create demo analytics
async function createDemoAnalytics(restaurantId: string) {
  try {
    const today = new Date()
    const analytics = []

    // Create analytics for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      const baseViews = 50 + Math.floor(Math.random() * 100)
      const baseOrders = 10 + Math.floor(Math.random() * 20)

      analytics.push({
        restaurantId,
        date: date.toISOString().split("T")[0],
        profileViews: baseViews,
        menuViews: Math.floor(baseViews * 0.7),
        reviewCount: Math.floor(Math.random() * 3),
        averageRating: 4.2 + Math.random() * 0.8,
        totalOrders: baseOrders,
        revenue: baseOrders * (15 + Math.random() * 10),
        customerVisits: baseOrders + Math.floor(Math.random() * 5),
        conversionRate: 0.15 + Math.random() * 0.1,
        metrics: {
          topMenuItem: "Spaghetti Carbonara",
          peakHour: "19:00",
          averageOrderValue: 25.5 + Math.random() * 10,
        },
      })
    }

    for (const analyticsData of analytics) {
      await DatabaseService.createOrUpdateAnalytics(analyticsData)
    }
  } catch (error) {
    console.error("Error creating demo analytics:", error)
  }
}
