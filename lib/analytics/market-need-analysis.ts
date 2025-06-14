// Market Need Analysis for TableSalt AI platform

export interface MarketSegment {
  segment: string
  size: string
  painPoints: string[]
  aiSolutions: string[]
  willingnessToPay: number // 1-10 scale
  adoptionReadiness: number // 1-10 scale
  competitivePressure: number // 1-10 scale
  growthRate: string
}

export interface CompetitorAnalysis {
  name: string
  primaryFocus: string
  aiCapabilities: string
  marketShare: string
  pricing: string
  strengths: string[]
  weaknesses: string[]
  threatLevel: number // 1-10 scale
}

export interface MarketTrend {
  trend: string
  impact: string
  timeframe: string
  relevanceScore: number // 1-10 scale
  opportunitySize: string
}

// Restaurant market segments
export const marketSegments: MarketSegment[] = [
  {
    segment: "Independent Fine Dining",
    size: "65,000 establishments in the US",
    painPoints: [
      "High customer acquisition costs",
      "Difficulty maintaining consistent brand voice",
      "Limited marketing expertise",
      "Inefficient reservation management",
      "Poor online presence compared to chains",
    ],
    aiSolutions: [
      "Personalized marketing campaigns",
      "AI-generated premium content",
      "Customer insights and segmentation",
      "Reputation management",
      "High-quality visual content generation",
    ],
    willingnessToPay: 8,
    adoptionReadiness: 7,
    competitivePressure: 9,
    growthRate: "3-5% annually",
  },
  {
    segment: "Fast Casual Chains",
    size: "35,000 locations in the US",
    painPoints: [
      "Maintaining consistent messaging across locations",
      "High employee turnover affecting customer service",
      "Difficulty differentiating from competitors",
      "Managing online ordering platforms",
      "Inconsistent customer experience",
    ],
    aiSolutions: [
      "Centralized marketing automation",
      "AI-powered customer service training",
      "Competitive analysis and positioning",
      "Integrated digital ordering optimization",
      "Customer journey mapping",
    ],
    willingnessToPay: 7,
    adoptionReadiness: 8,
    competitivePressure: 8,
    growthRate: "6-8% annually",
  },
  {
    segment: "Small Independent Restaurants",
    size: "500,000+ establishments in the US",
    painPoints: [
      "Limited marketing budget and expertise",
      "Difficulty competing with chains",
      "Poor online visibility",
      "Inefficient operations",
      "Limited customer data collection",
    ],
    aiSolutions: [
      "Affordable marketing automation",
      "Local SEO and online presence building",
      "Social media management",
      "Basic customer insights",
      "Menu optimization",
    ],
    willingnessToPay: 5,
    adoptionReadiness: 5,
    competitivePressure: 7,
    growthRate: "1-2% annually",
  },
  {
    segment: "Ghost Kitchens & Delivery-Only",
    size: "1,500+ and rapidly growing in the US",
    painPoints: [
      "Building brand recognition without physical presence",
      "High platform fees from delivery services",
      "Limited customer loyalty",
      "Menu optimization for delivery",
      "Difficulty standing out on delivery platforms",
    ],
    aiSolutions: [
      "Digital-first brand building",
      "Direct ordering channel development",
      "Data-driven menu engineering",
      "Delivery platform optimization",
      "Virtual brand development",
    ],
    willingnessToPay: 7,
    adoptionReadiness: 9,
    competitivePressure: 10,
    growthRate: "15-20% annually",
  },
  {
    segment: "Restaurant Groups (5-20 locations)",
    size: "~10,000 groups in the US",
    painPoints: [
      "Scaling marketing across locations",
      "Maintaining brand consistency",
      "Analyzing performance across properties",
      "Optimizing marketing spend",
      "Managing multiple online presences",
    ],
    aiSolutions: [
      "Centralized marketing management",
      "Cross-location analytics",
      "Automated multi-location campaigns",
      "Brand consistency monitoring",
      "Integrated performance dashboards",
    ],
    willingnessToPay: 9,
    adoptionReadiness: 8,
    competitivePressure: 8,
    growthRate: "4-6% annually",
  },
]

