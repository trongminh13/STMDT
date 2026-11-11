"use client"

import React, { useState } from "react"
import Image, { ImageProps } from "next/image"
import { cn } from "@/lib/utils"

export interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackClassName?: string
  fallbackCategory?: string
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className,
  fallbackClassName,
  fallbackCategory,
  unoptimized,
  ...rest
}) => {
  const [hasError, setHasError] = useState(false)

  // Tự động bật unoptimized nếu nguồn ảnh là tệp vector SVG để giữ độ nét và tránh lỗi rasterize
  const isSvg =
    typeof src === "string" &&
    (src.toLowerCase().includes(".svg") || src.startsWith("data:image/svg+xml"))
  const shouldUnoptimize = unoptimized ?? isSvg

  if (!src || hasError) {
    const titleText = String(alt || "Đại Việt AI").replace(/\s*image\s*$/i, "")
    const catUpper = (fallbackCategory || "").toUpperCase()

    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "w-full h-full aspect-square flex flex-col items-center justify-center p-4 relative overflow-hidden select-none",
          "bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#0A1128] text-white",
          "border border-white/10 rounded-xs transition-all duration-300",
          fallbackClassName || className
        )}
      >
        {/* Họa tiết nền công nghệ Tech Grid & Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-cyan-500/20 rounded-full blur-xl pointer-events-none" />

        {/* Biểu tượng đồ họa công nghệ số */}
        <div className="relative z-10 w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center shadow-inner mb-2.5">
          {catUpper.includes("WORKFLOW") || catUpper.includes("N8N") ? (
            <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ) : catUpper.includes("CODE") || catUpper.includes("BOILERPLATE") ? (
            <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          ) : catUpper.includes("TIỆN ÍCH") || catUpper.includes("EXTENSION") || catUpper.includes("TOOL") ? (
            <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          ) : catUpper.includes("DỊCH VỤ") || catUpper.includes("SERVICE") ? (
            <svg className="w-6 h-6 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )}
        </div>

        {/* Nhãn sản phẩm số chuẩn format Đại Việt AI */}
        <div className="relative z-10 text-center px-1">
          <span className="inline-block text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-1">
            DIGITAL ASSET
          </span>
          <p className="text-xs font-semibold text-slate-200 line-clamp-2 leading-tight max-w-[180px]">
            {titleText}
          </p>
        </div>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      unoptimized={shouldUnoptimize}
      onError={() => setHasError(true)}
      {...rest}
    />
  )
}
