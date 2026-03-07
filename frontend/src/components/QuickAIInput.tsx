import React, { useState } from 'react';
import { Image, Video, Layout, Settings, Sparkles } from 'lucide-react';

interface QuickAIInputProps {
    onCreate: (prompt: string, type: 'image' | 'video' | 'template') => void;
    loading?: boolean;
}

const QuickAIInput: React.FC<QuickAIInputProps> = ({ onCreate, loading }) => {
    const [activeTab, setActiveTab] = useState<'image' | 'video' | 'template'>('image');
    const [prompt, setPrompt] = useState('');

    const tabs: Array<{ id: 'image' | 'video' | 'template', label: string, icon: React.ReactNode, disabled?: boolean }> = [
        { id: 'image', label: 'Image', icon: <Image size={14} /> },
        { id: 'video', label: 'Video', icon: <Video size={14} />, disabled: true },
        { id: 'template', label: 'Template', icon: <Layout size={14} />, disabled: true },
    ];

    const handleCreate = () => {
        if (prompt.trim()) {
            onCreate(prompt, activeTab);
        }
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
            overflow: 'hidden'
        }}>
            {/* Background Glow */}
            <div style={{
                position: 'absolute',
                top: '0',
                right: '0',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at top right, rgba(236, 72, 153, 0.05), transparent 50%)',
                pointerEvents: 'none'
            }} />

            {/* Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '12px' }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => !tab.disabled && setActiveTab(tab.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 4px',
                            background: 'none',
                            border: 'none',
                            color: tab.disabled ? '#444' : activeTab === tab.id ? '#fff' : '#888',
                            fontSize: '14px',
                            fontWeight: activeTab === tab.id ? '600' : '400',
                            cursor: tab.disabled ? 'not-allowed' : 'pointer',
                            position: 'relative',
                            transition: 'all 0.2s',
                            opacity: tab.disabled ? 0.5 : 1
                        }}
                    >
                        {tab.icon}
                        {tab.label}
                        {tab.disabled && <span style={{ fontSize: '9px', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>Soon</span>}
                        {activeTab === tab.id && (
                            <div style={{
                                position: 'absolute',
                                bottom: '-13px',
                                left: '0',
                                width: '100%',
                                height: '2px',
                                background: '#fff',
                                boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                            }} />
                        )}
                    </button>
                ))}

                <div style={{ flex: 1 }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#666' }}>
                    <Settings size={14} style={{ cursor: 'pointer' }} />
                    <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Sparkles size={14} />
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', position: 'relative' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#888',
                    flexShrink: 0
                }}>
                    <Sparkles size={20} />
                </div>

                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#888',
                    flexShrink: 0
                }}>
                    <Image size={20} />
                </div>

                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Feel the rush of emotion when you least expect it."
                    style={{
                        flex: 1,
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        fontSize: '18px',
                        fontFamily: 'inherit',
                        resize: 'none',
                        minHeight: '60px',
                        padding: '12px 0',
                        outline: 'none',
                        caretColor: '#ec4899'
                    }}
                />

                <button
                    onClick={handleCreate}
                    disabled={loading || !prompt.trim()}
                    style={{
                        alignSelf: 'flex-end',
                        marginBottom: '8px',
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #f87171, #c084fc)',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: '700',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '6px 16px'
                }}>
                    <span style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>360P</span>
                    <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.1)' }} />
                    <span style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>16:9</span>
                    <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.1)' }} />
                    <span style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>5s</span>
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '6px 16px',
                    cursor: 'pointer'
                }}>
                    <Settings size={12} style={{ color: '#888' }} />
                    <span style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>Panel</span>
                    <div style={{ width: '12px', height: '12px', background: 'linear-gradient(135deg, #f87171, #c084fc)', borderRadius: '3px', transform: 'rotate(45deg)', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ transform: 'rotate(-45deg)', fontSize: '6px', color: '#fff' }}>💎</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickAIInput;
