export interface MenuInsightData {
  restaurantId: string
  menuData: any
  salesData?: SalesData[]
  customerProfile?: CustomerProfile
  locationData?: LocationData
  seasonalData?: SeasonalData
  competitorData?: CompetitorData
  trendsData?: TrendsData
}

export interface SalesData {
  itemId: string
  itemName: string
  totalSales: number
  revenue: number
  orderFrequency: number
  avgOrderValue: number
  peakHours: string[]
  seasonalVariation: number
  customerRating?: number
  lastOrderDate: string
}

export interface CustomerProfile {
  demographics: {
    ageGroups: { range: string; percentage: number }[]
    incomeLevel: "budget" | "mid-range" | "premium"
    dietaryPreferences: string[]
    familySize: number
  }
  orderingPatterns: {
    peakDays: string[]
    avgOrderValue: number
    repeatCustomerRate: number
    seasonalPreferences: string[]
  }
  preferences: {
    cuisineTypes: string[]
    spiceLevel: string
    healthConsciousness: number
    pricesensitivity: number
  }
}

export interface LocationData {
  city: string
  neighborhood: string
  demographics: any
  competitorDensity: number
  footTraffic: number
  averageIncome: number
  popularCuisines: string[]
  localEvents: string[]
}

export interface SeasonalData {
  currentSeason: string
  weatherTrends: string[]
  upcomingFestivals: string[]
  seasonalIngredients: string[]
  holidayCalendar: string[]
}

export interface CompetitorData {
  nearbyRestaurants: {
    name: string
    cuisine: string
    priceRange: string
    popularItems: { name: string; price: number }[]
    ratings: number
  }[]
  marketGaps: string[]
  pricingBenchmarks: { category: string; avgPrice: number; range: [number, number] }[]
}

export interface TrendsData {
  foodTrends: string[]
  socialMediaTrends: string[]
  healthTrends: string[]
  sustainabilityTrends: string[]
  technologyTrends: string[]
}

export interface MenuInsight {
  id: string
  type: "pricing" | "menu-optimization" | "promotion"
  category: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
  confidence: number
  priority: number
  estimatedRevenue: number
  implementation: {
    difficulty: "easy" | "medium" | "hard"
    timeframe: string
    cost: number
    steps: string[]
  }
  data: {
    currentValue?: any
    recommendedValue?: any
    reasoning: string[]
    supportingData: any
  }
  cta: {
    primary: string
    secondary?: string
    actions: InsightAction[]
  }
}

export interface InsightAction {
  id: string
  type: "price-update" | "add-item" | "remove-item" | "create-promotion" | "generate-content" | "schedule-campaign"
  label: string
  description: string
  data: any
  autoApplicable: boolean
}

export class MenuInsightsEngine {
  private openAIKey: string

  constructor() {
    this.openAIKey = process.env.OPENAI_API_KEY || ""
  }

  async generateComprehensiveInsights(data: MenuInsightData): Promise<MenuInsight[]> {
    console.log("🧠 Generating focused menu insights...")

    const insights: MenuInsight[] = []

    // Generate limited, high-impact insights
    const [pricingInsights, menuOptimizationInsights, promotionInsights] = await Promise.all([
      this.generatePricingInsights(data),
      this.generateMenuOptimizationInsights(data),
      this.generatePromotionInsights(data),
    ])

    // Limit to top insights per category
    insights.push(
      ...pricingInsights.slice(0, 4), // Max 4 pricing insights
      ...menuOptimizationInsights.slice(0, 4), // Max 4 menu insights
      ...promotionInsights.slice(0, 3), // Max 3 promotion insights
    )

    // Sort by priority and impact
    return insights.sort((a, b) => {
      if (a.impact !== b.impact) {
        const impactOrder = { high: 3, medium: 2, low: 1 }
        return impactOrder[b.impact] - impactOrder[a.impact]
      }
      return b.priority - a.priority
    })
  }

