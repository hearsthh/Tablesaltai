"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  TrendingUp,
  Globe,
  Menu,
  ArrowLeft,
  Target,
  Eye,
  Edit,
  Zap,
  CheckCircle,
  Clock,
  BarChart3,
  Lightbulb,
  Calendar,
  DollarSign,
} from "lucide-react"

export default function StrategiesPage() {
  const router = useRouter()
  const [createStrategyOpen, setCreateStrategyOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const strategies = [
    {
      id: "1",
      name: "Q4 Brand Awareness Strategy",
      objective: "Increase Brand Awareness",
      duration: "3 months",
      budget: 75000,
      status: "active",
      progress: 65,
      startDate: "Oct 1, 2024",
      endDate: "Dec 31, 2024",
      description: "Comprehensive strategy to increase brand visibility during festival season",
      keyMetrics: {
        targetReach: "50K",
        currentReach: "32.5K",
        targetEngagement: "5%",
        currentEngagement: "4.2%",
      },
      campaigns: 4,
      milestones: [
        { name: "Diwali Campaign Launch", status: "completed", date: "Oct 20" },
        { name: "Social Media Optimization", status: "active", date: "Nov 1" },
        { name: "Influencer Partnerships", status: "pending", date: "Nov 15" },
        { name: "Year-end Review", status: "pending", date: "Dec 30" },
      ],
    },
    {
      id: "2",
      name: "Customer Acquisition Drive",
      objective: "Customer Acquisition",
      duration: "6 months",
      budget: 120000,
      status: "active",
      progress: 45,
      startDate: "Sep 1, 2024",
      endDate: "Feb 28, 2025",
      description: "Multi-channel strategy to acquire new customers and increase market share",
      keyMetrics: {
        targetReach: "100K",
        currentReach: "45K",
        targetEngagement: "6%",
        currentEngagement: "5.8%",
      },
      campaigns: 6,
      milestones: [
        { name: "Digital Ad Campaign", status: "completed", date: "Sep 15" },
        { name: "Referral Program Launch", status: "completed", date: "Oct 1" },
        { name: "Partnership Campaigns", status: "active", date: "Nov 1" },
        { name: "Holiday Promotions", status: "pending", date: "Dec 1" },
      ],
    },
    {
      id: "3",
      name: "Revenue Growth Strategy",
      objective: "Revenue Growth",
      duration: "12 months",
      budget: 200000,
      status: "draft",
      progress: 0,
      startDate: "Jan 1, 2025",
      endDate: "Dec 31, 2025",
      description: "Annual strategy focused on increasing revenue through premium offerings and upselling",
      keyMetrics: {
        targetReach: "200K",
        currentReach: "0",
        targetEngagement: "7%",
        currentEngagement: "0%",
      },
      campaigns: 0,
      milestones: [
        { name: "Premium Menu Launch", status: "pending", date: "Jan 15" },
        { name: "Catering Service Expansion", status: "pending", date: "Mar 1" },
        { name: "Loyalty Program Enhancement", status: "pending", date: "Jun 1" },
        { name: "Corporate Partnerships", status: "pending", date: "Sep 1" },
      ],
    },
  ]

  const handleGenerateStrategy = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setCreateStrategyOpen(false)
    }, 4000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "draft":
        return "bg-gray-100 text-gray-700"
      case "completed":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "active":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-gray-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
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
              <h1 className="text-3xl font-bold text-slate-900">Marketing Strategies</h1>
              <p className="text-slate-600 mt-2">AI-generated long-term marketing strategies for your restaurant</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex items-center rounded-md border-slate-200">
                <BarChart3 className="w-4 h-4 mr-2" />
                Strategy Analytics
              </Button>
              <Dialog open={createStrategyOpen} onOpenChange={setCreateStrategyOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center bg-slate-900 hover:bg-slate-800 rounded-md">
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Strategy
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      Generate Marketing Strategy
                    </DialogTitle>
                    <DialogDescription>
                      AI will create a comprehensive marketing strategy based on your goals
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="strategy-goal">Primary Goal</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your primary goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="brand-awareness">Increase Brand Awareness</SelectItem>
                          <SelectItem value="customer-acquisition">Customer Acquisition</SelectItem>
                          <SelectItem value="revenue-growth">Revenue Growth</SelectItem>
                          <SelectItem value="customer-retention">Customer Retention</SelectItem>
                          <SelectItem value="market-expansion">Market Expansion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="strategy-duration">Strategy Duration</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3-months">3 Months</SelectItem>
                          <SelectItem value="6-months">6 Months</SelectItem>
                          <SelectItem value="12-months">12 Months</SelectItem>
                          <SelectItem value="18-months">18 Months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="strategy-budget">Total Budget (₹)</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="50k-100k">₹50,000 - ₹1,00,000</SelectItem>
                          <SelectItem value="100k-250k">₹1,00,000 - ₹2,50,000</SelectItem>
                          <SelectItem value="250k-500k">₹2,50,000 - ₹5,00,000</SelectItem>
                          <SelectItem value="500k+">₹5,00,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="strategy-context">Business Context</Label>
                      <Textarea
                        id="strategy-context"
                        placeholder="Tell us about your current situation, target audience, competition, and specific challenges..."
                        rows={4}
                      />
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-900">AI Strategy Generation</span>
                      </div>
                      <p className="text-sm text-blue-800">
                        AI will analyze your restaurant profile, market trends, and competition to create a
                        comprehensive strategy with milestones, campaigns, and success metrics.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCreateStrategyOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleGenerateStrategy} disabled={isGenerating}>
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Generating Strategy...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Generate Strategy
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Strategies List */}
            <div className="space-y-6">
              {strategies.map((strategy) => (
                <Card key={strategy.id} className="border-slate-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <CardTitle className="text-xl">{strategy.name}</CardTitle>
                          <Badge className={getStatusColor(strategy.status)} variant="secondary">
                            {strategy.status}
                          </Badge>
                        </div>
                        <CardDescription>{strategy.description}</CardDescription>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                          <span>{strategy.duration}</span>
                          <span>•</span>
                          <span>₹{strategy.budget.toLocaleString()} budget</span>
                          <span>•</span>
                          <span>{strategy.campaigns} campaigns</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Progress */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Strategy Progress</span>
                        <span className="text-sm text-slate-500">{strategy.progress}%</span>
                      </div>
                      <Progress value={strategy.progress} className="h-2" />
                      <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
                        <span>{strategy.startDate}</span>
                        <span>{strategy.endDate}</span>
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-lg font-bold text-slate-900">{strategy.keyMetrics.currentReach}</div>
                        <div className="text-xs text-slate-600">Reach</div>
                        <div className="text-xs text-slate-500">of {strategy.keyMetrics.targetReach} target</div>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-lg font-bold text-slate-900">{strategy.keyMetrics.currentEngagement}</div>
                        <div className="text-xs text-slate-600">Engagement</div>
                        <div className="text-xs text-slate-500">target {strategy.keyMetrics.targetEngagement}</div>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-lg font-bold text-slate-900">{strategy.campaigns}</div>
                        <div className="text-xs text-slate-600">Campaigns</div>
                        <div className="text-xs text-slate-500">active</div>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-lg font-bold text-slate-900">₹{(strategy.budget / 1000).toFixed(0)}K</div>
                        <div className="text-xs text-slate-600">Budget</div>
                        <div className="text-xs text-slate-500">allocated</div>
                      </div>
                    </div>

                    {/* Milestones */}
                    <div>
                      <h4 className="font-medium text-slate-900 mb-3">Key Milestones</h4>
                      <div className="space-y-3">
                        {strategy.milestones.map((milestone, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                            {getMilestoneIcon(milestone.status)}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-slate-900">{milestone.name}</span>
                                <span className="text-sm text-slate-500">{milestone.date}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Strategy Overview */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Strategy Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">2</div>
                  <div className="text-sm text-green-600">Active Strategies</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-900">₹395K</div>
                  <div className="text-sm text-blue-600">Total Budget</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-900">55%</div>
                  <div className="text-sm text-purple-600">Avg Progress</div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start rounded-md border-slate-200">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Strategy Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-md border-slate-200">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Timeline
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-md border-slate-200">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Budget Allocation
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-md border-slate-200">
                  <Target className="w-4 h-4 mr-2" />
                  Goal Tracking
                </Button>
              </CardContent>
            </Card>

            {/* Strategy Templates */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Strategy Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <h4 className="font-medium text-slate-900 text-sm">Restaurant Launch</h4>
                  <p className="text-xs text-slate-600">Complete strategy for new restaurant launch</p>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <h4 className="font-medium text-slate-900 text-sm">Seasonal Campaigns</h4>
                  <p className="text-xs text-slate-600">Festival and seasonal marketing strategy</p>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <h4 className="font-medium text-slate-900 text-sm">Digital Transformation</h4>
                  <p className="text-xs text-slate-600">Online presence and digital marketing</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
