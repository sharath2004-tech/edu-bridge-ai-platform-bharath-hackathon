"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BarChart3, BookOpen, Calendar, GraduationCap, Settings, UserPlus, Users } from "lucide-react"
import { useEffect, useState } from "react"

interface DashboardStats {
  totalStudents: number
  totalTeachers: number
  totalClasses: number
  totalCourses: number
}

interface RecentStudent {
  _id: string
  name: string
  email: string
  className?: string
  section?: string
  createdAt: string
}

export default function PrincipalDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalCourses: 0,
  })
  const [recentStudents, setRecentStudents] = useState<RecentStudent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const [statsRes, studentsRes] = await Promise.all([
        fetch('/api/principal/stats'),
        fetch('/api/principal/students')
      ])

      if (statsRes.ok) {
        const data = await statsRes.json()
        console.log('Stats response:', data)
        if (data.success && data.stats) {
          setStats(data.stats)
        }
      } else {
        console.error('Stats API failed:', statsRes.status, await statsRes.text())
      }

      if (studentsRes.ok) {
        const data = await studentsRes.json()
        console.log('Students response:', data)
        // Get the 5 most recent students
        const sorted = (data.students || []).sort((a: RecentStudent, b: RecentStudent) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setRecentStudents(sorted.slice(0, 5))
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Teachers",
      value: stats.totalTeachers,
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Classes",
      value: stats.totalClasses,
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Courses",
      value: stats.totalCourses,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  const quickActions = [
    {
      title: "Create Teacher Account",
      description: "Add a new teacher to your school",
      icon: UserPlus,
      href: "/principal/teachers/create",
      color: "text-green-600",
    },
    {
      title: "Enroll Student",
      description: "Add a new student to your school",
      icon: Users,
      href: "/principal/students/create",
      color: "text-blue-600",
    },
    {
      title: "View Analytics",
      description: "Check attendance, marks, and reports",
      icon: BarChart3,
      href: "/principal/analytics",
      color: "text-purple-600",
    },
    {
      title: "School Settings",
      description: "Update school information",
      icon: Settings,
      href: "/principal/settings",
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Principal Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your school, teachers, and students
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold mt-2">
                  {isLoading ? "..." : stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <a href={action.href} className="flex items-start gap-4">
                <div className={`p-3 rounded-lg bg-muted`}>
                  <action.icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </div>
              </a>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recently Enrolled Students</h2>
        <Card className="p-6">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading...</p>
          ) : recentStudents.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No students enrolled yet</p>
              <Button asChild className="mt-4">
                <a href="/principal/students/create">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Enroll First Student
                </a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-2 text-sm font-medium">Name</th>
                      <th className="text-left p-2 text-sm font-medium">Email</th>
                      <th className="text-left p-2 text-sm font-medium">Class</th>
                      <th className="text-left p-2 text-sm font-medium">Section</th>
                      <th className="text-left p-2 text-sm font-medium">Enrolled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentStudents.map((student) => (
                      <tr key={student._id} className="border-b hover:bg-muted/50">
                        <td className="p-2 text-sm font-medium">{student.name}</td>
                        <td className="p-2 text-sm text-muted-foreground">{student.email}</td>
                        <td className="p-2 text-sm">{student.className || '-'}</td>
                        <td className="p-2 text-sm">{student.section || '-'}</td>
                        <td className="p-2 text-sm text-muted-foreground">
                          {new Date(student.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <a href="/principal/students">
                  View All Students ({stats.totalStudents})
                </a>
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
