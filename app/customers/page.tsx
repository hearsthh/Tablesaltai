"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  TrendingUp,
  DollarSign,
  Star,
  Search,
  Filter,
  UserPlus,
  Heart,
  ShoppingBag,
  Target,
  Sparkles,
  Mail,
  Phone,
} from "lucide-react"

// Static data for fast loading
const staticData = {
  customers: [
    {
      id: "1",
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      phone: "+91 98765 43210",
      totalOrders: 23,
      totalSpent: 8750,
      avgOrderValue: 380,
      lastVisit: "2024-01-20",
      segment: "VIP",
      loyaltyPoints: 1250,
      favoriteItems: ["Butter Chicken", "Dal Makhani"],
      joinDate: "2023-06-15",
      status: "active",
    },
    {
      id: "2",
      name: "Arjun Patel",
      email: "arjun.patel@email.com",
      phone: "+91 87654 32109",
      totalOrders: 15,
      totalSpent: 5400,
      avgOrderValue: 360,
      lastVisit: "2024-01-18",
      segment: "Regular",
      loyaltyPoints: 540,
      favoriteItems: ["Biryani", "Paneer Tikka"],
      joinDate: "2023-08-22",
      status: "active",
    },
    {
      id: "3",
      name: "Sneha Gupta",
      email: "sneha.gupta@email.com",
      phone: "+91 76543 21098",
      totalOrders: 8,
      totalSpent: 2800,
      avgOrderValue: 350,
      lastVisit: "2024-01-15",
      segment: "New",
      loyaltyPoints: 280,
      favoriteItems: ["Dal Makhani", "Naan"],
      joinDate: "2023-11-10",
      status: "active",
    },
    {
      id: "4",
      name: "Rahul Singh",
      email: "rahul.singh@email.com",
      phone: "+91 65432 10987",
      totalOrders: 31,
      totalSpent: 12400,
      avgOrderValue: 400,
      lastVisit: "2024-01-22",
      segment: "VIP",
      loyaltyPoints: 1860,
      favoriteItems: ["Paneer Tikka", "Gulab Jamun"],
      joinDate: "2023-04-08",
      status: "active",
    },
    {
      id: "5",
      name: "Meera Joshi",
      email: "meera.joshi@email.com",
      phone: "+91 54321 09876",
      totalOrders: 3,
      totalSpent: 980,
      avgOrderValue: 327,
      lastVisit: "2024-01-10",
      segment: "At Risk",
      loyaltyPoints: 98,
      favoriteItems: ["Curry", "Rice"],
      joinDate: "2023-12-05",
      status: "inactive",
    },
  ],
  segments: [
    {
      id: "1",
      name: "VIP Customers",
      count: 45,
      avgSpent: 9500,
      criteria: "25+ orders or ₹8000+ spent",
      color: "bg-purple-100 text-purple-800",
    },
    {
      id: "2",
      name: "Regular Customers",
      count: 128,
      avgSpent: 4200,
      criteria: "10-24 orders",
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: "3",
      name: "New Customers",
      count: 89,
      avgSpent: 1800,
      criteria: "1-9 orders",
      color: "bg-green-100 text-green-800",
    },
    {
      id: "4",
      name: "At Risk",
      count: 23,
      avgSpent: 2100,
      criteria: "No orders in 30+ days",
      color: "bg-red-100 text-red-800",
    },
  ],
  analytics: {
    totalCustomers: 285,
    newCustomers: 34,
    repeatCustomers: 68,
    avgLifetimeValue: 4250,
    churnRate: 8.1,
    retentionRate: 91.9,
  },
}

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState("customers")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSegment, setSelectedSegment] = useState("all")

  const filteredCustomers = staticData.customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSegment = selectedSegment === "all" || customer.segment.toLowerCase() === selectedSegment.toLowerCase()
    return matchesSearch && matchesSegment
  })

  const getSegmentColor = (segment: string) => {
    switch (segment.toLowerCase()) {
      case "vip":
        return "bg-purple-100 text-purple-800"
      case "regular":
        return "bg-blue-100 text-blue-800"
      case "new":
        return "bg-green-100 text-green-800"
      case "at risk":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
            <p className="text-gray-600 mt-1">Manage customer relationships, segments, and loyalty programs</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Target className="w-4 h-4 mr-2" />
              Segments
            </Button>
            <Button size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{staticData.analytics.totalCustomers}</div>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm font-medium text-green-600">+{staticData.analytics.newCustomers}</span>
                <span className="text-sm text-gray-500 ml-1">this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Repeat Customers</CardTitle>
              <Heart className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{staticData.analytics.repeatCustomers}%</div>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm font-medium text-green-600">+3.2%</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Lifetime Value</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ₹{staticData.analytics.avgLifetimeValue.toLocaleString()}
              </div>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm font-medium text-green-600">+8.5%</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Retention Rate</CardTitle>
              <Star className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{staticData.analytics.retentionRate}%</div>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm font-medium text-green-600">+1.8%</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="segments">Segments</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="customers" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Segments</option>
                <option value="vip">VIP</option>
                <option value="regular">Regular</option>
                <option value="new">New</option>
                <option value="at risk">At Risk</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>

            {/* Customers List */}
            <div className="grid gap-6">
              {filteredCustomers.map((customer) => (
                <Card key={customer.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Customer Avatar */}
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xl font-medium text-gray-600">
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>

                      {/* Customer Details */}
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-semibold text-gray-900">{customer.name}</h3>
                              <Badge className={getSegmentColor(customer.segment)}>{customer.segment}</Badge>
                              <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {customer.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {customer.phone}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">₹{customer.totalSpent.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">Total Spent</p>
                          </div>
                        </div>

                        {/* Customer Metrics */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Total Orders</p>
                            <p className="text-lg font-semibold text-gray-900">{customer.totalOrders}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Avg Order Value</p>
                            <p className="text-lg font-semibold text-gray-900">₹{customer.avgOrderValue}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Loyalty Points</p>
                            <p className="text-lg font-semibold text-gray-900">{customer.loyaltyPoints}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Last Visit</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {new Date(customer.lastVisit).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Favorite Items */}
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Favorite Items</p>
                          <div className="flex flex-wrap gap-2">
                            {customer.favoriteItems.map((item, index) => (
                              <Badge key={index} variant="outline">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </Button>
                          <Button size="sm" variant="outline">
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            View Orders
                          </Button>
                          <Button size="sm" variant="outline">
                            <Sparkles className="w-4 h-4 mr-2" />
                            AI Recommendations
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="segments" className="space-y-6">
            <div className="grid gap-6">
              {staticData.segments.map((segment) => (
                <Card key={segment.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{segment.name}</CardTitle>
                        <CardDescription>{segment.criteria}</CardDescription>
                      </div>
                      <Badge className={segment.color}>{segment.count} customers</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Customer Count</p>
                        <p className="text-2xl font-bold text-gray-900">{segment.count}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Avg Spent</p>
                        <p className="text-2xl font-bold text-gray-900">₹{segment.avgSpent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Percentage</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {Math.round((segment.count / staticData.analytics.totalCustomers) * 100)}%
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={(segment.count / staticData.analytics.totalCustomers) * 100} className="h-2" />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        View Customers
                      </Button>
                      <Button size="sm" variant="outline">
                        Create Campaign
                      </Button>
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
                    AI Customer Insights
                  </CardTitle>
                  <CardDescription>Personalized recommendations to improve customer relationships</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                    <h4 className="font-medium text-purple-900">VIP Customer Opportunity</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      15 regular customers are close to VIP status. Target them with personalized offers to increase
                      their spending by ₹2000 each.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                    <h4 className="font-medium text-red-900">At-Risk Customers</h4>
                    <p className="text-sm text-red-700 mt-1">
                      23 customers haven't ordered in 30+ days. Send them a "We miss you" campaign with a 20% discount
                      to win them back.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <h4 className="font-medium text-green-900">New Customer Onboarding</h4>
                    <p className="text-sm text-green-700 mt-1">
                      89 new customers joined this month. Create a welcome series to introduce them to your best dishes
                      and increase retention.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <h4 className="font-medium text-blue-900">Loyalty Program Impact</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Customers with loyalty points spend 40% more per order. Consider expanding your loyalty program
                      benefits.
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
                    <Mail className="w-4 h-4 mr-2" />
                    Send Targeted Campaign
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Target className="w-4 h-4 mr-2" />
                    Create Customer Segment
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Heart className="w-4 h-4 mr-2" />
                    Launch Loyalty Program
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Recommendations
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
