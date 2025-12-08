import { getSession } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'

const LearningPathSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  topics: [{
    name: String,
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    status: { type: String, enum: ['not-started', 'in-progress', 'completed'], default: 'not-started' },
    score: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    lastAttempt: Date,
    recommendedResources: [{ type: String }]
  }],
  weakAreas: [{ type: String }],
  strongAreas: [{ type: String }],
  overallProgress: { type: Number, default: 0 },
  badges: [{
    name: String,
    icon: String,
    earnedAt: Date,
    description: String
  }],
  streakDays: { type: Number, default: 0 },
  lastActivityDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const LearningPath = mongoose.models.LearningPath || mongoose.model('LearningPath', LearningPathSchema)

// Helper function to calculate adaptive difficulty
function calculateNextDifficulty(currentDifficulty: string, score: number): string {
  if (score >= 80 && currentDifficulty === 'easy') return 'medium'
  if (score >= 80 && currentDifficulty === 'medium') return 'hard'
  if (score < 50 && currentDifficulty === 'hard') return 'medium'
  if (score < 50 && currentDifficulty === 'medium') return 'easy'
  return currentDifficulty
}

// Helper function to award badges
function checkAndAwardBadges(path: any): any[] {
  const newBadges: any[] = []
  
  // Streak Champion
  if (path.streakDays >= 7 && !path.badges.some((b: any) => b.name === 'Streak Champion')) {
    newBadges.push({
      name: 'Streak Champion',
      icon: '🔥',
      earnedAt: new Date(),
      description: '7-day learning streak!'
    })
  }

  // Concept Master
  const completedTopics = path.topics.filter((t: any) => t.status === 'completed' && t.score >= 90)
  if (completedTopics.length >= 5 && !path.badges.some((b: any) => b.name === 'Concept Master')) {
    newBadges.push({
      name: 'Concept Master',
      icon: '⭐',
      earnedAt: new Date(),
      description: 'Mastered 5+ topics with 90%+ score'
    })
  }

  // Fast Solver
  const recentHighScores = path.topics.filter((t: any) => 
    t.score >= 80 && t.attempts === 1
  )
  if (recentHighScores.length >= 3 && !path.badges.some((b: any) => b.name === 'Fast Solver')) {
    newBadges.push({
      name: 'Fast Solver',
      icon: '🎯',
      earnedAt: new Date(),
      description: 'Scored 80%+ on first attempt, 3 times!'
    })
  }

  return newBadges
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    const learningPath = await LearningPath.findOne({ userId: session.id }).lean()

    if (!learningPath) {
      return NextResponse.json(
        { success: true, data: null },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { success: true, data: learningPath },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error fetching learning path:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch learning path', message: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    const { action, subject, topicName, score, difficulty } = await request.json()

    let learningPath = await LearningPath.findOne({ userId: session.id })

    // Create new learning path if doesn't exist
    if (!learningPath) {
      learningPath = await LearningPath.create({
        userId: session.id,
        subject: subject || 'General',
        topics: [],
        weakAreas: [],
        strongAreas: [],
        badges: [],
        streakDays: 0
      })
    }

    // Update streak
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const lastActivity = learningPath.lastActivityDate ? new Date(learningPath.lastActivityDate) : null
    
    if (lastActivity) {
      lastActivity.setHours(0, 0, 0, 0)
      const dayDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
      
      if (dayDiff === 1) {
        learningPath.streakDays += 1
      } else if (dayDiff > 1) {
        learningPath.streakDays = 1
      }
    } else {
      learningPath.streakDays = 1
    }
    
    learningPath.lastActivityDate = new Date()

    if (action === 'updateProgress' && topicName) {
      // Find or create topic
      let topic = learningPath.topics.find((t: any) => t.name === topicName)
      
      if (!topic) {
        topic = {
          name: topicName,
          difficulty: difficulty || 'medium',
          status: 'in-progress',
          score: 0,
          attempts: 0,
          lastAttempt: new Date()
        }
        learningPath.topics.push(topic)
      } else {
        const topicIndex = learningPath.topics.findIndex((t: any) => t.name === topicName)
        topic = learningPath.topics[topicIndex]
      }

      // Update topic
      if (score !== undefined) {
        topic.score = score
        topic.attempts += 1
        topic.lastAttempt = new Date()
        
        if (score >= 70) {
          topic.status = 'completed'
          if (!learningPath.strongAreas.includes(topicName)) {
            learningPath.strongAreas.push(topicName)
          }
          learningPath.weakAreas = learningPath.weakAreas.filter((a: string) => a !== topicName)
        } else if (score < 50) {
          if (!learningPath.weakAreas.includes(topicName)) {
            learningPath.weakAreas.push(topicName)
          }
        }

        // Adaptive difficulty adjustment
        topic.difficulty = calculateNextDifficulty(topic.difficulty, score)
      }
    }

    // Calculate overall progress
    if (learningPath.topics.length > 0) {
      const totalScore = learningPath.topics.reduce((sum: number, t: any) => sum + t.score, 0)
      learningPath.overallProgress = Math.round(totalScore / learningPath.topics.length)
    }

    // Check and award badges
    const newBadges = checkAndAwardBadges(learningPath)
    if (newBadges.length > 0) {
      learningPath.badges.push(...newBadges)
    }

    learningPath.updatedAt = new Date()
    await learningPath.save()

    return NextResponse.json(
      { 
        success: true, 
        data: learningPath,
        newBadges: newBadges.length > 0 ? newBadges : undefined
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error updating learning path:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update learning path', message: error.message },
      { status: 500 }
    )
  }
}
