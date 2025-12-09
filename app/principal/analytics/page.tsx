"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookOpen, GraduationCap, TrendingUp, Trophy, Users } from "lucide-react"
import { useEffect, useState } from "react"

interface Stats {
  totalStudents: number
  totalTeachers: number
  totalClasses: number
  totalCourses: number
  schoolName: string
  schoolCode: string
}

interface AttendanceStats {
  totalRecords: number
  presentCount: number
  absentCount: number
  lateCount: number
  attendanceRate: number
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [attendance, setAttendance] = useState<AttendanceStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const [statsRes, attendanceRes] = await Promise.all([
        fetch('/api/principal/stats'),
        fetch('/api/principal/attendance')
      ])

      const statsData = await statsRes.json()
      const attendanceData = await attendanceRes.json()

      if (statsData.success) {
        setStats(statsData.stats)
      }

      if (attendanceData.success && attendanceData.attendance) {
        const records = attendanceData.attendance
        const present = records.filter((r: any) => r.status === 'Present').length
        const absent = records.filter((r: any) => r.status === 'Absent').length
        const late = records.filter((r: any) => r.status === 'Late').length
        const total = records.length
        const rate = total > 0 ? ((present + late) / total * 100).toFixed(2) : 0

        setAttendance({
          totalRecords: total,
          presentCount: present,
          absentCount: absent,
          lateCount: late,
          attendanceRate: Number(rate)
        })
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">School performance insights</p>
          </div>
        </div>
        <Card className="p-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">School performance insights</p>
        </div>
        <Button>Export Data</Button>
      </div>

      {stats && (
        <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <h2 className="text-2xl font-bold mb-2">{stats.schoolName}</h2>
          <p className="text-blue-100">School Code: {stats.schoolCode}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.totalStudents || 0}</p>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <GraduationCap className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.totalTeachers || 0}</p>
              <p className="text-sm text-muted-foreground">Total Teachers</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <BookOpen className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.totalClasses || 0}</p>
              <p className="text-sm text-muted-foreground">Total Classes</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <Trophy className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.totalCourses || 0}</p>
              <p className="text-sm text-muted-foreground">Active Courses</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Attendance Overview
          </h3>
          {attendance ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Attendance Rate</span>
                <span className="text-2xl font-bold text-green-600">{attendance.attendanceRate}%</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Present</span>
                  <span className="font-medium text-green-600">{attendance.presentCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Late</span>
                  <span className="font-medium text-yellow-600">{attendance.lateCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Absent</span>
                  <span className="font-medium text-red-600">{attendance.absentCount}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="text-muted-foreground">Total Records</span>
                  <span className="font-medium">{attendance.totalRecords}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No attendance data available</p>
          )}
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-orange-500" />
            Performance Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Average Attendance</span>
              <span className="text-lg font-semibold">{attendance?.attendanceRate || 0}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Student-Teacher Ratio</span>
              <span className="text-lg font-semibold">
                {stats && stats.totalTeachers > 0 
                  ? Math.round(stats.totalStudents / stats.totalTeachers) 
                  : 0}:1
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Classes per Grade</span>
              <span className="text-lg font-semibold">
                {stats && stats.totalClasses > 0 ? Math.round(stats.totalClasses / 4) : 0}
              </span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-500" />
            Teacher Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Teachers</span>
              <span className="text-lg font-semibold">{stats?.totalTeachers || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Classes Managed</span>
              <span className="text-lg font-semibold">{stats?.totalClasses || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Courses</span>
              <span className="text-lg font-semibold">{stats?.totalCourses || 0}</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-500" />
            Student Progress
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Enrolled</span>
              <span className="text-lg font-semibold">{stats?.totalStudents || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Average per Class</span>
              <span className="text-lg font-semibold">
                {stats && stats.totalClasses > 0 
                  ? Math.round(stats.totalStudents / stats.totalClasses) 
                  : 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Course Enrollments</span>
              <span className="text-lg font-semibold">{stats?.totalCourses || 0}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
