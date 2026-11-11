import { HomeProductsCarousel } from "@/components/organisms"
import { Product } from "@/types/product"
import { HttpTypes } from "@medusajs/types"

export const HomeProductSection = async ({
  heading,
  locale = process.env.NEXT_PUBLIC_DEFAULT_REGION || "vn",
  products = [],
  home = false,
}: {
  heading: string
  locale?: string
  products?: (Product | HttpTypes.StoreProduct)[]
  home?: boolean
}) => {
  return (
    <section className="py-8 w-full">
      <h2 className="mb-6 heading-lg font-bold tracking-tight uppercase">
        {heading}
      </h2>
      <HomeProductsCarousel
        locale={locale}
        sellerProducts={products.slice(0, 8)}
        home={home}
      />
    </section>
  )
}
