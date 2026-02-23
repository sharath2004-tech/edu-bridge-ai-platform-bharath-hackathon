import { TransportSidebar } from "@/components/transport-sidebar"

export default function TransportLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <TransportSidebar />
      <main className="lg:pl-64">
        {children}
      </main>
    </div>
  )
}
