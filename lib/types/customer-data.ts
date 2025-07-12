// Customer Data Types based on provided specifications

export interface Customer {
  id: string
  name: string
  phoneNo: string
  email?: string
  age?: number
  totalNoOfOrders: number
  ltv: number // Lifetime Value
  avgSpend: number
  lastOrderDate?: string
  firstOrderDate?: string
  orderFrequency: "annual" | "monthly" | "weekly" | "daily"
  frequencySegment: "occasional" | "regular" | "loyal"
  aovSegment: "low" | "normal" | "premium" // Average Order Value
  ltvSegment: "new" | "common" | "vip"
  churnStatus: "new" | "active" | "inactive"
  itemsOrderedList: CustomerItemOrder[]
  weekOrderPattern: WeekOrderPattern[]
  orderSlotPattern: OrderSlotPattern[]
  aiInsights: CustomerAIInsights
  createdAt: string
  updatedAt: string
}

export interface CustomerItemOrder {
  itemId: string
  itemName: string
  orderCount: number
  totalSpent: number
  lastOrderDate: string
}

export interface WeekOrderPattern {
  dayOfWeek: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
  orderCount: number
  totalSpent: number
}

export interface OrderSlotPattern {
  slot: "bf" | "lunch" | "snack" | "dinner" | "midnight"
  orderCount: number
  totalSpent: number
}

export interface CustomerAIInsights {
  orderingPattern: string
  preferences: string[]
  predictedChurnRisk: "low" | "medium" | "high"
  recommendedItems: string[]
  bestContactTime: string
  preferredOrderSlot: string
  seasonalTrends: string[]
}

export interface CustomerData {
  id: string
  userId: string
  restaurantId: string
  customers: Customer[]
  segments: CustomerSegment[]
  analytics: CustomerAnalytics
  lastSyncAt?: string
  completionStatus: {
    customers: boolean
    segments: boolean
    analytics: boolean
    overall: number
  }
  createdAt: string
  updatedAt: string
}

export interface CustomerSegment {
  id: string
  name: string
  criteria: SegmentCriteria
  customerCount: number
  totalValue: number
  avgOrderValue: number
  description: string
}

export interface SegmentCriteria {
  frequencySegment?: string[]
  aovSegment?: string[]
  ltvSegment?: string[]
  churnStatus?: string[]
  orderFrequency?: string[]
  minOrders?: number
  maxOrders?: number
  minLTV?: number
  maxLTV?: number
}

export interface CustomerAnalytics {
  totalCustomers: number
  activeCustomers: number
  newCustomers: number
  churnedCustomers: number
  avgLTV: number
  avgOrderValue: number
  topItems: { itemName: string; orderCount: number }[]
  peakOrderSlots: { slot: string; percentage: number }[]
  loyaltyDistribution: { segment: string; count: number; percentage: number }[]
}

export const FREQUENCY_SEGMENTS = [
  { value: "occasional", label: "Occasional" },
  { value: "regular", label: "Regular" },
  { value: "loyal", label: "Loyal" },
]

export const AOV_SEGMENTS = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "premium", label: "Premium" },
]

export const LTV_SEGMENTS = [
  { value: "new", label: "New" },
  { value: "common", label: "Common" },
  { value: "vip", label: "VIP" },
]

export const CHURN_STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

export const ORDER_FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "annual", label: "Annual" },
]
