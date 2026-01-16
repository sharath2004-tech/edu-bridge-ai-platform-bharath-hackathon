import { Course } from '@/lib/models'
import connectDB from '@/lib/mongodb'

async function checkCourseVideos() {
  try {
    await connectDB()
    console.log('Connected to MongoDB\n')

    // Find all courses
    const courses = await Course.find({}).select('title lessons').limit(5)
    
    console.log(`Found ${courses.length} courses\n`)
    
    for (const course of courses) {
      console.log(`\n📚 Course: ${course.title}`)
      console.log(`   ID: ${course._id}`)
      console.log(`   Total Lessons: ${course.lessons?.length || 0}`)
      
      if (course.lessons && course.lessons.length > 0) {
        course.lessons.forEach((lesson, idx) => {
          console.log(`\n   Lesson ${idx + 1}: ${lesson.title}`)
          console.log(`   - Description: ${lesson.description || 'N/A'}`)
          console.log(`   - Video URL: ${lesson.videoUrl || 'No video'}`)
          console.log(`   - Duration: ${lesson.duration} min`)
        })
      } else {
        console.log('   No lessons found')
      }
      console.log('\n' + '-'.repeat(60))
    }
    
    // Check if any courses have video URLs
    const coursesWithVideos = await Course.find({ 
      'lessons.videoUrl': { $exists: true, $ne: '' } 
    })
    
    console.log(`\n\n✅ Courses with videos: ${coursesWithVideos.length}`)
    
    if (coursesWithVideos.length > 0) {
      console.log('\n📹 Courses containing video URLs:')
      coursesWithVideos.forEach(course => {
        const videosCount = course.lessons.filter(l => l.videoUrl).length
        console.log(`   - ${course.title} (${videosCount} videos)`)
      })
    }
    
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

checkCourseVideos()
