import { getSession } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'
import { NextRequest, NextResponse } from 'next/server'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !['teacher', 'admin', 'principal'].includes(session.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ Cloudinary not configured')
      return NextResponse.json(
        { success: false, error: 'Cloudinary is not configured. Please add CLOUDINARY credentials to .env.local' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log(`📤 Uploading file: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)}MB, Type: ${file.type}`)

    // Validate file size (max 100MB for Cloudinary)
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 100MB limit' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Determine resource type based on file type
    const fileType = file.type.split('/')[0]
    const resourceType = fileType === 'video' ? 'video' : fileType === 'audio' ? 'video' : 'auto'

    console.log(`🔄 Uploading to Cloudinary as resource type: ${resourceType}`)

    // Upload to Cloudinary with increased timeout
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType as 'video' | 'auto',
          folder: 'edu-bridge',
          public_id: `${session.id}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
          chunk_size: 6000000, // 6MB chunks for large files
          timeout: 120000, // 120 seconds timeout for large files
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      uploadStream.end(buffer)
    })

    console.log(`✅ Upload successful: ${result.secure_url}`)

    return NextResponse.json(
      { 
        success: true, 
        url: result.secure_url,
        publicId: result.public_id,
        fileName: file.name,
        resourceType: result.resource_type,
        format: result.format,
        size: result.bytes,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('❌ Error uploading file to Cloudinary:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload file', message: error.message },
      { status: 500 }
    )
  }
}
