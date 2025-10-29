"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ComposeEmailModal } from "@/components/email/ComposeEmailModal"
import { 
  Home, 
  Mail, 
  Users, 
  Calendar, 
  MessageSquare,
  PenSquare,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  onCollapseChange?: (collapsed: boolean) => void
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Email", href: "/dashboard/emails", icon: Mail, badge: "38" },
  { name: "Contacts", href: "/dashboard/contacts", icon: Users },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
]

export function Sidebar({ isOpen = true, onClose, onCollapseChange }: SidebarProps) {
  const pathname = usePathname()
  const [composeOpen, setComposeOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Auto-collapse on non-dashboard pages
  useEffect(() => {
    const shouldCollapse = pathname !== "/dashboard"
    setIsCollapsed(shouldCollapse)
    onCollapseChange?.(shouldCollapse)
  }, [pathname, onCollapseChange])

  // Handle manual toggle
  const handleToggle = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    onCollapseChange?.(newState)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-background border-r flex flex-col transition-all duration-300 lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo and close button */}
        <div className={cn(
          "flex items-center border-b transition-all duration-300",
          isCollapsed ? "justify-center p-4" : "justify-between p-6"
        )}>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-category-social flex items-center justify-center flex-shrink-0">
              <Mail className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <span className="font-bold text-lg">Fitmail</span>
                <p className="text-xs text-muted-foreground">Email Admin Dashboard</p>
              </div>
            )}
          </Link>
          {onClose && !isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute -right-3 top-20 z-50 h-6 w-6 rounded-full border bg-background shadow-sm hidden lg:flex",
            isCollapsed && "rotate-180"
          )}
          onClick={handleToggle}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Compose button */}
        <div className="p-4">
          <Button 
            className={cn(
              "transition-all duration-300",
              isCollapsed ? "w-full px-0" : "w-full"
            )} 
            size="lg"
            onClick={() => setComposeOpen(true)}
            title={isCollapsed ? "Compose Email" : undefined}
          >
            <PenSquare className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
            {!isCollapsed && "Compose Email"}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {!isCollapsed && (
            <p className="text-xs font-semibold text-muted-foreground mb-2 px-3">
              Main Menu
            </p>
          )}
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span className="flex-1">{item.name}</span>}
                {!isCollapsed && item.badge && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                    {item.badge}
                  </span>
                )}
                {isCollapsed && item.badge && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Broadcasting card */}
        {!isCollapsed && (
          <div className="p-4">
            <div className="bg-gradient-to-br from-primary/10 to-category-social/10 rounded-lg p-4 space-y-3">
              <div className="h-16 w-16 mx-auto">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-category-social/20 rounded-full" />
                  <span className="text-3xl">📧</span>
                </div>
              </div>
              <h3 className="font-semibold text-center text-sm">
                Fitmail Broadcasting
              </h3>
              <p className="text-xs text-center text-muted-foreground">
                Send email automatically to all of your contacts
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Try Free Now
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t text-center text-xs text-muted-foreground">
            <p>Fitmail Admin Dashboard</p>
            <p>© 2024 All Rights Reserved</p>
            <p className="mt-1">Made with ❤️ by Peterdraw</p>
          </div>
        )}
      </aside>

      {/* Compose Email Modal */}
      <ComposeEmailModal open={composeOpen} onOpenChange={setComposeOpen} />
    </>
  )
}

