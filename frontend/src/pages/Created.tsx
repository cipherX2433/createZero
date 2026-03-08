import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api.service';
import Sidebar from '@/components/Sidebar';
import {
    Download, Share2, Star, Trash2, ThumbsDown,
    Video, Image as ImageIcon, X,
    Copy, RefreshCw, Sparkles
} from 'lucide-react';

interface LocationState {
    prompt?: string;
    resolution?: string;
    aspectRatio?: string;
    autoGenerate?: boolean;
    mode?: 'Image' | 'Video';
}

type CreateMode = 'Image' | 'Video';

export default function Created() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as LocationState | null;

    // ── Single source of truth for mode ──────────────────────────────────────
    const [createMode, setCreateMode] = useState<CreateMode>(
        state?.mode === 'Video' ? 'Video' : 'Image'
    );

    // ── Shared prompt state (pre-filled from Dashboard navigation) ───────────
    const [prompt, setPrompt] = useState<string>(state?.prompt || '');

    // ── Result states — mutually exclusive ───────────────────────────────────
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [resultVideo, setResultVideo] = useState<string | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // ── UI state ─────────────────────────────────────────────────────────────
    const [history, setHistory] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [copiedPrompt, setCopiedPrompt] = useState(false);
    const [selectedVideoItem, setSelectedVideoItem] = useState<any>(null);
    const hasGenerated = useRef(false);

    // Keep legacy video state for history gallery display only
    const [videoStyle, setVideoStyle] = useState<string>('Cinematic');

    // ── History fetch (reads createMode at call time via param) ──────────────
    const fetchHistory = async (mode: CreateMode) => {
        try {
            if (mode === 'Image') {
                const data = await apiService.fetchScripts();
                setHistory(data || []);
            } else {
                const data = await apiService.fetchVideoHistory();
                setHistory(data || []);
            }
        } catch (e) {
            console.error('Failed to fetch history:', e);
        }
    };

    // Fetch history on mount with the initial mode
    useEffect(() => {
        fetchHistory(createMode);
    }, []);

    // Auto-generate from Dashboard navigation state
    useEffect(() => {
        if (state?.prompt && state?.autoGenerate && !hasGenerated.current) {
            hasGenerated.current = true;
            handleGenerate(state.prompt, state.mode ?? 'Image');
        }
    }, [state]);

    // ── Tab switch: clear results, set mode, refetch history ─────────────────
    const switchMode = (mode: CreateMode) => {
        setCreateMode(mode);
        setResultImage(null);
        setResultVideo(null);
        setError('');
        setLoading(false);
        setSelectedItem(null);
        setSelectedVideoItem(null);
        fetchHistory(mode);
    };

    // ── Single generate handler — never navigates, never fires both ──────────
    const handleGenerate = async (overridePrompt?: string, overrideMode?: CreateMode) => {
        const activePrompt = (overridePrompt ?? prompt).trim();
        const activeMode = overrideMode ?? createMode;

        if (!activePrompt) return;

        setResultImage(null);
        setResultVideo(null);
        setError('');
        setLoading(true);
        setSelectedItem(null);
        setSelectedVideoItem(null);

        try {
            const apiData = await apiService.generateVideoInline({
                prompt: activePrompt,
                resolution: '720P',
                aspect_ratio: '16:9',
                mode: activeMode as 'Image' | 'Video',
            });

            // Use mode from server response to determine what to render
            if (activeMode === 'Video') {
                if (!apiData.video) throw new Error('No video returned from server.');
                setResultVideo(apiData.video);
                setResultImage(null);
            } else {
                if (apiData.image) setResultImage(apiData.image);
                setResultVideo(null);
            }

            // Do not block UI rendering of the new result waiting for history API
            fetchHistory(activeMode).catch(console.error);
        } catch (e: any) {
            setError(e.message || 'Generation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyPrompt = (prompt: string) => {
        navigator.clipboard.writeText(prompt);
        setCopiedPrompt(true);
        setTimeout(() => setCopiedPrompt(false), 2000);
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

    const imageHistory = history.filter(h => (h.mode || h.metadata?.create_mode) === 'Image' || (!h.mode && h.metadata?.background));
    const videoHistory = history.filter(h => (h.mode || h.metadata?.create_mode) === 'Video' || (!h.mode && h.metadata?.video));

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
                        { id: 'Image' as CreateMode, label: 'Image', icon: <ImageIcon size={16} /> },
                        { id: 'Video' as CreateMode, label: 'Video', icon: <Video size={16} /> },
                    ]).map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => switchMode(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '12px 0',
                                background: 'none',
                                border: 'none',
                                borderBottom: createMode === tab.id ? '2px solid #fff' : '2px solid transparent',
                                color: createMode === tab.id ? '#fff' : '#666',
                                fontSize: 15,
                                fontWeight: createMode === tab.id ? 700 : 400,
                                cursor: 'pointer',
                                transition: 'color 0.2s',
                                marginBottom: -1
                            }}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* \u2500\u2500 Unified Create Panel \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
                {!loading && !resultImage && !resultVideo && (
                    <div style={{ marginBottom: 32, padding: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
                        {/* Prompt textarea — shared by both modes */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Prompt</label>
                            <textarea
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                placeholder={createMode === 'Video' ? 'Describe any video you want to create...' : 'Describe any image you want to create...'}
                                rows={3}
                                style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: 'inherit', resize: 'vertical', outline: 'none' }}
                            />
                        </div>

                        {/* Visual Style — only for Video mode */}
                        {createMode === 'Video' && (
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>🎨 Visual Style</label>
                                <div style={{ position: 'relative' }}>
                                    <select value={videoStyle} onChange={e => setVideoStyle(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 14, appearance: 'none', cursor: 'pointer' }}>
                                        <option value="Cinematic">Cinematic</option>
                                        <option value="Anime">Anime / Animation</option>
                                        <option value="Cyberpunk">Cyberpunk / Sci-Fi</option>
                                        <option value="Minimalistic">Minimalistic</option>
                                    </select>
                                    <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#555', pointerEvents: 'none' }}>▾</span>
                                </div>
                            </div>
                        )}

                        {/* Single Generate button — always passes the active tab mode explicitly */}
                        <button
                            onClick={() => handleGenerate(undefined, createMode)}
                            disabled={loading || !prompt.trim()}
                            style={{ marginTop: 8, padding: '15px 24px', width: '100%', background: !prompt.trim() ? '#222' : 'white', border: 'none', borderRadius: 12, color: !prompt.trim() ? '#555' : 'black', fontSize: 15, fontWeight: 700, cursor: !prompt.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s', fontFamily: "'Syne', sans-serif", letterSpacing: 0.5 }}
                        >
                            <span>⚡</span>
                            {createMode === 'Video' ? 'Generate Video' : 'Generate Image'}
                        </button>
                    </div>
                )}

                {/* \u2500\u2500 Loading state \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
                {loading && (
                    <div style={{ marginBottom: 32 }}>
                        <div style={{ fontSize: 12, color: '#555', marginBottom: 12 }}>
                            {createMode === 'Video' ? 'Generating your video, this may take 2–4 minutes...' : 'Generating your image...'}
                        </div>
                        <div style={{ width: '100%', maxWidth: 640, aspectRatio: '16/9', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                            <div className="pulse" style={{ fontSize: 40 }}>{createMode === 'Video' ? '🎬' : '✨'}</div>
                            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: '#555', textAlign: 'center' }}>
                                {createMode === 'Video' ? 'Generating your video...' : 'Creating your image...'}<br />
                                <span style={{ fontSize: 12, color: '#444' }}>
                                    {createMode === 'Video' ? 'This may take 2–4 minutes' : 'Usually under 30 seconds'}
                                </span>
                            </div>
                            <div style={{ width: 200, height: 3, background: '#1a1a2e', borderRadius: 2, overflow: 'hidden' }}>
                                <div className="pulse" style={{ width: '80%', height: '100%', background: createMode === 'Video' ? 'linear-gradient(90deg, #6366f1, #4f46e5)' : 'linear-gradient(90deg, #14b8a6, #6366f1)', borderRadius: 2 }} />
                            </div>
                        </div>
                    </div>
                )}

                {/* \u2500\u2500 Image result \u2014 ONLY in Image mode \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
                {!loading && createMode === 'Image' && resultImage && (
                    <div className="fade-up" style={{ marginBottom: 32 }}>
                        <div style={{ fontSize: 12, color: '#555', marginBottom: 12 }}>Image generated successfully ✨</div>
                        <div style={{ width: '100%', maxWidth: 640, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                            <img src={resultImage} alt="Generated" style={{ width: '100%', display: 'block' }} />
                        </div>
                        <button onClick={() => { setResultImage(null); }} style={{ marginTop: 12, padding: '8px 18px', background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#888', fontSize: 13, cursor: 'pointer' }}>
                            ✕ Dismiss
                        </button>
                    </div>
                )}

                {/* \u2500\u2500 Video result \u2014 ONLY in Video mode \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
                {!loading && createMode === 'Video' && resultVideo && (
                    <div className="fade-up" style={{ marginBottom: 32 }}>
                        <div style={{ fontSize: 12, color: '#555', marginBottom: 12 }}>Video generated successfully ✨</div>
                        <div style={{ width: '100%', maxWidth: 640, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                            <video src={resultVideo} autoPlay loop controls style={{ width: '100%', display: 'block' }} />
                        </div>
                        <button onClick={() => { setResultVideo(null); }} style={{ marginTop: 12, padding: '8px 18px', background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#888', fontSize: 13, cursor: 'pointer' }}>
                            ✕ Dismiss
                        </button>
                    </div>
                )}

                {/* \u2500\u2500 Error \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
                {!loading && error && (
                    <div style={{ padding: '12px 18px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#fca5a5', fontSize: 13, marginBottom: 24, maxWidth: 640 }}>
                        {error}
                    </div>
                )}

                {/* \u2500\u2500 History Gallery \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}

                {/* Image Gallery */}
                {createMode === 'Image' && (
                    <div className="fade-up">
                        {imageHistory.length === 0 && !loading && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 300, color: '#333', textAlign: 'center' }}>
                                <div style={{ fontSize: 40 }}>🖼</div>
                                <div style={{ fontSize: 14, color: '#444' }}>No images created yet</div>
                                <div style={{ fontSize: 12, color: '#333' }}>Type a prompt above and click Generate Image</div>
                            </div>
                        )}
                        {imageHistory.length > 0 && (
                            <div>
                                <div style={{ fontSize: 13, color: '#555', fontWeight: 600, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>History</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                                    {imageHistory.map((h) => (
                                        <div key={h.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            <div style={{ fontSize: 11, color: '#555', fontWeight: 500 }}>{formatShortDate(h.created_at)}</div>
                                            <div className="gallery-card" onClick={() => setSelectedItem(h)} style={{ width: 320, height: 180, borderRadius: 12, overflow: 'hidden', background: '#111', border: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}>
                                                {h.mediaUrl ? (
                                                    <img src={h.mediaUrl} alt={h.prompt || 'Generated image'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#333', fontSize: 24 }}>🖼</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Video Gallery */}
                {createMode === 'Video' && (
                    <div className="fade-up">
                        {videoHistory.length === 0 && !loading && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 300, color: '#333', textAlign: 'center' }}>
                                <div style={{ fontSize: 40 }}>🎬</div>
                                <div style={{ fontSize: 14, color: '#444' }}>No videos created yet</div>
                                <div style={{ fontSize: 12, color: '#333' }}>Type a prompt above and click Generate Video</div>
                            </div>
                        )}
                        {videoHistory.length > 0 && (
                            <div>
                                <div style={{ fontSize: 13, color: '#555', fontWeight: 600, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>History</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                                    {videoHistory.map((h) => (
                                        <div key={h.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            <div style={{ fontSize: 11, color: '#555', fontWeight: 500 }}>{formatDate(h.created_at)}</div>
                                            <div className="gallery-card" onClick={() => setSelectedVideoItem(h)} style={{ width: 280, height: 157, borderRadius: 16, overflow: 'hidden', background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}>
                                                {h.mediaUrl ? (
                                                    <video
                                                        src={h.mediaUrl}
                                                        muted
                                                        playsInline
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        onMouseEnter={e => (e.currentTarget as HTMLVideoElement).play()}
                                                        onMouseLeave={e => { const v = e.currentTarget as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
                                                    />
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#555', fontSize: 24 }}>🎬</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}


            </div>

            {/* ===== IMAGE DETAIL VIEW (Full-screen overlay) ===== */}
            {
                selectedItem && (
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
                                    src={selectedItem.mediaUrl || selectedItem.metadata?.background}
                                    alt={selectedItem.prompt || selectedItem.metadata?.prompt || 'Image'}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>

                            {/* Bottom Action Bar */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 8, marginTop: 24
                            }}>
                                {[
                                    {
                                        icon: <Download size={15} />, label: 'Download', action: () => {
                                            const url = selectedItem.mediaUrl || selectedItem.metadata?.background;
                                            if (!url) return;
                                            const link = document.createElement('a');
                                            link.href = url;
                                            link.download = `creatorzero-${selectedItem.id}.png`;
                                            link.target = '_blank';
                                            link.rel = 'noopener noreferrer';
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        }
                                    },
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
                                            const retryPrompt = selectedItem.metadata?.prompt || selectedItem.hook;
                                            setSelectedItem(null);
                                            handleGenerate(retryPrompt);
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
                )
            }

            {/* Fullscreen Video Modal */}
            {
                selectedVideoItem && selectedVideoItem.status === 'completed' && selectedVideoItem.video_url && createMode === 'Video' && (
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
                        onClick={() => setSelectedVideoItem(null)}
                    >
                        <div
                            className="fade-up"
                            onClick={(e) => e.stopPropagation()}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%', maxWidth: 800 }}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedVideoItem(null)}
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

                            <div style={{ width: "100%", borderRadius: 16, overflow: "hidden", background: "#0a0a0f", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", aspectRatio: "16/9" }}>
                                <video
                                    src={selectedVideoItem.video_url}
                                    controls
                                    autoPlay
                                    loop
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>
                            <button
                                onClick={() => window.open(selectedVideoItem.video_url, "_blank")}
                                style={{
                                    padding: "12px 24px",
                                    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                                    border: "none",
                                    borderRadius: 12,
                                    color: "#fff",
                                    fontSize: 14,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8,
                                    transition: "all 0.2s",
                                    width: "100%",
                                    boxShadow: "0 4px 12px rgba(99,102,241,0.2)"
                                }}
                                className="gen-btn"
                            >
                                <span>📥</span> Download Video File
                            </button>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
