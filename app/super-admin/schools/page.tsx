'use client'

import { PaginationControls } from '@/components/pagination-controls'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePagination } from '@/hooks/use-pagination'
import { useToast } from '@/hooks/use-toast'
import { Building2, Calendar, CheckCircle, ExternalLink, Mail, MapPin, Phone, UserPlus, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function SuperAdminSchoolsPage() {
  const [schools, setSchools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<any>(null)
  const [creatingAdmin, setCreatingAdmin] = useState(false)
  const [adminCredentials, setAdminCredentials] = useState<any>(null)
  const [assignTeachersDialog, setAssignTeachersDialog] = useState(false)
  const [schoolTeachers, setSchoolTeachers] = useState<any[]>([])
  const [schoolClasses, setSchoolClasses] = useState<any[]>([])
  const [loadingAssignments, setLoadingAssignments] = useState(false)
  const { toast } = useToast()
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    phone: '',
    sendEmail: true
  })

  useEffect(() => {
    fetchSchools()
  }, [])

  const fetchSchools = () => {
    setLoading(true)
    fetch('/api/super-admin/schools')
      .then(res => res.json())
      .then(data => {
        if (data.success) setSchools(data.schools)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const pagination = usePagination({
    items: schools,
    itemsPerPage: 10
  })

  const toggleSchoolStatus = async (schoolId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/super-admin/schools', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId,
          isActive: !currentStatus
        })
      })

      if (res.ok) {
        fetchSchools()
        toast({
          title: 'Success',
          description: `School ${!currentStatus ? 'activated' : 'deactivated'} successfully`
        })
      } else {
        const data = await res.json()
        toast({
          title: 'Error',
          description: data.error || 'Failed to update school status',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error updating school status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update school status',
        variant: 'destructive'
      })
    }
  }

  const openCreateAdminDialog = (school: any) => {
    setSelectedSchool(school)
    setAdminForm({
      name: school.principal?.name || '',
      email: school.principal?.email || '',
      phone: school.principal?.phone || '',
      sendEmail: true
    })
    setIsCreateAdminOpen(true)
  }

  const openAssignTeachersDialog = async (school: any) => {
    setSelectedSchool(school)
    setAssignTeachersDialog(true)
    setLoadingAssignments(true)
    
    try {
      // Fetch teachers for this school
      const teachersRes = await fetch(`/api/super-admin/users?role=teacher&schoolId=${school._id}`)
      const teachersData = await teachersRes.json()
      
      // Fetch classes for this school
      const classesRes = await fetch(`/api/super-admin/classes?schoolId=${school._id}`)
      const classesData = await classesRes.json()
      
      if (teachersData.success) setSchoolTeachers(teachersData.users || [])
      if (classesData.success) setSchoolClasses(classesData.classes || [])
    } catch (error) {
      console.error('Error loading assignments:', error)
      toast({
        title: 'Error',
        description: 'Failed to load teachers and classes',
        variant: 'destructive'
      })
    } finally {
      setLoadingAssignments(false)
    }
  }

  const assignTeacherToClass = async (teacherId: string, classId: string) => {
    try {
      const res = await fetch('/api/super-admin/assign-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId, classId })
      })
      
      const data = await res.json()
      
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Teacher assigned to class successfully'
        })
        // Refresh teachers list
        const teachersRes = await fetch(`/api/super-admin/users?role=teacher&schoolId=${selectedSchool._id}`)
        const teachersData = await teachersRes.json()
        if (teachersData.success) setSchoolTeachers(teachersData.users || [])
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to assign teacher',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign teacher',
        variant: 'destructive'
      })
    }
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreatingAdmin(true)

    try {
      const res = await fetch('/api/super-admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: adminForm.name,
          email: adminForm.email,
          phone: adminForm.phone,
          role: 'admin',
          schoolId: selectedSchool._id,
          sendEmail: adminForm.sendEmail
        })
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Admin created successfully'
        })
        
        if (data.credentials) {
          setAdminCredentials(data.credentials)
        }
        
        setIsCreateAdminOpen(false)
        setAdminForm({ name: '', email: '', phone: '', sendEmail: true })
        fetchSchools()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create admin',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create admin',
        variant: 'destructive'
      })
    } finally {
      setCreatingAdmin(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading schools...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Schools</h1>
          <p className="text-muted-foreground mt-2">
            Manage all registered schools on the platform
          </p>
        </div>
        <Button onClick={() => {
          toast({
            title: 'School Registration',
            description: 'School registration is available at /school-registration'
          })
          window.open('/school-registration', '_blank')
        }}>
          <Building2 className="mr-2 h-4 w-4" />
          Add New School
        </Button>
      </div>

      <div className="grid gap-6">
        {pagination.paginatedItems.map((school) => (
          <Card key={school._id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{school.name}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <Badge variant="outline">{school.code}</Badge>
                      <span>{school.board}</span>
                      <span>•</span>
                      <span className="capitalize">{school.type}</span>
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={school.isActive ? 'default' : 'secondary'}>
                  {school.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{school.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{school.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {school.address.city}, {school.address.state}, {school.address.country}
                      </span>
                    </div>
                    {school.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {school.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground">Principal Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{school.principal.name}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{school.principal.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{school.principal.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Established: {new Date(school.established).getFullYear()}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Students: <strong>{school.stats?.totalStudents || 0}</strong></span>
                    <span className="text-muted-foreground">Teachers: <strong>{school.stats?.totalTeachers || 0}</strong></span>
                    <span className="text-muted-foreground">Courses: <strong>{school.stats?.totalCourses || 0}</strong></span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={school.isActive ? "outline" : "default"} 
                    size="sm"
                    onClick={() => toggleSchoolStatus(school._id, school.isActive)}
                  >
                    {school.isActive ? (
                      <>
                        <XCircle className="mr-2 h-4 w-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Activate
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openCreateAdminDialog(school)}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Admin
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openAssignTeachersDialog(school)}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Assign Teachers
                  </Button>
                </div>
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

      {/* Create Admin Dialog */}
      <Dialog open={isCreateAdminOpen} onOpenChange={setIsCreateAdminOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Admin for {selectedSchool?.name}</DialogTitle>
            <DialogDescription>
              Create an admin account for this school. Login credentials will be generated automatically.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateAdmin}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="admin-name">Admin Name *</Label>
                <Input
                  id="admin-name"
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                  placeholder="Full name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="admin-email">Email *</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  placeholder="admin@school.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="admin-phone">Phone</Label>
                <Input
                  id="admin-phone"
                  value={adminForm.phone}
                  onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="send-admin-email"
                  checked={adminForm.sendEmail}
                  onChange={(e) => setAdminForm({ ...adminForm, sendEmail: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="send-admin-email" className="text-sm font-normal cursor-pointer">
                  <Mail className="inline w-3 h-3 mr-1" />
                  Send credentials via email
                </Label>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <p className="text-blue-800">
                  A secure password will be auto-generated. {adminForm.sendEmail ? 'Credentials will be sent via email.' : 'Credentials will be displayed after creation.'}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateAdminOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={creatingAdmin}>
                {creatingAdmin ? 'Creating...' : 'Create Admin'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Credentials Display Dialog */}
      {adminCredentials && (
        <Dialog open={!!adminCredentials} onOpenChange={() => setAdminCredentials(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Admin Created Successfully</DialogTitle>
              <DialogDescription>
                Save these credentials - they will only be shown once!
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 mb-2">
                  ⚠️ <strong>Important:</strong> Save these credentials now. They won't be shown again.
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-muted-foreground">School</Label>
                  <div className="font-medium bg-gray-50 p-2 rounded border">
                    {selectedSchool?.name} ({selectedSchool?.code})
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Admin Email</Label>
                  <div className="font-mono bg-gray-50 p-2 rounded border">
                    {adminCredentials.email}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Temporary Password</Label>
                  <div className="font-mono bg-gray-50 p-2 rounded border">
                    {adminCredentials.password}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => {
                navigator.clipboard.writeText(`School: ${selectedSchool?.name}\nEmail: ${adminCredentials.email}\nPassword: ${adminCredentials.password}`)
                toast({
                  title: 'Copied',
                  description: 'Credentials copied to clipboard'
                })
              }}>
                Copy to Clipboard
              </Button>
              <Button variant="outline" onClick={() => setAdminCredentials(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
