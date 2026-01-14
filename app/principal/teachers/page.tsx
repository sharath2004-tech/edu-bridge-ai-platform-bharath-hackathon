"use client"

import { PaginationControls } from '@/components/pagination-controls'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { usePagination } from '@/hooks/use-pagination'
import { Edit, Plus, Search, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

interface Teacher {
  _id: string
  name: string
  email: string
  phone?: string
  assignedClasses?: string[]
  assignedSubjects?: string[]
  createdAt: string
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const res = await fetch('/api/principal/teachers')
      if (res.ok) {
        const data = await res.json()
        setTeachers(data.teachers)
      }
    } catch (error) {
      console.error('Error fetching teachers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pagination = usePagination({
    items: filteredTeachers,
    itemsPerPage: 15
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teachers</h1>
          <p className="text-muted-foreground">Manage teacher accounts and assignments</p>
        </div>
        <Button asChild>
          <a href="/principal/teachers/create">
            <Plus className="w-4 h-4 mr-2" />
            Add Teacher
          </a>
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search teachers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Teachers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <p className="text-muted-foreground col-span-full text-center py-8">Loading...</p>
        ) : filteredTeachers.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-center py-8">
            {searchQuery ? "No teachers found" : "No teachers yet. Add your first teacher!"}
          </p>
        ) : (
          pagination.paginatedItems.map((teacher) => (
            <Card key={teacher._id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">{teacher.name}</h3>
                  <p className="text-sm text-muted-foreground">{teacher.email}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>

              {teacher.phone && (
                <p className="text-sm text-muted-foreground mb-2">{teacher.phone}</p>
              )}

              {teacher.assignedClasses && teacher.assignedClasses.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-medium mb-1">Classes:</p>
                  <div className="flex flex-wrap gap-1">
                    {teacher.assignedClasses.map((cls) => (
                      <span key={cls} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {teacher.assignedSubjects && teacher.assignedSubjects.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-1">Subjects:</p>
                  <div className="flex flex-wrap gap-1">
                    {teacher.assignedSubjects.map((subject) => (
                      <span key={subject} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {filteredTeachers.length > 0 && (
        <PaginationControls
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.goToPage}
          canGoPrevious={pagination.canGoPrevious}
          canGoNext={pagination.canGoNext}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
          totalItems={pagination.totalItems}
        />
      )}

      {/* Create Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Add Teacher</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Create teacher form will be implemented here
            </p>
            <Button onClick={() => setShowCreateModal(false)}>Close</Button>
          </Card>
        </div>
      )}
    </div>
  )
}
