import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    console.log(`🔧 Executing database fix action: ${action}`)

    // First, check environment variables like in the debug route
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Missing",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
    }

    console.log("🔧 Environment Variables Check:", envCheck)

    // Get available credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl) {
      return NextResponse.json({
        success: false,
        error: "Supabase URL not found in environment variables",
        envCheck,
        recommendation: "Set NEXT_PUBLIC_SUPABASE_URL in your environment variables",
        availableVars: Object.keys(process.env).filter((key) => key.toLowerCase().includes("supabase")),
      })
    }

    if (!supabaseServiceKey && !supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        error: "Neither service role key nor anon key found",
        envCheck,
        recommendation: "Set either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY",
        availableVars: Object.keys(process.env).filter((key) => key.toLowerCase().includes("supabase")),
      })
    }

    // Create Supabase client
    let supabase
    try {
      const { createClient } = await import("@supabase/supabase-js")

      // Prefer service role key for admin operations, fallback to anon key
      const keyToUse = supabaseServiceKey || supabaseAnonKey
      const keyType = supabaseServiceKey ? "service_role" : "anon"

      console.log(`🔑 Using ${keyType} key for database operations`)

      if (keyType === "anon" && (action === "drop_all_tables" || action === "create_minimal_schema")) {
        return NextResponse.json({
          success: false,
          error: "Admin operations require service role key",
          envCheck,
          recommendation: "Set SUPABASE_SERVICE_ROLE_KEY to perform table creation/deletion operations",
          keyType,
        })
      }

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
        error: clientError instanceof Error ? clientError.message : "Unknown client creation error",
        envCheck,
        recommendation: "Check if @supabase/supabase-js is properly installed",
      })
    }

    // Execute the requested action
    switch (action) {
      case "drop_all_tables":
        return await dropAllTables(supabase)
      case "create_minimal_schema":
        return await createMinimalSchema(supabase)
      case "test_basic_operations":
        return await testBasicOperations(supabase)
      case "check_permissions":
        return await checkPermissions(supabase)
      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid action",
            availableActions: [
              "drop_all_tables",
              "create_minimal_schema",
              "test_basic_operations",
              "check_permissions",
            ],
          },
          { status: 400 },
        )
    }
  } catch (error) {
    console.error("💥 Database fix error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      envCheck: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Missing",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
      },
    })
  }
}

async function checkPermissions(supabase: any) {
  console.log("🔐 Checking database permissions...")

  const tests = []

  // Test 1: Can we read system tables?
  try {
    const { data, error } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .limit(1)

    tests.push({
      test: "read_system_tables",
      status: error ? "failed" : "passed",
      error: error?.message,
      message: error ? "Cannot read system tables" : "Can read system tables",
    })
  } catch (err) {
    tests.push({
      test: "read_system_tables",
      status: "failed",
      error: err instanceof Error ? err.message : "Unknown error",
    })
  }

  // Test 2: Can we create a test table?
  try {
    const { error: createError } = await supabase.rpc("exec_sql", {
      sql: "CREATE TABLE IF NOT EXISTS test_permissions_table (id SERIAL PRIMARY KEY, test_column TEXT);",
    })

    if (createError) {
      tests.push({
        test: "create_table",
        status: "failed",
        error: createError.message,
        message: "Cannot create tables - need service role key",
      })
    } else {
      tests.push({
        test: "create_table",
        status: "passed",
        message: "Can create tables",
      })

      // Clean up test table
      await supabase.rpc("exec_sql", {
        sql: "DROP TABLE IF EXISTS test_permissions_table;",
      })
    }
  } catch (err) {
    tests.push({
      test: "create_table",
      status: "failed",
      error: err instanceof Error ? err.message : "Unknown error",
      message: "Cannot test table creation",
    })
  }

  // Test 3: Can we use RPC functions?
  try {
    const { data, error } = await supabase.rpc("version")

    tests.push({
      test: "rpc_functions",
      status: error ? "failed" : "passed",
      error: error?.message,
      message: error ? "Cannot use RPC functions" : "Can use RPC functions",
      version: data,
    })
  } catch (err) {
    tests.push({
      test: "rpc_functions",
      status: "failed",
      error: err instanceof Error ? err.message : "Unknown error",
    })
  }

  return NextResponse.json({
    success: true,
    action: "check_permissions",
    tests,
    summary: {
      total: tests.length,
      passed: tests.filter((t) => t.status === "passed").length,
      failed: tests.filter((t) => t.status === "failed").length,
    },
    recommendations: generatePermissionRecommendations(tests),
  })
}

async function dropAllTables(supabase: any) {
  console.log("🗑️ Dropping all custom tables to start fresh...")

  const tablesToDrop = [
    "activity_logs",
    "subscriptions",
    "customer_segments",
    "marketing_campaigns",
    "generated_content",
    "platform_integrations",
    "restaurant_analytics",
    "review_settings",
    "reviews",
    "menu_items",
    "menu_categories",
    "restaurant_profiles",
  ]

  const results = []

  for (const table of tablesToDrop) {
    try {
      // Try using direct SQL execution
      const { error } = await supabase.rpc("exec_sql", {
        sql: `DROP TABLE IF EXISTS ${table} CASCADE;`,
      })

      if (error) {
        console.warn(`⚠️ Could not drop table ${table}:`, error.message)
        results.push({ table, status: "warning", message: error.message })
      } else {
        console.log(`✅ Dropped table: ${table}`)
        results.push({ table, status: "success", message: "Dropped successfully" })
      }
    } catch (err) {
      console.warn(`⚠️ Error dropping table ${table}:`, err)
      results.push({ table, status: "error", message: err instanceof Error ? err.message : "Unknown error" })
    }
  }

  return NextResponse.json({
    success: true,
    action: "drop_all_tables",
    results,
    message: "Table cleanup completed",
    summary: {
      total: results.length,
      success: results.filter((r) => r.status === "success").length,
      warnings: results.filter((r) => r.status === "warning").length,
      errors: results.filter((r) => r.status === "error").length,
    },
  })
}

