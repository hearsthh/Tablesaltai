import type {
  MenuItemMetrics,
  MenuHealthScore,
  ComboSuggestion,
  MenuOptimizationAction,
  MenuIntelligenceData,
} from "@/lib/types/menu-intelligence"

export class MenuIntelligenceService {
  static calculateMenuHealth(items: MenuItemMetrics[]): MenuHealthScore {
    const totalItems = items.length
    const itemsWithImage = items.filter((item) => item.imageUrl && item.imageUrl.length > 0).length
    const itemsWithDescription = items.filter((item) => item.description && item.description.length >= 15).length

    // Category analysis
    const categories = [...new Set(items.map((item) => item.category))]
    const categoryCount = categories.length

    // Category balance (no category should have >60% of items)
    const categoryDistribution = categories.map(
      (cat) => items.filter((item) => item.category === cat).length / totalItems,
    )
    const maxCategoryPercentage = Math.max(...categoryDistribution)
    const categoryBalanceScore = maxCategoryPercentage > 0.6 ? 40 : 100

    // Pricing consistency (check for outliers)
    const categoryPrices = categories.map((cat) => {
      const categoryItems = items.filter((item) => item.category === cat)
      const prices = categoryItems.map((item) => item.price)
      const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length

      const outliers = prices.filter((price) => Math.abs(price - avgPrice) / avgPrice > 0.3).length

      return outliers / categoryItems.length
    })
    const avgOutlierRate = categoryPrices.reduce((sum, rate) => sum + rate, 0) / categoryPrices.length
    const pricingConsistencyScore = Math.max(0, 100 - avgOutlierRate * 100)

    // Visual completeness
    const visualCompletenessScore = (itemsWithImage / totalItems) * 100

    // Text completion
    const textCompletionScore = (itemsWithDescription / totalItems) * 100

    // AI completeness (items with AI scores > 70)
    const itemsWithGoodAI = items.filter((item) => item.aiScore >= 70).length
    const aiCompletenessScore = (itemsWithGoodAI / totalItems) * 100

    // Overall score (weighted average)
    const overallScore = Math.round(
      categoryBalanceScore * 0.15 +
        pricingConsistencyScore * 0.15 +
        visualCompletenessScore * 0.25 +
        textCompletionScore * 0.25 +
        aiCompletenessScore * 0.2,
    )

    return {
      overallScore,
      totalItems,
      itemsWithImage,
      itemsWithDescription,
      categoryCount,
      categoryBalanceScore,
      pricingConsistencyScore,
      visualCompletenessScore,
      textCompletionScore,
      aiCompletenessScore,
    }
  }

  static generateComboSuggestions(items: MenuItemMetrics[]): ComboSuggestion[] {
    const suggestions: ComboSuggestion[] = []

    // Find frequently co-ordered items
    items.forEach((item) => {
      if (item.coOrderedWith.length > 0) {
        const coOrderedItems = item.coOrderedWith
          .map((id) => items.find((i) => i.id === id))
          .filter(Boolean) as MenuItemMetrics[]

        if (coOrderedItems.length >= 2) {
          const comboItems = [item, ...coOrderedItems.slice(0, 2)]
          const originalPrice = comboItems.reduce((sum, i) => sum + i.price, 0)
          const suggestedPrice = originalPrice * 0.85 // 15% discount
          const savings = originalPrice - suggestedPrice

          suggestions.push({
            id: `combo-${item.id}`,
            name: `${item.name} Combo`,
            suggestedName: `${item.name} Special Combo`,
            includedItems: comboItems,
            originalPrice,
            suggestedPrice,
            savings,
            reason: "Frequently ordered together",
            frequency: item.avgItemsPerOrderWith,
            confidence: 85,
          })
        }
      }
    })

    // Popular + complementary items
    const topItems = items.filter((item) => item.performanceTier === "top").slice(0, 3)
    const appetizers = items.filter((item) => item.category.toLowerCase().includes("appetizer"))
    const mains = items.filter((item) => item.category.toLowerCase().includes("main"))
    const desserts = items.filter((item) => item.category.toLowerCase().includes("dessert"))

    if (appetizers.length > 0 && mains.length > 0) {
      const comboItems = [appetizers[0], mains[0]]
      if (desserts.length > 0) comboItems.push(desserts[0])

      const originalPrice = comboItems.reduce((sum, i) => sum + i.price, 0)
      const suggestedPrice = originalPrice * 0.82 // 18% discount

      suggestions.push({
        id: "combo-course",
        name: "Complete Meal",
        suggestedName: "Chef's Complete Experience",
        includedItems: comboItems,
        originalPrice,
        suggestedPrice,
        savings: originalPrice - suggestedPrice,
        reason: "Upsell opportunity - complete dining experience",
        frequency: 0,
        confidence: 75,
      })
    }

    return suggestions.slice(0, 5) // Return top 5 suggestions
  }

