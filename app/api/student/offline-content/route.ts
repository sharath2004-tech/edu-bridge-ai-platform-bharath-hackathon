import { getSession } from '@/lib/auth'
import { OfflineContent } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'student') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const downloads = await OfflineContent.find({ userId: session.id })
      .populate('courseId', 'title thumbnail')
      .sort({ downloadedAt: -1 })
      .lean()

    const downloadData = downloads.map((d: any) => ({
      _id: String(d._id),
      course: {
        _id: String(d.courseId?._id),
        title: d.courseId?.title || 'Unknown',
        thumbnail: d.courseId?.thumbnail
      },
      contentType: d.contentType,
      fileName: d.fileName,
      fileSize: d.fileSize,
      downloadedAt: d.downloadedAt.toISOString(),
      lastAccessedAt: d.lastAccessedAt.toISOString(),
      syncStatus: d.syncStatus
    }))

    return NextResponse.json({ success: true, data: downloadData }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching offline content:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'student') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { courseId, lessonId, contentType, fileName, fileSize } = await request.json()

    await connectDB()

    // Check if already exists
    const existing = await OfflineContent.findOne({
      userId: session.id,
      courseId,
      lessonId: lessonId || null,
      contentType
    })

    if (existing) {
      existing.lastAccessedAt = new Date()
      await existing.save()
      return NextResponse.json({ success: true, data: existing }, { status: 200 })
    }

    const offlineContent = await OfflineContent.create({
      userId: session.id,
      courseId,
      lessonId: lessonId || undefined,
      contentType,
      fileName,
      fileSize,
      syncStatus: 'synced'
    })

    return NextResponse.json({ success: true, data: offlineContent }, { status: 201 })
  } catch (error: any) {
    console.error('Error saving offline content:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'student') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const contentId = searchParams.get('id')

    if (!contentId) {
      return NextResponse.json({ success: false, error: 'Content ID required' }, { status: 400 })
    }

    await connectDB()

    const content = await OfflineContent.findOneAndDelete({
      _id: contentId,
      userId: session.id
    })

    if (!content) {
      return NextResponse.json({ success: false, error: 'Content not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Content deleted' }, { status: 200 })
  } catch (error: any) {
    console.error('Error deleting offline content:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
