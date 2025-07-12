export interface KPIData {
  totalRevenue: number
  totalCustomers: number
  avgRating: number
  totalOrders: number
  revenueGrowth: number
  customerGrowth: number
  ratingTrend: number
  orderGrowth: number
}

export interface Task {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  status: "pending" | "completed"
  dueDate: string
  type: string
}

export interface Insight {
  id: string
  title: string
  description: string
  type: string
  priority: "high" | "medium" | "low"
  actionText: string
  actionRequired: boolean
}

export interface Activity {
  id: string
  description: string
  timestamp: string
  type: string
}

export interface PlatformStatus {
  name: string
  status: "connected" | "disconnected" | "error"
  lastSync: string
}

export interface DashboardData {
  kpis: KPIData
  tasks: Task[]
  insights: Insight[]
  recentActivity: Activity[]
  platformStatus: PlatformStatus[]
}
