import { type NextRequest, NextResponse } from "next/server"
import { serverAuthService } from "@/lib/auth/auth-service"
import { getSupabaseServerClient } from "@/lib/supabase/server"

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

    // Get campaigns
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("marketing_campaigns")
      .select("*")
      .eq("restaurant_id", profile.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ campaigns: data })
  } catch (error) {
    console.error("Campaigns error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const campaignData = await request.json()

    // Create campaign
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("marketing_campaigns")
      .insert({
        restaurant_id: profile.id,
        ...campaignData,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ campaign: data })
  } catch (error) {
    console.error("Create campaign error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
