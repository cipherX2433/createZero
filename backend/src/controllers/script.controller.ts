import { FastifyRequest, FastifyReply } from "fastify";
import { aiService } from "../ai/ai.service";
import { supabase } from "../db/supabase";
import { z } from "zod";

const generateSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  resolution: z.string().optional().default("720P"),
  aspect_ratio: z.string().optional().default("16:9"),
  mode: z.enum(["Image", "Video"]).optional().default("Image"),
});

export const scriptController = {

  generate: async (request: FastifyRequest, reply: FastifyReply) => {
    const { prompt, resolution, aspect_ratio, mode } = generateSchema.parse(request.body);
    const user = (request as any).user;

    console.log(`[Controller] Generate - mode: ${mode}, resolution: ${resolution}, aspect_ratio: ${aspect_ratio}`);

    try {
      if (mode === "Video") {
        // ── VIDEO PATH ────────────────────────────────────────────────────────
        const video = await aiService.generateVideo(prompt, resolution, aspect_ratio);

        await supabase.from("scripts").insert({
          user_id: user.id,
          hook: prompt,
          body: "",
          cta: "",
          caption: "",
          hashtags: [],
          viral_score: 0,
          metadata: { prompt, video, model: "animatediff-lightning", resolution, aspect_ratio, create_mode: "Video" }
        });

        return reply.send({
          success: true,
          data: { mode: "Video", video, prompt, resolution, aspect_ratio }
        });

      } else {
        // ── IMAGE PATH (unchanged) ────────────────────────────────────────────
        const image = await aiService.generateImage(prompt, resolution, aspect_ratio);

        await supabase.from("scripts").insert({
          user_id: user.id,
          hook: prompt,
          body: "",
          cta: "",
          caption: "",
          hashtags: [],
          viral_score: 0,
          metadata: { prompt, background: image, model: "stable-diffusion-xl", resolution, aspect_ratio, create_mode: "Image" }
        });

        return reply.send({
          success: true,
          data: { mode: "Image", image, prompt, resolution, aspect_ratio }
        });
      }

    } catch (err: any) {
      console.error("[Controller] Generation error:", err.message);
      return reply.status(500).send({
        success: false,
        error: err.message || "Generation failed"
      });
    }
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
      return reply.status(500).send({ success: false, error: error.message });
    }

    // Normalize so frontend always gets { id, created_at, prompt, mode, resolution, aspect_ratio, mediaUrl }
    const normalized = (data || []).map((item: any) => {
      const meta = item.metadata || {};
      return {
        id: item.id,
        created_at: item.created_at,
        prompt: meta.prompt || item.hook || "",
        mode: meta.create_mode || "Image",
        resolution: meta.resolution || "720P",
        aspect_ratio: meta.aspect_ratio || "16:9",
        mediaUrl: meta.background || meta.video || meta.image || null,
      };
    });

    return reply.send({ success: true, data: normalized });
  }

};