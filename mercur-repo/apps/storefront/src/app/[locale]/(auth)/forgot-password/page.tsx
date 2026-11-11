import { ForgotPasswordForm } from "@/components/molecules/ForgotPasswordForm/ForgotPasswordForm"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quên mật khẩu | Sàn Đại Việt AI",
  description: "Khôi phục và thiết lập mật khẩu mới cho tài khoản Sàn Đại Việt AI",
  robots: { index: false, follow: false },
}

export default function ForgotPasswordPage() {

  return (
    <main className="container">
      <ForgotPasswordForm />
    </main>
  )
}
