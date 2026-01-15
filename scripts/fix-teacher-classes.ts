import dotenv from 'dotenv'
import mongoose from 'mongoose'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Define schemas directly
const userSchema = new mongoose.Schema({}, { strict: false })
const classSchema = new mongoose.Schema({}, { strict: false })

const User = mongoose.model('User', userSchema)
const Class = mongoose.model('Class', classSchema)

async function fixTeacherClasses() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment variables')
    }
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')

    // Find all teachers with assignedClasses
    const teachers = await User.find({ 
      role: 'teacher',
      assignedClasses: { $exists: true, $ne: [] }
    })

    console.log(`Found ${teachers.length} teachers with assigned classes`)

    let fixedCount = 0
    let errorCount = 0

    for (const teacher of teachers) {
      console.log(`\n--- Teacher: ${teacher.name} (${teacher.email}) ---`)
      console.log('Original assignedClasses:', teacher.assignedClasses)

      // Check if assignedClasses contains string values
      const hasStringValues = teacher.assignedClasses.some((classId: any) => 
        typeof classId === 'string' && !mongoose.Types.ObjectId.isValid(classId)
      )

      if (!hasStringValues) {
        console.log('✅ Already using valid ObjectIds, skipping')
        continue
      }

      // Fetch classes for this teacher's school
      const classes = await Class.find({ schoolId: teacher.schoolId })
      console.log(`Found ${classes.length} classes in school ${teacher.schoolId}`)

      // Build a map of className-section to ObjectId
      const classMap = new Map<string, mongoose.Types.ObjectId>()
      for (const cls of classes) {
        const key = `${cls.className}-${cls.section}`
        classMap.set(key, cls._id as mongoose.Types.ObjectId)
        classMap.set(cls.className, cls._id as mongoose.Types.ObjectId) // Also map by className alone
      }

      console.log('Class mapping:', Array.from(classMap.entries()).map(([k, v]) => `${k} -> ${v}`))

      // Convert string class names to ObjectIds
      const newAssignedClasses: mongoose.Types.ObjectId[] = []
      for (const classId of teacher.assignedClasses) {
        if (mongoose.Types.ObjectId.isValid(classId)) {
          // Already an ObjectId
          newAssignedClasses.push(new mongoose.Types.ObjectId(classId))
        } else if (typeof classId === 'string') {
          // Try to find the ObjectId from the map
          const objectId = classMap.get(classId) || classMap.get(classId.trim())
          if (objectId) {
            console.log(`Converting "${classId}" -> ${objectId}`)
            newAssignedClasses.push(objectId)
          } else {
            console.error(`⚠️ Could not find ObjectId for class name: "${classId}"`)
            errorCount++
          }
        }
      }

      if (newAssignedClasses.length > 0) {
        // Update the teacher
        teacher.assignedClasses = newAssignedClasses as any
        await teacher.save()
        console.log(`✅ Fixed! New assignedClasses:`, teacher.assignedClasses)
        fixedCount++
      } else {
        console.error(`❌ Could not fix teacher ${teacher.email}`)
        errorCount++
      }
    }

    console.log(`\n\n=== Summary ===`)
    console.log(`Total teachers: ${teachers.length}`)
    console.log(`Fixed: ${fixedCount}`)
    console.log(`Errors: ${errorCount}`)
    console.log(`Skipped (already valid): ${teachers.length - fixedCount - errorCount}`)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

fixTeacherClasses()
