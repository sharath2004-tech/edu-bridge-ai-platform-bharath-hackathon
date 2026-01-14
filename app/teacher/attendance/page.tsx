'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns'
import { CalendarIcon, Save } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function TeacherAttendancePage() {
  const [classes, setClasses] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [students, setStudents] = useState<any[]>([])
  const [attendance, setAttendance] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchStudents()
      fetchAttendance()
    }
  }, [selectedClass, selectedDate])

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/teacher/classes')
      const data = await res.json()
      console.log('Teacher classes response:', data)
      if (data.success) {
        setClasses(data.classes || [])
      } else {
        console.error('Failed to fetch classes:', data.error)
        setClasses([])
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
      setClasses([])
    }
  }

  const fetchStudents = async () => {
    if (!selectedClass) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/teacher/students?classId=${selectedClass}&limit=100`)
      const data = await res.json()
      console.log('Students data:', data)
      if (data.success) {
        setStudents(data.students || [])
      } else {
        console.error('Failed to fetch students:', data.error)
        setStudents([])
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  const fetchAttendance = async () => {
    if (!selectedClass) return
    
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      const res = await fetch(`/api/teacher/attendance?classId=${selectedClass}&date=${dateStr}`)
      const data = await res.json()
      console.log('Attendance data:', data)
      if (data.success) {
        const attMap: Record<string, string> = {}
        data.attendance.forEach((att: any) => {
          attMap[att.studentId._id || att.studentId] = att.status
        })
        setAttendance(attMap)
      }
    } catch (error) {
      console.error('Error fetching attendance:', error)
    }
  }

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }))
  }

  const saveAttendance = async () => {
    setLoading(true)
    const attendanceData = students.map(student => ({
      studentId: student._id,
      classId: selectedClass,
      date: selectedDate,
      status: attendance[student._id] || 'Present'
    }))

    const res = await fetch('/api/teacher/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attendance: attendanceData })
    })

    const data = await res.json()
    setLoading(false)
    
    if (data.success) {
      alert('Attendance saved successfully!')
    } else {
      alert('Error saving attendance: ' + data.error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mark Attendance</h1>
        <p className="text-muted-foreground mt-2">Record daily attendance for students</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Class & Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {classes.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">No classes assigned</div>
                ) : (
                  classes.map(cls => (
                    <SelectItem key={cls._id} value={cls._id}>
                      {cls.className} - Section {cls.section}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {selectedClass && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Student Attendance - {format(selectedDate, 'PP')}</CardTitle>
              <Button onClick={saveAttendance} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Saving...' : 'Save Attendance'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Quick Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map(student => (
                  <TableRow key={student._id}>
                    <TableCell>{student.rollNo}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>
                      <Select
                        value={attendance[student._id] || 'Present'}
                        onValueChange={(value) => handleStatusChange(student._id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Present">Present</SelectItem>
                          <SelectItem value="Absent">Absent</SelectItem>
                          <SelectItem value="Late">Late</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant={attendance[student._id] === 'Present' ? 'default' : 'outline'}
                          onClick={() => handleStatusChange(student._id, 'Present')}
                        >
                          P
                        </Button>
                        <Button 
                          size="sm" 
                          variant={attendance[student._id] === 'Absent' ? 'destructive' : 'outline'}
                          onClick={() => handleStatusChange(student._id, 'Absent')}
                        >
                          A
                        </Button>
                        <Button 
                          size="sm" 
                          variant={attendance[student._id] === 'Late' ? 'secondary' : 'outline'}
                          onClick={() => handleStatusChange(student._id, 'Late')}
                        >
                          L
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
