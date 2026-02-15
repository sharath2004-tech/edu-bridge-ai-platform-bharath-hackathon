import { getSession } from '@/lib/auth'
import Course from '@/lib/models/Course'
import School from '@/lib/models/School'
import User from '@/lib/models/User'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Export data endpoint for super admin chatbot
 * Allows downloading data in CSV/JSON format
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || session.role !== 'super-admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { dataType, format = 'json', filters = {} } = await req.json()

    await connectDB()

    let data: any[] = []
    let filename = ''

    switch (dataType) {
      case 'students':
        data = await User.find({ role: 'student', ...filters })
          .populate('schoolId', 'name code')
          .populate('classId', 'className section')
          .select('-password')
          .lean()
        filename = 'students_export'
        break

      case 'teachers':
        data = await User.find({ role: 'teacher', ...filters })
          .populate('schoolId', 'name code')
          .select('-password')
          .lean()
        filename = 'teachers_export'
        break

      case 'schools':
        data = await School.find(filters)
          .lean()
        filename = 'schools_export'
        break

      case 'school-stats':
        // Aggregate school statistics
        data = await School.aggregate([
          { $match: { isActive: true } },
          {
            $lookup: {
              from: 'users',
              localField: '_id',
              foreignField: 'schoolId',
              as: 'users'
            }
          },
          {
            $project: {
              name: 1,
              code: 1,
              'address.city': 1,
              'address.state': 1,
              type: 1,
              board: 1,
              studentCount: {
                $size: {
                  $filter: {
                    input: '$users',
                    as: 'user',
                    cond: { $eq: ['$$user.role', 'student'] }
                  }
                }
              },
              teacherCount: {
                $size: {
                  $filter: {
                    input: '$users',
                    as: 'user',
                    cond: { $eq: ['$$user.role', 'teacher'] }
                  }
                }
              }
            }
          },
          { $sort: { studentCount: -1 } }
        ])
        filename = 'school_statistics'
        break

      case 'courses':
        data = await Course.find(filters)
          .populate('instructor', 'name email')
          .populate('schoolId', 'name code')
          .lean()
        filename = 'courses_export'
        break

      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 })
    }

    if (format === 'csv') {
      const csv = convertToCSV(data)
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}_${Date.now()}.csv"`
        }
      })
    }

    // JSON format
    return new NextResponse(JSON.stringify(data, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}_${Date.now()}.json"`
      }
    })

  } catch (error) {
    console.error('Export Error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}

// Helper function to convert to CSV
function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) return ''

  const headers = Object.keys(flattenObject(data[0]))
  const rows = data.map(item => {
    const flat = flattenObject(item)
    return headers.map(header => {
      const value = flat[header]
      if (value === null || value === undefined) return ''
      // Escape commas and quotes
      const str = String(value).replace(/"/g, '""')
      return `"${str}"`
    }).join(',')
  })

  return [headers.join(','), ...rows].join('\n')
}

// Flatten nested objects for CSV
function flattenObject(obj: any, prefix = ''): any {
  return Object.keys(obj).reduce((acc: any, key: string) => {
    const pre = prefix.length ? `${prefix}.` : ''
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key]) && !(obj[key] instanceof Date)) {
      Object.assign(acc, flattenObject(obj[key], pre + key))
    } else {
      acc[pre + key] = obj[key]
    }
    return acc
  }, {})
}
