import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Restaurant templates for different cuisines
const restaurantTemplates = [
  {
    name: "Spice Garden",
    cuisine_type: "Indian",
    restaurant_type: "Casual Dining",
    price_range: "$$",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    description:
      "Authentic Indian cuisine with a modern twist, featuring traditional recipes passed down through generations. Our chefs use only the finest spices and locally sourced ingredients to create memorable dining experiences.",
    tagline: "Where tradition meets innovation",
    concept: "Traditional Indian hospitality meets contemporary dining",
    primary_color: "#e65c00",
    secondary_color: "#f9a602",
    seating_capacity: 80,
    established_year: 2015,
  },
  {
    name: "Bella Vista",
    cuisine_type: "Italian",
    restaurant_type: "Fine Dining",
    price_range: "$$$",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    description:
      "Authentic Italian flavors brought to India with imported ingredients and traditional cooking methods. Our wood-fired oven and handmade pasta create an unforgettable Italian experience.",
    tagline: "Authentic Italian, Bangalore heart",
    concept: "Rustic Italian charm in urban setting",
    primary_color: "#2d5016",
    secondary_color: "#8bc34a",
    seating_capacity: 60,
    established_year: 2018,
  },
  {
    name: "Dragon Palace",
    cuisine_type: "Chinese",
    restaurant_type: "Casual Dining",
    price_range: "$$",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    description:
      "Traditional Chinese cuisine with Indo-Chinese fusion options for the local palate. Fresh ingredients and authentic cooking techniques bring you the best of both worlds.",
    tagline: "Authentic flavors from the East",
    concept: "Traditional Chinese cooking with local influences",
    primary_color: "#d32f2f",
    secondary_color: "#ffd700",
    seating_capacity: 100,
    established_year: 2012,
  },
  {
    name: "Café Mocha",
    cuisine_type: "Continental",
    restaurant_type: "Café",
    price_range: "$",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    description:
      "Cozy café serving continental breakfast, artisanal coffee, and light meals. Perfect for work meetings, casual dates, or a quiet coffee break.",
    tagline: "Your daily dose of comfort",
    concept: "European café culture meets Indian warmth",
    primary_color: "#5d4037",
    secondary_color: "#ffcc80",
    seating_capacity: 40,
    established_year: 2020,
  },
  {
    name: "Taco Fiesta",
    cuisine_type: "Mexican",
    restaurant_type: "Quick Service",
    price_range: "$",
    city: "Gurgaon",
    state: "Haryana",
    country: "India",
    description:
      "Fresh Mexican street food with authentic spices and locally sourced ingredients. Fast, fresh, and full of flavor.",
    tagline: "¡Viva la comida!",
    concept: "Mexican street food culture",
    primary_color: "#ff5722",
    secondary_color: "#4caf50",
    seating_capacity: 50,
    established_year: 2019,
  },
  {
    name: "Sakura Sushi",
    cuisine_type: "Japanese",
    restaurant_type: "Fine Dining",
    price_range: "$$$",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    description:
      "Authentic Japanese cuisine with fresh sushi, sashimi, and traditional hot dishes. Experience the art of Japanese dining.",
    tagline: "The art of Japanese dining",
    concept: "Traditional Japanese aesthetics and flavors",
    primary_color: "#1a237e",
    secondary_color: "#ff4081",
    seating_capacity: 45,
    established_year: 2017,
  },
  {
    name: "Curry Express",
    cuisine_type: "South Indian",
    restaurant_type: "Quick Service",
    price_range: "$",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    description:
      "Fast-casual South Indian restaurant specializing in dosas, idlis, and regional curries. Authentic flavors served quickly.",
    tagline: "South Indian flavors, express style",
    concept: "Traditional South Indian recipes, modern service",
    primary_color: "#388e3c",
    secondary_color: "#ff9800",
    seating_capacity: 70,
    established_year: 2016,
  },
  {
    name: "The Burger Joint",
    cuisine_type: "American",
    restaurant_type: "Casual Dining",
    price_range: "$$",
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
    description:
      "Gourmet burgers with locally sourced ingredients and creative fusion flavors. American classics with Indian twists.",
    tagline: "Burgers redefined",
    concept: "American classics with Indian twists",
    primary_color: "#bf360c",
    secondary_color: "#ffc107",
    seating_capacity: 65,
    established_year: 2021,
  },
  {
    name: "Mediterranean Breeze",
    cuisine_type: "Mediterranean",
    restaurant_type: "Casual Dining",
    price_range: "$$",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    description:
      "Fresh Mediterranean cuisine featuring grilled meats, fresh salads, and aromatic herbs. Healthy and delicious.",
    tagline: "Fresh flavors from the Mediterranean",
    concept: "Healthy Mediterranean lifestyle",
    primary_color: "#0277bd",
    secondary_color: "#81c784",
    seating_capacity: 55,
    established_year: 2019,
  },
  {
    name: "Royal Thali",
    cuisine_type: "Rajasthani",
    restaurant_type: "Traditional",
    price_range: "$$",
    city: "Udaipur",
    state: "Rajasthan",
    country: "India",
    description:
      "Traditional Rajasthani thali experience with royal recipes and cultural ambiance. Taste the heritage of Rajasthan.",
    tagline: "Taste the royal heritage",
    concept: "Royal Rajasthani dining experience",
    primary_color: "#7b1fa2",
    secondary_color: "#ff6f00",
    seating_capacity: 90,
    established_year: 2010,
  },
]

