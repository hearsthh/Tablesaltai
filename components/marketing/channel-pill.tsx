"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, AlertCircle } from "lucide-react"

interface ChannelPillProps {
  name: string
  status: "connected" | "disconnected" | "error" | "pending"
  platform: string
  lastSync?: string
  onConnect?: () => void
  onDisconnect?: () => void
  className?: string
}

export function ChannelPill({
  name,
  status,
  platform,
  lastSync,
  onConnect,
  onDisconnect,
  className,
}: ChannelPillProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          icon: Check,
          color: "bg-green-100 text-green-800 border-green-200",
          label: "Connected",
        }
      case "disconnected":
        return {
          icon: X,
          color: "bg-gray-100 text-gray-800 border-gray-200",
          label: "Disconnected",
        }
      case "error":
        return {
          icon: AlertCircle,
          color: "bg-red-100 text-red-800 border-red-200",
          label: "Error",
        }
      case "pending":
        return {
          icon: AlertCircle,
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          label: "Pending",
        }
      default:
        return {
          icon: X,
          color: "bg-gray-100 text-gray-800 border-gray-200",
          label: "Unknown",
        }
    }
  }

  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon

  return (
    <div className={`flex items-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg ${className}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h4 className="text-sm font-medium text-gray-900 truncate">{name}</h4>
          <Badge variant="outline" className={`text-xs ${statusConfig.color}`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-xs text-gray-500">{platform}</span>
          {lastSync && (
            <>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500">Synced {lastSync}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-1">
        {status === "connected" && onDisconnect && (
          <Button size="sm" variant="outline" onClick={onDisconnect} className="text-xs bg-transparent">
            Disconnect
          </Button>
        )}
        {status !== "connected" && onConnect && (
          <Button size="sm" onClick={onConnect} className="text-xs bg-black text-white hover:bg-gray-800">
            Connect
          </Button>
        )}
      </div>
    </div>
  )
}
