"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    BookOpen,
    Building2,
    CheckCircle,
    Edit,
    GraduationCap,
    Mail,
    MapPin,
    Phone,
    Plus,
    Search,
    Trash2,
    Users,
    X,
    XCircle
} from "lucide-react"
import { useEffect, useState } from "react"

interface School {
  _id: string
  name: string
  code: string
  email: string
  phone?: string
  address: {
    city: string
    state: string
    country: string
  }
  type: string
  board?: string
  isActive: boolean
  subscription?: {
    plan: string
    maxStudents?: number
    maxTeachers?: number
  }
  stats?: {
    totalStudents: number
    totalTeachers: number
    totalCourses: number
  }
  createdAt: string
}

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState<School[]>([])
  const [filteredSchools, setFilteredSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingSchool, setEditingSchool] = useState<School | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    country: 'India',
    type: 'secondary',
    board: 'CBSE',
    principalName: '',
    principalEmail: '',
    principalPhone: '',
    website: '',
    plan: 'free',
    maxStudents: 100,
    maxTeachers: 10
  })

  useEffect(() => {
    fetchSchools()
  }, [])

  useEffect(() => {
    const filtered = schools.filter(school => 
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.address.city.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredSchools(filtered)
  }, [searchQuery, schools])

  const fetchSchools = async () => {
    try {
      const res = await fetch('/api/admin/schools')
      if (res.ok) {
        const data = await res.json()
        setSchools(data.schools)
        setFilteredSchools(data.schools)
      }
    } catch (error) {
      console.error('Error fetching schools:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        name: formData.name,
        code: formData.code,
        email: formData.email,
        phone: formData.phone,
        address: {
          city: formData.city,
          state: formData.state,
          country: formData.country
        },
        principal: {
          name: formData.principalName,
          email: formData.principalEmail,
          phone: formData.principalPhone
        },
        website: formData.website,
        type: formData.type,
        board: formData.board,
        subscription: {
          plan: formData.plan,
          maxStudents: formData.maxStudents,
          maxTeachers: formData.maxTeachers
        }
      }

      const url = editingSchool 
        ? '/api/admin/schools'
        : '/api/admin/schools'
      
      const method = editingSchool ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSchool ? { schoolId: editingSchool._id, ...payload } : payload)
      })

      const data = await res.json()

      if (res.ok) {
        alert(data.message)
        resetForm()
        fetchSchools()
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error('Error saving school:', error)
      alert('Failed to save school')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (school: School) => {
    setEditingSchool(school)
    setFormData({
      name: school.name,
      code: school.code,
      email: school.email,
      phone: school.phone || '',
      city: school.address.city,
      state: school.address.state,
      country: school.address.country,
      type: school.type,
      board: school.board || 'CBSE',
      principalName: '',
      principalEmail: '',
      principalPhone: '',
      website: '',
      plan: school.subscription?.plan || 'free',
      maxStudents: school.subscription?.maxStudents || 100,
      maxTeachers: school.subscription?.maxTeachers || 10
    })
    setShowAddModal(true)
  }

  const handleDelete = async (schoolId: string) => {
    if (!confirm('Are you sure you want to delete this school? This action cannot be undone.')) {
      return
    }

    try {
      const res = await fetch(`/api/admin/schools?id=${schoolId}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (res.ok) {
        alert(data.message)
        fetchSchools()
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error('Error deleting school:', error)
      alert('Failed to delete school')
    }
  }

  const toggleSchoolStatus = async (school: School) => {
    try {
      const res = await fetch('/api/admin/schools', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId: school._id,
          isActive: !school.isActive
        })
      })

      if (res.ok) {
        fetchSchools()
      }
    } catch (error) {
      console.error('Error updating school status:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      email: '',
      phone: '',
      city: '',
      state: '',
      country: 'India',
      type: 'secondary',
      board: 'CBSE',
      principalName: '',
      principalEmail: '',
      principalPhone: '',
      website: '',
      plan: 'free',
      maxStudents: 100,
      maxTeachers: 10
    })
    setEditingSchool(null)
    setShowAddModal(false)
  }

  const getPlanColor = (plan: string) => {
    const colors: Record<string, string> = {
      free: 'bg-gray-100 text-gray-800',
      basic: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-yellow-100 text-yellow-800'
    }
    return colors[plan] || colors.free
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="w-8 h-8 text-primary" />
            School Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage registered schools and their subscriptions</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Register New School
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Schools</p>
              <p className="text-2xl font-bold">{schools.length}</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Schools</p>
              <p className="text-2xl font-bold">{schools.filter(s => s.isActive).length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold">
                {schools.reduce((sum, s) => sum + (s.stats?.totalStudents || 0), 0)}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Teachers</p>
              <p className="text-2xl font-bold">
                {schools.reduce((sum, s) => sum + (s.stats?.totalTeachers || 0), 0)}
              </p>
            </div>
            <GraduationCap className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search schools by name, code, email, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Schools List */}
      <div className="grid gap-4">
        {loading ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Loading schools...</p>
          </Card>
        ) : filteredSchools.length === 0 ? (
          <Card className="p-8 text-center">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">
              {searchQuery ? 'No schools found matching your search' : 'No schools registered yet'}
            </p>
          </Card>
        ) : (
          filteredSchools.map((school) => (
            <Card key={school._id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{school.name}</h3>
                    <Badge variant="outline" className="font-mono">
                      {school.code}
                    </Badge>
                    <Badge className={getPlanColor(school.subscription?.plan || 'free')}>
                      {school.subscription?.plan?.toUpperCase() || 'FREE'}
                    </Badge>
                    {school.isActive ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {school.email}
                    </div>
                    {school.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {school.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {school.address.city}, {school.address.state}
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {school.type} • {school.board || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSchoolStatus(school)}
                  >
                    {school.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(school)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(school._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{school.stats?.totalStudents || 0}</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{school.stats?.totalTeachers || 0}</p>
                  <p className="text-xs text-muted-foreground">Teachers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{school.stats?.totalCourses || 0}</p>
                  <p className="text-xs text-muted-foreground">Courses</p>
                </div>
              </div>

              {/* Subscription Limits */}
              <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
                <p className="font-semibold mb-1">Subscription Limits:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>Max Students: {school.subscription?.maxStudents || 'Unlimited'}</div>
                  <div>Max Teachers: {school.subscription?.maxTeachers || 'Unlimited'}</div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit School Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {editingSchool ? 'Edit School' : 'Register New School'}
                </h2>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Basic Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">School Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="code">School Code * (4-10 chars)</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        maxLength={10}
                        required
                        disabled={!!editingSchool}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">School Type</Label>
                      <select
                        id="type"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      >
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                        <option value="higher-secondary">Higher Secondary</option>
                        <option value="university">University</option>
                        <option value="institute">Institute</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="board">Board</Label>
                      <Input
                        id="board"
                        value={formData.board}
                        onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Address</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Principal Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Principal Details (Optional)</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="principalName">Name</Label>
                      <Input
                        id="principalName"
                        value={formData.principalName}
                        onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="principalEmail">Email</Label>
                      <Input
                        id="principalEmail"
                        type="email"
                        value={formData.principalEmail}
                        onChange={(e) => setFormData({ ...formData, principalEmail: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="principalPhone">Phone</Label>
                      <Input
                        id="principalPhone"
                        value={formData.principalPhone}
                        onChange={(e) => setFormData({ ...formData, principalPhone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Subscription */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Subscription</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="plan">Plan</Label>
                      <select
                        id="plan"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={formData.plan}
                        onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                      >
                        <option value="free">Free</option>
                        <option value="basic">Basic</option>
                        <option value="premium">Premium</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="maxStudents">Max Students</Label>
                      <Input
                        id="maxStudents"
                        type="number"
                        value={formData.maxStudents}
                        onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxTeachers">Max Teachers</Label>
                      <Input
                        id="maxTeachers"
                        type="number"
                        value={formData.maxTeachers}
                        onChange={(e) => setFormData({ ...formData, maxTeachers: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Saving...' : editingSchool ? 'Update School' : 'Register School'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
