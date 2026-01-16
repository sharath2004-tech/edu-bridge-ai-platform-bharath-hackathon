import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

import { Class, School, User } from '../lib/models'
import connectDB from '../lib/mongodb'

async function verifyTeacherAssignments() {
  try {
    await connectDB()
    console.log('🔌 Connected to MongoDB\n')

    const schools = await School.find({})
    
    for (const school of schools) {
      console.log(`\n🏫 ${school.name}`)
      console.log('═'.repeat(60))
      
      const teachers = await User.find({ 
        schoolId: school._id, 
        role: 'teacher' 
      }).select('name email assignedClasses assignedSubjects subjectSpecialization')
      
      console.log(`\n👨‍🏫 Teachers: ${teachers.length}`)
      
      for (const teacher of teachers) {
        console.log(`\n   📌 ${teacher.name} (${teacher.subjectSpecialization})`)
        console.log(`      Email: ${teacher.email}`)
        console.log(`      Assigned Classes: ${teacher.assignedClasses?.length || 0}`)
        console.log(`      Assigned Subjects: ${teacher.assignedSubjects?.length || 0}`)
        
        if (teacher.assignedClasses && teacher.assignedClasses.length > 0) {
          const classes = await Class.find({ 
            _id: { $in: teacher.assignedClasses } 
          }).select('className section')
          
          console.log(`      Classes: ${classes.map(c => `${c.className}-${c.section}`).join(', ')}`)
        }
      }
      
      console.log()
    }
    
    console.log('\n✅ Verification Complete!')
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

verifyTeacherAssignments()
