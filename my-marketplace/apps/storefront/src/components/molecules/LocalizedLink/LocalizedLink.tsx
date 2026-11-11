"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import React, { MouseEventHandler } from "react"

/**
 * Use this component to create a Next.js `<LocalizedClientLink />` that persists the current country code in the url,
 * without having to explicitly pass it as a prop.
 */
const LocalizedClientLink = ({
  children,
  href,
  ...props
}: {
  children?: React.ReactNode
  href: string
  className?: string
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined
  passHref?: true
  [x: string]: any
}) => {
  const params = useParams()
  const pathname = usePathname()
  
  const defaultRegion = process.env.NEXT_PUBLIC_DEFAULT_REGION || "vn"
  const currentLocale =
    (params?.locale as string) ||
    (pathname ? pathname.split("/")[1] : "") ||
    defaultRegion

  let targetPath = href || "/"

  // If targetPath already has the current locale prefix, do not duplicate
  if (targetPath.startsWith(`/${currentLocale}/`) || targetPath === `/${currentLocale}`) {
    return (
      <Link href={targetPath} {...props}>
        {children}
      </Link>
    )
  }

  // Ensure targetPath starts with '/'
  if (!targetPath.startsWith("/")) {
    targetPath = `/${targetPath}`
  }

  return (
    <Link href={`/${currentLocale}${targetPath}`} {...props}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink
