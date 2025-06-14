"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/logo"
import {
  Users,
  TrendingUp,
  Globe,
  Menu,
  ArrowLeft,
  Plus,
  Filter,
  Search,
  MapPin,
  Calendar,
  Smartphone,
  Mail,
  Edit,
  Trash2,
} from "lucide-react"
import { useCustomerStore } from "@/lib/store/customer-store"

export default function CustomerSegmentationPage() {
  const router = useRouter()
  const { customers, segments, addSegment, updateSegment, deleteSegment } = useCustomerStore()
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")

  const [newSegment, setNewSegment] = useState({
    name: "",
    description: "",
    criteria: {
      ageMin: "",
      ageMax: "",
      minSpend: "",
      maxSpend: "",
      frequency: "",
      location: "",
      acquisitionChannel: "",
    },
  })

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterBy === "all") return matchesSearch
    return matchesSearch && customer.segment.toLowerCase() === filterBy
  })

  const getSegmentCustomers = (segmentName: string) => {
    return customers.filter((customer) => customer.segment.toLowerCase() === segmentName.toLowerCase())
  }

  const handleCreateSegment = () => {
    if (newSegment.name && newSegment.description) {
      addSegment({
        name: newSegment.name,
        description: newSegment.description,
        criteria: newSegment.criteria,
        customerCount: 0,
        avgLTV: 0,
        avgSpend: 0,
        color: "bg-gray-50 border-gray-200 text-gray-700",
      })
      setIsCreateModalOpen(false)
      setNewSegment({
        name: "",
        description: "",
        criteria: {
          ageMin: "",
          ageMax: "",
          minSpend: "",
          maxSpend: "",
          frequency: "",
          location: "",
          acquisitionChannel: "",
        },
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Logo size="md" />
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-8">
                <Button variant="ghost" className="text-slate-500 rounded-md" onClick={() => router.push("/profile")}>
                  <Users className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button variant="ghost" className="text-slate-500 rounded-md" onClick={() => router.push("/marketing")}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Marketing
                </Button>
                <Button variant="ghost" className="text-slate-900 font-medium rounded-md">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="rounded-md" onClick={() => router.push("/customers")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Customer Segmentation</h1>
                <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Analyze and segment customers based on behavior and demographics
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center bg-slate-900 hover:bg-slate-800 rounded-md text-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Segment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Segment</DialogTitle>
                    <DialogDescription>Define criteria for a new customer segment</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Segment Name</Label>
                      <Input
                        id="name"
                        value={newSegment.name}
                        onChange={(e) => setNewSegment({ ...newSegment, name: e.target.value })}
                        placeholder="e.g., High Value Customers"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newSegment.description}
                        onChange={(e) => setNewSegment({ ...newSegment, description: e.target.value })}
                        placeholder="Describe this segment"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="ageMin">Min Age</Label>
                        <Input
                          id="ageMin"
                          type="number"
                          value={newSegment.criteria.ageMin}
                          onChange={(e) =>
                            setNewSegment({
                              ...newSegment,
                              criteria: { ...newSegment.criteria, ageMin: e.target.value },
                            })
                          }
                          placeholder="25"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ageMax">Max Age</Label>
                        <Input
                          id="ageMax"
                          type="number"
                          value={newSegment.criteria.ageMax}
                          onChange={(e) =>
                            setNewSegment({
                              ...newSegment,
                              criteria: { ...newSegment.criteria, ageMax: e.target.value },
                            })
                          }
                          placeholder="45"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="minSpend">Min Spend (₹)</Label>
                        <Input
                          id="minSpend"
                          type="number"
                          value={newSegment.criteria.minSpend}
                          onChange={(e) =>
                            setNewSegment({
                              ...newSegment,
                              criteria: { ...newSegment.criteria, minSpend: e.target.value },
                            })
                          }
                          placeholder="1000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxSpend">Max Spend (₹)</Label>
                        <Input
                          id="maxSpend"
                          type="number"
                          value={newSegment.criteria.maxSpend}
                          onChange={(e) =>
                            setNewSegment({
                              ...newSegment,
                              criteria: { ...newSegment.criteria, maxSpend: e.target.value },
                            })
                          }
                          placeholder="5000"
                        />
                      </div>
                    </div>
                    <Button onClick={handleCreateSegment} className="w-full">
                      Create Segment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Segments Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {segments.map((segment, index) => {
            const segmentCustomers = getSegmentCustomers(segment.name.split(" ")[0])
            return (
              <Card
                key={index}
                className={`border cursor-pointer hover:shadow-sm transition-all ${segment.color} ${
                  selectedSegment === segment.id ? "ring-2 ring-slate-900" : ""
                }`}
                onClick={() => setSelectedSegment(selectedSegment === segment.id ? null : segment.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900">{segment.name}</h3>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">{segment.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Customers</span>
                      <span className="font-medium">{segmentCustomers.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Avg LTV</span>
                      <span className="font-medium">₹{segment.avgLTV.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Avg Spend</span>
                      <span className="font-medium">₹{segment.avgSpend.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 border-slate-200">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
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
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Segments</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="occasional">Occasional</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer List */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">
              Customer Details
              {selectedSegment && (
                <Badge className="ml-2" variant="secondary">
                  {segments.find((s) => s.id === selectedSegment)?.name}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>{filteredCustomers.length} customers found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCustomers.slice(0, 10).map((customer, index) => (
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
                      <Badge
                        className={`text-xs ${
                          customer.segment === "VIP"
                            ? "bg-purple-100 text-purple-700"
                            : customer.segment === "Regular"
                              ? "bg-green-100 text-green-700"
                              : customer.segment === "Occasional"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {customer.segment}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Smartphone className="w-3 h-3" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{customer.demographics.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Age: {customer.demographics.age}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">₹{customer.metrics.ltv.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">LTV</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          ₹{customer.behavior.avgSpend.toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-500">Avg Spend</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{customer.behavior.frequency}/mo</p>
                        <p className="text-xs text-slate-500">Frequency</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredCustomers.length > 10 && (
              <div className="mt-6 text-center">
                <Button variant="outline" className="rounded-md border-slate-200">
                  Load More Customers
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