  static generateOptimizationActions(items: MenuItemMetrics[], healthScore: MenuHealthScore): MenuOptimizationAction[] {
    const actions: MenuOptimizationAction[] = []

    // Missing descriptions
    const itemsNeedingDescription = items.filter((item) => item.missingDescription).length
    if (itemsNeedingDescription > 0) {
      actions.push({
        id: "fix-descriptions",
        type: "description",
        title: "Generate Missing Descriptions",
        description: `${itemsNeedingDescription} items need AI-generated descriptions`,
        impact: "high",
        effort: "low",
        itemsAffected: itemsNeedingDescription,
        estimatedRevenue: itemsNeedingDescription * 150, // Estimated monthly revenue increase
      })
    }

    // Missing images
    const itemsNeedingImages = items.filter((item) => item.missingImage).length
    if (itemsNeedingImages > 0) {
      actions.push({
        id: "fix-images",
        type: "visual",
        title: "Add Missing Images",
        description: `${itemsNeedingImages} items need professional photos`,
        impact: "high",
        effort: "medium",
        itemsAffected: itemsNeedingImages,
        estimatedRevenue: itemsNeedingImages * 200,
      })
    }

    // Pricing outliers
    const itemsNeedingRepricing = items.filter((item) => item.suggestRepricing).length
    if (itemsNeedingRepricing > 0) {
      actions.push({
        id: "fix-pricing",
        type: "pricing",
        title: "Fix Pricing Outliers",
        description: `${itemsNeedingRepricing} items have inconsistent pricing`,
        impact: "medium",
        effort: "low",
        itemsAffected: itemsNeedingRepricing,
        estimatedRevenue: itemsNeedingRepricing * 100,
      })
    }

    // Underperforming items
    const underperformingItems = items.filter((item) => item.suggestRemoval).length
    if (underperformingItems > 0) {
      actions.push({
        id: "remove-underperforming",
        type: "removal",
        title: "Remove Underperforming Items",
        description: `${underperformingItems} items haven't been ordered in 60+ days`,
        impact: "medium",
        effort: "low",
        itemsAffected: underperformingItems,
      })
    }

    // Category imbalance
    if (healthScore.categoryBalanceScore < 70) {
      actions.push({
        id: "balance-categories",
        type: "category",
        title: "Balance Menu Categories",
        description: "One category has too many items - consider restructuring",
        impact: "medium",
        effort: "medium",
        itemsAffected: Math.floor(items.length * 0.3),
      })
    }

    // Promotion opportunities
    const promotionItems = items.filter((item) => item.suggestPromotion || item.risingStar).length
    if (promotionItems > 0) {
      actions.push({
        id: "promote-items",
        type: "promotion",
        title: "Promote Top Performers",
        description: `${promotionItems} items are ready for marketing campaigns`,
        impact: "high",
        effort: "low",
        itemsAffected: promotionItems,
        estimatedRevenue: promotionItems * 300,
      })
    }

    return actions.sort((a, b) => {
      const impactScore = { high: 3, medium: 2, low: 1 }
      const effortScore = { low: 3, medium: 2, high: 1 }

      const scoreA = impactScore[a.impact] + effortScore[a.effort]
      const scoreB = impactScore[b.impact] + effortScore[b.effort]

      return scoreB - scoreA
    })
  }

