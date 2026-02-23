import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default async function TransportSettingsPage() {
  const session = await getSession()

  if (!session || session.role !== 'transport') {
    redirect('/login')
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your profile and preferences
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Your transport staff profile details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={session.name} disabled />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={session.email} disabled />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value="Transport Staff" disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Configure how you receive alerts and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Notification settings will be available here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
