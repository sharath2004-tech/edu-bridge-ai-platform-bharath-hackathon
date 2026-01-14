'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Calendar, ExternalLink, Mail, MapPin, Phone, CheckCircle, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function SuperAdminSchoolsPage() {
  const [schools, setSchools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
        alert(`School ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to update school status')
      }
    } catch (error) {
      console.error('Error updating school status:', error)
      alert('Failed to update school status')
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
        <Button>
          <Building2 className="mr-2 h-4 w-4" />
          Add New School
        </Button>
      </div>

      <div className="grid gap-6">
        {schools.map((school) => (
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
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/super-admin/schools/${school._id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/super-admin/schools/${school._id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
