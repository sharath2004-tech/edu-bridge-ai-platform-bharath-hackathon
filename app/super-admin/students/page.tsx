'use client'

import { PaginationControls } from '@/components/pagination-controls'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { usePagination } from '@/hooks/use-pagination'
import { Download, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function SuperAdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [schoolFilter, setSchoolFilter] = useState('all')
  const [classFilter, setClassFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

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
        <Button variant="outline">
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
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm">Edit</Button>
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
    </div>
  )
}
