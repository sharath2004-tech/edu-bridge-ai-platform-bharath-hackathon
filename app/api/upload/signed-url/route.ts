import { getSession } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Generate a signed URL for direct client-side upload to Bunny.net
 * This bypasses Vercel's 4.5MB body size limit
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    if (!['teacher', 'admin', 'principal', 'super-admin'].includes(session.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized role' },
        { status: 403 }
      )
    }

    const { fileName, fileType, fileSize } = await request.json()

    if (!fileName || !fileType) {
      return NextResponse.json(
        { success: false, error: 'fileName and fileType are required' },
        { status: 400 }
      )
    }

    // Check if Bunny.net is configured
    if (!process.env.BUNNY_STORAGE_ZONE || !process.env.BUNNY_API_KEY || !process.env.BUNNY_CDN_HOSTNAME) {
      return NextResponse.json(
        { success: false, error: 'Bunny.net is not configured' },
        { status: 500 }
      )
    }

    // Create unique filename
    const timestamp = Date.now()
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
    const uniqueFileName = `${session.id}-${timestamp}-${sanitizedName}`
    
    // Determine folder based on file type
    const folder = fileType.startsWith('video/') ? 'videos' : fileType.startsWith('image/') ? 'images' : 'files'
    const filePath = `edu-bridge/${folder}/${uniqueFileName}`

    // Construct the upload URL
    const uploadUrl = `https://storage.bunnycdn.com/${process.env.BUNNY_STORAGE_ZONE}/${filePath}`
    
    // Construct the CDN URL for accessing the file after upload
    const cdnUrl = `https://${process.env.BUNNY_CDN_HOSTNAME}/${filePath}`

    console.log(`📝 Generated signed URL for: ${fileName} (${fileSize} bytes)`)

    return NextResponse.json({
      success: true,
      uploadUrl,
      cdnUrl,
      apiKey: process.env.BUNNY_API_KEY, // Client will use this for authentication
      filePath,
      fileName: uniqueFileName,
    })

  } catch (error: any) {
    console.error('❌ Error generating signed URL:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
}
