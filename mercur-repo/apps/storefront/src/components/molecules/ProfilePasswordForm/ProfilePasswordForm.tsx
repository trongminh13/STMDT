"use client"

import { Button, Card } from "@/components/atoms"
import { LabeledInput } from "@/components/cells"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  FieldError,
  FieldValues,
  FormProvider,
  useForm,
  useFormContext,
  UseFormReturn,
} from "react-hook-form"
import { ProfilePasswordFormData, profilePasswordSchema } from "./schema"
import { useState } from "react"
import { updateCustomerPassword } from "@/lib/data/customer"
import { Heading, toast } from "@medusajs/ui"
import LocalizedClientLink from "../LocalizedLink/LocalizedLink"
import { PasswordValidator } from "@/components/cells/PasswordValidator/PasswordValidator"

export const ProfilePasswordForm = ({ token }: { token?: string }) => {
  const form = useForm<ProfilePasswordFormData>({
    resolver: zodResolver(profilePasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  return (
    <FormProvider {...form}>
      <Form form={form} token={token} />
    </FormProvider>
  )
}

const Form = ({
  form,
  token,
}: {
  form: UseFormReturn<ProfilePasswordFormData>
  token?: string
}) => {
  const [success, setSuccess] = useState(false)
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    FieldError | undefined
  >(undefined)
  const [newPasswordError, setNewPasswordError] = useState({
    isValid: false,
    lower: false,
    upper: false,
    "8chars": false,
    symbolOrDigit: false,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext()

  const updatePassword = async (data: FieldValues) => {
    if (form.getValues("confirmPassword") !== form.getValues("newPassword")) {
      setConfirmPasswordError({
        message: "Mật khẩu xác nhận không khớp. Vui lòng nhập lại chính xác.",
        type: "custom",
      } as FieldError)
      return
    }

    setConfirmPasswordError(undefined)

    if (newPasswordError.isValid) {
      try {
        const res = await updateCustomerPassword(data.newPassword, token!)
        if (res.success) {
          setSuccess(true)
        } else {
          toast.error(res.error || "Không thể cập nhật mật khẩu. Liên kết có thể đã hết hạn.")
        }
      } catch (err) {
        console.log(err)
        return
      }
    }
  }

  return success ? (
    <div className="p-4 text-center space-y-6">
      <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center font-bold text-2xl">
        ✓
      </div>
      <Heading
        level="h1"
        className="uppercase heading-md text-primary"
      >
        Đổi mật khẩu thành công
      </Heading>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Mật khẩu mới của bạn đã được cập nhật thành công. Bạn có thể đăng nhập ngay bây giờ bằng mật khẩu mới.
      </p>
      <div className="pt-2">
        <LocalizedClientLink href="/login" className="block">
          <Button
            className="uppercase py-3 px-6 !font-semibold w-full"
            size="large"
          >
            Đăng nhập ngay
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  ) : (
    <form
      className="flex flex-col gap-4 px-2"
      onSubmit={handleSubmit(updatePassword)}
    >
      <Heading
        level="h1"
        className="uppercase heading-md text-primary"
      >
        Thiết lập mật khẩu mới
      </Heading>
      <p className="text-secondary label-md text-neutral-600 dark:text-neutral-400">
        Vui lòng nhập mật khẩu mới để hoàn tất quá trình khôi phục tài khoản.
      </p>
      <LabeledInput
        label="Mật khẩu mới"
        type="password"
        placeholder="Nhập mật khẩu mới"
        error={errors.newPassword as FieldError}
        {...register("newPassword")}
      />
      <PasswordValidator
        password={form.watch("newPassword")}
        setError={setNewPasswordError}
      />
      <LabeledInput
        label="Xác nhận mật khẩu mới"
        type="password"
        placeholder="Nhập lại mật khẩu mới"
        error={(confirmPasswordError || errors.confirmPassword) as FieldError}
        {...register("confirmPassword")}
      />
      <Button className="w-full my-4 uppercase">Cập nhật mật khẩu mới</Button>
    </form>
  )
}
