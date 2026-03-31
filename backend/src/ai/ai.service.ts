import dns from "node:dns";
import { GoogleGenAI } from "@google/genai";
import { InferenceClient } from "@huggingface/inference";
import { supabase } from "../db/supabase";

// Fix for Node 18+ fetch IPv6 routing timeouts to AWS/Supabase
dns.setDefaultResultOrder('ipv4first');


// Map aspect ratios to pixel dimensions for SDXL
// SDXL works best with dimensions that are multiples of 8
const ASPECT_DIMENSIONS: Record<string, Record<string, { width: number; height: number }>> = {
    "720P": {
        "1:1": { width: 720, height: 720 },
        "16:9": { width: 1024, height: 576 },
        "9:16": { width: 576, height: 1024 },
        "4:3": { width: 960, height: 720 },
        "3:4": { width: 720, height: 960 },
        "5:4": { width: 896, height: 720 },
        "4:5": { width: 720, height: 896 },
        "3:2": { width: 1024, height: 680 },
        "2:3": { width: 680, height: 1024 },
        "21:9": { width: 1024, height: 440 },
    },
    "1080P": {
        "1:1": { width: 1024, height: 1024 },
        "16:9": { width: 1024, height: 576 },
        "9:16": { width: 576, height: 1024 },
        "4:3": { width: 1024, height: 768 },
        "3:4": { width: 768, height: 1024 },
        "5:4": { width: 1024, height: 816 },
        "4:5": { width: 816, height: 1024 },
        "3:2": { width: 1024, height: 680 },
        "2:3": { width: 680, height: 1024 },
        "21:9": { width: 1024, height: 440 },
    }
};

export class AIService {

    private hf: InferenceClient;
    private genai: GoogleGenAI;

    constructor() {
        console.log("HF TOKEN CHECK:",
            process.env.HF_TOKEN
                ? `FOUND → ${process.env.HF_TOKEN.slice(0, 12)}...`
                : "MISSING ❌"
        );
        console.log("GEMINI API KEY CHECK:",
            process.env.GEMINI_API_KEY
                ? `FOUND → ${process.env.GEMINI_API_KEY.slice(0, 12)}...`
                : "MISSING ❌"
        );

        this.hf = new InferenceClient(process.env.HF_TOKEN);
        this.genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    }

    /**
     * Upload a buffer to Supabase Storage and return the public URL.
     * Images → DevZeroImage bucket | Videos → DevZeroVideo bucket
     */
    private async uploadToStorage(
        buffer: Buffer,
        mimeType: "image/png" | "video/mp4"
    ): Promise<string> {
        const isImage = mimeType === "image/png";
        const bucket = isImage ? "DevZeroImage" : "DevZeroVideo";
        const ext = isImage ? "png" : "mp4";
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        // Wrap the NodeJS Buffer in a native JS Blob. Node's internal fetch handles
        // Blobs perfectly, completely avoiding the DB timeout / stream hang bugs.
        const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });

        const { error } = await supabase.storage
            .from(bucket)
            .upload(fileName, blob, {
                contentType: mimeType,
                upsert: false,
            });

        if (error) {
            console.error("[Storage] Upload failed:", error.message);
            throw new Error(`Storage upload failed: ${error.message}`);
        }

        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        console.log(`[Storage] Uploaded to ${bucket}:`, urlData.publicUrl);
        return urlData.publicUrl;
    }

    /**
     * Generate any image from a user prompt with configurable resolution and aspect ratio.
     */
    async generateImage(
        prompt: string,
        resolution: string = "720P",
        aspectRatio: string = "16:9"
    ): Promise<string> {

        const dims = ASPECT_DIMENSIONS[resolution]?.[aspectRatio]
            ?? ASPECT_DIMENSIONS["720P"]["16:9"];

        // Ensure dimensions are multiples of 8 (required by SDXL)
        const width = Math.round(dims.width / 8) * 8;
        const height = Math.round(dims.height / 8) * 8;

        console.log(`[AI] Generating image: resolution=${resolution}, aspectRatio=${aspectRatio}, dims=${width}x${height}`);
        console.log(`[AI] Prompt: ${prompt.substring(0, 80)}...`);

        const image = await this.hf.textToImage({
            model: "stabilityai/stable-diffusion-xl-base-1.0",
            inputs: prompt,
            parameters: {
                width,
                height,
            }
        });

        console.log(`[AI] Image generated successfully (${width}x${height})`);

        const buffer = Buffer.from(await (image as any).arrayBuffer());
        return await this.uploadToStorage(buffer, "image/png");
    }

    /**
     * Generate a short video clip from a user prompt via Google Gemini Veo 2.
     */
    async generateVideo(
        prompt: string,
        resolution: string = "720P",
        aspectRatio: string = "16:9"
    ): Promise<string> {
        console.log(`[AI] Generating video via Gemini Veo 2: ${prompt.substring(0, 80)}`);

        // Map aspect ratio to Gemini format
        const geminiAspectRatio = aspectRatio.replace(":", ":") as "16:9" | "9:16";
        
        // Start video generation with Veo 2
        let operation = await this.genai.models.generateVideos({
            model: "veo-2.0-generate-001",
            prompt: prompt,
            config: {
                aspectRatio: geminiAspectRatio,
                numberOfVideos: 1,
            },
        });

        // Poll until the video generation is complete
        console.log("[AI] Waiting for Gemini Veo 2 video generation...");
        while (!operation.done) {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            operation = await this.genai.operations.getVideosOperation({
                operation: operation,
            });
            console.log("[AI] Video generation status: pending...");
        }

        // Get the generated video
        const generatedVideos = operation.response?.generatedVideos;
        if (!generatedVideos || generatedVideos.length === 0) {
            throw new Error("No video was generated by Gemini Veo 2");
        }

        const video = generatedVideos[0];
        if (!video.video?.uri) {
            throw new Error("Generated video has no URI");
        }

        // Download the video from Gemini
        const videoUri = video.video.uri;
        console.log(`[AI] Downloading video from: ${videoUri}`);
        
        // Gemini returns a files API URI, need to fetch the actual video bytes
        const response = await fetch(videoUri, {
            headers: {
                "x-goog-api-key": process.env.GEMINI_API_KEY!
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to download video: ${response.statusText}`);
        }
        
        const buffer = Buffer.from(await response.arrayBuffer());

        console.log("[AI] Gemini Veo 2 video generated successfully");
        return await this.uploadToStorage(buffer, "video/mp4");
    }

}

export const aiService = new AIService();