"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Users,
  TrendingUp,
  Globe,
  Menu,
  ArrowLeft,
  Gift,
  Plus,
  Eye,
  Edit,
  Trash2,
  Percent,
  Calendar,
  Target,
} from "lucide-react"

export default function OffersPage() {
  const router = useRouter()
  const [createOfferOpen, setCreateOfferOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const offers = [
    {
      id: "1",
      title: "Diwali Special - 20% Off",
      type: "Percentage",
      discount: "20%",
      status: "active",
      startDate: "Oct 20, 2024",
      endDate: "Nov 15, 2024",
      usageCount: 45,
      maxUsage: 100,
      description: "Celebrate Diwali with 20% off on all orders above ₹1000",
    },
    {
      id: "2",
      title: "Weekend Brunch Deal",
      type: "Fixed Amount",
      discount: "₹200",
      status: "active",
      startDate: "Nov 1, 2024",
      endDate: "Nov 30, 2024",
      usageCount: 28,
      maxUsage: 50,
      description: "Get ₹200 off on weekend brunch orders above ₹800",
    },
    {
      id: "3",
      title: "First Time Customer",
      type: "Percentage",
      discount: "15%",
      status: "active",
      startDate: "Oct 1, 2024",
      endDate: "Dec 31, 2024",
      usageCount: 67,
      maxUsage: 200,
      description: "Welcome new customers with 15% off on their first order",
    },
    {
      id: "4",
      title: "Holiday Catering Special",
      type: "Fixed Amount",
      discount: "₹500",
      status: "scheduled",
      startDate: "Dec 1, 2024",
      endDate: "Jan 15, 2025",
      usageCount: 0,
      maxUsage: 30,
      description: "Special discount for holiday catering orders above ₹5000",
    },
  ]

  const handleCreateOffer = () => {
    setIsCreating(true)
    setTimeout(() => {
      setIsCreating(false)
      setCreateOfferOpen(false)
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "scheduled":
        return "bg-blue-100 text-blue-700"
      case "expired":
        return "bg-gray-100 text-gray-700"
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
              <h1 className="text-3xl font-bold text-slate-900">Offers & Promotions</h1>
              <p className="text-slate-600 mt-2">Create and manage special offers for your customers</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Dialog open={createOfferOpen} onOpenChange={setCreateOfferOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center bg-slate-900 hover:bg-slate-800 rounded-md">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Offer
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <Gift className="w-5 h-5 mr-2" />
                      Create New Offer
                    </DialogTitle>
                    <DialogDescription>Set up a new promotional offer for your customers</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="offer-title">Offer Title</Label>
                        <Input id="offer-title" placeholder="e.g., Weekend Special Deal" />
                      </div>
                      <div>
                        <Label htmlFor="offer-type">Discount Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage Off</SelectItem>
                            <SelectItem value="fixed">Fixed Amount Off</SelectItem>
                            <SelectItem value="bogo">Buy One Get One</SelectItem>
                            <SelectItem value="free-delivery">Free Delivery</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="discount-value">Discount Value</Label>
                        <Input id="discount-value" placeholder="e.g., 20 or 200" />
                      </div>
                      <div>
                        <Label htmlFor="min-order">Minimum Order Value</Label>
                        <Input id="min-order" placeholder="e.g., 500" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="offer-description">Description</Label>
                      <Textarea
                        id="offer-description"
                        placeholder="Describe the offer terms and conditions..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start-date">Start Date</Label>
                        <Input id="start-date" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="end-date">End Date</Label>
                        <Input id="end-date" type="date" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="max-usage">Maximum Usage</Label>
                        <Input id="max-usage" type="number" placeholder="e.g., 100" />
                      </div>
                      <div>
                        <Label htmlFor="target-audience">Target Audience</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select audience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Customers</SelectItem>
                            <SelectItem value="new">New Customers</SelectItem>
                            <SelectItem value="returning">Returning Customers</SelectItem>
                            <SelectItem value="vip">VIP Customers</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCreateOfferOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateOffer} disabled={isCreating}>
                      {isCreating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Offer
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Offers List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Active Offers</CardTitle>
                <CardDescription>Manage your current promotional offers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {offers.map((offer) => (
                    <div key={offer.id} className="p-6 border border-slate-200 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-slate-900">{offer.title}</h3>
                            <Badge className={getStatusColor(offer.status)} variant="secondary">
                              {offer.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {offer.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{offer.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-slate-500">
                            <span>
                              {offer.startDate} - {offer.endDate}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-900">{offer.discount}</div>
                          <div className="text-sm text-purple-600">Discount</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-900">{offer.usageCount}</div>
                          <div className="text-sm text-blue-600">Used</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-900">{offer.maxUsage}</div>
                          <div className="text-sm text-green-600">Max Usage</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-lg font-bold text-orange-900">
                            {Math.round((offer.usageCount / offer.maxUsage) * 100)}%
                          </div>
                          <div className="text-sm text-orange-600">Usage Rate</div>
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
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Offer Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">140</div>
                  <div className="text-sm text-green-600">Total Redemptions</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-900">₹28K</div>
                  <div className="text-sm text-blue-600">Revenue Generated</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-900">4</div>
                  <div className="text-sm text-purple-600">Active Offers</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start rounded-md border-slate-200">
                  <Percent className="w-4 h-4 mr-2" />
                  Offer Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-md border-slate-200">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Offers
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-md border-slate-200">
                  <Target className="w-4 h-4 mr-2" />
                  Customer Segments
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
