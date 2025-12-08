"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Share2, Search, Plus } from "lucide-react"
import { useState } from "react"

export default function CommunityPage() {
  const [liked, setLiked] = useState<Set<number>>(new Set())

  const toggleLike = (id: number) => {
    const newLiked = new Set(liked)
    if (newLiked.has(id)) newLiked.delete(id)
    else newLiked.add(id)
    setLiked(newLiked)
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community</h1>
          <p className="text-muted-foreground">Connect, share, and learn with peers</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Post
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search discussions..." className="pl-10" />
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {[
          {
            author: "Sarah Johnson",
            avatar: "SJ",
            role: "Student",
            time: "2 hours ago",
            title: "Best practices for React state management",
            content:
              "Can anyone share their preferred approach to managing complex state in React? I'm looking to improve my architecture...",
            likes: 24,
            comments: 8,
            shares: 3,
          },
          {
            author: "Mike Chen",
            avatar: "MC",
            role: "Teacher",
            time: "5 hours ago",
            title: "Announcement: New course added!",
            content:
              "I'm excited to announce a new advanced course on Machine Learning. Enrollment is now open for all students.",
            likes: 156,
            comments: 42,
            shares: 28,
          },
          {
            author: "Emma Davis",
            avatar: "ED",
            role: "Student",
            time: "1 day ago",
            title: "Study group for web development",
            content:
              "Looking for motivated students to form a study group. We can meet 3x a week to work on projects together.",
            likes: 45,
            comments: 12,
            shares: 7,
          },
        ].map((post, i) => (
          <Card
            key={i}
            className="p-6 border border-border hover:border-primary/50 transition-all group animate-slideInLeft"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                {post.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{post.author}</span>
                  <span className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded">{post.role}</span>
                </div>
                <p className="text-xs text-muted-foreground">{post.time}</p>
              </div>
            </div>

            {/* Content */}
            <h3 className="font-bold mb-2">{post.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">{post.content}</p>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button
                onClick={() => toggleLike(i)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors group"
              >
                <Heart
                  className={`w-4 h-4 transition-all ${liked.has(i) ? "fill-destructive text-destructive" : ""}`}
                />
                <span className={liked.has(i) ? "text-destructive" : ""}>{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments}</span>
              </button>
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Share2 className="w-4 h-4" />
                <span>{post.shares}</span>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
