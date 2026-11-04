import { HomeProductsCarousel } from "@/components/organisms"
import { Product } from "@/types/product"

export const HomeProductSection = async ({
  heading,
  locale = process.env.NEXT_PUBLIC_DEFAULT_REGION || "vn",
  products = [],
  home = false,
}: {
  heading: string
  locale?: string
  products?: Product[]
  home?: boolean
}) => {
  return (
    <section className="py-8 w-full">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-6 flex flex-col">
          <h2 className="heading-lg font-bold tracking-tight uppercase">
            {heading}
          </h2>
          <p className="text-secondary text-sm md:text-base mt-1">
            Các gói giải pháp mã nguồn, workflow tự động hóa và tiện ích AI được người dùng tin cậy nhất.
          </p>
        </div>
        <HomeProductsCarousel
          locale={locale}
          sellerProducts={products.slice(0, 8)}
          home={home}
        />
      </div>
    </section>
  )
}
