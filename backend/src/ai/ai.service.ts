import { InferenceClient } from "@huggingface/inference";
import { generateViralScriptPrompt, nicheThemes } from "./prompts";

export class AIService {

    private hf: InferenceClient;

    constructor() {
        this.hf = new InferenceClient(process.env.HF_TOKEN);
    }

    private parseSafeJSON(text: string) {
        try {
            // First try direct parse
            return JSON.parse(text);
        } catch (e) {
            // Try to extract JSON between { and }
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    // Try to fix missing closing quotes and braces
                    let candidate = jsonMatch[0];
                    if (!candidate.endsWith("}")) candidate += "}";
                    return JSON.parse(candidate);
                } catch (e2) {
                    // Final attempt: aggressive cleanup (removing trailing commas, bad characters)
                    const cleaned = jsonMatch[0]
                        .replace(/,\s*([\]}])/g, "$1") // remove trailing commas
                        .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":') // ensure keys are quoted
                        .replace(/:\s*"/g, ': "') // space after colon
                        .replace(/,\s*"/g, ', "'); // space after comma
                    return JSON.parse(cleaned);
                }
            }
            throw e;
        }
    }

    async generateViralScript(
        prompt: string,
        niche: string,
        purpose = "",
        description = "",
        brandName = "",
        callCount = 0,
        tone = ""
    ) {
        const systemPrompt = generateViralScriptPrompt(
            prompt,
            niche,
            purpose,
            description,
            brandName,
            callCount,
            tone
        );

        let lastError;
        // Retry logic with lower temperature for better JSON structure
        for (const temp of [0.7, 0.2]) {
            try {
                const response = await this.hf.chatCompletion({
                    model: "meta-llama/Meta-Llama-3-8B-Instruct",
                    messages: [{ role: "user", content: systemPrompt }],
                    max_tokens: 600,
                    temperature: temp
                });

                const text = response.choices[0].message.content;
                if (!text) continue;

                return this.parseSafeJSON(text);
            } catch (err) {
                lastError = err;
                console.error(`AI Attempt with temp ${temp} failed:`, err);
            }
        }

        throw lastError || new Error("AI generation failed");
    }

    async generateBackgroundImage(niche: string) {

        const theme = nicheThemes[niche.toLowerCase()] ?? {
            colors: "dark gradient background",
            icons: "minimal geometric shapes",
            mood: "clean social media graphic",
            typography: "bold sans serif"
        };

        const prompt = `
minimal social media background
${theme.colors}
${theme.icons}
${theme.mood}

NO TEXT
NO WORDS
abstract graphic background
`;

        const image = await this.hf.textToImage({
            model: "stabilityai/stable-diffusion-xl-base-1.0",
            inputs: prompt
        });

        const buffer = Buffer.from(await (image as any).arrayBuffer());

        return `data:image/png;base64,${buffer.toString("base64")}`;
    }

}

export const aiService = new AIService();