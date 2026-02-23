/**
 * Fix Bunny CDN URLs in courses collection - lessons.videoUrl field
 */
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config({ path: '.env.local' })

const CDN_HOSTNAME = process.env.BUNNY_CDN_HOSTNAME || 'edubridge-storage.b-cdn.net'

function fixUrl(url: string): string {
  if (!url) return url
  
  let fixed = url
  
  // Fix storage.bunnycdn.com/edu-bridge/ → CDN_HOSTNAME/
  fixed = fixed.replace(/https?:\/\/storage\.bunnycdn\.com\/edu-bridge\//g, `https://${CDN_HOSTNAME}/`)
  
  // Fix edu-bridge.b-cdn.net/edu-bridge/ → CDN_HOSTNAME/ (duplicate path)
  fixed = fixed.replace(/https?:\/\/edu-bridge\.b-cdn\.net\/edu-bridge\//g, `https://${CDN_HOSTNAME}/`)
  
  // Fix edu-bridge.b-cdn.net/ → CDN_HOSTNAME/
  fixed = fixed.replace(/https?:\/\/edu-bridge\.b-cdn\.net\//g, `https://${CDN_HOSTNAME}/`)
  
  return fixed
}

async function fixCourseUrls() {
  console.log('🔧 Fixing Bunny CDN URLs in courses...')
  console.log(`📍 Target CDN hostname: ${CDN_HOSTNAME}`)
  
  await mongoose.connect(process.env.MONGODB_URI!)
  console.log('✅ Connected to MongoDB')

  const db = mongoose.connection.db!
  const courses = db.collection('courses')
  
  // Find courses with bunny URLs in lessons
  const coursesToFix = await courses.find({
    $or: [
      { 'lessons.videoUrl': { $regex: 'storage\\.bunnycdn\\.com/edu-bridge', $options: 'i' } },
      { 'lessons.videoUrl': { $regex: 'edu-bridge\\.b-cdn\\.net', $options: 'i' } },
    ]
  }).toArray()
  
  console.log(`\n📚 Found ${coursesToFix.length} courses to fix`)
  
  let fixedCount = 0
  
  for (const course of coursesToFix) {
    console.log(`\n📘 Course: ${course.title}`)
    
    const updatedLessons = (course.lessons || []).map((lesson: any) => {
      if (lesson.videoUrl && (lesson.videoUrl.includes('bunny') || lesson.videoUrl.includes('b-cdn'))) {
        const oldUrl = lesson.videoUrl
        const newUrl = fixUrl(lesson.videoUrl)
        
        if (oldUrl !== newUrl) {
          console.log(`  ✅ ${lesson.title}`)
          console.log(`     Old: ${oldUrl}`)
          console.log(`     New: ${newUrl}`)
          fixedCount++
        }
        
        return { ...lesson, videoUrl: newUrl }
      }
      return lesson
    })
    
    await courses.updateOne(
      { _id: course._id },
      { $set: { lessons: updatedLessons } }
    )
  }
  
  // Also fix contents collection
  console.log('\n📂 Checking contents collection...')
  const contents = db.collection('contents')
  const contentsToFix = await contents.find({
    $or: [
      { url: { $regex: 'storage\\.bunnycdn\\.com/edu-bridge', $options: 'i' } },
      { url: { $regex: 'edu-bridge\\.b-cdn\\.net', $options: 'i' } },
    ]
  }).toArray()
  
  for (const content of contentsToFix) {
    if (content.url) {
      const newUrl = fixUrl(content.url)
      if (content.url !== newUrl) {
        console.log(`  ✅ ${content.title}: ${content.url} → ${newUrl}`)
        await contents.updateOne({ _id: content._id }, { $set: { url: newUrl } })
        fixedCount++
      }
    }
  }

  console.log(`\n🎉 Fixed ${fixedCount} URLs total`)
  
  await mongoose.disconnect()
  console.log('👋 Done')
}

fixCourseUrls()
