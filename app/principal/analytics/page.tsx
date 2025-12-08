"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">School performance insights</p>
        </div>
        <Button>Export Data</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Attendance Overview</h3>
          <p className="text-muted-foreground text-sm">
            Attendance analytics will be displayed here
          </p>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Performance Metrics</h3>
          <p className="text-muted-foreground text-sm">
            Academic performance data will be displayed here
          </p>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Teacher Statistics</h3>
          <p className="text-muted-foreground text-sm">
            Teacher performance metrics will be displayed here
          </p>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Student Progress</h3>
          <p className="text-muted-foreground text-sm">
            Student progress tracking will be displayed here
          </p>
        </Card>
      </div>
    </div>
  )
}
