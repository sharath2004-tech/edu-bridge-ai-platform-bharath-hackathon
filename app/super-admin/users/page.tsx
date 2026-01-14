'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Download, Search, Users, Trash2, Plus, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { usePagination } from '@/hooks/use-pagination'
import { PaginationControls } from '@/components/pagination-controls'

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [schools, setSchools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState('all')
  const [schoolFilter, setSchoolFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<any>(null)
  const [creating, setCreating] = useState(false)
  const [credentials, setCredentials] = useState<any>(null)
  const { toast } = useToast()

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'student',
    schoolId: '',
    phone: '',
    sendEmail: true
  })

  useEffect(() => {
    fetchUsers()
    fetchSchools()
  }, [roleFilter, schoolFilter, searchQuery])

  const fetchUsers = () => {
    const params = new URLSearchParams()
    if (roleFilter !== 'all') params.set('role', roleFilter)
    if (schoolFilter !== 'all') params.set('schoolId', schoolFilter)
    if (searchQuery) params.set('search', searchQuery)

    fetch(`/api/super-admin/users?${params}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setUsers(data.users)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const pagination = usePagination({
    items: users,
    itemsPerPage: 15
  })

  const fetchSchools = () => {
    fetch('/api/super-admin/schools')
      .then(res => res.json())
      .then(data => {
        if (data.success) setSchools(data.schools.filter((s: any) => s.isActive))
      })
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      const res = await fetch('/api/super-admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'User created successfully'
        })
        
        if (data.credentials) {
          setCredentials(data.credentials)
        }
        
        setIsCreateDialogOpen(false)
        setNewUser({
          name: '',
          email: '',
          role: 'student',
          schoolId: '',
          phone: '',
          sendEmail: true
        })
        fetchUsers()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create user',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create user',
        variant: 'destructive'
      })
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    try {
      const res = await fetch(`/api/super-admin/users?userId=${userToDelete._id}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'User deleted successfully'
        })
        setIsDeleteDialogOpen(false)
        setUserToDelete(null)
        fetchUsers()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to delete user',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive'
      })
    }
  }

  const openDeleteDialog = (user: any) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super-admin': return 'default'
      case 'principal': return 'destructive'
      case 'teacher': return 'secondary'
      case 'student': return 'outline'
      default: return 'outline'
    }
  }

  if (loading) {
    return <div className="p-8">Loading users...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Users</h1>
          <p className="text-muted-foreground mt-2">
            {users.length} total users across all schools
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the system. A secure password will be generated automatically.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateUser}>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="role">Role *</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super-admin">Super Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="principal">Principal</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {newUser.role !== 'super-admin' && (
                    <div>
                      <Label htmlFor="schoolId">School *</Label>
                      <Select value={newUser.schoolId} onValueChange={(value) => setNewUser({ ...newUser, schoolId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select school" />
                        </SelectTrigger>
                        <SelectContent>
                          {schools.map((school) => (
                            <SelectItem key={school._id} value={school._id}>
                              {school.name} ({school.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sendEmail"
                      checked={newUser.sendEmail}
                      onChange={(e) => setNewUser({ ...newUser, sendEmail: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="sendEmail" className="text-sm font-normal cursor-pointer">
                      <Mail className="inline w-3 h-3 mr-1" />
                      Send credentials via email
                    </Label>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                    <p className="text-blue-800">
                      A secure password will be auto-generated. {newUser.sendEmail ? 'Credentials will be sent to the email address.' : 'Credentials will be displayed after creation.'}
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={creating}>
                    {creating ? 'Creating...' : 'Create User'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="super-admin">Super Admin</SelectItem>
                <SelectItem value="principal">Principal</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
            <Select value={schoolFilter} onValueChange={setSchoolFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by school" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schools</SelectItem>
                {schools.map((school) => (
                  <SelectItem key={school._id} value={school._id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Class/Grade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagination.paginatedItems.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.schoolId?.name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {user.role === 'student' && user.classId 
                      ? `${user.classId.className}-${user.classId.section}`
                      : user.role === 'teacher' && user.teacherRole
                      ? user.teacherRole
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'default' : 'secondary'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => openDeleteDialog(user)}
                      >
                        <Trash2 className="h-4 w-4" />
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user <strong>{userToDelete?.name}</strong> ({userToDelete?.email}).
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Credentials Display Dialog */}
      {credentials && (
        <Dialog open={!!credentials} onOpenChange={() => setCredentials(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Created Successfully</DialogTitle>
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
              <div className="space-y-2">
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <div className="font-mono bg-gray-50 p-2 rounded border">
                    {credentials.email}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Password</Label>
                  <div className="font-mono bg-gray-50 p-2 rounded border">
                    {credentials.password}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => {
                navigator.clipboard.writeText(`Email: ${credentials.email}\nPassword: ${credentials.password}`)
                toast({
                  title: 'Copied',
                  description: 'Credentials copied to clipboard'
                })
              }}>
                Copy to Clipboard
              </Button>
              <Button variant="outline" onClick={() => setCredentials(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
