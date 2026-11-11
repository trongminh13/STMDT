import { ProductDetails, ProductGallery } from "@/components/organisms"
import { listProducts, getSimilarProducts } from "@/lib/data/products"
import { listOffers } from "@/lib/data/offers"
import { StoreOffer } from "@/lib/helpers/buybox"
import { HomeProductSection } from "../HomeProductSection/HomeProductSection"
import { ProductReviewsSection } from "../ProductReviewsSection/ProductReviewsSection"
import NotFound from "@/app/not-found"

export const ProductDetailsPage = async ({
  handle,
  locale,
}: {
  handle: string
  locale: string
}) => {
  const prod = await listProducts({
    countryCode: locale,
    queryParams: { handle: [handle], limit: 1 },
  }).then(({ response }) => response.products[0])

  if (!prod) return null

  const { offers } = await listOffers({
    productId: prod.id,
    countryCode: locale,
  })

  const primarySeller = offers?.[0]?.seller as any
  if (primarySeller?.store_status === "SUSPENDED") {
    return NotFound()
  }

  // 1. Lấy danh sách sản phẩm tương tự cùng danh mục / lĩnh vực AI
  const categoryIds = (prod.categories || [])
    .map((c: any) => c.id || c.handle)
    .filter(Boolean)

  const similarProducts = await getSimilarProducts({
    productId: prod.id,
    productHandle: prod.handle,
    categoryIds,
    countryCode: locale,
    limit: 4,
  })

  // 2. Lấy thêm các sản phẩm khác từ cùng Creator/Seller nếu có
  const sellerId = primarySeller?.id
  const sellerName = primarySeller?.name || "Creator"
  let sellerOtherProducts: any[] = []

  if (sellerId) {
    const { offers: sellerOffers } = await listOffers({
      sellerId,
      countryCode: locale,
      limit: 8,
    }).catch(() => ({ offers: [] }))

    const seenProductIds = new Set([prod.id])
    sellerOtherProducts = (sellerOffers || [])
      .map((o: any) => o.product)
      .filter((p: any) => {
        if (!p || !p.id || seenProductIds.has(p.id)) return false
        seenProductIds.add(p.id)
        return true
      })
  }

  return (
    <>
      <div className="flex flex-col md:flex-row lg:gap-12" data-testid="product-details-page">
        <div className="md:w-1/2 md:px-2" data-testid="product-gallery-container">
          <ProductGallery
            images={prod?.images || []}
            thumbnail={prod?.thumbnail}
            title={prod?.title}
          />
        </div>
        <div className="md:w-1/2 md:px-2" data-testid="product-details-container">
          <ProductDetails
            product={prod}
            locale={locale}
            offers={offers as StoreOffer[]}
          />
        </div>
      </div>

      {/* Khối 1: Giải pháp & Sản phẩm tương tự (cùng chuyên mục / lĩnh vực) */}
      {similarProducts.length > 0 && (
        <div className="my-8">
          <HomeProductSection
            heading="GIẢI PHÁP & SẢN PHẨM TƯƠNG TỰ"
            products={similarProducts}
            locale={locale}
          />
        </div>
      )}

      {/* Khối 2: Sản phẩm khác từ cùng Creator (nếu Creator có giải pháp khác) */}
      {sellerOtherProducts.length > 0 && (
        <div className="my-8">
          <HomeProductSection
            heading={`SẢN PHẨM KHÁC TỪ CREATOR ${sellerName.toUpperCase()}`}
            products={sellerOtherProducts}
            locale={locale}
          />
        </div>
      )}

      {/* Khối 3: Đánh giá & Phản hồi cộng đồng */}
      <ProductReviewsSection
        productId={prod.id}
        productTitle={prod.title}
      />
    </>
  )
}
