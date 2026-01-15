import { getSession } from '@/lib/auth'
import Notification from '@/lib/models/Notification'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch notifications for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')

    const query: any = {
      userId: session.userId,
    }

    if (unreadOnly) {
      query.isRead = false
    }

    const notifications = await Notification.find(query)
      .populate('relatedUser', 'name email')
      .populate('relatedClass', 'className section')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    const unreadCount = await Notification.countDocuments({
      userId: session.userId,
      isRead: false
    })

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount
    })
  } catch (error: any) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Mark notification as read
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { notificationId, markAllRead } = await request.json()

    if (markAllRead) {
      // Mark all notifications as read
      await Notification.updateMany(
        { userId: session.userId, isRead: false },
        { isRead: true, readAt: new Date() }
      )

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read'
      })
    } else if (notificationId) {
      // Mark single notification as read
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId: session.userId },
        { isRead: true, readAt: new Date() },
        { new: true }
      )

      if (!notification) {
        return NextResponse.json(
          { success: false, error: 'Notification not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        notification
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Notification ID or markAllRead flag required' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete notification
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get('id')

    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: 'Notification ID required' },
        { status: 400 }
      )
    }

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId: session.userId
    })

    if (!notification) {
      return NextResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Notification deleted'
    })
  } catch (error: any) {
    console.error('Error deleting notification:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