  private async generatePricingInsights(data: MenuInsightData): Promise<MenuInsight[]> {
    const insights: MenuInsight[] = []

    // Analyze each menu item for pricing optimization
    for (const category of data.menuData.categories) {
      for (const item of category.items) {
        const pricingAnalysis = await this.analyzePricing(item, data)
        if (pricingAnalysis) {
          insights.push(pricingAnalysis)
        }
      }
    }

    return insights
  }

  private async analyzePricing(item: any, data: MenuInsightData): Promise<MenuInsight | null> {
    const prompt = `Analyze pricing for this menu item considering multiple factors:

ITEM DETAILS:
- Name: ${item.name}
- Current Price: $${item.price}
- Category: ${item.category || "Unknown"}
- Description: ${item.description}

ANALYSIS FACTORS:
1. Sales Performance: ${this.getSalesContext(item, data.salesData)}
2. Market Context: ${this.getMarketContext(data.locationData, data.competitorData)}
3. Customer Profile: ${this.getCustomerContext(data.customerProfile)}
4. Seasonal Factors: ${this.getSeasonalContext(data.seasonalData)}
5. Trends: ${this.getTrendsContext(data.trendsData)}

COMPETITOR PRICING:
${this.getCompetitorPricing(item, data.competitorData)}

Provide pricing recommendation with:
1. Recommended price with reasoning
2. Expected impact on sales and revenue
3. Implementation strategy
4. Risk assessment
5. Supporting data points

Format as JSON with specific recommendations.`

    try {
      const response = await this.callOpenAI(prompt, { temperature: 0.3, maxTokens: 800 })
      const analysis = this.parsePricingResponse(response.text, item)

      if (analysis && Math.abs(analysis.recommendedPrice - item.price) > 0.5) {
        return this.createPricingInsight(item, analysis, data)
      }
    } catch (error) {
      console.error("Pricing analysis error:", error)
    }

    return null
  }

  private async generateMenuOptimizationInsights(data: MenuInsightData): Promise<MenuInsight[]> {
    const insights: MenuInsight[] = []

    // Analyze menu gaps and opportunities
    const gapAnalysis = await this.analyzeMenuGaps(data)
    insights.push(...gapAnalysis)

    // Analyze underperforming items for removal
    const removalAnalysis = await this.analyzeItemsForRemoval(data)
    insights.push(...removalAnalysis)

    // Analyze category balance
    const balanceAnalysis = await this.analyzeCategoryBalance(data)
    insights.push(...balanceAnalysis)

    return insights
  }

  private async analyzeMenuGaps(data: MenuInsightData): Promise<MenuInsight[]> {
    const prompt = `Analyze menu gaps and suggest new items based on comprehensive data:

CURRENT MENU:
${data.menuData.categories
  .map((cat: any) => `${cat.name}: ${cat.items.map((item: any) => `${item.name} ($${item.price})`).join(", ")}`)
  .join("\n")}

ANALYSIS CONTEXT:
1. Customer Demographics: ${JSON.stringify(data.customerProfile?.demographics)}
2. Local Market: ${data.locationData?.popularCuisines?.join(", ")}
3. Competitor Gaps: ${data.competitorData?.marketGaps?.join(", ")}
4. Current Trends: ${data.trendsData?.foodTrends?.join(", ")}
5. Seasonal Opportunities: ${data.seasonalData?.seasonalIngredients?.join(", ")}
6. Sales Data: ${this.getTopPerformingCategories(data.salesData)}

Suggest 3-5 specific menu additions with:
1. Item name and description
2. Recommended price point
3. Target category
4. Revenue potential
5. Implementation complexity
6. Market demand evidence

Focus on high-impact, data-driven recommendations.`

    try {
      const response = await this.callOpenAI(prompt, { temperature: 0.4, maxTokens: 1000 })
      return this.parseMenuAdditionResponse(response.text, data)
    } catch (error) {
      console.error("Menu gap analysis error:", error)
      return []
    }
  }

