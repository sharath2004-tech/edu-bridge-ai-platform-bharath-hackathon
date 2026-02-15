'use client'

import { CardLoadingSkeleton } from '@/components/modern-loading'
import { PaginationControls } from '@/components/pagination-controls'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePagination } from '@/hooks/use-pagination'
import { ArrowUpDown, BookOpen, GraduationCap, Mail, Phone, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function SuperAdminTeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [schoolFilter, setSchoolFilter] = useState('all')
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null)
  const [viewProfileDialog, setViewProfileDialog] = useState(false)
  const [viewClassesDialog, setViewClassesDialog] = useState(false)
  const [editDialog, setEditDialog] = useState(false)
  const [editForm, setEditForm] = useState<any>({})
  const [updating, setUpdating] = useState(false)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    const params = new URLSearchParams({ role: 'teacher' })
    if (schoolFilter !== 'all') params.set('schoolId', schoolFilter)

    fetch(`/api/super-admin/users?${params}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setTeachers(data.users)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [schoolFilter])

  const sortedTeachers = [...teachers].sort((a, b) => {
    let aVal, bVal
    
    switch (sortBy) {
      case 'name':
        aVal = a.name?.toLowerCase() || ''
        bVal = b.name?.toLowerCase() || ''
        break
      case 'school':
        aVal = a.schoolId?.name?.toLowerCase() || ''
        bVal = b.schoolId?.name?.toLowerCase() || ''
        break
      case 'subject':
        aVal = a.subjectSpecialization?.toLowerCase() || ''
        bVal = b.subjectSpecialization?.toLowerCase() || ''
        break
      default:
        aVal = a.name?.toLowerCase() || ''
        bVal = b.name?.toLowerCase() || ''
    }
    
    return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
  })

  const pagination = usePagination({
    items: sortedTeachers,
    itemsPerPage: 15
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
          </div>
        </div>
        <CardLoadingSkeleton count={12} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Teachers</h1>
          <p className="text-muted-foreground mt-2">
            {teachers.length} teachers across all schools
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={schoolFilter} onValueChange={setSchoolFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by school" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Schools</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="school">School</SelectItem>
              <SelectItem value="subject">Subject</SelectItem>
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
      </div>

      <div className="grid gap-6">
        {pagination.paginatedItems.map((teacher) => (
          <Card key={teacher._id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{teacher.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{teacher.teacherRole || 'Teacher'}</Badge>
                      {teacher.subjectSpecialization && (
                        <Badge variant="outline">{teacher.subjectSpecialization}</Badge>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={teacher.isActive ? 'default' : 'secondary'}>
                  {teacher.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground">School</h3>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{teacher.schoolId?.name || 'N/A'}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {teacher.schoolId?.code || 'N/A'}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground">Contact</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{teacher.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{teacher.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground">Teaching Info</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>Subject: {teacher.subjectSpecialization || 'N/A'}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Joined: {new Date(teacher.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6 pt-6 border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedTeacher(teacher)
                    setViewProfileDialog(true)
                  }}
                >
                  View Profile
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedTeacher(teacher)
                    setViewClassesDialog(true)
                  }}
                >
                  View Classes
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedTeacher(teacher)
                    setEditForm({
                      name: teacher.name,
                      email: teacher.email,
                      phone: teacher.phone || '',
                      subjectSpecialization: teacher.subjectSpecialization || '',
                      teacherRole: teacher.teacherRole || 'Teacher',
                      isActive: teacher.isActive
                    })
                    setEditDialog(true)
                  }}
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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

      {/* View Profile Dialog */}
      <Dialog open={viewProfileDialog} onOpenChange={setViewProfileDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Teacher Profile</DialogTitle>
            <DialogDescription>Detailed information about {selectedTeacher?.name}</DialogDescription>
          </DialogHeader>
          {selectedTeacher && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-sm">{selectedTeacher.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{selectedTeacher.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-sm">{selectedTeacher.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">School</p>
                  <p className="text-sm">{selectedTeacher.schoolId?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Subject</p>
                  <p className="text-sm">{selectedTeacher.subjectSpecialization || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <p className="text-sm">{selectedTeacher.teacherRole || 'Teacher'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={selectedTeacher.isActive ? 'default' : 'secondary'}>
                    {selectedTeacher.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Joined</p>
                  <p className="text-sm">{new Date(selectedTeacher.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Classes Dialog */}
      <Dialog open={viewClassesDialog} onOpenChange={setViewClassesDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Teacher Information</DialogTitle>
            <DialogDescription>Details for {selectedTeacher?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">School</p>
                <p className="text-sm font-medium">{selectedTeacher?.schoolId?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Subject</p>
                <p className="text-sm font-medium">{selectedTeacher?.subjectSpecialization || 'N/A'}</p>
              </div>
            </div>

            {/* Classes Section */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Assigned Classes
                {selectedTeacher?.assignedClasses?.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {selectedTeacher.assignedClasses.length} classes
                  </Badge>
                )}
              </h4>
              {selectedTeacher?.assignedClasses && selectedTeacher.assignedClasses.length > 0 ? (
                <div className="text-sm text-muted-foreground bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
                  <p className="mb-2">⚠️ Class details will be loaded from the database</p>
                  <p className="text-xs">Total: {selectedTeacher.assignedClasses.length} class assignments</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8 bg-muted/30 rounded-lg">
                  No classes assigned yet
                </p>
              )}
            </div>

            {/* Subjects Section */}
            {selectedTeacher?.subjects && selectedTeacher.subjects.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Teaching Subjects
                  <Badge variant="secondary" className="ml-auto">
                    {selectedTeacher.subjects.length} subjects
                  </Badge>
                </h4>
                <div className="text-sm text-muted-foreground bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
                  <p className="mb-2">⚠️ Subject details will be loaded from the database</p>
                  <p className="text-xs">Total: {selectedTeacher.subjects.length} subject assignments</p>
                </div>
              </div>
            )}

            {/* Note */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-3">
              <p className="text-xs text-blue-800 dark:text-blue-300">
                <strong>Note:</strong> Class and subject names are stored as references. The detailed view showing actual class names and subjects is coming soon.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Teacher Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
            <DialogDescription>Update teacher information</DialogDescription>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault()
            setUpdating(true)
            try {
              const res = await fetch(`/api/super-admin/users`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: selectedTeacher._id,
                  ...editForm
                })
              })
              const data = await res.json()
              if (data.success) {
                toast.success('Teacher updated successfully!')
                setEditDialog(false)
                // Refresh teachers list
                const params = new URLSearchParams({ role: 'teacher' })
                if (schoolFilter !== 'all') params.set('schoolId', schoolFilter)
                const refreshRes = await fetch(`/api/super-admin/users?${params}`)
                const refreshData = await refreshRes.json()
                if (refreshData.success) setTeachers(refreshData.users)
              } else {
                toast.error(data.error || 'Failed to update teacher')
              }
            } catch (error) {
              toast.error('Failed to update teacher')
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
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={editForm.phone || ''}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Subject Specialization</label>
              <Input
                value={editForm.subjectSpecialization || ''}
                onChange={(e) => setEditForm({ ...editForm, subjectSpecialization: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <Input
                value={editForm.teacherRole || ''}
                onChange={(e) => setEditForm({ ...editForm, teacherRole: e.target.value })}
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
    </div>
  )
}
