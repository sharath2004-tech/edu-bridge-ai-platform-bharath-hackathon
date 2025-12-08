import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getSession } from "@/lib/auth"
import { Section, User } from "@/lib/models"
import connectDB from "@/lib/mongodb"
import bcrypt from "bcrypt"
import { MoreVertical, Search } from "lucide-react"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import { redirect } from "next/navigation"

type User = {
  _id: string
  name: string
  email: string
  role: "student" | "teacher" | "admin"
  sectionName?: string
  createdAt?: string
}

async function createUser(formData: FormData) {
  "use server"
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      console.error('Unauthorized: Admin role required')
      return
    }
    
    const name = String(formData.get("name") ?? "")
    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")
    const role = String(formData.get("role") ?? "teacher")
    
    if (!name || !email || !password) {
      console.error('Missing required fields')
      return
    }
    
    if (!['teacher','admin'].includes(role)) {
      console.error('Invalid role')
      return
    }
    
    await connectDB()
    const exists = await User.findOne({ email })
    if (exists) {
      console.error('User already exists')
      return
    }
    
    const hashed = await bcrypt.hash(password, 10)
    await User.create({ name, email, password: hashed, role })
    
    revalidatePath("/admin/users")
    redirect("/admin/users")
  } catch (error) {
    console.error('Error creating user:', error)
  }
}

export default async function UsersPage() {
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
  if (session.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">Unauthorized</h2>
        <p className="text-muted-foreground">You need admin privileges to access this page</p>
        <Link href={`/${session.role}/dashboard`}>
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    )
  }
  
  await connectDB()
  const usersData = await User.find().select('-password').limit(100).lean()
  
  // Get section information for students
  const studentIds = usersData.filter(u => u.role === 'student').map(u => u._id)
  const sectionsWithStudents = await Section.find({ students: { $in: studentIds } }).lean()
  
  // Create a map of studentId to section name
  const studentSectionMap = new Map()
  sectionsWithStudents.forEach(section => {
    section.students.forEach((studentId: any) => {
      studentSectionMap.set(String(studentId), section.name)
    })
  })
  
  const users: User[] = usersData.map(u => ({
    _id: String(u._id),
    name: u.name,
    email: u.email,
    role: u.role,
    sectionName: u.role === 'student' ? studentSectionMap.get(String(u._id)) : undefined,
    createdAt: u.createdAt ? String(u.createdAt) : undefined
  }))

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage all platform users and permissions</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-10" />
        </div>
        <select className="px-4 py-2 border border-border rounded-lg bg-background">
          <option>All Roles</option>
          <option>Student</option>
          <option>Teacher</option>
          <option>Admin</option>
        </select>
      </div>

      {/* Create User */}
      <form action={createUser} className="grid md:grid-cols-4 gap-3">
        <Input name="name" placeholder="Full name" required />
        <Input name="email" type="email" placeholder="Email" required />
        <Input name="password" type="password" placeholder="Temp password" required />
        <select name="role" className="px-4 py-2 border border-border rounded-lg bg-background">
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <Button type="submit" className="md:col-span-4">Create User</Button>
      </form>

      {/* Users Table */}
      <div className="space-y-2">
        {users.length === 0 ? (
          <div className="text-sm text-muted-foreground">No users found.</div>
        ) : (
          users.map((user, i) => (
            <Card
              key={user._id}
              className="p-4 border border-border hover:border-primary/50 transition-all group animate-slideInLeft"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{user.name}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span>{user.email}</span>
                    <span>•</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-destructive/20 text-destructive"
                          : user.role === "teacher"
                            ? "bg-primary/20 text-primary"
                            : "bg-secondary/20 text-secondary"
                      }`}
                    >
                      {user.role}
                    </span>
                    {user.role === 'student' && user.sectionName && (
                      <>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-medium">
                          {user.sectionName}
                        </span>
                      </>
                    )}
                    {user.createdAt && (
                      <>
                        <span>•</span>
                        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
