import { getSession } from '@/lib/auth'
import { chatbotCache } from '@/lib/chatbot-cache'
import ChatMessage from '@/lib/models/ChatMessage'
import Course from '@/lib/models/Course'
import Mark from '@/lib/models/Mark'
import School from '@/lib/models/School'
import Subject from '@/lib/models/Subject'
import User from '@/lib/models/User'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

// Super Admin Chatbot with Database Access
export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || session.role !== 'super-admin') {
      return NextResponse.json({ error: 'Unauthorized - Super Admin access required' }, { status: 403 })
    }

    const { message, language = 'english' } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }

    await connectDB()

    // Fetch comprehensive database stats for context
    const dbContext = await fetchDatabaseContext()

    // Generate response based on query
    const response = await generateSuperAdminResponse(message, language, dbContext)

    // Save chat message (optional - for history)
    try {
      await ChatMessage.create({
        userId: session.id,
        role: 'user',
        content: message,
        timestamp: new Date(),
      })
      
      await ChatMessage.create({
        userId: session.id,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      })
    } catch (chatError) {
      console.error('Error saving chat:', chatError)
    }

    return NextResponse.json({ response }, { status: 200 })
  } catch (error) {
    console.error('Super Admin Chatbot Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint for chat history
export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || session.role !== 'super-admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await connectDB()

    const messages = await ChatMessage.find({ userId: session.id })
      .sort({ timestamp: -1 })
      .limit(50)

    return NextResponse.json({ 
      messages: messages.reverse().map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }))
    }, { status: 200 })
  } catch (error) {
    console.error('Error fetching chat history:', error)
    return NextResponse.json({ error: 'Failed to fetch chat history' }, { status: 500 })
  }
}

// Fetch comprehensive database context
async function fetchDatabaseContext() {
  try {
    // Check cache first
    const cacheKey = 'super-admin-db-context'
    const cached = chatbotCache.get(cacheKey)
    if (cached) {
      console.log('Returning cached database context')
      return cached
    }

    console.log('Fetching fresh database context')
    const [
      totalSchools,
      activeSchools,
      pendingSchools,
      totalStudents,
      totalTeachers,
      totalPrincipals,
      totalCourses,
      schools,
      recentStudents,
      recentTeachers,
      schoolStats,
      topScorersBySubject,
      recentMarks,
      subjectPerformance
    ] = await Promise.all([
      School.countDocuments({ isActive: true }),
      School.countDocuments({ isActive: true }),
      School.countDocuments({ isActive: false }),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'teacher' }),
      User.countDocuments({ role: 'principal' }),
      Course.countDocuments(),
      School.find({ isActive: true })
        .select('name code type board address stats')
        .limit(100)
        .lean(),
      User.find({ role: 'student' })
        .populate('schoolId', 'name code')
        .select('name email schoolId classId isActive')
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),
      User.find({ role: 'teacher' })
        .populate('schoolId', 'name code')
        .select('name email schoolId subjectSpecialization isActive')
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),
      School.aggregate([
        {
          $match: { isActive: true }
        },
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
            type: 1,
            board: 1,
            'address.city': 1,
            'address.state': 1,
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
        {
          $sort: { studentCount: -1 }
        },
        {
          $limit: 20
        }
      ]),
      // Top scorers by subject
      Mark.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'studentId',
            foreignField: '_id',
            as: 'student'
          }
        },
        {
          $lookup: {
            from: 'subjects',
            localField: 'subjectId',
            foreignField: '_id',
            as: 'subject'
          }
        },
        {
          $lookup: {
            from: 'schools',
            localField: 'schoolId',
            foreignField: '_id',
            as: 'school'
          }
        },
        {
          $unwind: '$student'
        },
        {
          $unwind: '$subject'
        },
        {
          $unwind: '$school'
        },
        {
          $sort: { marksScored: -1 }
        },
        {
          $group: {
            _id: '$subjectId',
            subjectName: { $first: '$subject.subjectName' },
            topScorer: {
              $first: {
                studentName: '$student.name',
                schoolName: '$school.name',
                marksScored: '$marksScored',
                totalMarks: '$totalMarks',
                percentage: '$percentage',
                grade: '$grade'
              }
            },
            averageScore: { $avg: '$marksScored' },
            totalStudents: { $sum: 1 }
          }
        },
        {
          $sort: { subjectName: 1 }
        },
        {
          $limit: 20
        }
      ]),
      // Recent marks
      Mark.find()
        .populate('studentId', 'name')
        .populate('subjectId', 'subjectName')
        .populate('schoolId', 'name')
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),
      // Subject performance overview
      Mark.aggregate([
        {
          $lookup: {
            from: 'subjects',
            localField: 'subjectId',
            foreignField: '_id',
            as: 'subject'
          }
        },
        {
          $unwind: '$subject'
        },
        {
          $group: {
            _id: '$subjectId',
            subjectName: { $first: '$subject.subjectName' },
            averageScore: { $avg: '$marksScored' },
            averagePercentage: { $avg: '$percentage' },
            totalExams: { $sum: 1 },
            highestScore: { $max: '$marksScored' },
            lowestScore: { $min: '$marksScored' }
          }
        },
        {
          $sort: { averagePercentage: -1 }
        }
      ])
    ])

    const context = {
      stats: {
        totalSchools,
        activeSchools,
        pendingSchools,
        totalStudents,
        totalTeachers,
        totalPrincipals,
        totalCourses
      },
      schools,
      recentStudents,
      recentTeachers,
      schoolStats,
      topScorersBySubject,
      recentMarks,
      subjectPerformance
    }

    // Cache the result
    chatbotCache.set(cacheKey, context)

    return context
  } catch (error) {
    console.error('Error fetching database context:', error)
    return null
  }
}

