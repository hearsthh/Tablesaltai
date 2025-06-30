"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import {
  Users,
  TrendingUp,
  Globe,
  Star,
  MessageSquare,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  Eye,
  Zap,
  BarChart3,
  Filter,
  Download,
  ArrowRight,
  Link,
  Settings,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Bell,
  MessageCircle,
  ThumbsUp,
  ExternalLink,
  Play,
  Send,
  Save,
  TestTube,
  RefreshCw,
  ChevronRight,
  TrendingDown,
  Timer,
} from "lucide-react"

export default function ReviewsAggregatorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isOnboarding = searchParams.get("onboarding") === "true"
  const isNewUser = searchParams.get("new") === "true" || isOnboarding

  const [autoResponseEnabled, setAutoResponseEnabled] = useState(false)
  const [autoResponseTime, setAutoResponseTime] = useState("2")
  const [responsePrompt, setResponsePrompt] = useState(
    "Respond professionally and warmly to customer reviews. Address specific points mentioned. Thank positive reviewers and acknowledge concerns in negative reviews with solutions. Always maintain our restaurant's friendly and welcoming tone.",
  )
  const [selectedTab, setSelectedTab] = useState("overview")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showAIFeatures, setShowAIFeatures] = useState(!isNewUser)
  const [showImprovementPlan, setShowImprovementPlan] = useState(false)
  const [improvementPlan, setImprovementPlan] = useState(null)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)

  const handleContinueOnboarding = () => {
    router.push("/dashboard?onboarding=complete")
  }

  const handleConnectPlatform = (platform: string) => {
    console.log(`Connecting to ${platform}...`)
    setTimeout(() => {
      setShowAIFeatures(true)
    }, 2000)
  }

  const handleRunAIAnalysis = async () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowAIFeatures(true)
    }, 3000)
  }

  const handleGenerateImprovementPlan = async () => {
    setIsGeneratingPlan(true)
    setTimeout(() => {
      setImprovementPlan({
        summary:
          "Based on your review analysis, here are key areas for improvement to boost your rating from 4.5 to 4.8+",
        recommendations: [
          {
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
          {
            category: "Noise Management",
            description: "Improve dining atmosphere for conversations",
            impact: "Medium",
            effort: "Medium",
            timeframe: "3-6 weeks",
            details: [
              "Install sound dampening materials",
              "Adjust music volume during peak hours",
              "Create quieter seating sections",
              "Train staff on noise awareness",
            ],
          },
          {
            category: "Food Consistency",
            description: "Ensure consistent food temperature and quality",
            impact: "High",
            effort: "Low",
            timeframe: "1-2 weeks",
            details: [
              "Implement temperature monitoring protocols",
              "Standardize cooking procedures",
              "Regular quality checks before serving",
              "Staff training on food standards",
            ],
          },
        ],
      })
      setIsGeneratingPlan(false)
      setShowImprovementPlan(true)
    }, 3000)
  }

  const handleConvertToTasks = () => {
    // Convert improvement plan to trackable tasks
    console.log("Converting improvement plan to tasks...")
    setShowImprovementPlan(false)
  }

  // Mock data for connected platforms with detailed analysis
  const mockPlatformRatings = [
    {
      platform: "Google My Business",
      rating: 4.6,
      reviews: 89,
      change: "+0.2",
      changeType: "positive",
      logo: "🏢",
      color: "bg-blue-100 text-blue-800",
      connected: showAIFeatures,
      monthlyTrend: [4.2, 4.3, 4.4, 4.5, 4.6],
      responseRate: 85,
      avgResponseTime: "2.1h",
    },
    {
      platform: "Yelp",
      rating: 4.3,
      reviews: 45,
      change: "-0.1",
      changeType: "negative",
      logo: "⭐",
      color: "bg-red-100 text-red-800",
      connected: false,
      monthlyTrend: [4.5, 4.4, 4.3, 4.2, 4.3],
      responseRate: 0,
      avgResponseTime: "N/A",
    },
    {
      platform: "TripAdvisor",
      rating: 4.8,
      reviews: 22,
      change: "+0.3",
      changeType: "positive",
      logo: "✈️",
      color: "bg-green-100 text-green-800",
      connected: false,
      monthlyTrend: [4.5, 4.6, 4.7, 4.7, 4.8],
      responseRate: 0,
      avgResponseTime: "N/A",
    },
  ]

  // AI Review Summary
  const aiReviewSummary = {
    overallRating: 4.5,
    totalReviews: 156,
    sentimentBreakdown: {
      positive: 78,
      neutral: 15,
      negative: 7,
    },
    keyStrengths: [
      "Exceptional food quality and taste",
      "Warm and attentive service",
      "Great ambiance for special occasions",
    ],
    mainConcerns: [
      "Service speed during peak hours",
      "Limited parking availability",
      "Noise levels affecting conversation",
    ],
    recommendationScore: 92,
    improvementPotential: "+0.3 rating increase possible",
  }

  // Mock AI insights data
  const mockInsights = {
    highlights: [
      { text: "Excellent food quality", percentage: 87, sentiment: "positive" },
      { text: "Great atmosphere", percentage: 76, sentiment: "positive" },
      { text: "Friendly staff", percentage: 82, sentiment: "positive" },
      { text: "Good value for money", percentage: 71, sentiment: "positive" },
    ],
    redFlags: [
      { text: "Slow service during peak hours", percentage: 34, severity: "medium" },
      { text: "Limited parking space", percentage: 28, severity: "low" },
      { text: "Noise level too high", percentage: 19, severity: "low" },
    ],
    useCases: [
      { text: "Date nights and romantic dinners", percentage: 42 },
      { text: "Family celebrations", percentage: 38 },
      { text: "Business meetings", percentage: 24 },
      { text: "Casual dining with friends", percentage: 67 },
    ],
  }

  // Mock improvement tasks
  const [mockTasks, setMockTasks] = useState([
    {
      id: 1,
      title: "Improve service speed during peak hours",
      description: "Implement table management system and staff scheduling optimization",
      type: "internal",
      progress: 0,
      status: "pending",
      estimatedDays: 14,
    },
    {
      id: 2,
      title: "Create special offers for repeat customers",
      description: "Launch loyalty program with TableSalt platform",
      type: "internal",
      progress: 100,
      status: "completed",
      estimatedDays: 7,
    },
    {
      id: 3,
      title: "Partner with nearby parking facilities",
      description: "Negotiate discounted parking rates for restaurant customers",
      type: "external",
      progress: 60,
      status: "in-progress",
      estimatedDays: 30,
    },
  ])

  // Mock recent reviews
  const mockRecentReviews = [
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

  // Empty state for new users
  const EmptyReviewsState = () => (
    <div className="text-center py-12 px-4">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reviews Management</h1>
              <p className="text-gray-600 mt-1">
                {!showAIFeatures
                  ? "Connect platforms to start monitoring reviews"
                  : "AI-powered review monitoring and management"}
              </p>
            </div>

            {showAIFeatures && (
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  size="sm"
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                  onClick={handleRunAIAnalysis}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
                  {isAnalyzing ? "Analyzing..." : "AI Analysis"}
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
              {mockPlatformRatings.map((platform, index) => (
                <Card key={index} className="border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{platform.logo}</span>
                        <div>
                          <CardTitle className="text-base text-gray-900">{platform.platform}</CardTitle>
                          <CardDescription className="text-sm text-gray-600">
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
                <CardTitle className="text-lg flex items-center text-gray-900">
                  <Smartphone className="w-5 h-5 mr-2 text-gray-600" />
                  Quick Setup Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Connect Google My Business</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Most important for local search visibility and AI insights
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-600 text-sm">Add Yelp & TripAdvisor</h4>
                      <p className="text-gray-500 text-sm mt-1">Expand your review monitoring coverage</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-600 text-sm">Enable AI features</h4>
                      <p className="text-gray-500 text-sm mt-1">Set up automated responses and insights</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Onboarding Continue */}
            {isOnboarding && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          <div className="space-y-8">
            {/* AI Review Summary */}
            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center text-gray-900">
                      <Zap className="w-5 h-5 mr-2" />
                      AI Review Summary
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Comprehensive analysis of all your reviews across platforms
                    </CardDescription>
                  </div>
                  <Badge className="bg-gray-100 text-gray-800">Last updated: 2 hours ago</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Overall Rating */}
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-4xl font-bold text-gray-900">{aiReviewSummary.overallRating}</span>
                      <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                    </div>
                    <p className="text-sm text-gray-600">Overall Rating</p>
                    <p className="text-xs text-gray-500 mt-1">{aiReviewSummary.totalReviews} total reviews</p>
                    <p className="text-xs text-green-600 mt-1">{aiReviewSummary.improvementPotential}</p>
                  </div>

                  {/* Sentiment Breakdown */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Sentiment Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Positive</span>
                        <span className="text-sm font-medium text-green-600">
                          {aiReviewSummary.sentimentBreakdown.positive}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Neutral</span>
                        <span className="text-sm font-medium text-yellow-600">
                          {aiReviewSummary.sentimentBreakdown.neutral}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Negative</span>
                        <span className="text-sm font-medium text-red-600">
                          {aiReviewSummary.sentimentBreakdown.negative}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center space-x-2">
                        <ThumbsUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">
                          {aiReviewSummary.recommendationScore}% Recommendation Score
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Key Insights</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Top Strengths</p>
                        <ul className="space-y-1">
                          {aiReviewSummary.keyStrengths.slice(0, 2).map((strength, index) => (
                            <li key={index} className="text-xs text-green-700 flex items-center">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Main Concerns</p>
                        <ul className="space-y-1">
                          {aiReviewSummary.mainConcerns.slice(0, 2).map((concern, index) => (
                            <li key={index} className="text-xs text-red-700 flex items-center">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {concern}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generate Improvement Plan Button */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">AI Improvement Plan</h4>
                      <p className="text-sm text-gray-600">Get personalized recommendations to boost your ratings</p>
                    </div>
                    <Button
                      onClick={handleGenerateImprovementPlan}
                      disabled={isGeneratingPlan}
                      className="bg-gray-900 hover:bg-gray-800 text-white"
                    >
                      {isGeneratingPlan ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Target className="w-4 h-4 mr-2" />
                          Generate Plan
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Improvement Plan Modal/Card */}
            {showImprovementPlan && improvementPlan && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-900">AI-Generated Improvement Plan</CardTitle>
                      <CardDescription className="text-gray-600">{improvementPlan.summary}</CardDescription>
                    </div>
                    <Button onClick={handleConvertToTasks} className="bg-gray-900 hover:bg-gray-800 text-white">
                      Convert to Tasks
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {improvementPlan.recommendations.map((rec, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{rec.category}</h4>
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
                </CardContent>
              </Card>
            )}

            {/* Platform Analysis */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-gray-900">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Platform Analysis
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Detailed breakdown of ratings across all connected platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPlatformRatings
                    .filter((p) => p.connected)
                    .map((platform, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{platform.logo}</span>
                            <div>
                              <h4 className="font-medium text-gray-900">{platform.platform}</h4>
                              <p className="text-sm text-gray-600">{platform.reviews} reviews</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-lg text-gray-900">{platform.rating}</span>
                              <div className="flex items-center space-x-1">
                                {platform.changeType === "positive" ? (
                                  <ArrowUp className="w-3 h-3 text-green-600" />
                                ) : (
                                  <ArrowDown className="w-3 h-3 text-red-600" />
                                )}
                                <span
                                  className={`text-sm ${
                                    platform.changeType === "positive" ? "text-green-600" : "text-red-600"
                                  }`}
                                >
                                  {platform.change}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-sm text-gray-600">Response Rate</p>
                            <p className="font-semibold text-gray-900">{platform.responseRate}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Avg Response Time</p>
                            <p className="font-semibold text-gray-900">{platform.avgResponseTime}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Trend</p>
                            <div className="flex items-center justify-center space-x-1">
                              {platform.changeType === "positive" ? (
                                <TrendingUp className="w-4 h-4 text-green-600" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-red-600" />
                              )}
                              <span
                                className={`text-sm ${
                                  platform.changeType === "positive" ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {platform.changeType === "positive" ? "Improving" : "Declining"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Insights Tabs */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-gray-900">
                  <Zap className="w-5 h-5 mr-2" />
                  AI Review Insights
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Detailed analysis of customer feedback patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="highlights">Highlights</TabsTrigger>
                    <TabsTrigger value="redflags">Red Flags</TabsTrigger>
                    <TabsTrigger value="usecases">Use Cases</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <ThumbsUp className="w-8 h-8 text-green-600" />
                            <div>
                              <p className="text-2xl font-bold text-green-900">87%</p>
                              <p className="text-sm text-green-700">Positive Sentiment</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-red-50 border-red-200">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                            <div>
                              <p className="text-2xl font-bold text-red-900">3</p>
                              <p className="text-sm text-red-700">Issues to Address</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Top Performing Aspects</h4>
                      {mockInsights.highlights.slice(0, 3).map((highlight, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-900">{highlight.text}</span>
                          <Badge className="bg-green-100 text-green-800">{highlight.percentage}%</Badge>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="highlights" className="space-y-4">
                    <div className="space-y-3">
                      {mockInsights.highlights.map((highlight, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <ThumbsUp className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-gray-900">{highlight.text}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${highlight.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{highlight.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="redflags" className="space-y-4">
                    <div className="space-y-3">
                      {mockInsights.redFlags.map((flag, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <AlertTriangle
                              className={`w-5 h-5 ${
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
                            <span className="text-sm font-semibold text-gray-900">{flag.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="usecases" className="space-y-4">
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        Based on customer reviews, here's how people use your restaurant:
                      </p>
                      {mockInsights.useCases.map((useCase, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        >
                          <span className="text-sm text-gray-900">{useCase.text}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gray-900 h-2 rounded-full"
                                style={{ width: `${useCase.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{useCase.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Improvement Tasks */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-gray-900">
                  <Target className="w-5 h-5 mr-2" />
                  Improvement Tasks
                </CardTitle>
                <CardDescription className="text-gray-600">Track progress on actionable improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTasks.map((task) => (
                    <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                            <Badge variant={task.type === "internal" ? "default" : "secondary"} className="text-xs">
                              {task.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{task.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {task.status === "completed" ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : task.status === "in-progress" ? (
                            <Clock className="w-5 h-5 text-yellow-600" />
                          ) : (
                            <Play className="w-5 h-5 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-600">{task.estimatedDays}d</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Progress</span>
                          <span className="text-sm font-medium text-gray-900">{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>

                      {task.type === "internal" && task.status === "pending" && (
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white text-xs">
                            <Play className="w-3 h-3 mr-1" />
                            Start Task
                          </Button>
                        </div>
                      )}

                      {task.type === "external" && (
                        <div className="mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Auto-Response Settings */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-gray-900">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Auto-Response Settings
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Configure AI to automatically respond to customer reviews
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable Auto-Response</h4>
                    <p className="text-sm text-gray-600">AI will respond to reviews automatically</p>
                  </div>
                  <Switch checked={autoResponseEnabled} onCheckedChange={setAutoResponseEnabled} />
                </div>

                {autoResponseEnabled && (
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
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

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3">Response Timing by Rating</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">5-4 stars</span>
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              {autoResponseTime === "immediate" ? "Immediate" : `${autoResponseTime}h`}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">3 stars</span>
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              {autoResponseTime === "immediate"
                                ? "1h"
                                : `${Math.max(2, Number.parseInt(autoResponseTime))}h`}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">2-1 stars</span>
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

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Safety Features</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Bell className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-600">Notification before negative responses</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Settings className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-600">Brand voice consistency check</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Timer className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-600">Configurable response delays</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button className="bg-gray-900 hover:bg-gray-800 text-white flex-1 sm:flex-none">
                        <Save className="w-4 h-4 mr-2" />
                        Save Settings
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 sm:flex-none border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                      >
                        <TestTube className="w-4 h-4 mr-2" />
                        Test Response
                      </Button>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Sample AI Response Preview</h4>
                      <div className="text-sm text-gray-600 italic">
                        "Thank you so much for your wonderful review, Sarah! We're thrilled to hear that you enjoyed our
                        pasta and found our staff attentive. Your feedback means the world to us, and we look forward to
                        welcoming you back soon!"
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center text-gray-900">
                      <Bell className="w-5 h-5 mr-2" />
                      Recent Reviews
                    </CardTitle>
                    <CardDescription className="text-gray-600">Latest customer feedback</CardDescription>
                  </div>
                  <Badge className="bg-red-100 text-red-800">1 new</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentReviews.map((review) => (
                    <div
                      key={review.id}
                      className={`border rounded-lg p-4 ${review.isNew ? "bg-blue-50 border-blue-200" : "border-gray-200"}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{review.author}</span>
                          <Badge variant="outline" className="text-xs">
                            {review.platform}
                          </Badge>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          {review.isNew && <Badge className="bg-blue-100 text-blue-800 text-xs">New</Badge>}
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>

                      <p className="text-sm text-gray-700 mb-3">{review.text}</p>

                      <div className="flex items-center justify-between">
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
                            <Badge className="bg-gray-100 text-gray-800">Responded</Badge>
                          ) : (
                            <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white text-xs">
                              <Send className="w-3 h-3 mr-1" />
                              Respond
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
    </div>
  )
}
