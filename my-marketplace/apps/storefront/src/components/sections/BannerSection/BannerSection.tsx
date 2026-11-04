import { Button } from "@/components/atoms"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import Image from "next/image"

export const BannerSection = () => {
  return (
    <section className="bg-tertiary container mx-auto px-4 lg:px-8 text-tertiary">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center rounded-sm overflow-hidden border border-secondary">
        <div className="py-8 px-6 lg:p-12 flex flex-col h-full justify-between bg-primary text-primary">
          <div className="mb-8 lg:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider inline-block px-3 py-1 mb-4 border border-primary/20 rounded-sm bg-component">
              #ENTERPRISE_WORKFLOW
            </span>
            <h2 className="heading-xl uppercase mb-4 leading-tight">
              TỰ ĐỘNG HÓA VẬN HÀNH: TĂNG TỐC NĂNG SUẤT VỚI AI THỰC CHIẾN
            </h2>
            <p className="text-base lg:text-lg text-secondary max-w-lg leading-relaxed">
              Cắt giảm đến 80% tác vụ thủ công với các kịch bản n8n và Dify cấu hình sẵn: Tự động phản hồi Zalo OA 24/7, bóc tách hóa đơn DeepSeek và đồng bộ dữ liệu chuẩn mực.
            </p>
          </div>
          <LocalizedClientLink href="/categories/tu-dong-hoa-workflow">
            <Button size="large" className="w-fit">
              KHÁM PHÁ WORKFLOW
            </Button>
          </LocalizedClientLink>
        </div>
        <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full flex items-center justify-center bg-zinc-950 p-6 lg:p-10">
          <Image
            loading="lazy"
            src="/images/categories/automation-workflow.svg"
            alt="Giải pháp tự động hóa doanh nghiệp Đại Việt AI"
            width={500}
            height={400}
            className="object-contain w-full max-h-[380px]"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </div>
    </section>
  )
}
