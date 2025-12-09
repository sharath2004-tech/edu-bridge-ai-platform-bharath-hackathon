"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Clock } from "lucide-react"
import { useEffect, useState } from "react"

interface TimetableEntry {
  _id: string
  dayOfWeek: string
  period: number
  startTime: string
  endTime: string
  subjectId?: { name: string }
  teacherId?: { name: string }
  roomNumber?: string
  classId?: { className: string, grade: string, section: string }
}

export default function TimetablePage() {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [selectedDay, setSelectedDay] = useState("Monday")
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [loading, setLoading] = useState(true)

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchTimetable()
    }
  }, [selectedClass, selectedDay])

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/principal/classes')
      const data = await response.json()
      
      if (data.success && data.classes.length > 0) {
        setClasses(data.classes)
        setSelectedClass(data.classes[0]._id)
      }
    } catch (error) {
      console.error('Failed to fetch classes:', error)
    }
  }

  const fetchTimetable = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/principal/timetable?classId=${selectedClass}&day=${selectedDay}`)
      const data = await response.json()
      
      if (data.success) {
        setTimetable(data.timetable)
      }
    } catch (error) {
      console.error('Failed to fetch timetable:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedClassInfo = classes.find(c => c._id === selectedClass)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Timetable</h1>
          <p className="text-muted-foreground">Create and manage school timetable</p>
        </div>
        <Button>Create Timetable</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <label className="text-sm font-medium mb-2 block">Select Class</label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls._id} value={cls._id}>
                  {cls.className} - Section {cls.section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        <Card className="p-4">
          <label className="text-sm font-medium mb-2 block">Select Day</label>
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {days.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>
      </div>

      {selectedClassInfo && (
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold">{selectedClassInfo.className}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedDay} Schedule - Section {selectedClassInfo.section}
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Loading timetable...</p>
          </div>
        ) : timetable.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No timetable entries for this class and day</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Room</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timetable.map((entry) => (
                <TableRow key={entry._id}>
                  <TableCell>
                    <Badge>Period {entry.period}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{entry.startTime} - {entry.endTime}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {entry.subjectId?.name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {entry.teacherId?.name || 'Not assigned'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{entry.roomNumber || 'TBA'}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
