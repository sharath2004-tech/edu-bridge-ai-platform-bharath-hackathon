import { AIChatbot } from "@/components/ai-chatbot"
import { TeacherSidebar } from "@/components/teacher-sidebar"
import { TopNav } from "@/components/top-nav"
import type React from "react"

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <TeacherSidebar />
      <TopNav />
      <main className="ml-0 lg:ml-64 pt-16">
        <div className="p-6 md:p-8">{children}</div>
      </main>
      <AIChatbot />
    </div>
  )
}
