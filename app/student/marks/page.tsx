'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { BookOpen, TrendingUp, Award } from 'lucide-react'

export default function StudentMarksPage() {
  const [exams, setExams] = useState<any[]>([])
  const [selectedExam, setSelectedExam] = useState('')
  const [marks, setMarks] = useState<any[]>([])
  const [stats, setStats] = useState({ average: 0, total: 0, percentage: 0, grade: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExams()
  }, [])

  useEffect(() => {
    if (selectedExam) {
      fetchMarks()
    }
  }, [selectedExam])

  const fetchExams = async () => {
    const res = await fetch('/api/student/exams')
    const data = await res.json()
    
    if (data.success && data.exams.length > 0) {
      setExams(data.exams)
      setSelectedExam(data.exams[0]._id)
    }
    setLoading(false)
  }

  const fetchMarks = async () => {
    setLoading(true)
    const res = await fetch(`/api/student/marks?examId=${selectedExam}`)
    const data = await res.json()
    
    if (data.success) {
      setMarks(data.marks)
      setStats(data.stats)
    }
    setLoading(false)
  }

  const getGradeBadge = (grade: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      'A+': 'default',
      'A': 'default',
      'B': 'secondary',
      'C': 'secondary',
      'D': 'destructive',
      'F': 'destructive'
    }
    return <Badge variant={variants[grade] || 'outline'}>{grade}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Marks</h1>
        <p className="text-muted-foreground mt-2">View your exam results and performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Marks</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.average.toFixed(1)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Percentage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.percentage.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grade</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.grade || 'N/A'}</div>
          </CardContent>
        </Card>
      </div>

      {/* Exam Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Exam</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger>
              <SelectValue placeholder="Select an exam" />
            </SelectTrigger>
            <SelectContent>
              {exams.map(exam => (
                <SelectItem key={exam._id} value={exam._id}>
                  {exam.examName} ({exam.examType})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Marks Table */}
      {selectedExam && (
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Marks</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : marks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No marks available for this exam
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Marks Scored</TableHead>
                    <TableHead>Total Marks</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marks.map((mark, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {mark.subjectId?.subjectName || 'N/A'}
                      </TableCell>
                      <TableCell>{mark.marksScored}</TableCell>
                      <TableCell>{mark.totalMarks}</TableCell>
                      <TableCell>{mark.percentage?.toFixed(1)}%</TableCell>
                      <TableCell>{getGradeBadge(mark.grade)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {mark.remarks || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
