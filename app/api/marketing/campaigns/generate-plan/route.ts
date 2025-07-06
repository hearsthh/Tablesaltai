import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, objective, targetAudience, budget, startDate, endDate, channels, contentTypes, frequency } = body

    // Calculate campaign duration
    const start = new Date(startDate)
    const end = new Date(endDate)
    const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    // Generate AI-powered campaign plan
    const plan = {
      totalTasks: Math.max(8, Math.floor(durationDays / 2) + contentTypes.length * 2),
      completedTasks: 0,
      projections: {
        reach: generateReachProjection(channels, budget, durationDays),
        engagement: generateEngagementProjection(contentTypes, targetAudience),
        roi: generateROIProjection(objective, budget),
        conversions: generateConversionsProjection(channels, budget, targetAudience),
      },
      timeline: {
        phases: generateCampaignPhases(durationDays, contentTypes, channels, objective),
      },
    }

    return NextResponse.json({
      success: true,
      plan,
    })
  } catch (error) {
    console.error("Error generating campaign plan:", error)
    return NextResponse.json({ error: "Failed to generate campaign plan" }, { status: 500 })
  }
}

function generateReachProjection(channels: string[], budget: number, duration: number) {
  const channelMultipliers = {
    instagram: 150,
    whatsapp: 80,
    facebook: 100,
    ad_channels: 300,
    website: 50,
    tablesalt: 60,
    sms: 40,
    email: 30,
  }

  let baseReach = 0
  channels.forEach((channel) => {
    const multiplier = channelMultipliers[channel as keyof typeof channelMultipliers] || 50
    baseReach += multiplier * (duration / 7) // Weekly multiplier
  })

  if (budget) {
    baseReach += Math.floor(Number(budget) / 100) * 2 // Paid boost
  }

  return baseReach > 1000 ? `${(baseReach / 1000).toFixed(1)}K` : baseReach.toString()
}

function generateEngagementProjection(contentTypes: string[], targetAudience: string) {
  const contentEngagement = {
    posts: 3.5,
    reels: 7.2,
    stories: 5.8,
    carousels: 4.1,
    qr_codes: 2.3,
    menu_highlights: 6.4,
    offer_cards: 8.1,
    testimonials: 5.2,
  }

  const audienceMultiplier = {
    families: 1.2,
    young_professionals: 1.4,
    couples: 1.1,
    food_enthusiasts: 1.6,
    local_community: 1.3,
    office_workers: 1.2,
    students: 1.5,
    seniors: 1.0,
  }

  let avgEngagement = 0
  contentTypes.forEach((type) => {
    avgEngagement += contentEngagement[type as keyof typeof contentEngagement] || 3.0
  })
  avgEngagement = avgEngagement / contentTypes.length

  const multiplier = audienceMultiplier[targetAudience as keyof typeof audienceMultiplier] || 1.0
  const finalEngagement = avgEngagement * multiplier

  return `${finalEngagement.toFixed(1)}%`
}

function generateROIProjection(objective: string, budget: number) {
  const objectiveMultipliers = {
    brand_awareness: 2.5,
    increase_revenue: 4.2,
    customer_acquisition: 3.8,
    customer_retention: 3.2,
    promote_new_items: 3.5,
    seasonal_promotion: 4.0,
  }

  const multiplier = objectiveMultipliers[objective as keyof typeof objectiveMultipliers] || 3.0
  const roi = budget ? Math.floor(multiplier * 100) : 250

  return `${roi}%`
}

function generateConversionsProjection(channels: string[], budget: number, targetAudience: string) {
  const baseConversions = channels.length * 5
  const budgetBoost = budget ? Math.floor(Number(budget) / 1000) * 2 : 0
  const audienceBoost = targetAudience === "food_enthusiasts" ? 5 : 2

  return baseConversions + budgetBoost + audienceBoost
}

