import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const campaignId = params.id

    // Mock campaign data
    const campaignData = {
      "1": {
        id: "1",
        name: "Diwali Festival Special",
        objective: "increase_revenue",
        description:
          "A comprehensive marketing campaign to promote our special Diwali menu and increase revenue during the festival season.",
        status: "active",
        progress: 75,
        startDate: "2024-10-20",
        endDate: "2024-11-05",
        budget: 25000,
        spent: 18750,
        targetAudience: "families_and_food_lovers",
        channels: ["Instagram", "WhatsApp", "Website", "Facebook"],
        contentTypes: ["posts", "stories", "offer_cards", "menu_highlights"],
        frequency: "daily",

        generatedPlan: {
          totalTasks: 12,
          completedTasks: 8,
          projections: {
            reach: "15K+",
            engagement: "6.5%",
            roi: "250%",
            conversions: 85,
          },
          timeline: {
            phases: [
              {
                name: "Campaign Setup & Content Creation",
                duration: "3 days",
                description: "Initial setup, content generation, and channel preparation",
                tasks: [
                  {
                    id: "task_1",
                    name: "Create Diwali Menu Highlights",
                    description: "Generate social media posts showcasing special Diwali dishes",
                    status: "completed",
                    assignedTo: "ai",
                    aiGenerated: true,
                    scheduledDate: "2024-10-20T10:00:00Z",
                    estimatedTime: "15 min",
                    dependencies: [],
                    contentType: "posts",
                    channels: ["Instagram", "Facebook"],
                  },
                  {
                    id: "task_2",
                    name: "Design Offer Cards",
                    description: "Create attractive discount cards for Diwali special offers",
                    status: "completed",
                    assignedTo: "ai",
                    aiGenerated: true,
                    scheduledDate: "2024-10-20T14:00:00Z",
                    estimatedTime: "10 min",
                    dependencies: [],
                    contentType: "offer_cards",
                    channels: ["Instagram", "WhatsApp"],
                  },
                  {
                    id: "task_3",
                    name: "Setup WhatsApp Broadcast List",
                    description: "Prepare customer list for WhatsApp marketing messages",
                    status: "completed",
                    assignedTo: "user",
                    aiGenerated: false,
                    scheduledDate: "2024-10-21T09:00:00Z",
                    estimatedTime: "30 min",
                    dependencies: [],
                  },
                ],
              },
              {
                name: "Content Distribution & Engagement",
                duration: "10 days",
                description: "Daily content posting and customer engagement activities",
                tasks: [
                  {
                    id: "task_4",
                    name: "Daily Instagram Stories",
                    description: "Post behind-the-scenes content and daily specials",
                    status: "in_progress",
                    assignedTo: "ai",
                    aiGenerated: true,
                    scheduledDate: "2024-10-22T18:00:00Z",
                    estimatedTime: "5 min",
                    dependencies: ["task_1"],
                    contentType: "stories",
                    channels: ["Instagram"],
                  },
                  {
                    id: "task_5",
                    name: "WhatsApp Customer Outreach",
                    description: "Send personalized offers to customer segments",
                    status: "pending",
                    assignedTo: "ai",
                    aiGenerated: true,
                    scheduledDate: "2024-10-23T11:00:00Z",
                    estimatedTime: "10 min",
                    dependencies: ["task_3"],
                    contentType: "messages",
                    channels: ["WhatsApp"],
                  },
                  {
                    id: "task_6",
                    name: "Customer Photo Collection",
                    description: "Encourage customers to share photos with special hashtag",
                    status: "pending",
                    assignedTo: "user",
                    aiGenerated: false,
                    scheduledDate: "2024-10-24T12:00:00Z",
                    estimatedTime: "20 min",
                    dependencies: ["task_4"],
                  },
                ],
              },
              {
                name: "Performance Optimization",
                duration: "5 days",
                description: "Monitor performance and optimize based on results",
                tasks: [
                  {
                    id: "task_7",
                    name: "Analyze Engagement Metrics",
                    description: "Review post performance and engagement rates",
                    status: "pending",
                    assignedTo: "ai",
                    aiGenerated: true,
                    scheduledDate: "2024-10-28T10:00:00Z",
                    estimatedTime: "15 min",
                    dependencies: ["task_4", "task_5"],
                  },
                  {
                    id: "task_8",
                    name: "Optimize Content Strategy",
                    description: "Adjust content based on performance insights",
                    status: "pending",
                    assignedTo: "ai",
                    aiGenerated: true,
                    scheduledDate: "2024-10-29T14:00:00Z",
                    estimatedTime: "20 min",
                    dependencies: ["task_7"],
                  },
                ],
              },
            ],
          },
        },

        performance: {
          reach: "3.2K",
          engagement: "4.2%",
          clicks: 156,
          conversions: 23,
          impressions: 8500,
          ctr: "1.8%",
          costPerClick: 12.5,
          roas: 2.8,
        },

        recentActivity: [
          {
            id: "activity_1",
            type: "task_completed",
            description: "AI generated Instagram story for daily special",
            timestamp: "2024-10-22T18:30:00Z",
            user: "AI Assistant",
          },
          {
            id: "activity_2",
            type: "content_published",
            description: "Posted Diwali menu highlights on Instagram",
            timestamp: "2024-10-22T10:15:00Z",
            user: "Marketing Team",
          },
          {
            id: "activity_3",
            type: "milestone_reached",
            description: "Reached 3K+ impressions milestone",
            timestamp: "2024-10-21T16:45:00Z",
          },
          {
            id: "activity_4",
            type: "task_completed",
            description: "WhatsApp broadcast list setup completed",
            timestamp: "2024-10-21T09:30:00Z",
            user: "Marketing Team",
          },
        ],
      },
      "2": {
        id: "2",
        name: "Weekend Brunch Launch",
        objective: "brand_awareness",
        description: "Launch campaign for our new weekend brunch menu targeting young professionals and families.",
        status: "active",
        progress: 45,
        startDate: "2024-11-01",
        endDate: "2024-11-30",
        targetAudience: "young_professionals",
        channels: ["Instagram", "Facebook", "Email"],
        contentTypes: ["posts", "carousels", "reels"],
        frequency: "weekly",

        generatedPlan: {
          totalTasks: 8,
          completedTasks: 3,
          projections: {
            reach: "8K+",
            engagement: "5.8%",
            roi: "180%",
            conversions: 45,
          },
          timeline: {
            phases: [
              {
                name: "Brunch Menu Showcase",
                duration: "1 week",
                description: "Introduce the new brunch menu to target audience",
                tasks: [
                  {
                    id: "task_b1",
                    name: "Create Brunch Menu Carousel",
                    description: "Showcase all brunch items in an attractive carousel format",
                    status: "completed",
                    assignedTo: "ai",
                    aiGenerated: true,
                    scheduledDate: "2024-11-01T10:00:00Z",
                    estimatedTime: "20 min",
                    dependencies: [],
                    contentType: "carousels",
                    channels: ["Instagram", "Facebook"],
                  },
                ],
              },
            ],
          },
        },

        performance: {
          reach: "1.8K",
          engagement: "6.1%",
          clicks: 89,
          conversions: 12,
          impressions: 4200,
          ctr: "2.1%",
        },

        recentActivity: [
          {
            id: "activity_b1",
            type: "content_published",
            description: "Published brunch menu carousel on Instagram",
            timestamp: "2024-11-01T10:30:00Z",
            user: "Marketing Team",
          },
        ],
      },
    }

    const campaign = campaignData[campaignId as keyof typeof campaignData]

    if (!campaign) {
      return NextResponse.json(
        {
          success: false,
          error: "Campaign not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      campaign,
    })
  } catch (error) {
    console.error("Error fetching campaign:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch campaign details",
      },
      { status: 500 },
    )
  }
}
