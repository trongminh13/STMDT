import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { emailService } from "../modules/email/email.service"

export default async function passwordResetHandler({
  event: { data },
  container,
}: SubscriberArgs<{
  entity_id: string
  actor_type: string
  token: string
  metadata?: Record<string, unknown>
}>) {
  const logger = container.resolve("logger")
  const email = data.entity_id
  const token = data.token
  const actorType = data.actor_type

  logger.info(`[Subscriber: auth.password_reset] Received password reset event for ${actorType}: ${email}`)

  if (!email || !token) {
    logger.warn(`[Subscriber: auth.password_reset] Missing email or token in payload`)
    return
  }

  // Xác định URL gốc của Storefront
  const storefrontUrl = (
    process.env.STOREFRONT_URL ||
    process.env.STOREFRONT_REVALIDATE_URL?.replace(/\/api\/revalidate.*$/, "") ||
    "http://localhost:3000"
  ).replace(/\/$/, "")

  // Cấu trúc URL reset password chuẩn Storefront
  const locale = "vn"
  const resetUrl = `${storefrontUrl}/${locale}/reset-password?token=${encodeURIComponent(token)}`

  try {
    const result = await emailService.sendPasswordResetEmail({
      email,
      resetUrl,
      token,
      expiresInMinutes: 15,
    })

    if (result.success) {
      logger.info(`[Subscriber: auth.password_reset] Email dispatched successfully (mode: ${result.mode})`)
    } else {
      logger.error(`[Subscriber: auth.password_reset] Failed to dispatch email: ${result.error}`)
    }
  } catch (err: any) {
    logger.error(`[Subscriber: auth.password_reset] Unhandled error: ${err?.message}`)
  }
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}
