"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ComposeEmailModal } from "@/components/email/ComposeEmailModal"
import { EmailSidebar } from "@/components/email/EmailSidebar"
import { ResizableSidebar } from "@/components/ui/resizable-sidebar"
import {
  Mail,
  Send,
  FileText,
  Archive as ArchiveIcon,
  Star,
  Trash2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Info,
  Settings,
  MoreVertical,
  Check,
  Paperclip,
  Reply,
  Forward,
  Phone,
  Video,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data
const mockEmails = [
  {
    id: 1,
    sender: "kevinhard@gmail.com",
    subject: "Weekly Maintenance Service Information",
    preview: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ...",
    fullContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    time: "24 min ago",
    isStarred: false,
    isRead: true,
    avatar: "",
    category: "important",
    hasAttachment: false,
  },
  {
    id: 2,
    sender: "alientstudios@gmail.com",
    subject: "Follow Up Progress from Ticket #000124241251",
    preview: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostru",
    fullContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    time: "24 min ago",
    isStarred: false,
    isRead: false,
    avatar: "A",
    avatarColor: "bg-blue-500",
    category: "important",
    hasAttachment: true,
  },
  {
    id: 3,
    sender: "joannahistep@gmail.com",
    subject: "Dont forget to save your work after 10 min",
    preview: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ...",
    fullContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    time: "Yesterday, at 11:24 AM",
    isStarred: false,
    isRead: true,
    avatar: "",
    category: "important",
    hasAttachment: true,
  },
  {
    id: 4,
    sender: "hanzelqueen@gmail.com",
    subject: "Paymen Received from AB Bank",
    preview: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ...",
    fullContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    time: "October 25th, 2020 08:55 AM",
    isStarred: true,
    isRead: true,
    avatar: "H",
    avatarColor: "bg-green-500",
    category: "important",
    hasAttachment: false,
  },
  {
    id: 5,
    sender: "kevinhard@gmail.com",
    subject: "How to manage your working time in this pandemic",
    preview: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ...",
    fullContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    time: "24 min ago",
    isStarred: true,
    isRead: true,
    avatar: "",
    category: "important",
    hasAttachment: true,
  },
  {
    id: 6,
    sender: "machelgreen@gmail.com",
    subject: "Important Document from Government",
    preview: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ...",
    fullContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    time: "October 25th, 2020 08:55 AM",
    isStarred: true,
    isRead: true,
    avatar: "",
    category: "important",
    hasAttachment: false,
  },
]

const mockContacts = [
  { name: "Erin Herwitz", email: "erinherwitz@mail.com", phone: "+1 234 567 8900", status: "online" },
  { name: "Craig Curtis", email: "craigcurtis@mail.com", phone: "+1 234 567 8901", status: "offline" },
  { name: "Kierra Culhane", email: "kierraculhane@mail.com", phone: "+1 234 567 8902", status: "online" },
]

export default function EmailsPage() {
  const [composeOpen, setComposeOpen] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState("inbox")
  const [selectedTab, setSelectedTab] = useState("important")
  const [selectedEmails, setSelectedEmails] = useState<number[]>([])
  const [expandedEmail, setExpandedEmail] = useState<number | null>(null)
  const [expandedContact, setExpandedContact] = useState<string | null>(null)
  const [starredEmails, setStarredEmails] = useState<number[]>([4, 5, 6])
  const [currentPage, setCurrentPage] = useState(1)
  const [middleSidebarCollapsed, setMiddleSidebarCollapsed] = useState(false)
  const totalPages = 4

  const folders = [
    { id: "inbox", name: "Inbox", icon: Mail, color: "text-primary" },
    { id: "sent", name: "Sent", icon: Send, color: "text-muted-foreground" },
    { id: "draft", name: "Draft", icon: FileText, color: "text-muted-foreground" },
    { id: "archived", name: "Archived", icon: ArchiveIcon, color: "text-muted-foreground" },
    { id: "favourites", name: "Favourites", icon: Star, color: "text-muted-foreground" },
    { id: "spam", name: "Spam", icon: Trash2, color: "text-muted-foreground" },
  ]

  const tags = [
    { id: "projectmanagement", name: "#projectmanagement", color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
    { id: "teamwork", name: "#teamwork", color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" },
    { id: "design", name: "#design", color: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300" },
    { id: "weeklymeetings", name: "#weeklymeetings", color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" },
  ]

  const toggleEmailSelection = (id: number) => {
    setSelectedEmails(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedEmails.length === mockEmails.length) {
      setSelectedEmails([])
    } else {
      setSelectedEmails(mockEmails.map(e => e.id))
    }
  }

  const toggleStar = (id: number) => {
    setStarredEmails(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  const toggleExpandEmail = (id: number) => {
    setExpandedEmail(expandedEmail === id ? null : id)
  }

  const toggleExpandContact = (name: string) => {
    setExpandedContact(expandedContact === name ? null : name)
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Middle Sidebar - Folders & Contacts */}
      <aside className={cn(
        "border-r bg-background flex flex-col flex-shrink-0 overflow-hidden transition-all duration-300",
        middleSidebarCollapsed ? "w-0 border-0" : "w-64"
      )}>
        {/* Collapse Button */}
        {!middleSidebarCollapsed && (
          <div className="absolute right-2 top-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setMiddleSidebarCollapsed(true)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Compose Button */}
        <div className="p-4 border-b flex-shrink-0 h-[73px] flex items-center">
          <Button 
            className="w-full gap-2" 
            size="lg"
            onClick={() => setComposeOpen(true)}
          >
            <Mail className="h-4 w-4" />
            + Compose Email
          </Button>
        </div>

        {/* Folders */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-muted-foreground">FOLDERS</h3>
              <ChevronRight className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    selectedFolder === folder.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent"
                  )}
                >
                  <folder.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1 text-left truncate">{folder.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Connections */}
          <div className="p-4 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">RECENT CONNECTIONS</h3>
            <div className="space-y-2">
              {mockContacts.map((contact) => (
                <div key={contact.name} className="space-y-2">
                  <button
                    onClick={() => toggleExpandContact(contact.name)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-sm">
                          {contact.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium truncate">{contact.name}</p>
                    </div>
                    {expandedContact === contact.name ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>

                  {/* Contact Dropdown */}
                  {expandedContact === contact.name && (
                    <div className="ml-4 p-3 bg-muted rounded-lg space-y-2">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm truncate">{contact.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm">{contact.phone}</p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1 gap-1">
                          <Mail className="h-3 w-3" />
                          Email
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="p-4 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">TAGS</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  className={cn("cursor-pointer text-xs", tag.color)}
                  variant="secondary"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content - Email List */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header with Tabs */}
        <div className="border-b flex-shrink-0 h-[73px]">
          <div className="flex items-center justify-between px-6 h-full">
            <div className="flex items-center gap-6 min-w-0">
              {/* Show folders button when sidebar is collapsed */}
              {middleSidebarCollapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMiddleSidebarCollapsed(false)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}

              <button
                onClick={toggleSelectAll}
                className="h-5 w-5 rounded border-2 flex items-center justify-center hover:border-primary transition-colors flex-shrink-0"
              >
                {selectedEmails.length === mockEmails.length && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>

              <div className="flex gap-6 overflow-x-auto">
                {["Important", "Socials", "Promotion"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab.toLowerCase())}
                    className={cn(
                      "pb-4 px-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                      selectedTab === tab.toLowerCase()
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="ghost" size="icon">
                <ArchiveIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Info className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="divide-y">
            {mockEmails.map((email) => (
              <div key={email.id} className="bg-background hover:bg-accent/50 transition-colors">
                {/* Email Card */}
                <div className="flex items-start gap-4 p-4">
                  <button
                    onClick={() => toggleEmailSelection(email.id)}
                    className="h-5 w-5 rounded border-2 flex items-center justify-center hover:border-primary transition-colors mt-1 flex-shrink-0"
                  >
                    {selectedEmails.includes(email.id) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>

                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarFallback className={cn("text-sm", email.avatarColor)}>
                      {email.avatar || email.sender[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div 
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => toggleExpandEmail(email.id)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium truncate">{email.sender}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">• {email.time}</span>
                    </div>
                    <p className={cn(
                      "font-semibold mb-1 truncate",
                      !email.isRead && "text-primary"
                    )}>
                      {email.subject}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {email.preview}
                    </p>

                    {/* Expanded Content */}
                    {expandedEmail === email.id && (
                      <div className="mt-4 pt-4 border-t space-y-4">
                        <p className="text-sm leading-relaxed">{email.fullContent}</p>
                        
                        {email.hasAttachment && (
                          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg w-fit">
                            <Paperclip className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">attachment.pdf</span>
                            <span className="text-xs text-muted-foreground">(2.4 MB)</span>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button size="sm" className="gap-2">
                            <Reply className="h-3 w-3" />
                            Reply
                          </Button>
                          <Button size="sm" variant="outline" className="gap-2">
                            <Forward className="h-3 w-3" />
                            Forward
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {email.hasAttachment && (
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleStar(email.id)
                      }}
                      className="p-1 hover:bg-accent rounded transition-colors"
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          starredEmails.includes(email.id)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        )}
                      />
                    </button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="border-t px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing 1-10 from 46 data
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
              </Button>
              {[1, 2, 3, 4].map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <ResizableSidebar defaultWidth={320} minWidth={280} maxWidth={450}>
        <EmailSidebar
          selectedEmail={expandedEmail ? mockEmails.find(e => e.id === expandedEmail) : undefined}
          onEmailAction={(action) => {
            console.log("Email action:", action)
            // Handle email actions like reply, forward, star, etc.
          }}
        />
      </ResizableSidebar>

      {/* Compose Email Modal */}
      <ComposeEmailModal open={composeOpen} onOpenChange={setComposeOpen} />
    </div>
  )
}

