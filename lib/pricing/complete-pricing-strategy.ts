export interface PricingTier {
  id: string
  name: string
  nameHindi: string
  price: number
  priceUSD: number
  popular?: boolean
  features: {
    profile: string[]
    marketing: string[]
    customers: string[]
    ai: string[]
    support: string[]
    integrations: string[]
  }
  limits: {
    menuItems: number | "unlimited"
    campaigns: number | "unlimited"
    customers: number | "unlimited"
    aiCredits: number | "unlimited"
    locations: number
  }
  targetAudience: string[]
  businessTypes: string[]
}

export const COMPLETE_PRICING_TIERS: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    nameHindi: "शुरुआती",
    price: 499,
    priceUSD: 6,
    features: {
      profile: [
        "Basic social profile setup",
        "Google My Business integration",
        "Basic menu management",
        "Review monitoring",
      ],
      marketing: ["2 campaigns per month", "Basic social media posts", "Email templates", "Performance tracking"],
      customers: ["Customer database (up to 500)", "Basic segmentation", "Review management", "Basic analytics"],
      ai: [
        "50 AI content generations/month",
        "Basic menu descriptions",
        "Simple social posts",
        "Review response suggestions",
      ],
      support: ["Email support", "Knowledge base access", "Video tutorials"],
      integrations: ["Google My Business", "Zomato Basic", "WhatsApp Business"],
    },
    limits: {
      menuItems: 25,
      campaigns: 2,
      customers: 500,
      aiCredits: 50,
      locations: 1,
    },
    targetAudience: ["Small cafes", "Cloud kitchens", "Street food vendors"],
    businessTypes: ["Cafe", "Cloud Kitchen", "Quick Service"],
  },
  {
    id: "professional",
    name: "Professional",
    nameHindi: "व्यावसायिक",
    price: 1499,
    priceUSD: 18,
    popular: true,
    features: {
      profile: [
        "Advanced social profile",
        "Multi-platform integration",
        "Smart menu management",
        "Advanced review management",
        "Brand asset management",
      ],
      marketing: [
        "Unlimited campaigns",
        "AI-powered content creation",
        "Advanced social media management",
        "Email marketing automation",
        "ROI prediction & analytics",
        "Competitor analysis",
      ],
      customers: [
        "Unlimited customer database",
        "AI-powered segmentation",
        "Churn prediction",
        "LTV analysis",
        "Personalized recommendations",
        "Feedback analysis",
      ],
      ai: [
        "500 AI content generations/month",
        "Advanced menu optimization",
        "Campaign strategy generation",
        "Customer insights",
        "Personalized responses",
        "Image generation",
      ],
      support: ["Priority email support", "Phone support", "Live chat", "Dedicated account manager"],
      integrations: [
        "All major platforms",
        "Zomato Pro",
        "Swiggy Partner",
        "Payment gateways",
        "POS systems",
        "Delivery platforms",
      ],
    },
    limits: {
      menuItems: "unlimited",
      campaigns: "unlimited",
      customers: "unlimited",
      aiCredits: 500,
      locations: 3,
    },
    targetAudience: ["Mid-size restaurants", "QSR chains", "Family restaurants"],
    businessTypes: ["Restaurant", "QSR", "Casual Dining", "Bakery"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    nameHindi: "उद्यम",
    price: 3999,
    priceUSD: 48,
    features: {
      profile: [
        "Multi-location management",
        "White-label solutions",
        "Custom branding",
        "Advanced analytics",
        "API access",
      ],
      marketing: [
        "Enterprise campaign management",
        "Custom AI model training",
        "Advanced automation",
        "Multi-location campaigns",
        "Custom integrations",
        "Dedicated marketing strategist",
      ],
      customers: [
        "Enterprise customer management",
        "Advanced AI analytics",
        "Custom segmentation models",
        "Predictive analytics",
        "Customer journey mapping",
        "Advanced reporting",
      ],
      ai: [
        "Unlimited AI generations",
        "Custom AI model training",
        "Advanced personalization",
        "Predictive analytics",
        "Custom workflows",
        "API access",
      ],
      support: [
        "24/7 priority support",
        "Dedicated success manager",
        "Custom training",
        "On-site support",
        "SLA guarantees",
      ],
      integrations: [
        "Custom integrations",
        "Enterprise APIs",
        "ERP systems",
        "Advanced POS",
        "Business intelligence tools",
        "Custom webhooks",
      ],
    },
    limits: {
      menuItems: "unlimited",
      campaigns: "unlimited",
      customers: "unlimited",
      aiCredits: "unlimited",
      locations: "unlimited",
    },
    targetAudience: ["Restaurant chains", "Franchises", "Large enterprises"],
    businessTypes: ["Chain Restaurant", "Franchise", "Hotel Restaurant", "Enterprise"],
  },
]

export const MODULE_PRICING = {
  profile: {
    starter: 199,
    professional: 599,
    enterprise: 1299,
  },
  marketing: {
    starter: 299,
    professional: 899,
    enterprise: 1699,
  },
  customers: {
    starter: 199,
    professional: 599,
    enterprise: 1299,
  },
}

export const AI_CREDITS_PRICING = {
  additional_50: 99,
  additional_200: 299,
  additional_500: 599,
  additional_unlimited: 1199,
}

export const INDIAN_MARKET_ANALYSIS = {
  marketSize: "₹2,400 crores by 2025",
  competitors: {
    zomato: { pricing: "₹1,200-3,000/month", marketShare: "35%" },
    swiggy: { pricing: "₹800-2,500/month", marketShare: "30%" },
    others: { pricing: "₹500-2,000/month", marketShare: "35%" },
  },
  targetMarket: {
    tier1Cities: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune"],
    tier2Cities: ["Ahmedabad", "Kolkata", "Surat", "Jaipur", "Lucknow", "Kanpur"],
    totalRestaurants: 700000,
    digitalAdoption: "35%",
    growthRate: "25% YoY",
  },
  revenueProjections: {
    year1: { customers: 720, revenue: "₹1.08 crores" },
    year2: { customers: 2400, revenue: "₹4.32 crores" },
    year3: { customers: 5300, revenue: "₹10.8 crores" },
  },
}

export function calculateModularPricing(modules: string[], tier: string): number {
  const tierPricing = MODULE_PRICING as any
  return modules.reduce((total, module) => {
    return total + (tierPricing[module]?.[tier] || 0)
  }, 0)
}

export function getRecommendedTier(businessType: string, monthlyRevenue: number): string {
  if (monthlyRevenue < 100000) return "starter"
  if (monthlyRevenue < 500000) return "professional"
  return "enterprise"
}

export function calculateROI(
  tier: string,
  monthlyRevenue: number,
): {
  expectedIncrease: number
  paybackPeriod: number
  annualROI: number
} {
  const tierData = COMPLETE_PRICING_TIERS.find((t) => t.id === tier)
  if (!tierData) return { expectedIncrease: 0, paybackPeriod: 0, annualROI: 0 }

  const monthlyInvestment = tierData.price
  const expectedIncrease = monthlyRevenue * (tier === "starter" ? 0.15 : tier === "professional" ? 0.25 : 0.35)
  const paybackPeriod = monthlyInvestment / expectedIncrease
  const annualROI = ((expectedIncrease * 12) / (monthlyInvestment * 12)) * 100

  return {
    expectedIncrease: Math.round(expectedIncrease),
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
    annualROI: Math.round(annualROI),
  }
}
