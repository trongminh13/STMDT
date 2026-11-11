"use client"

import { Input } from "@/components/atoms"
import { SearchIcon } from "@/icons"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import clsx from "clsx"

interface Props {
  className?: string
}

export const NavbarSearch = ({ className }: Props) => {
  const searchParams = useSearchParams()
  const params = useParams()
  const router = useRouter()
  const locale =
    (params?.locale as string) ||
    process.env.NEXT_PUBLIC_DEFAULT_REGION ||
    "vn"

  const [search, setSearch] = useState(searchParams.get("query") || "")

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
