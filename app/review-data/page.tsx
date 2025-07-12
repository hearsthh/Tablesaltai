"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle, Star, MessageSquare, TrendingUp, RefreshCw, Settings, BarChart3, Bell, Zap } from "lucide-react"
import ChannelConnectionsForm from "@/components/review-data/channel-connections-form"
import ReviewContentViewer from "@/components/review-data/review-content-viewer"
import NewReviewsSession from "@/components/review-data/new-reviews-session"
import type { ReviewData, ReviewDataCompletionStatus, ChannelMetrics } from "@/lib/types/review-data"

export default function ReviewDataPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [reviewData, setReviewData] = useState<ReviewData | null>(null)
  const [completionStatus, setCompletionStatus] = useState<ReviewDataCompletionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  const restaurantId = "550e8400-e29b-41d4-a716-446655440000"

  useEffect(() => {
    loadReviewData()
  }, [])

  const loadReviewData = async (includeContent = false) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/review-data?restaurantId=${restaurantId}&includeContent=${includeContent}`)
      const data = await response.json()

      setReviewData(data)

      // Calculate completion status
      const status = calculateCompletionStatus(data)
      setCompletionStatus(status)
    } catch (error) {
      console.error("Error loading review data:", error)
      toast({
        title: "Error",
        description: "Failed to load review data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateCompletionStatus = (data: ReviewData): ReviewDataCompletionStatus => {
    const connectedChannels = data.channelMetrics.filter((c) => c.isConnected).length
    const successfulSyncs = data.channelMetrics.filter((c) => c.syncStatus === "success").length

    return {
      channelConnections: Math.min(100, connectedChannels * 25), // 4 channels = 100%
      syncSettings: successfulSyncs > 0 ? 100 : 0,
      responseTemplates: 0, // Will be implemented later
      testSync: data.lastUpdated && new Date(data.lastUpdated) > new Date(Date.now() - 24 * 60 * 60 * 1000) ? 100 : 0,
      overall: Math.round(
        Math.min(100, connectedChannels * 25) * 0.4 +
          (successfulSyncs > 0 ? 100 : 0) * 0.2 +
          0 * 0.2 + // response templates
          (data.lastUpdated && new Date(data.lastUpdated) > new Date(Date.now() - 24 * 60 * 60 * 1000) ? 100 : 0) * 0.2,
      ),
    }
  }

  const handleSaveChannels = async (channels: ChannelMetrics[]) => {
    try {
      const updatedData = { ...reviewData!, channelMetrics: channels }

      const response = await fetch("/api/review-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewData: updatedData }),
      })

      const result = await response.json()

      if (result.success) {
        setReviewData(updatedData)
        setCompletionStatus(result.completionStatus)
        toast({
          title: "Success",
          description: "Channel connections saved successfully",
        })
      }
    } catch (error) {
      console.error("Error saving channels:", error)
      throw error
    }
  }

  const handleSyncChannel = async (channelId: string) => {
    try {
      setSyncing(true)
      const response = await fetch("/api/review-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewData: reviewData!,
          action: "sync_channel",
          channelId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        await loadReviewData(true) // Reload with content
        toast({
          title: "Sync Complete",
          description: `Synced ${result.totalSynced} reviews from ${result.channelId}`,
        })
      }
    } catch (error) {
      console.error("Error syncing channel:", error)
      throw error
    } finally {
      setSyncing(false)
    }
  }

  const handleSyncAll = async () => {
    try {
      setSyncing(true)
      const response = await fetch("/api/review-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewData: reviewData!,
          action: "sync_all",
        }),
      })

      const result = await response.json()

      if (result.success) {
        await loadReviewData(true) // Reload with content
        toast({
          title: "Sync Complete",
          description: `Synced ${result.totalNewReviews} total reviews from all channels`,
        })
      }
    } catch (error) {
      console.error("Error syncing all channels:", error)
      throw error
    } finally {
      setSyncing(false)
    }
  }

  const handleReplyToReview = async (reviewId: string, response: string) => {
    // Mock reply functionality
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (reviewData) {
      const updatedReviews = reviewData.allReviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              responseFromOwner: {
                id: `response_${Date.now()}`,
                content: response,
                timestamp: new Date().toISOString(),
                respondedBy: "Restaurant Owner",
                isAiGenerated: false,
              },
            }
          : review,
      )

      setReviewData({
        ...reviewData,
        allReviews: updatedReviews,
      })
    }
  }

  const handleLoadMoreReviews = async () => {
    // Mock load more functionality
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast({
      title: "More Reviews Loaded",
      description: "Additional reviews have been loaded",
    })
  }

  const handleMarkSessionAsRead = (sessionId: string) => {
    if (reviewData) {
      const updatedSessions = reviewData.newReviews.filter((session) => session.sessionId !== sessionId)
      setReviewData({
        ...reviewData,
        newReviews: updatedSessions,
      })

      toast({
        title: "Session Marked as Read",
        description: "New reviews session has been marked as read",
      })
    }
  }

  const handleViewReview = (reviewId: string) => {
    setActiveTab("content")
    // In a real app, this would scroll to or highlight the specific review
  }

  const getNextIncompleteSection = (status: ReviewDataCompletionStatus) => {
    if (status.channelConnections < 100) return "connections"
    if (status.syncSettings < 100) return "connections" // Sync is part of connections
    if (status.responseTemplates < 100) return "automation"
    if (status.testSync < 100) return "connections"
    return null
  }

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

  if (!reviewData || !completionStatus) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Review Data</h2>
          <p className="text-gray-600 mb-4">There was an error loading your review data.</p>
          <Button onClick={() => loadReviewData()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const connectedChannels = reviewData.channelMetrics.filter((c) => c.isConnected)
  const hasNewReviews = reviewData.newReviews.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-3 py-4 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Review Data Management</h1>
            <p className="text-sm text-gray-600">Collect and manage reviews from all your connected platforms</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadReviewData(true)}
              disabled={syncing}
              className="bg-transparent"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Setup Progress</CardTitle>
                <CardDescription>Complete your review data setup</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{completionStatus.overall}%</div>
                <div className="text-xs text-gray-600">Complete</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={completionStatus.overall} className="h-2" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {completionStatus.channelConnections === 100 ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Settings className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="text-sm font-medium">Channel Connections</div>
                <div className="text-xs text-gray-600">{completionStatus.channelConnections}%</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {completionStatus.syncSettings === 100 ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <RefreshCw className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="text-sm font-medium">Sync Settings</div>
                <div className="text-xs text-gray-600">{completionStatus.syncSettings}%</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {completionStatus.responseTemplates === 100 ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <MessageSquare className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="text-sm font-medium">Response Templates</div>
                <div className="text-xs text-gray-600">{completionStatus.responseTemplates}%</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {completionStatus.testSync === 100 ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Zap className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="text-sm font-medium">Test Sync</div>
                <div className="text-xs text-gray-600">{completionStatus.testSync}%</div>
              </div>
            </div>

            {completionStatus.overall < 100 && (
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    const nextSection = getNextIncompleteSection(completionStatus)
                    if (nextSection) setActiveTab(nextSection)
                  }}
                  className="flex items-center space-x-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Continue Setup</span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Connected Channels</p>
                  <p className="text-lg font-semibold">{connectedChannels.length}</p>
                </div>
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Total Reviews</p>
                  <p className="text-lg font-semibold">{reviewData.totalReviewCount}</p>
                </div>
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Overall Rating</p>
                  <div className="flex items-center space-x-1">
                    <p className="text-lg font-semibold">{reviewData.overallRating}</p>
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
                  <p className="text-xs text-gray-600 mb-1">New Reviews</p>
                  <p className="text-lg font-semibold">
                    {reviewData.newReviews.reduce((sum, session) => sum + session.summary.totalNewReviews, 0)}
                  </p>
                </div>
                <Bell className={`w-5 h-5 ${hasNewReviews ? "text-red-600" : "text-gray-600"}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="connections" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Connections</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="new-reviews" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">New</span>
              {hasNewReviews && (
                <Badge variant="destructive" className="ml-1 text-xs">
                  {reviewData.newReviews.reduce((sum, session) => sum + session.summary.totalNewReviews, 0)}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Channel Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Channel Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reviewData.channelMetrics
                    .filter((c) => c.isConnected)
                    .map((channel) => (
                      <div
                        key={channel.channelId}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={channel.channelLogo || "/placeholder.svg?height=24&width=24&query=platform+logo"}
                            alt={channel.channelName}
                            className="w-6 h-6"
                          />
                          <div>
                            <p className="font-medium text-sm">{channel.channelName}</p>
                            <p className="text-xs text-gray-600">{channel.ratingCount} reviews</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{channel.avgRating.toFixed(1)}</span>
                          </div>
                          <p className="text-xs text-gray-600">{new Date(channel.lastSyncTime).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {reviewData.allReviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="flex items-start space-x-3 p-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">{review.customerName.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{review.customerName}</p>
                        <div className="flex items-center space-x-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">{review.content}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="connections">
            <ChannelConnectionsForm
              initialData={reviewData.channelMetrics}
              onSave={handleSaveChannels}
              onSync={handleSyncChannel}
              onSyncAll={handleSyncAll}
            />
          </TabsContent>

          <TabsContent value="content">
            <ReviewContentViewer
              reviews={reviewData.allReviews}
              channels={reviewData.channelMetrics}
              onReply={handleReplyToReview}
              onLoadMore={handleLoadMoreReviews}
              hasMore={true}
            />
          </TabsContent>

          <TabsContent value="new-reviews">
            <NewReviewsSession
              sessionData={reviewData.newReviews}
              onMarkAsRead={handleMarkSessionAsRead}
              onViewReview={handleViewReview}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
