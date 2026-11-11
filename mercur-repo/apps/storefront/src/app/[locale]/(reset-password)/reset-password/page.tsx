import { Button, Card } from "@/components/atoms"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { ProfilePasswordForm } from "@/components/molecules/ProfilePasswordForm/ProfilePasswordForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu | Sàn Đại Việt AI",
  description: "Thiết lập mật khẩu mới cho tài khoản Sàn Đại Việt AI",
  robots: { index: false, follow: false },
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  return (
    <main className="container flex justify-center py-16">
      <Card className="w-full max-w-lg p-6 bg-white dark:bg-[#18181b] border border-neutral-200 dark:border-neutral-800 rounded-sm">
        {token ? (
          <ProfilePasswordForm token={token} />
        ) : (
          <div className="p-4 text-center space-y-6">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center font-bold text-xl">
              !
            </div>
            <h1 className="heading-md uppercase text-primary my-0">
              Liên kết không hợp lệ
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Liên kết khôi phục mật khẩu bị thiếu mã xác thực hoặc đã hết thời hạn sử dụng (15 phút). Vui lòng gửi lại yêu cầu để nhận liên kết mới.
            </p>
            <div className="space-y-3 pt-2">
              <LocalizedClientLink href="/forgot-password" className="block">
                <Button className="w-full uppercase">
                  Yêu cầu liên kết mới
                </Button>
              </LocalizedClientLink>
              <LocalizedClientLink href="/login" className="block">
                <Button variant="tonal" className="w-full uppercase">
                  Quay lại đăng nhập
                </Button>
              </LocalizedClientLink>
            </div>
          </div>
        )}
      </Card>
    </main>
  )
}
