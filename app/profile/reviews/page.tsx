"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import {
  Users,
  TrendingUp,
  Globe,
  Star,
  MessageSquare,
  Lightbulb,
  ArrowUp,
  Eye,
  Zap,
  Filter,
  Download,
  ArrowRight,
  Link,
  Settings,
  Smartphone,
  AlertTriangle,
  Target,
  Bell,
  MessageCircle,
  ThumbsUp,
  Save,
  TestTube,
  RefreshCw,
  Plus,
} from "lucide-react"

interface ReviewData {
  id: string
  platform: string
  author: string
  rating: number
  text: string
  date: string
  responded: boolean
  response?: string
  sentiment: "positive" | "negative" | "neutral"
  isNew: boolean
}

interface ImprovementPlan {
  id: string
  title: string
  description: string
  createdAt: string
  status: "active" | "completed" | "archived"
  saved: boolean
  recommendations: Array<{
    id: string
    category: string
    description: string
    impact: "High" | "Medium" | "Low"
    effort: "High" | "Medium" | "Low"
    timeframe: string
    details: string[]
  }>
  tasks?: Array<{
    id: string
    title: string
    description: string
    type: "internal" | "external"
    status: "pending" | "in-progress" | "completed"
    progress: number
    estimatedDays: number
    startDate?: string
    completedDate?: string
    completed: boolean
  }>
  metrics?: {
    startRating: number
    currentRating: number
    startRecommendationScore: number
    currentRecommendationScore: number
    tasksCompleted: number
    totalTasks: number
  }
}

