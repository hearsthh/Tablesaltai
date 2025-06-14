// Pricing calculator for TableSalt AI platform
export interface PricingTier {
  name: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  limits: {
    restaurants: number
    customers: number
    campaigns: number
    aiCredits: number
    smsCredits: number
    storage: string
  }
  aiCosts: {
    openai: number
    fal: number
    anthropic: number
    cohere: number
    twilio: number
    assemblyai: number
    total: number
  }
}

export const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    monthlyPrice: 49,
    yearlyPrice: 490, // 2 months free
    features: [
      "1 Restaurant Profile",
      "Basic Menu Management",
      "Social Media Post Generator",
      "Basic Customer Management",
      "Email Marketing",
      "Basic Analytics",
      "Standard Support",
    ],
    limits: {
      restaurants: 1,
      customers: 500,
      campaigns: 10,
      aiCredits: 1000,
      smsCredits: 100,
      storage: "5GB",
    },
    aiCosts: {
      openai: 15,
      fal: 10,
      anthropic: 0,
      cohere: 5,
      twilio: 8,
      assemblyai: 0,
      total: 38,
    },
  },
  {
    name: "Professional",
    monthlyPrice: 149,
    yearlyPrice: 1490, // 2 months free
    features: [
      "Up to 3 Restaurant Profiles",
      "Advanced Menu Management with AI",
      "Complete Social Media Suite",
      "Advanced Customer Segmentation",
      "Email + SMS Marketing",
      "AI-Powered Review Responses",
      "Advanced Analytics & Insights",
      "Priority Support",
      "WhatsApp Integration",
    ],
    limits: {
      restaurants: 3,
      customers: 2500,
      campaigns: 50,
      aiCredits: 5000,
      smsCredits: 500,
      storage: "25GB",
    },
    aiCosts: {
      openai: 40,
      fal: 25,
      anthropic: 20,
      cohere: 15,
      twilio: 25,
      assemblyai: 10,
      total: 135,
    },
  },
  {
    name: "Enterprise",
    monthlyPrice: 399,
    yearlyPrice: 3990, // 2 months free
    features: [
      "Unlimited Restaurant Profiles",
      "Full AI Marketing Suite",
      "Advanced Customer Intelligence",
      "Multi-Channel Marketing Automation",
      "Voice Review Transcription",
      "Real-time Analytics Dashboard",
      "Custom Integrations",
      "Dedicated Account Manager",
      "White-label Options",
    ],
    limits: {
      restaurants: -1, // unlimited
      customers: 10000,
      campaigns: -1, // unlimited
      aiCredits: 20000,
      smsCredits: 2000,
      storage: "100GB",
    },
    aiCosts: {
      openai: 100,
      fal: 60,
      anthropic: 80,
      cohere: 40,
      twilio: 50,
      assemblyai: 30,
      total: 360,
    },
  },
]

// Calculate profit margins
export function calculateMargins(tier: PricingTier) {
  const revenue = tier.monthlyPrice
  const aiCosts = tier.aiCosts.total
  const infrastructureCosts = revenue * 0.15 // 15% for hosting, CDN, etc.
  const supportCosts = revenue * 0.1 // 10% for customer support
  const developmentCosts = revenue * 0.2 // 20% for ongoing development
  const marketingCosts = revenue * 0.25 // 25% for customer acquisition

  const totalCosts = aiCosts + infrastructureCosts + supportCosts + developmentCosts + marketingCosts
  const grossProfit = revenue - totalCosts
  const marginPercentage = (grossProfit / revenue) * 100

  return {
    revenue,
    costs: {
      ai: aiCosts,
      infrastructure: infrastructureCosts,
      support: supportCosts,
      development: developmentCosts,
      marketing: marketingCosts,
      total: totalCosts,
    },
    grossProfit,
    marginPercentage: Math.round(marginPercentage * 100) / 100,
  }
}

// Alternative pricing strategies
export const alternativePricingStrategies = [
  {
    name: "Usage-Based Pricing",
    description: "Pay per AI credit used",
    structure: {
      basePrice: 29,
      aiCreditPrice: 0.05, // per credit
      smsPrice: 0.08, // per SMS
      storagePrice: 2, // per GB
    },
    pros: ["Lower barrier to entry", "Scales with usage", "Fair for light users"],
    cons: ["Unpredictable revenue", "Complex billing", "May discourage usage"],
  },
  {
    name: "Freemium Model",
    description: "Free tier with premium upgrades",
    structure: {
      free: {
        price: 0,
        limits: "1 restaurant, 100 customers, 5 campaigns/month",
      },
      premium: {
        price: 99,
        limits: "Unlimited restaurants, 5000 customers, unlimited campaigns",
      },
    },
    pros: ["High user acquisition", "Viral growth potential", "Market penetration"],
    cons: ["High infrastructure costs", "Low conversion rates", "Support burden"],
  },
  {
    name: "Value-Based Pricing",
    description: "Price based on restaurant revenue impact",
    structure: {
      percentage: "2-5% of additional revenue generated",
      minimum: 199,
      maximum: 999,
    },
    pros: ["Aligns with customer success", "Higher margins possible", "Justifiable ROI"],
    cons: ["Complex tracking", "Requires proof of impact", "Sales complexity"],
  },
]

// Competitor analysis
export const competitorPricing = [
  {
    name: "Toast Marketing",
    pricing: "$75-200/month",
    features: "Basic marketing tools, limited AI",
  },
  {
    name: "Mailchimp Restaurant",
    pricing: "$50-300/month",
    features: "Email marketing, basic automation",
  },
  {
    name: "OpenTable Marketing",
    pricing: "$149-399/month",
    features: "Reservation marketing, basic insights",
  },
  {
    name: "Resy Marketing Suite",
    pricing: "$199-499/month",
    features: "Advanced marketing, customer insights",
  },
]

// ROI calculator for restaurants
export function calculateRestaurantROI({
  monthlyRevenue,
  customerAcquisitionCost,
  averageOrderValue,
  customerLifetimeValue,
  pricingTier,
}: {
  monthlyRevenue: number
  customerAcquisitionCost: number
  averageOrderValue: number
  customerLifetimeValue: number
  pricingTier: PricingTier
}) {
  // Estimated improvements from AI marketing
  const revenueIncrease = monthlyRevenue * 0.15 // 15% revenue increase
  const cacReduction = customerAcquisitionCost * 0.3 // 30% CAC reduction
  const aovIncrease = averageOrderValue * 0.12 // 12% AOV increase
  const clvIncrease = customerLifetimeValue * 0.25 // 25% CLV increase

  const monthlyBenefit = revenueIncrease + cacReduction * 10 + aovIncrease * 30 // rough calculation
  const monthlyCost = pricingTier.monthlyPrice
  const monthlyROI = ((monthlyBenefit - monthlyCost) / monthlyCost) * 100

  return {
    monthlyBenefit: Math.round(monthlyBenefit),
    monthlyCost,
    monthlyROI: Math.round(monthlyROI * 100) / 100,
    paybackPeriod: Math.ceil(monthlyCost / (monthlyBenefit - monthlyCost)),
    annualROI: Math.round(monthlyROI * 12 * 100) / 100,
  }
}
