"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, Flame, Star, Trophy, Zap } from "lucide-react"
import { useEffect, useState } from "react"

type GamificationData = {
  xp: number
  level: number
  streak: number
  badges: Array<{ id: string; name: string; description: string; icon: string; earnedAt: string }>
  achievements: Array<{ id: string; title: string; progress: number; target: number; completed: boolean }>
}

export function GamificationWidget() {
  const [data, setData] = useState<GamificationData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGamification()
  }, [])

  const fetchGamification = async () => {
    try {
      const res = await fetch('/api/gamification')
      if (res.ok) {
        const result = await res.json()
        setData(result.data)
      }
    } catch (error) {
      console.error('Error fetching gamification:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </Card>
    )
  }

  if (!data) return null

  const xpProgress = ((data.xp % 100) / 100) * 100

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Level */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group animate-slideInUp" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-600 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125" />
            <span className="text-sm font-medium text-blue-900">Level</span>
          </div>
          <span className="text-3xl font-bold text-blue-600 animate-countUp">{data.level}</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-blue-700">
            <span>{data.xp % 100} XP</span>
            <span>100 XP</span>
          </div>
          <Progress value={xpProgress} className="h-2" />
        </div>
      </Card>

      {/* Streak */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group animate-slideInUp" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-600 transition-transform duration-300 group-hover:scale-125 group-hover:animate-pulse" />
            <span className="text-sm font-medium text-orange-900">Streak</span>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 animate-countUp">{data.streak}</div>
            <div className="text-xs text-orange-700">days</div>
          </div>
        </div>
      </Card>

      {/* Total XP */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group animate-slideInUp" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600 transition-transform duration-300 group-hover:scale-125" />
            <span className="text-sm font-medium text-purple-900">Total XP</span>
          </div>
          <div className="text-3xl font-bold text-purple-600 animate-countUp">{data.xp}</div>
        </div>
      </Card>

      {/* Badges */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group animate-slideInUp" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-green-600 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
            <span className="text-sm font-medium text-green-900">Badges</span>
          </div>
          <div className="text-3xl font-bold text-green-600 animate-countUp">{data.badges.length}</div>
        </div>
      </Card>

      {/* Badges List */}
      <Card className="p-6 md:col-span-2 lg:col-span-4 animate-slideInBottom" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Your Badges
        </h3>
        {data.badges.length === 0 ? (
          <p className="text-sm text-muted-foreground">No badges earned yet. Complete lessons and quizzes to earn badges!</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {data.badges.map((badge, i) => (
              <div
                key={badge.id}
                className="p-4 rounded-lg border bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-105 animate-zoomIn"
                style={{ animationDelay: `${0.6 + i * 0.1}s`, animationFillMode: 'both' }}
              >
                <div className="text-3xl mb-2 animate-bounce-subtle">{badge.icon}</div>
                <div className="font-semibold text-sm">{badge.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{badge.description}</div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Achievements */}
      <Card className="p-6 md:col-span-2 lg:col-span-4 animate-slideInBottom" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Achievements
        </h3>
        <div className="space-y-3">
          {data.achievements.map((achievement, i) => (
            <div key={achievement.id} className="space-y-2 animate-slideInLeft" style={{ animationDelay: `${0.7 + i * 0.1}s`, animationFillMode: 'both' }}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{achievement.title}</span>
                <Badge variant={achievement.completed ? "default" : "secondary"} className={achievement.completed ? "animate-pulse" : ""}>
                  {achievement.progress}/{achievement.target}
                </Badge>
              </div>
              <Progress value={(achievement.progress / achievement.target) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
