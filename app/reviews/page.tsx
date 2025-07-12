"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Star,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Reply,
  Heart,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react"

// Static data for fast loading
const staticData = {
  reviews: [
    {
      id: "1",
      authorName: "Priya Sharma",
      rating: 5,
      content:
        "Amazing food and service! The butter chicken was absolutely divine. Will definitely come back with family.",
      platform: "google",
      reviewDate: "2024-01-20T10:00:00Z",
      hasResponse: true,
      response:
        "Thank you so much for your wonderful review, Priya! We're delighted you enjoyed the butter chicken. Looking forward to serving you and your family again soon!",
      sentiment: "positive",
      keywords: ["food", "service", "butter chicken"],
    },
    {
      id: "2",
      authorName: "Arjun Patel",
      rating: 4,
      content:
        "Great food quality and authentic flavors. The ambiance is nice too. Could improve wait times during peak hours.",
      platform: "zomato",
      reviewDate: "2024-01-19T15:30:00Z",
      hasResponse: false,
      response: null,
      sentiment: "positive",
      keywords: ["food quality", "authentic", "ambiance", "wait times"],
    },
    {
      id: "3",
      authorName: "Sneha Gupta",
      rating: 3,
      content: "Food was okay, but the service was slow. The dal makhani was good but the naan was a bit dry.",
      platform: "google",
      reviewDate: "2024-01-18T19:45:00Z",
      hasResponse: true,
      response:
        "Thank you for your feedback, Sneha. We apologize for the slow service and will work on improving it. We'll also ensure our naan is served fresh and warm.",
      sentiment: "neutral",
      keywords: ["service", "dal makhani", "naan"],
    },
    {
      id: "4",
      authorName: "Rahul Singh",
      rating: 5,
      content:
        "Excellent experience! The staff was very courteous and the food arrived quickly. Highly recommend the paneer tikka.",
      platform: "tripadvisor",
      reviewDate: "2024-01-17T12:20:00Z",
      hasResponse: false,
      response: null,
      sentiment: "positive",
      keywords: ["staff", "food", "paneer tikka"],
    },
    {
      id: "5",
      authorName: "Meera Joshi",
      rating: 2,
      content:
        "Disappointed with the food quality. The curry was too salty and the rice was undercooked. Expected better.",
      platform: "zomato",
      reviewDate: "2024-01-16T20:10:00Z",
      hasResponse: true,
      response:
        "We sincerely apologize for the disappointing experience, Meera. This is not the standard we strive for. Please contact us directly so we can make this right.",
      sentiment: "negative",
      keywords: ["food quality", "curry", "rice"],
    },
  ],
  analytics: {
    totalReviews: 247,
    avgRating: 4.3,
    responseRate: 78,
    sentimentBreakdown: {
      positive: 68,
      neutral: 22,
      negative: 10,
    },
    platformBreakdown: {
      google: 45,
      zomato: 35,
      tripadvisor: 20,
    },
  },
  responseTemplates: [
    {
      id: "1",
      name: "Positive Review Response",
      content:
        "Thank you so much for your wonderful review! We're delighted to hear you enjoyed your experience with us. We look forward to serving you again soon!",
      category: "positive",
    },
    {
      id: "2",
      name: "Constructive Feedback Response",
      content:
        "Thank you for your valuable feedback. We appreciate you taking the time to share your experience and will use your suggestions to improve our service.",
      category: "neutral",
    },
    {
      id: "3",
      name: "Negative Review Response",
      content:
        "We sincerely apologize for not meeting your expectations. Your feedback is important to us, and we would like the opportunity to make this right. Please contact us directly.",
      category: "negative",
    },
  ],
}

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState("reviews")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRating, setSelectedRating] = useState("all")
  const [responseText, setResponseText] = useState("")

  const filteredReviews = staticData.reviews.filter((review) => {
    const matchesSearch =
      review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.authorName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRating = selectedRating === "all" || review.rating.toString() === selectedRating
    return matchesSearch && matchesRating
  })

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "google":
        return "bg-blue-100 text-blue-800"
      case "zomato":
        return "bg-red-100 text-red-800"
      case "tripadvisor":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800"
      case "neutral":
        return "bg-yellow-100 text-yellow-800"
      case "negative":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
            <p className="text-gray-600 mt-1">Monitor, respond to, and analyze customer reviews across all platforms</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Insights
            </Button>
            <Button size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Bulk Response
            </Button>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Reviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{staticData.analytics.totalReviews}</div>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm font-medium text-green-600">+12.5%</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{staticData.analytics.avgRating}</div>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm font-medium text-green-600">+0.2</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Response Rate</CardTitle>
              <Reply className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{staticData.analytics.responseRate}%</div>
              <div className="flex items-center mt-1">
                <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                <span className="text-sm font-medium text-red-600">-2.1%</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Positive Sentiment</CardTitle>
              <Heart className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {staticData.analytics.sentimentBreakdown.positive}%
              </div>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm font-medium text-green-600">+5.3%</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="templates">Response Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">{review.authorName.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{review.authorName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <Badge className={getPlatformColor(review.platform)}>{review.platform}</Badge>
                            <Badge className={getSentimentColor(review.sentiment)}>{review.sentiment}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{new Date(review.reviewDate).toLocaleDateString()}</p>
                        {review.hasResponse ? (
                          <Badge className="bg-green-100 text-green-800 mt-1">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Responded
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{review.content}</p>

                    {review.keywords && (
                      <div className="flex flex-wrap gap-2">
                        {review.keywords.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {review.hasResponse && review.response && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Reply className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">Your Response</span>
                        </div>
                        <p className="text-sm text-blue-800">{review.response}</p>
                      </div>
                    )}

                    {!review.hasResponse && (
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Write your response..."
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <div className="flex gap-2">
                          <Button size="sm">
                            <Reply className="w-4 h-4 mr-2" />
                            Send Response
                          </Button>
                          <Button size="sm" variant="outline">
                            <Sparkles className="w-4 h-4 mr-2" />
                            AI Suggest
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Analysis</CardTitle>
                  <CardDescription>Breakdown of customer sentiment across all reviews</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-700">Positive</span>
                      <span className="text-sm text-gray-600">{staticData.analytics.sentimentBreakdown.positive}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${staticData.analytics.sentimentBreakdown.positive}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-yellow-700">Neutral</span>
                      <span className="text-sm text-gray-600">{staticData.analytics.sentimentBreakdown.neutral}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${staticData.analytics.sentimentBreakdown.neutral}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-red-700">Negative</span>
                      <span className="text-sm text-gray-600">{staticData.analytics.sentimentBreakdown.negative}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${staticData.analytics.sentimentBreakdown.negative}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Distribution</CardTitle>
                  <CardDescription>Review distribution across different platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-700">Google</span>
                      <span className="text-sm text-gray-600">{staticData.analytics.platformBreakdown.google}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${staticData.analytics.platformBreakdown.google}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-red-700">Zomato</span>
                      <span className="text-sm text-gray-600">{staticData.analytics.platformBreakdown.zomato}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${staticData.analytics.platformBreakdown.zomato}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-700">TripAdvisor</span>
                      <span className="text-sm text-gray-600">
                        {staticData.analytics.platformBreakdown.tripadvisor}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${staticData.analytics.platformBreakdown.tripadvisor}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid gap-6">
              {staticData.responseTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge className={getSentimentColor(template.category)}>{template.category}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm">Use Template</Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{template.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
