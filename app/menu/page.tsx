"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  TrendingUp,
  TrendingDown,
  Star,
  DollarSign,
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Sparkles,
  BarChart3,
} from "lucide-react"

// Static data for fast loading
const staticData = {
  categories: [
    {
      id: "1",
      name: "Appetizers",
      itemCount: 8,
      avgPrice: 180,
      totalOrders: 456,
    },
    {
      id: "2",
      name: "Main Course",
      itemCount: 15,
      avgPrice: 350,
      totalOrders: 1234,
    },
    {
      id: "3",
      name: "Desserts",
      itemCount: 6,
      avgPrice: 150,
      totalOrders: 234,
    },
    {
      id: "4",
      name: "Beverages",
      itemCount: 12,
      avgPrice: 80,
      totalOrders: 567,
    },
  ],
  menuItems: [
    {
      id: "1",
      name: "Butter Chicken",
      description: "Tender chicken in rich tomato cream sauce",
      price: 380,
      category: "Main Course",
      isAvailable: true,
      totalOrders: 234,
      avgRating: 4.7,
      profitMargin: 65,
      trend: "up",
      image: "/placeholder.svg?height=100&width=100&text=Butter+Chicken",
    },
    {
      id: "2",
      name: "Dal Makhani",
      description: "Slow-cooked black lentils in creamy gravy",
      price: 280,
      category: "Main Course",
      isAvailable: true,
      totalOrders: 178,
      avgRating: 4.4,
      profitMargin: 72,
      trend: "up",
      image: "/placeholder.svg?height=100&width=100&text=Dal+Makhani",
    },
    {
      id: "3",
      name: "Paneer Tikka",
      description: "Grilled cottage cheese with aromatic spices",
      price: 320,
      category: "Appetizers",
      isAvailable: true,
      totalOrders: 156,
      avgRating: 4.5,
      profitMargin: 68,
      trend: "stable",
      image: "/placeholder.svg?height=100&width=100&text=Paneer+Tikka",
    },
    {
      id: "4",
      name: "Biryani",
      description: "Fragrant basmati rice with tender meat",
      price: 420,
      category: "Main Course",
      isAvailable: false,
      totalOrders: 89,
      avgRating: 4.2,
      profitMargin: 58,
      trend: "down",
      image: "/placeholder.svg?height=100&width=100&text=Biryani",
    },
    {
      id: "5",
      name: "Gulab Jamun",
      description: "Sweet milk dumplings in sugar syrup",
      price: 120,
      category: "Desserts",
      isAvailable: true,
      totalOrders: 145,
      avgRating: 4.6,
      profitMargin: 78,
      trend: "up",
      image: "/placeholder.svg?height=100&width=100&text=Gulab+Jamun",
    },
  ],
  analytics: {
    totalItems: 41,
    avgPrice: 245,
    topPerformer: "Butter Chicken",
    totalRevenue: 125000,
    avgRating: 4.4,
    profitMargin: 67,
  },
}

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState("items")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredItems = staticData.menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <div className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
            <p className="text-gray-600 mt-1">Manage your menu items, pricing, and performance analytics</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Items</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{staticData.analytics.totalItems}</div>
              <p className="text-xs text-gray-500 mt-1">Across all categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Price</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">₹{staticData.analytics.avgPrice}</div>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm font-medium text-green-600">+5.2%</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{staticData.analytics.avgRating}</div>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm font-medium text-green-600">+0.3</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Profit Margin</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{staticData.analytics.profitMargin}%</div>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm font-medium text-green-600">+2.1%</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="items">Menu Items</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Menu Items Grid */}
            <div className="grid gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Item Image */}
                      <div className="w-full lg:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                              {getTrendIcon(item.trend)}
                              {!item.isAvailable && <Badge variant="secondary">Unavailable</Badge>}
                            </div>
                            <p className="text-gray-600 mt-1">{item.description}</p>
                            <Badge variant="outline" className="mt-2">
                              {item.category}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">₹{item.price}</p>
                            <p className="text-sm text-gray-500">{item.profitMargin}% margin</p>
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Total Orders</p>
                            <p className="text-lg font-semibold text-gray-900">{item.totalOrders}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Average Rating</p>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <p className="text-lg font-semibold text-gray-900">{item.avgRating}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Revenue</p>
                            <p className="text-lg font-semibold text-gray-900">
                              ₹{(item.totalOrders * item.price).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <Sparkles className="w-4 h-4 mr-2" />
                            AI Optimize
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid gap-6">
              {staticData.categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{category.name}</CardTitle>
                        <CardDescription>{category.itemCount} items</CardDescription>
                      </div>
                      <Button size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Average Price</p>
                        <p className="text-2xl font-bold text-gray-900">₹{category.avgPrice}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">{category.totalOrders}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{(category.totalOrders * category.avgPrice).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    AI Menu Insights
                  </CardTitle>
                  <CardDescription>Data-driven recommendations to optimize your menu</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <h4 className="font-medium text-green-900">Top Performer</h4>
                    <p className="text-sm text-green-700 mt-1">
                      {staticData.analytics.topPerformer} is your best-selling item with 234 orders this month. Consider
                      featuring it prominently or creating variations.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <h4 className="font-medium text-blue-900">Pricing Opportunity</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your dessert category has the highest profit margin (78%). Consider expanding this category or
                      promoting desserts more actively.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                    <h4 className="font-medium text-yellow-900">Menu Balance</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Your main course category dominates orders. Consider adding more appetizer options to increase
                      average order value.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Item Descriptions
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analyze Performance
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Optimize Pricing
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Suggest New Items
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
