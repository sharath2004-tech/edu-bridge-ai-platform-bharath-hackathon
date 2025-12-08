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
"[project]/app/api/chatbot/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/lib/middleware/auth'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
async function POST(req) {
    try {
        // Authenticate user - all roles can access chatbot
        const authResult = await authenticateAndAuthorize(req, [
            'super-admin',
            'principal',
            'teacher',
            'student'
        ]);
        if (!authResult.success) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: authResult.error
            }, {
                status: authResult.status
            });
        }
        const user = authResult.user;
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

//# sourceMappingURL=%5Broot-of-the-server%5D__83498963._.js.map