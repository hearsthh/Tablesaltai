"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, Heart, DollarSign, Target, Calendar, Brain } from "lucide-react"
import { Navigation } from "@/components/navigation"

export default function AnalyticsPage() {
  const router = useRouter()

  const performanceMetrics = [
    { title: "Total Reach", value: "12.5K", change: "+18%", icon: Eye, color: "text-blue-600" },
    { title: "Engagement Rate", value: "4.2%", change: "+0.8%", icon: Heart, color: "text-pink-600" },
    { title: "Click-through Rate", value: "2.8%", change: "+0.5%", icon: Target, color: "text-green-600" },
    { title: "ROI", value: "+35%", change: "+12%", icon: DollarSign, color: "text-purple-600" },
  ]

  const platformPerformance = [
    { platform: "Instagram", posts: 12, reach: "8.5K", engagement: "6.8%", roi: "+42%" },
    { platform: "Facebook", posts: 8, reach: "4.2K", engagement: "3.1%", roi: "+28%" },
    { platform: "Twitter", posts: 4, reach: "2.5K", engagement: "2.3%", roi: "+15%" },
  ]

  const topContent = [
    {
      title: "Weekend Special Promotion",
      platform: "Instagram",
      reach: "2.1K",
      engagement: "8.5%",
      type: "Image Post",
    },
    {
      title: "Behind the Scenes - Chef's Special",
      platform: "Facebook",
      reach: "1.8K",
      engagement: "7.2%",
      type: "Video Post",
    },
    {
      title: "Customer Review Highlight",
      platform: "Twitter",
      reach: "1.2K",
      engagement: "5.8%",
      type: "Text Post",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Clean Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/marketing")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketing
            </Button>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Performance Analytics</h1>
              <p className="text-slate-600">Track and analyze your marketing performance with AI insights</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Last 30 Days
              </Button>
              <Button className="flex items-center bg-slate-900 hover:bg-slate-800">
                <Brain className="w-4 h-4 mr-2" />
                AI Insights
              </Button>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {performanceMetrics.map((metric, index) => (
            <Card key={index} className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-900">{metric.value}</div>
                    <div className="text-sm text-slate-600">{metric.title}</div>
                    <div className="text-xs text-green-600 font-medium">{metric.change}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Platform Performance */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
                <CardDescription>Compare performance across different social media platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformPerformance.map((platform, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                          <span className="font-medium text-slate-900">{platform.platform.charAt(0)}</span>
                        </div>
                        <div>
                          <span className="font-medium text-slate-900">{platform.platform}</span>
                          <div className="text-sm text-slate-600">{platform.posts} posts</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <div className="font-medium text-slate-900">{platform.reach}</div>
                          <div className="text-slate-600">Reach</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-slate-900">{platform.engagement}</div>
                          <div className="text-slate-600">Engagement</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-green-600">{platform.roi}</div>
                          <div className="text-slate-600">ROI</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Content */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Top Performing Content</CardTitle>
                <CardDescription>Your best performing posts this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topContent.map((content, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 mb-1">{content.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <span>{content.platform}</span>
                          <span>•</span>
                          <span>{content.type}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <div className="font-medium text-slate-900">{content.reach}</div>
                          <div className="text-slate-600">Reach</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-slate-900">{content.engagement}</div>
                          <div className="text-slate-600">Engagement</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Insights */}
            <Card className="border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-white rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Peak Performance</h4>
                  <p className="text-xs text-slate-600">Your posts perform 40% better on weekends</p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Content Recommendation</h4>
                  <p className="text-xs text-slate-600">Video content gets 3x more engagement</p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Budget Optimization</h4>
                  <p className="text-xs text-slate-600">Reallocate 20% budget to Instagram for better ROI</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Posts Published</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">New Followers</span>
                  <span className="font-medium">+156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Total Engagement</span>
                  <span className="font-medium">2.1K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Revenue Generated</span>
                  <span className="font-medium text-green-600">₹45.2K</span>
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Export Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm">
                  Download PDF Report
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  Export to Excel
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  Share Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
