import { FastifyRequest, FastifyReply } from "fastify";
import { aiService } from "../ai/ai.service";
import { supabase } from "../db/supabase";
import { z } from "zod";

const generateSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  resolution: z.string().optional().default("720P"),
  aspect_ratio: z.string().optional().default("16:9"),
});

export const scriptController = {

  generate: async (request: FastifyRequest, reply: FastifyReply) => {
    const { prompt, resolution, aspect_ratio } = generateSchema.parse(request.body);
    const user = (request as any).user;

    console.log(`[Controller] Generate request - resolution: ${resolution}, aspect_ratio: ${aspect_ratio}`);

    // Generate image with user's selected resolution and aspect ratio
    const image = await aiService.generateImage(prompt, resolution, aspect_ratio);

    // Store in database
    await supabase.from("scripts").insert({
      user_id: user.id,
      hook: prompt,
      body: "",
      cta: "",
      caption: "",
      hashtags: [],
      viral_score: 0,
      metadata: {
        prompt,
        background: image,
        model: "stable-diffusion-xl",
        resolution,
        aspect_ratio,
        create_mode: "Image",
      }
    });

    return reply.send({
      success: true,
      data: {
        image,
        prompt,
        model: "stable-diffusion-xl",
        resolution,
        aspect_ratio,
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
      .limit(50);

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