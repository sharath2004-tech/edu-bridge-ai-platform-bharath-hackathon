import { CohereClient } from 'cohere-ai';
import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

async function analyzeWithCohere(query: string, schoolData: any) {
  const response = await cohere.chat({
    model: 'command-r-plus',
    message: query,
    preamble: `You are an educational data analyst AI. Analyze school performance data and provide detailed insights.

School Performance Data:
${JSON.stringify(schoolData, null, 2)}

Provide insights about:
- Which schools are performing better and why
- Overall performance percentages
- Trends and patterns in the data
- Specific recommendations for improvement
- Comparative analysis between schools

Be specific with numbers and percentages from the data.`,
  });

  return response.text;
}

async function analyzeWithGroq(query: string, schoolData: any) {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are an educational data analyst AI. Here is the school performance data:

${JSON.stringify(schoolData, null, 2)}

Analyze this data and provide detailed insights about school performance, percentages, trends, and recommendations.`,
      },
      {
        role: 'user',
        content: query,
      },
    ],
    temperature: 0.3,
    max_tokens: 2048,
  });

  return response.choices[0]?.message?.content || 'No response generated';
}

export async function POST(req: NextRequest) {
  try {
    const { query, schoolData } = await req.json();

    if (!query || !schoolData) {
      return NextResponse.json(
        { error: 'Missing query or school data' },
        { status: 400 }
      );
    }

    let answer: string;
    let provider: string;

    // Try Cohere first
    try {
      console.log('🤖 Attempting analysis with Cohere...');
      answer = await analyzeWithCohere(query, schoolData);
      provider = 'cohere';
      console.log('✅ Cohere analysis successful');
    } catch (cohereError) {
      console.warn('⚠️ Cohere failed, falling back to Groq:', cohereError);
      
      // Fallback to Groq
      try {
        console.log('🤖 Attempting analysis with Groq...');
        answer = await analyzeWithGroq(query, schoolData);
        provider = 'groq';
        console.log('✅ Groq analysis successful');
      } catch (groqError) {
        console.error('❌ Groq also failed:', groqError);
        throw new Error('Both AI providers failed');
      }
    }

    return NextResponse.json({
      answer,
      provider,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'operational',
    providers: {
      cohere: !!process.env.COHERE_API_KEY,
      groq: !!process.env.GROQ_API_KEY,
    },
  });
}
