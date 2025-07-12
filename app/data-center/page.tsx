"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import RestaurantBasicInfoForm from "@/components/data-center/restaurant-basic-info-form"
import MediaUploadForm from "@/components/data-center/media-upload-form"
import MenuDataForm from "@/components/data-center/menu-data-form"
import {
  Database,
  Building,
  ImageIcon,
  Utensils,
  Star,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react"

const DEMO_RESTAURANT_ID = "550e8400-e29b-41d4-a716-446655440000"

export default function DataCenterPage() {
  const [activeTab, setActiveTab] = useState("basic")
  const [dataStatus, setDataStatus] = useState({
    basicInfo: { completed: true, lastUpdated: "2024-01-15" },
    mediaAssets: { completed: false, count: 12 },
    menuData: { completed: true, items: 45, categories: 6 },
    reviewData: { completed: true, count: 128, avgRating: 4.3 },
    customerData: { completed: false, count: 1250 },
    marketingData: { completed: false, campaigns: 3 },
  })
  const { toast } = useToast()

  const handleBasicInfoSave = async (data: any) => {
    try {
      const response = await fetch("/api/data-center/restaurant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantData: data,
          autoFill: data.autoFill,
        }),
      })

      if (!response.ok) throw new Error("Failed to save")

      const result = await response.json()

      setDataStatus((prev) => ({
        ...prev,
        basicInfo: { completed: true, lastUpdated: new Date().toISOString().split("T")[0] },
      }))

      return result
    } catch (error) {
      throw error
    }
  }

  const handleMediaUpload = (mediaAsset: any) => {
    setDataStatus((prev) => ({
      ...prev,
      mediaAssets: {
        completed: true,
        count: (prev.mediaAssets.count || 0) + 1,
      },
    }))
  }

  const handleMenuSave = async (data: any) => {
    try {
      const response = await fetch("/api/data-center/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to save menu")

      const result = await response.json()

      setDataStatus((prev) => ({
        ...prev,
        menuData: {
          completed: true,
          items: data.menuData.items?.length || 0,
          categories: data.menuData.categories?.length || 0,
        },
      }))

      return result
    } catch (error) {
      throw error
    }
  }

  const getStatusIcon = (completed: boolean) => {
    return completed ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <AlertCircle className="w-5 h-5 text-yellow-600" />
    )
  }

  const getCompletionPercentage = () => {
    const sections = Object.values(dataStatus)
    const completed = sections.filter((section) => section.completed).length
    return Math.round((completed / sections.length) * 100)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl flex items-center">
                <Database className="w-6 h-6 mr-2 text-gray-600" />
                Data Center
              </h1>
              <p className="text-sm text-gray-600">Manage all your restaurant data in one place</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{getCompletionPercentage()}% Complete</div>
                <div className="text-xs text-gray-500">Data setup progress</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-700">{getCompletionPercentage()}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Status Overview */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <Card className="border-gray-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <Building className="w-4 h-4 text-gray-600" />
                {getStatusIcon(dataStatus.basicInfo.completed)}
              </div>
              <div className="text-xs font-medium text-gray-900">Basic Info</div>
              <div className="text-xs text-gray-500">{dataStatus.basicInfo.completed ? "Complete" : "Pending"}</div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <ImageIcon className="w-4 h-4 text-gray-600" />
                {getStatusIcon(dataStatus.mediaAssets.completed)}
              </div>
              <div className="text-xs font-medium text-gray-900">Media</div>
              <div className="text-xs text-gray-500">{dataStatus.mediaAssets.count || 0} assets</div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <Utensils className="w-4 h-4 text-gray-600" />
                {getStatusIcon(dataStatus.menuData.completed)}
              </div>
              <div className="text-xs font-medium text-gray-900">Menu</div>
              <div className="text-xs text-gray-500">{dataStatus.menuData.items || 0} items</div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <Star className="w-4 h-4 text-gray-600" />
                {getStatusIcon(dataStatus.reviewData.completed)}
              </div>
              <div className="text-xs font-medium text-gray-900">Reviews</div>
              <div className="text-xs text-gray-500">{dataStatus.reviewData.avgRating || 0}★ avg</div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-4 h-4 text-gray-600" />
                {getStatusIcon(dataStatus.customerData.completed)}
              </div>
              <div className="text-xs font-medium text-gray-900">Customers</div>
              <div className="text-xs text-gray-500">{dataStatus.customerData.count || 0} total</div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-4 h-4 text-gray-600" />
                {getStatusIcon(dataStatus.marketingData.completed)}
              </div>
              <div className="text-xs font-medium text-gray-900">Marketing</div>
              <div className="text-xs text-gray-500">{dataStatus.marketingData.campaigns || 0} campaigns</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          {/* Mobile-First Tab Navigation */}
          <div className="overflow-x-auto">
            <TabsList className="grid grid-cols-6 w-max min-w-full bg-white border border-gray-200">
              <TabsTrigger
                value="basic"
                className="text-xs data-[state=active]:bg-gray-900 data-[state=active]:text-white"
              >
                Basic
              </TabsTrigger>
              <TabsTrigger
                value="media"
                className="text-xs data-[state=active]:bg-gray-900 data-[state=active]:text-white"
              >
                Media
              </TabsTrigger>
              <TabsTrigger
                value="menu"
                className="text-xs data-[state=active]:bg-gray-900 data-[state=active]:text-white"
              >
                Menu
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="text-xs data-[state=active]:bg-gray-900 data-[state=active]:text-white"
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="customers"
                className="text-xs data-[state=active]:bg-gray-900 data-[state=active]:text-white"
              >
                Customers
              </TabsTrigger>
              <TabsTrigger
                value="marketing"
                className="text-xs data-[state=active]:bg-gray-900 data-[state=active]:text-white"
              >
                Marketing
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="basic" className="space-y-4">
            <RestaurantBasicInfoForm onSave={handleBasicInfoSave} />
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <MediaUploadForm restaurantId={DEMO_RESTAURANT_ID} onUploadComplete={handleMediaUpload} />
          </TabsContent>

          <TabsContent value="menu" className="space-y-4">
            <MenuDataForm restaurantId={DEMO_RESTAURANT_ID} onSave={handleMenuSave} />
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-gray-900">
                  <Star className="w-5 h-5 mr-2 text-gray-600" />
                  Review Data Management
                </CardTitle>
                <CardDescription className="text-gray-600">Sync and manage reviews from all platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium mb-2">Review Management Coming Soon</p>
                  <p className="text-sm">
                    This feature will allow you to sync reviews from Google, Yelp, and other platforms
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-gray-900">
                  <Users className="w-5 h-5 mr-2 text-gray-600" />
                  Customer Data Management
                </CardTitle>
                <CardDescription className="text-gray-600">Import and manage customer information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium mb-2">Customer Management Coming Soon</p>
                  <p className="text-sm">
                    This feature will allow you to import customer data from POS and other systems
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketing" className="space-y-4">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-gray-900">
                  <TrendingUp className="w-5 h-5 mr-2 text-gray-600" />
                  Marketing Data Management
                </CardTitle>
                <CardDescription className="text-gray-600">Track campaigns and marketing performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium mb-2">Marketing Data Coming Soon</p>
                  <p className="text-sm">This feature will help you track campaign performance and ROI</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