function generateCampaignPhases(duration: number, contentTypes: string[], channels: string[], objective: string) {
  const phases = []

  // Phase 1: Setup & Content Creation
  phases.push({
    name: "Setup & Content Creation",
    duration: `${Math.min(3, Math.floor(duration * 0.2))} days`,
    description: "Initial setup, content generation, and asset preparation",
    tasks: [
      {
        id: "setup_1",
        name: "Campaign Setup & Channel Configuration",
        description: "Configure marketing channels and set up tracking",
        status: "pending",
        assignedTo: "ai",
        aiGenerated: true,
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        estimatedTime: "30 minutes",
        dependencies: [],
        channels: channels,
      },
      ...contentTypes.map((type, index) => ({
        id: `content_${index}`,
        name: `Generate ${type.replace("_", " ")} Content`,
        description: `Create AI-powered ${type.replace("_", " ")} for the campaign`,
        status: "pending",
        assignedTo: "ai",
        aiGenerated: true,
        scheduledDate: new Date(Date.now() + (index + 2) * 24 * 60 * 60 * 1000).toISOString(),
        estimatedTime: "15-30 minutes",
        dependencies: ["setup_1"],
        contentType: type,
        channels: channels,
      })),
    ],
  })

  // Phase 2: Launch & Initial Promotion
  phases.push({
    name: "Launch & Initial Promotion",
    duration: `${Math.floor(duration * 0.3)} days`,
    description: "Campaign launch with initial content publishing and promotion",
    tasks: [
      {
        id: "launch_1",
        name: "Campaign Launch",
        description: "Publish initial campaign content across selected channels",
        status: "pending",
        assignedTo: "ai",
        aiGenerated: true,
        scheduledDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedTime: "1 hour",
        dependencies: contentTypes.map((_, index) => `content_${index}`),
        channels: channels,
      },
      {
        id: "launch_2",
        name: "Monitor Initial Response",
        description: "Track early engagement and adjust strategy if needed",
        status: "pending",
        assignedTo: "ai",
        aiGenerated: true,
        scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedTime: "45 minutes",
        dependencies: ["launch_1"],
      },
    ],
  })

  // Phase 3: Optimization & Scaling
  phases.push({
    name: "Optimization & Scaling",
    duration: `${Math.floor(duration * 0.4)} days`,
    description: "Optimize performance and scale successful content",
    tasks: [
      {
        id: "optimize_1",
        name: "Performance Analysis",
        description: "Analyze campaign performance and identify top-performing content",
        status: "pending",
        assignedTo: "ai",
        aiGenerated: true,
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedTime: "30 minutes",
        dependencies: ["launch_2"],
      },
      {
        id: "optimize_2",
        name: "Content Optimization",
        description: "Create variations of high-performing content",
        status: "pending",
        assignedTo: "ai",
        aiGenerated: true,
        scheduledDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedTime: "45 minutes",
        dependencies: ["optimize_1"],
      },
      {
        id: "user_task_1",
        name: "Customer Feedback Collection",
        description: "Gather customer feedback and testimonials",
        status: "pending",
        assignedTo: "user",
        aiGenerated: false,
        scheduledDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedTime: "2 hours",
        dependencies: ["optimize_1"],
      },
    ],
  })

  // Phase 4: Final Push & Analysis
  phases.push({
    name: "Final Push & Analysis",
    duration: `${Math.ceil(duration * 0.1)} days`,
    description: "Final promotional push and comprehensive campaign analysis",
    tasks: [
      {
        id: "final_1",
        name: "Final Promotional Push",
        description: "Execute final promotional activities to maximize impact",
        status: "pending",
        assignedTo: "ai",
        aiGenerated: true,
        scheduledDate: new Date(Date.now() + (duration - 2) * 24 * 60 * 60 * 1000).toISOString(),
        estimatedTime: "1 hour",
        dependencies: ["optimize_2"],
      },
      {
        id: "final_2",
        name: "Campaign Analysis & Report",
        description: "Generate comprehensive campaign performance report",
        status: "pending",
        assignedTo: "ai",
        aiGenerated: true,
        scheduledDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString(),
        estimatedTime: "30 minutes",
        dependencies: ["final_1"],
      },
    ],
  })

  return phases
}