  private async analyzeItemsForRemoval(data: MenuInsightData): Promise<MenuInsight[]> {
    if (!data.salesData || data.salesData.length === 0) return []

    const underperformingItems = data.salesData
      .filter((item) => item.totalSales < 10 && item.revenue < 100) // Low performance threshold
      .slice(0, 3) // Top 3 candidates for removal

    const insights: MenuInsight[] = []

    for (const item of underperformingItems) {
      const insight: MenuInsight = {
        id: `remove-${item.itemId}`,
        type: "menu-optimization",
        category: "Item Removal",
        title: `Consider Removing: ${item.itemName}`,
        description: `Low-performing item with only ${item.totalSales} orders and $${item.revenue} revenue. Removing could streamline operations and reduce costs.`,
        impact: "medium",
        confidence: 0.75,
        priority: 6,
        estimatedRevenue: -50, // Cost savings
        implementation: {
          difficulty: "easy",
          timeframe: "1 week",
          cost: 0,
          steps: [
            "Analyze final week performance",
            "Remove from POS system",
            "Update printed menus",
            "Train staff on menu changes",
          ],
        },
        data: {
          currentValue: {
            sales: item.totalSales,
            revenue: item.revenue,
            frequency: item.orderFrequency,
          },
          reasoning: [
            `Only ${item.totalSales} orders in recent period`,
            `Low revenue contribution: $${item.revenue}`,
            "Simplifying menu can improve kitchen efficiency",
            "Resources can be focused on popular items",
          ],
          supportingData: item,
        },
        cta: {
          primary: "Remove Item",
          secondary: "Analyze Further",
          actions: [
            {
              id: "remove-item",
              type: "remove-item",
              label: "Remove from Menu",
              description: "Permanently remove this item from the menu",
              data: { itemId: item.itemId },
              autoApplicable: false,
            },
            {
              id: "analyze-item",
              type: "generate-content",
              label: "Detailed Analysis",
              description: "Generate detailed performance report",
              data: { itemId: item.itemId, type: "performance-analysis" },
              autoApplicable: true,
            },
          ],
        },
      }
      insights.push(insight)
    }

    return insights
  }

  private async analyzeCategoryBalance(data: MenuInsightData): Promise<MenuInsight[]> {
    const categoryStats = data.menuData.categories.map((cat: any) => ({
      name: cat.name,
      itemCount: cat.items.length,
      avgPrice: cat.items.reduce((sum: number, item: any) => sum + item.price, 0) / cat.items.length,
      priceRange: {
        min: Math.min(...cat.items.map((item: any) => item.price)),
        max: Math.max(...cat.items.map((item: any) => item.price)),
      },
    }))

    const insights: MenuInsight[] = []

    // Check for imbalanced categories
    const avgItemsPerCategory = categoryStats.reduce((sum, cat) => sum + cat.itemCount, 0) / categoryStats.length

    categoryStats.forEach((cat) => {
      if (cat.itemCount < avgItemsPerCategory * 0.5) {
        insights.push({
          id: `expand-${cat.name.toLowerCase()}`,
          type: "menu-optimization",
          category: "Category Expansion",
          title: `Expand ${cat.name} Category`,
          description: `${cat.name} has only ${cat.itemCount} items compared to average of ${Math.round(avgItemsPerCategory)}. Adding variety could increase sales.`,
          impact: "medium",
          confidence: 0.7,
          priority: 5,
          estimatedRevenue: 200,
          implementation: {
            difficulty: "medium",
            timeframe: "2-3 weeks",
            cost: 150,
            steps: [
              "Research popular items in this category",
              "Test recipes and pricing",
              "Update menu design",
              "Train kitchen staff",
              "Launch with promotion",
            ],
          },
          data: {
            currentValue: { itemCount: cat.itemCount, avgPrice: cat.avgPrice },
            recommendedValue: { itemCount: Math.round(avgItemsPerCategory), targetRevenue: 200 },
            reasoning: [
              `Currently ${cat.itemCount} items vs ${Math.round(avgItemsPerCategory)} average`,
              "Customers may seek more variety in this category",
              "Opportunity to capture additional market share",
              "Balanced menu improves customer satisfaction",
            ],
            supportingData: categoryStats,
          },
          cta: {
            primary: "Add Items",
            secondary: "Research Options",
            actions: [
              {
                id: "suggest-items",
                type: "generate-content",
                label: "Suggest New Items",
                description: "AI-generated item suggestions for this category",
                data: { category: cat.name, targetCount: 3 },
                autoApplicable: true,
              },
              {
                id: "competitor-research",
                type: "generate-content",
                label: "Competitor Analysis",
                description: "Analyze what competitors offer in this category",
                data: { category: cat.name, type: "competitor-analysis" },
                autoApplicable: true,
              },
            ],
          },
        })
      }
    })

    return insights
  }

