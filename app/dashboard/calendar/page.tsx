"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { EventModal } from "@/components/calendar/EventModal"
import { CalendarSidebar } from "@/components/calendar/CalendarSidebar"
import { ResizableSidebar } from "@/components/ui/resizable-sidebar"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  List,
  LayoutGrid,
  Clock,
  MoreVertical,
} from "lucide-react"
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addDays,
  addWeeks,
  addMonths,
  isSameDay,
  isToday,
  isSameMonth,
  startOfDay,
  parseISO,
} from "date-fns"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock events data
const mockEvents = [
  {
    id: 1,
    title: "Team Meeting",
    description: "Weekly team sync",
    start: new Date(2025, 9, 29, 10, 0),
    end: new Date(2025, 9, 29, 11, 0),
    category: "meeting",
    location: "Conference Room A",
    attendees: ["john@example.com", "sarah@example.com"],
    videoLink: "https://zoom.us/j/123456789",
    recurrence: "weekly",
    reminders: ["15min", "1hour"],
    timezone: "America/New_York",
    teamCalendar: "dev",
  },
  {
    id: 2,
    title: "Project Deadline",
    description: "Submit final deliverables",
    start: new Date(2025, 9, 30, 17, 0),
    end: new Date(2025, 9, 30, 18, 0),
    category: "task",
    location: "",
    attendees: [],
    recurrence: "none",
    reminders: ["1day"],
    timezone: "America/New_York",
    teamCalendar: "",
  },
  {
    id: 3,
    title: "Client Presentation",
    description: "Q4 Results Presentation",
    start: new Date(2025, 9, 31, 14, 0),
    end: new Date(2025, 9, 31, 15, 30),
    category: "client",
    location: "Client Office",
    attendees: ["client@example.com", "boss@example.com"],
    videoLink: "https://meet.google.com/abc-defg-hij",
    recurrence: "none",
    reminders: ["1day", "1hour"],
    timezone: "America/New_York",
    teamCalendar: "sales",
  },
]

