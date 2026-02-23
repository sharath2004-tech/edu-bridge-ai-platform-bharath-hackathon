import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bus, Calendar, CheckCircle, Users } from 'lucide-react'
import Link from 'next/link'

export default async function TransportDashboard() {
  const session = await getSession()

  if (!session || session.role !== 'transport') {
    redirect('/login')
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bus className="h-8 w-8 text-orange-600" />
          Transport Management Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Welcome, {session.name}! Manage school bus operations and student attendance.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/transport/bus-attendance">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mark Attendance</CardTitle>
              <CheckCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">Today</div>
              <p className="text-xs text-muted-foreground">
                Mark daily bus attendance
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/transport/students">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bus Students</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">View All</div>
              <p className="text-xs text-muted-foreground">
                Manage student list
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/transport/schedule">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bus Schedule</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Routes</div>
              <p className="text-xs text-muted-foreground">
                View bus schedules
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/transport/settings">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Settings</CardTitle>
              <Bus className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">Configure</div>
              <p className="text-xs text-muted-foreground">
                Bus & profile settings
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Quick guide for transport staff
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold">Mark Daily Attendance</h3>
              <p className="text-sm text-muted-foreground">
                Go to "Bus Attendance" to mark students present or absent. Parents will be notified automatically via email.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold">View Bus Students</h3>
              <p className="text-sm text-muted-foreground">
                Check the list of students assigned to each bus. Filter by bus number to see specific routes.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold">Monitor Schedules</h3>
              <p className="text-sm text-muted-foreground">
                Keep track of bus schedules and routes to ensure timely operations.
              </p>
            </div>
          </div>

          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>Important:</strong> Always verify student identity before marking attendance. 
              Parents rely on these notifications for their child's safety.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
