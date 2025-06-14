"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface AIServiceStatus {
  name: string
  status: "active" | "inactive" | "error"
  lastChecked: Date
  features: string[]
}

export function AIServiceStatus() {
  const [services, setServices] = useState<AIServiceStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkServiceStatus()
  }, [])

  const checkServiceStatus = async () => {
    try {
      // Check each AI service
      const serviceChecks = [
        { name: "OpenAI", endpoint: "/api/ai/test-openai" },
        { name: "Fal AI", endpoint: "/api/ai/test-fal" },
        { name: "Anthropic", endpoint: "/api/ai/test-anthropic" },
        { name: "Replicate", endpoint: "/api/ai/test-replicate" },
        { name: "Cohere", endpoint: "/api/ai/test-cohere" },
        { name: "AssemblyAI", endpoint: "/api/ai/test-assemblyai" },
        { name: "Twilio", endpoint: "/api/ai/test-twilio" },
      ]

      const results = await Promise.allSettled(
        serviceChecks.map(async (service) => {
          try {
            const response = await fetch(service.endpoint)
            const data = await response.json()
            return {
              name: service.name,
              status: response.ok ? "active" : "error",
              lastChecked: new Date(),
              features: data.features || [],
            }
          } catch (error) {
            return {
              name: service.name,
              status: "inactive",
              lastChecked: new Date(),
              features: [],
            }
          }
        }),
      )

      const serviceStatuses = results.map((result) => (result.status === "fulfilled" ? result.value : result.reason))

      setServices(serviceStatuses)
    } catch (error) {
      console.error("Error checking service status:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "inactive":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "error":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Services Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Checking service status...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Services Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(service.status)}
                <div>
                  <h4 className="font-medium">{service.name}</h4>
                  <p className="text-sm text-gray-500">Last checked: {service.lastChecked.toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                {service.features.length > 0 && (
                  <div className="text-xs text-gray-500">{service.features.length} features</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
