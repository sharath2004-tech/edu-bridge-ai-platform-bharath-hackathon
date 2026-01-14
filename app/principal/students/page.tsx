"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Edit, Plus, Search, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { usePagination } from '@/hooks/use-pagination'
import { PaginationControls } from '@/components/pagination-controls'

interface Student {
  _id: string
  name: string
  email: string
  phone?: string
  className?: string
  rollNumber?: string
  createdAt: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClass, setSelectedClass] = useState("")

  useEffect(() => {
    fetchStudents()
  }, [selectedClass])

  const fetchStudents = async () => {
    try {
      const url = selectedClass 
        ? `/api/principal/students?class=${selectedClass}`
        : '/api/principal/students'
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setStudents(data.students)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`)) {
      return
    }

    try {
      const res = await fetch(`/api/principal/students?id=${studentId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        alert('Student deleted successfully')
        fetchStudents() // Refresh the list
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete student')
      }
    } catch (error) {
      console.error('Error deleting student:', error)
      alert('An error occurred while deleting the student')
    }
  }

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber?.includes(searchQuery)
  )

  const pagination = usePagination({
    items: filteredStudents,
    itemsPerPage: 20
  })

  // Get unique classes
  const classes = Array.from(new Set(students.map(s => s.className).filter(Boolean)))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">Manage student enrollment</p>
        </div>
        <Button asChild>
          <a href="/principal/students/create">
            <Plus className="w-4 h-4 mr-2" />
            Enroll Student
          </a>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">All Classes</option>
          {classes.map((cls) => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>

      {/* Students Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4 font-medium">Roll No.</th>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Class</th>
                <th className="text-center p-4 font-medium">Section</th>
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">Phone</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-muted-foreground">
                    {searchQuery ? "No students found" : "No students enrolled yet"}
                  </td>
                </tr>
              ) : (
                pagination.paginatedItems.map((student) => (
                  <tr key={student._id} className="border-b hover:bg-muted/50">
                    <td className="p-4">{student.rollNumber || '-'}</td>
                    <td className="p-4 font-medium">{student.name}</td>
                    <td className="p-4">{student.className || '-'}</td>
                    <td className="p-4 text-center">
                      <Badge variant="outline">{(student as any).section || 'N/A'}</Badge>
                    </td>
                    <td className="p-4 text-sm">{student.email}</td>
                    <td className="p-4 text-sm">{student.phone || '-'}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" title="Edit student">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteStudent(student._id, student.name)}
                          title="Delete student"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t">
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
        </div>
      </Card>

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredStudents.length} student(s)
        </p>
      </div>
    </div>
  )
}
