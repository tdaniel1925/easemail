"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Mail,
  User,
  Bot,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageSquare,
  MapPin,
  Globe,
  Calendar as CalendarIcon,
  Clock,
  Star,
  Paperclip,
  Reply,
  Forward,
} from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"

interface EmailSidebarProps {
  selectedEmail?: any
  onEmailAction?: (action: string) => void
}

export function EmailSidebar({ selectedEmail, onEmailAction }: EmailSidebarProps) {
  const [activeTab, setActiveTab] = useState<"email" | "contact" | "ai">("email")
  const [miniCalendarDate, setMiniCalendarDate] = useState(new Date())

  const tabs = [
    { id: "email" as const, label: "Email", icon: Mail },
    { id: "contact" as const, label: "Contact", icon: User },
    { id: "ai" as const, label: "AI", icon: Bot, badge: "Soon" },
  ]

  // Mini calendar logic
  const monthStart = startOfMonth(miniCalendarDate)
  const monthEnd = endOfMonth(miniCalendarDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDayOfWeek = monthStart.getDay()

  // Mock contact data from selected email
  const activeContact = selectedEmail ? {
    name: selectedEmail.sender.split("@")[0],
    email: selectedEmail.sender,
    phone: "+1 234 567 8900",
    company: "Highspeed Studios",
    jobTitle: "Marketing Manager",
    address: "123 Main St, New York, NY 10001",
    website: "https://company.com",
    tags: ["client"],
    notes: "Regular correspondent",
    recentInteractions: [
      { type: "email", subject: "Previous conversation", date: "2 days ago" },
      { type: "meeting", subject: "Q4 Planning", date: "1 week ago" },
    ],
  } : null

  return (
    <div className="w-full h-full bg-background flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="border-b flex-shrink-0 h-[73px]">
        <div className="grid grid-cols-3 gap-px h-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 px-1 text-xs font-medium transition-colors border-b-2 min-w-0",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate w-full text-center leading-tight">{tab.label}</span>
              {tab.badge && (
                <Badge variant="secondary" className="absolute top-1 right-1 text-[10px] px-1 h-4">
                  {tab.badge}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {activeTab === "email" && selectedEmail && (
          <div className="p-4 space-y-6">
            {/* Email Header */}
            <div>
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarFallback>{selectedEmail.sender[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{selectedEmail.sender}</p>
                  <p className="text-sm text-muted-foreground">{selectedEmail.time}</p>
                </div>
                <button
                  onClick={() => onEmailAction?.("star")}
                  className="p-1 flex-shrink-0"
                >
                  <Star
                    className={cn(
                      "h-4 w-4",
                      selectedEmail.isStarred
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    )}
                  />
                </button>
              </div>

              <h3 className="font-semibold text-lg mb-2 break-words">{selectedEmail.subject}</h3>

              <div className="prose prose-sm max-w-none">
                <p className="text-sm leading-relaxed break-words">{selectedEmail.fullContent}</p>
              </div>

              {selectedEmail.hasAttachment && (
                <div className="mt-4 p-3 bg-muted rounded-lg flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">attachment.pdf</p>
                    <p className="text-xs text-muted-foreground">2.4 MB</p>
                  </div>
                  <Button size="sm" variant="ghost">Download</Button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button className="flex-1 gap-2" onClick={() => onEmailAction?.("reply")}>
                <Reply className="h-4 w-4" />
                Reply
              </Button>
              <Button variant="outline" className="flex-1 gap-2" onClick={() => onEmailAction?.("forward")}>
                <Forward className="h-4 w-4" />
                Forward
              </Button>
            </div>

            {/* Schedule Follow-up */}
            <div>
              <h4 className="font-semibold mb-3">Schedule Follow-up</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Tomorrow at 9:00 AM
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Next Week
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Custom...
                </Button>
              </div>
            </div>

            {/* Mini Calendar */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm">
                  {format(miniCalendarDate, "MMMM yyyy")}
                </h4>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setMiniCalendarDate(new Date(miniCalendarDate.getFullYear(), miniCalendarDate.getMonth() - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setMiniCalendarDate(new Date(miniCalendarDate.getFullYear(), miniCalendarDate.getMonth() + 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div key={day} className="text-xs font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: startDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {daysInMonth.map((day) => (
                  <button
                    key={day.toString()}
                    className={cn(
                      "aspect-square rounded-lg text-sm transition-colors",
                      isToday(day) && "bg-primary text-primary-foreground font-semibold",
                      !isToday(day) && "hover:bg-accent",
                      !isSameMonth(day, miniCalendarDate) && "text-muted-foreground opacity-50"
                    )}
                  >
                    {format(day, "d")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "email" && !selectedEmail && (
          <div className="p-4 flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select an email to view details</p>
            </div>
          </div>
        )}

        {activeTab === "contact" && activeContact && (
          <div className="p-4 space-y-6">
            <div className="text-center">
              <Avatar className="h-20 w-20 mx-auto mb-3">
                <AvatarFallback className="text-2xl">
                  {activeContact.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg break-words">{activeContact.name}</h3>
              <p className="text-sm text-primary break-words">{activeContact.jobTitle}</p>
              <p className="text-sm text-muted-foreground break-words">{activeContact.company}</p>
              <div className="flex justify-center gap-2 mt-3 flex-wrap">
                {activeContact.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm truncate">{activeContact.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm">{activeContact.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm break-words">{activeContact.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent">
                <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Website</p>
                  <a href={activeContact.website} className="text-sm text-primary hover:underline truncate block">
                    {activeContact.website}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                SMS
              </Button>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Recent Interactions</h4>
              <div className="space-y-2">
                {activeContact.recentInteractions.map((interaction, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg border">
                    {interaction.type === "email" && <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                    {interaction.type === "meeting" && <CalendarIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{interaction.subject}</p>
                      <p className="text-xs text-muted-foreground">{interaction.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {activeContact.notes && (
              <div>
                <h4 className="font-semibold mb-2">Notes</h4>
                <p className="text-sm text-muted-foreground break-words">{activeContact.notes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "contact" && !activeContact && (
          <div className="p-4 flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select an email to view contact</p>
            </div>
          </div>
        )}

        {activeTab === "ai" && (
          <div className="p-4 flex items-center justify-center h-full">
            <div className="text-center">
              <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">AI Assistant Coming Soon</h3>
              <p className="text-sm text-muted-foreground">
                Smart replies, email summarization,<br />
                and productivity insights.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