  private async generatePromotionInsights(data: MenuInsightData): Promise<MenuInsight[]> {
    const insights: MenuInsight[] = []

    // Seasonal promotion opportunities
    const seasonalPromotions = await this.analyzeSeasonalPromotions(data)
    insights.push(...seasonalPromotions)

    // High-margin item promotions
    const marginPromotions = await this.analyzeMarginPromotions(data)
    insights.push(...marginPromotions)

    // Combo opportunities
    const comboPromotions = await this.analyzeComboOpportunities(data)
    insights.push(...comboPromotions)

    // Social media trend promotions
    const trendPromotions = await this.analyzeTrendPromotions(data)
    insights.push(...trendPromotions)

    return insights
  }

  private async analyzeSeasonalPromotions(data: MenuInsightData): Promise<MenuInsight[]> {
    if (!data.seasonalData) return []

    const prompt = `Generate seasonal promotion opportunities:

CURRENT SEASON: ${data.seasonalData.currentSeason}
UPCOMING FESTIVALS: ${data.seasonalData.upcomingFestivals?.join(", ")}
SEASONAL INGREDIENTS: ${data.seasonalData.seasonalIngredients?.join(", ")}
WEATHER TRENDS: ${data.seasonalData.weatherTrends?.join(", ")}

MENU ITEMS:
${data.menuData.categories
  .map((cat: any) => cat.items.map((item: any) => `${item.name} - $${item.price}`).join(", "))
  .join("\n")}

Create 2-3 seasonal promotion ideas with:
1. Promotion concept and theme
2. Target items or new seasonal items
3. Pricing strategy
4. Marketing message
5. Duration and timing
6. Expected impact

Focus on data-driven, profitable promotions.`

    try {
      const response = await this.callOpenAI(prompt, { temperature: 0.6, maxTokens: 800 })
      return this.parsePromotionResponse(response.text, "seasonal", data)
    } catch (error) {
      console.error("Seasonal promotion analysis error:", error)
      return []
    }
  }

  private async analyzeMarginPromotions(data: MenuInsightData): Promise<MenuInsight[]> {
    // Identify high-margin items that could be promoted
    const highMarginItems = data.menuData.categories
      .flatMap((cat: any) => cat.items)
      .filter((item: any) => item.price > 15) // Assume higher-priced items have better margins
      .slice(0, 3)

    if (highMarginItems.length === 0) return []

    const insights: MenuInsight[] = []

    highMarginItems.forEach((item: any, index: number) => {
      insights.push({
        id: `promote-${item.id}`,
        type: "promotion",
        category: "High-Margin Promotion",
        title: `Promote High-Margin Item: ${item.name}`,
        description: `${item.name} at $${item.price} likely has good margins. Strategic promotion could increase sales while maintaining profitability.`,
        impact: "high",
        confidence: 0.8,
        priority: 8,
        estimatedRevenue: 300,
        implementation: {
          difficulty: "easy",
          timeframe: "1 week",
          cost: 50,
          steps: [
            "Create promotional materials",
            "Train staff to recommend item",
            "Add to social media content",
            "Track performance metrics",
          ],
        },
        data: {
          currentValue: { price: item.price, name: item.name },
          recommendedValue: { promotionType: "featured-item", expectedIncrease: "25%" },
          reasoning: [
            "High-priced item suggests good profit margins",
            "Strategic promotion can increase visibility",
            "Staff recommendations can boost sales",
            "Social media exposure increases awareness",
          ],
          supportingData: item,
        },
        cta: {
          primary: "Create Promotion",
          secondary: "Generate Content",
          actions: [
            {
              id: "create-promotion",
              type: "create-promotion",
              label: "Launch Promotion Campaign",
              description: "Create and launch promotional campaign",
              data: {
                itemId: item.id,
                type: "featured-item",
                duration: "2-weeks",
              },
              autoApplicable: false,
            },
            {
              id: "generate-content",
              type: "generate-content",
              label: "Generate Marketing Content",
              description: "Create social media posts and promotional copy",
              data: {
                itemId: item.id,
                type: "promotional-content",
                platforms: ["instagram", "facebook", "website"],
              },
              autoApplicable: true,
            },
          ],
        },
      })
    })

    return insights
  }

