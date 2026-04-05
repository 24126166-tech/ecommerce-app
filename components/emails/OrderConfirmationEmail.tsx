import { Html, Body, Text } from "@react-email/components"

export default function OrderConfirmationEmail({ order }: any) {
  return (
    <Html>
      <Body>
        <Text>Đặt hàng thành công 🎉</Text>
        <Text>Tổng tiền: {order.total}</Text>
      </Body>
    </Html>
  )
}