"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function CreateTeacherPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    assignedClasses: "" as string,
    assignedSubjects: "",
    bio: ""
  })
  const [classes, setClasses] = useState<any[]>([])
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
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
      console.error('Failed to fetch classes:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      // Use selectedClasses array directly
      const assignedClasses = selectedClasses

      const assignedSubjects = formData.assignedSubjects
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0)

      const res = await fetch("/api/principal/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
          assignedClasses,
          assignedSubjects,
          bio: formData.bio || undefined
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to create teacher account")
        setIsLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/principal/teachers")
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
          <h2 className="text-2xl font-bold mb-2">Teacher Created!</h2>
          <p className="text-muted-foreground">
            Teacher account has been created successfully. Redirecting...
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/principal/teachers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teachers
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Create Teacher Account</h1>
        <p className="text-muted-foreground">Add a new teacher to your school</p>
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
                placeholder="John Doe"
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
                placeholder="teacher@school.com"
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

          <div className="space-y-2">
            <Label>Assigned Classes {classes.length > 0 && '*'}</Label>
            {classes.length === 0 ? (
              <p className="text-sm text-muted-foreground p-3 border rounded-lg">
                No classes available. Please create classes first.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-lg max-h-60 overflow-y-auto">
                {classes.map((cls) => {
                  const classLabel = `${cls.className} - ${cls.section}`
                  return (
                    <label key={cls._id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedClasses.includes(cls.className)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            // Add the className if not already present
                            if (!selectedClasses.includes(cls.className)) {
                              setSelectedClasses([...selectedClasses, cls.className])
                            }
                          } else {
                            // Remove className only if no other section uses it
                            const hasOtherSections = classes.some(
                              c => c.className === cls.className && c._id !== cls._id && selectedClasses.includes(c.className)
                            )
                            if (!hasOtherSections) {
                              setSelectedClasses(selectedClasses.filter(c => c !== cls.className))
                            }
                          }
                        }}
                            className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm">{classLabel}</span>
                    </label>
                  )
                })}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Select one or more classes
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedSubjects">Assigned Subjects *</Label>
            <Input
              id="assignedSubjects"
              name="assignedSubjects"
              value={formData.assignedSubjects}
              onChange={handleChange}
              placeholder="Mathematics, Physics, Chemistry (comma separated)"
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter subject names separated by commas
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio / Additional Info</Label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Brief description about the teacher..."
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
              {isLoading ? "Creating..." : "Create Teacher"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
