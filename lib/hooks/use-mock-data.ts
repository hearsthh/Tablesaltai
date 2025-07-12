"use client"

import { useState, useEffect } from "react"

// Mock data types
export interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  orders: number
  aiScore: number
  status: "top-performer" | "needs-image" | "underperforming" | "normal"
  description?: string
  image?: string
}

export interface Campaign {
  id: string
  name: string
  status: "draft" | "scheduled" | "live" | "completed"
  reach: number
  engagement: number
  ctr: number
  startDate: string
  endDate: string
  channels: string[]
}

export interface Review {
  id: string
  customerName: string
  rating: number
  text: string
  platform: string
  date: string
  responded: boolean
  aiReply?: string
  sentiment: "positive" | "neutral" | "negative"
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  segment: string
  totalSpent: number
  lastVisit: string
  orders: number
  status: "active" | "inactive" | "churn-risk"
}

// Mock data
const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Butter Chicken",
    category: "Main Course",
    price: 16.99,
    orders: 245,
    aiScore: 9.2,
    status: "top-performer",
    description: "Tender chicken in rich tomato cream sauce",
  },
  {
    id: "2",
    name: "Paneer Tikka",
    category: "Appetizers",
    price: 12.99,
    orders: 89,
    aiScore: 6.8,
    status: "needs-image",
  },
  {
    id: "3",
    name: "Dal Makhani",
    category: "Main Course",
    price: 14.99,
    orders: 34,
    aiScore: 4.2,
    status: "underperforming",
  },
]

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Weekend Special",
    status: "live",
    reach: 2450,
    engagement: 18.5,
    ctr: 3.2,
    startDate: "2024-01-15",
    endDate: "2024-01-21",
    channels: ["whatsapp", "instagram"],
  },
  {
    id: "2",
    name: "New Menu Launch",
    status: "scheduled",
    reach: 0,
    engagement: 0,
    ctr: 0,
    startDate: "2024-01-22",
    endDate: "2024-01-28",
    channels: ["instagram", "sms"],
  },
]

const mockReviews: Review[] = [
  {
    id: "1",
    customerName: "Sarah M.",
    rating: 5,
    text: "Amazing food and excellent service! The butter chicken was absolutely divine.",
    platform: "Google",
    date: "2024-01-15",
    responded: false,
    aiReply: "Thank you Sarah! We're delighted you enjoyed your experience with us.",
    sentiment: "positive",
  },
  {
    id: "2",
    customerName: "Mike R.",
    rating: 2,
    text: "Food was cold and service was slow. Not impressed.",
    platform: "Zomato",
    date: "2024-01-14",
    responded: false,
    aiReply: "We sincerely apologize for your experience. We'd love to make this right.",
    sentiment: "negative",
  },
  {
    id: "3",
    customerName: "Priya S.",
    rating: 4,
    text: "Good food, nice ambiance. Will visit again!",
    platform: "Yelp",
    date: "2024-01-13",
    responded: true,
    sentiment: "positive",
  },
]

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    email: "rajesh@email.com",
    phone: "+91 98765 43210",
    segment: "VIP",
    totalSpent: 2450,
    lastVisit: "2024-01-15",
    orders: 23,
    status: "active",
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya@email.com",
    phone: "+91 98765 43211",
    segment: "Regular",
    totalSpent: 890,
    lastVisit: "2024-01-10",
    orders: 8,
    status: "churn-risk",
  },
]

// Custom hooks
export function useMenuItems() {
  const [data, setData] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => {
      setData(mockMenuItems)
      setLoading(false)
    }, 1000)
  }, [])

  return { data, loading, error }
}

export function useCampaigns() {
  const [data, setData] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => {
      setData(mockCampaigns)
      setLoading(false)
    }, 800)
  }, [])

  return { data, loading, error }
}

export function useReviews() {
  const [data, setData] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => {
      setData(mockReviews)
      setLoading(false)
    }, 1200)
  }, [])

  return { data, loading, error }
}

export function useCustomers() {
  const [data, setData] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => {
      setData(mockCustomers)
      setLoading(false)
    }, 900)
  }, [])

  return { data, loading, error }
}

export function useDashboardStats() {
  const [data, setData] = useState({
    orders: 0,
    reviews: 0,
    campaignReach: 0,
    ctr: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setData({
        orders: 156,
        reviews: 23,
        campaignReach: 2450,
        ctr: 3.2,
      })
      setLoading(false)
    }, 600)
  }, [])

  return { data, loading }
}
