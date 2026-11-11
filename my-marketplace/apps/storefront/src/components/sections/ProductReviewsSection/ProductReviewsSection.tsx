import { StarRating } from "@/components/atoms"
import { getProductReviews, ProductReviewItem, ProductReviewStats } from "@/lib/data/reviews"

interface ProductReviewsSectionProps {
  productId: string
  productTitle: string
}

export const ProductReviewsSection = async ({
  productId,
  productTitle,
}: ProductReviewsSectionProps) => {
  const { reviews, stats } = await getProductReviews(productId)

  return (
    <section className="mt-16 border-t border-neutral-200 dark:border-neutral-800 pt-10" data-testid="product-reviews-section">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-neutral-200 dark:border-neutral-800 gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#1E5FBF] bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-[#1E5FBF]/20">
            KIỂM CHỨNG CỘNG ĐỒNG & FEEDBACK
          </span>
          <h3 className="heading-md uppercase font-bold text-[#18181B] dark:text-white mt-2">
            Đánh giá từ người mua
          </h3>
        </div>
        <div className="text-xs font-mono text-neutral-500">
          TIÊU CHUẨN: 100% ĐÁNH GIÁ TỪ GIAO DỊCH XÁC THỰC
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Thống kê điểm số tổng quan */}
        <div className="lg:col-span-4 bg-[#F8FAFC] dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[8px] p-6 h-fit">
          <div className="text-center pb-6 border-b border-neutral-200 dark:border-neutral-800">
            <div className="text-5xl font-black tracking-tight text-[#18181B] dark:text-white font-mono">
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center my-3">
              <StarRating starSize={20} rate={stats.averageRating} />
            </div>
            <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
              {stats.reviewCount} lượt đánh giá xác thực
            </p>
          </div>

          {/* Phân bổ tỷ lệ sao */}
          <div className="space-y-2 pt-6">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.distribution[star as 1 | 2 | 3 | 4 | 5] || 0
              const percentage = stats.reviewCount > 0 ? (count / stats.reviewCount) * 100 : 0

              return (
                <div key={star} className="flex items-center gap-3 text-xs font-mono">
                  <span className="w-6 text-neutral-600 dark:text-neutral-400 font-semibold">{star} ★</span>
                  <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1E5FBF]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-neutral-400">{count}</span>
                </div>
              )
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 leading-relaxed font-mono">
            🛡️ Đại Việt AI áp dụng chính sách đánh giá xác thực: Chỉ những khách hàng đã đặt đơn thành công mới có quyền gửi nhận xét.
          </div>
        </div>

        {/* Danh sách nhận xét chi tiết */}
        <div className="lg:col-span-8 space-y-4">
          {reviews.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-neutral-300 dark:border-neutral-700 rounded-[8px]">
              <p className="text-sm text-neutral-500">Chưa có đánh giá nào cho sản phẩm này.</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181b] rounded-[8px] space-y-3 shadow-sm hover:border-neutral-300 transition-colors"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#83C0D7]/20 border border-[#18181B] text-[#18181B] dark:text-white font-mono font-bold flex items-center justify-center text-xs">
                      {rev.customer_name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#18181B] dark:text-white">
                          {rev.customer_name}
                        </span>
                        {rev.verified_purchase && (
                          <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/20">
                            ✓ Đã mua hàng
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-neutral-400">
                        {new Date(rev.created_at).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div>
                    <StarRating starSize={14} rate={rev.rating} />
                  </div>
                </div>

                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed pl-11">
                  {rev.customer_note}
                </p>

                {rev.seller_note && (
                  <div className="ml-11 mt-3 p-3 bg-neutral-50 dark:bg-neutral-900 border-l-2 border-[#1E5FBF] rounded text-xs space-y-1">
                    <span className="font-bold text-[#1E5FBF] font-mono uppercase tracking-wider block">
                      Phản hồi từ Tác giả / Creator:
                    </span>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {rev.seller_note}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
