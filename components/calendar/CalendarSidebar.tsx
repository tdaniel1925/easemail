"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Calendar as CalendarIcon,
  Mail,
  User,
  Bot,
  ChevronLeft,
  ChevronRight,
  Star,
  Phone,
  MessageSquare,
  MapPin,
  Briefcase,
  Globe,
  Clock,
  Users,
} from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"

interface CalendarSidebarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  events: any[]
  onEventClick: (event: any) => void
  selectedEvent?: any
}

export function CalendarSidebar({ 
  selectedDate, 
  onDateSelect, 
  events, 
  onEventClick,
  selectedEvent 
}: CalendarSidebarProps) {
  const [activeTab, setActiveTab] = useState<"calendar" | "email" | "contact" | "ai">("calendar")
  const [miniCalendarDate, setMiniCalendarDate] = useState(new Date())

  const tabs = [
    { id: "calendar" as const, label: "Calendar", icon: CalendarIcon },
    { id: "email" as const, label: "Emails", icon: Mail },
    { id: "contact" as const, label: "Contact", icon: User },
    { id: "ai" as const, label: "AI Assistant", icon: Bot, badge: "Soon" },
  ]

  // Mini calendar logic
  const monthStart = startOfMonth(miniCalendarDate)
  const monthEnd = endOfMonth(miniCalendarDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDayOfWeek = monthStart.getDay()

  const upcomingEvents = events
    .filter(e => new Date(e.start) >= new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5)

  const recentEmails = [
    {
      id: 1,
      from: "john@example.com",
      subject: "Project Update",
      preview: "Hey, just wanted to update you on...",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      from: "sarah@example.com",
      subject: "Meeting Tomorrow",
      preview: "Don't forget about our meeting...",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      from: "mike@example.com",
      subject: "Re: Budget Proposal",
      preview: "Thanks for sending that over...",
      time: "3 hours ago",
      unread: false,
    },
  ]

  const activeContact = {
    name: "Angela Moss",
    email: "angelamoss@mail.com",
    phone: "+1 234 567 8900",
    company: "Highspeed Studios",
    jobTitle: "Marketing Manager",
    address: "123 Main St, New York, NY 10001",
    website: "https://highspeed.com",
    tags: ["client", "vip"],
    notes: "Important client, prefers email communication",
    recentInteractions: [
      { type: "email", subject: "Project Update", date: "2 hours ago" },
      { type: "meeting", subject: "Q4 Planning", date: "Yesterday" },
      { type: "call", subject: "Quick Check-in", date: "3 days ago" },
    ],
  }

  return (
    <div className="w-full h-full border-l bg-background flex flex-col">
      {/* Tabs */}
      <div className="border-b flex-shrink-0">
        <div className="grid grid-cols-3">
          {tabs.filter(t => t.id !== "email").map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors border-b-2",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <Badge variant="secondary" className="absolute -top-1 -right-1 text-[10px] px-1">
                  {tab.badge}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "calendar" && (
          <div className="p-4 space-y-6">
            {/* Mini Calendar */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">
                  {format(miniCalendarDate, "MMMM yyyy")}
                </h3>
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

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div key={day} className="text-xs font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: startDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {daysInMonth.map((day) => {
                  const hasEvents = events.some(e => isSameDay(new Date(e.start), day))
                  return (
                    <button
                      key={day.toString()}
                      onClick={() => onDateSelect(day)}
                      className={cn(
                        "relative aspect-square rounded-lg text-sm transition-colors",
                        isToday(day) && "bg-primary text-primary-foreground font-semibold",
                        isSameDay(day, selectedDate) && !isToday(day) && "bg-accent",
                        !isSameDay(day, selectedDate) && !isToday(day) && "hover:bg-accent",
                        !isSameMonth(day, miniCalendarDate) && "text-muted-foreground opacity-50"
                      )}
                    >
                      {format(day, "d")}
                      {hasEvents && (
                        <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <h3 className="font-semibold mb-3">Upcoming Events</h3>
              <div className="space-y-2">
                {upcomingEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No upcoming events
                  </p>
                ) : (
                  upcomingEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <div className={cn("w-1 h-full rounded-full", `bg-${event.category}-500`)} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(event.start), "MMM d, h:mm a")}
                          </p>
                          {event.location && (
                            <p className="text-xs text-muted-foreground truncate">
                              {event.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Categories Filter */}
            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                {["Meeting", "Task", "Reminder", "Personal", "Work", "Client"].map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    <div className={cn("w-3 h-3 rounded-full", `bg-${cat.toLowerCase()}-500`)} />
                    <span className="text-sm">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "contact" && activeContact && (
          <div className="p-4 space-y-6">
            <div className="text-center">
              <Avatar className="h-20 w-20 mx-auto mb-3">
                <AvatarFallback className="text-2xl">
                  {activeContact.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{activeContact.name}</h3>
              <p className="text-sm text-primary">{activeContact.jobTitle}</p>
              <p className="text-sm text-muted-foreground">{activeContact.company}</p>
              <div className="flex justify-center gap-2 mt-3">
                {activeContact.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm truncate">{activeContact.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm">{activeContact.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm">{activeContact.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Website</p>
                  <a href={activeContact.website} className="text-sm text-primary hover:underline">
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
                    {interaction.type === "email" && <Mail className="h-4 w-4 text-muted-foreground" />}
                    {interaction.type === "meeting" && <CalendarIcon className="h-4 w-4 text-muted-foreground" />}
                    {interaction.type === "call" && <Phone className="h-4 w-4 text-muted-foreground" />}
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
                <p className="text-sm text-muted-foreground">{activeContact.notes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "ai" && (
          <div className="p-4 flex items-center justify-center h-full">
            <div className="text-center">
              <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">AI Assistant Coming Soon</h3>
              <p className="text-sm text-muted-foreground">
                Your personal AI assistant for email composition,<br />
                smart scheduling, and productivity insights.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Event Detail in Sidebar */}
      {selectedEvent && activeTab === "calendar" && (
        <div className="border-t p-4 bg-muted/50">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h4 className="font-semibold">{selectedEvent.title}</h4>
              <Button variant="ghost" size="sm" onClick={() => {}}>Edit</Button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{format(new Date(selectedEvent.start), "MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(new Date(selectedEvent.start), "h:mm a")} - {format(new Date(selectedEvent.end), "h:mm a")}
                </span>
              </div>
              {selectedEvent.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEvent.location}</span>
                </div>
              )}
              {selectedEvent.attendees?.length > 0 && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEvent.attendees.length} attendees</span>
                </div>
              )}
            </div>
            {selectedEvent.description && (
              <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

