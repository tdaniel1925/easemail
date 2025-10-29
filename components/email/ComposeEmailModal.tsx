"use client"

import { useState } from "react"
import { 
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ArrowLeft,
  X, 
  Save,
  Trash2,
  MoreVertical,
  Paperclip,
  Undo,
  Redo,
  Type,
  Bold,
  Italic,
  Underline,
  Smile,
  ChevronDown,
  Send
} from "lucide-react"

interface ComposeEmailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ComposeEmailModal({ open, onOpenChange }: ComposeEmailModalProps) {
  const [toRecipients, setToRecipients] = useState([
    { name: "Olivia Johnson", email: "oliviajohnson@mail.com", avatar: "" },
    { name: "Marteens", email: "marteens404@gmail.com", avatar: "" },
  ])
  
  const [bccRecipients, setBccRecipients] = useState([
    "evanenest@gmail.com",
    "claudiaexeme@gmail.com",
    "ricardobolly@gmail.com",
  ])

  const [subject, setSubject] = useState("Weekly Report Progress Project \"Almanax\"")
  const [message, setMessage] = useState("Hello guys!\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est ?")

  const removeTo = (email: string) => {
    setToRecipients(toRecipients.filter(r => r.email !== email))
  }

  const removeBcc = (email: string) => {
    setBccRecipients(bccRecipients.filter(e => e !== email))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold">Compose Email</h2>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              Save to Draft
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* TO Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">TO</label>
            <div className="flex flex-wrap gap-2">
              {toRecipients.map((recipient) => (
                <div
                  key={recipient.email}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-muted rounded-lg"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={recipient.avatar} />
                    <AvatarFallback className="text-xs">
                      {recipient.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{recipient.name}</span>
                    <span className="text-xs text-muted-foreground">{recipient.email}</span>
                  </div>
                  <button
                    onClick={() => removeTo(recipient.email)}
                    className="ml-2 hover:bg-background rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* BCC Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">BCC</label>
            <div className="flex flex-wrap gap-2">
              {bccRecipients.map((email) => (
                <div
                  key={email}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-muted rounded-lg"
                >
                  <span className="text-sm">{email}</span>
                  <button
                    onClick={() => removeBcc(email)}
                    className="hover:bg-background rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">SUBJECT</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border-none bg-transparent px-0 text-base font-medium focus-visible:ring-0"
            />
          </div>

          {/* Message Field */}
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium text-muted-foreground">MESSAGE</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full min-h-[200px] p-3 rounded-lg border-none bg-transparent resize-none focus:outline-none focus:ring-0"
              placeholder="Write your message..."
            />
          </div>
        </div>

        {/* Footer with Toolbar */}
        <div className="border-t px-6 py-4 space-y-4">
          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">TAGS</label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                #projectmanagement
              </Badge>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <Button size="lg" className="gap-2">
              <Send className="h-4 w-4" />
              SEND EMAIL
            </Button>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Redo className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Type className="h-4 w-4" />
              </Button>
              
              <div className="mx-2 h-6 w-px bg-border" />
              
              <Button variant="outline" size="sm" className="gap-1 h-9">
                Open Sans
                <ChevronDown className="h-3 w-3" />
              </Button>
              
              <div className="mx-2 h-6 w-px bg-border" />
              
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Underline className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Smile className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

