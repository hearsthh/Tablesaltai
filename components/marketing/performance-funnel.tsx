"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { PerformanceFunnel as PerformanceFunnelType } from "@/types/marketing"

interface PerformanceFunnelProps {
  data: PerformanceFunnelType
  title?: string
  showTrends?: boolean
  previousData?: PerformanceFunnelType
}

export function PerformanceFunnel({
  data,
  title = "Performance Funnel",
  showTrends = false,
  previousData,
}: PerformanceFunnelProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toLocaleString()
  }

  const formatCurrency = (amount: number) => {
    return `₹${formatNumber(amount)}`
  }

  const calculateTrend = (current: number, previous: number) => {
    if (!previous) return 0
    return ((current - previous) / previous) * 100
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-3 h-3 text-green-600" />
    if (trend < 0) return <TrendingDown className="w-3 h-3 text-red-600" />
    return <Minus className="w-3 h-3 text-gray-400" />
  }

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-green-600"
    if (trend < 0) return "text-red-600"
    return "text-gray-400"
  }

  const funnelSteps = [
    {
      label: "Reach",
      value: data.reach,
      previous: previousData?.reach,
      color: "bg-blue-500",
      percentage: 100,
    },
    {
      label: "Engagement",
      value: data.engagement,
      previous: previousData?.engagement,
      color: "bg-green-500",
      percentage: data.reach > 0 ? (data.engagement / data.reach) * 100 : 0,
    },
    {
      label: "Conversions",
      value: data.conversions,
      previous: previousData?.conversions,
      color: "bg-purple-500",
      percentage: data.engagement > 0 ? (data.conversions / data.engagement) * 100 : 0,
    },
  ]

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Funnel Visualization */}
        <div className="space-y-4">
          {funnelSteps.map((step, index) => {
            const trend = step.previous ? calculateTrend(step.value, step.previous) : 0
            const width = Math.max(step.percentage, 10) // Minimum width for visibility

            return (
              <div key={step.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{step.label}</span>
                    {showTrends && step.previous && (
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(trend)}
                        <span className={`text-xs ${getTrendColor(trend)}`}>{Math.abs(trend).toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{formatNumber(step.value)}</div>
                    {index > 0 && <div className="text-xs text-gray-500">{step.percentage.toFixed(1)}% conversion</div>}
                  </div>
                </div>

                {/* Funnel Bar */}
                <div className="relative">
                  <div className="w-full h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className={`h-full ${step.color} transition-all duration-500 ease-out flex items-center justify-center`}
                      style={{ width: `${width}%` }}
                    >
                      <span className="text-white text-xs font-medium">{formatNumber(step.value)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-sm text-gray-600">Total Spend</div>
            <div className="text-lg font-semibold text-gray-900">{formatCurrency(data.spend)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">ROI</div>
            <div className="text-lg font-semibold text-gray-900">{data.roi.toFixed(1)}x</div>
            {showTrends && previousData && (
              <div className="flex items-center justify-center space-x-1 mt-1">
                {getTrendIcon(calculateTrend(data.roi, previousData.roi))}
                <span className={`text-xs ${getTrendColor(calculateTrend(data.roi, previousData.roi))}`}>
                  {Math.abs(calculateTrend(data.roi, previousData.roi)).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Performance Badge */}
        <div className="flex justify-center">
          <Badge
            className={
              data.roi >= 3
                ? "bg-green-100 text-green-800"
                : data.roi >= 2
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }
          >
            {data.roi >= 3 ? "Excellent Performance" : data.roi >= 2 ? "Good Performance" : "Needs Improvement"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
