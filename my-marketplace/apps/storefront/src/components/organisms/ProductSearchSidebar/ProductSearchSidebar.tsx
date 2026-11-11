"use client"

import { Button } from '@/components/atoms/Button/Button'
import { Accordion } from '@/components/molecules/Accordion/Accordion'
import { FilterCheckboxOption } from '@/components/molecules/FilterCheckboxOption/FilterCheckboxOption'
import { Modal } from '@/components/molecules/Modal/Modal'
import useFilters from "@/hooks/useFilters"
import { cn } from "@/lib/utils"
import React, { useEffect, useState } from "react"
import { ProductListingActiveFilters } from "../ProductListingActiveFilters/ProductListingActiveFilters"
import useGetAllSearchParams from "@/hooks/useGetAllSearchParams"
import type { SearchFacets } from "@/lib/data/products"

export type FacetModel = {
  value: string
  count: number
}

// Fallback AI facets if backend has not seeded attributes yet
export const DEFAULT_AI_FACETS: Record<string, FacetModel[]> = {
  platform: [
    { value: "n8n", count: 4 },
    { value: "Dify", count: 2 },
    { value: "Make.com", count: 1 },
    { value: "Next.js 15", count: 2 },
    { value: "Python / FastAPI", count: 1 },
    { value: "Docker", count: 2 },
    { value: "Chrome Extension", count: 1 },
  ],
  ai_model: [
    { value: "DeepSeek-V3 / R1", count: 3 },
    { value: "OpenAI (GPT-4o)", count: 3 },
    { value: "Gemini 2.0", count: 2 },
    { value: "Anthropic (Claude 3.5)", count: 1 },
    { value: "Ollama / Local LLM", count: 1 },
    { value: "Không dùng AI", count: 2 },
  ],
  delivery_format: [
    { value: "JSON Workflow File", count: 3 },
    { value: "Full Source Code ZIP", count: 2 },
    { value: "Dify DSL File", count: 1 },
    { value: "Chrome Extension ZIP", count: 1 },
    { value: "Prompt & Dataset", count: 1 },
    { value: "Dịch vụ Cài đặt 1-1", count: 2 },
  ],
  skill_level: [
    { value: "Mì ăn liền (< 5 phút)", count: 5 },
    { value: "Cơ bản (Cần API Key)", count: 2 },
    { value: "Nâng cao (Cần Dev/Docker)", count: 3 },
  ],
}

const ATTRIBUTE_HEADINGS: Record<string, string> = {
  platform: "Nền tảng & Runtime",
  ai_model: "Mô hình AI hỗ trợ",
  delivery_format: "Hình thức bàn giao",
  skill_level: "Mức độ phức tạp",
  license: "Bản quyền & Giấy phép",
  size: "Kích cỡ",
  color: "Màu sắc",
  condition: "Tình trạng",
}

const getAiBrandColor = (name: string): string => {
  const lower = name.toLowerCase()
  if (lower.includes("deepseek")) return "#1E88E5" // DeepSeek Blue
  if (lower.includes("openai") || lower.includes("gpt")) return "#10A37F" // OpenAI Emerald
  if (lower.includes("claude") || lower.includes("anthropic")) return "#D97706" // Claude Warm Amber
  if (lower.includes("gemini")) return "#7C3AED" // Google Gemini Violet
  if (lower.includes("ollama") || lower.includes("local")) return "#475569" // Slate Local
  return "#9CA3AF" // Neutral Gray
}

