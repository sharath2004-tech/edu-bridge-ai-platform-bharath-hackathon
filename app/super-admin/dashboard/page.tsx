import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Building2, GraduationCap, TrendingUp, UserCheck, Users } from 'lucide-react'
import Link from 'next/link'

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage all schools and platform-wide settings
          </p>
        </div>
        <Link href="/super-admin/pending-schools">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-orange-600 font-medium">PENDING APPROVALS</p>
                  <p className="text-2xl font-bold text-orange-700">View All</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Active institutions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Principals</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              School administrators
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Across all schools
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">960</div>
            <p className="text-xs text-muted-foreground">
              Enrolled students
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Schools List */}
      <Card>
        <CardHeader>
          <CardTitle>Schools Overview</CardTitle>
          <CardDescription>
            All registered schools on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Green Valley High School</h3>
                  <p className="text-sm text-muted-foreground">GVHS2025 • CBSE Board</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Principal: Dr. Robert Anderson</p>
                <p className="text-xs text-muted-foreground">Springfield, California</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Sunrise International School</h3>
                  <p className="text-sm text-muted-foreground">SRIS2025 • ICSE Board</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Principal: Mrs. Patricia Martinez</p>
                <p className="text-xs text-muted-foreground">Los Angeles, California</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Oakwood Academy</h3>
                  <p className="text-sm text-muted-foreground">OWAC2025 • State Board</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Principal: Dr. Jennifer Wilson</p>
                <p className="text-xs text-muted-foreground">San Francisco, California</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/super-admin/schools" className="block">
              <div className="p-4 border rounded-lg hover:bg-accent transition-colors text-left h-full">
                <Building2 className="h-6 w-6 mb-2 text-primary" />
                <h4 className="font-semibold">All Schools</h4>
                <p className="text-sm text-muted-foreground">View and manage schools</p>
              </div>
            </Link>
            
            <Link href="/super-admin/users" className="block">
              <div className="p-4 border rounded-lg hover:bg-accent transition-colors text-left h-full">
                <Users className="h-6 w-6 mb-2 text-primary" />
                <h4 className="font-semibold">All Users</h4>
                <p className="text-sm text-muted-foreground">Manage platform users</p>
              </div>
            </Link>
            
            <Link href="/super-admin/teachers" className="block">
              <div className="p-4 border rounded-lg hover:bg-accent transition-colors text-left h-full">
                <GraduationCap className="h-6 w-6 mb-2 text-primary" />
                <h4 className="font-semibold">All Teachers</h4>
                <p className="text-sm text-muted-foreground">View all teachers</p>
              </div>
            </Link>

            <Link href="/super-admin/students" className="block">
              <div className="p-4 border rounded-lg hover:bg-accent transition-colors text-left h-full">
                <Users className="h-6 w-6 mb-2 text-green-600" />
                <h4 className="font-semibold">All Students</h4>
                <p className="text-sm text-muted-foreground">View all students</p>
              </div>
            </Link>

            <Link href="/super-admin/classes" className="block">
              <div className="p-4 border rounded-lg hover:bg-accent transition-colors text-left h-full">
                <BookOpen className="h-6 w-6 mb-2 text-orange-600" />
                <h4 className="font-semibold">All Classes</h4>
                <p className="text-sm text-muted-foreground">View class structure</p>
              </div>
            </Link>

            <Link href="/super-admin/analytics" className="block">
              <div className="p-4 border rounded-lg hover:bg-accent transition-colors text-left h-full">
                <TrendingUp className="h-6 w-6 mb-2 text-blue-600" />
                <h4 className="font-semibold">Analytics</h4>
                <p className="text-sm text-muted-foreground">Platform statistics</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
