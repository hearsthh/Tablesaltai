// Enhanced types for social profile with all missing fields

export interface LoyaltyProgram {
  enabled: boolean
  name: string
  description: string
  pointsPerRupee: number
  rewardThreshold: number
  rewardValue: number
}

export interface ReservationSystem {
  enabled: boolean
  systemType: "builtin" | "external" | "integrated"
  externalUrl?: string
  advanceDays: number
  minPartySize: number
  maxPartySize: number
}

export interface DetailedBrandAssets {
  logo: string | null
  logoDark: string | null
  favicon: string | null
  primaryColor: string
  secondaryColor: string
  brandVoice: string
  brandPositioning: "casual" | "premium" | "family" | "trendy"
  brandGuidelines: string
}

export interface ChefProfile {
  name: string
  title: string
  bio: string
  photoUrl: string | null
  experienceYears: number
  specialties: string[]
  awards: string[]
}

export interface SocialMediaFollowers {
  facebook: number
  instagram: number
  twitter: number
  youtube: number
  linkedin?: number
}

export interface SpecialOffer {
  id: string
  title: string
  description: string
  offerType: "percentage" | "fixed_amount" | "bogo" | "free_item"
  discountValue?: number
  discountPercentage?: number
  minimumOrderValue?: number
  maximumDiscount?: number
  validFrom: string
  validUntil: string
  validDays: string[]
  validTimes: {
    start: string
    end: string
  }
  termsConditions: string
  usageLimit?: number
  usageCount: number
  isActive: boolean
  isFeatured: boolean
}

export interface RestaurantAward {
  id: string
  awardName: string
  awardDescription: string
  issuingOrganization: string
  awardYear: number
  awardDate: string
  awardCategory: "food_quality" | "service" | "ambiance" | "overall"
  awardLevel: "local" | "city" | "state" | "national" | "international"
  certificateUrl?: string
  isFeatured: boolean
  displayOrder: number
}

export interface PressCoverage {
  id: string
  publicationName: string
  articleTitle: string
  articleUrl?: string
  authorName?: string
  publicationDate: string
  articleExcerpt: string
  coverageType: "review" | "feature" | "news" | "interview"
  sentiment: "positive" | "negative" | "neutral"
  reachEstimate?: number
  isFeatured: boolean
}

export interface MediaAsset {
  id: string
  fileName: string
  fileUrl: string
  fileType: "image" | "video"
  fileSize?: number
  mimeType?: string
  width?: number
  height?: number
  category: "food" | "interior" | "exterior" | "staff" | "logo" | "menu"
  subcategory?: string
  title?: string
  description?: string
  altText?: string
  isFeatured: boolean
  displayOrder: number
}

export interface AIProfileGeneration {
  generated: boolean
  generationDate?: string
  generationSource?: string
  completionPercentage: number
}

export interface CompleteSocialProfile {
  // Basic Info
  restaurantName: string
  cuisine: string
  description: string
  tagline: string
  priceRange: string
  phone: string
  email: string
  website: string
  address: string

  // Brand Assets
  brandAssets: DetailedBrandAssets

  // Operating Hours
  operatingHours: {
    [key: string]: {
      open: string
      close: string
      closed: boolean
    }
  }

  // Chef Profile
  chef: ChefProfile

  // Amenities
  amenities: string[]

  // Media Assets
  mediaAssets: MediaAsset[]

  // Special Offers
  specialOffers: SpecialOffer[]

  // Awards & Recognition
  awards: RestaurantAward[]

  // Press Coverage
  pressCoverage: PressCoverage[]

  // Loyalty Program
  loyaltyProgram: LoyaltyProgram

  // Reservation System
  reservationSystem: ReservationSystem

  // Social Media
  socialMedia: {
    [platform: string]: string
  }
  socialMediaFollowers: SocialMediaFollowers

  // AI Generation Info
  aiGeneration: AIProfileGeneration
}