  private async analyzeComboOpportunities(data: MenuInsightData): Promise<MenuInsight[]> {
    const insights: MenuInsight[] = []

    // Analyze frequently ordered together items
    if (data.salesData && data.salesData.length > 0) {
      const comboOpportunity: MenuInsight = {
        id: "combo-opportunity",
        type: "promotion",
        category: "Combo Creation",
        title: "Create Value Combo Meals",
        description: "Bundle popular items together to increase average order value and provide customer value.",
        impact: "high",
        confidence: 0.85,
        priority: 9,
        estimatedRevenue: 500,
        implementation: {
          difficulty: "medium",
          timeframe: "2 weeks",
          cost: 100,
          steps: [
            "Analyze order patterns",
            "Design combo offerings",
            "Set competitive pricing",
            "Update POS system",
            "Launch marketing campaign",
          ],
        },
        data: {
          recommendedValue: {
            comboCount: 3,
            expectedIncrease: "15-20%",
            targetAOV: "+$3-5",
          },
          reasoning: [
            "Combos increase average order value",
            "Customers perceive better value",
            "Simplifies ordering decisions",
            "Improves kitchen efficiency",
          ],
          supportingData: data.salesData,
        },
        cta: {
          primary: "Create Combos",
          secondary: "Analyze Patterns",
          actions: [
            {
              id: "generate-combos",
              type: "generate-content",
              label: "Generate Combo Ideas",
              description: "AI-powered combo suggestions based on sales data",
              data: { type: "combo-generation", salesData: data.salesData },
              autoApplicable: true,
            },
            {
              id: "pricing-analysis",
              type: "generate-content",
              label: "Combo Pricing Analysis",
              description: "Optimal pricing strategy for combo meals",
              data: { type: "combo-pricing" },
              autoApplicable: true,
            },
          ],
        },
      }
      insights.push(comboOpportunity)
    }

    return insights
  }

  private async analyzeTrendPromotions(data: MenuInsightData): Promise<MenuInsight[]> {
    if (!data.trendsData || !data.trendsData.foodTrends) return []

    const trendInsight: MenuInsight = {
      id: "trend-promotion",
      type: "promotion",
      category: "Trend-Based Marketing",
      title: "Leverage Current Food Trends",
      description: `Capitalize on trending topics: ${data.trendsData.foodTrends.slice(0, 3).join(", ")} to increase social media engagement and attract new customers.`,
      impact: "medium",
      confidence: 0.7,
      priority: 6,
      estimatedRevenue: 250,
      implementation: {
        difficulty: "easy",
        timeframe: "1 week",
        cost: 30,
        steps: [
          "Identify trending items in menu",
          "Create trend-focused content",
          "Launch social media campaign",
          "Monitor engagement metrics",
        ],
      },
      data: {
        currentValue: { trends: data.trendsData.foodTrends },
        recommendedValue: { campaignType: "trend-marketing", platforms: ["instagram", "tiktok"] },
        reasoning: [
          "Food trends drive social media engagement",
          "Attracts younger demographics",
          "Low-cost marketing opportunity",
          "Increases brand visibility",
        ],
        supportingData: data.trendsData,
      },
      cta: {
        primary: "Create Campaign",
        secondary: "Generate Content",
        actions: [
          {
            id: "trend-campaign",
            type: "schedule-campaign",
            label: "Launch Trend Campaign",
            description: "Create and schedule social media campaign",
            data: {
              type: "trend-marketing",
              trends: data.trendsData.foodTrends.slice(0, 3),
              duration: "1-week",
            },
            autoApplicable: false,
          },
          {
            id: "trend-content",
            type: "generate-content",
            label: "Generate Trend Content",
            description: "Create posts highlighting trending menu items",
            data: {
              type: "trend-content",
              trends: data.trendsData.foodTrends,
            },
            autoApplicable: true,
          },
        ],
      },
    }

    return [trendInsight]
  }

