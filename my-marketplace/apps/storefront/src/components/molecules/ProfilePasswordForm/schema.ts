import { z } from "zod"

export const profilePasswordSchema = z.object({
  newPassword: z.string().nonempty("Vui lòng nhập mật khẩu mới"),
  confirmPassword: z.string().nonempty("Vui lòng xác nhận mật khẩu mới"),
})

export type ProfilePasswordFormData = z.infer<typeof profilePasswordSchema>
