'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BookOpen, Calendar, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function SuperAdminClassesPage() {
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [schoolFilter, setSchoolFilter] = useState('all')

  useEffect(() => {
    const params = new URLSearchParams()
    if (schoolFilter !== 'all') params.set('schoolId', schoolFilter)

    fetch(`/api/super-admin/classes?${params}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setClasses(data.classes)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [schoolFilter])

  if (loading) {
    return <div className="p-8">Loading classes...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Classes</h1>
          <p className="text-muted-foreground mt-2">
            {classes.length} classes across all schools
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

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Class Teacher</TableHead>
                <TableHead>Strength</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((classItem) => (
                <TableRow key={classItem._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {classItem.className}-{classItem.section}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{classItem.schoolId?.name || 'N/A'}</span>
                      <span className="text-xs text-muted-foreground">
                        {classItem.schoolId?.code || 'N/A'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {classItem.classTeacherId?.name || 'Not Assigned'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{classItem.strength || 0} students</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{classItem.academicYear}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{classItem.subjectCount || 0} subjects</Badge>
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
        </CardContent>
      </Card>
    </div>
  )
}
