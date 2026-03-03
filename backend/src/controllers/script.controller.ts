import { FastifyRequest, FastifyReply } from 'fastify';
import { aiService } from '../ai/ai.service';
import { supabase } from '../db/supabase';
import { z } from 'zod';

const generateScriptSchema = z.object({
    prompt: z.string().min(10),
    niche: z.string(),
});

export const scriptController = {
    generate: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { prompt, niche } = generateScriptSchema.parse(request.body);
            const user = (request as any).user;

            // 1. Generate Script using AI Service
            const script = await aiService.generateViralScript(prompt, niche);

            // 2. Save to Database
            const { data, error } = await supabase
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

            if (error) throw error;

            // 3. Log usage (optional but recommended in GEMINI.md)
            await supabase.from('usage_logs').insert({
                user_id: user.id,
                action: 'generate_script',
                tokens_used: 0 // Update with actual token count later
            });

            return reply.send({
                success: true,
                data,
            });
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                return reply.status(400).send({ success: false, error: err.issues });
            }
            return reply.status(500).send({ success: false, error: err.message });
        }
    },

    getHistory: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const user = (request as any).user;

            const { data, error } = await supabase
                .from('scripts')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return reply.send({
                success: true,
                data,
            });
        } catch (err: any) {
            return reply.status(500).send({ success: false, error: err.message });
        }
    },
};
