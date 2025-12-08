module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/mongoose [external] (mongoose, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
}),
"[project]/lib/models/School.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const SchoolSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    name: {
        type: String,
        required: [
            true,
            'School name is required'
        ],
        trim: true,
        maxlength: [
            200,
            'School name cannot exceed 200 characters'
        ]
    },
    code: {
        type: String,
        required: [
            true,
            'School code is required'
        ],
        unique: true,
        uppercase: true,
        trim: true,
        match: [
            /^[A-Z0-9]{4,10}$/,
            'School code must be 4-10 alphanumeric characters'
        ]
    },
    email: {
        type: String,
        required: [
            true,
            'School email is required'
        ],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        street: String,
        city: {
            type: String,
            required: [
                true,
                'City is required'
            ]
        },
        state: {
            type: String,
            required: [
                true,
                'State is required'
            ]
        },
        country: {
            type: String,
            required: [
                true,
                'Country is required'
            ],
            default: 'India'
        },
        zipCode: String
    },
    principal: {
        name: String,
        email: String,
        phone: String
    },
    logo: {
        type: String,
        default: ''
    },
    website: {
        type: String,
        trim: true
    },
    established: {
        type: Date
    },
    type: {
        type: String,
        enum: [
            'primary',
            'secondary',
            'higher-secondary',
            'university',
            'institute'
        ],
        default: 'secondary',
        required: true
    },
    board: {
        type: String,
        default: 'CBSE'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    subscription: {
        plan: {
            type: String,
            enum: [
                'free',
                'basic',
                'premium',
                'enterprise'
            ],
            default: 'free'
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: Date,
        maxStudents: {
            type: Number,
            default: 100
        },
        maxTeachers: {
            type: Number,
            default: 10
        }
    },
    stats: {
        totalStudents: {
            type: Number,
            default: 0
        },
        totalTeachers: {
            type: Number,
            default: 0
        },
        totalCourses: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});
// Indexes for better query performance
// Note: code and email already have indexes from schema definitions
SchoolSchema.index({
    isActive: 1
});
SchoolSchema.index({
    'subscription.plan': 1
});
const School = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.School || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('School', SchoolSchema);
const __TURBOPACK__default__export__ = School;
}),
"[project]/lib/models/User.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const UserSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    name: {
        type: String,
        required: [
            true,
            'Please provide a name'
        ],
        trim: true,
        maxlength: [
            100,
            'Name cannot be more than 100 characters'
        ]
    },
    email: {
        type: String,
        required: [
            true,
            'Please provide an email'
        ],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [
            true,
            'Please provide a password'
        ],
        minlength: [
            6,
            'Password must be at least 6 characters'
        ],
        select: false
    },
    role: {
        type: String,
        enum: [
            'super-admin',
            'principal',
            'teacher',
            'student'
        ],
        default: 'student',
        required: true
    },
    schoolId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'School'
    },
    avatar: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        maxlength: [
            500,
            'Bio cannot be more than 500 characters'
        ]
    },
    phone: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // Teacher-specific fields
    subjectSpecialization: {
        type: String,
        trim: true
    },
    teacherRole: {
        type: String,
        enum: [
            'Teacher',
            'HOD',
            'Vice Principal'
        ]
    },
    assignedClasses: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
            ref: 'Class'
        }
    ],
    assignedSubjects: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
            ref: 'Subject'
        }
    ],
    // Student-specific fields
    classId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'Class',
        index: true
    },
    rollNo: {
        type: Number,
        min: 1
    },
    parentName: {
        type: String,
        trim: true
    },
    parentPhone: {
        type: String,
        trim: true
    },
    // Legacy fields (backward compatibility)
    className: {
        type: String,
        trim: true
    },
    section: {
        type: String,
        trim: true
    },
    rollNumber: {
        type: String,
        trim: true
    },
    enrolledCourses: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
            ref: 'Course'
        }
    ],
    createdCourses: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
            ref: 'Course'
        }
    ],
    progress: [
        {
            courseId: {
                type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
                ref: 'Course'
            },
            completedLessons: {
                type: Number,
                default: 0
            },
            totalLessons: {
                type: Number,
                default: 0
            },
            lastAccessed: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timestamps: true
});
// Indexes for better query performance
UserSchema.index({
    role: 1
});
UserSchema.index({
    schoolId: 1,
    role: 1
});
// email already has unique index from schema definition
const User = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.User || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('User', UserSchema);
const __TURBOPACK__default__export__ = User;
}),
"[project]/lib/models/Class.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const ClassSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    schoolId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'School',
        required: [
            true,
            'School ID is required'
        ],
        index: true
    },
    className: {
        type: String,
        required: [
            true,
            'Class name is required'
        ],
        trim: true
    },
    section: {
        type: String,
        required: [
            true,
            'Section is required'
        ],
        trim: true,
        uppercase: true
    },
    classTeacherId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'User',
        index: true
    },
    academicYear: {
        type: String,
        trim: true
    },
    strength: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});
