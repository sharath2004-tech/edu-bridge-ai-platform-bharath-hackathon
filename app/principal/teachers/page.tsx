"use client"

import { PaginationControls } from '@/components/pagination-controls'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { usePagination } from '@/hooks/use-pagination'
import { BookOpen, Edit, Plus, Search, Trash2, UserPlus } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Teacher {
  _id: string
  name: string
  email: string
  phone?: string
  subjectSpecialization?: string
  assignedClasses?: string[]
  subjects?: string[]
  createdAt: string
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [assignDialog, setAssignDialog] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [classes, setClasses] = useState<any[]>([])
  const [loadingClasses, setLoadingClasses] = useState(false)

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

  const openAssignDialog = async (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setAssignDialog(true)
    setLoadingClasses(true)
    
    try {
      const res = await fetch('/api/principal/classes')
      if (res.ok) {
        const data = await res.json()
        setClasses(data.classes || [])
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
      toast.error('Failed to load classes')
    } finally {
      setLoadingClasses(false)
    }
  }

  const assignTeacherToClass = async (classId: string) => {
    if (!selectedTeacher) return
    
    try {
      const res = await fetch('/api/principal/assign-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          teacherId: selectedTeacher._id, 
          classId 
        })
      })
      
      const data = await res.json()
      
      if (data.success) {
        toast.success('Teacher assigned to class successfully')
        fetchTeachers() // Refresh the list
      } else {
        toast.error(data.error || 'Failed to assign teacher')
      }
    } catch (error) {
      toast.error('Failed to assign teacher')
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
                  {teacher.subjectSpecialization && (
                    <Badge variant="outline" className="mt-2">
                      {teacher.subjectSpecialization}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => openAssignDialog(teacher)}
                    title="Assign Classes"
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
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

              {/* Show count instead of ObjectIDs */}
              <div className="flex gap-4 mt-3">
                {teacher.assignedClasses && teacher.assignedClasses.length > 0 && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">
                      <strong>{teacher.assignedClasses.length}</strong> classes
                    </span>
                  </div>
                )}
                {teacher.subjects && teacher.subjects.length > 0 && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-green-600" />
                    <span className="text-sm">
                      <strong>{teacher.subjects.length}</strong> subjects
                    </span>
                  </div>
                )}
              </div>
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

      {/* Assign Classes Dialog */}
      <Dialog open={assignDialog} onOpenChange={setAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Classes to {selectedTeacher?.name}</DialogTitle>
            <DialogDescription>
              Select a class to assign to this teacher
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {loadingClasses ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Loading classes...</p>
              </div>
            ) : classes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No classes found in this school
              </p>
            ) : (
              <div className="space-y-2">
                {classes.map((cls) => {
                  const isAssigned = selectedTeacher?.assignedClasses?.includes(cls._id);
                  return (
                    <div
                      key={cls._id}
                      className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium">{cls.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {cls.section} - Grade {cls.grade}
                        </p>
                      </div>
                      {isAssigned ? (
                        <Badge variant="default">Assigned</Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => assignTeacherToClass(cls._id)}
                        >
                          Assign
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
