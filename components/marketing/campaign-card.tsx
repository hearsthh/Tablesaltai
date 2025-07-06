"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Play, Pause, Edit, Trash2, BarChart3, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CampaignCardProps {
  id: string
  name: string
  description: string
  status: "active" | "paused" | "draft" | "completed" | "scheduled"
  budget: number
  spent: number
  analytics: {
    reach: number
    engagement: number
    conversions: number
    ctr: number
  }
  channels: string[]
  startDate: string
  endDate: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onToggleStatus?: (id: string) => void
  onViewAnalytics?: (id: string) => void
  onPreview?: (id: string) => void
  className?: string
}

export function CampaignCard({
  id,
  name,
  description,
  status,
  budget,
  spent,
  analytics,
  channels,
  startDate,
  endDate,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewAnalytics,
  onPreview,
  className,
}: CampaignCardProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "active":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          label: "Active",
          icon: Play,
        }
      case "paused":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          label: "Paused",
          icon: Pause,
        }
      case "draft":
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          label: "Draft",
          icon: Edit,
        }
      case "completed":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          label: "Completed",
          icon: BarChart3,
        }
      case "scheduled":
        return {
          color: "bg-purple-100 text-purple-800 border-purple-200",
          label: "Scheduled",
          icon: Play,
        }
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          label: "Unknown",
          icon: Edit,
        }
    }
  }

  const statusConfig = getStatusConfig()
  const budgetUsed = budget > 0 ? (spent / budget) * 100 : 0

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`
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
            <CardTitle className="text-lg font-semibold text-gray-900 truncate">{name}</CardTitle>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
          </div>
          <div className="flex items-center space-x-2 ml-2">
            <Badge variant="outline" className={`text-xs ${statusConfig.color}`}>
              {statusConfig.label}
            </Badge>
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
                    Preview Campaign
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Campaign
                  </DropdownMenuItem>
                )}
                {onToggleStatus && (
                  <DropdownMenuItem onClick={() => onToggleStatus(id)}>
                    {status === "active" ? (
                      <>
                        <Pause className="mr-2 h-4 w-4" />
                        Pause Campaign
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Activate Campaign
                      </>
                    )}
                  </DropdownMenuItem>
                )}
                {onViewAnalytics && (
                  <DropdownMenuItem onClick={() => onViewAnalytics(id)}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem onClick={() => onDelete(id)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Campaign
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Channels */}
        <div className="flex flex-wrap gap-1">
          {channels.slice(0, 3).map((channel) => (
            <Badge key={channel} variant="outline" className="text-xs border-gray-300 text-gray-700">
              {channel}
            </Badge>
          ))}
          {channels.length > 3 && (
            <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
              +{channels.length - 3} more
            </Badge>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center">
            <div className="text-sm font-bold text-gray-900">{formatNumber(analytics.reach)}</div>
            <div className="text-xs text-gray-600">Reach</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-gray-900">{formatNumber(analytics.engagement)}</div>
            <div className="text-xs text-gray-600">Engagement</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-gray-900">{analytics.conversions}</div>
            <div className="text-xs text-gray-600">Conversions</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-gray-900">{analytics.ctr.toFixed(1)}%</div>
            <div className="text-xs text-gray-600">CTR</div>
          </div>
        </div>

        {/* Budget Progress */}
        {budget > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Budget</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(spent)} / {formatCurrency(budget)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-gray-900 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(budgetUsed, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Campaign Timeline */}
        <div className="pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-600">
            {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
