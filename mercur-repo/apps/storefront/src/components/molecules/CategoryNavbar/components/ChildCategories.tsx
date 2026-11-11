'use client'

import { HttpTypes } from '@medusajs/types'
import LocalizedClientLink from '@/components/molecules/LocalizedLink/LocalizedLink'

interface Props {
  categories: HttpTypes.StoreProductCategory[]
  onLinkClick?: () => void
  parentHandle?: string
}

export const ChildCategories = ({ categories, onLinkClick }: Props) => {
  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-0.5 py-0.5">
      {categories.map((child) => (
        <LocalizedClientLink
          key={child.id}
          href={`/categories/${child.handle}`}
          onClick={onLinkClick}
          className="group flex flex-col px-3 py-2 rounded-none hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors"
          data-testid={`subcategory-link-${child.handle}`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-sm text-neutral-800 dark:text-neutral-200 group-hover:text-action transition-colors">
              {child.name}
            </span>
            <span className="text-neutral-400 group-hover:text-action group-hover:translate-x-0.5 transition-all text-xs">
              &rarr;
            </span>
          </div>
          {child.description && (
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5 font-normal">
              {child.description}
            </p>
          )}
        </LocalizedClientLink>
      ))}
    </div>
  )
}
