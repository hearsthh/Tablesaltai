import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Enhanced restaurant templates with complete profile data
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
    story:
      "Founded by Chef Rajesh Kumar in 2015, Spice Garden began as a dream to bring authentic Indian flavors to the heart of Mumbai. What started as a small family restaurant has grown into a beloved dining destination.",
    history:
      "Our journey began with Chef Rajesh's grandmother's recipes, carefully preserved and adapted for modern palates while maintaining their authentic essence.",
    primary_color: "#e65c00",
    secondary_color: "#f9a602",
    accent_color: "#8b4513",
    seating_capacity: 80,
    established_year: 2015,

    // Chef Information
    chef_name: "Rajesh Kumar",
    chef_title: "Executive Chef & Owner",
    chef_bio:
      "With over 15 years of culinary experience, Chef Rajesh Kumar specializes in North Indian cuisine and modern interpretations of traditional dishes. He trained under renowned chefs in Delhi and Mumbai before opening Spice Garden.",
    chef_experience_years: 15,
    chef_specialties: ["North Indian Cuisine", "Tandoor Cooking", "Spice Blending", "Modern Indian Fusion"],
    chef_awards: ["Best Chef Mumbai 2020", "Traditional Cooking Excellence Award 2019"],

    // Brand and Visual Identity
    brand_voice: "Warm, traditional, and passionate about authentic flavors",
    brand_positioning: "casual_dining",
    brand_guidelines: "Always emphasize authenticity, tradition, and family values in all communications.",

    // Amenities and Features
    amenities: ["Free WiFi", "Air Conditioned", "Parking Available", "Card Payments", "Takeaway", "Home Delivery"],
    payment_methods: ["Cash", "Credit Card", "Debit Card", "UPI", "Digital Wallets"],
    dining_options: ["Dine-in", "Takeaway", "Home Delivery"],
    special_features: ["Live Cooking Counter", "Private Dining Area", "Outdoor Seating"],
    accessibility_features: ["Wheelchair Accessible", "Ground Floor Access"],
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
    story:
      "Chef Marco Rossi brought his family's 100-year-old recipes from Tuscany to Bangalore, creating an authentic Italian dining experience that transports guests to the heart of Italy.",
    history:
      "Established in 2018, Bella Vista was born from Chef Marco's passion for sharing authentic Italian cuisine with Indian food lovers.",
    primary_color: "#2d5016",
    secondary_color: "#8bc34a",
    accent_color: "#c62828",
    seating_capacity: 60,
    established_year: 2018,

    chef_name: "Marco Rossi",
    chef_title: "Head Chef",
    chef_bio:
      "Born in Tuscany, Chef Marco brings authentic Italian cooking techniques and family recipes to Bangalore. He specializes in handmade pasta and wood-fired cooking.",
    chef_experience_years: 20,
    chef_specialties: ["Handmade Pasta", "Wood-fired Cooking", "Tuscan Cuisine", "Wine Pairing"],
    chef_awards: ["Best Italian Chef India 2021", "Authentic Cuisine Award 2020"],

    brand_voice: "Rustic, authentic, and family-oriented with Italian charm",
    brand_positioning: "fine_dining",
    brand_guidelines: "Emphasize authenticity, family traditions, and the Italian way of life.",

    amenities: ["Free WiFi", "Air Conditioned", "Valet Parking", "Wine Cellar", "Private Dining"],
    payment_methods: ["Cash", "Credit Card", "Debit Card", "UPI"],
    dining_options: ["Dine-in", "Private Events", "Wine Tasting"],
    special_features: ["Wood-fired Oven", "Wine Cellar", "Chef's Table", "Outdoor Terrace"],
    accessibility_features: ["Wheelchair Accessible", "Elevator Access"],
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
    story:
      "Master Chef Li Wei established Dragon Palace to showcase authentic Chinese cuisine while respecting local tastes and preferences.",
    history:
      "Since 2012, Dragon Palace has been Delhi's go-to destination for authentic Chinese cuisine with a perfect blend of traditional and fusion dishes.",
    primary_color: "#d32f2f",
    secondary_color: "#ffd700",
    accent_color: "#1976d2",
    seating_capacity: 100,
    established_year: 2012,

    chef_name: "Li Wei",
    chef_title: "Master Chef",
    chef_bio:
      "Master Chef Li Wei trained in Beijing and Shanghai before bringing authentic Chinese cooking techniques to India. He specializes in Szechuan and Cantonese cuisine.",
    chef_experience_years: 18,
    chef_specialties: ["Szechuan Cuisine", "Cantonese Cooking", "Dim Sum", "Wok Cooking"],
    chef_awards: ["Best Chinese Chef Delhi 2019", "Authentic Asian Cuisine Award 2018"],

    brand_voice: "Fresh, vibrant, and focused on traditional cooking methods",
    brand_positioning: "casual_dining",
    brand_guidelines: "Highlight authenticity, freshness, and the balance of flavors in Chinese cuisine.",

    amenities: ["Free WiFi", "Air Conditioned", "Parking Available", "Card Payments", "Takeaway", "Home Delivery"],
    payment_methods: ["Cash", "Credit Card", "Debit Card", "UPI", "Digital Wallets"],
    dining_options: ["Dine-in", "Takeaway", "Home Delivery", "Catering"],
    special_features: ["Live Wok Station", "Dim Sum Counter", "Tea Ceremony"],
    accessibility_features: ["Wheelchair Accessible", "Ground Floor Access"],
  },
  // Add more restaurant templates...
]

