import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle, Info } from "lucide-react"

export default function AdminAlertsPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold mb-2">System Alerts</h1>
        <p className="text-muted-foreground">Monitor platform health and notifications</p>
      </div>

      <Separator />

      <div className="space-y-3">
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">System Running Smoothly</h3>
              <p className="text-sm text-muted-foreground">All services operational • 2 minutes ago</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Database Backup Completed</h3>
              <p className="text-sm text-muted-foreground">Automated backup successful • 1 hour ago</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-yellow-500">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">High Storage Usage</h3>
              <p className="text-sm text-muted-foreground">Storage at 75% capacity • 3 hours ago</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
