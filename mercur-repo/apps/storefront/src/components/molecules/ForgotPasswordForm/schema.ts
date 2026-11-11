import { z } from "zod"

export const forgotPasswordSchema = z.object({
  email: z.string().nonempty("Vui lòng nhập địa chỉ email").email("Địa chỉ email không hợp lệ"),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
