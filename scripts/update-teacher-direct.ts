import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function updateTeacher() {
  try {
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found')
    }
    
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')

    // Update the teacher directly with raw MongoDB operation
    const result = await mongoose.connection.db?.collection('users').updateOne(
      { email: 'aiml233004@gmail.com' },
      { $set: { assignedClasses: [new mongoose.Types.ObjectId('69688facf3d997fb348d5b20')] } }
    )

    console.log('Update result:', result)

    // Verify
    const teacher = await mongoose.connection.db?.collection('users').findOne({ email: 'aiml233004@gmail.com' })
    console.log('Updated teacher assignedClasses:', teacher?.assignedClasses)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected')
  }
}

updateTeacher()
