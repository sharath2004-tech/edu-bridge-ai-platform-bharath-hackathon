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
    classId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'Class',
        index: true
    },
    className: {
        type: String,
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
MarkSchema.pre('save', function() {
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
"[project]/lib/models/Course.ts [app-route] (ecmascript) <export default as Course>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Course",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Course$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Course$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Course.ts [app-route] (ecmascript)");
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
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/courses/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/models/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Course$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Course$3e$__ = __turbopack_context__.i("[project]/lib/models/Course.ts [app-route] (ecmascript) <export default as Course>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const level = searchParams.get('level');
        const status = searchParams.get('status');
        const instructor = searchParams.get('instructor');
        const query = {};
        // Default to published for students, unless status is specified
        if (status) {
            query.status = status;
        } else if (!instructor) {
            query.status = 'published';
        }
        if (category) query.category = category;
        if (level) query.level = level;
        if (instructor) query.instructor = instructor;
        const courses = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Course$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Course$3e$__["Course"].find(query).populate('instructor', 'name email avatar').sort({
            createdAt: -1
        }).limit(100);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            count: courses.length,
            courses: courses,
            data: courses
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to fetch courses',
            message: error.message
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const body = await request.json();
        const { title, description, instructor, category, level, price, duration, lessons, status } = body;
        // Validate required fields
        if (!title || !description || !category) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Please provide all required fields'
            }, {
                status: 400
            });
        }
        // Create course
        const course = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Course$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Course$3e$__["Course"].create({
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
            tags: body.tags || []
        });
        const populatedCourse = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Course$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Course$3e$__["Course"].findById(course._id).populate('instructor', 'name email avatar');
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: populatedCourse
        }, {
            status: 201
        });
    } catch (error) {
        console.error('Error creating course:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to create course',
            message: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a793b380._.js.map