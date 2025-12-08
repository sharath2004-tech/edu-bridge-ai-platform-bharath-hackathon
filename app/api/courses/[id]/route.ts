import { Course } from '@/lib/models';
import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

// GET course by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB();

    const course = await Course.findById(id)
      .populate('instructor', 'name email avatar bio')
      .populate('enrolledStudents', 'name email avatar')
      .populate('reviews.user', 'name avatar');

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          error: 'Course not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: course,
    });
  } catch (error: any) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch course',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT update course by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB();

    const body = await request.json();

    const course = await Course.findByIdAndUpdate(
      id,
      { $set: body },
      {
        new: true,
        runValidators: true,
      }
    ).populate('instructor', 'name email avatar');

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          error: 'Course not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: course,
    });
  } catch (error: any) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update course',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE course by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB();

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          error: 'Course not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {},
      message: 'Course deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete course',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
