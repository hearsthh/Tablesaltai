import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  demographics: {
    age: number
    gender: string
    location: string
    income: string
  }
  behavior: {
    frequency: number // visits per month
    avgSpend: number
    lastVisit: string
    totalSpent: number
    preferredTime: string
    preferredItems: string[]
  }
  acquisition: {
    channel: string
    date: string
    campaign?: string
  }
  metrics: {
    cac: number // Customer Acquisition Cost
    ltv: number // Lifetime Value
    clv: number // Customer Lifetime Value
    churnRisk: "low" | "medium" | "high"
  }
  status: "new" | "active" | "dormant" | "churned"
  segment: string
  preferences: {
    cuisine: string[]
    dietary: string[]
    communication: string[]
  }
  engagement: {
    emailOpens: number
    clickThrough: number
    socialInteraction: number
    reviewsLeft: number
  }
}

interface CustomerSegment {
  id: string
  name: string
  description: string
  criteria: {
    demographics?: any
    behavior?: any
    metrics?: any
  }
  customerCount: number
  avgLTV: number
  avgSpend: number
  color: string
}

interface ChurnAnalysis {
  newCustomers: number
  activeCustomers: number
  dormantCustomers: number
  churnedCustomers: number
  churnRate: number
  retentionRate: number
  trends: {
    period: string
    new: number
    active: number
    dormant: number
    churned: number
  }[]
}

interface CustomerStore {
  customers: Customer[]
  segments: CustomerSegment[]
  churnAnalysis: ChurnAnalysis

  // Actions
  addCustomer: (customer: Omit<Customer, "id">) => void
  updateCustomer: (id: string, updates: Partial<Customer>) => void
  deleteCustomer: (id: string) => void

  addSegment: (segment: Omit<CustomerSegment, "id">) => void
  updateSegment: (id: string, updates: Partial<CustomerSegment>) => void
  deleteSegment: (id: string) => void

  // Analytics
  getCustomersBySegment: (segmentId: string) => Customer[]
  getHighValueCustomers: () => Customer[]
  getChurnRiskCustomers: () => Customer[]
  calculateSegmentMetrics: () => void
}

