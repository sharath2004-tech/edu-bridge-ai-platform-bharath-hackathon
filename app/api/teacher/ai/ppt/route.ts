import { NextRequest, NextResponse } from 'next/server'

interface Slide {
  title: string
  content: string[]
  notes?: string
}

async function generatePPTWithCohere(topic: string, audience: string, numSlides: number, style: string, keyPoints: string): Promise<Slide[]> {
  try {
    const COHERE_API_KEY = process.env.COHERE_API_KEY
    
    if (!COHERE_API_KEY) {
      console.error('COHERE_API_KEY not configured')
      return generateFallbackSlides(topic, numSlides)
    }

    const keyPointsList = keyPoints ? keyPoints.split('\n').filter(p => p.trim()) : []
    const keyPointsText = keyPointsList.length > 0 ? `\n\nKey points to include:\n${keyPointsList.map(p => `- ${p}`).join('\n')}` : ''

    const prompt = `Create a ${numSlides}-slide presentation about "${topic}" for ${audience}.
Style: ${style}${keyPointsText}

Generate a JSON array with exactly ${numSlides} slides. Each slide should have:
- title: (string) Catchy slide title
- content: (array of 3-5 strings) Bullet points with key information
- notes: (string) Brief speaker notes

Example format:
[
  {
    "title": "Introduction to ${topic}",
    "content": [
      "First key point",
      "Second key point",
      "Third key point"
    ],
    "notes": "Start with an engaging question"
  }
]

Return ONLY the JSON array, no additional text.`

    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: prompt,
        model: 'command-r-plus-08-2024',
        temperature: 0.8,
        max_tokens: 3000,
      }),
    })

    if (!response.ok) {
      console.error('Cohere API error:', response.status, await response.text())
      return generateFallbackSlides(topic, numSlides)
    }

    const data = await response.json()
    const text = data.text || ''
    
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const slides = JSON.parse(jsonMatch[0])
      return slides.slice(0, numSlides)
    }
    
    return generateFallbackSlides(topic, numSlides)
  } catch (error) {
    console.error('Error generating PPT with Cohere:', error)
    return generateFallbackSlides(topic, numSlides)
  }
}

function generateFallbackSlides(topic: string, numSlides: number): Slide[] {
  const slides: Slide[] = [
    {
      title: `${topic}`,
      content: [
        'Overview of the topic',
        'Key concepts and definitions',
        'Learning objectives'
      ],
      notes: 'Start with a warm welcome and topic introduction'
    },
    {
      title: 'Background & Context',
      content: [
        'Historical background',
        'Why this topic matters',
        'Real-world applications'
      ],
      notes: 'Provide context to engage the audience'
    },
    {
      title: 'Key Concepts',
      content: [
        'Fundamental principles',
        'Core ideas explained',
        'Important terminology'
      ],
      notes: 'Break down complex ideas into simple terms'
    },
    {
      title: 'Detailed Explanation',
      content: [
        'In-depth analysis',
        'Examples and case studies',
        'Step-by-step process'
      ],
      notes: 'Use visual aids and examples'
    },
    {
      title: 'Practical Applications',
      content: [
        'How to apply this knowledge',
        'Common use cases',
        'Industry examples'
      ],
      notes: 'Show real-world relevance'
    },
    {
      title: 'Benefits & Impact',
      content: [
        'Advantages of understanding this topic',
        'Impact on related fields',
        'Future implications'
      ],
      notes: 'Emphasize the value of learning'
    },
    {
      title: 'Challenges & Solutions',
      content: [
        'Common difficulties',
        'Misconceptions to avoid',
        'Best practices'
      ],
      notes: 'Address potential obstacles'
    },
    {
      title: 'Advanced Topics',
      content: [
        'Going deeper into the subject',
        'Related advanced concepts',
        'Further learning resources'
      ],
      notes: 'For those wanting to explore more'
    },
    {
      title: 'Summary',
      content: [
        'Recap of key points',
        'Main takeaways',
        'What we learned today'
      ],
      notes: 'Reinforce the main concepts'
    },
    {
      title: 'Questions & Next Steps',
      content: [
        'Q&A session',
        'Additional resources',
        'How to continue learning'
      ],
      notes: 'Engage with audience and provide guidance'
    }
  ]

  return slides.slice(0, numSlides)
}

export async function POST(request: NextRequest) {
  try {
    const { topic, audience, numSlides, style, keyPoints } = await request.json()

    if (!topic) {
      return NextResponse.json(
        { success: false, error: 'Topic is required' },
        { status: 400 }
      )
    }

    const slides = await generatePPTWithCohere(
      topic,
      audience || 'students',
      numSlides || 10,
      style || 'educational',
      keyPoints || ''
    )

    return NextResponse.json({
      success: true,
      slides
    })
  } catch (error: any) {
    console.error('Error generating PPT:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate presentation', message: error.message },
      { status: 500 }
    )
  }
}
