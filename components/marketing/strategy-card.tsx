"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, TrendingUp, Users, Calendar } from "lucide-react"

interface StrategyCardProps {
  title: string
  description: string
  status: "active" | "draft" | "completed"
  metrics: {
    reach?: number
    engagement?: number
    conversions?: number
  }
  lastUpdated: string
  onEdit?: () => void
  onView?: () => void
}

export function StrategyCard({ title, description, status, metrics, lastUpdated, onEdit, onView }: StrategyCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
    }
  }

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

        <div className="grid grid-cols-3 gap-4 mb-4">
          {metrics.reach && (
            <div className="text-center">
              <div className="text-lg font-bold text-black">{metrics.reach.toLocaleString()}</div>
              <div className="text-xs text-gray-500 flex items-center justify-center">
                <Users className="h-3 w-3 mr-1" />
                Reach
              </div>
            </div>
          )}
          {metrics.engagement && (
            <div className="text-center">
              <div className="text-lg font-bold text-black">{metrics.engagement}%</div>
              <div className="text-xs text-gray-500 flex items-center justify-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Engagement
              </div>
            </div>
          )}
          {metrics.conversions && (
            <div className="text-center">
              <div className="text-lg font-bold text-black">{metrics.conversions}</div>
              <div className="text-xs text-gray-500">Conversions</div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            Updated {lastUpdated}
          </div>
          <div className="flex space-x-2">
            {onView && (
              <Button variant="outline" size="sm" onClick={onView}>
                View
              </Button>
            )}
            {onEdit && (
              <Button size="sm" onClick={onEdit} className="bg-black hover:bg-gray-800 text-white">
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