// Menu item templates by cuisine
const menuTemplates = {
  Indian: {
    categories: [
      {
        name: "Appetizers",
        description: "Start your meal with our delicious appetizers",
        items: [
          {
            name: "Samosa Chaat",
            description: "Crispy samosas topped with tangy chutneys, yogurt, and fresh herbs",
            price: 8.99,
            taste_tags: ["spicy", "tangy"],
            dietary_tags: ["vegetarian"],
          },
          {
            name: "Chicken Tikka",
            description: "Marinated chicken pieces grilled to perfection in our tandoor",
            price: 12.99,
            taste_tags: ["spicy", "grilled"],
            dietary_tags: ["non-vegetarian"],
          },
          {
            name: "Paneer Tikka",
            description: "Cottage cheese marinated in aromatic spices and grilled",
            price: 10.99,
            taste_tags: ["mild", "grilled"],
            dietary_tags: ["vegetarian"],
          },
        ],
      },
      {
        name: "Main Course",
        description: "Our signature main dishes",
        items: [
          {
            name: "Butter Chicken",
            description: "Tender chicken in rich tomato cream sauce with aromatic spices",
            price: 16.99,
            taste_tags: ["mild", "creamy"],
            dietary_tags: ["non-vegetarian"],
          },
          {
            name: "Dal Makhani",
            description: "Slow-cooked black lentils in creamy gravy with butter and cream",
            price: 13.99,
            taste_tags: ["mild", "creamy"],
            dietary_tags: ["vegetarian"],
          },
          {
            name: "Biryani",
            description: "Fragrant basmati rice layered with spiced meat and aromatic herbs",
            price: 18.99,
            taste_tags: ["aromatic", "spiced"],
            dietary_tags: ["non-vegetarian"],
          },
        ],
      },
      {
        name: "Breads",
        description: "Freshly baked Indian breads",
        items: [
          {
            name: "Garlic Naan",
            description: "Soft bread topped with garlic and fresh herbs",
            price: 3.99,
            taste_tags: ["mild", "aromatic"],
            dietary_tags: ["vegetarian"],
          },
          {
            name: "Roti",
            description: "Traditional whole wheat flatbread",
            price: 2.99,
            taste_tags: ["plain"],
            dietary_tags: ["vegetarian", "vegan"],
          },
        ],
      },
    ],
  },
  Italian: {
    categories: [
      {
        name: "Antipasti",
        description: "Traditional Italian starters",
        items: [
          {
            name: "Bruschetta",
            description: "Grilled bread topped with fresh tomatoes, basil, and olive oil",
            price: 9.99,
            taste_tags: ["fresh", "herby"],
            dietary_tags: ["vegetarian"],
          },
          {
            name: "Antipasto Platter",
            description: "Selection of cured meats, cheeses, and marinated vegetables",
            price: 16.99,
            taste_tags: ["savory", "rich"],
            dietary_tags: ["non-vegetarian"],
          },
        ],
      },
      {
        name: "Pasta",
        description: "Handmade pasta dishes",
        items: [
          {
            name: "Spaghetti Carbonara",
            description: "Creamy pasta with pancetta, eggs, and parmesan cheese",
            price: 14.99,
            taste_tags: ["creamy", "rich"],
            dietary_tags: ["non-vegetarian"],
          },
          {
            name: "Penne Arrabbiata",
            description: "Spicy tomato sauce with garlic, chili, and fresh herbs",
            price: 12.99,
            taste_tags: ["spicy", "tangy"],
            dietary_tags: ["vegetarian"],
          },
          {
            name: "Fettuccine Alfredo",
            description: "Rich cream sauce with parmesan cheese and black pepper",
            price: 13.99,
            taste_tags: ["creamy", "mild"],
            dietary_tags: ["vegetarian"],
          },
        ],
      },
      {
        name: "Pizza",
        description: "Wood-fired authentic pizzas",
        items: [
          {
            name: "Margherita",
            description: "Classic pizza with mozzarella, tomatoes, and fresh basil",
            price: 11.99,
            taste_tags: ["classic", "fresh"],
            dietary_tags: ["vegetarian"],
          },
          {
            name: "Pepperoni",
            description: "Spicy pepperoni with mozzarella cheese and tomato sauce",
            price: 14.99,
            taste_tags: ["spicy", "savory"],
            dietary_tags: ["non-vegetarian"],
          },
        ],
      },
    ],
  },
  Chinese: {
    categories: [
      {
        name: "Dim Sum",
        description: "Traditional Chinese dumplings",
        items: [
          {
            name: "Chicken Momos",
            description: "Steamed dumplings filled with seasoned chicken",
            price: 8.99,
            taste_tags: ["savory", "steamed"],
            dietary_tags: ["non-vegetarian"],
          },
          {
            name: "Veg Spring Rolls",
            description: "Crispy rolls filled with fresh vegetables and herbs",
            price: 7.99,
            taste_tags: ["crispy", "fresh"],
            dietary_tags: ["vegetarian"],
          },
        ],
      },
      {
        name: "Main Course",
        description: "Authentic Chinese dishes",
        items: [
          {
            name: "Sweet & Sour Chicken",
            description: "Battered chicken pieces in tangy sweet and sour sauce",
            price: 15.99,
            taste_tags: ["sweet", "tangy"],
            dietary_tags: ["non-vegetarian"],
          },
          {
            name: "Kung Pao Chicken",
            description: "Spicy chicken stir-fry with peanuts and vegetables",
            price: 16.99,
            taste_tags: ["spicy", "nutty"],
            dietary_tags: ["non-vegetarian"],
          },
          {
            name: "Ma Po Tofu",
            description: "Silky tofu in spicy Sichuan sauce with ground pork",
            price: 12.99,
            taste_tags: ["spicy", "silky"],
            dietary_tags: ["vegetarian"],
          },
        ],
      },
      {
        name: "Rice & Noodles",
        description: "Fried rice and noodle dishes",
        items: [
          {
            name: "Chicken Fried Rice",
            description: "Wok-fried rice with chicken, vegetables, and soy sauce",
            price: 11.99,
            taste_tags: ["savory", "wok-fried"],
            dietary_tags: ["non-vegetarian"],
          },
          {
            name: "Hakka Noodles",
            description: "Stir-fried noodles with vegetables and soy sauce",
            price: 10.99,
            taste_tags: ["savory", "stir-fried"],
            dietary_tags: ["vegetarian"],
          },
        ],
      },
    ],
  },
}

