"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface SidebarContextType {
  // Main sidebar (left)
  mainSidebarCollapsed: boolean
  setMainSidebarCollapsed: (collapsed: boolean) => void
  
  // Secondary sidebar (middle - for emails/contacts)
  secondarySidebarVisible: boolean
  setSecondarySidebarVisible: (visible: boolean) => void
  secondarySidebarWidth: number
  setSecondarySidebarWidth: (width: number) => void
  
  // Tertiary sidebar (right - resizable)
  tertiarySidebarCollapsed: boolean
  setTertiarySidebarCollapsed: (collapsed: boolean) => void
  tertiarySidebarWidth: number
  setTertiarySidebarWidth: (width: number) => void
  
  // Computed values
  getContentWidth: () => string
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

const STORAGE_KEYS = {
  MAIN_COLLAPSED: "sidebar-main-collapsed",
  SECONDARY_VISIBLE: "sidebar-secondary-visible",
  SECONDARY_WIDTH: "sidebar-secondary-width",
  TERTIARY_COLLAPSED: "sidebar-tertiary-collapsed",
  TERTIARY_WIDTH: "sidebar-tertiary-width",
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  // Load from localStorage with defaults
  const [mainSidebarCollapsed, setMainSidebarCollapsedState] = useState(false)
  const [secondarySidebarVisible, setSecondarySidebarVisibleState] = useState(true)
  const [secondarySidebarWidth, setSecondarySidebarWidthState] = useState(256)
  const [tertiarySidebarCollapsed, setTertiarySidebarCollapsedState] = useState(false)
  const [tertiarySidebarWidth, setTertiarySidebarWidthState] = useState(350)
  
  const [isInitialized, setIsInitialized] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mainCollapsed = localStorage.getItem(STORAGE_KEYS.MAIN_COLLAPSED)
      const secondaryVisible = localStorage.getItem(STORAGE_KEYS.SECONDARY_VISIBLE)
      const secondaryWidth = localStorage.getItem(STORAGE_KEYS.SECONDARY_WIDTH)
      const tertiaryCollapsed = localStorage.getItem(STORAGE_KEYS.TERTIARY_COLLAPSED)
      const tertiaryWidth = localStorage.getItem(STORAGE_KEYS.TERTIARY_WIDTH)

      if (mainCollapsed !== null) setMainSidebarCollapsedState(mainCollapsed === "true")
      if (secondaryVisible !== null) setSecondarySidebarVisibleState(secondaryVisible === "true")
      if (secondaryWidth !== null) setSecondarySidebarWidthState(parseInt(secondaryWidth))
      if (tertiaryCollapsed !== null) setTertiarySidebarCollapsedState(tertiaryCollapsed === "true")
      if (tertiaryWidth !== null) setTertiarySidebarWidthState(parseInt(tertiaryWidth))
      
      setIsInitialized(true)
    }
  }, [])

  // Wrapper functions that save to localStorage
  const setMainSidebarCollapsed = (collapsed: boolean) => {
    setMainSidebarCollapsedState(collapsed)
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEYS.MAIN_COLLAPSED, String(collapsed))
    }
  }

  const setSecondarySidebarVisible = (visible: boolean) => {
    setSecondarySidebarVisibleState(visible)
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEYS.SECONDARY_VISIBLE, String(visible))
    }
  }

  const setSecondarySidebarWidth = (width: number) => {
    setSecondarySidebarWidthState(width)
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEYS.SECONDARY_WIDTH, String(width))
    }
  }

  const setTertiarySidebarCollapsed = (collapsed: boolean) => {
    setTertiarySidebarCollapsedState(collapsed)
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEYS.TERTIARY_COLLAPSED, String(collapsed))
    }
  }

  const setTertiarySidebarWidth = (width: number) => {
    setTertiarySidebarWidthState(width)
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEYS.TERTIARY_WIDTH, String(width))
    }
  }

  const getContentWidth = () => {
    const mainWidth = mainSidebarCollapsed ? 80 : 256
    const secondaryWidth = secondarySidebarVisible ? secondarySidebarWidth : 0
    const tertiaryWidth = tertiarySidebarCollapsed ? 0 : tertiarySidebarWidth
    return `calc(100vw - ${mainWidth + secondaryWidth + tertiaryWidth}px)`
  }

  const value = {
    mainSidebarCollapsed,
    setMainSidebarCollapsed,
    secondarySidebarVisible,
    setSecondarySidebarVisible,
    secondarySidebarWidth,
    setSecondarySidebarWidth,
    tertiarySidebarCollapsed,
    setTertiarySidebarCollapsed,
    tertiarySidebarWidth,
    setTertiarySidebarWidth,
    getContentWidth,
  }

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebarContext() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebarContext must be used within a SidebarProvider")
  }
  return context
}

