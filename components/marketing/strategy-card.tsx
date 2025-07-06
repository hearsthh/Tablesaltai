"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MoreHorizontal, TrendingUp, Users, Target } from "lucide-react"

interface StrategyCardProps {
  id: string
  title: string
  description: string
  status: "active" | "paused" | "draft" | "completed"
  progress: number
  budget: number
  spent: number
  metrics: {
    reach: number
    engagement: number
    conversions: number
  }
  campaigns: number
  onEdit?: () => void
  onPause?: () => void
  onDelete?: () => void
}

export function StrategyCard({
  id,
  title,
  description,
  status,
  progress,
  budget,
  spent,
  metrics,
  campaigns,
  onEdit,
  onPause,
  onDelete,
}: StrategyCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`
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
            <CardTitle className="text-lg font-semibold text-black mb-1">{title}</CardTitle>
            <p className="text-sm text-gray-600 mb-3">{description}</p>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={getStatusColor(status)}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
              <span className="text-xs text-gray-500">{campaigns} campaigns</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Budget */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Budget</span>
          <div className="text-right">
            <div className="text-sm font-medium text-black">
              {formatCurrency(spent)} / {formatCurrency(budget)}
            </div>
            <div className="text-xs text-gray-500">{((spent / budget) * 100).toFixed(1)}% used</div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-sm font-medium text-black">{formatNumber(metrics.reach)}</div>
            <div className="text-xs text-gray-500">Reach</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-sm font-medium text-black">{formatNumber(metrics.engagement)}</div>
            <div className="text-xs text-gray-500">Engagement</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-sm font-medium text-black">{formatNumber(metrics.conversions)}</div>
            <div className="text-xs text-gray-500">Conversions</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-3 border-t border-gray-100">
          <Button variant="outline" size="sm" onClick={onEdit} className="flex-1 bg-transparent">
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={onPause} className="flex-1 bg-transparent">
            {status === "active" ? "Pause" : "Resume"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
