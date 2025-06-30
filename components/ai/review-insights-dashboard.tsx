"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, ThumbsUp, Target, CheckCircle, Clock, Play, ExternalLink, Zap } from "lucide-react"

interface ReviewInsight {
  text: string
  percentage: number
  sentiment?: "positive" | "negative" | "neutral"
  severity?: "low" | "medium" | "high"
}

interface ImprovementTask {
  id: number
  title: string
  description: string
  type: "internal" | "external"
  progress: number
  status: "pending" | "in-progress" | "completed"
  estimatedDays: number
}

interface ReviewInsightsDashboardProps {
  highlights: ReviewInsight[]
  redFlags: ReviewInsight[]
  useCases: ReviewInsight[]
  tasks: ImprovementTask[]
  onRunAnalysis?: () => void
}

export function ReviewInsightsDashboard({
  highlights,
  redFlags,
  useCases,
  tasks,
  onRunAnalysis,
}: ReviewInsightsDashboardProps) {
  const positivePercentage = Math.round((highlights.length / (highlights.length + redFlags.length)) * 100)
  const issuesCount = redFlags.filter((flag) => flag.severity === "high" || flag.severity === "medium").length

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base sm:text-lg flex items-center text-gray-900">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                AI Review Insights
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Powered by AI analysis of all connected platforms
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-gray-100 text-gray-800 text-xs">Last updated: 2 hours ago</Badge>
              {onRunAnalysis && (
                <Button size="sm" onClick={onRunAnalysis} className="bg-black hover:bg-gray-800">
                  <Zap className="w-4 h-4 mr-2" />
                  Refresh Analysis
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <ThumbsUp className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-900">{positivePercentage}%</p>
                <p className="text-sm text-green-700">Positive Sentiment</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-900">{issuesCount}</p>
                <p className="text-sm text-red-700">Issues to Address</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="highlights" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="highlights" className="text-xs sm:text-sm">
                Highlights
              </TabsTrigger>
              <TabsTrigger value="redflags" className="text-xs sm:text-sm">
                Red Flags
              </TabsTrigger>
              <TabsTrigger value="usecases" className="text-xs sm:text-sm">
                Use Cases
              </TabsTrigger>
            </TabsList>

            <TabsContent value="highlights" className="space-y-4">
              <div className="space-y-3">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ThumbsUp className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-900">{highlight.text}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${highlight.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{highlight.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="redflags" className="space-y-4">
              <div className="space-y-3">
                {redFlags.map((flag, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle
                        className={`w-5 h-5 ${
                          flag.severity === "high"
                            ? "text-red-600"
                            : flag.severity === "medium"
                              ? "text-yellow-600"
                              : "text-orange-600"
                        }`}
                      />
                      <span className="text-sm text-gray-900">{flag.text}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={
                          flag.severity === "high"
                            ? "bg-red-100 text-red-800"
                            : flag.severity === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-orange-100 text-orange-800"
                        }
                      >
                        {flag.severity}
                      </Badge>
                      <span className="text-sm font-semibold text-gray-900">{flag.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="usecases" className="space-y-4">
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Based on customer reviews, here's how people use your restaurant:
                </p>
                {useCases.map((useCase, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <span className="text-sm text-gray-900">{useCase.text}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-black h-2 rounded-full" style={{ width: `${useCase.percentage}%` }}></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{useCase.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Improvement Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center text-gray-900">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            AI-Generated Improvement Plan
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Actionable tasks to improve your ratings and customer satisfaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                      <Badge variant={task.type === "internal" ? "default" : "secondary"} className="text-xs">
                        {task.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{task.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {task.status === "completed" ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : task.status === "in-progress" ? (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    ) : (
                      <Play className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="text-xs text-gray-600">{task.estimatedDays}d</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Progress</span>
                    <span className="text-xs font-medium text-gray-900">{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-2" />
                </div>

                {task.type === "internal" && task.status === "pending" && (
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" className="bg-black hover:bg-gray-800 text-xs">
                      <Play className="w-3 h-3 mr-1" />
                      Start Task
                    </Button>
                  </div>
                )}

                {task.type === "external" && (
                  <div className="mt-3">
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
