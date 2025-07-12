"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Clock, AlertTriangle, User, Bot, Calendar, Filter, Plus } from "lucide-react"
import type { ContentTask } from "@/lib/types/marketing-system"

interface TaskManagerProps {
  tasks: ContentTask[]
  onUpdateTaskStatus: (taskId: string, status: ContentTask["status"]) => void
  onCreateTask: () => void
}

export function TaskManager({ tasks, onUpdateTaskStatus, onCreateTask }: TaskManagerProps) {
  const [filter, setFilter] = useState<"all" | "todo" | "in_progress" | "overdue">("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-800 border-green-200"
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200"
      case "todo":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true
    if (filter === "overdue") {
      return new Date(task.dueDate) < new Date() && task.status !== "done"
    }
    return task.status === filter
  })

  const completedTasks = tasks.filter((task) => task.status === "done").length
  const totalTasks = tasks.length
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const overdueTasks = tasks.filter((task) => new Date(task.dueDate) < new Date() && task.status !== "done").length

  const upcomingTasks = tasks.filter((task) => {
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    return dueDate <= tomorrow && dueDate >= today && task.status !== "done"
  }).length

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">Task Manager</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Track and manage content creation tasks</p>
          </div>
          <Button size="sm" onClick={onCreateTask} className="bg-gray-900 hover:bg-gray-800 text-white">
            <Plus className="w-4 h-4 mr-1" />
            Add Task
          </Button>
        </div>

        {/* Progress Overview */}
        <div className="mt-4 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm text-gray-600">
                {completedTasks} / {totalTasks} completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-2 bg-red-50 rounded-lg">
              <div className="text-lg font-semibold text-red-900">{overdueTasks}</div>
              <div className="text-xs text-red-700">Overdue</div>
            </div>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <div className="text-lg font-semibold text-yellow-900">{upcomingTasks}</div>
              <div className="text-xs text-yellow-700">Due Soon</div>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-900">{completedTasks}</div>
              <div className="text-xs text-green-700">Completed</div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Filters */}
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-4 h-4 text-gray-500" />
          <div className="flex space-x-1">
            {(["all", "todo", "in_progress", "overdue"] as const).map((filterOption) => (
              <Button
                key={filterOption}
                variant={filter === filterOption ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(filterOption)}
                className={filter === filterOption ? "bg-gray-900 text-white" : "bg-white text-xs"}
              >
                {filterOption === "all"
                  ? "All"
                  : filterOption === "todo"
                    ? "To Do"
                    : filterOption === "in_progress"
                      ? "In Progress"
                      : "Overdue"}
              </Button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No tasks found</p>
              <p className="text-xs">Create your first task to get started</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 border rounded-lg transition-all ${
                  task.status === "done"
                    ? "bg-green-50 border-green-200"
                    : task.status === "overdue"
                      ? "bg-red-50 border-red-200"
                      : "bg-white border-gray-200 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={task.status === "done"}
                    onCheckedChange={(checked) => {
                      onUpdateTaskStatus(task.id, checked ? "done" : "todo")
                    }}
                    className="mt-1"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4
                          className={`font-medium ${task.status === "done" ? "line-through text-gray-500" : "text-gray-900"}`}
                        >
                          {task.description}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className={getStatusColor(task.status)}>
                            {task.status.replace("_", " ")}
                          </Badge>
                          <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            {task.assignedTo === "ai" ? (
                              <>
                                <Bot className="w-3 h-3" />
                                <span>AI</span>
                              </>
                            ) : (
                              <>
                                <User className="w-3 h-3" />
                                <span>User</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="text-xs text-gray-500">{task.estimatedTime}min</div>
                      </div>
                    </div>

                    {task.notes && <p className="text-sm text-gray-600 mt-2">{task.notes}</p>}

                    {task.dependencies.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">Depends on: </span>
                        <span className="text-xs text-gray-700">{task.dependencies.length} task(s)</span>
                      </div>
                    )}

                    {task.autoComplete && task.assignedTo === "ai" && task.status === "todo" && (
                      <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                        <div className="flex items-center space-x-2 text-xs text-blue-800">
                          <Bot className="w-3 h-3" />
                          <span>This task will be completed automatically by AI</span>
                        </div>
                      </div>
                    )}

                    {task.status === "overdue" && (
                      <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                        <div className="flex items-center space-x-2 text-xs text-red-800">
                          <AlertTriangle className="w-3 h-3" />
                          <span>This task is overdue</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