// Compound index to ensure unique class-section per school
ClassSchema.index({
    schoolId: 1,
    className: 1,
    section: 1
}, {
    unique: true
});
// Index for querying by class teacher
ClassSchema.index({
    classTeacherId: 1
});
const Class = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Class || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Class', ClassSchema);
const __TURBOPACK__default__export__ = Class;
}),
"[project]/lib/models/Subject.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const SubjectSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    schoolId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'School',
        required: [
            true,
            'School ID is required'
        ],
        index: true
    },
    classId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'Class',
        required: [
            true,
            'Class ID is required'
        ],
        index: true
    },
    subjectName: {
        type: String,
        required: [
            true,
            'Subject name is required'
        ],
        trim: true
    },
    subjectCode: {
        type: String,
        trim: true,
        uppercase: true
    },
    teacherId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'User',
        index: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    totalLessons: {
        type: Number,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
// Compound index to ensure unique subject per class in a school
SubjectSchema.index({
    schoolId: 1,
    classId: 1,
    subjectName: 1
}, {
    unique: true
});
// Index for querying by teacher
SubjectSchema.index({
    teacherId: 1
});
const Subject = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Subject || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Subject', SubjectSchema);
const __TURBOPACK__default__export__ = Subject;
}),
"[project]/lib/models/Attendance.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const AttendanceSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    studentId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'User',
        required: [
            true,
            'Student ID is required'
        ],
        index: true
    },
    schoolId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'School',
        required: [
            true,
            'School ID is required'
        ],
        index: true
    },
    className: {
        type: String,
        required: [
            true,
            'Class name is required'
        ],
        trim: true,
        index: true
    },
    section: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        required: [
            true,
            'Date is required'
        ],
        index: true
    },
    status: {
        type: String,
        enum: [
            'Present',
            'Absent',
            'Late',
            'present',
            'absent',
            'late',
            'excused'
        ],
        required: [
            true,
            'Status is required'
        ],
        default: 'Present'
    },
    markedBy: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'User'
    },
    notes: {
        type: String,
        trim: true,
        maxlength: 500
    }
}, {
    timestamps: true
});
// Compound indexes for efficient queries
AttendanceSchema.index({
    schoolId: 1,
    date: -1
});
AttendanceSchema.index({
    studentId: 1,
    date: -1
});
AttendanceSchema.index({
    schoolId: 1,
    className: 1,
    date: -1
});
// Ensure one attendance record per student per day
AttendanceSchema.index({
    studentId: 1,
    date: 1
}, {
    unique: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Attendance || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Attendance', AttendanceSchema);
}),
"[project]/lib/models/Exam.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const ExamSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    schoolId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'School',
        required: [
            true,
            'School ID is required'
        ],
        index: true
    },
    classId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'Class',
        required: [
            true,
            'Class ID is required'
        ],
        index: true
    },
    examName: {
        type: String,
        required: [
            true,
            'Exam name is required'
        ],
        trim: true
    },
    examType: {
        type: String,
        enum: [
            'unit-test',
            'mid-term',
            'final',
            'quarterly',
            'half-yearly',
            'annual',
            'other'
        ],
        default: 'unit-test'
    },
    date: {
        type: Date,
        required: [
            true,
            'Exam date is required'
        ],
        index: true
    },
    term: {
        type: String,
        trim: true
    },
    academicYear: {
        type: String,
        trim: true
    },
    totalMarks: {
        type: Number,
        min: 0
    },
    duration: {
        type: Number,
        min: 0
    },
    subjects: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
            ref: 'Subject'
        }
    ],
    instructions: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
// Index for querying exams by school and class
ExamSchema.index({
    schoolId: 1,
    classId: 1,
    date: -1
});
// Index for querying by date
ExamSchema.index({
    date: 1
});
const Exam = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Exam || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Exam', ExamSchema);
const __TURBOPACK__default__export__ = Exam;
}),
"[project]/lib/models/Mark.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const MarkSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    studentId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'User',
        required: [
            true,
            'Student ID is required'
        ],
        index: true
    },
    schoolId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'School',
        required: [
            true,
            'School ID is required'
        ],
        index: true
    },
    examId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'Exam',
        required: [
            true,
            'Exam ID is required'
        ],
        index: true
    },
    subjectId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'Subject',
        required: [
            true,
            'Subject ID is required'
        ],
        index: true
    },
    marksScored: {
        type: Number,
        required: [
            true,
            'Marks scored is required'
        ],
        min: 0
    },
    totalMarks: {
        type: Number,
        min: 1
    },
    percentage: {
        type: Number,
        min: 0,
        max: 100
    },
    grade: {
        type: String,
        trim: true
    },
    remarks: {
        type: String,
        required: [
            true,
            'Term is required'
        ],
        trim: true,
        index: true
    },
    remarks: {
        type: String,
        trim: true,
        maxlength: 500
    },
    markedBy: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});
