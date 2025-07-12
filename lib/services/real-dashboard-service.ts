import { createClient } from "@/lib/supabase/server"
import type { DashboardData, RestaurantStats } from "@/lib/types/dashboard"

export class RealDashboardService {
  static async getDashboardData(restaurantId: string): Promise<DashboardData> {
    const supabase = createClient()

    try {
      // Get restaurant stats from database
      const stats = await this.getRestaurantStats(restaurantId)

      // Build KPI data from real stats
      const kpis = [
        {
          title: "Monthly Revenue",
          value: `₹${stats.monthlyRevenue.toLocaleString()}`,
          change: "+12.5%", // TODO: Calculate actual change
          trend: "up" as const,
          icon: "DollarSign",
        },
        {
          title: "Average Rating",
          value: stats.avgRating.toFixed(1),
          change: "+0.2",
          trend: "up" as const,
          icon: "Star",
        },
        {
          title: "Total Customers",
          value: stats.totalCustomers.toString(),
          change: "+8.3%",
          trend: "up" as const,
          icon: "Users",
        },
        {
          title: "Active Campaigns",
          value: stats.activeCampaigns.toString(),
          change: "+2",
          trend: "up" as const,
          icon: "Megaphone",
        },
      ]

      // Get real tasks from database
      const { data: tasksData } = await supabase
        .from("tasks")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .eq("completed", false)
        .order("priority", { ascending: false })
        .limit(5)

      const tasks =
        tasksData?.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          completed: task.completed,
          dueDate: task.due_date ? new Date(task.due_date).toLocaleDateString() : undefined,
        })) || []

      // Get recent activity from database
      const { data: activityData } = await supabase
        .from("activity_log")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false })
        .limit(10)

      const recentActivity =
        activityData?.map((activity) => ({
          id: activity.id,
          type: activity.type,
          title: activity.title,
          description: activity.description,
          timestamp: this.formatTimestamp(activity.created_at),
          status: activity.status || "success",
        })) || []

      // Generate AI insights based on real data
      const insights = await this.generateInsights(stats)

      // Get real channel connections
      const { data: channelsData } = await supabase.from("integrations").select("*").eq("restaurant_id", restaurantId)

      const channels =
        channelsData?.map((channel) => ({
          name: channel.platform_name,
          status: channel.status,
          lastSync: this.formatTimestamp(channel.last_sync_at),
        })) || []

      return {
        kpis,
        tasks,
        recentActivity,
        insights,
        channels,
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      throw new Error("Failed to fetch dashboard data")
    }
  }

  static async getRestaurantStats(restaurantId: string): Promise<RestaurantStats> {
    const supabase = createClient()

    try {
      // Get restaurant basic info
      const { data: restaurant } = await supabase.from("restaurants").select("*").eq("id", restaurantId).single()

      if (!restaurant) {
        throw new Error("Restaurant not found")
      }

      // Get customer count
      const { count: customerCount } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .eq("restaurant_id", restaurantId)

      // Get menu items count
      const { count: menuItemsCount } = await supabase
        .from("menu_items")
        .select("*", { count: "exact", head: true })
        .eq("restaurant_id", restaurantId)

      // Get reviews and calculate average rating
      const { data: reviews } = await supabase.from("reviews").select("rating").eq("restaurant_id", restaurantId)

      const avgRating =
        reviews && reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

      // Get active campaigns count
      const { count: activeCampaignsCount } = await supabase
        .from("marketing_campaigns")
        .select("*", { count: "exact", head: true })
        .eq("restaurant_id", restaurantId)
        .eq("status", "active")

      // Calculate revenue (mock for now - you'll need to implement based on your orders table)
      const totalRevenue = 250000 // TODO: Calculate from actual orders
      const monthlyRevenue = 45000 // TODO: Calculate current month revenue

      // Get pending tasks count
      const { count: pendingTasksCount } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("restaurant_id", restaurantId)
        .eq("completed", false)

      return {
        totalRevenue,
        monthlyRevenue,
        totalCustomers: customerCount || 0,
        avgRating,
        totalReviews: reviews?.length || 0,
        activeCampaigns: activeCampaignsCount || 0,
        menuItems: menuItemsCount || 0,
        pendingTasks: pendingTasksCount || 0,
      }
    } catch (error) {
      console.error("Error fetching restaurant stats:", error)
      throw new Error("Failed to fetch restaurant statistics")
    }
  }

  static async generateInsights(stats: RestaurantStats) {
    const insights = []

    // Revenue insight
    if (stats.monthlyRevenue > 40000) {
      insights.push({
        id: "revenue-1",
        title: "Strong Revenue Performance",
        description: `Your monthly revenue of ₹${stats.monthlyRevenue.toLocaleString()} is above average. Consider expanding your marketing reach.`,
        type: "revenue" as const,
        priority: "medium" as const,
        actionText: "View Revenue Analytics",
      })
    }

    // Customer insight
    if (stats.totalCustomers < 100) {
      insights.push({
        id: "customer-1",
        title: "Grow Your Customer Base",
        description:
          "You have fewer than 100 customers. Focus on customer acquisition campaigns to grow your business.",
        type: "customer" as const,
        priority: "high" as const,
        actionText: "Create Acquisition Campaign",
      })
    }

    // Rating insight
    if (stats.avgRating < 4.0) {
      insights.push({
        id: "rating-1",
        title: "Improve Customer Satisfaction",
        description: `Your average rating of ${stats.avgRating.toFixed(1)} could be improved. Focus on service quality and address customer feedback.`,
        type: "customer" as const,
        priority: "high" as const,
        actionText: "View Reviews",
      })
    }

    // Menu insight
    if (stats.menuItems < 20) {
      insights.push({
        id: "menu-1",
        title: "Expand Your Menu",
        description: "Consider adding more menu items to give customers more choices and increase average order value.",
        type: "menu" as const,
        priority: "low" as const,
        actionText: "Add Menu Items",
      })
    }

    return insights
  }

  static formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} days ago`
    }
  }

  static async completeTask(taskId: string): Promise<void> {
    const supabase = createClient()

    const { error } = await supabase
      .from("tasks")
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq("id", taskId)

    if (error) {
      throw new Error("Failed to complete task")
    }
  }

  static async createQuickAction(restaurantId: string, actionType: string): Promise<void> {
    const supabase = createClient()

    // Log the action
    await supabase.from("activity_log").insert({
      restaurant_id: restaurantId,
      type: "action",
      title: `Quick Action: ${actionType}`,
      description: `User initiated ${actionType} from dashboard`,
      status: "success",
      created_at: new Date().toISOString(),
    })
  }
}
