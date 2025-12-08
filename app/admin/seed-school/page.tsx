"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, CheckCircle, Database, GraduationCap, Loader2, Users } from "lucide-react"
import { useState } from "react"

export default function SeedSchoolPage() {
  const [schoolId, setSchoolId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSeed = async () => {
    if (!schoolId.trim()) {
      setError('Please enter a school ID')
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setResult(null)

      const res = await fetch('/api/admin/seed-school', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolId, clearExisting: false })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to seed data')
        return
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearAndSeed = async () => {
    if (!schoolId.trim()) {
      setError('Please enter a school ID')
      return
    }

    if (!confirm('This will DELETE all existing teachers and students for this school. Continue?')) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setResult(null)

      const res = await fetch('/api/admin/seed-school', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolId, clearExisting: true })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to seed data')
        return
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Seed School Data</h1>
        <p className="text-muted-foreground">Generate 100 students and 20 teachers for testing</p>
      </div>

      <Card className="p-6 max-w-2xl">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="schoolId">School ID *</Label>
            <Input
              id="schoolId"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              placeholder="Enter school MongoDB ObjectId"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Find school IDs in the Schools management page or database
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSeed} 
              disabled={isLoading || !schoolId}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Seeding...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Seed Data
                </>
              )}
            </Button>
            <Button 
              onClick={handleClearAndSeed} 
              disabled={isLoading || !schoolId}
              variant="destructive"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Clear & Reseed
            </Button>
          </div>
        </div>
      </Card>

      {error && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {result && (
        <div className="space-y-4">
          <Card className="p-6 border-green-200 bg-green-50">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">
                {result.message}
              </h3>
            </div>

            <div className="space-y-4">
              {/* School Info */}
              <div>
                <h4 className="font-semibold mb-2">School Details</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-medium">{result.data.school.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Code:</span>
                    <p className="font-medium">{result.data.school.code}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ID:</span>
                    <p className="font-mono text-xs">{result.data.school.id}</p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium">Teachers Created</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">
                    {result.data.teachers.count}
                  </p>
                </Card>
                <Card className="p-4 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium">Students Created</span>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">
                    {result.data.students.count}
                  </p>
                </Card>
              </div>

              {/* Sample Teachers */}
              <div>
                <h4 className="font-semibold mb-2">Sample Teachers</h4>
                <div className="space-y-2">
                  {result.data.teachers.sample.map((teacher: any) => (
                    <Card key={teacher.id} className="p-3 bg-white">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{teacher.name}</p>
                          <p className="text-xs text-muted-foreground">{teacher.email}</p>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {teacher.subjects?.map((sub: string) => (
                            <Badge key={sub} variant="secondary" className="text-xs">
                              {sub}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {teacher.classes?.map((cls: string) => (
                          <Badge key={cls} variant="outline" className="text-xs">
                            {cls}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Sample Students */}
              <div>
                <h4 className="font-semibold mb-2">Sample Students</h4>
                <div className="space-y-2">
                  {result.data.students.sample.map((student: any) => (
                    <Card key={student.id} className="p-3 bg-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            Roll #{student.rollNumber} - {student.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                        <Badge variant="outline">{student.className}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Credentials */}
              <Card className="p-4 bg-blue-50 border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Login Credentials</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Teachers:</strong> {result.data.credentials.teachers}</p>
                  <p><strong>Students:</strong> {result.data.credentials.students}</p>
                </div>
              </Card>
            </div>
          </Card>
        </div>
      )}

      {/* Instructions */}
      <Card className="p-6 bg-muted">
        <h3 className="font-semibold mb-2">Instructions</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>Enter a valid school MongoDB ObjectId</li>
          <li>Click "Seed Data" to create 100 students and 20 teachers</li>
          <li>Use "Clear & Reseed" to delete existing data and create fresh records</li>
          <li>All generated users have password: <code className="bg-background px-1 rounded">password123</code></li>
          <li>Students are distributed across all available classes</li>
          <li>Teachers are assigned 2-4 random classes and 2-3 subjects</li>
          <li>Roll numbers start from 1 and increment sequentially</li>
        </ul>
      </Card>
    </div>
  )
}