  // Helper methods
  private getSalesContext(item: any, salesData?: SalesData[]): string {
    if (!salesData) return "No sales data available"
    const itemSales = salesData.find((s) => s.itemName === item.name)
    if (!itemSales) return "No sales data for this item"
    return `Sales: ${itemSales.totalSales}, Revenue: $${itemSales.revenue}, Frequency: ${itemSales.orderFrequency}`
  }

  private getMarketContext(locationData?: LocationData, competitorData?: CompetitorData): string {
    const location = locationData ? `${locationData.city}, ${locationData.neighborhood}` : "Unknown location"
    const competitors = competitorData?.nearbyRestaurants?.length || 0
    return `Location: ${location}, Competitors: ${competitors}`
  }

  private getCustomerContext(customerProfile?: CustomerProfile): string {
    if (!customerProfile) return "No customer profile data"
    return `Income: ${customerProfile.demographics.incomeLevel}, AOV: $${customerProfile.orderingPatterns.avgOrderValue}`
  }

  private getSeasonalContext(seasonalData?: SeasonalData): string {
    if (!seasonalData) return "No seasonal data"
    return `Season: ${seasonalData.currentSeason}, Trends: ${seasonalData.weatherTrends?.join(", ")}`
  }

  private getTrendsContext(trendsData?: TrendsData): string {
    if (!trendsData) return "No trends data"
    return `Food trends: ${trendsData.foodTrends?.slice(0, 3).join(", ")}`
  }

  private getCompetitorPricing(item: any, competitorData?: CompetitorData): string {
    if (!competitorData?.pricingBenchmarks) return "No competitor pricing data"
    const benchmark = competitorData.pricingBenchmarks.find((b) =>
      b.category.toLowerCase().includes(item.category?.toLowerCase() || ""),
    )
    return benchmark
      ? `Market average: $${benchmark.avgPrice}, Range: $${benchmark.range[0]}-$${benchmark.range[1]}`
      : "No benchmark available"
  }

  private getTopPerformingCategories(salesData?: SalesData[]): string {
    if (!salesData) return "No sales data"
    // Group by category and sum revenue (simplified)
    return "Top categories based on sales data"
  }

  private async callOpenAI(prompt: string, options: any) {
    // Use the existing OpenAI integration
    const { generateAIText } = await import("./openai")
    return await generateAIText(prompt, options)
  }

  private parsePricingResponse(response: string, item: any): any {
    // Parse AI response for pricing recommendations
    try {
      // Extract recommended price from response
      const priceMatch = response.match(/\$?(\d+\.?\d*)/g)
      if (priceMatch) {
        const recommendedPrice = Number.parseFloat(priceMatch[0].replace("$", ""))
        return {
          recommendedPrice,
          reasoning: response,
          confidence: 0.8,
        }
      }
    } catch (error) {
      console.error("Error parsing pricing response:", error)
    }
    return null
  }

