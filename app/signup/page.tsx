"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, BookOpen, Building2, CheckCircle, Lock, Mail, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface School {
  _id: string
  name: string
  code: string
  type: string
  board: string
}

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    schoolCode: "",
    schoolId: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [schools, setSchools] = useState<School[]>([])
  const [verifiedSchool, setVerifiedSchool] = useState<School | null>(null)
  const [verifyingCode, setVerifyingCode] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSchools()
  }, [])

  const fetchSchools = async () => {
    try {
      const res = await fetch('/api/schools')
      if (res.ok) {
        const data = await res.json()
        if (data.schools && data.schools.length > 0) {
          setSchools(data.schools)
        } else {
          setError('No schools found. Please contact your administrator or use the school registration page.')
        }
      } else {
        setError('Unable to load schools. Please refresh the page or contact support.')
      }
    } catch (error) {
      console.error('Error fetching schools:', error)
      setError('Network error. Please check your connection and try again.')
    }
  }

  const verifySchoolCode = async (code: string) => {
    if (!code || code.length < 4) {
      setVerifiedSchool(null)
      return
    }

    setVerifyingCode(true)
    try {
      const res = await fetch(`/api/schools?code=${code.toUpperCase()}`)
      if (res.ok) {
        const data = await res.json()
        setVerifiedSchool(data.school)
        setFormData(prev => ({ ...prev, schoolId: data.school._id }))
      } else {
        setVerifiedSchool(null)
        setFormData(prev => ({ ...prev, schoolId: "" }))
      }
    } catch (error) {
      console.error('Error verifying school code:', error)
      setVerifiedSchool(null)
    } finally {
      setVerifyingCode(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        setIsLoading(false)
        return
      }
      
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long')
        setIsLoading(false)
        return
      }
      
      // Validate school for all users (students, teachers, principals)
      if (!formData.schoolId) {
        setError('Please select or verify your school before proceeding')
        setIsLoading(false)
        return
      }

      const res = await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'student', // Always student for self-registration
          schoolId: formData.schoolId,
        }),
      })
      
      const data = await res.json()
      
      if (!res.ok || !data.success) {
        setError(data.error || 'Registration failed. Please try again.')
        setIsLoading(false)
        return
      }
      
      // Success - redirect to dashboard
      const role = data?.data?.role ?? "student"
      window.location.href = `/${role}/dashboard`
    } catch (err: any) {
      console.error('Signup error:', err)
      setError(err.message || 'Network error. Please check your connection and try again.')
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4 animate-fadeIn">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-xl">EB</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Join EduBridge AI</h1>
          <p className="text-muted-foreground">Create your account to start learning smarter</p>
        </div>

        <Card className="p-6 border border-border shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 animate-slideInLeft">
                {error}
              </div>
            )}
            
            {/* Name Input */}
            <div className="space-y-2 animate-slideInLeft" style={{ animationDelay: "0.1s" }}>
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-muted/50"
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2 animate-slideInLeft" style={{ animationDelay: "0.2s" }}>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-muted/50"
              />
            </div>

            {/* Info Message - Students Only */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 animate-slideInLeft" style={{ animationDelay: "0.3s" }}>
              <p className="font-semibold mb-1">Student Registration</p>
              <p className="text-xs">Teachers and principals must be added by school administrators. Only students can self-register.</p>
            </div>

            {/* School Selection */}
            {(
              <div className="space-y-3 animate-slideInLeft" style={{ animationDelay: "0.35s" }}>
                <Label className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  Select Your School
                </Label>
                
                {/* School Dropdown */}
                <select
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  value={formData.schoolId}
                  onChange={(e) => {
                    const school = schools.find(s => s._id === e.target.value)
                    setFormData({ ...formData, schoolId: e.target.value, schoolCode: school?.code || "" })
                    setVerifiedSchool(school || null)
                  }}
                >
                  <option value="">-- Select School --</option>
                  {schools.map((school) => (
                    <option key={school._id} value={school._id}>
                      {school.name} ({school.code}) - {school.type}
                    </option>
                  ))}
                </select>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-card text-muted-foreground">Or enter school code</span>
                  </div>
                </div>

                {/* School Code Input */}
                <div className="relative">
                  <Input
                    placeholder="Enter school code (e.g., SCH001)"
                    value={formData.schoolCode}
                    onChange={(e) => {
                      const code = e.target.value.toUpperCase()
                      setFormData({ ...formData, schoolCode: code })
                      verifySchoolCode(code)
                    }}
                    maxLength={10}
                    className="bg-muted/50 pr-10"
                  />
                  {verifyingCode && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  {verifiedSchool && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>

                {verifiedSchool && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-green-900">{verifiedSchool.name}</p>
                        <p className="text-green-700">{verifiedSchool.type} • {verifiedSchool.board}</p>
                      </div>
                    </div>
                  </div>
                )}

                {formData.schoolCode && !verifiedSchool && !verifyingCode && (
                  <p className="text-xs text-red-500">Invalid school code. Please check and try again.</p>
                )}
              </div>
            )}

            {/* Password Input */}
            <div className="space-y-2 animate-slideInLeft" style={{ animationDelay: "0.4s" }}>
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Confirm Password Input */}
            <div className="space-y-2 animate-slideInLeft" style={{ animationDelay: "0.5s" }}>
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="bg-muted/50"
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 text-sm animate-slideInLeft" style={{ animationDelay: "0.6s" }}>
              <input type="checkbox" className="mt-1 rounded" required />
              <span className="text-muted-foreground">
                I agree to the{" "}
                <Link href="#" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full animate-slideInLeft"
              style={{ animationDelay: "0.7s" }}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or sign up with</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3 animate-slideInLeft" style={{ animationDelay: "0.8s" }}>
            <Button variant="outline" className="w-full bg-transparent">
              Google
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              GitHub
            </Button>
          </div>
        </Card>

        {/* Sign In Link */}
        <p
          className="text-center text-sm text-muted-foreground mt-6 animate-slideInLeft"
          style={{ animationDelay: "0.9s" }}
        >
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
