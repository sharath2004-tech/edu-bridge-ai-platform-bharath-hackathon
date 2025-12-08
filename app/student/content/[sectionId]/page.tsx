import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileDown, FileText, Music, Video } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function StudentSectionPage({ params }: { params: { sectionId: string } }) {
  const sectionId = params.sectionId
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/content?section=${sectionId}`, { cache: "no-store" })
  const data = res.ok ? await res.json() : { data: [] }
  const items: { _id: string; title: string; type: string; description?: string; url?: string; text?: string }[] = data.data ?? []

  const getIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="w-5 h-5 text-primary" />
      case "audio": return <Music className="w-5 h-5 text-primary" />
      case "pdf": return <FileDown className="w-5 h-5 text-primary" />
      default: return <FileText className="w-5 h-5 text-primary" />
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Section Content</h1>
        <p className="text-sm text-muted-foreground">Materials assigned to this section</p>
      </div>
      <Separator />
      {items.length === 0 ? (
        <div className="text-sm text-muted-foreground">No content available for this section.</div>
      ) : (
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((item) => (
            <Card key={item._id} className="p-4 border border-border">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {getIcon(item.type)}
                </div>
                <span className="inline-block px-2 py-1 bg-secondary/20 text-secondary text-xs font-medium rounded">
                  {item.type}
                </span>
              </div>
              <h3 className="font-semibold text-base mb-2">{item.title}</h3>
              {item.description && <p className="text-sm text-muted-foreground mb-3">{item.description}</p>}
              
              {/* Video Player */}
              {item.type === "video" && item.url && (
                <video controls className="w-full rounded-lg mt-2">
                  <source src={item.url} />
                  Your browser does not support video playback.
                </video>
              )}
              
              {/* Audio Player */}
              {item.type === "audio" && item.url && (
                <audio controls className="w-full mt-2">
                  <source src={item.url} />
                  Your browser does not support audio playback.
                </audio>
              )}
              
              {/* PDF Link */}
              {item.type === "pdf" && item.url && (
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-2 text-sm text-primary underline hover:text-primary/80 mt-2"
                >
                  <FileDown className="w-4 h-4" />
                  View PDF
                </a>
              )}
              
              {/* Text Content */}
              {item.type === "text" && item.text && (
                <div className="text-sm mt-2 p-3 bg-muted rounded-lg">{item.text}</div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
