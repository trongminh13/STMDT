import { Button } from '@/components/atoms/Button/Button';
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import Image from "next/image"

export const BannerSection = () => {
  return (
    <section className="bg-tertiary container text-tertiary">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
        <div className="py-6 px-6 flex flex-col h-full justify-between border border-secondary rounded-sm">
          <div className="mb-8 lg:mb-48">
            <span className="text-sm inline-block px-4 py-1 border border-secondary rounded-sm mb-4">
              #ENTERPRISE_WORKFLOW
            </span>
            <h2 className="display-sm">
              TỰ ĐỘNG HÓA VẬN HÀNH: TĂNG TỐC VỚI AI
            </h2>
            <p className="text-lg text-tertiary max-w-lg mt-4">
              Cắt giảm đến 80% tác vụ thủ công với các kịch bản n8n và Dify cấu hình sẵn: Tự động phản hồi Zalo OA 24/7, bóc tách hóa đơn DeepSeek.
            </p>
          </div>
          <LocalizedClientLink href="/categories/tu-dong-hoa-workflow">
            <Button size="large" className="w-fit bg-secondary/10">
              KHÁM PHÁ WORKFLOW
            </Button>
          </LocalizedClientLink>
        </div>
        <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full flex justify-end items-center rounded-sm">
          <Image
            loading="lazy"
            src="/images/categories/automation-workflow.svg"
            alt="Giải pháp tự động hóa doanh nghiệp Đại Việt AI"
            width={700}
            height={600}
            className="object-contain max-h-[500px] rounded-sm w-full"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </div>
    </section>
  )
}
