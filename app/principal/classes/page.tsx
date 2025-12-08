"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ClassesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Classes</h1>
          <p className="text-muted-foreground">Manage classes and sections</p>
        </div>
        <Button>Add Class</Button>
      </div>

      <Card className="p-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Class management coming soon</p>
          <p className="text-sm text-muted-foreground">
            Create and manage classes, assign teachers, and organize students
          </p>
        </div>
      </Card>
    </div>
  )
}
