"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"

interface School {
  _id: string
  name: string
  code: string
  email: string
  phone?: string
  address?: {
    street?: string
    city: string
    state: string
    country: string
    zipCode?: string
  }
  type: string
  board?: string
  logo?: string
}

export default function SettingsPage() {
  const [school, setSchool] = useState<School | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    board: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    zipCode: ''
  })

  useEffect(() => {
    fetchSchoolInfo()
  }, [])

  const fetchSchoolInfo = async () => {
    try {
      // This endpoint needs to be created
      const res = await fetch('/api/principal/school')
      if (res.ok) {
        const data = await res.json()
        setSchool(data.school)
        // Set form data from fetched school
        setFormData({
          name: data.school?.name || '',
          board: data.school?.board || '',
          email: data.school?.email || '',
          phone: data.school?.phone || '',
          city: data.school?.address?.city || '',
          state: data.school?.address?.state || '',
          zipCode: data.school?.address?.zipCode || ''
        })
      }
    } catch (error) {
      console.error('Error fetching school:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/principal/school', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        alert('Settings saved successfully')
        fetchSchoolInfo()
      } else {
        alert('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">School Settings</h1>
        <p className="text-muted-foreground">Manage your school information</p>
      </div>

      {isLoading ? (
        <Card className="p-8">
          <p className="text-center text-muted-foreground">Loading...</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="schoolName">School Name</Label>
                <Input
                  id="schoolName"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="School Name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="schoolCode">School Code</Label>
                  <Input
                    id="schoolCode"
                    value={school?.code || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                
                <div>
                  <Label htmlFor="board">Board</Label>
                  <Input
                    id="board"
                    name="board"
                    value={formData.board}
                    onChange={handleChange}
                    placeholder="CBSE"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="school@example.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 1234567890"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Address</h2>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                  />
                </div>
                
                <div>
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="123456"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <form onSubmit={async (e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const currentPassword = formData.get('currentPassword') as string
              const newPassword = formData.get('newPassword') as string
              const confirmPassword = formData.get('confirmPassword') as string

              if (newPassword !== confirmPassword) {
                alert('New passwords do not match')
                return
              }

              try {
                const res = await fetch('/api/auth/change-password', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ currentPassword, newPassword })
                })
                const data = await res.json()
                if (data.success) {
                  alert('Password changed successfully!')
                  e.currentTarget.reset()
                } else {
                  alert(data.error || 'Failed to change password')
                }
              } catch (error) {
                alert('An error occurred')
              }
            }} className="grid gap-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    minLength={6}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    minLength={6}
                    required
                  />
                </div>
              </div>
              <div>
                <Button type="submit">Change Password</Button>
              </div>
            </form>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => fetchSchoolInfo()}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
