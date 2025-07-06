"use client"

import { useState, useEffect } from "react"

interface MarketingStrategy {
  id: string
  name: string
  description: string
  status: "active" | "paused" | "draft" | "completed"
  budget: number
  spent: number
  campaigns: number
  performance: {
    reach: number
    engagement: number
    conversions: number
  }
  startDate: string
  endDate: string
}

interface MarketingCampaign {
  id: string
  name: string
  description: string
  status: "active" | "paused" | "draft" | "completed" | "scheduled"
  budget: number
  spent: number
  analytics: {
    reach: number
    engagement: number
    conversions: number
    ctr: number
  }
  channels: string[]
  startDate: string
  endDate: string
  strategyId?: string
}

interface ContentUnit {
  id: string
  title: string
  description: string
  type: "post" | "story" | "reel" | "carousel" | "video" | "blog"
  status: "draft" | "scheduled" | "published" | "archived"
  platform: string
  scheduledDate?: string
  publishedDate?: string
  performance?: {
    views: number
    likes: number
    shares: number
    comments: number
  }
  thumbnail?: string
  campaignId?: string
}

interface MarketingChannel {
  id: string
  name: string
  platform: string
  status: "connected" | "disconnected" | "error" | "pending"
  lastSync?: string
  metrics: {
    followers: number
    engagement: number
    reach: number
  }
}

interface MarketingData {
  strategies: MarketingStrategy[]
  campaigns: MarketingCampaign[]
  contentUnits: ContentUnit[]
  channels: MarketingChannel[]
}

export function useMarketingData() {
  const [data, setData] = useState<MarketingData>({
    strategies: [
      {
        id: "1",
        name: "Weekend Boost Strategy",
        description: "Increase weekend orders through targeted promotions and social media campaigns",
        status: "active",
        budget: 50000,
        spent: 32000,
        campaigns: 3,
        performance: {
          reach: 125000,
          engagement: 8500,
          conversions: 234,
        },
        startDate: "2024-01-01",
        endDate: "2024-03-31",
      },
      {
        id: "2",
        name: "Lunch Hour Campaign",
        description: "Target office workers during lunch hours with quick delivery promises",
        status: "paused",
        budget: 30000,
        spent: 18000,
        campaigns: 2,
        performance: {
          reach: 85000,
          engagement: 4200,
          conversions: 156,
        },
        startDate: "2024-02-01",
        endDate: "2024-04-30",
      },
    ],
    campaigns: [
      {
        id: "1",
        name: "Weekend Special Offers",
        description: "20% off on all orders above ₹500 during weekends",
        status: "active",
        budget: 20000,
        spent: 12000,
        analytics: {
          reach: 45000,
          engagement: 3200,
          conversions: 89,
          ctr: 4.8,
        },
        channels: ["Instagram", "Facebook", "WhatsApp"],
        startDate: "2024-01-15",
        endDate: "2024-02-15",
        strategyId: "1",
      },
      {
        id: "2",
        name: "Lunch Combo Deal",
        description: "Special combo meals for office workers",
        status: "paused",
        budget: 15000,
        spent: 8000,
        analytics: {
          reach: 28000,
          engagement: 1800,
          conversions: 45,
          ctr: 2.1,
        },
        channels: ["LinkedIn", "Google Ads"],
        startDate: "2024-02-01",
        endDate: "2024-03-01",
        strategyId: "2",
      },
      {
        id: "3",
        name: "New Menu Launch",
        description: "Promote our new South Indian menu items",
        status: "scheduled",
        budget: 25000,
        spent: 0,
        analytics: {
          reach: 0,
          engagement: 0,
          conversions: 0,
          ctr: 0,
        },
        channels: ["Instagram", "Facebook", "YouTube"],
        startDate: "2024-03-01",
        endDate: "2024-03-31",
      },
    ],
    contentUnits: [
      {
        id: "1",
        title: "Weekend Special Announcement",
        description: "Eye-catching post announcing our weekend offers",
        type: "post",
        status: "published",
        platform: "Instagram",
        publishedDate: "2024-01-20",
        performance: {
          views: 12500,
          likes: 890,
          shares: 45,
          comments: 67,
        },
        thumbnail: "/placeholder.svg?height=100&width=100&text=Weekend+Special",
        campaignId: "1",
      },
      {
        id: "2",
        title: "Behind the Scenes Reel",
        description: "Chef preparing signature dishes",
        type: "reel",
        status: "scheduled",
        platform: "Instagram",
        scheduledDate: "2024-02-01",
        thumbnail: "/placeholder.svg?height=100&width=100&text=Chef+Reel",
        campaignId: "3",
      },
      {
        id: "3",
        title: "Customer Review Story",
        description: "Featuring happy customer testimonials",
        type: "story",
        status: "draft",
        platform: "Instagram",
        thumbnail: "/placeholder.svg?height=100&width=100&text=Review+Story",
      },
    ],
    channels: [
      {
        id: "1",
        name: "Instagram Business",
        platform: "Instagram",
        status: "connected",
        lastSync: "2 mins ago",
        metrics: {
          followers: 12500,
          engagement: 8.5,
          reach: 45000,
        },
      },
      {
        id: "2",
        name: "Facebook Page",
        platform: "Facebook",
        status: "connected",
        lastSync: "5 mins ago",
        metrics: {
          followers: 8900,
          engagement: 6.2,
          reach: 32000,
        },
      },
      {
        id: "3",
        name: "WhatsApp Business",
        platform: "WhatsApp",
        status: "error",
        lastSync: "2 hours ago",
        metrics: {
          followers: 0,
          engagement: 0,
          reach: 5600,
        },
      },
      {
        id: "4",
        name: "Google My Business",
        platform: "Google",
        status: "disconnected",
        metrics: {
          followers: 0,
          engagement: 0,
          reach: 0,
        },
      },
    ],
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setError(null)
    } catch (err) {
      setError("Failed to fetch marketing data")
    } finally {
      setLoading(false)
    }
  }

  const updateStrategy = (id: string, updates: Partial<MarketingStrategy>) => {
    setData((prev) => ({
      ...prev,
      strategies: prev.strategies.map((strategy) => (strategy.id === id ? { ...strategy, ...updates } : strategy)),
    }))
  }

  const updateCampaign = (id: string, updates: Partial<MarketingCampaign>) => {
    setData((prev) => ({
      ...prev,
      campaigns: prev.campaigns.map((campaign) => (campaign.id === id ? { ...campaign, ...updates } : campaign)),
    }))
  }

  const updateContentUnit = (id: string, updates: Partial<ContentUnit>) => {
    setData((prev) => ({
      ...prev,
      contentUnits: prev.contentUnits.map((unit) => (unit.id === id ? { ...unit, ...updates } : unit)),
    }))
  }

  const updateChannel = (id: string, updates: Partial<MarketingChannel>) => {
    setData((prev) => ({
      ...prev,
      channels: prev.channels.map((channel) => (channel.id === id ? { ...channel, ...updates } : channel)),
    }))
  }

  useEffect(() => {
    refreshData()
  }, [])

  return {
    data,
    loading,
    error,
    refreshData,
    updateStrategy,
    updateCampaign,
    updateContentUnit,
    updateChannel,
  }
}
