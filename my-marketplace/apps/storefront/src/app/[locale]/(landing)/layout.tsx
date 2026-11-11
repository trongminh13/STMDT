import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { checkRegion } from '@/lib/helpers/check-region';

export const metadata: Metadata = {
  title: 'Đại Việt AI — Sàn Giải Pháp & Tài Nguyên Số Sẵn Sàng Vận Hành',
  description:
    'Sở hữu workflow n8n, mã nguồn SaaS Next.js 15 và AI agents thực chiến - Tiết kiệm hàng trăm giờ lập trình cho Freelancer và Doanh nghiệp vừa & nhỏ Việt Nam.',
};

export default async function LandingLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const regionCheck = await checkRegion(locale);

  if (!regionCheck) {
    return redirect('/');
  }

  return (
    <div className="min-h-screen bg-[#EAEAEA] text-[#18181B] antialiased overflow-x-clip selection:bg-[#83C0D7] selection:text-[#18181B]">
      {children}
    </div>
  );
}
