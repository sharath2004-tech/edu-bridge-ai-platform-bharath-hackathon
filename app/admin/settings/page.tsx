"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Settings</h1>
        <p className="text-muted-foreground">Configure platform settings and preferences</p>
      </div>

      <Separator />

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
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              placeholder="Enter current password"
              required
            />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Enter new password (min 6 characters)"
              minLength={6}
              required
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
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
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              placeholder="Enter current password"
              required
            />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Enter new password (min 6 characters)"
              minLength={6}
              required
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
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
        <h3 className="font-semibold mb-4">Platform Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Platform Name</label>
            <Input defaultValue="EduBridge AI Platform" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Support Email</label>
            <Input type="email" defaultValue="support@edubridge.com" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Max Upload Size (MB)</label>
            <Input type="number" defaultValue="100" />
          </div>
          <Button>Save Changes</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
            </div>
            <input type="checkbox" className="w-5 h-5" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Session Timeout</p>
              <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
            </div>
            <select className="px-3 py-2 border rounded-lg">
              <option>15 minutes</option>
              <option>30 minutes</option>
              <option>1 hour</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  )
}
