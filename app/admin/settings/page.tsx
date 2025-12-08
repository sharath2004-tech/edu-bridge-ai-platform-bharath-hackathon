import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