// Helper to extract school name from query
function extractSchoolName(message: string): string | null {
  const messageLower = message.toLowerCase()
  
  // Common patterns: "from [school name]", "at [school name]", "[school name] which/what"
  const patterns = [
    /from\s+([a-z\s]+?)\s+(?:school|high|university|college)/i,
    /at\s+([a-z\s]+?)\s+(?:school|high|university|college)/i,
    /in\s+([a-z\s]+?)\s+(?:school|high|university|college)/i,
    /([a-z\s]+?)\s+(?:school|high|university|college)\s+(?:which|what|who|show)/i
  ]
  
  for (const pattern of patterns) {
    const match = message.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }
  
  return null
}

// Helper to extract subject name from query
function extractSubjectName(message: string): string | null {
  const subjectMap: { [key: string]: string } = {
    'math': 'math',
    'maths': 'math',
    'mathematics': 'math',
    'science': 'science',
    'physics': 'physics',
    'chemistry': 'chemistry',
    'biology': 'biology',
    'english': 'english',
    'history': 'history',
    'geography': 'geography',
    'computer': 'computer',
    'it': 'computer'
  }
  
  const messageLower = message.toLowerCase()
  for (const [key, value] of Object.entries(subjectMap)) {
    if (messageLower.includes(key)) {
      return value
    }
  }
  
  return null
}

// Get school-specific performance data
async function getSchoolSpecificPerformance(schoolName: string, subjectName?: string) {
  try {
    // Find school by name (case-insensitive, partial match)
    const school = await School.findOne({
      name: { $regex: schoolName, $options: 'i' }
    }).lean()
    
    if (!school) {
      return null
    }
    
    // Build aggregation pipeline
    const matchStage: any = { schoolId: school._id }
    
    // If subject specified, find and filter by it
    if (subjectName) {
      const subject = await Subject.findOne({
        schoolId: school._id,
        subjectName: { $regex: subjectName, $options: 'i' }
      }).lean()
      
      if (subject) {
        matchStage.subjectId = subject._id
      }
    }
    
    const topScorers = await Mark.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'users',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student'
        }
      },
      {
        $lookup: {
          from: 'subjects',
          localField: 'subjectId',
          foreignField: '_id',
          as: 'subject'
        }
      },
      { $unwind: '$student' },
      { $unwind: '$subject' },
      { $sort: { marksScored: -1 } },
      {
        $group: {
          _id: '$subjectId',
          subjectName: { $first: '$subject.subjectName' },
          topScorer: {
            $first: {
              studentName: '$student.name',
              marksScored: '$marksScored',
              totalMarks: '$totalMarks',
              percentage: '$percentage',
              grade: '$grade'
            }
          },
          averageScore: { $avg: '$marksScored' },
          totalStudents: { $sum: 1 }
        }
      },
      { $sort: { subjectName: 1 } }
    ])
    
    return {
      school,
      topScorers
    }
  } catch (error) {
    console.error('Error fetching school-specific performance:', error)
    return null
  }
}

