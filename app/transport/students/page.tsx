import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

async function getBusStudents(schoolId: string) {
  // This would be a server-side fetch in production
  return []
}

export default async function TransportStudentsPage() {
  const session = await getSession()

  if (!session || session.role !== 'transport') {
    redirect('/login')
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Bus Students</h1>
        <p className="text-gray-600 mt-2">
          View and manage students using school bus transportation
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>
            All students registered for bus transportation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            This page will display the list of students using school buses.
            Use the Bus Attendance page to mark daily attendance.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
