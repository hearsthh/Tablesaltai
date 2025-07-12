"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { AppNavigation, MobileBottomNavigation } from "@/components/layout/app-navigation"
import {
  TrendingUp,
  Users,
  Star,
  ShoppingCart,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  BarChart3,
  Smartphone,
  MessageSquare,
  Utensils,
  Megaphone,
} from "lucide-react"
import type { DashboardData } from "@/lib/types/dashboard"

export default function NewDashboard() {
  const { toast } = useToast()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/dashboard")

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }

      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      console.error("Dashboard fetch error:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
      toast({
        title: "Error Loading Dashboard",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const completeTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/dashboard/tasks/${taskId}/complete`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Task Completed",
          description: "Task has been marked as completed.",
        })
        fetchDashboardData()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete task.",
        variant: "destructive",
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppNavigation />
        <div className="flex-1 px-4 py-6 pb-20">
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>

            {/* KPI Cards Skeleton */}
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-16 mb-1" />
                    <Skeleton className="h-3 w-12" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <MobileBottomNavigation />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppNavigation />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Dashboard</h2>
            <p className="text-gray-600 mb-4">Please check your connection and try again.</p>
            <Button onClick={fetchDashboardData}>Retry</Button>
          </div>
        </div>
        <MobileBottomNavigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppNavigation />

      <div className="flex-1 px-4 py-6 pb-20">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 text-sm mt-1">Welcome back! Here's your restaurant overview.</p>
        </div>

        {/* KPI Cards - Mobile First: 2x2 Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="p-2 bg-green-100 rounded-lg w-fit mx-auto mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-xs text-gray-600 mb-1">Revenue</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(data.kpis.totalRevenue)}</p>
                <p className="text-xs text-green-600">+{data.kpis.revenueGrowth}%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="p-2 bg-blue-100 rounded-lg w-fit mx-auto mb-2">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-xs text-gray-600 mb-1">Customers</p>
                <p className="text-lg font-bold text-gray-900">{data.kpis.totalCustomers}</p>
                <p className="text-xs text-green-600">+{data.kpis.customerGrowth}%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="p-2 bg-yellow-100 rounded-lg w-fit mx-auto mb-2">
                  <Star className="w-4 h-4 text-yellow-600" />
                </div>
                <p className="text-xs text-gray-600 mb-1">Rating</p>
                <p className="text-lg font-bold text-gray-900">{data.kpis.avgRating.toFixed(1)}</p>
                <p className="text-xs text-green-600">+{data.kpis.ratingTrend}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="p-2 bg-purple-100 rounded-lg w-fit mx-auto mb-2">
                  <ShoppingCart className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-xs text-gray-600 mb-1">Orders</p>
                <p className="text-lg font-bold text-gray-900">{data.kpis.totalOrders}</p>
                <p className="text-xs text-green-600">+{data.kpis.orderGrowth}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1 bg-white">
                <MessageSquare className="w-5 h-5" />
                <span className="text-xs">Reviews</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1 bg-white">
                <Utensils className="w-5 h-5" />
                <span className="text-xs">Menu</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1 bg-white">
                <Megaphone className="w-5 h-5" />
                <span className="text-xs">Marketing</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1 bg-white">
                <BarChart3 className="w-5 h-5" />
                <span className="text-xs">Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Pending Tasks</CardTitle>
              <Badge variant="secondary">{data.tasks.filter((t) => t.status === "pending").length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.tasks.slice(0, 3).map((task) => (
                <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <Badge className={getPriorityColor(task.priority)} variant="secondary">
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        Due {formatDate(task.dueDate)}
                      </div>
                    </div>
                    {task.status === "pending" && (
                      <Button size="sm" variant="outline" onClick={() => completeTask(task.id)} className="ml-2">
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {data.tasks.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No pending tasks</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
              {data.recentActivity.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Platform Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Platform Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.platformStatus.map((platform) => (
                <div key={platform.name} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{platform.name}</p>
                    <p className="text-xs text-gray-500">Last sync: {formatDate(platform.lastSync)}</p>
                  </div>
                  <Badge variant={platform.status === "connected" ? "default" : "destructive"} className="text-xs">
                    {platform.status}
                  </Badge>
                </div>
              ))}
              {data.platformStatus.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <Smartphone className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No platforms connected</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <MobileBottomNavigation />
    </div>
  )
}
