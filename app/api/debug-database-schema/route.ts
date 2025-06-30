import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Starting database schema debug...")

    // First, let's check what environment variables we actually have
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Missing",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
      SUPABASE_URL: process.env.SUPABASE_URL ? "✅ Set" : "❌ Missing",
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
    }

    console.log("🔧 Environment Variables Check:", envCheck)

    // Show partial values for debugging (first 20 chars)
    const envValues = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + "..." || "Not set",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + "..." || "Not set",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + "..." || "Not set",
    }

    console.log("🔧 Environment Values (partial):", envValues)

    // Check if we have the minimum required variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl) {
      return NextResponse.json({
        success: false,
        issue: "missing_supabase_url",
        error: "Supabase URL not found in environment variables",
        envCheck,
        envValues,
        recommendation: "Set NEXT_PUBLIC_SUPABASE_URL in your environment variables",
        availableVars: Object.keys(process.env).filter((key) => key.toLowerCase().includes("supabase")),
      })
    }

    if (!supabaseServiceKey && !supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        issue: "missing_supabase_keys",
        error: "Neither service role key nor anon key found",
        envCheck,
        envValues,
        recommendation: "Set either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY",
        availableVars: Object.keys(process.env).filter((key) => key.toLowerCase().includes("supabase")),
      })
    }

    // Try to create Supabase client with available credentials
    let supabase
    try {
      const { createClient } = await import("@supabase/supabase-js")

      // Prefer service role key for admin operations, fallback to anon key
      const keyToUse = supabaseServiceKey || supabaseAnonKey
      const keyType = supabaseServiceKey ? "service_role" : "anon"

      console.log(`🔑 Using ${keyType} key for connection`)

      supabase = createClient(supabaseUrl, keyToUse, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })

      console.log("✅ Supabase client created successfully")
    } catch (clientError) {
      console.error("❌ Failed to create Supabase client:", clientError)
      return NextResponse.json({
        success: false,
        issue: "client_creation_failed",
        error: clientError instanceof Error ? clientError.message : "Unknown client creation error",
        envCheck,
        envValues,
        recommendation: "Check if @supabase/supabase-js is properly installed",
      })
    }

    // Test basic connection
    try {
      console.log("🔌 Testing basic connection...")

      // Try a simple query that should work with any key
      const { data: connectionTest, error: connectionError } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public")
        .limit(1)

      if (connectionError) {
        console.error("❌ Connection test failed:", connectionError)

        // Check if it's a permission issue
        if (connectionError.message.includes("permission") || connectionError.message.includes("access")) {
          return NextResponse.json({
            success: false,
            issue: "permission_denied",
            error: connectionError.message,
            envCheck,
            recommendation:
              "Check if your Supabase key has the required permissions. Service role key is recommended for admin operations.",
          })
        }

        return NextResponse.json({
          success: false,
          issue: "connection_failed",
          error: connectionError.message,
          envCheck,
          recommendation: "Verify your Supabase URL and key are correct",
        })
      }

      console.log("✅ Basic connection test passed")
    } catch (connectionError) {
      console.error("❌ Connection test exception:", connectionError)
      return NextResponse.json({
        success: false,
        issue: "connection_exception",
        error: connectionError instanceof Error ? connectionError.message : "Unknown connection error",
        envCheck,
        recommendation: "Check your network connection and Supabase project status",
      })
    }

    // If we get here, connection is working - proceed with schema check
    console.log("🔍 Connection working, checking schema...")

    // Get existing tables
    const { data: existingTables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")

    if (tablesError) {
      console.error("❌ Cannot query tables:", tablesError)
      return NextResponse.json({
        success: false,
        issue: "cannot_query_tables",
        error: tablesError.message,
        envCheck,
        recommendation: "Database connection works but cannot query tables - check permissions",
      })
    }

    const tableNames = existingTables?.map((t) => t.table_name) || []
    console.log("📋 Found tables:", tableNames)

    // Expected tables for our application
    const expectedTables = [
      "restaurant_profiles",
      "menu_categories",
      "menu_items",
      "reviews",
      "review_settings",
      "restaurant_analytics",
      "platform_integrations",
      "generated_content",
      "marketing_campaigns",
      "customer_segments",
      "activity_logs",
      "subscriptions",
    ]

    const missingTables = expectedTables.filter((table) => !tableNames.includes(table))
    const presentTables = expectedTables.filter((table) => tableNames.includes(table))

    // Test restaurant_profiles table if it exists
    let restaurantProfilesTest = null
    if (tableNames.includes("restaurant_profiles")) {
      try {
        const { data, error } = await supabase.from("restaurant_profiles").select("count", { count: "exact" }).limit(0)

        restaurantProfilesTest = {
          status: error ? "error" : "working",
          error: error?.message,
          count: data?.length || 0,
        }
      } catch (testError) {
        restaurantProfilesTest = {
          status: "error",
          error: testError instanceof Error ? testError.message : "Unknown error",
        }
      }
    }

    return NextResponse.json({
      success: true,
      diagnosis: {
        connectionWorking: true,
        totalTables: tableNames.length,
        expectedTables: expectedTables.length,
        presentTables: presentTables.length,
        missingTables: missingTables.length,
        restaurantProfilesTest,
        keyType: supabaseServiceKey ? "service_role" : "anon",
      },
      details: {
        allTables: tableNames,
        presentTables,
        missingTables,
        envCheck,
      },
      recommendations: generateRecommendations(
        missingTables,
        restaurantProfilesTest,
        supabaseServiceKey ? "service_role" : "anon",
      ),
    })
  } catch (error) {
    console.error("💥 Database schema debug error:", error)
    return NextResponse.json({
      success: false,
      issue: "debug_failed",
      error: error instanceof Error ? error.message : "Unknown error",
      envCheck: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Missing",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
      },
      recommendation: "Check server logs and environment variable configuration",
    })
  }
}

function generateRecommendations(missingTables: string[], profileTest: any, keyType: string) {
  const recommendations = []

  if (keyType === "anon") {
    recommendations.push({
      type: "warning",
      message: "Using anonymous key instead of service role key",
      action: "Set SUPABASE_SERVICE_ROLE_KEY for full admin access to create/modify tables",
    })
  }

  if (missingTables.length === 0) {
    recommendations.push({
      type: "success",
      message: "All expected tables are present",
      action: "Database schema looks good!",
    })
  } else if (missingTables.length < 6) {
    recommendations.push({
      type: "warning",
      message: `${missingTables.length} tables are missing`,
      action: "Run the table creation script for missing tables only",
    })
  } else {
    recommendations.push({
      type: "error",
      message: "Most tables are missing",
      action: "Run the complete database schema creation script",
    })
  }

  if (profileTest?.status === "error") {
    recommendations.push({
      type: "warning",
      message: "restaurant_profiles table has issues",
      action: "May need to recreate the table with proper structure",
    })
  }

  return recommendations
}
