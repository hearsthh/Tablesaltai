import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Clock } from "lucide-react"

interface ChannelPillProps {
  name: string
  status: "connected" | "disconnected" | "pending"
  count?: number
}

export function ChannelPill({ name, status, count }: ChannelPillProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-3 w-3 text-green-600" />
      case "disconnected":
        return <AlertCircle className="h-3 w-3 text-red-600" />
      case "pending":
        return <Clock className="h-3 w-3 text-yellow-600" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800 border-green-200"
      case "disconnected":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  return (
    <Badge variant="outline" className={`${getStatusColor()} flex items-center space-x-1`}>
      {getStatusIcon()}
      <span>{name}</span>
      {count !== undefined && <span className="ml-1">({count})</span>}
    </Badge>
  )
}
