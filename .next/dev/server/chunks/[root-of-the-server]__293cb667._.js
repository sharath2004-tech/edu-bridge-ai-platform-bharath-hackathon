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
"[project]/app/api/chatbot/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-middleware.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
;
;
async function POST(req) {
    try {
        // Authenticate user - all roles can access chatbot
        const authResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authenticateAndAuthorize"])(req, {
            requiredRoles: [
                'super-admin',
                'principal',
                'teacher',
                'student'
            ]
        });
        if (authResult instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"]) {
            return authResult;
        }
        const user = authResult;
        const { message, conversationHistory } = await req.json();
        if (!message || message.trim().length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Message is required'
            }, {
                status: 400
            });
        }
        // Build context based on user role
        const roleContext = getRoleContext(user.role, user.name);
        // Simple rule-based responses (can be enhanced with AI API later)
        const response = generateResponse(message, roleContext, conversationHistory);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            response,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Chatbot error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to process chatbot request'
        }, {
            status: 500
        });
    }
}
function getRoleContext(role, name) {
    const contexts = {
        student: `You are an educational assistant helping ${name}, a student. Provide clear explanations, study tips, and guidance on coursework.`,
        teacher: `You are an educational assistant helping ${name}, a teacher. Provide teaching strategies, classroom management tips, and content creation guidance.`,
        principal: `You are an administrative assistant helping ${name}, a principal. Provide insights on school management, enrollment, and educational leadership.`,
        'super-admin': `You are an administrative assistant helping ${name}, a super admin. Provide platform management and multi-school oversight guidance.`
    };
    return contexts[role] || contexts['student'];
}
function generateResponse(message, context, history) {
    const lowerMessage = message.toLowerCase();
    // Educational keywords
    if (lowerMessage.includes('course') || lowerMessage.includes('learn') || lowerMessage.includes('study')) {
        return "I can help you with your courses! You can browse available courses in the Courses section. Each course includes lessons, quizzes, and progress tracking. Would you like tips on effective studying?";
    }
    if (lowerMessage.includes('quiz') || lowerMessage.includes('test') || lowerMessage.includes('exam')) {
        return "For quizzes and tests, I recommend: 1) Review course materials regularly, 2) Practice with sample questions, 3) Take notes during lessons, 4) Don't rush - read questions carefully. You can find quizzes in your enrolled courses. Need specific study strategies?";
    }
    if (lowerMessage.includes('assignment') || lowerMessage.includes('homework')) {
        return "For assignments, make sure to: 1) Read the instructions carefully, 2) Start early to avoid last-minute stress, 3) Break large assignments into smaller tasks, 4) Ask your teacher if you need clarification. Check your dashboard for pending assignments.";
    }
    if (lowerMessage.includes('grade') || lowerMessage.includes('score') || lowerMessage.includes('performance')) {
        return "You can view your grades and performance analytics in the Analytics section of your dashboard. It shows your progress, quiz scores, and course completion rates. Focus on consistent learning rather than just grades!";
    }
    if (lowerMessage.includes('teacher') || lowerMessage.includes('instructor')) {
        return "You can view your teachers and their contact information in the appropriate section. If you need help with a specific subject, reach out to your subject teacher through the platform's messaging system.";
    }
    if (lowerMessage.includes('enroll') || lowerMessage.includes('register') || lowerMessage.includes('join')) {
        return "To enroll in courses, browse the Courses section and click on any course you're interested in. You'll see course details, lessons, and an enrollment option. Your principal can also enroll you in required courses.";
    }
    if (lowerMessage.includes('help') || lowerMessage.includes('how to') || lowerMessage.includes('guide')) {
        return "I'm here to help! I can assist with: \n- Course information and enrollment\n- Study tips and exam preparation\n- Understanding assignments and quizzes\n- Navigating the platform\n- Performance tracking\n\nWhat specific topic would you like help with?";
    }
    if (lowerMessage.includes('analytics') || lowerMessage.includes('progress') || lowerMessage.includes('dashboard')) {
        return "Your dashboard provides a comprehensive view of your learning journey! Check the Analytics section to see: course completion rates, quiz performance, study time, and areas for improvement. Regular review of your analytics helps you stay on track.";
    }
    if (lowerMessage.includes('community') || lowerMessage.includes('forum') || lowerMessage.includes('discussion')) {
        return "The Community section is a great place to connect with peers, ask questions, share knowledge, and participate in discussions. Collaborative learning enhances understanding - don't hesitate to engage!";
    }
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        return "You're welcome! I'm always here to help with your educational journey. Feel free to ask me anything about courses, studying, or using the platform. Happy learning! 📚";
    }
    // Default response
    return `Hello! I'm your educational assistant. I can help you with:

📚 **Courses** - Browse, enroll, and learn
📝 **Assignments & Quizzes** - Study tips and strategies  
📊 **Analytics** - Track your progress
👥 **Community** - Connect with peers
⚙️ **Platform Navigation** - Find your way around

What would you like to know more about?`;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__293cb667._.js.map