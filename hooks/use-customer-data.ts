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
  segments: CustomerSegment[]
  churnMetrics: ChurnMetrics
  frequentCustomers: FrequentCustomer[]
  totalCustomers: number
  newCustomersThisMonth: number
  returningCustomerRate: number
}

export function useCustomerData() {
  const [data, setData] = useState<CustomerData>({
    segments: [
      {
        id: "1",
        name: "VIP Customers",
        description: "High-value customers with frequent orders",
        size: 234,
        criteria: ["Orders > 20", "AOV > ₹800", "Last order < 7 days"],
        averageOrderValue: 1250,
        frequency: "3-4 times/week",
        churnRisk: "low",
        growthRate: 15.2,
      },
      {
        id: "2",
        name: "Regular Diners",
        description: "Consistent customers with moderate spending",
        size: 1456,
        criteria: ["Orders 5-20", "AOV ₹400-800", "Last order < 14 days"],
        averageOrderValue: 580,
        frequency: "1-2 times/week",
        churnRisk: "medium",
        growthRate: 8.7,
      },
      {
        id: "3",
        name: "Occasional Visitors",
        description: "Infrequent customers with lower spending",
        size: 2890,
        criteria: ["Orders < 5", "AOV < ₹400", "Last order > 14 days"],
        averageOrderValue: 320,
        frequency: "1-2 times/month",
        churnRisk: "high",
        growthRate: -3.2,
      },
      {
        id: "4",
        name: "New Customers",
        description: "Recently acquired customers",
        size: 567,
        criteria: ["First order < 30 days", "Orders 1-3"],
        averageOrderValue: 450,
        frequency: "New",
        churnRisk: "medium",
        growthRate: 25.8,
      },
    ],
    churnMetrics: {
      overall: {
        rate: 12.5,
        trend: "down",
        trendPercentage: -2.3,
      },
      bySegment: [
        {
          segmentId: "1",
          segmentName: "VIP Customers",
          rate: 3.2,
          trend: "stable",
        },
        {
          segmentId: "2",
          segmentName: "Regular Diners",
          rate: 8.7,
          trend: "down",
        },
        {
          segmentId: "3",
          segmentName: "Occasional Visitors",
          rate: 28.4,
          trend: "up",
        },
        {
          segmentId: "4",
          segmentName: "New Customers",
          rate: 15.6,
          trend: "down",
        },
      ],
      riskFactors: [
        {
          factor: "Long time since last order",
          impact: 45,
          description: "Customers who haven't ordered in 30+ days",
        },
        {
          factor: "Declining order frequency",
          impact: 32,
          description: "Customers ordering less frequently than before",
        },
        {
          factor: "Low engagement with promotions",
          impact: 23,
          description: "Customers not responding to offers and campaigns",
        },
      ],
    },
    frequentCustomers: [
      {
        id: "1",
        name: "Rajesh Kumar",
        email: "rajesh.kumar@email.com",
        phone: "+91 98765 43210",
        totalOrders: 45,
        totalSpent: 56250,
        averageOrderValue: 1250,
        lastOrderDate: "2024-01-25",
        favoriteItems: ["Butter Chicken", "Garlic Naan", "Biryani"],
        segment: "VIP Customers",
        churnRisk: "low",
        loyaltyScore: 95,
      },
      {
        id: "2",
        name: "Priya Sharma",
        email: "priya.sharma@email.com",
        phone: "+91 98765 43211",
        totalOrders: 32,
        totalSpent: 38400,
        averageOrderValue: 1200,
        lastOrderDate: "2024-01-24",
        favoriteItems: ["Paneer Tikka", "Dal Makhani", "Roti"],
        segment: "VIP Customers",
        churnRisk: "low",
        loyaltyScore: 88,
      },
      {
        id: "3",
        name: "Amit Patel",
        email: "amit.patel@email.com",
        phone: "+91 98765 43212",
        totalOrders: 28,
        totalSpent: 22400,
        averageOrderValue: 800,
        lastOrderDate: "2024-01-23",
        favoriteItems: ["Chicken Curry", "Rice", "Papad"],
        segment: "Regular Diners",
        churnRisk: "medium",
        loyaltyScore: 72,
      },
      {
        id: "4",
        name: "Sneha Reddy",
        email: "sneha.reddy@email.com",
        phone: "+91 98765 43213",
        totalOrders: 25,
        totalSpent: 18750,
        averageOrderValue: 750,
        lastOrderDate: "2024-01-22",
        favoriteItems: ["South Indian Thali", "Sambar", "Dosa"],
        segment: "Regular Diners",
        churnRisk: "low",
        loyaltyScore: 78,
      },
      {
        id: "5",
        name: "Vikram Singh",
        email: "vikram.singh@email.com",
        phone: "+91 98765 43214",
        totalOrders: 22,
        totalSpent: 15400,
        averageOrderValue: 700,
        lastOrderDate: "2024-01-20",
        favoriteItems: ["Tandoori Chicken", "Naan", "Lassi"],
        segment: "Regular Diners",
        churnRisk: "medium",
        loyaltyScore: 65,
      },
    ],
    totalCustomers: 5147,
    newCustomersThisMonth: 567,
    returningCustomerRate: 68.5,
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
      setError("Failed to fetch customer data")
    } finally {
      setLoading(false)
    }
  }

  const updateSegment = (id: string, updates: Partial<CustomerSegment>) => {
    setData((prev) => ({
      ...prev,
      segments: prev.segments.map((segment) => (segment.id === id ? { ...segment, ...updates } : segment)),
    }))
  }

  const updateCustomer = (id: string, updates: Partial<FrequentCustomer>) => {
    setData((prev) => ({
      ...prev,
      frequentCustomers: prev.frequentCustomers.map((customer) =>
        customer.id === id ? { ...customer, ...updates } : customer,
      ),
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
    updateSegment,
    updateCustomer,
  }
}
