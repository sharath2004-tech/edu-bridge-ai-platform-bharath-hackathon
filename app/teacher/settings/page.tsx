"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function TeacherSettingsPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and preferences</p>
      </div>

      <Separator />

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Profile Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Full Name</label>
            <Input placeholder="Enter your name" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Email</label>
            <Input type="email" placeholder="your@email.com" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Bio</label>
            <textarea 
              className="w-full px-3 py-2 border rounded-lg min-h-[100px]"
              placeholder="Tell students about yourself..."
            />
          </div>
          <Button>Save Changes</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Change Password</h3>
        <form onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          const currentPassword = formData.get('currentPassword') as string
          const newPassword = formData.get('newPassword') as string
          const confirmPassword = formData.get('confirmPassword') as string

          if (newPassword !== confirmPassword) {
            alert('New passwords do not match')
            return
          }

          try {
            const res = await fetch('/api/auth/change-password', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ currentPassword, newPassword })
            })
            const data = await res.json()
            if (data.success) {
              alert('Password changed successfully!')
              e.currentTarget.reset()
            } else {
              alert(data.error || 'Failed to change password')
            }
          } catch (error) {
            alert('An error occurred')
          }
        }} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Current Password</label>
            <Input 
              name="currentPassword"
              type="password" 
              placeholder="Enter current password"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">New Password</label>
            <Input 
              name="newPassword"
              type="password" 
              placeholder="Enter new password (min 6 characters)"
              minLength={6}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Confirm New Password</label>
            <Input 
              name="confirmPassword"
              type="password" 
              placeholder="Confirm new password"
              minLength={6}
              required
            />
          </div>
          <Button type="submit">Change Password</Button>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <input type="checkbox" className="w-5 h-5" defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Student Messages</p>
              <p className="text-sm text-muted-foreground">Get notified of student messages</p>
            </div>
            <input type="checkbox" className="w-5 h-5" defaultChecked />
          </div>
        </div>
      </Card>
    </div>
  )
}
