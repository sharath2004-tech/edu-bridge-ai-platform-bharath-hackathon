import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getSession } from "@/lib/auth"
import { Section, User } from "@/lib/models"
import connectDB from "@/lib/mongodb"
import bcrypt from "bcrypt"
import { MoreVertical, Search, TrendingUp } from "lucide-react"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import { redirect } from "next/navigation"

type Student = { _id: string; name: string; email: string; sectionName?: string; createdAt?: string }
type Section = { _id: string; name: string; students: string[] }

async function createStudent(formData: FormData) {
  "use server"
  try {
    const session = await getSession()
    if (!session || session.role !== 'teacher') {
      console.error('Unauthorized: Teacher role required')
      return
    }
    
    const name = String(formData.get("name") ?? "")
    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")
    const sectionId = String(formData.get("sectionId") ?? "")
    
    if (!name || !email || !password) {
      console.error('Missing required fields')
      return
    }
    
    await connectDB()
    const exists = await User.findOne({ email })
    if (exists) {
      console.error('User already exists')
      return
    }
    
    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed, role: 'student' })
    
    // Add student to section if sectionId provided
    if (sectionId) {
      await Section.findByIdAndUpdate(sectionId, { $addToSet: { students: user._id } })
    }
    
    revalidatePath("/teacher/students")
    redirect("/teacher/students")
  } catch (error) {
    console.error('Error creating student:', error)
  }
}

export default async function StudentsPage() {
  const session = await getSession()
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">Please Log In</h2>
        <p className="text-muted-foreground">You need to be logged in to access this page</p>
        <Link href="/login">
          <Button>Go to Login</Button>
        </Link>
      </div>
    )
  }
  if (session.role !== 'teacher') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">Unauthorized</h2>
        <p className="text-muted-foreground">You need teacher privileges to access this page</p>
        <Link href={`/${session.role}/dashboard`}>
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    )
  }
  
  await connectDB()
  const studentsData = await User.find({ role: 'student' }).select('-password').limit(100).lean()
  
  // Get section information for each student
  const studentIds = studentsData.map(s => s._id)
  const sectionsWithStudents = await Section.find({ students: { $in: studentIds } }).lean()
  
  // Create a map of studentId to section name
  const studentSectionMap = new Map()
  sectionsWithStudents.forEach(section => {
    section.students.forEach((studentId: any) => {
      studentSectionMap.set(String(studentId), section.name)
    })
  })
  
  const students = studentsData.map(s => ({
    _id: String(s._id),
    name: s.name,
    email: s.email,
    sectionName: studentSectionMap.get(String(s._id)) || 'No Section',
    createdAt: s.createdAt ? String(s.createdAt) : undefined
  }))
  
  // Fetch sections for dropdown (teacher's sections only)
  const sectionsData = await Section.find({ owner: session.id }).lean()
  const sections: Section[] = sectionsData.map(s => ({
    _id: String(s._id),
    name: s.name,
    students: s.students.map((id: any) => String(id))
  }))
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold mb-2">Student Management</h1>
        <p className="text-muted-foreground">Track and manage all your enrolled students</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search students by name or email..." className="pl-10" />
      </div>

      {/* Create Student */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Add New Student</h3>
        {sections.length === 0 ? (
          <div className="text-center py-6 space-y-3">
            <p className="text-sm text-muted-foreground">
              You need to create a section first before adding students.
            </p>
            <Link href="/teacher/dashboard">
              <Button variant="outline">Go to Dashboard to Create Section</Button>
            </Link>
          </div>
        ) : (
          <form action={createStudent} className="space-y-4">
            <div className="grid gap-4">
              <Input name="name" placeholder="Full name" required className="w-full" />
              <Input name="email" type="email" placeholder="Email" required className="w-full" />
              <Input name="password" type="password" placeholder="Temp password" required className="w-full" />
              <select 
                name="sectionId" 
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select Section</option>
                {sections.map((section) => (
                  <option key={section._id} value={section._id}>{section.name}</option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full">Add Student</Button>
          </form>
        )}
      </Card>

      {/* Students List */}
      <div className="space-y-2">
        {students.length === 0 ? (
          <div className="text-sm text-muted-foreground">No students found.</div>
        ) : (
          students.map((student, i) => (
          <Card
            key={student._id}
            className="p-4 border border-border hover:border-primary/50 transition-all group animate-slideInLeft"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{student.name}</h3>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span>{student.email}</span>
                  {student.sectionName && (
                    <>
                      <span>•</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-medium">
                        {student.sectionName}
                      </span>
                    </>
                  )}
                  {student.createdAt && (
                    <>
                      <span>•</span>
                      <span>Joined {new Date(student.createdAt).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right mr-4">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="font-semibold">{Math.floor(Math.random()*40)+60}%</span>
                </div>
              </div>
              <Button size="icon" variant="ghost">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </Card>
          ))
        )}
      </div>
    </div>
  )
}
