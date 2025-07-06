import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.scheduledDateTime) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // In a real app, you would save to database
    // For now, we'll simulate success
    const taskId = `task_${Date.now()}`

    // Mock task creation
    const newTask = {
      id: taskId,
      title: body.title,
      description: body.description,
      type: body.type,
      priority: body.priority,
      assignedTo: body.assignedTo,
      scheduledDateTime: body.scheduledDateTime,
      estimatedDuration: body.estimatedDuration,
      campaign: body.campaign !== "none" ? body.campaign : null,
      strategy: body.strategy !== "none" ? body.strategy : null,
      channels: body.channels,
      contentType: body.contentType,
      autoExecute: body.autoExecute,
      budget: body.budget,
      targetMetrics: body.targetMetrics,
      status: "pending",
      progress: 0,
      createdAt: new Date().toISOString(),
    }

    // Simulate database save delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      task: newTask,
      message: "Task created successfully",
    })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
