"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Users,
  TrendingUp,
  Globe,
  Star,
  MessageSquare,
  AlertTriangle,
  Target,
  Lightbulb,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Eye,
  Zap,
  BarChart3,
  Filter,
  Download,
  Edit,
  Trash2,
  Plus,
} from "lucide-react"

interface Task {
  id: string
  name: string
  description: string
  status: "Open" | "In Progress" | "Completed"
  priority: "High" | "Medium" | "Low"
  dueDate: string
  assignee: string
  progress: number
  subtasks: {
    id: string
    name: string
    completed: boolean
  }[]
}

export default function ReviewsAggregatorPage() {
  const router = useRouter()
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const [showTaskManager, setShowTaskManager] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      name: "Implement table reservation system",
      description: "Reduce wait times during peak hours",
      status: "In Progress",
      priority: "High",
      dueDate: "2024-08-15",
      assignee: "Tech Team",
      progress: 60,
      subtasks: [
        { id: "1a", name: "Research reservation platforms", completed: true },
        { id: "1b", name: "Setup booking system", completed: false },
        { id: "1c", name: "Train staff on new system", completed: false },
      ],
    },
    {
      id: "2",
      name: "Partner with nearby parking facility",
      description: "Address parking concerns mentioned in reviews",
      status: "Open",
      priority: "Medium",
      dueDate: "2024-09-01",
      assignee: "Manager",
      progress: 0,
      subtasks: [
        { id: "2a", name: "Contact nearby parking lots", completed: false },
        { id: "2b", name: "Negotiate partnership terms", completed: false },
      ],
    },
  ])

  const platformRatings = [
    {
      platform: "Google My Business",
      rating: 4.6,
      reviews: 89,
      change: "+0.2",
      changeType: "positive",
      logo: "🏢",
      color: "bg-blue-100 text-blue-800",
    },
    {
      platform: "Zomato",
      rating: 4.3,
      reviews: 45,
      change: "-0.1",
      changeType: "negative",
      logo: "🍽️",
      color: "bg-red-100 text-red-800",
    },
    {
      platform: "TripAdvisor",
      rating: 4.8,
      reviews: 22,
      change: "+0.3",
      changeType: "positive",
      logo: "✈️",
      color: "bg-green-100 text-green-800",
    },
    {
      platform: "Swiggy",
      rating: 4.1,
      reviews: 156,
      change: "0.0",
      changeType: "neutral",
      logo: "🛵",
      color: "bg-orange-100 text-orange-800",
    },
  ]

  const overallStats = {
    avgRating: 4.5,
    totalReviews: 312,
    responseRate: 78,
    avgResponseTime: "2.3h",
    monthlyGrowth: 12,
  }

  const aiInsights = {
    summary:
      "Overall customer sentiment is positive with consistent praise for food quality and ambiance. Key concerns include parking availability and wait times during peak hours. Addressing these issues could improve ratings by 0.2-0.3 points.",
    highlights: [
      "Food quality consistently praised across all platforms",
      "Service speed improved by 15% based on recent reviews",
      "Ambiance and decor receiving excellent feedback",
      "Vegetarian options highly appreciated by customers",
    ],
    redFlags: [
      "Parking issues mentioned in 23% of negative reviews",
      "Wait times during peak hours causing frustration",
      "Inconsistent spice levels in some dishes",
      "Limited payment options causing inconvenience",
    ],
    popularity: {
      peakDays: ["Friday", "Saturday", "Sunday"],
      peakHours: "7:00 PM - 9:00 PM",
      mostPraisedDishes: ["Butter Chicken", "Biryani", "Naan"],
      customerSegments: ["Families", "Young Professionals", "Food Enthusiasts"],
    },
    areasOfImprovement: [
      {
        area: "Service Speed",
        impact: "High",
        effort: "Medium",
        description: "Reduce wait times during peak hours",
      },
      {
        area: "Parking Solutions",
        impact: "Medium",
        effort: "High",
        description: "Partner with nearby parking facilities",
      },
      {
        area: "Payment Options",
        impact: "Low",
        effort: "Low",
        description: "Add more digital payment methods",
      },
    ],
  }

  const recentReviews = [
    {
      platform: "Google",
      rating: 5,
      text: "Amazing food and great service! The butter chicken was absolutely delicious.",
      author: "Sarah M.",
      date: "2 hours ago",
      responded: true,
    },
    {
      platform: "Zomato",
      rating: 4,
      text: "Good food but had to wait 45 minutes for our order. Service could be faster.",
      author: "Raj P.",
      date: "5 hours ago",
      responded: false,
    },
    {
      platform: "TripAdvisor",
      rating: 5,
      text: "Excellent authentic Indian cuisine. The ambiance is perfect for family dining.",
      author: "Michael K.",
      date: "1 day ago",
      responded: true,
    },
    {
      platform: "Google",
      rating: 2,
      text: "Food was okay but parking was a nightmare. Couldn't find a spot for 20 minutes.",
      author: "Lisa T.",
      date: "2 days ago",
      responded: false,
    },
  ]

  const developmentPlan = [
    {
      goal: "Increase average rating to 4.7",
      timeline: "3 months",
      actions: [
        "Implement table reservation system to reduce wait times",
        "Train staff on consistent spice level preparation",
        "Partner with nearby parking facility",
        "Introduce loyalty program for repeat customers",
      ],
      priority: "High",
    },
    {
      goal: "Achieve 90% review response rate",
      timeline: "1 month",
      actions: [
        "Set up automated review monitoring alerts",
        "Create response templates for common feedback",
        "Assign dedicated staff for review management",
        "Implement daily review check routine",
      ],
      priority: "Medium",
    },
    {
      goal: "Increase review frequency by 25%",
      timeline: "2 months",
      actions: [
        "Add QR codes on tables for easy review access",
        "Offer small incentives for honest reviews",
        "Follow up with customers via WhatsApp",
        "Create social media campaigns encouraging reviews",
      ],
      priority: "Medium",
    },
  ]

  const handleGeneratePlan = () => {
    setIsGeneratingPlan(true)
    setTimeout(() => {
      setIsGeneratingPlan(false)
    }, 3000)
  }

  const handleConvertToTasks = () => {
    setShowTaskManager(true)
  }

  const getChangeIcon = (changeType: string) => {
    if (changeType === "positive") return <ArrowUp className="w-3 h-3 text-green-600" />
    if (changeType === "negative") return <ArrowDown className="w-3 h-3 text-red-600" />
    return <div className="w-3 h-3" />
  }

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.map((subtask) => {
            if (subtask.id === subtaskId) {
              return { ...subtask, completed: !subtask.completed }
            }
            return subtask
          })
          const completedCount = updatedSubtasks.filter((s) => s.completed).length
          const progress = (completedCount / updatedSubtasks.length) * 100
          return { ...task, subtasks: updatedSubtasks, progress }
        }
        return task
      }),
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-semibold">TableSalt</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Button variant="ghost" className="text-gray-500" onClick={() => router.push("/profile")}>
                <Users className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button variant="ghost" className="text-gray-500">
                <TrendingUp className="w-4 h-4 mr-2" />
                Marketing
              </Button>
              <Button variant="ghost" className="text-gray-500">
                <Users className="w-4 h-4 mr-2" />
                Customers
              </Button>
              <Button variant="ghost" className="text-gray-500">
                <Globe className="w-4 h-4 mr-2" />
                Integrations
              </Button>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">Reviews Aggregator</h1>
              <p className="text-gray-600 mt-2">Monitor and manage reviews from all platforms</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filter Reviews
              </Button>
              <Button variant="outline" className="flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button className="flex items-center bg-purple-600 hover:bg-purple-700">
                <Zap className="w-4 h-4 mr-2" />
                Generate AI Summary
              </Button>
            </div>
          </div>
        </div>

        {/* Overall Stats - Smaller Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <span className="text-2xl font-bold text-purple-900">{overallStats.avgRating}</span>
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                </div>
                <p className="text-sm font-medium text-purple-600">Overall Rating</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{overallStats.totalReviews}</p>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{overallStats.responseRate}%</p>
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{overallStats.avgResponseTime}</p>
                <p className="text-sm font-medium text-gray-600">Avg Response</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <p className="text-2xl font-bold text-gray-900">+{overallStats.monthlyGrowth}%</p>
                  <ArrowUp className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Platform Ratings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Platform Ratings
                </CardTitle>
                <CardDescription>Average ratings across all connected platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformRatings.map((platform, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl">{platform.logo}</span>
                        <div>
                          <h4 className="font-medium text-gray-900">{platform.platform}</h4>
                          <p className="text-sm text-gray-500">{platform.reviews} reviews</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-lg">{platform.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getChangeIcon(platform.changeType)}
                            <span
                              className={`text-sm ${
                                platform.changeType === "positive"
                                  ? "text-green-600"
                                  : platform.changeType === "negative"
                                    ? "text-red-600"
                                    : "text-gray-500"
                              }`}
                            >
                              {platform.change}
                            </span>
                          </div>
                        </div>
                        <Badge className={platform.color}>
                          {platform.changeType === "positive"
                            ? "Improving"
                            : platform.changeType === "negative"
                              ? "Declining"
                              : "Stable"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Insights - Mobile Responsive */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  AI Insights
                </CardTitle>
                <CardDescription>Intelligent analysis of your reviews and customer feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="summary" className="w-full">
                  <div className="overflow-x-auto">
                    <TabsList className="grid w-full grid-cols-5 min-w-[500px] md:min-w-0">
                      <TabsTrigger value="summary" className="text-xs md:text-sm">
                        Summary
                      </TabsTrigger>
                      <TabsTrigger value="highlights" className="text-xs md:text-sm">
                        Highlights
                      </TabsTrigger>
                      <TabsTrigger value="redflags" className="text-xs md:text-sm">
                        Red Flags
                      </TabsTrigger>
                      <TabsTrigger value="popularity" className="text-xs md:text-sm">
                        Popularity
                      </TabsTrigger>
                      <TabsTrigger value="improvements" className="text-xs md:text-sm">
                        Improvements
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="summary" className="space-y-4 mt-6">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2">AI Review Summary</h4>
                      <p className="text-sm text-purple-800">{aiInsights.summary}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="highlights" className="space-y-4 mt-6">
                    <div className="space-y-3">
                      {aiInsights.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-green-800">{highlight}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="redflags" className="space-y-4 mt-6">
                    <div className="space-y-3">
                      {aiInsights.redFlags.map((flag, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-red-800">{flag}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="popularity" className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Peak Days</h4>
                        <div className="flex flex-wrap gap-1">
                          {aiInsights.popularity.peakDays.map((day, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {day}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-2">Peak Hours</h4>
                        <p className="text-sm text-purple-800">{aiInsights.popularity.peakHours}</p>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <h4 className="font-medium text-orange-900 mb-2">Most Praised Dishes</h4>
                        <div className="flex flex-wrap gap-1">
                          {aiInsights.popularity.mostPraisedDishes.map((dish, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {dish}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Customer Segments</h4>
                        <div className="flex flex-wrap gap-1">
                          {aiInsights.popularity.customerSegments.map((segment, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {segment}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="improvements" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      {aiInsights.areasOfImprovement.map((area, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                            <h4 className="font-medium text-gray-900">{area.area}</h4>
                            <div className="flex space-x-2">
                              <Badge
                                variant={
                                  area.impact === "High"
                                    ? "destructive"
                                    : area.impact === "Medium"
                                      ? "default"
                                      : "secondary"
                                }
                              >
                                {area.impact} Impact
                              </Badge>
                              <Badge variant="outline">{area.effort} Effort</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{area.description}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Development Plan with Task Management */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      AI Development Plan
                    </CardTitle>
                    <CardDescription>Strategic plan to improve ratings and review frequency</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={handleConvertToTasks}
                      variant="outline"
                      className="bg-green-50 hover:bg-green-100 text-green-700"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Convert to Tasks
                    </Button>
                    <Button
                      onClick={handleGeneratePlan}
                      disabled={isGeneratingPlan}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {isGeneratingPlan ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Regenerate Plan
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {developmentPlan.map((plan, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                        <h4 className="font-semibold text-gray-900">{plan.goal}</h4>
                        <div className="flex space-x-2">
                          <Badge variant={plan.priority === "High" ? "destructive" : "default"}>
                            {plan.priority} Priority
                          </Badge>
                          <Badge variant="outline">{plan.timeline}</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {plan.actions.map((action, actionIndex) => (
                          <div key={actionIndex} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm text-gray-600">{action}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Task Manager Dialog */}
            <Dialog open={showTaskManager} onOpenChange={setShowTaskManager}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Task Management
                  </DialogTitle>
                  <DialogDescription>Track progress on tasks converted from your development plan</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {tasks.map((task) => (
                    <div key={task.id} className="p-4 border rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{task.name}</h4>
                          <p className="text-sm text-gray-600">{task.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant={task.priority === "High" ? "destructive" : "default"}>{task.priority}</Badge>
                          <Badge variant="outline">{task.status}</Badge>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Progress</span>
                          <span className="text-sm text-gray-500">{Math.round(task.progress)}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-900">Subtasks:</h5>
                        {task.subtasks.map((subtask) => (
                          <div key={subtask.id} className="flex items-center space-x-2">
                            <Checkbox
                              checked={subtask.completed}
                              onCheckedChange={() => toggleSubtask(task.id, subtask.id)}
                            />
                            <span
                              className={`text-sm ${
                                subtask.completed ? "line-through text-gray-500" : "text-gray-700"
                              }`}
                            >
                              {subtask.name}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t">
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">Assignee:</span> {task.assignee} |{" "}
                          <span className="font-medium">Due:</span> {task.dueDate}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Task
                  </Button>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowTaskManager(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Recent Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentReviews.map((review, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{review.platform}</span>
                      </div>
                      <Badge variant={review.responded ? "default" : "secondary"}>
                        {review.responded ? "Responded" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2 line-clamp-2">{review.text}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{review.author}</span>
                      <span>{review.date}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  View All Reviews
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Respond to Reviews
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics Dashboard
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/profile")}>
                  <Users className="w-4 h-4 mr-2" />
                  Back to Profile
                </Button>
              </CardContent>
            </Card>

            {/* Response Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Response Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full text-left justify-start text-xs">
                  Thank you for positive feedback
                </Button>
                <Button variant="outline" size="sm" className="w-full text-left justify-start text-xs">
                  Address service concerns
                </Button>
                <Button variant="outline" size="sm" className="w-full text-left justify-start text-xs">
                  Food quality response
                </Button>
                <Button variant="outline" size="sm" className="w-full text-left justify-start text-xs">
                  Parking/location issues
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
