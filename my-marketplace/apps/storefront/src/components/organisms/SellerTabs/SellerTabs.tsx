import { Suspense } from "react"
import { ProductListingSkeleton } from "../ProductListingSkeleton/ProductListingSkeleton"
import { SellerOffersListing } from "@/components/sections"
import { SellerReviewList, TabsContent, TabsList } from "@/components/molecules"
import { getSellerReviews } from "@/lib/data/reviews"

export const SellerTabs = async ({
  tab,
  seller_handle,
  seller_id,
  locale,
  page = 1,
}: {
  tab: string
  seller_handle: string
  seller_id: string
  locale: string
  page?: number
}) => {
  const tabsList = [
    { label: "Giải pháp / Sản phẩm", link: `/sellers/${seller_handle}` },
    { label: "Đánh giá & Uy tín", link: `/sellers/${seller_handle}?tab=reviews` },
  ]

  const { reviews } = await getSellerReviews(seller_id)

  return (
    <div className="mt-8">
      <TabsList list={tabsList} activeTab={tab} />
      <TabsContent value="offers" activeTab={tab}>
        <Suspense
          key={page}
          fallback={<div data-testid="seller-tabs-products-loading"><ProductListingSkeleton /></div>}
        >
          <SellerOffersListing seller_id={seller_id} locale={locale} page={page} />
        </Suspense>
      </TabsContent>
      <TabsContent value="reviews" activeTab={tab}>
        <div className="p-6 bg-white dark:bg-[#18181b] border border-neutral-200 dark:border-neutral-800 rounded-[8px]">
          <h4 className="heading-sm uppercase font-bold mb-4 text-[#18181B] dark:text-white">
            Nhận xét từ người mua ({reviews?.length || 0})
          </h4>
          <SellerReviewList reviews={reviews} />
        </div>
      </TabsContent>
    </div>
  )
}
