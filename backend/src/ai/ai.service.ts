import { InferenceClient } from "@huggingface/inference";

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

    constructor() {
        this.hf = new InferenceClient(process.env.HF_TOKEN);
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
        return `data:image/png;base64,${buffer.toString("base64")}`;
    }

}

export const aiService = new AIService();