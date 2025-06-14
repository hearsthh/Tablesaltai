"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import {
  ArrowLeft,
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Heart,
  Plus,
  Users,
} from "lucide-react"
import { useCustomerStore } from "@/lib/store/customer-store"

export default function CustomerProfilesPage() {
  const router = useRouter()
  const { customers } = useCustomerStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSegment, setFilterSegment] = useState("all")
  const [filterRisk, setFilterRisk] = useState("all")
  const [sortBy, setSortBy] = useState("ltv")

  const filteredAndSortedCustomers = customers
    .filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSegment = filterSegment === "all" || customer.segment.toLowerCase() === filterSegment
      const matchesRisk = filterRisk === "all" || customer.metrics.churnRisk === filterRisk

      return matchesSearch && matchesSegment && matchesRisk
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "ltv":
          return b.metrics.ltv - a.metrics.ltv
        case "frequency":
          return b.behavior.frequency - a.behavior.frequency
        case "recent":
          return new Date(b.behavior.lastVisit).getTime() - new Date(a.behavior.lastVisit).getTime()
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const getSegmentColor = (segment: string) => {
    switch (segment.toLowerCase()) {
      case "vip":
        return "bg-purple-100 text-purple-700"
      case "regular":
        return "bg-green-100 text-green-700"
      case "occasional":
        return "bg-blue-100 text-blue-700"
      case "new":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

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

  const handleViewProfile = (customerId: string) => {
    router.push(`/customers/profiles/${customerId}`)
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
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Customer Profiles</h1>
                <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Detailed customer insights and individual profiles
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="flex items-center rounded-md border-slate-200 text-sm"
                onClick={() => router.push("/customers/segmentation")}
              >
                <Filter className="w-4 h-4 mr-2" />
                Segmentation
              </Button>
              <Button
                className="flex items-center bg-slate-900 hover:bg-slate-800 rounded-md text-sm"
                onClick={() => router.push("/customers/profiles/new")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 border-slate-200">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search customers by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={filterSegment} onValueChange={setFilterSegment}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Segments</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="occasional">Occasional</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterRisk} onValueChange={setFilterRisk}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Churn Risk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ltv">Lifetime Value</SelectItem>
                    <SelectItem value="frequency">Frequency</SelectItem>
                    <SelectItem value="recent">Recent Activity</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCustomers.map((customer, index) => (
            <Card key={index} className="border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-slate-700">
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{customer.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getSegmentColor(customer.segment)}>{customer.segment}</Badge>
                        <Badge className={getChurnRiskColor(customer.metrics.churnRisk)}>
                          {customer.metrics.churnRisk} risk
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-md"
                    onClick={() => handleViewProfile(customer.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span>{customer.demographics.location}</span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <div className="flex items-center space-x-1 text-xs text-slate-500 mb-1">
                      <DollarSign className="w-3 h-3" />
                      <span>Lifetime Value</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">₹{customer.metrics.ltv.toLocaleString()}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 text-xs text-slate-500 mb-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>Avg Spend</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">₹{customer.behavior.avgSpend.toLocaleString()}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 text-xs text-slate-500 mb-1">
                      <Calendar className="w-3 h-3" />
                      <span>Frequency</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">{customer.behavior.frequency}/mo</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 text-xs text-slate-500 mb-1">
                      <Heart className="w-3 h-3" />
                      <span>Satisfaction</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">{customer.engagement.satisfaction}/5</p>
                  </div>
                </div>

                {/* Preferences */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-medium text-slate-900 mb-2">Preferences</h4>
                  <div className="flex flex-wrap gap-1">
                    {customer.preferences.cuisine.slice(0, 2).map((cuisine, cuisineIndex) => (
                      <Badge key={cuisineIndex} variant="outline" className="text-xs">
                        {cuisine}
                      </Badge>
                    ))}
                    {customer.preferences.cuisine.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{customer.preferences.cuisine.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-4 border-t border-slate-100">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 rounded-md"
                    onClick={() => handleViewProfile(customer.id)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" className="flex-1 bg-slate-900 hover:bg-slate-800 rounded-md">
                    <Mail className="w-3 h-3 mr-1" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {filteredAndSortedCustomers.length > 12 && (
          <div className="mt-8 text-center">
            <Button variant="outline" className="rounded-md border-slate-200">
              Load More Customers
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredAndSortedCustomers.length === 0 && (
          <Card className="border-slate-200 text-center py-12">
            <CardContent>
              <div className="text-slate-400 mb-4">
                <Users className="w-16 h-16 mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No customers found</h3>
              <p className="text-slate-600 mb-4">
                {searchTerm || filterSegment !== "all" || filterRisk !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "Start by adding your first customer"}
              </p>
              <Button
                className="bg-slate-900 hover:bg-slate-800"
                onClick={() => router.push("/customers/profiles/new")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
