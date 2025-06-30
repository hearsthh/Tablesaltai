import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Only return the public key, never the secret
    const publicKey = process.env.RAZORPAY_KEY_ID

    if (!publicKey) {
      return NextResponse.json({ error: "Razorpay configuration not found" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      keyId: publicKey,
      currency: "INR",
    })
  } catch (error) {
    console.error("Razorpay config error:", error)
    return NextResponse.json({ error: "Failed to get payment configuration" }, { status: 500 })
  }
}