// Review templates with realistic content
const reviewTemplates = [
  {
    rating: 5,
    title: "Amazing Experience!",
    content:
      "The food was absolutely delicious and the service was exceptional. The staff was attentive and the ambiance was perfect for our anniversary dinner. Will definitely come back!",
    sentiment: "positive",
    topics: ["food_quality", "service", "ambiance", "overall_experience"],
  },
  {
    rating: 4,
    title: "Great food, good service",
    content:
      "Really enjoyed the meal. The flavors were authentic and the staff was friendly. Only minor complaint is the wait time during peak hours, but the food made up for it.",
    sentiment: "positive",
    topics: ["food_quality", "service", "wait_time"],
  },
  {
    rating: 3,
    title: "Average experience",
    content:
      "Food was okay, nothing special. Service was decent but could be improved. The ambiance was nice though, and the prices are reasonable.",
    sentiment: "neutral",
    topics: ["food_quality", "service", "ambiance", "pricing"],
  },
  {
    rating: 2,
    title: "Disappointing visit",
    content:
      "Food was cold when served and took too long to arrive. Service was poor and staff seemed uninterested. The place has potential but needs improvement.",
    sentiment: "negative",
    topics: ["food_temperature", "service", "wait_time"],
  },
  {
    rating: 1,
    title: "Terrible experience",
    content:
      "Worst dining experience ever. Food was tasteless, service was rude, and the place was dirty. Overpriced for what you get. Will never return.",
    sentiment: "negative",
    topics: ["food_quality", "service", "cleanliness", "pricing"],
  },
]

