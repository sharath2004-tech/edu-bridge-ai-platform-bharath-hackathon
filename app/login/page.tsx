"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OfflineAuth } from "@/lib/offline-auth"
import { AlertTriangle, ArrowLeft, Lock, Mail, WifiOff } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

function LoginForm() {
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect')
  const errorParam = searchParams.get('error')
  
  const [schoolCode, setSchoolCode] = useState("")
  const [identifier, setIdentifier] = useState("") // Can be email or roll number
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showSchools, setShowSchools] = useState(false)
  const [schools, setSchools] = useState<any[]>([])
  const [error, setError] = useState("")
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    if (errorParam === 'unauthorized') {
      setError('You do not have permission to access that page.')
    }
    fetchSchools()
    
    // Check offline status only on client
    if (typeof navigator !== 'undefined') {
      setIsOffline(!navigator.onLine)
      
      const handleOnline = () => setIsOffline(false)
      const handleOffline = () => setIsOffline(true)
      
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
      
      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }
  }, [errorParam])

  const fetchSchools = async () => {
    try {
      const res = await fetch('/api/schools')
      const data = await res.json()
      if (data.success) {
        setSchools(data.schools || [])
      }
    } catch (error) {
      console.error('Failed to fetch schools:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      // Build request body - don't send schoolCode for super admin
      const requestBody: any = {
        identifier, 
        password, 
        selectedRole: selectedRole || undefined 
      }
      
      // Only include schoolCode for non-super-admin users
      if (selectedRole !== 'super-admin') {
        requestBody.schoolCode = schoolCode.toUpperCase()
      }
      
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        credentials: 'include', // Important for cookies
      })

      const data = await res.json()
      
      if (!res.ok) {
        setError(data?.error || 'Login failed. Please check your credentials.')
        setIsLoading(false)
        return
      }
      
      if (data.success) {
        // Cache session for offline access
        if (data?.data) {
          OfflineAuth.cacheSession({
            userId: data.data.id || data.data._id,
            role: data.data.role,
            name: data.data.name || data.data.fullName || identifier,
            email: data.data.email,
            schoolCode: schoolCode || data.data.schoolCode
          })
        }

        // Check if user must change password (temporary password)
        if (data?.data?.mustChangePassword) {
          window.location.href = '/change-password'
          return
        }

        const role = data?.data?.role ?? "student"
        // Redirect to original destination or dashboard
        if (redirectUrl && !redirectUrl.includes('/login')) {
          window.location.href = redirectUrl
        } else if (role === 'super-admin') {
          window.location.href = '/super-admin/dashboard'
        } else if (role === 'admin') {
          window.location.href = '/admin/dashboard'
        } else {
          window.location.href = `/${role}/dashboard`
        }
      } else {
        setError(data?.error || 'Login failed')
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Login error:', err)
      
      // If network error and offline, redirect to offline login
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        window.location.href = '/offline-login'
        return
      }
      
      setError('Network error. Please check your connection and try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-primary-foreground font-bold text-xl">EB</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
        <p className="text-muted-foreground">Sign in to continue learning with EduBridge AI</p>
      </div>

      {errorParam === 'unauthorized' && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2 text-amber-600 text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>You need to sign in with the correct account to access that page.</span>
        </div>
      )}

      <Card className="p-6 border border-border shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div className="space-y-2 animate-slideInLeft" style={{ animationDelay: "0.05s" }}>
            <Label htmlFor="role" className="flex items-center gap-2">
              <span className="text-primary">👤</span>
              Login As
            </Label>
            <select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="">Select Your Role</option>
              <option value="super-admin">Super Administrator</option>
              <option value="admin">Administrator</option>
              <option value="principal">Principal / Head of School</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>

          {/* School Code Input - Hidden for Super Admin */}
          {selectedRole !== 'super-admin' && (
          <div className="space-y-2 animate-slideInLeft" style={{ animationDelay: "0.08s" }}>
            <div className="flex items-center justify-between">
              <Label htmlFor="schoolCode" className="flex items-center gap-2">
                <span className="text-primary">🏫</span>
                School Code
              </Label>
              <button
                type="button"
                onClick={() => setShowSchools(!showSchools)}
                className="text-xs text-primary hover:underline"
              >
                {showSchools ? "Hide" : "View"} School Codes
              </button>
            </div>
            <Input
              id="schoolCode"
              type="text"
              placeholder="Enter school code (e.g., SCH001)"
              value={schoolCode}
              onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
              required
              className="bg-muted/50 uppercase"
            />
            {showSchools && schools.length > 0 && (
              <div className="mt-2 p-3 bg-muted/30 border border-border rounded-lg max-h-40 overflow-y-auto">
                <p className="text-xs font-medium mb-2 text-muted-foreground">Available School Codes:</p>
                <div className="space-y-1">
                  {schools.map((school) => (
                    <button
                      key={school._id}
                      type="button"
                      onClick={() => {
                        setSchoolCode(school.code)
                        setShowSchools(false)
                      }}
                      className="w-full text-left px-2 py-1 hover:bg-primary/10 rounded text-xs flex justify-between items-center group"
                    >
                      <span className="font-medium">{school.code}</span>
                      <span className="text-muted-foreground truncate ml-2">{school.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          )}

          {/* Email/ID Input */}
          <div className="space-y-2 animate-slideInLeft" style={{ animationDelay: "0.1s" }}>
            <Label htmlFor="identifier" className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Email or Roll Number
            </Label>
            <Input
              id="identifier"
              type="text"
              placeholder="you@example.com or 12345"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="bg-muted/50"
            />
          </div>

            {/* Password Input */}
            <div className="space-y-2 animate-slideInLeft" style={{ animationDelay: "0.2s" }}>
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-muted/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm animate-slideInLeft">
                {error}
              </div>
            )}

            {/* Remember & Forgot */}
            <div
              className="flex items-center justify-between text-sm animate-slideInLeft"
              style={{ animationDelay: "0.3s" }}
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <Link href="#" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full animate-slideInLeft"
              style={{ animationDelay: "0.4s" }}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3 animate-slideInLeft" style={{ animationDelay: "0.5s" }}>
            <Button variant="outline" className="w-full bg-transparent">
              Google
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              GitHub
            </Button>
          </div>

          {/* Offline Access Button */}
          {isOffline && (
            <div className="pt-4 border-t">
              <Link href="/offline-login">
                <Button variant="secondary" className="w-full gap-2">
                  <WifiOff className="w-4 h-4" />
                  Access Offline Content
                </Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Sign Up Link */}
        <p
          className="text-center text-sm text-muted-foreground mt-6 animate-slideInLeft"
          style={{ animationDelay: "0.6s" }}
        >
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4 animate-fadeIn">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </Link>
      
      <Suspense fallback={<div className="w-full max-w-md animate-pulse"><Card className="h-96" /></div>}>
        <LoginForm />
      </Suspense>
    </main>
  )
}
