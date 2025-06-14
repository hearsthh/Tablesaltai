import { type NextRequest, NextResponse } from "next/server"
import { generateCustomerInsights } from "@/lib/ai/openai"
import { serverAuthService } from "@/lib/auth/auth-service"
import { getSupabaseServerClient } from "@/lib/supabase/client" // Declare the variable before using it

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const { user, error: authError } = await serverAuthService.getCurrentUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get restaurant profile
    const { profile, error: profileError } = await serverAuthService.getUserProfile(user.id)

    if (profileError || !profile) {
      return NextResponse.json({ error: "Restaurant profile not found" }, { status: 404 })
    }

    // Get customer data
    const supabase = getSupabaseServerClient()
    const { data: customers, error: customersError } = await supabase
      .from("customers")
      .select("*")
      .eq("restaurant_id", profile.id)

    if (customersError) {
      return NextResponse.json({ error: customersError.message }, { status: 500 })
    }

    // Generate insights
    const { insights, error } = await generateCustomerInsights(customers)

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ insights })
  } catch (error) {
    console.error("Customer insights error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
