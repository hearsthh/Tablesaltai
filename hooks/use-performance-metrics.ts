"use client"

import { useState, useEffect } from "react"
import type { PerformanceMetrics } from "@/types/marketing"

export function usePerformanceMetrics(id?: string | null, type?: string) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true)
        setError(null)

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock performance metrics data
        const mockMetrics: PerformanceMetrics = {
          totalReach: 36500,
          totalEngagement: 2100,
          totalConversions: 135,
          totalSpend: 23750,
          totalRevenue: 67500,
          averageROI: 2.8,
          conversionRate: 6.4,
          growthRate: 12,
          costPerConversion: 176,
          topPerformingChannel: "Instagram",
          topPerformingCampaign: "Weekend Special Promotion",
          channelPerformance: [
            {
              channel: "instagram",
              reach: 15200,
              engagement: 890,
              conversions: 45,
              spend: 8500,
              revenue: 22500,
              roi: 2.6,
            },
            {
              channel: "whatsapp",
              reach: 8900,
              engagement: 756,
              conversions: 67,
              spend: 3200,
              revenue: 18900,
              roi: 5.9,
            },
            {
              channel: "facebook",
              reach: 12400,
              engagement: 454,
              conversions: 23,
              spend: 5600,
              revenue: 12100,
              roi: 2.2,
            },
          ],
          insights: [
            {
              type: "positive",
              priority: "high",
              message: "WhatsApp campaigns are performing exceptionally well with 5.9x ROI",
              recommendation: "Consider increasing budget allocation to WhatsApp campaigns",
            },
            {
              type: "neutral",
              priority: "medium",
              message: "Instagram engagement rate is above industry average at 5.9%",
              recommendation: "Maintain current Instagram content strategy",
            },
            {
              type: "negative",
              priority: "medium",
              message: "Facebook conversion rate is below target at 1.9%",
              recommendation: "Review Facebook ad targeting and creative content",
            },
            {
              type: "positive",
              priority: "low",
              message: "Overall campaign performance is trending upward with 12% growth",
              recommendation: "Continue current strategy while monitoring key metrics",
            },
          ],
        }

        setMetrics(mockMetrics)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch metrics")
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [id, type])

  return { metrics, loading, error }
}
