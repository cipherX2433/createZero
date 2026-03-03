"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scriptController = void 0;
const ai_service_1 = require("../ai/ai.service");
const supabase_1 = require("../db/supabase");
const zod_1 = require("zod");
const generateScriptSchema = zod_1.z.object({
    prompt: zod_1.z.string().min(10),
    niche: zod_1.z.string(),
});
exports.scriptController = {
    generate: async (request, reply) => {
        try {
            const { prompt, niche } = generateScriptSchema.parse(request.body);
            const user = request.user;
            // 1. Generate Script using AI Service
            const script = await ai_service_1.aiService.generateViralScript(prompt, niche);
            // 2. Save to Database
            const { data, error } = await supabase_1.supabase
                .from('scripts')
                .insert({
                user_id: user.id,
                hook: script.hook,
                body: script.body,
                cta: script.cta,
                caption: script.caption,
                hashtags: script.hashtags,
                viral_score: script.viral_score,
                metadata: { prompt, niche }
            })
                .select()
                .single();
            if (error)
                throw error;
            // 3. Log usage (optional but recommended in GEMINI.md)
            await supabase_1.supabase.from('usage_logs').insert({
                user_id: user.id,
                action: 'generate_script',
                tokens_used: 0 // Update with actual token count later
            });
            return reply.send({
                success: true,
                data,
            });
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                return reply.status(400).send({ success: false, error: err.issues });
            }
            return reply.status(500).send({ success: false, error: err.message });
        }
    },
    getHistory: async (request, reply) => {
        try {
            const user = request.user;
            const { data, error } = await supabase_1.supabase
                .from('scripts')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            return reply.send({
                success: true,
                data,
            });
        }
        catch (err) {
            return reply.status(500).send({ success: false, error: err.message });
        }
    },
};
