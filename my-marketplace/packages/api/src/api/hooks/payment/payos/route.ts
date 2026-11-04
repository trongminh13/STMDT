import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { markPaymentCollectionAsPaid } from "@medusajs/core-flows"
import { verifyPayOSSignature, PayOSWebhookPayload } from "../../../../modules/payment/utils/payos-crypto"

/**
 * GET: Phục vụ kiểm tra tình trạng trực tuyến của Webhook Endpoint (Healthcheck & Browser Access)
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  return res.status(200).json({
    status: "active",
    service: "Mercur payOS VietQR Webhook Listener",
    method_allowed: ["POST", "GET"],
    message: "Endpoint Webhook payOS đang hoạt động trực tuyến và sẵn sàng nhận sự kiện giao dịch POST từ cổng thanh toán.",
    timestamp: new Date().toISOString(),
  })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  // Cổng 0: Kiểm tra xác thực Webhook URL từ Dashboard payOS (Xác nhận Webhook)
  // Khi bạn bấm "Xác nhận Webhook" trên trang payOS, payOS sẽ gửi request POST kèm { webhookUrl: "..." }
  const rawBody = req.body as any
  if (rawBody && (rawBody.webhookUrl || rawBody.webhook_url)) {
    return res.status(200).json({
      success: true,
      message: "Webhook URL đã được xác thực thành công bởi hệ thống Mercur Đại Việt.",
    })
  }

  const payload = req.body as PayOSWebhookPayload
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY || "mock_payos_checksum_key_daiviet_ai"

  // Cổng 1: Kiểm tra tính toàn vẹn của payload
  if (!payload || !payload.data || !payload.signature) {
    return res.status(400).json({
      error: "INVALID_WEBHOOK_PAYLOAD",
      message: "Dữ liệu webhook thiếu trường data hoặc signature.",
    })
  }

  // Cổng 2: Xác minh chữ ký số HMAC-SHA256 chống giả mạo
  const isValidSignature = verifyPayOSSignature(payload.data, payload.signature, checksumKey)
  if (!isValidSignature) {
    return res.status(400).json({
      error: "INVALID_SIGNATURE",
      message: "Chữ ký webhook HMAC-SHA256 không hợp lệ hoặc dữ liệu bị can thiệp.",
    })
  }

  const { orderCode, amount, code } = payload.data

  // Nếu giao dịch payOS không thành công (code != '00')
  if (code !== "00") {
    return res.status(200).json({
      success: false,
      message: `Giao dịch payOS không thành công (code: ${code}), bỏ qua xử lý.`,
    })
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const orderModule = req.scope.resolve(Modules.ORDER)

  // Cổng 3: Tìm kiếm đơn hàng trong cơ sở dữ liệu khớp với payos_order_code
  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "status",
      "total",
      "currency_code",
      "payment_status",
      "metadata",
      "payment_collections.id",
      "payment_collections.status",
    ],
    filters: {
      metadata: {
        payos_order_code: orderCode,
      },
    } as any,
  })

  let order = (orders as any[]).find(
    (o) => o.metadata?.payos_order_code === orderCode || o.id === String(orderCode)
  )

  // Dự phòng: Tìm theo orderCode chính là phần số của id nếu không tìm thấy qua metadata
  // Kiểm tra chặt chẽ: Chỉ tìm khi description chứa mã đơn hợp lệ (tối thiểu 5 ký tự) tránh quét toàn bộ bảng
  const fallbackId = payload.data.description?.replace(/[^0-9a-zA-Z_]/g, "")
  if (!order && fallbackId && fallbackId.length >= 5) {
    const { data: allOrders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "status",
        "total",
        "currency_code",
        "payment_status",
        "metadata",
        "payment_collections.id",
      ],
      filters: { id: fallbackId },
    })
    order = allOrders[0] as any
  }

  if (!order) {
    return res.status(404).json({
      error: "ORDER_NOT_FOUND",
      message: `Không tìm thấy đơn hàng khớp với mã payOS ${orderCode}.`,
    })
  }

  // Cổng 4: Idempotency Check (Chống kích hoạt xử lý trùng lặp)
  if (order.payment_status === "captured") {
    return res.status(200).json({
      success: true,
      message: "Đơn hàng đã ở trạng thái CAPTURED từ trước. Idempotency bảo toàn.",
      order_id: order.id,
      order_code: orderCode,
    })
  }

  // Cổng 5: Kiểm tra số tiền chuyển so với tổng giá trị đơn hàng
  const expectedTotal = Number(order.total) || 0
  if (amount < expectedTotal) {
    // Chặn chuyển thiếu tiền: Tuyệt đối không chuyển sang captured, ghi nhận vào metadata
    await (orderModule as any).updateOrders([{
      id: order.id,
      metadata: {
        ...(order.metadata || {}),
        partial_payment_amount: amount,
        partial_payment_warning: `Khách chuyển thiếu tiền: thực nhận ${amount} < tổng đơn ${expectedTotal}`,
        partial_payment_at: new Date().toISOString(),
      },
    }])

    return res.status(400).json({
      error: "PARTIAL_PAYMENT_REJECTED",
      message: `Số tiền thanh toán (${amount}) nhỏ hơn tổng giá trị đơn hàng (${expectedTotal}). Từ chối kích hoạt captured.`,
      order_id: order.id,
      expected_amount: expectedTotal,
      received_amount: amount,
    })
  }

  // Nhận diện chuyển thừa tiền (Overpayment)
  const isOverpayment = amount > expectedTotal
  const overpaymentAmount = isOverpayment ? amount - expectedTotal : 0

  // Nhận diện chuyển tiền trễ khi đơn đã bị hủy (Auto Revive Order)
  const isRevived = order.status === "canceled"

  // Cổng 6: Kích hoạt Capture tự động chuyển đơn hàng sang trạng thái 'captured'
  try {
    const paymentCollectionId = order.payment_collections?.[0]?.id

    // Chuẩn bị metadata cập nhật cho đơn hàng
    const updatedMetadata = {
      ...(order.metadata || {}),
      paid_at: new Date().toISOString(),
      payos_reference: payload.data.reference,
      payos_amount_paid: amount,
      ...(isOverpayment && {
        overpayment: true,
        overpayment_amount: overpaymentAmount,
        overpayment_warning: `Khách chuyển thừa ${overpaymentAmount} VND (thực nhận: ${amount}, tổng đơn: ${expectedTotal})`,
        overpayment_recorded_at: new Date().toISOString(),
      }),
      ...(isRevived && {
        revived_from_cancellation: true,
        revived_at: new Date().toISOString(),
        revived_reason: `Thanh toán payOS thành công sau khi đơn bị hủy (Mã GD: ${payload.data.reference})`,
      }),
    }

    // Nếu đơn hàng bị hủy trước đó, tự động giải cứu (Auto Revive) về trạng thái hoạt động
    if (isRevived) {
      await (orderModule as any).updateOrders([{
        id: order.id,
        status: "pending",
        metadata: updatedMetadata,
      }])
    }

    if (paymentCollectionId) {
      await markPaymentCollectionAsPaid(req.scope).run({
        input: {
          order_id: order.id,
          payment_collection_id: paymentCollectionId,
        },
      })
      // Cập nhật thêm metadata thông tin thanh toán payOS
      await (orderModule as any).updateOrders([{
        id: order.id,
        metadata: updatedMetadata,
      }])
    } else {
      // Cập nhật trạng thái trực tiếp qua Order Module nếu đơn chưa gắn payment collection
      await (orderModule as any).updateOrders([{
        id: order.id,
        payment_status: "captured",
        metadata: updatedMetadata,
      }])
    }

    return res.status(200).json({
      success: true,
      message: isRevived
        ? "Đơn hàng đã hủy được tự động GIẢI CỨU (REVIVED) và kích hoạt thanh toán thành công (CAPTURED)."
        : "Đơn hàng đã được kích hoạt thanh toán thành công (CAPTURED).",
      order_id: order.id,
      order_code: orderCode,
      payment_status: "captured",
      overpayment: isOverpayment,
      overpayment_amount: overpaymentAmount,
      revived: isRevived,
    })
  } catch (error: any) {
    const errMsg = String(error?.message || "").toLowerCase()
    // Nếu lỗi do Payment Collection hoặc Đơn hàng đã được thanh toán bởi request đồng thời trước đó
    if (errMsg.includes("not paid") || errMsg.includes("already paid") || errMsg.includes("already captured")) {
      return res.status(200).json({
        success: true,
        message: "Payment collection đã được thanh toán bởi giao dịch đồng thời trước đó. Idempotency bảo toàn.",
        order_id: order.id,
        order_code: orderCode,
      })
    }

    return res.status(500).json({
      error: "CAPTURE_WORKFLOW_FAILED",
      message: `Lỗi khi kích hoạt workflow thanh toán: ${error?.message}`,
    })
  }
}
