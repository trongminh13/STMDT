import { generatePasswordResetEmailHtml, PasswordResetEmailData } from "./templates/password-reset-template"

export interface SendEmailResult {
  success: boolean
  messageId?: string
  mode: "resend" | "sendgrid" | "mock"
  error?: string
}

export class EmailService {
  private static instance: EmailService

  private fromEmail: string
  private fromName: string
  private resendApiKey?: string
  private sendgridApiKey?: string

  private constructor() {
    this.fromEmail = process.env.FROM_EMAIL || process.env.SENDGRID_FROM || "no-reply@daiviet.ai"
    this.fromName = process.env.FROM_NAME || "Sàn Đại Việt AI"
    this.resendApiKey = process.env.RESEND_API_KEY
    this.sendgridApiKey = process.env.SENDGRID_API_KEY
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  /**
   * Gửi email đặt lại mật khẩu với cơ chế đa tầng (Resend -> SendGrid -> Dev Console Logger)
   */
  public async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<SendEmailResult> {
    const { subject, html, text } = generatePasswordResetEmailHtml(data)
    const formattedFrom = `${this.fromName} <${this.fromEmail}>`

    // 1. Nếu có cấu hình Resend API
    if (this.resendApiKey) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.resendApiKey}`,
          },
          body: JSON.stringify({
            from: formattedFrom,
            to: [data.email],
            subject,
            html,
            text,
          }),
        })

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}))
          console.error("[EmailService:Resend] Error sending email:", errData)
          return {
            success: false,
            mode: "resend",
            error: errData.message || response.statusText,
          }
        }

        const resData = (await response.json()) as { id: string }
        console.log(`[EmailService:Resend] Password reset email sent to ${data.email} (id: ${resData.id})`)
        return {
          success: true,
          messageId: resData.id,
          mode: "resend",
        }
      } catch (err: any) {
        console.error("[EmailService:Resend] Network exception:", err?.message)
        return { success: false, mode: "resend", error: err?.message }
      }
    }

    // 2. Nếu có cấu hình SendGrid API
    if (this.sendgridApiKey) {
      try {
        const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.sendgridApiKey}`,
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: data.email }] }],
            from: { email: this.fromEmail, name: this.fromName },
            subject,
            content: [
              { type: "text/plain", value: text },
              { type: "text/html", value: html },
            ],
          }),
        })

        if (!response.ok) {
          const errText = await response.text().catch(() => "")
          console.error("[EmailService:SendGrid] Error sending email:", errText)
          return {
            success: false,
            mode: "sendgrid",
            error: errText || response.statusText,
          }
        }

        console.log(`[EmailService:SendGrid] Password reset email sent to ${data.email}`)
        return {
          success: true,
          mode: "sendgrid",
        }
      } catch (err: any) {
        console.error("[EmailService:SendGrid] Network exception:", err?.message)
        return { success: false, mode: "sendgrid", error: err?.message }
      }
    }

    // 3. Fallback Môi trường Development / QA Testing: Xuất ra Console Logger
    console.log("\n" + "=".repeat(80))
    console.log(" [ĐẠI VIỆT AI - EMAIL SERVICE (DEVELOPMENT / QA MOCK)]")
    console.log(`  To: ${data.email}`)
    console.log(`  Subject: ${subject}`)
    console.log(`  From: ${formattedFrom}`)
    console.log(`  Reset Password URL:`)
    console.log(`  👉 ${data.resetUrl}`)
    console.log(`  Token: ${data.token.substring(0, 24)}... (Hạn dùng: 15 phút)`)
    console.log("=".repeat(80) + "\n")

    return {
      success: true,
      mode: "mock",
    }
  }
}

export const emailService = EmailService.getInstance()
