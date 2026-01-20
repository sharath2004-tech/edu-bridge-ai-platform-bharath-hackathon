import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { UploadForm } from "@/components/upload-form"
import { getSession } from "@/lib/auth"
import { Content, Section } from "@/lib/models"
import connectDB from "@/lib/mongodb"
import { FileText, MoreVertical } from "lucide-react"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

async function createSection(formData: FormData) {
  "use server"
  const session = await getSession()
  if (!session || session.role !== 'teacher') return
  
  const name = String(formData.get("name") ?? "")
  if (!name) return
  
  await connectDB()
  await Section.create({ name, owner: session.id, students: [] })
  revalidatePath("/teacher/content")
}

export default async function ContentPage() {
  const session = await getSession()
  if (!session || session.role !== 'teacher') {
    redirect('/login')
  }
  
  await connectDB()
  
  // Fetch sections owned by teacher
  const sectionsData = await Section.find({ owner: session.id }).lean()
  const sections: { _id: string; name: string }[] = sectionsData.map(s => ({
    _id: String(s._id),
    name: s.name
  }))
  
  // Fetch all content owned by teacher with section info
  const contentData = await Content.find({ owner: session.id }).populate('section', 'name').lean()
  const items: { _id: string; title: string; type: string; section: { _id: string; name: string }; description?: string; url?: string; text?: string }[] = contentData.map(c => ({
    _id: String(c._id),
    title: c.title,
    type: c.type,
    section: {
      _id: String(c.section?._id || c.section),
      name: (c.section as any)?.name || 'Unknown Section'
    },
    description: c.description,
    url: c.url,
    text: c.text
  }))

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Content Library</h1>
          <p className="text-muted-foreground">Manage and organize all your course materials</p>
        </div>
      </div>

      <Separator />

      {/* Create Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Create Section</h3>
        <form action={createSection} className="flex gap-3">
          <Input name="name" placeholder="New section name (e.g., Class A, Grade 10)" required className="flex-1" />
          <Button type="submit">Create Section</Button>
        </form>
      </div>

      <Separator />

      {/* Upload Content with File Support */}
      <UploadForm sections={sections} />

      <Separator />

      {/* Content Grid */}
      <div>
        <h3 className="text-sm font-semibold mb-4">All Content ({items.length})</h3>
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No content found. Create a section and upload materials.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, i) => (
              <Card
                key={item._id}
                className="p-4 border border-border hover:border-primary/50 transition-all group animate-slideInLeft"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <button className="p-1 hover:bg-muted rounded transition-colors">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <div>
                  <span className="inline-block px-2 py-1 bg-secondary/20 text-secondary text-xs font-medium rounded mb-2">
                    {item.type}
                  </span>
                  <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                  {item.description && <p className="text-xs text-muted-foreground mb-2">{item.description}</p>}
                  <p className="text-xs text-muted-foreground mb-1">
                    <strong>Section:</strong> {item.section.name}
                  </p>
                  {item.url && (
                    <p className="text-xs text-blue-600 mb-1 break-all">
                      <strong>File:</strong> <a href={item.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">{item.url}</a>
                    </p>
                  )}
                  {item.text && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      <strong>Text:</strong> {item.text}
                    </p>
                  )}
                  
                  {/* Video Preview */}
                  {item.type === 'video' && item.url && (
                    <div className="mt-3 bg-black rounded-lg overflow-hidden">
                      <video controls className="w-full" controlsList="nodownload" preload="metadata">
                        <source src={item.url} type="video/mp4" />
                        <source src={item.url} type="video/webm" />
                        <source src={item.url} type="video/ogg" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                  
                  {/* Audio Preview */}
                  {item.type === 'audio' && item.url && (
                    <div className="mt-3">
                      <audio controls className="w-full" controlsList="nodownload" preload="metadata">
                        <source src={item.url} type="audio/mpeg" />
                        <source src={item.url} type="audio/ogg" />
                        <source src={item.url} type="audio/wav" />
                        Your browser does not support the audio tag.
                      </audio>
                    </div>
                  )}
                  
                  {/* PDF Preview */}
                  {item.type === 'pdf' && item.url && (
                    <div className="mt-3 border rounded-lg overflow-hidden">
                      <iframe 
                        src={item.url} 
                        className="w-full h-64" 
                        title={item.title}
                      />
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="block text-center py-2 bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20"
                      >
                        Open PDF in New Tab
                      </a>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