export default function ReviewsAggregatorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const isOnboarding = searchParams.get("onboarding") === "true"
  const isNewUser = searchParams.get("new") === "true" || isOnboarding

  // State management
  const [autoResponseEnabled, setAutoResponseEnabled] = useState(false)
  const [autoResponseTime, setAutoResponseTime] = useState("2")
  const [responsePrompt, setResponsePrompt] = useState(
    "Respond professionally and warmly to customer reviews. Address specific points mentioned. Thank positive reviewers and acknowledge concerns in negative reviews with solutions. Always maintain our restaurant's friendly and welcoming tone.",
  )
  const [selectedTab, setSelectedTab] = useState("overview")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showAIFeatures, setShowAIFeatures] = useState(!isNewUser)
  const [hasAnalyzedData, setHasAnalyzedData] = useState(false)
  const [isImportingReviews, setIsImportingReviews] = useState(false)
  const [reviewData, setReviewData] = useState<ReviewData[]>([])
  const [improvementPlans, setImprovementPlans] = useState<ImprovementPlan[]>([])
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const [showPlanDialog, setShowPlanDialog] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<ImprovementPlan | null>(null)
  const [filterPlatform, setFilterPlatform] = useState("all")
  const [filterSentiment, setFilterSentiment] = useState("all")

  // Mock connected platforms
  const [connectedPlatforms, setConnectedPlatforms] = useState([
    {
      platform: "Google My Business",
      rating: 4.6,
      reviews: 89,
      change: "+0.2",
      changeType: "positive" as const,
      logo: "🏢",
      connected: showAIFeatures,
      responseRate: 85,
      avgResponseTime: "2.1h",
    },
    {
      platform: "Yelp",
      rating: 4.3,
      reviews: 45,
      change: "-0.1",
      changeType: "negative" as const,
      logo: "⭐",
      connected: false,
      responseRate: 0,
      avgResponseTime: "N/A",
    },
    {
      platform: "TripAdvisor",
      rating: 4.8,
      reviews: 22,
      change: "+0.3",
      changeType: "positive" as const,
      logo: "✈️",
      connected: false,
      responseRate: 0,
      avgResponseTime: "N/A",
    },
  ])

  // AI Analysis Results
  const [analysisResults] = useState({
    overallRating: 4.5,
    ratingChange: "+0.2",
    totalReviews: 156,
    sentimentBreakdown: {
      positive: 78,
      neutral: 15,
      negative: 7,
    },
    recommendationScore: 71,
    aiSummary:
      "Customers consistently praise the restaurant for exceptional food quality, warm service, and great ambiance. The main strengths include authentic flavors, attentive staff, and cozy atmosphere. Areas for improvement include service speed during peak hours and parking availability.",
    highlights: [
      { text: "Excellent food quality and authentic flavors", percentage: 87, sentiment: "positive" },
      { text: "Warm and attentive service", percentage: 82, sentiment: "positive" },
      { text: "Great ambiance for special occasions", percentage: 76, sentiment: "positive" },
      { text: "Good value for money", percentage: 71, sentiment: "positive" },
    ],
    redFlags: [
      { text: "Slow service during peak hours", percentage: 34, severity: "medium" },
      { text: "Limited parking availability", percentage: 28, severity: "low" },
      { text: "Noise level too high for conversation", percentage: 19, severity: "low" },
    ],
    useCases: [
      { text: "Date nights and romantic dinners", percentage: 42 },
      { text: "Family celebrations and gatherings", percentage: 38 },
      { text: "Business meetings and lunches", percentage: 24 },
      { text: "Casual dining with friends", percentage: 67 },
    ],
  })

  // Mock recent reviews
  const mockRecentReviews: ReviewData[] = [
    {
      id: "1",
      platform: "Google",
      author: "Sarah M.",
      rating: 5,
      text: "Amazing food and great service! The pasta was perfectly cooked and the staff was very attentive. Will definitely come back!",
      date: "2 hours ago",
      responded: false,
      sentiment: "positive",
      isNew: true,
    },
    {
      id: "2",
      platform: "Yelp",
      author: "Mike R.",
      rating: 2,
      text: "Food was okay but service was quite slow. Waited 45 minutes for our main course and the server seemed overwhelmed.",
      date: "1 day ago",
      responded: true,
      response:
        "Thank you for your feedback, Mike. We sincerely apologize for the slow service. We're implementing new systems to improve our service speed. Please give us another chance!",
      sentiment: "negative",
      isNew: false,
    },
    {
      id: "3",
      platform: "TripAdvisor",
      author: "Jennifer L.",
      rating: 4,
      text: "Great atmosphere for a date night. The wine selection is excellent! Only minor complaint is the noise level during busy hours.",
      date: "3 days ago",
      responded: false,
      sentiment: "positive",
      isNew: false,
    },
  ]

  useEffect(() => {
    setReviewData(mockRecentReviews)
  }, [])

  // Handler functions
  const handleContinueOnboarding = () => {
    router.push("/dashboard?onboarding=complete")
  }

  const handleConnectPlatform = (platform: string) => {
    setConnectedPlatforms((prev) =>
      prev.map((p) => (p.platform.toLowerCase().includes(platform.toLowerCase()) ? { ...p, connected: true } : p)),
    )
    toast({
      title: "Platform Connected",
      description: `Successfully connected to ${platform}`,
    })
    setTimeout(() => {
      setShowAIFeatures(true)
    }, 1000)
  }

  const handleRunAIAnalysis = async () => {
    setIsAnalyzing(true)
    setIsImportingReviews(true)

    setTimeout(() => {
      setIsImportingReviews(false)
      toast({
        title: "Reviews Imported",
        description: "Successfully imported 156 reviews from connected platforms",
      })

      setTimeout(() => {
        setIsAnalyzing(false)
        setHasAnalyzedData(true)
        toast({
          title: "AI Analysis Complete",
          description: "Generated comprehensive insights from your reviews",
        })
      }, 2000)
    }, 3000)
  }

  const handleGenerateImprovementPlan = async () => {
    setIsGeneratingPlan(true)

    setTimeout(() => {
      const newPlan: ImprovementPlan = {
        id: `plan-${Date.now()}`,
        title: "Rating Improvement Plan - Q1 2024",
        description: "Comprehensive plan to boost rating from 4.5 to 4.8+ based on AI analysis",
        createdAt: new Date().toISOString(),
        status: "active",
        saved: false,
        recommendations: [
          {
            id: "rec-1",
            category: "Service Speed",
            description: "Reduce wait times during peak hours",
            impact: "High",
            effort: "Medium",
            timeframe: "2-4 weeks",
            details: [
              "Implement table management system",
              "Optimize staff scheduling for busy periods",
              "Train staff on efficient order processing",
              "Consider pre-order options for regular customers",
            ],
          },
          {
            id: "rec-2",
            category: "Parking Solutions",
            description: "Address parking availability concerns",
            impact: "Medium",
            effort: "High",
            timeframe: "4-8 weeks",
            details: [
              "Partner with nearby parking facilities",
              "Negotiate discounted rates for customers",
              "Add valet parking service during peak hours",
              "Create parking information on website",
            ],
          },
        ],
        metrics: {
          startRating: 4.5,
          currentRating: 4.5,
          startRecommendationScore: 71,
          currentRecommendationScore: 71,
          tasksCompleted: 0,
          totalTasks: 0,
        },
      }

      setImprovementPlans((prev) => [newPlan, ...prev])
      setSelectedPlan(newPlan)
      setIsGeneratingPlan(false)
      setShowPlanDialog(true)

      toast({
        title: "Improvement Plan Generated",
        description: "AI has created a personalized improvement plan for your restaurant",
      })
    }, 3000)
  }

  const handleSavePlan = () => {
    if (selectedPlan) {
      const updatedPlan = { ...selectedPlan, saved: true }
      setImprovementPlans((prev) => prev.map((plan) => (plan.id === selectedPlan.id ? updatedPlan : plan)))
      setSelectedPlan(updatedPlan)

      toast({
        title: "Plan Saved",
        description: "Improvement plan has been saved successfully",
      })
    }
  }

  const handleConvertToTasks = () => {
    if (selectedPlan && selectedPlan.saved) {
      const tasks = selectedPlan.recommendations.flatMap((rec) =>
        rec.details.map((detail, index) => ({
          id: `task-${rec.id}-${index}`,
          title: detail,
          description: `${rec.category}: ${detail}`,
          type: rec.category.includes("Partner") ? ("external" as const) : ("internal" as const),
          status: "pending" as const,
          progress: 0,
          estimatedDays: rec.timeframe.includes("2-4") ? 21 : 42,
          completed: false,
        })),
      )

      const updatedPlan = {
        ...selectedPlan,
        tasks,
        metrics: {
          ...selectedPlan.metrics!,
          totalTasks: tasks.length,
        },
      }

      setImprovementPlans((prev) => prev.map((plan) => (plan.id === selectedPlan.id ? updatedPlan : plan)))
      setSelectedPlan(updatedPlan)

      toast({
        title: "Tasks Created",
        description: `Created ${tasks.length} actionable tasks from improvement plan`,
      })
    }
  }

  const handleTaskToggle = (taskId: string, completed: boolean) => {
    if (selectedPlan && selectedPlan.tasks) {
      const updatedTasks = selectedPlan.tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            completed,
            status: completed ? ("completed" as const) : ("pending" as const),
            progress: completed ? 100 : 0,
            completedDate: completed ? new Date().toISOString() : undefined,
            startDate: !task.startDate && !completed ? new Date().toISOString() : task.startDate,
          }
        }
        return task
      })

      const completedCount = updatedTasks.filter((t) => t.completed).length
      const updatedPlan = {
        ...selectedPlan,
        tasks: updatedTasks,
        metrics: {
          ...selectedPlan.metrics!,
          tasksCompleted: completedCount,
        },
      }

      setImprovementPlans((prev) => prev.map((plan) => (plan.id === selectedPlan.id ? updatedPlan : plan)))
      setSelectedPlan(updatedPlan)
    }
  }

  const handleStartTask = (taskId: string) => {
    if (selectedPlan && selectedPlan.tasks) {
      const updatedTasks = selectedPlan.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "in-progress" as const,
              startDate: new Date().toISOString(),
            }
          : task,
      )

      const updatedPlan = { ...selectedPlan, tasks: updatedTasks }
      setImprovementPlans((prev) => prev.map((plan) => (plan.id === selectedPlan.id ? updatedPlan : plan)))
      setSelectedPlan(updatedPlan)
    }
  }

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your review data is being prepared for download",
    })

    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Review data has been downloaded successfully",
      })
    }, 2000)
  }

  const handleFilterReviews = () => {
    let filtered = mockRecentReviews

    if (filterPlatform !== "all") {
      filtered = filtered.filter((review) => review.platform.toLowerCase() === filterPlatform)
    }

    if (filterSentiment !== "all") {
      filtered = filtered.filter((review) => review.sentiment === filterSentiment)
    }

    setReviewData(filtered)

    toast({
      title: "Filters Applied",
      description: `Showing ${filtered.length} reviews based on your filters`,
    })
  }

  const handleViewAllReviews = () => {
    router.push("/profile/reviews/all")
  }

  const handleRespondToReview = (reviewId: string) => {
    setReviewData((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? { ...review, responded: true, response: "Thank you for your feedback! We appreciate your review." }
          : review,
      ),
    )

    toast({
      title: "Response Sent",
      description: "Your response has been posted successfully",
    })
  }

  // Empty state for new users
  const EmptyReviewsState = () => (
    <div className="text-center py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Review Platforms</h3>
        <p className="text-gray-600 mb-6 text-sm">
          Connect your restaurant to review platforms to start monitoring and managing customer feedback with AI-powered
          insights.
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => handleConnectPlatform("google")}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Globe className="w-4 h-4 mr-2" />
            Connect Google My Business
          </Button>

          <Button
            onClick={() => handleConnectPlatform("yelp")}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Star className="w-4 h-4 mr-2" />
            Connect Yelp
          </Button>

          <Button
            onClick={() => handleConnectPlatform("tripadvisor")}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Connect TripAdvisor
          </Button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <h4 className="font-medium text-gray-900 text-sm">Pro Tip</h4>
              <p className="text-gray-600 text-xs mt-1">
                Start with Google My Business - it's the most important platform for local restaurants and provides the
                richest data for AI analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">TableSalt</span>
            </div>

            <nav className="hidden sm:flex space-x-8">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => router.push("/profile")}
              >
                <Users className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                <TrendingUp className="w-4 h-4 mr-2" />
                Marketing
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                <Users className="w-4 h-4 mr-2" />
                Customers
              </Button>
            </nav>

            <Button variant="ghost" size="sm" className="sm:hidden">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reviews Management</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                {!showAIFeatures
                  ? "Connect platforms to start monitoring reviews"
                  : "AI-powered review monitoring and management"}
              </p>
            </div>

            {showAIFeatures && (
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent text-xs sm:text-sm"
                    >
                      <Filter className="w-4 h-4 mr-1 sm:mr-2" />
                      Filter
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Filter Reviews</DialogTitle>
                      <DialogDescription>Filter reviews by platform and sentiment</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="platform">Platform</Label>
                        <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Platforms</SelectItem>
                            <SelectItem value="google">Google</SelectItem>
                            <SelectItem value="yelp">Yelp</SelectItem>
                            <SelectItem value="tripadvisor">TripAdvisor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sentiment">Sentiment</Label>
                        <Select value={filterSentiment} onValueChange={setFilterSentiment}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sentiment" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Sentiments</SelectItem>
                            <SelectItem value="positive">Positive</SelectItem>
                            <SelectItem value="neutral">Neutral</SelectItem>
                            <SelectItem value="negative">Negative</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleFilterReviews} className="w-full bg-gray-900 hover:bg-gray-800">
                        Apply Filters
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportData}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent text-xs sm:text-sm"
                >
                  <Download className="w-4 h-4 mr-1 sm:mr-2" />
                  Export
                </Button>

                <Button
                  size="sm"
                  className="bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm"
                  onClick={handleRunAIAnalysis}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-1 sm:mr-2 animate-spin" />
                      <span className="hidden sm:inline">{isImportingReviews ? "Importing..." : "Analyzing..."}</span>
                      <span className="sm:hidden">{isImportingReviews ? "Import..." : "Analyze..."}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">AI Analysis</span>
                      <span className="sm:hidden">AI</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {!showAIFeatures ? (
          <div className="space-y-6">
            {/* Empty State */}
            <Card className="border-gray-200">
              <CardContent className="p-0">
                <EmptyReviewsState />
              </CardContent>
            </Card>

            {/* Platform Connection Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {connectedPlatforms.map((platform, index) => (
                <Card key={index} className="border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{platform.logo}</span>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-sm sm:text-base text-gray-900 truncate">
                            {platform.platform}
                          </CardTitle>
                          <CardDescription className="text-xs sm:text-sm text-gray-600">
                            {platform.connected ? "Connected" : "Not connected"}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={platform.connected ? "default" : "secondary"} className="text-xs">
                        {platform.connected ? "Active" : "Connect"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {platform.connected ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-gray-900">{platform.rating}</span>
                          </div>
                          <span className="text-sm text-gray-600">{platform.reviews} reviews</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                        >
                          <Eye className="w-3 h-3 mr-2" />
                          View Reviews
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full text-xs bg-gray-900 hover:bg-gray-800 text-white"
                        onClick={() => handleConnectPlatform(platform.platform.toLowerCase())}
                      >
                        <Link className="w-3 h-3 mr-2" />
                        Connect Now
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Setup Guide */}
            <Card className="bg-gray-50 border-gray-200">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center text-gray-900">
                  <Smartphone className="w-5 h-5 mr-2 text-gray-600" />
                  Quick Setup Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      1
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm">Connect Google My Business</h4>
                      <p className="text-gray-600 text-xs sm:text-sm mt-1">
                        Most important for local search visibility and AI insights
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      2
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-600 text-sm">Add Yelp & TripAdvisor</h4>
                      <p className="text-gray-500 text-xs sm:text-sm mt-1">Expand your review monitoring coverage</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      3
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-600 text-sm">Enable AI features</h4>
                      <p className="text-gray-500 text-xs sm:text-sm mt-1">Set up automated responses and insights</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Onboarding Continue */}
            {isOnboarding && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div>
                      <h3 className="font-semibold text-gray-900">Setup Complete!</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        You can connect review platforms anytime. Ready to explore your dashboard?
                      </p>
                    </div>
                    <Button onClick={handleContinueOnboarding} className="bg-gray-900 hover:bg-gray-800 text-white">
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          // Full AI-powered dashboard for connected users
          <div className="space-y-6 sm:space-y-8">
            {/* AI Review Insights */}
            {hasAnalyzedData && (
              <Card className="border-gray-200">
                <CardHeader>
                  <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div>
                      <CardTitle className="text-base sm:text-lg flex items-center text-gray-900">
                        <Zap className="w-5 h-5 mr-2" />
                        AI Review Insights
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        Comprehensive analysis of all your reviews across platforms
                      </CardDescription>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800 text-xs">Last updated: 2 hours ago</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-6">
                      <TabsTrigger value="overview" className="text-xs sm:text-sm">
                        Overview
                      </TabsTrigger>
                      <TabsTrigger value="highlights" className="text-xs sm:text-sm">
                        Highlights
                      </TabsTrigger>
                      <TabsTrigger value="redflags" className="text-xs sm:text-sm">
                        Red Flags
                      </TabsTrigger>
                      <TabsTrigger value="usecases" className="text-xs sm:text-sm">
                        Use Cases
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                      {/* Summary Cards */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <Card className="bg-white border-gray-200">
                          <CardContent className="p-3 sm:p-4 text-center">
                            <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-2">
                              <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                                {analysisResults.overallRating}
                              </span>
                              <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-400 text-yellow-400" />
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600">Overall Rating</p>
                            <div className="flex items-center justify-center space-x-1 mt-1">
                              <ArrowUp className="w-3 h-3 text-green-600" />
                              <span className="text-xs text-green-600">{analysisResults.ratingChange} (30 days)</span>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-white border-gray-200">
                          <CardContent className="p-3 sm:p-4 text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">
                              {analysisResults.totalReviews}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600">Total Reviews</p>
                            <p className="text-xs text-gray-500 mt-1">Across all platforms</p>
                          </CardContent>
                        </Card>

                        <Card className="bg-white border-gray-200">
                          <CardContent className="p-3 sm:p-4 text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                              {analysisResults.recommendationScore}%
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600">Recommendation Score</p>
                            <p className="text-xs text-gray-500 mt-1">Positive - Negative</p>
                          </CardContent>
                        </Card>

                        <Card className="bg-white border-gray-200">
                          <CardContent className="p-3 sm:p-4 text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">
                              {Math.round(
                                connectedPlatforms
                                  .filter((p) => p.connected)
                                  .reduce((acc, p) => acc + p.responseRate, 0) /
                                  connectedPlatforms.filter((p) => p.connected).length,
                              )}
                              %
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600">Response Rate</p>
                            <p className="text-xs text-gray-500 mt-1">Avg: 2.1h response time</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* AI Summary */}
                      <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">AI Summary</h4>
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{analysisResults.aiSummary}</p>
                      </div>

                      {/* Sentiment Breakdown */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">Sentiment Breakdown</h4>
                        <div className="grid grid-cols-3 gap-3 sm:gap-4">
                          <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                            <div className="text-xl sm:text-2xl font-bold text-green-600">
                              {analysisResults.sentimentBreakdown.positive}%
                            </div>
                            <p className="text-xs sm:text-sm text-green-700">Positive</p>
                          </div>
                          <div className="text-center p-3 sm:p-4 bg-yellow-50 rounded-lg">
                            <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                              {analysisResults.sentimentBreakdown.neutral}%
                            </div>
                            <p className="text-xs sm:text-sm text-yellow-700">Neutral</p>
                          </div>
                          <div className="text-center p-3 sm:p-4 bg-red-50 rounded-lg">
                            <div className="text-xl sm:text-2xl font-bold text-red-600">
                              {analysisResults.sentimentBreakdown.negative}%
                            </div>
                            <p className="text-xs sm:text-sm text-red-700">Negative</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="highlights">
                      <div className="max-h-96 overflow-y-auto">
                        <div className="space-y-3 pr-4">
                          {analysisResults.highlights.map((highlight, index) => (
                            <div
                              key={index}
                              className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-3 sm:p-4 border border-gray-200 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <ThumbsUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <span className="text-sm text-gray-900">{highlight.text}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-600 h-2 rounded-full"
                                    style={{ width: `${highlight.percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-semibold text-green-600 min-w-0">
                                  {highlight.percentage}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="redflags">
                      <div className="max-h-96 overflow-y-auto">
                        <div className="space-y-3 pr-4">
                          {analysisResults.redFlags.map((flag, index) => (
                            <div
                              key={index}
                              className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-3 sm:p-4 border border-gray-200 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <AlertTriangle
                                  className={`w-5 h-5 flex-shrink-0 ${
                                    flag.severity === "high"
                                      ? "text-red-600"
                                      : flag.severity === "medium"
                                        ? "text-yellow-600"
                                        : "text-orange-600"
                                  }`}
                                />
                                <span className="text-sm text-gray-900">{flag.text}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  className={
                                    flag.severity === "high"
                                      ? "bg-red-100 text-red-800"
                                      : flag.severity === "medium"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-orange-100 text-orange-800"
                                  }
                                >
                                  {flag.severity}
                                </Badge>
                                <span className="text-sm font-semibold text-red-600 min-w-0">{flag.percentage}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="usecases">
                      <div className="max-h-96 overflow-y-auto">
                        <div className="space-y-3 pr-4">
                          <p className="text-sm text-gray-600 mb-4">
                            Based on customer reviews, here's how people use your restaurant:
                          </p>
                          {analysisResults.useCases.map((useCase, index) => (
                            <div
                              key={index}
                              className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-3 sm:p-4 border border-gray-200 rounded-lg"
                            >
                              <span className="text-sm text-gray-900">{useCase.text}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-gray-900 h-2 rounded-full"
                                    style={{ width: `${useCase.percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-semibold text-blue-600 min-w-0">
                                  {useCase.percentage}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* AI Improvement Plans */}
            {hasAnalyzedData && (
              <Card className="border-gray-200">
                <CardHeader>
                  <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div>
                      <CardTitle className="text-base sm:text-lg flex items-center text-gray-900">
                        <Target className="w-5 h-5 mr-2" />
                        AI Improvement Plans
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        Generate and manage improvement plans based on AI insights
                      </CardDescription>
                    </div>
                    <Button
                      onClick={handleGenerateImprovementPlan}
                      disabled={isGeneratingPlan}
                      className="bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm"
                    >
                      {isGeneratingPlan ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          <span className="hidden sm:inline">Generating...</span>
                          <span className="sm:hidden">Gen...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">Generate Plan</span>
                          <span className="sm:hidden">Generate</span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {improvementPlans.length === 0 ? (
                    <div className="text-center py-8">
                      <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm">No improvement plans yet</p>
                      <p className="text-gray-400 text-xs mt-1">Generate your first AI-powered improvement plan</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {improvementPlans.map((plan) => (
                        <div key={plan.id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-3">
                            <div className="min-w-0">
                              <h4 className="font-medium text-gray-900 text-sm sm:text-base">{plan.title}</h4>
                              <p className="text-xs sm:text-sm text-gray-600">{plan.description}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Created: {new Date(plan.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                className={
                                  plan.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : plan.status === "completed"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                }
                              >
                                {plan.status}
                              </Badge>
                              {plan.saved && <Badge className="bg-purple-100 text-purple-800 text-xs">Saved</Badge>}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedPlan(plan)
                                  setShowPlanDialog(true)
                                }}
                                className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                              >
                                <span className="hidden sm:inline">View Details</span>
                                <span className="sm:hidden">View</span>
                              </Button>
                            </div>
                          </div>

                          {plan.metrics && (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 pt-4 border-t border-gray-200">
                              <div className="text-center">
                                <p className="text-xs sm:text-sm text-gray-600">Rating Progress</p>
                                <p className="font-semibold text-blue-600 text-sm">
                                  {plan.metrics.startRating} → {plan.metrics.currentRating}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs sm:text-sm text-gray-600">Recommendation Score</p>
                                <p className="font-semibold text-green-600 text-sm">
                                  {plan.metrics.startRecommendationScore}% → {plan.metrics.currentRecommendationScore}%
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs sm:text-sm text-gray-600">Tasks Completed</p>
                                <p className="font-semibold text-purple-600 text-sm">
                                  {plan.metrics.tasksCompleted}/{plan.metrics.totalTasks}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs sm:text-sm text-gray-600">Overall Progress</p>
                                <p className="font-semibold text-orange-600 text-sm">
                                  {plan.metrics.totalTasks > 0
                                    ? Math.round((plan.metrics.tasksCompleted / plan.metrics.totalTasks) * 100)
                                    : 0}
                                  %
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Auto-Response Settings */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center text-gray-900">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Auto-Response Settings
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Configure AI to automatically respond to customer reviews
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-3 sm:p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base">Enable Auto-Response</h4>
                    <p className="text-xs sm:text-sm text-gray-600">AI will respond to reviews automatically</p>
                  </div>
                  <Switch checked={autoResponseEnabled} onCheckedChange={setAutoResponseEnabled} />
                </div>

                {autoResponseEnabled && (
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Response Time</label>
                        <Select value={autoResponseTime} onValueChange={setAutoResponseTime}>
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="Select response time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediate</SelectItem>
                            <SelectItem value="1">1 hour</SelectItem>
                            <SelectItem value="2">2 hours</SelectItem>
                            <SelectItem value="4">4 hours</SelectItem>
                            <SelectItem value="8">8 hours</SelectItem>
                            <SelectItem value="24">24 hours</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">Time delay before AI responds to reviews</p>
                      </div>

                      <div className="p-3 sm:p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3 text-sm">Response Timing by Rating</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm text-gray-600">5-4 stars</span>
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              {autoResponseTime === "immediate" ? "Immediate" : `${autoResponseTime}h`}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm text-gray-600">3 stars</span>
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              {autoResponseTime === "immediate"
                                ? "1h"
                                : `${Math.max(2, Number.parseInt(autoResponseTime))}h`}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm text-gray-600">2-1 stars</span>
                            <Badge className="bg-red-100 text-red-800 text-xs">Manual approval</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900">Response Guidelines</label>
                      <Textarea
                        value={responsePrompt}
                        onChange={(e) => setResponsePrompt(e.target.value)}
                        placeholder="Enter guidelines for AI responses..."
                        className="border-gray-300"
                        rows={4}
                      />
                      <p className="text-xs text-gray-500">
                        These guidelines help AI understand your brand voice and response style.
                      </p>
                    </div>

                    <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                      <Button className="bg-gray-900 hover:bg-gray-800 text-white flex-1 sm:flex-none text-xs sm:text-sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save Settings
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 sm:flex-none border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent text-xs sm:text-sm"
                      >
                        <TestTube className="w-4 h-4 mr-2" />
                        Test Response
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div>
                    <CardTitle className="text-base sm:text-lg flex items-center text-gray-900">
                      <Bell className="w-5 h-5 mr-2" />
                      Recent Reviews
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">Latest customer feedback</CardDescription>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-red-100 text-red-800 text-xs">
                      {reviewData.filter((r) => r.isNew).length} new
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleViewAllReviews}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent text-xs sm:text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">View All</span>
                      <span className="sm:hidden">All</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviewData.slice(0, 5).map((review) => (
                    <div
                      key={review.id}
                      className={`border rounded-lg p-3 sm:p-4 ${
                        review.isNew ? "bg-blue-50 border-blue-200" : "border-gray-200"
                      }`}
                    >
                      <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0 mb-3">
                        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900 text-sm">{review.author}</span>
                            <Badge variant="outline" className="text-xs">
                              {review.platform}
                            </Badge>
                            {review.isNew && <Badge className="bg-blue-100 text-blue-800 text-xs">New</Badge>}
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500">{review.date}</span>
                      </div>

                      <p className="text-sm text-gray-700 mb-3 leading-relaxed">{review.text}</p>

                      {review.responded && review.response && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Your response:</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{review.response}</p>
                        </div>
                      )}

                      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mt-3">
                        <Badge
                          className={
                            review.sentiment === "positive"
                              ? "bg-green-100 text-green-800"
                              : review.sentiment === "negative"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {review.sentiment}
                        </Badge>

                        <div className="flex items-center space-x-2">
                          {review.responded ? (
                            <Badge className="bg-gray-100 text-gray-800 text-xs">Responded</Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleRespondToReview(review.id)}
                              className="bg-gray-900 hover:bg-gray-800 text-white text-xs"
                            >
                              <MessageCircle className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">Respond</span>
                              <span className="sm:hidden">Reply</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Improvement Plan Dialog */}
      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPlan?.title}</DialogTitle>
            <DialogDescription>{selectedPlan?.description}</DialogDescription>
          </DialogHeader>

          {selectedPlan && (
            <div className="space-y-6">
              {/* Plan Metrics */}
              {selectedPlan.metrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Current Rating</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedPlan.metrics.currentRating}</p>
                    <p className="text-xs text-gray-500">Start: {selectedPlan.metrics.startRating}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Recommendation Score</p>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedPlan.metrics.currentRecommendationScore}%
                    </p>
                    <p className="text-xs text-gray-500">Start: {selectedPlan.metrics.startRecommendationScore}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Tasks Progress</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {selectedPlan.metrics.tasksCompleted}/{selectedPlan.metrics.totalTasks}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedPlan.metrics.totalTasks > 0
                        ? Math.round((selectedPlan.metrics.tasksCompleted / selectedPlan.metrics.totalTasks) * 100)
                        : 0}
                      % Complete
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge
                      className={
                        selectedPlan.status === "active"
                          ? "bg-green-100 text-green-800"
                          : selectedPlan.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }
                    >
                      {selectedPlan.status}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Recommendations</h4>
                <div className="space-y-4">
                  {selectedPlan.recommendations.map((rec) => (
                    <div key={rec.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900">{rec.category}</h5>
                        <div className="flex space-x-2">
                          <Badge
                            className={`text-xs ${
                              rec.impact === "High"
                                ? "bg-red-100 text-red-800"
                                : rec.impact === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {rec.impact} Impact
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {rec.timeframe}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                      <ul className="space-y-1">
                        {rec.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="text-xs text-gray-700 flex items-start">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks */}
              {selectedPlan.tasks && selectedPlan.tasks.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Tasks</h4>
                  <div className="space-y-3">
                    {selectedPlan.tasks.map((task) => (
                      <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={(e) => handleTaskToggle(task.id, e.target.checked)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <h5
                              className={`font-medium text-sm ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}
                            >
                              {task.title}
                            </h5>
                            <Badge variant={task.type === "internal" ? "default" : "secondary"} className="text-xs">
                              {task.type}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            {task.status === "pending" && !task.completed && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStartTask(task.id)}
                                className="text-xs"
                              >
                                Start
                              </Button>
                            )}
                            <span className="text-xs text-gray-600">{task.estimatedDays}d</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-3 ml-6">{task.description}</p>

                        {(task.startDate || task.completedDate) && (
                          <div className="mt-2 ml-6 flex items-center space-x-4 text-xs text-gray-500">
                            {task.startDate && <span>Started: {new Date(task.startDate).toLocaleDateString()}</span>}
                            {task.completedDate && (
                              <span>Completed: {new Date(task.completedDate).toLocaleDateString()}</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                {!selectedPlan.saved ? (
                  <Button
                    onClick={handleSavePlan}
                    className="bg-gray-900 hover:bg-gray-800 text-white flex-1 sm:flex-none"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Plan
                  </Button>
                ) : (
                  <>
                    {(!selectedPlan.tasks || selectedPlan.tasks.length === 0) && (
                      <Button
                        onClick={handleConvertToTasks}
                        className="bg-gray-900 hover:bg-gray-800 text-white flex-1 sm:flex-none"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Convert to Tasks
                      </Button>
                    )}
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={() => setShowPlanDialog(false)}
                  className="flex-1 sm:flex-none border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
