import { HttpTypes } from "@medusajs/types"
import { CategoryNavbar } from '@/components/molecules/CategoryNavbar/CategoryNavbar';
import { NavbarSearch } from '@/components/molecules/NavbarSearch/NavbarSearch';

export const Navbar = ({
  categories,
  parentCategories,
}: {
  categories: HttpTypes.StoreProductCategory[]
  parentCategories: HttpTypes.StoreProductCategory[]
}) => {
  return (
    <div
      className="flex flex-col lg:flex-row border-y border-neutral-200/90 dark:border-neutral-800 py-2.5 justify-between px-4 md:px-8 gap-4 md:gap-0 bg-white dark:bg-neutral-900"
      data-testid="navbar"
    >
      <div className="hidden lg:flex items-center justify-between w-full gap-4">
        <CategoryNavbar
          categories={categories}
          parentCategories={parentCategories}
        />
        <div
          className="ml-auto max-w-[360px] xl:max-w-[420px] w-full pl-4 flex-shrink-0"
          data-testid="navbar-search-desktop"
        >
          <NavbarSearch />
        </div>
      </div>
      <div className="lg:hidden max-w-full w-full" data-testid="navbar-search-mobile">
        <NavbarSearch className="w-full" />
      </div>
    </div>
  )
}
