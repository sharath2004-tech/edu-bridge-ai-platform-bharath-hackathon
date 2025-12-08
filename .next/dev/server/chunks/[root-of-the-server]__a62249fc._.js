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
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/permissions.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Role-Based Access Control (RBAC) System
 * 
 * Role Hierarchy:
 * 1. Super Admin - Platform owner, manages all schools
 * 2. Principal - School-level admin, manages their school
 * 3. Teacher - Manages assigned classes and subjects
 * 4. Student - View-only access to their own data
 */ __turbopack_context__.s([
    "canAccessSchool",
    ()=>canAccessSchool,
    "canAccessUser",
    ()=>canAccessUser,
    "canCreateRole",
    ()=>canCreateRole,
    "getAccessibleSchoolIds",
    ()=>getAccessibleSchoolIds,
    "getDashboardRoute",
    ()=>getDashboardRoute,
    "hasPermission",
    ()=>hasPermission,
    "isAdmin",
    ()=>isAdmin,
    "isPrincipal",
    ()=>isPrincipal,
    "isStudent",
    ()=>isStudent,
    "isSuperAdmin",
    ()=>isSuperAdmin,
    "isTeacher",
    ()=>isTeacher,
    "requireRole",
    ()=>requireRole,
    "roleDescriptions",
    ()=>roleDescriptions,
    "roleLabels",
    ()=>roleLabels,
    "rolePermissions",
    ()=>rolePermissions
]);
const rolePermissions = {
    'super-admin': [
        // Full platform access
        {
            resource: 'schools',
            action: 'manage',
            scope: 'all'
        },
        {
            resource: 'users',
            action: 'manage',
            scope: 'all'
        },
        {
            resource: 'principals',
            action: 'create',
            scope: 'all'
        },
        {
            resource: 'principals',
            action: 'manage',
            scope: 'all'
        },
        {
            resource: 'billing',
            action: 'manage',
            scope: 'all'
        },
        {
            resource: 'analytics',
            action: 'read',
            scope: 'all'
        },
        {
            resource: 'reports',
            action: 'read',
            scope: 'all'
        },
        {
            resource: 'school-registrations',
            action: 'manage',
            scope: 'all'
        }
    ],
    'principal': [
        // School-level management
        {
            resource: 'school',
            action: 'read',
            scope: 'own'
        },
        {
            resource: 'school',
            action: 'update',
            scope: 'own'
        },
        {
            resource: 'teachers',
            action: 'create',
            scope: 'school'
        },
        {
            resource: 'teachers',
            action: 'manage',
            scope: 'school'
        },
        {
            resource: 'students',
            action: 'create',
            scope: 'school'
        },
        {
            resource: 'students',
            action: 'manage',
            scope: 'school'
        },
        {
            resource: 'classes',
            action: 'manage',
            scope: 'school'
        },
        {
            resource: 'subjects',
            action: 'manage',
            scope: 'school'
        },
        {
            resource: 'attendance',
            action: 'read',
            scope: 'school'
        },
        {
            resource: 'marks',
            action: 'read',
            scope: 'school'
        },
        {
            resource: 'reports',
            action: 'read',
            scope: 'school'
        },
        {
            resource: 'timetable',
            action: 'manage',
            scope: 'school'
        },
        {
            resource: 'courses',
            action: 'manage',
            scope: 'school'
        }
    ],
    'teacher': [
        // Class and subject specific access
        {
            resource: 'school',
            action: 'read',
            scope: 'own'
        },
        {
            resource: 'students',
            action: 'read',
            scope: 'assigned'
        },
        {
            resource: 'classes',
            action: 'read',
            scope: 'assigned'
        },
        {
            resource: 'subjects',
            action: 'read',
            scope: 'assigned'
        },
        {
            resource: 'homework',
            action: 'manage',
            scope: 'assigned'
        },
        {
            resource: 'attendance',
            action: 'create',
            scope: 'assigned'
        },
        {
            resource: 'attendance',
            action: 'read',
            scope: 'assigned'
        },
        {
            resource: 'marks',
            action: 'create',
            scope: 'assigned'
        },
        {
            resource: 'marks',
            action: 'update',
            scope: 'assigned'
        },
        {
            resource: 'marks',
            action: 'read',
            scope: 'assigned'
        },
        {
            resource: 'timetable',
            action: 'read',
            scope: 'assigned'
        },
        {
            resource: 'courses',
            action: 'read',
            scope: 'assigned'
        },
        {
            resource: 'quizzes',
            action: 'read',
            scope: 'assigned'
        }
    ],
    'student': [
        // Personal dashboard only
        {
            resource: 'profile',
            action: 'read',
            scope: 'own'
        },
        {
            resource: 'profile',
            action: 'update',
            scope: 'own'
        },
        {
            resource: 'class',
            action: 'read',
            scope: 'own'
        },
        {
            resource: 'subjects',
            action: 'read',
            scope: 'own'
        },
        {
            resource: 'teachers',
            action: 'read',
            scope: 'own'
        },
        {
            resource: 'homework',
            action: 'read',
            scope: 'own'
        },
        {
            resource: 'attendance',
            action: 'read',
            scope: 'own'
        },
        {
            resource: 'marks',
            action: 'read',
            scope: 'own'
        },
        {
            resource: 'timetable',
            action: 'read',
            scope: 'own'
        },
        {
            resource: 'courses',
            action: 'read',
            scope: 'own'
        },
        {
            resource: 'quizzes',
            action: 'read',
            scope: 'own'
        },
        {
            resource: 'quizzes',
            action: 'create',
            scope: 'own'
        },
        {
            resource: 'school',
            action: 'read',
            scope: 'own'
        }
    ]
};
function hasPermission(userRole, resource, action, scope) {
    const permissions = rolePermissions[userRole];
    return permissions.some((permission)=>{
        // Check if resource matches
        const resourceMatch = permission.resource === resource;
        // Check if action matches (manage includes all actions)
        const actionMatch = permission.action === action || permission.action === 'manage';
        // Check if scope matches (if scope is specified)
        const scopeMatch = !scope || permission.scope === scope || permission.scope === 'all';
        return resourceMatch && actionMatch && scopeMatch;
    });
}
function canAccessSchool(userRole, userSchoolId, targetSchoolId) {
    // Super admin can access all schools
    if (userRole === 'super-admin') {
        return true;
    }
    // Others can only access their own school
    return userSchoolId === targetSchoolId;
}
function canAccessUser(userRole, userId, targetUserId, userSchoolId, targetUserSchoolId, targetUserRole) {
    // Super admin can access all users
    if (userRole === 'super-admin') {
        return true;
    }
    // Users can always access their own data
    if (userId === targetUserId) {
        return true;
    }
    // Principal can access all users in their school
    if (userRole === 'principal' && userSchoolId === targetUserSchoolId) {
        return true;
    }
    // Teachers can access students in their school (will be further filtered by assigned classes)
    if (userRole === 'teacher' && targetUserRole === 'student' && userSchoolId === targetUserSchoolId) {
        return true;
    }
    return false;
}
function getAccessibleSchoolIds(userRole, userSchoolId) {
    if (userRole === 'super-admin') {
        return 'all';
    }
    if (userSchoolId) {
        return [
            userSchoolId
        ];
    }
    return [];
}
const roleLabels = {
    'super-admin': 'Super Administrator',
    'principal': 'Principal / Head of School',
    'teacher': 'Teacher',
    'student': 'Student'
};
const roleDescriptions = {
    'super-admin': 'Platform owner with full access to all schools and features',
    'principal': 'School administrator with full control over their school',
    'teacher': 'Can manage assigned classes, subjects, and student data',
    'student': 'View-only access to personal academic information'
};
function getDashboardRoute(role) {
    switch(role){
        case 'super-admin':
            return '/admin/dashboard';
        case 'principal':
            return '/principal/dashboard';
        case 'teacher':
            return '/teacher/dashboard';
        case 'student':
            return '/student/dashboard';
        default:
            return '/';
    }
}
function canCreateRole(userRole, targetRole) {
    if (userRole === 'super-admin') {
        // Super admin can create principals and approve schools
        return [
            'principal',
            'super-admin'
        ].includes(targetRole);
    }
    if (userRole === 'principal') {
        // Principal can create teachers and students
        return [
            'teacher',
            'student'
        ].includes(targetRole);
    }
    return false;
}
function requireRole(allowedRoles) {
    return (userRole)=>{
        return allowedRoles.includes(userRole);
    };
}
function isAdmin(role) {
    return [
        'super-admin',
        'principal'
    ].includes(role);
}
function isSuperAdmin(role) {
    return role === 'super-admin';
}
function isPrincipal(role) {
    return role === 'principal';
}
function isTeacher(role) {
    return role === 'teacher';
}
function isStudent(role) {
    return role === 'student';
}
}),
"[project]/lib/auth-middleware.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authenticateAndAuthorize",
    ()=>authenticateAndAuthorize,
    "getAuthUser",
    ()=>getAuthUser,
    "requireAuth",
    ()=>requireAuth,
    "requirePermission",
    ()=>requirePermission,
    "requireRoles",
    ()=>requireRoles,
    "requireSameSchool",
    ()=>requireSameSchool,
    "requireSchoolAccess",
    ()=>requireSchoolAccess
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/permissions.ts [app-route] (ecmascript)");
;
;
function getAuthUser(request) {
    try {
        const cookie = request.cookies.get('edubridge_session');
        if (!cookie?.value) {
            return null;
        }
        const session = JSON.parse(cookie.value);
        return {
            id: session.id,
            role: session.role,
            name: session.name,
            email: session.email,
            schoolId: session.schoolId
        };
    } catch (error) {
        return null;
    }
}
function requireAuth(request) {
    const user = getAuthUser(request);
    if (!user) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Authentication required'
        }, {
            status: 401
        });
    }
    return user;
}
function requireRoles(user, allowedRoles) {
    if (!allowedRoles.includes(user.role)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Insufficient permissions',
            message: `This action requires one of the following roles: ${allowedRoles.join(', ')}`
        }, {
            status: 403
        });
    }
    return true;
}
function requirePermission(user, resource, action, scope) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasPermission"])(user.role, resource, action, scope)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Insufficient permissions',
            message: `You don't have permission to ${action} ${resource}`
        }, {
            status: 403
        });
    }
    return true;
}
function requireSchoolAccess(user, targetSchoolId) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$permissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canAccessSchool"])(user.role, user.schoolId, targetSchoolId)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Access denied',
            message: 'You do not have access to this school'
        }, {
            status: 403
        });
    }
    return true;
}
function requireSameSchool(user, targetSchoolId) {
    // Super admin can access all schools
    if (user.role === 'super-admin') {
        return true;
    }
    if (!user.schoolId || !targetSchoolId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'School information missing'
        }, {
            status: 400
        });
    }
    if (user.schoolId !== targetSchoolId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Access denied',
            message: 'You can only access users in your school'
        }, {
            status: 403
        });
    }
    return true;
}
function authenticateAndAuthorize(request, options = {}) {
    // Check authentication
    const authResult = requireAuth(request);
    if (authResult instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"]) {
        return authResult;
    }
    const user = authResult;
    // Check role if specified
    if (options.requiredRoles) {
        const roleCheck = requireRoles(user, options.requiredRoles);
        if (roleCheck instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"]) {
            return roleCheck;
        }
    }
    // Check permission if specified
    if (options.resource && options.action) {
        const permCheck = requirePermission(user, options.resource, options.action, options.scope);
        if (permCheck instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"]) {
            return permCheck;
        }
    }
    return user;
}
}),
"[externals]/mongoose [external] (mongoose, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
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
"[project]/app/api/principal/marks/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-middleware.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Mark$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Mark.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/User.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
;
;
;
;
;
async function GET(request) {
    try {
        const authResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authenticateAndAuthorize"])(request, {
            requiredRoles: [
                'principal',
                'teacher',
                'student',
                'super-admin'
            ]
        });
        if (authResult instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"]) {
            return authResult;
        }
        const user = authResult;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { searchParams } = new URL(request.url);
        const className = searchParams.get('className');
        const subject = searchParams.get('subject');
        const term = searchParams.get('term');
        const studentId = searchParams.get('studentId');
        const examType = searchParams.get('examType');
        // Build query
        const query = {};
        // School filtering
        if (user.role === 'principal' || user.role === 'teacher') {
            query.schoolId = user.schoolId;
        }
        // Student can only see their own marks
        if (user.role === 'student') {
            query.studentId = user.id;
        }
        // Teacher can only see marks for their assigned classes/subjects
        if (user.role === 'teacher') {
            const teacherData = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(user.id).select('assignedClasses assignedSubjects');
            if (teacherData) {
                if (teacherData.assignedClasses) {
                    query.className = {
                        $in: teacherData.assignedClasses
                    };
                }
                if (teacherData.assignedSubjects) {
                    query.subject = {
                        $in: teacherData.assignedSubjects
                    };
                }
            }
        }
        // Filters
        if (className) query.className = className;
        if (subject) query.subject = subject;
        if (term) query.term = term;
        if (studentId) query.studentId = studentId;
        if (examType) query.examType = examType;
        const marks = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Mark$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find(query).populate('studentId', 'name email rollNumber className').populate('markedBy', 'name email').sort({
            examDate: -1,
            className: 1,
            subject: 1
        }).limit(500);
        // Calculate statistics if viewing all marks for a class
        let statistics = null;
        if (className && !studentId) {
            const classMarks = marks.filter((m)=>m.className === className);
            if (classMarks.length > 0) {
                const avgPercentage = classMarks.reduce((sum, m)=>sum + m.percentage, 0) / classMarks.length;
                const passed = classMarks.filter((m)=>m.percentage >= 40).length;
                const failed = classMarks.length - passed;
                statistics = {
                    totalStudents: classMarks.length,
                    averagePercentage: Math.round(avgPercentage * 100) / 100,
                    passed,
                    failed,
                    passPercentage: Math.round(passed / classMarks.length * 100)
                };
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            marks,
            count: marks.length,
            statistics
        });
    } catch (error) {
        console.error('Marks fetch error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch marks',
            details: error.message
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const authResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authenticateAndAuthorize"])(request, {
            requiredRoles: [
                'principal',
                'teacher',
                'super-admin'
            ]
        });
        if (authResult instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"]) {
            return authResult;
        }
        const user = authResult;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { records } = await request.json();
        if (!records || !Array.isArray(records) || records.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Records array is required'
            }, {
                status: 400
            });
        }
        // Validate and prepare records
        const preparedRecords = [];
        for (const record of records){
            const { studentId, className, subject, examType, examName, marksObtained, totalMarks, term, examDate, remarks } = record;
            if (!studentId || !className || !subject || !examType || !examName || marksObtained === undefined || !totalMarks || !term || !examDate) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Missing required fields in one or more records'
                }, {
                    status: 400
                });
            }
            if (marksObtained > totalMarks) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: `Marks obtained (${marksObtained}) cannot exceed total marks (${totalMarks})`
                }, {
                    status: 400
                });
            }
            // Verify student exists and belongs to same school
            const student = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(studentId);
            if (!student || student.role !== 'student') {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: `Student not found: ${studentId}`
                }, {
                    status: 404
                });
            }
            if (user.role !== 'super-admin' && student.schoolId?.toString() !== user.schoolId) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Cannot enter marks for students from other schools'
                }, {
                    status: 403
                });
            }
            preparedRecords.push({
                studentId,
                schoolId: student.schoolId,
                className,
                subject,
                examType,
                examName,
                marksObtained,
                totalMarks,
                term,
                examDate: new Date(examDate),
                remarks: remarks || '',
                markedBy: user.id
            });
        }
        const createdMarks = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Mark$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].insertMany(preparedRecords);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: `Created marks for ${createdMarks.length} student(s)`,
            marks: createdMarks,
            count: createdMarks.length
        });
    } catch (error) {
        console.error('Marks creation error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to create marks',
            details: error.message
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        const authResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authenticateAndAuthorize"])(request, {
            requiredRoles: [
                'principal',
                'teacher',
                'super-admin'
            ]
        });
        if (authResult instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"]) {
            return authResult;
        }
        const user = authResult;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { markId, marksObtained, remarks } = await request.json();
        if (!markId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Mark ID is required'
            }, {
                status: 400
            });
        }
        const mark = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Mark$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(markId);
        if (!mark) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Mark record not found'
            }, {
                status: 404
            });
        }
        // Check school access
        if (user.role !== 'super-admin' && mark.schoolId?.toString() !== user.schoolId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Access denied'
            }, {
                status: 403
            });
        }
        if (marksObtained !== undefined) {
            if (marksObtained > mark.totalMarks) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: `Marks obtained (${marksObtained}) cannot exceed total marks (${mark.totalMarks})`
                }, {
                    status: 400
                });
            }
            mark.marksObtained = marksObtained;
        }
        if (remarks !== undefined) {
            mark.remarks = remarks;
        }
        await mark.save(); // Will trigger pre-save hook to recalculate percentage and grade
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Marks updated successfully',
            mark
        });
    } catch (error) {
        console.error('Marks update error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to update marks',
            details: error.message
        }, {
            status: 500
        });
    }
}
async function DELETE(request) {
    try {
        const authResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authenticateAndAuthorize"])(request, {
            requiredRoles: [
                'principal',
                'super-admin'
            ]
        });
        if (authResult instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"]) {
            return authResult;
        }
        const user = authResult;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { searchParams } = new URL(request.url);
        const markId = searchParams.get('markId');
        if (!markId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Mark ID is required'
            }, {
                status: 400
            });
        }
        const mark = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Mark$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(markId);
        if (!mark) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Mark record not found'
            }, {
                status: 404
            });
        }
        // Check school access
        if (user.role !== 'super-admin' && mark.schoolId?.toString() !== user.schoolId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Access denied'
            }, {
                status: 403
            });
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Mark$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndDelete(markId);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Mark record deleted successfully'
        });
    } catch (error) {
        console.error('Marks deletion error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to delete mark',
            details: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a62249fc._.js.map