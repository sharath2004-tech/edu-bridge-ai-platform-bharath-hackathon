import School from '@/lib/models/School';
import User from '@/lib/models/User';
import connectDB from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

const CLASSES = [
  '6th Grade',
  '7th Grade',
  '8th Grade',
  '9th Grade',
  '10th Grade',
  '11th Science', '11th Commerce', '11th Arts',
  '12th Science', '12th Commerce', '12th Arts',
];

const SECTIONS = ['A', 'B', 'C', 'D', 'E'];

const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'English', 'Hindi', 'Computer Science', 'History',
  'Geography', 'Economics', 'Physical Education', 'Arts'
];

const FIRST_NAMES = [
  'Aarav', 'Aditi', 'Arjun', 'Ananya', 'Aryan', 'Aarohi', 'Ayush', 'Aisha',
  'Dev', 'Diya', 'Ishaan', 'Isha', 'Kabir', 'Kavya', 'Karan', 'Kiara',
  'Laksh', 'Lavanya', 'Mihir', 'Meera', 'Neel', 'Naina', 'Om', 'Priya',
  'Raj', 'Riya', 'Rohan', 'Rhea', 'Sai', 'Saanvi', 'Shiv', 'Shreya',
  'Tanay', 'Tara', 'Uday', 'Uma', 'Veer', 'Vani', 'Yash', 'Zara',
  'Aditya', 'Anvi', 'Advait', 'Ahana', 'Arnav', 'Avni', 'Dhruv', 'Divya'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Kumar', 'Singh', 'Patel', 'Gupta', 'Reddy', 'Nair',
  'Mehta', 'Shah', 'Joshi', 'Rao', 'Iyer', 'Menon', 'Pillai', 'Kapoor',
  'Malhotra', 'Agarwal', 'Bansal', 'Chopra', 'Desai', 'Gandhi', 'Jain', 'Khan',
  'Das', 'Ghosh', 'Bose', 'Dutta', 'Saxena', 'Mishra', 'Pandey', 'Tiwari'
];

function generateName() {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${firstName} ${lastName}`;
}

function generateEmail(name: string, role: string, index: number) {
  const cleanName = name.toLowerCase().replace(/\s+/g, '');
  return `${cleanName}.${role}${index}@edubridge.school`;
}

function generatePhone() {
  return `+91${Math.floor(Math.random() * 9000000000 + 1000000000)}`;
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const { schoolId, clearExisting } = await request.json();

    if (!schoolId) {
      return NextResponse.json(
        { error: 'School ID is required' },
        { status: 400 }
      );
    }

    // Verify school exists
    const school = await School.findById(schoolId);
    if (!school) {
      return NextResponse.json(
        { error: 'School not found' },
        { status: 404 }
      );
    }

    // Clear existing users for this school if requested
    if (clearExisting) {
      await User.deleteMany({
        schoolId,
        role: { $in: ['teacher', 'student'] }
      });
    }

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create 20 teachers
    const teachers = [];
    for (let i = 1; i <= 20; i++) {
      const name = generateName();
      const email = generateEmail(name, 'teacher', i);
      
      // Assign 2-4 random classes to each teacher
      const numClasses = Math.floor(Math.random() * 3) + 2;
      const assignedClasses = [];
      for (let j = 0; j < numClasses; j++) {
        const randomClass = CLASSES[Math.floor(Math.random() * CLASSES.length)];
        if (!assignedClasses.includes(randomClass)) {
          assignedClasses.push(randomClass);
        }
      }

      // Assign 2-3 random subjects
      const numSubjects = Math.floor(Math.random() * 2) + 2;
      const assignedSubjects = [];
      for (let j = 0; j < numSubjects; j++) {
        const randomSubject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
        if (!assignedSubjects.includes(randomSubject)) {
          assignedSubjects.push(randomSubject);
        }
      }

      const teacher = {
        name,
        email,
        password: hashedPassword,
        phone: generatePhone(),
        role: 'teacher',
        schoolId,
        assignedClasses,
        assignedSubjects,
        bio: `Experienced ${assignedSubjects.join(' and ')} teacher with passion for education.`,
        isActive: true,
      };

      teachers.push(teacher);
    }

    const createdTeachers = await User.insertMany(teachers);

    // Create 100 students
    const students = [];
    let rollNumber = 1;

    for (let i = 1; i <= 100; i++) {
      const name = generateName();
      const email = generateEmail(name, 'student', i);
      const className = CLASSES[Math.floor(Math.random() * CLASSES.length)];
      const section = SECTIONS[Math.floor(Math.random() * SECTIONS.length)];

      const student = {
        name,
        email,
        password: hashedPassword,
        phone: generatePhone(),
        role: 'student',
        schoolId,
        className,
        section,
        rollNumber: rollNumber++,
        bio: `Student at ${school.name}`,
        isActive: true,
        enrolledCourses: [],
        progress: [],
      };

      students.push(student);
    }

    const createdStudents = await User.insertMany(students);

    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdTeachers.length} teachers and ${createdStudents.length} students for ${school.name}`,
      data: {
        school: {
          id: school._id,
          name: school.name,
          code: school.code,
        },
        teachers: {
          count: createdTeachers.length,
          sample: createdTeachers.slice(0, 5).map(t => ({
            id: t._id,
            name: t.name,
            email: t.email,
            classes: t.assignedClasses,
            subjects: t.assignedSubjects,
          })),
        },
        students: {
          count: createdStudents.length,
          sample: createdStudents.slice(0, 5).map(s => ({
            id: s._id,
            name: s.name,
            email: s.email,
            className: s.className,
            rollNumber: s.rollNumber,
          })),
        },
        credentials: {
          teachers: 'All teachers can login with their email and password: password123',
          students: 'All students can login with their email and password: password123',
        },
      },
    });

  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed data', details: error.message },
      { status: 500 }
    );
  }
}
