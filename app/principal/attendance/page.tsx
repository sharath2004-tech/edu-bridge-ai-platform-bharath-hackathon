"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { AlertCircle, Calendar, CheckCircle, Clock, Save, Search, XCircle } from "lucide-react"
import { useEffect, useState } from "react"

interface Class {
  _id: string
  className: string
  section: string
}

interface Student {
  _id: string
  name: string
  email: string
  rollNumber: number
  className: string
  section?: string
}

interface AttendanceRecord {
  studentId: string
  status: 'present' | 'absent' | 'late' | 'excused'
  notes?: string
}

export default function AttendancePage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (selectedClassId) {
      fetchStudents()
      fetchExistingAttendance()
    }
  }, [selectedClassId, selectedDate])

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/principal/classes')
      const data = await res.json()
      if (data.success) {
        setClasses(data.classes || [])
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      setLoading(true)
      console.log('Fetching students for classId:', selectedClassId)
      const res = await fetch(`/api/principal/students?classId=${selectedClassId}`)
      if (res.ok) {
        const data = await res.json()
        console.log('Students fetched:', data)
        setStudents(data.students || [])
        
        // Initialize attendance records
        const initialAttendance: Record<string, AttendanceRecord> = {}
        data.students?.forEach((student: Student) => {
          if (!attendance[student._id]) {
            initialAttendance[student._id] = {
              studentId: student._id,
              status: 'present',
              notes: ''
            }
          }
        })
        setAttendance(prev => ({ ...initialAttendance, ...prev }))
      } else {
        console.error('Failed to fetch students:', res.status, res.statusText)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchExistingAttendance = async () => {
    try {
      const res = await fetch(
        `/api/principal/attendance?date=${selectedDate}&className=${selectedClass}`
      )
      if (res.ok) {
        const data = await res.json()
        const existingAttendance: Record<string, AttendanceRecord> = {}
        data.attendance?.forEach((record: any) => {
          existingAttendance[record.studentId._id] = {
            studentId: record.studentId._id,
            status: record.status,
            notes: record.notes || ''
          }
        })
        setAttendance(prev => ({ ...prev, ...existingAttendance }))
      }
    } catch (error) {
      console.error('Error fetching attendance:', error)
    }
  }

  const updateAttendance = (studentId: string, status: AttendanceRecord['status']) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }))
  }

  const markAllPresent = () => {
    const updated: Record<string, AttendanceRecord> = {}
    students.forEach(student => {
      updated[student._id] = {
        studentId: student._id,
        status: 'present',
        notes: attendance[student._id]?.notes || ''
      }
    })
    setAttendance(updated)
  }

  const saveAttendance = async () => {
    try {
      setSaving(true)
      const records = Object.values(attendance).map(record => ({
        ...record,
        className: selectedClass,
        section: selectedSection,
        date: selectedDate
      }))

      const res = await fetch('/api/principal/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records })
      })

      if (res.ok) {
        setMessage('Attendance saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      setMessage('Error saving attendance')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.toString().includes(searchQuery)
  )

  const stats = {
    total: students.length,
    present: Object.values(attendance).filter(a => a.status === 'present').length,
    absent: Object.values(attendance).filter(a => a.status === 'absent').length,
    late: Object.values(attendance).filter(a => a.status === 'late').length,
    excused: Object.values(attendance).filter(a => a.status === 'excused').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Attendance Management</h1>
          <p className="text-muted-foreground">Mark and track student attendance</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>Class</Label>
            <Select value={selectedClassId} onValueChange={(value) => {
              setSelectedClassId(value)
              const cls = classes.find(c => c._id === value)
              if (cls) {
                setSelectedClass(cls.className)
                setSelectedSection(cls.section)
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(cls => (
                  <SelectItem key={cls._id} value={cls._id}>
                    {cls.className} - Section {cls.section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Selected Section</Label>
            <Input value={selectedSection} disabled className="bg-muted" />
          </div>

          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div>
            <Label>Search Students</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Name or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      {selectedClass && selectedSection && students.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </Card>
          <Card className="p-4 border-green-200 bg-green-50">
            <div className="text-sm text-green-700">Present</div>
            <div className="text-2xl font-bold text-green-700">{stats.present}</div>
          </Card>
          <Card className="p-4 border-red-200 bg-red-50">
            <div className="text-sm text-red-700">Absent</div>
            <div className="text-2xl font-bold text-red-700">{stats.absent}</div>
          </Card>
          <Card className="p-4 border-yellow-200 bg-yellow-50">
            <div className="text-sm text-yellow-700">Late</div>
            <div className="text-2xl font-bold text-yellow-700">{stats.late}</div>
          </Card>
          <Card className="p-4 border-blue-200 bg-blue-50">
            <div className="text-sm text-blue-700">Excused</div>
            <div className="text-2xl font-bold text-blue-700">{stats.excused}</div>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      {selectedClass && selectedSection && students.length > 0 && (
        <div className="flex gap-2">
          <Button onClick={markAllPresent} variant="outline">
            Mark All Present
          </Button>
          <Button onClick={saveAttendance} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Attendance'}
          </Button>
          {message && (
            <Badge variant={message.includes('success') ? 'default' : 'destructive'}>
              {message}
            </Badge>
          )}
        </div>
      )}

      {/* Student List */}
      {!selectedClass || !selectedSection ? (
        <Card className="p-8">
          <div className="text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Select a class and section to mark attendance</p>
          </div>
        </Card>
      ) : loading ? (
        <Card className="p-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading students...</p>
          </div>
        </Card>
      ) : students.length === 0 ? (
        <Card className="p-8">
          <div className="text-center">
            <p className="text-muted-foreground">No students found in this class</p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4">Roll No.</th>
                  <th className="text-left p-4">Student Name</th>
                  <th className="text-center p-4">Section</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-center p-4">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student._id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{student.rollNumber}</td>
                    <td className="p-4">{student.name}</td>
                    <td className="p-4 text-center">
                      <Badge variant="outline">{student.section || 'N/A'}</Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{student.email}</td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant={attendance[student._id]?.status === 'present' ? 'default' : 'outline'}
                          onClick={() => updateAttendance(student._id, 'present')}
                          className="w-24"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant={attendance[student._id]?.status === 'absent' ? 'destructive' : 'outline'}
                          onClick={() => updateAttendance(student._id, 'absent')}
                          className="w-24"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Absent
                        </Button>
                        <Button
                          size="sm"
                          variant={attendance[student._id]?.status === 'late' ? 'secondary' : 'outline'}
                          onClick={() => updateAttendance(student._id, 'late')}
                          className="w-24"
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          Late
                        </Button>
                        <Button
                          size="sm"
                          variant={attendance[student._id]?.status === 'excused' ? 'secondary' : 'outline'}
                          onClick={() => updateAttendance(student._id, 'excused')}
                          className="w-24"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Excused
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
