"use client"

import { useState } from "react"
import { Button, Modal } from "@/components/atoms"
import { InteractiveStarRating } from "@/components/atoms"
import { submitReviewAction } from "@/lib/data/reviews"
import { toast } from "@/lib/helpers/toast"

interface ReviewModalProps {
  orderId: string
  productId: string
  productTitle: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const ReviewModal = ({
  orderId,
  productId,
  productTitle,
  isOpen,
  onClose,
  onSuccess,
}: ReviewModalProps) => {
  const [rating, setRating] = useState<number>(5)
  const [comment, setComment] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating < 1 || rating > 5) {
      toast.error({ title: "Vui lòng chọn số sao đánh giá (từ 1 đến 5 sao)" })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await submitReviewAction({
        order_id: orderId,
        reference: "product",
        reference_id: productId,
        rating,
        customer_note: comment.trim() || undefined,
      })

      if (result.success) {
        toast.success({
          title: "Đánh giá của bạn đã được gửi thành công! Cảm ơn bạn đã đóng góp ý kiến cho cộng đồng Đại Việt AI.",
        })
        if (onSuccess) onSuccess()
        onClose()
      } else {
        toast.error({
          title: result.error || "Không thể gửi đánh giá lúc này. Vui lòng thử lại sau.",
        })
      }
    } catch (err: any) {
      toast.error({ title: err?.message || "Đã xảy ra lỗi khi gửi đánh giá." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#18181b] border-2 border-[#18181B] dark:border-neutral-700 rounded-[8px] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between border-b pb-4 mb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#1E5FBF] bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-[#1E5FBF]/20">
              ĐÁNH GIÁ TÀI SẢN SỐ
            </span>
            <h3 className="heading-sm font-bold uppercase mt-2 text-[#18181B] dark:text-white truncate max-w-xs">
              {productTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-black dark:hover:text-white text-xl font-bold p-1"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2">
              Mức độ hài lòng của bạn:
            </label>
            <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-900 p-3 rounded border border-neutral-200 dark:border-neutral-800">
              <InteractiveStarRating
                value={rating}
                onChange={(val) => setRating(val)}
                data-testid="review-modal-star-rating"
              />
              <span className="text-sm font-bold text-[#18181B] dark:text-white">
                {rating === 5 && "5/5 - Rất hài lòng"}
                {rating === 4 && "4/5 - Hài lòng"}
                {rating === 3 && "3/5 - Bình thường"}
                {rating === 2 && "2/5 - Chưa ưng ý"}
                {rating === 1 && "1/5 - Kém"}
              </span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Nhận xét chi tiết (tùy chọn):
              </label>
              <span className="text-[11px] font-mono text-neutral-400">
                {comment.length}/300 ký tự
              </span>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 300))}
              placeholder="Chia sẻ về tính ứng dụng thực tế, độ sạch của mã nguồn hoặc tài liệu đính kèm..."
              rows={4}
              className="w-full text-sm p-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#18181B] dark:text-white rounded-[4px] focus:outline-none focus:border-[#1E5FBF]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="tonal"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 uppercase"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 uppercase !bg-[#83C0D7] !text-[#18181B] !border-2 !border-[#18181B] hover:!bg-black hover:!text-white font-bold"
            >
              {isSubmitting ? "Đang gửi..." : "GỬI ĐÁNH GIÁ"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
