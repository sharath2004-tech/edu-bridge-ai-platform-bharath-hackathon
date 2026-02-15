'use client'

import { TableLoadingSkeleton } from '@/components/modern-loading'
import { PaginationControls } from '@/components/pagination-controls'
import { SuperAdminAnalyticsChat } from '@/components/super-admin-analytics-chat'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { usePagination } from '@/hooks/use-pagination'
import { ArrowUpDown, Download, Search } from 'lucide-react'
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
  const [editDialog, setEditDialog] = useState(false)
  const [editForm, setEditForm] = useState<any>({})
  const [updating, setUpdating] = useState(false)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

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

  const sortedStudents = [...students].sort((a, b) => {
    let aVal, bVal
    
    switch (sortBy) {
      case 'name':
        aVal = a.name?.toLowerCase() || ''
        bVal = b.name?.toLowerCase() || ''
        break
      case 'rollNo':
        aVal = a.rollNo?.toLowerCase() || ''
        bVal = b.rollNo?.toLowerCase() || ''
        break
      case 'school':
        aVal = a.schoolId?.name?.toLowerCase() || ''
        bVal = b.schoolId?.name?.toLowerCase() || ''
        break
      case 'class':
        aVal = a.classId ? `${a.classId.className}-${a.classId.section}` : ''
        bVal = b.classId ? `${b.classId.className}-${b.classId.section}` : ''
        break
      default:
        aVal = a.name?.toLowerCase() || ''
        bVal = b.name?.toLowerCase() || ''
    }
    
    return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
  })

  const pagination = usePagination({
    items: sortedStudents,
    itemsPerPage: 20
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-10 w-56 bg-muted rounded animate-pulse"></div>
            <div className="h-5 w-72 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-[200px] bg-muted rounded animate-pulse"></div>
            <div className="h-10 w-[180px] bg-muted rounded animate-pulse"></div>
            <div className="h-10 w-[100px] bg-muted rounded animate-pulse"></div>
            <div className="h-10 w-[100px] bg-muted rounded animate-pulse"></div>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <TableLoadingSkeleton rows={15} columns={7} />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Students</h1>
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
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="rollNo">Roll No</SelectItem>
                <SelectItem value="school">School</SelectItem>
                <SelectItem value="class">Class</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
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
                          setSelectedStudent(student)
                          setEditForm({
                            name: student.name,
                            email: student.email,
                            rollNo: student.rollNo || '',
                            parentName: student.parentName || '',
                            parentPhone: student.parentPhone || '',
                            address: student.address || '',
                            isActive: student.isActive
                          })
                          setEditDialog(true)
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

      {/* Edit Student Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Update student information</DialogDescription>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault()
            setUpdating(true)
            try {
              const res = await fetch(`/api/super-admin/users`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: selectedStudent._id,
                  ...editForm
                })
              })
              const data = await res.json()
              if (data.success) {
                toast.success('Student updated successfully!')
                setEditDialog(false)
                // Refresh students list
                const params = new URLSearchParams({ role: 'student' })
                if (schoolFilter !== 'all') params.set('schoolId', schoolFilter)
                if (classFilter !== 'all') params.set('classId', classFilter)
                if (searchQuery) params.set('search', searchQuery)
                const refreshRes = await fetch(`/api/super-admin/users?${params}`)
                const refreshData = await refreshRes.json()
                if (refreshData.success) setStudents(refreshData.users)
              } else {
                toast.error(data.error || 'Failed to update student')
              }
            } catch (error) {
              toast.error('Failed to update student')
            } finally {
              setUpdating(false)
            }
          }} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={editForm.email || ''}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Roll Number</label>
              <Input
                value={editForm.rollNo || ''}
                onChange={(e) => setEditForm({ ...editForm, rollNo: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Parent Name</label>
              <Input
                value={editForm.parentName || ''}
                onChange={(e) => setEditForm({ ...editForm, parentName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Parent Phone</label>
              <Input
                value={editForm.parentPhone || ''}
                onChange={(e) => setEditForm({ ...editForm, parentPhone: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Address</label>
              <Input
                value={editForm.address || ''}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editForm.isActive}
                onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                className="h-4 w-4"
              />
              <label className="text-sm font-medium">Active</label>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setEditDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updating}>
                {updating ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Super Admin Analytics Chatbot */}
      <SuperAdminAnalyticsChat />
    </div>
  )
}
