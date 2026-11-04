import crypto from "node:crypto"

export interface PayOSWebhookData {
  orderCode: number
  amount: number
  description: string
  accountNumber: string
  reference: string
  transactionDateTime: string
  currency: string
  paymentLinkId: string
  code: string
  desc: string
  counterAccountBankId?: string | null
  counterAccountBankName?: string | null
  counterAccountName?: string | null
  counterAccountNumber?: string | null
  virtualAccountName?: string | null
  virtualAccountNumber?: string | null
}

export interface PayOSWebhookPayload {
  code: string
  desc: string
  success: boolean
  data: PayOSWebhookData
  signature: string
}

/**
 * Chuẩn hóa dữ liệu object data thành chuỗi URL-encoded sắp xếp alphabet theo key chuẩn payOS.
 */
export function createPayOSDataString(data: Record<string, any>): string {
  const sortedKeys = Object.keys(data).filter((k) => k !== "signature").sort()
  return sortedKeys
    .map((key) => {
      let val = data[key]
      if (val === null || val === undefined) val = ""
      if (typeof val === "object") val = JSON.stringify(val)
      return `${key}=${val}`
    })
    .join("&")
}

/**
 * Xác thực chữ ký số HMAC-SHA256 từ payOS (Timing-Safe chống timing attack).
 */
export function verifyPayOSSignature(
  data: Record<string, any>,
  receivedSignature: string,
  checksumKey: string
): boolean {
  if (!receivedSignature || !checksumKey) return false

  const signString = createPayOSDataString(data)
  const hmac = crypto.createHmac("sha256", checksumKey)
  hmac.update(signString)
  const computedSignature = hmac.digest("hex")

  try {
    const computedBuffer = Buffer.from(computedSignature, "hex")
    const receivedBuffer = Buffer.from(receivedSignature, "hex")

    if (computedBuffer.length !== receivedBuffer.length) {
      return false
    }

    return crypto.timingSafeEqual(computedBuffer, receivedBuffer)
  } catch {
    return false
  }
}

/**
 * Tạo chữ ký số HMAC-SHA256 cho payOS payload (sử dụng khi gửi request hoặc test giả lập).
 */
export function generatePayOSSignature(
  data: Record<string, any>,
  checksumKey: string
): string {
  const signString = createPayOSDataString(data)
  return crypto.createHmac("sha256", checksumKey).update(signString).digest("hex")
}
