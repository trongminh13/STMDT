import { ProductListingSkeleton } from "@/components/organisms/ProductListingSkeleton/ProductListingSkeleton"
import { getCategoryByHandle, collectCategorySubtreeIds, LEGACY_CATEGORY_HANDLES } from "@/lib/data/categories"
import { Suspense } from "react"

import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/atoms"
import { SearchProductsListing, ProductListing } from "@/components/sections"
import { notFound, redirect } from "next/navigation"
import isBot from "@/lib/helpers/isBot"
import { headers } from "next/headers"
import Script from "next/script"
import { listRegions } from "@/lib/data/regions"
import { listProducts } from "@/lib/data/products"
import {
  buildHreflangAlternates,
  getStorefrontLocales,
} from "@/lib/helpers/hreflang"

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; locale: string }>
}): Promise<Metadata> {
  const { category: categoryHandle, locale } = await params
  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`

  const cat = await getCategoryByHandle(categoryHandle)
  if (!cat) {
    return {}
  }

  let locales: string[] = []
  try {
    locales = getStorefrontLocales(await listRegions())
  } catch {
    locales = [locale]
  }

  const { canonical, languages } = buildHreflangAlternates({
    baseUrl,
    path: `/categories/${categoryHandle}`,
    locale,
    locales,
  })

  const title = `${cat.name} Category`
  const description = `${cat.name} Category - ${
    process.env.NEXT_PUBLIC_SITE_NAME || "Storefront"
  }`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${title} | ${process.env.NEXT_PUBLIC_SITE_NAME || "Storefront"}`,
      description,
      url: canonical,
      siteName: process.env.NEXT_PUBLIC_SITE_NAME || "Storefront",
      type: "website",
    },
  }
}

async function Category({
  params,
}: {
  params: Promise<{
    category: string
    locale: string
  }>
}) {
  const { category: categoryHandle, locale } = await params

  if (LEGACY_CATEGORY_HANDLES.has(categoryHandle.toLowerCase())) {
    redirect(`/${locale}/categories`)
  }

  const category = await getCategoryByHandle(categoryHandle)

  if (!category) {
    return notFound()
  }

  // Include the whole category subtree so a parent department page lists every
  // product in its sub-categories, not just products attached to the parent.
  const categoryIds = collectCategorySubtreeIds(category)
  const ua = (await headers()).get("user-agent") || ""
  const bot = isBot(ua)

  const breadcrumbsItems = [
    {
      path: "/categories",
      label: "Tất cả sản phẩm",
    },
  ]

  if (category.parent_category) {
    breadcrumbsItems.push({
      path: `/categories/${category.parent_category.handle}`,
      label: category.parent_category.name,
    })
  }

  breadcrumbsItems.push({
    path: `/categories/${categoryHandle}`,
    label: category.name,
  })

  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`
  const {
    response: { products: jsonLdProducts },
  } = await listProducts({
    countryCode: locale,
    queryParams: { limit: 8, order: "-created_at", fields: "id,title,handle" },
    category_id: categoryIds,
  })

  const itemList = jsonLdProducts.slice(0, 8).map((p, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    url: `${baseUrl}/${locale}/products/${p.handle}`,
    name: p.title,
  }))

  const breadcrumbListElements = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Tất cả sản phẩm",
      item: `${baseUrl}/${locale}/categories`,
    },
  ]

  if (category.parent_category) {
    breadcrumbListElements.push({
      "@type": "ListItem",
      position: 2,
      name: category.parent_category.name,
      item: `${baseUrl}/${locale}/categories/${category.parent_category.handle}`,
    })
  }

  breadcrumbListElements.push({
    "@type": "ListItem",
    position: breadcrumbListElements.length + 1,
    name: category.name,
    item: `${baseUrl}/${locale}/categories/${categoryHandle}`,
  })

  return (
    <main className="container">
      <Script
        id="ld-breadcrumbs-category"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbListElements,
          }),
        }}
      />
      <Script
        id="ld-itemlist-category"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: itemList,
          }),
        }}
      />
      <div className="hidden md:block mb-2">
        <Breadcrumbs items={breadcrumbsItems} />
      </div>

      <h1 className="heading-xl uppercase">{category.name}</h1>

      <Suspense fallback={<div data-testid="category-page-loading"><ProductListingSkeleton /></div>}>
        {bot ? (
          <ProductListing category_id={categoryIds} showSidebar locale={locale} />
        ) : (
          <SearchProductsListing category_id={categoryIds} locale={locale} />
        )}
      </Suspense>
    </main>
  )
}

export default Category
