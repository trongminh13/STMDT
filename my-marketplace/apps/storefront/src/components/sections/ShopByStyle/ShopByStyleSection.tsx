import Image from "next/image"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { ArrowRightIcon } from "@/icons"
import { Style } from "@/types/styles"

export const styles: Style[] = [
  {
    id: 1,
    name: "TỰ ĐỘNG HÓA N8N & CHĂM SÓC KHÁCH HÀNG ZALO OA",
    href: "/categories/tu-dong-hoa-workflow",
  },
  {
    id: 2,
    name: "MÃ NGUỒN KHỞI NGHIỆP NEXT.JS 15 SAAS & FASTAPI",
    href: "/categories/ma-nguon-boilerplates",
  },
  {
    id: 3,
    name: "TIỆN ÍCH MỞ RỘNG CHROME & CÔNG CỤ DÒNG LỆNH CLI",
    href: "/categories/phan-mem-tien-ich-so",
  },
  {
    id: 4,
    name: "GÓI TRI THỨC RAG & SYSTEM PROMPTS CHUYÊN SÂU",
    href: "/categories/goi-tri-thuc-prompt-ai",
  },
  {
    id: 5,
    name: "DỊCH VỤ CÀI ĐẶT VPS & HUẤN LUYỆN 1-ON-1 THỰC CHIẾN",
    href: "/categories/dich-vu-cai-dat-chuyen-mon",
  },
]

export function ShopByStyleSection() {
  return (
    <section className="bg-primary container mx-auto px-4 lg:px-8 w-full">
      <div className="mb-8">
        <h2 className="heading-lg text-primary uppercase">
          KHÁM PHÁ THEO MỤC TIÊU VẬN HÀNH
        </h2>
        <p className="text-secondary text-sm md:text-base mt-1">
          Lựa chọn gói giải pháp phù hợp với giai đoạn phát triển và kiến trúc kỹ thuật của bạn.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center border rounded-sm overflow-hidden bg-component">
        <div className="py-8 px-6 lg:py-12 lg:px-10 h-full flex flex-col justify-center border-b lg:border-b-0 lg:border-r">
          {styles.map((style) => (
            <LocalizedClientLink
              key={style.id}
              href={style.href}
              className="group flex items-center justify-between gap-4 text-primary hover:text-action transition-all border-b border-primary/10 hover:border-action w-full py-4 last:border-b-0"
            >
              <span className="font-bold text-sm md:text-base tracking-wide uppercase">
                {style.name}
              </span>
              <ArrowRightIcon className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
            </LocalizedClientLink>
          ))}
        </div>
        <div className="relative flex items-center justify-center bg-zinc-950 p-6 lg:p-12 h-full">
          <Image
            loading="lazy"
            src="/images/categories/source-code.svg"
            alt="Kiến trúc giải pháp mã nguồn và công nghệ AI"
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