// Competitor analysis
export const competitors: CompetitorAnalysis[] = [
  {
    name: "Toast Marketing",
    primaryFocus: "POS integration and basic marketing",
    aiCapabilities: "Limited - basic email templates and analytics",
    marketShare: "15% of US restaurants",
    pricing: "$75-200/month",
    strengths: [
      "Strong POS integration",
      "Large existing customer base",
      "Comprehensive restaurant management",
      "Strong brand recognition",
    ],
    weaknesses: [
      "Basic marketing capabilities",
      "Limited AI features",
      "Generic content templates",
      "Weak social media tools",
    ],
    threatLevel: 7,
  },
  {
    name: "Yelp for Business",
    primaryFocus: "Review management and basic ads",
    aiCapabilities: "Very limited - mostly manual tools",
    marketShare: "70% of US restaurants have profiles",
    pricing: "$30-300/month",
    strengths: [
      "Massive consumer user base",
      "Review platform integration",
      "Strong local search presence",
      "Brand recognition",
    ],
    weaknesses: [
      "Limited marketing tools",
      "No AI capabilities",
      "Poor reputation with some restaurants",
      "Limited customization",
    ],
    threatLevel: 5,
  },
  {
    name: "BentoBox",
    primaryFocus: "Restaurant websites and online ordering",
    aiCapabilities: "Emerging - basic content suggestions",
    marketShare: "5% of US restaurants",
    pricing: "$99-399/month",
    strengths: [
      "Beautiful website templates",
      "Strong online ordering",
      "Good industry reputation",
      "Solid user experience",
    ],
    weaknesses: [
      "Limited marketing automation",
      "Basic AI capabilities",
      "Focused mainly on websites",
      "Limited customer insights",
    ],
    threatLevel: 6,
  },
  {
    name: "Popmenu",
    primaryFocus: "Interactive menus and marketing",
    aiCapabilities: "Growing - menu optimization and basic content",
    marketShare: "3% of US restaurants",
    pricing: "$199-399/month",
    strengths: [
      "Interactive menu technology",
      "Growing marketing suite",
      "Good customer engagement tools",
      "Solid review management",
    ],
    weaknesses: [
      "Limited AI personalization",
      "Expensive for small restaurants",
      "Focused primarily on menu features",
      "Limited customer segmentation",
    ],
    threatLevel: 8,
  },
  {
    name: "Sprout Social (restaurant vertical)",
    primaryFocus: "Social media management",
    aiCapabilities: "Moderate - content suggestions and scheduling",
    marketShare: "2% of US restaurants",
    pricing: "$99-249/month",
    strengths: [
      "Excellent social media tools",
      "Good analytics",
      "Solid content calendar",
      "Multi-platform management",
    ],
    weaknesses: [
      "Limited restaurant-specific features",
      "No menu or website tools",
      "Limited customer data integration",
      "Not restaurant-focused",
    ],
    threatLevel: 4,
  },
]

// Market trends
export const marketTrends: MarketTrend[] = [
  {
    trend: "AI-Generated Visual Content",
    impact: "Reducing photography costs by 70-90%",
    timeframe: "Already happening, rapid growth",
    relevanceScore: 10,
    opportunitySize: "$500M+ market",
  },
  {
    trend: "Personalized Customer Journeys",
    impact: "15-25% increase in customer retention",
    timeframe: "Early adoption phase",
    relevanceScore: 9,
    opportunitySize: "$1B+ market",
  },
  {
    trend: "Voice Search Optimization",
    impact: "30% of searches now voice-based",
    timeframe: "Growing rapidly",
    relevanceScore: 7,
    opportunitySize: "$300M market",
  },
  {
    trend: "Automated Review Response",
    impact: "60% time savings on reputation management",
    timeframe: "Early majority adoption",
    relevanceScore: 8,
    opportunitySize: "$200M market",
  },
  {
    trend: "Predictive Menu Engineering",
    impact: "8-12% increase in average check size",
    timeframe: "Early adoption phase",
    relevanceScore: 9,
    opportunitySize: "$400M market",
  },
  {
    trend: "Hyper-Local Marketing",
    impact: "20-30% increase in new customer acquisition",
    timeframe: "Growing rapidly",
    relevanceScore: 8,
    opportunitySize: "$600M market",
  },
  {
    trend: "Zero-Party Data Collection",
    impact: "GDPR/CCPA compliant personalization",
    timeframe: "Becoming essential",
    relevanceScore: 7,
    opportunitySize: "$350M market",
  },
]

// Market size and opportunity
export const marketSizeData = {
  totalRestaurants: "860,000 in the US",
  totalMarketSize: "$4.2B restaurant marketing software",
  aiMarketingSegment: "$850M and growing at 25% annually",
  averageMarketingSpend: "3-5% of restaurant revenue",
  digitalTransformationRate: "65% of restaurants increasing marketing tech investment",
  keyMetrics: {
    customerAcquisitionCost: "$15-30 per customer without AI, $5-15 with AI",
    marketingROI: "3-5x with traditional methods, 7-12x with AI optimization",
    timeEfficiency: "15-20 hours/week on marketing reduced to 3-5 hours/week",
  },
}

