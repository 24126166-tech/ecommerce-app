import { Resend } from "resend"
import { render } from "@react-email/render"
import OrderConfirmationEmail from "@/components/emails/OrderConfirmationEmail"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmationEmail(order: any) {
  const html = await render(<OrderConfirmationEmail order={order} />)

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: order.email,
    subject: "Xác nhận đơn hàng",
    html,
  })
}