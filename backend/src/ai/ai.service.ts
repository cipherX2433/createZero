import { z } from 'zod';

export const scriptResponseSchema = z.object({
    hook: z.string(),
    body: z.string(),
    cta: z.string(),
    caption: z.string(),
    hashtags: z.array(z.string()),
    viral_score: z.number().min(0).max(100),
});

export type ScriptResponse = z.infer<typeof scriptResponseSchema>;

export class AIService {
    private apiKey: string;
    private apiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY || '';
    }

    async generateViralScript(prompt: string, niche: string): Promise<ScriptResponse> {
        if (!this.apiKey || this.apiKey === 'your_gemini_api_key') {
            console.warn("GEMINI_API_KEY missing, using mock response");
            return this.getMockResponse(niche, prompt);
        }

        try {
            const systemPrompt = `You are a viral content architect for ${niche}. 
      Generate a viral short-form video script based on this idea: "${prompt}".
      Output must be strictly valid JSON according to this schema:
      {
        "hook": "scroll-stopping first sentence",
        "body": "engaging value-packed middle",
        "cta": "strong call to action",
        "caption": "short engaging caption",
        "hashtags": ["relevant", "tags"],
        "viral_score": 0-100
      }`;

            const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: systemPrompt }] }],
                    generationConfig: { responseMimeType: "application/json" }
                })
            });

            if (!response.ok) throw new Error(`Gemini API failed with status ${response.status}`);

            const result = await response.json();
            const text = result.candidates[0].content.parts[0].text;
            return scriptResponseSchema.parse(JSON.parse(text));
        } catch (err) {
            console.error("AI Generation failed, falling back to mock", err);
            return this.getMockResponse(niche, prompt);
        }
    }

    private getMockResponse(niche: string, prompt: string): ScriptResponse {
        return {
            hook: `STOP scrolling if you want to dominate the ${niche} space! 🚀`,
            body: `Most people fail at ${prompt} because they focus on the wrong things. Here's exactly how the top 1% do it differently.`,
            cta: "Follow for more elite growth strategies! 👇",
            caption: `Unlocking the secrets of ${niche}. #growth #strategy #creator`,
            hashtags: ["viral", niche.toLowerCase().replace(/\s+/g, ''), "growth"],
            viral_score: 88
        };
    }
}

export const aiService = new AIService();