  static applyAutomationFlags(items: MenuItemMetrics[]): MenuItemMetrics[] {
    const now = new Date()
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Calculate percentiles for performance tiers
    const sortedByOrders = [...items].sort((a, b) => b.orderCount - a.orderCount)
    const top10PercentIndex = Math.floor(sortedByOrders.length * 0.1)
    const top30PercentIndex = Math.floor(sortedByOrders.length * 0.3)

    return items.map((item) => {
      const lastOrdered = new Date(item.lastOrderedDate)
      const isTopPerformer = sortedByOrders.indexOf(item) < top10PercentIndex
      const isGoodPerformer = sortedByOrders.indexOf(item) < top30PercentIndex

      // Calculate category average price for outlier detection
      const categoryItems = items.filter((i) => i.category === item.category)
      const categoryAvgPrice = categoryItems.reduce((sum, i) => sum + i.price, 0) / categoryItems.length
      const priceDeviation = Math.abs(item.price - categoryAvgPrice) / categoryAvgPrice

      return {
        ...item,
        // Performance tier
        performanceTier: isTopPerformer ? "top" : isGoodPerformer ? "average" : "low",

        // Automation flags
        suggestRemoval: item.orderCount < 2 && lastOrdered < sixtyDaysAgo,
        suggestPromotion: isTopPerformer && item.totalRevenue > categoryAvgPrice * 10,
        suggestCombo: item.coOrderedWith.length > 0 && item.avgItemsPerOrderWith > 0.25,
        suggestRepricing: priceDeviation > 0.3,
        missingDescription: !item.description || item.description.length < 15,
        missingImage: !item.imageUrl || item.imageUrl.length === 0,
        risingStar: item.orderCount >= 3 && lastOrdered > sevenDaysAgo && !isTopPerformer,
      }
    })
  }

