"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, BarChart3, AlertCircle } from "lucide-react"

interface InsightCardProps {
  title: string
  description: string
  type: string
  priority: "high" | "medium" | "low"
  actionText: string
  actionRequired: boolean
  onAction?: () => void
}

export function InsightCard({
  title,
  description,
  type,
  priority,
  actionText,
  actionRequired,
  onAction,
}: InsightCardProps) {
  const getIcon = () => {
    switch (type) {
      case "revenue":
        return TrendingUp
      case "customer":
        return Users
      case "marketing":
        return BarChart3
      default:
        return AlertCircle
    }
  }

  const getPriorityColor = () => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const Icon = getIcon()

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="w-5 h-5 text-gray-600" />
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </div>
          <Badge className={getPriorityColor()}>{priority}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        {actionRequired && (
          <Button size="sm" onClick={onAction} className="w-full">
            {actionText}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
