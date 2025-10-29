"use client"

import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  Folder,
  Search,
  CheckCircle2,
  Loader2,
  AlertCircle,
  CheckSquare,
  Square,
  ArrowRight,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

// =============================================================================
// TYPES
// =============================================================================

interface ServerFolder {
  id: string
  name: string
  displayName: string
  attributes: string[]
  totalCount: number
  unreadCount: number
  parentId?: string | null
}

interface FolderMapping {
  serverFolderId: string
  serverFolderName: string
  appFolderName: string
  enabled: boolean
  bidirectionalSync: boolean
}

interface Props {
  open: boolean
  onClose: () => void
  accountId: string
  accountEmail: string
  provider?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function FolderSyncConfigModal({
  open,
  onClose,
  accountId,
  accountEmail,
  provider = 'google'
}: Props) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [serverFolders, setServerFolders] = useState<ServerFolder[]>([])
  const [folderMappings, setFolderMappings] = useState<FolderMapping[]>([])

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "system" | "custom">("all")
  const [sortBy, setSortBy] = useState<"name" | "count">("name")
  const [showOnlyEnabled, setShowOnlyEnabled] = useState(false)

  // Collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    system: true,
    custom: true,
    nested: false
  })

  useEffect(() => {
    if (open && accountId) {
      loadServerFolders()
    }
  }, [open, accountId])

  async function loadServerFolders() {
    setLoading(true)
    try {
      const response = await fetch(`/api/emails/accounts/${accountId}/folders`)
      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setServerFolders(data.folders || [])

      // Initialize mappings (all enabled by default)
      const mappings: FolderMapping[] = (data.folders || []).map((folder: ServerFolder) => ({
        serverFolderId: folder.id,
        serverFolderName: folder.displayName,
        appFolderName: folder.displayName,
        enabled: true,
        bidirectionalSync: isSystemFolder(folder.attributes)
      }))

      setFolderMappings(mappings)
    } catch (error) {
      console.error('Failed to load folders:', error)
    } finally {
      setLoading(false)
    }
  }

  // Group folders by type
  const groupedFolders = useMemo(() => {
    return {
      system: serverFolders.filter(f => isSystemFolder(f.attributes)),
      custom: serverFolders.filter(f => !isSystemFolder(f.attributes) && !f.parentId),
      nested: serverFolders.filter(f => !isSystemFolder(f.attributes) && f.parentId)
    }
  }, [serverFolders])

  // Filtered folders
  const filteredFolders = useMemo(() => {
    let result = serverFolders

    // Search
    if (searchQuery) {
      result = result.filter(f =>
        f.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by type
    if (filterType === "system") {
      result = result.filter(f => isSystemFolder(f.attributes))
    } else if (filterType === "custom") {
      result = result.filter(f => !isSystemFolder(f.attributes))
    }

    // Show only enabled
    if (showOnlyEnabled) {
      result = result.filter((_, i) => folderMappings[i]?.enabled)
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.displayName.localeCompare(b.displayName)
      }
      return b.totalCount - a.totalCount
    })

    return result
  }, [serverFolders, searchQuery, filterType, sortBy, showOnlyEnabled, folderMappings])

  function isSystemFolder(attributes: string[]): boolean {
    const systemAttrs = ['inbox', 'sent', 'drafts', 'trash', 'spam', 'archive', 'all']
    return attributes.some(attr => systemAttrs.includes(attr.toLowerCase()))
  }

  function toggleFolder(index: number) {
    const updated = [...folderMappings]
    updated[index].enabled = !updated[index].enabled
    setFolderMappings(updated)
  }

  function updateAppFolderName(index: number, newName: string) {
    const updated = [...folderMappings]
    updated[index].appFolderName = newName
    setFolderMappings(updated)
  }

  function toggleBidirectionalSync(index: number) {
    const updated = [...folderMappings]
    updated[index].bidirectionalSync = !updated[index].bidirectionalSync
    setFolderMappings(updated)
  }

  // Bulk actions
  function selectAll() {
    setFolderMappings(prev => prev.map(m => ({ ...m, enabled: true })))
  }

  function deselectAll() {
    setFolderMappings(prev => prev.map(m => ({ ...m, enabled: false })))
  }

  function selectSystemOnly() {
    setFolderMappings(prev => prev.map((m, i) => ({
      ...m,
      enabled: isSystemFolder(serverFolders[i].attributes)
    })))
  }

  function selectFoldersWithEmails(minCount = 10) {
    setFolderMappings(prev => prev.map((m, i) => ({
      ...m,
      enabled: serverFolders[i].totalCount >= minCount
    })))
  }

  async function handleSaveAndSync() {
    setSaving(true)
    try {
      // Save folder mappings
      await fetch(`/api/emails/accounts/${accountId}/folder-mappings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mappings: folderMappings })
      })

      // Trigger initial sync for selected folders
      await fetch(`/api/emails/accounts/${accountId}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          syncOnlyMapped: true,
          folderIds: folderMappings
            .filter(m => m.enabled)
            .map(m => m.serverFolderId)
        })
      })

      onClose()
    } catch (error) {
      console.error('Failed to save mappings:', error)
    } finally {
      setSaving(false)
    }
  }

  const selectedCount = folderMappings.filter(m => m.enabled).length
  const totalEmails = serverFolders
    .filter((_, i) => folderMappings[i]?.enabled)
    .reduce((sum, f) => sum + f.totalCount, 0)

  const providerIcon = provider === 'google' ? '📧' : provider === 'microsoft' ? '📨' : '✉️'

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{providerIcon}</span>
              <span>Configure Folder Sync</span>
            </div>
            <Badge variant="outline">{serverFolders.length} folders found</Badge>
          </DialogTitle>
          <DialogDescription>
            Choose which folders to sync for <strong>{accountEmail}</strong>
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="space-y-3 pb-4 border-b">
              {/* Search & Filters */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search folders..."
                    className="pl-9"
                  />
                </div>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="h-10 px-3 border rounded-md"
                >
                  <option value="all">All Folders</option>
                  <option value="system">System Only</option>
                  <option value="custom">Custom Only</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="h-10 px-3 border rounded-md"
                >
                  <option value="name">Sort by Name</option>
                  <option value="count">Sort by Count</option>
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOnlyEnabled(!showOnlyEnabled)}
                >
                  {showOnlyEnabled ? "Show All" : "Show Selected"}
                </Button>
              </div>

              {/* Bulk Actions */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground mr-2">Quick Select:</span>
                <Button variant="outline" size="sm" onClick={selectAll}>
                  <CheckSquare className="h-4 w-4 mr-1" />
                  All
                </Button>
                <Button variant="outline" size="sm" onClick={deselectAll}>
                  <Square className="h-4 w-4 mr-1" />
                  None
                </Button>
                <Button variant="outline" size="sm" onClick={selectSystemOnly}>
                  System Only
                </Button>
                <Button variant="outline" size="sm" onClick={() => selectFoldersWithEmails(10)}>
                  With 10+ Emails
                </Button>
              </div>

              {/* Summary Bar */}
              <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">
                    {selectedCount} of {serverFolders.length} selected
                  </span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="text-sm text-muted-foreground">
                  ~{totalEmails.toLocaleString()} emails to sync
                </div>
              </div>
            </div>

            {/* Folder List */}
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {/* System Folders */}
                {groupedFolders.system.length > 0 && (
                  <div>
                    <button
                      onClick={() => setExpandedSections(prev => ({ ...prev, system: !prev.system }))}
                      className="flex items-center gap-2 font-semibold text-sm text-muted-foreground hover:text-foreground mb-2"
                    >
                      {expandedSections.system ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      System Folders ({groupedFolders.system.length})
                    </button>
                    {expandedSections.system && (
                      <div className="space-y-2">
                        {groupedFolders.system.map((folder, idx) => {
                          const globalIdx = serverFolders.indexOf(folder)
                          const mapping = folderMappings[globalIdx]
                          return (
                            <FolderMappingRow
                              key={folder.id}
                              folder={folder}
                              mapping={mapping}
                              onToggle={() => toggleFolder(globalIdx)}
                              onUpdateName={(name) => updateAppFolderName(globalIdx, name)}
                              onToggleSync={() => toggleBidirectionalSync(globalIdx)}
                            />
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Custom Folders */}
                {groupedFolders.custom.length > 0 && (
                  <div>
                    <button
                      onClick={() => setExpandedSections(prev => ({ ...prev, custom: !prev.custom }))}
                      className="flex items-center gap-2 font-semibold text-sm text-muted-foreground hover:text-foreground mb-2"
                    >
                      {expandedSections.custom ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      Custom Folders ({groupedFolders.custom.length})
                    </button>
                    {expandedSections.custom && (
                      <div className="space-y-2">
                        {groupedFolders.custom.map((folder) => {
                          const globalIdx = serverFolders.indexOf(folder)
                          const mapping = folderMappings[globalIdx]
                          return (
                            <FolderMappingRow
                              key={folder.id}
                              folder={folder}
                              mapping={mapping}
                              onToggle={() => toggleFolder(globalIdx)}
                              onUpdateName={(name) => updateAppFolderName(globalIdx, name)}
                              onToggleSync={() => toggleBidirectionalSync(globalIdx)}
                            />
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Nested Folders */}
                {groupedFolders.nested.length > 0 && (
                  <div>
                    <button
                      onClick={() => setExpandedSections(prev => ({ ...prev, nested: !prev.nested }))}
                      className="flex items-center gap-2 font-semibold text-sm text-muted-foreground hover:text-foreground mb-2"
                    >
                      {expandedSections.nested ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      Nested Folders ({groupedFolders.nested.length})
                    </button>
                    {expandedSections.nested && (
                      <div className="space-y-2">
                        {groupedFolders.nested.map((folder) => {
                          const globalIdx = serverFolders.indexOf(folder)
                          const mapping = folderMappings[globalIdx]
                          return (
                            <FolderMappingRow
                              key={folder.id}
                              folder={folder}
                              mapping={mapping}
                              onToggle={() => toggleFolder(globalIdx)}
                              onUpdateName={(name) => updateAppFolderName(globalIdx, name)}
                              onToggleSync={() => toggleBidirectionalSync(globalIdx)}
                              isNested
                            />
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Info Alert */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Tip:</strong> Two-way sync keeps your app and email server in sync.
                Changes made in the app will reflect on the server and vice versa.
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" onClick={onClose} disabled={saving}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveAndSync}
                disabled={saving || selectedCount === 0}
                className="gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Syncing {selectedCount} folders...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Save & Sync {selectedCount} Folders
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// =============================================================================
// FOLDER MAPPING ROW COMPONENT
// =============================================================================

interface FolderMappingRowProps {
  folder: ServerFolder
  mapping: FolderMapping
  onToggle: () => void
  onUpdateName: (name: string) => void
  onToggleSync: () => void
  isNested?: boolean
}

function FolderMappingRow({
  folder,
  mapping,
  onToggle,
  onUpdateName,
  onToggleSync,
  isNested = false
}: FolderMappingRowProps) {
  return (
    <div
      className={cn(
        "border rounded-lg p-4 space-y-3",
        mapping?.enabled ? "bg-background" : "bg-muted/50"
      )}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={mapping?.enabled}
          onChange={onToggle}
          className="mt-1 h-4 w-4"
        />

        <div className="flex-1 space-y-2">
          {/* Folder Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{folder.displayName}</span>
              {folder.attributes.includes('inbox') && (
                <Badge variant="secondary" className="text-xs">System</Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{folder.totalCount} emails</span>
              {folder.unreadCount > 0 && (
                <Badge variant="default" className="text-xs">
                  {folder.unreadCount} unread
                </Badge>
              )}
            </div>
          </div>

          {/* Mapping Configuration */}
          {mapping?.enabled && (
            <div className="space-y-2 pl-6 pt-2 border-l-2 border-muted">
              {/* Rename */}
              <div className="flex items-center gap-3">
                <Label className="text-xs text-muted-foreground w-24">Show as:</Label>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm text-muted-foreground">{folder.displayName}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Input
                    value={mapping.appFolderName}
                    onChange={(e) => onUpdateName(e.target.value)}
                    className="h-8 text-sm max-w-xs"
                    placeholder="Folder name in app"
                  />
                </div>
              </div>

              {/* Bidirectional Sync */}
              <div className="flex items-center gap-3">
                <Label className="text-xs text-muted-foreground w-24">Sync mode:</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={mapping.bidirectionalSync}
                    onChange={onToggleSync}
                    className="h-4 w-4"
                  />
                  <Label className="text-sm cursor-pointer">
                    Two-way sync (changes sync back to server)
                  </Label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