// Enhanced menu templates with detailed items
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
            short_description: "Crispy samosas with tangy toppings",
            ingredients: ["Samosa", "Yogurt", "Tamarind Chutney", "Mint Chutney", "Onions", "Sev"],
            price: 8.99,
            preparation_time: 10,
            calories_per_serving: 320,
            taste_tags: ["spicy", "tangy", "crispy"],
            dietary_tags: ["vegetarian"],
            spice_level: "medium",
            portion_size: "regular",
          },
          {
            name: "Chicken Tikka",
            description: "Marinated chicken pieces grilled to perfection in our tandoor",
            short_description: "Tandoor-grilled marinated chicken",
            ingredients: ["Chicken", "Yogurt", "Ginger-Garlic Paste", "Spices", "Lemon"],
            price: 12.99,
            preparation_time: 20,
            calories_per_serving: 280,
            taste_tags: ["spicy", "grilled", "smoky"],
            dietary_tags: ["non-vegetarian", "high-protein"],
            spice_level: "medium",
            portion_size: "regular",
          },
          {
            name: "Paneer Tikka",
            description: "Cottage cheese marinated in aromatic spices and grilled",
            short_description: "Grilled spiced cottage cheese",
            ingredients: ["Paneer", "Bell Peppers", "Onions", "Yogurt", "Spices"],
            price: 10.99,
            preparation_time: 15,
            calories_per_serving: 250,
            taste_tags: ["mild", "grilled", "creamy"],
            dietary_tags: ["vegetarian", "high-protein"],
            spice_level: "mild",
            portion_size: "regular",
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
            short_description: "Creamy tomato chicken curry",
            ingredients: ["Chicken", "Tomatoes", "Cream", "Butter", "Onions", "Spices"],
            price: 16.99,
            preparation_time: 25,
            calories_per_serving: 420,
            taste_tags: ["mild", "creamy", "rich"],
            dietary_tags: ["non-vegetarian"],
            spice_level: "mild",
            portion_size: "large",
          },
          {
            name: "Dal Makhani",
            description: "Slow-cooked black lentils in creamy gravy with butter and cream",
            short_description: "Creamy black lentil curry",
            ingredients: ["Black Lentils", "Kidney Beans", "Cream", "Butter", "Tomatoes", "Spices"],
            price: 13.99,
            preparation_time: 30,
            calories_per_serving: 350,
            taste_tags: ["mild", "creamy", "rich"],
            dietary_tags: ["vegetarian", "high-protein"],
            spice_level: "mild",
            portion_size: "large",
          },
        ],
      },
    ],
  },
  // Add more cuisine templates...
}

// Review templates for different platforms
const platformReviewTemplates = {
  google: [
    {
      rating: 5,
      title: "Excellent food and service!",
      content:
        "Had an amazing dinner here last night. The butter chicken was perfectly creamy and the naan was fresh and warm. Service was attentive without being intrusive. Highly recommend!",
      sentiment: "positive",
      topics: ["food_quality", "service", "ambiance"],
      food_rating: 5,
      service_rating: 5,
      ambiance_rating: 4,
      value_rating: 4,
    },
    {
      rating: 4,
      title: "Great food, could improve wait times",
      content:
        "The food was delicious and authentic. Loved the spice levels and flavors. Only complaint is the wait time during peak hours - took about 45 minutes for our order. But worth the wait!",
      sentiment: "positive",
      topics: ["food_quality", "wait_time", "authenticity"],
      food_rating: 5,
      service_rating: 3,
      ambiance_rating: 4,
      value_rating: 4,
    },
  ],
  zomato: [
    {
      rating: 5,
      title: "Must visit for authentic Indian food",
      content:
        "This place serves the most authentic Indian food I've had in Mumbai. The chef clearly knows what they're doing. Every dish was perfectly spiced and flavorful. The ambiance is cozy and perfect for family dinners.",
      sentiment: "positive",
      topics: ["authenticity", "food_quality", "ambiance", "family_friendly"],
      food_rating: 5,
      service_rating: 4,
      ambiance_rating: 5,
      value_rating: 4,
    },
    {
      rating: 3,
      title: "Average experience",
      content:
        "Food was okay, nothing extraordinary. Service was decent but could be more attentive. The place is clean and well-maintained. Prices are reasonable for the portion sizes.",
      sentiment: "neutral",
      topics: ["food_quality", "service", "cleanliness", "pricing"],
      food_rating: 3,
      service_rating: 3,
      ambiance_rating: 4,
      value_rating: 4,
    },
  ],
  tripadvisor: [
    {
      rating: 4,
      title: "Great local dining experience",
      content:
        "Found this gem through TripAdvisor recommendations. The local flavors are authentic and the staff is knowledgeable about the menu. Perfect for tourists wanting to try real Indian cuisine.",
      sentiment: "positive",
      topics: ["authenticity", "local_experience", "staff_knowledge", "tourist_friendly"],
      food_rating: 4,
      service_rating: 4,
      ambiance_rating: 4,
      value_rating: 4,
    },
  ],
}

export class CompleteRestaurantGenerator {
  async generateCompleteRestaurantData(restaurantCount = 10) {
    console.log("🏗️ Starting complete restaurant data generation...")
    const startTime = Date.now()

    try {
      // Clear existing data
      await this.clearExistingData()

      // Generate restaurants with complete profiles
      const restaurants = await this.generateRestaurants(restaurantCount)
      console.log(`✅ Generated ${restaurants.length} restaurants`)

      const totalStats = {
        menuItems: 0,
        customers: 0,
        reviews: 0,
        awards: 0,
        mediaAssets: 0,
        salesRecords: 0,
      }

      // Generate comprehensive data for each restaurant
      for (const restaurant of restaurants) {
        const stats = await this.generateCompleteRestaurantProfile(restaurant)

        totalStats.menuItems += stats.menuItems
        totalStats.customers += stats.customers
        totalStats.reviews += stats.reviews
        totalStats.awards += stats.awards
        totalStats.mediaAssets += stats.mediaAssets
        totalStats.salesRecords += stats.salesRecords
      }

      const endTime = Date.now()
      const generationTime = endTime - startTime

      console.log("🎉 Complete restaurant data generation completed!")
      return {
        restaurants,
        totalStats,
        generationTime,
      }
    } catch (error) {
      console.error("❌ Error generating complete restaurant data:", error)
      throw error
    }
  }