// Mock data generator
const generateMockCustomers = (): Customer[] => {
  const names = [
    "Rajesh Kumar",
    "Priya Sharma",
    "Amit Patel",
    "Sneha Gupta",
    "Vikram Singh",
    "Anita Desai",
    "Rohit Mehta",
    "Kavya Nair",
  ]
  const locations = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Pune", "Hyderabad", "Kolkata", "Ahmedabad"]
  const channels = ["Social Media", "Google Ads", "Referral", "Walk-in", "Food Delivery App", "Website"]
  const cuisines = ["North Indian", "South Indian", "Chinese", "Continental", "Italian", "Mexican"]

  return Array.from({ length: 50 }, (_, i) => ({
    id: `customer-${i + 1}`,
    name: names[i % names.length],
    email: `${names[i % names.length].toLowerCase().replace(" ", ".")}@email.com`,
    phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    demographics: {
      age: Math.floor(Math.random() * 40) + 20,
      gender: Math.random() > 0.5 ? "Male" : "Female",
      location: locations[Math.floor(Math.random() * locations.length)],
      income: ["< 5L", "5-10L", "10-20L", "20L+"][Math.floor(Math.random() * 4)],
    },
    behavior: {
      frequency: Math.floor(Math.random() * 8) + 1,
      avgSpend: Math.floor(Math.random() * 2000) + 500,
      lastVisit: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      totalSpent: Math.floor(Math.random() * 50000) + 5000,
      preferredTime: ["Lunch", "Dinner", "Brunch"][Math.floor(Math.random() * 3)],
      preferredItems: cuisines.slice(0, Math.floor(Math.random() * 3) + 1),
    },
    acquisition: {
      channel: channels[Math.floor(Math.random() * channels.length)],
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
    metrics: {
      cac: Math.floor(Math.random() * 500) + 100,
      ltv: Math.floor(Math.random() * 20000) + 5000,
      clv: Math.floor(Math.random() * 15000) + 3000,
      churnRisk: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
    },
    status: ["new", "active", "dormant"][Math.floor(Math.random() * 3)] as "new" | "active" | "dormant",
    segment: ["VIP", "Regular", "Occasional", "New"][Math.floor(Math.random() * 4)],
    preferences: {
      cuisine: cuisines.slice(0, Math.floor(Math.random() * 3) + 1),
      dietary: ["Vegetarian", "Non-Vegetarian", "Vegan", "Gluten-Free"].slice(0, Math.floor(Math.random() * 2) + 1),
      communication: ["Email", "SMS", "WhatsApp"].slice(0, Math.floor(Math.random() * 2) + 1),
    },
    engagement: {
      emailOpens: Math.floor(Math.random() * 20),
      clickThrough: Math.floor(Math.random() * 10),
      socialInteraction: Math.floor(Math.random() * 15),
      reviewsLeft: Math.floor(Math.random() * 5),
    },
  }))
}

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      customers: generateMockCustomers(),
      segments: [
        {
          id: "vip",
          name: "VIP Customers",
          description: "High-value customers with frequent visits and high spending",
          criteria: { behavior: { avgSpend: "> 1500", frequency: "> 4" } },
          customerCount: 12,
          avgLTV: 18500,
          avgSpend: 1850,
          color: "bg-purple-50 border-purple-200 text-purple-700",
        },
        {
          id: "regular",
          name: "Regular Customers",
          description: "Consistent customers with moderate spending",
          criteria: { behavior: { avgSpend: "800-1500", frequency: "2-4" } },
          customerCount: 28,
          avgLTV: 12000,
          avgSpend: 1200,
          color: "bg-green-50 border-green-200 text-green-700",
        },
        {
          id: "occasional",
          name: "Occasional Visitors",
          description: "Infrequent visitors with lower spending",
          criteria: { behavior: { avgSpend: "< 800", frequency: "< 2" } },
          customerCount: 15,
          avgLTV: 6500,
          avgSpend: 650,
          color: "bg-blue-50 border-blue-200 text-blue-700",
        },
        {
          id: "new",
          name: "New Customers",
          description: "Recently acquired customers",
          criteria: { status: "new" },
          customerCount: 8,
          avgLTV: 4200,
          avgSpend: 750,
          color: "bg-orange-50 border-orange-200 text-orange-700",
        },
      ],
      churnAnalysis: {
        newCustomers: 8,
        activeCustomers: 32,
        dormantCustomers: 10,
        churnedCustomers: 5,
        churnRate: 12.5,
        retentionRate: 87.5,
        trends: [
          { period: "Jan", new: 5, active: 28, dormant: 8, churned: 3 },
          { period: "Feb", new: 7, active: 30, dormant: 9, churned: 4 },
          { period: "Mar", new: 6, active: 31, dormant: 10, churned: 4 },
          { period: "Apr", new: 8, active: 32, dormant: 10, churned: 5 },
        ],
      },

      addCustomer: (customer) => {
        const newCustomer = {
          ...customer,
          id: `customer-${Date.now()}`,
        }
        set((state) => ({
          customers: [...state.customers, newCustomer],
        }))
      },

      updateCustomer: (id, updates) => {
        set((state) => ({
          customers: state.customers.map((customer) => (customer.id === id ? { ...customer, ...updates } : customer)),
        }))
      },

      deleteCustomer: (id) => {
        set((state) => ({
          customers: state.customers.filter((customer) => customer.id !== id),
        }))
      },

      addSegment: (segment) => {
        const newSegment = {
          ...segment,
          id: `segment-${Date.now()}`,
        }
        set((state) => ({
          segments: [...state.segments, newSegment],
        }))
      },

      updateSegment: (id, updates) => {
        set((state) => ({
          segments: state.segments.map((segment) => (segment.id === id ? { ...segment, ...updates } : segment)),
        }))
      },

      deleteSegment: (id) => {
        set((state) => ({
          segments: state.segments.filter((segment) => segment.id !== id),
        }))
      },

      getCustomersBySegment: (segmentId) => {
        const customers = get().customers
        return customers.filter((customer) => customer.segment.toLowerCase() === segmentId)
      },

      getHighValueCustomers: () => {
        const customers = get().customers
        return customers.filter((customer) => customer.metrics.ltv > 15000)
      },

      getChurnRiskCustomers: () => {
        const customers = get().customers
        return customers.filter((customer) => customer.metrics.churnRisk === "high")
      },

      calculateSegmentMetrics: () => {
        // Implementation for calculating segment metrics
      },
    }),
    {
      name: "customer-store",
    },
  ),
)
