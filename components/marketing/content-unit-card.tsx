"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, Eye, Calendar, Clock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ContentUnitCardProps {
  id: string
  title: string
  description: string
  type: "post" | "story" | "reel" | "carousel" | "video" | "blog"
  status: "draft" | "scheduled" | "published" | "archived"
  platform: string
  scheduledDate?: string
  publishedDate?: string
  performance?: {
    views: number
    likes: number
    shares: number
    comments: number
  }
  thumbnail?: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onPreview?: (id: string) => void
  onSchedule?: (id: string) => void
  className?: string
}

export function ContentUnitCard({
  id,
  title,
  description,
  type,
  status,
  platform,
  scheduledDate,
  publishedDate,
  performance,
  thumbnail,
  onEdit,
  onDelete,
  onPreview,
  onSchedule,
  className,
}: ContentUnitCardProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "draft":
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          label: "Draft",
        }
      case "scheduled":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          label: "Scheduled",
        }
      case "published":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          label: "Published",
        }
      case "archived":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          label: "Archived",
        }
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          label: "Unknown",
        }
    }
  }

  const getTypeConfig = () => {
    switch (type) {
      case "post":
        return { label: "Post", color: "bg-blue-50 text-blue-700" }
      case "story":
        return { label: "Story", color: "bg-purple-50 text-purple-700" }
      case "reel":
        return { label: "Reel", color: "bg-pink-50 text-pink-700" }
      case "carousel":
        return { label: "Carousel", color: "bg-green-50 text-green-700" }
      case "video":
        return { label: "Video", color: "bg-red-50 text-red-700" }
      case "blog":
        return { label: "Blog", color: "bg-orange-50 text-orange-700" }
      default:
        return { label: "Content", color: "bg-gray-50 text-gray-700" }
    }
  }

  const statusConfig = getStatusConfig()
  const typeConfig = getTypeConfig()

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  return (
    <Card className={`border-gray-200 hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <Badge variant="outline" className={`text-xs ${typeConfig.color} border-0`}>
                {typeConfig.label}
              </Badge>
              <Badge variant="outline" className={`text-xs ${statusConfig.color}`}>
                {statusConfig.label}
              </Badge>
            </div>
            <CardTitle className="text-lg font-semibold text-gray-900 truncate">{title}</CardTitle>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
          </div>
          <div className="flex items-center space-x-2 ml-2">
            {thumbnail && (
              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img src={thumbnail || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onPreview && (
                  <DropdownMenuItem onClick={() => onPreview(id)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Content
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Content
                  </DropdownMenuItem>
                )}
                {onSchedule && status === "draft" && (
                  <DropdownMenuItem onClick={() => onSchedule(id)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Content
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem onClick={() => onDelete(id)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Content
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Platform and Timing */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Platform:</span>
            <span className="font-medium text-gray-900">{platform}</span>
          </div>
          {scheduledDate && status === "scheduled" && (
            <div className="flex items-center space-x-1 text-blue-600">
              <Clock className="w-3 h-3" />
              <span className="text-xs">{new Date(scheduledDate).toLocaleDateString()}</span>
            </div>
          )}
          {publishedDate && status === "published" && (
            <div className="flex items-center space-x-1 text-green-600">
              <Calendar className="w-3 h-3" />
              <span className="text-xs">{new Date(publishedDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Performance Metrics (only for published content) */}
        {performance && status === "published" && (
          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-100">
            <div className="text-center">
              <div className="text-sm font-bold text-gray-900">{formatNumber(performance.views)}</div>
              <div className="text-xs text-gray-600">Views</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-gray-900">{formatNumber(performance.likes)}</div>
              <div className="text-xs text-gray-600">Likes</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-gray-900">{formatNumber(performance.shares)}</div>
              <div className="text-xs text-gray-600">Shares</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-gray-900">{formatNumber(performance.comments)}</div>
              <div className="text-xs text-gray-600">Comments</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-2">
          {status === "draft" && (
            <>
              {onEdit && (
                <Button size="sm" variant="outline" onClick={() => onEdit(id)} className="text-xs">
                  Edit
                </Button>
              )}
              {onSchedule && (
                <Button
                  size="sm"
                  onClick={() => onSchedule(id)}
                  className="text-xs bg-black text-white hover:bg-gray-800"
                >
                  Schedule
                </Button>
              )}
            </>
          )}
          {onPreview && (
            <Button size="sm" variant="outline" onClick={() => onPreview(id)} className="text-xs">
              Preview
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
