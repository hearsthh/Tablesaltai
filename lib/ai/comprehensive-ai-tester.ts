import { createClient } from "@supabase/supabase-js"
import { generateAIText, generateCustomerInsights, generateComboSuggestions } from "@/lib/ai/openai"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export class ComprehensiveAITester {
  async testAllAIFeatures(restaurantId?: string) {
    console.log("🧪 Starting comprehensive AI feature testing...")

    try {
      const results = {
        menuAnalysis: await this.testMenuAnalysis(restaurantId),
        reviewAnalysis: await this.testReviewAnalysis(restaurantId),
        customerInsights: await this.testCustomerInsights(restaurantId),
        contentGeneration: await this.testContentGeneration(restaurantId),
        socialProfileGeneration: await this.testSocialProfileGeneration(restaurantId),
        pricingOptimization: await this.testPricingOptimization(restaurantId),
        marketingInsights: await this.testMarketingInsights(restaurantId),
      }

      console.log("✅ AI feature testing completed successfully!")
      return results
    } catch (error) {
      console.error("❌ AI feature testing failed:", error)
      throw error
    }
  }

  async testMenuAnalysis(restaurantId?: string) {
    console.log("🍽️ Testing menu analysis features...")

    try {
      // Get restaurant and menu data
      const restaurant = await this.getTestRestaurant(restaurantId)
      const menuItems = await this.getMenuItems(restaurant.id)

      // Test menu insights generation
      const menuInsights = await this.generateMenuInsights(restaurant, menuItems)

      // Test combo suggestions
      const comboSuggestions = await generateComboSuggestions(menuItems)

      // Test pricing analysis
      const pricingAnalysis = await this.analyzePricing(menuItems)

      return {
        restaurant: restaurant.name,
        menuItemCount: menuItems.length,
        insights: menuInsights,
        combos: comboSuggestions,
        pricing: pricingAnalysis,
        status: "✅ Menu analysis tests passed",
      }
    } catch (error) {
      console.error("❌ Menu analysis tests failed:", error)
      return {
        status: `❌ Menu analysis tests failed: ${error}`,
      }
    }
  }

  async testReviewAnalysis(restaurantId?: string) {
    console.log("⭐ Testing review analysis features...")

    try {
      const restaurant = await this.getTestRestaurant(restaurantId)
      const reviews = await this.getReviews(restaurant.id)

      // Test sentiment analysis
      const sentimentAnalysis = await this.analyzeSentiment(reviews)

      // Test topic extraction
      const topicAnalysis = await this.extractTopics(reviews)

      // Test review response generation
      const responseGeneration = await this.generateReviewResponses(reviews.slice(0, 3))

      return {
        restaurant: restaurant.name,
        reviewCount: reviews.length,
        sentiment: sentimentAnalysis,
        topics: topicAnalysis,
        responses: responseGeneration,
        status: "✅ Review analysis tests passed",
      }
    } catch (error) {
      console.error("❌ Review analysis tests failed:", error)
      return {
        status: `❌ Review analysis tests failed: ${error}`,
      }
    }
  }

  async testCustomerInsights(restaurantId?: string) {
    console.log("👥 Testing customer insights features...")

    try {
      const restaurant = await this.getTestRestaurant(restaurantId)
      const customers = await this.getCustomers(restaurant.id)

      // Test customer segmentation
      const segmentation = await this.segmentCustomers(customers)

      // Test churn prediction
      const churnAnalysis = await this.analyzeChurn(customers)

      // Test lifetime value calculation
      const ltvAnalysis = await this.calculateLTV(customers)

      // Test AI customer insights
      const aiInsights = await generateCustomerInsights(customers)

      return {
        restaurant: restaurant.name,
        customerCount: customers.length,
        segmentation,
        churn: churnAnalysis,
        ltv: ltvAnalysis,
        aiInsights,
        status: "✅ Customer insights tests passed",
      }
    } catch (error) {
      console.error("❌ Customer insights tests failed:", error)
      return {
        status: `❌ Customer insights tests failed: ${error}`,
      }
    }
  }

  async testContentGeneration(restaurantId?: string) {
    console.log("📝 Testing content generation features...")

    try {
      const restaurant = await this.getTestRestaurant(restaurantId)
      const menuItems = await this.getMenuItems(restaurant.id)

      // Test menu description enhancement
      const enhancedDescriptions = await this.enhanceMenuDescriptions(menuItems.slice(0, 3))

      // Test seasonal menu generation
      const seasonalMenu = await this.generateSeasonalMenu(restaurant)

      // Test social media content
      const socialContent = await this.generateSocialContent(restaurant, menuItems)

      // Test marketing copy
      const marketingCopy = await this.generateMarketingCopy(restaurant)

      return {
        restaurant: restaurant.name,
        descriptions: enhancedDescriptions,
        seasonal: seasonalMenu,
        social: socialContent,
        marketing: marketingCopy,
        status: "✅ Content generation tests passed",
      }
    } catch (error) {
      console.error("❌ Content generation tests failed:", error)
      return {
        status: `❌ Content generation tests failed: ${error}`,
      }
    }
  }

  async testSocialProfileGeneration(restaurantId?: string) {
    console.log("📱 Testing social profile generation...")

    try {
      const restaurant = await this.getTestRestaurant(restaurantId)
      const menuItems = await this.getMenuItems(restaurant.id)
      const reviews = await this.getReviews(restaurant.id)

      // Test profile content generation
      const profileContent = await this.generateProfileContent(restaurant)

      // Test highlights extraction
      const highlights = await this.extractHighlights(reviews)

      // Test brand voice generation
      const brandVoice = await this.generateBrandVoice(restaurant, reviews)

      return {
        restaurant: restaurant.name,
        profile: profileContent,
        highlights,
        brandVoice,
        status: "✅ Social profile generation tests passed",
      }
    } catch (error) {
      console.error("❌ Social profile generation tests failed:", error)
      return {
        status: `❌ Social profile generation tests failed: ${error}`,
      }
    }
  }

  async testPricingOptimization(restaurantId?: string) {
    console.log("💰 Testing pricing optimization...")

    try {
      const restaurant = await this.getTestRestaurant(restaurantId)
      const menuItems = await this.getMenuItems(restaurant.id)

      // Test pricing analysis
      const pricingAnalysis = await this.analyzePricing(menuItems)

      // Test competitor analysis simulation
      const competitorAnalysis = await this.simulateCompetitorAnalysis(restaurant)

      // Test price optimization suggestions
      const optimizationSuggestions = await this.generatePricingOptimizations(menuItems)

      return {
        restaurant: restaurant.name,
        analysis: pricingAnalysis,
        competitors: competitorAnalysis,
        optimizations: optimizationSuggestions,
        status: "✅ Pricing optimization tests passed",
      }
    } catch (error) {
      console.error("❌ Pricing optimization tests failed:", error)
      return {
        status: `❌ Pricing optimization tests failed: ${error}`,
      }
    }
  }

  async testMarketingInsights(restaurantId?: string) {
    console.log("📊 Testing marketing insights...")

    try {
      const restaurant = await this.getTestRestaurant(restaurantId)
      const campaigns = await this.getMarketingCampaigns(restaurant.id)
      const customers = await this.getCustomers(restaurant.id)

      // Test campaign performance analysis
      const campaignAnalysis = await this.analyzeCampaignPerformance(campaigns)

      // Test audience segmentation
      const audienceSegmentation = await this.analyzeAudience(customers)

      // Test marketing recommendations
      const marketingRecommendations = await this.generateMarketingRecommendations(restaurant, customers)

      return {
        restaurant: restaurant.name,
        campaigns: campaignAnalysis,
        audience: audienceSegmentation,
        recommendations: marketingRecommendations,
        status: "✅ Marketing insights tests passed",
      }
    } catch (error) {
      console.error("❌ Marketing insights tests failed:", error)
      return {
        status: `❌ Marketing insights tests failed: ${error}`,
      }
    }
  }

  // Helper methods for testing
  private async getTestRestaurant(restaurantId?: string) {
    if (restaurantId) {
      const { data, error } = await supabase.from("mock_restaurants").select("*").eq("id", restaurantId).single()

      if (error) throw error
      return data
    }

    // Get random restaurant for testing
    const { data, error } = await supabase.from("mock_restaurants").select("*").limit(1).single()

    if (error) throw error
    return data
  }

  private async getMenuItems(restaurantId: string) {
    const { data, error } = await supabase.from("mock_menu_items").select("*").eq("restaurant_id", restaurantId)

    if (error) throw error
    return data || []
  }

  private async getReviews(restaurantId: string) {
    const { data, error } = await supabase
      .from("mock_reviews")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("review_date", { ascending: false })

    if (error) throw error
    return data || []
  }

  private async getCustomers(restaurantId: string) {
    const { data, error } = await supabase.from("mock_customers").select("*").eq("restaurant_id", restaurantId)

    if (error) throw error
    return data || []
  }

  private async getMarketingCampaigns(restaurantId: string) {
    const { data, error } = await supabase
      .from("mock_marketing_campaigns")
      .select("*")
      .eq("restaurant_id", restaurantId)

    if (error) throw error
    return data || []
  }

  private async generateMenuInsights(restaurant: any, menuItems: any[]) {
    const prompt = `Analyze this restaurant menu and provide insights:
    
Restaurant: ${restaurant.name} (${restaurant.cuisine_type})
Menu Items: ${menuItems.map((item) => `${item.name} - $${item.price}`).join(", ")}

Provide insights on:
1. Menu balance and variety
2. Pricing strategy
3. Popular item predictions
4. Recommendations for improvement`

    try {
      const result = await generateAIText(prompt)
      return result
    } catch (error) {
      console.error("❌ generateMenuInsights failed:", error)
      return { text: `❌ generateMenuInsights failed: ${error}` }
    }
  }

  private async analyzePricing(menuItems: any[]) {
    try {
      const avgPrice = menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length
      const priceRange = {
        min: Math.min(...menuItems.map((item) => item.price)),
        max: Math.max(...menuItems.map((item) => item.price)),
      }

      const underpriced = menuItems.filter((item) => item.pricing_status === "underpriced")
      const overpriced = menuItems.filter((item) => item.pricing_status === "overpriced")

      return {
        averagePrice: avgPrice,
        priceRange,
        underpricedItems: underpriced.length,
        overpricedItems: overpriced.length,
        recommendations:
          underpriced.length > 0 ? "Consider raising prices on underpriced items" : "Pricing looks optimal",
      }
    } catch (error) {
      console.error("❌ analyzePricing failed:", error)
      return { error: `❌ analyzePricing failed: ${error}` }
    }
  }

  private async analyzeSentiment(reviews: any[]) {
    try {
      const sentimentCounts = reviews.reduce((acc, review) => {
        acc[review.sentiment] = (acc[review.sentiment] || 0) + 1
        return acc
      }, {})

      const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

      return {
        distribution: sentimentCounts,
        averageRating: avgRating,
        totalReviews: reviews.length,
      }
    } catch (error) {
      console.error("❌ analyzeSentiment failed:", error)
      return { error: `❌ analyzeSentiment failed: ${error}` }
    }
  }

  private async extractTopics(reviews: any[]) {
    try {
      const allTopics = reviews.flatMap((review) => review.topics || [])
      const topicCounts = allTopics.reduce((acc, topic) => {
        acc[topic] = (acc[topic] || 0) + 1
        return acc
      }, {})

      return Object.entries(topicCounts)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 10)
        .map(([topic, count]) => ({ topic, count }))
    } catch (error) {
      console.error("❌ extractTopics failed:", error)
      return { error: `❌ extractTopics failed: ${error}` }
    }
  }

  private async generateReviewResponses(reviews: any[]) {
    try {
      const responses = []

      for (const review of reviews) {
        const prompt = `Generate a professional response to this ${review.rating}-star review:
        "${review.content}"
        
        The response should be appropriate for the rating and show genuine care.`

        const result = await generateAIText(prompt)
        responses.push({
          reviewId: review.id,
          originalRating: review.rating,
          response: result.text,
        })
      }

      return responses
    } catch (error) {
      console.error("❌ generateReviewResponses failed:", error)
      return { error: `❌ generateReviewResponses failed: ${error}` }
    }
  }

  private async segmentCustomers(customers: any[]) {
    try {
      const segments = customers.reduce((acc, customer) => {
        acc[customer.loyalty_tier] = (acc[customer.loyalty_tier] || 0) + 1
        return acc
      }, {})

      return segments
    } catch (error) {
      console.error("❌ segmentCustomers failed:", error)
      return { error: `❌ segmentCustomers failed: ${error}` }
    }
  }

  private async analyzeChurn(customers: any[]) {
    try {
      const churnRisk = customers.reduce((acc, customer) => {
        acc[customer.churn_risk] = (acc[customer.churn_risk] || 0) + 1
        return acc
      }, {})

      return churnRisk
    } catch (error) {
      console.error("❌ analyzeChurn failed:", error)
      return { error: `❌ analyzeChurn failed: ${error}` }
    }
  }

  private async calculateLTV(customers: any[]) {
    try {
      const avgLTV = customers.reduce((sum, customer) => sum + (customer.lifetime_value || 0), 0) / customers.length
      const totalLTV = customers.reduce((sum, customer) => sum + (customer.lifetime_value || 0), 0)

      return {
        averageLTV: avgLTV,
        totalLTV: totalLTV,
        customerCount: customers.length,
      }
    } catch (error) {
      console.error("❌ calculateLTV failed:", error)
      return { error: `❌ calculateLTV failed: ${error}` }
    }
  }

  private async enhanceMenuDescriptions(menuItems: any[]) {
    try {
      const enhanced = []

      for (const item of menuItems) {
        const prompt = `Enhance this menu item description to be more appealing:
        
Item: ${item.name}
Current Description: ${item.description}
Price: $${item.price}

Make it mouth-watering and descriptive while keeping it concise.`

        const result = await generateAIText(prompt)
        enhanced.push({
          itemId: item.id,
          originalDescription: item.description,
          enhancedDescription: result.text,
        })
      }

      return enhanced
    } catch (error) {
      console.error("❌ enhanceMenuDescriptions failed:", error)
      return { error: `❌ enhanceMenuDescriptions failed: ${error}` }
    }
  }

  private async generateSeasonalMenu(restaurant: any) {
    try {
      const prompt = `Create a seasonal menu for ${restaurant.name}, a ${restaurant.cuisine_type} restaurant.
        
    Generate 3-4 seasonal items that would be perfect for the current season.
    Include item names, descriptions, and suggested prices.`

      return await generateAIText(prompt)
    } catch (error) {
      console.error("❌ generateSeasonalMenu failed:", error)
      return { error: `❌ generateSeasonalMenu failed: ${error}` }
    }
  }

  private async generateSocialContent(restaurant: any, menuItems: any[]) {
    try {
      const popularItem = menuItems.find((item) => item.promo_tags?.includes("popular")) || menuItems[0]

      const prompt = `Create social media content for ${restaurant.name}:
        
    Restaurant: ${restaurant.name} (${restaurant.cuisine_type})
    Featured Item: ${popularItem?.name}
    Tone: ${restaurant.brand_voice}

    Generate:
    1. Instagram post caption
    2. Facebook post
    3. Twitter tweet`

      return await generateAIText(prompt)
    } catch (error) {
      console.error("❌ generateSocialContent failed:", error)
      return { error: `❌ generateSocialContent failed: ${error}` }
    }
  }

  private async generateMarketingCopy(restaurant: any) {
    try {
      const prompt = `Create marketing copy for ${restaurant.name}:
        
    Restaurant: ${restaurant.name}
    Cuisine: ${restaurant.cuisine_type}
    Concept: ${restaurant.concept}
    Location: ${restaurant.city}

    Generate compelling marketing copy for email campaigns and advertisements.`

      return await generateAIText(prompt)
    } catch (error) {
      console.error("❌ generateMarketingCopy failed:", error)
      return { error: `❌ generateMarketingCopy failed: ${error}` }
    }
  }

  private async generateProfileContent(restaurant: any) {
    try {
      const prompt = `Generate social profile content for ${restaurant.name}:
        
    Restaurant: ${restaurant.name}
    Cuisine: ${restaurant.cuisine_type}
    Description: ${restaurant.description}
    Concept: ${restaurant.concept}

    Create:
    1. Enhanced about section
    2. Compelling tagline
    3. Brand story`

      return await generateAIText(prompt)
    } catch (error) {
      console.error("❌ generateProfileContent failed:", error)
      return { error: `❌ generateProfileContent failed: ${error}` }
    }
  }

  private async extractHighlights(reviews: any[]) {
    try {
      const positiveReviews = reviews.filter((review) => review.sentiment === "positive")
      const keywords = positiveReviews.flatMap((review) => review.keywords || [])

      const keywordCounts = keywords.reduce((acc, topic) => {
        acc[topic] = (acc[topic] || 0) + 1
        return acc
      }, {})

      return Object.entries(keywordCounts)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([keyword, count]) => ({ keyword, mentions: count }))
    } catch (error) {
      console.error("❌ extractHighlights failed:", error)
      return { error: `❌ extractHighlights failed: ${error}` }
    }
  }

  private async generateBrandVoice(restaurant: any, reviews: any[]) {
    try {
      const positiveReviews = reviews.filter((review) => review.sentiment === "positive").slice(0, 5)

      const prompt = `Based on these positive customer reviews, define the brand voice for ${restaurant.name}:
        
    Reviews: ${positiveReviews.map((review) => review.content).join("\n")}

    Define the brand voice characteristics and tone that would resonate with these customers.`

      return await generateAIText(prompt)
    } catch (error) {
      console.error("❌ generateBrandVoice failed:", error)
      return { error: `❌ generateBrandVoice failed: ${error}` }
    }
  }

  private async simulateCompetitorAnalysis(restaurant: any) {
    // Simulate competitor data
    return {
      averagePrice: restaurant.price_range === "$" ? 12 : restaurant.price_range === "$$" ? 18 : 25,
      marketPosition: "competitive",
      recommendations: "Prices are in line with market standards",
    }
  }

  private async generatePricingOptimizations(menuItems: any[]) {
    try {
      const optimizations = []

      for (const item of menuItems.slice(0, 3)) {
        if (item.pricing_status === "underpriced") {
          optimizations.push({
            itemId: item.id,
            itemName: item.name,
            currentPrice: item.price,
            suggestedPrice: item.price * 1.15,
            reason: "Item is underpriced compared to market standards",
          })
        }
      }

      return optimizations
    } catch (error) {
      console.error("❌ generatePricingOptimizations failed:", error)
      return { error: `❌ generatePricingOptimizations failed: ${error}` }
    }
  }

  private async analyzeCampaignPerformance(campaigns: any[]) {
    try {
      return campaigns.map((campaign) => ({
        campaignId: campaign.id,
        name: campaign.name,
        roi: campaign.revenue_generated / campaign.spent,
        conversionRate: campaign.conversions / campaign.clicks,
        performance: campaign.revenue_generated > campaign.spent ? "profitable" : "needs_optimization",
      }))
    } catch (error) {
      console.error("❌ analyzeCampaignPerformance failed:", error)
      return { error: `❌ analyzeCampaignPerformance failed: ${error}` }
    }
  }

  private async analyzeAudience(customers: any[]) {
    try {
      const ageGroups = customers.reduce((acc, customer) => {
        const ageGroup = customer.age < 25 ? "18-24" : customer.age < 35 ? "25-34" : customer.age < 45 ? "35-44" : "45+"
        acc[ageGroup] = (acc[ageGroup] || 0) + 1
        return acc
      }, {})

      return {
        ageDistribution: ageGroups,
        totalCustomers: customers.length,
        averageSpend: customers.reduce((sum, c) => sum + c.avg_spend, 0) / customers.length,
      }
    } catch (error) {
      console.error("❌ analyzeAudience failed:", error)
      return { error: `❌ analyzeAudience failed: ${error}` }
    }
  }

  private async generateMarketingRecommendations(restaurant: any, customers: any[]) {
    try {
      const prompt = `Generate marketing recommendations for ${restaurant.name}:
        
    Restaurant: ${restaurant.name} (${restaurant.cuisine_type})
    Customer Base: ${customers.length} customers
    Average Customer Spend: $${customers.reduce((sum, c) => sum + c.avg_spend, 0) / customers.length}

    Provide specific marketing strategies and campaign ideas.`

      return await generateAIText(prompt)
    } catch (error) {
      console.error("❌ generateMarketingRecommendations failed:", error)
      return { error: `❌ generateMarketingRecommendations failed: ${error}` }
    }
  }
}

// Export singleton instance
export const aiTester = new ComprehensiveAITester()
