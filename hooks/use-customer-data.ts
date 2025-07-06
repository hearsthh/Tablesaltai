"use client"

import { useState, useEffect } from "react"

interface CustomerSegment {
  id: string
  name: string
  description: string
  size: number
  criteria: string[]
  averageOrderValue: number
  frequency: string
  churnRisk: "low" | "medium" | "high"
  growthRate: number
}

interface ChurnMetrics {
  overall: {
    rate: number
    trend: "up" | "down" | "stable"
    trendPercentage: number
  }
  bySegment: Array<{
    segmentId: string
    segmentName: string
    rate: number
    trend: "up" | "down" | "stable"
  }>
  riskFactors: Array<{
    factor: string
    impact: number
    description: string
  }>
}

interface FrequentCustomer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrderDate: string
  favoriteItems: string[]
  segment: string
  churnRisk: "low" | "medium" | "high"
  loyaltyScore: number
}

interface CustomerData {
  segments: Array<{
    name: string
    count: number
    percentage: number
    growth: number
  }>
  churnMetrics: {
    rate: number
    rateChange: number
    atRiskCustomers: number
  }
  frequentCustomers: Array<{
    name: string
    visits: number
    totalSpent: number
    lastVisit: string
  }>
  satisfaction: {
    score: number
    scoreChange: number
    totalResponses: number
  }
}

export function useCustomerData() {
  const [data, setData] = useState<CustomerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data - replace with actual API call
        const mockData: CustomerData = {
          segments: [
            { name: "Regular Customers", count: 245, percentage: 35, growth: 8.2 },
            { name: "New Customers", count: 180, percentage: 26, growth: 15.3 },
            { name: "VIP Customers", count: 85, percentage: 12, growth: 5.1 },
            { name: "Occasional Visitors", count: 190, percentage: 27, growth: -2.4 },
          ],
          churnMetrics: {
            rate: 12.5,
            rateChange: -3.2,
            atRiskCustomers: 28,
          },
          frequentCustomers: [
            { name: "Rajesh Kumar", visits: 24, totalSpent: 12500, lastVisit: "2 days ago" },
            { name: "Priya Sharma", visits: 19, totalSpent: 9800, lastVisit: "1 week ago" },
            { name: "Amit Patel", visits: 16, totalSpent: 8200, lastVisit: "3 days ago" },
          ],
          satisfaction: {
            score: 4.6,
            scoreChange: 0.3,
            totalResponses: 156,
          },
        }

        setData(mockData)
      } catch (err) {
        setError("Failed to fetch customer data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
