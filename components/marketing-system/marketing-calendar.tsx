"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, ChevronLeft, ChevronRight, Plus, Target, Megaphone, FileText, CheckSquare } from "lucide-react"
import type { CalendarEvent } from "@/lib/types/marketing-system"

interface MarketingCalendarProps {
  events: CalendarEvent[]
  onCreateEvent: () => void
  onEventClick: (event: CalendarEvent) => void
}

export function MarketingCalendar({ events, onCreateEvent, onEventClick }: MarketingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState<"month" | "week" | "day">("month")
  const [filterType, setFilterType] = useState<"all" | "strategy" | "campaign" | "content" | "task">("all")

  const getEventIcon = (type: string) => {
    switch (type) {
      case "strategy":
        return <Target className="w-3 h-3" />
      case "campaign":
        return <Megaphone className="w-3 h-3" />
      case "content":
        return <FileText className="w-3 h-3" />
      case "task":
        return <CheckSquare className="w-3 h-3" />
      default:
        return <CalendarIcon className="w-3 h-3" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "delayed":
        return "bg-red-100 text-red-800 border-red-200"
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredEvents = events.filter((event) => filterType === "all" || event.type === filterType)

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return filteredEvents.filter((event) => event.date.startsWith(dateStr))
  }

  const upcomingEvents = filteredEvents
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Calendar View */}
      <div className="lg:col-span-3">
        <Card className="border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")} className="h-8 w-8 p-0">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")} className="h-8 w-8 p-0">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="strategy">Strategies</SelectItem>
                    <SelectItem value="campaign">Campaigns</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                    <SelectItem value="task">Tasks</SelectItem>
                  </SelectContent>
                </Select>

                <Button size="sm" onClick={onCreateEvent} className="bg-gray-900 hover:bg-gray-800 text-white">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Event
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 border-b">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentDate).map((day, index) => (
                <div
                  key={index}
                  className={`min-h-24 p-1 border border-gray-100 rounded ${
                    day ? "bg-white hover:bg-gray-50" : "bg-gray-50"
                  }`}
                >
                  {day && (
                    <>
                      <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                      <div className="space-y-1">
                        {getEventsForDate(day)
                          .slice(0, 2)
                          .map((event) => (
                            <div
                              key={event.id}
                              onClick={() => onEventClick(event)}
                              className="text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity"
                              style={{ backgroundColor: event.color + "20", color: event.color }}
                            >
                              <div className="flex items-center space-x-1">
                                {getEventIcon(event.type)}
                                <span className="truncate">{event.title}</span>
                              </div>
                            </div>
                          ))}
                        {getEventsForDate(day).length > 2 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{getEventsForDate(day).length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Upcoming Events */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <CalendarIcon className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No upcoming events</p>
                </div>
              ) : (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start space-x-2">
                      <div className="p-1 rounded" style={{ backgroundColor: event.color + "20" }}>
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900">{event.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        {event.description && <p className="text-xs text-gray-600 mt-1">{event.description}</p>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Event Types Legend */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Event Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { type: "strategy", label: "Strategies", color: "#3B82F6" },
                { type: "campaign", label: "Campaigns", color: "#10B981" },
                { type: "content", label: "Content", color: "#F59E0B" },
                { type: "task", label: "Tasks", color: "#EF4444" },
              ].map((item) => (
                <div key={item.type} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Events:</span>
                <span className="font-medium">{filteredEvents.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completed:</span>
                <span className="font-medium">{filteredEvents.filter((e) => e.status === "completed").length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Upcoming:</span>
                <span className="font-medium">{filteredEvents.filter((e) => e.status === "upcoming").length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delayed:</span>
                <span className="font-medium text-red-600">
                  {filteredEvents.filter((e) => e.status === "delayed").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
