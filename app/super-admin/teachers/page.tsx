'use client'

import { PaginationControls } from '@/components/pagination-controls'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePagination } from '@/hooks/use-pagination'
import { BookOpen, GraduationCap, Mail, Phone, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function SuperAdminTeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [schoolFilter, setSchoolFilter] = useState('all')
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null)
  const [viewProfileDialog, setViewProfileDialog] = useState(false)
  const [viewClassesDialog, setViewClassesDialog] = useState(false)

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

  const pagination = usePagination({
    items: teachers,
    itemsPerPage: 12
  })

  if (loading) {
    return <div className="p-8">Loading teachers...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Teachers</h1>
          <p className="text-muted-foreground mt-2">
            {teachers.length} teachers across all schools
          </p>
        </div>
        <Select value={schoolFilter} onValueChange={setSchoolFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by school" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Schools</SelectItem>
          </SelectContent>
        </Select>
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
                    toast.info('Edit functionality coming soon!')
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assigned Classes</DialogTitle>
            <DialogDescription>Classes taught by {selectedTeacher?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {selectedTeacher?.assignedClasses && selectedTeacher.assignedClasses.length > 0 ? (
              selectedTeacher.assignedClasses.map((cls: any, idx: number) => (
                <div key={idx} className="p-3 border rounded-lg">
                  <p className="font-medium">{cls.className}-{cls.section}</p>
                  <p className="text-sm text-muted-foreground">{cls.subject}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No classes assigned yet</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
