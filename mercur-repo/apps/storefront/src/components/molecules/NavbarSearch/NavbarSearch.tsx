"use client"

import { Input } from '@/components/atoms/Input/Input';
import { SearchIcon } from "@/icons"
import { useLocale } from "@/components/providers/Locale/LocaleProvider"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import clsx from "clsx"

interface Props {
  className?: string
}

export const NavbarSearch = ({ className }: Props) => (
  <Suspense fallback={<NavbarSearchForm className={className} initialQuery="" />}>
    <NavbarSearchWithQuery className={className} />
  </Suspense>
)

const NavbarSearchWithQuery = ({ className }: Props) => {
  const searchParams = useSearchParams()
  return <NavbarSearchForm className={className} initialQuery={searchParams.get("query") || ""} />
}

const NavbarSearchForm = ({ className, initialQuery }: Props & { initialQuery: string }) => {
  const [search, setSearch] = useState(initialQuery)
  const router = useRouter()
  const locale = useLocale() || process.env.NEXT_PUBLIC_DEFAULT_REGION || "vn"

  const handleSearch = () => {
    const trimmed = search.trim()
    if (trimmed) {
      router.push(`/${locale}/categories?query=${encodeURIComponent(trimmed)}`)
    } else {
      router.push(`/${locale}/categories`)
    }
  }

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSearch()
  }

  return (
    <form className={clsx("w-full", className)} method="POST" onSubmit={submitHandler}>
      <Input
        icon={<SearchIcon />}
        onIconClick={handleSearch}
        iconAriaLabel="Search"
        placeholder="Tìm kiếm giải pháp AI, workflows, mã nguồn..."
        value={search}
        changeValue={setSearch}
        type="search"
      />
      <input type="submit" className="hidden" />
    </form>
  )
}
