/**
 * Migration script to fix Bunny CDN video URLs
 * 
 * Problem: Videos were uploaded with storage URLs instead of CDN URLs
 * - Old: https://storage.bunnycdn.com/edu-bridge/videos/...
 * - New: https://edubridge-storage.b-cdn.net/videos/...
 * 
 * Run with: npx tsx scripts/fix-video-urls.ts
 */

import dotenv from 'dotenv'
import mongoose from 'mongoose'

// Load environment variables
dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI!
const NEW_CDN_HOSTNAME = process.env.BUNNY_CDN_HOSTNAME || 'edubridge-storage.b-cdn.net'

// URL patterns to fix
const URL_PATTERNS = [
  { 
    match: /https?:\/\/storage\.bunnycdn\.com\/edu-bridge\//g, 
    replace: `https://${NEW_CDN_HOSTNAME}/`
  },
  {
    match: /https?:\/\/edu-bridge\.b-cdn\.net\//g,
    replace: `https://${NEW_CDN_HOSTNAME}/`
  }
]

async function fixVideoUrls() {
  console.log('🔧 Starting video URL migration...')
  console.log(`📍 New CDN hostname: ${NEW_CDN_HOSTNAME}`)
  
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const db = mongoose.connection.db
    if (!db) {
      throw new Error('Database connection not established')
    }

    // Collections that may contain video URLs
    const collectionsToFix = ['contents', 'courses', 'sections', 'offlinecontents']
    
    let totalUpdated = 0

    for (const collectionName of collectionsToFix) {
      console.log(`\n📂 Processing collection: ${collectionName}`)
      
      const collection = db.collection(collectionName)
      
      // Find documents with old URL patterns
      const urlFields = ['url', 'videoUrl', 'thumbnailUrl', 'imageUrl', 'contentUrl']
      
      for (const field of urlFields) {
        // Check for storage.bunnycdn.com URLs
        const storageUrlQuery = { [field]: { $regex: 'storage\\.bunnycdn\\.com\\/edu-bridge', $options: 'i' } }
        const storageUrlDocs = await collection.find(storageUrlQuery).toArray()
        
        if (storageUrlDocs.length > 0) {
          console.log(`  Found ${storageUrlDocs.length} documents with old storage URLs in ${field}`)
          
          for (const doc of storageUrlDocs) {
            let newUrl = doc[field] as string
            for (const pattern of URL_PATTERNS) {
              newUrl = newUrl.replace(pattern.match, pattern.replace)
            }
            
            await collection.updateOne(
              { _id: doc._id },
              { $set: { [field]: newUrl } }
            )
            
            console.log(`  ✅ Fixed: ${doc[field]} → ${newUrl}`)
            totalUpdated++
          }
        }

        // Check for old CDN hostname
        const oldCdnQuery = { [field]: { $regex: 'edu-bridge\\.b-cdn\\.net', $options: 'i' } }
        const oldCdnDocs = await collection.find(oldCdnQuery).toArray()
        
        if (oldCdnDocs.length > 0) {
          console.log(`  Found ${oldCdnDocs.length} documents with old CDN URLs in ${field}`)
          
          for (const doc of oldCdnDocs) {
            let newUrl = doc[field] as string
            for (const pattern of URL_PATTERNS) {
              newUrl = newUrl.replace(pattern.match, pattern.replace)
            }
            
            await collection.updateOne(
              { _id: doc._id },
              { $set: { [field]: newUrl } }
            )
            
            console.log(`  ✅ Fixed: ${doc[field]} → ${newUrl}`)
            totalUpdated++
          }
        }
      }
    }

    console.log(`\n🎉 Migration complete! Updated ${totalUpdated} documents.`)
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('👋 Disconnected from MongoDB')
  }
}

fixVideoUrls()
