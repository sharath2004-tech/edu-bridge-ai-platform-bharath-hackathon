"use client"

import { cn } from "@/lib/utils"
import { BarChart3, BookOpen, CalendarCheck, ClipboardList, GraduationCap, LayoutDashboard, LogOut, Menu, Settings, Sparkles, Users, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const menuItems = [
  { href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/teacher/courses", label: "My Courses", icon: BookOpen },
  { href: "/teacher/quizzes", label: "Quizzes", icon: ClipboardList },
  { href: "/teacher/students", label: "Students", icon: Users },
  { href: "/teacher/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/teacher/marks", label: "Marks", icon: GraduationCap },
  { href: "/teacher/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/teacher/settings", label: "Settings", icon: Settings },
]

const aiToolsItems = [
  { href: "/teacher/ai-tools/question-paper", label: "Question Paper" },
  { href: "/teacher/ai-tools/ppt", label: "PPT Creator" },
]

export function TeacherSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [aiToolsOpen, setAiToolsOpen] = useState(false)

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
          "fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/teacher/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">EB</span>
            </div>
            <span className="font-semibold">EduBridge</span>
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
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/20",
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
          
          {/* AI Tools Expandable Section */}
          <div>
            <button
              onClick={() => setAiToolsOpen(!aiToolsOpen)}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all",
                pathname.startsWith("/teacher/ai-tools")
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/20",
              )}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">AI Tools</span>
              </div>
              <svg
                className={cn("w-4 h-4 transition-transform", aiToolsOpen && "rotate-180")}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {aiToolsOpen && (
              <div className="ml-4 mt-1 space-y-1">
                {aiToolsItems.map((tool) => {
                  const isActive = pathname === tool.href
                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block px-4 py-2 rounded-lg transition-all text-sm",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-primary"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/20",
                      )}
                    >
                      {tool.label}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
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
