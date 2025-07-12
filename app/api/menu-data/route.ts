import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { MenuData } from "@/lib/types/menu-data"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { menuData, section } = body

    // Calculate completion status
    const completionStatus = calculateMenuCompletionStatus(menuData)

    // Add metadata
    const finalData = {
      ...menuData,
      completionStatus,
      updatedAt: new Date().toISOString(),
      createdAt: menuData.createdAt || new Date().toISOString(),
    }

    // Save to database
    const { data, error } = await supabase.from("menu_data").upsert(finalData, { onConflict: "id" }).select().single()

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      data,
      completionStatus,
    })
  } catch (error) {
    console.error("Error saving menu data:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save menu data" },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const menuId = searchParams.get("id")
    const userId = searchParams.get("userId")
    const restaurantId = searchParams.get("restaurantId")

    let query = supabase.from("menu_data").select("*")

    if (menuId) {
      query = query.eq("id", menuId)
    } else if (restaurantId) {
      query = query.eq("restaurantId", restaurantId)
    } else if (userId) {
      query = query.eq("userId", userId)
    } else {
      return NextResponse.json({ error: "Menu ID, Restaurant ID, or User ID required" }, { status: 400 })
    }

    const { data, error } = await query.single()

    if (error && error.code !== "PGRST116") {
      throw new Error(`Database error: ${error.message}`)
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error fetching menu data:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch menu data" },
      { status: 500 },
    )
  }
}

function calculateMenuCompletionStatus(data: Partial<MenuData>) {
  const sections = {
    categories: !!(data.categories && data.categories.length > 0),
    items: !!(data.items && data.items.length > 0),
  }

  const completedSections = Object.values(sections).filter(Boolean).length
  const totalSections = Object.keys(sections).length
  const overall = Math.round((completedSections / totalSections) * 100)

  return {
    ...sections,
    overall,
  }
}
