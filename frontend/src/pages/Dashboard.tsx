import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuickAIInput from '@/components/QuickAIInput';
import Sidebar from '@/components/Sidebar';

export default function Dashboard() {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleQuickCreate = (prompt: string, _type?: string, resolution?: string, aspectRatio?: string) => {
        if (!prompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }
        setError('');
        navigate('/dashboard/created', {
            state: {
                prompt,
                resolution: resolution || '720P',
                aspectRatio: aspectRatio || '16:9',
                autoGenerate: true
            }
        });
    };

    return (
        <div style={{ minHeight: '100vh', background: '#000000', fontFamily: "'Geist', sans-serif", color: '#fff', display: 'flex' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: #000; }
                ::-webkit-scrollbar-thumb { background: #222; border-radius: 3px; }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .fade-up { animation: fadeUp 0.5s ease forwards; }
                @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
                .float { animation: float 3s ease-in-out infinite; }
            `}</style>

            <Sidebar />

            <div style={{ marginLeft: 72, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
                {/* Background Glows */}
                <div style={{ position: 'fixed', top: '-10%', right: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(20,184,166,0.06), transparent 60%)', pointerEvents: 'none' }} />
                <div style={{ position: 'fixed', bottom: '-10%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.02), transparent 60%)', pointerEvents: 'none' }} />

                {/* Center Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 200 }}>
                    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center' }}>
                        <div className="float" style={{ fontSize: 64, marginBottom: 8 }}>✨</div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, letterSpacing: '-1px', lineHeight: 1.2 }}>
                            Imagine anything,
                            <span style={{ color: '#14b8a6' }}> create it</span>
                        </div>
                        <div style={{ fontSize: 16, color: '#555', maxWidth: 440, lineHeight: 1.7 }}>
                            Describe what you want to see and our AI will generate it instantly. Any scene, any style, any idea.
                        </div>

                        {/* Quick Suggestions */}
                        <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                            {[
                                'A cyberpunk city at sunset',
                                'Astronaut riding a horse on Mars',
                                'Cozy cabin in snowy mountains',
                                'Underwater coral reef kingdom'
                            ].map(s => (
                                <button
                                    key={s}
                                    onClick={() => handleQuickCreate(s)}
                                    style={{
                                        padding: '8px 16px',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: 20,
                                        color: '#666',
                                        fontSize: 12,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(20,184,166,0.3)';
                                        e.currentTarget.style.color = '#14b8a6';
                                        e.currentTarget.style.background = 'rgba(20,184,166,0.05)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                        e.currentTarget.style.color = '#666';
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        position: 'fixed',
                        bottom: 200,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '10px 20px',
                        background: 'rgba(239,68,68,0.15)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: 10,
                        color: '#fca5a5',
                        fontSize: 13,
                        zIndex: 50
                    }}>
                        {error}
                    </div>
                )}

                {/* Bottom-Docked Input */}
                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 72,
                    right: 0,
                    padding: '24px 40px 32px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 60%, transparent)',
                    zIndex: 50,
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <div style={{ width: '100%', maxWidth: 900 }}>
                        <QuickAIInput
                            loading={false}
                            onCreate={(prompt, type, resolution, aspectRatio) => handleQuickCreate(prompt, type, resolution, aspectRatio)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
