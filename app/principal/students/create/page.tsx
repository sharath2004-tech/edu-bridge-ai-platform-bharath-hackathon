"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface Class {
  _id: string
  className: string
  section: string
}

export default function EnrollStudentPage() {
  const router = useRouter()
  const [classes, setClasses] = useState<Class[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    classId: "",
    rollNumber: "",
    bio: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/principal/classes')
      const data = await res.json()
      if (data.success) {
        setClasses(data.classes || [])
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setError(null)
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Validate
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const selectedClass = classes.find(c => c._id === formData.classId)
      if (!selectedClass) {
        setError("Please select a class")
        setIsLoading(false)
        return
      }

      const res = await fetch("/api/principal/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
          className: selectedClass.className,
          section: selectedClass.section,
          rollNumber: formData.rollNumber || undefined,
          bio: formData.bio || undefined
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to enroll student")
        setIsLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/principal/students")
      }, 2000)

    } catch (err: any) {
      setError(err.message || "An error occurred")
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Student Enrolled!</h2>
          <p className="text-muted-foreground">
            Student has been enrolled successfully. Redirecting...
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/principal/students">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Students
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Enroll New Student</h1>
        <p className="text-muted-foreground">Add a new student to your school</p>
      </div>

      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@school.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="classId">Class & Section *</Label>
              <select
                id="classId"
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Select class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.className} - Section {cls.section}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Don't see your class? <a href="/principal/classes" className="text-primary hover:underline">Create it first</a>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input
                id="rollNumber"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="001"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Additional Information</Label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Any additional information about the student..."
              className="w-full px-3 py-2 border rounded-lg min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Enrolling..." : "Enroll Student"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
