'use client'

import { PaginationControls } from '@/components/pagination-controls'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { usePagination } from '@/hooks/use-pagination'
import { Download, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function SuperAdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [schoolFilter, setSchoolFilter] = useState('all')
  const [classFilter, setClassFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [viewDialog, setViewDialog] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams({ role: 'student' })
    if (schoolFilter !== 'all') params.set('schoolId', schoolFilter)
    if (classFilter !== 'all') params.set('classId', classFilter)
    if (searchQuery) params.set('search', searchQuery)

    fetch(`/api/super-admin/users?${params}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setStudents(data.users)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [schoolFilter, classFilter, searchQuery])

  const pagination = usePagination({
    items: students,
    itemsPerPage: 20
  })

  if (loading) {
    return <div className="p-8">Loading students...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Students</h1>
          <p className="text-muted-foreground mt-2">
            {students.length} students across all schools
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={() => {
            // Create CSV content
            const headers = ['Roll No', 'Name', 'School', 'Class', 'Email', 'Parent Name', 'Parent Phone', 'Status']
            const csvData = students.map(s => [
              s.rollNo || 'N/A',
              s.name,
              s.schoolId?.name || 'N/A',
              s.classId ? `${s.classId.className}-${s.classId.section}` : 'N/A',
              s.email,
              s.parentName || 'N/A',
              s.parentPhone || 'N/A',
              s.isActive ? 'Active' : 'Inactive'
            ])
            
            const csvContent = [
              headers.join(','),
              ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n')
            
            // Download CSV
            const blob = new Blob([csvContent], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `students_${new Date().toISOString().split('T')[0]}.csv`
            a.click()
            window.URL.revokeObjectURL(url)
            toast.success('Students exported successfully!')
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or roll number..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={schoolFilter} onValueChange={setSchoolFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by school" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schools</SelectItem>
              </SelectContent>
            </Select>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Parent Name</TableHead>
                <TableHead>Parent Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagination.paginatedItems.map((student) => (
                <TableRow key={student._id}>
                  <TableCell className="font-mono text-sm">
                    {student.rollNo || 'N/A'}
                  </TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{student.schoolId?.name || 'N/A'}</span>
                      <span className="text-xs text-muted-foreground">
                        {student.schoolId?.code || 'N/A'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {student.classId 
                      ? `${student.classId.className}-${student.classId.section}`
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell className="text-sm">{student.email}</TableCell>
                  <TableCell>{student.parentName || 'N/A'}</TableCell>
                  <TableCell>{student.parentPhone || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={student.isActive ? 'default' : 'secondary'}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedStudent(student)
                          setViewDialog(true)
                        }}
                      >
                        View
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          toast.info('Edit functionality coming soon!')
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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
        </CardContent>
      </Card>

      {/* View Student Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>Complete information about {selectedStudent?.name}</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Roll Number</p>
                  <p className="text-sm font-mono">{selectedStudent.rollNo || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-sm">{selectedStudent.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{selectedStudent.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">School</p>
                  <p className="text-sm">{selectedStudent.schoolId?.name || 'N/A'}</p>
                  <p className="text-xs text-muted-foreground">{selectedStudent.schoolId?.code || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Class</p>
                  <p className="text-sm">
                    {selectedStudent.classId 
                      ? `${selectedStudent.classId.className}-${selectedStudent.classId.section}`
                      : 'N/A'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={selectedStudent.isActive ? 'default' : 'secondary'}>
                    {selectedStudent.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Parent Name</p>
                  <p className="text-sm">{selectedStudent.parentName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Parent Phone</p>
                  <p className="text-sm">{selectedStudent.parentPhone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                  <p className="text-sm">
                    {selectedStudent.dateOfBirth 
                      ? new Date(selectedStudent.dateOfBirth).toLocaleDateString()
                      : 'N/A'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gender</p>
                  <p className="text-sm capitalize">{selectedStudent.gender || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p className="text-sm">{selectedStudent.address || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Joined</p>
                  <p className="text-sm">{new Date(selectedStudent.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
