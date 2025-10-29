import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Star, Archive, Flag, MessageSquare, Paperclip } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Top Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* New Emails */}
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-purple-100 dark:bg-purple-900/20 p-4">
              <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-3xl font-bold">29</p>
              <p className="text-sm text-muted-foreground">New Emails</p>
            </div>
          </div>
        </div>

        {/* Unread Emails */}
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-pink-100 dark:bg-pink-900/20 p-4">
              <Mail className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-3xl font-bold">547</p>
              <p className="text-sm text-muted-foreground">Unread Emails</p>
            </div>
          </div>
        </div>

        {/* Updates */}
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-orange-100 dark:bg-orange-900/20 p-4">
              <Star className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-3xl font-bold">431</p>
              <p className="text-sm text-muted-foreground">Updates</p>
            </div>
          </div>
        </div>

        {/* Important */}
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-blue-100 dark:bg-blue-900/20 p-4">
              <Flag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-3xl font-bold">762</p>
              <p className="text-sm text-muted-foreground">Important</p>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="rounded-xl border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl font-bold">Try our new mail composing interface</h2>
            <p className="text-muted-foreground">
              We have many new updates to our composing method. More faster, secure and easy to use!
            </p>
            <Button className="mt-4">OK! Take me there</Button>
          </div>
          <div className="hidden lg:block text-8xl">🚀</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Emails - Takes 2 columns */}
        <div className="lg:col-span-2 rounded-xl border bg-card">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Recent Emails</h2>
                <p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 mb-4 border-b">
              <button className="pb-2 px-1 border-b-2 border-primary text-primary font-medium text-sm">
                Important
              </button>
              <button className="pb-2 px-1 text-muted-foreground hover:text-foreground text-sm">
                Socials
              </button>
              <button className="pb-2 px-1 text-muted-foreground hover:text-foreground text-sm">
                Promotion
              </button>
            </div>

            {/* Email List */}
            <div className="space-y-4">
              {[
                {
                  sender: "joannahistep@gmail.com",
                  time: "Yesterday, at 11:24 AM",
                  subject: "Dont forget to save your work after 10 min",
                  preview: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ...",
                  starred: false,
                },
                {
                  sender: "kevinhard@mail.com",
                  time: "24 min ago",
                  subject: "How to manage your working time in this pandemic",
                  preview: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ...",
                  starred: true,
                },
                {
                  sender: "machelgreen@gmail.com",
                  time: "October 25th, 2020  08:55 AM",
                  subject: "Important Document from Government",
                  preview: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ...",
                  starred: false,
                },
                {
                  sender: "jamesuproy@gmail.com",
                  time: "October 25th, 2020  08:55 AM",
                  subject: "Server Maintenance Informations",
                  preview: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ...",
                  starred: false,
                },
              ].map((email, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent/50 transition-colors group">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-muted">{email.sender[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">{email.sender}</p>
                      <span className="text-xs text-muted-foreground">• {email.time}</span>
                    </div>
                    <p className="font-semibold mb-1 text-sm">{email.subject}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{email.preview}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                      {email.starred ? (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <Star className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <Archive className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Most Tag Used */}
        <div className="rounded-xl border bg-card p-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">Most Tag Used</h2>
            <p className="text-sm text-muted-foreground mb-6">Lorem ipsum dolor sit amet</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">#business</span>
                <span className="text-sm text-muted-foreground">452 times</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "90%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">#meeting</span>
                <span className="text-sm text-muted-foreground">97 times</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "20%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">#corporate</span>
                <span className="text-sm text-muted-foreground">61 times</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "13%" }} />
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm font-medium mb-3">Others tag</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">#teamwork</Badge>
                <Badge variant="secondary" className="text-xs">#design</Badge>
                <Badge variant="secondary" className="text-xs">#projectmanagement</Badge>
                <Badge variant="secondary" className="text-xs">16+</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid - Charts and Contacts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pie Charts - Takes 2 columns */}
        <div className="lg:col-span-2 rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Pie Chart</h2>
            <div className="flex items-center gap-4 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                <span>Chart</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                <span className="text-primary">Show Value</span>
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Chart 1 - Invoices Made */}
            <div className="text-center space-y-4">
              <div className="relative w-36 h-36 mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="20"
                    className="text-secondary"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="20"
                    strokeDasharray="251"
                    strokeDashoffset="48"
                    className="text-primary"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">81%</span>
                </div>
              </div>
              <p className="text-sm font-medium">Invoices Made</p>
            </div>

            {/* Chart 2 - Projects Done */}
            <div className="text-center space-y-4">
              <div className="relative w-36 h-36 mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="20"
                    className="text-secondary"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="20"
                    strokeDasharray="251"
                    strokeDashoffset="95"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">62%</span>
                </div>
              </div>
              <p className="text-sm font-medium">Projects Done</p>
            </div>

            {/* Chart 3 - Clients Growth */}
            <div className="text-center space-y-4">
              <div className="relative w-36 h-36 mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="20"
                    className="text-secondary"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="20"
                    strokeDasharray="251"
                    strokeDashoffset="196"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">22%</span>
                </div>
              </div>
              <p className="text-sm font-medium">Clients Growth</p>
            </div>
          </div>

          {/* Email Summary & Best Tips */}
          <div className="grid md:grid-cols-2 gap-8 pt-6 border-t">
            <div>
              <h3 className="text-lg font-semibold mb-2">Email Summary</h3>
              <p className="text-sm text-muted-foreground mb-6">Lorem ipsum dolor sit</p>
              
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#ef4444" strokeWidth="12" strokeDasharray="220" strokeDashoffset="20" />
                  <circle cx="50" cy="50" r="25" fill="none" stroke="#a855f7" strokeWidth="12" strokeDasharray="157" strokeDashoffset="40" />
                  <circle cx="50" cy="50" r="15" fill="none" stroke="#ec4899" strokeWidth="12" strokeDasharray="94" strokeDashoffset="10" />
                </svg>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-pink-500" />
                    <span className="text-sm">Visitors</span>
                  </div>
                  <span className="font-semibold">45,215</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    <span className="text-sm">Clicked</span>
                  </div>
                  <span className="font-semibold">245</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-sm">Contact</span>
                  </div>
                  <span className="font-semibold">672</span>
                </div>
              </div>
            </div>

            {/* Best Tips */}
            <div className="flex flex-col justify-center">
              <h3 className="text-lg font-semibold mb-2">Best tips increase management</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
              </p>
              <Button variant="outline" className="w-fit">Learn More</Button>
            </div>
          </div>
        </div>

        {/* Contacts Widget */}
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Contacts</h2>
              <p className="text-sm text-muted-foreground">You have 456 contacts</p>
            </div>
            <Button size="sm" className="h-8 w-8 p-0">+</Button>
          </div>

          <div className="space-y-4">
            {[
              { name: "Angela Moss", role: "Marketing Manager", avatar: "AM" },
              { name: "Andy Law", role: "Graphic Designer", avatar: "AL" },
              { name: "Benny Kenn", role: "Software Engineer", avatar: "BK" },
              { name: "Chyntia Lawra", role: "CEO", avatar: "CL" },
              { name: "Della Samantha", role: "Head Manager", avatar: "DS" },
              { name: "Evans John", role: "Programmer", avatar: "EJ" },
            ].map((contact, idx) => (
              <div key={idx} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-sm">{contact.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.role}</p>
                  </div>
                </div>
                <button className="text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                  <MessageSquare className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-6">
            View More
          </Button>
        </div>
      </div>
    </div>
  )
}
