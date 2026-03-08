import React, { useState, useMemo } from 'react';
import { Image, Video, Layout, Sparkles, Search, X, ImagePlus } from 'lucide-react';

interface QuickAIInputProps {
    onCreate: (prompt: string, type: 'image' | 'video' | 'template', resolution: string, aspectRatio: string, mode: 'Image' | 'Video') => void;
    loading?: boolean;
}

interface Template {
    id: string;
    name: string;
    category: string;
    prompt: string;
    emoji: string;
    isNew?: boolean;
    gradient: string;
}

const TEMPLATES: Template[] = [
    // Love Loading
    { id: 't1', name: 'I Disagree!', category: 'Love Loading', prompt: 'A dramatic elegant wedding scene in a grand cathedral, couple in formal attire, cinematic warm lighting, golden hour glow, romantic atmosphere', emoji: '💒', isNew: true, gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)' },
    { id: 't2', name: 'Celebrate Holi', category: 'Love Loading', prompt: 'A joyful couple celebrating Holi festival, covered in vibrant colorful powder, laughing together, traditional Indian celebration, festive atmosphere', emoji: '🎨', isNew: true, gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
    { id: 't3', name: 'Umbrella Walk', category: 'Love Loading', prompt: 'An elegant couple walking together under an umbrella on a rainy street, cinematic street photography, cobblestone path, romantic moody atmosphere', emoji: '☂️', isNew: true, gradient: 'linear-gradient(135deg, #6366f1, #06b6d4)' },
    { id: 't4', name: 'My Coronation', category: 'Love Loading', prompt: 'A regal portrait of a person wearing an ornate crown and royal attire, golden embroidery, dramatic lighting, Renaissance painting style', emoji: '👑', isNew: true, gradient: 'linear-gradient(135deg, #f59e0b, #a855f7)' },

    // Visual Patch
    { id: 't5', name: 'Vogue Blur', category: 'Visual Patch', prompt: 'A high-fashion black and white portrait with dramatic studio lighting, sharp features, editorial vogue style, artistic blur background, cinematic', emoji: '🖤', isNew: true, gradient: 'linear-gradient(135deg, #374151, #111827)' },
    { id: 't6', name: 'Feeling Good', category: 'Visual Patch', prompt: 'A person celebrating with birthday cake, warm candlelight, joyful expression, party atmosphere, cinematic warm tones, bokeh background', emoji: '🎂', gradient: 'linear-gradient(135deg, #f97316, #ec4899)' },
    { id: 't7', name: 'The Pop Off', category: 'Visual Patch', prompt: 'A cute dog sitting on an elegant bench at night, festive sparklers and confetti, celebration theme, whimsical pet portrait, professional photography', emoji: '🐩', gradient: 'linear-gradient(135deg, #14b8a6, #6366f1)' },
    { id: 't8', name: 'Wish Flight', category: 'Visual Patch', prompt: 'A person waving from an airplane window with beautiful sky, golden sunset clouds, travel adventure theme, dreamy atmosphere, film grain', emoji: '✈️', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },

    // Makeover Studio
    { id: 't9', name: 'Neon Glow', category: 'Makeover Studio', prompt: 'A stylish portrait with neon pink and blue lighting, cyberpunk aesthetic, futuristic makeup, glowing skin, dark moody background, high fashion', emoji: '💜', gradient: 'linear-gradient(135deg, #d946ef, #6366f1)' },
    { id: 't10', name: 'Golden Hour', category: 'Makeover Studio', prompt: 'A beautiful portrait during golden hour sunset, soft warm light on face, natural beauty, flowing hair, dreamy bokeh, magazine cover quality', emoji: '🌅', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
    { id: 't11', name: 'Ice Queen', category: 'Makeover Studio', prompt: 'An ethereal winter portrait, frost and snowflakes, icy blue tones, crystal crown, fantasy ice queen aesthetic, magical atmosphere', emoji: '❄️', gradient: 'linear-gradient(135deg, #67e8f9, #a5b4fc)' },
    { id: 't12', name: 'Retro Vibes', category: 'Makeover Studio', prompt: 'A vintage 70s inspired portrait, retro sunglasses, warm film colors, grainy texture, nostalgic mood, classic fashion photography', emoji: '🕶️', gradient: 'linear-gradient(135deg, #d97706, #92400e)' },

    // The Mix
    { id: 't13', name: 'Happy Birthday', category: 'The Mix', prompt: 'A festive happy birthday celebration scene, colorful balloons, birthday cake with candles, confetti, party decorations, joyful atmosphere', emoji: '🎈', gradient: 'linear-gradient(135deg, #3b82f6, #a855f7)' },
    { id: 't14', name: 'Dream Garden', category: 'The Mix', prompt: 'A magical enchanted garden at twilight, glowing fireflies, blooming flowers, winding path, fantasy atmosphere, ethereal soft lighting', emoji: '🌸', gradient: 'linear-gradient(135deg, #10b981, #6ee7b7)' },
    { id: 't15', name: 'Space Walk', category: 'The Mix', prompt: 'An astronaut floating in deep space, Earth visible below, stars and nebula, cinematic sci-fi scene, dramatic lighting, ultra realistic', emoji: '🚀', gradient: 'linear-gradient(135deg, #1e3a5f, #6366f1)' },
    { id: 't16', name: 'Samurai Spirit', category: 'The Mix', prompt: 'A powerful samurai warrior in traditional armor, cherry blossoms falling, misty mountain backdrop, Japanese painting style, dramatic composition', emoji: '⚔️', gradient: 'linear-gradient(135deg, #dc2626, #7f1d1d)' },
];

const CATEGORIES = ['All', '💕Love Loading', '🔧Visual Patch', 'Makeover Studio', 'The Mix'];

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

    // Template state
    const [showTemplates, setShowTemplates] = useState(false);
    const [templateSearch, setTemplateSearch] = useState('');
    const [templateCategory, setTemplateCategory] = useState('All');
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

    const tabs: Array<{ id: 'image' | 'video' | 'template', label: string, icon: React.ReactNode, disabled?: boolean }> = [
        { id: 'image', label: 'Image', icon: <Image size={14} /> },
        { id: 'video', label: 'Video', icon: <Video size={14} /> },
        { id: 'template', label: 'Template', icon: <Layout size={14} /> },
    ];

    const filteredTemplates = useMemo(() => {
        let items = TEMPLATES;
        if (templateCategory !== 'All') {
            const catName = templateCategory.replace(/^[^\w]*/, ''); // strip leading emoji
            items = items.filter(t => t.category === catName);
        }
        if (templateSearch.trim()) {
            const q = templateSearch.toLowerCase();
            items = items.filter(t =>
                t.name.toLowerCase().includes(q) ||
                t.category.toLowerCase().includes(q) ||
                t.prompt.toLowerCase().includes(q)
            );
        }
        return items;
    }, [templateCategory, templateSearch]);

    const handleCreate = () => {
        if (prompt.trim()) {
            const mode: 'Image' | 'Video' = activeTab === 'video' ? 'Video' : 'Image';
            onCreate(prompt, activeTab, resolution, aspectRatio, mode);
        }
    };

    const handleSelectTemplate = (tmpl: Template) => {
        setSelectedTemplate(tmpl);
        setPrompt(tmpl.prompt);
        setShowTemplates(false);
    };

    const handleClearTemplate = () => {
        setSelectedTemplate(null);
        setPrompt('');
    };

    const handleTabClick = (tabId: 'image' | 'video' | 'template') => {
        setActiveTab(tabId);
        if (tabId === 'template') {
            setShowTemplates(true);
        } else {
            setShowTemplates(false);
        }
    };

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
            <style>{`
                .tmpl-card { transition: all 0.2s; cursor: pointer; }
                .tmpl-card:hover { transform: scale(1.04); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
                .cat-chip { transition: all 0.15s; cursor: pointer; white-space: nowrap; }
                .cat-chip:hover { background: rgba(255,255,255,0.1) !important; }
            `}</style>

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
                        onClick={() => !tab.disabled && handleTabClick(tab.id)}
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
                {/* Template Preview or Sparkle Icon */}
                {selectedTemplate ? (
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{
                            width: 72, height: 72, borderRadius: 12,
                            background: selectedTemplate.gradient,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 32, border: '1px solid rgba(255,255,255,0.15)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        }}>
                            {selectedTemplate.emoji}
                        </div>
                        <button
                            onClick={handleClearTemplate}
                            style={{
                                position: 'absolute', top: -6, right: -6,
                                width: 20, height: 20, borderRadius: '50%',
                                background: '#333', border: '1px solid rgba(255,255,255,0.2)',
                                color: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', fontSize: 10, padding: 0
                            }}
                        >
                            <X size={10} />
                        </button>
                    </div>
                ) : (
                    <>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#888', flexShrink: 0
                        }}>
                            <Sparkles size={20} />
                        </div>

                        {activeTab === 'template' ? (
                            <div
                                onClick={() => setShowTemplates(true)}
                                style={{
                                    width: '48px', height: '48px', borderRadius: '12px',
                                    background: 'rgba(255, 255, 255, 0.03)', border: '1px dashed rgba(255, 255, 255, 0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#666', flexShrink: 0, cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <ImagePlus size={18} />
                            </div>
                        ) : (
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '12px',
                                background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#888', flexShrink: 0
                            }}>
                                <Image size={20} />
                            </div>
                        )}
                    </>
                )}

                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={activeTab === 'template'
                        ? (selectedTemplate ? `Template: ${selectedTemplate.name}. Edit the prompt or click Create...` : 'Select a template or describe your image...')
                        : activeTab === 'video' ? 'Describe any video you want to create...' : 'Describe any image you want to create...'}
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
                    onClick={() => { setShowSettings(!showSettings); setShowTemplates(false); }}
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

                {/* Template Popup */}
                {showTemplates && (
                    <div style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: 0,
                        marginBottom: 12,
                        width: 560,
                        maxHeight: 480,
                        background: 'rgba(20,20,25,0.98)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 16,
                        padding: '20px',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
                        zIndex: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 16,
                        overflowY: 'auto'
                    }}>
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '4px' }}>
                            <div style={{ fontSize: 16, fontWeight: 700, color: '#eee', display: 'flex', alignItems: 'center', gap: 8 }}>
                                Template
                                <span style={{
                                    width: 18, height: 18, borderRadius: '50%',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 11, color: '#888', cursor: 'help'
                                }}>?</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                {/* Search */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    background: 'rgba(255,255,255,0.06)', borderRadius: 10,
                                    padding: '8px 14px', border: '1px solid rgba(255,255,255,0.08)',
                                    width: 220
                                }}>
                                    <input
                                        type="text"
                                        placeholder="Search template..."
                                        value={templateSearch}
                                        onChange={(e) => setTemplateSearch(e.target.value)}
                                        style={{
                                            flex: 1, background: 'none', border: 'none', outline: 'none',
                                            color: '#ccc', fontSize: 12, fontFamily: 'inherit'
                                        }}
                                    />
                                    <Search size={14} style={{ color: '#666' }} />
                                </div>

                                <button
                                    onClick={() => setShowTemplates(false)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        width: 32, height: 32, borderRadius: 8,
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#888', cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                        e.currentTarget.style.color = '#fff';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.color = '#888';
                                    }}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Category Chips */}
                        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    className="cat-chip"
                                    onClick={() => setTemplateCategory(cat)}
                                    style={{
                                        padding: '6px 16px', borderRadius: 20,
                                        border: templateCategory === cat ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.08)',
                                        background: templateCategory === cat ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.03)',
                                        color: templateCategory === cat ? '#fff' : '#999',
                                        fontSize: 12, fontWeight: templateCategory === cat ? 700 : 500,
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Template Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                            {filteredTemplates.map(tmpl => (
                                <div
                                    key={tmpl.id}
                                    className="tmpl-card"
                                    onClick={() => handleSelectTemplate(tmpl)}
                                    style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
                                    }}
                                >
                                    <div style={{
                                        width: '100%', aspectRatio: '3/4', borderRadius: 12,
                                        background: tmpl.gradient,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 36, position: 'relative', overflow: 'hidden',
                                        border: '1px solid rgba(255,255,255,0.08)'
                                    }}>
                                        {tmpl.emoji}
                                        {tmpl.isNew && (
                                            <span style={{
                                                position: 'absolute', top: 6, right: 6,
                                                background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                                                color: '#fff', fontSize: 9, fontWeight: 700,
                                                padding: '2px 8px', borderRadius: 6,
                                                textTransform: 'uppercase', letterSpacing: 0.5
                                            }}>NEW</span>
                                        )}
                                    </div>
                                    <span style={{ fontSize: 11, color: '#ccc', fontWeight: 500, textAlign: 'center', lineHeight: 1.2 }}>
                                        {tmpl.name}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {filteredTemplates.length === 0 && (
                            <div style={{ textAlign: 'center', color: '#555', fontSize: 13, padding: '24px 0' }}>
                                No templates found matching your search
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuickAIInput;
