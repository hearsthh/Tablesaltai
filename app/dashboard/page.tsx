"use client"

import { Navigation } from "@/components/navigation"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { ChannelPill } from "@/components/marketing/channel-pill"
import { CampaignCard } from "@/components/marketing/campaign-card"
import { ContentUnitCard } from "@/components/marketing/content-unit-card"
import { DishRow } from "@/components/menu/dish-row"
import { useRestaurantData } from "@/hooks/use-restaurant-data"
import { useMarketingData } from "@/hooks/use-marketing-data"
import { useCustomerData } from "@/hooks/use-customer-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ChefHat,
  Users,
  Star,
  TrendingUp,
  MessageSquare,
  BarChart3,
  Plus,
  ArrowRight,
  Calendar,
  Target,
  Zap,
} from "lucide-react"

export default function DashboardPage() {
  const { data: restaurantData, loading: restaurantLoading } = useRestaurantData()
  const { data: marketingData, loading: marketingLoading } = useMarketingData()
  const { data: customerData, loading: customerLoading } = useCustomerData()

  if (restaurantLoading || marketingLoading || customerLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">
                Welcome back, {restaurantData?.profile.name || "Restaurant Owner"}!
              </h1>
              <p className="text-gray-600">Here's what's happening with your restaurant today.</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Content
              </Button>
              <Button className="bg-black hover:bg-gray-800 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KpiCard
            title="Monthly Revenue"
            value={`₹${restaurantData?.profile.monthlyRevenue.toLocaleString()}`}
            change={restaurantData?.profile.revenueChange}
            changeType="increase"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <KpiCard
            title="Today's Orders"
            value={restaurantData?.performance.ordersToday}
            change={restaurantData?.performance.ordersChange}
            changeType="increase"
            icon={<ChefHat className="h-4 w-4" />}
          />
          <KpiCard
            title="Customer Rating"
            value={restaurantData?.profile.rating}
            subtitle={`${restaurantData?.profile.totalReviews} reviews`}
            icon={<Star className="h-4 w-4" />}
          />
          <KpiCard
            title="Avg Order Value"
            value={`₹${restaurantData?.performance.avgOrderValue}`}
            change={restaurantData?.performance.avgOrderValueChange}
            changeType="decrease"
            icon={<BarChart3 className="h-4 w-4" />}
          />
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-black">
              <Zap className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks to boost your restaurant's performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2 bg-transparent">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Create Social Post</span>
                </div>
                <p className="text-sm text-gray-600 text-left">Generate AI-powered social media content</p>
              </Button>

              <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2 bg-transparent">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Launch Campaign</span>
                </div>
                <p className="text-sm text-gray-600 text-left">Start a new marketing campaign</p>
              </Button>

              <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2 bg-transparent">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Analyze Customers</span>
                </div>
                <p className="text-sm text-gray-600 text-left">Get insights on customer behavior</p>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Marketing Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Platform Connections */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">Platform Connections</CardTitle>
              <CardDescription>Your restaurant's online presence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {marketingData?.channels.map((channel) => (
                  <ChannelPill key={channel.name} name={channel.name} status={channel.status} count={channel.count} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer Segments */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">Customer Segments</CardTitle>
              <CardDescription>Your customer base breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customerData?.segments.map((segment) => (
                  <div key={segment.name} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-black">{segment.name}</span>
                      <span className="text-sm text-gray-500 ml-2">({segment.count})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{segment.percentage}%</Badge>
                      <span className={`text-sm ${segment.growth > 0 ? "text-green-600" : "text-red-600"}`}>
                        {segment.growth > 0 ? "+" : ""}
                        {segment.growth}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Campaigns */}
        <Card className="mb-8 bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-black">Active Campaigns</CardTitle>
              <CardDescription>Your current marketing campaigns</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {marketingData?.campaigns.slice(0, 2).map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  title={campaign.title}
                  description={campaign.description}
                  status={campaign.status}
                  budget={campaign.budget}
                  spent={campaign.spent}
                  startDate={campaign.startDate}
                  endDate={campaign.endDate}
                  performance={campaign.performance}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Content */}
        <Card className="mb-8 bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-black">Recent Content</CardTitle>
              <CardDescription>Your latest content pieces</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Create New <Plus className="h-4 w-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {marketingData?.contentUnits.slice(0, 2).map((content) => (
                <ContentUnitCard
                  key={content.id}
                  title={content.title}
                  type={content.type}
                  status={content.status}
                  scheduledDate={content.scheduledDate}
                  publishedDate={content.publishedDate}
                  platform={content.platform}
                  engagement={content.engagement}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Menu Items */}
        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-black">Top Performing Menu Items</CardTitle>
              <CardDescription>Your best-selling dishes this month</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View Full Menu <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-0 divide-y divide-gray-100">
              <DishRow
                name="Butter Chicken"
                category="Main Course"
                price={320}
                rating={4.8}
                orders={156}
                revenue={49920}
                trend="up"
                isVegetarian={false}
                isSpicy={true}
              />
              <DishRow
                name="Paneer Tikka Masala"
                category="Main Course"
                price={280}
                rating={4.6}
                orders={134}
                revenue={37520}
                trend="up"
                isVegetarian={true}
                isSpicy={true}
              />
              <DishRow
                name="Biryani Special"
                category="Rice"
                price={350}
                rating={4.7}
                orders={98}
                revenue={34300}
                trend="stable"
                isVegetarian={false}
                isSpicy={false}
              />
              <DishRow
                name="Dal Makhani"
                category="Main Course"
                price={220}
                rating={4.5}
                orders={87}
                revenue={19140}
                trend="down"
                isVegetarian={true}
                isSpicy={false}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
