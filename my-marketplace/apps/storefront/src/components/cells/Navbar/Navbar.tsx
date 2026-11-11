import { HttpTypes } from "@medusajs/types"
import { CategoryNavbar } from "@/components/molecules"

export const Navbar = ({
  categories,
  parentCategories,
}: {
  categories: HttpTypes.StoreProductCategory[]
  parentCategories: HttpTypes.StoreProductCategory[]
}) => {
  return (
    <div
      className="border-y border-neutral-200/90 dark:border-neutral-800 py-2 px-4 md:px-8 bg-white dark:bg-neutral-900"
      data-testid="navbar"
    >
      <div className="w-full">
        <CategoryNavbar
          categories={categories}
          parentCategories={parentCategories}
        />
      </div>
    </div>
  )
}
