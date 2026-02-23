"use client"

import { cn } from "@/lib/utils"
import { Bus, Calendar, LayoutDashboard, LogOut, Menu, Settings, Users, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const menuItems = [
  { href: "/transport/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transport/bus-attendance", label: "Bus Attendance", icon: Bus },
  { href: "/transport/students", label: "Bus Students", icon: Users },
  { href: "/transport/schedule", label: "Bus Schedule", icon: Calendar },
  { href: "/transport/settings", label: "Settings", icon: Settings },
]

export function TransportSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 hover:bg-muted rounded-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-6 border-b border-sidebar-border flex-shrink-0">
          <Link href="/transport/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-semibold block">Transport</span>
              <span className="text-xs text-muted-foreground">Bus Management</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  isActive
                    ? "bg-orange-600 text-white"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/20",
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border mt-auto flex-shrink-0">
          <button 
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' })
              window.location.href = '/login'
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent/20 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
