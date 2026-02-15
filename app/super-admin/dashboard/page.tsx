"use client"

import { SuperAdminAnalyticsChat } from '@/components/super-admin-analytics-chat'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Clock, GraduationCap, MapPin, UserCheck, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface DashboardStats {
  totalSchools: number
  activeSchools: number
  pendingSchools: number
  totalPrincipals: number
  totalTeachers: number
  totalStudents: number
}

interface School {
  _id: string
  name: string
  code: string
  type: string
  board?: string
  principal?: {
    name: string
    email: string
    phone?: string
  }
  address: {
    city: string
    state: string
  }
  createdAt: string
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/super-admin/dashboard')
      const data = await res.json()
      
      if (data.success) {
        setStats(data.stats)
        setSchools(data.recentSchools || [])
      } else {
        toast.error('Failed to load dashboard data')
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error)
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-20 bg-muted rounded-lg"></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-start justify-between animate-slideInBottom" style={{ animationFillMode: 'both' }}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Platform-wide overview and management
          </p>
        </div>
        {stats && stats.pendingSchools > 0 && (
          <Link href="/super-admin/pending-schools">
            <Card className="cursor-pointer hover:shadow-xl transition-all duration-500 border-orange-200 bg-orange-50 hover:bg-orange-100 hover:scale-105 animate-pulse-glow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center relative">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce-subtle">
                      {stats.pendingSchools}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-orange-600 font-medium uppercase">Pending Approval</p>
                    <p className="text-lg font-bold text-orange-700">Review Now</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group animate-slideInUp" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600 transition-transform duration-300 group-hover:scale-125" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold animate-countUp">{stats?.totalSchools || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.activeSchools || 0} active • {stats?.pendingSchools || 0} pending
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group animate-slideInUp" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Principals</CardTitle>
            <UserCheck className="h-4 w-4 text-purple-600 transition-transform duration-300 group-hover:scale-125" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold animate-countUp">{stats?.totalPrincipals || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              School administrators
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group animate-slideInUp" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <GraduationCap className="h-4 w-4 text-green-600 transition-transform duration-300 group-hover:scale-125" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold animate-countUp">{stats?.totalTeachers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all schools
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group animate-slideInUp" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-orange-600 transition-transform duration-300 group-hover:scale-125" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold animate-countUp">{stats?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Enrolled students
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Schools */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Active Schools</CardTitle>
              <CardDescription className="mt-1">
                Latest registered schools on the platform
              </CardDescription>
            </div>
            <Link href="/super-admin/schools">
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                View All
              </Badge>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {schools.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No schools registered yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {schools.map((school) => (
                <Link key={school._id} href={`/super-admin/schools`}>
                  <div className="flex items-start justify-between p-4 border rounded-lg hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{school.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {school.code}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{school.type}</span>
                          {school.board && (
                            <>
                              <span>•</span>
                              <span>{school.board}</span>
                            </>
                          )}
                        </div>
                        {school.principal && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            <span className="font-medium">Principal:</span> {school.principal.name}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{school.address.city}, {school.address.state}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Joined {new Date(school.createdAt).toLocaleDateString('en-IN', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks and reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/super-admin/schools" className="block group">
              <div className="p-4 border rounded-lg hover:shadow-md hover:border-blue-500 transition-all h-full">
                <Building2 className="h-8 w-8 mb-3 text-blue-600 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold mb-1">Manage Schools</h4>
                <p className="text-sm text-muted-foreground">View and manage all schools</p>
              </div>
            </Link>
            
            <Link href="/super-admin/users" className="block group">
              <div className="p-4 border rounded-lg hover:shadow-md hover:border-purple-500 transition-all h-full">
                <Users className="h-8 w-8 mb-3 text-purple-600 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold mb-1">Platform Users</h4>
                <p className="text-sm text-muted-foreground">Manage all user accounts</p>
              </div>
            </Link>
            
            <Link href="/super-admin/teachers" className="block group">
              <div className="p-4 border rounded-lg hover:shadow-md hover:border-green-500 transition-all h-full">
                <GraduationCap className="h-8 w-8 mb-3 text-green-600 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold mb-1">All Teachers</h4>
                <p className="text-sm text-muted-foreground">View teacher directory</p>
              </div>
            </Link>

            <Link href="/super-admin/students" className="block group">
              <div className="p-4 border rounded-lg hover:shadow-md hover:border-orange-500 transition-all h-full">
                <Users className="h-8 w-8 mb-3 text-orange-600 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold mb-1">All Students</h4>
                <p className="text-sm text-muted-foreground">View student directory</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Super Admin Analytics Chatbot */}
      <SuperAdminAnalyticsChat />
    </div>
  )
}
