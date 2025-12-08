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
"[project]/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSession",
    ()=>getSession,
    "requireRole",
    ()=>requireRole
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-route] (ecmascript)");
;
async function getSession() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const c = cookieStore.get('edubridge_session')?.value;
    if (!c) return null;
    try {
        return JSON.parse(c);
    } catch  {
        return null;
    }
}
async function requireRole(role) {
    const s = await getSession();
    if (!s || s.role !== role) {
        return null;
    }
    return s;
}
}),
"[externals]/mongoose [external] (mongoose, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
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
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
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
"[project]/app/api/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$ChatMessage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/ChatMessage.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
;
;
;
;
// Cohere API Integration
async function generateCohereResponse(userMessage, language, chatHistory) {
    try {
        const COHERE_API_KEY = process.env.COHERE_API_KEY;
        if (!COHERE_API_KEY) {
            console.error('COHERE_API_KEY not configured');
            return generateFallbackResponse(userMessage, language);
        }
        // Build conversation history for context
        const conversationHistory = chatHistory.slice(-5) // Last 5 messages for context
        .reverse().map((msg)=>`${msg.role === 'user' ? 'Student' : 'Assistant'}: ${msg.content}`).join('\n');
        const systemPrompt = `You are EduBridge AI, a helpful learning assistant for students. Your role is to:
- Provide clear, educational explanations
- Encourage students with positive feedback
- Break down complex topics into simple steps
- Support multiple regional languages (English, Telugu, Hindi, Tamil, Kannada)
- Never directly give quiz answers
- Be encouraging and motivational

Current language preference: ${language}
${conversationHistory ? `\n\nPrevious conversation:\n${conversationHistory}` : ''}`;
        const response = await fetch('https://api.cohere.ai/v1/chat', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${COHERE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: userMessage,
                model: 'command-r-plus-08-2024',
                preamble: systemPrompt,
                temperature: 0.7,
                max_tokens: 500
            })
        });
        if (!response.ok) {
            console.error('Cohere API error:', response.status, await response.text());
            return generateFallbackResponse(userMessage, language);
        }
        const data = await response.json();
        return data.text || generateFallbackResponse(userMessage, language);
    } catch (error) {
        console.error('Error calling Cohere API:', error);
        return generateFallbackResponse(userMessage, language);
    }
}
// Fallback response generator for when Cohere API is unavailable
function generateFallbackResponse(userMessage, language) {
    const msg = userMessage.toLowerCase();
    // Teacher chat mode
    if (msg.includes('chat with') && msg.includes('teacher')) {
        return "📧 Opening teacher chat... You can now send messages to your teacher. They'll respond when available.";
    }
    // Math help
    if (msg.includes('math') || msg.includes('calculate') || msg.includes('solve')) {
        return "📐 I can help with math! Please share your specific question or problem. I'll provide:\n\n1️⃣ Quick answer\n2️⃣ Step-by-step solution\n3️⃣ Key concepts to remember\n\nWhat would you like to learn?";
    }
    // Concept explanation
    if (msg.includes('explain') || msg.includes('what is') || msg.includes('define')) {
        return "💡 I'd be happy to explain! Let me break this down:\n\n1. **Simple explanation**: [Concept in easy words]\n2. **Example**: Real-world application\n3. **Remember**: Key points\n\nWould you like me to explain in your regional language (Telugu, Hindi, Tamil, Kannada)?";
    }
    // Motivation
    if (msg.includes('difficult') || msg.includes('hard') || msg.includes('confused')) {
        return "💪 Don't worry! Learning takes time. Here's what we can do:\n\n🎯 Break the topic into smaller parts\n📚 Review related concepts first\n✏️ Practice similar problems\n🎥 Watch explanation videos\n\nYou're doing great! Keep going! 🌟";
    }
    // Progress tracking
    if (msg.includes('progress') || msg.includes('score') || msg.includes('performance')) {
        return "📊 Let me analyze your learning journey:\n\n✅ **Strengths**: Topics you've mastered\n⚡ **Improving**: Areas showing growth\n🎯 **Focus Areas**: Topics needing attention\n🏆 **Achievements**: Your badges & streaks\n\nWould you like personalized study recommendations?";
    }
    // Notes help
    if (msg.includes('notes') || msg.includes('summary') || msg.includes('flashcard')) {
        return "📝 I can help with your notes!\n\nUpload or share your notes and I'll:\n\n✨ **Summarize** key points\n🎴 **Create flashcards** for quick revision\n📋 **Extract** important concepts\n❓ **Generate practice quizzes**\n\nWhat would you like me to do?";
    }
    // Default helpful response
    return "👋 Hi! I'm your EduBridge AI assistant! I can help you with:\n\n📚 **Subject doubts** - Clear explanations\n🌍 **Regional languages** - Telugu, Hindi, Tamil, Kannada\n📊 **Progress tracking** - Your learning journey\n📝 **Notes analysis** - Summaries & flashcards\n💪 **Practice problems** - Adaptive difficulty\n🎯 **Study tips** - Personalized recommendations\n\nWhat would you like to learn today?";
}
async function POST(request) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSession"])();
        if (!session) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { message, quizMode = false, language = 'english' } = await request.json();
        if (!message) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Message is required'
            }, {
                status: 400
            });
        }
        // Get recent chat history for context
        const recentMessages = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$ChatMessage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            userId: session.id
        }).sort({
            timestamp: -1
        }).limit(10).lean();
        // Save user message
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$ChatMessage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
            userId: session.id,
            userName: session.name,
            role: 'user',
            content: message,
            language,
            quizMode
        });
        // Check quiz mode first
        let aiResponse;
        if (quizMode) {
            // Quiz Safe Mode - refuse to help
            const quizResponses = {
                english: "🔒 Quiz mode is active. I cannot help during the quiz. Continue your best!",
                telugu: "🔒 క్విజ్ మోడ్ యాక్టివ్ గా ఉంది. క్విజ్ సమయంలో నేను సహాయం చేయలేను. మీ ఉత్తమ ప్రయత్నం కొనసాగించండి!",
                hindi: "🔒 क्विज़ मोड सक्रिय है। मैं क्विज़ के दौरान मदद नहीं कर सकता। अपना सर्वश्रेष्ठ प्रयास जारी रखें!",
                tamil: "🔒 வினாடி வினா முறை செயலில் உள்ளது. வினாடி வினாவின் போது என்னால் உதவ முடியாது. உங்கள் சிறந்த முயற்சியைத் தொடரவும்!",
                kannada: "🔒 ಕ್ವಿಜ್ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ. ಕ್ವಿಜ್ ಸಮಯದಲ್ಲಿ ನಾನು ಸಹಾಯ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ. ನಿಮ್ಮ ಅತ್ಯುತ್ತಮ ಪ್ರಯತ್ನವನ್ನು ಮುಂದುವರಿಸಿ!"
            };
            aiResponse = quizResponses[language] || quizResponses.english;
        } else {
            // Generate AI response using Cohere
            aiResponse = await generateCohereResponse(message, language, recentMessages);
        }
        // Save AI response
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$ChatMessage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
            userId: session.id,
            userName: session.name,
            role: 'assistant',
            content: aiResponse,
            language,
            quizMode
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            response: aiResponse,
            quizMode
        }, {
            status: 200
        });
    } catch (error) {
        console.error('Error in chat:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to process message',
            message: error.message
        }, {
            status: 500
        });
    }
}
async function GET(request) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSession"])();
        if (!session) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const messages = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$ChatMessage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            userId: session.id
        }).sort({
            timestamp: 1
        }).limit(50).lean();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            messages
        }, {
            status: 200
        });
    } catch (error) {
        console.error('Error fetching chat history:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to fetch messages',
            message: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1813a3f8._.js.map