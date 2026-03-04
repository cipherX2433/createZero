import { FastifyRequest, FastifyReply } from 'fastify';
import { aiService } from '../ai/ai.service';
import { supabase } from '../db/supabase';
import { z } from 'zod';

const generateScriptSchema = z.object({
    prompt: z.string().min(3),
    niche: z.string().min(1),
    purpose: z.string().optional().default(''),
    description: z.string().optional().default(''),
});

export const scriptController = {
    generate: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { prompt, niche, purpose, description } = generateScriptSchema.parse(request.body);
            const user = (request as any).user;

            // 1. Generate Script content using AI Service
            const script = await aiService.generateViralScript(prompt, niche, purpose, description);

            // 2. Generate the actual social media post IMAGE using Imagen
            const imageDataUrl = await aiService.generatePostImage(
                niche,
                prompt,
                purpose,
                script.headline,
                script.key_points || [],
                script.cta,
                description + " " + "Add visual elements and a logo relevant to this niche."
            );

            // 3. Save to Database
            const { data, error } = await supabase
                .from('scripts')
                .insert({
                    user_id: user.id,
                    hook: script.hook_quote || script.headline,
                    body: script.subtext,
                    cta: script.cta,
                    caption: script.footer_line || "",
                    hashtags: script.hashtags,
                    viral_score: script.virality_score,
                    metadata: {
                        prompt,
                        niche,
                        purpose,
                        headline: script.headline,
                        key_points: script.key_points,
                        niche_label: script.niche_label,
                        has_generated_image: !!imageDataUrl,
                    }
                })
                .select()
                .single();

            if (error) throw error;

            // 4. Log usage
            await supabase.from('usage_logs').insert({
                user_id: user.id,
                action: 'generate_script',
                tokens_used: 0
            });

            return reply.send({
                success: true,
                data: {
                    ...data,
                    // Send everything the frontend expects
                    headline: script.headline,
                    subtext: script.subtext,
                    hook_quote: script.hook_quote,
                    key_points: script.key_points,
                    footer_line: script.footer_line,
                    virality_score: script.virality_score,
                    niche_label: script.niche_label,
                    image_url: imageDataUrl,
                },
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
