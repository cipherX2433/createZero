import { FastifyRequest, FastifyReply } from "fastify";
import { aiService } from "../ai/ai.service";
import { selectLayout } from "../services/selectlayout.service";
import { generateDesign } from "../services/design.service";
import { supabase } from "../db/supabase";
import { z } from "zod";

const schema = z.object({
  prompt: z.string(),
  niche: z.string(),
  purpose: z.string().optional(),
  description: z.string().optional(),
  brand_name: z.string().optional(),
  tone: z.string().optional()
});

export const scriptController = {

  generate: async (request: FastifyRequest, reply: FastifyReply) => {

    const { prompt, niche, purpose, description, brand_name, tone } =
      schema.parse(request.body);

    const user = (request as any).user;

    const { count } = await supabase
      .from("scripts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    const callCount = count ?? 0;

    const script = await aiService.generateViralScript(
      prompt,
      niche,
      purpose,
      description,
      brand_name,
      callCount,
      tone
    );

    const background =
      await aiService.generateBackgroundImage(niche);

    const layout = selectLayout(script);

    const design = generateDesign(niche);

    await supabase.from("scripts").insert({
      user_id: user.id,
      hook: script.hook_quote,
      body: script.subtext,
      cta: script.cta,
      caption: script.footer_line || "",
      hashtags: script.hashtags,
      viral_score: script.virality_score,
      metadata: {
        headline: script.headline,
        key_points: script.key_points,
        background,
        layout,
        design
      }
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

  },

  getHistory: async (request: FastifyRequest, reply: FastifyReply) => {

    const user = (request as any).user;

    const { data, error } = await supabase
      .from("scripts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      return reply.send({
        success: false,
        error: error.message
      });
    }

    return reply.send({
      success: true,
      data: data || []
    });

  }

};