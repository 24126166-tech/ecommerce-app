import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook error:", err)
    return NextResponse.json({ error: "Webhook error" }, { status: 400 })
  }

  // 🎯 Xử lý event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any

    // 👉 Tạo order (fake đơn giản cho bạn chạy trước)
    await prisma.order.create({
      data: {
        email: session.customer_email || "test@gmail.com",
        status: "PAID",
        total: session.amount_total / 100,
      },
    })

    console.log("✅ Order created")
  }

  return NextResponse.json({ received: true })
}