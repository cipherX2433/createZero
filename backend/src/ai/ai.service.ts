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

    async generateViralScript(prompt: string, niche: string, purpose: string = ''): Promise<ScriptResponse> {
        if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here' || this.apiKey === 'your_gemini_api_key') {
            console.warn("GEMINI_API_KEY missing, using mock response");
            return this.getMockResponse(niche, prompt, purpose);
        }

        try {
            const purposeContext = purpose ? `\nPost Purpose/Goal: "${purpose}"` : '';

            const systemPrompt = `You are an elite viral content strategist specializing in short-form social media content for the ${niche} niche.

Your task:
- Topic/Idea: "${prompt}"${purposeContext}

Create a scroll-stopping viral post script. Rules:
1. Hook must create INSTANT pattern interrupt — no generic openers
2. Body must deliver real value in short, punchy sentences
3. CTA must be specific and action-oriented
4. Caption must be concise and magnetic
5. Hashtags must be targeted, not just popular
6. Viral score: honest assessment (70-95 for great content)

Output ONLY valid JSON, no markdown:
{
  "hook": "scroll-stopping first sentence that creates curiosity or controversy",
  "body": "value-packed middle section with specific insights",
  "cta": "specific call-to-action",
  "caption": "short punchy caption (under 100 chars)",
  "hashtags": ["relevant", "targeted", "tags"],
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
            return this.getMockResponse(niche, prompt, purpose);
        }
    }

    private getMockResponse(niche: string, prompt: string, purpose: string): ScriptResponse {
        const purposeHint = purpose ? ` (Goal: ${purpose})` : '';
        return {
            hook: `The #1 mistake 97% of ${niche} creators make${purposeHint}...`,
            body: `Here's what separates the top 1% when it comes to "${prompt}": They obsess over outcomes, not activities. Here are 3 specific things they do differently that no one is talking about.`,
            cta: `Save this before it disappears. Follow for daily ${niche} breakdowns. 👇`,
            caption: `Most ${niche} advice is wrong. Here's the truth. 🔥`,
            hashtags: ["viral", niche.toLowerCase().replace(/\s+/g, ''), "growth", "content", "strategy"],
            viral_score: 88
        };
    }
}

export const aiService = new AIService();

