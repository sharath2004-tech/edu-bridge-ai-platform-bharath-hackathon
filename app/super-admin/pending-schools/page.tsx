"use client"

import { PaginationControls } from '@/components/pagination-controls'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePagination } from '@/hooks/use-pagination'
import {
    AlertCircle,
    Building2,
    CheckCircle,
    Clock,
    Mail,
    MapPin,
    Phone,
    User,
    XCircle
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface School {
  _id: string
  name: string
  code: string
  email: string
  phone?: string
  address: {
    street?: string
    city: string
    state: string
    zipCode?: string
  }
  principal?: {
    name: string
    email: string
    phone?: string
  }
  type: string
  board?: string
  createdAt: string
}

export default function PendingSchoolsPage() {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    fetchPendingSchools()
  }, [])

  const pagination = usePagination({
    items: schools,
    itemsPerPage: 10
  })

  const fetchPendingSchools = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/pending-schools')
      const data = await res.json()
      
      if (data.success) {
        setSchools(data.schools || [])
      } else {
        toast.error(data.error || 'Failed to fetch pending schools')
      }
    } catch (error) {
      console.error('Error fetching pending schools:', error)
      toast.error('Failed to load pending schools')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (schoolId: string) => {
    if (!confirm('Are you sure you want to approve this school?')) return

    try {
      setProcessingId(schoolId)
      const res = await fetch(`/api/super-admin/schools`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolId, isActive: true })
      })

      const data = await res.json()
      
      if (data.success) {
        toast.success('School approved successfully!')
        fetchPendingSchools() // Refresh list
      } else {
        toast.error(data.error || 'Failed to approve school')
      }
    } catch (error) {
      console.error('Error approving school:', error)
      toast.error('Failed to approve school')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (schoolId: string) => {
    if (!confirm('Are you sure you want to reject this school? This will delete the school registration.')) return

    try {
      setProcessingId(schoolId)
      const res = await fetch(`/api/super-admin/schools`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolId })
      })

      const data = await res.json()
      
      if (data.success) {
        toast.success('School registration rejected')
        fetchPendingSchools() // Refresh list
      } else {
        toast.error(data.error || 'Failed to reject school')
      }
    } catch (error) {
      console.error('Error rejecting school:', error)
      toast.error('Failed to reject school')
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pending School Approvals</h1>
            <p className="text-muted-foreground mt-1">Review and approve new school registrations</p>
          </div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-1/4 mt-2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pending School Approvals</h1>
          <p className="text-muted-foreground mt-1">
            Review and approve new school registrations
          </p>
        </div>
        <Badge variant="secondary" className="h-8 px-3">
          {schools.length} Pending
        </Badge>
      </div>

      {schools.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
            <p className="text-muted-foreground text-center">
              There are no pending school registrations at the moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {pagination.paginatedItems.map((school) => (
            <Card key={school._id} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Building2 className="w-6 h-6 text-primary" />
                      {school.name}
                    </CardTitle>
                    <CardDescription className="mt-2 flex items-center gap-4">
                      <span className="font-mono font-semibold">{school.code}</span>
                      <Badge variant="outline">{school.type}</Badge>
                      {school.board && <Badge variant="secondary">{school.board}</Badge>}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Pending
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
                {/* School Contact Info */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase">School Contact</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm">{school.email}</span>
                    </div>
                    {school.phone && (
                      <div className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm">{school.phone}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm">
                        {school.address.street && `${school.address.street}, `}
                        {school.address.city}, {school.address.state}
                        {school.address.zipCode && ` - ${school.address.zipCode}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Principal Info */}
                {school.principal && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase">Principal Contact</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm font-medium">{school.principal.name}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm">{school.principal.email}</span>
                      </div>
                      {school.principal.phone && (
                        <div className="flex items-start gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <span className="text-sm">{school.principal.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Registration Date */}
              <div className="px-6 pb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Registered on {new Date(school.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-muted/30 border-t flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleReject(school._id)}
                  disabled={processingId === school._id}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(school._id)}
                  disabled={processingId === school._id}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve School
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {schools.length > 0 && (
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
      )}

      {/* Info Box */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Approval Guidelines</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>Verify the school's contact information and email address</li>
                <li>Check if the school code is appropriate and unique</li>
                <li>Once approved, the principal can log in and start adding teachers and students</li>
                <li>Rejected schools will be permanently deleted from the system</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
