"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scriptController = void 0;
const ai_service_1 = require("../ai/ai.service");
const selectlayout_service_1 = require("../services/selectlayout.service");
const design_service_1 = require("../services/design.service");
const supabase_1 = require("../db/supabase");
const zod_1 = require("zod");
const schema = zod_1.z.object({
    prompt: zod_1.z.string(),
    niche: zod_1.z.string(),
    purpose: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    brand_name: zod_1.z.string().optional()
});
exports.scriptController = {
    generate: async (request, reply) => {
        const { prompt, niche, purpose, description, brand_name } = schema.parse(request.body);
        const user = request.user;
        const { count } = await supabase_1.supabase
            .from("scripts")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id);
        const callCount = count ?? 0;
        const script = await ai_service_1.aiService.generateViralScript(prompt, niche, purpose, description, brand_name, callCount);
        const background = await ai_service_1.aiService.generateBackgroundImage(niche);
        const layout = (0, selectlayout_service_1.selectLayout)(script);
        const design = (0, design_service_1.generateDesign)(niche);
        await supabase_1.supabase.from("scripts").insert({
            user_id: user.id,
            hook: script.hook_quote,
            body: script.subtext,
            hashtags: script.hashtags
        });
        return reply.send({
            success: true,
            data: {
                script,
                background,
                layout,
                design
            }
        });
    }
};
