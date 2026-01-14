"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Lock, Bell, Eye } from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
  })

  return (
    <div className="space-y-6 max-w-2xl animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <Card className="p-6 border border-border animate-slideInLeft">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile Settings
        </h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullname">Full Name</Label>
            <Input id="fullname" placeholder="Alex Johnson" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="alex@example.com" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Input id="bio" placeholder="Tell us about yourself" className="mt-1" />
          </div>
          <Button>Save Changes</Button>
        </div>
      </Card>

      {/* Security Section */}
      <Card className="p-6 border border-border animate-slideInLeft" style={{ animationDelay: "0.1s" }}>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Change Password
        </h2>
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
              className="mt-1"
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
              className="mt-1"
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
              className="mt-1"
              minLength={6}
              required
            />
          </div>
          <Button type="submit">Change Password</Button>
        </form>
      </Card>

      {/* Notifications Section */}
      <Card className="p-6 border border-border animate-slideInLeft" style={{ animationDelay: "0.2s" }}>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </h2>
        <div className="space-y-4">
          {[
            { key: "emailNotifications", label: "Email Notifications", desc: "Receive updates via email" },
            { key: "pushNotifications", label: "Push Notifications", desc: "Receive push notifications" },
          ].map((notif) => (
            <div key={notif.key} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{notif.label}</p>
                <p className="text-sm text-muted-foreground">{notif.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={settings[notif.key as keyof typeof settings]}
                onChange={(e) => setSettings((prev) => ({ ...prev, [notif.key]: e.target.checked }))}
                className="w-5 h-5 rounded"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Appearance Section */}
      <Card className="p-6 border border-border animate-slideInLeft" style={{ animationDelay: "0.3s" }}>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Appearance
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">Dark Mode</p>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => setSettings((prev) => ({ ...prev, darkMode: e.target.checked }))}
              className="w-5 h-5 rounded"
            />
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card
        className="p-6 border border-destructive/30 bg-destructive/5 animate-slideInLeft"
        style={{ animationDelay: "0.4s" }}
      >
        <h2 className="text-lg font-bold mb-4 text-destructive">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mb-4">These actions cannot be undone</p>
        <Button
          variant="outline"
          className="text-destructive border-destructive/50 hover:bg-destructive/10 bg-transparent"
        >
          Delete Account
        </Button>
      </Card>
    </div>
  )
}
