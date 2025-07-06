"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Star,
  Filter,
  Search,
  Download,
  Send,
  MessageSquare,
  AlertTriangle,
  Clock,
  CheckCircle,
  Reply,
  ExternalLink,
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
  platformUrl?: string
}

export default function AllReviewsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [filterPlatform, setFilterPlatform] = useState("all")
  const [filterSentiment, setFilterSentiment] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null)
  const [responseText, setResponseText] = useState("")
  const [showResponseDialog, setShowResponseDialog] = useState(false)

  // Mock comprehensive review data
  const allReviews: ReviewData[] = [
    {
      id: "1",
      platform: "Google",
      author: "Sarah M.",
      rating: 5,
      text: "Amazing food and great service! The pasta was perfectly cooked and the staff was very attentive. The ambiance is perfect for a romantic dinner. Will definitely come back!",
      date: "2024-01-15",
      responded: false,
      sentiment: "positive",
      isNew: true,
      platformUrl: "https://google.com/reviews/1",
    },
    {
      id: "2",
      platform: "Yelp",
      author: "Mike R.",
      rating: 2,
      text: "Food was okay but service was quite slow. Waited 45 minutes for our main course and the server seemed overwhelmed. The restaurant was busy but that's no excuse for poor service.",
      date: "2024-01-14",
      responded: true,
      response:
        "Thank you for your feedback, Mike. We sincerely apologize for the slow service. We're implementing new systems to improve our service speed. Please give us another chance!",
      sentiment: "negative",
      isNew: false,
      platformUrl: "https://yelp.com/reviews/2",
    },
    {
      id: "3",
      platform: "TripAdvisor",
      author: "Jennifer L.",
      rating: 4,
      text: "Great atmosphere for a date night. The wine selection is excellent! Only minor complaint is the noise level during busy hours. Food quality is consistently good.",
      date: "2024-01-13",
      responded: false,
      sentiment: "positive",
      isNew: false,
      platformUrl: "https://tripadvisor.com/reviews/3",
    },
    {
      id: "4",
      platform: "Google",
      author: "David K.",
      rating: 5,
      text: "Best Italian restaurant in the area! The chef's special was incredible and the tiramisu is to die for. Staff is knowledgeable about wine pairings.",
      date: "2024-01-12",
      responded: true,
      response:
        "Thank you so much, David! We're thrilled you enjoyed the chef's special and our tiramisu. Our team takes pride in our wine knowledge. See you soon!",
      sentiment: "positive",
      isNew: false,
      platformUrl: "https://google.com/reviews/4",
    },
    {
      id: "5",
      platform: "Yelp",
      author: "Lisa P.",
      rating: 3,
      text: "Decent food but nothing extraordinary. Prices are a bit high for what you get. Service was friendly though. The location is convenient.",
      date: "2024-01-11",
      responded: false,
      sentiment: "neutral",
      isNew: false,
      platformUrl: "https://yelp.com/reviews/5",
    },
    {
      id: "6",
      platform: "Google",
      author: "Robert T.",
      rating: 1,
      text: "Terrible experience. Food was cold when it arrived, and when we complained, the manager was rude. Will not be returning and will tell others to avoid this place.",
      date: "2024-01-10",
      responded: true,
      response:
        "We are deeply sorry about your experience, Robert. This is not the standard we strive for. Please contact us directly so we can make this right and ensure it doesn't happen again.",
      sentiment: "negative",
      isNew: false,
      platformUrl: "https://google.com/reviews/6",
    },
    {
      id: "7",
      platform: "TripAdvisor",
      author: "Emma S.",
      rating: 5,
      text: "Absolutely wonderful! Celebrated our anniversary here and everything was perfect. The staff went above and beyond to make it special. Highly recommend!",
      date: "2024-01-09",
      responded: true,
      response:
        "Thank you for choosing us for your special anniversary, Emma! We're so happy we could make it memorable. Congratulations and we look forward to celebrating with you again!",
      sentiment: "positive",
      isNew: false,
      platformUrl: "https://tripadvisor.com/reviews/7",
    },
    {
      id: "8",
      platform: "Google",
      author: "Tom W.",
      rating: 4,
      text: "Good food and service. The parking situation could be better, but the meal made up for it. Try the seafood pasta - it's excellent!",
      date: "2024-01-08",
      responded: false,
      sentiment: "positive",
      isNew: false,
      platformUrl: "https://google.com/reviews/8",
    },
  ]

  const [filteredReviews, setFilteredReviews] = useState(allReviews)

  // Filter and search logic
  const applyFilters = () => {
    let filtered = allReviews

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (review) =>
          review.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.author.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Platform filter
    if (filterPlatform !== "all") {
      filtered = filtered.filter((review) => review.platform.toLowerCase() === filterPlatform)
    }

    // Sentiment filter
    if (filterSentiment !== "all") {
      filtered = filtered.filter((review) => review.sentiment === filterSentiment)
    }

    // Status filter
    if (filterStatus !== "all") {
      if (filterStatus === "responded") {
        filtered = filtered.filter((review) => review.responded)
      } else if (filterStatus === "pending") {
        filtered = filtered.filter((review) => !review.responded)
      } else if (filterStatus === "new") {
        filtered = filtered.filter((review) => review.isNew)
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "rating":
          return b.rating - a.rating
        case "platform":
          return a.platform.localeCompare(b.platform)
        default:
          return 0
      }
    })

    setFilteredReviews(filtered)
  }

  const handleRespondToReview = (review: ReviewData) => {
    setSelectedReview(review)
    setResponseText("")
    setShowResponseDialog(true)
  }

  const handleSendResponse = () => {
    if (selectedReview && responseText.trim()) {
      // Update the review with response
      const updatedReviews = allReviews.map((review) =>
        review.id === selectedReview.id ? { ...review, responded: true, response: responseText.trim() } : review,
      )

      setFilteredReviews(updatedReviews)
      setShowResponseDialog(false)
      setSelectedReview(null)
      setResponseText("")

      toast({
        title: "Response Sent",
        description: "Your response has been posted successfully",
      })
    }
  }

  const handleExportReviews = () => {
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

  const getStatusIcon = (review: ReviewData) => {
    if (review.responded) {
      return <CheckCircle className="w-4 h-4 text-green-600" />
    } else if (review.isNew) {
      return <Clock className="w-4 h-4 text-blue-600" />
    } else {
      return <MessageSquare className="w-4 h-4 text-gray-400" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800"
      case "negative":
        return "bg-red-100 text-red-800"
      case "neutral":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">All Reviews</span>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportReviews}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <Card className="mb-8 border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Filter Reviews</CardTitle>
            <CardDescription className="text-gray-600">Search and filter through all your reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search reviews or authors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-300"
                  />
                </div>
              </div>

              <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="yelp">Yelp</SelectItem>
                  <SelectItem value="tripadvisor">TripAdvisor</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterSentiment} onValueChange={setFilterSentiment}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Sentiment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sentiments</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={applyFilters} className="bg-gray-900 hover:bg-gray-800 text-white">
                <Filter className="w-4 h-4 mr-2" />
                Apply
              </Button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Showing {filteredReviews.length} of {allReviews.length} reviews
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 border-gray-300">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="platform">Platform</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Responded ({allReviews.filter((r) => r.responded).length})</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>New ({allReviews.filter((r) => r.isNew).length})</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Pending ({allReviews.filter((r) => !r.responded).length})</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id} className={`border-gray-200 ${review.isNew ? "ring-2 ring-blue-200" : ""}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{review.author}</span>
                      <Badge variant="outline" className="text-xs">
                        {review.platform}
                      </Badge>
                      {review.isNew && <Badge className="bg-blue-100 text-blue-800 text-xs">New</Badge>}
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm font-medium text-gray-900 ml-1">{review.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(review)}
                      <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(review.platformUrl, "_blank")}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">{review.text}</p>
                </div>

                {review.responded && review.response && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg border-l-4 border-gray-300">
                    <div className="flex items-center space-x-2 mb-2">
                      <Reply className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Your Response</span>
                    </div>
                    <p className="text-gray-700 text-sm">{review.response}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge className={getSentimentColor(review.sentiment)}>{review.sentiment}</Badge>
                    {review.sentiment === "negative" && (
                      <div className="flex items-center space-x-1 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs">Needs attention</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {review.responded ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Responded
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleRespondToReview(review)}
                        className="bg-gray-900 hover:bg-gray-800 text-white"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Respond
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredReviews.length === 0 && (
            <Card className="border-gray-200">
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Response Dialog */}
      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Respond to Review</DialogTitle>
            <DialogDescription>Craft a professional response to {selectedReview?.author}'s review</DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4">
              {/* Review Preview */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-gray-900">{selectedReview.author}</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < selectedReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {selectedReview.platform}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700">{selectedReview.text}</p>
              </div>

              {/* Response Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Your Response</label>
                <Textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Write a professional and helpful response..."
                  rows={4}
                  className="border-gray-300"
                />
                <p className="text-xs text-gray-500">
                  Keep it professional, address specific points, and maintain a friendly tone.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowResponseDialog(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendResponse}
                  disabled={!responseText.trim()}
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Response
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
