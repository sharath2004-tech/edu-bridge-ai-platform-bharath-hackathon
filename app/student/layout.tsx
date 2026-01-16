import { AIChatbot } from "@/components/ai-chatbot"
import { OfflineDetector } from "@/components/offline-detector"
import { Sidebar } from "@/components/sidebar"
import { TopNav } from "@/components/top-nav"
import type React from "react"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <OfflineDetector />
      <Sidebar />
      <TopNav />
      <main className="ml-0 lg:ml-64 pt-16">
        <div className="p-6 md:p-8">{children}</div>
      </main>
      <AIChatbot />
    </div>
  )
}
