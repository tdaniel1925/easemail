"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { MobileNav } from "@/components/layout/MobileNav"
import { NotificationContainer } from "@/components/ui/notification-container"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()
  
  // Only show header on sub-pages, not on main dashboard
  const showHeader = pathname !== "/dashboard"

  return (
    <div className="flex min-h-screen bg-background">
      {/* Notification container for inline alerts */}
      <NotificationContainer />

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header - Only show on sub-pages */}
        {showHeader && <Header onMenuClick={() => setIsSidebarOpen(true)} />}

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav />
    </div>
  )
}

