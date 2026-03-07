import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { apiService } from '@/services/api.service';
import SocialPostCanvas from '@/components/socialPostCanva';
import Sidebar from '@/components/Sidebar';
import { Download, Clock } from 'lucide-react';

const NICHES = [
    { label: 'Tech / SaaS', value: 'tech_saas' },
    { label: 'Health & Fitness', value: 'health_fitness' },
    { label: 'Finance & Investing', value: 'finance' },
    { label: 'Personal Branding', value: 'personal_brand' },
    { label: 'E-Commerce / DTC', value: 'ecommerce' },
    { label: 'Marketing & Growth', value: 'marketing' },
    { label: 'Mindset & Motivation', value: 'mindset' },
    { label: 'Education & Coaching', value: 'education' },
];

interface LocationState {
    prompt?: string;
    niche?: string;
    goal?: string;
    autoGenerate?: boolean;
}

export default function Created() {
    const location = useLocation();
    const state = location.state as LocationState | null;

    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [error, setError] = useState('');
    const canvasRef = useRef<any>(null);
    const hasGenerated = useRef(false);

    const fetchHistory = async () => {
        try {
            const data = await apiService.fetchScripts();
            setHistory(data || []);
        } catch (e) {
            console.error('Failed to fetch history:', e);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    // Auto-generate when arriving with prompt from dashboard
    useEffect(() => {
        if (state?.prompt && state?.autoGenerate && !hasGenerated.current) {
            hasGenerated.current = true;
            generateFromPrompt(state.prompt, state.niche, state.goal);
        }
    }, [state]);

    const generateFromPrompt = async (prompt: string, niche?: string, goal?: string) => {
        setError('');
        setLoading(true);
        setPost(null);

        try {
            const currentNiche = niche || 'tech_saas';
            const currentGoal = goal || 'Drive Engagement';
            const nicheLabel = NICHES.find(n => n.value === currentNiche)?.label || currentNiche;

            const apiData = await apiService.generateScript({
                prompt,
                niche: nicheLabel,
                purpose: currentGoal,
            });

            const mappedPost = apiData.script ? {
                ...apiData.script,
                background: apiData.background,
                layout: apiData.layout,
                design: apiData.design
            } : apiData;

            setPost(mappedPost);
            fetchHistory();
        } catch (e: any) {
            setError(e.message || 'Failed to generate post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (canvasRef.current) {
            canvasRef.current.download();
        }
    };

    const loadFromHistory = (h: any) => {
        const mappedPost = {
            headline: h.metadata?.headline || h.hook,
            subtext: h.body,
            hook_quote: h.hook,
            key_points: h.metadata?.key_points || [],
            cta: h.cta,
            footer_line: h.caption,
            hashtags: h.hashtags,
            virality_score: h.viral_score,
            virality_explanation: h.metadata?.virality_explanation,
            background: h.metadata?.background,
            layout: h.metadata?.layout,
            design: h.metadata?.design
        };
        setPost(mappedPost);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#000', fontFamily: "'Geist', sans-serif", color: '#fff', display: 'flex' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&family=Space+Mono:ital@0;1&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: #000; }
                ::-webkit-scrollbar-thumb { background: #222; border-radius: 3px; }
                .gen-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(20,184,166,0.3) !important; }
                .gen-btn:active { transform: translateY(0); }
                .pulse { animation: pulse 2s ease-in-out infinite; }
                @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .fade-up { animation: fadeUp 0.5s ease forwards; }
                .history-item:hover { background: rgba(255,255,255,0.05) !important; border-color: rgba(20,184,166,0.3) !important; }
            `}</style>

            <Sidebar />

            {/* Main Content */}
            <div style={{ marginLeft: 72, flex: 1, display: 'flex', minHeight: '100vh' }}>

                {/* Center - Post Preview */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, position: 'relative' }}>
                    {/* Background Glows */}
                    <div style={{ position: 'fixed', top: '-10%', right: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(20,184,166,0.08), transparent 60%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'fixed', bottom: '-10%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.03), transparent 60%)', pointerEvents: 'none' }} />

                    {/* Empty State */}
                    {!post && !loading && !error && (
                        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center' }}>
                            <div style={{ fontSize: 56, marginBottom: 8 }}>⚡</div>
                            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#444' }}>No creation yet</div>
                            <div style={{ fontSize: 14, color: '#333', maxWidth: 320 }}>Go to Home and enter your idea in the prompt bar to generate your first viral post.</div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div style={{ padding: '14px 20px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, color: '#fca5a5', fontSize: 14, maxWidth: 500, textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                            <div style={{ width: 480, height: 480, borderRadius: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                                <div className="pulse" style={{ fontSize: 48 }}>⚡</div>
                                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: '#555' }}>Generating your post...</div>
                                <div style={{ fontSize: 13, color: '#333' }}>Creating viral content & AI-powered image</div>
                                <div style={{ width: 200, height: 3, background: '#1a1a2e', borderRadius: 2, overflow: 'hidden', marginTop: 8 }}>
                                    <div className="pulse" style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg, #14b8a6, #6366f1)', borderRadius: 2 }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Generated Post */}
                    {post && !loading && post.background && (
                        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%', maxWidth: 560 }}>
                            <div style={{ width: 540, height: 540, borderRadius: 24, overflow: 'hidden', background: '#0a0a0f', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: 1080, height: 1080 }}>
                                    <SocialPostCanvas
                                        ref={canvasRef}
                                        background={post.background}
                                        headline={post.headline}
                                        points={post.key_points || []}
                                        cta={post.cta}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleDownload}
                                className="gen-btn"
                                style={{
                                    padding: '14px 28px',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    border: 'none',
                                    borderRadius: 14,
                                    color: '#fff',
                                    fontSize: 15,
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 10,
                                    transition: 'all 0.2s',
                                    width: '100%',
                                    boxShadow: '0 4px 16px rgba(16,185,129,0.25)'
                                }}
                            >
                                <Download size={18} /> Download Image
                            </button>

                            {/* Virality Analysis */}
                            {post.virality_explanation && (
                                <div style={{
                                    background: 'rgba(20,184,166,0.04)',
                                    border: '1px solid rgba(20,184,166,0.12)',
                                    borderRadius: 16,
                                    padding: '18px 22px',
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 10
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ fontSize: 14 }}>🧠</div>
                                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#14b8a6', textTransform: 'uppercase' }}>Virality Analysis</div>
                                    </div>
                                    <div style={{ fontSize: 13, color: '#aaa', lineHeight: 1.7, fontStyle: 'italic', borderLeft: '2px solid rgba(20,184,166,0.3)', paddingLeft: 14 }}>
                                        "{post.virality_explanation}"
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Panel - History */}
                <div style={{
                    width: 280,
                    minWidth: 280,
                    borderLeft: '1px solid rgba(255,255,255,0.06)',
                    padding: '24px 16px',
                    overflowY: 'auto',
                    background: 'rgba(5,5,10,0.5)'
                }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#555', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                        <Clock size={14} /> Recent Creations
                    </div>

                    {history.length === 0 && (
                        <div style={{ fontSize: 12, color: '#333', textAlign: 'center', marginTop: 40 }}>
                            No creations yet. Generate your first post!
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {history.map((h) => (
                            <div
                                key={h.id}
                                className="history-item"
                                onClick={() => loadFromHistory(h)}
                                style={{
                                    padding: '14px',
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: 12,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#ddd', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {h.metadata?.headline || h.hook}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: 10, color: '#444' }}>
                                        {new Date(h.created_at).toLocaleDateString()}
                                    </div>
                                    <div style={{ fontSize: 10, color: '#14b8a6', fontWeight: 700 }}>
                                        ⚡ {h.viral_score}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
