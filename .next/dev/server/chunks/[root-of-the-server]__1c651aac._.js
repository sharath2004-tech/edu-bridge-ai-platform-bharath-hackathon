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
"[project]/app/api/principal/attendance/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-middleware.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Attendance$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Attendance.ts [app-route] (ecmascript)");
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
                'super-admin'
            ]
        });
        if (authResult instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"]) {
            return authResult;
        }
        const user = authResult;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');
        const className = searchParams.get('className');
        const studentId = searchParams.get('studentId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        // Build query
        const query = {};
        // School filtering
        if (user.role === 'principal' || user.role === 'teacher') {
            query.schoolId = user.schoolId;
        }
        // Teacher can only see their assigned classes
        if (user.role === 'teacher') {
            const teacherData = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(user.id).select('assignedClasses');
            if (teacherData && teacherData.assignedClasses) {
                query.className = {
                    $in: teacherData.assignedClasses
                };
            }
        }
        // Filters
        if (date) {
            const targetDate = new Date(date);
            targetDate.setHours(0, 0, 0, 0);
            const nextDate = new Date(targetDate);
            nextDate.setDate(nextDate.getDate() + 1);
            query.date = {
                $gte: targetDate,
                $lt: nextDate
            };
        }
        if (className) {
            query.className = className;
        }
        if (studentId) {
            query.studentId = studentId;
        }
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        const attendance = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Attendance$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find(query).populate('studentId', 'name email rollNumber className').populate('markedBy', 'name email').sort({
            date: -1,
            className: 1
        }).limit(500);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            attendance,
            count: attendance.length
        });
    } catch (error) {
        console.error('Attendance fetch error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch attendance records',
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
            const { studentId, className, section, date, status, notes } = record;
            if (!studentId || !className || !date || !status) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Missing required fields: studentId, className, date, status'
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
                    error: 'Cannot mark attendance for students from other schools'
                }, {
                    status: 403
                });
            }
            // Check if attendance already exists for this student on this date
            const existingAttendance = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Attendance$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
                studentId,
                date: {
                    $gte: new Date(date).setHours(0, 0, 0, 0),
                    $lt: new Date(date).setHours(23, 59, 59, 999)
                }
            });
            if (existingAttendance) {
                // Update existing record
                existingAttendance.status = status;
                existingAttendance.section = section;
                existingAttendance.notes = notes || '';
                existingAttendance.markedBy = user.id;
                await existingAttendance.save();
                preparedRecords.push(existingAttendance);
            } else {
                // Create new record
                preparedRecords.push({
                    studentId,
                    schoolId: student.schoolId,
                    className,
                    section,
                    date: new Date(date),
                    status,
                    notes: notes || '',
                    markedBy: user.id
                });
            }
        }
        // Insert only new records
        const newRecords = preparedRecords.filter((r)=>!r._id);
        if (newRecords.length > 0) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Attendance$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].insertMany(newRecords);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: `Marked attendance for ${records.length} student(s)`,
            count: records.length
        });
    } catch (error) {
        console.error('Attendance mark error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to mark attendance',
            details: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1c651aac._.js.map