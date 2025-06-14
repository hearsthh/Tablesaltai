// AI Cost Analyzer for TableSalt AI platform
export interface AIServiceCost {
  service: string
  costPerUnit: number
  unitType: string
  averageUnitsPerMonth: {
    starter: number
    professional: number
    enterprise: number
  }
  monthlyCost: {
    starter: number
    professional: number
    enterprise: number
  }
  features: string[]
  optimizationPotential: number // 0-1 scale
}

export interface AIFeatureCost {
  feature: string
  services: string[]
  monthlyCost: {
    starter: number
    professional: number
    enterprise: number
  }
  usageMetrics: {
    averagePerRestaurant: number
    unitType: string
  }
  businessValue: number // 1-10 scale
  costEfficiency: number // 1-10 scale
}

// Detailed breakdown of AI service costs
export const aiServiceCosts: AIServiceCost[] = [
  {
    service: "OpenAI GPT-4o",
    costPerUnit: 0.01,
    unitType: "1K tokens",
    averageUnitsPerMonth: {
      starter: 1000,
      professional: 3000,
      enterprise: 8000,
    },
    monthlyCost: {
      starter: 10,
      professional: 30,
      enterprise: 80,
    },
    features: ["Menu descriptions", "Marketing content", "Customer insights", "Review responses", "Email campaigns"],
    optimizationPotential: 0.4,
  },
  {
    service: "OpenAI GPT-3.5 Turbo",
    costPerUnit: 0.0015,
    unitType: "1K tokens",
    averageUnitsPerMonth: {
      starter: 3000,
      professional: 6000,
      enterprise: 12000,
    },
    monthlyCost: {
      starter: 4.5,
      professional: 9,
      enterprise: 18,
    },
    features: ["Quick responses", "Content classification", "Basic summaries", "Simple content generation"],
    optimizationPotential: 0.6,
  },
  {
    service: "OpenAI Embeddings",
    costPerUnit: 0.0001,
    unitType: "1K tokens",
    averageUnitsPerMonth: {
      starter: 5000,
      professional: 10000,
      enterprise: 20000,
    },
    monthlyCost: {
      starter: 0.5,
      professional: 1,
      enterprise: 2,
    },
    features: ["Semantic search", "Content recommendations", "Customer similarity"],
    optimizationPotential: 0.3,
  },
  {
    service: "Fal AI Image Generation",
    costPerUnit: 0.05,
    unitType: "image",
    averageUnitsPerMonth: {
      starter: 200,
      professional: 500,
      enterprise: 1200,
    },
    monthlyCost: {
      starter: 10,
      professional: 25,
      enterprise: 60,
    },
    features: ["Food photography", "Restaurant ambiance", "Marketing visuals", "Social media graphics"],
    optimizationPotential: 0.5,
  },
  {
    service: "Anthropic Claude",
    costPerUnit: 0.008,
    unitType: "1K tokens",
    averageUnitsPerMonth: {
      starter: 0,
      professional: 2500,
      enterprise: 10000,
    },
    monthlyCost: {
      starter: 0,
      professional: 20,
      enterprise: 80,
    },
    features: [
      "Nuanced customer communication",
      "Complex feedback analysis",
      "Strategic marketing insights",
      "Personalized campaigns",
    ],
    optimizationPotential: 0.35,
  },
  {
    service: "Cohere Embeddings",
    costPerUnit: 0.0001,
    unitType: "1K tokens",
    averageUnitsPerMonth: {
      starter: 50000,
      professional: 150000,
      enterprise: 400000,
    },
    monthlyCost: {
      starter: 5,
      professional: 15,
      enterprise: 40,
    },
    features: ["Customer segmentation", "Review classification", "Content organization", "Semantic search"],
    optimizationPotential: 0.7,
  },
  {
    service: "Twilio SMS",
    costPerUnit: 0.0075,
    unitType: "message",
    averageUnitsPerMonth: {
      starter: 100,
      professional: 500,
      enterprise: 2000,
    },
    monthlyCost: {
      starter: 0.75,
      professional: 3.75,
      enterprise: 15,
    },
    features: ["Marketing campaigns", "Reservation confirmations", "Special offers", "Customer notifications"],
    optimizationPotential: 0.2,
  },
  {
    service: "AssemblyAI",
    costPerUnit: 0.00042,
    unitType: "second",
    averageUnitsPerMonth: {
      starter: 0,
      professional: 24000,
      enterprise: 72000,
    },
    monthlyCost: {
      starter: 0,
      professional: 10,
      enterprise: 30,
    },
    features: ["Voice review transcription", "Phone order processing", "Customer service calls"],
    optimizationPotential: 0.4,
  },
  {
    service: "Replicate",
    costPerUnit: 0.05,
    unitType: "image",
    averageUnitsPerMonth: {
      starter: 0,
      professional: 0,
      enterprise: 200,
    },
    monthlyCost: {
      starter: 0,
      professional: 0,
      enterprise: 10,
    },
    features: ["Premium food photography", "High-quality marketing visuals", "Custom design elements"],
    optimizationPotential: 0.3,
  },
  {
    service: "DeepInfra",
    costPerUnit: 0.00005,
    unitType: "1K tokens",
    averageUnitsPerMonth: {
      starter: 100000,
      professional: 300000,
      enterprise: 1000000,
    },
    monthlyCost: {
      starter: 5,
      professional: 15,
      enterprise: 50,
    },
    features: ["Budget embeddings", "Sentiment analysis", "Text classification", "Content filtering"],
    optimizationPotential: 0.6,
  },
]

