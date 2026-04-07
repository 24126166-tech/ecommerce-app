import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { Product } from "@prisma/client";

type CartItem = {
  productId: string;
  quantity: number;
};

export async function POST(req: NextRequest) {
  try {
    const { items, email }: { items: CartItem[]; email: string } = await req.json();

    // Lấy giá từ Database để đảm bảo an toàn [cite: 194]
    const products: Product[] = await prisma.product.findMany({
      where: {
        id: { in: items.map((i) => i.productId) },
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email, // Thêm dòng này để webhook lấy được email [cite: 76]
      line_items: items.map((item) => {
        const product = products.find((p) => p.id === item.productId)!;

        return {
          price_data: {
            currency: "vnd",
            product_data: {
              name: product.name,
            },
            // Với tiền VND, Stripe thường nhận giá trị trực tiếp 
            unit_amount: Math.round(Number(product.price)), 
          },
          quantity: item.quantity,
        };
      }),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}