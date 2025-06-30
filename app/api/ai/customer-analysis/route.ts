import { type NextRequest, NextResponse } from "next/server"
import { CustomerAIEngine } from "@/lib/ai/customer-ai-engine"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customers, analysisType } = body

    if (!customers || !Array.isArray(customers)) {
      return NextResponse.json({ error: "Invalid customers data" }, { status: 400 })
    }

    let result
    switch (analysisType) {
      case "segmentation":
        result = await CustomerAIEngine.generateCustomerSegments(customers)
        break
      case "churn":
        result = await CustomerAIEngine.predictCustomerChurn(customers)
        break
      case "ltv":
        result = await CustomerAIEngine.predictCustomerLTV(customers)
        break
      default:
        return NextResponse.json({ error: "Invalid analysis type" }, { status: 400 })
    }

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      ...result,
      success: true,
    })
  } catch (error) {
    console.error("Error analyzing customers:", error)
    return NextResponse.json({ error: "Failed to analyze customers" }, { status: 500 })
  }
}
