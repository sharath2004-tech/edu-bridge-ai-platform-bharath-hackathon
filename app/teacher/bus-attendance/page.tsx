import { getSession } from '@/lib/auth'
import { BusAttendanceComponent } from '@/components/bus-attendance'
import { redirect } from 'next/navigation'

export default async function BusAttendancePage() {
  const session = await getSession()

  if (!session || session.role !== 'teacher') {
    redirect('/login')
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Bus Attendance</h1>
        <p className="text-gray-600 mt-2">
          Mark daily bus attendance for students. Parents will be notified automatically via email.
        </p>
      </div>
      
      <BusAttendanceComponent />
    </div>
  )
}