// Generate AI response with database context
async function generateSuperAdminResponse(
  userMessage: string,
  language: string,
  dbContext: any
): Promise<string> {
  const messageLower = userMessage.toLowerCase()

  // Analyze query intent
  const isAboutStudents = /student|learner|pupil|enrollment/i.test(messageLower)
  const isAboutSchools = /school|institution|college/i.test(messageLower)
  const isAboutTeachers = /teacher|instructor|faculty|staff/i.test(messageLower)
  const isAboutCourses = /course|class|subject|curriculum/i.test(messageLower)
  const isComparison = /compare|comparison|versus|vs|difference|top|best|worst|ranking/i.test(messageLower)
  const isStatistics = /how many|total|count|number of|statistics|stats|overview/i.test(messageLower)
  const isSpecificSchool = /school.*\d+|code|specific school/i.test(messageLower)
  const isPerformance = /performance|score|scorer|marks|grade|exam|result|best student|top student|rank/i.test(messageLower)
  const isSubjectSpecific = /math|science|english|history|geography|physics|chemistry|biology|subject/i.test(messageLower)

  // Build contextual response
  let response = ''

  try {
    // Check for school-specific performance queries first
    const schoolName = extractSchoolName(userMessage)
    const subjectName = extractSubjectName(userMessage)
    
    if (schoolName && isPerformance) {
      const schoolData = await getSchoolSpecificPerformance(schoolName, subjectName || undefined)
      
      if (schoolData && schoolData.topScorers.length > 0) {
        response += `🏫 **${schoolData.school.name}** Performance Data:\n\n`
        
        if (subjectName && schoolData.topScorers.length === 1) {
          // Specific subject query
          const scorer = schoolData.topScorers[0]
          response += `📖 **${scorer.subjectName}** - Top Scorer:\n\n`
          response += `🥇 **${scorer.topScorer.studentName}**\n`
          response += `   📊 Score: ${scorer.topScorer.marksScored}/${scorer.topScorer.totalMarks || 'N/A'}`
          response += ` (${scorer.topScorer.percentage?.toFixed(1) || 'N/A'}%)\n`
          response += `   🎓 Grade: ${scorer.topScorer.grade || 'N/A'}\n`
          response += `   📈 Class Average: ${scorer.averageScore?.toFixed(1)} marks\n`
          response += `   👥 Total Students: ${scorer.totalStudents}\n\n`
        } else {
          // Multiple subjects
          response += `🏆 **Top Scorers by Subject:**\n\n`
          schoolData.topScorers.forEach((scorer: any) => {
            response += `📖 **${scorer.subjectName}**\n`
            response += `   🥇 ${scorer.topScorer.studentName}: ${scorer.topScorer.marksScored}/${scorer.topScorer.totalMarks || 'N/A'}`
            response += ` (${scorer.topScorer.percentage?.toFixed(1) || 'N/A'}%) - Grade: ${scorer.topScorer.grade || 'N/A'}\n`
            response += `   📈 Average: ${scorer.averageScore?.toFixed(1)} | Students: ${scorer.totalStudents}\n\n`
          })
        }
        
        return response
      } else if (schoolData && schoolData.topScorers.length === 0) {
        response += `I found **${schoolData.school.name}**, but there are no exam records available`
        if (subjectName) {
          response += ` for ${subjectName}`
        }
        response += `. This could mean:\n\n`
        response += `• No exams have been conducted yet\n`
        response += `• Marks haven't been entered into the system\n`
        response += `• The subject name might be different in the database\n\n`
        response += `Please check with the school administrator or try asking about all subjects.`
        return response
      } else {
        response += `I couldn't find a school matching "${schoolName}". `
        response += `Please check the school name or try:\n\n`
        response += `• Using the full official name\n`
        response += `• Checking the list of registered schools\n`
        response += `• Asking "show all schools" to see available schools\n`
        return response
      }
    }
    
    // Statistics queries
    if (isStatistics && dbContext) {
      response += `📊 **Platform Statistics Overview:**\n\n`
      response += `🏫 **Schools:** ${dbContext.stats.totalSchools} total (${dbContext.stats.activeSchools} active, ${dbContext.stats.pendingSchools} pending)\n`
      response += `👨‍🎓 **Students:** ${dbContext.stats.totalStudents} across all schools\n`
      response += `👨‍🏫 **Teachers:** ${dbContext.stats.totalTeachers} teaching professionals\n`
      response += `👔 **Principals:** ${dbContext.stats.totalPrincipals} school administrators\n`
      response += `📚 **Courses:** ${dbContext.stats.totalCourses} available courses\n\n`
    }

    // Student-specific queries
    if (isAboutStudents && dbContext?.recentStudents) {
      response += `👨‍🎓 **Student Information:**\n\n`
      response += `Total Students: ${dbContext.stats.totalStudents}\n\n`
      
      if (isComparison && dbContext.schoolStats) {
        response += `**Top Schools by Student Count:**\n`
        dbContext.schoolStats.slice(0, 5).forEach((school: any, idx: number) => {
          response += `${idx + 1}. ${school.name} (${school.code}): ${school.studentCount} students, ${school.teacherCount} teachers\n`
          response += `   📍 ${school.address?.city || 'N/A'}, ${school.address?.state || 'N/A'}\n`
        })
        response += `\n`
      }

      response += `**Recent Student Registrations:**\n`
      dbContext.recentStudents.slice(0, 10).forEach((student: any) => {
        const schoolName = student.schoolId?.name || 'Unknown School'
        const schoolCode = student.schoolId?.code || 'N/A'
        response += `• ${student.name} - ${schoolName} (${schoolCode})\n`
        response += `  📧 ${student.email} | Status: ${student.isActive ? '✅ Active' : '❌ Inactive'}\n`
      })
      response += `\n`
    }

    // School-specific queries
    if (isAboutSchools && dbContext?.schools) {
      response += `🏫 **School Information:**\n\n`
      response += `Total Schools: ${dbContext.stats.totalSchools}\n\n`

      if (isComparison && dbContext.schoolStats) {
        response += `**School Comparison Analysis:**\n\n`
        dbContext.schoolStats.forEach((school: any, idx: number) => {
          response += `${idx + 1}. **${school.name}** (${school.code})\n`
          response += `   📍 Location: ${school.address?.city}, ${school.address?.state}\n`
          response += `   📋 Type: ${school.type} | Board: ${school.board || 'N/A'}\n`
          response += `   👥 Students: ${school.studentCount} | Teachers: ${school.teacherCount}\n`
          response += `   📊 Student-Teacher Ratio: ${school.teacherCount > 0 ? (school.studentCount / school.teacherCount).toFixed(1) : 'N/A'}:1\n\n`
        })
      } else {
        response += `**Active Schools:**\n`
        dbContext.schools.slice(0, 10).forEach((school: any) => {
          response += `• ${school.name} (${school.code})\n`
          response += `  📍 ${school.address?.city}, ${school.address?.state}\n`
          response += `  📋 ${school.type} - ${school.board || 'N/A'}\n`
        })
        response += `\n`
      }
    }

    // Teacher-specific queries
    if (isAboutTeachers && dbContext?.recentTeachers) {
      response += `👨‍🏫 **Teacher Information:**\n\n`
      response += `Total Teachers: ${dbContext.stats.totalTeachers}\n\n`

      response += `**Recent Teacher Additions:**\n`
      dbContext.recentTeachers.slice(0, 10).forEach((teacher: any) => {
        const schoolName = teacher.schoolId?.name || 'Unknown School'
        const schoolCode = teacher.schoolId?.code || 'N/A'
        response += `• ${teacher.name} - ${schoolName} (${schoolCode})\n`
        response += `  📧 ${teacher.email}\n`
        if (teacher.subjectSpecialization) {
          response += `  📚 Specialization: ${teacher.subjectSpecialization}\n`
        }
        response += `  Status: ${teacher.isActive ? '✅ Active' : '❌ Inactive'}\n`
      })
      response += `\n`
    }

    // Course queries
    if (isAboutCourses && dbContext) {
      response += `📚 **Course Information:**\n\n`
      response += `Total Courses: ${dbContext.stats.totalCourses}\n`
      response += `Courses are distributed across ${dbContext.stats.activeSchools} active schools.\n\n`
    }

    // Performance and exam queries
    if (isPerformance && dbContext) {
      response += `🏆 **Student Performance Data:**\n\n`

      // Top scorers by subject
      if (dbContext.topScorersBySubject && dbContext.topScorersBySubject.length > 0) {
        response += `**Top Scorers by Subject:**\n\n`
        
        // If asking about specific subject, filter for it
        let subjects = dbContext.topScorersBySubject
        if (isSubjectSpecific) {
          // Extract subject name from query
          const subjectMatch = messageLower.match(/math|maths|mathematics|science|english|history|geography|physics|chemistry|biology/)
          if (subjectMatch) {
            const searchTerm = subjectMatch[0]
            subjects = subjects.filter((s: any) => 
              s.subjectName?.toLowerCase().includes(searchTerm)
            )
          }
        }

        if (subjects.length > 0) {
          subjects.forEach((subject: any) => {
            const topScorer = subject.topScorer
            response += `📖 **${subject.subjectName}**\n`
            response += `   🥇 Top Scorer: **${topScorer.studentName}** from ${topScorer.schoolName}\n`
            response += `   📊 Score: ${topScorer.marksScored}/${topScorer.totalMarks || 'N/A'} (${topScorer.percentage?.toFixed(1) || 'N/A'}%) - Grade: ${topScorer.grade || 'N/A'}\n`
            response += `   📈 Class Average: ${subject.averageScore?.toFixed(1)} marks\n`
            response += `   👥 Total Students Assessed: ${subject.totalStudents}\n\n`
          })
        } else {
          response += `No performance data found for the specified subject.\n\n`
        }
      }

      // Subject performance overview
      if (dbContext.subjectPerformance && dbContext.subjectPerformance.length > 0) {
        response += `**Subject Performance Overview:**\n\n`
        dbContext.subjectPerformance.slice(0, 10).forEach((subject: any, idx: number) => {
          response += `${idx + 1}. ${subject.subjectName}: ${subject.averagePercentage?.toFixed(1)}% avg`
          response += ` (${subject.totalExams} exams, Highest: ${subject.highestScore}, Lowest: ${subject.lowestScore})\n`
        })
        response += `\n`
      }

      // Recent exam results
      if (dbContext.recentMarks && dbContext.recentMarks.length > 0) {
        response += `**Recent Exam Results:**\n`
        dbContext.recentMarks.slice(0, 10).forEach((mark: any) => {
          const studentName = mark.studentId?.name || 'Unknown Student'
          const subjectName = mark.subjectId?.subjectName || 'Unknown Subject'
          const schoolName = mark.schoolId?.name || 'Unknown School'
          response += `• ${studentName} - ${subjectName}: ${mark.marksScored}/${mark.totalMarks || 'N/A'}`
          response += ` (${mark.percentage?.toFixed(1) || 'N/A'}%) - ${mark.grade || 'N/A'}\n`
          response += `  🏫 ${schoolName}\n`
        })
        response += `\n`
      }
    }

    // If no specific data matched, use AI to generate response
    if (!response) {
      response = await generateAIResponse(userMessage, language, dbContext)
    } else {
      // Add AI-generated insights at the end
      response += `\n💡 **Insights:** `
      response += await generateAIInsights(userMessage, dbContext)
    }

    return response
  } catch (error) {
    console.error('Error generating response:', error)
    return generateFallbackResponse(userMessage, dbContext)
  }
}

