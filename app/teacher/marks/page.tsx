'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import { BookOpen, Save, Edit } from 'lucide-react'

export default function TeacherMarksPage() {
  const [classes, setClasses] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [exams, setExams] = useState<any[]>([])
  const [selectedExam, setSelectedExam] = useState('')
  const [subjects, setSubjects] = useState<any[]>([])
  const [selectedSubject, setSelectedSubject] = useState('')
  const [students, setStudents] = useState<any[]>([])
  const [marks, setMarks] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchExams()
      fetchSubjects()
      fetchStudents()
    }
  }, [selectedClass])

  useEffect(() => {
    if (selectedClass && selectedExam && selectedSubject) {
      fetchMarks()
    }
  }, [selectedClass, selectedExam, selectedSubject])

  const fetchClasses = async () => {
    const res = await fetch('/api/teacher/classes')
    const data = await res.json()
    if (data.success) setClasses(data.classes)
  }

  const fetchExams = async () => {
    const res = await fetch(`/api/teacher/exams?classId=${selectedClass}`)
    const data = await res.json()
    if (data.success) setExams(data.exams)
  }

  const fetchSubjects = async () => {
    const res = await fetch(`/api/teacher/subjects?classId=${selectedClass}`)
    const data = await res.json()
    if (data.success) setSubjects(data.subjects)
  }

  const fetchStudents = async () => {
    const res = await fetch(`/api/teacher/students?classId=${selectedClass}`)
    const data = await res.json()
    if (data.success) setStudents(data.students)
  }

  const fetchMarks = async () => {
    const res = await fetch(`/api/teacher/marks?classId=${selectedClass}&examId=${selectedExam}&subjectId=${selectedSubject}`)
    const data = await res.json()
    if (data.success) {
      const marksMap: Record<string, number> = {}
      data.marks.forEach((mark: any) => {
        marksMap[mark.studentId._id || mark.studentId] = mark.marksScored
      })
      setMarks(marksMap)
    }
  }

  const handleMarkChange = (studentId: string, value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setMarks(prev => ({ ...prev, [studentId]: numValue }))
    }
  }

  const saveMarks = async () => {
    setLoading(true)
    const marksData = students.map(student => ({
      studentId: student._id,
      examId: selectedExam,
      subjectId: selectedSubject,
      classId: selectedClass,
      marksScored: marks[student._id] || 0,
      totalMarks: 100
    }))

    const res = await fetch('/api/teacher/marks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ marks: marksData })
    })

    const data = await res.json()
    setLoading(false)
    
    if (data.success) {
      alert('Marks saved successfully!')
    } else {
      alert('Error saving marks: ' + data.error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Student Marks</h1>
        <p className="text-muted-foreground mt-2">Enter and update marks for exams</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Class, Exam & Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(cls => (
                  <SelectItem key={cls._id} value={cls._id}>
                    {cls.className}-{cls.section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedExam} onValueChange={setSelectedExam} disabled={!selectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select Exam" />
              </SelectTrigger>
              <SelectContent>
                {exams.map(exam => (
                  <SelectItem key={exam._id} value={exam._id}>
                    {exam.examName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject._id} value={subject._id}>
                    {subject.subjectName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedClass && selectedExam && selectedSubject && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Student Marks</CardTitle>
              <Button onClick={saveMarks} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Saving...' : 'Save All Marks'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Marks (out of 100)</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map(student => {
                  const score = marks[student._id] || 0
                  const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : score >= 50 ? 'D' : 'F'
                  return (
                    <TableRow key={student._id}>
                      <TableCell>{student.rollNo}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={marks[student._id] || ''}
                          onChange={(e) => handleMarkChange(student._id, e.target.value)}
                          className="w-24"
                          placeholder="0"
                        />
                      </TableCell>
                      <TableCell>
                        <Badge variant={score >= 60 ? 'default' : 'destructive'}>
                          {grade}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
