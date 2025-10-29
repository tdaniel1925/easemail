"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Mail, Users, Calendar, MessageSquare } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Email", href: "/dashboard/emails", icon: Mail },
  { name: "Contacts", href: "/dashboard/contacts", icon: Users },
  { name: "Events", href: "/dashboard/events", icon: Calendar },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background lg:hidden">
      <div className="flex items-center justify-around h-16">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[60px] h-full transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

