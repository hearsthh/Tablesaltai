"use client"

import { Badge } from "@/components/ui/badge"
import type { SpendTag, ActivityTag, BehaviorTag } from "@/lib/types/customer-tagging"

interface CustomerTagPillProps {
  tag: SpendTag | ActivityTag | BehaviorTag
  type: "spend" | "activity" | "behavior"
  size?: "sm" | "md"
}

export function CustomerTagPill({ tag, type, size = "sm" }: CustomerTagPillProps) {
  const getTagColor = (tag: string, type: string) => {
    if (type === "spend") {
      switch (tag) {
        case "vip":
          return "bg-purple-100 text-purple-800 border-purple-200"
        case "high_spender":
          return "bg-green-100 text-green-800 border-green-200"
        case "mid_spender":
          return "bg-blue-100 text-blue-800 border-blue-200"
        case "low_spender":
          return "bg-gray-100 text-gray-800 border-gray-200"
        default:
          return "bg-gray-100 text-gray-800 border-gray-200"
      }
    }

    if (type === "activity") {
      switch (tag) {
        case "new":
          return "bg-yellow-100 text-yellow-800 border-yellow-200"
        case "active":
          return "bg-green-100 text-green-800 border-green-200"
        case "loyal":
          return "bg-blue-100 text-blue-800 border-blue-200"
        case "churn_risk":
          return "bg-red-100 text-red-800 border-red-200"
        case "inactive":
          return "bg-gray-100 text-gray-800 border-gray-200"
        default:
          return "bg-gray-100 text-gray-800 border-gray-200"
      }
    }

    // Behavior tags
    return "bg-orange-100 text-orange-800 border-orange-200"
  }

  const getTagLabel = (tag: string) => {
    return tag
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <Badge
      variant="outline"
      className={`${getTagColor(tag, type)} ${size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"} font-medium`}
    >
      {getTagLabel(tag)}
    </Badge>
  )
}
