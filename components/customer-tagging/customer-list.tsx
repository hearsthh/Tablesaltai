"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Customer } from "@/lib/types/customer-tagging"
import { CustomerTagPill } from "./customer-tag-pill"
import { Search, Phone, Mail, Calendar, IndianRupee, TrendingUp } from "lucide-react"

interface CustomerListProps {
  customers: Customer[]
  onCustomerSelect?: (customer: Customer) => void
}

export function CustomerList({ customers, onCustomerSelect }: CustomerListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTag, setFilterTag] = useState<string>("")

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      !filterTag ||
      customer.spend_tag === filterTag ||
      customer.activity_tag === filterTag ||
      customer.behavior_tags.includes(filterTag as any)

    return matchesSearch && matchesFilter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search customers by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={filterTag === "" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterTag("")}
            className="whitespace-nowrap"
          >
            All
          </Button>
          <Button
            variant={filterTag === "vip" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterTag("vip")}
            className="whitespace-nowrap"
          >
            VIP
          </Button>
          <Button
            variant={filterTag === "churn_risk" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterTag("churn_risk")}
            className="whitespace-nowrap"
          >
            Churn Risk
          </Button>
          <Button
            variant={filterTag === "new" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterTag("new")}
            className="whitespace-nowrap"
          >
            New
          </Button>
        </div>
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <Card
            key={customer.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onCustomerSelect?.(customer)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900">{customer.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <Phone className="h-3 w-3" />
                    <span>{customer.phone}</span>
                  </div>
                  {customer.email && (
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                <CustomerTagPill tag={customer.spend_tag} type="spend" />
                <CustomerTagPill tag={customer.activity_tag} type="activity" />
                {customer.behavior_tags.slice(0, 2).map((tag, index) => (
                  <CustomerTagPill key={index} tag={tag} type="behavior" />
                ))}
                {customer.behavior_tags.length > 2 && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    +{customer.behavior_tags.length - 2}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Total Visits</span>
                  </div>
                  <div className="font-semibold text-gray-900">{customer.total_visits}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Total Spend</span>
                  </div>
                  <div className="font-semibold text-gray-900">{formatCurrency(customer.total_spend)}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Last Visit</span>
                  </div>
                  <div className="font-semibold text-gray-900">{formatDate(customer.last_visit_date)}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Avg Order</span>
                  </div>
                  <div className="font-semibold text-gray-900">{formatCurrency(customer.average_order_value)}</div>
                </div>
              </div>

              {/* Guest Estimate */}
              {customer.guest_estimate_avg >= 2 && (
                <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                  <div className="text-xs text-blue-800">
                    Avg Party Size: {customer.guest_estimate_avg.toFixed(1)} guests
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-8 text-gray-500">No customers found matching your search criteria.</div>
      )}
    </div>
  )
}
