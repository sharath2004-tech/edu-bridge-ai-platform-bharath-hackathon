import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, FolderOpen } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function StudentSectionsPage() {
  // Fetch all sections (in a real app, filter by student assignments)
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/sections`, { cache: "no-store" })
  const data = res.ok ? await res.json() : { data: [] }
  const sections: { _id: string; name: string; students?: string[] }[] = data.data ?? []

  return (
    <div className="space-y-4 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Sections</h1>
        <p className="text-muted-foreground">Browse content organized by your class sections</p>
      </div>
      <Separator />
      {sections.length === 0 ? (
        <div className="text-sm text-muted-foreground">No sections available yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((section, i) => (
            <Link
              key={section._id}
              href={`/student/content/${section._id}`}
              className="block animate-slideInLeft"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <Card className="p-6 border border-border hover:border-primary/50 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all">
                    <FolderOpen className="w-6 h-6 text-primary" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{section.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {section.students?.length ?? 0} student{section.students?.length === 1 ? "" : "s"}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
