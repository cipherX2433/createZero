"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = exports.AIService = exports.scriptResponseSchema = void 0;
const zod_1 = require("zod");
exports.scriptResponseSchema = zod_1.z.object({
    hook: zod_1.z.string(),
    body: zod_1.z.string(),
    cta: zod_1.z.string(),
    caption: zod_1.z.string(),
    hashtags: zod_1.z.array(zod_1.z.string()),
    viral_score: zod_1.z.number().min(0).max(100),
});
class AIService {
    apiKey;
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY || '';
    }
    async generateViralScript(prompt, niche) {
        // For now, returning a mock response to ensure flow works
        // In actual implementation, this will call Gemini API with structured output
        console.log(`Generating script for niche: ${niche} with prompt: ${prompt}`);
        return {
            hook: "STOP scrolling if you want to scale your SaaS to 10k MRR! 🚀",
            body: "Most founders focus on features. But winners focus on solving problems. Here's the 3-step framework to build what people actually want.",
            cta: "Comment 'SCALE' for my free architecture checklist! 👇",
            caption: "SaaS growth isn't about code. It's about psychology. #saas #founder #growth",
            hashtags: ["saas", "startup", "developer", "growthtips"],
            viral_score: 92
        };
    }
}
exports.AIService = AIService;
exports.aiService = new AIService();
