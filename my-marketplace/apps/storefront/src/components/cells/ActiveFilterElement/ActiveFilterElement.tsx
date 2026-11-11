"use client"
import { Chip } from '@/components/atoms/Chip/Chip'
import useFilters from "@/hooks/useFilters"
import { CloseIcon } from "@/icons"

const filtersLabels: Record<string, string> = {
  platform: "Nền tảng",
  ai_model: "Mô hình AI",
  delivery_format: "Bàn giao",
  skill_level: "Cài đặt",
  license: "Bản quyền",
  category: "Danh mục",
  brand: "Thương hiệu",
  min_price: "Giá tối thiểu",
  max_price: "Giá tối đa",
  query: "Tìm kiếm",
  rating: "Đánh giá",
  color: "Màu sắc",
  size: "Kích cỡ",
  condition: "Tình trạng",
}

export const ActiveFilterElement = ({ filter }: { filter: string[] }) => {
  const { updateFilters } = useFilters(filter[0])

  const activeFilters = filter[1].split(",")

  const removeFilterHandler = (filter: string) => {
    updateFilters(filter)
  }

  const label =
    filtersLabels[filter[0]] ??
    filter[0].charAt(0).toUpperCase() + filter[0].slice(1)

  return (
    <div className="flex gap-2 items-center mb-4">
      <span className="label-md hidden md:inline-block font-mono text-xs uppercase text-zinc-500">
        {label}:
      </span>
      {activeFilters.map((element) => (
        <Chip
          key={element}
          value={
            <span className="flex gap-2 items-center cursor-default whitespace-nowrap font-mono text-xs">
              {element}{" "}
              <span
                onClick={() => removeFilterHandler(element)}
                className="hover:text-red-500 transition-colors p-0.5"
                title={`Xóa bộ lọc ${element}`}
              >
                <CloseIcon size={14} className="cursor-pointer" />
              </span>
            </span>
          }
          className="!rounded-none !border-black"
        />
      ))}
    </div>
  )
}
