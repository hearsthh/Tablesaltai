import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET - Fetch specific generated content
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("generated_content")
      .select(`
        *,
        content_applications(*),
        content_feedback(*)
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    return NextResponse.json({ content: data })
  } catch (error) {
    console.error("Generated content fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update generated content
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const updates = await request.json()

    const { data, error } = await supabase
      .from("generated_content")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
    }

    return NextResponse.json({ success: true, content: data })
  } catch (error) {
    console.error("Generated content update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete generated content
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("generated_content").delete().eq("id", params.id)

    if (error) {
      return NextResponse.json({ error: "Failed to delete content" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Generated content delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
