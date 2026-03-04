import { forwardRef } from "react";


interface VisualDesign {
    style: string;
    background: string;
    color_palette: string[];
    font_style: string;
    layout: string;
}

interface PostImageCardProps {
    headline?: string;
    subheadline?: string;
    hook: string;
    content_points?: string[];
    cta: string;
    caption: string;
    hashtags: string[];
    viral_score: number;
    niche: string;
    visual_design?: VisualDesign;
}

// Preset themes per style
const getTheme = (design?: VisualDesign) => {
    if (!design) return {
        bg: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        accent: '#6366f1',
        accentLight: '#a5b4fc',
        text: '#ffffff',
        textMuted: 'rgba(255,255,255,0.65)',
        cardBg: 'rgba(255,255,255,0.06)',
        border: 'rgba(255,255,255,0.12)',
    };

    const palette = design.color_palette;
    const accent = palette?.[0] || '#6366f1';
    const accentLight = palette?.[1] || '#a5b4fc';

    return {
        bg: design.background || 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        accent,
        accentLight,
        text: '#ffffff',
        textMuted: 'rgba(255,255,255,0.65)',
        cardBg: 'rgba(255,255,255,0.06)',
        border: 'rgba(255,255,255,0.10)',
    };
};

export const PostImageCard = forwardRef<HTMLDivElement, PostImageCardProps>(
    ({ headline, subheadline, hook, content_points, cta, caption, hashtags, viral_score, niche, visual_design }, ref) => {
        const theme = getTheme(visual_design);

        const scoreColor = viral_score >= 80
            ? '#22c55e'
            : viral_score >= 60
                ? '#eab308'
                : '#ef4444';

        return (
            <div
                ref={ref}
                style={{
                    width: '540px',
                    minHeight: '540px',
                    background: theme.bg,
                    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
                    color: theme.text,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '40px',
                    boxSizing: 'border-box',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '20px',
                }}
            >
                {/* Decorative glow top-right */}
                <div style={{
                    position: 'absolute', top: '-60px', right: '-60px',
                    width: '200px', height: '200px',
                    background: theme.accent,
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    opacity: 0.4,
                    pointerEvents: 'none',
                }} />

                {/* Decorative glow bottom-left */}
                <div style={{
                    position: 'absolute', bottom: '-60px', left: '-60px',
                    width: '180px', height: '180px',
                    background: theme.accentLight,
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    opacity: 0.25,
                    pointerEvents: 'none',
                }} />

                {/* Header: niche tag + viral score */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                    <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        padding: '5px 12px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '999px',
                        border: `1px solid ${theme.border}`,
                        color: theme.accentLight,
                    }}>
                        {niche}
                    </span>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: scoreColor,
                        background: `${scoreColor}18`,
                        border: `1px solid ${scoreColor}40`,
                        padding: '5px 11px',
                        borderRadius: '999px',
                    }}>
                        ⚡ {viral_score}/100
                    </div>
                </div>

                {/* Headline */}
                <div style={{ flex: 1 }}>
                    {headline && (
                        <h1 style={{
                            fontSize: '28px',
                            fontWeight: 900,
                            lineHeight: 1.2,
                            marginBottom: '8px',
                            letterSpacing: '-0.02em',
                            color: theme.text,
                        }}>
                            {headline}
                        </h1>
                    )}

                    {subheadline && (
                        <p style={{
                            fontSize: '14px',
                            color: theme.accentLight,
                            marginBottom: '20px',
                            fontWeight: 500,
                        }}>
                            {subheadline}
                        </p>
                    )}

                    {/* Hook */}
                    <p style={{
                        fontSize: '15px',
                        lineHeight: 1.6,
                        color: theme.textMuted,
                        marginBottom: '24px',
                        fontStyle: 'italic',
                    }}>
                        "{hook}"
                    </p>

                    {/* Content Points */}
                    {content_points && content_points.length > 0 && (
                        <div style={{
                            background: theme.cardBg,
                            border: `1px solid ${theme.border}`,
                            borderRadius: '14px',
                            padding: '20px',
                            marginBottom: '24px',
                        }}>
                            {content_points.map((point, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '10px',
                                    marginBottom: i < content_points.length - 1 ? '14px' : 0,
                                }}>
                                    <div style={{
                                        width: '22px',
                                        height: '22px',
                                        minWidth: '22px',
                                        borderRadius: '50%',
                                        background: theme.accent,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        color: '#fff',
                                        marginTop: '1px',
                                    }}>
                                        {i + 1}
                                    </div>
                                    <p style={{
                                        fontSize: '13px',
                                        lineHeight: 1.5,
                                        color: theme.text,
                                        margin: 0,
                                        fontWeight: 500,
                                    }}>
                                        {point}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* CTA Banner */}
                <div style={{
                    background: theme.accent,
                    borderRadius: '12px',
                    padding: '14px 20px',
                    marginBottom: '20px',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: '14px',
                    letterSpacing: '0.01em',
                    color: '#fff',
                }}>
                    {cta}
                </div>

                {/* Caption + Hashtags */}
                <div style={{ fontSize: '12px', color: theme.textMuted, lineHeight: 1.6 }}>
                    <p style={{ marginBottom: '8px' }}>{caption}</p>
                    <p style={{ color: theme.accentLight, fontWeight: 600 }}>
                        {hashtags.map(h => `#${h}`).join('  ')}
                    </p>
                </div>

                {/* Footer watermark */}
                <div style={{
                    marginTop: '20px',
                    paddingTop: '16px',
                    borderTop: `1px solid ${theme.border}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.05em', color: theme.accentLight }}>
                        CREATOR<span style={{ color: theme.accent }}>ZERO</span>
                    </span>
                    <span style={{ fontSize: '10px', color: theme.textMuted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        AI Generated · Ready to Share
                    </span>
                </div>
            </div>
        );
    }
);

PostImageCard.displayName = 'PostImageCard';
