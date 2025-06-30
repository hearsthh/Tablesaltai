"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Bell, Star, Clock, Eye, Send, AlertTriangle } from "lucide-react"

interface ReviewNotification {
  id: string
  platform: string
  author: string
  rating: number
  text: string
  sentiment: "positive" | "negative" | "neutral"
  timeAgo: string
  isNew: boolean
  responded: boolean
}

interface ReviewNotificationsProps {
  notifications?: ReviewNotification[]
  onMarkAsRead?: (id: string) => void
  onRespond?: (id: string) => void
}

export function ReviewNotifications({ notifications = [], onMarkAsRead, onRespond }: ReviewNotificationsProps) {
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null)

  // Mock notifications if none provided
  const mockNotifications: ReviewNotification[] = [
    {
      id: "1",
      platform: "Google",
      author: "Sarah M.",
      rating: 5,
      text: "Amazing food and great service! The pasta was perfectly cooked and the staff was very attentive.",
      sentiment: "positive",
      timeAgo: "2 minutes ago",
      isNew: true,
      responded: false,
    },
    {
      id: "2",
      platform: "Yelp",
      author: "Mike R.",
      rating: 2,
      text: "Food was okay but service was terrible. Waited 45 minutes for our main course and the server was rude.",
      sentiment: "negative",
      timeAgo: "1 hour ago",
      isNew: true,
      responded: false,
    },
    {
      id: "3",
      platform: "TripAdvisor",
      author: "Jennifer L.",
      rating: 4,
      text: "Great atmosphere for a date night. The wine selection is excellent! Only complaint is the noise level.",
      sentiment: "positive",
      timeAgo: "3 hours ago",
      isNew: false,
      responded: true,
    },
  ]

  const displayNotifications = notifications.length > 0 ? notifications : mockNotifications
  const newNotificationsCount = displayNotifications.filter((n) => n.isNew).length

  const handleMarkAsRead = (id: string) => {
    onMarkAsRead?.(id)
    setSelectedNotification(null)
  }

  const handleRespond = (id: string) => {
    onRespond?.(id)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg flex items-center text-gray-900">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Review Notifications
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">Recent customer feedback</CardDescription>
          </div>
          {newNotificationsCount > 0 && <Badge className="bg-red-100 text-red-800">{newNotificationsCount} new</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        {displayNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">No new notifications</p>
            <p className="text-gray-400 text-xs mt-1">You'll be notified when customers leave new reviews</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`border rounded-lg p-4 transition-colors ${
                  notification.isNew ? "bg-blue-50 border-blue-200" : "bg-white"
                } ${selectedNotification === notification.id ? "ring-2 ring-black" : ""}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 text-sm">{notification.author}</span>
                    <Badge variant="outline" className="text-xs">
                      {notification.platform}
                    </Badge>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < notification.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    {notification.isNew && <Badge className="bg-blue-100 text-blue-800 text-xs">New</Badge>}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{notification.timeAgo}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{notification.text}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={
                        notification.sentiment === "positive"
                          ? "bg-green-100 text-green-800"
                          : notification.sentiment === "negative"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {notification.sentiment}
                    </Badge>
                    {notification.sentiment === "negative" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                  </div>

                  <div className="flex items-center space-x-2">
                    {notification.isNew && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Mark Read
                      </Button>
                    )}
                    {!notification.responded ? (
                      <Button
                        size="sm"
                        onClick={() => handleRespond(notification.id)}
                        className="bg-black hover:bg-gray-800 text-xs"
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Respond
                      </Button>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 text-xs">Responded</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
