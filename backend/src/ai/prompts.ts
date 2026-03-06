// ─────────────────────────────────────────────────────────────
// Script Architect · Prompt Engine v4 (Production Grade)
// ─────────────────────────────────────────────────────────────

const NICHE_TONE_GUIDES: Record<string, string> = {

    "tech / saas":
        "Write like a YC founder or elite indie hacker. Technical but simple. Use builder language: ship, iterate, 0→1, leverage. Avoid marketing fluff.",

    "finance & investing":
        "Write like a disciplined hedge fund manager. Data-driven. Specific numbers, ROI, % returns. Tone: authoritative, calm, confident.",

    "health & fitness":
        "Write like an elite strength coach. Direct, blunt, motivating. Use strong verbs and physical metaphors. Short punchy sentences.",

    "personal branding":
        "Write like a top LinkedIn creator. Personal storytelling. Use curiosity hooks and relatable lessons.",

    "e-commerce / dtc":
        "Write like a DTC growth operator. Conversion-focused, urgency-driven. Emphasize outcomes and results.",

    "marketing & growth":
        "Write like a growth strategist. Framework-driven. Tactical insights readers can implement immediately.",

    "mindset & motivation":
        "Write like David Goggins + Naval Ravikant. Philosophical, bold truths, emotionally impactful.",

    "education & coaching":
        "Write like a world-class educator. Structured learning. Clear frameworks and actionable steps.",

    "entrepreneurship":
        "Write like a battle-tested founder. Honest, strategic, focused on leverage and opportunity.",

    "real estate":
        "Write like an experienced investor. Numbers, cap rates, ROI, deal insights."
};


const TONE_GUIDES: Record<string, string> = {
    "professional": "Direct, authoritative, polished, and result-oriented. Avoid slang. Use industry-standard terminology.",
    "casual": "Friendly, relatable, conversational, and lighthearted. Write like you're talking to a friend over coffee. Use occasional emojis.",
    "aggressive": "Bold, disruptive, high-energy, and patterns-interrupting. Use strong stances, scroll-stopping 'hot takes', and direct challenges to common beliefs.",
    "storytelling": "Narrative-driven, emotionally resonant, and engaging. Start with a hook that draws them into a story. Use vivid descriptions and build tension."
};


// ─────────────────────────────────────────────
// Content Angles (prevents repetition)
// ─────────────────────────────────────────────

const CONTENT_ANGLES = [

    "Contrarian take challenging conventional wisdom",

    "Data-driven insight based on surprising statistic",

    "Product launch story explaining why it exists",

    "Myth busting — expose a common industry lie",

    "Before vs After transformation",

    "Urgent warning about a costly mistake",

    "Insider secret known only to professionals",

    "Bold prediction about future of the industry"

];


// ─────────────────────────────────────────────
// Visual themes per niche
// ─────────────────────────────────────────────

export const nicheThemes: Record<string, {
    colors: string
    icons: string
    mood: string
    typography: string
}> = {

    "tech / saas": {
        colors: "deep navy #0D1B2A background, electric blue #1565C0 accents, cyan highlights",
        icons: "circuit patterns, network nodes, server icons",
        mood: "futuristic tech startup",
        typography: "bold geometric sans serif"
    },

    "finance & investing": {
        colors: "charcoal background, gold highlights, emerald accents",
        icons: "bull icon, growth chart, coin stack",
        mood: "premium institutional finance",
        typography: "serif headline + modern sans body"
    },

    "health & fitness": {
        colors: "dark slate background, neon lime accent, orange secondary",
        icons: "dumbbell outline, lightning bolt, ECG line",
        mood: "high energy performance",
        typography: "condensed bold athletic font"
    },

    "marketing & growth": {
        colors: "midnight background, coral accent, sky blue highlights",
        icons: "funnel icon, target bullseye, analytics chart",
        mood: "bold tactical growth",
        typography: "modern geometric sans serif"
    },

    "entrepreneurship": {
        colors: "black background, orange accent, gold highlight",
        icons: "rocket launch, chess king piece",
        mood: "ambitious startup energy",
        typography: "bold condensed display"
    }

};