  static async generateMockData(): Promise<MenuIntelligenceData> {
    // Mock menu items with realistic data
    const mockItems: MenuItemMetrics[] = [
      {
        id: "item-1",
        name: "Butter Chicken",
        category: "Main Course",
        price: 16.99,
        isVeg: false,
        description: "Tender chicken in rich tomato cream sauce",
        imageUrl: "/placeholder.svg?height=200&width=300",
        orderCount: 145,
        totalRevenue: 2463.55,
        avgRating: 4.7,
        lastOrderedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        coOrderedWith: ["item-3", "item-5"],
        avgItemsPerOrderWith: 0.35,
        aiDescription: "Succulent chicken pieces simmered in a velvety tomato-based curry with aromatic spices",
        aiTags: ["popular", "signature", "creamy"],
        aiScore: 92,
        performanceTier: "top",
        suggestRemoval: false,
        suggestPromotion: true,
        suggestCombo: true,
        suggestRepricing: false,
        missingDescription: false,
        missingImage: false,
        risingStar: false,
      },
      {
        id: "item-2",
        name: "Paneer Tikka",
        category: "Appetizers",
        price: 12.99,
        isVeg: true,
        description: "Grilled cottage cheese with aromatic spices",
        imageUrl: "/placeholder.svg?height=200&width=300",
        orderCount: 89,
        totalRevenue: 1156.11,
        avgRating: 4.4,
        lastOrderedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        coOrderedWith: ["item-1", "item-4"],
        avgItemsPerOrderWith: 0.28,
        aiDescription: "Marinated cottage cheese cubes grilled to perfection with bell peppers and onions",
        aiTags: ["vegetarian", "grilled", "appetizer"],
        aiScore: 85,
        performanceTier: "average",
        suggestRemoval: false,
        suggestPromotion: false,
        suggestCombo: true,
        suggestRepricing: false,
        missingDescription: false,
        missingImage: false,
        risingStar: false,
      },
      {
        id: "item-3",
        name: "Garlic Naan",
        category: "Breads",
        price: 4.99,
        isVeg: true,
        description: "Fresh baked bread with garlic and herbs",
        imageUrl: "",
        orderCount: 203,
        totalRevenue: 1012.97,
        avgRating: 4.6,
        lastOrderedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        coOrderedWith: ["item-1", "item-4"],
        avgItemsPerOrderWith: 0.45,
        aiDescription: "",
        aiTags: ["bread", "garlic", "side"],
        aiScore: 45,
        performanceTier: "top",
        suggestRemoval: false,
        suggestPromotion: true,
        suggestCombo: true,
        suggestRepricing: false,
        missingDescription: false,
        missingImage: true,
        risingStar: false,
      },
      {
        id: "item-4",
        name: "Dal Makhani",
        category: "Main Course",
        price: 14.99,
        isVeg: true,
        description: "Creamy black lentils slow-cooked with butter and cream",
        imageUrl: "/placeholder.svg?height=200&width=300",
        orderCount: 67,
        totalRevenue: 1004.33,
        avgRating: 4.5,
        lastOrderedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        coOrderedWith: ["item-3", "item-2"],
        avgItemsPerOrderWith: 0.22,
        aiDescription: "Rich and creamy black lentils simmered overnight with traditional spices",
        aiTags: ["vegetarian", "creamy", "traditional"],
        aiScore: 78,
        performanceTier: "average",
        suggestRemoval: false,
        suggestPromotion: false,
        suggestCombo: false,
        suggestRepricing: false,
        missingDescription: false,
        missingImage: false,
        risingStar: false,
      },
      {
        id: "item-5",
        name: "Mango Kulfi",
        category: "Desserts",
        price: 6.99,
        isVeg: true,
        description: "Traditional Indian ice cream with mango",
        imageUrl: "/placeholder.svg?height=200&width=300",
        orderCount: 34,
        totalRevenue: 237.66,
        avgRating: 4.2,
        lastOrderedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        coOrderedWith: ["item-1"],
        avgItemsPerOrderWith: 0.15,
        aiDescription: "Creamy traditional Indian frozen dessert infused with fresh mango puree",
        aiTags: ["dessert", "mango", "traditional"],
        aiScore: 72,
        performanceTier: "average",
        suggestRemoval: false,
        suggestPromotion: false,
        suggestCombo: false,
        suggestRepricing: false,
        missingDescription: false,
        missingImage: false,
        risingStar: false,
      },
      {
        id: "item-6",
        name: "Fish Curry",
        category: "Main Course",
        price: 19.99,
        isVeg: false,
        description: "",
        imageUrl: "",
        orderCount: 8,
        totalRevenue: 159.92,
        avgRating: 3.8,
        lastOrderedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        coOrderedWith: [],
        avgItemsPerOrderWith: 0,
        aiDescription: "",
        aiTags: ["seafood", "curry"],
        aiScore: 25,
        performanceTier: "low",
        suggestRemoval: false,
        suggestPromotion: false,
        suggestCombo: false,
        suggestRepricing: true,
        missingDescription: true,
        missingImage: true,
        risingStar: false,
      },
      {
        id: "item-7",
        name: "Chicken Biryani",
        category: "Main Course",
        price: 18.99,
        isVeg: false,
        description: "Aromatic basmati rice with spiced chicken",
        imageUrl: "/placeholder.svg?height=200&width=300",
        orderCount: 23,
        totalRevenue: 436.77,
        avgRating: 4.8,
        lastOrderedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        coOrderedWith: ["item-2"],
        avgItemsPerOrderWith: 0.18,
        aiDescription: "Fragrant basmati rice layered with tender spiced chicken and aromatic herbs",
        aiTags: ["biryani", "rice", "spiced"],
        aiScore: 88,
        performanceTier: "average",
        suggestRemoval: false,
        suggestPromotion: false,
        suggestCombo: false,
        suggestRepricing: false,
        missingDescription: false,
        missingImage: false,
        risingStar: true,
      },
    ]

    const processedItems = this.applyAutomationFlags(mockItems)
    const healthScore = this.calculateMenuHealth(processedItems)
    const comboSuggestions = this.generateComboSuggestions(processedItems)
    const optimizationActions = this.generateOptimizationActions(processedItems, healthScore)

    return {
      healthScore,
      items: processedItems,
      comboSuggestions,
      optimizationActions,
      lastEvaluated: new Date().toISOString(),
    }
  }
}
