"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Star,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Sparkles,
  Target,
  Calendar,
} from "lucide-react"

// Static data for fast loading in v0 preview
const staticData = {
  kpis: [
    {
      title: "Monthly Revenue",
      value: "₹4,50,000",
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: "1,247",
      change: "+8.2%",
      trend: "up" as const,
      icon: Users,
    },
    {
      title: "Average Rating",
      value: "4.3",
      change: "+0.2",
      trend: "up" as const,
      icon: Star,
    },
    {
      title: "Response Rate",
      value: "94%",
      change: "-2.1%",
      trend: "down" as const,
      icon: MessageSquare,
    },
  ],
  tasks: [
    {
      id: "1",
      title: "Respond to 3 new reviews",
      priority: "high" as const,
      dueDate: "Today",
      completed: false,
    },
    {
      id: "2",
      title: "Update weekend menu specials",
      priority: "medium" as const,
      dueDate: "Tomorrow",
      completed: false,
    },
    {
      id: "3",
      title: "Review marketing campaign performance",
      priority: "low" as const,
      dueDate: "This week",
      completed: true,
    },
  ],
  insights: [
    {
      title: "Peak Hours Optimization",
      description: "Your busiest hours are 7-9 PM. Consider adding staff during this time.",
      type: "opportunity" as const,
      impact: "high" as const,
    },
    {
      title: "Menu Item Performance",
      description: "Butter Chicken is your top performer with 234 orders this month.",
      type: "success" as const,
      impact: "medium" as const,
    },
    {
      title: "Review Response Needed",
      description: "You have 3 unresponded reviews from the last 48 hours.",
      type: "warning" as const,
      impact: "high" as const,
    },
  ],
  recentActivity: [
    {
      id: "1",
      action: "New 5-star review received",
      time: "2 hours ago",
      type: "review",
    },
    {
      id: "2",
      action: "Marketing campaign launched",
      time: "4 hours ago",
      type: "marketing",
    },
    {
      id: "3",
      action: "Menu item updated",
      time: "6 hours ago",
      type: "menu",
    },
  ],
}

export default function DashboardPage() {
  const handleCompleteTask = (taskId: string) => {
    console.log("Task completed:", taskId)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <Target className="w-5 h-5 text-blue-600" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      default:
        return <Sparkles className="w-5 h-5 text-purple-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your restaurant.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              This Month
            </Button>
            <Button size="sm">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Insights
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {staticData.kpis.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <Card key={index} className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{kpi.title}</CardTitle>
                  <Icon className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                  <div className="flex items-center mt-1">
                    {kpi.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {kpi.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks and Insights */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Today's Tasks
                </CardTitle>
                <CardDescription>Complete these tasks to optimize your restaurant performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {staticData.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      task.completed ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          task.completed ? "bg-green-500 border-green-500" : "border-gray-300 hover:border-gray-400"
                        }`}
                      />
                      <div>
                        <p className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    {!task.completed && (
                      <Button size="sm" variant="outline" onClick={() => handleCompleteTask(task.id)}>
                        Complete
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI Insights
                </CardTitle>
                <CardDescription>Personalized recommendations to grow your business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {staticData.insights.map((insight, index) => (
                  <div key={index} className="flex gap-3 p-4 rounded-lg bg-gray-50">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                      <Badge className="mt-2" variant="secondary">
                        {insight.impact} impact
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Menu Completion</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Profile Optimization</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Review Response Rate</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staticData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Respond to Reviews
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Content
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Target className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
