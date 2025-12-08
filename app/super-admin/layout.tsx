import { TopNav } from '@/components/top-nav'

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <main className="container mx-auto py-8">
        {children}
      </main>
    </div>
  )
}
