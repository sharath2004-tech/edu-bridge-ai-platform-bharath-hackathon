"use client"

import { Bell, Search, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur border-b border-border">
      <div className="ml-0 lg:ml-64 px-6 h-16 flex items-center justify-between gap-4">
        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search courses, topics..." className="pl-10 bg-muted/50" />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 ml-auto">
          <Button size="icon" variant="ghost" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </Button>
          <Button size="icon" variant="ghost">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
