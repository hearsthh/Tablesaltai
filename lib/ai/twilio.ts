import twilio from "twilio"

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

// Send SMS marketing campaigns
export async function sendSMSCampaign({
  to,
  message,
  from,
}: {
  to: string[]
  message: string
  from?: string
}) {
  try {
    const fromNumber = from || process.env.TWILIO_PHONE_NUMBER

    if (!fromNumber) {
      return {
        results: [],
        error: "Twilio phone number not configured",
      }
    }

    const results = await Promise.allSettled(
      to.map(async (phoneNumber) => {
        const result = await client.messages.create({
          body: message,
          from: fromNumber,
          to: phoneNumber,
        })
        return { phoneNumber, messageId: result.sid, status: result.status }
      }),
    )

    const successful = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => (result as PromiseFulfilledResult<any>).value)

    const failed = results
      .filter((result) => result.status === "rejected")
      .map((result) => (result as PromiseRejectedResult).reason)

    return {
      results: {
        successful,
        failed,
        total: to.length,
        successCount: successful.length,
        failureCount: failed.length,
      },
      error: null,
    }
  } catch (error) {
    console.error("Error sending SMS campaign:", error)
    return {
      results: null,
      error: "Failed to send SMS campaign",
    }
  }
}

// Send reservation confirmations
export async function sendReservationConfirmation({
  to,
  customerName,
  date,
  time,
  partySize,
  restaurantName,
}: {
  to: string
  customerName: string
  date: string
  time: string
  partySize: number
  restaurantName: string
}) {
  try {
    const message = `Hi ${customerName}! Your reservation at ${restaurantName} is confirmed for ${date} at ${time} for ${partySize} ${partySize === 1 ? "person" : "people"}. We look forward to seeing you!`

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    })

    return {
      messageId: result.sid,
      status: result.status,
      error: null,
    }
  } catch (error) {
    console.error("Error sending reservation confirmation:", error)
    return {
      messageId: null,
      status: null,
      error: "Failed to send confirmation",
    }
  }
}

// Send promotional offers
export async function sendPromotionalOffer({
  to,
  customerName,
  offer,
  expiryDate,
  restaurantName,
}: {
  to: string
  customerName: string
  offer: string
  expiryDate: string
  restaurantName: string
}) {
  try {
    const message = `Hi ${customerName}! 🍽️ Special offer from ${restaurantName}: ${offer}. Valid until ${expiryDate}. Show this message to redeem. See you soon!`

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    })

    return {
      messageId: result.sid,
      status: result.status,
      error: null,
    }
  } catch (error) {
    console.error("Error sending promotional offer:", error)
    return {
      messageId: null,
      status: null,
      error: "Failed to send offer",
    }
  }
}

// Send order status updates
export async function sendOrderUpdate({
  to,
  customerName,
  orderStatus,
  estimatedTime,
  orderNumber,
}: {
  to: string
  customerName: string
  orderStatus: "confirmed" | "preparing" | "ready" | "delivered"
  estimatedTime?: string
  orderNumber: string
}) {
  try {
    let message = `Hi ${customerName}! Order #${orderNumber} is now ${orderStatus}.`

    if (orderStatus === "preparing" && estimatedTime) {
      message += ` Estimated ready time: ${estimatedTime}.`
    } else if (orderStatus === "ready") {
      message += ` Your order is ready for pickup!`
    } else if (orderStatus === "delivered") {
      message += ` Thank you for your order!`
    }

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    })

    return {
      messageId: result.sid,
      status: result.status,
      error: null,
    }
  } catch (error) {
    console.error("Error sending order update:", error)
    return {
      messageId: null,
      status: null,
      error: "Failed to send update",
    }
  }
}

// Get SMS delivery status
export async function getSMSStatus(messageId: string) {
  try {
    const message = await client.messages(messageId).fetch()

    return {
      status: message.status,
      errorCode: message.errorCode,
      errorMessage: message.errorMessage,
      dateCreated: message.dateCreated,
      dateSent: message.dateSent,
      error: null,
    }
  } catch (error) {
    console.error("Error getting SMS status:", error)
    return {
      status: null,
      error: "Failed to get SMS status",
    }
  }
}

export { client as twilioClient }
