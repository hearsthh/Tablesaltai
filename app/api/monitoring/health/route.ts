import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: "healthy",
    checks: {
      database: { status: "unknown", responseTime: 0 },
      auth: { status: "unknown", responseTime: 0 },
      storage: { status: "unknown", responseTime: 0 },
      ai: { status: "unknown", responseTime: 0 },
    },
  }

  try {
    // Database check
    const dbStart = Date.now()
    const supabase = getSupabaseServerClient()
    await supabase.from("restaurant_profiles").select("id").limit(1)
    checks.checks.database = {
      status: "healthy",
      responseTime: Date.now() - dbStart,
    }

    // Auth check
    const authStart = Date.now()
    await supabase.auth.getUser()
    checks.checks.auth = {
      status: "healthy",
      responseTime: Date.now() - authStart,
    }

    // AI service check
    const aiStart = Date.now()
    if (process.env.OPENAI_API_KEY) {
      // Simple ping to OpenAI
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      })
      checks.checks.ai = {
        status: response.ok ? "healthy" : "unhealthy",
        responseTime: Date.now() - aiStart,
      }
    } else {
      checks.checks.ai = { status: "not_configured", responseTime: 0 }
    }

    // Overall status
    const allHealthy = Object.values(checks.checks).every(
      (check) => check.status === "healthy" || check.status === "not_configured",
    )
    checks.status = allHealthy ? "healthy" : "unhealthy"

    return NextResponse.json(checks, {
      status: allHealthy ? 200 : 503,
    })
  } catch (error) {
    checks.status = "unhealthy"
    return NextResponse.json(checks, { status: 503 })
  }
}
