"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    BookOpen,
    Building2,
    CheckCircle,
    GraduationCap,
    Mail,
    MapPin,
    Phone,
    Users,
    XCircle
} from "lucide-react"
import { useEffect, useState } from "react"

interface School {
  _id: string
  name: string
  code: string
  email: string
  phone?: string
  address: {
    city: string
    state: string
    country: string
  }
  type: string
  board?: string
  isActive: boolean
  subscription?: {
    plan: string
    maxStudents?: number
    maxTeachers?: number
  }
  stats?: {
    totalStudents: number
    totalTeachers: number
    totalCourses: number
  }
  createdAt: string
}

export default function AdminSchoolsPage() {
  const [school, setSchool] = useState<School | null>(null)
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalPrincipals: 0, totalCourses: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchool()
  }, [])

  const fetchSchool = async () => {
    try {
      const res = await fetch('/api/admin/schools')
      if (res.ok) {
        const data = await res.json()
        setSchool(data.school)
        setStats(data.stats || { totalStudents: 0, totalTeachers: 0, totalPrincipals: 0, totalCourses: 0 })
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (!school) {
    return <div className="p-8">No school assigned to this account.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My School</h1>
          <p className="text-muted-foreground mt-2">
            Manage your school information and users
          </p>
        </div>
      </div>

      {/* School Information Card */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-4 flex-1">
              <div>
                <h2 className="text-2xl font-bold">{school.name}</h2>
                <p className="text-muted-foreground">School Code: {school.code}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{school.email}</span>
                </div>
                {school.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{school.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{school.address.city}, {school.address.state}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{school.type} • {school.board}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={school.isActive ? "default" : "secondary"}>
                  {school.isActive ? (
                    <>
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-1 h-3 w-3" />
                      Inactive
                    </>
                  )}
                </Badge>
                <Badge variant="outline">
                  {school.subscription?.plan || 'Free'} Plan
                </Badge>
              </div>
            </div>
          </div>

          {/* School Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalPrincipals || 0}</div>
              <div className="text-sm text-muted-foreground">Principals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalTeachers}</div>
              <div className="text-sm text-muted-foreground">Teachers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalStudents}</div>
              <div className="text-sm text-muted-foreground">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalCourses}</div>
              <div className="text-sm text-muted-foreground">Courses</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-6 border-t">
            <h3 className="text-sm font-semibold mb-3">Manage Users</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/users?role=principal'}>
                <Users className="mr-2 h-4 w-4" />
                Manage Principals
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/users?role=teacher'}>
                <GraduationCap className="mr-2 h-4 w-4" />
                Manage Teachers
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/users?role=student'}>
                <BookOpen className="mr-2 h-4 w-4" />
                Manage Students
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
