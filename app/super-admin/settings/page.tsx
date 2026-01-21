"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Bell, Database, Globe, Lock, Save, User } from "lucide-react"
import { useState } from "react"

export default function SuperAdminSettingsPage() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold mb-2">Super Admin Settings</h1>
        <p className="text-muted-foreground">Manage platform-wide settings and configurations</p>
      </div>

      <Separator />

      {/* Profile Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Profile Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input placeholder="System Administrator" defaultValue="System Administrator" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="admin@edubridge.com" defaultValue="superadmin@edubridge.com" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <Input placeholder="+1-555-0100" defaultValue="+1-555-0100" />
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Security Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="2fa" className="w-4 h-4" />
            <label htmlFor="2fa" className="text-sm">Enable Two-Factor Authentication</label>
          </div>
        </div>
      </Card>

      {/* Platform Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Platform Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Platform Name</label>
            <Input placeholder="EduBridge AI Platform" defaultValue="EduBridge AI Platform" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Support Email</label>
            <Input type="email" placeholder="support@edubridge.com" defaultValue="support@edubridge.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Max Schools Allowed</label>
            <Input type="number" placeholder="100" defaultValue="100" />
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Notification Settings</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New School Registrations</p>
              <p className="text-sm text-muted-foreground">Get notified when schools register</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">System Alerts</p>
              <p className="text-sm text-muted-foreground">Critical system notifications</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Reports</p>
              <p className="text-sm text-muted-foreground">Platform usage statistics</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
        </div>
      </Card>

      {/* Database Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Database Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Database Status</p>
              <p className="text-sm text-muted-foreground">MongoDB Atlas Connected</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Active</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">Backup Database</Button>
            <Button variant="outline" className="flex-1">View Logs</Button>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
