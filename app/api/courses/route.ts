import { getSession } from '@/lib/auth';
import { Course } from '@/lib/models';
import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

// GET all courses
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const status = searchParams.get('status');
    const instructor = searchParams.get('instructor');

    const query: any = {};
    
    // Filter by school for non-super-admin users
    if (session && session.schoolId && session.role !== 'super-admin') {
      query.schoolId = session.schoolId;
    }
    
    // Default to published for students, unless status is specified
    if (status) {
      query.status = status;
    } else if (!instructor) {
      query.status = 'published';
    }
    
    if (category) query.category = category;
    if (level) query.level = level;
    if (instructor) query.instructor = instructor;

    const courses = await Course.find(query)
      .populate('instructor', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({
      success: true,
      count: courses.length,
      courses: courses,
      data: courses,
    });
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch courses',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// POST create a new course
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      title,
      description,
      instructor,
      category,
      level,
      price,
      duration,
      lessons,
      status,
    } = body;

    // Validate required fields
    if (!title || !description || !category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide all required fields',
        },
        { status: 400 }
      );
    }

    // Create course
    const course = await Course.create({
      title,
      description,
      instructor: instructor || body.instructorId,
      category,
      level: level || 'beginner',
      price: price || 0,
      duration: duration || 0,
      lessons: lessons || [],
      quizzes: [],
      enrolledStudents: [],
      status: status || 'draft',
      rating: 0,
      reviews: [],
      tags: body.tags || [],
    });

    const populatedCourse = await Course.findById(course._id).populate(
      'instructor',
      'name email avatar'
    );

    return NextResponse.json(
      {
        success: true,
        data: populatedCourse,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create course',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
