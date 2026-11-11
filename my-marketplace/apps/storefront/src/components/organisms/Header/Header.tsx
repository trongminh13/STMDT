import Image from "next/image"
import { HttpTypes } from "@medusajs/types"

import { CartDropdown, MobileNavbar, Navbar } from "@/components/cells"
import { UserDropdown } from "@/components/cells/UserDropdown/UserDropdown"
import CountrySelector from "@/components/molecules/CountrySelector/CountrySelector"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { MessageButton } from "@/components/molecules/MessageButton/MessageButton"
import { NavbarSearch } from "@/components/molecules/NavbarSearch/NavbarSearch"
import { listCategories } from "@/lib/data/categories"
import { listRegions } from "@/lib/data/regions"
import { retrieveCustomer } from "@/lib/data/customer"

export const Header = async ({ locale } : {
  locale: string
}) => {
  const user = await retrieveCustomer().catch(() => null)
  const isLoggedIn = Boolean(user)

  const regions = await listRegions()

  const { categories, parentCategories } = (await listCategories({ query: { include_ancestors_tree: true } })) as {
    categories: HttpTypes.StoreProductCategory[]
    parentCategories: HttpTypes.StoreProductCategory[]
  }
  return (
    <header data-testid="header" className="relative z-30 bg-primary">
      <div className="flex items-center justify-between py-3 lg:px-8 px-4 md:px-5 gap-3 lg:gap-6" data-testid="header-top">
        {/* Cột 1: Mobile Hamburger & Logo Đại Việt AI bên trái */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <MobileNavbar
            parentCategories={parentCategories}
            categories={categories}
          />
          <LocalizedClientLink href="/" className="flex items-center" data-testid="header-logo-link">
            <Image
              src="/Logo.svg"
              width={160}
              height={36}
              alt="Đại Việt AI Logo"
              priority
              className="h-8 sm:h-9 w-auto object-contain flex-shrink-0"
            />
          </LocalizedClientLink>
        </div>

        {/* Cột 2: Thanh Tìm kiếm Kéo dài ở trung tâm (Full-width Search Bar) */}
        <div className="flex-1 max-w-2xl mx-2 lg:mx-6 hidden sm:flex">
          <NavbarSearch className="w-full" />
        </div>

        {/* Cột 3: Tiện ích bên phải (Quốc gia, Tin nhắn, Tài khoản, Giỏ hàng) */}
        <div className="flex items-center justify-end gap-2 lg:gap-4 flex-shrink-0" data-testid="header-actions">
          <CountrySelector regions={regions} />
          {isLoggedIn && <MessageButton />}
          <UserDropdown isLoggedIn={isLoggedIn} />
          <CartDropdown />
        </div>
      </div>

      {/* Thanh Search trên Mobile (< 640px) */}
      <div className="sm:hidden px-4 pb-3">
        <NavbarSearch className="w-full" />
      </div>

      {/* Tầng 2: Thanh Navbar hiển thị trọn vẹn Danh mục AI */}
      <Navbar categories={categories} parentCategories={parentCategories} />
    </header>
  )
}
