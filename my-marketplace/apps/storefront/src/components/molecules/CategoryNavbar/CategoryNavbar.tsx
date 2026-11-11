"use client"

import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { cn } from "@/lib/utils"
import { useParams } from "next/navigation"
import { CollapseIcon } from "@/icons"
import { useMemo } from "react"
import {
  getActiveParentHandle,
  findParentCategoryHandle,
  filterCategoriesByParent,
} from "@/lib/helpers/category-utils"
import { useCategoryDropdown } from "./hooks/useCategoryDropdown"
import { CategoryDropdownMenu } from "./components/CategoryDropdownMenu"

interface CategoryNavbarProps {
  categories: HttpTypes.StoreProductCategory[]
  parentCategories?: HttpTypes.StoreProductCategory[]
  onClose?: (state: boolean) => void
}

export const CategoryNavbar = ({
  categories,
  parentCategories = [],
  onClose,
}: CategoryNavbarProps) => {
  const params = useParams<{ category?: string }>()
  const category = params?.category

  const {
    hoveredCategoryId,
    isDropdownVisible,
    shouldRenderDropdown,
    openDropdown,
    scheduleClose,
    cancelClose,
    closeDropdown,
  } = useCategoryDropdown()

  const activeParentHandle = useMemo(
    () => getActiveParentHandle(category, categories, parentCategories),
    [category, parentCategories, categories]
  )

  const parentCategoryHandle = useMemo(
    () => findParentCategoryHandle(category, categories),
    [category, categories]
  )

  // Primary categories to display on Navbar:
  // Always keep the primary 5 AI categories (parentCategories) on the navbar
  // so navigation remains stable across all pages and doesn't get replaced when clicked.
  const displayCategories = useMemo(() => {
    if (parentCategories && parentCategories.length > 0) {
      return parentCategories
    }
    return categories.filter((c) => !c.parent_category_id)
  }, [parentCategories, categories])

  const handleClose = () => {
    onClose?.(false)
    closeDropdown()
  }

  const handleCategoryMouseEnter = (categoryId: string) => {
    const cat = displayCategories.find((c) => c.id === categoryId)
    if (cat?.category_children && cat.category_children.length > 0) {
      openDropdown(categoryId)
    } else {
      scheduleClose(100)
    }
  }

  const handleCategoryMouseLeave = () => {
    scheduleClose(180)
  }

  const handleDropdownMouseEnter = () => {
    cancelClose()
  }

  const handleDropdownMouseLeave = () => {
    scheduleClose(180)
  }

  return (
    <nav
      className="flex md:items-center flex-col md:flex-row md:overflow-visible gap-1 lg:gap-2 relative"
      aria-label="Category navigation"
      data-testid="category-navbar"
    >
      <LocalizedClientLink
        href="/categories"
        onClick={handleClose}
        className={cn(
          "text-xs md:text-sm font-semibold uppercase px-3 py-1.5 rounded-none flex items-center justify-between md:flex-shrink-0 text-neutral-800 dark:text-neutral-200 hover:text-action hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-all duration-150"
        )}
        data-testid="category-link-all-products"
      >
        Tất cả sản phẩm
      </LocalizedClientLink>

      {displayCategories.map((item, index) => {
        const { id, handle, name, category_children } = item
        const categoryUrl = `/categories/${handle}`
        const isActive =
          handle === category ||
          handle === activeParentHandle ||
          handle === parentCategoryHandle
        const hasChildren = Boolean(
          category_children && category_children.length > 0
        )
        const isCurrentHovered = hoveredCategoryId === id && isDropdownVisible
        const isLastItem = index === displayCategories.length - 1

        return (
          <div
            key={id}
            className="md:flex-shrink-0 relative"
            onMouseEnter={() => handleCategoryMouseEnter(id)}
            onMouseLeave={handleCategoryMouseLeave}
          >
            <LocalizedClientLink
              href={categoryUrl}
              onClick={handleClose}
              className={cn(
                "text-xs md:text-sm font-medium uppercase px-3 py-1.5 rounded-none my-1 md:my-0 flex items-center gap-1.5 md:whitespace-nowrap transition-all duration-150",
                isActive
                  ? "text-action font-semibold bg-neutral-100/90 dark:bg-neutral-800"
                  : isCurrentHovered
                  ? "text-action bg-neutral-100 dark:bg-neutral-800"
                  : "text-neutral-700 dark:text-neutral-300 hover:text-action hover:bg-neutral-100/80 dark:hover:bg-neutral-800/60"
              )}
              data-testid={`category-link-${handle}`}
            >
              <span>{name}</span>
              {hasChildren && (
                <span
                  className={cn(
                    "inline-flex items-center transition-transform duration-200",
                    isCurrentHovered ? "rotate-180 text-action" : "text-neutral-400"
                  )}
                >
                  <CollapseIcon size={14} className="-rotate-90" />
                </span>
              )}
            </LocalizedClientLink>

            {/* Classic Vertical Dropdown Menu attached directly beneath this category button */}
            {shouldRenderDropdown && isCurrentHovered && hasChildren && (
              <CategoryDropdownMenu
                category={item}
                align={isLastItem ? "right" : "left"}
                isVisible={isDropdownVisible}
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
                onLinkClick={handleClose}
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}
