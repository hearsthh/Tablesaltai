// India-specific pricing strategy for TableSalt Profile Module
export interface IndianPricingTier {
  id: string
  name: string
  nameHindi?: string
  monthlyPrice: number
  yearlyPrice: number
  currency: "INR"
  features: string[]
  limits: {
    socialProfiles: number
    menuItems: number
    reviewPlatforms: number
    monthlyAnalytics: boolean
    aiCredits: number
    customBranding: boolean
    prioritySupport: boolean
  }
  targetAudience: string
  popular?: boolean
}

export const indianPricingTiers: IndianPricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    nameHindi: "शुरुआती",
    monthlyPrice: 499, // ~$6 USD
    yearlyPrice: 4990, // 2 months free
    currency: "INR",
    features: [
      "Basic Social Profile",
      "Menu Management (up to 25 items)",
      "Google My Business Integration",
      "Basic Review Monitoring",
      "WhatsApp Business Card",
      "Basic Analytics",
      "Email Support",
    ],
    limits: {
      socialProfiles: 1,
      menuItems: 25,
      reviewPlatforms: 2, // Google + 1 other
      monthlyAnalytics: true,
      aiCredits: 50,
      customBranding: false,
      prioritySupport: false,
    },
    targetAudience: "Small cafes, street food vendors, cloud kitchens",
  },
  {
    id: "professional",
    name: "Professional",
    nameHindi: "व्यावसायिक",
    monthlyPrice: 1499, // ~$18 USD
    yearlyPrice: 14990, // 2 months free
    currency: "INR",
    popular: true,
    features: [
      "Advanced Social Profile with Events",
      "Unlimited Menu Items",
      "All Platform Integrations (Zomato, Swiggy, Google, etc.)",
      "AI-Powered Review Responses",
      "Advanced Analytics & Insights",
      "Custom Branding",
      "Festival & Seasonal Promotions",
      "WhatsApp Integration",
      "Priority Support",
    ],
    limits: {
      socialProfiles: 3,
      menuItems: -1, // unlimited
      reviewPlatforms: -1, // all platforms
      monthlyAnalytics: true,
      aiCredits: 200,
      customBranding: true,
      prioritySupport: true,
    },
    targetAudience: "Mid-size restaurants, QSRs, multi-location brands",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    nameHindi: "उद्यम",
    monthlyPrice: 3999, // ~$48 USD
    yearlyPrice: 39990, // 2 months free
    currency: "INR",
    features: [
      "Multi-Location Management",
      "White-label Solutions",
      "Advanced AI Content Generation",
      "Custom Integrations",
      "Dedicated Account Manager",
      "Advanced Analytics & Reporting",
      "API Access",
      "Custom Training",
      "24/7 Phone Support",
    ],
    limits: {
      socialProfiles: -1, // unlimited
      menuItems: -1, // unlimited
      reviewPlatforms: -1, // all platforms
      monthlyAnalytics: true,
      aiCredits: 1000,
      customBranding: true,
      prioritySupport: true,
    },
    targetAudience: "Restaurant chains, large enterprises, franchise operations",
  },
]

// Indian market analysis
export const indianMarketAnalysis = {
  marketSize: {
    totalRestaurants: 700000,
    digitallyActive: 150000,
    targetMarket: 50000, // restaurants likely to pay for digital tools
  },
  competitors: [
    {
      name: "Zomato for Business",
      pricing: "₹1,200-3,000/month",
      features: "Listing management, basic analytics",
      marketShare: "35%",
    },
    {
      name: "Swiggy for Restaurants",
      pricing: "₹800-2,500/month",
      features: "Delivery management, promotions",
      marketShare: "30%",
    },
    {
      name: "Dineout Manager",
      pricing: "₹500-1,500/month",
      features: "Reservation management, basic marketing",
      marketShare: "10%",
    },
    {
      name: "Local Solutions",
      pricing: "₹300-1,000/month",
      features: "Basic website, menu management",
      marketShare: "25%",
    },
  ],
  paymentMethods: [
    "UPI (Unified Payments Interface)",
    "Razorpay",
    "Paytm Business",
    "PhonePe Business",
    "Net Banking",
    "Credit/Debit Cards",
  ],
  regionalConsiderations: {
    languages: ["English", "Hindi", "Regional languages"],
    festivals: ["Diwali", "Holi", "Eid", "Christmas", "Regional festivals"],
    businessHours: "Typically 10 AM - 11 PM",
    peakSeasons: ["Festival seasons", "Wedding seasons", "Summer holidays"],
  },
}

// Revenue projections for India launch
export function calculateIndianRevenueProjections() {
  const projections = {
    year1: {
      starter: { customers: 500, revenue: 500 * 499 * 12 },
      professional: { customers: 200, revenue: 200 * 1499 * 12 },
      enterprise: { customers: 20, revenue: 20 * 3999 * 12 },
    },
    year2: {
      starter: { customers: 1500, revenue: 1500 * 499 * 12 },
      professional: { customers: 800, revenue: 800 * 1499 * 12 },
      enterprise: { customers: 100, revenue: 100 * 3999 * 12 },
    },
    year3: {
      starter: { customers: 3000, revenue: 3000 * 499 * 12 },
      professional: { customers: 2000, revenue: 2000 * 1499 * 12 },
      enterprise: { customers: 300, revenue: 300 * 3999 * 12 },
    },
  }

  return projections
}

// Localization for Indian market
export const indianLocalization = {
  currencies: {
    display: "₹",
    code: "INR",
  },
  languages: {
    primary: "en",
    secondary: ["hi", "mr", "ta", "te", "bn"],
  },
  businessTypes: [
    "Fine Dining Restaurant",
    "Casual Dining",
    "Quick Service Restaurant (QSR)",
    "Cloud Kitchen",
    "Street Food Vendor",
    "Cafe/Coffee Shop",
    "Sweet Shop",
    "Bakery",
    "Dhaba",
    "Food Truck",
  ],
  cuisineTypes: [
    "North Indian",
    "South Indian",
    "Chinese",
    "Continental",
    "Italian",
    "Mexican",
    "Thai",
    "Bengali",
    "Gujarati",
    "Punjabi",
    "Maharashtrian",
    "Rajasthani",
    "Street Food",
    "Fast Food",
    "Desserts & Sweets",
  ],
}
