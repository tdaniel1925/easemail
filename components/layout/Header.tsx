"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Star,
  Bell,
  CheckSquare,
  Settings,
  User as UserIcon,
  LogOut,
  Menu,
  ChevronDown,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

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

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        {/* Mobile menu button - ONLY shows on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Emails Title - Shows on desktop */}
        <h1 className="text-xl font-bold flex-shrink-0 hidden lg:block">Emails</h1>

        {/* Search */}
        <div className="flex-1 max-w-md min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search here..."
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1 hidden lg:block"></div>

        {/* Right side icons - all in a row */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Bell Icon with badge */}
          <Button variant="ghost" size="icon" className="h-9 w-9 relative hidden lg:flex">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center px-1 text-[10px] bg-pink-500 border-0">
              38
            </Badge>
          </Button>

          {/* Star Icon with badge */}
          <Button variant="ghost" size="icon" className="h-9 w-9 relative hidden lg:flex">
            <Star className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center px-1 text-[10px] bg-purple-500 border-0">
              12
            </Badge>
          </Button>

          {/* CheckSquare Icon with badge */}
          <Button variant="ghost" size="icon" className="h-9 w-9 relative hidden lg:flex">
            <CheckSquare className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center px-1 text-[10px] bg-green-500 border-0">
              67
            </Badge>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="h-9 w-9 hidden lg:flex">
            <Settings className="h-5 w-5" />
          </Button>

          {/* User profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 gap-2 px-2 hidden lg:flex flex-shrink-0">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-gray-400 text-white">
                    {profile?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left min-w-0">
                  <p className="text-sm font-medium leading-none truncate">{profile?.username || "Zeke Yeaga"}</p>
                  <p className="text-xs text-muted-foreground capitalize truncate">{profile?.role || "Superadmin"}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">@{profile?.username || "user"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Language selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1 hidden lg:flex flex-shrink-0">
                <span className="text-sm font-medium">EN</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>Spanish</DropdownMenuItem>
              <DropdownMenuItem>French</DropdownMenuItem>
              <DropdownMenuItem>German</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

