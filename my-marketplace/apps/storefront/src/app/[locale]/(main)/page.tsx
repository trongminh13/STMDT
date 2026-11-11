import {
  BannerSection,
  BlogSection,
  Hero,
  HomeCategories,
  HomeProductSection,
  ShopByStyleSection,
} from "@/components/sections"

import type { Metadata } from "next"
import { headers } from "next/headers"
import Script from "next/script"
import { listRegions } from "@/lib/data/regions"
import {
  buildHreflangAlternates,
  getStorefrontLocales,
  toHreflang,
} from "@/lib/helpers/hreflang"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`

  let locales: string[] = []
  try {
    locales = getStorefrontLocales(await listRegions())
  } catch {
    locales = [locale]
  }

  const { canonical, languages } = buildHreflangAlternates({
    baseUrl,
    path: "",
    locale,
    locales,
  })

  const title = "Đại Việt AI — Sàn Thương Mại Điện Tử Hàng Số & AI"
  const description =
    "Sàn thương mại điện tử chuyên biệt cho Workflow tự động hóa, Mã nguồn SaaS, Tiện ích số và Dịch vụ triển khai AI thực chiến hàng đầu Việt Nam."
  const ogImage = "/images/hero-banner-tech.svg"

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: `${title} | ${
        process.env.NEXT_PUBLIC_SITE_NAME ||
        "Đại Việt AI — Sàn Thương Mại Điện Tử Hàng Số & AI"
      }`,
      description,
      url: canonical,
      siteName:
        process.env.NEXT_PUBLIC_SITE_NAME ||
        "Đại Việt AI — Sàn Thương Mại Điện Tử Hàng Số & AI",
      type: "website",
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt:
            process.env.NEXT_PUBLIC_SITE_NAME ||
            "Đại Việt AI — Sàn Thương Mại Điện Tử Hàng Số & AI",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`],
    },
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`

  const siteName =
    process.env.NEXT_PUBLIC_SITE_NAME ||
    "Đại Việt AI — Sàn Thương Mại Điện Tử Hàng Số & AI"

  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-primary">
      <link
        rel="preload"
        as="image"
        href="/images/hero-banner-tech.svg"
      />
      <Script
        id="ld-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteName,
            url: `${baseUrl}/${locale}`,
            logo: `${baseUrl}/favicon.ico`,
          }),
        }}
      />
      <Script
        id="ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteName,
            url: `${baseUrl}/${locale}`,
            inLanguage: toHreflang(locale),
          }),
        }}
      />

      {/* 1. Hero Section */}
      <Hero
        image="/images/hero-banner-tech.svg"
        heading="Đại Việt AI — Sàn Thương Mại Điện Tử Hàng Số & AI"
        paragraph="Khám phá và sở hữu ngay các gói Workflow n8n, Mã nguồn Next.js SaaS, Tiện ích AI và Dịch vụ cài đặt 1-1 thực chiến hàng đầu."
        buttons={[
          { label: "Khám phá giải pháp", path: "/categories" },
          {
            label: "Mở gian hàng Creator",
            path:
              process.env.NEXT_PUBLIC_VENDOR_URL ||
              "http://localhost:7001",
          },
        ]}
      />

      {/* 2. Featured Solutions (Trending Products) */}
      <div className="px-4 lg:px-8 w-full">
        <HomeProductSection heading="SẢN PHẨM & GIẢI PHÁP NỔI BẬT" locale={locale} home />
      </div>

      {/* 3. Core Categories */}
      <div className="px-4 lg:px-8 w-full">
        <HomeCategories heading="DANH MỤC GIẢI PHÁP AI" />
      </div>

      {/* 4. Enterprise Feature Banner */}
      <BannerSection />

      {/* 5. Solutions by Business Goal */}
      <ShopByStyleSection />

      {/* 6. Knowledge Hub */}
      <BlogSection />
    </main>
  )
}
