"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  Zap,
  Bell,
  Eye,
} from "lucide-react"
import type { NewReviewSession, ReviewContent } from "@/lib/types/review-data"

interface NewReviewsSessionProps {
  sessionData: NewReviewSession[]
  onMarkAsRead: (sessionId: string) => void
  onViewReview: (reviewId: string) => void
}

export default function NewReviewsSession({ sessionData, onMarkAsRead, onViewReview }: NewReviewsSessionProps) {
  const [selectedSession, setSelectedSession] = useState<NewReviewSession | null>(null)

  useEffect(() => {
    // Auto-select the latest session
    if (sessionData.length > 0) {
      setSelectedSession(sessionData[0])
    }
  }, [sessionData])

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const sessionTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - sessionTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getSentimentColor = (sentiment: ReviewContent["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      case "neutral":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  const getSentimentIcon = (sentiment: ReviewContent["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="w-4 h-4" />
      case "negative":
        return <ThumbsDown className="w-4 h-4" />
      case "neutral":
        return <MessageSquare className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-600" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-600" />
    return <BarChart3 className="w-4 h-4 text-gray-600" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-600"
  }

  if (sessionData.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-medium text-gray-900 mb-2">No new reviews</h3>
          <p className="text-sm text-gray-600">
            New reviews will appear here when you log in. Check back later or sync your channels manually.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Session Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Bell className="w-4 h-4 mr-2 text-blue-600" />
            New Reviews Since Last Login
          </CardTitle>
          <CardDescription>
            {selectedSession && `Session from ${formatTimeAgo(selectedSession.loginTime)}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedSession && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-lg font-semibold text-blue-900">{selectedSession.summary.totalNewReviews}</p>
                  <p className="text-xs text-blue-700">New Reviews</p>
                </div>

                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <p className="text-lg font-semibold text-yellow-900">
                    {selectedSession.summary.averageRating.toFixed(1)}
                  </p>
                  <p className="text-xs text-yellow-700">Avg Rating</p>
                </div>

                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <ThumbsUp className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-lg font-semibold text-green-900">{selectedSession.summary.positiveReviews}</p>
                  <p className="text-xs text-green-700">Positive</p>
                </div>

                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <p className="text-lg font-semibold text-red-900">
                    {selectedSession.summary.requiresAttention.length}
                  </p>
                  <p className="text-xs text-red-700">Need Attention</p>
                </div>
              </div>

              {/* Channel Updates */}
              {selectedSession.channelUpdates.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-3">Channel Performance Changes</h4>
                  <div className="space-y-3">
                    {selectedSession.channelUpdates.map((update, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <img
                              src={`/placeholder.svg?height=20&width=20&query=${update.channelName.toLowerCase()}+logo`}
                              alt={update.channelName}
                              className="w-5 h-5"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{update.channelName}</p>
                            <p className="text-xs text-gray-600">
                              {update.newReviewsCount} new review{update.newReviewsCount !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm">
                          <div className="text-center">
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="font-medium">{update.currentRating.toFixed(1)}</span>
                              <span className={`text-xs ${getChangeColor(update.ratingChange)}`}>
                                ({update.ratingChange > 0 ? "+" : ""}
                                {update.ratingChange.toFixed(1)})
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">Rating</p>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center space-x-1">
                              <span className="font-medium">{update.currentCount}</span>
                              <span className={`text-xs ${getChangeColor(update.countChange)}`}>
                                (+{update.countChange})
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">Total</p>
                          </div>

                          {getChangeIcon(update.ratingChange)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights */}
              {selectedSession.summary.highlights.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-3">Session Highlights</h4>
                  <div className="space-y-2">
                    {selectedSession.summary.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <p className="text-sm text-green-800">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Reviews */}
              <div>
                <h4 className="font-medium text-sm mb-3">New Reviews</h4>
                <div className="space-y-3">
                  {selectedSession.newReviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium">{review.customerName.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{review.customerName}</p>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {review.channelName}
                              </Badge>
                              <Badge
                                className={`text-xs ${getSentimentColor(review.sentiment)} bg-transparent border-current`}
                              >
                                {getSentimentIcon(review.sentiment)}
                                <span className="ml-1 capitalize">{review.sentiment}</span>
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimeAgo(review.timestamp)}</span>
                        </div>
                      </div>

                      {review.title && <h4 className="font-medium text-sm mb-2">{review.title}</h4>}

                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">{review.content}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {review.keywords.slice(0, 2).map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewReview(review.id)}
                          className="bg-transparent"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Requiring Attention */}
              {selectedSession.summary.requiresAttention.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />
                    Reviews Requiring Attention
                  </h4>
                  <div className="space-y-3">
                    {selectedSession.summary.requiresAttention.map((review) => (
                      <div key={review.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-sm text-red-900">{review.customerName}</p>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.rating ? "text-red-400 fill-current" : "text-red-200"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs text-red-700 border-red-300">
                            {review.channelName}
                          </Badge>
                        </div>

                        <p className="text-sm text-red-800 mb-3">{review.content}</p>

                        <div className="flex items-center justify-between">
                          <p className="text-xs text-red-600">
                            Requires immediate response • {formatTimeAgo(review.timestamp)}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-700 border-red-300 hover:bg-red-100 bg-transparent"
                          >
                            Respond Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => onMarkAsRead(selectedSession.sessionId)}
                  className="bg-transparent"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Read
                </Button>

                <div className="flex space-x-2">
                  <Button variant="outline" className="bg-transparent">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button>
                    <Zap className="w-4 h-4 mr-2" />
                    Respond to All
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session History */}
      {sessionData.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Previous Sessions</CardTitle>
            <CardDescription>Review activity from previous logins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessionData.slice(1, 6).map((session) => (
                <div
                  key={session.sessionId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{formatTimeAgo(session.loginTime)}</p>
                      <p className="text-xs text-gray-600">
                        {session.summary.totalNewReviews} new reviews • Avg {session.summary.averageRating.toFixed(1)}{" "}
                        stars
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {session.summary.requiresAttention.length > 0 && (
                      <Badge variant="outline" className="text-xs text-red-700 border-red-300">
                        {session.summary.requiresAttention.length} urgent
                      </Badge>
                    )}
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
