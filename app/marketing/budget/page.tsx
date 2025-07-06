"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react"
import { Navigation } from "@/components/navigation"

interface BudgetData {
  totalBudget: number
  totalSpent: number
  remainingBudget: number
  monthlyBudget: number
  monthlySpent: number
  campaigns: CampaignBudget[]
  channels: ChannelBudget[]
  monthlyBreakdown: MonthlyBudget[]
  alerts: BudgetAlert[]
}

interface CampaignBudget {
  id: string
  name: string
  totalBudget: number
  spent: number
  remaining: number
  status: "active" | "paused" | "completed"
  startDate: string
  endDate: string
  dailySpend: number
  projectedSpend: number
  roi: number
  channels: string[]
}

interface ChannelBudget {
  id: string
  name: string
  allocated: number
  spent: number
  remaining: number
  cpm: number
  cpc: number
  conversions: number
  roi: number
}

interface MonthlyBudget {
  month: string
  budget: number
  spent: number
  campaigns: number
  roi: number
}

interface BudgetAlert {
  id: string
  type: "overspend" | "underspend" | "target_reached" | "low_budget"
  message: string
  campaign?: string
  severity: "low" | "medium" | "high"
  date: string
}

export default function BudgetManagementPage() {
  const router = useRouter()
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // Mock budget data
  const mockBudgetData: BudgetData = {
    totalBudget: 45000,
    totalSpent: 28500,
    remainingBudget: 16500,
    monthlyBudget: 15000,
    monthlySpent: 9200,
    campaigns: [
      {
        id: "1",
        name: "Diwali Festival Special",
        totalBudget: 25000,
        spent: 18750,
        remaining: 6250,
        status: "active",
        startDate: "2024-10-20",
        endDate: "2024-11-05",
        dailySpend: 1250,
        projectedSpend: 23000,
        roi: 2.8,
        channels: ["Instagram", "Facebook", "Google Ads"],
      },
      {
        id: "2",
        name: "Weekend Brunch Launch",
        totalBudget: 8000,
        spent: 3200,
        remaining: 4800,
        status: "active",
        startDate: "2024-11-01",
        endDate: "2024-11-30",
        dailySpend: 200,
        projectedSpend: 6000,
        roi: 1.9,
        channels: ["Instagram", "Facebook"],
      },
      {
        id: "3",
        name: "Customer Loyalty Program",
        totalBudget: 12000,
        spent: 6550,
        remaining: 5450,
        status: "active",
        startDate: "2024-10-15",
        endDate: "2024-12-15",
        dailySpend: 150,
        projectedSpend: 9000,
        roi: 3.2,
        channels: ["Email", "WhatsApp", "SMS"],
      },
    ],
    channels: [
      {
        id: "instagram",
        name: "Instagram Ads",
        allocated: 15000,
        spent: 9800,
        remaining: 5200,
        cpm: 45,
        cpc: 2.8,
        conversions: 156,
        roi: 2.4,
      },
      {
        id: "facebook",
        name: "Facebook Ads",
        allocated: 12000,
        spent: 7200,
        remaining: 4800,
        cpm: 38,
        cpc: 2.2,
        conversions: 134,
        roi: 2.1,
      },
      {
        id: "google",
        name: "Google Ads",
        allocated: 10000,
        spent: 6500,
        remaining: 3500,
        cpm: 52,
        cpc: 3.5,
        conversions: 89,
        roi: 2.8,
      },
      {
        id: "email",
        name: "Email Marketing",
        allocated: 3000,
        spent: 1800,
        remaining: 1200,
        cpm: 12,
        cpc: 0.8,
        conversions: 67,
        roi: 4.2,
      },
      {
        id: "sms",
        name: "SMS Marketing",
        allocated: 2000,
        spent: 1200,
        remaining: 800,
        cpm: 8,
        cpc: 0.5,
        conversions: 45,
        roi: 3.8,
      },
      {
        id: "whatsapp",
        name: "WhatsApp Business",
        allocated: 3000,
        spent: 2000,
        remaining: 1000,
        cpm: 15,
        cpc: 1.2,
        conversions: 78,
        roi: 3.5,
      },
    ],
    monthlyBreakdown: [
      { month: "Aug 2024", budget: 12000, spent: 11200, campaigns: 3, roi: 2.1 },
      { month: "Sep 2024", budget: 14000, spent: 13800, campaigns: 4, roi: 2.4 },
      { month: "Oct 2024", budget: 15000, spent: 14200, campaigns: 5, roi: 2.7 },
      { month: "Nov 2024", budget: 15000, spent: 9200, campaigns: 3, roi: 2.8 },
    ],
    alerts: [
      {
        id: "1",
        type: "overspend",
        message: "Diwali Festival Special campaign is 15% over daily budget",
        campaign: "Diwali Festival Special",
        severity: "medium",
        date: "2024-11-02",
      },
      {
        id: "2",
        type: "target_reached",
        message: "Instagram Ads reached 65% of monthly budget",
        severity: "low",
        date: "2024-11-01",
      },
      {
        id: "3",
        type: "low_budget",
        message: "Google Ads budget running low - 35% remaining",
        severity: "high",
        date: "2024-11-02",
      },
    ],
  }

  useEffect(() => {
    fetchBudgetData()
  }, [])

  const fetchBudgetData = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setBudgetData(mockBudgetData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch budget data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "overspend":
        return <AlertTriangle className="w-4 h-4" />
      case "target_reached":
        return <CheckCircle className="w-4 h-4" />
      case "low_budget":
        return <Clock className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!budgetData) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/marketing")}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketing Hub
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Budget Management</h1>
              <p className="text-gray-600 mt-2">Track and manage marketing spend across campaigns and channels</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex items-center justify-center bg-white border-gray-300 hover:bg-gray-50 text-gray-700 h-10 rounded-lg"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center bg-white border-gray-300 hover:bg-gray-50 text-gray-700 h-10 rounded-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button
                onClick={() => router.push("/marketing/budget/allocate")}
                className="flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white h-10 rounded-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Allocate Budget
              </Button>
            </div>
          </div>
        </div>

        {/* Budget Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Budget</p>
                  <p className="text-2xl font-bold text-gray-900">₹{budgetData.totalBudget.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">All campaigns</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">₹{budgetData.totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">
                    {Math.round((budgetData.totalSpent / budgetData.totalBudget) * 100)}% of budget
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Remaining</p>
                  <p className="text-2xl font-bold text-gray-900">₹{budgetData.remainingBudget.toLocaleString()}</p>
                  <p className="text-xs text-green-600 font-medium">
                    {Math.round((budgetData.remainingBudget / budgetData.totalBudget) * 100)}% available
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Spent</p>
                  <p className="text-2xl font-bold text-gray-900">₹{budgetData.monthlySpent.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">of ₹{budgetData.monthlyBudget.toLocaleString()} budget</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Alerts */}
        {budgetData.alerts.length > 0 && (
          <Card className="border-0 shadow-sm mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                Budget Alerts
              </CardTitle>
              <CardDescription>Important budget notifications and warnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {budgetData.alerts.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.severity)}`}>
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{alert.message}</p>
                        {alert.campaign && <p className="text-xs opacity-75 mt-1">Campaign: {alert.campaign}</p>}
                        <p className="text-xs opacity-75 mt-1">{alert.date}</p>
                      </div>
                      <Badge className={getAlertColor(alert.severity)} variant="secondary">
                        {alert.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Budget Utilization</CardTitle>
                  <CardDescription>Overall budget allocation and spending</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Total Budget Utilization</span>
                        <span className="text-sm text-gray-600">
                          {Math.round((budgetData.totalSpent / budgetData.totalBudget) * 100)}%
                        </span>
                      </div>
                      <Progress value={(budgetData.totalSpent / budgetData.totalBudget) * 100} className="h-3" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>₹{budgetData.totalSpent.toLocaleString()} spent</span>
                        <span>₹{budgetData.totalBudget.toLocaleString()} total</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Monthly Budget</span>
                        <span className="text-sm text-gray-600">
                          {Math.round((budgetData.monthlySpent / budgetData.monthlyBudget) * 100)}%
                        </span>
                      </div>
                      <Progress value={(budgetData.monthlySpent / budgetData.monthlyBudget) * 100} className="h-3" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>₹{budgetData.monthlySpent.toLocaleString()} spent</span>
                        <span>₹{budgetData.monthlyBudget.toLocaleString()} budget</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Top Spending Channels</h4>
                      <div className="space-y-3">
                        {budgetData.channels
                          .sort((a, b) => b.spent - a.spent)
                          .slice(0, 3)
                          .map((channel) => (
                            <div key={channel.id} className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">{channel.name}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900">
                                  ₹{channel.spent.toLocaleString()}
                                </span>
                                <div className="w-16 h-2 bg-gray-200 rounded-full">
                                  <div
                                    className="h-2 bg-blue-500 rounded-full"
                                    style={{ width: `${(channel.spent / channel.allocated) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>ROI and efficiency across campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-900">
                          {(
                            budgetData.campaigns.reduce((sum, c) => sum + c.roi, 0) / budgetData.campaigns.length
                          ).toFixed(1)}
                          x
                        </div>
                        <div className="text-sm text-green-700">Average ROI</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-900">
                          ₹{Math.round(budgetData.totalSpent / budgetData.campaigns.length).toLocaleString()}
                        </div>
                        <div className="text-sm text-blue-700">Avg Spend/Campaign</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Campaign Performance</h4>
                      <div className="space-y-3">
                        {budgetData.campaigns
                          .sort((a, b) => b.roi - a.roi)
                          .map((campaign) => (
                            <div
                              key={campaign.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <div className="font-medium text-sm text-gray-900">{campaign.name}</div>
                                <div className="text-xs text-gray-500">₹{campaign.spent.toLocaleString()} spent</div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-sm text-gray-900">{campaign.roi}x ROI</div>
                                <Badge className={getStatusColor(campaign.status)} variant="secondary">
                                  {campaign.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Campaign Budget Breakdown</CardTitle>
                <CardDescription>Detailed budget analysis for each campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {budgetData.campaigns.map((campaign) => (
                    <div key={campaign.id} className="p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{campaign.name}</h3>
                          <p className="text-sm text-gray-600">
                            {campaign.startDate} - {campaign.endDate}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(campaign.status)} variant="secondary">
                            {campaign.status}
                          </Badge>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">{campaign.roi}x ROI</div>
                            <div className="text-xs text-gray-500">Return on investment</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-600">Total Budget</div>
                          <div className="font-semibold text-gray-900">₹{campaign.totalBudget.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Spent</div>
                          <div className="font-semibold text-gray-900">₹{campaign.spent.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Remaining</div>
                          <div className="font-semibold text-gray-900">₹{campaign.remaining.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Daily Spend</div>
                          <div className="font-semibold text-gray-900">₹{campaign.dailySpend.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Budget Utilization</span>
                          <span className="text-sm text-gray-600">
                            {Math.round((campaign.spent / campaign.totalBudget) * 100)}%
                          </span>
                        </div>
                        <Progress value={(campaign.spent / campaign.totalBudget) * 100} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {campaign.channels.map((channel, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {channel}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/marketing/campaigns/${campaign.id}`)}
                          >
                            <BarChart3 className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/marketing/budget/campaigns/${campaign.id}/edit`)}
                          >
                            Edit Budget
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Channels Tab */}
          <TabsContent value="channels">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Channel Budget Analysis</CardTitle>
                <CardDescription>Performance and spending by marketing channel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetData.channels.map((channel) => (
                    <div key={channel.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{channel.name}</h3>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{channel.roi}x ROI</div>
                          <div className="text-xs text-gray-500">{channel.conversions} conversions</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-3">
                        <div>
                          <div className="text-xs text-gray-600">Allocated</div>
                          <div className="font-medium text-gray-900">₹{channel.allocated.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Spent</div>
                          <div className="font-medium text-gray-900">₹{channel.spent.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Remaining</div>
                          <div className="font-medium text-gray-900">₹{channel.remaining.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">CPM</div>
                          <div className="font-medium text-gray-900">₹{channel.cpm}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">CPC</div>
                          <div className="font-medium text-gray-900">₹{channel.cpc}</div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-700">Budget Utilization</span>
                          <span className="text-xs text-gray-600">
                            {Math.round((channel.spent / channel.allocated) * 100)}%
                          </span>
                        </div>
                        <Progress value={(channel.spent / channel.allocated) * 100} className="h-1.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Budget History</CardTitle>
                <CardDescription>Monthly budget allocation and spending trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetData.monthlyBreakdown.map((month, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{month.month}</h3>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-medium text-gray-900">{month.roi}x ROI</div>
                            <div className="text-xs text-gray-500">Average return</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">{month.campaigns}</div>
                            <div className="text-xs text-gray-500">Active campaigns</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-600">Budget</div>
                          <div className="font-semibold text-gray-900">₹{month.budget.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Spent</div>
                          <div className="font-semibold text-gray-900">₹{month.spent.toLocaleString()}</div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Utilization</span>
                          <span className="text-sm text-gray-600">
                            {Math.round((month.spent / month.budget) * 100)}%
                          </span>
                        </div>
                        <Progress value={(month.spent / month.budget) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