// Customer personas
const customerPersonas = [
  {
    age_range: [25, 35],
    income_range: "25-50k",
    visit_frequency: 3,
    avg_spend: 25,
    preferred_time: "dinner",
    loyalty_tier: "regular",
  },
  {
    age_range: [35, 45],
    income_range: "50-100k",
    visit_frequency: 2,
    avg_spend: 45,
    preferred_time: "lunch",
    loyalty_tier: "vip",
  },
  {
    age_range: [20, 30],
    income_range: "15-25k",
    visit_frequency: 1,
    avg_spend: 15,
    preferred_time: "dinner",
    loyalty_tier: "new",
  },
]

export class ComprehensiveMockGenerator {
  async generateAllRestaurants(restaurantCount = 10, includeMedia = true) {
    console.log("🏗️ Starting comprehensive mock data generation...")
    const startTime = Date.now()

    try {
      // Clear existing mock data
      await this.clearExistingMockData()

      // Generate restaurants
      const restaurants = await this.generateRestaurants(restaurantCount)
      console.log(`✅ Generated ${restaurants.length} restaurants`)

      let totalMenuItems = 0
      let totalCustomers = 0
      let totalReviews = 0
      let totalMediaAssets = 0

      // Generate data for each restaurant
      for (const restaurant of restaurants) {
        const menuResult = await this.generateMenuForRestaurant(restaurant)
        const customerResult = await this.generateCustomersForRestaurant(restaurant)
        const reviewResult = await this.generateReviewsForRestaurant(restaurant)
        const marketingResult = await this.generateMarketingDataForRestaurant(restaurant)
        const integrationResult = await this.generatePlatformIntegrationsForRestaurant(restaurant)

        totalMenuItems += menuResult.itemCount
        totalCustomers += customerResult.customerCount
        totalReviews += reviewResult.reviewCount

        if (includeMedia) {
          const mediaResult = await this.generateMediaAssetsForRestaurant(restaurant)
          totalMediaAssets += mediaResult.assetCount
        }
      }

      const endTime = Date.now()
      const generationTime = endTime - startTime

      console.log("🎉 Mock data generation completed successfully!")
      return {
        restaurants,
        totalMenuItems,
        totalCustomers,
        totalReviews,
        totalMediaAssets,
        generationTime,
      }
    } catch (error) {
      console.error("❌ Error generating mock data:", error)
      throw error
    }
  }

  private async clearExistingMockData() {
    const tables = [
      "mock_generated_content",
      "mock_platform_integrations",
      "mock_marketing_campaigns",
      "mock_reviews",
      "mock_customers",
      "mock_menu_items",
      "mock_menu_categories",
      "mock_restaurants",
    ]

    for (const table of tables) {
      await supabase.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000")
    }
  }

  private async generateRestaurants(count = 10) {
    const restaurants = []

    for (let i = 0; i < Math.min(count, restaurantTemplates.length); i++) {
      const template = restaurantTemplates[i]
      const restaurant = {
        ...template,
        slug: template.name.toLowerCase().replace(/\s+/g, "-"),
        postal_code: this.generatePostalCode(),
        phone: this.generatePhoneNumber(),
        email: `contact@${template.name.toLowerCase().replace(/\s+/g, "")}.com`,
        website: `www.${template.name.toLowerCase().replace(/\s+/g, "")}.com`,

        // Generate coordinates (approximate for Indian cities)
        latitude: this.generateLatitude(),
        longitude: this.generateLongitude(),

        // Generate operating hours
        operating_hours: this.generateOperatingHours(),

        // Generate social media
        social_media: this.generateSocialMedia(template.name),

        // Generate amenities
        amenities: this.generateAmenities(),

        // Generate business metrics
        avg_rating: this.randomFloat(3.5, 4.8),
        total_reviews: this.randomInt(50, 300),
        monthly_revenue: this.randomFloat(50000, 500000),
        monthly_orders: this.randomInt(200, 2000),

        // Brand assets
        brand_voice: this.generateBrandVoice(template.cuisine_type),
        brand_positioning: template.restaurant_type.toLowerCase().replace(" ", "_"),
      }

      const { data, error } = await supabase.from("mock_restaurants").insert(restaurant).select().single()

      if (error) throw error
      restaurants.push(data)
    }

    return restaurants
  }

