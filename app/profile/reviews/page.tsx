"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import {
  Star,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  Search,
  Download,
  Zap,
  Target,
  BarChart3,
  ThumbsUp,
  Reply,
  ExternalLink,
  RefreshCw,
  Calendar,
} from "lucide-react"

interface Review {
  id: string
  customer_name: string
  rating: number
  title: string
  content: string
  created_at: string
  platform: string
  is_published: boolean
  response?: string
  sentiment?: "positive" | "negative" | "neutral"
}

interface ReviewAnalytics {
  totalReviews: number
  averageRating: number
  ratingDistribution: { [key: number]: number }
  sentimentBreakdown: { positive: number; negative: number; neutral: number }
  responseRate: number
  platformBreakdown: { [key: string]: number }
  monthlyTrend: { month: string; reviews: number; rating: number }[]
}

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [reviews, setReviews] = useState<Review[]>([])
  const [analytics, setAnalytics] = useState<ReviewAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRating, setFilterRating] = useState<string>("all")
  const [filterPlatform, setFilterPlatform] = useState<string>("all")
  const [autoResponseEnabled, setAutoResponseEnabled] = useState(false)
  const [responseTemplate, setResponseTemplate] = useState("")

  const restaurantId = "550e8400-e29b-41d4-a716-446655440000"

  useEffect(() => {
    loadReviewsData()
  }, [])

  const loadReviewsData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reviews?restaurantId=${restaurantId}`)
      const reviewsData = await response.json()

      setReviews(reviewsData)
      generateAnalytics(reviewsData)
    } catch (error) {
      console.error("Error loading reviews:", error)
      toast({
        title: "Error",
        description: "Failed to load reviews data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateAnalytics = (reviewsData: Review[]) => {
    const totalReviews = reviewsData.length
    const averageRating =
      totalReviews > 0 ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0

    const ratingDistribution = reviewsData.reduce(
      (acc, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1
        return acc
      },
      {} as { [key: number]: number },
    )

    const sentimentBreakdown = reviewsData.reduce(
      (acc, review) => {
        const sentiment = review.rating >= 4 ? "positive" : review.rating <= 2 ? "negative" : "neutral"
        acc[sentiment]++
        return acc
      },
      { positive: 0, negative: 0, neutral: 0 },
    )

    const responseRate =
      totalReviews > 0 ? (reviewsData.filter((review) => review.response).length / totalReviews) * 100 : 0

    const platformBreakdown = reviewsData.reduce(
      (acc, review) => {
        const platform = review.platform || "Direct"
        acc[platform] = (acc[platform] || 0) + 1
        return acc
      },
      {} as { [key: string]: number },
    )

    // Generate monthly trend (mock data for demo)
    const monthlyTrend = [
      { month: "Jan", reviews: 12, rating: 4.2 },
      { month: "Feb", reviews: 18, rating: 4.1 },
      { month: "Mar", reviews: 15, rating: 4.3 },
      { month: "Apr", reviews: 22, rating: 4.4 },
      { month: "May", reviews: 19, rating: 4.2 },
      { month: "Jun", reviews: totalReviews, rating: Number(averageRating.toFixed(1)) },
    ]

    setAnalytics({
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
      ratingDistribution,
      sentimentBreakdown,
      responseRate: Number(responseRate.toFixed(1)),
      platformBreakdown,
      monthlyTrend,
    })
  }

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRating = filterRating === "all" || review.rating.toString() === filterRating
    const matchesPlatform = filterPlatform === "all" || (review.platform || "Direct") === filterPlatform

    return matchesSearch && matchesRating && matchesPlatform
  })

  const handleReplyToReview = async (reviewId: string, response: string) => {
    try {
      // Mock API call - would integrate with actual review platforms
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setReviews((prev) => prev.map((review) => (review.id === reviewId ? { ...review, response } : review)))

      toast({
        title: "Success",
        description: "Response posted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post response",
        variant: "destructive",
      })
    }
  }

  const aiInsights = [
    {
      type: "highlight",
      title: "Most Praised Aspect",
      content: "Food quality mentioned in 78% of positive reviews",
      icon: ThumbsUp,
      color: "text-green-600",
    },
    {
      type: "concern",
      title: "Common Complaint",
      content: "Service speed mentioned in 23% of negative reviews",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      type: "opportunity",
      title: "Growth Opportunity",
      content: "Ambiance improvements could boost ratings by 0.3 stars",
      icon: TrendingUp,
      color: "text-blue-600",
    },
  ]

  const improvementPlan = [
    {
      priority: "High",
      task: "Implement faster order processing system",
      impact: "Reduce service complaints by 40%",
      timeline: "2 weeks",
      status: "pending",
    },
    {
      priority: "Medium",
      task: "Train staff on customer service excellence",
      impact: "Improve service ratings by 0.5 stars",
      timeline: "1 month",
      status: "in-progress",
    },
    {
      priority: "Low",
      task: "Update restaurant ambiance and lighting",
      impact: "Enhance overall experience ratings",
      timeline: "3 months",
      status: "pending",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-3 py-4 pb-20">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-3 py-4 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Reviews Management</h1>
            <p className="text-sm text-gray-600">Monitor and respond to customer feedback</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadReviewsData}
            className="flex items-center space-x-2 bg-transparent"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Key Metrics */}
            {analytics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Total Reviews</p>
                        <p className="text-lg font-semibold">{analytics.totalReviews}</p>
                      </div>
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Average Rating</p>
                        <div className="flex items-center space-x-1">
                          <p className="text-lg font-semibold">{analytics.averageRating}</p>
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        </div>
                      </div>
                      <Star className="w-5 h-5 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Response Rate</p>
                        <p className="text-lg font-semibold">{analytics.responseRate}%</p>
                      </div>
                      <Reply className="w-5 h-5 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Positive Reviews</p>
                        <p className="text-lg font-semibold">{analytics.sentimentBreakdown.positive}</p>
                      </div>
                      <ThumbsUp className="w-5 h-5 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Platform Connections */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Platform Connections</CardTitle>
                <CardDescription>Connect your review platforms for unified management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Google My Business", status: "connected", reviews: 45 },
                  { name: "Yelp", status: "connected", reviews: 23 },
                  { name: "TripAdvisor", status: "disconnected", reviews: 0 },
                  { name: "Zomato", status: "connected", reviews: 67 },
                ].map((platform, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          platform.status === "connected" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium">{platform.name}</p>
                        <p className="text-xs text-gray-600">
                          {platform.status === "connected" ? `${platform.reviews} reviews synced` : "Not connected"}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant={platform.status === "connected" ? "outline" : "default"}>
                      {platform.status === "connected" ? "Manage" : "Connect"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Filters and Search */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search reviews..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterRating} onValueChange={setFilterRating}>
                    <SelectTrigger className="w-full md:w-32">
                      <SelectValue placeholder="Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="1">1 Star</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                    <SelectTrigger className="w-full md:w-32">
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="Google">Google</SelectItem>
                      <SelectItem value="Yelp">Yelp</SelectItem>
                      <SelectItem value="Zomato">Zomato</SelectItem>
                      <SelectItem value="Direct">Direct</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {filteredReviews.slice(0, 10).map((review) => (
                    <div key={review.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">{review.customer_name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{review.customer_name}</p>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(review.created_at).toLocaleDateString()}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {review.platform || "Direct"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {review.title && <h4 className="font-medium text-sm mb-2">{review.title}</h4>}

                      <p className="text-sm text-gray-700 mb-3">{review.content}</p>

                      {review.response ? (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-xs font-medium text-blue-900 mb-1">Your Response:</p>
                          <p className="text-sm text-blue-800">{review.response}</p>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const response = prompt("Enter your response:")
                              if (response) {
                                handleReplyToReview(review.id, response)
                              }
                            }}
                          >
                            <Reply className="w-4 h-4 mr-1" />
                            Reply
                          </Button>
                          <Button size="sm" variant="ghost">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View on Platform
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            {/* AI Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-yellow-600" />
                  AI-Powered Review Analysis
                </CardTitle>
                <CardDescription>Smart insights from your customer feedback</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiInsights.map((insight, index) => {
                  const Icon = insight.icon
                  return (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <Icon className={`w-5 h-5 mt-0.5 ${insight.color}`} />
                      <div>
                        <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                        <p className="text-sm text-gray-700">{insight.content}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Improvement Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">AI Improvement Plan</CardTitle>
                <CardDescription>Actionable recommendations based on review analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {improvementPlan.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            item.priority === "High"
                              ? "text-red-700 border-red-300"
                              : item.priority === "Medium"
                                ? "text-yellow-700 border-yellow-300"
                                : "text-green-700 border-green-300"
                          }`}
                        >
                          {item.priority} Priority
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            item.status === "in-progress"
                              ? "text-blue-700 border-blue-300"
                              : "text-gray-700 border-gray-300"
                          }`}
                        >
                          {item.status === "in-progress" ? "In Progress" : "Pending"}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-sm mb-1">{item.task}</h4>
                      <p className="text-xs text-gray-600 mb-1">{item.impact}</p>
                      <p className="text-xs text-gray-500">Timeline: {item.timeline}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      {item.status === "in-progress" ? "View Progress" : "Start Task"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Auto-Response Settings</CardTitle>
                <CardDescription>Automatically respond to reviews with AI-generated responses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-response" className="text-sm font-medium">
                      Enable Auto-Response
                    </Label>
                    <p className="text-xs text-gray-600">Automatically respond to positive reviews</p>
                  </div>
                  <Switch id="auto-response" checked={autoResponseEnabled} onCheckedChange={setAutoResponseEnabled} />
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-sm font-medium">Response Templates</Label>

                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Positive Reviews (4-5 stars)</span>
                        <Switch defaultChecked />
                      </div>
                      <Textarea
                        placeholder="Thank you for your wonderful review! We're thrilled that you enjoyed your experience..."
                        className="text-sm"
                        rows={3}
                      />
                    </div>

                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Neutral Reviews (3 stars)</span>
                        <Switch />
                      </div>
                      <Textarea
                        placeholder="Thank you for your feedback. We appreciate you taking the time to review us..."
                        className="text-sm"
                        rows={3}
                      />
                    </div>

                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Negative Reviews (1-2 stars)</span>
                        <Switch />
                      </div>
                      <Textarea
                        placeholder="We sincerely apologize for your experience. We'd love to make this right..."
                        className="text-sm"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Preview Responses</Button>
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            {analytics && (
              <>
                {/* Rating Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Rating Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-3">
                          <span className="text-sm w-8">{rating}★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-500 h-2 rounded-full"
                              style={{
                                width: `${((analytics.ratingDistribution[rating] || 0) / analytics.totalReviews) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8">{analytics.ratingDistribution[rating] || 0}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Platform Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Reviews by Platform</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(analytics.platformBreakdown).map(([platform, count]) => (
                        <div key={platform} className="flex items-center justify-between">
                          <span className="text-sm">{platform}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${(count / analytics.totalReviews) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-8">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Export Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Export Reports</CardTitle>
                    <CardDescription>Download detailed reports for analysis</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="flex items-center justify-center space-x-2 bg-transparent">
                        <Download className="w-4 h-4" />
                        <span>Export All Reviews (CSV)</span>
                      </Button>
                      <Button variant="outline" className="flex items-center justify-center space-x-2 bg-transparent">
                        <BarChart3 className="w-4 h-4" />
                        <span>Analytics Report (PDF)</span>
                      </Button>
                      <Button variant="outline" className="flex items-center justify-center space-x-2 bg-transparent">
                        <Calendar className="w-4 h-4" />
                        <span>Monthly Summary</span>
                      </Button>
                      <Button variant="outline" className="flex items-center justify-center space-x-2 bg-transparent">
                        <Target className="w-4 h-4" />
                        <span>Action Items Report</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
