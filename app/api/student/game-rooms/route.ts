import { getSession } from '@/lib/auth'
import GameRoom from '@/lib/models/GameRoom'
import { User } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

// Generate random room code
function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// GET - Fetch active game rooms for student's school
export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'student') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // Fetch user's class ID
    const user = await User.findById(session.userId || session.id).select('classId')
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'waiting'

    const rooms = await GameRoom.find({
      schoolId: session.schoolId,
      status,
      $or: [
        { classId: null }, // Open to all classes
        { classId: user.classId }, // Student's class
      ],
    })
      .populate('creatorId', 'name className section')
      .sort({ createdAt: -1 })
      .limit(50)

    return NextResponse.json({
      success: true,
      rooms,
    })
  } catch (error: any) {
    console.error('Error fetching game rooms:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST - Create a new game room
export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'student') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // Fetch user's class ID
    const user = await User.findById(session.userId || session.id).select('classId')
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const { challengeId, maxPlayersPerTeam, password, classOnly, questions } = await req.json()

    if (!challengeId || !maxPlayersPerTeam || !password || !questions || questions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate unique room code
    let roomCode = generateRoomCode()
    let exists = await GameRoom.findOne({ roomCode })
    while (exists) {
      roomCode = generateRoomCode()
      exists = await GameRoom.findOne({ roomCode })
    }

    const room = await GameRoom.create({
      roomCode,
      password,
      challengeId,
      creatorId: session.userId || session.id,
      schoolId: session.schoolId,
      classId: classOnly ? user.classId : null,
      maxPlayersPerTeam,
      questions,
      players: [
        {
          userId: session.userId || session.id,
          name: session.name,
          team: 'alpha',
          score: 0,
          isReady: true, // Creator is auto-ready
        },
      ],
    })

    const populatedRoom = await GameRoom.findById(room._id).populate('creatorId', 'name className section')

    return NextResponse.json({
      success: true,
      message: 'Game room created successfully',
      room: populatedRoom,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating game room:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