// ─────────────────────────────────────────────
// Viral Script Prompt
// ─────────────────────────────────────────────

export const generateViralScriptPrompt = (
    topic: string,
    niche: string,
    goal: string,
    description: string,
    brandName?: string,
    callCount: number = 0,
    tonePreference?: string
): string => {

    const nicheKey = niche.toLowerCase();
    const nicheTone = NICHE_TONE_GUIDES[nicheKey] || "Write clearly with authority.";

    const specificTone = tonePreference ? TONE_GUIDES[tonePreference.toLowerCase()] : "";
    const finalTone = specificTone
        ? `${specificTone} Additionally, follow this niche guidance: ${nicheTone}`
        : nicheTone;

    const angle = CONTENT_ANGLES[callCount % CONTENT_ANGLES.length];

    const hasProduct = !!brandName || (description && description.length > 10);

    const productSection = hasProduct ? `

PRODUCT CONTEXT

Brand Name: ${brandName || "the product"}

User Description:
${description}

IMPORTANT:

The product must be the HERO of the post.

Mention the brand name early.

Each key point must describe a product benefit.

CTA must direct readers to try the product.

` : "";


    return `

You are an elite viral social media strategist.

Your job is to create posts that generate massive engagement and conversions.

--------------------------------
NICHE
--------------------------------

${niche}

--------------------------------
TOPIC
--------------------------------

${topic}

--------------------------------
GOAL
--------------------------------

${goal || "Grow audience"}

--------------------------------
CONTENT ANGLE
--------------------------------

${angle}

--------------------------------
VOICE STYLE (PRIMARY DIRECTION)
--------------------------------

${finalTone}

${productSection}

--------------------------------
WRITING RULES
--------------------------------

Do NOT start headline with:

Why
How to
The secret
Most people

Avoid generic advice.

Every key point must include one of:

• number
• feature
• result
• insight

--------------------------------
JSON FORMATTING RULES
--------------------------------

1. NEVER include trailing commas.
2. NEVER include single quotes for strings (use double quotes).
3. ESCAPE all double quotes inside strings.
4. Output EXACTLY 3 items in the key_points array.
5. Ensure the niche_label EXACTLY matches the requested niche.

--------------------------------
OUTPUT FORMAT
--------------------------------

Respond ONLY with valid JSON.

No markdown.

No explanation.

JSON structure:

{
  "headline": "", (MAX 50 CHARS)
  "subtext": "", (MAX 80 CHARS)
  "hook_quote": "", (MAX 80 CHARS)
  "key_points": ["", "", ""], (MAX 60 CHARS EACH)
  "cta": "", (MAX 40 CHARS)
  "footer_line": "",
  "hashtags": ["", "", ""],
  "virality_score": 85,
  "niche_label": "${niche}"
}

`;
};




// ─────────────────────────────────────────────
// Image Prompt
// ─────────────────────────────────────────────

export const generateImagePrompt = (
    headline: string,
    topic: string,
    points: string,
    cta: string,
    theme: { colors: string; icons: string; mood: string; typography: string },
    extraContext: string,
    goal: string,
    brandName?: string
): string => {

    return `

Create a professional viral social media graphic.

Aspect Ratio: 1:1 Instagram post

TEXT CONTENT

Headline:
${headline}

Subtext:
${topic}

Key Points:
${points}

CTA Button:
${cta}

--------------------------------

Branding

${brandName ? `
Brand Name: ${brandName}

Place brand name in top left corner as styled logo text.
` : `
Add small "AI POST" badge bottom right.
`}

--------------------------------

Design Style

Colors:
${theme.colors}

Icons:
${theme.icons}

Mood:
${theme.mood}

Typography:
${theme.typography}

--------------------------------

Layout

Top area: Brand + headline

Middle: subtext + key points

Bottom: CTA button

--------------------------------

Rules

No human faces
No stock photos
Graphic design only

Ensure text is clear and readable.

${extraContext}

`;
};