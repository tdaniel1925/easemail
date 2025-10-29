"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InlineAlert, InlineAlertDescription } from "@/components/ui/inline-alert"
import { Mail, User, Lock, Loader2 } from "lucide-react"

export default function SignupPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const validateUsername = (value: string) => {
    if (value.length < 3) return "Username must be at least 3 characters"
    if (value.length > 20) return "Username must be less than 20 characters"
    if (!/^[a-z0-9_]+$/.test(value)) return "Username can only contain lowercase letters, numbers, and underscores"
    return ""
  }

  const checkUsernameAvailability = async (value: string) => {
    if (!value || validateUsername(value)) return

    setIsCheckingUsername(true)
    try {
      const { data, error } = await supabase
        .rpc('check_username_available', { username_to_check: value })

      if (error) throw error

      if (!data) {
        setUsernameError("Username is already taken")
      } else {
        setUsernameError("")
      }
    } catch (err) {
      console.error("Error checking username:", err)
    } finally {
      setIsCheckingUsername(false)
    }
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase()
    setUsername(value)
    const validationError = validateUsername(value)
    setUsernameError(validationError)
    
    if (!validationError && value.length >= 3) {
      checkUsernameAvailability(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (usernameError) {
      setError("Please fix the username error")
      return
    }

    if (!username || !email || !password) {
      setError("All fields are required")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      })

      if (error) throw error

      if (data.user) {
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during signup")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-muted-foreground">
          Enter your details to get started with EaseMail
        </p>
      </div>

      {error && (
        <InlineAlert variant="error" onDismiss={() => setError("")}>
          <InlineAlertDescription>{error}</InlineAlertDescription>
        </InlineAlert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="username"
              placeholder="john_doe"
              value={username}
              onChange={handleUsernameChange}
              className="pl-10"
              disabled={isLoading}
              required
            />
            {isCheckingUsername && (
              <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
          {usernameError && (
            <p className="text-sm text-destructive">{usernameError}</p>
          )}
          {username && !usernameError && !isCheckingUsername && (
            <p className="text-sm text-green-600">Username is available!</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Sign up"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}


