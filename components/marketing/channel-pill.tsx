import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"

interface ChannelPillProps {
  name: string
  status: "connected" | "disconnected" | "pending" | "error"
  count?: number
  className?: string
}

export function ChannelPill({ name, status, count, className }: ChannelPillProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-3 w-3 text-green-600" />
      case "disconnected":
        return <XCircle className="h-3 w-3 text-gray-400" />
      case "pending":
        return <Clock className="h-3 w-3 text-yellow-600" />
      case "error":
        return <AlertCircle className="h-3 w-3 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "bg-green-50 text-green-700 border-green-200"
      case "disconnected":
        return "bg-gray-50 text-gray-600 border-gray-200"
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "error":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-600 border-gray-200"
    }
  }

  return (
    <Badge variant="outline" className={`flex items-center space-x-2 px-3 py-1 ${getStatusColor()} ${className}`}>
      {getStatusIcon()}
      <span className="font-medium">{name}</span>
      {count && <span className="text-xs">({count.toLocaleString()})</span>}
    </Badge>
  )
}
