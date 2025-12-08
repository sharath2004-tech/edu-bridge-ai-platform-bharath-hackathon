import { getSession } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

const COHERE_API_KEY = process.env.COHERE_API_KEY

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'teacher') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { subject, topic, difficulty, numQuestions, questionTypes, duration } = await request.json()

    const prompt = `Generate a comprehensive question paper for ${subject} on the topic "${topic}".

Requirements:
- Difficulty: ${difficulty}
- Number of questions: ${numQuestions}
- Question types: ${questionTypes.join(', ')}
- Duration: ${duration} minutes

Generate questions in the following format (as JSON):
{
  "questions": [
    {
      "type": "mcq|short|long|truefalse",
      "question": "question text",
      "options": ["A", "B", "C", "D"] (for MCQ only),
      "marks": number,
      "answer": "correct answer" (for answer key)
    }
  ],
  "totalMarks": total_marks_number
}

Make questions practical, application-based, and aligned with Bloom's taxonomy for ${difficulty} level.`

    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'command-r-plus-08-2024',
        message: prompt,
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    const data = await response.json()
    
    let paper
    try {
      const jsonMatch = data.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        paper = JSON.parse(jsonMatch[0])
      } else {
        // Fallback if JSON parsing fails
        paper = {
          questions: generateFallbackQuestions(numQuestions, questionTypes),
          totalMarks: numQuestions * 5
        }
      }
    } catch {
      paper = {
        questions: generateFallbackQuestions(numQuestions, questionTypes),
        totalMarks: numQuestions * 5
      }
    }

    return NextResponse.json({ success: true, paper }, { status: 200 })
  } catch (error: any) {
    console.error('Error generating question paper:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

function generateFallbackQuestions(num: number, types: string[]) {
  const questions = []
  for (let i = 0; i < num; i++) {
    const type = types[i % types.length]
    questions.push({
      type,
      question: `Question ${i + 1} - ${type === 'mcq' ? 'Multiple Choice' : type === 'short' ? 'Short Answer' : 'Long Answer'}`,
      options: type === 'mcq' ? ['Option A', 'Option B', 'Option C', 'Option D'] : undefined,
      marks: type === 'long' ? 10 : type === 'short' ? 5 : 2,
      answer: type === 'mcq' ? 'A' : 'Answer text'
    })
  }
  return questions
}
