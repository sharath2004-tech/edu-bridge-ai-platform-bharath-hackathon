import { AIChatbot } from "@/components/ai-chatbot"
import { SuperAdminSidebar } from '@/components/super-admin-sidebar'

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <SuperAdminSidebar />
      <main className="ml-0 lg:ml-64 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
      <AIChatbot />
    </div>
  )
}
