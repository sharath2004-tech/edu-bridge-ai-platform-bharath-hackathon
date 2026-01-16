import { getSession } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Bunny.net Upload API
 * Better for videos than Cloudinary - no duration limits
 * Setup: https://bunny.net (Sign up and create storage zone)
 */

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !['teacher', 'admin', 'principal'].includes(session.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if Bunny.net is configured
    if (!process.env.BUNNY_STORAGE_ZONE || !process.env.BUNNY_API_KEY || !process.env.BUNNY_CDN_HOSTNAME) {
      console.error('❌ Bunny.net not configured')
      return NextResponse.json(
        { success: false, error: 'Bunny.net is not configured. Add BUNNY_STORAGE_ZONE, BUNNY_API_KEY, BUNNY_CDN_HOSTNAME to environment variables' },
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

    console.log(`📤 Uploading to Bunny.net: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)}MB, Type: ${file.type}`)

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${session.id}-${timestamp}-${sanitizedName}`
    
    // Determine folder based on file type
    const fileType = file.type.split('/')[0]
    const folder = fileType === 'video' ? 'videos' : fileType === 'image' ? 'images' : 'files'
    const filePath = `edu-bridge/${folder}/${fileName}`

    console.log(`🔄 Uploading to path: ${filePath}`)

    // Upload to Bunny.net Storage
    const uploadUrl = `https://storage.bunnycdn.com/${process.env.BUNNY_STORAGE_ZONE}/${filePath}`
    
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': process.env.BUNNY_API_KEY,
        'Content-Type': 'application/octet-stream',
        'Content-Length': buffer.length.toString(),
      },
      body: buffer,
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('❌ Bunny.net upload error:', {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        error: errorText,
      })
      throw new Error(`Bunny.net upload failed: ${uploadResponse.statusText}`)
    }

    // Construct CDN URL
    const cdnUrl = `https://${process.env.BUNNY_CDN_HOSTNAME}/${filePath}`

    console.log(`✅ Upload successful: ${cdnUrl}`)

    return NextResponse.json(
      { 
        success: true, 
        url: cdnUrl,
        fileName: file.name,
        fileType: fileType,
        size: file.size,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('❌ Error uploading file to Bunny.net:', {
      message: error.message,
      error: error,
    })
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to upload file', 
        message: error.message,
      },
      { status: 500 }
    )
  }
}
