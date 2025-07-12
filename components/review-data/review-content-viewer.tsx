"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Reply,
  ExternalLink,
  Search,
  User,
  Clock,
  Heart,
  Flag,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"
import type { ReviewContent, ChannelMetrics } from "@/lib/types/review-data"

interface ReviewContentViewerProps {
  reviews: ReviewContent[]
  channels: ChannelMetrics[]
  onReply: (reviewId: string, response: string) => Promise<void>
  onLoadMore: () => Promise<void>
  hasMore: boolean
}

export default function ReviewContentViewer({
  reviews,
  channels,
  onReply,
  onLoadMore,
  hasMore,
}: ReviewContentViewerProps) {
  const [filteredReviews, setFilteredReviews] = useState<ReviewContent[]>(reviews)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterChannel, setFilterChannel] = useState<string>("all")
  const [filterRating, setFilterRating] = useState<string>("all")
  const [filterSentiment, setFilterSentiment] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [selectedReview, setSelectedReview] = useState<ReviewContent | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isReplying, setIsReplying] = useState(false)

  useEffect(() => {
    let filtered = [...reviews]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.title?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Channel filter
    if (filterChannel !== "all") {
      filtered = filtered.filter((review) => review.channelId === filterChannel)
    }

    // Rating filter
    if (filterRating !== "all") {
      filtered = filtered.filter((review) => review.rating.toString() === filterRating)
    }

    // Sentiment filter
    if (filterSentiment !== "all") {
      filtered = filtered.filter((review) => review.sentiment === filterSentiment)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        case "oldest":
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        case "highest_rating":
          return b.rating - a.rating
        case "lowest_rating":
          return a.rating - b.rating
        case "most_helpful":
          return (b.helpfulCount || 0) - (a.helpfulCount || 0)
        default:
          return 0
      }
    })

    setFilteredReviews(filtered)
  }, [reviews, searchTerm, filterChannel, filterRating, filterSentiment, sortBy])

  const handleReply = async () => {
    if (!selectedReview || !replyText.trim()) return

    setIsReplying(true)
    try {
      await onReply(selectedReview.id, replyText)
      setReplyText("")
      setSelectedReview(null)
      toast({
        title: "Reply Posted",
        description: "Your response has been posted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsReplying(false)
    }
  }

  const getSentimentColor = (sentiment: ReviewContent["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 bg-green-50 border-green-200"
      case "negative":
        return "text-red-600 bg-red-50 border-red-200"
      case "neutral":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getSentimentIcon = (sentiment: ReviewContent["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="w-3 h-3" />
      case "negative":
        return <ThumbsDown className="w-3 h-3" />
      case "neutral":
        return <MessageSquare className="w-3 h-3" />
      default:
        return <MessageSquare className="w-3 h-3" />
    }
  }

  const getChannelLogo = (channelId: string) => {
    const channel = channels.find((c) => c.channelId === channelId)
    return channel?.channelLogo || "/placeholder.svg?height=20&width=20"
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const reviewTime = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - reviewTime.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return reviewTime.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Review Content</CardTitle>
          <CardDescription>View and manage all your reviews from connected channels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search reviews, customers, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Select value={filterChannel} onValueChange={setFilterChannel}>
              <SelectTrigger>
                <SelectValue placeholder="All Channels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                {channels
                  .filter((c) => c.isConnected)
                  .map((channel) => (
                    <SelectItem key={channel.channelId} value={channel.channelId}>
                      {channel.channelName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger>
                <SelectValue placeholder="All Ratings" />
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

            <Select value={filterSentiment} onValueChange={setFilterSentiment}>
              <SelectTrigger>
                <SelectValue placeholder="All Sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiment</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest_rating">Highest Rating</SelectItem>
                <SelectItem value="lowest_rating">Lowest Rating</SelectItem>
                <SelectItem value="most_helpful">Most Helpful</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-600 flex items-center">
              {filteredReviews.length} of {reviews.length} reviews
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {review.customerAvatar ? (
                        <img
                          src={review.customerAvatar || "/placeholder.svg"}
                          alt={review.customerName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-sm">{review.customerName}</h4>
                        {review.isVerified && (
                          <Badge variant="outline" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <div className="flex items-center space-x-1">
                          <img
                            src={getChannelLogo(review.channelId) || "/placeholder.svg"}
                            alt={review.channelName}
                            className="w-4 h-4"
                          />
                          <span>{review.channelName}</span>
                        </div>
                        <span>•</span>
                        <span>{formatTimeAgo(review.timestamp)}</span>
                        {review.metadata.orderType && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{review.metadata.orderType}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${getSentimentColor(review.sentiment)}`}>
                      {getSentimentIcon(review.sentiment)}
                      <span className="ml-1 capitalize">{review.sentiment}</span>
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => window.open(review.originalUrl, "_blank")}>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{review.rating}/5</span>
                  {review.helpfulCount && review.helpfulCount > 0 && (
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <Heart className="w-3 h-3" />
                      <span>{review.helpfulCount} helpful</span>
                    </div>
                  )}
                </div>

                {/* Review Title */}
                {review.title && <h3 className="font-medium text-sm mb-2">{review.title}</h3>}

                {/* Review Content */}
                <p className="text-sm text-gray-700 mb-3 leading-relaxed">{review.content}</p>

                {/* Review Photos */}
                {review.photos && review.photos.length > 0 && (
                  <div className="flex space-x-2 mb-3">
                    {review.photos.slice(0, 3).map((photo, index) => (
                      <img
                        key={photo.id}
                        src={photo.url || "/placeholder.svg"}
                        alt={photo.caption || `Review photo ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ))}
                    {review.photos.length > 3 && (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-600">
                        +{review.photos.length - 3}
                      </div>
                    )}
                  </div>
                )}

                {/* Keywords and Topics */}
                {(review.keywords.length > 0 || review.topics.length > 0) && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {review.keywords.slice(0, 3).map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                      {review.topics.slice(0, 2).map((topic, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Owner Response */}
                {review.responseFromOwner && (
                  <div className="bg-blue-50 p-3 rounded-lg mb-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">R</span>
                      </div>
                      <span className="text-xs font-medium text-blue-900">Restaurant Response</span>
                      {review.responseFromOwner.isAiGenerated && (
                        <Badge variant="outline" className="text-xs">
                          AI Generated
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-blue-800">{review.responseFromOwner.content}</p>
                    <p className="text-xs text-blue-600 mt-1">{formatTimeAgo(review.responseFromOwner.timestamp)}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center space-x-3">
                    {!review.responseFromOwner && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedReview(review)}
                        className="bg-transparent"
                      >
                        <Reply className="w-4 h-4 mr-1" />
                        Reply
                      </Button>
                    )}
                    <Button size="sm" variant="ghost">
                      <Flag className="w-4 h-4 mr-1" />
                      Flag
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(review.reviewDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Load More */}
        {hasMore && (
          <div className="text-center">
            <Button variant="outline" onClick={onLoadMore} className="bg-transparent">
              Load More Reviews
            </Button>
          </div>
        )}

        {filteredReviews.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No reviews found</h3>
              <p className="text-sm text-gray-600">
                {searchTerm || filterChannel !== "all" || filterRating !== "all" || filterSentiment !== "all"
                  ? "Try adjusting your filters to see more reviews."
                  : "Connect your review platforms to start seeing reviews here."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reply Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reply to Review</DialogTitle>
            <DialogDescription>Respond to {selectedReview?.customerName}'s review</DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4">
              {/* Review Summary */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < selectedReview.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{selectedReview.customerName}</span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">{selectedReview.content}</p>
              </div>

              {/* Reply Input */}
              <div>
                <Label htmlFor="reply" className="text-sm font-medium">
                  Your Response
                </Label>
                <Textarea
                  id="reply"
                  placeholder="Thank you for your review..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  className="mt-1"
                />
                <p className="text-xs text-gray-600 mt-1">{replyText.length}/500 characters</p>
              </div>

              {/* AI Suggestions */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">AI Suggestions</Label>
                <div className="space-y-2">
                  {selectedReview.sentiment === "positive" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setReplyText(
                          "Thank you so much for your wonderful review! We're thrilled that you had such a great experience with us. We look forward to welcoming you back soon!",
                        )
                      }
                      className="w-full text-left justify-start bg-transparent"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Grateful & Welcoming
                    </Button>
                  )}
                  {selectedReview.sentiment === "negative" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setReplyText(
                          "We sincerely apologize for your experience. This is not the standard we strive for. Please contact us directly so we can make this right and improve for the future.",
                        )
                      }
                      className="w-full text-left justify-start bg-transparent"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Apologetic & Solution-focused
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setReplyText(
                        "Thank you for taking the time to share your feedback. We truly appreciate all reviews as they help us continue to improve our service and offerings.",
                      )
                    }
                    className="w-full text-left justify-start bg-transparent"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Professional & Appreciative
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setSelectedReview(null)}>
              Cancel
            </Button>
            <Button onClick={handleReply} disabled={isReplying || !replyText.trim()}>
              {isReplying ? "Posting..." : "Post Reply"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
