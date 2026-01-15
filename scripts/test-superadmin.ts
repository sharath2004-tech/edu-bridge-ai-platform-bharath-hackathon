/**
 * Test script to verify super admin login
 */

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

import bcrypt from 'bcrypt'
import { User } from '../lib/models'
import connectDB from '../lib/mongodb'

async function testSuperAdminLogin() {
  try {
    await connectDB()
    console.log('✅ Connected to MongoDB\n')

    // Find super admin
    console.log('🔍 Searching for super admin...')
    const superAdmin = await User.findOne({ 
      email: 'superadmin@edubridge.com',
      role: 'super-admin'
    }).select('+password')

    if (!superAdmin) {
      console.log('❌ Super admin NOT FOUND in database!')
      console.log('   Email searched: superadmin@edubridge.com')
      console.log('   Role searched: super-admin')
      
      // Check if user exists with different role
      const anyUser = await User.findOne({ email: 'superadmin@edubridge.com' }).select('+password')
      if (anyUser) {
        console.log(`\n⚠️  User exists but with role: ${anyUser.role}`)
      }
      
      process.exit(1)
    }

    console.log('✅ Super admin FOUND!')
    console.log('   ID:', superAdmin._id)
    console.log('   Email:', superAdmin.email)
    console.log('   Role:', superAdmin.role)
    console.log('   Name:', superAdmin.name)
    console.log('   Has password:', !!superAdmin.password)
    console.log('   Password hash (first 20 chars):', superAdmin.password?.substring(0, 20))

    // Test password comparison
    console.log('\n🔐 Testing password comparison...')
    const testPassword = 'superadmin123'
    const isMatch = await bcrypt.compare(testPassword, superAdmin.password)
    
    if (isMatch) {
      console.log('✅ Password comparison SUCCESSFUL!')
      console.log(`   Password "${testPassword}" matches the stored hash`)
    } else {
      console.log('❌ Password comparison FAILED!')
      console.log(`   Password "${testPassword}" does NOT match the stored hash`)
      
      // Try to create a test hash to verify bcrypt is working
      console.log('\n🧪 Testing bcrypt functionality...')
      const testHash = await bcrypt.hash(testPassword, 10)
      const testMatch = await bcrypt.compare(testPassword, testHash)
      console.log('   Bcrypt test:', testMatch ? '✅ Working' : '❌ Not working')
    }

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('SUMMARY')
    console.log('='.repeat(60))
    if (superAdmin && isMatch) {
      console.log('✅ Super admin login should work with:')
      console.log('   Email: superadmin@edubridge.com')
      console.log('   Password: superadmin123')
      console.log('   Role: Super Administrator')
    } else {
      console.log('❌ Super admin login will FAIL')
      console.log('   Reason:', !superAdmin ? 'User not found' : 'Password mismatch')
    }
    console.log('='.repeat(60))

    process.exit(0)
  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

testSuperAdminLogin()
