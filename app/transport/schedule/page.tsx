import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function TransportSchedulePage() {
  const session = await getSession()

  if (!session || session.role !== 'transport') {
    redirect('/login')
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Bus Schedule</h1>
        <p className="text-gray-600 mt-2">
          View bus routes and schedules
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bus Routes & Timings</CardTitle>
          <CardDescription>
            Manage pick-up and drop-off schedules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Bus schedule management will be available here.
            Configure routes, timings, and stops for each bus.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
