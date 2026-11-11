"use client"

import { useState } from "react"
import { Button } from "@/components/atoms"
import { ReviewModal } from "../ReviewModal/ReviewModal"

interface ReviewButtonProps {
  orderId: string
  productId: string
  productTitle: string
}

export const ReviewButton = ({
  orderId,
  productId,
  productTitle,
}: ReviewButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)

  return (
    <>
      <Button
        variant="tonal"
        size="large"
        onClick={() => setIsOpen(true)}
        disabled={hasReviewed}
        className="w-full sm:w-auto uppercase font-semibold text-xs border border-neutral-300 dark:border-neutral-700 hover:border-[#18181B]"
      >
        {hasReviewed ? "✓ Đã đánh giá" : "★ Đánh giá tài sản"}
      </Button>

      {isOpen && (
        <ReviewModal
          orderId={orderId}
          productId={productId}
          productTitle={productTitle}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSuccess={() => setHasReviewed(true)}
        />
      )}
    </>
  )
}
