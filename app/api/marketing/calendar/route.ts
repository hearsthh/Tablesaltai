import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month")
    const year = searchParams.get("year")

    // Mock calendar entries data
    const mockEntries = [
      {
        id: "1",
        campaign_id: "1",
        type: "activity",
        title: "Create Instagram Story",
        description: "Behind-the-scenes cooking video for Diwali campaign",
        scheduled_date: "2024-11-02T14:00:00.000Z",
        assigned_to: "ai",
        status: "pending",
        priority: "high",
        estimated_duration: 30,
        dependencies: [],
        channel: ["Instagram"],
        auto_executable: true,
      },
      {
        id: "2",
        campaign_id: "2",
        type: "task",
        title: "Upload Menu Photos",
        description: "Take photos of new brunch items for weekend campaign",
        scheduled_date: "2024-11-02T16:00:00.000Z",
        assigned_to: "user",
        status: "pending",
        priority: "medium",
        estimated_duration: 45,
        dependencies: [],
        channel: ["Instagram", "Facebook"],
        auto_executable: false,
      },
      {
        id: "3",
        campaign_id: "2",
        type: "activity",
        title: "Send WhatsApp Broadcast",
        description: "Weekend special offer to customer list",
        scheduled_date: "2024-11-02T18:00:00.000Z",
        assigned_to: "ai",
        status: "pending",
        priority: "medium",
        estimated_duration: 15,
        dependencies: [],
        channel: ["WhatsApp"],
        auto_executable: true,
      },
      {
        id: "4",
        type: "activity",
        title: "Analyze Campaign Performance",
        description: "Weekly performance analysis for all active campaigns",
        scheduled_date: "2024-11-01T10:00:00.000Z",
        assigned_to: "ai",
        status: "completed",
        priority: "low",
        estimated_duration: 60,
        dependencies: [],
        channel: ["Instagram", "Facebook", "WhatsApp"],
        auto_executable: true,
      },
      {
        id: "5",
        campaign_id: "1",
        type: "task",
        title: "Design Promotional Banner",
        description: "Create banner for Diwali special menu",
        scheduled_date: "2024-11-03T11:00:00.000Z",
        assigned_to: "user",
        status: "in_progress",
        priority: "high",
        estimated_duration: 90,
        dependencies: [],
        channel: ["Instagram", "Facebook", "Website"],
        auto_executable: false,
      },
      {
        id: "6",
        type: "task",
        title: "Respond to Customer Comments",
        description: "Engage with customers on recent posts",
        scheduled_date: "2024-11-03T15:30:00.000Z",
        assigned_to: "user",
        status: "pending",
        priority: "medium",
        estimated_duration: 30,
        dependencies: [],
        channel: ["Instagram", "Facebook"],
        auto_executable: false,
      },
    ]

    return NextResponse.json({
      success: true,
      entries: mockEntries,
    })
  } catch (error) {
    console.error("Error fetching calendar entries:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { entryId, action, newDate } = body

    // Mock action handling
    let message = ""
    switch (action) {
      case "complete":
        message = "Task marked as completed"
        break
      case "execute":
        message = "Task executed successfully"
        break
      case "reschedule":
        message = "Task rescheduled"
        break
      default:
        message = "Action completed"
    }

    return NextResponse.json({
      success: true,
      message,
    })
  } catch (error) {
    console.error("Error handling calendar action:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
