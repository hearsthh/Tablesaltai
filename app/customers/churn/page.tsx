"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import {
  ArrowLeft,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  Gift,
  Target,
  Search,
  Filter,
} from "lucide-react"
import { useCustomerStore } from "@/lib/store/customer-store"

export default function ChurnManagementPage() {
  const router = useRouter()
  const { customers, churnAnalysis } = useCustomerStore()
  const [selectedSegment, setSelectedSegment] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const churnMetrics = [
    {
      title: "Retention Rate",
      value: `${churnAnalysis.retentionRate}%`,
      change: "+2.3%",
      changeType: "positive",
      icon: CheckCircle,
      color: "bg-green-50 text-green-700",
    },
    {
      title: "Churn Rate",
      value: `${100 - churnAnalysis.retentionRate}%`,
      change: "-1.2%",
      changeType: "negative",
      icon: TrendingDown,
      color: "bg-red-50 text-red-700",
    },
    {
      title: "At Risk Customers",
      value: customers.filter((c) => c.metrics.churnRisk === "high").length.toString(),
      change: "-3",
      changeType: "negative",
      icon: AlertTriangle,
      color: "bg-orange-50 text-orange-700",
    },
    {
      title: "Avg Days to Churn",
      value: "45",
      change: "+5",
      changeType: "positive",
      icon: Clock,
      color: "bg-blue-50 text-blue-700",
    },
  ]

  const customerLifecycleData = [
    {
      stage: "New Customers",
      count: churnAnalysis.newCustomers,
      percentage: Math.round((churnAnalysis.newCustomers / customers.length) * 100),
      color: "bg-blue-500",
      description: "Customers acquired in the last 30 days",
      actions: ["Welcome Campaign", "Onboarding Flow", "First Purchase Incentive"],
    },
    {
      stage: "Active Customers",
      count: churnAnalysis.activeCustomers,
      percentage: Math.round((churnAnalysis.activeCustomers / customers.length) * 100),
      color: "bg-green-500",
      description: "Regular customers with recent activity",
      actions: ["Loyalty Program", "Upselling", "Referral Rewards"],
    },
    {
      stage: "Dormant Customers",
      count: churnAnalysis.dormantCustomers,
      percentage: Math.round((churnAnalysis.dormantCustomers / customers.length) * 100),
      color: "bg-yellow-500",
      description: "Customers with no activity in 30-90 days",
      actions: ["Reactivation Campaign", "Special Offers", "Feedback Survey"],
    },
    {
      stage: "Churned Customers",
      count: churnAnalysis.churnedCustomers,
      percentage: Math.round((churnAnalysis.churnedCustomers / customers.length) * 100),
      color: "bg-red-500",
      description: "Customers with no activity in 90+ days",
      actions: ["Win-back Campaign", "Exit Survey", "Competitive Analysis"],
    },
  ]

  const atRiskCustomers = customers.filter((c) => c.metrics.churnRisk === "high").slice(0, 10)

  const reactivationStrategies = [
    {
      title: "Personalized Email Campaign",
      description: "Send targeted emails based on past preferences and behavior",
      successRate: "32%",
      estimatedRevenue: "₹25,000",
      timeframe: "2 weeks",
      icon: Mail,
      color: "bg-blue-50 border-blue-200",
    },
    {
      title: "Special Discount Offers",
      description: "Offer exclusive discounts to dormant customers",
      successRate: "28%",
      estimatedRevenue: "₹18,000",
      timeframe: "1 week",
      icon: Gift,
      color: "bg-green-50 border-green-200",
    },
    {
      title: "SMS Reactivation",
      description: "Quick SMS reminders with limited-time offers",
      successRate: "24%",
      estimatedRevenue: "₹12,000",
      timeframe: "3 days",
      icon: MessageSquare,
      color: "bg-purple-50 border-purple-200",
    },
    {
      title: "Retargeting Ads",
      description: "Social media and Google ads targeting dormant customers",
      successRate: "18%",
      estimatedRevenue: "₹15,000",
      timeframe: "4 weeks",
      icon: Target,
      color: "bg-orange-50 border-orange-200",
    },
  ]

  const filteredCustomers = atRiskCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())

    if (selectedSegment === "all") return matchesSearch
    return matchesSearch && customer.segment.toLowerCase() === selectedSegment
  })

  const getChurnRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="rounded-md" onClick={() => router.push("/customers")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Churn Management</h1>
                <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Monitor customer lifecycle and prevent churn with AI insights
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="flex items-center rounded-md border-slate-200 text-sm"
                onClick={() => router.push("/customers/insights")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                AI Insights
              </Button>
              <Button
                className="flex items-center bg-slate-900 hover:bg-slate-800 rounded-md text-sm"
                onClick={() => router.push("/marketing/campaigns")}
              >
                <Mail className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          </div>
        </div>

        {/* Churn Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {churnMetrics.map((metric, index) => (
            <Card key={index} className="border-slate-200">
              <CardContent className="p-3 sm:p-4">
                <div className={`p-2 sm:p-3 rounded-lg ${metric.color}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md bg-white/50 flex items-center justify-center">
                      <metric.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-slate-900">{metric.value}</div>
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

        {/* Customer Lifecycle */}
        <Card className="mb-8 border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl">Customer Lifecycle Analysis</CardTitle>
            <CardDescription>Distribution of customers across different lifecycle stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {customerLifecycleData.map((stage, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${stage.color}`}></div>
                      <div>
                        <h3 className="font-medium text-slate-900">{stage.stage}</h3>
                        <p className="text-sm text-slate-600">{stage.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-900">{stage.count}</div>
                      <div className="text-sm text-slate-600">{stage.percentage}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${stage.color}`} style={{ width: `${stage.percentage}%` }}></div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {stage.actions.map((action, actionIndex) => (
                      <Badge key={actionIndex} variant="outline" className="text-xs">
                        {action}
                      </Badge>
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
            {/* At-Risk Customers */}
            <Card className="border-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">At-Risk Customers</CardTitle>
                    <CardDescription>Customers with high churn probability</CardDescription>
                  </div>
                  <Badge className="bg-red-100 text-red-700">{atRiskCustomers.length} customers</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by segment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Segments</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="occasional">Occasional</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Customer List */}
                <div className="space-y-4">
                  {filteredCustomers.map((customer, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                      <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-slate-700">
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium text-slate-900">{customer.name}</p>
                          <Badge className={getChurnRiskColor(customer.metrics.churnRisk)}>
                            {customer.metrics.churnRisk} risk
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span>Last visit: {customer.behavior.lastVisit}</span>
                          <span>•</span>
                          <span>LTV: ₹{customer.metrics.ltv.toLocaleString()}</span>
                          <span>•</span>
                          <span>Segment: {customer.segment}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="rounded-md">
                          <Mail className="w-3 h-3 mr-1" />
                          Email
                        </Button>
                        <Button size="sm" className="bg-slate-900 hover:bg-slate-800 rounded-md">
                          <Gift className="w-3 h-3 mr-1" />
                          Offer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Reactivation Strategies */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Reactivation Strategies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reactivationStrategies.map((strategy, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg cursor-pointer hover:shadow-sm transition-all ${strategy.color}`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-white/50 rounded-md flex items-center justify-center">
                        <strategy.icon className="w-4 h-4 text-slate-700" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 text-sm">{strategy.title}</h4>
                        <p className="text-xs text-slate-600">{strategy.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-600">Success Rate</span>
                        <p className="font-medium text-green-600">{strategy.successRate}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Est. Revenue</span>
                        <p className="font-medium text-slate-900">{strategy.estimatedRevenue}</p>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3 text-xs">
                      Launch Campaign
                    </Button>
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
                <Button variant="outline" className="w-full justify-start rounded-md border-slate-200">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Reactivation Email
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-md border-slate-200">
                  <Gift className="w-4 h-4 mr-2" />
                  Create Special Offer
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-md border-slate-200">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  SMS Campaign
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-md border-slate-200">
                  <Target className="w-4 h-4 mr-2" />
                  Retargeting Ads
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
