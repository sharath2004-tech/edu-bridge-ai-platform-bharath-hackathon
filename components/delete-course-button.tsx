"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteCourseButton({ courseId }: { courseId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        router.push('/teacher/courses')
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete course')
      }
    } catch (error) {
      alert('Error deleting course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleDelete} 
      disabled={loading}
      variant="destructive"
      size="sm"
      className="gap-2"
    >
      <Trash2 className="w-4 h-4" />
      {loading ? "Deleting..." : "Delete"}
    </Button>
  )
}
