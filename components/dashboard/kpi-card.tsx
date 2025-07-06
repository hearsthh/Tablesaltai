import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
  badge?: {
    text: string
    variant?: "default" | "secondary" | "destructive" | "outline"
  }
  className?: string
}

export function KpiCard({ title, value, icon: Icon, trend, badge, className }: KpiCardProps) {
  return (
    <Card className={`border-gray-200 ${className}`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          {badge && (
            <Badge variant={badge.variant || "secondary"} className="text-xs">
              {badge.text}
            </Badge>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-xs sm:text-sm text-gray-600">{title}</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center space-x-1">
              <span className={`text-xs font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-gray-500">{trend.label}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
