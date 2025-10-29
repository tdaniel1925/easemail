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
import { X } from "lucide-react"

interface ContactModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact?: any
  onSave?: (contact: any) => void
}

export function ContactModal({ open, onOpenChange, contact, onSave }: ContactModalProps) {
  const [formData, setFormData] = useState({
    firstName: contact?.firstName || "",
    lastName: contact?.lastName || "",
    email: contact?.email || "",
    phone: contact?.phone || "",
    company: contact?.company || "",
    jobTitle: contact?.jobTitle || "",
    address: contact?.address || "",
    city: contact?.city || "",
    state: contact?.state || "",
    zipCode: contact?.zipCode || "",
    country: contact?.country || "",
    website: contact?.website || "",
    notes: contact?.notes || "",
    tags: contact?.tags || [],
    groups: contact?.groups || [],
  })

  const [newTag, setNewTag] = useState("")
  const [newGroup, setNewGroup] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSave) {
      onSave(formData)
    }
    onOpenChange(false)
  }

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] })
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t: string) => t !== tag) })
  }

  const addGroup = () => {
    if (newGroup && !formData.groups.includes(newGroup)) {
      setFormData({ ...formData, groups: [...formData.groups, newGroup] })
      setNewGroup("")
    }
  }

  const removeGroup = (group: string) => {
    setFormData({ ...formData, groups: formData.groups.filter((g: string) => g !== group) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{contact ? "Edit Contact" : "New Contact"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Company Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Address Information</h3>
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Tags</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Groups */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Groups</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Add group..."
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addGroup())}
              />
              <Button type="button" onClick={addGroup}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.groups.map((group: string) => (
                <Badge key={group} variant="secondary" className="gap-1">
                  {group}
                  <button
                    type="button"
                    onClick={() => removeGroup(group)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Notes</h3>
            <textarea
              className="w-full min-h-[100px] p-3 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Add notes about this contact..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {contact ? "Update Contact" : "Create Contact"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

