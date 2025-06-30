import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Debug: Checking Supabase configuration...")

    // Check all possible environment variable names
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_URL: process.env.SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
      NODE_ENV: process.env.NODE_ENV,
    }

    // Check which variables are set (without exposing sensitive values)
    const envStatus = Object.entries(envVars).map(([key, value]) => ({
      name: key,
      exists: !!value,
      length: value ? value.length : 0,
      preview: value ? `${value.substring(0, 10)}...` : "NOT_SET",
    }))

    console.log("Environment Variables Status:", envStatus)

    // Determine if we're in a production-ready environment
    const hasRequiredVars = !!(
      (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) &&
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY) &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)
    )

    const environment = hasRequiredVars ? "production-ready" : "development"

    // Test connection if we have the required variables
    let connectionTest = {
      status: "skipped",
      message: "Using development mode - no real database connection needed",
      error: null,
    }

    if (hasRequiredVars) {
      try {
        const { getSupabaseServerClient } = await import("@/lib/supabase/server")
        const supabase = getSupabaseServerClient()

        const { data, error } = await supabase.from("restaurant_profiles").select("count", { count: "exact" }).limit(0)

        if (error) {
          connectionTest = {
            status: "failed",
            message: `Database connection failed: ${error.message}`,
            error: error.message,
          }
        } else {
          connectionTest = {
            status: "success",
            message: "Database connection successful",
            error: null,
          }
        }
      } catch (error) {
        connectionTest = {
          status: "failed",
          message: `Connection test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    }

    return NextResponse.json({
      success: true,
      environment,
      hasRequiredVars,
      envStatus,
      connectionTest,
      recommendations: generateRecommendations(environment, hasRequiredVars, connectionTest),
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Debug failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function generateRecommendations(environment: string, hasRequiredVars: boolean, connectionTest: any) {
  const recommendations = []

  if (environment === "development") {
    recommendations.push({
      type: "info",
      message: "Running in v0 development environment",
      action: "The system will use mock data for testing. This is normal for v0 preview.",
    })

    recommendations.push({
      type: "success",
      message: "Development mode is working correctly",
      action: "You can test all features with simulated data in v0.",
    })

    if (!hasRequiredVars) {
      recommendations.push({
        type: "info",
        message: "For production deployment, you'll need to configure Supabase environment variables",
        action:
          "Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY to your production environment.",
      })
    }
  } else {
    if (connectionTest.status === "success") {
      recommendations.push({
        type: "success",
        message: "Production environment is properly configured!",
        action: "All systems ready for real-world deployment.",
      })
    } else if (connectionTest.status === "failed") {
      recommendations.push({
        type: "warning",
        message: `Database connection issue: ${connectionTest.error}`,
        action: "Check your Supabase project status and credentials.",
      })
    }
  }

  return recommendations
}
