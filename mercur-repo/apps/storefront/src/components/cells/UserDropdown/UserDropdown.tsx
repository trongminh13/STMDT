"use client"

import { Badge } from '@/components/atoms/Badge/Badge';
import { Divider } from '@/components/atoms/Divider/Divider';
import { LogoutButton } from '@/components/atoms/LogoutButton/LogoutButton';
import { NavigationItem } from '@/components/atoms/NavigationItem/NavigationItem';
import { Dropdown } from '@/components/molecules/Dropdown/Dropdown';
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { ProfileIcon } from "@/icons"
import { HttpTypes } from "@medusajs/types"
import { useUnreads } from "@talkjs/react"
import { useState } from "react"

export const UserDropdown = ({
  isLoggedIn,
}: {
  isLoggedIn: boolean
}) => {
  const [open, setOpen] = useState(false)

  const unreads = useUnreads()

  return (
    <div
      className="relative"
      onMouseOver={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
    >
      <LocalizedClientLink
        href={isLoggedIn ? "/user" : "/login"}
        className="relative"
        aria-label="Go to user profile"
      >
        <ProfileIcon size={20} />
      </LocalizedClientLink>
      <Dropdown show={open}>
        {isLoggedIn ? (
          <div className="p-1">
            <div className="lg:w-[200px]">
              <h3 className="uppercase heading-xs border-b p-4">
                Tài khoản của bạn
              </h3>
            </div>
            <NavigationItem href="/user/orders">Đơn hàng của bạn</NavigationItem>
            <NavigationItem href="/user/addresses">Sổ địa chỉ</NavigationItem>
            <Divider />
            <NavigationItem href="/user/settings">Cài đặt</NavigationItem>
            <LogoutButton />
          </div>
        ) : (
          <div className="p-1">
            <NavigationItem href="/login">Đăng nhập</NavigationItem>
            <NavigationItem href="/register">Đăng ký</NavigationItem>
          </div>
        )}
      </Dropdown>
    </div>
  )
}
