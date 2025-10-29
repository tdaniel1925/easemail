"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Video, 
  Bell,
  Repeat,
  Paperclip,
  Globe
} from "lucide-react"
import { format } from "date-fns"

interface EventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event?: any
  selectedDate?: Date
  selectedTime?: string
  onSave?: (event: any) => void
}

export function EventModal({ 
  open, 
  onOpenChange, 
  event, 
  selectedDate,
  selectedTime,
  onSave 
}: EventModalProps) {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    location: event?.location || "",
    startDate: event?.start || selectedDate || new Date(),
    startTime: event?.startTime || selectedTime || "09:00",
    endDate: event?.end || selectedDate || new Date(),
    endTime: event?.endTime || selectedTime || "10:00",
    isAllDay: event?.isAllDay || false,
    category: event?.category || "meeting",
    attendees: event?.attendees || [],
    videoLink: event?.videoLink || "",
    recurrence: event?.recurrence || "none",
    reminders: event?.reminders || ["15min"],
    timezone: event?.timezone || "America/New_York",
    attachments: event?.attachments || [],
    notes: event?.notes || "",
    teamCalendar: event?.teamCalendar || "",
  })

  const [newAttendee, setNewAttendee] = useState("")

  const categories = [
    { value: "meeting", label: "Meeting", color: "bg-blue-500" },
    { value: "task", label: "Task", color: "bg-green-500" },
    { value: "reminder", label: "Reminder", color: "bg-yellow-500" },
    { value: "personal", label: "Personal", color: "bg-purple-500" },
    { value: "work", label: "Work", color: "bg-red-500" },
    { value: "client", label: "Client", color: "bg-pink-500" },
  ]

  const videoOptions = [
    { value: "zoom", label: "Zoom Meeting", icon: Video },
    { value: "meet", label: "Google Meet", icon: Video },
    { value: "teams", label: "Microsoft Teams", icon: Video },
    { value: "custom", label: "Custom Link", icon: Globe },
  ]

  const recurrenceOptions = [
    { value: "none", label: "Does not repeat" },
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
    { value: "weekdays", label: "Every weekday (Mon-Fri)" },
    { value: "custom", label: "Custom..." },
  ]

  const reminderOptions = [
    { value: "0min", label: "At time of event" },
    { value: "15min", label: "15 minutes before" },
    { value: "30min", label: "30 minutes before" },
    { value: "1hour", label: "1 hour before" },
    { value: "1day", label: "1 day before" },
    { value: "1week", label: "1 week before" },
  ]

  const timezones = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Dubai",
    "Australia/Sydney",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSave) {
      onSave({
        ...formData,
        id: event?.id || Date.now(),
        start: new Date(`${formData.startDate}T${formData.startTime}`),
        end: new Date(`${formData.endDate}T${formData.endTime}`),
      })
    }
    onOpenChange(false)
  }

  const addAttendee = () => {
    if (newAttendee && !formData.attendees.includes(newAttendee)) {
      setFormData({ ...formData, attendees: [...formData.attendees, newAttendee] })
      setNewAttendee("")
    }
  }

  const removeAttendee = (email: string) => {
    setFormData({ 
      ...formData, 
      attendees: formData.attendees.filter((a: string) => a !== email) 
    })
  }

  const generateVideoLink = (platform: string) => {
    // Mock video link generation
    const links: Record<string, string> = {
      zoom: `https://zoom.us/j/${Math.random().toString().slice(2, 11)}`,
      meet: `https://meet.google.com/${Math.random().toString(36).slice(2, 15)}`,
      teams: `https://teams.microsoft.com/l/meetup-join/${Math.random().toString(36).slice(2, 15)}`,
    }
    setFormData({ ...formData, videoLink: links[platform] || "" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "New Event"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Input
              placeholder="Add title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="text-lg font-semibold border-none focus-visible:ring-0 px-0"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Start Date
              </Label>
              <Input
                type="date"
                value={format(new Date(formData.startDate), "yyyy-MM-dd")}
                onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Start Time
              </Label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                disabled={formData.isAllDay}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={format(new Date(formData.endDate), "yyyy-MM-dd")}
                onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                disabled={formData.isAllDay}
              />
            </div>
          </div>

          {/* All Day & Timezone */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAllDay}
                onChange={(e) => setFormData({ ...formData, isAllDay: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm">All day event</span>
            </label>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="text-sm border rounded-md px-2 py-1 bg-background"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.value })}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    formData.category === cat.value
                      ? `${cat.color} text-white`
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            <Input
              placeholder="Add location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          {/* Video Conferencing */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Video Conference
            </Label>
            <div className="flex gap-2">
              {videoOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => generateVideoLink(option.value)}
                  className="gap-2"
                >
                  <option.icon className="h-3 w-3" />
                  {option.label}
                </Button>
              ))}
            </div>
            {formData.videoLink && (
              <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                <Input
                  value={formData.videoLink}
                  onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setFormData({ ...formData, videoLink: "" })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Attendees */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Attendees
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add attendees by email..."
                value={newAttendee}
                onChange={(e) => setNewAttendee(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAttendee())}
              />
              <Button type="button" onClick={addAttendee}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.attendees.map((email: string) => (
                <div key={email} className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{email[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{email}</span>
                  <button
                    type="button"
                    onClick={() => removeAttendee(email)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recurrence */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              Repeat
            </Label>
            <select
              value={formData.recurrence}
              onChange={(e) => setFormData({ ...formData, recurrence: e.target.value })}
              className="w-full border rounded-md px-3 py-2 bg-background"
            >
              {recurrenceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reminders */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Reminders
            </Label>
            <div className="space-y-2">
              {formData.reminders.map((reminder: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <select
                    value={reminder}
                    onChange={(e) => {
                      const newReminders = [...formData.reminders]
                      newReminders[index] = e.target.value
                      setFormData({ ...formData, reminders: newReminders })
                    }}
                    className="flex-1 border rounded-md px-3 py-2 bg-background"
                  >
                    {reminderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newReminders = formData.reminders.filter((_: string, i: number) => i !== index)
                      setFormData({ ...formData, reminders: newReminders })
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData({ 
                  ...formData, 
                  reminders: [...formData.reminders, "15min"] 
                })}
              >
                + Add reminder
              </Button>
            </div>
          </div>

          {/* Team Calendar */}
          <div className="space-y-2">
            <Label>Team Calendar</Label>
            <select
              value={formData.teamCalendar}
              onChange={(e) => setFormData({ ...formData, teamCalendar: e.target.value })}
              className="w-full border rounded-md px-3 py-2 bg-background"
            >
              <option value="">Personal Calendar</option>
              <option value="sales">Sales Team</option>
              <option value="marketing">Marketing Team</option>
              <option value="dev">Development Team</option>
              <option value="company">Company-wide</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <textarea
              className="w-full min-h-[100px] p-3 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Add description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
            >
              <Paperclip className="h-4 w-4" />
              Add Attachment
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {event ? "Update Event" : "Create Event"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}