  private async clearExistingData() {
    const tables = [
      "mock_daily_sales",
      "mock_media_assets",
      "mock_awards_certifications",
      "mock_press_coverage",
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
        address: this.generateAddress(template.city, template.state),
        postal_code: this.generatePostalCode(),
        phone: this.generatePhoneNumber(),
        email: `contact@${template.name.toLowerCase().replace(/\s+/g, "")}.com`,
        website: `www.${template.name.toLowerCase().replace(/\s+/g, "")}.com`,

        // Generate coordinates
        latitude: this.generateLatitude(),
        longitude: this.generateLongitude(),

        // Generate URLs for media assets
        logo_url: `/placeholder.svg?height=100&width=200&text=${encodeURIComponent(template.name + " Logo")}`,
        logo_dark_url: `/placeholder.svg?height=100&width=200&text=${encodeURIComponent(template.name + " Dark Logo")}`,
        favicon_url: `/placeholder.svg?height=32&width=32&text=${encodeURIComponent(template.name.charAt(0))}`,
        hero_image_url: `/placeholder.svg?height=400&width=800&text=${encodeURIComponent(template.name + " Hero")}`,
        cover_image_url: `/placeholder.svg?height=300&width=1200&text=${encodeURIComponent(template.name + " Cover")}`,
        chef_photo_url: `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(template.chef_name)}`,

        // Generate image arrays
        interior_images: this.generateImageUrls("interior", template.name, 5),
        exterior_images: this.generateImageUrls("exterior", template.name, 3),
        food_images: this.generateImageUrls("food", template.name, 10),
        ambiance_images: this.generateImageUrls("ambiance", template.name, 4),

        // Generate operating hours
        operating_hours: this.generateOperatingHours(),

        // Generate social media
        social_media: this.generateSocialMedia(template.name),
        social_media_followers: this.generateSocialMediaFollowers(),

        // Generate business metrics
        avg_rating: this.randomFloat(3.5, 4.8),
        total_reviews: this.randomInt(150, 500),
        monthly_revenue: this.randomFloat(100000, 800000),
        monthly_orders: this.randomInt(500, 3000),
        avg_order_value: this.randomFloat(25, 85),
        customer_satisfaction_score: this.randomFloat(3.8, 4.9),

        // Recognition counts
        awards_count: this.randomInt(2, 8),
        certifications_count: this.randomInt(1, 5),
        press_mentions_count: this.randomInt(3, 15),

        // Status flags
        is_active: true,
        is_verified: this.randomBoolean(0.8),
        verification_date: this.randomBoolean(0.8) ? this.generatePastDate() : null,

        // AI settings
        ai_profile_generated: true,
        auto_response_enabled: this.randomBoolean(0.6),
        content_sync_enabled: true,
      }

      const { data, error } = await supabase.from("mock_restaurants").insert(restaurant).select().single()
      if (error) throw error

      restaurants.push(data)
    }

