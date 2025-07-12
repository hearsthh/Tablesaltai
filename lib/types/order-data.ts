// Order Data Types based on provided specifications

export interface Order {
  id: string
  orderNo: string
  customerId?: string
  customerName?: string
  customerPhone?: string
  orderSlot: "bf" | "lunch" | "snack" | "dinner" | "midnight"
  noOfItems: number
  itemList: OrderItem[]
  freeItemsList: OrderItem[]
  discount: {
    amount: number
    percentage: number
  }
  billAmount: number
  serviceFee: {
    amount: number
    percentage: number
  }
  taxAmount: {
    amount: number
    percentage: number
  }
  finalAmount: number
  orderDate: string
  orderTime: string
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  orderSource: "dine-in" | "takeaway" | "delivery" | "online"
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  menuItemId: string
  name: string
  price: number
  quantity: number
  totalPrice: number
  customizations?: string[]
  notes?: string
}

export interface OrderData {
  id: string
  userId: string
  restaurantId: string
  orders: Order[]
  analytics: OrderAnalytics
  lastSyncAt?: string
  completionStatus: {
    orders: boolean
    analytics: boolean
    overall: number
  }
  createdAt: string
  updatedAt: string
}

export interface OrderAnalytics {
  totalOrders: number
  totalRevenue: number
  avgOrderValue: number
  topSellingItems: { itemName: string; quantity: number; revenue: number }[]
  ordersBySlot: { slot: string; count: number; revenue: number }[]
  ordersBySource: { source: string; count: number; revenue: number }[]
  dailyTrends: { date: string; orders: number; revenue: number }[]
  monthlyTrends: { month: string; orders: number; revenue: number }[]
  peakHours: { hour: string; orderCount: number }[]
  avgPreparationTime: number
  customerRetention: number
}

export const ORDER_SLOTS = [
  { value: "bf", label: "Breakfast", timeRange: "6:00 AM - 11:00 AM" },
  { value: "lunch", label: "Lunch", timeRange: "11:00 AM - 4:00 PM" },
  { value: "snack", label: "Snack", timeRange: "4:00 PM - 7:00 PM" },
  { value: "dinner", label: "Dinner", timeRange: "7:00 PM - 11:00 PM" },
  { value: "midnight", label: "Midnight", timeRange: "11:00 PM - 6:00 AM" },
]

export const ORDER_STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "yellow" },
  { value: "confirmed", label: "Confirmed", color: "blue" },
  { value: "preparing", label: "Preparing", color: "orange" },
  { value: "ready", label: "Ready", color: "green" },
  { value: "delivered", label: "Delivered", color: "green" },
  { value: "cancelled", label: "Cancelled", color: "red" },
]

export const ORDER_SOURCE_OPTIONS = [
  { value: "dine-in", label: "Dine In" },
  { value: "takeaway", label: "Takeaway" },
  { value: "delivery", label: "Delivery" },
  { value: "online", label: "Online" },
]

export const PAYMENT_STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "yellow" },
  { value: "paid", label: "Paid", color: "green" },
  { value: "failed", label: "Failed", color: "red" },
  { value: "refunded", label: "Refunded", color: "gray" },
]
