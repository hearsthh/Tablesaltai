import { getSupabaseServerClient } from "@/lib/supabase/client"

export interface DashboardData {
  kpis: {
    totalRevenue: number
    totalCustomers: number
    avgRating: number
    totalOrders: number
    revenueGrowth: number
    customerGrowth: number
    ratingTrend: number
    orderGrowth: number
  }
  tasks: Array<{
    id: string
    title: string
    description: string
    priority: "high" | "medium" | "low"
    status: "pending" | "completed"
    dueDate: string
    type: string
  }>
  insights: Array<{
    id: string
    title: string
    description: string
    type: string
    priority: "high" | "medium" | "low"
    actionText: string
    actionRequired: boolean
  }>
  recentActivity: Array<{
    id: string
    description: string
    timestamp: string
    type: string
  }>
  platformStatus: Array<{
    name: string
    status: "connected" | "disconnected" | "error"
    lastSync: string
  }>
}

export async function getDashboardData(restaurantId: string): Promise<DashboardData> {
  const supabase = getSupabaseServerClient()

  // Mock platform integrations
  const platformStatus = [
    {
      name: "Google My Business",
      status: "connected" as const,
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      name: "Zomato",
      status: "connected" as const,
      lastSync: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      name: "Swiggy",
      status: "disconnected" as const,
      lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      name: "Instagram",
      status: "connected" as const,
      lastSync: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ]

  try {
    // Get restaurant data for KPIs
    const { data: restaurant } = await supabase.from("mock_restaurants").select("*").eq("id", restaurantId).single()

    // Get tasks
    const { data: tasks } = await supabase
      .from("mock_tasks")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false })
      .limit(10)

    // Get insights
    const { data: insights } = await supabase
      .from("mock_ai_insights")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false })
      .limit(5)

    // Get activity log
    const { data: activities } = await supabase
      .from("mock_activity_log")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false })
      .limit(10)

    // Calculate KPIs with fallback values
    const kpis = {
      totalRevenue: restaurant?.monthly_revenue || 450000,
      totalCustomers: restaurant?.total_reviews || 247,
      avgRating: restaurant?.avg_rating || 4.3,
      totalOrders: restaurant?.monthly_orders || 1250,
      revenueGrowth: 12.5,
      customerGrowth: 8.3,
      ratingTrend: 0.2,
      orderGrowth: 15.7,
    }

    // Format tasks
    const formattedTasks = (tasks || []).map((task: any) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.due_date,
      type: task.type,
    }))

    // Format insights
    const formattedInsights = (insights || []).map((insight: any) => ({
      id: insight.id,
      title: insight.title,
      description: insight.description,
      type: insight.type,
      priority: insight.priority,
      actionText: insight.action_required ? "Take Action" : "View Details",
      actionRequired: insight.action_required,
    }))

    // Format activity
    const recentActivity = (activities || []).map((activity: any) => ({
      id: activity.id,
      description: activity.description,
      timestamp: activity.created_at,
      type: activity.action_type,
    }))

    return {
      kpis,
      tasks: formattedTasks,
      insights: formattedInsights,
      recentActivity,
      platformStatus,
    }
  } catch (error) {
    console.error("Dashboard data fetch error:", error)

    // Return fallback data if database fails
    return {
      kpis: {
        totalRevenue: 450000,
        totalCustomers: 247,
        avgRating: 4.3,
        totalOrders: 1250,
        revenueGrowth: 12.5,
        customerGrowth: 8.3,
        ratingTrend: 0.2,
        orderGrowth: 15.7,
      },
      tasks: [
        {
          id: "1",
          title: "Reply to recent reviews",
          description: "Respond to 3 new customer reviews",
          priority: "high" as const,
          status: "pending" as const,
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          type: "review_response",
        },
        {
          id: "2",
          title: "Update menu prices",
          description: "Review seasonal pricing adjustments",
          priority: "medium" as const,
          status: "pending" as const,
          dueDate: new Date(Date.now() + 259200000).toISOString(),
          type: "menu_update",
        },
      ],
      insights: [
        {
          id: "1",
          title: "Revenue Opportunity",
          description: "Your butter chicken is highly rated. Consider promoting it more.",
          type: "revenue",
          priority: "high" as const,
          actionText: "Create Campaign",
          actionRequired: true,
        },
        {
          id: "2",
          title: "Customer Feedback",
          description: "Service speed mentioned in recent reviews. Consider staff training.",
          type: "customer",
          priority: "medium" as const,
          actionText: "View Details",
          actionRequired: true,
        },
      ],
      recentActivity: [
        {
          id: "1",
          description: "New 5-star review received",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: "review_received",
        },
        {
          id: "2",
          description: "Weekend campaign launched",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          type: "campaign_launched",
        },
      ],
      platformStatus,
    }
  }
}
