import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import Class from "@/lib/models/Class";

// POST: Assign a teacher to a class
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "principal") {
      return NextResponse.json(
        { error: "Unauthorized - Principal access only" },
        { status: 403 }
      );
    }

    const { teacherId, classId } = await request.json();

    if (!teacherId || !classId) {
      return NextResponse.json(
        { error: "Teacher ID and Class ID are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get principal's school
    const principal = await User.findById(session.user.id);
    if (!principal || !principal.school) {
      return NextResponse.json(
        { error: "Principal school not found" },
        { status: 404 }
      );
    }

    // Verify teacher belongs to principal's school
    const teacher = await User.findOne({ 
      _id: teacherId, 
      school: principal.school,
      role: "teacher" 
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "Teacher not found in your school" },
        { status: 404 }
      );
    }

    // Verify class belongs to principal's school
    const classDoc = await Class.findOne({ 
      _id: classId, 
      school: principal.school 
    });

    if (!classDoc) {
      return NextResponse.json(
        { error: "Class not found in your school" },
        { status: 404 }
      );
    }

    // Check if teacher is already assigned
    if (teacher.assignedClasses?.includes(classId)) {
      return NextResponse.json(
        { error: "Teacher is already assigned to this class" },
        { status: 400 }
      );
    }

    // Add class to teacher's assignedClasses
    await User.findByIdAndUpdate(teacherId, {
      $addToSet: { assignedClasses: classId }
    });

    return NextResponse.json({
      success: true,
      message: "Teacher assigned to class successfully"
    });

  } catch (error) {
    console.error("Error assigning teacher:", error);
    return NextResponse.json(
      { error: "Failed to assign teacher" },
      { status: 500 }
    );
  }
}

// DELETE: Unassign a teacher from a class
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "principal") {
      return NextResponse.json(
        { error: "Unauthorized - Principal access only" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get("teacherId");
    const classId = searchParams.get("classId");

    if (!teacherId || !classId) {
      return NextResponse.json(
        { error: "Teacher ID and Class ID are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get principal's school
    const principal = await User.findById(session.user.id);
    if (!principal || !principal.school) {
      return NextResponse.json(
        { error: "Principal school not found" },
        { status: 404 }
      );
    }

    // Verify teacher belongs to principal's school
    const teacher = await User.findOne({ 
      _id: teacherId, 
      school: principal.school,
      role: "teacher" 
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "Teacher not found in your school" },
        { status: 404 }
      );
    }

    // Remove class from teacher's assignedClasses
    await User.findByIdAndUpdate(teacherId, {
      $pull: { assignedClasses: classId }
    });

    return NextResponse.json({
      success: true,
      message: "Teacher unassigned from class successfully"
    });

  } catch (error) {
    console.error("Error unassigning teacher:", error);
    return NextResponse.json(
      { error: "Failed to unassign teacher" },
      { status: 500 }
    );
  }
}