type ViewMode = "month" | "week" | "day" | "agenda"

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState(mockEvents)
  const [eventModalOpen, setEventModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")

  const handlePrevious = () => {
    if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, -1))
    } else if (viewMode === "week") {
      setCurrentDate(addWeeks(currentDate, -1))
    } else if (viewMode === "day") {
      setCurrentDate(addDays(currentDate, -1))
    }
  }

  const handleNext = () => {
    if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1))
    } else if (viewMode === "week") {
      setCurrentDate(addWeeks(currentDate, 1))
    } else if (viewMode === "day") {
      setCurrentDate(addDays(currentDate, 1))
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  const handleNewEvent = () => {
    setSelectedEvent(null)
    setEventModalOpen(true)
  }

  const handleTimeSlotClick = (date: Date, time: string) => {
    setSelectedDate(date)
    setSelectedTimeSlot(time)
    setSelectedEvent(null)
    setEventModalOpen(true)
  }

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
  }

  const handleEditEvent = (event: any) => {
    setSelectedEvent(event)
    setEventModalOpen(true)
  }

  const handleSaveEvent = (eventData: any) => {
    if (selectedEvent) {
      setEvents(events.map(e => e.id === selectedEvent.id ? eventData : e))
    } else {
      setEvents([...events, eventData])
    }
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event =>
      isSameDay(new Date(event.start), date)
    )
  }

  const getEventsForTimeSlot = (date: Date, hour: number) => {
    const slotStart = new Date(date)
    slotStart.setHours(hour, 0, 0, 0)
    const slotEnd = new Date(date)
    slotEnd.setHours(hour + 1, 0, 0, 0)

    return events.filter(event => {
      const eventStart = new Date(event.start)
      return eventStart >= slotStart && eventStart < slotEnd && isSameDay(eventStart, date)
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      meeting: "bg-blue-500",
      task: "bg-green-500",
      reminder: "bg-yellow-500",
      personal: "bg-purple-500",
      work: "bg-red-500",
      client: "bg-pink-500",
    }
    return colors[category] || "bg-gray-500"
  }

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)
    const days = eachDayOfInterval({ start: startDate, end: endDate })
    const weeks = []
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7))
    }

    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 border-b bg-muted/30">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-y-auto">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 border-b min-h-[120px]">
              {week.map((day) => {
                const dayEvents = getEventsForDate(day)
                return (
                  <button
                    key={day.toString()}
                    onClick={() => handleTimeSlotClick(day, "09:00")}
                    className={cn(
                      "p-2 border-r text-left hover:bg-accent/50 transition-colors",
                      !isSameMonth(day, currentDate) && "bg-muted/20 text-muted-foreground",
                      isToday(day) && "bg-primary/5"
                    )}
                  >
                    <div className={cn(
                      "text-sm font-medium mb-1",
                      isToday(day) && "inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground"
                    )}>
                      {format(day, "d")}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEventClick(event)
                          }}
                          className={cn(
                            "text-xs p-1 rounded truncate text-white",
                            getCategoryColor(event.category)
                          )}
                        >
                          {format(new Date(event.start), "h:mma")} {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayEvents.length - 2}
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate)
    const weekEnd = endOfWeek(currentDate)
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd })
    const hours = Array.from({ length: 14 }, (_, i) => i + 7) // 7 AM to 8 PM

    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Day Headers */}
        <div className="flex border-b bg-muted/30">
          <div className="w-16 flex-shrink-0" /> {/* Time column spacer */}
          {days.map((day) => (
            <div key={day.toString()} className="flex-1 p-2 text-center border-l">
              <div className="text-xs text-muted-foreground">{format(day, "EEE")}</div>
              <div className={cn(
                "text-lg font-semibold mt-1",
                isToday(day) && "inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground"
              )}>
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>

        {/* Time Slots */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex">
            {/* Time Column */}
            <div className="w-16 flex-shrink-0">
              {hours.map((hour) => (
                <div key={hour} className="h-16 pr-2 text-right text-xs text-muted-foreground border-b">
                  {format(new Date().setHours(hour, 0), "ha")}
                </div>
              ))}
            </div>

            {/* Days Columns */}
            {days.map((day) => (
              <div key={day.toString()} className="flex-1 border-l">
                {hours.map((hour) => {
                  const slotEvents = getEventsForTimeSlot(day, hour)
                  return (
                    <button
                      key={hour}
                      onClick={() => handleTimeSlotClick(day, `${hour.toString().padStart(2, "0")}:00`)}
                      className={cn(
                        "w-full h-16 border-b hover:bg-accent/50 transition-colors relative",
                        isToday(day) && "bg-primary/5"
                      )}
                    >
                      {slotEvents.map((event) => (
                        <div
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEventClick(event)
                          }}
                          className={cn(
                            "absolute left-0.5 right-0.5 p-1 text-xs text-left rounded text-white overflow-hidden",
                            getCategoryColor(event.category)
                          )}
                          style={{
                            top: `${(new Date(event.start).getMinutes() / 60) * 100}%`,
                            height: `${Math.min(((new Date(event.end).getTime() - new Date(event.start).getTime()) / (60 * 60 * 1000)) * 100, 100)}%`,
                          }}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="text-[10px] opacity-90 truncate">{event.location}</div>
                        </div>
                      ))}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderDayView = () => {
    const hours = Array.from({ length: 14 }, (_, i) => i + 7) // 7 AM to 8 PM

    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Day Header */}
        <div className="border-b bg-muted/30 p-4 text-center">
          <div className="text-sm text-muted-foreground">{format(currentDate, "EEEE")}</div>
          <div className={cn(
            "text-2xl font-bold mt-1",
            isToday(currentDate) && "text-primary"
          )}>
            {format(currentDate, "MMMM d, yyyy")}
          </div>
        </div>

        {/* Time Slots */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex">
            <div className="w-20 flex-shrink-0">
              {hours.map((hour) => (
                <div key={hour} className="h-20 pr-3 text-right text-sm text-muted-foreground border-b">
                  {format(new Date().setHours(hour, 0), "h:mm a")}
                </div>
              ))}
            </div>

            <div className="flex-1">
              {hours.map((hour) => {
                const slotEvents = getEventsForTimeSlot(currentDate, hour)
                return (
                  <button
                    key={hour}
                    onClick={() => handleTimeSlotClick(currentDate, `${hour.toString().padStart(2, "0")}:00`)}
                    className="w-full h-20 border-b border-l hover:bg-accent/50 transition-colors relative"
                  >
                    {slotEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEventClick(event)
                        }}
                        className={cn(
                          "absolute left-2 right-2 p-2 rounded text-white",
                          getCategoryColor(event.category)
                        )}
                        style={{
                          top: `${(new Date(event.start).getMinutes() / 60) * 100}%`,
                          height: `${Math.min(((new Date(event.end).getTime() - new Date(event.start).getTime()) / (60 * 60 * 1000)) * 100, 100)}%`,
                        }}
                      >
                        <div className="font-semibold">{event.title}</div>
                        <div className="text-sm opacity-90">
                          {format(new Date(event.start), "h:mm a")} - {format(new Date(event.end), "h:mm a")}
                        </div>
                        {event.location && <div className="text-xs opacity-75">{event.location}</div>}
                      </div>
                    ))}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderAgendaView = () => {
    const upcomingEvents = events
      .filter(e => new Date(e.start) >= startOfDay(new Date()))
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 20)

    const groupedEvents: { [key: string]: typeof events } = {}
    upcomingEvents.forEach(event => {
      const dateKey = format(new Date(event.start), "yyyy-MM-dd")
      if (!groupedEvents[dateKey]) {
        groupedEvents[dateKey] = []
      }
      groupedEvents[dateKey].push(event)
    })

    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {Object.entries(groupedEvents).map(([dateKey, dayEvents]) => (
            <div key={dateKey}>
              <div className="flex items-center gap-4 mb-3">
                <div className="text-center">
                  <div className="text-2xl font-bold">{format(parseISO(dateKey), "d")}</div>
                  <div className="text-xs text-muted-foreground">{format(parseISO(dateKey), "MMM")}</div>
                </div>
                <div>
                  <div className="font-semibold">{format(parseISO(dateKey), "EEEE")}</div>
                  <div className="text-sm text-muted-foreground">{format(parseISO(dateKey), "MMMM d, yyyy")}</div>
                </div>
              </div>
              <div className="space-y-2 ml-16">
                {dayEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("w-1 h-full rounded-full flex-shrink-0", getCategoryColor(event.category))} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{event.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span>{format(new Date(event.start), "h:mm a")} - {format(new Date(event.end), "h:mm a")}</span>
                          {event.location && <span>• {event.location}</span>}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(groupedEvents).length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming events</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Compact Header */}
        <div className="border-b bg-background flex-shrink-0">
          <div className="flex items-center justify-between px-4 py-3 gap-2">
            {/* Left: Title and Navigation */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Button onClick={handleNewEvent} size="sm" className="gap-1 flex-shrink-0">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New</span>
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 flex-shrink-0" onClick={handlePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="flex-shrink-0" onClick={handleToday}>
                Today
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 flex-shrink-0" onClick={handleNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <h2 className="text-base font-semibold truncate ml-2 min-w-0">
                {viewMode === "month" && format(currentDate, "MMM yyyy")}
                {viewMode === "week" && `${format(startOfWeek(currentDate), "MMM d")} - ${format(endOfWeek(currentDate), "d, yyyy")}`}
                {viewMode === "day" && format(currentDate, "MMM d, yyyy")}
                {viewMode === "agenda" && "Agenda"}
              </h2>
            </div>

            {/* Right: View Switcher and More */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="hidden md:flex gap-1 border rounded-md p-0.5">
                <Button
                  variant={viewMode === "month" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("month")}
                  className="h-7 px-2"
                >
                  <LayoutGrid className="h-3 w-3" />
                </Button>
                <Button
                  variant={viewMode === "week" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("week")}
                  className="h-7 px-2"
                >
                  <CalendarIcon className="h-3 w-3" />
                </Button>
                <Button
                  variant={viewMode === "day" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("day")}
                  className="h-7 px-2"
                >
                  <Clock className="h-3 w-3" />
                </Button>
                <Button
                  variant={viewMode === "agenda" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("agenda")}
                  className="h-7 px-2"
                >
                  <List className="h-3 w-3" />
                </Button>
              </div>

              {/* Mobile View Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="md:hidden">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setViewMode("month")}>
                    <LayoutGrid className="h-4 w-4 mr-2" /> Month
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setViewMode("week")}>
                    <CalendarIcon className="h-4 w-4 mr-2" /> Week
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setViewMode("day")}>
                    <Clock className="h-4 w-4 mr-2" /> Day
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setViewMode("agenda")}>
                    <List className="h-4 w-4 mr-2" /> Agenda
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className="flex-1 overflow-hidden min-h-0">
          {viewMode === "month" && renderMonthView()}
          {viewMode === "week" && renderWeekView()}
          {viewMode === "day" && renderDayView()}
          {viewMode === "agenda" && renderAgendaView()}
        </div>
      </div>

      {/* Right Sidebar - Smaller Default Width */}
      <ResizableSidebar defaultWidth={280} minWidth={260} maxWidth={400}>
        <CalendarSidebar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          events={events}
          onEventClick={handleEditEvent}
          selectedEvent={selectedEvent}
        />
      </ResizableSidebar>

      {/* Event Modal */}
      <EventModal
        open={eventModalOpen}
        onOpenChange={setEventModalOpen}
        event={selectedEvent}
        selectedDate={selectedDate}
        selectedTime={selectedTimeSlot}
        onSave={handleSaveEvent}
      />
    </div>
  )
}
