import { getSession } from '@/lib/auth'
import GameRoom from '@/lib/models/GameRoom'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

// GET - Get room details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'student') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { roomCode } = await params

    const room = await GameRoom.findOne({
      roomCode: roomCode.toUpperCase(),
    })
      .populate('creatorId', 'name className section')
      .populate('players.userId', 'name className section')

    if (!room) {
      return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 })
    }

    // Check if student is in the room
    const isPlayer = room.players.some((p: any) => p.userId._id.toString() === session.userId)
    
    if (!isPlayer && room.schoolId.toString() !== session.schoolId) {
      return NextResponse.json({ success: false, error: 'Not authorized for this room' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      room,
    })
  } catch (error: any) {
    console.error('Error fetching room:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST - Join room or update player actions
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'student') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { roomCode } = await params
    const { action, password, team, answerIndex } = await req.json()

    const room = await GameRoom.findOne({
      roomCode: roomCode.toUpperCase(),
    })

    if (!room) {
      return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 })
    }

    // Handle different actions
    if (action === 'join') {
      // Verify password
      if (room.password !== password) {
        return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 403 })
      }

      // Check if room is full or already started
      if (room.status !== 'waiting') {
        return NextResponse.json({ success: false, error: 'Game already started' }, { status: 400 })
      }

      // Check if player already in room
      const existingPlayer = room.players.find((p: any) => p.userId.toString() === session.userId)
      if (existingPlayer) {
        return NextResponse.json({ success: false, error: 'Already in this room' }, { status: 400 })
      }

      // Count players per team
      const teamACount = room.players.filter((p: any) => p.team === 'alpha').length
      const teamBCount = room.players.filter((p: any) => p.team === 'beta').length

      // Determine which team to join
      let assignedTeam: 'alpha' | 'beta'
      if (team) {
        assignedTeam = team
        const targetTeamCount = assignedTeam === 'alpha' ? teamACount : teamBCount
        if (targetTeamCount >= room.maxPlayersPerTeam) {
          return NextResponse.json({ success: false, error: 'Team is full' }, { status: 400 })
        }
      } else {
        // Auto-assign to team with fewer players
        assignedTeam = teamACount <= teamBCount ? 'alpha' : 'beta'
      }

      // Add player to room
      room.players.push({
        userId: session.userId,
        name: session.name,
        team: assignedTeam,
        score: 0,
        isReady: false,
      })

      await room.save()
    }

    if (action === 'ready') {
      const player = room.players.find((p: any) => p.userId.toString() === session.userId)
      if (!player) {
        return NextResponse.json({ success: false, error: 'Not in this room' }, { status: 400 })
      }
      player.isReady = !player.isReady
      await room.save()
    }

    if (action === 'switch-team') {
      if (room.status !== 'waiting') {
        return NextResponse.json({ success: false, error: 'Cannot switch teams after game started' }, { status: 400 })
      }

      const player = room.players.find((p: any) => p.userId.toString() === session.userId)
      if (!player) {
        return NextResponse.json({ success: false, error: 'Not in this room' }, { status: 400 })
      }

      // Check if player is ready
      if (player.isReady) {
        return NextResponse.json({ success: false, error: 'Unready before switching teams' }, { status: 400 })
      }

      // Determine target team
      const targetTeam = player.team === 'alpha' ? 'beta' : 'alpha'
      
      // Check if target team is full
      const targetTeamCount = room.players.filter((p: any) => p.team === targetTeam).length
      if (targetTeamCount >= room.maxPlayersPerTeam) {
        return NextResponse.json({ success: false, error: 'Target team is full' }, { status: 400 })
      }

      // Switch team
      player.team = targetTeam
      await room.save()
    }

    if (action === 'start') {
      // Only creator can start
      if (room.creatorId.toString() !== session.userId) {
        return NextResponse.json({ success: false, error: 'Only creator can start the game' }, { status: 403 })
      }

      // Check if all players are ready
      const allReady = room.players.every((p: any) => p.isReady)
      if (!allReady) {
        return NextResponse.json({ success: false, error: 'Not all players are ready' }, { status: 400 })
      }

      // Check if both teams have at least one player
      const teamACount = room.players.filter((p: any) => p.team === 'alpha').length
      const teamBCount = room.players.filter((p: any) => p.team === 'beta').length
      
      if (teamACount === 0 || teamBCount === 0) {
        return NextResponse.json({ success: false, error: 'Both teams need at least one player' }, { status: 400 })
      }

      room.status = 'in-progress'
      room.startedAt = new Date()
      await room.save()
    }

    if (action === 'answer') {
      if (room.status !== 'in-progress') {
        return NextResponse.json({ success: false, error: 'Game not in progress' }, { status: 400 })
      }

      const player = room.players.find((p: any) => p.userId.toString() === session.userId)
      if (!player) {
        return NextResponse.json({ success: false, error: 'Not in this room' }, { status: 400 })
      }

      const currentQuestion = room.questions[room.gameState.currentQuestionIndex]
      if (!currentQuestion) {
        return NextResponse.json({ success: false, error: 'No more questions' }, { status: 400 })
      }

      const isCorrect = answerIndex === currentQuestion.correctAnswer

      if (isCorrect) {
        player.score++
        
        // Update team score and rope position
        if (player.team === 'alpha') {
          room.gameState.teamAScore++
          room.gameState.ropePosition = Math.max(0, room.gameState.ropePosition - 5)
        } else {
          room.gameState.teamBScore++
          room.gameState.ropePosition = Math.min(100, room.gameState.ropePosition + 5)
        }

        // Check win condition
        if (room.gameState.ropePosition <= 10) {
          room.gameState.winner = 'alpha'
          room.status = 'completed'
          room.completedAt = new Date()
        } else if (room.gameState.ropePosition >= 90) {
          room.gameState.winner = 'beta'
          room.status = 'completed'
          room.completedAt = new Date()
        }
      }

      // Move to next question if game not won
      if (room.status === 'in-progress') {
        room.gameState.currentQuestionIndex++
        
        // Check if questions exhausted
        if (room.gameState.currentQuestionIndex >= room.questions.length) {
          room.status = 'completed'
          room.completedAt = new Date()
          // Winner is team with higher score
          room.gameState.winner = room.gameState.teamAScore > room.gameState.teamBScore ? 'alpha' : 'beta'
        }
      }

      await room.save()

      return NextResponse.json({
        success: true,
        isCorrect,
        gameState: room.gameState,
        status: room.status,
      })
    }

    if (action === 'leave') {
      room.players = room.players.filter((p: any) => p.userId.toString() !== session.userId)
      
      // If creator leaves and game is waiting, delete room
      if (room.creatorId.toString() === session.userId && room.status === 'waiting') {
        await room.deleteOne()
        return NextResponse.json({ success: true, message: 'Room deleted' })
      }

      await room.save()
    }

    const populatedRoom = await GameRoom.findById(room._id)
      .populate('creatorId', 'name className section')
      .populate('players.userId', 'name className section')

    return NextResponse.json({
      success: true,
      room: populatedRoom,
    })
  } catch (error: any) {
    console.error('Error updating room:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
