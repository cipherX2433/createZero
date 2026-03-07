import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api.service';
import Sidebar from '@/components/Sidebar';
import {
    Download, Share2, Star, Trash2, ThumbsDown,
    Video, Image as ImageIcon, ChevronDown, X,
    Copy, RefreshCw, Sparkles
} from 'lucide-react';

interface LocationState {
    prompt?: string;
    resolution?: string;
    aspectRatio?: string;
    autoGenerate?: boolean;
}

type MediaTab = 'video' | 'image';
type SubFilter = 'all' | 'created' | 'uploaded';

export default function Created() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as LocationState | null;

    const [mediaTab, setMediaTab] = useState<MediaTab>('image');
    const [subFilter, setSubFilter] = useState<SubFilter>('created');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [error, setError] = useState('');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [copiedPrompt, setCopiedPrompt] = useState(false);
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

    useEffect(() => {
        if (state?.prompt && state?.autoGenerate && !hasGenerated.current) {
            hasGenerated.current = true;
            generateFromPrompt(state.prompt, state.resolution, state.aspectRatio);
        }
    }, [state]);

    const generateFromPrompt = async (prompt: string, resolution?: string, aspectRatio?: string) => {
        setError('');
        setLoading(true);

        try {
            await apiService.generateImage({
                prompt,
                resolution: resolution || '720P',
                aspect_ratio: aspectRatio || '16:9',
            });
            await fetchHistory();
        } catch (e: any) {
            setError(e.message || 'Failed to generate image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyPrompt = (prompt: string) => {
        navigator.clipboard.writeText(prompt);
        setCopiedPrompt(true);
        setTimeout(() => setCopiedPrompt(false), 2000);
    };

    const handleDownloadImage = (imageData: string, filename: string) => {
        const link = document.createElement('a');
        link.href = imageData;
        link.download = filename || 'creatorzero-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const mins = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${mins}`;
    };

    const formatShortDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const mins = String(d.getMinutes()).padStart(2, '0');
        return `${month}-${day} ${hours}:${mins}`;
    };

    const imageHistory = history.filter(h => h.metadata?.background);

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: "'Geist', sans-serif", color: '#fff', display: 'flex' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: #0a0a0a; }
                ::-webkit-scrollbar-thumb { background: #222; border-radius: 3px; }
                .pulse { animation: pulse 2s ease-in-out infinite; }
                @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                .fade-up { animation: fadeUp 0.35s ease forwards; }
                .gallery-card { transition: all 0.2s; cursor: pointer; }
                .gallery-card:hover { transform: scale(1.02); border-color: rgba(255,255,255,0.15) !important; }
                .action-btn { transition: all 0.15s; }
                .action-btn:hover { background: rgba(255,255,255,0.08) !important; color: #fff !important; }
            `}</style>

            <Sidebar />

            {/* Main Content */}
            <div style={{ marginLeft: 72, flex: 1, padding: '32px 40px', overflowY: 'auto', minHeight: '100vh' }}>

                {/* Top Tabs */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 32, borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 24 }}>
                    {([
                        { id: 'video' as MediaTab, label: 'Video', icon: <Video size={16} /> },
                        { id: 'image' as MediaTab, label: 'Image', icon: <ImageIcon size={16} /> },
                    ]).map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setMediaTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '12px 0',
                                background: 'none',
                                border: 'none',
                                borderBottom: mediaTab === tab.id ? '2px solid #fff' : '2px solid transparent',
                                color: mediaTab === tab.id ? '#fff' : '#666',
                                fontSize: 15,
                                fontWeight: mediaTab === tab.id ? 700 : 400,
                                cursor: 'pointer',
                                transition: 'color 0.2s',
                                marginBottom: -1
                            }}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* VIDEO - Coming Soon */}
                {mediaTab === 'video' && (
                    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, minHeight: 400, textAlign: 'center' }}>
                        <div style={{ fontSize: 56 }}>🎬</div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#444' }}>Video Generation</div>
                        <div style={{ fontSize: 14, color: '#333', maxWidth: 340 }}>AI-powered video generation is coming soon.</div>
                        <div style={{ padding: '8px 20px', background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: 20, fontSize: 12, color: '#14b8a6', fontWeight: 600 }}>Coming Soon</div>
                    </div>
                )}

                {/* IMAGE TAB */}
                {mediaTab === 'image' && (
                    <div className="fade-up">
                        {/* Sub-Filters */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                            <button style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '8px 16px', background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                                color: '#ccc', fontSize: 13, fontWeight: 500, cursor: 'pointer'
                            }}>
                                All <ChevronDown size={14} />
                            </button>
                            {(['created', 'uploaded'] as SubFilter[]).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setSubFilter(f)}
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

                        {/* Loading */}
                        {loading && (
                            <div style={{ marginBottom: 32 }}>
                                <div style={{ fontSize: 12, color: '#555', marginBottom: 12 }}>Generating...</div>
                                <div style={{
                                    width: 320, height: 180, borderRadius: 12,
                                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12
                                }}>
                                    <div className="pulse" style={{ fontSize: 32 }}>✨</div>
                                    <div style={{ fontSize: 12, color: '#555' }}>Creating your image...</div>
                                    <div style={{ width: 100, height: 2, background: '#1a1a2e', borderRadius: 2, overflow: 'hidden' }}>
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

                        {/* Empty */}
                        {imageHistory.length === 0 && !loading && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 300, color: '#333', textAlign: 'center' }}>
                                <div style={{ fontSize: 40 }}>🖼</div>
                                <div style={{ fontSize: 14, color: '#444' }}>No images created yet</div>
                                <div style={{ fontSize: 12, color: '#333' }}>Go to Home and describe what you want to see</div>
                            </div>
                        )}

                        {/* Gallery Grid - 16:9 cards */}
                        {imageHistory.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                                {imageHistory.map((h) => (
                                    <div key={h.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <div style={{ fontSize: 11, color: '#555', fontWeight: 500 }}>
                                            {formatShortDate(h.created_at)}
                                        </div>
                                        <div
                                            className="gallery-card"
                                            onClick={() => setSelectedItem(h)}
                                            style={{
                                                width: 320,
                                                height: 180,
                                                borderRadius: 12,
                                                overflow: 'hidden',
                                                background: '#111',
                                                border: '1px solid rgba(255,255,255,0.06)',
                                                position: 'relative'
                                            }}
                                        >
                                            <img
                                                src={h.metadata?.background}
                                                alt={h.metadata?.prompt || 'Generated image'}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ===== IMAGE DETAIL VIEW (Full-screen overlay) ===== */}
            {selectedItem && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(5,5,5,0.97)',
                    zIndex: 500, display: 'flex', overflow: 'hidden'
                }}>
                    {/* Close */}
                    <button
                        onClick={() => setSelectedItem(null)}
                        style={{
                            position: 'absolute', top: 20, right: 20, zIndex: 510,
                            width: 36, height: 36, borderRadius: 10,
                            border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
                            color: '#999', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        <X size={18} />
                    </button>

                    {/* Left Side - Image */}
                    <div style={{
                        flex: 1, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', padding: 40,
                        position: 'relative'
                    }}>
                        <div style={{
                            width: '100%', maxWidth: 800, borderRadius: 16, overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.08)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                            aspectRatio: '16/9'
                        }}>
                            <img
                                src={selectedItem.metadata?.background}
                                alt={selectedItem.metadata?.prompt || 'Image'}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        {/* Bottom Action Bar */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 8, marginTop: 24
                        }}>
                            {[
                                { icon: <Download size={15} />, label: 'Download', action: () => handleDownloadImage(selectedItem.metadata?.background, `creatorzero-${selectedItem.id}.png`) },
                                { icon: <Share2 size={15} />, label: 'Share', action: () => { } },
                                { icon: <Star size={15} />, label: 'Save', action: () => { } },
                                { icon: <Trash2 size={15} />, label: 'Delete', action: () => { } },
                                { icon: <ThumbsDown size={15} />, label: 'Dislike', action: () => { } },
                            ].map(btn => (
                                <button
                                    key={btn.label}
                                    className="action-btn"
                                    onClick={btn.action}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 6,
                                        padding: '10px 18px', borderRadius: 10,
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        color: '#999', fontSize: 13, fontWeight: 500,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {btn.icon} {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Details Panel */}
                    <div style={{
                        width: 340, minWidth: 340, background: '#111',
                        borderLeft: '1px solid rgba(255,255,255,0.06)',
                        padding: '32px 24px', overflowY: 'auto',
                        display: 'flex', flexDirection: 'column', gap: 24
                    }}>
                        {/* Date */}
                        <div style={{ fontSize: 13, color: '#555' }}>
                            {formatDate(selectedItem.created_at)}
                        </div>

                        {/* Prompt */}
                        <div style={{
                            background: 'rgba(255,255,255,0.04)', borderRadius: 12,
                            padding: '16px', border: '1px solid rgba(255,255,255,0.06)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#ccc' }}>Prompt</div>
                                <button
                                    onClick={() => handleCopyPrompt(selectedItem.metadata?.prompt || selectedItem.hook)}
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: copiedPrompt ? '#14b8a6' : '#555', transition: 'color 0.2s'
                                    }}
                                >
                                    <Copy size={14} />
                                </button>
                            </div>
                            <div style={{ fontSize: 13, color: '#999', lineHeight: 1.6 }}>
                                {selectedItem.metadata?.prompt || selectedItem.hook}
                            </div>
                        </div>

                        {/* Details */}
                        <div style={{
                            background: 'rgba(255,255,255,0.04)', borderRadius: 12,
                            padding: '16px', border: '1px solid rgba(255,255,255,0.06)'
                        }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#ccc', marginBottom: 12 }}>Details</div>
                            {[
                                { label: 'Create Mode', value: selectedItem.metadata?.create_mode || 'Image' },
                                { label: 'Model', value: selectedItem.metadata?.model || 'SDXL' },
                                { label: 'Resolution', value: selectedItem.metadata?.resolution || '1024x576' },
                                { label: 'Aspect Ratio', value: selectedItem.metadata?.aspect_ratio || '16:9' },
                            ].map(d => (
                                <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                    <span style={{ fontSize: 12, color: '#666' }}>{d.label}</span>
                                    <span style={{ fontSize: 12, color: '#ccc', fontWeight: 500 }}>{d.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Create */}
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#ccc', marginBottom: 12 }}>Create</div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button
                                    onClick={() => {
                                        const itemToRetry = selectedItem;
                                        setSelectedItem(null);
                                        const prompt = itemToRetry.metadata?.prompt || itemToRetry.hook;
                                        generateFromPrompt(prompt, itemToRetry.metadata?.resolution, itemToRetry.metadata?.aspect_ratio);
                                    }}
                                    className="action-btn"
                                    style={{
                                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                        padding: '12px', borderRadius: 10,
                                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                        color: '#ccc', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                                    }}
                                >
                                    <RefreshCw size={14} /> Retry
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedItem(null);
                                        navigate('/dashboard');
                                    }}
                                    className="action-btn"
                                    style={{
                                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                        padding: '12px', borderRadius: 10,
                                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                        color: '#ccc', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                                    }}
                                >
                                    <Sparkles size={14} /> Go Create
                                </button>
                            </div>
                        </div>

                        {/* Thumbnail */}
                        {selectedItem.metadata?.background && (
                            <div style={{ marginTop: 'auto' }}>
                                <div style={{ width: 56, height: 32, borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', marginLeft: 'auto' }}>
                                    <img
                                        src={selectedItem.metadata.background}
                                        alt="Thumbnail"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
