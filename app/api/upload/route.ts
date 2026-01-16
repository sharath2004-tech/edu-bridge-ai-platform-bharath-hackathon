import { getSession } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'
import { NextRequest, NextResponse } from 'next/server'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

console.log('🔧 Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'MISSING',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING',
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
    console.log(`📋 Using cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`)

    // Upload configuration with better video support
    const uploadOptions: any = {
      resource_type: resourceType as 'video' | 'auto',
      folder: 'edu-bridge',
      chunk_size: 6000000, // 6MB chunks for large files
      timeout: 300000, // 5 minutes timeout for large videos
      overwrite: true,
    }

    // Use upload preset if provided
    if (process.env.CLOUDINARY_UPLOAD_PRESET) {
      uploadOptions.upload_preset = process.env.CLOUDINARY_UPLOAD_PRESET
      console.log(`📦 Using upload preset: ${process.env.CLOUDINARY_UPLOAD_PRESET}`)
    }

    // For videos, add additional options
    if (resourceType === 'video') {
      uploadOptions.eager_async = true
      uploadOptions.format = 'mp4' // Ensure MP4 format for compatibility
    }

    // Upload to Cloudinary with increased timeout
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', {
              message: error.message,
              http_code: error.http_code,
              name: error.name,
              error: error,
            })
            reject(error)
          } else if (result) {
            console.log('✅ Cloudinary upload success:', {
              url: result.secure_url,
              format: result.format,
              resource_type: result.resource_type,
            })
            resolve(result)
          } else {
            reject(new Error('No result from Cloudinary'))
          }
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
    console.error('❌ Error uploading file to Cloudinary:', {
      message: error.message,
      http_code: error.http_code,
      error: error,
    })
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to upload file', 
        message: error.message,
        http_code: error.http_code,
      },
      { status: 500 }
    )
  }
}
