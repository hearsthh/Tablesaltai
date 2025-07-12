import type {
  MarketingStrategy,
  MarketingCampaign,
  CampaignTask,
  MarketingCalendarEvent,
  AutomationRule,
} from "@/lib/types/marketing-system"
import { createClient } from "@/lib/supabase/client"

export class MarketingSystemService {
  private supabase = createClient()

  // Strategy Management
  async createStrategy(
    strategy: Omit<MarketingStrategy, "id" | "createdAt" | "updatedAt">,
  ): Promise<MarketingStrategy> {
    const { data, error } = await this.supabase
      .from("marketing_strategies")
      .insert({
        ...strategy,
        performance: {
          totalReach: 0,
          totalEngagement: 0,
          totalSpend: 0,
          roas: 0,
          completionRate: 0,
        },
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getStrategies(userId: string, restaurantId: string): Promise<MarketingStrategy[]> {
    const { data, error } = await this.supabase
      .from("marketing_strategies")
      .select(`
        *,
        campaigns:marketing_campaigns(*)
      `)
      .eq("user_id", userId)
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  async updateStrategy(id: string, updates: Partial<MarketingStrategy>): Promise<MarketingStrategy> {
    const { data, error } = await this.supabase
      .from("marketing_strategies")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Campaign Management
  async createCampaign(
    campaign: Omit<MarketingCampaign, "id" | "createdAt" | "updatedAt">,
  ): Promise<MarketingCampaign> {
    const { data, error } = await this.supabase
      .from("marketing_campaigns")
      .insert({
        ...campaign,
        performance: {
          reach: 0,
          clicks: 0,
          conversions: 0,
          engagement: 0,
          roas: 0,
        },
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getCampaigns(strategyId: string): Promise<MarketingCampaign[]> {
    const { data, error } = await this.supabase
      .from("marketing_campaigns")
      .select(`
        *,
        tasks:campaign_tasks(*),
        channels:campaign_channels(*)
      `)
      .eq("strategy_id", strategyId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  async updateCampaign(id: string, updates: Partial<MarketingCampaign>): Promise<MarketingCampaign> {
    const { data, error } = await this.supabase
      .from("marketing_campaigns")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Task Management
  async createTask(task: Omit<CampaignTask, "id">): Promise<CampaignTask> {
    const { data, error } = await this.supabase.from("campaign_tasks").insert(task).select().single()

    if (error) throw error
    return data
  }

  async getTasks(campaignId: string): Promise<CampaignTask[]> {
    const { data, error } = await this.supabase
      .from("campaign_tasks")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("due_date", { ascending: true })

    if (error) throw error
    return data || []
  }

  async updateTask(id: string, updates: Partial<CampaignTask>): Promise<CampaignTask> {
    const { data, error } = await this.supabase.from("campaign_tasks").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  }

  async completeTask(id: string): Promise<CampaignTask> {
    return this.updateTask(id, {
      status: "done",
      completedAt: new Date().toISOString(),
    })
  }

  // Calendar Management
  async getCalendarEvents(userId: string, startDate: string, endDate: string): Promise<MarketingCalendarEvent[]> {
    const { data, error } = await this.supabase
      .from("marketing_calendar_events")
      .select("*")
      .eq("user_id", userId)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true })

    if (error) throw error
    return data || []
  }

  async createCalendarEvent(event: Omit<MarketingCalendarEvent, "id">): Promise<MarketingCalendarEvent> {
    const { data, error } = await this.supabase.from("marketing_calendar_events").insert(event).select().single()

    if (error) throw error
    return data
  }

  // AI Generation Methods
  async generateStrategyFromGoal(goal: string, userId: string, restaurantId: string): Promise<MarketingStrategy> {
    // This would integrate with your AI service
    const aiResponse = await fetch("/api/ai/generate-marketing-strategy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal, userId, restaurantId }),
    })

    if (!aiResponse.ok) throw new Error("Failed to generate strategy")

    const strategyData = await aiResponse.json()
    return this.createStrategy(strategyData)
  }

  async generateCampaignsForStrategy(strategyId: string): Promise<MarketingCampaign[]> {
    const aiResponse = await fetch("/api/ai/generate-campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ strategyId }),
    })

    if (!aiResponse.ok) throw new Error("Failed to generate campaigns")

    const campaignsData = await aiResponse.json()
    const campaigns = []

    for (const campaignData of campaignsData) {
      const campaign = await this.createCampaign(campaignData)
      campaigns.push(campaign)
    }

    return campaigns
  }

  async autoCompleteAITasks(): Promise<void> {
    const { data: aiTasks } = await this.supabase
      .from("campaign_tasks")
      .select("*")
      .eq("assigned_to", "ai")
      .eq("status", "todo")
      .eq("auto_complete", true)

    if (!aiTasks) return

    for (const task of aiTasks) {
      // Simulate AI task completion
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await this.completeTask(task.id)
    }
  }

  // Analytics and Performance
  async getStrategyPerformance(strategyId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from("marketing_strategies")
      .select(`
        *,
        campaigns:marketing_campaigns(
          performance,
          budget
        )
      `)
      .eq("id", strategyId)
      .single()

    if (error) throw error

    // Calculate aggregated performance
    const totalReach = data.campaigns.reduce((sum: number, c: any) => sum + c.performance.reach, 0)
    const totalSpend = data.campaigns.reduce((sum: number, c: any) => sum + c.budget.spent, 0)
    const totalConversions = data.campaigns.reduce((sum: number, c: any) => sum + c.performance.conversions, 0)

    return {
      ...data,
      aggregatedPerformance: {
        totalReach,
        totalSpend,
        totalConversions,
        roas: totalSpend > 0 ? (totalConversions * 100) / totalSpend : 0,
      },
    }
  }

  // Automation
  async processAutomationRules(): Promise<void> {
    const { data: rules } = await this.supabase.from("automation_rules").select("*").eq("is_active", true)

    if (!rules) return

    for (const rule of rules) {
      await this.executeAutomationRule(rule)
    }
  }

  private async executeAutomationRule(rule: AutomationRule): Promise<void> {
    // Implementation would depend on the specific trigger and actions
    console.log(`Executing automation rule: ${rule.name}`)

    // Update trigger count
    await this.supabase
      .from("automation_rules")
      .update({
        trigger_count: rule.triggerCount + 1,
        last_triggered: new Date().toISOString(),
      })
      .eq("id", rule.id)
  }
}

export const marketingSystemService = new MarketingSystemService()
