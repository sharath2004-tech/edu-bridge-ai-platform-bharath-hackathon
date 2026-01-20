import { getSession } from '@/lib/auth'
import { Content } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import { mkdir, writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const title = String(formData.get('title') ?? '').trim()
    const description = String(formData.get('description') ?? '').trim()
    const type = String(formData.get('type') ?? 'text')
    const section = String(formData.get('section') ?? '').trim()
    const text = String(formData.get('text') ?? '').trim()
    const urlInput = String(formData.get('url') ?? '').trim()
    const file = formData.get('file') as File | null

    // Validation
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (!section) {
      return NextResponse.json({ error: 'Section is required' }, { status: 400 })
    }

    // Check file size (10MB limit)
    if (file && file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'File size exceeds 10MB limit. Please use a smaller file or provide a URL instead.' 
      }, { status: 400 })
    }

    let url = ''

    // Handle file upload
    if (file && file.size > 0) {
      try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        // Save to public/uploads directory
        const uploadsDir = join(process.cwd(), 'public', 'uploads')
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
      } catch (error) {
        console.error('File upload error:', error)
        return NextResponse.json({ 
          error: 'Failed to upload file. Please try again or use a URL instead.' 
        }, { status: 500 })
      }
    } else if (urlInput) {
      url = urlInput
    } else if (type !== 'text') {
      return NextResponse.json({ 
        error: 'Please upload a file or provide a URL' 
      }, { status: 400 })
    }

    // Save to database
    try {
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
      return NextResponse.json({ success: true, contentId: content._id })
    } catch (error) {
      console.error('Database error:', error)
      return NextResponse.json({ 
        error: 'Failed to save content. Please try again.' 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Upload failed. Please try again.' 
    }, { status: 500 })
  }
}