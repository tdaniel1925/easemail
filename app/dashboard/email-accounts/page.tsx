"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Mail,
  Plus,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Star
} from "lucide-react"
import { cn } from "@/lib/utils"

interface EmailAccount {
  id: string
  email_address: string
  provider: string
  status: "active" | "syncing" | "error" | "disconnected"
  last_synced_at: string | null
  is_default: boolean
  folderCount: number
  emailCount: number
}

export default function EmailAccountsPage() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<EmailAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState<string | null>(null)

  useEffect(() => {
    loadAccounts()
  }, [])

  async function loadAccounts() {
    try {
      const response = await fetch('/api/emails/accounts')
      const data = await response.json()
      setAccounts(data.accounts || [])
    } catch (error) {
      console.error('Failed to load accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddAccount() {
    router.push('/api/nylas/auth')
  }

  async function handleSync(accountId: string) {
    setSyncing(accountId)
    try {
      await fetch(`/api/emails/accounts/${accountId}/sync`, {
        method: 'POST'
      })
      await loadAccounts()
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setSyncing(null)
    }
  }

  async function handleDisconnect(accountId: string) {
    if (!confirm('Are you sure you want to disconnect this account? All synced emails will be deleted.')) return

    try {
      await fetch(`/api/emails/accounts/${accountId}`, {
        method: 'DELETE'
      })
      await loadAccounts()
    } catch (error) {
      console.error('Failed to disconnect:', error)
    }
  }

  async function handleSetDefault(accountId: string) {
    try {
      await fetch(`/api/emails/accounts/${accountId}/set-default`, {
        method: 'POST'
      })
      await loadAccounts()
    } catch (error) {
      console.error('Failed to set default:', error)
    }
  }

  function getProviderIcon(provider: string) {
    switch (provider.toLowerCase()) {
      case 'google':
        return '📧'
      case 'microsoft':
        return '📨'
      case 'imap':
        return '✉️'
      default:
        return '📬'
    }
  }

  function formatLastSynced(lastSyncedAt: string | null) {
    if (!lastSyncedAt) return 'Never'
    const date = new Date(lastSyncedAt)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Accounts</h1>
          <p className="text-muted-foreground">
            Manage your connected email accounts
          </p>
        </div>
        <Button onClick={handleAddAccount} size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Email Account
        </Button>
      </div>

      {/* Connected Accounts */}
      {accounts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Email Accounts Connected</h3>
            <p className="text-muted-foreground mb-4 text-center">
              Connect your first email account to start syncing your emails
            </p>
            <Button onClick={handleAddAccount} className="gap-2">
              <Plus className="h-4 w-4" />
              Connect Email Account
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-lg">
                        {getProviderIcon(account.provider)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{account.email_address}</CardTitle>
                        {account.is_default && (
                          <Badge variant="default" className="gap-1">
                            <Star className="h-3 w-3" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <span className="capitalize">{account.provider}</span>
                        <span>•</span>
                        <span>{account.folderCount} folders</span>
                        <span>•</span>
                        <span>{account.emailCount} emails</span>
                      </CardDescription>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <Badge
                    variant={
                      account.status === 'active' ? 'default' :
                      account.status === 'syncing' ? 'secondary' :
                      'destructive'
                    }
                    className="gap-1"
                  >
                    {account.status === 'active' && <CheckCircle2 className="h-3 w-3" />}
                    {account.status === 'syncing' && <RefreshCw className="h-3 w-3 animate-spin" />}
                    {account.status === 'error' && <AlertCircle className="h-3 w-3" />}
                    {account.status === 'active' ? 'Active' :
                     account.status === 'syncing' ? 'Syncing' :
                     account.status === 'error' ? 'Error' :
                     'Disconnected'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Last synced: {formatLastSynced(account.last_synced_at)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!account.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(account.id)}
                      >
                        Set as Default
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSync(account.id)}
                      disabled={syncing === account.id || account.status === 'syncing'}
                      className="gap-2"
                    >
                      <RefreshCw className={cn(
                        "h-4 w-4",
                        (syncing === account.id || account.status === 'syncing') && "animate-spin"
                      )} />
                      Sync Now
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(account.id)}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Disconnect
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

