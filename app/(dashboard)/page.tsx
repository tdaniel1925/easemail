export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your email dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-category-social/20 p-3">
              <span className="text-2xl">📧</span>
            </div>
            <div>
              <p className="text-2xl font-bold">29</p>
              <p className="text-sm text-muted-foreground">New Emails</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-category-important/20 p-3">
              <span className="text-2xl">📬</span>
            </div>
            <div>
              <p className="text-2xl font-bold">547</p>
              <p className="text-sm text-muted-foreground">Unread Emails</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-category-updates/20 p-3">
              <span className="text-2xl">⭐</span>
            </div>
            <div>
              <p className="text-2xl font-bold">431</p>
              <p className="text-sm text-muted-foreground">Updates</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-category-promotion/20 p-3">
              <span className="text-2xl">📥</span>
            </div>
            <div>
              <p className="text-2xl font-bold">762</p>
              <p className="text-sm text-muted-foreground">Important</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-muted-foreground">Email activity will appear here...</p>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <p className="text-muted-foreground">Quick action buttons will appear here...</p>
        </div>
      </div>
    </div>
  )
}

