import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

// Test MongoDB connection
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful!',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('MongoDB connection test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'MongoDB connection failed',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