  private async generateMenuForRestaurant(restaurant: any) {
    const cuisineTemplate = menuTemplates[restaurant.cuisine_type as keyof typeof menuTemplates]
    if (!cuisineTemplate) return { itemCount: 0 }

    let itemCount = 0

    for (const categoryTemplate of cuisineTemplate.categories) {
      // Create category
      const { data: category, error: categoryError } = await supabase
        .from("mock_menu_categories")
        .insert({
          restaurant_id: restaurant.id,
          name: categoryTemplate.name,
          description: categoryTemplate.description,
          display_order: cuisineTemplate.categories.indexOf(categoryTemplate),
        })
        .select()
        .single()

      if (categoryError) throw categoryError

      // Create items for this category
      for (const itemTemplate of categoryTemplate.items) {
        const item = {
          restaurant_id: restaurant.id,
          category_id: category.id,
          name: itemTemplate.name,
          description: itemTemplate.description,
          price: itemTemplate.price,
          cost: itemTemplate.price * 0.3, // 30% cost ratio
          image_url: `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(itemTemplate.name)}`,

          taste_tags: itemTemplate.taste_tags,
          dietary_tags: itemTemplate.dietary_tags,
          promo_tags: this.generatePromoTags(),
          spice_level: this.getSpiceLevel(itemTemplate.taste_tags),

          // Nutritional info
          calories: this.randomInt(200, 800),
          protein_g: this.randomFloat(5, 40),
          carbs_g: this.randomFloat(10, 80),
          fat_g: this.randomFloat(5, 30),

          // Performance metrics
          popularity_score: this.randomFloat(0, 1),
          monthly_sales: this.randomInt(10, 200),
          avg_rating: this.randomFloat(3.5, 4.9),
          review_count: this.randomInt(5, 50),

          // AI insights
          pricing_status: this.getPricingStatus(),
          trend: this.getTrend(),

          display_order: categoryTemplate.items.indexOf(itemTemplate),
        }

        const { error: itemError } = await supabase.from("mock_menu_items").insert(item)

        if (itemError) throw itemError
        itemCount++
      }
    }

    return { itemCount }
  }

  private async generateCustomersForRestaurant(restaurant: any) {
    const customerCount = this.randomInt(100, 300)
    const customers = []

    for (let i = 0; i < customerCount; i++) {
      const persona = customerPersonas[this.randomInt(0, customerPersonas.length - 1)]
      const customer = {
        restaurant_id: restaurant.id,
        name: this.generateCustomerName(),
        email: this.generateEmail(),
        phone: this.generatePhoneNumber(),

        // Demographics
        age: this.randomInt(persona.age_range[0], persona.age_range[1]),
        gender: this.randomChoice(["Male", "Female", "Other"]),
        location: `${restaurant.city}, ${restaurant.state}`,
        income_range: persona.income_range,

        // Behavior
        visit_frequency: persona.visit_frequency + this.randomInt(-1, 2),
        avg_spend: persona.avg_spend + this.randomFloat(-10, 20),
        total_spent: persona.avg_spend * persona.visit_frequency * 6 + this.randomFloat(-100, 200),
        last_visit: this.generateRecentDate(),
        first_visit: this.generatePastDate(),

        // Preferences
        preferred_cuisine: [restaurant.cuisine_type],
        dietary_restrictions: this.generateDietaryRestrictions(),
        preferred_time: persona.preferred_time,
        preferred_day: this.randomChoice(["weekday", "weekend"]),

        // Engagement
        loyalty_tier: persona.loyalty_tier,
        churn_risk: this.getChurnRisk(persona.visit_frequency),
        lifetime_value: persona.avg_spend * persona.visit_frequency * 12,
        acquisition_cost: this.randomFloat(10, 50),

        // Communication
        email_subscribed: this.randomBoolean(0.6),
        sms_subscribed: this.randomBoolean(0.4),
        push_notifications: this.randomBoolean(0.7),
      }

      customers.push(customer)
    }

    const { error } = await supabase.from("mock_customers").insert(customers)

    if (error) throw error
    return { customerCount }
  }

