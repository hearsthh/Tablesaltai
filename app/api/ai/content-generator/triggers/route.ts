import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { triggerType, entityId, entityType, metadata } = body

    console.log("🎯 Processing content generation trigger:", {
      triggerType,
      entityId,
      entityType,
    })

    const supabase = createClient()

    // Get active triggers for this type
    const { data: triggers, error: triggerError } = await supabase
      .from("content_generation_triggers")
      .select("*")
      .eq("trigger_type", triggerType)
      .eq("is_active", true)

    if (triggerError) {
      throw triggerError
    }

    if (!triggers || triggers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No active triggers found for this type",
        generated: [],
      })
    }

    const generatedContent = []

    // Process each trigger
    for (const trigger of triggers) {
      try {
        // Generate content based on trigger configuration
        const contentRequests = buildContentRequestsFromTrigger(trigger, entityId, entityType, metadata)

        for (const request of contentRequests) {
          // Call the content generation API
          const generateResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ai/content-generator/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
          })

          if (generateResponse.ok) {
            const result = await generateResponse.json()
            generatedContent.push(result.content)
          }
        }

        // Update trigger execution stats
        await supabase
          .from("content_generation_triggers")
          .update({
            total_executions: trigger.total_executions + 1,
            successful_executions: trigger.successful_executions + 1,
            last_executed: new Date().toISOString(),
          })
          .eq("id", trigger.id)
      } catch (error) {
        console.error(`Error processing trigger ${trigger.id}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      generated: generatedContent,
      triggerCount: triggers.length,
    })
  } catch (error) {
    console.error("Trigger processing error:", error)
    return NextResponse.json({ error: "Failed to process triggers" }, { status: 500 })
  }
}

function buildContentRequestsFromTrigger(trigger: any, entityId: string, entityType: string, metadata: any) {
  const requests = []

  // Build content generation requests based on trigger type
  switch (trigger.trigger_type) {
    case "menu_item_added":
      requests.push({
        category: "menu",
        contentType: "item_description",
        promptInput: `Menu item: ${metadata.itemName || "New Item"}. Cuisine: ${metadata.cuisine || ""}. Price: ${metadata.price || ""}`,
        tone: "gourmet",
        linkedEntityId: entityId,
        linkedEntityType: entityType,
      })

      if (metadata.needsImage) {
        requests.push({
          category: "menu",
          contentType: "food_image_prompt",
          promptInput: `Create an appetizing image prompt for: ${metadata.itemName}`,
          tone: "professional",
          linkedEntityId: entityId,
          linkedEntityType: entityType,
        })
      }
      break

    case "campaign_launched":
      requests.push({
        category: "campaign",
        contentType: "instagram_caption",
        promptInput: `Campaign: ${metadata.campaignName}. Goal: ${metadata.goal}. Target: ${metadata.target}`,
        tone: "friendly",
        channel: "instagram",
        linkedEntityId: entityId,
        linkedEntityType: entityType,
      })

      requests.push({
        category: "campaign",
        contentType: "whatsapp_card",
        promptInput: `Campaign: ${metadata.campaignName}. Create WhatsApp message`,
        tone: "casual",
        channel: "whatsapp",
        linkedEntityId: entityId,
        linkedEntityType: entityType,
      })
      break

    case "review_received":
      if (metadata.sentiment && metadata.reviewText) {
        requests.push({
          category: "review",
          contentType: "review_reply",
          promptInput: `Review: "${metadata.reviewText}". Sentiment: ${metadata.sentiment}. Rating: ${metadata.rating}/5`,
          tone: metadata.sentiment === "positive" ? "grateful" : "professional",
          linkedEntityId: entityId,
          linkedEntityType: entityType,
        })
      }
      break

    case "churn_detected":
      requests.push({
        category: "crm",
        contentType: "churn_winback",
        promptInput: `Customer segment: ${metadata.segment}. Last visit: ${metadata.lastVisit}. Preferred items: ${metadata.preferences}`,
        tone: "emotional",
        linkedEntityId: entityId,
        linkedEntityType: entityType,
      })
      break

    default:
      console.log(`Unknown trigger type: ${trigger.trigger_type}`)
  }

  return requests
}