async function createMinimalSchema(supabase: any) {
  console.log("🏗️ Creating minimal working schema...")

  const minimalSchema = `
    -- Create restaurant_profiles table (minimal version)
    CREATE TABLE IF NOT EXISTS restaurant_profiles (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        restaurant_name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id)
    );

    -- Create menu_categories table
    CREATE TABLE IF NOT EXISTS menu_categories (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        restaurant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create menu_items table
    CREATE TABLE IF NOT EXISTS menu_items (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        restaurant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Enable RLS
    ALTER TABLE restaurant_profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
    ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

    -- Create basic policies
    CREATE POLICY "Users can manage own restaurant profile" ON restaurant_profiles
        FOR ALL USING (auth.uid() = user_id);
    
    CREATE POLICY "Users can manage own menu categories" ON menu_categories
        FOR ALL USING (auth.uid() = restaurant_id);
    
    CREATE POLICY "Users can manage own menu items" ON menu_items
        FOR ALL USING (auth.uid() = restaurant_id);
  `

  try {
    const { error } = await supabase.rpc("exec_sql", { sql: minimalSchema })

    if (error) {
      console.error("❌ Minimal schema creation failed:", error)
      return NextResponse.json({
        success: false,
        error: error.message,
        recommendation: "Check if auth.users table exists and RLS is properly configured",
        sqlUsed: minimalSchema,
      })
    }

    console.log("✅ Minimal schema created successfully")

    // Verify tables were created
    const { data: verifyTables, error: verifyError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .in("table_name", ["restaurant_profiles", "menu_categories", "menu_items"])

    const createdTables = verifyTables?.map((t) => t.table_name) || []

    return NextResponse.json({
      success: true,
      action: "create_minimal_schema",
      message: "Minimal working schema created successfully",
      tables: ["restaurant_profiles", "menu_categories", "menu_items"],
      createdTables,
      verification: verifyError ? "Could not verify" : `${createdTables.length}/3 tables verified`,
    })
  } catch (err) {
    console.error("💥 Schema creation error:", err)
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      sqlUsed: minimalSchema,
    })
  }
}

async function testBasicOperations(supabase: any) {
  console.log("🧪 Testing basic database operations...")

  const tests = []

  // Test 1: Check if restaurant_profiles table exists and is accessible
  try {
    const { data, error } = await supabase.from("restaurant_profiles").select("count", { count: "exact" }).limit(0)

    if (error) {
      tests.push({
        test: "restaurant_profiles_access",
        status: "failed",
        error: error.message,
      })
    } else {
      tests.push({
        test: "restaurant_profiles_access",
        status: "passed",
        message: "Table accessible",
      })
    }
  } catch (err) {
    tests.push({
      test: "restaurant_profiles_access",
      status: "failed",
      error: err instanceof Error ? err.message : "Unknown error",
    })
  }

  // Test 2: Check menu_categories table
  try {
    const { data, error } = await supabase.from("menu_categories").select("count", { count: "exact" }).limit(0)

    tests.push({
      test: "menu_categories_access",
      status: error ? "failed" : "passed",
      error: error?.message,
      message: error ? "Cannot access menu_categories" : "menu_categories accessible",
    })
  } catch (err) {
    tests.push({
      test: "menu_categories_access",
      status: "failed",
      error: err instanceof Error ? err.message : "Unknown error",
    })
  }

  // Test 3: Check menu_items table
  try {
    const { data, error } = await supabase.from("menu_items").select("count", { count: "exact" }).limit(0)

    tests.push({
      test: "menu_items_access",
      status: error ? "failed" : "passed",
      error: error?.message,
      message: error ? "Cannot access menu_items" : "menu_items accessible",
    })
  } catch (err) {
    tests.push({
      test: "menu_items_access",
      status: "failed",
      error: err instanceof Error ? err.message : "Unknown error",
    })
  }

  return NextResponse.json({
    success: true,
    action: "test_basic_operations",
    tests,
    summary: {
      total: tests.length,
      passed: tests.filter((t) => t.status === "passed").length,
      failed: tests.filter((t) => t.status === "failed").length,
    },
  })
}

function generatePermissionRecommendations(tests: any[]) {
  const recommendations = []

  const failedTests = tests.filter((t) => t.status === "failed")

  if (failedTests.length === 0) {
    recommendations.push({
      type: "success",
      message: "All permission tests passed",
      action: "You have sufficient permissions for database operations",
    })
  } else {
    if (failedTests.some((t) => t.test === "create_table")) {
      recommendations.push({
        type: "error",
        message: "Cannot create tables",
        action: "Set SUPABASE_SERVICE_ROLE_KEY for admin operations",
      })
    }

    if (failedTests.some((t) => t.test === "read_system_tables")) {
      recommendations.push({
        type: "error",
        message: "Cannot read system tables",
        action: "Check your Supabase key permissions",
      })
    }

    if (failedTests.some((t) => t.test === "rpc_functions")) {
      recommendations.push({
        type: "warning",
        message: "Cannot use RPC functions",
        action: "Some advanced operations may not work",
      })
    }
  }

  return recommendations
}
