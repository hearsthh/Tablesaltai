"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, CalendarIcon, Plus, Filter, Eye, Edit } from "lucide-react"
import { Navigation } from "@/components/navigation"

export default function MarketingCalendarPage() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState<"month" | "week" | "day">("month")
  const [filterChannel, setFilterChannel] = useState<string>("all")

  // Mock calendar events
  const events = [
    {
      id: "1",
      title: "Diwali Special Thali Post",
      channel: "instagram",
      type: "post",
      date: "2024-11-03",
      time: "18:00",
      status: "scheduled",
    },
    {
      id: "2",
      title: "Weekend Offer Broadcast",
      channel: "whatsapp",
      type: "broadcast",
      date: "2024-11-04",
      time: "10:00",
      status: "scheduled",
    },
    {
      id: "3",
      title: "Customer Review Story",
      channel: "instagram",
      type: "story",
      date: "2024-11-05",
      time: "15:30",
      status: "draft",
    },
  ]

  const getChannelColor = (channel: string) => {
    const colors: { [key: string]: string } = {
      instagram: "bg-pink-100 text-pink-800",
      whatsapp: "bg-green-100 text-green-800",
      facebook: "bg-blue-100 text-blue-800",
      website: "bg-purple-100 text-purple-800",
      email: "bg-orange-100 text-orange-800",
    }
    return colors[channel] || "bg-gray-100 text-gray-800"
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      scheduled: "bg-blue-100 text-blue-800",
      published: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">Marketing Calendar</h1>
              <p className="text-gray-600">Schedule and manage your content across all channels</p>
            </div>

            <div className="flex items-center space-x-2">
              <Select value={filterChannel} onValueChange={setFilterChannel}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>

              <Select value={viewType} onValueChange={(value: "month" | "week" | "day") => setViewType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() => router.push("/marketing/content-units/create")}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Schedule Content
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Navigation */}
        <Card className="border-0 shadow-sm mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </h2>
                <Button variant="ghost" size="sm">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" className="bg-white">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Today
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                {/* Calendar placeholder - in real app, use a proper calendar component */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 6 + 1 // Adjust for month start
                    const isCurrentMonth = day > 0 && day <= 30
                    const hasEvents = isCurrentMonth && [3, 4, 5].includes(day)

                    return (
                      <div
                        key={i}
                        className={`min-h-24 p-2 border border-gray-100 rounded-lg ${
                          isCurrentMonth ? "bg-white" : "bg-gray-50"
                        } ${hasEvents ? "border-blue-200" : ""}`}
                      >
                        {isCurrentMonth && (
                          <>
                            <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                            {hasEvents && (
                              <div className="space-y-1">
                                {events
                                  .filter((event) => Number.parseInt(event.date.split("-")[2]) === day)
                                  .map((event) => (
                                    <div
                                      key={event.id}
                                      className="text-xs p-1 rounded bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                                      onClick={() => router.push(`/marketing/content-units/${event.id}`)}
                                    >
                                      {event.title.substring(0, 15)}...
                                    </div>
                                  ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Content</CardTitle>
                <CardDescription>Next 7 days</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm text-gray-900">{event.title}</h4>
                      <Badge className={getStatusColor(event.status)} variant="secondary">
                        {event.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <Badge className={getChannelColor(event.channel)} variant="secondary">
                        {event.channel}
                      </Badge>
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/marketing/content-units/${event.id}`)}
                        className="flex-1 text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/marketing/content-units/${event.id}/edit`)}
                        className="flex-1 text-xs"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Scheduled:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Published:</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Drafts:</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Reach:</span>
                  <span className="font-medium">25.4K</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white"
                  onClick={() => router.push("/marketing/content-units/create")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Content
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white"
                  onClick={() => router.push("/marketing/campaigns/create")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white"
                  onClick={() => router.push("/marketing/analytics")}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
