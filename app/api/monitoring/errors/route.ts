import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const errorData = await request.json()
    const supabase = getSupabaseServerClient()

    // Store error in database
    await supabase.from("error_logs").insert({
      message: errorData.message,
      stack: errorData.stack,
      context: errorData.context,
      environment: errorData.environment,
      url: errorData.url,
      user_agent: errorData.userAgent,
      created_at: errorData.timestamp,
    })

    // In production, you might also send to external services like Sentry
    if (process.env.NODE_ENV === "production" && process.env.SENTRY_DSN) {
      // Send to Sentry or other error tracking service
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to log error:", error)
    return NextResponse.json({ error: "Failed to log error" }, { status: 500 })
  }
}
