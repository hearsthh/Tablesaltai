import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MoreHorizontal, Calendar, Target, MousePointer } from "lucide-react"

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
}: CampaignCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
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

  const ctr = performance.impressions > 0 ? ((performance.clicks / performance.impressions) * 100).toFixed(2) : "0.00"
  const conversionRate =
    performance.clicks > 0 ? ((performance.conversions / performance.clicks) * 100).toFixed(2) : "0.00"
  const budgetUsed = budget > 0 ? (spent / budget) * 100 : 0

  return (
    <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-black mb-1">{title}</CardTitle>
            <p className="text-sm text-gray-600 mb-3">{description}</p>
            <Badge variant="outline" className={getStatusColor(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Budget Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Budget Usage</span>
            <span className="text-sm text-gray-600">{budgetUsed.toFixed(1)}%</span>
          </div>
          <Progress value={budgetUsed} className="h-2" />
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500">Spent: {formatCurrency(spent)}</span>
            <span className="text-xs text-gray-500">Total: {formatCurrency(budget)}</span>
          </div>
        </div>

        {/* Campaign Duration */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>
            {startDate} - {endDate}
          </span>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Impressions</span>
              <span className="text-sm font-medium text-black">{formatNumber(performance.impressions)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Clicks</span>
              <span className="text-sm font-medium text-black">{formatNumber(performance.clicks)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">CTR</span>
              <span className="text-sm font-medium text-black">{ctr}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Conversions</span>
              <span className="text-sm font-medium text-black">{formatNumber(performance.conversions)}</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-sm">
            <MousePointer className="h-4 w-4 text-blue-600" />
            <span className="text-gray-600">CTR:</span>
            <span className="font-medium text-black">{ctr}%</span>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <Target className="h-4 w-4 text-green-600" />
            <span className="text-gray-600">Conv:</span>
            <span className="font-medium text-black">{conversionRate}%</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-3 border-t border-gray-100">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            View Details
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            {status === "active" ? "Pause" : status === "paused" ? "Resume" : "Edit"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
