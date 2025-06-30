import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    console.log("🔧 Running setup verification...")

    const supabase = getSupabaseServerClient()

    // Step 1: Try to create a simple test record
    console.log("📝 Testing basic insert operation...")

    const testData = {
      user_id: `test_user_${Date.now()}`,
      restaurant_name: "Test Restaurant",
      email: "test@example.com",
      address: "123 Test Street",
      cuisine_type: "italian", // Use lowercase to test mapping
      restaurant_type: "casual_dining",
      price_range: "$$",
    }

    const { data: insertResult, error: insertError } = await supabase
      .from("restaurant_profiles")
      .insert([testData])
      .select()
      .single()

    if (insertError) {
      return NextResponse.json(
        {
          success: false,
          step: "insert_test",
          error: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code,
          test_data: testData,
          recommendations: [
            "Check if restaurant_profiles table exists",
            "Verify all required columns are present",
            "Ensure custom ENUM types are created",
            "Run the database schema script if needed",
          ],
        },
        { status: 400 },
      )
    }

    // Step 2: Clean up test record
    if (insertResult?.id) {
      await supabase.from("restaurant_profiles").delete().eq("id", insertResult.id)
    }

    return NextResponse.json({
      success: true,
      message: "Database setup verification passed!",
      test_record_created: !!insertResult,
      test_record_cleaned: true,
      next_steps: [
        "✅ Database schema is working correctly",
        "✅ Ready to test user creation at /test-real-user",
        "✅ All systems operational",
      ],
    })
  } catch (error) {
    console.error("🚨 Setup verification failed:", error)

    return NextResponse.json(
      {
        success: false,
        step: "verification_failed",
        error: error instanceof Error ? error.message : "Unknown error",
        recommendations: [
          "Check Supabase connection",
          "Verify environment variables",
          "Run database schema script",
          "Check Supabase dashboard for issues",
        ],
      },
      { status: 500 },
    )
  }
}
