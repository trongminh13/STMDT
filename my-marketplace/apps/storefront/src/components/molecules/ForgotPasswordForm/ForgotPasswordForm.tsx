'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { FieldError, FormProvider, useForm, useFormContext } from 'react-hook-form';

import { Button } from '@/components/atoms';
import { LabeledInput } from '@/components/cells';
import { sendResetPasswordEmail } from '@/lib/data/customer';
import { toast } from '@/lib/helpers/toast';
import LocalizedClientLink from '../LocalizedLink/LocalizedLink';

import { ForgotPasswordFormData, forgotPasswordSchema } from './schema';

export const ForgotPasswordForm = () => {
  const methods = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  return (
    <FormProvider {...methods}>
      <Form />
    </FormProvider>
  );
};

const Form = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset
  } = useFormContext<ForgotPasswordFormData>();

  const submit = async (data: ForgotPasswordFormData) => {
    if (!data.email) return;

    const result = await sendResetPasswordEmail(data.email);

    if (!result.success) {
      toast.error({ title: result.error || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.' });
      return;
    }

    reset({ email: '' });

    toast.success({
      title: `Yêu cầu khôi phục mật khẩu đã được gửi! Nếu tài khoản ${data.email} tồn tại trong hệ thống, bạn sẽ nhận được thư hướng dẫn trong giây lát. Vui lòng kiểm tra hộp thư đến (và thư rác) - liên kết có hiệu lực trong 15 phút.`
    });
  };

  return (
    <div
      className="mx-auto mt-8 w-full max-w-xl space-y-4 rounded-sm border p-6 bg-white dark:bg-[#18181b]"
      data-testid="forgot-password-form-container"
    >
      <h1 className="heading-md my-0 mb-2 uppercase text-primary">Quên mật khẩu?</h1>
      <p className="text-md text-neutral-600 dark:text-neutral-400">
        Nhập địa chỉ email đăng ký tài khoản của bạn. Sàn Đại Việt AI sẽ gửi liên kết khôi phục mật khẩu qua email.
      </p>
      <form
        onSubmit={handleSubmit(submit)}
        data-testid="forgot-password-form"
      >
        <div className="space-y-4">
          <LabeledInput
            label="Địa chỉ E-mail"
            placeholder="Nhập email của bạn (ví dụ: vidu@congty.com)"
            error={errors.email as FieldError}
            data-testid="forgot-password-email-input"
            {...register('email')}
          />
        </div>

        <div className="mt-8 space-y-4">
          <Button
            className="w-full uppercase"
            disabled={isSubmitting}
            data-testid="forgot-password-submit-button"
          >
            {isSubmitting ? 'ĐANG GỬI LIÊN KẾT...' : 'GỬI LIÊN KẾT KHÔI PHỤC'}
          </Button>

          <LocalizedClientLink
            href="/login"
            className="flex"
            data-testid="forgot-password-back-to-login-link"
          >
            <Button
              variant="tonal"
              className="flex w-full justify-center uppercase"
            >
              Quay lại đăng nhập
            </Button>
          </LocalizedClientLink>
        </div>
      </form>
    </div>
  );
};
