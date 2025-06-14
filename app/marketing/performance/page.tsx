"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import {
  Users,
  TrendingUp,
  Globe,
  Menu,
  ArrowLeft,
  ArrowRight,
  Target,
  Megaphone,
  Gift,
  BarChart3,
  DollarSign,
  Zap,
  Eye,
  Settings,
} from "lucide-react"

export default function PerformanceMarketingPage() {
  const router = useRouter()

  const performanceModules = [
    {
      title: "Marketing Strategies",
      description: "AI-generated long-term marketing strategies and planning",
      icon: Target,
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      status: "active",
      stats: {
        strategies: "3 Active",
        progress: "65% Avg",
        budget: "₹85K Allocated",
      },
      href: "/marketing/strategies",
      actions: ["View Strategies", "Generate New", "Analytics"],
    },
    {
      title: "Campaign Management",
      description: "Create and manage paid and organic marketing campaigns",
      icon: Megaphone,
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
      status: "active",
      stats: {
        campaigns: "8 Active",
        spent: "₹18.5K",
        roi: "+24% ROI",
      },
      href: "/marketing/campaigns",
      actions: ["Create Campaign", "Manage Active", "Performance"],
    },
    {
      title: "Offers & Promotions",
      description: "Design and track special offers and promotional campaigns",
      icon: Gift,
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
      status: "active",
      stats: {
        offers: "5 Active",
        redemptions: "140 Total",
        revenue: "₹28K Generated",
      },
      href: "/marketing/offers",
      actions: ["Create Offer", "Track Performance", "Customer Segments"],
    },
    {
      title: "Analytics Dashboard",
      description: "Comprehensive performance analytics and reporting",
      icon: BarChart3,
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600",
      status: "active",
      stats: {
        reports: "12 Generated",
        insights: "8 AI Insights",
        tracking: "Real-time",
      },
      href: "/marketing/performance/analytics",
      actions: ["View Dashboard", "Generate Report", "Export Data"],
    },
  ]

  const performanceOverview = {
    totalBudget: 85000,
    budgetUsed: 62000,
    activeStrategies: 3,
    activeCampaigns: 8,
    activeOffers: 5,
    totalReach: "30.4K",
    avgEngagement: "6.1%",
    roi: "+24%",
    conversions: 234,
  }

  const activeCampaigns = [
    {
      name: "Diwali Festival Campaign",
      type: "Seasonal",
      budget: 15000,
      spent: 8500,
      reach: "8.2K",
      engagement: "5.4%",
      status: "active",
      endDate: "Nov 15, 2024",
    },
    {
      name: "Weekend Brunch Promotion",
      type: "Organic",
      budget: 5000,
      spent: 3200,
      reach: "4.1K",
      engagement: "6.2%",
      status: "active",
      endDate: "Nov 30, 2024",
    },
    {
      name: "New Menu Launch",
      type: "Paid",
      budget: 20000,
      spent: 12000,
      reach: "15.3K",
      engagement: "4.8%",
      status: "active",
      endDate: "Dec 10, 2024",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "setup":
        return "bg-amber-100 text-amber-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-semibold text-slate-900">TableSalt</span>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-8">
                <Button variant="ghost" className="text-slate-500 rounded-md" onClick={() => router.push("/profile")}>
                  <Users className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="text-slate-900 font-medium rounded-md"
                  onClick={() => router.push("/marketing")}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Marketing
                </Button>
                <Button variant="ghost" className="text-slate-500 rounded-md">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/marketing")} className="rounded-md">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketing Hub
            </Button>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-slate-900">Performance Marketing</h1>
              <p className="text-slate-600 mt-2">Strategies, campaigns, offers, and performance analytics</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex items-center rounded-md border-slate-200"
                onClick={() => router.push("/marketing/performance/analytics")}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics Dashboard
              </Button>
              <Button
                className="flex items-center bg-slate-900 hover:bg-slate-800 rounded-md"
                onClick={() => router.push("/marketing/strategies")}
              >
                <Zap className="w-4 h-4 mr-2" />
                Generate Strategy
              </Button>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{performanceOverview.activeStrategies}</div>
                <div className="text-sm text-slate-600">Active Strategies</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{performanceOverview.activeCampaigns}</div>
                <div className="text-sm text-slate-600">Active Campaigns</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">
                  ₹{(performanceOverview.budgetUsed / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-slate-600">Budget Used</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{performanceOverview.roi}</div>
                <div className="text-sm text-slate-600">ROI</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Performance Modules */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl">Performance Marketing Modules</CardTitle>
                <CardDescription>Comprehensive tools for performance-driven marketing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {performanceModules.map((module, index) => (
                    <div
                      key={index}
                      className={`p-6 border rounded-lg hover:shadow-sm transition-all duration-200 cursor-pointer group ${module.color}`}
                      onClick={() => router.push(module.href)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white/50 rounded-md flex items-center justify-center group-hover:bg-white/70 transition-colors">
                            <module.icon className={`w-5 h-5 ${module.iconColor}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{module.title}</h3>
                            <Badge className={getStatusColor(module.status)} variant="secondary">
                              {module.status}
                            </Badge>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                      </div>

                      <p className="text-sm text-slate-600 mb-4">{module.description}</p>

                      <div className="space-y-2 mb-4">
                        {Object.entries(module.stats).map(([key, value], statIndex) => (
                          <div key={statIndex} className="flex justify-between text-sm">
                            <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                            <span className="font-medium text-slate-900">{value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {module.actions.slice(0, 2).map((action, actionIndex) => (
                          <Badge key={actionIndex} variant="outline" className="text-xs">
                            {action}
                          </Badge>
                        ))}
                        {module.actions.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{module.actions.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Campaigns Preview */}
            <Card className="border-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Active Campaigns</CardTitle>
                    <CardDescription>Monitor your running marketing campaigns</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-md border-slate-200"
                    onClick={() => router.push("/marketing/campaigns")}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeCampaigns.map((campaign, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-slate-900">{campaign.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {campaign.type}
                            </Badge>
                            <span className="text-xs text-slate-500">Ends {campaign.endDate}</span>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <span className="text-xs text-slate-500">Budget</span>
                          <p className="font-medium text-sm">₹{campaign.budget.toLocaleString()}</p>
                          <p className="text-xs text-slate-500">₹{campaign.spent.toLocaleString()} spent</p>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500">Reach</span>
                          <p className="font-medium text-sm">{campaign.reach}</p>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500">Engagement</span>
                          <p className="font-medium text-sm">{campaign.engagement}</p>
                        </div>
                        <div className="flex justify-start lg:justify-end">
                          <Button size="sm" variant="outline" className="rounded-md border-slate-200">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
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
            {/* Budget Overview */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Budget Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-900">
                    ₹{(performanceOverview.totalBudget / 1000).toFixed(0)}K
                  </div>
                  <div className="text-sm text-blue-600">Total Allocated</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">
                    ₹{(performanceOverview.budgetUsed / 1000).toFixed(0)}K
                  </div>
                  <div className="text-sm text-green-600">Budget Used</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-900">{performanceOverview.roi}</div>
                  <div className="text-sm text-purple-600">Return on Investment</div>
                </div>
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
                  onClick={() => router.push("/marketing/strategies")}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Generate Strategy
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-md border-slate-200"
                  onClick={() => router.push("/marketing/campaigns")}
                >
                  <Megaphone className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-md border-slate-200"
                  onClick={() => router.push("/marketing/offers")}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Create Offer
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-md border-slate-200">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-md border-slate-200">
                  <Settings className="w-4 h-4 mr-2" />
                  Budget Settings
                </Button>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Performance Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 text-sm">Top Performer</h4>
                  <p className="text-xs text-green-800 mt-1">
                    Diwali Campaign is generating 32% higher engagement than average. Consider extending the budget.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 text-sm">Optimization Tip</h4>
                  <p className="text-xs text-blue-800 mt-1">
                    Weekend campaigns show 45% better conversion rates. Schedule more promotions for weekends.
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <h4 className="font-medium text-amber-900 text-sm">Budget Alert</h4>
                  <p className="text-xs text-amber-800 mt-1">
                    73% of monthly budget used with 8 days remaining. Monitor spending closely.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