// Compound indexes for efficient queries
MarkSchema.index({
    schoolId: 1,
    examId: 1
});
MarkSchema.index({
    studentId: 1,
    examId: 1,
    subjectId: 1
}, {
    unique: true
});
MarkSchema.index({
    examId: 1,
    subjectId: 1
});
// Pre-save hook to calculate percentage and grade
MarkSchema.pre('save', function(next) {
    if (this.marksScored !== undefined && this.totalMarks !== undefined) {
        this.percentage = this.marksScored / this.totalMarks * 100;
        // Calculate grade based on percentage
        if (this.percentage >= 90) this.grade = 'A+';
        else if (this.percentage >= 80) this.grade = 'A';
        else if (this.percentage >= 70) this.grade = 'B+';
        else if (this.percentage >= 60) this.grade = 'B';
        else if (this.percentage >= 50) this.grade = 'C';
        else if (this.percentage >= 40) this.grade = 'D';
        else this.grade = 'F';
    }
    next();
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Mark || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Mark', MarkSchema);
}),
"[project]/lib/models/Content.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const ContentSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    type: {
        type: String,
        enum: [
            'video',
            'audio',
            'pdf',
            'text'
        ],
        required: true
    },
    url: {
        type: String
    },
    text: {
        type: String
    },
    section: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'Section',
        required: true
    },
    owner: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});
ContentSchema.index({
    section: 1,
    createdAt: -1
});
const Content = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Content || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Content', ContentSchema);
const __TURBOPACK__default__export__ = Content;
}),
"[project]/lib/models/Course.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const CourseSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    title: {
        type: String,
        required: [
            true,
            'Please provide a course title'
        ],
        trim: true,
        maxlength: [
            200,
            'Title cannot be more than 200 characters'
        ]
    },
    description: {
        type: String,
        required: [
            true,
            'Please provide a course description'
        ],
        maxlength: [
            2000,
            'Description cannot be more than 2000 characters'
        ]
    },
    instructor: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'User',
        required: true
    },
    schoolId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'School'
    },
    createdBy: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'User'
    },
    classes: [
        {
            type: String,
            trim: true
        }
    ],
    isPublished: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        required: [
            true,
            'Please specify a category'
        ],
        trim: true
    },
    level: {
        type: String,
        enum: [
            'beginner',
            'intermediate',
            'advanced'
        ],
        default: 'beginner'
    },
    thumbnail: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0,
        min: [
            0,
            'Price cannot be negative'
        ]
    },
    duration: {
        type: Number,
        required: true,
        min: [
            0,
            'Duration cannot be negative'
        ]
    },
    lessons: [
        {
            title: {
                type: String,
                required: true
            },
            description: String,
            content: {
                type: String,
                required: true
            },
            videoUrl: String,
            duration: {
                type: Number,
                required: true
            },
            order: {
                type: Number,
                required: true
            }
        }
    ],
    quizzes: [
        {
            title: {
                type: String,
                required: true
            },
            questions: [
                {
                    question: {
                        type: String,
                        required: true
                    },
                    options: {
                        type: [
                            String
                        ],
                        required: true,
                        validate: {
                            validator: (v)=>v.length >= 2,
                            message: 'At least 2 options are required'
                        }
                    },
                    correctAnswer: {
                        type: Number,
                        required: true
                    },
                    explanation: String
                }
            ],
            passingScore: {
                type: Number,
                default: 70,
                min: 0,
                max: 100
            }
        }
    ],
    sections: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
            ref: 'Section'
        }
    ],
    enrolledStudents: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
            ref: 'User'
        }
    ],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: [
        {
            user: {
                type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
                ref: 'User',
                required: true
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            comment: {
                type: String,
                maxlength: [
                    1000,
                    'Comment cannot be more than 1000 characters'
                ]
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    status: {
        type: String,
        enum: [
            'draft',
            'published',
            'archived'
        ],
        default: 'draft'
    },
    tags: {
        type: [
            String
        ],
        default: []
    }
}, {
    timestamps: true
});
// Indexes for better query performance
CourseSchema.index({
    title: 'text',
    description: 'text'
});
CourseSchema.index({
    instructor: 1
});
CourseSchema.index({
    schoolId: 1
});
CourseSchema.index({
    category: 1,
    level: 1
});
CourseSchema.index({
    status: 1
});
CourseSchema.index({
    rating: -1
});
const Course = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Course || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Course', CourseSchema);
const __TURBOPACK__default__export__ = Course;
}),
"[project]/lib/models/OfflineContent.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const OfflineContentSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    userId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    lessonId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId
    },
    contentType: {
        type: String,
        enum: [
            'video',
            'pdf',
            'notes',
            'quiz'
        ],
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    downloadedAt: {
        type: Date,
        default: Date.now
    },
    lastAccessedAt: {
        type: Date,
        default: Date.now
    },
    syncStatus: {
        type: String,
        enum: [
            'pending',
            'synced',
            'outdated'
        ],
        default: 'synced'
    }
}, {
    timestamps: true
});
OfflineContentSchema.index({
    userId: 1,
    courseId: 1
});
OfflineContentSchema.index({
    syncStatus: 1
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.OfflineContent || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('OfflineContent', OfflineContentSchema);
}),
"[project]/lib/models/Section.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const SectionSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    name: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'User',
        required: true
    },
    students: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
            ref: 'User'
        }
    ]
}, {
    timestamps: true
});
SectionSchema.index({
    owner: 1,
    name: 1
}, {
    unique: true
});
const Section = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Section || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Section', SectionSchema);
const __TURBOPACK__default__export__ = Section;
}),
"[project]/lib/models/ChatMessage.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const ChatMessageSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    userId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [
            'user',
            'assistant'
        ],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    language: {
        type: String,
        default: 'english'
    },
    quizMode: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
