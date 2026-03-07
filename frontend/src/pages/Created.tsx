import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { apiService } from '@/services/api.service';
import SocialPostCanvas from '@/components/socialPostCanva';
import Sidebar from '@/components/Sidebar';
import { Download, X, ChevronDown, Video, Image as ImageIcon } from 'lucide-react';

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

type MediaTab = 'video' | 'image';
type SubFilter = 'all' | 'created' | 'uploaded';

export default function Created() {
    const location = useLocation();
    const state = location.state as LocationState | null;

    const [mediaTab, setMediaTab] = useState<MediaTab>('image');
    const [subFilter, setSubFilter] = useState<SubFilter>('created');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [error, setError] = useState('');
    const [selectedPost, setSelectedPost] = useState<any>(null);
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

        try {
            const currentNiche = niche || 'tech_saas';
            const currentGoal = goal || 'Drive Engagement';
            const nicheLabel = NICHES.find(n => n.value === currentNiche)?.label || currentNiche;

            await apiService.generateScript({
                prompt,
                niche: nicheLabel,
                purpose: currentGoal,
            });

            await fetchHistory();
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

    const openPost = (h: any) => {
        setSelectedPost({
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
        });
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const mins = String(d.getMinutes()).padStart(2, '0');
        return `${month}-${day} ${hours}:${mins}`;
    };

    // Filter history items that have a background image
    const imageHistory = history.filter(h => h.metadata?.background);

    return (
        <div style={{ minHeight: '100vh', background: '#000', fontFamily: "'Geist', sans-serif", color: '#fff', display: 'flex' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: #000; }
                ::-webkit-scrollbar-thumb { background: #222; border-radius: 3px; }
                .pulse { animation: pulse 2s ease-in-out infinite; }
                @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .fade-up { animation: fadeUp 0.4s ease forwards; }
                .gallery-item { transition: all 0.2s; cursor: pointer; }
                .gallery-item:hover { transform: scale(1.02); border-color: rgba(20,184,166,0.4) !important; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
                .tab-active { color: #fff !important; }
                .tab-active::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: #fff; }
                .sub-filter-active { background: #fff !important; color: #000 !important; }
            `}</style>

            <Sidebar />

            {/* Main Content */}
            <div style={{ marginLeft: 72, flex: 1, padding: '32px 40px', overflowY: 'auto', minHeight: '100vh' }}>

                {/* Top Tabs: Video / Image */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 32, borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 24 }}>
                    {([
                        { id: 'video' as MediaTab, label: 'Video', icon: <Video size={16} /> },
                        { id: 'image' as MediaTab, label: 'Image', icon: <ImageIcon size={16} /> },
                    ]).map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setMediaTab(tab.id)}
                            className={mediaTab === tab.id ? 'tab-active' : ''}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '12px 0',
                                background: 'none',
                                border: 'none',
                                color: mediaTab === tab.id ? '#fff' : '#666',
                                fontSize: 15,
                                fontWeight: mediaTab === tab.id ? 700 : 400,
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'color 0.2s'
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* VIDEO TAB — Coming Soon */}
                {mediaTab === 'video' && (
                    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, minHeight: 400, textAlign: 'center' }}>
                        <div style={{ fontSize: 56, marginBottom: 8 }}>🎬</div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#444' }}>Video Generation</div>
                        <div style={{ fontSize: 14, color: '#333', maxWidth: 340 }}>AI-powered video generation is coming soon. Stay tuned for scroll-stopping short-form videos.</div>
                        <div style={{ padding: '8px 20px', background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: 20, fontSize: 12, color: '#14b8a6', fontWeight: 600, marginTop: 8 }}>
                            Coming Soon
                        </div>
                    </div>
                )}

                {/* IMAGE TAB */}
                {mediaTab === 'image' && (
                    <div className="fade-up">
                        {/* Sub-Filters */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '8px 16px',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 8,
                                color: '#ccc',
                                fontSize: 13,
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}>
                                All <ChevronDown size={14} />
                            </button>

                            {(['created', 'uploaded'] as SubFilter[]).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setSubFilter(f)}
                                    className={subFilter === f ? 'sub-filter-active' : ''}
                                    style={{
                                        padding: '8px 18px',
                                        background: subFilter === f ? '#fff' : 'transparent',
                                        border: subFilter === f ? 'none' : '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: 8,
                                        color: subFilter === f ? '#000' : '#777',
                                        fontSize: 13,
                                        fontWeight: subFilter === f ? 700 : 400,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div style={{ marginBottom: 32 }}>
                                <div style={{ fontSize: 12, color: '#555', marginBottom: 12 }}>Generating...</div>
                                <div style={{
                                    width: 280,
                                    height: 280,
                                    borderRadius: 16,
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 16
                                }}>
                                    <div className="pulse" style={{ fontSize: 36 }}>⚡</div>
                                    <div style={{ fontSize: 12, color: '#555' }}>Creating image...</div>
                                    <div style={{ width: 120, height: 2, background: '#1a1a2e', borderRadius: 2, overflow: 'hidden' }}>
                                        <div className="pulse" style={{ width: '60%', height: '100%', background: 'linear-gradient(90deg, #14b8a6, #6366f1)', borderRadius: 2 }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div style={{ padding: '12px 18px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#fca5a5', fontSize: 13, marginBottom: 24, maxWidth: 500 }}>
                                {error}
                            </div>
                        )}

                        {/* Gallery Grid */}
                        {imageHistory.length === 0 && !loading && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 300, color: '#333', textAlign: 'center' }}>
                                <div style={{ fontSize: 40 }}>🖼</div>
                                <div style={{ fontSize: 14, color: '#444' }}>No images created yet</div>
                                <div style={{ fontSize: 12, color: '#333' }}>Generate your first post from the Home page</div>
                            </div>
                        )}

                        {imageHistory.length > 0 && (
                            <div>
                                {/* Group by date-time chunks */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                                    {imageHistory.map((h) => (
                                        <div key={h.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            <div style={{ fontSize: 11, color: '#555', fontWeight: 500 }}>
                                                {formatDate(h.created_at)}
                                            </div>
                                            <div
                                                className="gallery-item"
                                                onClick={() => openPost(h)}
                                                style={{
                                                    width: 280,
                                                    height: 280,
                                                    borderRadius: 16,
                                                    overflow: 'hidden',
                                                    background: '#0a0a0f',
                                                    border: '1px solid rgba(255,255,255,0.06)',
                                                    position: 'relative'
                                                }}
                                            >
                                                {h.metadata?.background && (
                                                    <img
                                                        src={h.metadata.background}
                                                        alt={h.metadata?.headline || 'Generated post'}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                )}
                                                {/* Hover overlay */}
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                    padding: '12px',
                                                    background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
                                                    opacity: 0,
                                                    transition: 'opacity 0.2s'
                                                }}
                                                    onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                                                    onMouseOut={(e) => e.currentTarget.style.opacity = '0'}
                                                >
                                                    <div style={{ fontSize: 12, fontWeight: 600, color: '#eee', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {h.metadata?.headline || h.hook}
                                                    </div>
                                                    <div style={{ fontSize: 10, color: '#14b8a6', fontWeight: 700, marginTop: 4 }}>
                                                        ⚡ {h.viral_score}/100
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Fullscreen Post Preview Modal */}
            {selectedPost && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.9)',
                        backdropFilter: 'blur(12px)',
                        zIndex: 500,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 40
                    }}
                    onClick={() => setSelectedPost(null)}
                >
                    <div
                        className="fade-up"
                        onClick={(e) => e.stopPropagation()}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, maxWidth: 580 }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedPost(null)}
                            style={{
                                alignSelf: 'flex-end',
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(255,255,255,0.05)',
                                color: '#999',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <X size={18} />
                        </button>

                        {/* Post Canvas */}
                        {selectedPost.background && (
                            <div style={{ width: 540, height: 540, borderRadius: 24, overflow: 'hidden', background: '#0a0a0f', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: 1080, height: 1080 }}>
                                    <SocialPostCanvas
                                        ref={canvasRef}
                                        background={selectedPost.background}
                                        headline={selectedPost.headline}
                                        points={selectedPost.key_points || []}
                                        cta={selectedPost.cta}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Download Button */}
                        <button
                            onClick={handleDownload}
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

                        {/* Virality */}
                        {selectedPost.virality_explanation && (
                            <div style={{
                                background: 'rgba(20,184,166,0.04)',
                                border: '1px solid rgba(20,184,166,0.12)',
                                borderRadius: 14,
                                padding: '16px 20px',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ fontSize: 13 }}>🧠</span>
                                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: '#14b8a6', textTransform: 'uppercase' }}>Virality Analysis</span>
                                </div>
                                <div style={{ fontSize: 12, color: '#999', lineHeight: 1.7, fontStyle: 'italic', borderLeft: '2px solid rgba(20,184,166,0.3)', paddingLeft: 12 }}>
                                    "{selectedPost.virality_explanation}"
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
