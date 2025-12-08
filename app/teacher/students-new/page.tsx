'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronLeft, ChevronRight, Plus, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function TeacherStudentsPageClient() {
  const [classes, setClasses] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [students, setStudents] = useState<any[]>([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 0 })
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    rollNo: '',
    parentName: '',
    parentPhone: '',
    phone: '',
    password: 'student123'
  })

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(1)
    } else {
      setStudents([])
    }
  }, [selectedClass])

  useEffect(() => {
    if (selectedClass) {
      const timer = setTimeout(() => {
        fetchStudents(1)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [searchQuery])

  const fetchClasses = async () => {
    const res = await fetch('/api/teacher/classes')
    const data = await res.json()
    if (data.success) setClasses(data.classes)
  }

  const fetchStudents = async (page: number) => {
    if (!selectedClass) return
    
    setLoading(true)
    const params = new URLSearchParams({
      classId: selectedClass,
      page: page.toString(),
      limit: pagination.limit.toString()
    })
    
    if (searchQuery) {
      params.set('search', searchQuery)
    }

    const res = await fetch(`/api/teacher/students?${params}`)
    const data = await res.json()
    
    if (data.success) {
      setStudents(data.students)
      setPagination(data.pagination)
    }
    setLoading(false)
  }

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.email || !newStudent.rollNo) {
      alert('Please fill all required fields')
      return
    }

    setLoading(true)
    const res = await fetch('/api/teacher/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newStudent,
        classId: selectedClass
      })
    })

    const data = await res.json()
    setLoading(false)

    if (data.success) {
      alert('Student added successfully!')
      setShowAddDialog(false)
      setNewStudent({ name: '', email: '', rollNo: '', parentName: '', parentPhone: '', phone: '', password: 'student123' })
      fetchStudents(pagination.page)
    } else {
      alert('Error adding student: ' + data.error)
    }
  }

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return

    setLoading(true)
    const res = await fetch(`/api/teacher/students/${studentId}`, {
      method: 'DELETE'
    })

    const data = await res.json()
    setLoading(false)

    if (data.success) {
      alert('Student deleted successfully!')
      fetchStudents(pagination.page)
    } else {
      alert('Error deleting student: ' + data.error)
    }
  }

  const handlePageChange = (newPage: number) => {
    fetchStudents(newPage)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Students</h1>
        <p className="text-muted-foreground mt-2">View and manage students by class</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Select Class</CardTitle>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button disabled={!selectedClass}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Name *</Label>
                    <Input
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                      placeholder="Student full name"
                    />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                      placeholder="student@email.com"
                    />
                  </div>
                  <div>
                    <Label>Roll Number *</Label>
                    <Input
                      value={newStudent.rollNo}
                      onChange={(e) => setNewStudent({...newStudent, rollNo: e.target.value})}
                      placeholder="Roll number"
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={newStudent.phone}
                      onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                      placeholder="+1-555-0000"
                    />
                  </div>
                  <div>
                    <Label>Parent Name</Label>
                    <Input
                      value={newStudent.parentName}
                      onChange={(e) => setNewStudent({...newStudent, parentName: e.target.value})}
                      placeholder="Parent full name"
                    />
                  </div>
                  <div>
                    <Label>Parent Phone</Label>
                    <Input
                      value={newStudent.parentPhone}
                      onChange={(e) => setNewStudent({...newStudent, parentPhone: e.target.value})}
                      placeholder="+1-555-0000"
                    />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={newStudent.password}
                      onChange={(e) => setNewStudent({...newStudent, password: e.target.value})}
                      placeholder="Default: student123"
                    />
                  </div>
                  <Button onClick={handleAddStudent} disabled={loading} className="w-full">
                    {loading ? 'Adding...' : 'Add Student'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger>
              <SelectValue placeholder="Select a class to view students" />
            </SelectTrigger>
            <SelectContent>
              {classes.map(cls => (
                <SelectItem key={cls._id} value={cls._id}>
                  {cls.className}-{cls.section} ({cls.strength || 0} students)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedClass && (
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or roll number..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {selectedClass && (
        <Card>
          <CardHeader>
            <CardTitle>
              Student List ({pagination.total} students)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading students...</div>
            ) : students.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No students found in this class
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Parent Info</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map(student => (
                      <TableRow key={student._id}>
                        <TableCell className="font-mono">{student.rollNo || 'N/A'}</TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.phone || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{student.parentName || 'N/A'}</div>
                            <div className="text-muted-foreground text-xs">{student.parentPhone || ''}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={student.isActive ? 'default' : 'secondary'}>
                            {student.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStudent(student._id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Page {pagination.page} of {pagination.pages} ({pagination.total} total students)
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1 || loading}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        let pageNum
                        if (pagination.pages <= 5) {
                          pageNum = i + 1
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1
                        } else if (pagination.page >= pagination.pages - 2) {
                          pageNum = pagination.pages - 4 + i
                        } else {
                          pageNum = pagination.page - 2 + i
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={pagination.page === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            disabled={loading}
                            className="w-10"
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages || loading}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
