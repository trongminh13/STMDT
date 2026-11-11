'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

export const useCategoryDropdown = () => {
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null)
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const [shouldRenderDropdown, setShouldRenderDropdown] = useState(false)

  const closeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const cleanupTimerRef = useRef<NodeJS.Timeout | null>(null)

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    if (cleanupTimerRef.current) {
      clearTimeout(cleanupTimerRef.current)
      cleanupTimerRef.current = null
    }
  }, [])

  const openDropdown = useCallback(
    (categoryId: string) => {
      cancelClose()
      setHoveredCategoryId(categoryId)
      setShouldRenderDropdown(true)
      // Small tick for CSS transition
      const timer = setTimeout(() => {
        setIsDropdownVisible(true)
      }, 20)
      return () => clearTimeout(timer)
    },
    [cancelClose]
  )

  const closeDropdown = useCallback(() => {
    cancelClose()
    setIsDropdownVisible(false)
    cleanupTimerRef.current = setTimeout(() => {
      setShouldRenderDropdown(false)
      setHoveredCategoryId(null)
    }, 200)
  }, [cancelClose])

  const scheduleClose = useCallback(
    (delay = 180) => {
      cancelClose()
      closeTimerRef.current = setTimeout(() => {
        setIsDropdownVisible(false)
        cleanupTimerRef.current = setTimeout(() => {
          setShouldRenderDropdown(false)
          setHoveredCategoryId(null)
        }, 200)
      }, delay)
    },
    [cancelClose]
  )

  // Close dropdown on scroll to avoid detached floating menus
  useEffect(() => {
    if (!shouldRenderDropdown) return

    const handlePageScroll = () => {
      closeDropdown()
    }

    window.addEventListener('scroll', handlePageScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handlePageScroll)
    }
  }, [shouldRenderDropdown, closeDropdown])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelClose()
    }
  }, [cancelClose])

  return {
    hoveredCategoryId,
    isDropdownVisible,
    shouldRenderDropdown,
    openDropdown,
    closeDropdown,
    scheduleClose,
    cancelClose,
    setHoveredCategoryId,
  }
}
