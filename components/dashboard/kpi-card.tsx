import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: "increase" | "decrease"
  subtitle?: string
  icon?: React.ReactNode
  badge?: {
    text: string
    variant?: "default" | "secondary" | "destructive" | "outline"
  }
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
  className?: string
}

export function KpiCard({ title, value, change, changeType, subtitle, icon, badge, trend, className }: KpiCardProps) {
  const formatChange = (change: number) => {
    const sign = change > 0 ? "+" : ""
    return `${sign}${change}%`
  }

  const getChangeColor = (change: number, type?: "increase" | "decrease") => {
    if (type === "increase") return change > 0 ? "text-green-600" : "text-red-600"
    if (type === "decrease") return change < 0 ? "text-green-600" : "text-red-600"
    return change > 0 ? "text-green-600" : "text-red-600"
  }

  return (
    <Card className={`bg-white border-gray-200 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        {icon && <div className="text-gray-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-black">{value}</div>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
            {change !== undefined && (
              <div className={`flex items-center text-xs mt-1 ${getChangeColor(change, changeType)}`}>
                {change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {formatChange(change)}
              </div>
            )}
            {trend && (
              <div className={`flex items-center text-xs mt-1 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                {trend.isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {trend.isPositive ? "+" : ""}
                {trend.value}% {trend.label}
              </div>
            )}
          </div>
          {badge && (
            <Badge variant={badge.variant || "default"} className="text-xs">
              {badge.text}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
