"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Award, Plus, Search, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

interface Class {
  _id: string
  className: string
  section: string
}

const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'English', 'Hindi', 'Computer Science', 'History',
  'Geography', 'Economics', 'Physical Education', 'Arts'
]

const EXAM_TYPES = ['quiz', 'midterm', 'final', 'assignment', 'project', 'practical']

interface Student {
  _id: string
  name: string
  email: string
  rollNumber: number
  className: string
}

interface Mark {
  _id: string
  studentId: any
  className: string
  subject: string
  examType: string
  examName: string
  marksObtained: number
  totalMarks: number
  percentage: number
  grade: string
  term: string
  examDate: string
}

export default function MarksPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [marks, setMarks] = useState<Mark[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedTerm, setSelectedTerm] = useState('Term 1 2024-25')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [statistics, setStatistics] = useState<any>(null)

  useEffect(() => {
    fetchClasses()
  }, [])

  // Form state
  const [formData, setFormData] = useState({
    studentId: '',
    examType: 'quiz' as any,
    examName: '',
    marksObtained: '',
    totalMarks: '',
    examDate: new Date().toISOString().split('T')[0],
    remarks: ''
  })

  useEffect(() => {
    if (selectedClassId) {
      fetchStudents()
      fetchMarks()
    }
  }, [selectedClassId, selectedSubject, selectedTerm])

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
      const res = await fetch(`/api/principal/students?classId=${selectedClassId}`)
      if (res.ok) {
        const data = await res.json()
        setStudents(data.students || [])
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const fetchMarks = async () => {
    try {
      setLoading(true)
      let url = `/api/principal/marks?class=${selectedClass}&section=${selectedSection}&term=${selectedTerm}`
      if (selectedSubject) url += `&subject=${selectedSubject}`
      
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setMarks(data.marks || [])
        setStatistics(data.statistics)
      }
    } catch (error) {
      console.error('Error fetching marks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMarks = async () => {
    try {
      if (!formData.studentId || !formData.examName || !formData.marksObtained || !formData.totalMarks) {
        alert('Please fill all required fields')
        return
      }

      const records = [{
        studentId: formData.studentId,
        className: selectedClass,
        subject: selectedSubject,
        examType: formData.examType,
        examName: formData.examName,
        marksObtained: Number(formData.marksObtained),
        totalMarks: Number(formData.totalMarks),
        term: selectedTerm,
        examDate: formData.examDate,
        remarks: formData.remarks
      }]

      const res = await fetch('/api/principal/marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records })
      })

      if (res.ok) {
        setShowAddDialog(false)
        setFormData({
          studentId: '',
          examType: 'quiz',
          examName: '',
          marksObtained: '',
          totalMarks: '',
          examDate: new Date().toISOString().split('T')[0],
          remarks: ''
        })
        fetchMarks()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to add marks')
      }
    } catch (error) {
      alert('Error adding marks')
    }
  }

  const filteredMarks = marks.filter(mark =>
    mark.studentId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mark.examName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getGradeBadgeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800'
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800'
    if (grade === 'C') return 'bg-yellow-100 text-yellow-800'
    if (grade === 'D') return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Marks & Reports</h1>
          <p className="text-muted-foreground">Manage student marks and performance</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button disabled={!selectedClassId || !selectedSubject}>
              <Plus className="w-4 h-4 mr-2" />
              Add Marks
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Marks</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Student *</Label>
                  <Select value={formData.studentId} onValueChange={(v) => setFormData({...formData, studentId: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map(s => (
                        <SelectItem key={s._id} value={s._id}>
                          {s.rollNumber}. {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Exam Type *</Label>
                  <Select value={formData.examType} onValueChange={(v) => setFormData({...formData, examType: v as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXAM_TYPES.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Exam Name *</Label>
                <Input
                  value={formData.examName}
                  onChange={(e) => setFormData({...formData, examName: e.target.value})}
                  placeholder="e.g., Unit Test 1, Mid-Term Exam"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Marks Obtained *</Label>
                  <Input
                    type="number"
                    value={formData.marksObtained}
                    onChange={(e) => setFormData({...formData, marksObtained: e.target.value})}
                    min="0"
                  />
                </div>
                <div>
                  <Label>Total Marks *</Label>
                  <Input
                    type="number"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({...formData, totalMarks: e.target.value})}
                    min="1"
                  />
                </div>
                <div>
                  <Label>Exam Date *</Label>
                  <Input
                    type="date"
                    value={formData.examDate}
                    onChange={(e) => setFormData({...formData, examDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label>Remarks (Optional)</Label>
                <Input
                  value={formData.remarks}
                  onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                  placeholder="Additional comments..."
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddMarks} className="flex-1">
                  Save Marks
                </Button>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>Class & Section *</Label>
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
            <Label>Subject *</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map(sub => (
                  <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Term</Label>
            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Term 1 2024-25">Term 1 2024-25</SelectItem>
                <SelectItem value="Term 2 2024-25">Term 2 2024-25</SelectItem>
                <SelectItem value="Semester 1 2024-25">Semester 1 2024-25</SelectItem>
                <SelectItem value="Semester 2 2024-25">Semester 2 2024-25</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Student or exam..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <div className="text-sm text-muted-foreground">Average</div>
            </div>
            <div className="text-2xl font-bold">{statistics.averagePercentage}%</div>
          </Card>
          <Card className="p-4 border-green-200 bg-green-50">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-green-600" />
              <div className="text-sm text-green-700">Passed</div>
            </div>
            <div className="text-2xl font-bold text-green-700">{statistics.passed}</div>
          </Card>
          <Card className="p-4 border-red-200 bg-red-50">
            <div className="text-sm text-red-700 mb-2">Failed</div>
            <div className="text-2xl font-bold text-red-700">{statistics.failed}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-2">Pass %</div>
            <div className="text-2xl font-bold">{statistics.passPercentage}%</div>
          </Card>
        </div>
      )}

      {/* Marks Table */}
      {!selectedClass || !selectedSubject ? (
        <Card className="p-8">
          <div className="text-center">
            <Award className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Select class and subject to view marks</p>
          </div>
        </Card>
      ) : loading ? (
        <Card className="p-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading marks...</p>
          </div>
        </Card>
      ) : filteredMarks.length === 0 ? (
        <Card className="p-8">
          <div className="text-center">
            <p className="text-muted-foreground">No marks recorded yet</p>
            <Button className="mt-4" onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Mark
            </Button>
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
                  <th className="text-center p-4">Sec</th>
                  <th className="text-left p-4">Exam</th>
                  <th className="text-left p-4">Type</th>
                  <th className="text-center p-4">Marks</th>
                  <th className="text-center p-4">Percentage</th>
                  <th className="text-center p-4">Grade</th>
                  <th className="text-left p-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredMarks.map(mark => (
                  <tr key={mark._id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{mark.studentId?.rollNumber}</td>
                    <td className="p-4">{mark.studentId?.name}</td>
                    <td className="p-4 text-center">
                      <Badge variant="outline" className="text-xs">
                        {(mark.studentId as any)?.section || 'N/A'}
                      </Badge>
                    </td>
                    <td className="p-4">{mark.examName}</td>
                    <td className="p-4">
                      <Badge variant="outline">
                        {mark.examType.charAt(0).toUpperCase() + mark.examType.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4 text-center font-medium">
                      {mark.marksObtained}/{mark.totalMarks}
                    </td>
                    <td className="p-4 text-center font-bold">
                      {mark.percentage.toFixed(1)}%
                    </td>
                    <td className="p-4 text-center">
                      <Badge className={getGradeBadgeColor(mark.grade)}>
                        {mark.grade}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(mark.examDate).toLocaleDateString()}
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
