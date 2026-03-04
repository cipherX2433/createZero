import { z } from 'zod';

export const visualDesignSchema = z.object({
    style: z.enum(['modern', 'minimal', 'bold']),
    background: z.string(),
    color_palette: z.array(z.string()),
    font_style: z.string(),
    layout: z.string(),
});

export const scriptResponseSchema = z.object({
    headline: z.string(),
    subtext: z.string(),
    hook_quote: z.string().optional(),
    key_points: z.array(z.string()).optional(),
    cta: z.string(),
    footer_line: z.string().optional(),
    hashtags: z.array(z.string()),
    virality_score: z.number().min(0).max(100),
    niche_label: z.string().optional()
});

export type ScriptResponse = z.infer<typeof scriptResponseSchema>;

export class AIService {
    private apiKey: string;
    private apiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY || '';
    }

    async generateViralScript(prompt: string, niche: string, purpose: string = '', description: string = ''): Promise<ScriptResponse> {
        if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here' || this.apiKey === 'your_gemini_api_key') {
            console.warn("GEMINI_API_KEY missing, using mock response");
            return this.getMockResponse(niche, prompt, purpose);
        }

        try {
            const systemPrompt = `You are an elite social media content strategist and viral post architect with 10+ years of experience creating content that consistently reaches millions of people. You specialize in crafting posts that stop the scroll, trigger saves, and drive massive engagement.

Your task: Generate a complete viral social media post based on the user's inputs. You must deeply understand the niche's culture, language, and what resonates with that audience.

TARGET NICHE: ${niche}
TOPIC / IDEA: ${prompt}
POST GOAL: ${purpose}
ADDITIONAL CONTEXT: ${description || "None provided"}

CRITICAL RULES:
- Write like a TOP creator in that niche, NOT like an AI
- Use power words and proven viral frameworks (curiosity gaps, contrarian angles, bold claims)
- The headline must be IMPOSSIBLE to ignore - use numbers, controversy, or a bold promise
- Match the tone exactly to the niche (e.g., Finance = authoritative/stoic, Marketing = energetic/direct)
- Every word must earn its place - no fluff, no filler
- The CTA must match the goal: "${purpose}"

OUTPUT FORMAT (respond ONLY in strictly valid JSON, no markdown):
{
  "headline": "Short punchy headline max 10 words, ALL CAPS allowed for emphasis",
  "subtext": "1-2 lines of supporting text that deepens the hook",
  "hook_quote": "A bold italic quote or statistic that appears as a callout (max 20 words)",
  "key_points": ["point 1", "point 2", "point 3"],
  "cta": "Strong call-to-action that matches the goal",
  "footer_line": "One-liner that reinforces the brand/theme",
  "hashtags": ["tag1", "tag2", "tag3"],
  "virality_score": 85,
  "niche_label": "${niche}"
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
        return {
            headline: `THE TRUTH ABOUT ${prompt.toUpperCase()}`,
            subtext: `I spent 5 years figuring this out so you don't have to. Here is the exact framework.`,
            hook_quote: `Most people fail because they focus on the wrong metrics.`,
            key_points: [
                `Stop doing what everyone else is doing.`,
                `Focus on deep work and unscalable systems initially.`,
                `Double down on your unfair advantage.`
            ],
            cta: `Save this post and apply it today. Follow for more.`,
            footer_line: `AI Generated · Ready to Share`,
            hashtags: ["viral", niche.toLowerCase().replace(/\s+/g, ''), "growth", "strategy"],
            virality_score: 92,
            niche_label: niche
        };
    }

    async generatePostImage(
        niche: string,
        topic: string,
        goal: string,
        headline: string,
        contentPoints: string[],
        cta: string,
        description: string = ''
    ): Promise<string | null> {
        if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here' || this.apiKey === 'your_gemini_api_key') {
            return null;
        }

        // Niche-specific visual themes with logo/icon suggestions
        const nicheThemes: Record<string, { colors: string; icons: string; mood: string }> = {
            'tech / saas': {
                colors: 'deep navy #0D1B2A, electric blue #1565C0, cyan accent #00E5FF, white text',
                icons: 'circuit board patterns, code brackets, server icons, startup logo marks, silicon chip graphics',
                mood: 'futuristic, clean, data-driven'
            },
            'finance / investing': {
                colors: 'dark charcoal #1A1A2E, gold #FFD700, emerald green #00B341, white',
                icons: 'bull symbol, stock chart uptrend arrow, gold bar, financial graph, dollar sign badges',
                mood: 'premium, wealth, authority'
            },
            'health & fitness': {
                colors: 'dark slate #1C1C2E, electric lime #CDFF00, orange #FF6B35, white',
                icons: 'dumbbell silhouette, lightning bolt, heart rate graph, muscle flex icon',
                mood: 'energetic, motivating, dynamic'
            },
            'personal development': {
                colors: 'deep purple #1A0533, violet #7C3AED, gold #F59E0B, white',
                icons: 'brain icon, upward arrow, mountain peak, sunrise, book icon',
                mood: 'inspirational, mindful, aspirational'
            },
            'marketing': {
                colors: 'dark #0F0F1A, vibrant coral #FF4757, sky blue #1E90FF, white',
                icons: 'megaphone, graph chart, target bullseye, social media icons (stylized)',
                mood: 'bold, energetic, conversion-focused'
            },
            'entrepreneurship': {
                colors: 'black #0A0A0A, orange #FF6B00, gold #FFD700, white',
                icons: 'rocket launch, chess king piece, lion silhouette, compass, crown',
                mood: 'bold, elite, ambitious'
            },
        };

        const nicheKey = niche.toLowerCase();
        const theme = nicheThemes[nicheKey] || {
            colors: 'dark #0F172A, indigo #6366F1, purple #8B5CF6, white',
            icons: 'abstract geometric shapes, professional badges, glowing orbs',
            mood: 'modern, clean, professional'
        };

        const pointsList = contentPoints.slice(0, 3).map((p, i) => `${i + 1}. ${p}`).join('  ');
        const extraContext = description ? `Context: ${description}. ` : '';

        // Master image generation prompt following the ai_role workflow
        const imagePrompt = `Professional social media post image, Instagram square format 1:1, ultra high quality, photorealistic design.

CONTENT TO RENDER ON THE IMAGE:
- Bold Headline text: "${headline}"
- Supporting hook text: "${topic}"  
- Key points listed with numbered circles: ${pointsList}
- CTA banner at bottom: "${cta}"

VISUAL DESIGN:
- Background: Rich dark gradient with ${theme.colors}, depth and dimension
- Layout: Centered composition, headline at top 1/3, bullet points in middle, CTA at bottom with solid pill/button shape
- Icons & Graphics: ${theme.icons} — minimal stylized vector-style, glowing subtle effect around icons, niche logo badge in top corner
- Typography: Bold sans-serif headline in white with accent color highlight on key word, smaller readable body text, tracking clean
- Decorative elements: Subtle bokeh glow spots, geometric grid lines in background, thin border frame, gradient overlay strips
- Mood: ${theme.mood}, viral social media aesthetic
- Color scheme: ${theme.colors}

${extraContext}Post Goal: ${goal}

Style: Modern minimal premium social media post, NOT a photo collage. Pure graphic design. Resembles a high-end agency-designed Instagram carousel card. No stock photos. Text must be perfectly readable. Similar to a top creator's viral post design.`;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        instances: [{ prompt: imagePrompt }],
                        parameters: {
                            sampleCount: 1,
                            aspectRatio: '1:1',
                            safetyFilterLevel: 'block_few',
                        }
                    })
                }
            );

            if (!response.ok) {
                console.error('Imagen API error:', response.status, await response.text());
                return null;
            }

            const result = await response.json();
            const imageBase64 = result?.predictions?.[0]?.bytesBase64Encoded;
            if (!imageBase64) return null;

            return `data:image/png;base64,${imageBase64}`;
        } catch (err) {
            console.error('Image generation failed:', err);
            return null;
        }
    }
}

export const aiService = new AIService();
