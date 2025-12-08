"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flag, Check, X, Eye } from "lucide-react"

export default function ModerationPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold mb-2">Content Moderation</h1>
        <p className="text-muted-foreground">Review and moderate user-generated content</p>
      </div>

      {/* Status Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: "Pending Review", count: 12, icon: Flag, color: "from-amber-500/20 to-amber-500/5" },
          { label: "Approved", count: 324, icon: Check, color: "from-emerald-500/20 to-emerald-500/5" },
          { label: "Rejected", count: 8, icon: X, color: "from-destructive/20 to-destructive/5" },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card
              key={i}
              className={`p-4 border-0 bg-gradient-to-br ${stat.color} animate-slideInLeft`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.count}</p>
                </div>
                <Icon className="w-5 h-5" />
              </div>
            </Card>
          )
        })}
      </div>

      {/* Pending Items */}
      <div className="space-y-3">
        {[
          {
            type: "Comment",
            author: "John Doe",
            content: "This course is amazing!",
            status: "Flagged",
            reason: "Spam",
          },
          {
            type: "Post",
            author: "Sarah Smith",
            content: "Check out this tutorial...",
            status: "Flagged",
            reason: "Inappropriate",
          },
          {
            type: "Review",
            author: "Mike Johnson",
            content: "Great content, very helpful",
            status: "Pending",
            reason: "Manual review",
          },
        ].map((item, i) => (
          <Card
            key={i}
            className="p-4 border border-border hover:border-primary/50 transition-all animate-slideInLeft"
            style={{ animationDelay: `${0.3 + i * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium bg-primary/20 text-primary px-2 py-1 rounded">{item.type}</span>
                  <span className="text-sm font-medium">{item.author}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.content}</p>
                <p className="text-xs text-amber-600">Reason: {item.reason}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                  <Eye className="w-4 h-4" />
                  Review
                </Button>
                <Button size="sm" className="gap-1">
                  <Check className="w-4 h-4" />
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="gap-1 text-destructive bg-transparent">
                  <X className="w-4 h-4" />
                  Reject
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
