"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function TimetablePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Timetable</h1>
          <p className="text-muted-foreground">Create and manage school timetable</p>
        </div>
        <Button>Create Timetable</Button>
      </div>

      <Card className="p-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Timetable management coming soon</p>
          <p className="text-sm text-muted-foreground">
            Create class schedules, assign teachers, and manage periods
          </p>
        </div>
      </Card>
    </div>
  )
}