    return restaurants
  }

  private async generateCompleteRestaurantProfile(restaurant: any) {
    const stats = {
      menuItems: 0,
      customers: 0,
      reviews: 0,
      awards: 0,
      mediaAssets: 0,
      salesRecords: 0,
    }

    // Generate awards and certifications
    stats.awards = await this.generateAwardsAndCertifications(restaurant)

    // Generate press coverage
    await this.generatePressCoverage(restaurant)

    // Generate media assets
    stats.mediaAssets = await this.generateMediaAssets(restaurant)

    // Generate menu with categories and items
    stats.menuItems = await this.generateCompleteMenu(restaurant)

    // Generate daily sales data for last 45 days
    stats.salesRecords = await this.generateDailySalesData(restaurant)

    // Generate customers
    stats.customers = await this.generateCustomers(restaurant)

    // Generate reviews from multiple platforms
    stats.reviews = await this.generateMultiPlatformReviews(restaurant)

    // Generate marketing campaigns
    await this.generateMarketingCampaigns(restaurant)

    // Generate platform integrations
    await this.generatePlatformIntegrations(restaurant)

    return stats
  }

  private async generateAwardsAndCertifications(restaurant: any) {
    const awards = [
      {
        restaurant_id: restaurant.id,
        type: "award",
        title: "Best Restaurant of the Year",
        description: `${restaurant.name} was recognized as the best ${restaurant.cuisine_type} restaurant in ${restaurant.city}`,
        issuing_organization: `${restaurant.city} Restaurant Association`,
        date_received: this.generatePastDate(365),
        category: "overall_excellence",
        level: "city",
        year: new Date().getFullYear() - 1,
        is_featured: true,
        display_order: 1,
      },
      {
        restaurant_id: restaurant.id,
        type: "certification",
        title: "Food Safety Excellence",
        description: "Certified for maintaining highest standards of food safety and hygiene",
        issuing_organization: "Food Safety and Standards Authority",
        date_received: this.generatePastDate(180),
        expiry_date: this.generateFutureDate(365),
        category: "food_safety",
        level: "national",
        year: new Date().getFullYear(),
        is_featured: false,
        display_order: 2,
      },
      {
        restaurant_id: restaurant.id,
        type: "award",
        title: "Customer Choice Award",
        description: "Voted by customers as their favorite dining destination",
        issuing_organization: "Diner's Choice Awards",
        date_received: this.generatePastDate(90),
        category: "customer_satisfaction",
        level: "regional",
        year: new Date().getFullYear(),
        is_featured: true,
        display_order: 3,
      },
    ]

    const { error } = await supabase.from("mock_awards_certifications").insert(awards)
    if (error) throw error

    return awards.length
  }

  private async generatePressCoverage(restaurant: any) {
    const coverage = [
      {
        restaurant_id: restaurant.id,
        title: `${restaurant.name}: A Culinary Journey Through ${restaurant.cuisine_type} Flavors`,
        publication: "Food & Wine Magazine",
        author: "Sarah Johnson",
        publication_date: this.generatePastDate(60),
        article_url: `https://foodandwine.com/restaurants/${restaurant.slug}-review`,
        excerpt: `Discover the authentic flavors and warm hospitality that make ${restaurant.name} a standout destination for ${restaurant.cuisine_type} cuisine.`,
        coverage_type: "feature",
        sentiment: "positive",
        reach_estimate: 50000,
        social_shares: 245,
        social_engagement: 1200,
        is_featured: true,
        display_order: 1,
      },
      {
        restaurant_id: restaurant.id,
        title: `Top 10 ${restaurant.cuisine_type} Restaurants in ${restaurant.city}`,
        publication: "City Food Guide",
        author: "Michael Chen",
        publication_date: this.generatePastDate(120),
        article_url: `https://cityfoodguide.com/top-${restaurant.cuisine_type.toLowerCase()}-restaurants-${restaurant.city.toLowerCase()}`,
        excerpt: `${restaurant.name} makes our list of must-visit ${restaurant.cuisine_type} restaurants with its exceptional food and service.`,
        coverage_type: "review",
        sentiment: "positive",
        reach_estimate: 25000,
        social_shares: 89,
        social_engagement: 456,
        is_featured: false,
        display_order: 2,
      },
    ]

    const { error } = await supabase.from("mock_press_coverage").insert(coverage)
    if (error) throw error

    return coverage.length
  }

  private async generateMediaAssets(restaurant: any) {
    const assets = [
      // Logo assets
      {
        restaurant_id: restaurant.id,
        file_name: `${restaurant.slug}-logo.png`,
        file_url: restaurant.logo_url,
        file_type: "image",
        file_size: 45000,
        mime_type: "image/png",
        width: 200,
        height: 100,
        category: "logo",
        subcategory: "primary",
        title: `${restaurant.name} Logo`,
        description: "Primary logo for the restaurant",
        alt_text: `${restaurant.name} restaurant logo`,
        is_featured: true,
        display_order: 1,
      },
      // Food photos
      {
        restaurant_id: restaurant.id,
        file_name: `${restaurant.slug}-signature-dish.jpg`,
        file_url: `/placeholder.svg?height=400&width=600&text=${encodeURIComponent("Signature Dish")}`,
        file_type: "image",
        file_size: 120000,
        mime_type: "image/jpeg",
        width: 600,
        height: 400,
        category: "food",
        subcategory: "signature_dishes",
        title: "Signature Dish",
        description: "Our most popular signature dish",
        alt_text: "Restaurant signature dish beautifully plated",
        is_featured: true,
        display_order: 1,
      },
      // Interior photos
      {
        restaurant_id: restaurant.id,
        file_name: `${restaurant.slug}-dining-area.jpg`,
        file_url: `/placeholder.svg?height=400&width=600&text=${encodeURIComponent("Dining Area")}`,
        file_type: "image",
        file_size: 95000,
        mime_type: "image/jpeg",
        width: 600,
        height: 400,
        category: "interior",
        subcategory: "dining_area",
        title: "Main Dining Area",
        description: "Our beautifully designed main dining area",
        alt_text: "Restaurant interior showing dining tables and ambiance",
        is_featured: true,
        display_order: 1,
      },
    ]

    const { error } = await supabase.from("mock_media_assets").insert(assets)
    if (error) throw error

    return assets.length
  }

  private async generateCompleteMenu(restaurant: any) {
    const cuisineTemplate = menuTemplates[restaurant.cuisine_type as keyof typeof menuTemplates]
    if (!cuisineTemplate) return 0

    let itemCount = 0

    for (const categoryTemplate of cuisineTemplate.categories) {
      // Create category
      const { data: category, error: categoryError } = await supabase
        .from("mock_menu_categories")
        .insert({
          restaurant_id: restaurant.id,
          name: categoryTemplate.name,
          description: categoryTemplate.description,
          image_url: `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(categoryTemplate.name)}`,
          category_type: "regular",
          is_active: true,
          is_featured: categoryTemplate.name === "Main Course",
          available_days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
          available_times: {
            start: "11:00",
            end: "22:00",
          },
          display_order: cuisineTemplate.categories.indexOf(categoryTemplate),
          color_theme: restaurant.primary_color,
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
          short_description: itemTemplate.short_description,
          ingredients: itemTemplate.ingredients,
          preparation_method: `Traditional ${restaurant.cuisine_type} cooking method`,

          // Pricing
          price: itemTemplate.price,
          cost: itemTemplate.price * 0.35, // 35% cost ratio
          original_price: itemTemplate.price * 1.1, // 10% discount from original
          discount_percentage: 10,

          // Media
          image_url: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(itemTemplate.name)}`,
          gallery_images: [
            `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(itemTemplate.name + " 1")}`,
            `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(itemTemplate.name + " 2")}`,
          ],

          // Classifications
          taste_tags: itemTemplate.taste_tags,
          dietary_tags: itemTemplate.dietary_tags,
          allergen_tags: this.generateAllergenTags(),
          promo_tags: this.generatePromoTags(),
          cuisine_tags: [restaurant.cuisine_type.toLowerCase()],

          // Properties
          spice_level: itemTemplate.spice_level,
          portion_size: itemTemplate.portion_size,
          preparation_time: itemTemplate.preparation_time,
          calories_per_serving: itemTemplate.calories_per_serving,

          // Nutritional info
          protein_g: this.randomFloat(5, 40),
          carbs_g: this.randomFloat(10, 80),
          fat_g: this.randomFloat(5, 30),
          fiber_g: this.randomFloat(2, 15),
          sugar_g: this.randomFloat(1, 20),
          sodium_mg: this.randomFloat(200, 1500),

          // Availability
          is_available: true,
          is_in_stock: this.randomBoolean(0.95),
          stock_quantity: this.randomInt(20, 100),
          low_stock_threshold: 10,

          // Seasonal availability
          is_seasonal: this.randomBoolean(0.2),
          seasonal_months: this.randomBoolean(0.2) ? [6, 7, 8, 9] : null, // Summer items
          available_days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
          available_times: {
            start: "11:00",
            end: "22:00",
          },

          // Performance metrics (last 30 days)
          total_orders: this.randomInt(50, 300),
          total_revenue: this.randomFloat(500, 5000),
          avg_rating: this.randomFloat(3.5, 4.9),
          review_count: this.randomInt(10, 80),
          return_customer_rate: this.randomFloat(0.2, 0.8),

          // AI insights
          popularity_score: this.randomFloat(0.3, 1.0),
          profitability_score: this.randomFloat(0.4, 0.9),
          pricing_status: this.getPricingStatus(),
          demand_trend: this.getTrend(),
          recommended_price: itemTemplate.price * this.randomFloat(0.9, 1.1),

          // Suggestions
          suggested_pairings: [], // Will be populated later
          combo_items: [], // Will be populated later

          // Display settings
          display_order: categoryTemplate.items.indexOf(itemTemplate),
          is_featured: this.randomBoolean(0.3),
          is_bestseller: this.randomBoolean(0.2),
          is_new: this.randomBoolean(0.1),

          last_ordered: this.generateRecentDate(),
        }

        const { error: itemError } = await supabase.from("mock_menu_items").insert(item)
        if (itemError) throw itemError

        itemCount++
      }
    }

    return itemCount
  }

  private async generateDailySalesData(restaurant: any) {
    // Get all menu items for this restaurant
    const { data: menuItems, error } = await supabase
      .from("mock_menu_items")
      .select("id, price, cost")
      .eq("restaurant_id", restaurant.id)

    if (error) throw error
    if (!menuItems || menuItems.length === 0) return 0

    const salesData = []
    const daysToGenerate = 45 // Last 45 days

    for (let dayOffset = 0; dayOffset < daysToGenerate; dayOffset++) {
      const saleDate = new Date()
      saleDate.setDate(saleDate.getDate() - dayOffset)

      for (const item of menuItems) {
        // Generate realistic sales data
        const isWeekend = saleDate.getDay() === 0 || saleDate.getDay() === 6
        const baseQuantity = this.randomInt(5, 25)
        const weekendMultiplier = isWeekend ? 1.5 : 1
        const quantitySold = Math.floor(baseQuantity * weekendMultiplier * this.randomFloat(0.7, 1.3))

        const revenue = quantitySold * item.price
        const cost = quantitySold * item.cost
        const profit = revenue - cost

        const dailySale = {
          restaurant_id: restaurant.id,
          menu_item_id: item.id,
          sale_date: saleDate.toISOString().split("T")[0],
          quantity_sold: quantitySold,
          revenue: revenue,
          cost: cost,
          profit: profit,
          total_orders: this.randomInt(Math.ceil(quantitySold * 0.3), Math.ceil(quantitySold * 0.8)),
          avg_order_value: this.randomFloat(20, 60),
          peak_hour: this.randomInt(12, 21), // Peak hours between 12 PM and 9 PM
          new_customers: this.randomInt(0, Math.ceil(quantitySold * 0.2)),
          returning_customers: this.randomInt(Math.ceil(quantitySold * 0.5), quantitySold),
          customer_satisfaction: this.randomFloat(3.5, 4.8),
          preparation_time_avg: this.randomInt(10, 30),
          waste_quantity: this.randomInt(0, Math.ceil(quantitySold * 0.05)),
          stock_used: quantitySold + this.randomInt(0, 3),
          weather: this.randomChoice(["sunny", "cloudy", "rainy", "stormy"]),
          day_type: isWeekend ? "weekend" : "weekday",
          special_events: dayOffset < 7 && this.randomBoolean(0.1) ? ["local_festival"] : [],
        }

        salesData.push(dailySale)
      }
    }

    // Insert in batches to avoid overwhelming the database
    const batchSize = 100
    let recordCount = 0

    for (let i = 0; i < salesData.length; i += batchSize) {
      const batch = salesData.slice(i, i + batchSize)
      const { error: insertError } = await supabase.from("mock_daily_sales").insert(batch)
      if (insertError) throw insertError
      recordCount += batch.length
    }

    return recordCount
  }

  private async generateCustomers(restaurant: any) {
    const customerCount = this.randomInt(200, 500)
    const customers = []

    for (let i = 0; i < customerCount; i++) {
      const customer = {
        restaurant_id: restaurant.id,
        name: this.generateCustomerName(),
        email: this.generateEmail(),
        phone: this.generatePhoneNumber(),

        // Demographics
        age: this.randomInt(18, 65),
        gender: this.randomChoice(["Male", "Female", "Other"]),
        location: `${restaurant.city}, ${restaurant.state}`,
        income_range: this.randomChoice(["15-25k", "25-50k", "50-100k", "100k+"]),
        occupation: this.randomChoice(["Student", "Professional", "Business Owner", "Retired", "Other"]),
        family_size: this.randomInt(1, 6),

        // Behavioral patterns
        visit_frequency: this.randomInt(1, 8), // visits per month
        avg_spend: this.randomFloat(15, 80),
        total_spent: this.randomFloat(200, 5000),
        total_visits: this.randomInt(3, 50),
        last_visit: this.generateRecentDate(),
        first_visit: this.generatePastDate(365),

        // Preferences and habits
        preferred_cuisine: [restaurant.cuisine_type],
        dietary_restrictions: this.generateDietaryRestrictions(),
        favorite_items: [], // Will be populated with actual menu item names
        disliked_items: [],
        preferred_time: this.randomChoice(["breakfast", "lunch", "dinner", "late_night"]),
        preferred_day: this.randomChoice(["weekday", "weekend"]),
        preferred_table_size: this.randomInt(2, 8),

        // Engagement and loyalty
        loyalty_tier: this.randomChoice(["new", "regular", "vip", "champion"]),
        loyalty_points: this.randomInt(0, 5000),
        referrals_made: this.randomInt(0, 10),
        churn_risk: this.randomChoice(["low", "medium", "high"]),
        lifetime_value: this.randomFloat(500, 10000),
        acquisition_cost: this.randomFloat(10, 100),
        satisfaction_score: this.randomFloat(3.0, 5.0),

        // Communication preferences
        email_subscribed: this.randomBoolean(0.6),
        sms_subscribed: this.randomBoolean(0.4),
        push_notifications: this.randomBoolean(0.7),
        marketing_consent: this.randomBoolean(0.5),
        preferred_contact_method: this.randomChoice(["email", "sms", "phone", "app"]),

        // Order history summary
        total_orders: this.randomInt(5, 100),
        avg_order_value: this.randomFloat(20, 70),
        preferred_order_type: this.randomChoice(["dine_in", "takeaway", "delivery"]),
        payment_method: this.randomChoice(["Cash", "Credit Card", "UPI", "Digital Wallet"]),

        // Special occasions
        birthday: this.generateRandomBirthday(),
        anniversary: this.randomBoolean(0.3) ? this.generateRandomAnniversary() : null,
        special_occasions: this.generateSpecialOccasions(),
      }

      customers.push(customer)
    }

    const { error } = await supabase.from("mock_customers").insert(customers)
    if (error) throw error

    return customerCount
  }

  private async generateMultiPlatformReviews(restaurant: any) {
    const platforms = ["google", "zomato", "tripadvisor"]
    const totalReviews = this.randomInt(100, 300)
    const reviews = []

    for (let i = 0; i < totalReviews; i++) {
      const platform = this.randomChoice(platforms)
      const platformTemplates = platformReviewTemplates[platform as keyof typeof platformReviewTemplates]
      const template = this.randomChoice(platformTemplates)

      const review = {
        restaurant_id: restaurant.id,
        author_name: this.generateCustomerName(),
        author_profile_url: this.generateProfileUrl(platform),
        author_photo_url: `/placeholder.svg?height=50&width=50&text=${encodeURIComponent("User")}`,
        rating: Math.max(1, Math.min(5, template.rating + this.randomInt(-1, 1))),
        title: template.title,
        content: this.customizeReviewContent(template.content, restaurant),

        // Platform information
        platform: platform,
        platform_review_id: this.generatePlatformReviewId(platform),
        platform_url: this.generateReviewUrl(platform, restaurant.slug),
        platform_rating_scale: "1-5",

        // Review metadata
        review_date: this.generateReviewDate(),
        visit_date: this.generateVisitDate(),
        verified: this.randomBoolean(0.8),
        helpful_votes: this.randomInt(0, 25),
        total_votes: this.randomInt(0, 30),

        // Media attachments
        photos: this.randomBoolean(0.3) ? this.generateReviewPhotos(restaurant.name, 2) : [],
        videos: this.randomBoolean(0.1) ? this.generateReviewVideos(restaurant.name, 1) : [],

        // Detailed ratings
        food_rating: template.food_rating || this.randomInt(1, 5),
        service_rating: template.service_rating || this.randomInt(1, 5),
        ambiance_rating: template.ambiance_rating || this.randomInt(1, 5),
        value_rating: template.value_rating || this.randomInt(1, 5),
        cleanliness_rating: this.randomInt(3, 5),

        // AI analysis
        sentiment: template.sentiment,
        sentiment_score: this.getSentimentScore(template.sentiment),
        emotion: this.getEmotionFromSentiment(template.sentiment),
        topics: template.topics,
        keywords: this.extractKeywords(template.content),
        mentioned_items: this.extractMentionedItems(template.content),
        mentioned_staff: this.randomBoolean(0.2) ? [this.generateStaffName()] : [],

        // Review classification
        review_type: this.randomChoice(["food", "service", "ambiance", "value", "overall"]),
        visit_type: this.randomChoice(["first_time", "regular", "special_occasion"]),
        party_size: this.randomInt(1, 8),
        occasion: this.randomChoice(["birthday", "anniversary", "business", "casual", "date"]),

        // Response management
        has_response: this.randomBoolean(0.7),
        response_text: this.randomBoolean(0.7) ? this.generateResponse(template.sentiment, restaurant.name) : null,
        response_date: this.randomBoolean(0.7) ? this.generateResponseDate() : null,
        response_author: "Restaurant Manager",
        response_helpful_votes: this.randomInt(0, 10),
        auto_response: this.randomBoolean(0.3),

        // Quality flags
        is_fake: this.randomBoolean(0.05),
        is_spam: this.randomBoolean(0.02),
        requires_attention: template.sentiment === "negative",
        moderation_status: "approved",
        internal_notes: template.sentiment === "negative" ? "Follow up required" : null,

        // Engagement metrics
        view_count: this.randomInt(10, 200),
        share_count: this.randomInt(0, 15),

        // Business impact
        influenced_bookings: this.randomInt(0, 5),
        estimated_revenue_impact: this.randomFloat(-100, 500),
      }

      reviews.push(review)
    }

    // Insert reviews in batches
    const batchSize = 50
    let reviewCount = 0

    for (let i = 0; i < reviews.length; i += batchSize) {
      const batch = reviews.slice(i, i + batchSize)
      const { error } = await supabase.from("mock_reviews").insert(batch)
      if (error) throw error
      reviewCount += batch.length
    }

    return reviewCount
  }

  private async generateMarketingCampaigns(restaurant: any) {
    const campaigns = [
      {
        restaurant_id: restaurant.id,
        name: "Grand Opening Celebration",
        description: "50% off on all main courses for the first week",
        campaign_type: "promotion",
        status: "completed",
        budget: 15000,
        spent: 12500,
        start_date: this.generatePastDate(180),
        end_date: this.generatePastDate(173),
        target_audience: {
          age: "25-45",
          location: restaurant.city,
          interests: ["food", "dining", restaurant.cuisine_type.toLowerCase()],
        },
        channels: ["facebook_ads", "google_ads", "email", "social"],
        impressions: 75000,
        clicks: 3750,
        conversions: 187,
        revenue_generated: 45000,
      },
      {
        restaurant_id: restaurant.id,
        name: "Weekend Family Special",
        description: "Kids eat free on weekends with family meals",
        campaign_type: "seasonal",
        status: "active",
        budget: 8000,
        spent: 3200,
        start_date: this.generatePastDate(30),
        end_date: this.generateFutureDate(60),
        target_audience: {
          demographic: "families",
          location: restaurant.city,
          age: "30-50",
        },
        channels: ["social", "email", "local_ads"],
        impressions: 25000,
        clicks: 1250,
        conversions: 62,
        revenue_generated: 18500,
      },
      {
        restaurant_id: restaurant.id,
        name: "Loyalty Program Launch",
        description: "Introducing our new customer loyalty rewards program",
        campaign_type: "loyalty",
        status: "active",
        budget: 5000,
        spent: 1800,
        start_date: this.generatePastDate(14),
        end_date: this.generateFutureDate(90),
        target_audience: {
          segment: "existing_customers",
          visit_frequency: "regular",
        },
        channels: ["email", "sms", "app_notification"],
        impressions: 12000,
        clicks: 2400,
        conversions: 320,
        revenue_generated: 28000,
      },
    ]

    const { error } = await supabase.from("mock_marketing_campaigns").insert(campaigns)
    if (error) throw error

    return campaigns.length
  }

  private async generatePlatformIntegrations(restaurant: any) {
    const integrations = [
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
        platform_review_count: Math.floor(restaurant.total_reviews * 0.35),
      },
      {
        restaurant_id: restaurant.id,
        platform_name: "tripadvisor",
        platform_id: this.generatePlatformId(),
        is_connected: true,
        auto_sync_menu: false,
        auto_sync_reviews: true,
        last_sync: this.generateRecentDate(),
        platform_rating: restaurant.avg_rating + this.randomFloat(-0.1, 0.2),
        platform_review_count: Math.floor(restaurant.total_reviews * 0.25),
      },
    ]

    const { error } = await supabase.from("mock_platform_integrations").insert(integrations)
    if (error) throw error

    return integrations.length
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

  private generateAddress(city: string, state: string): string {
    const streetNumbers = this.randomInt(1, 999)
    const streetNames = ["Main Street", "Park Avenue", "Commercial Complex", "Food Court", "Shopping Mall"]
    const streetName = this.randomChoice(streetNames)
    return `${streetNumbers} ${streetName}, ${city}, ${state}`
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

  private generateImageUrls(category: string, restaurantName: string, count: number): string[] {
    const urls = []
    for (let i = 1; i <= count; i++) {
      urls.push(
        `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(`${restaurantName} ${category} ${i}`)}`,
      )
    }
    return urls
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
      youtube: `https://youtube.com/c/${slug}`,
    }
  }

  private generateSocialMediaFollowers() {
    return {
      facebook: this.randomInt(500, 5000),
      instagram: this.randomInt(1000, 10000),
      twitter: this.randomInt(200, 2000),
      youtube: this.randomInt(100, 1000),
    }
  }

  private generateAllergenTags(): string[] {
    const allergens = ["nuts", "dairy", "eggs", "gluten", "soy", "shellfish"]
    const count = this.randomInt(0, 3)
    const selected = []

    for (let i = 0; i < count; i++) {
      const allergen = this.randomChoice(allergens)
      if (!selected.includes(allergen)) {
        selected.push(allergen)
      }
    }

    return selected
  }

  private generatePromoTags(): string[] {
    const tags = ["popular", "signature", "chef-special", "must-try", "top-rated", "new"]
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

  private getPricingStatus(): string {
    const statuses = ["optimal", "underpriced", "overpriced"]
    const weights = [0.6, 0.25, 0.15]

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
    const weights = [0.3, 0.5, 0.2]

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
      "Suresh",
      "Lakshmi",
      "Deepak",
      "Sunita",
      "Manoj",
      "Geeta",
      "Anil",
      "Rekha",
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
    const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "rediffmail.com"]
    const username = Math.random().toString(36).substring(2, 10)
    return `${username}@${this.randomChoice(domains)}`
  }

  private generateRecentDate(): string {
    const now = new Date()
    const daysAgo = this.randomInt(1, 30)
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    return date.toISOString()
  }

  private generatePastDate(maxDaysAgo = 365): string {
    const now = new Date()
    const daysAgo = this.randomInt(1, maxDaysAgo)
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    return date.toISOString()
  }

  private generateFutureDate(maxDaysFromNow = 90): string {
    const now = new Date()
    const daysFromNow = this.randomInt(1, maxDaysFromNow)
    const date = new Date(now.getTime() + daysFromNow * 24 * 60 * 60 * 1000)
    return date.toISOString()
  }

  private generateDietaryRestrictions(): string[] {
    const restrictions = ["vegetarian", "vegan", "gluten-free", "dairy-free", "nut-free", "low-sodium"]
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

  private generateRandomBirthday(): string {
    const year = this.randomInt(1950, 2005)
    const month = this.randomInt(1, 12)
    const day = this.randomInt(1, 28) // Safe day range for all months
    return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
  }

  private generateRandomAnniversary(): string {
    const year = this.randomInt(1990, 2023)
    const month = this.randomInt(1, 12)
    const day = this.randomInt(1, 28)
    return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
  }

  private generateSpecialOccasions(): any {
    return {
      graduation: this.randomBoolean(0.2) ? this.generateRandomBirthday() : null,
      promotion: this.randomBoolean(0.1) ? this.generatePastDate(365) : null,
    }
  }

  private generateProfileUrl(platform: string): string {
    const userId = Math.random().toString(36).substring(2, 15)
    return `https://${platform}.com/user/${userId}`
  }

  private generateReviewUrl(platform: string, restaurantSlug: string): string {
    const reviewId = Math.random().toString(36).substring(2, 15)
    return `https://${platform}.com/restaurant/${restaurantSlug}/review/${reviewId}`
  }

  private generatePlatformReviewId(platform: string): string {
    return `${platform}_${Math.random().toString(36).substring(2, 15)}`
  }

  private generateReviewDate(): string {
    const now = new Date()
    const daysAgo = this.randomInt(1, 365)
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    return date.toISOString()
  }

  private generateVisitDate(): string {
    const reviewDate = new Date(this.generateReviewDate())
    const visitDaysBeforeReview = this.randomInt(0, 7)
    const visitDate = new Date(reviewDate.getTime() - visitDaysBeforeReview * 24 * 60 * 60 * 1000)
    return visitDate.toISOString().split("T")[0]
  }

  private generateReviewPhotos(restaurantName: string, count: number): string[] {
    const photos = []
    for (let i = 1; i <= count; i++) {
      photos.push(
        `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(`${restaurantName} Review Photo ${i}`)}`,
      )
    }
    return photos
  }

  private generateReviewVideos(restaurantName: string, count: number): string[] {
    const videos = []
    for (let i = 1; i <= count; i++) {
      videos.push(
        `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(`${restaurantName} Review Video ${i}`)}`,
      )
    }
    return videos
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

  private getEmotionFromSentiment(sentiment: string): string {
    const emotions = {
      positive: ["happy", "excited", "satisfied", "delighted"],
      negative: ["angry", "disappointed", "frustrated", "upset"],
      neutral: ["neutral", "calm", "indifferent"],
    }

    const emotionArray = emotions[sentiment as keyof typeof emotions] || emotions.neutral
    return this.randomChoice(emotionArray)
  }

  private extractKeywords(content: string): string[] {
    const keywords = content.toLowerCase().match(/\b\w{4,}\b/g) || []
    return keywords.slice(0, 8) // Return first 8 keywords
  }

  private extractMentionedItems(content: string): string[] {
    const commonItems = ["chicken", "curry", "rice", "naan", "biryani", "tikka", "dal", "paneer"]
    const mentioned = []

    for (const item of commonItems) {
      if (content.toLowerCase().includes(item)) {
        mentioned.push(item)
      }
    }

    return mentioned
  }

  private generateStaffName(): string {
    const names = ["Ravi", "Sunita", "Amit", "Priya", "Suresh", "Kavya", "Deepak", "Meera"]
    return this.randomChoice(names)
  }

  private customizeReviewContent(content: string, restaurant: any): string {
    return content
      .replace(/restaurant/g, restaurant.name)
      .replace(/food/g, `${restaurant.cuisine_type} food`)
      .replace(/here/g, `at ${restaurant.name}`)
  }

  private generateResponse(sentiment: string, restaurantName: string): string {
    const responses = {
      positive: [
        `Thank you so much for your wonderful review! We're delighted you enjoyed your experience at ${restaurantName}.`,
        `We're thrilled to hear you had a great time at ${restaurantName}! Thank you for choosing us and for your kind words.`,
        `Your feedback means the world to us! We look forward to serving you again soon at ${restaurantName}.`,
      ],
      negative: [
        `We sincerely apologize for your disappointing experience at ${restaurantName}. We take your feedback seriously and will work to improve.`,
        `Thank you for bringing this to our attention. We'd love the opportunity to make things right. Please contact us directly.`,
        `We're sorry we didn't meet your expectations at ${restaurantName}. Your feedback helps us improve and we appreciate you taking the time to share it.`,
      ],
      neutral: [
        `Thank you for your feedback about ${restaurantName}! We appreciate you taking the time to share your experience with us.`,
        `We value your honest review and will use your feedback to continue improving our service at ${restaurantName}.`,
        `Thank you for visiting ${restaurantName}! We hope to provide an even better experience next time.`,
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
export const completeRestaurantGenerator = new CompleteRestaurantGenerator()
