import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Starting comprehensive database diagnostic...")

    const supabase = getSupabaseServerClient()

    // Test 1: Basic connection test
    console.log("📡 Testing basic Supabase connection...")
    let connectionTest
    try {
      const { data: healthCheck, error: healthError } = await supabase
        .from("restaurant_profiles")
        .select("count", { count: "exact", head: true })

      connectionTest = {
        success: !healthError,
        error: healthError?.message || null,
        details: healthError?.details || null,
        hint: healthError?.hint || null,
        code: healthError?.code || null,
      }
      console.log("📡 Connection test result:", connectionTest)
    } catch (err) {
      connectionTest = {
        success: false,
        error: err instanceof Error ? err.message : "Connection failed",
        type: "connection_error",
      }
      console.error("📡 Connection test failed:", err)
    }

    // Test 2: Check if table exists
    console.log("🗄️ Checking if restaurant_profiles table exists...")
    let tableExists
    try {
      const { data: tableCheck, error: tableError } = await supabase.from("restaurant_profiles").select("id").limit(1)

      tableExists = {
        exists: !tableError,
        error: tableError?.message || null,
        code: tableError?.code || null,
        details: tableError?.details || null,
      }
      console.log("🗄️ Table existence check:", tableExists)
    } catch (err) {
      tableExists = {
        exists: false,
        error: err instanceof Error ? err.message : "Table check failed",
        type: "table_check_error",
      }
      console.error("🗄️ Table check failed:", err)
    }

    // Test 3: List all tables in public schema
    console.log("📋 Listing all tables in public schema...")
    let allTables
    try {
      const { data: tables, error: tablesError } = await supabase.rpc("get_schema_tables")

      if (tablesError) {
        // Fallback: try a different approach
        const { data: fallbackTables, error: fallbackError } = await supabase
          .from("information_schema.tables")
          .select("table_name")
          .eq("table_schema", "public")
          .eq("table_type", "BASE TABLE")

        allTables = {
          success: !fallbackError,
          tables: fallbackTables || [],
          error: fallbackError?.message || null,
          method: "information_schema",
        }
      } else {
        allTables = {
          success: true,
          tables: tables || [],
          error: null,
          method: "rpc",
        }
      }
      console.log("📋 Tables found:", allTables)
    } catch (err) {
      allTables = {
        success: false,
        error: err instanceof Error ? err.message : "Failed to list tables",
        tables: [],
        type: "table_list_error",
      }
      console.error("📋 Table listing failed:", err)
    }

    // Test 4: Check custom types
    console.log("🏷️ Checking custom types...")
    let customTypes
    try {
      const { data: types, error: typesError } = await supabase
        .from("information_schema.types")
        .select("typname")
        .eq("typtype", "e") // enum types

      customTypes = {
        success: !typesError,
        types: types || [],
        error: typesError?.message || null,
      }
      console.log("🏷️ Custom types found:", customTypes)
    } catch (err) {
      customTypes = {
        success: false,
        error: err instanceof Error ? err.message : "Failed to check types",
        types: [],
        type: "types_check_error",
      }
      console.error("🏷️ Types check failed:", err)
    }

    // Test 5: Environment variables check
    console.log("🔐 Checking environment configuration...")
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: {
        exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        length: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
        preview: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + "..." || "NOT_SET",
      },
      SUPABASE_SERVICE_ROLE_KEY: {
        exists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
        preview: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + "..." || "NOT_SET",
      },
      NEXT_PUBLIC_SUPABASE_ANON_KEY: {
        exists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        length: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
        preview: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + "..." || "NOT_SET",
      },
    }

    // Compile comprehensive report
    const diagnosticReport = {
      timestamp: new Date().toISOString(),
      overall_status: connectionTest.success && tableExists.exists ? "healthy" : "issues_detected",
      tests: {
        connection: connectionTest,
        table_exists: tableExists,
        all_tables: allTables,
        custom_types: customTypes,
        environment: envCheck,
      },
      recommendations: [],
    }

    // Add recommendations based on test results
    if (!connectionTest.success) {
      diagnosticReport.recommendations.push("❌ Database connection failed - check environment variables")
    }

    if (!tableExists.exists) {
      diagnosticReport.recommendations.push("❌ restaurant_profiles table not found - run database schema script")
    }

    if (allTables.tables.length === 0) {
      diagnosticReport.recommendations.push("❌ No tables found - database schema needs to be created")
    }

    if (customTypes.types.length === 0) {
      diagnosticReport.recommendations.push("❌ No custom types found - enum types may not be created")
    }

    if (diagnosticReport.overall_status === "healthy") {
      diagnosticReport.recommendations.push("✅ Database appears healthy - ready for testing")
    }

    console.log("📊 Diagnostic complete:", diagnosticReport.overall_status)

    return NextResponse.json(diagnosticReport, { status: 200 })
  } catch (error) {
    console.error("🚨 Diagnostic tool error:", error)

    // Detailed error information
    const errorDetails = {
      timestamp: new Date().toISOString(),
      overall_status: "diagnostic_failed",
      error: {
        message: error instanceof Error ? error.message : "Unknown diagnostic error",
        name: error instanceof Error ? error.name : "UnknownError",
        stack: error instanceof Error ? error.stack : "No stack trace available",
      },
      environment_check: {
        NODE_ENV: process.env.NODE_ENV,
        has_supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        has_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        has_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      recommendations: [
        "🔧 Check if Supabase environment variables are properly set",
        "🔧 Verify Supabase project is accessible",
        "🔧 Try running the database schema script again",
        "🔧 Check Supabase dashboard for any service issues",
      ],
    }

    return NextResponse.json(errorDetails, { status: 500 })
  }
}
