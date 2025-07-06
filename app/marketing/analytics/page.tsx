"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { usePerformanceMetrics } from "@/hooks/use-performance-metrics"
import { PerformanceFunnel } from "@/components/marketing/performance-funnel"
import { BarChart3, TrendingUp, TrendingDown, Target, DollarSign, Eye, MessageSquare, RefreshCw } from "lucide-react"

export default function MarketingAnalyticsPage() {
  const { metrics, loading, error } = usePerformanceMetrics()
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d")

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toLocaleString()
  }

  const formatCurrency = (amount: number) => {
    return `₹${formatNumber(amount)}`
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "positive":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "negative":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <BarChart3 className="w-4 h-4 text-blue-600" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "positive":
        return "bg-green-50 border-green-200 text-green-800"
      case "negative":
        return "bg-red-50 border-red-200 text-red-800"
      default:
        return "bg-blue-50 border-blue-200 text-blue-800"
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-gray-600">Loading analytics data...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-600 mb-2">Error loading analytics data</div>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-gray-600">No analytics data available</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Marketing Analytics</h1>
            <p className="text-gray-600">Track and analyze your marketing performance across all channels</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Reach</p>
                      <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.totalReach)}</p>
                      <p className="text-xs text-green-600 mt-1">+{metrics.growthRate}% vs last period</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Eye className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Engagement</p>
                      <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.totalEngagement)}</p>
                      <p className="text-xs text-blue-600 mt-1">{metrics.conversionRate}% engagement rate</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Conversions</p>
                      <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.totalConversions)}</p>
                      <p className="text-xs text-purple-600 mt-1">
                        {formatCurrency(metrics.costPerConversion)} per conversion
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Spend</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalSpend)}</p>
                      <p className="text-xs text-orange-600 mt-1">{metrics.averageROI}x average ROI</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Funnel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceFunnel
                data={{
                  reach: metrics.totalReach,
                  engagement: metrics.totalEngagement,
                  conversions: metrics.totalConversions,
                  spend: metrics.totalSpend,
                  roi: metrics.averageROI,
                }}
                title="Overall Performance Funnel"
                showTrends={true}
              />

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Top Performers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900">Best Channel</p>
                      <p className="text-sm text-green-700">{metrics.topPerformingChannel}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Top Reach</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-900">Best Campaign</p>
                      <p className="text-sm text-blue-700">{metrics.topPerformingCampaign}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Top ROI</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium text-purple-900">Growth Rate</p>
                      <p className="text-sm text-purple-700">+{metrics.growthRate}% this period</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">Trending Up</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="channels" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {metrics.channelPerformance?.map((channel, index) => (
                <Card key={index} className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg capitalize flex items-center justify-between">
                      {channel.channel}
                      <Badge variant="outline" className="bg-white">
                        {channel.roi}x ROI
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Reach:</span>
                        <div className="font-medium">{formatNumber(channel.reach)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Engagement:</span>
                        <div className="font-medium">{formatNumber(channel.engagement)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Conversions:</span>
                        <div className="font-medium">{formatNumber(channel.conversions)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Conv. Rate:</span>
                        <div className="font-medium">{((channel.conversions / channel.reach) * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) || <div className="col-span-3 text-center text-gray-600">No channel performance data available</div>}
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-600 py-8">
                  Campaign performance data will be displayed here once campaigns are created and running.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="space-y-4">
              {metrics.insights?.map((insight, index) => (
                <Card key={index} className={`border-0 shadow-sm ${getInsightColor(insight.type)}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">{getInsightIcon(insight.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{insight.message}</h3>
                          <Badge className={getPriorityColor(insight.priority)}>{insight.priority} priority</Badge>
                        </div>
                        {insight.recommendation && <p className="text-sm opacity-80 mb-3">{insight.recommendation}</p>}
                        <Button variant="outline" size="sm" className="bg-white">
                          Take Action
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) || (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="text-center text-gray-600">
                      No insights available at the moment. Check back after your campaigns have been running for a
                      while.
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
