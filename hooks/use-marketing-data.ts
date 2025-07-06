"use client"

import { useState, useEffect } from "react"

interface MarketingData {
  strategies: Array<{
    id: string
    title: string
    description: string
    status: "active" | "draft" | "completed"
    metrics: {
      reach?: number
      engagement?: number
      conversions?: number
    }
    lastUpdated: string
  }>
  campaigns: Array<{
    id: string
    title: string
    description: string
    status: "active" | "scheduled" | "completed" | "paused"
    budget: number
    spent: number
    startDate: string
    endDate: string
    performance: {
      impressions: number
      clicks: number
      conversions: number
    }
  }>
  channels: Array<{
    name: string
    status: "connected" | "disconnected" | "pending"
    count?: number
  }>
  contentUnits: Array<{
    id: string
    title: string
    type: "post" | "story" | "reel" | "article" | "email"
    status: "draft" | "scheduled" | "published" | "archived"
    scheduledDate?: string
    publishedDate?: string
    platform: string[]
    engagement?: {
      views: number
      likes: number
      comments: number
      shares: number
    }
  }>
}

export function useMarketingData() {
  const [data, setData] = useState<MarketingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data - replace with actual API call
        const mockData: MarketingData = {
          strategies: [
            {
              id: "1",
              title: "Weekend Special Promotion",
              description: "Drive weekend traffic with special offers",
              status: "active",
              metrics: {
                reach: 15000,
                engagement: 8.5,
                conversions: 45,
              },
              lastUpdated: "2 days ago",
            },
            {
              id: "2",
              title: "Festival Menu Launch",
              description: "Promote new festival menu items",
              status: "draft",
              metrics: {
                reach: 0,
                engagement: 0,
                conversions: 0,
              },
              lastUpdated: "1 week ago",
            },
          ],
          campaigns: [
            {
              id: "1",
              title: "Diwali Special Menu",
              description: "Promote festive menu items",
              status: "active",
              budget: 25000,
              spent: 18500,
              startDate: "Oct 15",
              endDate: "Nov 5",
              performance: {
                impressions: 125000,
                clicks: 3200,
                conversions: 85,
              },
            },
          ],
          channels: [
            { name: "Instagram", status: "connected", count: 5200 },
            { name: "Facebook", status: "connected", count: 3800 },
            { name: "Google My Business", status: "connected" },
            { name: "Zomato", status: "pending" },
          ],
          contentUnits: [
            {
              id: "1",
              title: "Weekend Special Post",
              type: "post",
              status: "published",
              publishedDate: "Oct 20",
              platform: ["Instagram", "Facebook"],
              engagement: {
                views: 8500,
                likes: 340,
                comments: 25,
                shares: 12,
              },
            },
            {
              id: "2",
              title: "New Menu Story",
              type: "story",
              status: "scheduled",
              scheduledDate: "Oct 25",
              platform: ["Instagram"],
            },
          ],
        }

        setData(mockData)
      } catch (err) {
        setError("Failed to fetch marketing data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
