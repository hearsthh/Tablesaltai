import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Verifying environment configuration...")

    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const envStatus = {
      NEXT_PUBLIC_SUPABASE_URL: !!supabaseUrl,
      SUPABASE_SERVICE_ROLE_KEY: !!supabaseServiceKey,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!supabaseAnonKey,
    }

    console.log("Environment variables status:", envStatus)

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        success: false,
        environment: "misconfigured",
        envStatus,
        error: "Missing required Supabase environment variables",
        recommendations: [
          "Set NEXT_PUBLIC_SUPABASE_URL in your environment",
          "Set SUPABASE_SERVICE_ROLE_KEY in your environment",
          "Redeploy your application after setting variables",
        ],
      })
    }

    // Test Supabase connection
    try {
      const supabase = getSupabaseServerClient()
      console.log("✅ Supabase client created successfully")

      // Test basic connection
      const { data, error } = await supabase.from("restaurant_profiles").select("count", { count: "exact" }).limit(0)

      if (error) {
        console.error("❌ Database connection error:", error)
        return NextResponse.json({
          success: false,
          environment: "database_error",
          envStatus,
          error: `Database connection failed: ${error.message}`,
          recommendations: [
            "Check if database schema has been created",
            "Run the production schema script in Supabase",
            "Verify database permissions",
          ],
        })
      }

      console.log("✅ Database connection successful")

      return NextResponse.json({
        success: true,
        environment: "production-ready",
        envStatus,
        message: "Environment is properly configured for production",
        recommendations: ["✅ Ready to create production users"],
      })
    } catch (connectionError) {
      console.error("❌ Supabase connection failed:", connectionError)
      return NextResponse.json({
        success: false,
        environment: "connection_failed",
        envStatus,
        error: `Supabase connection failed: ${connectionError instanceof Error ? connectionError.message : "Unknown error"}`,
        recommendations: [
          "Verify Supabase URL is correct",
          "Check Supabase service role key",
          "Ensure Supabase project is active",
        ],
      })
    }
  } catch (error) {
    console.error("💥 Environment verification error:", error)
    return NextResponse.json({
      success: false,
      environment: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      recommendations: ["Check server logs for detailed error information"],
    })
  }
}
