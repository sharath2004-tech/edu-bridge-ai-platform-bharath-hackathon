import { getSession } from '@/lib/auth'
import { Gamification } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

const BADGES = {
  FIRST_LESSON: { id: 'first_lesson', name: 'First Steps', description: 'Complete your first lesson', icon: '🎓' },
  QUIZ_MASTER: { id: 'quiz_master', name: 'Quiz Master', description: 'Score 100% on any quiz', icon: '🏆' },
  WEEK_STREAK: { id: 'week_streak', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥' },
  MONTH_STREAK: { id: 'month_streak', name: 'Monthly Champion', description: 'Maintain a 30-day streak', icon: '⭐' },
  LEVEL_5: { id: 'level_5', name: 'Rising Star', description: 'Reach level 5', icon: '🌟' },
  LEVEL_10: { id: 'level_10', name: 'Expert Learner', description: 'Reach level 10', icon: '💫' },
}

const XP_PER_LEVEL = 100

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    let gamification = await Gamification.findOne({ userId: session.id })
    
    if (!gamification) {
      gamification = await Gamification.create({
        userId: session.id,
        xp: 0,
        level: 1,
        streak: 0,
        badges: [],
        achievements: [
          { id: 'complete_10_lessons', title: 'Complete 10 lessons', progress: 0, target: 10, completed: false },
          { id: 'score_5_quizzes', title: 'Pass 5 quizzes', progress: 0, target: 5, completed: false },
          { id: 'reach_level_10', title: 'Reach level 10', progress: 0, target: 10, completed: false },
        ]
      })
    }

    return NextResponse.json({ success: true, data: gamification }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching gamification:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { action, xpAmount = 0 } = await request.json()

    await connectDB()

    let gamification = await Gamification.findOne({ userId: session.id })
    
    if (!gamification) {
      gamification = await Gamification.create({
        userId: session.id,
        xp: 0,
        level: 1,
        streak: 0,
        badges: [],
        achievements: []
      })
    }

    // Add XP
    gamification.xp += xpAmount

    // Calculate level
    const newLevel = Math.floor(gamification.xp / XP_PER_LEVEL) + 1
    const leveledUp = newLevel > gamification.level
    gamification.level = newLevel

    // Update streak
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (gamification.lastActivityDate) {
      const lastActivity = new Date(gamification.lastActivityDate)
      lastActivity.setHours(0, 0, 0, 0)
      
      const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === 1) {
        gamification.streak += 1
      } else if (daysDiff > 1) {
        gamification.streak = 1
      }
    } else {
      gamification.streak = 1
    }
    
    gamification.lastActivityDate = new Date()

    // Award badges
    interface Badge {
      id: string
      name: string
      description: string
      icon: string
      earnedAt?: Date
    }
    const newBadges: Badge[] = []
    
    if (action === 'complete_lesson' && !gamification.badges.find((b: Badge) => b.id === BADGES.FIRST_LESSON.id)) {
      gamification.badges.push({ ...BADGES.FIRST_LESSON, earnedAt: new Date() })
      newBadges.push(BADGES.FIRST_LESSON)
    }
    
    if (action === 'perfect_quiz' && !gamification.badges.find((b: Badge) => b.id === BADGES.QUIZ_MASTER.id)) {
      gamification.badges.push({ ...BADGES.QUIZ_MASTER, earnedAt: new Date() })
      newBadges.push(BADGES.QUIZ_MASTER)
    }
    
    if (gamification.streak >= 7 && !gamification.badges.find((b: Badge) => b.id === BADGES.WEEK_STREAK.id)) {
      gamification.badges.push({ ...BADGES.WEEK_STREAK, earnedAt: new Date() })
      newBadges.push(BADGES.WEEK_STREAK)
    }
    
    if (gamification.streak >= 30 && !gamification.badges.find((b: Badge) => b.id === BADGES.MONTH_STREAK.id)) {
      gamification.badges.push({ ...BADGES.MONTH_STREAK, earnedAt: new Date() })
      newBadges.push(BADGES.MONTH_STREAK)
    }
    
    if (gamification.level >= 5 && !gamification.badges.find((b: Badge) => b.id === BADGES.LEVEL_5.id)) {
      gamification.badges.push({ ...BADGES.LEVEL_5, earnedAt: new Date() })
      newBadges.push(BADGES.LEVEL_5)
    }
    
    if (gamification.level >= 10 && !gamification.badges.find((b: Badge) => b.id === BADGES.LEVEL_10.id)) {
      gamification.badges.push({ ...BADGES.LEVEL_10, earnedAt: new Date() })
      newBadges.push(BADGES.LEVEL_10)
    }

    await gamification.save()

    return NextResponse.json({
      success: true,
      data: gamification,
      leveledUp,
      newBadges
    }, { status: 200 })
  } catch (error: any) {
    console.error('Error updating gamification:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
