import React, { useState } from 'react';
import { Image, Video, Layout, Sparkles } from 'lucide-react';

interface QuickAIInputProps {
    onCreate: (prompt: string, type: 'image' | 'video' | 'template', resolution: string, aspectRatio: string, mode: 'Image' | 'Video') => void;
    loading?: boolean;
}

const ASPECT_RATIOS = [
    { id: '1:1', label: '1:1', w: 1, h: 1 },
    { id: '16:9', label: '16:9', w: 16, h: 9 },
    { id: '9:16', label: '9:16', w: 9, h: 16 },
    { id: '4:3', label: '4:3', w: 4, h: 3 },
    { id: '3:4', label: '3:4', w: 3, h: 4 },
    { id: '5:4', label: '5:4', w: 5, h: 4 },
    { id: '4:5', label: '4:5', w: 4, h: 5 },
    { id: '3:2', label: '3:2', w: 3, h: 2 },
    { id: '2:3', label: '2:3', w: 2, h: 3 },
    { id: '21:9', label: '21:9', w: 21, h: 9 },
];

const RESOLUTIONS = ['720P', '1080P'];

const QuickAIInput: React.FC<QuickAIInputProps> = ({ onCreate, loading }) => {
    const [activeTab, setActiveTab] = useState<'image' | 'video' | 'template'>('image');
    const [prompt, setPrompt] = useState('');
    const [resolution, setResolution] = useState('720P');
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [showSettings, setShowSettings] = useState(false);

    const tabs: Array<{ id: 'image' | 'video' | 'template', label: string, icon: React.ReactNode, disabled?: boolean }> = [
        { id: 'image', label: 'Image', icon: <Image size={14} /> },
        { id: 'video', label: 'Video', icon: <Video size={14} /> },
        { id: 'template', label: 'Template', icon: <Layout size={14} />, disabled: true },
    ];

    const handleCreate = () => {
        if (prompt.trim()) {
            const mode: 'Image' | 'Video' = activeTab === 'video' ? 'Video' : 'Image';
            onCreate(prompt, activeTab, resolution, aspectRatio, mode);
        }
    };

    // Generate aspect ratio icon shape
    const getAspectIcon = (w: number, h: number, size: number = 24) => {
        const maxDim = size;
        const scale = maxDim / Math.max(w, h);
        const rw = Math.round(w * scale);
        const rh = Math.round(h * scale);
        return (
            <div style={{
                width: rw,
                height: rh,
                border: '1.5px solid currentColor',
                borderRadius: 3,
                flexShrink: 0
            }} />
        );
    };

    return (
        <div style={{
            background: 'rgba(15, 15, 20, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '20px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
            width: '100%',
            maxWidth: '900px',
            margin: '0 auto',
            position: 'relative',
            overflow: 'visible'
        }}>
            {/* Background Glow */}
            <div style={{
                position: 'absolute', top: 0, right: 0, width: '100%', height: '100%',
                background: 'radial-gradient(circle at top right, rgba(236, 72, 153, 0.05), transparent 50%)',
                pointerEvents: 'none', borderRadius: '24px'
            }} />

            {/* Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '12px' }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => !tab.disabled && setActiveTab(tab.id)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '8px 4px', background: 'none', border: 'none',
                            color: tab.disabled ? '#444' : activeTab === tab.id ? '#fff' : '#888',
                            fontSize: '14px', fontWeight: activeTab === tab.id ? '600' : '400',
                            cursor: tab.disabled ? 'not-allowed' : 'pointer',
                            position: 'relative', transition: 'all 0.2s',
                            opacity: tab.disabled ? 0.5 : 1
                        }}
                    >
                        {tab.icon}
                        {tab.label}
                        {tab.disabled && <span style={{ fontSize: '9px', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>Soon</span>}
                        {activeTab === tab.id && (
                            <div style={{
                                position: 'absolute', bottom: '-13px', left: '0', width: '100%',
                                height: '2px', background: '#fff', boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                            }} />
                        )}
                    </button>
                ))}
                <div style={{ flex: 1 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#666' }}>
                    <Sparkles size={14} />
                </div>
            </div>

            {/* Input Area */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', position: 'relative' }}>
                <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#888', flexShrink: 0
                }}>
                    <Sparkles size={20} />
                </div>

                <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#888', flexShrink: 0
                }}>
                    <Image size={20} />
                </div>

                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={activeTab === 'video' ? 'Describe any video you want to create...' : 'Describe any image you want to create...'}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleCreate();
                        }
                    }}
                    style={{
                        flex: 1, background: 'none', border: 'none', color: '#fff',
                        fontSize: '18px', fontFamily: 'inherit', resize: 'none',
                        minHeight: '60px', padding: '12px 0', outline: 'none',
                        caretColor: '#ec4899'
                    }}
                />

                <button
                    onClick={handleCreate}
                    disabled={loading || !prompt.trim()}
                    style={{
                        alignSelf: 'flex-end', marginBottom: '8px', padding: '12px 24px',
                        background: 'linear-gradient(135deg, #f87171, #c084fc)',
                        border: 'none', borderRadius: '12px', color: '#fff',
                        fontSize: '15px', fontWeight: '700',
                        cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s',
                        opacity: loading || !prompt.trim() ? 0.5 : 1,
                        boxShadow: '0 8px 16px rgba(248, 113, 113, 0.2)'
                    }}
                >
                    {loading ? 'Creating...' : 'Create'}
                </button>
            </div>

            {/* Bottom Settings Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px', position: 'relative' }}>
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        background: showSettings ? 'rgba(255,255,255,0.08)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${showSettings ? 'rgba(255,255,255,0.15)' : 'rgba(255, 255, 255, 0.05)'}`,
                        borderRadius: '12px', padding: '6px 16px',
                        cursor: 'pointer', transition: 'all 0.2s',
                        color: showSettings ? '#ccc' : '#888'
                    }}
                >
                    <span style={{ fontSize: '12px', fontWeight: '500' }}>{resolution}</span>
                    <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.1)' }} />
                    <span style={{ fontSize: '12px', fontWeight: '500' }}>{aspectRatio}</span>
                </button>

                {/* Settings Popover */}
                {showSettings && (
                    <div style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: 0,
                        marginBottom: 12,
                        width: 460,
                        background: 'rgba(20,20,25,0.98)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 16,
                        padding: '20px',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
                        zIndex: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 20
                    }}>
                        {/* Resolution */}
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#ddd', marginBottom: 12 }}>Resolution</div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {RESOLUTIONS.map(r => (
                                    <button
                                        key={r}
                                        onClick={() => setResolution(r)}
                                        style={{
                                            flex: 1,
                                            padding: '10px 16px',
                                            borderRadius: 10,
                                            border: 'none',
                                            background: resolution === r ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
                                            color: resolution === r ? '#fff' : '#777',
                                            fontSize: 14,
                                            fontWeight: resolution === r ? 700 : 500,
                                            cursor: 'pointer',
                                            transition: 'all 0.15s'
                                        }}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Aspect Ratio */}
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#ddd', marginBottom: 12 }}>Aspect Ratio</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                                {ASPECT_RATIOS.map(ar => (
                                    <button
                                        key={ar.id}
                                        onClick={() => setAspectRatio(ar.id)}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 6,
                                            padding: '12px 4px',
                                            borderRadius: 10,
                                            border: 'none',
                                            background: aspectRatio === ar.id ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.03)',
                                            color: aspectRatio === ar.id ? '#fff' : '#666',
                                            fontSize: 11,
                                            fontWeight: aspectRatio === ar.id ? 700 : 500,
                                            cursor: 'pointer',
                                            transition: 'all 0.15s'
                                        }}
                                    >
                                        {getAspectIcon(ar.w, ar.h, 22)}
                                        {ar.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuickAIInput;
