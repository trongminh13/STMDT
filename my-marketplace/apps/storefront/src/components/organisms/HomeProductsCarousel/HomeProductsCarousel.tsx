import { Carousel } from "@/components/cells"
import { ProductCard } from "../ProductCard/ProductCard"
import { listProducts } from "@/lib/data/products"
import { Product } from "@/types/product"
import { HttpTypes } from "@medusajs/types"

export const HomeProductsCarousel = async ({
  locale,
  sellerProducts = [],
  home = false,
}: {
  locale: string
  sellerProducts?: (Product | HttpTypes.StoreProduct)[]
  home?: boolean
}) => {
  // Nếu sellerProducts đã được truyền vào trực tiếp: Render ngay, không gọi lại API thừa thãi
  let displayProducts = sellerProducts

  if (!displayProducts || displayProducts.length === 0) {
    const {
      response: { products },
    } = await listProducts({
      countryCode: locale,
      queryParams: {
        limit: home ? 4 : 8,
        order: "created_at",
      },
    }).catch(() => ({ response: { products: [] } }))
    displayProducts = products
  }

  if (!displayProducts || !displayProducts.length) return null

  return (
    <div className="flex justify-center w-full">
      <Carousel
        align="start"
        items={displayProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product as any}
          />
        ))}
      />
    </div>
  )
}
