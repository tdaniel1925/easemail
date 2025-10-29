"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, GripVertical, Settings, ChevronDown, User as UserIcon, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ResizableSidebarProps {
  children: React.ReactNode
  defaultWidth?: number
  minWidth?: number
  maxWidth?: number
  className?: string
}

export function ResizableSidebar({
  children,
  defaultWidth = 320,
  minWidth = 280,
  maxWidth = 600,
  className,
}: ResizableSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false) // Start expanded by default
  const [width, setWidth] = useState(defaultWidth)
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  
  // Dynamically calculate max width based on viewport
  const [dynamicMaxWidth, setDynamicMaxWidth] = useState(maxWidth)

  // Get user profile
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(profile)
      }
    }

    getUser()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Adjust max width based on viewport size
  useEffect(() => {
    const updateMaxWidth = () => {
      // Reserve space: left sidebar (256px), middle sidebar (256px if email page), some margin
      // Calculate available space: viewport - sidebars - margin
      const viewportWidth = window.innerWidth
      const reservedSpace = viewportWidth < 1024 ? 0 : 600 // Reserve space for other sidebars
      const calculatedMax = Math.min(maxWidth, Math.max(minWidth, viewportWidth - reservedSpace))
      setDynamicMaxWidth(calculatedMax)
      
      // If current width exceeds new max, resize down
      if (width > calculatedMax) {
        setWidth(calculatedMax)
      }
    }

    updateMaxWidth()
    window.addEventListener('resize', updateMaxWidth)
    return () => window.removeEventListener('resize', updateMaxWidth)
  }, [maxWidth, minWidth, width])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return

      const newWidth = window.innerWidth - e.clientX
      if (newWidth >= minWidth && newWidth <= dynamicMaxWidth) {
        setWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isResizing, minWidth, maxWidth])

  return (
    <>
      {/* Collapse/Expand Tab - Arrow tab attached to sidebar edge */}
      <div
        className={cn(
          "fixed top-1/2 -translate-y-1/2 z-50 transition-all duration-300 hidden lg:block",
          isCollapsed ? "right-0" : undefined
        )}
        style={!isCollapsed ? { right: `${width}px` } : undefined}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center w-6 h-16 bg-background border border-r-0 rounded-l-md hover:bg-accent transition-colors shadow-sm"
        >
          {isCollapsed ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div
        ref={sidebarRef}
        className={cn(
          "hidden lg:flex flex-col border-l bg-background relative flex-shrink-0",
          isCollapsed && "w-0 border-0 overflow-hidden",
          className
        )}
        style={{ 
          width: isCollapsed ? 0 : width,
          transition: 'width 300ms ease-in-out',
          willChange: 'width'
        }}
      >
        {/* Resize Handle */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1 hover:w-2 cursor-col-resize bg-transparent hover:bg-primary/20 transition-all group z-10",
            isCollapsed && "hidden"
          )}
          onMouseDown={() => setIsResizing(true)}
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-hidden min-w-0">
          {children}
        </div>
      </div>

      {/* Mobile Sidebar - Bottom Sheet */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-50">
        {/* TODO: Add mobile bottom sheet implementation */}
      </div>
    </>
  )
}

