"use client"

import { HttpTypes } from "@medusajs/types"
import { Chip } from "@/components/atoms"
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams"

const TRANSLATED_OPTION_TITLES: Record<string, string> = {
  tier: "Gói giải pháp & Bản quyền",
  edition: "Phiên bản phát hành",
  license: "Hình thức giấy phép",
  support: "Gói hỗ trợ kỹ thuật",
  variant: "Tùy chọn giải pháp",
  default: "Gói tiêu chuẩn",
}

export const ProductVariants = ({
  product,
  selectedVariant,
}: {
  product: HttpTypes.StoreProduct
  selectedVariant: Record<string, string>
}) => {
  const updateSearchParams = useUpdateSearchParams()

  const setOptionValue = (optionId: string, value: string) => {
    if (value) updateSearchParams(optionId, value)
  }

  // Lọc bỏ triệt để các option thời trang nếu database còn sót lại (size, color, condition)
  const filteredOptions = (product.options || []).filter(({ title }: HttpTypes.StoreProductOption) => {
    const lower = (title || "").toLowerCase()
    return !["size", "color", "condition"].includes(lower)
  })

  if (!filteredOptions.length) {
    return null
  }

  return (
    <div className="my-4 space-y-3" data-testid="product-variants">
      {filteredOptions.map(
        ({ id, title, values }: HttpTypes.StoreProductOption) => {
          const lowerTitle = (title || "").toLowerCase()
          const displayTitle = TRANSLATED_OPTION_TITLES[lowerTitle] || title

          return (
            <div key={id} data-testid={`product-variant-${lowerTitle}`}>
              <div className="flex items-center gap-2">
                <span className="label-md text-secondary font-medium">{displayTitle}:</span>
                <span className="label-md font-semibold text-primary" data-testid={`product-variant-selected-${lowerTitle}`}>
                  {selectedVariant[lowerTitle] || values?.[0]?.value || "Tiêu chuẩn"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2" data-testid={`product-variant-options-${lowerTitle}`}>
                {(values || []).map(
                  ({
                    id: valId,
                    value,
                  }: Partial<HttpTypes.StoreProductOptionValue>) => {
                    if (!value) return null
                    const isSelected = (selectedVariant[lowerTitle] || values?.[0]?.value) === value

                    return (
                      <Chip
                        key={valId}
                        selected={isSelected}
                        value={value}
                        onSelect={() => setOptionValue(lowerTitle, value)}
                        data-testid={`product-variant-chip-${lowerTitle}-${value.toLowerCase().replace(/\s+/g, '-')}`}
                      />
                    )
                  }
                )}
              </div>
            </div>
          )
        }
      )}
    </div>
  )
}
