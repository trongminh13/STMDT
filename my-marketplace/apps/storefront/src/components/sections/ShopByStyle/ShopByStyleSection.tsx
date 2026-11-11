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
    <section className="bg-primary container">
      <h2 className="heading-lg text-primary mb-12 uppercase">
        GIẢI PHÁP THEO MỤC TIÊU VẬN HÀNH
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
        <div className="py-[52px] px-[58px] h-full border rounded-sm">
          {styles.map((style) => (
            <LocalizedClientLink
              key={style.id}
              href={style.href}
              className="group flex items-center gap-4 text-primary hover:text-action transition-colors border-b border-transparent hover:border-primary w-fit pb-2 mb-8 last:mb-0"
            >
              <span className="text-xl lg:text-2xl font-bold uppercase">
                {style.name}
              </span>
              <ArrowRightIcon className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </LocalizedClientLink>
          ))}
        </div>
        <div className="relative hidden lg:flex items-center justify-center p-6">
          <Image
            loading="lazy"
            fetchPriority="high"
            src="/images/categories/source-code.svg"
            alt="Kiến trúc giải pháp mã nguồn và công nghệ AI"
            width={700}
            height={600}
            className="object-contain rounded-sm w-full h-auto max-h-[500px]"
          />
        </div>
      </div>
    </section>
  )
}
