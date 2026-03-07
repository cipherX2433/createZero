import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Layers, User, LogOut, Zap } from 'lucide-react';
import { apiService } from '@/services/api.service';

const NAV_ITEMS = [
    { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
    { id: 'created', label: 'Created', icon: Layers, path: '/dashboard/created' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignout = () => {
        apiService.logout();
        window.dispatchEvent(new Event('auth-change'));
        navigate('/login');
    };

    return (
        <div style={{
            width: 72,
            minWidth: 72,
            height: '100vh',
            background: '#0a0a0f',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 20,
            paddingBottom: 20,
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 200
        }}>
            {/* Logo */}
            <div
                onClick={() => navigate('/dashboard')}
                style={{
                    width: 40,
                    height: 40,
                    background: 'white',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 32,
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                }}
            >
                <Zap size={20} fill="black" stroke="black" />
            </div>

            {/* Nav Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                {NAV_ITEMS.map(item => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            title={item.label}
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 12,
                                border: 'none',
                                background: isActive ? 'rgba(20,184,166,0.12)' : 'transparent',
                                color: isActive ? '#14b8a6' : '#555',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                position: 'relative'
                            }}
                            onMouseOver={(e) => {
                                if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                e.currentTarget.style.color = isActive ? '#14b8a6' : '#999';
                            }}
                            onMouseOut={(e) => {
                                if (!isActive) e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = isActive ? '#14b8a6' : '#555';
                            }}
                        >
                            {isActive && (
                                <div style={{
                                    position: 'absolute',
                                    left: -14,
                                    width: 3,
                                    height: 20,
                                    borderRadius: '0 3px 3px 0',
                                    background: '#14b8a6',
                                    boxShadow: '0 0 8px rgba(20,184,166,0.5)'
                                }} />
                            )}
                            <Icon size={20} />
                        </button>
                    );
                })}
            </div>

            {/* Sign Out */}
            <button
                onClick={handleSignout}
                title="Sign out"
                style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    border: 'none',
                    background: 'transparent',
                    color: '#444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
                    e.currentTarget.style.color = '#ef4444';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#444';
                }}
            >
                <LogOut size={18} />
            </button>
        </div>
    );
}
