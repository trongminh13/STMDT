import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { downloadLimiter } from "../modules/digital-asset/utils/download-limiter"

export default async function paymentRefundedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; order_id?: string }>) {
  const logger = container.resolve("logger")
  const orderId = data.order_id || data.id

  logger.info(`[Subscriber: payment.refunded] Processing revocation/reset for order: ${orderId}`)
  
  // Reset Redis rate limiter count or lock further downloads
  if (orderId) {
    try {
      await downloadLimiter.resetStats(orderId, "*")
      logger.info(`[Subscriber: payment.refunded] Rate limit cache reset for order ${orderId}`)
    } catch (err: any) {
      logger.warn(`[Subscriber: payment.refunded] Failed to reset rate limit: ${err?.message}`)
    }
  }
}

export const config: SubscriberConfig = {
  event: ["payment.refunded", "order.canceled"],
}