  private async generateReviewsForRestaurant(restaurant: any) {
    const reviewCount = this.randomInt(50, 200)
    const reviews = []
    const platforms = ["google", "yelp", "tripadvisor", "zomato", "facebook"]

    for (let i = 0; i < reviewCount; i++) {
      const template = reviewTemplates[this.randomInt(0, reviewTemplates.length - 1)]
      const platform = platforms[this.randomInt(0, platforms.length - 1)]

      const review = {
        restaurant_id: restaurant.id,
        author_name: this.generateCustomerName(),
        rating: Math.max(1, Math.min(5, template.rating + this.randomInt(-1, 1))), // Add some variation
        title: template.title,
        content: this.customizeReviewContent(template.content, restaurant),
        platform: platform,
        platform_review_id: this.generatePlatformReviewId(platform),
        review_date: this.generateReviewDate(),
        verified: this.randomBoolean(0.8),
        helpful_votes: this.randomInt(0, 20),

        // AI analysis
        sentiment: template.sentiment,
        sentiment_score: this.getSentimentScore(template.sentiment),
        topics: template.topics,
        keywords: this.extractKeywords(template.content),

        // Response handling
        has_response: this.randomBoolean(0.6),
        response_text: this.randomBoolean(0.6) ? this.generateResponse(template.sentiment) : null,
        response_date: this.randomBoolean(0.6) ? this.generateResponseDate() : null,
        response_author: "Restaurant Manager",

        is_fake: this.randomBoolean(0.05), // 5% fake reviews
        requires_attention: template.sentiment === "negative",
      }

      reviews.push(review)
    }

    const { error } = await supabase.from("mock_reviews").insert(reviews)

    if (error) throw error
    return { reviewCount }
  }

  private async generateMarketingDataForRestaurant(restaurant: any) {
    const campaigns = [
      {
        restaurant_id: restaurant.id,
        name: "Grand Opening Special",
        description: "50% off on all main courses for the first week",
        campaign_type: "promotion",
        status: "completed",
        budget: 10000,
        spent: 8500,
        start_date: this.generatePastDate(),
        end_date: this.generatePastDate(),
        target_audience: { age: "25-45", location: restaurant.city },
        channels: ["facebook_ads", "google_ads", "email"],
        impressions: 50000,
        clicks: 2500,
        conversions: 125,
        revenue_generated: 25000,
      },
      {
        restaurant_id: restaurant.id,
        name: "Weekend Family Special",
        description: "Kids eat free on weekends",
        campaign_type: "seasonal",
        status: "active",
        budget: 5000,
        spent: 2000,
        start_date: new Date().toISOString(),
        end_date: this.generateFutureDate(),
        target_audience: { demographic: "families", location: restaurant.city },
        channels: ["social", "email"],
        impressions: 15000,
        clicks: 800,
        conversions: 40,
        revenue_generated: 8000,
      },
    ]

    const { error } = await supabase.from("mock_marketing_campaigns").insert(campaigns)

    if (error) throw error
    return { campaignCount: campaigns.length }
  }

  private async generatePlatformIntegrationsForRestaurant(restaurant: any) {
    const platforms = [
      {
        restaurant_id: restaurant.id,
        platform_name: "google",
        platform_id: this.generatePlatformId(),
        is_connected: true,
        auto_sync_menu: true,
        auto_sync_reviews: true,
        last_sync: this.generateRecentDate(),
        platform_rating: restaurant.avg_rating + this.randomFloat(-0.2, 0.2),
        platform_review_count: Math.floor(restaurant.total_reviews * 0.4),
      },
      {
        restaurant_id: restaurant.id,
        platform_name: "zomato",
        platform_id: this.generatePlatformId(),
        is_connected: true,
        auto_sync_menu: false,
        auto_sync_reviews: true,
        last_sync: this.generateRecentDate(),
        platform_rating: restaurant.avg_rating + this.randomFloat(-0.3, 0.1),
        platform_review_count: Math.floor(restaurant.total_reviews * 0.3),
      },
      {
        restaurant_id: restaurant.id,
        platform_name: "swiggy",
        platform_id: this.generatePlatformId(),
        is_connected: true,
        auto_sync_menu: true,
        auto_sync_reviews: false,
        last_sync: this.generateRecentDate(),
        platform_rating: restaurant.avg_rating + this.randomFloat(-0.1, 0.2),
        platform_review_count: Math.floor(restaurant.total_reviews * 0.2),
      },
    ]

    const { error } = await supabase.from("mock_platform_integrations").insert(platforms)

    if (error) throw error
    return { integrationCount: platforms.length }
  }

