import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { Product } from "@prisma/client"

type CartItem = {
  productId: string
  quantity: number
}

export async function POST(req: NextRequest) {
  const { items, email }: { items: CartItem[]; email: string } =
    await req.json()

  // Lấy tất cả sản phẩm 1 lần
  const products: Product[] = await prisma.product.findMany({
    where: {
      id: {
        in: items.map((i) => i.productId),
      },
    },
  })

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items.map((item) => {
      // 🔥 Tìm sản phẩm tương ứng
      const product = products.find((p) => p.id === item.productId)!

      return {
        price_data: {
          currency: "vnd",
          product_data: {
            name: product.name,
          },
          // ⚠️ Stripe cần đơn vị nhỏ nhất
          unit_amount: Number(product.price) * 100,
        },
        quantity: item.quantity,
      }
    }),
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
  })

  return NextResponse.json({ url: session.url })
}