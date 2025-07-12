"use client"

import { useState, useEffect } from "react"
import type {
  MarketingStrategy,
  MarketingCampaign,
  CampaignTask,
  MarketingCalendarEvent,
} from "@/lib/types/marketing-system"
import { marketingSystemService } from "@/lib/services/marketing-system-service"
import { useToast } from "@/components/ui/use-toast"

export function useMarketingSystem(userId: string, restaurantId: string) {
  const [strategies, setStrategies] = useState<MarketingStrategy[]>([])
  const [selectedStrategy, setSelectedStrategy] = useState<MarketingStrategy | null>(null)
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([])
  const [tasks, setTasks] = useState<CampaignTask[]>([])
  const [calendarEvents, setCalendarEvents] = useState<MarketingCalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Load strategies
  const loadStrategies = async () => {
    try {
      setLoading(true)
      const data = await marketingSystemService.getStrategies(userId, restaurantId)
      setStrategies(data)
      if (data.length > 0 && !selectedStrategy) {
        setSelectedStrategy(data[0])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load strategies")
      toast({
        title: "Error",
        description: "Failed to load marketing strategies",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Load campaigns for selected strategy
  const loadCampaigns = async (strategyId: string) => {
    try {
      const data = await marketingSystemService.getCampaigns(strategyId)
      setCampaigns(data)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load campaigns",
        variant: "destructive",
      })
    }
  }

  // Load tasks for campaign
  const loadTasks = async (campaignId: string) => {
    try {
      const data = await marketingSystemService.getTasks(campaignId)
      setTasks(data)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      })
    }
  }

  // Load calendar events
  const loadCalendarEvents = async (startDate: string, endDate: string) => {
    try {
      const data = await marketingSystemService.getCalendarEvents(userId, startDate, endDate)
      setCalendarEvents(data)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load calendar events",
        variant: "destructive",
      })
    }
  }

  // Create new strategy
  const createStrategy = async (strategyData: Omit<MarketingStrategy, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newStrategy = await marketingSystemService.createStrategy(strategyData)
      setStrategies((prev) => [newStrategy, ...prev])
      setSelectedStrategy(newStrategy)
      toast({
        title: "Success",
        description: "Marketing strategy created successfully",
      })
      return newStrategy
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create strategy",
        variant: "destructive",
      })
      throw err
    }
  }

  // Generate AI strategy
  const generateAIStrategy = async (goal: string) => {
    try {
      setLoading(true)
      const newStrategy = await marketingSystemService.generateStrategyFromGoal(goal, userId, restaurantId)
      setStrategies((prev) => [newStrategy, ...prev])
      setSelectedStrategy(newStrategy)
      toast({
        title: "AI Strategy Generated",
        description: "Your marketing strategy has been created with AI assistance",
      })
      return newStrategy
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to generate AI strategy",
        variant: "destructive",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Create campaign
  const createCampaign = async (campaignData: Omit<MarketingCampaign, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newCampaign = await marketingSystemService.createCampaign(campaignData)
      setCampaigns((prev) => [newCampaign, ...prev])
      toast({
        title: "Success",
        description: "Campaign created successfully",
      })
      return newCampaign
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive",
      })
      throw err
    }
  }

  // Update task status
  const updateTaskStatus = async (taskId: string, status: CampaignTask["status"]) => {
    try {
      const updatedTask = await marketingSystemService.updateTask(taskId, { status })
      setTasks((prev) => prev.map((task) => (task.id === taskId ? updatedTask : task)))
      toast({
        title: "Task Updated",
        description: `Task marked as ${status}`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      })
    }
  }

  // Complete task
  const completeTask = async (taskId: string) => {
    try {
      const completedTask = await marketingSystemService.completeTask(taskId)
      setTasks((prev) => prev.map((task) => (task.id === taskId ? completedTask : task)))
      toast({
        title: "Task Completed",
        description: "Task has been marked as completed",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to complete task",
        variant: "destructive",
      })
    }
  }

  // Auto-complete AI tasks
  const autoCompleteAITasks = async () => {
    try {
      await marketingSystemService.autoCompleteAITasks()
      // Reload tasks to reflect changes
      if (selectedStrategy) {
        const allCampaigns = await marketingSystemService.getCampaigns(selectedStrategy.id)
        const allTasks = []
        for (const campaign of allCampaigns) {
          const campaignTasks = await marketingSystemService.getTasks(campaign.id)
          allTasks.push(...campaignTasks)
        }
        setTasks(allTasks)
      }
      toast({
        title: "AI Tasks Completed",
        description: "All AI-assigned tasks have been automatically completed",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to auto-complete AI tasks",
        variant: "destructive",
      })
    }
  }

  // Effects
  useEffect(() => {
    if (userId && restaurantId) {
      loadStrategies()
    }
  }, [userId, restaurantId])

  useEffect(() => {
    if (selectedStrategy) {
      loadCampaigns(selectedStrategy.id)
    }
  }, [selectedStrategy])

  // Load calendar events for current month
  useEffect(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()
    loadCalendarEvents(startOfMonth, endOfMonth)
  }, [userId])

  return {
    // State
    strategies,
    selectedStrategy,
    campaigns,
    tasks,
    calendarEvents,
    loading,
    error,

    // Actions
    setSelectedStrategy,
    createStrategy,
    generateAIStrategy,
    createCampaign,
    updateTaskStatus,
    completeTask,
    autoCompleteAITasks,
    loadTasks,
    loadCalendarEvents,

    // Computed values
    totalStrategies: strategies.length,
    activeStrategies: strategies.filter((s) => s.status === "active").length,
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter((c) => c.status === "live").length,
    pendingTasks: tasks.filter((t) => t.status === "todo").length,
    overdueTasks: tasks.filter((t) => t.status === "todo" && new Date(t.dueDate) < new Date()).length,
  }
}
