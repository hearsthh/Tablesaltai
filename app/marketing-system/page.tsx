"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation, MobileBottomNavigation } from "@/components/navigation"
import { Target, Megaphone, Calendar, CheckSquare, Plus, Sparkles, TrendingUp, Users, Zap } from "lucide-react"
import { useMarketingSystem } from "@/hooks/use-marketing-system"
import { StrategyCard } from "@/components/marketing-system/strategy-card"
import { StrategyBuilder } from "@/components/marketing-system/strategy-builder"
import { TaskManager } from "@/components/marketing-system/task-manager"
import { MarketingCalendar } from "@/components/marketing-system/marketing-calendar"
import { toast } from "@/components/ui/use-toast"

export default function MarketingSystemPage() {
  const {
    strategies,
    campaigns,
    channels,
    tasks,
    events,
    loading,
    createStrategy,
    generateAIStrategy,
    createCampaign,
    addChannelToCampaign,
    updateTaskStatus,
    getStrategyProgress,
    getCampaignTasks,
    getUpcomingTasks,
  } = useMarketingSystem()

  const [showStrategyBuilder, setShowStrategyBuilder] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const handleCreateStrategy = async (data: any) => {
    try {
      await createStrategy(data)
      toast({
        title: "Strategy Created",
        description: "Your marketing strategy has been created successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create strategy. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleGenerateAIStrategy = async (goal: string) => {
    try {
      await generateAIStrategy(goal)
      toast({
        title: "AI Strategy Generated",
        description: "AI has created a complete strategy with campaigns and content suggestions.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI strategy. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCreateCampaign = async (strategyId: string) => {
    try {
      await createCampaign(strategyId, {
        title: "New Campaign",
        summary: "Campaign description",
        targetAudience: {
          segment: "all_customers",
          tags: [],
          size: 100,
        },
      })
      toast({
        title: "Campaign Created",
        description: "New campaign has been added to your strategy.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleGenerateAICampaigns = async (strategyId: string, goal: string) => {
    try {
      // This would generate multiple AI campaigns for the strategy
      toast({
        title: "AI Campaigns Generated",
        description: "AI has created multiple campaigns for your strategy.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI campaigns. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Calculate overview stats
  const totalBudget = campaigns.reduce((sum, campaign) => sum + (campaign.budget || 0), 0)
  const totalSpent = campaigns.reduce((sum, campaign) => sum + (campaign.spent || 0), 0)
  const totalReach = campaigns.reduce((sum, campaign) => sum + campaign.performanceMetrics.reach, 0)
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.performanceMetrics.conversions, 0)

  const activeStrategies = strategies.filter((s) => s.status === "active").length
  const activeCampaigns = campaigns.filter((c) => c.status === "live").length
  const pendingTasks = tasks.filter((t) => t.status !== "done").length
  const upcomingTasks = getUpcomingTasks(7)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black mx-auto mb-3"></div>
            <p className="text-sm text-gray-600">Loading marketing system...</p>
          </div>
        </div>
        <MobileBottomNavigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <div className="flex-1 pb-16 md:pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Marketing System</h1>
                <p className="text-gray-600 mt-1">AI-powered marketing automation from strategy to execution</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="bg-white" onClick={() => setActiveTab("calendar")}>
                  <Calendar className="w-4 h-4 mr-1" />
                  Calendar
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowStrategyBuilder(true)}
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Create Strategy
                </Button>
              </div>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Strategies</p>
                    <p className="text-2xl font-bold text-gray-900">{activeStrategies}</p>
                    <p className="text-xs text-gray-500">{strategies.length} total</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Live Campaigns</p>
                    <p className="text-2xl font-bold text-gray-900">{activeCampaigns}</p>
                    <p className="text-xs text-gray-500">{campaigns.length} total</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Megaphone className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Reach</p>
                    <p className="text-2xl font-bold text-gray-900">{totalReach.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+12% this month</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingTasks}</p>
                    <p className="text-xs text-orange-600">{upcomingTasks.length} due soon</p>
                  </div>
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <CheckSquare className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card className="mb-6 border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                AI Marketing Insights
              </CardTitle>
              <CardDescription>Smart recommendations to improve your marketing performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Strategy Optimization</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    Your "Weekend Footfall" strategy is performing 25% above target. Consider expanding budget.
                  </p>
                  <Button size="sm" variant="outline" className="bg-white text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Optimize
                  </Button>
                </div>
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">Content Gaps</h4>
                  <p className="text-sm text-green-800 mb-3">
                    You have 3 campaigns without Instagram content. AI can generate posts automatically.
                  </p>
                  <Button size="sm" variant="outline" className="bg-white text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    Generate
                  </Button>
                </div>
                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-900 mb-2">Task Automation</h4>
                  <p className="text-sm text-purple-800 mb-3">
                    12 tasks can be automated with AI. Save 4 hours per week with smart automation.
                  </p>
                  <Button size="sm" variant="outline" className="bg-white text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Automate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="strategies">Strategies</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Recent Strategies */}
              <Card className="border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Recent Strategies</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("strategies")} className="bg-white">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {strategies.slice(0, 2).map((strategy) => (
                      <StrategyCard
                        key={strategy.id}
                        strategy={strategy}
                        campaigns={campaigns.filter((c) => c.strategyId === strategy.id)}
                        progress={getStrategyProgress(strategy.id)}
                        onCreateCampaign={handleCreateCampaign}
                        onGenerateAICampaigns={handleGenerateAICampaigns}
                        onEditStrategy={() => {}}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Tasks */}
              <Card className="border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Upcoming Tasks</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("tasks")} className="bg-white">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingTasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            task.priority === "high"
                              ? "bg-red-500"
                              : task.priority === "medium"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{task.description}</p>
                          <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {task.assignedTo === "ai" ? "AI" : "User"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="strategies" className="space-y-6">
              <div className="space-y-6">
                {strategies.length === 0 ? (
                  <Card className="border-gray-200">
                    <CardContent className="text-center py-12">
                      <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No strategies yet</h3>
                      <p className="text-gray-600 mb-4">Create your first marketing strategy to get started</p>
                      <Button
                        onClick={() => setShowStrategyBuilder(true)}
                        className="bg-gray-900 hover:bg-gray-800 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Strategy
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  strategies.map((strategy) => (
                    <StrategyCard
                      key={strategy.id}
                      strategy={strategy}
                      campaigns={campaigns.filter((c) => c.strategyId === strategy.id)}
                      progress={getStrategyProgress(strategy.id)}
                      onCreateCampaign={handleCreateCampaign}
                      onGenerateAICampaigns={handleGenerateAICampaigns}
                      onEditStrategy={() => {}}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="tasks">
              <TaskManager tasks={tasks} onUpdateTaskStatus={updateTaskStatus} onCreateTask={() => {}} />
            </TabsContent>

            <TabsContent value="calendar">
              <MarketingCalendar events={events} onCreateEvent={() => {}} onEventClick={() => {}} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <MobileBottomNavigation />

      {/* Strategy Builder Modal */}
      <StrategyBuilder
        isOpen={showStrategyBuilder}
        onClose={() => setShowStrategyBuilder(false)}
        onCreateStrategy={handleCreateStrategy}
        onGenerateAIStrategy={handleGenerateAIStrategy}
      />
    </div>
  )
}
