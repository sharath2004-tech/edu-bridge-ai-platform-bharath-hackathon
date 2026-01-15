import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { getSession } from "@/lib/auth"
import { Content, Section } from "@/lib/models"
import connectDB from "@/lib/mongodb"
import { mkdir, writeFile } from "fs/promises"
import { FileText, MoreVertical, Plus, Upload } from "lucide-react"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { join } from "path"

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

async function uploadContent(formData: FormData) {
  "use server"
  const session = await getSession()
  if (!session || session.role !== 'teacher') return
  
  const title = String(formData.get("title") ?? "")
  const description = String(formData.get("description") ?? "")
  const type = String(formData.get("type") ?? "text")
  const section = String(formData.get("section") ?? "")
  const text = String(formData.get("text") ?? "")
  const file = formData.get("file") as File | null

  let url = ""
  
  // Handle file upload
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Save to public/uploads directory
    const uploadsDir = join(process.cwd(), "public", "uploads")
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (e) {
      // Directory might already exist
    }
    const fileName = `${Date.now()}-${file.name}`
    const uploadPath = join(uploadsDir, fileName)
    await writeFile(uploadPath, buffer)
    url = `/uploads/${fileName}`
  } else {
    // Fallback to URL input
    url = String(formData.get("url") ?? "")
  }

  await connectDB()
  await Content.create({ 
    title, 
    description, 
    type, 
    url, 
    text, 
    section, 
    owner: session.id 
  })
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
        <Button className="gap-2" form="upload-form" type="submit">
          <Plus className="w-4 h-4" />
          Upload Content
        </Button>
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
      <div className="space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload Content to Section
        </h3>
        <form id="upload-form" action={uploadContent} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input name="title" placeholder="Content title" required />
          <Input name="description" placeholder="Description (optional)" />
          
          <select name="type" className="px-4 py-2 border border-border rounded-lg bg-background">
            <option value="text">Text</option>
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
          
          <select name="section" className="px-4 py-2 border border-border rounded-lg bg-background" required>
            {sections.length === 0 ? (
              <option value="">No sections available</option>
            ) : (
              sections.map(s => <option key={s._id} value={s._id}>{s.name}</option>)
            )}
          </select>
          
          <div className="md:col-span-2 lg:col-span-3 space-y-2">
            <label className="text-sm text-muted-foreground">Upload file (video, audio, pdf):</label>
            <Input 
              name="file" 
              type="file" 
              accept="video/*,audio/*,application/pdf"
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">Or enter URL below if file is hosted elsewhere</p>
          </div>
          
          <Input name="url" placeholder="Or paste file URL" className="md:col-span-2" />
          <Input name="text" placeholder="Text content (for type=text only)" className="md:col-span-2 lg:col-span-3" />
          
          <Button type="submit" className="md:col-span-2 lg:col-span-3">
            <Upload className="w-4 h-4 mr-2" />
            Save Content
          </Button>
        </form>
      </div>

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
                  {item.url && ['video', 'audio'].includes(item.type) && (
                    <div className="mt-2">
                      {item.type === 'video' ? (
                        <video controls className="w-full rounded max-h-32">
                          <source src={item.url} />
                        </video>
                      ) : (
                        <audio controls className="w-full">
                          <source src={item.url} />
                        </audio>
                      )}
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
