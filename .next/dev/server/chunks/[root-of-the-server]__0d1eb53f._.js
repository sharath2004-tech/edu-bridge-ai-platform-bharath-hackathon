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
"[project]/app/api/teacher/ai/ppt/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
;
async function generatePPTWithCohere(topic, audience, numSlides, style, keyPoints) {
    try {
        const COHERE_API_KEY = process.env.COHERE_API_KEY;
        if (!COHERE_API_KEY) {
            console.error('COHERE_API_KEY not configured');
            return generateFallbackSlides(topic, numSlides);
        }
        const keyPointsList = keyPoints ? keyPoints.split('\n').filter((p)=>p.trim()) : [];
        const keyPointsText = keyPointsList.length > 0 ? `\n\nKey points to include:\n${keyPointsList.map((p)=>`- ${p}`).join('\n')}` : '';
        const prompt = `Create a ${numSlides}-slide presentation about "${topic}" for ${audience}.
Style: ${style}${keyPointsText}

Generate a JSON array with exactly ${numSlides} slides. Each slide should have:
- title: (string) Catchy slide title
- content: (array of 3-5 strings) Bullet points with key information
- notes: (string) Brief speaker notes

Example format:
[
  {
    "title": "Introduction to ${topic}",
    "content": [
      "First key point",
      "Second key point",
      "Third key point"
    ],
    "notes": "Start with an engaging question"
  }
]

Return ONLY the JSON array, no additional text.`;
        const response = await fetch('https://api.cohere.ai/v1/chat', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${COHERE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: prompt,
                model: 'command-r-plus-08-2024',
                temperature: 0.8,
                max_tokens: 3000
            })
        });
        if (!response.ok) {
            console.error('Cohere API error:', response.status, await response.text());
            return generateFallbackSlides(topic, numSlides);
        }
        const data = await response.json();
        const text = data.text || '';
        // Extract JSON from response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const slides = JSON.parse(jsonMatch[0]);
            return slides.slice(0, numSlides);
        }
        return generateFallbackSlides(topic, numSlides);
    } catch (error) {
        console.error('Error generating PPT with Cohere:', error);
        return generateFallbackSlides(topic, numSlides);
    }
}
function generateFallbackSlides(topic, numSlides) {
    const slides = [
        {
            title: `${topic}`,
            content: [
                'Overview of the topic',
                'Key concepts and definitions',
                'Learning objectives'
            ],
            notes: 'Start with a warm welcome and topic introduction'
        },
        {
            title: 'Background & Context',
            content: [
                'Historical background',
                'Why this topic matters',
                'Real-world applications'
            ],
            notes: 'Provide context to engage the audience'
        },
        {
            title: 'Key Concepts',
            content: [
                'Fundamental principles',
                'Core ideas explained',
                'Important terminology'
            ],
            notes: 'Break down complex ideas into simple terms'
        },
        {
            title: 'Detailed Explanation',
            content: [
                'In-depth analysis',
                'Examples and case studies',
                'Step-by-step process'
            ],
            notes: 'Use visual aids and examples'
        },
        {
            title: 'Practical Applications',
            content: [
                'How to apply this knowledge',
                'Common use cases',
                'Industry examples'
            ],
            notes: 'Show real-world relevance'
        },
        {
            title: 'Benefits & Impact',
            content: [
                'Advantages of understanding this topic',
                'Impact on related fields',
                'Future implications'
            ],
            notes: 'Emphasize the value of learning'
        },
        {
            title: 'Challenges & Solutions',
            content: [
                'Common difficulties',
                'Misconceptions to avoid',
                'Best practices'
            ],
            notes: 'Address potential obstacles'
        },
        {
            title: 'Advanced Topics',
            content: [
                'Going deeper into the subject',
                'Related advanced concepts',
                'Further learning resources'
            ],
            notes: 'For those wanting to explore more'
        },
        {
            title: 'Summary',
            content: [
                'Recap of key points',
                'Main takeaways',
                'What we learned today'
            ],
            notes: 'Reinforce the main concepts'
        },
        {
            title: 'Questions & Next Steps',
            content: [
                'Q&A session',
                'Additional resources',
                'How to continue learning'
            ],
            notes: 'Engage with audience and provide guidance'
        }
    ];
    return slides.slice(0, numSlides);
}
async function POST(request) {
    try {
        const { topic, audience, numSlides, style, keyPoints } = await request.json();
        if (!topic) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Topic is required'
            }, {
                status: 400
            });
        }
        const slides = await generatePPTWithCohere(topic, audience || 'students', numSlides || 10, style || 'educational', keyPoints || '');
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            slides
        });
    } catch (error) {
        console.error('Error generating PPT:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to generate presentation',
            message: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0d1eb53f._.js.map