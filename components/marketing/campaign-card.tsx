"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MoreHorizontal, Calendar, Target } from "lucide-react"

interface CampaignCardProps {
  title: string
  description: string
  status: "active" | "scheduled" | "completed" | "paused"
  budget: number
  spent: number
  startDate: string
  endDate: string
  performance: {
    impressions: number
    clicks: number
    conversions: number
  }
  onEdit?: () => void
  onView?: () => void
  onPause?: () => void
}

export function CampaignCard({
  title,
  description,
  status,
  budget,
  spent,
  startDate,
  endDate,
  performance,
  onEdit,
  onView,
  onPause,
}: CampaignCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const budgetProgress = (spent / budget) * 100

  return (
    <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-lg font-semibold text-black">{title}</CardTitle>
          <Badge className={getStatusColor()}>{status}</Badge>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm mb-4">{description}</p>

        {/* Budget Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Budget</span>
            <span className="text-sm text-gray-600">
              ₹{spent.toLocaleString()} / ₹{budget.toLocaleString()}
            </span>
          </div>
          <Progress value={budgetProgress} className="h-2" />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-black">{performance.impressions.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Impressions</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-black">{performance.clicks.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Clicks</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-black">{performance.conversions}</div>
            <div className="text-xs text-gray-500">Conversions</div>
          </div>
        </div>

        {/* Campaign Dates */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            {startDate} - {endDate}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Target className="h-3 w-3 mr-1" />
            CTR: {((performance.clicks / performance.impressions) * 100).toFixed(2)}%
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          {onView && (
            <Button variant="outline" size="sm" onClick={onView}>
              View Details
            </Button>
          )}
          {onEdit && (
            <Button size="sm" onClick={onEdit} className="bg-black hover:bg-gray-800 text-white">
              Edit
            </Button>
          )}
          {onPause && status === "active" && (
            <Button variant="outline" size="sm" onClick={onPause}>
              Pause
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
