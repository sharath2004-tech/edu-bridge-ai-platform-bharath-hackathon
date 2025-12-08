"use client"

import { AIChatbot } from "@/components/ai-chatbot"
import { Button } from "@/components/ui/button"
import {
    BarChart3,
    BookOpen,
    Calendar,
    ClipboardList,
    Clock,
    GraduationCap,
    LayoutDashboard,
    Menu,
    School,
    Settings,
    Users,
    X
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const sidebarItems = [
  { name: "Dashboard", href: "/principal/dashboard", icon: LayoutDashboard },
  { name: "Teachers", href: "/principal/teachers", icon: GraduationCap },
  { name: "Students", href: "/principal/students", icon: Users },
  { name: "Classes", href: "/principal/classes", icon: BookOpen },
  { name: "Attendance", href: "/principal/attendance", icon: ClipboardList },
  { name: "Marks & Reports", href: "/principal/marks", icon: BarChart3 },
  { name: "Timetable", href: "/principal/timetable", icon: Clock },
  { name: "Courses", href: "/principal/courses", icon: Calendar },
  { name: "Analytics", href: "/principal/analytics", icon: BarChart3 },
  { name: "School Settings", href: "/principal/settings", icon: School },
]

export default function PrincipalLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-screen w-64 bg-card border-r transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <Link href="/principal/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">EB</span>
              </div>
              <div>
                <p className="font-semibold">EduBridge AI</p>
                <p className="text-xs text-muted-foreground">Principal Portal</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/principal/settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6">{children}</div>
      </main>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  )
}
