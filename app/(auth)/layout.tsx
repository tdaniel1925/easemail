import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 via-category-social/10 to-category-promotion/10 items-center justify-center p-12">
        <div className="max-w-md text-center space-y-6">
          <h1 className="text-4xl font-bold text-foreground">
            Welcome to EaseMail
          </h1>
          <p className="text-lg text-muted-foreground">
            AI-powered email management that transforms the way you communicate.
          </p>
          <div className="flex items-center justify-center gap-4 pt-8">
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-category-important/20 flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <span className="text-sm font-medium">AI Powered</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-category-social/20 flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <span className="text-sm font-medium">Lightning Fast</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-category-promotion/20 flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <span className="text-sm font-medium">Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


