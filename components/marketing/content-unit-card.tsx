import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Calendar, Eye, Heart, MessageCircle, Share, Instagram, Facebook, Twitter } from "lucide-react"

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
}

export function ContentUnitCard({
  title,
  type,
  status,
  scheduledDate,
  publishedDate,
  platform,
  engagement,
}: ContentUnitCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "archived":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "post":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "story":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "reel":
        return "bg-pink-50 text-pink-700 border-pink-200"
      case "article":
        return "bg-green-50 text-green-700 border-green-200"
      case "email":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram className="h-3 w-3" />
      case "facebook":
        return <Facebook className="h-3 w-3" />
      case "twitter":
        return <Twitter className="h-3 w-3" />
      default:
        return null
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  return (
    <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-black mb-2">{title}</CardTitle>
            <div className="flex items-center space-x-2 mb-3">
              <Badge variant="outline" className={getTypeColor(type)}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
              <Badge variant="outline" className={getStatusColor(status)}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              {platform.map((p) => (
                <div key={p} className="flex items-center space-x-1 text-xs text-gray-600">
                  {getPlatformIcon(p)}
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Information */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          {status === "published" && publishedDate && <span>Published: {publishedDate}</span>}
          {status === "scheduled" && scheduledDate && <span>Scheduled: {scheduledDate}</span>}
          {status === "draft" && <span>Draft created</span>}
        </div>

        {/* Engagement Metrics (only for published content) */}
        {status === "published" && engagement && (
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-500">Views</span>
                </div>
                <span className="text-sm font-medium text-black">{formatNumber(engagement.views)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Heart className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-500">Likes</span>
                </div>
                <span className="text-sm font-medium text-black">{formatNumber(engagement.likes)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-500">Comments</span>
                </div>
                <span className="text-sm font-medium text-black">{formatNumber(engagement.comments)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Share className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-500">Shares</span>
                </div>
                <span className="text-sm font-medium text-black">{formatNumber(engagement.shares)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-3 border-t border-gray-100">
          {status === "draft" && (
            <>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                Edit
              </Button>
              <Button size="sm" className="flex-1 bg-black hover:bg-gray-800 text-white">
                Schedule
              </Button>
            </>
          )}
          {status === "scheduled" && (
            <>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                Edit
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                Cancel
              </Button>
            </>
          )}
          {status === "published" && (
            <>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                View Post
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                Analytics
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
