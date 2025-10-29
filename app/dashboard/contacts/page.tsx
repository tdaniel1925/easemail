"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ContactModal } from "@/components/contacts/ContactModal"
import {
  MoreVertical,
  Search,
  List,
  Grid3x3,
  ChevronRight,
  Phone,
  Mail,
  Star,
  Edit,
  Trash2,
  MessageSquare,
  Download,
  Upload,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data
const mockContacts = [
  {
    id: 1,
    firstName: "Angela",
    lastName: "Moss",
    name: "Angela Moss",
    email: "angelamoss@mail.com",
    phone: "+12 345 6789 0",
    company: "Highspeed Studios",
    jobTitle: "Marketing Manager",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
    website: "https://highspeed.com",
    avatar: "",
    tags: ["client", "vip"],
    groups: ["Marketing Team"],
    notes: "Important client, prefers email communication",
    isFavorite: false,
  },
  {
    id: 2,
    firstName: "Ahmad",
    lastName: "Zayn",
    name: "Ahmad Zayn",
    email: "ahmadzayn@mail.com",
    phone: "+12 345 6789 0",
    company: "Audio Video Teams",
    jobTitle: "Photographer",
    avatar: "",
    tags: ["freelancer"],
    groups: ["Creative Team"],
    isFavorite: false,
  },
  {
    id: 3,
    firstName: "Brian",
    lastName: "Connor",
    name: "Brian Connor",
    email: "brianconnor@mail.com",
    phone: "+12 345 6789 0",
    company: "Crimson Guards Studios",
    jobTitle: "Designer",
    avatar: "",
    tags: ["designer", "contractor"],
    groups: ["Design Team"],
    isFavorite: true,
  },
  {
    id: 4,
    firstName: "Courtney",
    lastName: "Hawkins",
    name: "Courtney Hawkins",
    email: "courtneyhawk@mail.com",
    phone: "+12 345 6789 0",
    company: "Highspeed Studios",
    jobTitle: "Programmer",
    avatar: "",
    tags: ["developer"],
    groups: ["Dev Team"],
    isFavorite: false,
  },
  {
    id: 5,
    firstName: "Chyntia",
    lastName: "Smilee",
    name: "Chyntia Smilee",
    email: "angelamoss@mail.com",
    phone: "+12 345 6789 0",
    company: "Highspeed Studios",
    jobTitle: "Marketing Manager",
    avatar: "",
    tags: ["marketing"],
    groups: ["Marketing Team"],
    isFavorite: false,
  },
  {
    id: 6,
    firstName: "David",
    lastName: "Here",
    name: "David Here",
    email: "davidhere@mail.com",
    phone: "+12 345 6789 0",
    company: "Highspeed Studios",
    jobTitle: "Marketing Manager",
    avatar: "",
    tags: [],
    groups: [],
    isFavorite: false,
  },
  {
    id: 7,
    firstName: "Dennise",
    lastName: "Lee",
    name: "Dennise Lee",
    email: "denisselee@mail.com",
    phone: "+12 345 6789 0",
    company: "Highspeed Studios",
    jobTitle: "Marketing Manager",
    avatar: "",
    tags: [],
    groups: [],
    isFavorite: false,
  },
  {
    id: 8,
    firstName: "Erbatov",
    lastName: "Axie",
    name: "Erbatov Axie",
    email: "erbatovaxie@mail.com",
    phone: "+12 345 6789 0",
    company: "Highspeed Studios",
    jobTitle: "Marketing Manager",
    avatar: "",
    tags: [],
    groups: [],
    isFavorite: false,
  },
  {
    id: 9,
    firstName: "Evan",
    lastName: "Khan",
    name: "Evan Khan",
    email: "angelamoss@mail.com",
    phone: "+12 345 6789 0",
    company: "Highspeed Studios",
    jobTitle: "Marketing Manager",
    avatar: "",
    tags: [],
    groups: [],
    isFavorite: false,
  },
  {
    id: 10,
    firstName: "Fanny",
    lastName: "Humble",
    name: "Fanny Humble",
    email: "fannyhumble@mail.com",
    phone: "+12 345 6789 0",
    company: "Highspeed Studios",
    jobTitle: "Marketing Manager",
    avatar: "",
    tags: [],
    groups: [],
    isFavorite: false,
  },
]

export default function ContactsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [contacts, setContacts] = useState(mockContacts)
  const [expandedContact, setExpandedContact] = useState<number | null>(null)
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 4

  const filteredContacts = contacts.filter((contact) => {
    const query = searchQuery.toLowerCase()
    return (
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.company.toLowerCase().includes(query) ||
      contact.jobTitle.toLowerCase().includes(query) ||
      contact.phone.toLowerCase().includes(query)
    )
  })

  const toggleFavorite = (id: number) => {
    setContacts(contacts.map(c => 
      c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
    ))
  }

  const deleteContact = (id: number) => {
    setContacts(contacts.filter(c => c.id !== id))
  }

  const handleEdit = (contact: any) => {
    setEditingContact(contact)
    setContactModalOpen(true)
  }

  const handleNewContact = () => {
    setEditingContact(null)
    setContactModalOpen(true)
  }

  const handleSaveContact = (contactData: any) => {
    if (editingContact) {
      // Update existing
      setContacts(contacts.map(c => 
        c.id === editingContact.id ? { ...c, ...contactData } : c
      ))
    } else {
      // Add new
      const newContact = {
        ...contactData,
        id: Math.max(...contacts.map(c => c.id)) + 1,
        name: `${contactData.firstName} ${contactData.lastName}`,
        isFavorite: false,
      }
      setContacts([...contacts, newContact])
    }
  }

  const handleImport = () => {
    // TODO: Implement CSV import with mapping
    console.log("Import contacts")
  }

  const handleExport = () => {
    // TODO: Implement CSV export
    console.log("Export contacts")
  }

  const toggleExpand = (id: number) => {
    setExpandedContact(expandedContact === id ? null : id)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="border-b bg-background flex-shrink-0">
        <div className="flex items-center justify-between p-6">
          <h1 className="text-2xl font-bold">Contacts</h1>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={handleImport}>
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Import</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
            <Button className="gap-2" onClick={handleNewContact}>
              <span className="hidden sm:inline">+ New Contact</span>
              <span className="sm:hidden">+</span>
            </Button>
            <div className="flex gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 pb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search here..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0 p-6">
        {viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className={cn(
                  "rounded-lg border bg-card transition-all",
                  expandedContact === contact.id ? "col-span-full" : ""
                )}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <Avatar className="h-16 w-16 flex-shrink-0">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback className="text-lg">
                        {contact.firstName[0]}{contact.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(contact)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleFavorite(contact.id)}>
                          <Star className={cn(
                            "h-4 w-4 mr-2",
                            contact.isFavorite && "fill-yellow-400 text-yellow-400"
                          )} />
                          {contact.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send SMS
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => deleteContact(contact.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div 
                    className="space-y-3 cursor-pointer"
                    onClick={() => toggleExpand(contact.id)}
                  >
                    <div className="min-w-0">
                      <h3 className="font-semibold flex items-center gap-2">
                        <span className="truncate">{contact.name}</span>
                        {contact.isFavorite && (
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                        )}
                      </h3>
                      <p className="text-sm text-primary truncate">
                        {contact.jobTitle} at {contact.company}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedContact === contact.id && (
                      <div className="pt-4 border-t space-y-4">
                        {contact.address && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Address</p>
                            <p className="text-sm">
                              {contact.address}<br />
                              {contact.city}, {contact.state} {contact.zipCode}<br />
                              {contact.country}
                            </p>
                          </div>
                        )}

                        {contact.website && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Website</p>
                            <a href={contact.website} className="text-sm text-primary hover:underline truncate block">
                              {contact.website}
                            </a>
                          </div>
                        )}

                        {contact.tags.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Tags</p>
                            <div className="flex flex-wrap gap-1">
                              {contact.tags.map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {contact.groups.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Groups</p>
                            <div className="flex flex-wrap gap-1">
                              {contact.groups.map((group: string) => (
                                <Badge key={group} variant="outline" className="text-xs">
                                  {group}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {contact.notes && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Notes</p>
                            <p className="text-sm">{contact.notes}</p>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1 gap-2">
                            <Mail className="h-3 w-3" />
                            Email
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 gap-2">
                            <MessageSquare className="h-3 w-3" />
                            SMS
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-sm whitespace-nowrap">Name</th>
                    <th className="text-left p-4 font-semibold text-sm whitespace-nowrap">Title</th>
                    <th className="text-left p-4 font-semibold text-sm whitespace-nowrap">Company</th>
                    <th className="text-left p-4 font-semibold text-sm whitespace-nowrap">Phone</th>
                    <th className="text-left p-4 font-semibold text-sm whitespace-nowrap">Email</th>
                    <th className="text-left p-4 font-semibold text-sm whitespace-nowrap">Tags</th>
                    <th className="text-right p-4 font-semibold text-sm whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-accent/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src={contact.avatar} />
                            <AvatarFallback className="text-sm">
                              {contact.firstName[0]}{contact.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium flex items-center gap-2">
                              <span className="truncate">{contact.name}</span>
                              {contact.isFavorite && (
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        <div className="max-w-[150px] truncate">{contact.jobTitle}</div>
                      </td>
                      <td className="p-4 text-sm text-primary">
                        <div className="max-w-[150px] truncate">{contact.company}</div>
                      </td>
                      <td className="p-4 text-sm whitespace-nowrap">{contact.phone}</td>
                      <td className="p-4 text-sm">
                        <div className="max-w-[200px] truncate">{contact.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.slice(0, 2).map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {contact.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{contact.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleExpand(contact.id)}
                          >
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform",
                                expandedContact === contact.id && "rotate-180"
                              )}
                            />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(contact)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleFavorite(contact.id)}>
                                <Star className={cn(
                                  "h-4 w-4 mr-2",
                                  contact.isFavorite && "fill-yellow-400 text-yellow-400"
                                )} />
                                {contact.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Send SMS
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => deleteContact(contact.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="border-t px-6 py-4 bg-background flex-shrink-0">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing 10 from 160 data
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
            <div className="hidden sm:flex items-center gap-2">
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
            </div>
            <span className="sm:hidden text-sm text-muted-foreground px-2">
              {currentPage} / {totalPages}
            </span>
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

      {/* Contact Modal */}
      <ContactModal
        open={contactModalOpen}
        onOpenChange={setContactModalOpen}
        contact={editingContact}
        onSave={handleSaveContact}
      />
    </div>
  )
}

