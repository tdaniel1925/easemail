"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { MobileNav } from "@/components/layout/MobileNav"
import { NotificationContainer } from "@/components/ui/notification-container"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const pathname = usePathname()

  // Sync with sidebar collapse state
  useEffect(() => {
    if (pathname !== "/dashboard") {
      setIsSidebarCollapsed(true)
    } else {
      setIsSidebarCollapsed(false)
    }
  }, [pathname])

  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden overflow-y-hidden">
      {/* Notification container for inline alerts */}
      <NotificationContainer />

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onCollapseChange={setIsSidebarCollapsed}
      />

      {/* Main content area */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
        "lg:ml-64", // Default for expanded sidebar (256px)
        isSidebarCollapsed && "lg:ml-20" // Collapsed sidebar (80px)
      )}>
        {/* Header */}
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Page content */}
        <main className="flex-1 overflow-hidden min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav />
    </div>
  )
}
