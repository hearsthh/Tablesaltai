import { createClient } from "@supabase/supabase-js"
import type {
  Restaurant,
  MenuItem,
  Customer,
  Review,
  Strategy,
  Campaign,
  ContentUnit,
  GeneratedContent,
  Task,
  AIInsight,
  DashboardMetrics,
  CalendarEvent,
} from "@/lib/types/unified-data"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export class UnifiedDataService {
  // Restaurant
  static async getRestaurant(userId: string): Promise<Restaurant | null> {
    const { data, error } = await supabase.from("restaurants").select("*").eq("user_id", userId).single()

    if (error) return null
    return data
  }

  // Dashboard
  static async getDashboardMetrics(restaurantId: string): Promise<DashboardMetrics> {
    // Get performance metrics
    const [campaigns, reviews, customers, menuItems] = await Promise.all([
      this.getCampaigns(restaurantId),
      this.getReviews(restaurantId),
      this.getCustomers(restaurantId),
      this.getMenuItems(restaurantId),
    ])

    // Calculate metrics
    const campaignReach = campaigns.reduce((sum, c) => sum + c.performance.reach, 0)
    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0
    const activeCustomers = customers.filter((c) => c.segment !== "churn_risk").length
    const topMenuItems = menuItems.filter((m) => m.performanceTier === "high").length

    // Get AI insights and tasks
    const [insights, tasks] = await Promise.all([this.getAIInsights(restaurantId), this.getTasks(restaurantId)])

    return {
      performance: {
        campaignReach: { value: campaignReach, change: 12.5 },
        reviewsTrend: { value: avgRating, change: 0.3 },
        customerEngagement: { value: activeCustomers, change: 8.2 },
        menuPerformance: { value: topMenuItems, change: 15.0 },
      },
      insights: insights.slice(0, 5),
      tasks: tasks.filter((t) => t.status === "pending").slice(0, 8),
      quickActions: [
        {
          id: "1",
          title: "Create Campaign",
          description: "Launch new marketing campaign",
          icon: "megaphone",
          action: "create_campaign",
          href: "/marketing/campaigns/create",
          priority: 1,
        },
        {
          id: "2",
          title: "Generate Post",
          description: "AI-powered social media content",
          icon: "sparkles",
          action: "generate_content",
          href: "/content/generator",
          priority: 2,
        },
        {
          id: "3",
          title: "Update Menu",
          description: "Optimize menu items",
          icon: "utensils",
          action: "update_menu",
          href: "/menu",
          priority: 3,
        },
        {
          id: "4",
          title: "Reply to Reviews",
          description: "Respond to customer feedback",
          icon: "message-square",
          action: "reply_reviews",
          href: "/reviews",
          priority: 4,
        },
      ],
    }
  }

  // Menu Items
  static async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("ai_score", { ascending: false })

    return data || []
  }

  static async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<boolean> {
    const { error } = await supabase.from("menu_items").update(updates).eq("id", id)

    return !error
  }

  // Customers
  static async getCustomers(restaurantId: string): Promise<Customer[]> {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("lifetime_value", { ascending: false })

    return data || []
  }

  static async getCustomersBySegment(restaurantId: string, segment: string): Promise<Customer[]> {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .eq("segment", segment)

    return data || []
  }

  // Reviews
  static async getReviews(restaurantId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false })

    return data || []
  }

  static async getPendingReviews(restaurantId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .eq("has_reply", false)
      .order("created_at", { ascending: false })

    return data || []
  }

  static async updateReview(id: string, updates: Partial<Review>): Promise<boolean> {
    const { error } = await supabase.from("reviews").update(updates).eq("id", id)

    return !error
  }

  // Strategies
  static async getStrategies(restaurantId: string): Promise<Strategy[]> {
    const { data, error } = await supabase
      .from("strategies")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false })

    return data || []
  }

  static async createStrategy(strategy: Omit<Strategy, "id" | "createdAt" | "updatedAt">): Promise<Strategy | null> {
    const { data, error } = await supabase.from("strategies").insert(strategy).select().single()

    return data
  }

  // Campaigns
  static async getCampaigns(restaurantId: string): Promise<Campaign[]> {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false })

    return data || []
  }

  static async createCampaign(campaign: Omit<Campaign, "id" | "createdAt" | "updatedAt">): Promise<Campaign | null> {
    const { data, error } = await supabase.from("campaigns").insert(campaign).select().single()

    return data
  }

  static async updateCampaign(id: string, updates: Partial<Campaign>): Promise<boolean> {
    const { error } = await supabase.from("campaigns").update(updates).eq("id", id)

    return !error
  }

  // Content Units
  static async getContentUnits(campaignId: string): Promise<ContentUnit[]> {
    const { data, error } = await supabase
      .from("content_units")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: false })

    return data || []
  }

  static async createContentUnit(
    contentUnit: Omit<ContentUnit, "id" | "createdAt" | "updatedAt">,
  ): Promise<ContentUnit | null> {
    const { data, error } = await supabase.from("content_units").insert(contentUnit).select().single()

    return data
  }

  // Generated Content
  static async getGeneratedContent(restaurantId: string): Promise<GeneratedContent[]> {
    const { data, error } = await supabase
      .from("generated_content")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false })

    return data || []
  }

  static async saveGeneratedContent(
    content: Omit<GeneratedContent, "id" | "createdAt">,
  ): Promise<GeneratedContent | null> {
    const { data, error } = await supabase.from("generated_content").insert(content).select().single()

    return data
  }

  // Tasks
  static async getTasks(restaurantId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("due_date", { ascending: true })

    return data || []
  }

  static async createTask(task: Omit<Task, "id" | "createdAt">): Promise<Task | null> {
    const { data, error } = await supabase.from("tasks").insert(task).select().single()

    return data
  }

  static async updateTask(id: string, updates: Partial<Task>): Promise<boolean> {
    const { error } = await supabase.from("tasks").update(updates).eq("id", id)

    return !error
  }

  // AI Insights
  static async getAIInsights(restaurantId: string): Promise<AIInsight[]> {
    const { data, error } = await supabase
      .from("ai_insights")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .eq("is_read", false)
      .order("priority", { ascending: true })
      .order("created_at", { ascending: false })

    return data || []
  }

  static async markInsightAsRead(id: string): Promise<boolean> {
    const { error } = await supabase.from("ai_insights").update({ is_read: true }).eq("id", id)

    return !error
  }

  // Calendar Events
  static async getCalendarEvents(restaurantId: string, startDate: string, endDate: string): Promise<CalendarEvent[]> {
    const { data, error } = await supabase
      .from("calendar_events")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true })

    return data || []
  }

  static async createCalendarEvent(event: Omit<CalendarEvent, "id" | "createdAt">): Promise<CalendarEvent | null> {
    const { data, error } = await supabase.from("calendar_events").insert(event).select().single()

    return data
  }
}
