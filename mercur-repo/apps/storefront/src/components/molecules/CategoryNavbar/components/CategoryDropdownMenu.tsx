'use client'

import { HttpTypes } from '@medusajs/types'
import LocalizedClientLink from '@/components/molecules/LocalizedLink/LocalizedLink'
import { CategoryDropdownContainer } from './CategoryDropdownContainer'
import { ChildCategories } from './ChildCategories'

interface CategoryDropdownMenuProps {
  category: HttpTypes.StoreProductCategory
  isVisible: boolean
  align?: 'left' | 'right'
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onLinkClick?: () => void
}

export const CategoryDropdownMenu = ({
  category,
  isVisible,
  align = 'left',
  onMouseEnter,
  onMouseLeave,
  onLinkClick,
}: CategoryDropdownMenuProps) => {
  const childCategories = category.category_children || []

  if (childCategories.length === 0) {
    return null
  }

  return (
    <CategoryDropdownContainer
      align={align}
      isVisible={isVisible}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex flex-col">
        {/* Child Subcategories Vertical List */}
        <ChildCategories
          categories={childCategories}
          parentHandle={category.handle}
          onLinkClick={onLinkClick}
        />

        {/* Divider & View All Link */}
        <div className="border-t border-neutral-100 dark:border-neutral-800/80 mt-1 pt-1">
          <LocalizedClientLink
            href={`/categories/${category.handle}`}
            onClick={onLinkClick}
            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-action hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60 rounded-none transition-colors"
          >
            <span>Khám phá tất cả {category.name}</span>
            <span>&rarr;</span>
          </LocalizedClientLink>
        </div>
      </div>
    </CategoryDropdownContainer>
  )
}