// Breakdown by feature
export const aiFeatureCosts: AIFeatureCost[] = [
  {
    feature: "Content Generation",
    services: ["OpenAI GPT-4o", "OpenAI GPT-3.5 Turbo", "Anthropic Claude"],
    monthlyCost: {
      starter: 6,
      professional: 18,
      enterprise: 50,
    },
    usageMetrics: {
      averagePerRestaurant: 50,
      unitType: "pieces of content/month",
    },
    businessValue: 9,
    costEfficiency: 8,
  },
  {
    feature: "Image Generation",
    services: ["Fal AI", "Replicate"],
    monthlyCost: {
      starter: 10,
      professional: 25,
      enterprise: 70,
    },
    usageMetrics: {
      averagePerRestaurant: 40,
      unitType: "images/month",
    },
    businessValue: 10,
    costEfficiency: 7,
  },
  {
    feature: "Customer Insights",
    services: ["OpenAI GPT-4o", "Cohere Embeddings", "DeepInfra"],
    monthlyCost: {
      starter: 8,
      professional: 25,
      enterprise: 70,
    },
    usageMetrics: {
      averagePerRestaurant: 1,
      unitType: "analysis/month",
    },
    businessValue: 10,
    costEfficiency: 9,
  },
  {
    feature: "Review Management",
    services: ["OpenAI GPT-4o", "OpenAI GPT-3.5 Turbo", "Cohere Embeddings"],
    monthlyCost: {
      starter: 5,
      professional: 15,
      enterprise: 40,
    },
    usageMetrics: {
      averagePerRestaurant: 30,
      unitType: "reviews/month",
    },
    businessValue: 8,
    costEfficiency: 7,
  },
  {
    feature: "Menu Optimization",
    services: ["OpenAI GPT-4o", "Fal AI"],
    monthlyCost: {
      starter: 4,
      professional: 12,
      enterprise: 30,
    },
    usageMetrics: {
      averagePerRestaurant: 20,
      unitType: "menu items/month",
    },
    businessValue: 7,
    costEfficiency: 6,
  },
  {
    feature: "Email Marketing",
    services: ["OpenAI GPT-4o", "OpenAI GPT-3.5 Turbo", "Anthropic Claude"],
    monthlyCost: {
      starter: 3,
      professional: 10,
      enterprise: 30,
    },
    usageMetrics: {
      averagePerRestaurant: 4,
      unitType: "campaigns/month",
    },
    businessValue: 8,
    costEfficiency: 8,
  },
  {
    feature: "SMS Marketing",
    services: ["OpenAI GPT-3.5 Turbo", "Twilio SMS"],
    monthlyCost: {
      starter: 2,
      professional: 10,
      enterprise: 25,
    },
    usageMetrics: {
      averagePerRestaurant: 2,
      unitType: "campaigns/month",
    },
    businessValue: 7,
    costEfficiency: 6,
  },
  {
    feature: "Voice Processing",
    services: ["AssemblyAI"],
    monthlyCost: {
      starter: 0,
      professional: 10,
      enterprise: 30,
    },
    usageMetrics: {
      averagePerRestaurant: 10,
      unitType: "hours/month",
    },
    businessValue: 6,
    costEfficiency: 5,
  },
  {
    feature: "Social Media",
    services: ["OpenAI GPT-4o", "OpenAI GPT-3.5 Turbo", "Fal AI"],
    monthlyCost: {
      starter: 5,
      professional: 15,
      enterprise: 35,
    },
    usageMetrics: {
      averagePerRestaurant: 20,
      unitType: "posts/month",
    },
    businessValue: 9,
    costEfficiency: 8,
  },
]

// Calculate total AI costs by tier
export function calculateTotalAICosts() {
  return {
    starter: aiServiceCosts.reduce((total, service) => total + service.monthlyCost.starter, 0),
    professional: aiServiceCosts.reduce((total, service) => total + service.monthlyCost.professional, 0),
    enterprise: aiServiceCosts.reduce((total, service) => total + service.monthlyCost.enterprise, 0),
  }
}

// Calculate potential savings through optimization
export function calculateOptimizationSavings() {
  return {
    starter: aiServiceCosts.reduce(
      (total, service) => total + service.monthlyCost.starter * service.optimizationPotential,
      0,
    ),
    professional: aiServiceCosts.reduce(
      (total, service) => total + service.monthlyCost.professional * service.optimizationPotential,
      0,
    ),
    enterprise: aiServiceCosts.reduce(
      (total, service) => total + service.monthlyCost.enterprise * service.optimizationPotential,
      0,
    ),
  }
}

// Calculate business value to cost ratio
export function calculateValueToCostRatio() {
  const totalCosts = calculateTotalAICosts()
  const totalValue = aiFeatureCosts.reduce((total, feature) => total + feature.businessValue, 0)

  return {
    starter: totalValue / totalCosts.starter,
    professional: totalValue / totalCosts.professional,
    enterprise: totalValue / totalCosts.enterprise,
  }
}