// ROI analysis for restaurants
export function calculateRestaurantROI(monthlyRevenue: number, tier: "starter" | "professional" | "enterprise") {
  const tierPricing = {
    starter: 79,
    professional: 249,
    enterprise: 599,
  }

  const tierImpact = {
    starter: {
      revenueIncrease: 0.05, // 5%
      customerRetention: 0.08, // 8%
      operationalEfficiency: 0.1, // 10%
      marketingEfficiency: 0.3, // 30%
    },
    professional: {
      revenueIncrease: 0.08, // 8%
      customerRetention: 0.15, // 15%
      operationalEfficiency: 0.2, // 20%
      marketingEfficiency: 0.5, // 50%
    },
    enterprise: {
      revenueIncrease: 0.12, // 12%
      customerRetention: 0.25, // 25%
      operationalEfficiency: 0.3, // 30%
      marketingEfficiency: 0.7, // 70%
    },
  }

  const impact = tierImpact[tier]
  const monthlyCost = tierPricing[tier]

  // Calculate benefits
  const additionalRevenue = monthlyRevenue * impact.revenueIncrease
  const retentionValue = monthlyRevenue * 0.2 * impact.customerRetention // Assuming 20% of revenue at risk from churn
  const operationalSavings = monthlyRevenue * 0.05 * impact.operationalEfficiency // Assuming 5% of revenue goes to operations
  const marketingSavings = monthlyRevenue * 0.04 * impact.marketingEfficiency // Assuming 4% of revenue goes to marketing

  const totalMonthlyBenefit = additionalRevenue + retentionValue + operationalSavings + marketingSavings
  const roi = (totalMonthlyBenefit - monthlyCost) / monthlyCost
  const paybackPeriodMonths = monthlyCost / totalMonthlyBenefit

  return {
    additionalRevenue: Math.round(additionalRevenue),
    retentionValue: Math.round(retentionValue),
    operationalSavings: Math.round(operationalSavings),
    marketingSavings: Math.round(marketingSavings),
    totalMonthlyBenefit: Math.round(totalMonthlyBenefit),
    monthlyCost,
    roi: Math.round(roi * 100),
    paybackPeriodMonths: Math.round(paybackPeriodMonths * 10) / 10,
  }
}

// Market fit analysis
export function analyzeMarketFit() {
  // Calculate average willingness to pay across segments
  const avgWillingnessToPay =
    marketSegments.reduce((sum, segment) => sum + segment.willingnessToPay, 0) / marketSegments.length

  // Calculate average adoption readiness across segments
  const avgAdoptionReadiness =
    marketSegments.reduce((sum, segment) => sum + segment.adoptionReadiness, 0) / marketSegments.length

  // Calculate average competitive pressure across segments
  const avgCompetitivePressure =
    marketSegments.reduce((sum, segment) => sum + segment.competitivePressure, 0) / marketSegments.length

  // Calculate average threat level from competitors
  const avgThreatLevel = competitors.reduce((sum, competitor) => sum + competitor.threatLevel, 0) / competitors.length

  // Calculate average relevance score of market trends
  const avgTrendRelevance = marketTrends.reduce((sum, trend) => sum + trend.relevanceScore, 0) / marketTrends.length

  // Calculate market fit score (0-100)
  const marketFitScore = Math.round(
    ((avgWillingnessToPay + avgAdoptionReadiness + avgCompetitivePressure) / 30 +
      (10 - avgThreatLevel) / 10 +
      avgTrendRelevance / 10) *
      20,
  )

  // Determine market fit category
  let marketFitCategory
  if (marketFitScore >= 85) marketFitCategory = "Excellent"
  else if (marketFitScore >= 70) marketFitCategory = "Strong"
  else if (marketFitScore >= 50) marketFitCategory = "Good"
  else if (marketFitScore >= 30) marketFitCategory = "Fair"
  else marketFitCategory = "Poor"

  return {
    marketFitScore,
    marketFitCategory,
    keyMetrics: {
      willingnessToPay: avgWillingnessToPay,
      adoptionReadiness: avgAdoptionReadiness,
      competitivePressure: avgCompetitivePressure,
      competitorThreatLevel: avgThreatLevel,
      trendRelevance: avgTrendRelevance,
    },
    topSegments: marketSegments
      .sort((a, b) => b.willingnessToPay + b.adoptionReadiness - (a.willingnessToPay + a.adoptionReadiness))
      .slice(0, 3)
      .map((segment) => segment.segment),
    topTrends: marketTrends
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3)
      .map((trend) => trend.trend),
  }
}
