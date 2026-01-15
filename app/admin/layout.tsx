import { AdminSidebar } from "@/components/admin-sidebar"
import { AIChatbot } from "@/components/ai-chatbot"
import { TopNav } from "@/components/top-nav"
import type React from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <TopNav />
      <main className="ml-0 lg:ml-64 pt-16">
        <div className="p-6 md:p-8">{children}</div>
      </main>
      <AIChatbot />
    </div>
  )
}
