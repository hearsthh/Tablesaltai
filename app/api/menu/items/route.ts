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

    const categoryId = request.nextUrl.searchParams.get("categoryId")

    // Get menu items
    const supabase = getSupabaseServerClient()
    let query = supabase.from("menu_items").select("*, menu_categories(name)").eq("restaurant_id", profile.id)

    if (categoryId) {
      query = query.eq("category_id", categoryId)
    }

    const { data, error } = await query.order("display_order", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ items: data })
  } catch (error) {
    console.error("Menu items error:", error)
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

    const itemData = await request.json()

    // Create menu item
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        restaurant_id: profile.id,
        ...itemData,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ item: data })
  } catch (error) {
    console.error("Create menu item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
