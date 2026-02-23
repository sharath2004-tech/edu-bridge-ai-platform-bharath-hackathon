"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bus, Calendar, CheckCircle, Mail, Search, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Student {
  _id: string
  name: string
  email: string
  rollNo?: number
  className?: string
  section?: string
  parentName?: string
  parentEmail?: string
  parentPhone?: string
  busId?: string
  classId?: {
    className: string
    section: string
  }
}

interface AttendanceRecord {
  studentId: string
  status: 'present' | 'absent'
  remarks?: string
}

export function BusAttendanceComponent() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [buses, setBuses] = useState<string[]>([])
  const [selectedBus, setSelectedBus] = useState<string>('all')
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [attendance, setAttendance] = useState<Map<string, 'present' | 'absent'>>(new Map())
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [todayAttendance, setTodayAttendance] = useState<any[]>([])

  useEffect(() => {
    fetchBusStudents()
    fetchTodayAttendance()
  }, [])

  useEffect(() => {
    filterStudents()
  }, [students, selectedBus, searchQuery])

  const fetchBusStudents = async () => {
    setIsFetching(true)
    try {
      const res = await fetch('/api/bus-attendance/students')
      if (res.ok) {
        const data = await res.json()
        setStudents(data.students || [])
        
        // Extract unique bus IDs
        const uniqueBuses = Array.from(
          new Set(data.students.map((s: Student) => s.busId).filter(Boolean))
        ) as string[]
        setBuses(uniqueBuses.sort())
      } else {
        toast.error('Failed to fetch students')
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      toast.error('Error loading students')
    } finally {
      setIsFetching(false)
    }
  }

  const fetchTodayAttendance = async () => {
    try {
      const res = await fetch(`/api/bus-attendance?date=${new Date().toISOString().split('T')[0]}`)
      if (res.ok) {
        const data = await res.json()
        setTodayAttendance(data.records || [])
        
        // Pre-fill attendance map with today's records
        const attendanceMap = new Map()
        data.records.forEach((record: any) => {
          attendanceMap.set(record.studentId._id || record.studentId, record.status)
        })
        setAttendance(attendanceMap)
      }
    } catch (error) {
      console.error('Error fetching today\'s attendance:', error)
    }
  }

  const filterStudents = () => {
    let filtered = students

    // Filter by bus
    if (selectedBus !== 'all') {
      filtered = filtered.filter(s => s.busId === selectedBus)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.rollNo?.toString().includes(query)
      )
    }

    setFilteredStudents(filtered)
  }

  const markAttendance = (studentId: string, status: 'present' | 'absent') => {
    const newAttendance = new Map(attendance)
    newAttendance.set(studentId, status)
    setAttendance(newAttendance)
  }

  const submitAttendance = async () => {
    if (attendance.size === 0) {
      toast.error('Please mark attendance for at least one student')
      return
    }

    setIsLoading(true)
    let successCount = 0
    let errorCount = 0

    try {
      for (const [studentId, status] of attendance.entries()) {
        const student = students.find(s => s._id === studentId)
        
        try {
          const res = await fetch('/api/bus-attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentId,
              date: selectedDate,
              status,
              busId: student?.busId,
            }),
          })

          if (res.ok) {
            successCount++
          } else {
            errorCount++
            const data = await res.json()
            console.error(`Failed for ${student?.name}:`, data.error)
          }
        } catch (error) {
          errorCount++
          console.error(`Error marking attendance for ${student?.name}:`, error)
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully marked attendance for ${successCount} student${successCount > 1 ? 's' : ''}`)
        fetchTodayAttendance() // Refresh
      }
      
      if (errorCount > 0) {
        toast.error(`Failed to mark attendance for ${errorCount} student${errorCount > 1 ? 's' : ''}`)
      }
    } catch (error) {
      console.error('Error submitting attendance:', error)
      toast.error('Failed to submit attendance')
    } finally {
      setIsLoading(false)
    }
  }

  const markAllPresent = () => {
    const newAttendance = new Map(attendance)
    filteredStudents.forEach(student => {
      newAttendance.set(student._id, 'present')
    })
    setAttendance(newAttendance)
    toast.success('All visible students marked as present')
  }

  const clearAttendance = () => {
    setAttendance(new Map())
    toast.info('Attendance cleared')
  }

  const getStudentClassName = (student: Student) => {
    if (student.classId) {
      return `${student.classId.className}-${student.classId.section}`
    }
    return student.className ? `${student.className}${student.section ? `-${student.section}` : ''}` : 'N/A'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bus className="h-5 w-5" />
            Bus Attendance Management
          </CardTitle>
          <CardDescription>
            Mark daily bus attendance and send notifications to parents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bus">Bus Number</Label>
              <Select value={selectedBus} onValueChange={setSelectedBus}>
                <SelectTrigger id="bus">
                  <SelectValue placeholder="Select bus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Buses</SelectItem>
                  {buses.map(bus => (
                    <SelectItem key={bus} value={bus}>
                      Bus {bus}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="search">Search Student</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Name, email, or roll no..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={markAllPresent}
              variant="outline"
              disabled={filteredStudents.length === 0}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark All Present
            </Button>
            <Button
              onClick={clearAttendance}
              variant="outline"
              disabled={attendance.size === 0}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Clear Selection
            </Button>
            <Button
              onClick={submitAttendance}
              disabled={isLoading || attendance.size === 0}
            >
              <Mail className="mr-2 h-4 w-4" />
              {isLoading ? 'Submitting...' : `Submit & Notify (${attendance.size})`}
            </Button>
          </div>

          {/* Statistics */}
          <div className="grid gap-4 md:grid-cols-4 bg-gray-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{students.length}</div>
              <div className="text-xs text-gray-600">Total Bus Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{filteredStudents.length}</div>
              <div className="text-xs text-gray-600">Filtered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Array.from(attendance.values()).filter(s => s === 'present').length}
              </div>
              <div className="text-xs text-gray-600">Present</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {Array.from(attendance.values()).filter(s => s === 'absent').length}
              </div>
              <div className="text-xs text-gray-600">Absent</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Students ({filteredStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="text-center py-8 text-gray-500">Loading students...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No students found. {selectedBus !== 'all' && 'Try selecting a different bus or '} 
              {searchQuery && 'clear the search filter.'}
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredStudents.map((student) => {
                const currentStatus = attendance.get(student._id)
                return (
                  <div
                    key={student._id}
                    className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                      currentStatus === 'present'
                        ? 'bg-green-50 border-green-200'
                        : currentStatus === 'absent'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-semibold flex items-center gap-2">
                        {student.name}
                        {student.rollNo && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            Roll: {student.rollNo}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Class: {getStudentClassName(student)} | Bus: {student.busId || 'N/A'}
                      </div>
                      {student.parentEmail && (
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Mail className="h-3 w-3" />
                          {student.parentEmail}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={currentStatus === 'present' ? 'default' : 'outline'}
                        onClick={() => markAttendance(student._id, 'present')}
                        className={currentStatus === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant={currentStatus === 'absent' ? 'default' : 'outline'}
                        onClick={() => markAttendance(student._id, 'absent')}
                        className={currentStatus === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Absent
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
