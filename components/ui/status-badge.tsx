import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface StatusBadgeProps {
  status: "connected" | "disconnected" | "error"
  text?: string
}

export function StatusBadge({ status, text }: StatusBadgeProps) {
  const config = {
    connected: {
      icon: CheckCircle,
      className: "bg-green-100 text-green-800 hover:bg-green-100",
      text: text || "Connected",
    },
    disconnected: {
      icon: XCircle,
      className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
      text: text || "Disconnected",
    },
    error: {
      icon: AlertCircle,
      className: "bg-red-100 text-red-800 hover:bg-red-100",
      text: text || "Error",
    },
  }

  const { icon: Icon, className, text: displayText } = config[status]

  return (
    <Badge className={className}>
      <Icon className="w-3 h-3 mr-1" />
      {displayText}
    </Badge>
  )
}