  private async generateMediaAssetsForRestaurant(restaurant: any) {
    // This would generate media assets in a real implementation
    // For now, we'll just return a count
    return { assetCount: this.randomInt(10, 30) }
  }

  // Utility methods for data generation
  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  private randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min
  }

  private randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  }

  private randomBoolean(probability = 0.5): boolean {
    return Math.random() < probability
  }

  private generatePhoneNumber(): string {
    return `+91 ${this.randomInt(70000, 99999)} ${this.randomInt(10000, 99999)}`
  }

  private generatePostalCode(): string {
    return this.randomInt(100000, 999999).toString()
  }

  private generateLatitude(): number {
    return this.randomFloat(8.0, 37.0) // India's latitude range
  }

  private generateLongitude(): number {
    return this.randomFloat(68.0, 97.0) // India's longitude range
  }

  private generateOperatingHours() {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    const hours: any = {}

    days.forEach((day) => {
      hours[day] = {
        open: "11:00",
        close: day === "friday" || day === "saturday" ? "23:00" : "22:00",
        closed: false,
      }
    })

    return hours
  }

  private generateSocialMedia(restaurantName: string) {
    const slug = restaurantName.toLowerCase().replace(/\s+/g, "")
    return {
      facebook: `https://facebook.com/${slug}`,
      instagram: `https://instagram.com/${slug}`,
      twitter: `https://twitter.com/${slug}`,
    }
  }

  private generateAmenities(): string[] {
    const allAmenities = [
      "Free WiFi",
      "Parking Available",
      "Card Payments",
      "Air Conditioned",
      "Wheelchair Accessible",
      "Pet Friendly",
      "Outdoor Seating",
      "Live Music",
      "Private Dining",
      "Takeaway",
      "Home Delivery",
      "Valet Parking",
    ]

    const count = this.randomInt(4, 8)
    const selected = []

    for (let i = 0; i < count; i++) {
      const amenity = this.randomChoice(allAmenities)
      if (!selected.includes(amenity)) {
        selected.push(amenity)
      }
    }

    return selected
  }

  private generateBrandVoice(cuisine: string): string {
    const voices = {
      Indian: "Warm, traditional, and passionate about authentic flavors",
      Italian: "Rustic, authentic, and family-oriented with Italian charm",
      Chinese: "Fresh, vibrant, and focused on traditional cooking methods",
      Continental: "Sophisticated, modern, and internationally inspired",
      Mexican: "Energetic, colorful, and celebration of Mexican culture",
      Japanese: "Minimalist, precise, and dedicated to culinary artistry",
    }

    return voices[cuisine as keyof typeof voices] || "Friendly, welcoming, and passionate about great food"
  }

  private generatePromoTags(): string[] {
    const tags = ["popular", "signature", "chef-special", "must-try", "top-rated"]
    const count = this.randomInt(0, 2)
    const selected = []

    for (let i = 0; i < count; i++) {
      const tag = this.randomChoice(tags)
      if (!selected.includes(tag)) {
        selected.push(tag)
      }
    }

    return selected
  }

  private getSpiceLevel(tasteTags: string[]): string {
    if (tasteTags.includes("spicy")) return "hot"
    if (tasteTags.includes("mild")) return "mild"
    return "medium"
  }

  private getPricingStatus(): string {
    const statuses = ["optimal", "underpriced", "overpriced"]
    const weights = [0.6, 0.25, 0.15] // 60% optimal, 25% underpriced, 15% overpriced

    const random = Math.random()
    let cumulative = 0

    for (let i = 0; i < statuses.length; i++) {
      cumulative += weights[i]
      if (random <= cumulative) {
        return statuses[i]
      }
    }

    return "optimal"
  }

  private getTrend(): string {
    const trends = ["increasing", "stable", "declining"]
    const weights = [0.3, 0.5, 0.2] // 30% increasing, 50% stable, 20% declining

    const random = Math.random()
    let cumulative = 0

    for (let i = 0; i < trends.length; i++) {
      cumulative += weights[i]
      if (random <= cumulative) {
        return trends[i]
      }
    }

    return "stable"
  }

  private generateCustomerName(): string {
    const firstNames = [
      "Rajesh",
      "Priya",
      "Amit",
      "Sneha",
      "Vikram",
      "Anita",
      "Rohit",
      "Kavya",
      "Arjun",
      "Meera",
      "Sanjay",
      "Pooja",
      "Rahul",
      "Divya",
      "Karan",
      "Riya",
    ]
    const lastNames = [
      "Kumar",
      "Sharma",
      "Patel",
      "Gupta",
      "Singh",
      "Desai",
      "Mehta",
      "Nair",
      "Agarwal",
      "Jain",
      "Reddy",
      "Iyer",
      "Chopra",
      "Malhotra",
      "Bansal",
      "Joshi",
    ]

    return `${this.randomChoice(firstNames)} ${this.randomChoice(lastNames)}`
  }

  private generateEmail(): string {
    const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"]
    const username = Math.random().toString(36).substring(2, 10)
    return `${username}@${this.randomChoice(domains)}`
  }

  private generateRecentDate(): string {
    const now = new Date()
    const daysAgo = this.randomInt(1, 30)
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    return date.toISOString()
  }

  private generatePastDate(): string {
    const now = new Date()
    const daysAgo = this.randomInt(30, 365)
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    return date.toISOString()
  }

  private generateFutureDate(): string {
    const now = new Date()
    const daysFromNow = this.randomInt(1, 90)
    const date = new Date(now.getTime() + daysFromNow * 24 * 60 * 60 * 1000)
    return date.toISOString()
  }

  private generateDietaryRestrictions(): string[] {
    const restrictions = ["vegetarian", "vegan", "gluten-free", "dairy-free", "nut-free"]
    const count = this.randomInt(0, 2)
    const selected = []

    for (let i = 0; i < count; i++) {
      const restriction = this.randomChoice(restrictions)
      if (!selected.includes(restriction)) {
        selected.push(restriction)
      }
    }

    return selected
  }

  private getChurnRisk(visitFrequency: number): string {
    if (visitFrequency >= 3) return "low"
    if (visitFrequency >= 1) return "medium"
    return "high"
  }

  private customizeReviewContent(content: string, restaurant: any): string {
    return content.replace(/restaurant/g, restaurant.name).replace(/food/g, `${restaurant.cuisine_type} food`)
  }

  private generatePlatformReviewId(platform: string): string {
    return `${platform}_${Math.random().toString(36).substring(2, 15)}`
  }

  private generateReviewDate(): string {
    const now = new Date()
    const daysAgo = this.randomInt(1, 180)
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    return date.toISOString()
  }

  private getSentimentScore(sentiment: string): number {
    switch (sentiment) {
      case "positive":
        return this.randomFloat(0.3, 1.0)
      case "negative":
        return this.randomFloat(-1.0, -0.3)
      case "neutral":
        return this.randomFloat(-0.2, 0.2)
      default:
        return 0
    }
  }

  private extractKeywords(content: string): string[] {
    const keywords = content.toLowerCase().match(/\b\w{4,}\b/g) || []
    return keywords.slice(0, 5) // Return first 5 keywords
  }

  private generateResponse(sentiment: string): string {
    const responses = {
      positive: [
        "Thank you so much for your wonderful review! We're delighted you enjoyed your experience with us.",
        "We're thrilled to hear you had a great time! Thank you for choosing us and for your kind words.",
        "Your feedback means the world to us! We look forward to serving you again soon.",
      ],
      negative: [
        "We sincerely apologize for your disappointing experience. We take your feedback seriously and will work to improve.",
        "Thank you for bringing this to our attention. We'd love the opportunity to make things right. Please contact us directly.",
        "We're sorry we didn't meet your expectations. Your feedback helps us improve and we appreciate you taking the time to share it.",
      ],
      neutral: [
        "Thank you for your feedback! We appreciate you taking the time to share your experience with us.",
        "We value your honest review and will use your feedback to continue improving our service.",
        "Thank you for visiting us! We hope to provide an even better experience next time.",
      ],
    }

    const responseArray = responses[sentiment as keyof typeof responses] || responses.neutral
    return this.randomChoice(responseArray)
  }

  private generateResponseDate(): string {
    const now = new Date()
    const daysAgo = this.randomInt(1, 7) // Respond within a week
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    return date.toISOString()
  }

  private generatePlatformId(): string {
    return Math.random().toString(36).substring(2, 15)
  }
}

// Export singleton instance
export const mockGenerator = new ComprehensiveMockGenerator()
