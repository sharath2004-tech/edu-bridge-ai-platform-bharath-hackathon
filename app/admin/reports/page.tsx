import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function AdminReportsPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
        <p className="text-muted-foreground">Platform-wide reporting and insights</p>
      </div>

      <Separator />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">User Growth</h3>
          <p className="text-3xl font-bold text-primary">245</p>
          <p className="text-sm text-muted-foreground mt-1">Total users this month</p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">Active Courses</h3>
          <p className="text-3xl font-bold text-primary">18</p>
          <p className="text-sm text-muted-foreground mt-1">Courses published</p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">Completion Rate</h3>
          <p className="text-3xl font-bold text-primary">78%</p>
          <p className="text-sm text-muted-foreground mt-1">Average completion</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>New user registrations</span>
            <span className="font-semibold">+12 today</span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span>Content uploads</span>
            <span className="font-semibold">+8 this week</span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span>Course completions</span>
            <span className="font-semibold">+24 this month</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
