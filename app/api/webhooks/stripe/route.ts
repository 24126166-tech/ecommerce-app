import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;

  try {
    // Xóa bỏ các phần ở đây
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    await prisma.order.create({
      data: {
        email: session.customer_details?.email || "unknown@gmail.com",
        status: "PAID",
        total: session.amount_total / 1, // VND không chia 100
        stripeId: session.id, // Đây là trường stripeId trong schema của bạn
      },
    });

    console.log("✅ Order created in DB");
  }

  return NextResponse.json({ received: true });
}