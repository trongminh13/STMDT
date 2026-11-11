'use client'

import { type ReactNode, useRef } from 'react'
import { cn } from '@/lib/utils'

interface CategoryDropdownContainerProps {
  children: ReactNode
  isVisible: boolean
  align?: 'left' | 'right'
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export const CategoryDropdownContainer = ({
  children,
  isVisible,
  align = 'left',
  onMouseEnter,
  onMouseLeave,
}: CategoryDropdownContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute top-full mt-1 z-50 w-72 sm:w-80 min-w-[280px] before:absolute before:-top-1.5 before:left-0 before:right-0 before:h-1.5 before:content-[\'\']',
        align === 'right' ? 'right-0 left-auto' : 'left-0 right-auto',
        // Góc vuông 100% không bo góc (Square / Brutalist)
        'rounded-none border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181b] p-1.5 shadow-xl shadow-neutral-900/10 dark:shadow-black/60 transition-all duration-150 ease-out text-left normal-case',
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-1 pointer-events-none'
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  )
}
