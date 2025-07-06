"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Calendar, Eye, Heart, MessageCircle } from "lucide-react"

interface ContentUnitCardProps {
  title: string
  type: "post" | "story" | "reel" | "article" | "email"
  status: "draft" | "scheduled" | "published" | "archived"
  scheduledDate?: string
  publishedDate?: string
  platform: string[]
  engagement?: {
    views: number
    likes: number
    comments: number
    shares: number
  }
  onEdit?: () => void
  onSchedule?: () => void
  onPublish?: () => void
}

export function ContentUnitCard({
  title,
  type,
  status,
  scheduledDate,
  publishedDate,
  platform,
  engagement,
  onEdit,
  onSchedule,
  onPublish,
}: ContentUnitCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "published":
        return "bg-green-100 text-green-800"
      case "archived":
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getTypeColor = () => {
    switch (type) {
      case "post":
        return "bg-purple-100 text-purple-800"
      case "story":
        return "bg-pink-100 text-pink-800"
      case "reel":
        return "bg-orange-100 text-orange-800"
      case "article":
        return "bg-indigo-100 text-indigo-800"
      case "email":
        return "bg-teal-100 text-teal-800"
    }
  }

  return (
    <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-lg font-semibold text-black">{title}</CardTitle>
          <Badge className={getTypeColor()}>{type}</Badge>
          <Badge className={getStatusColor()}>{status}</Badge>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {/* Platform Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {platform.map((p) => (
            <Badge key={p} variant="outline" className="text-xs">
              {p}
            </Badge>
          ))}
        </div>

        {/* Engagement Metrics (if published) */}
        {engagement && status === "published" && (
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-black">{engagement.views.toLocaleString()}</div>
              <div className="text-xs text-gray-500 flex items-center justify-center">
                <Eye className="h-3 w-3 mr-1" />
                Views
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-black">{engagement.likes.toLocaleString()}</div>
              <div className="text-xs text-gray-500 flex items-center justify-center">
                <Heart className="h-3 w-3 mr-1" />
                Likes
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-black">{engagement.comments}</div>
              <div className="text-xs text-gray-500 flex items-center justify-center">
                <MessageCircle className="h-3 w-3 mr-1" />
                Comments
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-black">{engagement.shares}</div>
              <div className="text-xs text-gray-500">Shares</div>
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="flex items-center justify-between mb-4">
          {scheduledDate && (
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              Scheduled: {scheduledDate}
            </div>
          )}
          {publishedDate && (
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              Published: {publishedDate}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              Edit
            </Button>
          )}
          {onSchedule && status === "draft" && (
            <Button size="sm" onClick={onSchedule} className="bg-blue-600 hover:bg-blue-700 text-white">
              Schedule
            </Button>
          )}
          {onPublish && status === "draft" && (
            <Button size="sm" onClick={onPublish} className="bg-black hover:bg-gray-800 text-white">
              Publish Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