// Generate AI response using Gemini or Cohere
async function generateAIResponse(userMessage: string, language: string, dbContext: any): Promise<string> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY

  if (!GEMINI_API_KEY) {
    return generateFallbackResponse(userMessage, dbContext)
  }

  try {
    const contextSummary = dbContext ? `
Platform Statistics:
- Total Schools: ${dbContext.stats.totalSchools} (${dbContext.stats.activeSchools} active)
- Total Students: ${dbContext.stats.totalStudents}
- Total Teachers: ${dbContext.stats.totalTeachers}
- Total Courses: ${dbContext.stats.totalCourses}

Top Schools by Student Count:
${dbContext.schoolStats?.slice(0, 5).map((s: any, i: number) => 
  `${i + 1}. ${s.name} (${s.code}): ${s.studentCount} students, ${s.teacherCount} teachers`
).join('\n')}

Top Scorers by Subject:
${dbContext.topScorersBySubject?.slice(0, 10).map((s: any) => 
  `• ${s.subjectName}: ${s.topScorer?.studentName} from ${s.topScorer?.schoolName} - ${s.topScorer?.marksScored}/${s.topScorer?.totalMarks} (${s.topScorer?.percentage?.toFixed(1)}%) Grade: ${s.topScorer?.grade}`
).join('\n') || 'No performance data available'}

Subject Performance Overview:
${dbContext.subjectPerformance?.slice(0, 10).map((s: any) => 
  `• ${s.subjectName}: Avg ${s.averagePercentage?.toFixed(1)}% (${s.totalExams} exams, Best: ${s.highestScore}, Worst: ${s.lowestScore})`
).join('\n') || 'No subject data available'}

Recent Student Names for Reference:
${dbContext.recentStudents?.slice(0, 10).map((st: any) => 
  `• ${st.name} - ${st.schoolId?.name || 'Unknown School'}`
).join('\n') || 'No student data'}
` : ''

    const systemPrompt = `You are an AI assistant for EduBridge platform super administrators. You help analyze and monitor the educational platform data.

Current Platform Data:
${contextSummary}

Your role:
- Provide data-driven insights and analytics about students, schools, teachers, and academic performance
- Answer questions about student performance, exam scores, top scorers, and subject-wise rankings
- Compare schools, students, teachers, and performance metrics across subjects
- Identify top performing students by subject with their names, schools, and scores
- Analyze subject performance trends and averages
- Answer questions about platform statistics and enrollment
- Identify trends, patterns, and areas needing improvement
- Suggest improvements based on data
- Always include specific numbers, school names, student names, and performance data when relevant
- For questions about "top scorer" or "best student", refer to the Top Scorers by Subject data provided

Language: ${language}
Be professional, analytical, and provide actionable insights with specific data points.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: systemPrompt }]
            },
            {
              role: 'user',
              parts: [{ text: userMessage }]
            }
          ],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 800,
            topP: 0.9,
            topK: 40
          }
        })
      }
    )

    if (response.ok) {
      const data = await response.json()
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (generatedText) {
        return generatedText
      }
    }
  } catch (error) {
    console.error('AI Generation Error:', error)
  }

  return generateFallbackResponse(userMessage, dbContext)
}

// Generate AI insights
async function generateAIInsights(userMessage: string, dbContext: any): Promise<string> {
  if (!dbContext) return 'Unable to generate insights without data context.'

  const avgStudentsPerSchool = dbContext.stats.totalStudents / (dbContext.stats.activeSchools || 1)
  const avgTeachersPerSchool = dbContext.stats.totalTeachers / (dbContext.stats.activeSchools || 1)
  const studentTeacherRatio = dbContext.stats.totalStudents / (dbContext.stats.totalTeachers || 1)

  let insights = ''
  
  insights += `The platform has an average of ${avgStudentsPerSchool.toFixed(0)} students per school and ${avgTeachersPerSchool.toFixed(0)} teachers per school. `
  insights += `The overall student-teacher ratio is ${studentTeacherRatio.toFixed(1)}:1. `

  if (studentTeacherRatio > 30) {
    insights += `⚠️ The student-teacher ratio is high, consider encouraging schools to hire more teachers. `
  } else if (studentTeacherRatio < 15) {
    insights += `✅ The student-teacher ratio is excellent, indicating good resource allocation. `
  }

  return insights
}

// Fallback response
function generateFallbackResponse(userMessage: string, dbContext: any): string {
  if (!dbContext) {
    return 'I apologize, but I am unable to access the database context at the moment. Please try again.'
  }

  return `Based on the current platform data:
  
📊 Platform Overview:
- ${dbContext.stats.totalSchools} schools (${dbContext.stats.activeSchools} active)
- ${dbContext.stats.totalStudents} students enrolled
- ${dbContext.stats.totalTeachers} teachers
- ${dbContext.stats.totalPrincipals} principals
- ${dbContext.stats.totalCourses} courses available

Please rephrase your question or ask about:
- Student statistics and comparisons
- School performance metrics
- Teacher allocation
- Course distribution
- Platform trends and insights`
}
