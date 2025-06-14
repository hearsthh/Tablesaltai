"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/logo"
import {
  Users,
  TrendingUp,
  Globe,
  Menu,
  ArrowRight,
  BarChart3,
  DollarSign,
  Target,
  PenTool,
  Zap,
  UserCheck,
  AlertTriangle,
  Star,
  Clock,
  CheckCircle,
  Lightbulb,
} from "lucide-react"
import { useMarketingStore } from "@/lib/store/marketing-store"
import { useCustomerStore } from "@/lib/store/customer-store"

export default function DashboardPage() {
  const router = useRouter()
  const { campaigns, strategies, socialMediaPosts, offers } = useMarketingStore()
  const { customers, churnAnalysis } = useCustomerStore()

  // Calculate overall metrics
  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0)
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0)
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length
  const totalCustomers = customers.length
  const avgCustomerLTV = customers.reduce((sum, c) => sum + c.metrics.ltv, 0) / customers.length

  const overviewMetrics = [
    {
      title: "Total Revenue Impact",
      value: `₹${Math.round((avgCustomerLTV * totalCustomers) / 1000)}K`,
      change: "+24%",
      changeType: "positive",
      icon: DollarSign,
      color: "bg-green-50 text-green-700",
      description: "Generated through AI optimization",
    },
    {
      title: "Active Campaigns",
      value: activeCampaigns.toString(),
      change: "+3",
      changeType: "positive",
      icon: Target,
      color: "bg-blue-50 text-blue-700",
      description: "Marketing campaigns running",
    },
    {
      title: "Customer Growth",
      value: `+${churnAnalysis.newCustomers}`,
      change: "+18%",
      changeType: "positive",
      icon: UserCheck,
      color: "bg-purple-50 text-purple-700",
      description: "New customers this month",
    },
    {
      title: "AI Efficiency Score",
      value: "94%",
      change: "+12%",
      changeType: "positive",
      icon: Zap,
      color: "bg-orange-50 text-orange-700",
      description: "Marketing automation efficiency",
    },
  ]

  const moduleOverview = [
    {
      title: "Profile Management",
      description: "Restaurant profile and online presence",
      icon: Users,
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      stats: {
        completion: "95%",
        reviews: "4.8★",
        visibility: "High",
      },
      href: "/profile",
      status: "Optimized",
      statusColor: "bg-green-100 text-green-700",
    },
    {
      title: "Marketing Hub",
      description: "AI-powered marketing campaigns and content",
      icon: Target,
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
      stats: {
        campaigns: `${activeCampaigns} Active`,
        reach: "12.5K",
        engagement: "4.2%",
      },
      href: "/marketing",
      status: "Active",
      statusColor: "bg-blue-100 text-blue-700",
    },
    {
      title: "Customer Intelligence",
      description: "Customer insights and relationship management",
      icon: BarChart3,
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
      stats: {
        customers: totalCustomers.toString(),
        retention: `${churnAnalysis.retentionRate}%`,
        ltv: `₹${Math.round(avgCustomerLTV / 1000)}K`,
      },
      href: "/customers",
      status: "Growing",
      statusColor: "bg-purple-100 text-purple-700",
    },
  ]

  const recentActivities = [
    {
      title: "AI generated 5 social media posts",
      type: "content",
      time: "2 hours ago",
      module: "Marketing Hub",
      icon: PenTool,
      color: "text-blue-600",
    },
    {
      title: "New customer segment identified",
      type: "insight",
      time: "4 hours ago",
      module: "Customer Intelligence",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Campaign performance improved by 15%",
      type: "optimization",
      time: "6 hours ago",
      module: "Marketing Hub",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Profile optimization completed",
      type: "update",
      time: "1 day ago",
      module: "Profile Management",
      icon: CheckCircle,
      color: "text-blue-600",
    },
    {
      title: "Churn risk alert for 3 customers",
      type: "alert",
      time: "2 days ago",
      module: "Customer Intelligence",
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ]

  const aiInsights = [
    {
      title: "Revenue Opportunity",
      description: "Targeting dormant customers could generate ₹45K additional revenue this month.",
      action: "Create Reactivation Campaign",
      color: "bg-green-50 border-green-200",
      textColor: "text-green-800",
      href: "/customers/churn",
    },
    {
      title: "Content Performance",
      description: "Food photography posts are performing 45% better than text-only posts.",
      action: "Generate Visual Content",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-800",
      href: "/marketing/ai-content",
    },
    {
      title: "Customer Behavior",
      description: "VIP customers prefer evening dining. Schedule targeted promotions for 6-8 PM.",
      action: "Schedule Campaigns",
      color: "bg-purple-50 border-purple-200",
      textColor: "text-purple-800",
      href: "/marketing/calendar",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Logo size="md" />
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-8">
                <Button variant="ghost" className="text-slate-900 font-medium rounded-md">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="text-slate-500 rounded-md" onClick={() => router.push("/profile")}>
                  <Users className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button variant="ghost" className="text-slate-500 rounded-md" onClick={() => router.push("/marketing")}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Marketing
                </Button>
                <Button variant="ghost" className="text-slate-500 rounded-md" onClick={() => router.push("/customers")}>
                  <Users className="w-4 h-4 mr-2" />
                  Customers
                </Button>
                <Button variant="ghost" className="text-slate-500 rounded-md">
                  <Globe className="w-4 h-4 mr-2" />
                  Integrations
                </Button>
              </nav>
              <Button variant="ghost" size="icon" className="md:hidden rounded-md">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base">
                AI-powered insights and performance overview
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="flex items-center rounded-md border-slate-200 text-sm"
                onClick={() => router.push("/reports")}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">View Reports</span>
                <span className="sm:hidden">Reports</span>
              </Button>
              <Button
                className="flex items-center bg-slate-900 hover:bg-slate-800 rounded-md text-sm"
                onClick={() => router.push("/marketing/ai-content")}
              >
                <Zap className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">AI Assistant</span>
                <span className="sm:hidden">AI Assistant</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {overviewMetrics.map((metric, index) => (
            <Card key={index} className="border-slate-200">
              <CardContent className="p-4">
                <div className={`p-3 rounded-lg ${metric.color}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-md bg-white/50 flex items-center justify-center">
                      <metric.icon className="w-4 h-4" />
                    </div>
                    <div
                      className={`text-xs font-medium ${
                        metric.changeType === "positive" ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {metric.change}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</div>
                  <div className="text-sm text-slate-600 mb-1">{metric.title}</div>
                  <div className="text-xs text-slate-500">{metric.description}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Module Overview */}
        <Card className="mb-8 border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl">Module Overview</CardTitle>
            <CardDescription>Performance summary across all TableSalt AI modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {moduleOverview.map((module, index) => (
                <div
                  key={index}
                  className={`p-6 border rounded-lg hover:shadow-sm transition-all duration-200 cursor-pointer group ${module.color}`}
                  onClick={() => router.push(module.href)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/50 rounded-md flex items-center justify-center group-hover:bg-white/70 transition-colors">
                        <module.icon className={`w-6 h-6 ${module.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{module.title}</h3>
                        <Badge className={`mt-1 ${module.statusColor}`} variant="secondary">
                          {module.status}
                        </Badge>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </div>

                  <p className="text-sm text-slate-600 mb-4">{module.description}</p>

                  <div className="space-y-2">
                    {Object.entries(module.stats).map(([key, value], statIndex) => (
                      <div key={statIndex} className="flex justify-between text-sm">
                        <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                        <span className="font-medium text-slate-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Insights */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  AI-Powered Insights
                </CardTitle>
                <CardDescription>Actionable recommendations to grow your business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg cursor-pointer hover:shadow-sm transition-all ${insight.color}`}
                    onClick={() => router.push(insight.href)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`font-medium ${insight.textColor}`}>{insight.title}</h4>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className={`text-sm mb-3 ${insight.textColor}`}>{insight.description}</p>
                    <Button size="sm" variant="outline" className="text-xs">
                      {insight.action}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl">Performance Summary</CardTitle>
                <CardDescription>Key metrics across all modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-900">Marketing Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Campaign ROI</span>
                        <span className="font-medium text-green-600">+24%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Content Engagement</span>
                        <span className="font-medium text-green-600">+32%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Lead Generation</span>
                        <span className="font-medium text-green-600">+18%</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-900">Customer Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Retention Rate</span>
                        <span className="font-medium">{churnAnalysis.retentionRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Avg LTV</span>
                        <span className="font-medium">₹{Math.round(avgCustomerLTV / 1000)}K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Churn Risk</span>
                        <span className="font-medium text-red-600">Low</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-900">AI Efficiency</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Content Generated</span>
                        <span className="font-medium">156 items</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Time Saved</span>
                        <span className="font-medium">45 hours</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Automation Score</span>
                        <span className="font-medium text-green-600">94%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activities */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 break-words">{activity.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-slate-500">{activity.module}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-400">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-md border-slate-200"
                  onClick={() => router.push("/marketing/ai-content")}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Content
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-md border-slate-200"
                  onClick={() => router.push("/marketing/campaigns")}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-md border-slate-200"
                  onClick={() => router.push("/customers/segmentation")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Analyze Customers
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-md border-slate-200"
                  onClick={() => router.push("/profile")}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Update Profile
                </Button>
              </CardContent>
            </Card>

            {/* Budget Overview */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Budget Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Monthly Budget</span>
                    <span className="font-medium">₹{totalBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Spent</span>
                    <span className="font-medium">₹{totalSpent.toLocaleString()}</span>
                  </div>
                  <Progress value={(totalSpent / totalBudget) * 100} className="h-2" />
                  <div className="text-xs text-slate-500">
                    {Math.round((totalSpent / totalBudget) * 100)}% of budget used
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-md border-slate-200"
                  onClick={() => router.push("/marketing/performance/budget")}
                >
                  Manage Budget
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
