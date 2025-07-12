export interface MenuItemMetrics {
  id: string
  name: string
  category: string
  price: number
  isVeg: boolean
  description: string
  imageUrl?: string

  // Derived metrics
  orderCount: number
  totalRevenue: number
  avgRating: number
  lastOrderedDate: string
  coOrderedWith: string[]
  avgItemsPerOrderWith: number

  // AI-generated fields
  aiDescription?: string
  aiTags: string[]
  aiScore: number // 0-100
  performanceTier: "top" | "average" | "low"

  // Automation flags
  suggestRemoval: boolean
  suggestPromotion: boolean
  suggestCombo: boolean
  suggestRepricing: boolean
  missingDescription: boolean
  missingImage: boolean
  risingStar: boolean
}

export interface MenuHealthScore {
  overallScore: number // 0-100
  totalItems: number
  itemsWithImage: number
  itemsWithDescription: number
  categoryCount: number
  categoryBalanceScore: number
  pricingConsistencyScore: number
  visualCompletenessScore: number
  textCompletionScore: number
  aiCompletenessScore: number
}

export interface ComboSuggestion {
  id: string
  name: string
  suggestedName: string
  includedItems: MenuItemMetrics[]
  originalPrice: number
  suggestedPrice: number
  savings: number
  reason: string
  frequency: number
  confidence: number
}

export interface MenuOptimizationAction {
  id: string
  type: "description" | "pricing" | "category" | "visual" | "promotion" | "removal"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  effort: "low" | "medium" | "high"
  itemsAffected: number
  estimatedRevenue?: number
}

export interface MenuIntelligenceData {
  healthScore: MenuHealthScore
  items: MenuItemMetrics[]
  comboSuggestions: ComboSuggestion[]
  optimizationActions: MenuOptimizationAction[]
  lastEvaluated: string
}
