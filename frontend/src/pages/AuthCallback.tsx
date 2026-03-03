import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                navigate('/dashboard');
            } else if (event === 'SIGNED_OUT') {
                navigate('/login');
            }
        });
    }, [navigate]);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Authenticating...</h2>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            </div>
        </div>
    );
}