  private createPricingInsight(item: any, analysis: any, data: MenuInsightData): MenuInsight {
    const priceDiff = analysis.recommendedPrice - item.price
    const isIncrease = priceDiff > 0

    return {
      id: `pricing-${item.id}`,
      type: "pricing",
      category: isIncrease ? "Price Increase" : "Price Decrease",
      title: `${isIncrease ? "Increase" : "Decrease"} Price: ${item.name}`,
      description: `Current price $${item.price} → Recommended $${analysis.recommendedPrice.toFixed(2)} (${isIncrease ? "+" : ""}${priceDiff.toFixed(2)})`,
      impact: Math.abs(priceDiff) > 2 ? "high" : "medium",
      confidence: analysis.confidence,
      priority: isIncrease ? 8 : 6,
      estimatedRevenue: Math.abs(priceDiff) * 50, // Estimate based on price change
      implementation: {
        difficulty: "easy",
        timeframe: "1 week",
        cost: 0,
        steps: [
          "Update POS system pricing",
          "Print new menus if needed",
          "Train staff on new pricing",
          "Monitor customer response",
        ],
      },
      data: {
        currentValue: item.price,
        recommendedValue: analysis.recommendedPrice,
        reasoning: [analysis.reasoning],
        supportingData: analysis,
      },
      cta: {
        primary: "Update Price",
        secondary: "Analyze Impact",
        actions: [
          {
            id: "update-price",
            type: "price-update",
            label: "Apply New Price",
            description: `Update ${item.name} to $${analysis.recommendedPrice.toFixed(2)}`,
            data: {
              itemId: item.id,
              newPrice: analysis.recommendedPrice,
              oldPrice: item.price,
            },
            autoApplicable: false,
          },
          {
            id: "impact-analysis",
            type: "generate-content",
            label: "Impact Analysis",
            description: "Detailed analysis of pricing change impact",
            data: {
              itemId: item.id,
              type: "pricing-impact-analysis",
            },
            autoApplicable: true,
          },
        ],
      },
    }
  }

  private parseMenuAdditionResponse(response: string, data: MenuInsightData): MenuInsight[] {
    // Parse AI response for menu addition suggestions
    const insights: MenuInsight[] = []

    // This would parse the AI response and create structured insights
    // For now, return a sample insight
    insights.push({
      id: "add-trending-item",
      type: "menu-optimization",
      category: "Menu Addition",
      title: "Add Trending Item: Plant-Based Option",
      description: "Market analysis shows high demand for plant-based alternatives in your area.",
      impact: "high",
      confidence: 0.85,
      priority: 9,
      estimatedRevenue: 400,
      implementation: {
        difficulty: "medium",
        timeframe: "3 weeks",
        cost: 200,
        steps: [
          "Recipe development and testing",
          "Supplier sourcing",
          "Staff training",
          "Menu integration",
          "Marketing launch",
        ],
      },
      data: {
        recommendedValue: {
          itemName: "Beyond Burger Bowl",
          suggestedPrice: 14.99,
          category: "Main Course",
        },
        reasoning: [
          "35% increase in plant-based searches locally",
          "Competitors charging $15-18 for similar items",
          "Aligns with health-conscious customer base",
          "High profit margins on plant-based proteins",
        ],
        supportingData: response,
      },
      cta: {
        primary: "Add Item",
        secondary: "Research More",
        actions: [
          {
            id: "add-item",
            type: "add-item",
            label: "Add to Menu",
            description: "Add this item to your menu",
            data: {
              name: "Beyond Burger Bowl",
              price: 14.99,
              category: "Main Course",
              description: "Plant-based protein bowl with seasonal vegetables",
            },
            autoApplicable: false,
          },
          {
            id: "recipe-development",
            type: "generate-content",
            label: "Recipe Development",
            description: "Get detailed recipe and preparation guide",
            data: { type: "recipe-development", itemName: "Beyond Burger Bowl" },
            autoApplicable: true,
          },
        ],
      },
    })

    return insights
  }

  private parsePromotionResponse(response: string, type: string, data: MenuInsightData): MenuInsight[] {
    // Parse AI response for promotion suggestions
    return [] // Implementation would parse the response
  }
}

// Export the main function
export async function generateMenuInsights(data: MenuInsightData): Promise<MenuInsight[]> {
  const engine = new MenuInsightsEngine()
  return await engine.generateComprehensiveInsights(data)
}