// Indexes for performance
ChatMessageSchema.index({
    userId: 1,
    timestamp: -1
});
ChatMessageSchema.index({
    userName: 1,
    timestamp: -1
});
ChatMessageSchema.index({
    quizMode: 1
});
const ChatMessage = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.ChatMessage || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('ChatMessage', ChatMessageSchema);
const __TURBOPACK__default__export__ = ChatMessage;
}),
"[project]/lib/models/Gamification.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const GamificationSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    userId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    streak: {
        type: Number,
        default: 0
    },
    lastActivityDate: {
        type: Date,
        default: null
    },
    badges: [
        {
            id: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            description: String,
            icon: String,
            earnedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    achievements: [
        {
            id: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            progress: {
                type: Number,
                default: 0
            },
            target: {
                type: Number,
                required: true
            },
            completed: {
                type: Boolean,
                default: false
            }
        }
    ]
}, {
    timestamps: true
});
GamificationSchema.index({
    userId: 1
});
GamificationSchema.index({
    xp: -1
});
GamificationSchema.index({
    level: -1
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Gamification || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Gamification', GamificationSchema);
}),
"[project]/lib/models/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// Core Models
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$School$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/School.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/User.ts [app-route] (ecmascript)");
// Academic Structure Models
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Class$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Class.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Subject$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Subject.ts [app-route] (ecmascript)");
// Assessment Models
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Attendance$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Attendance.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Exam$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Exam.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Mark$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Mark.ts [app-route] (ecmascript)");
// Learning Management Models
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Content.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Course$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Course.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$OfflineContent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/OfflineContent.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Section$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Section.ts [app-route] (ecmascript)");
// Engagement Models
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$ChatMessage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/ChatMessage.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Gamification$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Gamification.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
}),
"[project]/lib/models/Attendance.ts [app-route] (ecmascript) <export default as Attendance>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Attendance",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Attendance$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Attendance$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Attendance.ts [app-route] (ecmascript)");
}),
"[project]/lib/models/Class.ts [app-route] (ecmascript) <export default as Class>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Class",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Class$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Class$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Class.ts [app-route] (ecmascript)");
}),
"[project]/lib/models/Content.ts [app-route] (ecmascript) <export default as Content>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Content",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Content.ts [app-route] (ecmascript)");
}),
"[project]/lib/models/Course.ts [app-route] (ecmascript) <export default as Course>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Course",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Course$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Course$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Course.ts [app-route] (ecmascript)");
}),
"[project]/lib/models/Exam.ts [app-route] (ecmascript) <export default as Exam>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Exam",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Exam$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Exam$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Exam.ts [app-route] (ecmascript)");
}),
"[project]/lib/models/Mark.ts [app-route] (ecmascript) <export default as Mark>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Mark",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Mark$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Mark$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Mark.ts [app-route] (ecmascript)");
}),
"[project]/lib/models/School.ts [app-route] (ecmascript) <export default as School>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "School",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$School$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$School$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/School.ts [app-route] (ecmascript)");
}),
"[project]/lib/models/Section.ts [app-route] (ecmascript) <export default as Section>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Section",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Section$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Section$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Section.ts [app-route] (ecmascript)");
}),
"[project]/lib/models/Subject.ts [app-route] (ecmascript) <export default as Subject>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Subject",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Subject$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Subject$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Subject.ts [app-route] (ecmascript)");
}),
"[project]/lib/models/User.ts [app-route] (ecmascript) <export default as User>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "User",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/User.ts [app-route] (ecmascript)");
}),
"[project]/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}
let cached = global.mongoose || {
    conn: null,
    promise: null
};
if (!global.mongoose) {
    global.mongoose = cached;
}
async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 75000,
            connectTimeoutMS: 30000,
            maxPoolSize: 10,
            minPoolSize: 1,
            retryWrites: true,
            retryReads: true,
            // Disable TLS validation to fix Node.js 22 SSL error
            tls: true,
            tlsAllowInvalidCertificates: true,
            tlsAllowInvalidHostnames: true
        };
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connect(MONGODB_URI, opts).then((mongoose)=>{
            console.log('✅ MongoDB connected successfully');
            return mongoose;
        }).catch((err)=>{
            console.error('❌ MongoDB connection error:', err.message);
            cached.promise = null;
            throw err;
        });
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error('❌ MongoDB connection error:', e);
        throw e;
    }
    return cached.conn;
}
const __TURBOPACK__default__export__ = connectDB;
}),
"[externals]/bcrypt [external] (bcrypt, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("bcrypt", () => require("bcrypt"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/seed/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/models/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Attendance$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Attendance$3e$__ = __turbopack_context__.i("[project]/lib/models/Attendance.ts [app-route] (ecmascript) <export default as Attendance>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Class$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Class$3e$__ = __turbopack_context__.i("[project]/lib/models/Class.ts [app-route] (ecmascript) <export default as Class>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Content$3e$__ = __turbopack_context__.i("[project]/lib/models/Content.ts [app-route] (ecmascript) <export default as Content>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Course$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Course$3e$__ = __turbopack_context__.i("[project]/lib/models/Course.ts [app-route] (ecmascript) <export default as Course>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Exam$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Exam$3e$__ = __turbopack_context__.i("[project]/lib/models/Exam.ts [app-route] (ecmascript) <export default as Exam>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Mark$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Mark$3e$__ = __turbopack_context__.i("[project]/lib/models/Mark.ts [app-route] (ecmascript) <export default as Mark>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$School$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__School$3e$__ = __turbopack_context__.i("[project]/lib/models/School.ts [app-route] (ecmascript) <export default as School>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Section$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Section$3e$__ = __turbopack_context__.i("[project]/lib/models/Section.ts [app-route] (ecmascript) <export default as Section>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Subject$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Subject$3e$__ = __turbopack_context__.i("[project]/lib/models/Subject.ts [app-route] (ecmascript) <export default as Subject>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/lib/models/User.ts [app-route] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$bcrypt__$5b$external$5d$__$28$bcrypt$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/bcrypt [external] (bcrypt, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
;
;
;
;
;
async function POST() {
    try {
        // Connect to database with retry logic
        let retries = 3;
        while(retries > 0){
            try {
                if (__TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connection.readyState !== 1) {
                    console.log('Connecting to MongoDB...');
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
                }
                // Test connection
                await __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connection.db.admin().ping();
                console.log('MongoDB connection verified');
                break;
            } catch (err) {
                retries--;
                console.log(`Connection attempt failed. Retries left: ${retries}`);
                if (retries === 0) throw err;
                await new Promise((resolve)=>setTimeout(resolve, 2000));
            }
        }
        console.log('Starting database cleanup...');
        // Clear existing data by deleting all documents
        await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"].deleteMany({}),
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$School$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__School$3e$__["School"].deleteMany({}),
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Class$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Class$3e$__["Class"].deleteMany({}),
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Subject$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Subject$3e$__["Subject"].deleteMany({}),
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Exam$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Exam$3e$__["Exam"].deleteMany({}),
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Mark$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Mark$3e$__["Mark"].deleteMany({}),
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Attendance$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Attendance$3e$__["Attendance"].deleteMany({}),
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Section$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Section$3e$__["Section"].deleteMany({}),
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Content$3e$__["Content"].deleteMany({}),
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Course$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Course$3e$__["Course"].deleteMany({})
        ]);
        console.log('Database cleaned successfully');
        // ==================== SUPER ADMIN ====================
        const superAdminPassword = await __TURBOPACK__imported__module__$5b$externals$5d2f$bcrypt__$5b$external$5d$__$28$bcrypt$2c$__cjs$29$__["default"].hash('superadmin123', 10);
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"].create({
            name: 'System Administrator',
            email: 'superadmin@edubridge.com',
            password: superAdminPassword,
            role: 'super-admin',
            phone: '+1-555-0100',
            bio: 'Platform super administrator with full system access',
            isActive: true
        });
        // ==================== SCHOOLS ====================
        const school1 = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$School$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__School$3e$__["School"].create({
            name: 'Green Valley High School',
            code: 'GVHS2025',
            email: 'info@greenvalley.edu',
            phone: '+1-555-0101',
            address: {
                street: '123 Education Lane',
                city: 'Springfield',
                state: 'California',
                country: 'USA',
                zipCode: '90210'
            },
            principal: {
                name: 'Dr. Robert Anderson',
                email: 'robert.anderson@greenvalley.edu',
                phone: '+1-555-0102'
            },
            logo: 'https://api.dicebear.com/7.x/initials/svg?seed=GVHS',
            website: 'https://greenvalley.edu',
            established: new Date('1985-08-15'),
            type: 'secondary',
            board: 'CBSE',
            isActive: true
        });
        const school2 = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$School$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__School$3e$__["School"].create({
            name: 'Sunrise International School',
            code: 'SRIS2025',
            email: 'contact@sunriseschool.edu',
            phone: '+1-555-0201',
            address: {
                street: '456 Knowledge Boulevard',
                city: 'Los Angeles',
                state: 'California',
                country: 'USA',
                zipCode: '90001'
            },
            principal: {
                name: 'Mrs. Patricia Martinez',
                email: 'patricia.martinez@sunriseschool.edu',
                phone: '+1-555-0202'
            },
            logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SRIS',
            website: 'https://sunriseschool.edu',
            established: new Date('1998-06-01'),
            type: 'higher-secondary',
            board: 'ICSE',
            isActive: true
        });
        const school3 = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$School$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__School$3e$__["School"].create({
            name: 'Oakwood Academy',
            code: 'OWAC2025',
            email: 'admissions@oakwoodacademy.edu',
            phone: '+1-555-0301',
            address: {
                street: '789 Wisdom Street',
                city: 'San Francisco',
                state: 'California',
                country: 'USA',
                zipCode: '94102'
            },
            principal: {
                name: 'Dr. Jennifer Wilson',
                email: 'jennifer.wilson@oakwoodacademy.edu',
                phone: '+1-555-0302'
            },
            logo: 'https://api.dicebear.com/7.x/initials/svg?seed=OWAC',
            website: 'https://oakwoodacademy.edu',
            established: new Date('2005-01-20'),
            type: 'secondary',
            board: 'State Board',
            isActive: true
        });
        // ==================== PRINCIPALS ====================
        const principalPassword = await __TURBOPACK__imported__module__$5b$externals$5d2f$bcrypt__$5b$external$5d$__$28$bcrypt$2c$__cjs$29$__["default"].hash('principal123', 10);
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"].insertMany([
            {
                name: 'Dr. Robert Anderson',
                email: 'robert.anderson@greenvalley.edu',
                password: principalPassword,
                role: 'principal',
                schoolId: school1._id,
                phone: '+1-555-0102',
                bio: 'Experienced educator with 20 years in administration',
                isActive: true
            },
            {
                name: 'Mrs. Patricia Martinez',
                email: 'patricia.martinez@sunriseschool.edu',
                password: principalPassword,
                role: 'principal',
                schoolId: school2._id,
                phone: '+1-555-0202',
                bio: 'Educational leader focused on student-centered learning',
                isActive: true
            },
            {
                name: 'Dr. Jennifer Wilson',
                email: 'jennifer.wilson@oakwoodacademy.edu',
                password: principalPassword,
                role: 'principal',
                schoolId: school3._id,
                phone: '+1-555-0302',
                bio: 'Advocate for innovative teaching methodologies',
                isActive: true
            }
        ]);
        // ==================== CLASSES ====================
        const classNames = [
            'LKG',
            'UKG',
            '1st',
            '2nd',
            '3rd',
            '4th',
            '5th',
            '6th',
            '7th',
            '8th',
            '9th',
            '10th',
            '11th',
            '12th'
        ];
        const sections = [
            'A',
            'B',
            'C'
        ];
        const allClasses = [];
        for (const school of [
            school1,
            school2,
            school3
        ]){
            for (const className of classNames){
                for (const section of sections){
                    const classDoc = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Class$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Class$3e$__["Class"].create({
                        schoolId: school._id,
                        className,
                        section,
                        academicYear: '2024-2025',
                        strength: 0
                    });
                    allClasses.push(classDoc);
                }
            }
        }
        // ==================== TEACHERS ====================
        const teacherPassword = await __TURBOPACK__imported__module__$5b$externals$5d2f$bcrypt__$5b$external$5d$__$28$bcrypt$2c$__cjs$29$__["default"].hash('teacher123', 10);
        // Green Valley High School Teachers
        const gvhsTeachers = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"].insertMany([
            {
                name: 'Dr. Sarah Johnson',
                email: 'sarah.johnson@greenvalley.edu',
                password: teacherPassword,
                role: 'teacher',
                schoolId: school1._id,
                phone: '+1-555-1001',
                subjectSpecialization: 'Mathematics',
                teacherRole: 'HOD',
                bio: 'Mathematics HOD with 15 years of teaching experience',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
                isActive: true
            },
            {
                name: 'Prof. Michael Chen',
                email: 'michael.chen@greenvalley.edu',
                password: teacherPassword,
                role: 'teacher',
                schoolId: school1._id,
                phone: '+1-555-1002',
                subjectSpecialization: 'Computer Science',
                teacherRole: 'Teacher',
                bio: 'Computer Science educator passionate about programming',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
                isActive: true
            },
            {
                name: 'Ms. Emily Rodriguez',
                email: 'emily.rodriguez@greenvalley.edu',
                password: teacherPassword,
                role: 'teacher',
                schoolId: school1._id,
                phone: '+1-555-1003',
                subjectSpecialization: 'English',
                teacherRole: 'Vice Principal',
                bio: 'English Literature expert and published author',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
                isActive: true
            },
            {
                name: 'Dr. James Williams',
                email: 'james.williams@greenvalley.edu',
                password: teacherPassword,
                role: 'teacher',
                schoolId: school1._id,
                phone: '+1-555-1004',
                subjectSpecialization: 'Physics',
                teacherRole: 'HOD',
                bio: 'Physics HOD with PhD in Applied Physics',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
                isActive: true
            }
        ]);
        // Sunrise International School Teachers
        const srisTeachers = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"].insertMany([
            {
                name: 'Dr. Amanda Thompson',
                email: 'amanda.thompson@sunriseschool.edu',
                password: teacherPassword,
                role: 'teacher',
                schoolId: school2._id,
                phone: '+1-555-2001',
                subjectSpecialization: 'Mathematics',
                teacherRole: 'HOD',
                bio: 'Mathematics department head',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda',
                isActive: true
            },
            {
                name: 'Mr. Carlos Rivera',
                email: 'carlos.rivera@sunriseschool.edu',
                password: teacherPassword,
                role: 'teacher',
                schoolId: school2._id,
                phone: '+1-555-2002',
                subjectSpecialization: 'Physics',
                teacherRole: 'Teacher',
                bio: 'Physics teacher with experimental learning focus',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
                isActive: true
            }
        ]);
        // Oakwood Academy Teachers
        const owacTeachers = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"].insertMany([
            {
                name: 'Mrs. Linda Foster',
                email: 'linda.foster@oakwoodacademy.edu',
                password: teacherPassword,
                role: 'teacher',
                schoolId: school3._id,
                phone: '+1-555-3001',
                subjectSpecialization: 'Mathematics',
                teacherRole: 'Teacher',
                bio: 'Mathematics teacher with focus on applied math',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linda',
                isActive: true
            },
            {
                name: 'Mr. Thomas Wright',
                email: 'thomas.wright@oakwoodacademy.edu',
                password: teacherPassword,
                role: 'teacher',
                schoolId: school3._id,
                phone: '+1-555-3002',
                subjectSpecialization: 'Science',
                teacherRole: 'HOD',
                bio: 'Science department head',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
                isActive: true
            }
        ]);
        const allTeachers = [
            ...gvhsTeachers,
            ...srisTeachers,
            ...owacTeachers
        ];
        // ==================== SUBJECTS ====================
        const subjectsByClass = {
            '9th': [
                'English',
                'Mathematics',
                'Physics',
                'Chemistry',
                'Biology',
                'Computer Science'
            ],
            '10th': [
                'English',
                'Mathematics',
                'Physics',
                'Chemistry',
                'Biology',
                'Computer Science'
            ],
            '11th': [
                'English',
                'Mathematics',
                'Physics',
                'Chemistry',
                'Computer Science'
            ],
            '12th': [
                'English',
                'Mathematics',
                'Physics',
                'Chemistry',
                'Computer Science'
            ]
        };
        const allSubjects = [];
        const targetClasses = allClasses.filter((c)=>[
                '9th',
                '10th',
                '11th',
                '12th'
            ].includes(c.className));
        for (const classDoc of targetClasses){
            const className = classDoc.className;
            const subjectNames = subjectsByClass[className] || [];
            const teacher = allTeachers.find((t)=>t.schoolId.equals(classDoc.schoolId));
            for (const subjectName of subjectNames){
                const subject = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Subject$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Subject$3e$__["Subject"].create({
                    schoolId: classDoc.schoolId,
                    classId: classDoc._id,
                    subjectName,
                    subjectCode: `${className}_${subjectName.substring(0, 3).toUpperCase()}`,
                    teacherId: teacher?._id,
                    description: `${subjectName} curriculum for ${className}`,
                    totalLessons: Math.floor(Math.random() * 20) + 30,
                    isActive: true
                });
                allSubjects.push(subject);
            }
        }
        // ==================== STUDENTS & DATA ====================
        const studentPassword = await __TURBOPACK__imported__module__$5b$externals$5d2f$bcrypt__$5b$external$5d$__$28$bcrypt$2c$__cjs$29$__["default"].hash('student123', 10);
        const studentFirstNames = [
            'Alex',
            'Jessica',
            'Ryan',
            'Sophie',
            'David',
            'Emma',
            'Lucas',
            'Olivia',
            'Ethan',
            'Ava',
            'Noah',
            'Isabella',
            'Liam',
            'Mia',
            'Mason'
        ];
        const studentLastNames = [
            'Thompson',
            'Martinez',
            'Patel',
            'Anderson',
            'Kim',
            'Wilson',
            'Brown',
            'Davis',
            'Garcia',
            'Miller'
        ];
        const parentNames = [
            'John',
            'Mary',
            'Robert',
            'Jennifer',
            'Michael',
            'Linda',
            'William',
            'Elizabeth'
        ];
        let totalStudents = 0;
        let totalMarks = 0;
        let totalAttendance = 0;
        // ==================== EXAMS ====================
        const examTypes = [
            {
                name: 'Unit Test 1',
                type: 'unit-test',
                term: 'Term 1',
                date: new Date('2024-09-15')
            },
            {
                name: 'Mid-Term Exam',
                type: 'mid-term',
                term: 'Term 1',
                date: new Date('2024-10-20')
            }
        ];
        const allExams = [];
        for (const classDoc of targetClasses){
            const classSubjects = allSubjects.filter((s)=>s.classId.equals(classDoc._id));
            for (const examType of examTypes){
                const exam = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Exam$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Exam$3e$__["Exam"].create({
                    schoolId: classDoc.schoolId,
                    classId: classDoc._id,
                    examName: examType.name,
                    examType: examType.type,
                    date: examType.date,
                    term: examType.term,
                    academicYear: '2024-2025',
                    totalMarks: 100,
                    duration: 180,
                    subjects: classSubjects.map((s)=>s._id),
                    instructions: `Answer all questions. Duration: 3 hours.`,
                    isActive: true
                });
                allExams.push(exam);
            }
        }
        // Create 20 students per targeted class with marks and attendance
        for (const classDoc of targetClasses){
            const studentsData = [];
            for(let i = 0; i < 20; i++){
                const firstName = studentFirstNames[Math.floor(Math.random() * studentFirstNames.length)];
                const lastName = studentLastNames[Math.floor(Math.random() * studentLastNames.length)];
                const parentFirstName = parentNames[Math.floor(Math.random() * parentNames.length)];
                studentsData.push({
                    name: `${firstName} ${lastName}`,
                    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${classDoc.className}.${classDoc.section}.${i}@student.edu`.replace(/\s/g, ''),
                    password: studentPassword,
                    role: 'student',
                    schoolId: classDoc.schoolId,
                    classId: classDoc._id,
                    rollNo: i + 1,
                    parentName: `${parentFirstName} ${lastName}`,
                    parentPhone: `+1-555-${Math.floor(Math.random() * 9000) + 1000}`,
                    phone: `+1-555-${Math.floor(Math.random() * 9000) + 1000}`,
                    bio: `${classDoc.className} grade student at ${classDoc.section} section`,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${i}`,
                    isActive: true,
                    className: classDoc.className,
                    section: classDoc.section,
                    rollNumber: `${classDoc.className}${classDoc.section}${String(i + 1).padStart(2, '0')}`
                });
            }
            // Insert all students at once
            const students = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"].insertMany(studentsData);
            totalStudents += students.length;
            // Create marks for all students
            const classExams = allExams.filter((e)=>e.classId.equals(classDoc._id));
            const classSubjects = allSubjects.filter((s)=>s.classId.equals(classDoc._id));
            const marksData = [];
            for (const student of students){
                for (const exam of classExams){
                    for (const subject of classSubjects){
                        const marksScored = Math.floor(Math.random() * 60) + 40;
                        const teacher = allTeachers.find((t)=>t.schoolId.equals(exam.schoolId));
                        marksData.push({
                            schoolId: exam.schoolId,
                            examId: exam._id,
                            studentId: student._id,
                            subjectId: subject._id,
                            marksScored,
                            totalMarks: 100,
                            remarks: marksScored >= 80 ? 'Excellent' : marksScored >= 60 ? 'Good' : 'Needs improvement',
                            markedBy: teacher?._id
                        });
                    }
                }
            }
            if (marksData.length > 0) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Mark$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Mark$3e$__["Mark"].insertMany(marksData);
                totalMarks += marksData.length;
            }
            // Create attendance for all students
            const attendanceStatuses = [
                'Present',
                'Present',
                'Present',
                'Present',
                'Absent',
                'Late'
            ];
            const today = new Date();
            const attendanceData = [];
            for (const student of students){
                for(let d = 30; d > 0; d--){
                    const date = new Date(today);
                    date.setDate(date.getDate() - d);
                    if (date.getDay() === 0 || date.getDay() === 6) continue;
                    const status = attendanceStatuses[Math.floor(Math.random() * attendanceStatuses.length)];
                    const teacher = allTeachers.find((t)=>t.schoolId.equals(student.schoolId));
                    attendanceData.push({
                        schoolId: student.schoolId,
                        studentId: student._id,
                        date,
                        status,
                        markedBy: teacher?._id,
                        className: classDoc.className,
                        section: classDoc.section
                    });
                }
            }
            if (attendanceData.length > 0) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Attendance$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Attendance$3e$__["Attendance"].insertMany(attendanceData);
                totalAttendance += attendanceData.length;
            }
            // Update class strength
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Class$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Class$3e$__["Class"].updateOne({
                _id: classDoc._id
            }, {
                strength: students.length
            });
            // Assign class teacher
            const classTeacher = allTeachers.find((t)=>t.schoolId.equals(classDoc.schoolId));
            if (classTeacher) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Class$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Class$3e$__["Class"].updateOne({
                    _id: classDoc._id
                }, {
                    classTeacherId: classTeacher._id
                });
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"].updateOne({
                    _id: classTeacher._id
                }, {
                    $addToSet: {
                        assignedClasses: classDoc._id
                    }
                });
            }
        }
        // Update teachers' assigned subjects
        for (const teacher of allTeachers){
            const teacherSubjects = allSubjects.filter((s)=>s.schoolId.equals(teacher.schoolId));
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"].updateOne({
                _id: teacher._id
            }, {
                assignedSubjects: teacherSubjects.map((s)=>s._id)
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: '✅ Database seeded successfully with new schema!',
            summary: {
                superAdmin: 1,
                schools: 3,
                principals: 3,
                teachers: allTeachers.length,
                classes: allClasses.length,
                subjects: allSubjects.length,
                students: totalStudents,
                exams: allExams.length,
                marks: totalMarks,
                attendance: totalAttendance
            },
            credentials: {
                superAdmin: 'superadmin@edubridge.com / superadmin123',
                principal: 'robert.anderson@greenvalley.edu / principal123',
                teacher: 'sarah.johnson@greenvalley.edu / teacher123',
                student: 'Check generated emails / student123'
            },
            schools: [
                {
                    name: school1.name,
                    code: school1.code
                },
                {
                    name: school2.name,
                    code: school2.code
                },
                {
                    name: school3.name,
                    code: school3.code
                }
            ]
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__dc8ce273._.js.map