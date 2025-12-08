'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BookOpen, GraduationCap, Mail, Phone, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function SuperAdminTeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [schoolFilter, setSchoolFilter] = useState('all')

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
        {teachers.map((teacher) => (
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
                <Button variant="outline" size="sm">View Profile</Button>
                <Button variant="outline" size="sm">View Classes</Button>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
