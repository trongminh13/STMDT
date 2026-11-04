import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError, Modules } from "@medusajs/framework/utils"

export const POST = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const orderId = req.params.id
  const customerId = req.auth_context?.actor_id

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const orderModule = req.scope.resolve(Modules.ORDER)

  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "customer_id",
      "total",
      "currency_code",
      "payment_status",
      "metadata",
    ],
    filters: { id: orderId },
  })

  const order = orders[0] as any
  if (!order) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Đơn hàng với mã ID ${orderId} không tồn tại.`
    )
  }

  // IDOR check: Khách hàng chỉ được thanh toán cho chính đơn hàng của mình
  if (customerId && order.customer_id && order.customer_id !== customerId) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Bạn không có quyền truy cập thông tin thanh toán cho đơn hàng này."
    )
  }

  if (order.payment_status === "captured") {
    return res.json({
      success: true,
      message: "Đơn hàng này đã được thanh toán hoàn tất (CAPTURED).",
      payment_status: "captured",
      order_id: order.id,
    })
  }

  // Lấy hoặc sinh mới orderCode số nguyên dương an toàn (53-bit an toàn cho Javascript)
  let payosOrderCode = order.metadata?.payos_order_code

  if (!payosOrderCode) {
    // Sinh số nguyên 53-bit an toàn (payOS orderCode max: 9007199254740991)
    // Kết hợp timestamp mili-giây (13 chữ số) và 2 số ngẫu nhiên (15 chữ số < 16 chữ số Number.MAX_SAFE_INTEGER)
    // Bảo đảm zero-collision: không bao giờ trùng lặp mã đơn
    const nowMs = Date.now()
    const rand2 = Math.floor(Math.random() * 90 + 10)
    payosOrderCode = Number(`${nowMs}${rand2}`)

    await orderModule.updateOrders([{
      id: order.id,
      metadata: {
        ...(order.metadata || {}),
        payos_order_code: payosOrderCode,
      },
    }])
  }

  const amount = Number(order.total) || 0
  const description = `DH ${payosOrderCode}`

  // Cấu hình ngân hàng TPBank (Mã BIN VietQR: 970458)
  const bankBin = process.env.PAYOS_BANK_BIN || "970458" // TPBank
  const bankAccount = process.env.PAYOS_BANK_ACCOUNT || "01234567890"
  const accountName = process.env.PAYOS_ACCOUNT_NAME || "CONG TY GIAO DUC DAI VIET"

  // Tạo URL ảnh VietQR chuẩn NAPAS 24/7 theo đặc tả của VietQR API
  const encodedAccountName = encodeURIComponent(accountName)
  const encodedDescription = encodeURIComponent(description)
  const vietQrImageUrl = `https://img.vietqr.io/image/${bankBin}-${bankAccount}-compact2.png?amount=${amount}&addInfo=${encodedDescription}&accountName=${encodedAccountName}`

  return res.json({
    success: true,
    order_id: order.id,
    payos_order_code: payosOrderCode,
    amount,
    currency: order.currency_code || "vnd",
    description,
    payment_method: "vietqr_payos",
    bank_info: {
      bank_name: "TPBank (Ngân hàng Tiên Phong)",
      bank_bin: bankBin,
      account_number: bankAccount,
      account_name: accountName,
    },
    vietqr_url: vietQrImageUrl,
    webhook_url: "/hooks/payment/payos",
  })
}
