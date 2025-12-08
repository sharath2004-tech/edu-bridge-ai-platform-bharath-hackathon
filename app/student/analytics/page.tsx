"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, BookOpen, Brain, Clock, Flame, Star, Target, TrendingUp, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import {
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

export default function AnalyticsPage() {
  const [learningPath, setLearningPath] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLearningPath()
  }, [])

  const fetchLearningPath = async () => {
    try {
      const res = await fetch('/api/learning-path')
      if (res.ok) {
        const data = await res.json()
        setLearningPath(data.data)
      }
    } catch (error) {
      console.error('Error fetching learning path:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Learning Analytics</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-20 bg-muted rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    )
  }
  if (!learningPath) {
    // Show default analytics if no learning path exists yet
    const lineData = [
      { week: "Week 1", hours: 5, courses: 2 },
      { week: "Week 2", hours: 8, courses: 3 },
      { week: "Week 3", hours: 6, courses: 2 },
      { week: "Week 4", hours: 12, courses: 4 },
    ]

    const pieData = [
      { name: "Completed", value: 45 },
      { name: "In Progress", value: 35 },
      { name: "Not Started", value: 20 },
    ]

    const COLORS = ["#6366f1", "#f59e0b", "#d1d5db"]

    return (
      <div className="space-y-6 animate-fadeIn">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Analytics</h1>
          <p className="text-muted-foreground">Track your learning progress and achievements</p>
        </div>

        {/* Key Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: "Total Learning Hours", value: "32.5", icon: Clock },
            { label: "Courses Completed", value: "3", icon: BookOpen },
            { label: "Lessons Finished", value: "84", icon: Target },
            { label: "Avg Score", value: "87%", icon: TrendingUp },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <Card
                key={i}
                className="p-4 border border-border animate-slideInLeft"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              </Card>
            )
          })}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6 border border-border animate-slideInLeft" style={{ animationDelay: "0.4s" }}>
              <h2 className="text-lg font-bold mb-4">Weekly Activity</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="week" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: `1px solid var(--color-border)`,
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="hours" stroke="var(--color-primary)" strokeWidth={2} />
                  <Line type="monotone" dataKey="courses" stroke="var(--color-accent)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-6 border border-border animate-slideInLeft" style={{ animationDelay: "0.5s" }}>
            <h2 className="text-lg font-bold mb-4">Course Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    )
  }

  // AI-Powered Learning Path View
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500'
      case 'medium': return 'bg-yellow-500'
      case 'hard': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50'
      case 'in-progress': return 'text-blue-600 bg-blue-50'
      case 'not-started': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Learning Analytics</h1>
          <p className="text-muted-foreground">AI-powered insights into your learning journey</p>
        </div>
        <Badge variant="outline" className="text-lg">
          <Target className="w-4 h-4 mr-2" />
          {learningPath.overallProgress}% Overall Progress
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Streak</p>
              <p className="text-3xl font-bold">{learningPath.streakDays}</p>
              <p className="text-xs text-muted-foreground mt-1">days</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Topics Completed</p>
              <p className="text-3xl font-bold">
                {learningPath.topics.filter((t: any) => t.status === 'completed').length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                of {learningPath.topics.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Badges Earned</p>
              <p className="text-3xl font-bold">{learningPath.badges.length}</p>
              <p className="text-xs text-muted-foreground mt-1">achievements</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Strong Areas</p>
              <p className="text-3xl font-bold">{learningPath.strongAreas.length}</p>
              <p className="text-xs text-muted-foreground mt-1">mastered</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Badges */}
      {learningPath.badges.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" /> Your Badges
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {learningPath.badges.map((badge: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg"
              >
                <div className="text-4xl">{badge.icon}</div>
                <div>
                  <h3 className="font-semibold">{badge.name}</h3>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(badge.earnedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Topics Progress */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" /> Topics Progress
        </h2>
        <div className="space-y-4">
          {learningPath.topics.map((topic: any, idx: number) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getDifficultyColor(topic.difficulty)}`}></div>
                  <span className="font-medium">{topic.name}</span>
                  <Badge className={getStatusColor(topic.status)}>
                    {topic.status.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {topic.attempts} {topic.attempts === 1 ? 'attempt' : 'attempts'}
                  </span>
                  <span className="text-sm font-semibold">{topic.score}%</span>
                </div>
              </div>
              <Progress value={topic.score} className="h-2" />
              {topic.difficulty === 'hard' && topic.score < 70 && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Brain className="w-3 h-3" />
                  AI Recommendation: Review fundamentals before attempting hard problems
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Weak Areas & Recommendations */}
      <div className="grid gap-6 md:grid-cols-2">
        {learningPath.weakAreas.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-600" /> Focus Areas
            </h2>
            <div className="space-y-2">
              {learningPath.weakAreas.map((area: string, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <span>{area}</span>
                  <Button size="sm" variant="outline">Practice</Button>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              💡 AI suggests reviewing these topics with easier difficulty level
            </p>
          </Card>
        )}

        {learningPath.strongAreas.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-green-600" /> Strong Areas
            </h2>
            <div className="space-y-2">
              {learningPath.strongAreas.map((area: string, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span>{area}</span>
                  <Badge variant="outline" className="text-green-600">Mastered</Badge>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              🎯 Ready for advanced challenges in these areas!
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