export const ProductSearchSidebar = ({ facets }: { facets: SearchFacets }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const { allSearchParams } = useGetAllSearchParams()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const rawAttributes = facets.attributes || {}
  const hasAiFacets = Object.keys(rawAttributes).some((k) =>
    ["platform", "ai_model", "delivery_format", "skill_level"].includes(k)
  )

  const activeFacets = hasAiFacets
    ? rawAttributes
    : { ...DEFAULT_AI_FACETS, ...rawAttributes }

  // Exclude legacy fashion attributes (size, color, condition)
  const filteredAttributeEntries = Object.entries(activeFacets).filter(
    ([key]) => !["size", "color", "condition"].includes(key.toLowerCase())
  )

  const ORDER = ["platform", "ai_model", "delivery_format", "skill_level", "license"]
  const attributeEntries = filteredAttributeEntries.sort(([a], [b]) => {
    const idxA = ORDER.indexOf(a)
    const idxB = ORDER.indexOf(b)
    if (idxA !== -1 && idxB !== -1) return idxA - idxB
    if (idxA !== -1) return -1
    if (idxB !== -1) return 1
    return a.localeCompare(b)
  })

  const renderAttributeFilters = () =>
    attributeEntries.map(([key, items]) => (
      <AttributeFilter
        key={key}
        attributeKey={key}
        items={items}
        defaultOpen={Boolean(allSearchParams[key]) || ["platform", "ai_model"].includes(key)}
      />
    ))

  return isMobile ? (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-full uppercase mb-4">
        Bộ lọc
      </Button>
      {isOpen && (
        <Modal heading="Bộ lọc" onClose={() => setIsOpen(false)}>
          <div className="px-4">
            <ProductListingActiveFilters />
            {renderAttributeFilters()}
          </div>
        </Modal>
      )}
    </>
  ) : (
    <div>{renderAttributeFilters()}</div>
  )
}

function AttributeFilter({
  attributeKey,
  items,
  defaultOpen = true,
}: {
  attributeKey: string
  items: FacetModel[]
  defaultOpen?: boolean
}) {
  const { updateFilters, isFilterActive } = useFilters(attributeKey)

  const selectHandler = (option: string) => {
    updateFilters(option)
  }

  const heading =
    ATTRIBUTE_HEADINGS[attributeKey] ||
    attributeKey.charAt(0).toUpperCase() + attributeKey.slice(1)

  // 1. Platform & Runtime: Render as Brutalist Chip tags
  if (attributeKey === "platform") {
    return (
      <Accordion heading={heading} defaultOpen={defaultOpen}>
        <div className="flex flex-wrap gap-2 mt-2 mb-4 px-1">
          {(items || []).map(({ value, count }) => {
            const active = isFilterActive(value)
            return (
              <button
                key={value}
                type="button"
                onClick={() => selectHandler(value)}
                className={cn(
                  "px-3 py-1.5 text-xs font-mono font-medium transition-colors border",
                  active
                    ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-xs"
                    : "bg-white text-black border-black/30 hover:border-black dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-700 dark:hover:border-zinc-400"
                )}
              >
                {value}
                {count > 0 && (
                  <span
                    className={cn(
                      "ml-1.5 text-[10px]",
                      active ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-400"
                    )}
                  >
                    ({count})
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </Accordion>
    )
  }

  // 2. AI Model: Render with AI brand color dot indicator
  if (attributeKey === "ai_model") {
    return (
      <Accordion heading={heading} defaultOpen={defaultOpen}>
        <ul className="px-4">
          {(items || []).map(({ value, count }) => {
            const brandColor = getAiBrandColor(value)
            return (
              <li
                key={value}
                className="mb-3.5 flex items-center justify-between"
              >
                <FilterCheckboxOption
                  checked={isFilterActive(value)}
                  disabled={count === 0}
                  onCheck={selectHandler}
                  label={value}
                />
                <div className="flex items-center gap-1.5">
                  <span
                    style={{ backgroundColor: brandColor }}
                    className="w-3 h-3 rounded-full border border-black/20 dark:border-white/20 inline-block shrink-0 shadow-xs"
                    title={value}
                  />
                  {count > 0 && (
                    <span className="text-xs text-zinc-400 font-mono">({count})</span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </Accordion>
    )
  }

  // 3. Delivery Format, Skill Level, and general attributes: Clean checkbox list
  return (
    <Accordion heading={heading} defaultOpen={defaultOpen}>
      <ul className="px-4">
        {(items || []).map(({ value, count }) => (
          <li key={value} className="mb-3.5 flex items-center justify-between">
            <FilterCheckboxOption
              checked={isFilterActive(value)}
              disabled={count === 0}
              onCheck={selectHandler}
              label={value}
            />
            {count > 0 && (
              <span className="text-xs text-zinc-400 font-mono">({count})</span>
            )}
          </li>
        ))}
      </ul>
    </Accordion>
  )
}
