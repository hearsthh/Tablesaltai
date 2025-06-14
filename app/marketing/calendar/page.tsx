"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import {
  Users,
  TrendingUp,
  Globe,
  Menu,
  ArrowLeft,
  Calendar,
  Plus,
  Filter,
  Download,
  Edit,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

export default function MarketingCalendarPage() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())

  const calendarEvents = [
    {
      id: "1",
      title: "Instagram Reel - Weekend Special",
      type: "content",
      date: "2024-11-07",
      time: "6:00 PM",
      platform: "Instagram",
      status: "scheduled",
    },
    {
      id: "2",
      title: "Facebook Ad - Diwali Offer",
      type: "campaign",
      date: "2024-11-08",
      time: "10:00 AM",
      platform: "Facebook",
      status: "pending",
    },
    {
      id: "3",
      title: "Blog Post - Healthy Indian Cuisine",
      type: "content",
      date: "2024-11-09",
      time: "9:00 AM",
      platform: "Website",
      status: "draft",
    },
  ]

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
              <h1 className="text-3xl font-bold text-slate-900">Marketing Calendar</h1>
              <p className="text-slate-600 mt-2">Schedule and manage all your marketing activities</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex items-center rounded-md border-slate-200">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" className="flex items-center rounded-md border-slate-200">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="flex items-center bg-slate-900 hover:bg-slate-800 rounded-md">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>November 2024</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8">
              <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Calendar View Coming Soon</h3>
              <p className="text-slate-500 mb-4">
                Full calendar integration with drag-and-drop scheduling will be available soon.
              </p>
            </div>

            {/* Upcoming Events List */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-900">Upcoming Events</h4>
              {calendarEvents.map((event) => (
                <div key={event.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-slate-900">{event.title}</h5>
                      <p className="text-sm text-slate-600">
                        {event.date} at {event.time} • {event.platform}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{event.status}</Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
