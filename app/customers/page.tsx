"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import {
  Users,
  ArrowRight,
  BarChart3,
  UserPlus,
  UserCheck,
  Target,
  Heart,
  DollarSign,
  TrendingDown,
  AlertTriangle,
  Star,
  Calendar,
  MapPin,
  TrendingUp,
  Sparkles,
  Brain,
} from "lucide-react"
import { useCustomerStore } from "@/lib/store/customer-store"
import { Navigation } from "@/components/navigation"

export default function CustomersPage() {
  const router = useRouter()
  const { customers, segments, churnAnalysis } = useCustomerStore()

  const customerMetrics = [
    {
      title: "Total Customers",
      value: customers.length.toString(),
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Active Customers",
      value: churnAnalysis.activeCustomers.toString(),
      change: "+8%",
      changeType: "positive",
      icon: UserCheck,
      color: "bg-green-50 text-green-700",
    },
    {
      title: "Avg Customer LTV",
      value: `₹${Math.round(customers.reduce((sum, c) => sum + c.metrics.ltv, 0) / customers.length).toLocaleString()}`,
      change: "+15%",
      changeType: "positive",
      icon: DollarSign,
      color: "bg-purple-50 text-purple-700",
    },
    {
      title: "Churn Risk",
      value: customers.filter((c) => c.metrics.churnRisk === "high").length.toString(),
      change: "-3%",
      changeType: "negative",
      icon: AlertTriangle,
      color: "bg-red-50 text-red-700",
    },
  ]

  const quickActions = [
    {
      title: "AI Customer Segmentation",
      description: "Smart segmentation with predictive analytics",
      icon: Target,
      href: "/customers/segmentation",
      color: "bg-blue-600 hover:bg-blue-700",
      aiFeature: "94% Accuracy",
    },
    {
      title: "Churn Prediction AI",
      description: "Predict and prevent customer churn",
      icon: TrendingDown,
      href: "/customers/churn",
      color: "bg-green-600 hover:bg-green-700",
      aiFeature: "60 Days Advance",
    },
    {
      title: "Smart Customer Profiles",
      description: "AI-enhanced customer insights and recommendations",
      icon: Users,
      href: "/customers/profiles",
      color: "bg-purple-600 hover:bg-purple-700",
      aiFeature: "Personalized",
    },
    {
      title: "AI Insights Dashboard",
      description: "Advanced analytics with growth recommendations",
      icon: BarChart3,
      href: "/customers/insights",
      color: "bg-orange-600 hover:bg-orange-700",
      aiFeature: "Real-time",
    },
  ]

  const topCustomers = customers.sort((a, b) => b.metrics.ltv - a.metrics.ltv).slice(0, 5)

  const recentActivity = [
    {
      customer: "Rajesh Kumar",
      action: "Made a purchase",
      amount: "₹1,250",
      time: "2 hours ago",
      type: "purchase",
    },
    {
      customer: "Priya Sharma",
      action: "Left a 5-star review",
      amount: "",
      time: "4 hours ago",
      type: "review",
    },
    {
      customer: "Amit Patel",
      action: "Joined loyalty program",
      amount: "",
      time: "1 day ago",
      type: "signup",
    },
    {
      customer: "Sneha Gupta",
      action: "Redeemed offer",
      amount: "₹500 saved",
      time: "2 days ago",
      type: "offer",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return <DollarSign className="w-4 h-4 text-green-600" />
      case "review":
        return <Star className="w-4 h-4 text-yellow-600" />
      case "signup":
        return <UserPlus className="w-4 h-4 text-blue-600" />
      case "offer":
        return <Heart className="w-4 h-4 text-pink-600" />
      default:
        return <Users className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Customer Management</h1>
              <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base">
                AI-powered customer insights and relationship management
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="flex items-center rounded-md border-slate-200 text-sm"
                onClick={() => router.push("/customers/insights")}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">AI Insights</span>
                <span className="sm:hidden">Insights</span>
              </Button>
              <Button
                className="flex items-center bg-slate-900 hover:bg-slate-800 rounded-md text-sm"
                onClick={() => router.push("/customers/profiles")}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Add Customer</span>
                <span className="sm:hidden">Add Customer</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Customer Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {customerMetrics.map((metric, index) => (
            <Card key={index} className="border-slate-200">
              <CardContent className="p-3 sm:p-4">
                <div className={`p-2 sm:p-3 rounded-lg ${metric.color}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md bg-white/50 flex items-center justify-center">
                      <metric.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                  <div className="text-base sm:text-lg lg:text-2xl font-bold text-slate-900">{metric.value}</div>
                  <div className="text-xs sm:text-sm text-slate-600 truncate">{metric.title}</div>
                  <div
                    className={`text-xs font-medium ${
                      metric.changeType === "positive" ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {metric.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Customer Intelligence */}
        <Card className="mb-6 sm:mb-8 border-slate-200 bg-gradient-to-r from-green-50 to-blue-50">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">AI Customer Intelligence</CardTitle>
                <CardDescription>Advanced AI analytics to understand and grow your customer base</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-slate-900">Smart Segmentation</span>
                </div>
                <p className="text-sm text-slate-600 mb-3">AI identifies 12 customer segments with 94% accuracy</p>
                <div className="text-xs text-green-600 font-medium">+28% Revenue Impact</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-900">Churn Prediction</span>
                </div>
                <p className="text-sm text-slate-600 mb-3">Predict customer churn 60 days in advance</p>
                <div className="text-xs text-blue-600 font-medium">89% Accuracy</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-slate-900">LTV Forecasting</span>
                </div>
                <p className="text-sm text-slate-600 mb-3">Predict customer lifetime value with AI models</p>
                <div className="text-xs text-purple-600 font-medium">₹2.3L Avg LTV</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-orange-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="w-5 h-5 text-orange-600" />
                  <span className="font-medium text-slate-900">Personalization</span>
                </div>
                <p className="text-sm text-slate-600 mb-3">AI-powered menu recommendations per customer</p>
                <div className="text-xs text-orange-600 font-medium">+42% Order Value</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cross-Module Integration */}
        <Card className="mb-6 sm:mb-8 border-slate-200 bg-gradient-to-r from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">AI Module Integration</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Connect customer insights with your profile and marketing strategies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <div className="flex items-center space-x-3 mb-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium text-slate-900 text-sm sm:text-base">Profile Optimization</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mb-4">
                  Use customer preferences to optimize your menu and restaurant profile for better engagement.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs sm:text-sm"
                    onClick={() => router.push("/profile/menu-builder")}
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Optimize Menu
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs sm:text-sm"
                    onClick={() => router.push("/profile/smart-profile")}
                  >
                    Update Profile
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-slate-900 text-sm sm:text-base">Targeted Marketing</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mb-4">
                  Create personalized marketing campaigns based on customer segments and behavior patterns.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-xs sm:text-sm"
                    onClick={() => router.push("/marketing/campaigns")}
                  >
                    <Brain className="w-3 h-3 mr-1" />
                    Create Campaign
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs sm:text-sm"
                    onClick={() => router.push("/marketing/content")}
                  >
                    Generate Content
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Segments Overview */}
        <Card className="mb-6 sm:mb-8 border-slate-200">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle className="text-lg sm:text-xl">Customer Segments</CardTitle>
                <CardDescription className="text-sm">Customer distribution across different segments</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-md border-slate-200 self-start sm:self-auto"
                onClick={() => router.push("/customers/segmentation")}
              >
                Manage Segments
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {segments.map((segment, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer hover:shadow-sm transition-all ${segment.color}`}
                  onClick={() => router.push(`/customers/segmentation?segment=${segment.id}`)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900">{segment.name}</h3>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{segment.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Customers</span>
                      <span className="font-medium">{segment.customerCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Avg LTV</span>
                      <span className="font-medium">₹{segment.avgLTV.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Avg Spend</span>
                      <span className="font-medium">₹{segment.avgSpend.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Quick Actions */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Customer Management Tools</CardTitle>
                <CardDescription className="text-sm">Access key customer management features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <div
                      key={index}
                      className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
                      onClick={() => router.push(action.href)}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900">{action.title}</h4>
                          <p className="text-sm text-slate-600">{action.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Customers */}
            <Card className="border-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Top Customers by LTV</CardTitle>
                    <CardDescription className="text-sm">Highest value customers</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-md border-slate-200"
                    onClick={() => router.push("/customers/profiles")}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCustomers.map((customer, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-slate-700">
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">{customer.name}</p>
                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                          <MapPin className="w-3 h-3" />
                          <span>{customer.demographics.location}</span>
                          <span>•</span>
                          <span>{customer.segment}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">₹{customer.metrics.ltv.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">LTV</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Churn Analysis */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingDown className="w-5 h-5 mr-2" />
                  Churn Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Retention Rate</span>
                    <span className="text-lg font-bold text-green-600">{churnAnalysis.retentionRate}%</span>
                  </div>
                  <Progress value={churnAnalysis.retentionRate} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-700">{churnAnalysis.activeCustomers}</div>
                    <div className="text-xs text-green-600">Active</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="text-lg font-bold text-orange-700">{churnAnalysis.newCustomers}</div>
                    <div className="text-xs text-orange-600">New</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="text-lg font-bold text-yellow-700">{churnAnalysis.dormantCustomers}</div>
                    <div className="text-xs text-yellow-600">Dormant</div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-700">{churnAnalysis.churnedCustomers}</div>
                    <div className="text-xs text-red-600">Churned</div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full rounded-md border-slate-200"
                  onClick={() => router.push("/customers/churn")}
                >
                  View Churn Details
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{activity.customer}</p>
                      <p className="text-xs text-slate-600">{activity.action}</p>
                      {activity.amount && <p className="text-xs font-medium text-green-600">{activity.amount}</p>}
                      <p className="text-xs text-slate-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 text-sm">Customer Acquisition</h4>
                  <p className="text-xs text-blue-800 mt-1">
                    Target 25-35 age group through social media. 68% higher conversion rate expected.
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 text-sm">Retention Strategy</h4>
                  <p className="text-xs text-green-800 mt-1">
                    Send personalized offers to dormant customers. Potential to reactivate 40% of them.
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 text-sm">Upselling Opportunity</h4>
                  <p className="text-xs text-purple-800 mt-1">
                    VIP customers show 85% interest in premium menu items. Launch exclusive offerings.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-md border-slate-200"
                  onClick={() => router.push("/customers/insights")}
                >
                  View All Insights
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
