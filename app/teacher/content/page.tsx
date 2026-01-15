import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { getSession } from "@/lib/auth"
import { Content, Section } from "@/lib/models"
import connectDB from "@/lib/mongodb"
import { mkdir, writeFile } from "fs/promises"
import { FileText, MoreVertical, Upload } from "lucide-react"
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
  if (!session || session.role !== 'teacher') {
    throw new Error('Unauthorized')
  }
  
  const title = String(formData.get("title") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const type = String(formData.get("type") ?? "text")
  const section = String(formData.get("section") ?? "").trim()
  const text = String(formData.get("text") ?? "").trim()
  const urlInput = String(formData.get("url") ?? "").trim()
  const file = formData.get("file") as File | null

  // Validation
  if (!title) {
    throw new Error('Title is required')
  }
  if (!section) {
    throw new Error('Section is required')
  }

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
    // Sanitize filename
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${Date.now()}-${sanitizedName}`
    const uploadPath = join(uploadsDir, fileName)
    await writeFile(uploadPath, buffer)
    url = `/uploads/${fileName}`
  } else if (urlInput) {
    // Use URL input
    url = urlInput
  } else if (type !== 'text') {
    // For non-text types, require either file or URL
    throw new Error('Please upload a file or provide a URL')
  }

  await connectDB()
  const content = await Content.create({ 
    title, 
    description, 
    type, 
    url: url || undefined, 
    text: text || undefined, 
    section, 
    owner: session.id 
  })
  
  console.log('Content created successfully:', content._id)
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
      <Card className="p-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Upload className="w-5 h-5 text-primary" />
          Upload Multimedia Content
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload videos, audio files, PDFs, or add text content to your sections
        </p>
        
        <form id="upload-form" action={uploadContent} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Content Title *</label>
              <Input name="title" placeholder="e.g., Introduction to Mathematics" required />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Content Type *</label>
              <select name="type" className="w-full px-4 py-2 border border-border rounded-lg bg-background" required>
                <option value="video">📹 Video</option>
                <option value="audio">🎵 Audio</option>
                <option value="pdf">📄 PDF Document</option>
                <option value="text">📝 Text</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input name="description" placeholder="Brief description of the content" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Assign to Section *</label>
            <select name="section" className="w-full px-4 py-2 border border-border rounded-lg bg-background" required>
              {sections.length === 0 ? (
                <option value="">⚠️ No sections available - Create one first</option>
              ) : (
                <>
                  <option value="">-- Select a section --</option>
                  {sections.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </>
              )}
            </select>
          </div>

          <div className="border-2 border-dashed border-border rounded-lg p-6 space-y-3 bg-muted/30">
            <div className="flex items-center gap-3">
              <Upload className="w-8 h-8 text-primary" />
              <div>
                <label className="text-sm font-semibold block">Upload File (Video, Audio, or PDF)</label>
                <p className="text-xs text-muted-foreground">Maximum file size: 100MB</p>
              </div>
            </div>
            <Input 
              name="file" 
              type="file" 
              accept="video/*,audio/*,application/pdf"
              className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              💡 Supported formats: MP4, WebM (video) • MP3, WAV (audio) • PDF (documents)
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Or Enter File URL</label>
            <Input name="url" placeholder="https://example.com/video.mp4" />
            <p className="text-xs text-muted-foreground">If file is already hosted, paste URL here instead of uploading</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Text Content (for Text type only)</label>
            <textarea 
              name="text" 
              placeholder="Enter your text content here..."
              className="w-full min-h-[100px] px-3 py-2 border border-border rounded-lg bg-background"
            />
          </div>
          
          <Button type="submit" className="w-full" size="lg">
            <Upload className="w-4 h-4 mr-2" />
            Upload and Save Content
          </Button>
        </form>
      </Card>

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
