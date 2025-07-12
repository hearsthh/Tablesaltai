// Core type definitions for the entire application
export interface Restaurant {
  id: string
  userId: string
  basicInfo: RestaurantBasicInfo
  details: RestaurantDetails
  mediaAssets: MediaAsset[]
  menuData: MenuData
  reviewData: ReviewData
  customerData: CustomerData
  marketingData: MarketingData
  integrations: Integration[]
  subscription: SubscriptionInfo
  createdAt: string
  updatedAt: string
}

export interface RestaurantBasicInfo {
  name: string
  tagline?: string
  description: string
  cuisineType: string[]
  restaurantType: string
  priceRange: string
  address: Address
  contact: ContactInfo
  operatingHours: OperatingHours
  capacity: number
  establishedYear?: number
}

export interface RestaurantDetails {
  story: string
  mission: string
  values: string[]
  awards: Award[]
  certifications: Certification[]
  chef: ChefInfo
  specialties: string[]
  dietaryOptions: string[]
  ambiance: string[]
  parkingInfo: string
  accessibility: string[]
}

export interface MediaAsset {
  id: string
  url: string
  type: "image" | "video"
  category: "food" | "interior" | "exterior" | "staff" | "events" | "logo" | "menu"
  subcategory?: string
  title?: string
  description?: string
  tags: string[]
  dimensions: {
    width: number
    height: number
    aspectRatio: string
  }
  metadata: {
    size: number
    format: string
    uploadedAt: string
    uploadedBy: string
  }
  isActive: boolean
  isFeatured: boolean
  displayOrder: number
}

export interface MenuData {
  categories: MenuCategory[]
  items: MenuItem[]
  combos: MenuCombo[]
  seasonalMenus: SeasonalMenu[]
  analytics: MenuAnalytics
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  images: string[]
  ingredients: string[]
  allergens: string[]
  nutritionalInfo: NutritionalInfo
  dietaryTags: string[]
  preparationTime: number
  spiceLevel: number
  isAvailable: boolean
  isPopular: boolean
  isNew: boolean
  salesData: ItemSalesData
  aiGeneratedTags: string[]
  aiGeneratedDescription?: string
}

export interface ReviewData {
  reviews: Review[]
  analytics: ReviewAnalytics
  responseTemplates: ResponseTemplate[]
  sentimentAnalysis: SentimentAnalysis
  platforms: ReviewPlatform[]
}

export interface CustomerData {
  customers: Customer[]
  segments: CustomerSegment[]
  analytics: CustomerAnalytics
  loyaltyProgram: LoyaltyProgram
  demographics: Demographics
}

export interface MarketingData {
  campaigns: Campaign[]
  strategies: MarketingStrategy[]
  content: GeneratedContent[]
  performance: PerformanceMetrics
  channels: MarketingChannel[]
  budget: BudgetAllocation
}

export interface Integration {
  id: string
  type: "pos" | "delivery" | "social" | "review" | "reservation" | "payment"
  platform: string
  status: "connected" | "disconnected" | "error"
  credentials: Record<string, any>
  lastSync: string
  syncFrequency: string
  dataMapping: Record<string, string>
}

export interface SubscriptionInfo {
  plan: "starter" | "professional" | "enterprise"
  status: "active" | "cancelled" | "past_due"
  currentPeriodStart: string
  currentPeriodEnd: string
  features: string[]
  usage: UsageMetrics
}
</merged_code>
